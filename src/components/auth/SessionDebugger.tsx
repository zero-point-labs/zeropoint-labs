"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";

interface DebugInfo {
  clientSide?: any;
  serverSide?: any;
  refreshResult?: any;
  error?: string;
  timestamp?: string;
}

export default function SessionDebugger() {
  const { testAuthSession, refreshAuthSession } = useAuth();
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({});
  const [isLoading, setIsLoading] = useState(false);

  const testClientSession = async () => {
    setIsLoading(true);
    try {
      const result = await testAuthSession();
      setDebugInfo(prev => ({
        ...prev,
        clientSide: result,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Client session test error:', error);
      setDebugInfo(prev => ({
        ...prev,
        clientSide: { error: error instanceof Error ? error.message : 'Unknown error' },
        timestamp: new Date().toISOString()
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const testServerSession = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/debug');
      const result = await response.json();
      setDebugInfo(prev => ({
        ...prev,
        serverSide: result,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Server session test error:', error);
      setDebugInfo(prev => ({
        ...prev,
        serverSide: { error: error instanceof Error ? error.message : 'Unknown error' },
        timestamp: new Date().toISOString()
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSession = async () => {
    setIsLoading(true);
    try {
      const result = await refreshAuthSession();
      setDebugInfo(prev => ({
        ...prev,
        refreshResult: result,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Session refresh error:', error);
      setDebugInfo(prev => ({
        ...prev,
        refreshResult: { error: error instanceof Error ? error.message : 'Unknown error' },
        timestamp: new Date().toISOString()
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const testBothSessions = async () => {
    setIsLoading(true);
    try {
      // Test client-side first
      const clientResult = await testAuthSession();
      
      // Then test server-side
      const serverResponse = await fetch('/api/auth/debug');
      const serverResult = await serverResponse.json();
      
      setDebugInfo({
        clientSide: clientResult,
        serverSide: serverResult,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Session test error:', error);
      setDebugInfo({
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 mt-8">
      <h3 className="text-lg font-medium mb-4">🔧 Session Debugger</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Use this tool to debug authentication issues and verify OAuth session establishment.
      </p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <Button 
          onClick={testClientSession} 
          disabled={isLoading}
          variant="outline" 
          size="sm"
        >
          Test Client Session
        </Button>
        <Button 
          onClick={testServerSession} 
          disabled={isLoading}
          variant="outline" 
          size="sm"
        >
          Test Server Session
        </Button>
        <Button 
          onClick={testBothSessions} 
          disabled={isLoading}
          variant="outline" 
          size="sm"
        >
          Test Both
        </Button>
        <Button 
          onClick={refreshSession} 
          disabled={isLoading}
          variant="outline" 
          size="sm"
        >
          Refresh Session
        </Button>
      </div>

      {isLoading && (
        <div className="text-sm text-muted-foreground mb-4">
          Testing session...
        </div>
      )}

      {debugInfo.timestamp && (
        <div className="space-y-4">
          <div className="text-xs text-muted-foreground">
            Last updated: {debugInfo.timestamp}
          </div>
          
          {debugInfo.clientSide && (
            <div>
              <h4 className="font-medium mb-2">Client-side Session:</h4>
              <pre className="bg-muted/50 p-3 rounded text-xs overflow-auto">
                {JSON.stringify(debugInfo.clientSide, null, 2)}
              </pre>
            </div>
          )}
          
          {debugInfo.serverSide && (
            <div>
              <h4 className="font-medium mb-2">Server-side Session:</h4>
              <pre className="bg-muted/50 p-3 rounded text-xs overflow-auto">
                {JSON.stringify(debugInfo.serverSide, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </Card>
  );
} 