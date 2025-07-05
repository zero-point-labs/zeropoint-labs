'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { createWebsite, getWebsites, checkWebsiteConnection } from '@/lib/appwrite';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, Check, AlertCircle, Globe, Code, Activity } from 'lucide-react';

export default function SetupPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [domain, setDomain] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [websites, setWebsites] = useState<any[]>([]);
  const [selectedWebsite, setSelectedWebsite] = useState<any>(null);
  const [connectionStatus, setConnectionStatus] = useState<any>(null);
  const [isCheckingConnection, setIsCheckingConnection] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Load user's websites
  useEffect(() => {
    if (user) {
      loadWebsites();
    }
  }, [user]);

  const loadWebsites = async () => {
    try {
      const userWebsites = await getWebsites(user!.$id);
      setWebsites(userWebsites);
      if (userWebsites.length > 0) {
        setSelectedWebsite(userWebsites[0]);
      }
    } catch (error) {
      console.error('Error loading websites:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    setError('');

    try {
      // Validate domain format
      const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
      if (!domainRegex.test(domain)) {
        throw new Error('Please enter a valid domain name (e.g., example.com)');
      }

      // Create website
      const website = await createWebsite({
        domain: domain.toLowerCase(),
        userId: user.$id,
        verified: true // Auto-verify for now
      });

      // Reload websites
      await loadWebsites();
      setSelectedWebsite(website);
      setDomain('');
    } catch (error: any) {
      setError(error.message || 'Failed to add website');
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkConnection = async () => {
    if (!selectedWebsite || !user) return;

    setIsCheckingConnection(true);
    try {
      const status = await checkWebsiteConnection(user.$id, selectedWebsite.domain);
      setConnectionStatus(status);
    } catch (error) {
      console.error('Error checking connection:', error);
      setConnectionStatus({ isConnected: false, lastEventTime: null, eventCount: 0 });
    } finally {
      setIsCheckingConnection(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTrackingScript = () => {
    if (!selectedWebsite) return '';
    
    return `<script src="https://zeropoint-labs.com/tracker.js" data-website="${selectedWebsite.domain}" async></script>`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Analytics Setup</h1>
        <p className="text-gray-600">Configure website tracking for your domains</p>
      </div>

      <div className="grid gap-6">
        {/* Add Website Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Add Website
            </CardTitle>
            <CardDescription>
              Add a new website to track analytics data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="domain">Domain Name</Label>
                <Input
                  id="domain"
                  type="text"
                  placeholder="example.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter your domain without http:// or https://
                </p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Website'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Existing Websites */}
        {websites.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Your Websites</CardTitle>
              <CardDescription>
                Select a website to view tracking instructions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {websites.map((website) => (
                  <div
                    key={website.$id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedWebsite?.$id === website.$id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedWebsite(website)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{website.domain}</p>
                        <p className="text-sm text-gray-500">
                          Added {new Date(website.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {website.verified && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tracking Instructions */}
        {selectedWebsite && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Tracking Script for {selectedWebsite.domain}
              </CardTitle>
              <CardDescription>
                Add this script to your website to start tracking analytics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>HTML Script Tag</Label>
                <div className="relative">
                  <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                    <code>{getTrackingScript()}</code>
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(getTrackingScript())}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <Label>Installation Instructions</Label>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>Copy the script tag above</li>
                    <li>Paste it in the &lt;head&gt; section of your website</li>
                    <li>For Next.js, add it to your _app.tsx or layout.tsx file</li>
                    <li>Deploy your changes</li>
                    <li>Click "Check Connection" below to verify tracking is working</li>
                  </ol>
                </div>
              </div>

              {/* Connection Check */}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Connection Status
                    </h3>
                    <p className="text-sm text-gray-500">
                      Check if your website is sending analytics data
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={checkConnection}
                    disabled={isCheckingConnection}
                  >
                    {isCheckingConnection ? 'Checking...' : 'Check Connection'}
                  </Button>
                </div>

                {connectionStatus && (
                  <Alert variant={connectionStatus.isConnected ? 'default' : 'destructive'}>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {connectionStatus.isConnected ? (
                        <>
                          ✅ Connection successful! Last event received{' '}
                          {connectionStatus.lastEventTime && 
                            new Date(connectionStatus.lastEventTime).toLocaleString()
                          }
                        </>
                      ) : (
                        <>
                          ❌ No recent events detected. Make sure the tracking script is installed and try visiting your website.
                        </>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Next Steps */}
              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Next Steps</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Once tracking is working, you can view your analytics dashboard.
                </p>
                <Button onClick={() => router.push('/dashboard')}>
                  Go to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 