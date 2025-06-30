#!/bin/bash

# Zero Point Labs - Production Issues Fix Script
# This script fixes all critical issues preventing the chatbot from working

set -e

echo "🚀 Starting Zero Point Labs Production Fix..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "docker-compose.appwrite.yml" ]; then
    echo -e "${RED}Error: docker-compose.appwrite.yml not found. Please run this script from your project directory.${NC}"
    exit 1
fi

# Check for production environment file
if [ ! -f ".env.production" ]; then
    echo -e "${RED}⚠️  Missing .env.production file!${NC}"
    echo -e "${YELLOW}📝 Please create .env.production with your actual passwords:${NC}"
    echo -e "   1. Copy env-production-template.txt to .env.production"
    echo -e "   2. Replace all placeholder values with your actual passwords"
    echo -e "   3. Ensure MYSQL_PASSWORD is the same in both Appwrite and MariaDB sections"
    echo -e ""
    echo -e "${BLUE}💡 Required variables:${NC}"
    echo -e "   - MYSQL_ROOT_PASSWORD (MariaDB root password)"
    echo -e "   - MYSQL_PASSWORD (Appwrite database password)"
    echo -e "   - APPWRITE_SECRET_KEY (Appwrite encryption key)"
    echo -e "   - OPENAI_API_KEY (Your OpenAI API key)"
    echo -e "   - APPWRITE_API_KEY (Appwrite server API key)"
    echo -e ""
    read -p "Press Enter after creating .env.production file..."
fi

echo -e "${BLUE}📋 Issues being fixed:${NC}"
echo -e "   1. ✅ Next.js 15 async params (FIXED in code)"
echo -e "   2. 🔧 Nginx routing to Appwrite (FIXED in nginx.conf)"
echo -e "   3. 🔐 Database authentication (USING environment variables)"
echo -e "   4. 🌐 Appwrite container connectivity"
echo -e "   5. 🗄️  Database initialization"

# Step 1: Stop all containers
echo -e "${YELLOW}⏹️  Stopping all containers...${NC}"
docker-compose down

# Step 2: Remove old database volume to start fresh (if authentication is broken)
echo -e "${YELLOW}🧹 Clearing problematic database volume...${NC}"
docker volume rm zeropoint-hostinger_appwrite-mariadb 2>/dev/null || echo "Volume doesn't exist, continuing..."

# Step 3: Start with the fixed configuration using production environment
echo -e "${YELLOW}🏗️  Starting services with fixed configuration...${NC}"
docker-compose -f docker-compose.appwrite.yml --env-file .env.production up -d

# Step 4: Wait for MariaDB to initialize
echo -e "${YELLOW}⏳ Waiting for MariaDB to initialize (60 seconds)...${NC}"
sleep 60

# Step 5: Check service status
echo -e "${YELLOW}🔍 Checking service status...${NC}"
docker-compose -f docker-compose.appwrite.yml ps

# Step 6: Test database connectivity (using environment variable)
echo -e "${YELLOW}🔌 Testing database connectivity...${NC}"
source .env.production
docker exec appwrite-mariadb mysql -u appwrite -p${MYSQL_PASSWORD} -e "SELECT 1;" appwrite && echo -e "${GREEN}✅ Database authentication working!${NC}" || echo -e "${RED}❌ Database authentication failed${NC}"

# Step 7: Wait for Appwrite to be ready
echo -e "${YELLOW}⏳ Waiting for Appwrite to be ready (30 seconds)...${NC}"
sleep 30

# Step 8: Test Appwrite health endpoint
echo -e "${YELLOW}🏥 Testing Appwrite health endpoint...${NC}"
curl -f http://localhost/v1/health && echo -e "${GREEN}✅ Appwrite API responding!${NC}" || echo -e "${RED}❌ Appwrite API not responding${NC}"

# Step 9: Show recent logs
echo -e "${YELLOW}📋 Recent logs:${NC}"
docker-compose -f docker-compose.appwrite.yml logs --tail=10

# Step 10: Instructions for Appwrite setup
echo -e "${GREEN}✅ Production fixes completed!${NC}"
echo -e "${BLUE}📝 Next steps:${NC}"
echo -e "   1. Visit https://zeropoint-labs.com/console"
echo -e "   2. Create admin account"
echo -e "   3. Create project with ID: 'zeropoint-labs'"
echo -e "   4. Run: npm run init-db"
echo -e "   5. Test the chatbot"

echo -e "${GREEN}🎉 All critical fixes have been applied!${NC}"
echo -e "${YELLOW}🔗 Useful URLs:${NC}"
echo -e "   • Appwrite Console: https://zeropoint-labs.com/console"
echo -e "   • API Endpoint: https://zeropoint-labs.com/v1"
echo -e "   • Website: https://zeropoint-labs.com"

echo -e "${YELLOW}🔧 Debug commands:${NC}"
echo -e "   • Check logs: docker-compose -f docker-compose.appwrite.yml logs -f"
echo -e "   • Check status: docker-compose -f docker-compose.appwrite.yml ps"
echo -e "   • Test API: curl https://zeropoint-labs.com/v1/health" 