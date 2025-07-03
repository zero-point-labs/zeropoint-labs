"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { 
  Database, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  ExternalLink,
  Copy,
  Play,
  AlertTriangle
} from "lucide-react";

interface SetupStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
}

interface ValidationResult {
  success: boolean;
  message: string;
  collections: string[];
  details?: any;
}

export default function SetupPage() {
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [setupSteps, setSetupSteps] = useState<SetupStep[]>([
    {
      id: "database",
      title: "Create Analytics Database",
      description: "Create a database with ID 'analytics' in Appwrite Console",
      completed: false,
      required: true
    },
    {
      id: "events",
      title: "Create Events Collection",
      description: "Create collection with ID 'events' and all required attributes",
      completed: false,
      required: true
    },
    {
      id: "forms",
      title: "Create Form Submissions Collection",
      description: "Create collection with ID 'form_submissions' and all required attributes",
      completed: false,
      required: true
    },
    {
      id: "api_keys",
      title: "Create API Keys Collection",
      description: "Create collection with ID 'api_keys' and all required attributes",
      completed: false,
      required: true
    },
    {
      id: "permissions",
      title: "Set Permissions",
      description: "Set 'Any' permissions for all CRUD operations on all collections",
      completed: false,
      required: true
    },
    {
      id: "indexes",
      title: "Create Indexes",
      description: "Add performance indexes for timestamp and other key fields",
      completed: false,
      required: false
    }
  ]);

  const validateSetup = async () => {
    setIsValidating(true);
    try {
      // Test the analytics endpoints
      const response = await fetch('/api/analytics/data');
      const result = await response.json();
      
      if (result.success) {
        setValidationResult({
          success: true,
          message: "All collections are accessible and working!",
          collections: ["events", "form_submissions", "api_keys"]
        });
        
        // Update setup steps
        setSetupSteps(prev => prev.map(step => ({ ...step, completed: true })));
        
      } else {
        setValidationResult({
          success: false,
          message: result.error || "Setup validation failed",
          collections: []
        });
      }
    } catch (error: any) {
      setValidationResult({
        success: false,
        message: error.message || "Failed to validate setup",
        collections: []
      });
    } finally {
      setIsValidating(false);
    }
  };

  const testAnalyticsTracking = async () => {
    try {
      const testEvent = {
        event_type: 'test',
        page_url: 'https://example.com/setup-test',
        page_title: 'Setup Test Page',
        referrer: '',
        session_id: 'setup_test_' + Date.now(),
        user_id: 'setup_test_user',
        event_data: { test: true, setup: 'validation' }
      };
      
      const response = await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testEvent)
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('✅ Test tracking successful! Event ID: ' + result.id);
      } else {
        alert('❌ Test tracking failed: ' + result.error);
      }
    } catch (error: any) {
      alert('❌ Test failed: ' + error.message);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  useEffect(() => {
    validateSetup();
  }, []);

  const projectId = "6861736a0007a58bac63";
  const consoleUrl = `https://cloud.appwrite.io/console/project-${projectId}/databases`;

  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-foreground mb-2">Analytics Setup</h1>
          <p className="text-muted-foreground">
            Configure your Appwrite database for analytics tracking
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={validateSetup}
            disabled={isValidating}
            className="px-4 py-2 rounded-lg bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 border border-border hover:border-border/70 flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isValidating ? 'animate-spin' : ''}`} />
            Validate Setup
          </button>
          <a 
            href={consoleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition-all duration-200 flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Open Appwrite Console
          </a>
        </div>
      </div>

      {/* Validation Status */}
      {validationResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <DashboardCard className={`p-4 border-l-4 ${
            validationResult.success 
              ? 'border-l-green-500 bg-green-50 dark:bg-green-950/20' 
              : 'border-l-red-500 bg-red-50 dark:bg-red-950/20'
          }`}>
            <div className="flex items-center gap-3">
              {validationResult.success ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : (
                <XCircle className="h-6 w-6 text-red-500" />
              )}
              <div>
                <h3 className="text-lg font-medium text-foreground">
                  {validationResult.success ? 'Setup Complete!' : 'Setup Incomplete'}
                </h3>
                <p className="text-muted-foreground">{validationResult.message}</p>
                {validationResult.collections.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Working collections: {validationResult.collections.join(', ')}
                  </p>
                )}
              </div>
            </div>
          </DashboardCard>
        </motion.div>
      )}

      {/* Setup Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard>
          <div className="flex items-center gap-3 mb-6">
            <Database className="h-6 w-6 text-orange-400" />
            <h2 className="text-xl font-medium text-foreground">Setup Progress</h2>
          </div>
          
          <div className="space-y-4">
            {setupSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  step.completed 
                    ? 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800' 
                    : 'bg-muted/30 hover:bg-muted/50'
                }`}
              >
                {step.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                ) : (
                  <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${
                    step.required ? 'border-orange-400' : 'border-muted-foreground'
                  }`} />
                )}
                <div className="flex-1">
                  <h3 className={`font-medium ${step.completed ? 'text-green-700 dark:text-green-300' : 'text-foreground'}`}>
                    {step.title}
                    {step.required && !step.completed && (
                      <span className="text-orange-400 ml-1">*</span>
                    )}
                  </h3>
                  <p className={`text-sm ${step.completed ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard>
          <h2 className="text-xl font-medium text-foreground mb-6">Setup Instructions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-foreground mb-2">1. Open Appwrite Console</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Go to your Appwrite project console and navigate to the Databases section.
              </p>
              <div className="flex items-center gap-2 p-2 bg-muted/30 rounded text-sm font-mono">
                <span className="text-muted-foreground">Project ID:</span>
                <span className="text-foreground">{projectId}</span>
                <button 
                  onClick={() => copyToClipboard(projectId)}
                  className="p-1 hover:bg-muted rounded"
                >
                  <Copy className="h-3 w-3" />
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-foreground mb-2">2. Create Database</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Click "Create Database"</li>
                <li>Database ID: <code className="bg-muted px-1 rounded">analytics</code></li>
                <li>Name: Analytics Database</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-foreground mb-2">3. Create Collections</h3>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-muted/30 rounded">
                  <strong>events</strong> - For page views, clicks, and custom events
                </div>
                <div className="p-2 bg-muted/30 rounded">
                  <strong>form_submissions</strong> - For contact forms and submissions
                </div>
                <div className="p-2 bg-muted/30 rounded">
                  <strong>api_keys</strong> - For API key management
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-foreground mb-2">4. Set Permissions</h3>
              <p className="text-sm text-muted-foreground">
                For each collection, set all permissions (Read, Create, Update, Delete) to <strong>"Any"</strong> in the Settings tab.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-foreground mb-2">5. Test Setup</h3>
              <button 
                onClick={testAnalyticsTracking}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                Run Test Event
              </button>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Detailed Attributes Guide */}
      <DashboardCard>
        <h2 className="text-xl font-medium text-foreground mb-6">Collection Attributes Reference</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
              📊 Events Collection
            </h3>
            <div className="space-y-1 text-sm">
              <div>event_type (String, 50, required)</div>
              <div>page_url (String, 2000, required)</div>
              <div>page_title (String, 500, optional)</div>
              <div>referrer (String, 2000, optional)</div>
              <div>user_agent (String, 1000, required)</div>
              <div>ip_address (String, 45, required)</div>
              <div>session_id (String, 100, required)</div>
              <div>user_id (String, 100, optional)</div>
              <div>event_data (String, 5000, optional)</div>
              <div>timestamp (DateTime, required)</div>
              <div>domain (String, 255, required)</div>
              <div>device_type (String, 20, optional)</div>
              <div>browser (String, 50, optional)</div>
              <div>os (String, 50, optional)</div>
              <div>country (String, 100, optional)</div>
              <div>city (String, 100, optional)</div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
              📝 Form Submissions
            </h3>
            <div className="space-y-1 text-sm">
              <div>form_name (String, 255, required)</div>
              <div>form_id (String, 100, optional)</div>
              <div>fields (String, 10000, required)</div>
              <div>page_url (String, 2000, required)</div>
              <div>user_agent (String, 1000, required)</div>
              <div>ip_address (String, 45, required)</div>
              <div>session_id (String, 100, required)</div>
              <div>user_id (String, 100, optional)</div>
              <div>timestamp (DateTime, required)</div>
              <div>status (String, 20, required)</div>
              <div>priority (String, 10, required)</div>
              <div>source (String, 255, required)</div>
              <div>referrer (String, 2000, optional)</div>
              <div>utm_params (String, 1000, optional)</div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
              🔑 API Keys
            </h3>
            <div className="space-y-1 text-sm">
              <div>key_name (String, 255, required)</div>
              <div>api_key (String, 64, required)</div>
              <div>domain (String, 255, required)</div>
              <div>user_id (String, 100, required)</div>
              <div>created_at (DateTime, required)</div>
              <div>last_used (DateTime, optional)</div>
              <div>is_active (Boolean, required)</div>
              <div>usage_count (Integer, required)</div>
            </div>
          </div>
        </div>
      </DashboardCard>

      {/* Warning Notice */}
      {!validationResult?.success && (
        <DashboardCard className="border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-950/20">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <div>
              <h3 className="font-medium text-foreground">Manual Setup Required</h3>
              <p className="text-muted-foreground text-sm">
                Due to Appwrite SDK limitations, database and collection creation must be done manually through the Appwrite Console. 
                Follow the instructions above and click "Validate Setup" when complete.
              </p>
            </div>
          </div>
        </DashboardCard>
      )}
    </div>
  );
} 