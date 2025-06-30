import { NextRequest, NextResponse } from 'next/server';
import { databases } from '@/lib/appwrite';
import { Query } from 'appwrite';

const DATABASE_ID = 'main';
const CONVERSATIONS_COLLECTION_ID = 'chat_conversations';

/**
 * GET /api/chat/history/[sessionId]
 * Retrieve conversation history for a session
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
  try {
    const { sessionId } = await params;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Get conversation history from Appwrite
    const conversationHistory = await getConversationHistory(sessionId);
    
    return NextResponse.json({
      messages: conversationHistory,
      sessionId
    });

  } catch (error) {
    console.error('Get conversation history error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve conversation history' },
      { status: 500 }
    );
  }
}

/**
 * Get conversation history from database
 */
async function getConversationHistory(sessionId: string) {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      CONVERSATIONS_COLLECTION_ID,
      [
        Query.equal('session_id', sessionId),
        Query.orderAsc('$createdAt'),
        Query.limit(1) // Get the conversation document
      ]
    );

    if (response.documents.length > 0) {
      const conversation = response.documents[0];
      // Extract messages from the conversation document
      const messages = conversation.messages || [];
      
      // Convert to the expected format
      return Array.isArray(messages) ? messages.map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
        intent: msg.intent,
        confidence: msg.confidence
      })) : [];
    }

    return [];

  } catch (error) {
    console.error('Database query error:', error);
    return [];
  }
} 