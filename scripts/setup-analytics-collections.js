const { Client, Databases, Permission, Role } = require('node-appwrite');
require('dotenv').config({ path: '.env.local' });

// Initialize Appwrite client
const client = new Client();
const databases = new Databases(client);

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '6861736a0007a58bac63')
  .setKey(process.env.APPWRITE_API_KEY); // Server API key needed for collection creation

const DATABASE_ID = 'crm_database';

async function createAnalyticsCollections() {
  try {
    console.log('🚀 Setting up Analytics Collections...');

    // Create Websites Collection
    try {
      console.log('📝 Creating websites collection...');
      const websitesCollection = await databases.createCollection(
        DATABASE_ID,
        'websites',
        'Websites',
        [
          Permission.read(Role.any()),
          Permission.write(Role.any()),
          Permission.delete(Role.any())
        ]
      );
      console.log('✅ Websites collection created:', websitesCollection.$id);

      // Create attributes for websites collection
      await databases.createStringAttribute(DATABASE_ID, 'websites', 'userId', 255, true);
      await databases.createStringAttribute(DATABASE_ID, 'websites', 'domain', 255, true);
      await databases.createBooleanAttribute(DATABASE_ID, 'websites', 'verified', false, false);
      await databases.createDatetimeAttribute(DATABASE_ID, 'websites', 'createdAt', true);
      await databases.createDatetimeAttribute(DATABASE_ID, 'websites', 'updatedAt', true);

      // Create indexes
      await databases.createIndex(DATABASE_ID, 'websites', 'userId_index', 'key', ['userId']);
      await databases.createIndex(DATABASE_ID, 'websites', 'domain_index', 'key', ['domain']);
      
      console.log('✅ Websites collection attributes and indexes created');

    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️ Websites collection already exists');
      } else {
        throw error;
      }
    }

    // Create Events Collection
    try {
      console.log('📝 Creating events collection...');
      const eventsCollection = await databases.createCollection(
        DATABASE_ID,
        'events',
        'Events',
        [
          Permission.read(Role.any()),
          Permission.write(Role.any()),
          Permission.delete(Role.any())
        ]
      );
      console.log('✅ Events collection created:', eventsCollection.$id);

      // Create attributes for events collection
      await databases.createStringAttribute(DATABASE_ID, 'events', 'userId', 255, true);
      await databases.createStringAttribute(DATABASE_ID, 'events', 'website', 255, true);
      await databases.createStringAttribute(DATABASE_ID, 'events', 'eventType', 100, true);
      await databases.createStringAttribute(DATABASE_ID, 'events', 'path', 500, true);
      await databases.createDatetimeAttribute(DATABASE_ID, 'events', 'timestamp', true);
      await databases.createStringAttribute(DATABASE_ID, 'events', 'sessionId', 255, true);
      await databases.createStringAttribute(DATABASE_ID, 'events', 'hashedIP', 255, false);
      await databases.createStringAttribute(DATABASE_ID, 'events', 'metadata', 16384, false); // Large text for JSON
      await databases.createDatetimeAttribute(DATABASE_ID, 'events', 'createdAt', true);

      // Create indexes for efficient querying
      await databases.createIndex(DATABASE_ID, 'events', 'userId_index', 'key', ['userId']);
      await databases.createIndex(DATABASE_ID, 'events', 'website_index', 'key', ['website']);
      await databases.createIndex(DATABASE_ID, 'events', 'eventType_index', 'key', ['eventType']);
      await databases.createIndex(DATABASE_ID, 'events', 'timestamp_index', 'key', ['timestamp']);
      await databases.createIndex(DATABASE_ID, 'events', 'sessionId_index', 'key', ['sessionId']);
      await databases.createIndex(DATABASE_ID, 'events', 'userId_website_index', 'key', ['userId', 'website']);
      await databases.createIndex(DATABASE_ID, 'events', 'userId_timestamp_index', 'key', ['userId', 'timestamp']);
      
      console.log('✅ Events collection attributes and indexes created');

    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️ Events collection already exists');
      } else {
        throw error;
      }
    }

    console.log('🎉 Analytics collections setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Start your development server: npm run dev');
    console.log('2. Navigate to /setup to add your first website');
    console.log('3. Install the tracking script on your website');
    console.log('4. View analytics at /dashboard/analytics');

  } catch (error) {
    console.error('❌ Error setting up collections:', error);
    process.exit(1);
  }
}

// Run the setup
createAnalyticsCollections(); 