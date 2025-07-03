'use client';

import { useState } from 'react';
import { client, account } from '@/lib/appwrite';

export default function TestAppwrite() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const sendPing = async () => {
    setLoading(true);
    setResult('');
    
    try {
      // Test the connection by trying to get account (this tests the connection)
      // Even if it fails due to no session, it means the connection works
      try {
        await account.get();
        setResult(`✅ Connection successful! 
        Endpoint: ${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}
        Project ID: ${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}
        Status: Connected (User logged in)`);
      } catch (accountError: any) {
        // If we get a 401 (unauthorized), it means connection is working but user is not logged in
        if (accountError.code === 401) {
          setResult(`✅ Connection successful! 
          Endpoint: ${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}
          Project ID: ${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}
          Status: Connected (No user session)`);
        } else {
          throw accountError;
        }
      }
    } catch (error: any) {
      setResult(`❌ Connection failed: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Test Appwrite Connection
        </h1>
        
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            <p><strong>Endpoint:</strong> {process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}</p>
            <p><strong>Project ID:</strong> {process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}</p>
          </div>
          
          <button
            onClick={sendPing}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {loading ? 'Testing connection...' : 'Send a ping'}
          </button>
          
          {result && (
            <div className={`p-4 rounded-lg text-sm whitespace-pre-line ${
              result.includes('✅') 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {result}
            </div>
          )}
        </div>
        
        <div className="mt-6 text-center">
          <a 
            href="/"
            className="text-blue-500 hover:text-blue-600 text-sm"
          >
            ← Back to home
          </a>
        </div>
      </div>
    </div>
  );
} 