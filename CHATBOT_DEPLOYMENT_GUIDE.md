# 🤖 Zero Point Labs Chatbot - Complete Deployment Guide

## 🎯 Overview

This guide provides a complete solution to fix all critical chatbot issues and deploy a fully functional business consultant chatbot with Appwrite integration.

## 🚨 Critical Issues Fixed

### ✅ 1. Missing API Route
- **Issue**: Frontend calling `/api/chat` but route didn't exist (404 error)
- **Fix**: Created `src/app/api/chat/route.ts` with streaming support
- **Result**: Chatbot now responds properly

### ✅ 2. SDK Version Compatibility  
- **Issue**: Code used Appwrite SDK 18.1.1 but server runs 1.5.7
- **Fix**: Downgraded to compatible version 13.0.1
- **Result**: API calls work without version conflicts

### ✅ 3. Appwrite Project Setup
- **Issue**: Project "zeropoint-labs" doesn't exist
- **Fix**: Created automated initialization script
- **Result**: Database collections and schema ready

### ✅ 4. Database Schema
- **Issue**: Missing collections for conversations, leads, knowledge
- **Fix**: Automated creation with proper attributes and indexes
- **Result**: Full session persistence and business context

## 🚀 Quick Deployment (5 Minutes)

### Step 1: Upload Fixed Files to VPS
```bash
# Upload to your VPS
scp -r . root@zeropoint-labs.com:/var/www/zeropoint-labs/
```

### Step 2: Run Deployment Script
```bash
ssh root@zeropoint-labs.com
cd /var/www/zeropoint-labs/
chmod +x deploy-production-fix.sh
./deploy-production-fix.sh
```

### Step 3: Setup Appwrite Project
1. Visit: https://zeropoint-labs.com/console
2. Create admin account
3. Create project with ID: `zeropoint-labs`
4. Copy API key to `.env.local`
5. Run: `npm run init-appwrite`

## 📋 Detailed Setup Process

### Prerequisites
- VPS with Docker and Docker Compose
- Domain pointing to VPS
- OpenAI API key

### 1. Environment Configuration

Create/update `.env.local`:
```bash
# OpenAI Configuration
OPENAI_API_KEY=your_actual_openai_api_key

# Appwrite Configuration  
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://zeropoint-labs.com/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=zeropoint-labs
APPWRITE_API_KEY=your_appwrite_api_key

# Database Configuration
MYSQL_ROOT_PASSWORD=YourSecureRootPassword123!
MYSQL_PASSWORD=YourSecureDatabasePassword123!
APPWRITE_SECRET_KEY=YourSecureAppwriteSecret123!
```

### 2. Docker Services

The deployment includes:
- **Next.js App**: Main website on port 3000
- **Appwrite**: Backend services on port 80
- **MariaDB**: Database for Appwrite
- **Redis**: Caching for Appwrite
- **Nginx**: Reverse proxy with SSL

### 3. Database Schema

Automatically creates:

#### Conversations Collection
```javascript
{
  session_id: "string",
  messages: "string", // JSON array
  user_intent: "string",
  detected_needs: "string",
  lead_info: "string",
  business_context: "string",
  created_at: "datetime",
  updated_at: "datetime"
}
```

#### Leads Collection  
```javascript
{
  name: "string",
  email: "string", 
  phone: "string",
  message: "string",
  source: "string",
  session_id: "string",
  status: "string",
  created_at: "datetime",
  updated_at: "datetime"
}
```

#### Knowledge Base Collection
```javascript
{
  intent: "string",
  keywords: "string",
  response_template: "string", 
  context: "string",
  priority: "integer",
  active: "boolean",
  created_at: "datetime",
  updated_at: "datetime"
}
```

## 🔧 API Endpoints

### Chat Endpoints
- `POST /api/chat` - Main chat endpoint (streaming)
- `POST /api/chat/message` - Alternative message endpoint
- `GET /api/chat/history/:sessionId` - Get conversation history
- `POST /api/chat/lead` - Capture lead information

### Response Format
```json
{
  "message": "AI response text",
  "intent": "detected_intent",
  "confidence": 0.95,
  "suggestedActions": ["Follow up", "Schedule call"],
  "leadCapturePrompt": false,
  "sessionId": "session_123"
}
```

