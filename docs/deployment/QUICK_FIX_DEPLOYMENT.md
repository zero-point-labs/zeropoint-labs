# 🔧 Quick Fix for Deployment

The git push failed because your repository uses `master` branch instead of `main`. Here's how to fix it and continue:

## 🚀 Step 1: Fix Git Push

```bash
# The repository uses 'master' branch, not 'main'
git push origin master
```

## 🚀 Step 2: Deploy to Your VPS

Now SSH into your VPS and run:

```bash
# Navigate to your project directory
cd /path/to/your/project

# Pull the latest changes
git pull origin master

# Install new dependencies
npm install

# Initialize the database (this creates all collections)
npm run init-db

# Build the application
npm run build

# Start the production server
npm start
```

## 🧪 Step 3: Test Everything

1. **Test health endpoint:**
   ```bash
   curl https://zeropoint-labs.com/api/health
   ```

2. **Test chat API:**
   ```bash
   curl -X GET https://zeropoint-labs.com/api/chat/message
   ```

3. **Test on your website:**
   - Visit https://zeropoint-labs.com
   - Scroll to the chat section
   - Send a message: "Hi, what services do you offer?"
   - You should get an AI response!

## ⚠️ If Database Init Fails

If `npm run init-db` gives errors, it might be because:
1. Appwrite endpoint is not accessible
2. API key is incorrect
3. Appwrite is not running

Check with:
```bash
# Verify Appwrite is running
docker ps | grep appwrite

# Test Appwrite endpoint
curl https://zeropoint-labs.com/v1/health
```

## 🎉 Expected Result

Once everything is working, your chatbot will:
- ✅ Respond to questions about your services
- ✅ Provide pricing information
- ✅ Capture leads automatically
- ✅ Work 24/7 on your website

## 📞 Need Help?

If you encounter any issues:
1. Check the logs: `docker logs your-container-name`
2. Verify environment variables are set
3. Make sure Appwrite is accessible

**You're almost there! Just run the commands above and your AI chatbot will be live!** 🚀
