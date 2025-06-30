#!/usr/bin/env node

/**
 * Database Initialization Script for Zero Point Labs Chatbot
 * 
 * This script creates the necessary Appwrite collections for the chatbot system.
 * Run this script after deploying to production to set up the database.
 */

const { Client, Databases, ID, Permission, Role } = require('node-appwrite');

// Configuration
const config = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://zeropoint-labs.com/v1',
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'zeropoint-labs',
  apiKey: process.env.APPWRITE_API_KEY,
  databaseId: 'main'
};

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setKey(config.apiKey);

const databases = new Databases(client);

/**
 * Create database if it doesn't exist
 */
async function createDatabase() {
  try {
    console.log('🔍 Checking if database exists...');
    await databases.get(config.databaseId);
    console.log('✅ Database already exists');
    return true;
  } catch (error) {
    if (error.code === 404) {
      try {
        console.log('📦 Creating main database...');
        await databases.create(config.databaseId, 'Main Database');
        console.log('✅ Database created successfully');
        return true;
      } catch (createError) {
        console.error('❌ Failed to create database:', createError.message);
        return false;
      }
    } else {
      console.error('❌ Error checking database:', error.message);
      return false;
    }
  }
}

/**
 * Create chatbot_knowledge collection
 */
async function createKnowledgeCollection() {
  const collectionId = 'chatbot_knowledge';
  
  try {
    console.log('🔍 Checking if chatbot_knowledge collection exists...');
    await databases.getCollection(config.databaseId, collectionId);
    console.log('✅ chatbot_knowledge collection already exists');
    return true;
  } catch (error) {
    if (error.code === 404) {
      try {
        console.log('📦 Creating chatbot_knowledge collection...');
        
        // Create collection
        await databases.createCollection(
          config.databaseId,
          collectionId,
          'Chatbot Knowledge Base',
          [
            Permission.read(Role.any()),
            Permission.create(Role.any()),
            Permission.update(Role.any()),
            Permission.delete(Role.any())
          ]
        );

        // Create attributes
        await databases.createStringAttribute(config.databaseId, collectionId, 'intent', 100, true);
        await databases.createStringAttribute(config.databaseId, collectionId, 'question_keywords', 1000, true);
        await databases.createStringAttribute(config.databaseId, collectionId, 'response', 5000, true);
        await databases.createIntegerAttribute(config.databaseId, collectionId, 'priority', false, 1, 10, 5);

        // Wait for attributes to be available
        console.log('⏳ Waiting for attributes to be ready...');
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Create indexes
        await databases.createIndex(config.databaseId, collectionId, 'intent_index', 'key', ['intent']);
        await databases.createIndex(config.databaseId, collectionId, 'priority_index', 'key', ['priority']);

        console.log('✅ chatbot_knowledge collection created successfully');
        return true;
      } catch (createError) {
        console.error('❌ Failed to create chatbot_knowledge collection:', createError.message);
        return false;
      }
    } else {
      console.error('❌ Error checking chatbot_knowledge collection:', error.message);
      return false;
    }
  }
}

/**
 * Create chat_conversations collection
 */
async function createConversationsCollection() {
  const collectionId = 'chat_conversations';
  
  try {
    console.log('🔍 Checking if chat_conversations collection exists...');
    await databases.getCollection(config.databaseId, collectionId);
    console.log('✅ chat_conversations collection already exists');
    return true;
  } catch (error) {
    if (error.code === 404) {
      try {
        console.log('📦 Creating chat_conversations collection...');
        
        // Create collection
        await databases.createCollection(
          config.databaseId,
          collectionId,
          'Chat Conversations',
          [
            Permission.read(Role.any()),
            Permission.create(Role.any()),
            Permission.update(Role.any()),
            Permission.delete(Role.any())
          ]
        );

        // Create attributes
        await databases.createStringAttribute(config.databaseId, collectionId, 'session_id', 100, true);
        await databases.createStringAttribute(config.databaseId, collectionId, 'messages', 50000, false);
        await databases.createStringAttribute(config.databaseId, collectionId, 'user_intent', 100, false);
        await databases.createStringAttribute(config.databaseId, collectionId, 'detected_needs', 1000, false);
        await databases.createStringAttribute(config.databaseId, collectionId, 'lead_info', 2000, false);
        await databases.createStringAttribute(config.databaseId, collectionId, 'business_context', 5000, false);
        await databases.createDatetimeAttribute(config.databaseId, collectionId, 'created_at', false);
        await databases.createDatetimeAttribute(config.databaseId, collectionId, 'updated_at', false);

        // Wait for attributes to be available
        console.log('⏳ Waiting for attributes to be ready...');
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Create indexes
        await databases.createIndex(config.databaseId, collectionId, 'session_index', 'key', ['session_id']);
        await databases.createIndex(config.databaseId, collectionId, 'created_index', 'key', ['created_at']);

        console.log('✅ chat_conversations collection created successfully');
        return true;
      } catch (createError) {
        console.error('❌ Failed to create chat_conversations collection:', createError.message);
        return false;
      }
    } else {
      console.error('❌ Error checking chat_conversations collection:', error.message);
      return false;
    }
  }
}

