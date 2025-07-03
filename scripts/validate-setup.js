#!/usr/bin/env node

const { Client, Databases } = require('node-appwrite');

async function validateSetup() {
  console.log('🔍 Validating Appwrite Analytics Setup...\n');
  
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '6861736a0007a58bac63')
      .setKey(process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);

    // Test database connection
    console.log('📡 Testing database connection...');
    await databases.get('analytics');
    console.log('✅ Database "analytics" found');

    // Test collections
    const collections = ['events', 'form_submissions', 'api_keys'];
    
    for (const collectionId of collections) {
      try {
        console.log(`📋 Testing collection "${collectionId}"...`);
        const collection = await databases.getCollection('analytics', collectionId);
        console.log(`✅ Collection "${collectionId}" found with ${collection.attributes.length} attributes`);
        
        // Check for critical attributes
        const attributes = collection.attributes.map(attr => attr.key);
        if (collectionId === 'events' && attributes.includes('timestamp')) {
          console.log('✅ Critical "timestamp" attribute found in events');
        }
      } catch (error) {
        console.log(`❌ Collection "${collectionId}" issue:`, error.message);
      }
    }

    // Test a simple create operation
    console.log('\n🧪 Testing write permissions...');
    try {
      await databases.createDocument('analytics', 'events', 'test', {
        event_type: 'test',
        page_url: 'https://test.com',
        user_agent: 'test-agent',
        ip_address: '127.0.0.1',
        session_id: 'test-session',
        timestamp: new Date().toISOString(),
        domain: 'test.com'
      });
      
      // Clean up test document
      await databases.deleteDocument('analytics', 'events', 'test');
      console.log('✅ Write permissions working correctly');
      
    } catch (error) {
      console.log('❌ Write permission issue:', error.message);
    }

    console.log('\n🎉 Validation complete!');
    
  } catch (error) {
    console.log('❌ Setup validation failed:', error.message);
    console.log('\n💡 Make sure:');
    console.log('1. Database "analytics" exists');
    console.log('2. All collections have their required attributes');
    console.log('3. Permissions are set to "Any" for all operations');
  }
}

validateSetup(); 