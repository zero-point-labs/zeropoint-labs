import { databases } from './appwrite';

// Database and Collection IDs
export const DATABASE_ID = 'analytics';
export const EVENTS_COLLECTION_ID = 'events';
export const FORMS_COLLECTION_ID = 'form_submissions';
export const API_KEYS_COLLECTION_ID = 'api_keys';

// Collection schemas
const eventSchema = [
  { key: 'event_type', type: 'string', size: 50, required: true },
  { key: 'page_url', type: 'string', size: 2000, required: true },
  { key: 'page_title', type: 'string', size: 500, required: false },
  { key: 'referrer', type: 'string', size: 2000, required: false },
  { key: 'user_agent', type: 'string', size: 1000, required: true },
  { key: 'ip_address', type: 'string', size: 45, required: true },
  { key: 'session_id', type: 'string', size: 100, required: true },
  { key: 'user_id', type: 'string', size: 100, required: false },
  { key: 'event_data', type: 'string', size: 5000, required: false }, // JSON string
  { key: 'timestamp', type: 'datetime', required: true },
  { key: 'domain', type: 'string', size: 255, required: true },
  { key: 'device_type', type: 'string', size: 20, required: false },
  { key: 'browser', type: 'string', size: 50, required: false },
  { key: 'os', type: 'string', size: 50, required: false },
  { key: 'country', type: 'string', size: 100, required: false },
  { key: 'city', type: 'string', size: 100, required: false }
];

const formSchema = [
  { key: 'form_name', type: 'string', size: 255, required: true },
  { key: 'form_id', type: 'string', size: 100, required: false },
  { key: 'fields', type: 'string', size: 10000, required: true }, // JSON string
  { key: 'page_url', type: 'string', size: 2000, required: true },
  { key: 'user_agent', type: 'string', size: 1000, required: true },
  { key: 'ip_address', type: 'string', size: 45, required: true },
  { key: 'session_id', type: 'string', size: 100, required: true },
  { key: 'user_id', type: 'string', size: 100, required: false },
  { key: 'timestamp', type: 'datetime', required: true },
  { key: 'status', type: 'string', size: 20, required: true },
  { key: 'priority', type: 'string', size: 10, required: true },
  { key: 'source', type: 'string', size: 255, required: true },
  { key: 'referrer', type: 'string', size: 2000, required: false },
  { key: 'utm_params', type: 'string', size: 1000, required: false } // JSON string
];

const apiKeySchema = [
  { key: 'key_name', type: 'string', size: 255, required: true },
  { key: 'api_key', type: 'string', size: 64, required: true },
  { key: 'domain', type: 'string', size: 255, required: true },
  { key: 'user_id', type: 'string', size: 100, required: true },
  { key: 'created_at', type: 'datetime', required: true },
  { key: 'last_used', type: 'datetime', required: false },
  { key: 'is_active', type: 'boolean', required: true },
  { key: 'usage_count', type: 'integer', required: true }
];

/**
 * Setup Analytics Database and Collections
 * This function provides setup instructions and validates the configuration
 */
