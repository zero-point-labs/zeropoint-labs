#!/usr/bin/env node

const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

console.log('🚀 ZeroPoint Labs Analytics - Appwrite Setup');
console.log('='.repeat(50));
console.log();

async function runSetup() {
  try {
    console.log('📋 STEP 1: Database Setup Instructions');
    console.log('-'.repeat(40));
    console.log();
    console.log('Please follow these steps in your Appwrite Console:');
    console.log('🌐 Go to: https://cloud.appwrite.io/console');
    console.log('📁 Navigate to: Project (6861736a0007a58bac63) > Databases');
    console.log();
    
    console.log('1️⃣ CREATE DATABASE:');
    console.log('   • Click "Create Database"');
    console.log('   • Database ID: analytics');
    console.log('   • Name: Analytics Database');
    console.log('   • Click "Create"');
    console.log();
    
    console.log('2️⃣ CREATE COLLECTIONS (inside the analytics database):');
    console.log();
    console.log('   📊 Collection 1: Events');
    console.log('   • Collection ID: events');
    console.log('   • Name: Events');
    console.log();
    console.log('   📝 Collection 2: Form Submissions');
    console.log('   • Collection ID: form_submissions');
    console.log('   • Name: Form Submissions');
    console.log();
    console.log('   🔑 Collection 3: API Keys');
    console.log('   • Collection ID: api_keys');
    console.log('   • Name: API Keys');
    console.log();
    
    console.log('3️⃣ ADD ATTRIBUTES TO EACH COLLECTION:');
    console.log();
    console.log('   📊 EVENTS COLLECTION ATTRIBUTES:');
    console.log('   ────────────────────────────────');
    const eventAttrs = [
      'event_type (String, 50 chars, required)',
      'page_url (String, 2000 chars, required)',
      'page_title (String, 500 chars, optional)',
      'referrer (String, 2000 chars, optional)',
      'user_agent (String, 1000 chars, required)',
      'ip_address (String, 45 chars, required)',
      'session_id (String, 100 chars, required)',
      'user_id (String, 100 chars, optional)',
      'event_data (String, 5000 chars, optional)',
      'timestamp (DateTime, required)',
      'domain (String, 255 chars, required)',
      'device_type (String, 20 chars, optional)',
      'browser (String, 50 chars, optional)',
      'os (String, 50 chars, optional)',
      'country (String, 100 chars, optional)',
      'city (String, 100 chars, optional)'
    ];
    
    eventAttrs.forEach((attr, i) => {
      console.log(`   ${i + 1}. ${attr}`);
    });
    
    console.log();
    console.log('   📝 FORM SUBMISSIONS COLLECTION ATTRIBUTES:');
    console.log('   ─────────────────────────────────────────');
    const formAttrs = [
      'form_name (String, 255 chars, required)',
      'form_id (String, 100 chars, optional)',
      'fields (String, 10000 chars, required)',
      'page_url (String, 2000 chars, required)',
      'user_agent (String, 1000 chars, required)',
      'ip_address (String, 45 chars, required)',
      'session_id (String, 100 chars, required)',
      'user_id (String, 100 chars, optional)',
      'timestamp (DateTime, required)',
      'status (String, 20 chars, required)',
      'priority (String, 10 chars, required)',
      'source (String, 255 chars, required)',
      'referrer (String, 2000 chars, optional)',
      'utm_params (String, 1000 chars, optional)'
    ];
    
    formAttrs.forEach((attr, i) => {
      console.log(`   ${i + 1}. ${attr}`);
    });
    
    console.log();
    console.log('   🔑 API KEYS COLLECTION ATTRIBUTES:');
    console.log('   ─────────────────────────────────');
    const apiAttrs = [
      'key_name (String, 255 chars, required)',
      'api_key (String, 64 chars, required)',
      'domain (String, 255 chars, required)',
      'user_id (String, 100 chars, required)',
      'created_at (DateTime, required)',
      'last_used (DateTime, optional)',
      'is_active (Boolean, required)',
      'usage_count (Integer, required)'
    ];
    
    apiAttrs.forEach((attr, i) => {
      console.log(`   ${i + 1}. ${attr}`);
    });
    
    console.log();
    console.log('4️⃣ SET PERMISSIONS (for all collections):');
    console.log('   • Click on "Settings" tab for each collection');
    console.log('   • Under "Permissions" section:');
    console.log('     - Read: Any');
    console.log('     - Create: Any');
    console.log('     - Update: Any');
    console.log('     - Delete: Any');
    console.log();
    
    console.log('5️⃣ CREATE INDEXES (for better performance):');
    console.log('   • Go to "Indexes" tab for each collection');
    console.log('   • Events Collection:');
    console.log('     - timestamp_desc (timestamp, descending)');
    console.log('     - domain_timestamp (domain + timestamp)');
    console.log('     - session_timestamp (session_id + timestamp)');
    console.log('   • Form Submissions:');
    console.log('     - timestamp_desc (timestamp, descending)');
    console.log('     - status_timestamp (status + timestamp)');
    console.log();
    
    console.log('✅ After completing the setup, run this script again to validate!');
    console.log();
    console.log('Would you like to continue with validation? (y/n)');
    
    // Simple prompt simulation
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', async (key) => {
      const input = key.toString();
      if (input.toLowerCase() === 'y') {
        console.log('\n🔍 Starting validation...\n');
        await validateSetup();
      } else {
        console.log('\n👋 Setup complete! Run this script again when ready to validate.\n');
        process.exit(0);
      }
    });
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

