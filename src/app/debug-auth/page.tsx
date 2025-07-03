"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { 
  getCurrentUser, 
  loginWithGoogle, 
  ensureSession, 
  testSession, 
  checkAppwriteCookies 
} from "@/lib/appwrite";

interface DebugData {
  urlParams?: any;
  browserCookies?: any;
  clientSession?: any;
  serverSession?: any;
  appwriteTest?: any;
  timestamp?: string;
  error?: string;
}

export default function AuthDebugPage() {
  const { user } = useAuth();
  const [debugData, setDebugData] = useState<DebugData>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    runFullDebug();
  }, []);

  const runFullDebug = async () => {
    setIsLoading(true);
    
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.replace('#', ''));
      
      const browserCookies = checkAppwriteCookies();
      const clientSession = await testSession();
      
      let serverSession = null;
      try {
        const response = await fetch('/api/auth/debug');
        serverSession = await response.json();
      } catch (error) {
        serverSession = { error: 'Failed to fetch server session' };
      }
      
      let appwriteTest = null;
      const hasOAuthParams = urlParams.has('userId') || urlParams.has('secret') || 
                            hashParams.has('access_token') || urlParams.has('code');
      
      if (hasOAuthParams) {
        console.log('OAuth parameters detected, trying to establish session...');
        appwriteTest = await ensureSession();
      }
      
      const debugInfo: DebugData = {
        urlParams: {
          search: Object.fromEntries(urlParams.entries()),
          hash: Object.fromEntries(hashParams.entries()),
          hasOAuthParams,
          fullUrl: window.location.href
        },
        browserCookies,
        clientSession,
        serverSession,
        appwriteTest: appwriteTest ? { 
          success: true, 
          userId: appwriteTest.$id,
          email: appwriteTest.email 
        } : { success: false },
        timestamp: new Date().toISOString()
      };
      
      setDebugData(debugInfo);
      console.log('Full debug data:', debugInfo);
      
    } catch (error) {
      console.error('Debug error:', error);
      setDebugData({
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testGoogleOAuth = async () => {
    try {
      console.log('Testing Google OAuth...');
      await loginWithGoogle();
    } catch (error) {
      console.error('Google OAuth test error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">🔍 Authentication Debug Center</h1>
          <p className="text-muted-foreground">
            Comprehensive debugging tool for Appwrite Google OAuth session issues
          </p>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Current Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/20 rounded-lg">
              <h3 className="font-medium mb-2">Auth Context</h3>
              <p className="text-sm">
                Status: {user ? '✅ Logged In' : '❌ Not Logged In'}
              </p>
              {user && (
                <p className="text-xs text-muted-foreground mt-1">
                  {user.email}
                </p>
              )}
            </div>
            <div className="p-4 bg-muted/20 rounded-lg">
              <h3 className="font-medium mb-2">URL Parameters</h3>
              <p className="text-sm">
                {debugData.urlParams?.hasOAuthParams ? '✅ OAuth Params Present' : '❌ No OAuth Params'}
              </p>
            </div>
            <div className="p-4 bg-muted/20 rounded-lg">
              <h3 className="font-medium mb-2">Session Cookie</h3>
              <p className="text-sm">
                {debugData.browserCookies?.hasSessionCookie ? '✅ Cookie Found' : '❌ No Cookie'}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Debug Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Button onClick={runFullDebug} disabled={isLoading}>
              🔄 Run Full Debug
            </Button>
            <Button onClick={testGoogleOAuth} variant="outline">
              🔐 Test Google OAuth
            </Button>
          </div>
        </Card>

        {debugData.timestamp && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Debug Results</h2>
            <p className="text-xs text-muted-foreground mb-4">
              Last updated: {debugData.timestamp}
            </p>
            
            {debugData.urlParams && (
              <div className="mb-6">
                <h3 className="font-medium mb-2">🔗 URL Analysis</h3>
                <div className="bg-muted/30 p-3 rounded text-sm space-y-2">
                  <div>
                    <strong>Full URL:</strong> {debugData.urlParams.fullUrl}
                  </div>
                  <div>
                    <strong>Has OAuth Params:</strong> {debugData.urlParams.hasOAuthParams ? 'Yes' : 'No'}
                  </div>
                  {Object.keys(debugData.urlParams.search).length > 0 && (
                    <div>
                      <strong>Search Params:</strong>
                      <pre className="mt-1 text-xs">{JSON.stringify(debugData.urlParams.search, null, 2)}</pre>
                    </div>
                  )}
                </div>
              </div>
            )}

            {debugData.browserCookies && (
              <div className="mb-6">
                <h3 className="font-medium mb-2">🍪 Browser Cookies</h3>
                <div className="bg-muted/30 p-3 rounded text-sm">
                  <div className="mb-2">
                    <strong>Has Appwrite Session Cookie:</strong> {debugData.browserCookies.hasSessionCookie ? 'Yes ✅' : 'No ❌'}
                  </div>
                  <div>
                    <strong>All Cookies ({debugData.browserCookies.allCookies?.length || 0}):</strong>
                    <pre className="mt-1 text-xs">{JSON.stringify(debugData.browserCookies.allCookies, null, 2)}</pre>
                  </div>
                </div>
              </div>
            )}

            {debugData.clientSession && (
              <div className="mb-6">
                <h3 className="font-medium mb-2">💻 Client-side Session</h3>
                <pre className="bg-muted/30 p-3 rounded text-xs overflow-auto">
                  {JSON.stringify(debugData.clientSession, null, 2)}
                </pre>
              </div>
            )}

            {debugData.serverSession && (
              <div className="mb-6">
                <h3 className="font-medium mb-2">🖥️ Server-side Session</h3>
                <pre className="bg-muted/30 p-3 rounded text-xs overflow-auto">
                  {JSON.stringify(debugData.serverSession, null, 2)}
                </pre>
              </div>
            )}
          </Card>
        )}

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">⚙️ Configuration Checklist</h2>
          <div className="space-y-2 text-sm">
            <p>✅ Project ID: 6861736a0007a58bac63</p>
            <p>✅ Endpoint: https://cloud.appwrite.io/v1</p>
            <p>🔍 Check in Appwrite Console → Auth → Settings:</p>
            <ul className="ml-4 space-y-1 text-xs text-muted-foreground">
              <li>• Google OAuth Provider enabled</li>
              <li>• Success URL: {typeof window !== 'undefined' ? window.location.origin : ''}/dashboard</li>
              <li>• Failure URL: {typeof window !== 'undefined' ? window.location.origin : ''}/login</li>
              <li>• Domain whitelist includes your domain</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
} 