## 🧪 Testing & Validation

### 1. API Health Checks
```bash
# Test Appwrite API
curl https://zeropoint-labs.com/v1/health

# Test Chat API  
curl https://zeropoint-labs.com/api/chat

# Test with message
curl -X POST https://zeropoint-labs.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "sessionId": "test123"}'
```

### 2. Database Connectivity
```bash
# Test MariaDB connection
docker exec appwrite-mariadb mysql -u appwrite -p -e "SELECT 1;" appwrite

# View Appwrite logs
docker-compose -f docker-compose.appwrite.yml logs -f appwrite
```

### 3. Frontend Testing
1. Visit https://zeropoint-labs.com
2. Open chat widget
3. Send test message
4. Verify response time < 5 seconds
5. Refresh page and check session persistence

## 🎯 Expected Results

| Feature | Before Fix | After Fix |
|---------|------------|-----------|
| Response Time | 45+ seconds | 2-5 seconds ⚡ |
| API Errors | 404/502 errors | Working properly ✅ |
| Session Memory | None | Full persistence 🧠 |
| Business Context | Generic AI | Consultant focus 🎯 |
| Lead Capture | Broken | Working integration 📋 |

## 🛠️ Troubleshooting

### Common Issues

#### 1. Appwrite Not Responding
```bash
# Check container status
docker-compose -f docker-compose.appwrite.yml ps

# Restart Appwrite
docker-compose -f docker-compose.appwrite.yml restart appwrite

# Check logs
docker-compose -f docker-compose.appwrite.yml logs appwrite
```

#### 2. Database Connection Failed
```bash
# Check MariaDB status
docker-compose -f docker-compose.appwrite.yml logs mariadb

# Test connection
docker exec appwrite-mariadb mysql -u appwrite -p -e "SELECT 1;" appwrite
```

#### 3. Chat API Returns 500
```bash
# Check Next.js logs
docker logs zeropoint-labs-website

# Verify environment variables
docker exec zeropoint-labs-website env | grep -E "(OPENAI|APPWRITE)"
```

### 4. Project Creation Issues
```bash
# Manually create project via API
curl -X POST https://zeropoint-labs.com/v1/projects \
  -H "Content-Type: application/json" \
  -H "X-Appwrite-Project: console" \
  -H "X-Appwrite-Key: your-api-key" \
  -d '{"projectId": "zeropoint-labs", "name": "Zero Point Labs"}'
```

## 📞 Support & Monitoring

### Log Locations
- **Appwrite**: `docker-compose -f docker-compose.appwrite.yml logs -f appwrite`
- **MariaDB**: `docker-compose -f docker-compose.appwrite.yml logs -f mariadb`  
- **Next.js**: `docker logs zeropoint-labs-website`
- **Nginx**: `docker logs zeropoint-nginx`

### Health Monitoring
```bash
# Create monitoring script
cat > monitor.sh << 'EOF'
#!/bin/bash
echo "🔍 Health Check: $(date)"
echo "Appwrite API: $(curl -s -o /dev/null -w "%{http_code}" https://zeropoint-labs.com/v1/health)"
echo "Chat API: $(curl -s -o /dev/null -w "%{http_code}" https://zeropoint-labs.com/api/chat)"
echo "Website: $(curl -s -o /dev/null -w "%{http_code}" https://zeropoint-labs.com)"
EOF

chmod +x monitor.sh
./monitor.sh
```

## 🎉 Success Metrics

After successful deployment:
- ✅ Appwrite console accessible at `/console`
- ✅ Chat responses in 2-5 seconds
- ✅ Session persistence across page reloads
- ✅ Business-focused AI responses
- ✅ Lead capture integration working
- ✅ Database storing conversations
- ✅ No 404/502 errors

## 🔄 Ongoing Maintenance

### Weekly Tasks
1. Check container health: `docker ps`
2. Monitor logs for errors
3. Test chat functionality
4. Review captured leads in database

### Monthly Tasks
1. Update SSL certificates if needed
2. Review and optimize database performance
3. Update knowledge base content
4. Analyze chat conversation patterns

---

**Need Help?** Contact: info@zeropointlabs.com 