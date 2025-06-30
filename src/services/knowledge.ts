import { databases } from '@/lib/appwrite';
import { Query } from 'appwrite';

export interface KnowledgeEntry {
  $id: string;
  intent: string;
  question_keywords: string;
  response: string;
  priority?: number;
}

export interface IntentMatch {
  intent: string;
  confidence: number;
  knowledgeEntry: KnowledgeEntry;
}

// Database and collection IDs
const DATABASE_ID = 'main';
const KNOWLEDGE_COLLECTION_ID = 'chatbot_knowledge';

/**
 * Search for relevant knowledge entries based on user message
 */
export async function searchKnowledge(userMessage: string): Promise<KnowledgeEntry[]> {
  try {
    // Convert message to lowercase for better matching
    const searchTerms = userMessage.toLowerCase();
    
    // Search for entries where keywords match the user message
    const response = await databases.listDocuments(
      DATABASE_ID,
      KNOWLEDGE_COLLECTION_ID,
      [
        Query.search('question_keywords', searchTerms),
        Query.orderDesc('priority'),
        Query.limit(10)
      ]
    );

    return response.documents as unknown as KnowledgeEntry[];
  } catch (error) {
    console.error('Knowledge search error:', error);
    return [];
  }
}

/**
 * Detect user intent based on keywords and return best matches
 */
export async function detectIntent(userMessage: string): Promise<IntentMatch[]> {
  try {
    const knowledgeEntries = await searchKnowledge(userMessage);
    const matches: IntentMatch[] = [];

    // Convert message to lowercase for matching
    const messageLower = userMessage.toLowerCase();
    const messageWords = messageLower.split(/\s+/);

    for (const entry of knowledgeEntries) {
      const keywords = entry.question_keywords.toLowerCase().split(/[,\s]+/);
      let matchCount = 0;
      let totalKeywords = keywords.length;

      // Count keyword matches
      for (const keyword of keywords) {
        if (keyword.trim() && messageLower.includes(keyword.trim())) {
          matchCount++;
        }
      }

      // Calculate confidence score
      const confidence = totalKeywords > 0 ? matchCount / totalKeywords : 0;

      // Only include matches with reasonable confidence
      if (confidence > 0.1) {
        matches.push({
          intent: entry.intent,
          confidence,
          knowledgeEntry: entry
        });
      }
    }

    // Sort by confidence (highest first)
    return matches.sort((a, b) => b.confidence - a.confidence);
  } catch (error) {
    console.error('Intent detection error:', error);
    return [];
  }
}

/**
 * Get knowledge entry by intent
 */
export async function getKnowledgeByIntent(intent: string): Promise<KnowledgeEntry | null> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      KNOWLEDGE_COLLECTION_ID,
      [
        Query.equal('intent', intent),
        Query.limit(1)
      ]
    );

    return response.documents.length > 0 ? response.documents[0] as unknown as KnowledgeEntry : null;
  } catch (error) {
    console.error('Get knowledge by intent error:', error);
    return null;
  }
}

/**
 * Get all available intents
 */
export async function getAllIntents(): Promise<string[]> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      KNOWLEDGE_COLLECTION_ID,
      [Query.select(['intent'])]
    );

    const intents = response.documents.map(doc => doc.intent);
    return [...new Set(intents)]; // Remove duplicates
  } catch (error) {
    console.error('Get all intents error:', error);
    return [];
  }
}

/**
 * Create or update a knowledge entry
 */
export async function upsertKnowledgeEntry(entry: Omit<KnowledgeEntry, '$id'> & { $id?: string }): Promise<KnowledgeEntry | null> {
  try {
    if (entry.$id) {
      // Update existing entry
      const response = await databases.updateDocument(
        DATABASE_ID,
        KNOWLEDGE_COLLECTION_ID,
        entry.$id,
        {
          intent: entry.intent,
          question_keywords: entry.question_keywords,
          response: entry.response,
          priority: entry.priority || 1
        }
      );
      return response as unknown as KnowledgeEntry;
    } else {
      // Create new entry
      const response = await databases.createDocument(
        DATABASE_ID,
        KNOWLEDGE_COLLECTION_ID,
        'unique()',
        {
          intent: entry.intent,
          question_keywords: entry.question_keywords,
          response: entry.response,
          priority: entry.priority || 1
        }
      );
      return response as unknown as KnowledgeEntry;
    }
  } catch (error) {
    console.error('Upsert knowledge entry error:', error);
    return null;
  }
}

/**
 * Initialize knowledge base with default entries
 */
