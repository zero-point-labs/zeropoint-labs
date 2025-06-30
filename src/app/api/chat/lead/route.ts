import { NextRequest, NextResponse } from 'next/server';
import { captureLeadInfo } from '@/services/chatbot';

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format (basic validation)
 */
function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

/**
 * Validate lead capture request body
 */
function validateLeadRequest(body: any): { isValid: boolean; error?: string } {
  if (!body) {
    return { isValid: false, error: 'Request body is required' };
  }

  // Name validation
  if (!body.name || typeof body.name !== 'string') {
    return { isValid: false, error: 'Name is required and must be a string' };
  }

  if (body.name.trim().length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters long' };
  }

  if (body.name.length > 100) {
    return { isValid: false, error: 'Name is too long (max 100 characters)' };
  }

  // Email validation
  if (!body.email || typeof body.email !== 'string') {
    return { isValid: false, error: 'Email is required and must be a string' };
  }

  if (!isValidEmail(body.email)) {
    return { isValid: false, error: 'Please provide a valid email address' };
  }

  // Phone validation (optional)
  if (body.phone && typeof body.phone !== 'string') {
    return { isValid: false, error: 'Phone must be a string' };
  }

  if (body.phone && !isValidPhone(body.phone)) {
    return { isValid: false, error: 'Please provide a valid phone number' };
  }

  // Message validation
  if (!body.message || typeof body.message !== 'string') {
    return { isValid: false, error: 'Message is required and must be a string' };
  }

  if (body.message.trim().length < 10) {
    return { isValid: false, error: 'Message must be at least 10 characters long' };
  }

  if (body.message.length > 1000) {
    return { isValid: false, error: 'Message is too long (max 1000 characters)' };
  }

  // Session ID validation
  if (!body.sessionId || typeof body.sessionId !== 'string') {
    return { isValid: false, error: 'Session ID is required and must be a string' };
  }

  return { isValid: true };
}

/**
 * Sanitize input data
 */
function sanitizeLeadData(data: any) {
  return {
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone ? data.phone.trim() : undefined,
    message: data.message.trim(),
    sessionId: data.sessionId.trim()
  };
}

/**
 * POST /api/chat/lead
 * Capture lead information from chatbot conversations
 */
export async function POST(request: NextRequest) {
  try {
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
    const validation = validateLeadRequest(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Sanitize input data
    const leadData = sanitizeLeadData(body);

    // Capture lead information
    const success = await captureLeadInfo(leadData);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to capture lead information. Please try again.' },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Thank you! Your information has been captured successfully. Our team will reach out to you soon.',
      leadId: `lead_${Date.now()}`, // Simple lead ID for reference
      sessionId: leadData.sessionId
    });

  } catch (error) {
    console.error('Lead capture API error:', error);
    
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred while capturing your information. Please try again.',
        success: false
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/chat/lead
 * Health check endpoint for lead capture service
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'lead-capture-api',
    timestamp: new Date().toISOString()
  });
}

/**
 * OPTIONS /api/chat/lead
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
