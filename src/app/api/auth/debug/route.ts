import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('a_session_console') || 
                         cookieStore.get('a_session') ||
                         cookieStore.get('a_session_6861736a0007a58bac63'); // Project-specific session
    
    // Get all cookies for debugging
    const allCookies = cookieStore.getAll();
    
    const debugInfo = {
      hasSessionCookie: !!sessionCookie,
      sessionCookieName: sessionCookie?.name || null,
      sessionCookieValue: sessionCookie?.value ? 'present' : null,
      allCookies: allCookies.map((cookie: any) => ({
        name: cookie.name,
        value: cookie.value ? 'present' : null,
        hasValue: !!cookie.value
      })),
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      origin: request.headers.get('origin'),
      referer: request.headers.get('referer')
    };
    
    return NextResponse.json(debugInfo);
  } catch (error) {
    console.error('Auth debug API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch server session data',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
} 