export async function setupAnalyticsDatabase(): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> {
  try {
    console.log('🚀 Analytics Database Setup Instructions');
    console.log('==========================================');
    console.log();
    console.log('📝 Manual Setup Required in Appwrite Console:');
    console.log();
    
    console.log('1️⃣ Create Database:');
    console.log(`   - Go to Appwrite Console > Databases`);
    console.log(`   - Create new database with ID: "${DATABASE_ID}"`);
    console.log(`   - Name: "Analytics Database"`);
    console.log();
    
    console.log('2️⃣ Create Collections:');
    console.log(`   a) Events Collection (ID: "${EVENTS_COLLECTION_ID}")`);
    console.log(`   b) Form Submissions Collection (ID: "${FORMS_COLLECTION_ID}")`);
    console.log(`   c) API Keys Collection (ID: "${API_KEYS_COLLECTION_ID}")`);
    console.log();
    
    console.log('3️⃣ Collection Attributes:');
    console.log();
    console.log('📊 Events Collection Attributes:');
    eventSchema.forEach(attr => {
      console.log(`   - ${attr.key} (${attr.type}${attr.size ? `, size: ${attr.size}` : ''}${attr.required ? ', required' : ', optional'})`);
    });
    
    console.log('\n📝 Form Submissions Collection Attributes:');
    formSchema.forEach(attr => {
      console.log(`   - ${attr.key} (${attr.type}${attr.size ? `, size: ${attr.size}` : ''}${attr.required ? ', required' : ', optional'})`);
    });
    
    console.log('\n🔑 API Keys Collection Attributes:');
    apiKeySchema.forEach(attr => {
      console.log(`   - ${attr.key} (${attr.type}${attr.size ? `, size: ${attr.size}` : ''}${attr.required ? ', required' : ', optional'})`);
    });

    console.log('\n4️⃣ Set Permissions for all collections:');
    console.log('   - Read: Any');
    console.log('   - Write: Any');
    console.log('   - Create: Any');
    console.log('   - Update: Any');
    console.log('   - Delete: Any');

    console.log('\n5️⃣ Create Indexes for better performance:');
    console.log('   Events Collection:');
    console.log('     - timestamp (DESC)');
    console.log('     - domain + timestamp');
    console.log('     - session_id + timestamp');
    console.log('     - event_type + timestamp');
    
    console.log('   Form Submissions Collection:');
    console.log('     - timestamp (DESC)');
    console.log('     - status + timestamp');
    console.log('     - priority + timestamp');

    console.log('\n✅ After setup, run validateSetup() to verify everything is working.');

    return {
      success: true,
      message: 'Setup instructions displayed. Please create the database and collections manually in Appwrite Console.',
      details: {
        database_id: DATABASE_ID,
        collections: {
          events: EVENTS_COLLECTION_ID,
          forms: FORMS_COLLECTION_ID,
          api_keys: API_KEYS_COLLECTION_ID
        },
        schemas: {
          events: eventSchema,
          forms: formSchema,
          api_keys: apiKeySchema
        }
      }
    };

  } catch (error: any) {
    console.error('❌ Setup failed:', error);
    return {
      success: false,
      message: `Setup failed: ${error.message}`,
      details: error
    };
  }
}

/**
 * Generate a new API key for tracking
 */
export function generateAPIKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'zp_';
  for (let i = 0; i < 48; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Validate database setup
 */
export async function validateSetup(): Promise<{
  success: boolean;
  message: string;
  collections: string[];
  details?: any;
}> {
  try {
    console.log('🔍 Validating Analytics Database Setup...');
    
    // Test if we can access the collections by trying to list documents
    const tests = [];
    
    // Test Events collection
    try {
      await databases.listDocuments(DATABASE_ID, EVENTS_COLLECTION_ID, []);
      tests.push({ collection: 'events', status: 'success' });
      console.log('✅ Events collection accessible');
    } catch (error) {
      tests.push({ collection: 'events', status: 'failed', error: error });
      console.log('❌ Events collection not accessible');
    }
    
    // Test Forms collection
    try {
      await databases.listDocuments(DATABASE_ID, FORMS_COLLECTION_ID, []);
      tests.push({ collection: 'forms', status: 'success' });
      console.log('✅ Form submissions collection accessible');
    } catch (error) {
      tests.push({ collection: 'forms', status: 'failed', error: error });
      console.log('❌ Form submissions collection not accessible');
    }
    
    // Test API Keys collection
    try {
      await databases.listDocuments(DATABASE_ID, API_KEYS_COLLECTION_ID, []);
      tests.push({ collection: 'api_keys', status: 'success' });
      console.log('✅ API keys collection accessible');
    } catch (error) {
      tests.push({ collection: 'api_keys', status: 'failed', error: error });
      console.log('❌ API keys collection not accessible');
    }
    
    const successfulTests = tests.filter(test => test.status === 'success');
    const failedTests = tests.filter(test => test.status === 'failed');
    
    if (failedTests.length === 0) {
      console.log('🎉 All collections are properly set up and accessible!');
      return {
        success: true,
        message: 'All collections are properly set up and accessible',
        collections: successfulTests.map(test => test.collection),
        details: { tests }
      };
    } else {
      console.log(`⚠️ ${failedTests.length} collection(s) failed validation`);
      return {
        success: false,
        message: `Failed to access: ${failedTests.map(test => test.collection).join(', ')}`,
        collections: successfulTests.map(test => test.collection),
        details: { tests }
      };
    }
  } catch (error: any) {
    console.error('❌ Validation failed:', error);
    return {
      success: false,
      message: `Validation failed: ${error.message}`,
      collections: [],
      details: { error }
    };
  }
}

/**
 * Test analytics tracking by sending a sample event
 */
export async function testAnalyticsTracking(): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> {
  try {
    console.log('🧪 Testing analytics tracking...');
    
    const testEvent = {
      event_type: 'test',
      page_url: 'https://example.com/test',
      page_title: 'Test Page',
      referrer: '',
      user_agent: 'Test User Agent',
      ip_address: '127.0.0.1',
      session_id: 'test_session_' + Date.now(),
      user_id: 'test_user',
      event_data: '{"test": true}',
      timestamp: new Date().toISOString(),
      domain: 'example.com',
      device_type: 'desktop',
      browser: 'Test Browser',
      os: 'Test OS',
      country: 'Test Country',
      city: 'Test City'
    };
    
    const response = await fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testEvent)
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Test tracking successful!');
      return {
        success: true,
        message: 'Analytics tracking is working correctly',
        details: { event_id: result.id, test_event: testEvent }
      };
    } else {
      console.log('❌ Test tracking failed:', result.error);
      return {
        success: false,
        message: `Tracking test failed: ${result.error}`,
        details: result
      };
    }
  } catch (error: any) {
    console.error('❌ Test failed:', error);
    return {
      success: false,
      message: `Test failed: ${error.message}`,
      details: error
    };
  }
}

