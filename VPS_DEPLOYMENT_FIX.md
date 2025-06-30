# 🔧 VPS Deployment Fix - OpenAI API Key Build Issue

## ❌ Problem
The Docker build is failing with this error:
```
Error: The OPENAI_API_KEY environment variable is missing or empty
```

This happens because the OpenAI client was being initialized at module level during build time, when environment variables aren't available.

## ✅ Solution Applied

I've fixed the issue by making several changes:

### 1. **Lazy OpenAI Client Initialization**
- Modified `src/services/openai.ts` to create the OpenAI client only when needed
- This prevents build-time errors when environment variables aren't available

### 2. **Updated Dockerfile**
- Added build argument for OPENAI_API_KEY with placeholder value
- This allows the build to complete even without the real API key

### 3. **Updated docker-compose.yml**
- Added build argument to pass the OpenAI API key during build
- Uses placeholder if not available

### 4. **Enhanced Validation**
- Updated validation function to properly detect valid API keys
- Ignores placeholder values

## 🚀 How to Deploy on Your VPS

### Step 1: Make sure you have the latest code
```bash
cd /var/www/zeropoint-labs/zeropoint-hostinger
git pull origin main
```

### Step 2: Create/Update .env.local on VPS
```bash
# Create or edit the environment file
nano .env.local
```

Add this content (with your actual API keys):
```bash
# OpenAI Configuration
OPENAI_API_KEY=sk-proj-your_actual_openai_api_key_here

# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://zeropoint-labs.com/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=zeropoint-labs
APPWRITE_API_KEY=your_actual_appwrite_api_key_here
CHATBOT_SESSION_TIMEOUT=86400000
```

### Step 3: Deploy with the updated script
```bash
# Make the deploy script executable
chmod +x deploy.sh

# Run the deployment
./deploy.sh
```

OR manually run:
```bash
# Stop existing containers
docker-compose down --remove-orphans

# Build and start with the fix
docker-compose up -d --build
```

## 🧪 Testing

After deployment, test these endpoints:

```bash
# Test website
curl -f http://localhost:3000

# Test chatbot API
curl -X GET http://localhost:3000/api/chat/message

# Test lead API
curl -X GET http://localhost:3000/api/chat/lead
```

## 🔍 If Still Having Issues

### Check container logs:
```bash
docker-compose logs zeropoint-website
```

### Verify environment variables:
```bash
docker-compose exec zeropoint-website env | grep OPENAI
```

### Manual build test:
```bash
# Test build locally first
npm run build
```

## 📝 What Changed

- ✅ OpenAI client now initializes lazily
- ✅ Build process can complete without real API key
- ✅ Runtime validation ensures proper API key is set
- ✅ Docker configuration updated to handle build args
- ✅ Deployment script validates environment setup

The chatbot should now work perfectly! 🎉
