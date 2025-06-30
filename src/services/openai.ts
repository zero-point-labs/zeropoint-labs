import OpenAI from 'openai';

// Lazy initialization of OpenAI client
let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }
    
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

// System prompt for ZeroBot
const SYSTEM_PROMPT = `You are ZeroBot, an intelligent AI assistant for Zero Point Labs, a cutting-edge web development company specializing in Next.js websites, e-commerce solutions, and automation services.

Your role is to:
1. Engage potential clients in natural, helpful conversations
2. Understand their business needs and recommend appropriate solutions
3. Provide accurate information about Zero Point Labs services
4. Guide conversations toward lead capture when appropriate
5. Maintain a professional yet friendly tone

Key Services & Pricing:
- Next.js websites: $600-$3000+ (fast, modern, secure with animations)
- Shopify e-commerce stores: $1500-$2500 (complete setup with custom design)
- WordPress/Wix development: $500-$1500 (platform-based solutions)
- Zapier automation and integrations (workflow automation)
- AI chatbot integration (like this conversation!)
- Advanced animations and 3D elements
- Zero Point Labs dashboard with analytics

Company Strengths:
- Modern technology stack (Next.js, React, TypeScript)
- Professional deployment on VPS with SSL
- Comprehensive analytics and performance tracking
- 24/7 support and maintenance
- Custom integrations and automations

Conversation Guidelines:
- Ask about their business and specific needs
- Recommend appropriate solutions based on requirements
- Mention relevant features that could benefit them
- Guide toward contact information capture for detailed discussions
- Be helpful and informative, not pushy
- Use natural, conversational language

Always be helpful, accurate, and focused on understanding the client's needs.`;

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface StreamingResponse {
  content: string;
  finished: boolean;
  error?: string;
}

/**
 * Generate a streaming response from OpenAI GPT-4o
 */
export async function generateStreamingResponse(
  messages: ChatMessage[],
  onChunk?: (chunk: StreamingResponse) => void
): Promise<string> {
  try {
    // Prepare messages with system prompt
    const fullMessages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages
    ];

    // Create streaming completion
    const stream = await getOpenAIClient().chat.completions.create({
      model: 'gpt-4o',
      messages: fullMessages,
      stream: true,
      temperature: 0.7,
      max_tokens: 1000,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    });

    let fullResponse = '';

    // Process streaming chunks
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      
      if (content) {
        fullResponse += content;
        
        // Call chunk handler if provided
        if (onChunk) {
          onChunk({
            content: fullResponse,
            finished: false
          });
        }
      }
    }

    // Send final chunk
    if (onChunk) {
      onChunk({
        content: fullResponse,
        finished: true
      });
    }

    return fullResponse;

  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    if (onChunk) {
      onChunk({
        content: '',
        finished: true,
        error: errorMessage
      });
    }
    
    throw new Error(`OpenAI API Error: ${errorMessage}`);
  }
}

/**
 * Generate a non-streaming response from OpenAI GPT-4o
 */
export async function generateResponse(messages: ChatMessage[]): Promise<string> {
  try {
    // Prepare messages with system prompt
    const fullMessages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages
    ];

    const completion = await getOpenAIClient().chat.completions.create({
      model: 'gpt-4o',
      messages: fullMessages,
      temperature: 0.7,
      max_tokens: 1000,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    });

    return completion.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response. Please try again.';

  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error(`OpenAI API Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Validate OpenAI API configuration
 */
export function validateOpenAIConfig(): boolean {
  const apiKey = process.env.OPENAI_API_KEY;
  return !!(apiKey && apiKey !== 'placeholder' && apiKey.startsWith('sk-'));
}

/**
 * Estimate token count for a message (rough approximation)
 */
export function estimateTokenCount(text: string): number {
  // Rough estimation: 1 token ≈ 4 characters for English text
  return Math.ceil(text.length / 4);
}

/**
 * Truncate conversation history to stay within token limits
 */
export function truncateConversation(messages: ChatMessage[], maxTokens: number = 3000): ChatMessage[] {
  let totalTokens = estimateTokenCount(SYSTEM_PROMPT);
  const truncatedMessages: ChatMessage[] = [];

  // Add messages from most recent, working backwards
  for (let i = messages.length - 1; i >= 0; i--) {
    const messageTokens = estimateTokenCount(messages[i].content);
    
    if (totalTokens + messageTokens > maxTokens) {
      break;
    }
    
    totalTokens += messageTokens;
    truncatedMessages.unshift(messages[i]);
  }

  return truncatedMessages;
}

export default getOpenAIClient;
