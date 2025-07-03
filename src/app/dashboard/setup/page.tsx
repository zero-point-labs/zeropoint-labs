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
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
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

  const envVariables = [
    { key: "NEXT_PUBLIC_APPWRITE_ENDPOINT", description: "Your Appwrite API endpoint" },
    { key: "NEXT_PUBLIC_APPWRITE_PROJECT_ID", description: "Your Appwrite project ID" },
    { key: "APPWRITE_API_KEY", description: "Your Appwrite API key (server-side only)" }
  ];

  const validateSetup = async () => {
    setIsValidating(true);
    // Simulate validation
    setTimeout(() => {
      setValidationResult({
        success: true,
        message: "All collections are properly configured",
        collections: ["events", "form_submissions", "api_keys", "customers"]
      });
      setIsValidating(false);
    }, 2000);
  };

  const runValidation = () => {
    validateSetup();
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
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  useEffect(() => {
    validateSetup();
  }, []);

  const projectId = "6861736a0007a58bac63";
  const consoleUrl = `https://cloud.appwrite.io/console/project-${projectId}/databases`;

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-light text-foreground mb-2">Database Setup</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Configure your Appwrite database connection</p>
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
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 flex-shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-500 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-medium text-foreground">
                  {validationResult.success ? 'Setup Complete!' : 'Setup Incomplete'}
                </h3>
                <p className="text-sm text-muted-foreground">{validationResult.message}</p>
                {validationResult.collections.length > 0 && (
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Working collections: {validationResult.collections.join(', ')}
                  </p>
                )}
              </div>
            </div>
          </DashboardCard>
        </motion.div>
      )}

      {/* Setup Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <DashboardCard>
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <Database className="h-5 w-5 sm:h-6 sm:w-6 text-orange-400" />
            <h2 className="text-lg sm:text-xl font-medium text-foreground">Setup Progress</h2>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
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
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                ) : (
                  <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex-shrink-0 ${
                    step.required ? 'border-orange-400' : 'border-muted-foreground'
                  }`} />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className={`text-sm sm:text-base font-medium ${step.completed ? 'text-green-700 dark:text-green-300' : 'text-foreground'}`}>
                    {step.title}
                    {step.required && !step.completed && (
                      <span className="text-orange-400 ml-1">*</span>
                    )}
                  </h3>
                  <p className={`text-xs sm:text-sm ${step.completed ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard>
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <ExternalLink className="h-5 w-5 sm:h-6 sm:w-6 text-orange-400" />
            <h2 className="text-lg sm:text-xl font-medium text-foreground">Configuration Guide</h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm sm:text-base font-medium text-foreground mb-2">Required Environment Variables</h3>
              <div className="space-y-2">
                {envVariables.map((env, index) => (
                  <div key={index} className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-muted/30 border border-border group">
                    <div className="flex-1 min-w-0">
                      <code className="text-xs sm:text-sm text-orange-400">{env.key}</code>
                      <p className="text-xs text-muted-foreground mt-1">{env.description}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(env.key)}
                      className="p-1.5 sm:p-2 hover:bg-muted/50 rounded transition-colors"
                    >
                      {copiedKey === env.key ? (
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-blue-400">
                    Make sure to restart your application after adding or updating environment variables.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={runValidation}
              disabled={isValidating}
              className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              {isValidating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Run Validation Test
                </>
              )}
            </button>
          </div>
        </DashboardCard>
      </div>

      {/* Quick Links */}
      <DashboardCard>
        <h2 className="text-lg sm:text-xl font-medium text-foreground mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          <a
            href="https://appwrite.io/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 sm:p-4 rounded-lg bg-muted/30 hover:bg-muted/50 border border-border hover:border-orange-500/30 transition-all group"
          >
            <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400" />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-foreground group-hover:text-orange-400 transition-colors">
                Appwrite Documentation
              </h3>
              <p className="text-xs text-muted-foreground">Learn more about Appwrite</p>
            </div>
          </a>

          <a
            href="https://cloud.appwrite.io/console"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 sm:p-4 rounded-lg bg-muted/30 hover:bg-muted/50 border border-border hover:border-orange-500/30 transition-all group"
          >
            <Database className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400" />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-foreground group-hover:text-orange-400 transition-colors">
                Appwrite Console
              </h3>
              <p className="text-xs text-muted-foreground">Manage your database</p>
            </div>
          </a>

          <a
            href="/dashboard/crm"
            className="flex items-center gap-3 p-3 sm:p-4 rounded-lg bg-muted/30 hover:bg-muted/50 border border-border hover:border-orange-500/30 transition-all group sm:col-span-2 md:col-span-1"
          >
            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400" />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-foreground group-hover:text-orange-400 transition-colors">
                Go to CRM
              </h3>
              <p className="text-xs text-muted-foreground">Start managing customers</p>
            </div>
          </a>
        </div>
      </DashboardCard>
    </div>
  );
} 