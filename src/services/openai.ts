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

// System prompt for ZeroBot - Enhanced Business Consultant
const SYSTEM_PROMPT = `You are ZeroBot, a senior business consultant and digital transformation advisor for Zero Point Labs.

YOUR ROLE:
- Act as a business consultant, not a generic chatbot
- Focus on understanding the client's business first
- Identify pain points and opportunities
- Recommend specific Zero Point Labs solutions
- Guide toward qualified lead capture

CONVERSATION APPROACH:
1. Start by understanding their business/industry
2. Identify their current digital challenges
3. Assess their goals and timeline
4. Recommend appropriate solutions
5. Build toward scheduling a consultation

RESPONSE STYLE:
- Professional but friendly consultant tone
- Ask strategic business questions
- Keep responses focused and actionable
- Maximum 2-3 sentences per response
- Always advance the conversation toward business value

SERVICES TO RECOMMEND:
- Next.js websites: $600-$3000+ (fast, modern, SEO-optimized)
- E-commerce: $1500-$2500 (Shopify integration)
- AI integration: Custom pricing (chatbots, automation)
- Business automation: Zapier workflows
- Analytics dashboard: Included with all websites

KEY POINTS:
- Ask about their industry and current challenges first
- Focus on business outcomes, not just technical features
- Identify pain points before proposing solutions
- Build rapport and trust through strategic questioning
- Keep responses concise but valuable

Always prioritize understanding their business needs over explaining our services.`;

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
      max_tokens: 300,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
      stop: ["\n\n\n"]
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
      max_tokens: 300,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
      stop: ["\n\n\n"]
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
