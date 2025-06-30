# 🔧 Install Node.js on Your VPS First

Your VPS doesn't have Node.js/npm installed yet. Let's fix that first, then deploy the chatbot.

## 🚀 Step 1: Install Node.js and npm on Your VPS

Run these commands on your VPS:

```bash
# Update package list
apt update

# Install Node.js and npm
apt install -y nodejs npm

# Verify installation
node --version
npm --version
```

## 🚀 Step 2: Install a Recent Version of Node.js (Recommended)

If you want the latest stable version:

```bash
# Install NodeSource repository for latest Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js 20 (latest stable)
apt-get install -y nodejs

# Verify versions
node --version
npm --version
```

## 🚀 Step 3: Now Deploy the Chatbot

Once Node.js is installed, run:

```bash
# Go back to your project directory
cd /var/www/zeropoint-labs/zeropoint-hostinger

# Fix git conflict
git reset --hard origin/master

# Install dependencies
npm install

# Initialize database
npm run init-db

# Build and start
npm run build
npm start
```

## 🧪 Step 4: Test Your Chatbot

1. Visit https://zeropoint-labs.com
2. Scroll to chat section
3. Send: "Hi, what services do you offer?"
4. Get AI response!

## ⚠️ Alternative: Use Docker (if you prefer)

If you're already using Docker for your website:

```bash
# Check if Docker is running
docker ps

# If using Docker, you might need to rebuild your container
docker-compose down
docker-compose up -d --build
```

**Install Node.js first, then run the deployment commands!** 🚀
