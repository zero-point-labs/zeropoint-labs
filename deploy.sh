#!/bin/bash

# Zero Point Labs - Deployment Script for VPS
# This script deploys the website with chatbot functionality

set -e  # Exit on any error

echo "🚀 Starting Zero Point Labs Deployment..."

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ Error: .env.local file not found!"
    echo "Please create .env.local with the following variables:"
    echo "OPENAI_API_KEY=your_openai_api_key_here"
    echo "NEXT_PUBLIC_APPWRITE_ENDPOINT=https://zeropoint-labs.com/v1"
    echo "NEXT_PUBLIC_APPWRITE_PROJECT_ID=zeropoint-labs"
    echo "APPWRITE_API_KEY=your_appwrite_api_key_here"
    echo "CHATBOT_SESSION_TIMEOUT=86400000"
    exit 1
fi

# Check if OPENAI_API_KEY is set and valid
source .env.local
if [ -z "$OPENAI_API_KEY" ] || [ "$OPENAI_API_KEY" = "your_openai_api_key_here" ]; then
    echo "❌ Error: OPENAI_API_KEY is not properly set in .env.local"
    echo "Please set a valid OpenAI API key in .env.local"
    exit 1
fi

echo "✅ Environment variables validated"

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin master

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Initialize database (if needed)
echo "🗄️ Initializing chatbot database..."
if command -v node &> /dev/null; then
    if [ -f "scripts/init-database.js" ]; then
        node -r dotenv/config scripts/init-database.js dotenv_config_path=.env.local || echo "⚠️ Database initialization failed or already complete"
    fi
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down --remove-orphans

# Build and start containers
echo "🏗️ Building and starting containers..."
docker-compose up -d --build

# Wait for containers to be ready
echo "⏳ Waiting for containers to start..."
sleep 10

# Test the deployment
echo "🧪 Testing deployment..."
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Website is running successfully!"
else
    echo "❌ Website test failed"
    docker-compose logs zeropoint-website
fi

# Test chatbot API
if curl -f http://localhost:3000/api/chat/message > /dev/null 2>&1; then
    echo "✅ Chatbot API is running successfully!"
else
    echo "⚠️ Chatbot API test failed - this might be normal if OpenAI key is not configured"
fi

echo "🎉 Deployment completed!"
echo ""
echo "📋 Next steps:"
echo "1. Visit your website to test the chatbot"
echo "2. Check Docker logs if any issues: docker-compose logs"
echo "3. Monitor OpenAI API usage in your OpenAI dashboard"
echo ""
echo "🔗 Useful commands:"
echo "  View logs: docker-compose logs -f"
echo "  Restart: docker-compose restart"
echo "  Stop: docker-compose down"
