# 🔧 Fix Appwrite Connection Issue

Good progress! Environment variables are loading now, but there's a connection issue with Appwrite. Let's troubleshoot this step by step.

## 🚀 Step 1: Check if Appwrite is Running

On your VPS, check if Appwrite is running:

```bash
# Check if Appwrite containers are running
docker ps | grep appwrite

# Check if port 80/443 is being used by Appwrite
netstat -tlnp | grep :80
netstat -tlnp | grep :443
```

## 🚀 Step 2: Test Appwrite Endpoint

Test if the Appwrite endpoint is accessible:

```bash
# Test the health endpoint
curl -v https://zeropoint-labs.com/v1/health

# Alternative test with HTTP
curl -v http://zeropoint-labs.com/v1/health

# Test if Appwrite is running on localhost
curl -v http://localhost/v1/health
```

## 🚀 Step 3: Check Appwrite Configuration

If Appwrite isn't running, start it:

```bash
# If you have docker-compose.yml for Appwrite
docker-compose -f docker-compose.appwrite.yml up -d

# Or check if there's an appwrite directory
ls -la | grep appwrite
cd appwrite  # if it exists
docker-compose up -d
```

## 🚀 Step 4: Fix Endpoint Configuration

Based on the test results, you might need to update the endpoint. Try these alternatives:

### Option A: If Appwrite is on localhost
```bash
export NEXT_PUBLIC_APPWRITE_ENDPOINT="http://localhost/v1"
npm run init-db
```

### Option B: If Appwrite is on a different port
```bash
export NEXT_PUBLIC_APPWRITE_ENDPOINT="http://localhost:8080/v1"
npm run init-db
```

### Option C: If using IP address
```bash
export NEXT_PUBLIC_APPWRITE_ENDPOINT="http://YOUR_VPS_IP/v1"
npm run init-db
```

## 🚀 Step 5: Manual Database Setup (Fallback)

If Appwrite connection issues persist, you can set up the database manually:

1. **Access Appwrite Console:**
   - Visit your Appwrite console (wherever it's accessible)
   - Login with your credentials

2. **Create Database:**
   - Create database with ID: `main`

3. **Create Collections:**
   - `chatbot_knowledge`
   - `chat_conversations` 
   - `chat_leads`

4. **Skip init-db and go straight to build:**
   ```bash
   npm run build
   npm start
   ```

## 🧪 Quick Diagnostic Commands

Run these to help diagnose the issue:

```bash
# Check what's running on your VPS
docker ps -a

# Check network connections
ss -tlnp

# Check if domain resolves correctly
nslookup zeropoint-labs.com

# Test if your website is accessible
curl -I https://zeropoint-labs.com
```

## 📋 Next Steps

1. **Run the diagnostic commands above**
2. **Share the output so I can help identify the exact issue**
3. **Once Appwrite is accessible, run `npm run init-db` again**
4. **Then proceed with `npm run build` and `npm start`**

**Let me know what the diagnostic commands show and I'll help you get Appwrite connected!** 🚀