/**
 * Create chat_leads collection
 */
async function createLeadsCollection() {
  const collectionId = 'chat_leads';
  
  try {
    console.log('🔍 Checking if chat_leads collection exists...');
    await databases.getCollection(config.databaseId, collectionId);
    console.log('✅ chat_leads collection already exists');
    return true;
  } catch (error) {
    if (error.code === 404) {
      try {
        console.log('📦 Creating chat_leads collection...');
        
        // Create collection
        await databases.createCollection(
          config.databaseId,
          collectionId,
          'Chat Leads',
          [
            Permission.read(Role.any()),
            Permission.create(Role.any()),
            Permission.update(Role.any()),
            Permission.delete(Role.any())
          ]
        );

        // Create attributes
        await databases.createStringAttribute(config.databaseId, collectionId, 'name', 100, true);
        await databases.createEmailAttribute(config.databaseId, collectionId, 'email', true);
        await databases.createStringAttribute(config.databaseId, collectionId, 'phone', 20, false);
        await databases.createStringAttribute(config.databaseId, collectionId, 'message', 2000, true);
        await databases.createStringAttribute(config.databaseId, collectionId, 'source', 50, true);
        await databases.createStringAttribute(config.databaseId, collectionId, 'sessionId', 100, true);
        await databases.createDatetimeAttribute(config.databaseId, collectionId, 'created_at', false);

        // Wait for attributes to be available
        console.log('⏳ Waiting for attributes to be ready...');
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Create indexes
        await databases.createIndex(config.databaseId, collectionId, 'email_index', 'key', ['email']);
        await databases.createIndex(config.databaseId, collectionId, 'source_index', 'key', ['source']);
        await databases.createIndex(config.databaseId, collectionId, 'created_index', 'key', ['created_at']);

        console.log('✅ chat_leads collection created successfully');
        return true;
      } catch (createError) {
        console.error('❌ Failed to create chat_leads collection:', createError.message);
        return false;
      }
    } else {
      console.error('❌ Error checking chat_leads collection:', error.message);
      return false;
    }
  }
}

/**
 * Populate knowledge base with default entries
 */
async function populateKnowledgeBase() {
  try {
    console.log('🔍 Checking if knowledge base has entries...');
    const response = await databases.listDocuments(config.databaseId, 'chatbot_knowledge');
    
    if (response.documents.length > 0) {
      console.log('✅ Knowledge base already populated');
      return true;
    }

    console.log('📝 Populating knowledge base with default entries...');

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

    // Create all entries
    for (const entry of defaultEntries) {
      await databases.createDocument(
        config.databaseId,
        'chatbot_knowledge',
        ID.unique(),
        entry
      );
    }

    console.log('✅ Knowledge base populated successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to populate knowledge base:', error.message);
    return false;
  }
}

/**
 * Main initialization function
 */
async function initializeDatabase() {
  console.log('🚀 Starting database initialization...\n');

  // Validate configuration
  if (!config.apiKey) {
    console.error('❌ APPWRITE_API_KEY environment variable is required');
    process.exit(1);
  }

  try {
    // Step 1: Create database
    const dbCreated = await createDatabase();
    if (!dbCreated) {
      console.error('❌ Failed to create database. Exiting...');
      process.exit(1);
    }

    // Step 2: Create collections
    const knowledgeCreated = await createKnowledgeCollection();
    const conversationsCreated = await createConversationsCollection();
    const leadsCreated = await createLeadsCollection();

    if (!knowledgeCreated || !conversationsCreated || !leadsCreated) {
      console.error('❌ Failed to create all collections. Exiting...');
      process.exit(1);
    }

    // Step 3: Populate knowledge base
    const knowledgePopulated = await populateKnowledgeBase();
    if (!knowledgePopulated) {
      console.error('❌ Failed to populate knowledge base. Exiting...');
      process.exit(1);
    }

    console.log('\n🎉 Database initialization completed successfully!');
    console.log('\n📋 Summary:');
    console.log('✅ Database: main');
    console.log('✅ Collection: chatbot_knowledge (with default entries)');
    console.log('✅ Collection: chat_conversations');
    console.log('✅ Collection: chat_leads');
    console.log('\n🤖 Your chatbot is now ready to use!');

  } catch (error) {
    console.error('❌ Unexpected error during initialization:', error.message);
    process.exit(1);
  }
}

// Run the initialization
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase };
