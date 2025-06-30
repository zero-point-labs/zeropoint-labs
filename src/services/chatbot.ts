import { ChatMessage, generateStreamingResponse, truncateConversation } from './openai';
import { detectIntent, getContextualKnowledge, initializeKnowledgeBase, IntentMatch } from './knowledge';
import { databases } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  intent?: string;
  confidence?: number;
}

export interface ConversationContext {
  sessionId: string;
  messages: ConversationMessage[];
  userIntent?: string;
  detectedNeeds?: string[];
  leadInfo?: Partial<LeadInfo>;
  businessContext?: string;
}

export interface LeadInfo {
  name: string;
  email: string;
  phone?: string;
  message: string;
  source: string;
  sessionId: string;
}

export interface ChatbotResponse {
  message: string;
  intent?: string;
  confidence?: number;
  suggestedActions?: string[];
  leadCapturePrompt?: boolean;
}

// Database configuration
const DATABASE_ID = 'main';
const CONVERSATIONS_COLLECTION_ID = 'chat_conversations';
const LEADS_COLLECTION_ID = 'chat_leads';

/**
 * Initialize chatbot system
 */
export async function initializeChatbot(): Promise<boolean> {
  try {
    // Initialize knowledge base
    await initializeKnowledgeBase();
    console.log('Chatbot system initialized successfully');
    return true;
  } catch (error) {
    console.error('Chatbot initialization error:', error);
    return false;
  }
}

/**
 * Process a user message and generate a response
 */
