# 🔧 Fix Environment Variable Loading Issue

I can see your `.env.local` file is set up correctly on the VPS! The issue is that Node.js isn't automatically loading the `.env.local` file. Let's fix this.

## 🚀 Option 1: Install dotenv and Update Script (Recommended)

On your VPS, run these commands:

```bash
# Install dotenv to load environment variables
npm install dotenv

# Run the database initialization with explicit env loading
node -r dotenv/config scripts/init-database.js dotenv_config_path=.env.local
```

## 🚀 Option 2: Export Environment Variables Manually

Alternatively, you can export the variables directly in your terminal session:

```bash
# Export environment variables (replace with your actual values)
export OPENAI_API_KEY="sk-proj-your_actual_openai_api_key_here"
export NEXT_PUBLIC_APPWRITE_ENDPOINT="https://zeropoint-labs.com/v1"
export NEXT_PUBLIC_APPWRITE_PROJECT_ID="zeropoint-labs"
export APPWRITE_API_KEY="your_actual_appwrite_api_key_here"

# Now run the database initialization
npm run init-db
```

## 🚀 Option 3: Source the Environment File

```bash
# Load environment variables from .env.local
set -a
source .env.local
set +a

# Run database initialization
npm run init-db
```

## 🚀 Option 4: Quick Fix - Update package.json Script

Edit your package.json to automatically load the env file:

```bash
# Edit package.json
nano package.json
```

Find the `init-db` script and change it to:
```json
"init-db": "node -r dotenv/config scripts/init-database.js dotenv_config_path=.env.local"
```

## 🧪 After Environment Variables Load Successfully

Once the environment variables are working, continue with:

```bash
# Initialize database
npm run init-db

# Build the application
npm run build

# Start the server
npm start
```

## ✅ Test Your Chatbot

1. Visit https://zeropoint-labs.com
2. Scroll to chat section
3. Send: "Hi, what services do you offer?"
4. Get AI response!

**Try Option 1 first (install dotenv), it's the most reliable solution!** 🚀
