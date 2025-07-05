import { NextRequest, NextResponse } from 'next/server';
import { databases, DATABASE_ID } from '@/lib/appwrite';
import { Query } from 'appwrite';

// Collection IDs for analytics
const ANALYTICS_COLLECTIONS = {
  WEBSITES: 'websites',
  EVENTS: 'events'
};

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // Max requests per window

interface TrackingEvent {
  website: string;
  event: string;
  path: string;
  timestamp: string;
  sessionId: string;
  metadata: {
    userAgent?: string;
    language?: string;
    screen?: { width: number; height: number };
    viewport?: { width: number; height: number };
    timezone?: string;
    url?: string;
    referrer?: string;
    title?: string;
    [key: string]: any;
  };
}

interface TrackingRequest {
  events: TrackingEvent[];
}

// Helper function to get client IP
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

// Rate limiting function
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;
  
  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, []);
  }
  
  const requests = rateLimitStore.get(ip)!;
  
  // Remove old requests outside the window
  const recentRequests = requests.filter((time: number) => time > windowStart);
  rateLimitStore.set(ip, recentRequests);
  
  // Check if limit exceeded
  if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }
  
  // Add current request
  recentRequests.push(now);
  rateLimitStore.set(ip, recentRequests);
  
  return false;
}

// Helper function to hash IP for privacy
function hashIP(ip: string): string {
  // Simple hash function for IP privacy
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
}

// Helper function to validate website domain
async function validateWebsite(domain: string): Promise<{ isValid: boolean; userId?: string }> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      ANALYTICS_COLLECTIONS.WEBSITES,
      [
        Query.equal('domain', domain),
        Query.equal('verified', true)
      ]
    );
    
    if (response.documents.length > 0) {
      return {
        isValid: true,
        userId: response.documents[0].userId
      };
    }
    
    return { isValid: false };
  } catch (error) {
    console.error('Error validating website:', error);
    return { isValid: false };
  }
}

// Helper function to store events
async function storeEvents(events: TrackingEvent[], userId: string, hashedIP: string): Promise<void> {
  const promises = events.map(event => {
    return databases.createDocument(
      DATABASE_ID,
      ANALYTICS_COLLECTIONS.EVENTS,
      'unique()',
      {
        userId,
        website: event.website,
        eventType: event.event,
        path: event.path,
        timestamp: event.timestamp,
        sessionId: event.sessionId,
        hashedIP,
        metadata: JSON.stringify(event.metadata),
        createdAt: new Date().toISOString()
      }
    );
  });
  
  await Promise.all(promises);
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(request);
    
    // Check rate limiting
    if (isRateLimited(clientIP)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }
    
    // Parse request body
    let body: TrackingRequest;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON' },
        { status: 400 }
      );
    }
    
    // Validate request structure
    if (!body.events || !Array.isArray(body.events) || body.events.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request: events array required' },
        { status: 400 }
      );
    }
    
    // Validate each event
    for (const event of body.events) {
      if (!event.website || !event.event || !event.path || !event.timestamp) {
        return NextResponse.json(
          { error: 'Invalid event: missing required fields' },
          { status: 400 }
        );
      }
    }
    
    // Get the website domain from the first event (all events should be from same website)
    const websiteDomain = body.events[0].website;
    
    // Validate website domain
    const validation = await validateWebsite(websiteDomain);
    if (!validation.isValid || !validation.userId) {
      return NextResponse.json(
        { error: 'Invalid or unverified website domain' },
        { status: 403 }
      );
    }
    
    // Hash IP for privacy
    const hashedIP = hashIP(clientIP);
    
    // Store events in database
    await storeEvents(body.events, validation.userId, hashedIP);
    
    // Return success response
    return NextResponse.json({
      success: true,
      eventsProcessed: body.events.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Analytics tracking error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle preflight requests for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }
  });
} 