export async function processMessage(
  userMessage: string,
  sessionId: string,
  onChunk?: (chunk: { content: string; finished: boolean }) => void
): Promise<ChatbotResponse> {
  try {
    // Get or create conversation context
    const context = await getConversationContext(sessionId);
    
    // Add user message to context
    const userMsg: ConversationMessage = {
      id: ID.unique(),
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    context.messages.push(userMsg);

    // Detect intent from user message
    const intentMatches = await detectIntent(userMessage);
    const bestIntent = intentMatches.length > 0 ? intentMatches[0] : null;

    // Update context with detected intent
    if (bestIntent) {
      context.userIntent = bestIntent.intent;
      context.businessContext = getContextualKnowledge(intentMatches, 
        context.messages.map(m => m.content)
      );
    }

    // Prepare conversation history for OpenAI
    const chatMessages: ChatMessage[] = context.messages
      .slice(-10) // Keep last 10 messages for context
      .map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

    // Add business context if available
    if (context.businessContext) {
      chatMessages.unshift({
        role: 'system',
        content: `Business Context: ${context.businessContext}`
      });
    }

    // Truncate conversation to stay within token limits
    const truncatedMessages = truncateConversation(chatMessages);

    // Generate AI response
    let aiResponse = '';
    
    if (onChunk) {
      // Streaming response
      aiResponse = await generateStreamingResponse(truncatedMessages, (chunk) => {
        onChunk({
          content: chunk.content,
          finished: chunk.finished
        });
      });
    } else {
      // Non-streaming response
      const { generateResponse } = await import('./openai');
      aiResponse = await generateResponse(truncatedMessages);
    }

    // Add AI response to context
    const assistantMsg: ConversationMessage = {
      id: ID.unique(),
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date(),
      intent: bestIntent?.intent,
      confidence: bestIntent?.confidence
    };
    context.messages.push(assistantMsg);

    // Save conversation to database
    await saveConversation(context);

    // Check for lead capture opportunities
    const leadCapturePrompt = shouldPromptForLeadCapture(context);

    // Generate suggested actions
    const suggestedActions = generateSuggestedActions(bestIntent, context);

    return {
      message: aiResponse,
      intent: bestIntent?.intent,
      confidence: bestIntent?.confidence,
      suggestedActions,
      leadCapturePrompt
    };

  } catch (error) {
    console.error('Process message error:', error);
    
    // Return fallback response
    return {
      message: "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment, or feel free to contact our team directly at info@zeropointlabs.com for immediate assistance.",
      suggestedActions: ['Try again', 'Contact support']
    };
  }
}

/**
 * Get or create conversation context
 */
async function getConversationContext(sessionId: string): Promise<ConversationContext> {
  try {
    // Try to load existing conversation
    const response = await databases.listDocuments(
      DATABASE_ID,
      CONVERSATIONS_COLLECTION_ID,
      [
        Query.equal('session_id', sessionId),
        Query.limit(1)
      ]
    );

    if (response.documents.length > 0) {
      const doc = response.documents[0];
      return {
        sessionId,
        messages: doc.messages || [],
        userIntent: doc.user_intent,
        detectedNeeds: doc.detected_needs || [],
        leadInfo: doc.lead_info,
        businessContext: doc.business_context
      };
    }

    // Create new conversation context
    return {
      sessionId,
      messages: [],
      detectedNeeds: []
    };

  } catch (error) {
    console.error('Get conversation context error:', error);
    // Return empty context on error
    return {
      sessionId,
      messages: [],
      detectedNeeds: []
    };
  }
}

/**
 * Save conversation to database
 */
async function saveConversation(context: ConversationContext): Promise<void> {
  try {
    const conversationData = {
      session_id: context.sessionId,
      messages: context.messages,
      user_intent: context.userIntent,
      detected_needs: context.detectedNeeds || [],
      lead_info: context.leadInfo,
      business_context: context.businessContext,
      updated_at: new Date().toISOString()
    };

    // Check if conversation exists
    const existing = await databases.listDocuments(
      DATABASE_ID,
      CONVERSATIONS_COLLECTION_ID,
      [
        Query.equal('session_id', context.sessionId),
        Query.limit(1)
      ]
    );

    if (existing.documents.length > 0) {
      // Update existing conversation
      await databases.updateDocument(
        DATABASE_ID,
        CONVERSATIONS_COLLECTION_ID,
        existing.documents[0].$id,
        conversationData
      );
    } else {
      // Create new conversation
      await databases.createDocument(
        DATABASE_ID,
        CONVERSATIONS_COLLECTION_ID,
        ID.unique(),
        {
          ...conversationData,
          created_at: new Date().toISOString()
        }
      );
    }
  } catch (error) {
    console.error('Save conversation error:', error);
    // Don't throw error to avoid breaking the chat flow
  }
}

/**
 * Determine if we should prompt for lead capture
 */
function shouldPromptForLeadCapture(context: ConversationContext): boolean {
  // Don't prompt if we already have lead info
  if (context.leadInfo?.email) {
    return false;
  }

  // Prompt after certain intents or message count
  const triggerIntents = ['request_contact', 'general_pricing_inquiry', 'nextjs_intro'];
  const hasRelevantIntent = context.messages.some(msg => 
    msg.intent && triggerIntents.includes(msg.intent)
  );

  const messageCount = context.messages.filter(m => m.role === 'user').length;
  
  return hasRelevantIntent || messageCount >= 4;
}

/**
 * Generate suggested actions based on intent and context
 */
function generateSuggestedActions(
  bestIntent: IntentMatch | null, 
  context: ConversationContext
): string[] {
  const actions: string[] = [];

  if (!bestIntent) {
    return ['Tell me about your services', 'What do you offer?', 'How much does a website cost?'];
  }

  switch (bestIntent.intent) {
    case 'greeting':
      actions.push('Tell me about Next.js websites', 'I need an e-commerce store', 'What services do you offer?');
      break;
    
    case 'nextjs_intro':
      actions.push('Show me advanced features', 'What about AI integration?', 'How much would this cost?');
      break;
    
    case 'general_pricing_inquiry':
      actions.push('Tell me about Next.js websites', 'I need e-commerce functionality', 'Can we schedule a consultation?');
      break;
    
    case 'request_contact':
      actions.push('I prefer email contact', 'Please call me', 'Send me more information');
      break;
    
    default:
      actions.push('Tell me more', 'What else can you do?', 'How do we get started?');
  }

  return actions;
}

/**
 * Capture lead information
 */
export async function captureLeadInfo(leadInfo: Omit<LeadInfo, 'source'>): Promise<boolean> {
  try {
    const leadData = {
      ...leadInfo,
      source: 'chatbot',
      created_at: new Date().toISOString()
    };

    await databases.createDocument(
      DATABASE_ID,
      LEADS_COLLECTION_ID,
      ID.unique(),
      leadData
    );

    // Update conversation with lead info
    const conversations = await databases.listDocuments(
      DATABASE_ID,
      CONVERSATIONS_COLLECTION_ID,
      [
        Query.equal('session_id', leadInfo.sessionId),
        Query.limit(1)
      ]
    );

    if (conversations.documents.length > 0) {
      await databases.updateDocument(
        DATABASE_ID,
        CONVERSATIONS_COLLECTION_ID,
        conversations.documents[0].$id,
        {
          lead_info: leadInfo,
          updated_at: new Date().toISOString()
        }
      );
    }

    return true;
  } catch (error) {
    console.error('Capture lead error:', error);
    return false;
  }
}

/**
 * Get conversation history for a session
 */
export async function getConversationHistory(sessionId: string): Promise<ConversationMessage[]> {
  try {
    const context = await getConversationContext(sessionId);
    return context.messages;
  } catch (error) {
    console.error('Get conversation history error:', error);
    return [];
  }
}

/**
 * Clear conversation history for a session
 */
export async function clearConversationHistory(sessionId: string): Promise<boolean> {
  try {
    const conversations = await databases.listDocuments(
      DATABASE_ID,
      CONVERSATIONS_COLLECTION_ID,
      [
        Query.equal('session_id', sessionId),
        Query.limit(1)
      ]
    );

    if (conversations.documents.length > 0) {
      await databases.deleteDocument(
        DATABASE_ID,
        CONVERSATIONS_COLLECTION_ID,
        conversations.documents[0].$id
      );
    }

    return true;
  } catch (error) {
    console.error('Clear conversation history error:', error);
    return false;
  }
}

export default {
  initializeChatbot,
  processMessage,
  captureLeadInfo,
  getConversationHistory,
  clearConversationHistory
};
