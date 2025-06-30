# 🤖 Chatbot Deployment Guide

This guide will walk you through deploying the AI chatbot to your Hostinger VPS with Appwrite database.

## 📋 Prerequisites

- ✅ Hostinger VPS with Docker installed
- ✅ Appwrite instance running on your VPS
- ✅ OpenAI API key
- ✅ Domain configured (zeropoint-labs.com)

## 🚀 Deployment Steps

### Step 1: Prepare Environment Variables

Make sure your `.env.local` file contains all required variables:

```bash
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://zeropoint-labs.com/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=zeropoint-labs
APPWRITE_API_KEY=your_appwrite_api_key_here

# Additional Configuration
CHATBOT_SESSION_TIMEOUT=86400000
```

### Step 2: Deploy to Production

1. **Build and deploy the application:**
   ```bash
   # On your VPS
   git pull origin main
   npm install
   npm run build
   ```

2. **Initialize the database:**
   ```bash
   npm run init-db
   ```

3. **Start the production server:**
   ```bash
   npm start
   # or with Docker
   docker-compose up -d
   ```

### Step 3: Verify Deployment

1. **Check API endpoints:**
   ```bash
   # Test chat API
   curl -X GET https://zeropoint-labs.com/api/chat/message
   
   # Test lead API
   curl -X GET https://zeropoint-labs.com/api/chat/lead
   ```

2. **Test the chatbot:**
   - Visit your website
   - Scroll to the chat section
   - Send a test message
   - Verify AI responses

## 🗄️ Database Setup

The `npm run init-db` command will automatically:

1. ✅ Create the `main` database
2. ✅ Create `chatbot_knowledge` collection
3. ✅ Create `chat_conversations` collection  
4. ✅ Create `chat_leads` collection
5. ✅ Populate knowledge base with default entries
6. ✅ Set up proper indexes and permissions

### Manual Database Setup (Alternative)

If you prefer to set up the database manually via Appwrite Console:

#### 1. Create Database
- Database ID: `main`
- Name: `Main Database`

#### 2. Create Collections

**chatbot_knowledge:**
```
- intent (string, 100 chars, required)
- question_keywords (string, 1000 chars, required)
- response (string, 5000 chars, required)
- priority (integer, 1-10, default: 5)
```

**chat_conversations:**
```
- session_id (string, 100 chars, required)
- messages (string, 50000 chars)
- user_intent (string, 100 chars)
- detected_needs (string, 1000 chars)
- lead_info (string, 2000 chars)
- business_context (string, 5000 chars)
- created_at (datetime)
- updated_at (datetime)
```

**chat_leads:**
```
- name (string, 100 chars, required)
- email (email, required)
- phone (string, 20 chars)
- message (string, 2000 chars, required)
- source (string, 50 chars, required)
- sessionId (string, 100 chars, required)
- created_at (datetime)
```

## 🔧 Configuration

### Rate Limiting
- **Chat API:** 10 requests per minute per IP
- **Lead API:** No specific limit (relies on form validation)

### Security Features
- ✅ Input validation and sanitization
- ✅ Rate limiting
- ✅ Error handling with fallbacks
- ✅ Session management
- ✅ CORS configuration

### Performance Optimization
- ✅ Token usage optimization
- ✅ Conversation truncation
- ✅ Knowledge base caching
- ✅ Streaming responses

## 📊 Monitoring

### Key Metrics to Monitor
1. **API Response Times**
2. **OpenAI API Usage & Costs**
3. **Database Query Performance**
4. **Error Rates**
5. **Lead Conversion Rates**

### Log Files
- Application logs: Check Docker logs
- Appwrite logs: Check Appwrite console
- OpenAI usage: Monitor via OpenAI dashboard

## 🛠️ Troubleshooting

### Common Issues

**1. Database Connection Errors**
```bash
# Check Appwrite status
docker ps | grep appwrite

# Verify environment variables
echo $NEXT_PUBLIC_APPWRITE_ENDPOINT
echo $APPWRITE_API_KEY
```

**2. OpenAI API Errors**
```bash
# Verify API key
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
  https://api.openai.com/v1/models
```

**3. Chat Not Working**
- Check browser console for errors
- Verify API endpoints are accessible
- Check rate limiting status

### Debug Commands
```bash
# Test database initialization
npm run init-db

# Check API health
curl https://zeropoint-labs.com/api/chat/message

# View application logs
docker logs zero-point-labs-website
```

## 💰 Cost Management

### Expected Monthly Costs
- **OpenAI API:** $50-200 (depending on usage)
- **Appwrite:** Free (self-hosted)
- **VPS:** Your existing Hostinger plan

### Cost Optimization
- ✅ Rate limiting prevents abuse
- ✅ Token optimization reduces API calls
- ✅ Knowledge base reduces OpenAI dependency
- ✅ Conversation truncation manages context size

## 🔄 Updates and Maintenance

### Regular Tasks
1. **Monitor OpenAI usage** (weekly)
2. **Review chat logs** (weekly)
3. **Update knowledge base** (as needed)
4. **Check error rates** (daily)

### Updating the Chatbot
```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Rebuild application
npm run build

# Restart services
docker-compose restart
```

## 📈 Analytics

### Available Data
- **Conversation logs** (chat_conversations)
- **Lead captures** (chat_leads)
- **Intent analysis** (user behavior patterns)
- **Response effectiveness** (conversation flow)

### Accessing Data
- Use Appwrite Console for database queries
- Export data for analysis
- Set up automated reports

## 🎯 Success Metrics

### Key Performance Indicators
1. **Response Time:** < 3 seconds
2. **Lead Conversion:** Track via chat_leads
3. **User Engagement:** Messages per session
4. **Intent Recognition:** Accuracy of responses
5. **Cost Efficiency:** Cost per lead generated

## 🆘 Support

If you encounter issues:

1. **Check this guide first**
2. **Review application logs**
3. **Test individual components**
4. **Contact development team**

---

## 🎉 You're Ready!

Once deployed, your AI chatbot will:
- ✅ Respond to customer inquiries 24/7
- ✅ Capture leads automatically
- ✅ Provide business-specific information
- ✅ Scale with your business needs

The chatbot is now live and ready to help convert website visitors into customers!
