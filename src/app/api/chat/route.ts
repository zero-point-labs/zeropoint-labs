import { NextRequest, NextResponse } from 'next/server';
import { processMessage, initializeChatbot } from '@/services/chatbot';
import { validateOpenAIConfig } from '@/services/openai';

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requests per minute per IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

/**
 * Rate limiting middleware
 */
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    // Reset or create new limit
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  userLimit.count++;
  return true;
}

/**
 * Get client IP address
 */
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

/**
 * Validate request body
 */
function validateRequestBody(body: any): { isValid: boolean; error?: string } {
  if (!body) {
    return { isValid: false, error: 'Request body is required' };
  }

  if (!body.message || typeof body.message !== 'string') {
    return { isValid: false, error: 'Message is required and must be a string' };
  }

  if (body.message.trim().length === 0) {
    return { isValid: false, error: 'Message cannot be empty' };
  }

  if (body.message.length > 1000) {
    return { isValid: false, error: 'Message is too long (max 1000 characters)' };
  }

  if (body.sessionId && typeof body.sessionId !== 'string') {
    return { isValid: false, error: 'Session ID must be a string' };
  }

  return { isValid: true };
}

/**
 * Generate session ID if not provided
 */
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * POST /api/chat
 * Main chat endpoint for processing user messages
 */
export async function POST(request: NextRequest) {
  try {
    // Check OpenAI configuration
    if (!validateOpenAIConfig()) {
      console.error('OpenAI API key not configured');
      return NextResponse.json(
        { error: 'Chat service is temporarily unavailable' },
        { status: 503 }
      );
    }

    // Get client IP for rate limiting
    const clientIP = getClientIP(request);

    // Check rate limit
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment before trying again.' },
        { status: 429 }
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Validate request body
    const validation = validateRequestBody(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Extract message and session ID
    const { message, sessionId: providedSessionId, streaming = true } = body;
    const sessionId = providedSessionId || generateSessionId();

    // Initialize chatbot if needed
    await initializeChatbot();

    // Check if streaming is requested
    if (streaming) {
      // Return streaming response
      const encoder = new TextEncoder();
      
      const stream = new ReadableStream({
        async start(controller) {
          try {
            await processMessage(message, sessionId, (chunk) => {
              const data = JSON.stringify({
                content: chunk.content,
                finished: chunk.finished,
                sessionId
              });
              
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
              
              if (chunk.finished) {
                controller.close();
              }
            });
          } catch (error) {
            console.error('Streaming error:', error);
            const errorData = JSON.stringify({
              error: 'An error occurred while processing your message',
              finished: true,
              sessionId
            });
            controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
            controller.close();
          }
        }
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } else {
      // Return regular JSON response
      const response = await processMessage(message, sessionId);
      
      return NextResponse.json({
        message: response.message,
        intent: response.intent,
        confidence: response.confidence,
        suggestedActions: response.suggestedActions,
        leadCapturePrompt: response.leadCapturePrompt,
        sessionId
      });
    }

  } catch (error) {
    console.error('Chat API error:', error);
    
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred. Please try again.',
        message: "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment, or feel free to contact our team directly at info@zeropointlabs.com for immediate assistance."
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/chat
 * Health check endpoint for chat service
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'chat-api',
    timestamp: new Date().toISOString(),
    endpoints: {
      chat: '/api/chat',
      message: '/api/chat/message', 
      lead: '/api/chat/lead',
      history: '/api/chat/history/[sessionId]'
    }
  });
}

/**
 * OPTIONS /api/chat
 * CORS preflight handler
 */
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 