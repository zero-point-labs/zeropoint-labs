import { NextResponse } from 'next/server';
import { validateOpenAIConfig } from '@/services/openai';

/**
 * GET /api/health
 * Health check endpoint for monitoring
 */
export async function GET() {
  try {
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        openai: validateOpenAIConfig(),
        appwrite: {
          endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'not configured',
          project: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'not configured',
          configured: !!(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT && process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
        }
      },
      version: process.env.npm_package_version || '0.1.0',
      environment: process.env.NODE_ENV || 'development'
    };

    return NextResponse.json(health);
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Health check failed'
      },
      { status: 500 }
    );
  }
}