export async function initializeKnowledgeBase(): Promise<boolean> {
  try {
    // Check if knowledge base already has entries
    const existing = await databases.listDocuments(
      DATABASE_ID,
      KNOWLEDGE_COLLECTION_ID,
      [Query.limit(1)]
    );

    if (existing.documents.length > 0) {
      console.log('Knowledge base already initialized');
      return true;
    }

    // Default knowledge entries based on your documentation
    const defaultEntries = [
      {
        intent: 'greeting',
        question_keywords: 'hi, hello, hey, good morning, good evening, good afternoon, start, begin',
        response: "Hello! I'm ZeroBot, your AI assistant for Zero Point Labs. I'm here to help you understand our web development services and find the perfect solution for your business. What kind of digital project are you interested in?",
        priority: 10
      },
      {
        intent: 'nextjs_intro',
        question_keywords: 'website, simple website, business website, fast, modern, cheap, nextjs, next.js',
        response: "Our Next.js websites are perfect for businesses looking for modern, fast, and secure web solutions. They feature impressive speed, beautiful animations, and come with our Zero Point Labs dashboard for analytics and management. Pricing typically ranges from $600 to $3000+ depending on features. What specific features are you looking for?",
        priority: 9
      },
      {
        intent: 'nextjs_advanced_features',
        question_keywords: 'animations, fancy, advanced, special effects, interactive, 3d, three.js',
        response: "We specialize in creating stunning websites with advanced animations, 3D elements, and interactive features that really make your brand stand out. These can include particle effects, smooth transitions, interactive 3D models, and custom animations. Would you like to see examples of what's possible?",
        priority: 8
      },
      {
        intent: 'nextjs_ai_features',
        question_keywords: 'ai, chatbot, smart features, automated chat, artificial intelligence',
        response: "AI integration is one of our specialties! We can implement intelligent chatbots (like this one), automated customer service, content generation, and smart user interactions. AI features can significantly enhance user engagement and automate customer support. What kind of AI functionality would benefit your business?",
        priority: 8
      },
      {
        intent: 'ecommerce_shopify',
        question_keywords: 'shopify, online store, ecommerce, sell products, shop, store, selling',
        response: "For e-commerce, we offer complete Shopify solutions ranging from $1500 to $2500. This includes custom website design, product catalog setup, payment processing, inventory management, and domain configuration. We handle everything from design to launch. What products are you planning to sell?",
        priority: 8
      },
      {
        intent: 'wix_wordpress_sites',
        question_keywords: 'wordpress, wix, squarespace, easy, regular platforms, cms',
        response: "We also work with popular platforms like WordPress, Wix, and Squarespace for clients who prefer familiar interfaces. These solutions typically range from $500 to $1500 and are great for content-heavy sites or when you want to manage updates yourself. Do you have experience with any of these platforms?",
        priority: 7
      },
      {
        intent: 'zapier_automation',
        question_keywords: 'automation, zapier, integration, crm, workflow, leads, automate',
        response: "Automation can transform your business workflow! We use Zapier to connect your website with CRMs, email marketing, lead notifications, and other business tools. This can automate tasks like lead capture, email follow-ups, and data synchronization. What business processes would you like to automate?",
        priority: 7
      },
      {
        intent: 'general_pricing_inquiry',
        question_keywords: 'price, cost, pricing, budget, how much, expensive, cheap',
        response: "Our pricing varies based on complexity and features:\n\n• Next.js websites: $600-$3000+\n• Shopify e-commerce: $1500-$2500\n• WordPress/Wix sites: $500-$1500\n• Custom integrations and AI features add value\n\nTo give you an accurate quote, I'd love to learn more about your specific needs. What type of website are you considering?",
        priority: 9
      },
      {
        intent: 'request_contact',
        question_keywords: 'contact, call me, email me, phone, get in touch, talk to someone, consultation',
        response: "I'd be happy to have our team reach out to you for a detailed consultation! We can discuss your project requirements, provide a custom quote, and answer any technical questions. Could you share your preferred contact method (email or phone) and the best time to reach you?",
        priority: 10
      },
      {
        intent: 'nextjs_dashboard_features',
        question_keywords: 'dashboard, analytics, performance, visitors, tracking, data',
        response: "Every Next.js website includes access to our comprehensive Zero Point Labs dashboard! You'll get detailed insights into website traffic, visitor demographics, performance metrics, form submissions, and user behavior. It's like having Google Analytics plus much more, all in one easy-to-use interface. Would you like to know more about specific analytics features?",
        priority: 7
      }
    ];

    // Create all default entries
    for (const entry of defaultEntries) {
      await upsertKnowledgeEntry(entry);
    }

    console.log('Knowledge base initialized successfully');
    return true;
  } catch (error) {
    console.error('Initialize knowledge base error:', error);
    return false;
  }
}

/**
 * Get contextual knowledge based on conversation history
 */
export function getContextualKnowledge(
  matches: IntentMatch[],
  conversationHistory: string[]
): string {
  if (matches.length === 0) {
    return '';
  }

  // Get the best match
  const bestMatch = matches[0];
  
  // Build context from knowledge base
  let context = `Based on the user's message, this appears to be about: ${bestMatch.intent}\n\n`;
  context += `Relevant information: ${bestMatch.knowledgeEntry.response}\n\n`;
  
  // Add additional context from other matches
  if (matches.length > 1) {
    context += 'Additional relevant topics:\n';
    for (let i = 1; i < Math.min(3, matches.length); i++) {
      context += `- ${matches[i].intent}: ${matches[i].knowledgeEntry.response.substring(0, 100)}...\n`;
    }
  }

  return context;
}

export default {
  searchKnowledge,
  detectIntent,
  getKnowledgeByIntent,
  getAllIntents,
  upsertKnowledgeEntry,
  initializeKnowledgeBase,
  getContextualKnowledge
};
