const { Client, Databases, ID, Permission, Role } = require('node-appwrite');
require('dotenv').config({ path: '.env.local' });

const client = new Client();

const DATABASE_ID = 'main';
const CONVERSATIONS_COLLECTION_ID = 'chat_conversations';
const LEADS_COLLECTION_ID = 'chat_leads';
const KNOWLEDGE_COLLECTION_ID = 'chatbot_knowledge';

// Initialize Appwrite client
client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://zeropoint-labs.com/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'zeropoint-labs')
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

async function initializeAppwriteProject() {
    console.log('🚀 Initializing Appwrite project for Zero Point Labs...');
    
    try {
        // Step 1: Create main database
        console.log('📊 Creating main database...');
        try {
            await databases.create(DATABASE_ID, 'Zero Point Labs Main Database');
            console.log('✅ Database created successfully');
        } catch (error) {
            if (error.code === 409) {
                console.log('✅ Database already exists');
            } else {
                throw error;
            }
        }

        // Step 2: Create chat conversations collection
        console.log('💬 Creating chat conversations collection...');
        try {
            await databases.createCollection(
                DATABASE_ID,
                CONVERSATIONS_COLLECTION_ID,
                'Chat Conversations',
                [
                    Permission.read(Role.any()),
                    Permission.create(Role.any()),
                    Permission.update(Role.any()),
                    Permission.delete(Role.any())
                ]
            );
            console.log('✅ Chat conversations collection created');
        } catch (error) {
            if (error.code === 409) {
                console.log('✅ Chat conversations collection already exists');
            } else {
                throw error;
            }
        }

        // Step 3: Create conversation attributes
        console.log('📝 Creating conversation attributes...');
        const conversationAttributes = [
            { key: 'session_id', type: 'string', size: 100, required: true },
            { key: 'messages', type: 'string', size: 10000, required: false },
            { key: 'user_intent', type: 'string', size: 200, required: false },
            { key: 'detected_needs', type: 'string', size: 1000, required: false },
            { key: 'lead_info', type: 'string', size: 2000, required: false },
            { key: 'business_context', type: 'string', size: 2000, required: false },
            { key: 'created_at', type: 'datetime', required: true },
            { key: 'updated_at', type: 'datetime', required: true }
        ];

        for (const attr of conversationAttributes) {
            try {
                if (attr.type === 'string') {
                    await databases.createStringAttribute(
                        DATABASE_ID,
                        CONVERSATIONS_COLLECTION_ID,
                        attr.key,
                        attr.size,
                        attr.required
                    );
                } else if (attr.type === 'datetime') {
                    await databases.createDatetimeAttribute(
                        DATABASE_ID,
                        CONVERSATIONS_COLLECTION_ID,
                        attr.key,
                        attr.required
                    );
                }
                console.log(`✅ Created attribute: ${attr.key}`);
            } catch (error) {
                if (error.code === 409) {
                    console.log(`✅ Attribute ${attr.key} already exists`);
                } else {
                    console.error(`❌ Error creating attribute ${attr.key}:`, error.message);
                }
            }
        }

        // Step 4: Create leads collection
        console.log('👥 Creating leads collection...');
        try {
            await databases.createCollection(
                DATABASE_ID,
                LEADS_COLLECTION_ID,
                'Chat Leads',
                [
                    Permission.read(Role.any()),
                    Permission.create(Role.any()),
                    Permission.update(Role.any()),
                    Permission.delete(Role.any())
                ]
            );
            console.log('✅ Leads collection created');
        } catch (error) {
            if (error.code === 409) {
                console.log('✅ Leads collection already exists');
            } else {
                throw error;
            }
        }

        // Step 5: Create lead attributes
        console.log('📝 Creating lead attributes...');
        const leadAttributes = [
            { key: 'name', type: 'string', size: 100, required: true },
            { key: 'email', type: 'string', size: 255, required: true },
            { key: 'phone', type: 'string', size: 50, required: false },
            { key: 'message', type: 'string', size: 1000, required: true },
            { key: 'source', type: 'string', size: 100, required: true },
            { key: 'session_id', type: 'string', size: 100, required: true },
            { key: 'status', type: 'string', size: 50, required: true },
            { key: 'created_at', type: 'datetime', required: true },
            { key: 'updated_at', type: 'datetime', required: true }
        ];

        for (const attr of leadAttributes) {
            try {
                if (attr.type === 'string') {
                    await databases.createStringAttribute(
                        DATABASE_ID,
                        LEADS_COLLECTION_ID,
                        attr.key,
                        attr.size,
                        attr.required
                    );
                } else if (attr.type === 'datetime') {
                    await databases.createDatetimeAttribute(
                        DATABASE_ID,
                        LEADS_COLLECTION_ID,
                        attr.key,
                        attr.required
                    );
                }
                console.log(`✅ Created lead attribute: ${attr.key}`);
            } catch (error) {
                if (error.code === 409) {
                    console.log(`✅ Lead attribute ${attr.key} already exists`);
                } else {
                    console.error(`❌ Error creating lead attribute ${attr.key}:`, error.message);
                }
            }
        }

        // Step 6: Create knowledge base collection
        console.log('🧠 Creating knowledge base collection...');
        try {
            await databases.createCollection(
                DATABASE_ID,
                KNOWLEDGE_COLLECTION_ID,
                'Chatbot Knowledge Base',
                [
                    Permission.read(Role.any()),
                    Permission.create(Role.any()),
                    Permission.update(Role.any()),
                    Permission.delete(Role.any())
                ]
            );
            console.log('✅ Knowledge base collection created');
        } catch (error) {
            if (error.code === 409) {
                console.log('✅ Knowledge base collection already exists');
            } else {
                throw error;
            }
        }

        // Step 7: Create knowledge base attributes
        console.log('📝 Creating knowledge base attributes...');
        const knowledgeAttributes = [
            { key: 'intent', type: 'string', size: 100, required: true },
            { key: 'keywords', type: 'string', size: 500, required: true },
            { key: 'response_template', type: 'string', size: 2000, required: true },
            { key: 'context', type: 'string', size: 1000, required: false },
            { key: 'priority', type: 'integer', required: true },
            { key: 'active', type: 'boolean', required: true },
            { key: 'created_at', type: 'datetime', required: true },
            { key: 'updated_at', type: 'datetime', required: true }
        ];

        for (const attr of knowledgeAttributes) {
            try {
                if (attr.type === 'string') {
                    await databases.createStringAttribute(
                        DATABASE_ID,
                        KNOWLEDGE_COLLECTION_ID,
                        attr.key,
                        attr.size,
                        attr.required
                    );
                } else if (attr.type === 'integer') {
                    await databases.createIntegerAttribute(
                        DATABASE_ID,
                        KNOWLEDGE_COLLECTION_ID,
                        attr.key,
                        attr.required
                    );
                } else if (attr.type === 'boolean') {
                    await databases.createBooleanAttribute(
                        DATABASE_ID,
                        KNOWLEDGE_COLLECTION_ID,
                        attr.key,
                        attr.required
                    );
                } else if (attr.type === 'datetime') {
                    await databases.createDatetimeAttribute(
                        DATABASE_ID,
                        KNOWLEDGE_COLLECTION_ID,
                        attr.key,
                        attr.required
                    );
                }
                console.log(`✅ Created knowledge attribute: ${attr.key}`);
            } catch (error) {
                if (error.code === 409) {
                    console.log(`✅ Knowledge attribute ${attr.key} already exists`);
                } else {
                    console.error(`❌ Error creating knowledge attribute ${attr.key}:`, error.message);
                }
            }
        }

        // Step 8: Create indexes
        console.log('🔍 Creating database indexes...');
        const indexes = [
            { collection: CONVERSATIONS_COLLECTION_ID, key: 'session_id_index', type: 'key', attributes: ['session_id'] },
            { collection: LEADS_COLLECTION_ID, key: 'email_index', type: 'key', attributes: ['email'] },
            { collection: LEADS_COLLECTION_ID, key: 'session_id_index', type: 'key', attributes: ['session_id'] },
            { collection: KNOWLEDGE_COLLECTION_ID, key: 'intent_index', type: 'key', attributes: ['intent'] },
            { collection: KNOWLEDGE_COLLECTION_ID, key: 'active_index', type: 'key', attributes: ['active'] }
        ];

        for (const index of indexes) {
            try {
                await databases.createIndex(
                    DATABASE_ID,
                    index.collection,
                    index.key,
                    index.type,
                    index.attributes
                );
                console.log(`✅ Created index: ${index.key}`);
            } catch (error) {
                if (error.code === 409) {
                    console.log(`✅ Index ${index.key} already exists`);
                } else {
                    console.error(`❌ Error creating index ${index.key}:`, error.message);
                }
            }
        }

        // Step 9: Populate initial knowledge base
        console.log('📚 Populating initial knowledge base...');
        const initialKnowledge = [
            {
                intent: 'greeting',
                keywords: 'hello,hi,hey,good morning,good afternoon,greetings',
                response_template: 'Hi! I\'m ZeroBot, your business development consultant at Zero Point Labs. I help companies identify digital transformation opportunities and find the right web solutions. What industry is your business in?',
                context: 'Initial greeting and introduction',
                priority: 10,
                active: true
            },
            {
                intent: 'services_inquiry',
                keywords: 'services,what do you do,offerings,solutions,capabilities',
                response_template: 'Zero Point Labs specializes in web development, AI integration, and digital transformation. We offer custom websites, e-commerce platforms, API development, and AI-powered solutions. What specific digital challenge is your business facing?',
                context: 'General services overview',
                priority: 9,
                active: true
            },
            {
                intent: 'pricing_inquiry',
                keywords: 'cost,price,budget,expensive,cheap,how much',
                response_template: 'Our pricing depends on your specific requirements and project scope. Projects typically range from $5,000 for simple websites to $50,000+ for complex enterprise solutions. Can you tell me more about your project requirements?',
                context: 'Pricing and budget discussions',
                priority: 8,
                active: true
            },
            {
                intent: 'ai_integration',
                keywords: 'ai,artificial intelligence,machine learning,automation,chatbot,smart',
                response_template: 'We excel at AI integration! We can add chatbots, automated workflows, intelligent data processing, and more to your business. AI can significantly improve efficiency and customer experience. What processes would you like to automate?',
                context: 'AI and automation services',
                priority: 9,
                active: true
            }
        ];

        for (const knowledge of initialKnowledge) {
            try {
                await databases.createDocument(
                    DATABASE_ID,
                    KNOWLEDGE_COLLECTION_ID,
                    ID.unique(),
                    {
                        ...knowledge,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }
                );
                console.log(`✅ Added knowledge: ${knowledge.intent}`);
            } catch (error) {
                console.log(`ℹ️ Knowledge ${knowledge.intent} might already exist`);
            }
        }

        console.log('\n🎉 Appwrite project initialization completed successfully!');
        console.log('\n📋 Summary:');
        console.log(`✅ Database: ${DATABASE_ID}`);
        console.log(`✅ Collections: ${CONVERSATIONS_COLLECTION_ID}, ${LEADS_COLLECTION_ID}, ${KNOWLEDGE_COLLECTION_ID}`);
        console.log(`✅ Initial knowledge base populated`);
        console.log('\n🚀 Your chatbot is now ready to use!');

    } catch (error) {
        console.error('❌ Error initializing Appwrite project:', error);
        process.exit(1);
    }
}

// Run initialization
initializeAppwriteProject(); 