async function validateSetup() {
  try {
    console.log('📡 Testing Appwrite connection...');
    
    // Test the validation endpoint
    const response = await fetch('http://localhost:3000/api/analytics/track', {
      method: 'GET'
    });
    
    if (response.ok) {
      console.log('✅ API endpoints are accessible');
      
      // Test actual tracking
      console.log('🧪 Testing analytics tracking...');
      
      const testEvent = {
        event_type: 'test',
        page_url: 'https://example.com/setup-test',
        page_title: 'Setup Test Page',
        referrer: '',
        session_id: 'setup_test_' + Date.now(),
        user_id: 'setup_test_user',
        event_data: { test: true, setup: 'validation' }
      };
      
      const trackResponse = await fetch('http://localhost:3000/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testEvent)
      });
      
      const result = await trackResponse.json();
      
      if (result.success) {
        console.log('🎉 Analytics tracking test successful!');
        console.log('📊 Event ID:', result.id);
        
        // Test data retrieval
        console.log('📈 Testing data retrieval...');
        const dataResponse = await fetch('http://localhost:3000/api/analytics/data');
        const dataResult = await dataResponse.json();
        
        if (dataResult.success) {
          console.log('✅ Data retrieval working!');
          console.log('📊 Current stats:');
          console.log(`   • Page views: ${dataResult.data.overview.pageviews}`);
          console.log(`   • Users: ${dataResult.data.overview.unique_users}`);
          console.log(`   • Sessions: ${dataResult.data.overview.sessions}`);
          console.log(`   • Total events: ${dataResult.data.time_range.total_events}`);
        } else {
          console.log('⚠️ Data retrieval test failed:', dataResult.error);
        }
        
        console.log();
        console.log('🚀 SETUP COMPLETE!');
        console.log('═'.repeat(50));
        console.log('✅ Your analytics system is ready to use!');
        console.log();
        console.log('Next steps:');
        console.log('1. Add the analytics script to your website');
        console.log('2. Check the dashboard at: http://localhost:3000/dashboard/analytics');
        console.log('3. View form submissions at: http://localhost:3000/dashboard/forms');
        console.log();
        console.log('Analytics Script:');
        console.log('<script src="http://localhost:3000/analytics.js" data-domain="yourdomain.com"></script>');
        console.log();
        
      } else {
        console.log('❌ Analytics tracking test failed:', result.error);
        console.log('📝 Please check:');
        console.log('1. Database and collections are created correctly');
        console.log('2. All attributes are added with correct types');
        console.log('3. Permissions are set to "Any" for all operations');
      }
      
    } else {
      console.log('❌ API endpoints not accessible');
      console.log('Make sure your Next.js dev server is running');
    }
    
  } catch (error) {
    console.log('❌ Validation failed:', error.message);
    console.log('📝 Make sure:');
    console.log('1. Next.js dev server is running (npm run dev)');
    console.log('2. Appwrite database and collections are set up');
    console.log('3. Internet connection is stable');
  }
  
  process.exit(0);
}

// Start the setup process
runSetup(); 