/**
 * Database setup instructions
 */
export const setupInstructions = `
# Analytics Database Setup Instructions

## Step 1: Manual Database Setup in Appwrite Console

### 1. Create Database
- Go to Appwrite Console > Databases
- Create new database with ID: "analytics"
- Name: "Analytics Database"

### 2. Create Collections
Create three collections with the following IDs:
- events
- form_submissions  
- api_keys

### 3. Set Permissions
For all collections, set permissions to:
- Read: Any
- Write: Any
- Create: Any
- Update: Any
- Delete: Any

### 4. Create Attributes

#### Events Collection Attributes:
- event_type (String, 50 chars, required)
- page_url (String, 2000 chars, required)
- page_title (String, 500 chars, optional)
- referrer (String, 2000 chars, optional)
- user_agent (String, 1000 chars, required)
- ip_address (String, 45 chars, required)
- session_id (String, 100 chars, required)
- user_id (String, 100 chars, optional)
- event_data (String, 5000 chars, optional)
- timestamp (DateTime, required)
- domain (String, 255 chars, required)
- device_type (String, 20 chars, optional)
- browser (String, 50 chars, optional)
- os (String, 50 chars, optional)
- country (String, 100 chars, optional)
- city (String, 100 chars, optional)

#### Form Submissions Collection Attributes:
- form_name (String, 255 chars, required)
- form_id (String, 100 chars, optional)
- fields (String, 10000 chars, required)
- page_url (String, 2000 chars, required)
- user_agent (String, 1000 chars, required)
- ip_address (String, 45 chars, required)
- session_id (String, 100 chars, required)
- user_id (String, 100 chars, optional)
- timestamp (DateTime, required)
- status (String, 20 chars, required)
- priority (String, 10 chars, required)
- source (String, 255 chars, required)
- referrer (String, 2000 chars, optional)
- utm_params (String, 1000 chars, optional)

#### API Keys Collection Attributes:
- key_name (String, 255 chars, required)
- api_key (String, 64 chars, required)
- domain (String, 255 chars, required)
- user_id (String, 100 chars, required)
- created_at (DateTime, required)
- last_used (DateTime, optional)
- is_active (Boolean, required)
- usage_count (Integer, required)

### 5. Create Indexes for Performance
- Events: timestamp (DESC), domain+timestamp, session_id+timestamp
- Forms: timestamp (DESC), status+timestamp, priority+timestamp

## Step 2: Programmatic Setup and Testing

\`\`\`typescript
import { setupAnalyticsDatabase, validateSetup, testAnalyticsTracking } from '@/lib/setup-analytics';

// Display setup instructions
await setupAnalyticsDatabase();

// Validate setup after manual creation
const validation = await validateSetup();
console.log(validation);

// Test analytics tracking
const trackingTest = await testAnalyticsTracking();
console.log(trackingTest);
\`\`\`

## Step 3: Integration

After successful setup:
1. Add the analytics script to your website
2. Start tracking events
3. View data in the analytics dashboard
`; 