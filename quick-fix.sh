#!/bin/bash

echo "🔧 QUICK FIX - Appwrite SDK Version Compatibility"
echo "================================================"
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📦 Installing correct Appwrite SDK versions...${NC}"

# Install correct versions
npm install appwrite@13.0.1 node-appwrite@12.0.1

echo -e "${GREEN}✅ SDK versions fixed!${NC}"
echo ""

echo -e "${YELLOW}🏗️ Building Next.js application...${NC}"
npm run build

echo -e "${YELLOW}🚀 Starting Appwrite services...${NC}"
docker-compose -f docker-compose.appwrite.yml up -d

echo -e "${YELLOW}⏳ Waiting for services to initialize...${NC}"
echo "Waiting for MariaDB..."
sleep 15

echo "Waiting for Appwrite..."
sleep 20

# Test Appwrite API
echo -e "${YELLOW}🔍 Testing Appwrite API...${NC}"
for i in {1..10}; do
    if curl -f -s http://localhost/v1/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Appwrite API responding${NC}"
        break
    else
        echo "Attempt $i/10 failed, retrying in 3 seconds..."
        sleep 3
    fi
done

echo ""
echo -e "${GREEN}🎉 QUICK FIX COMPLETED!${NC}"
echo ""
echo -e "${BLUE}📋 Next steps:${NC}"
echo "1. Visit: https://zeropoint-labs.com/console"
echo "2. Create admin account"
echo "3. Create project with ID: 'zeropoint-labs'"
echo "4. Update .env.local with your API key"
echo "5. Run: npm run init-appwrite"
echo ""

# Show container status
echo -e "${YELLOW}📊 Container Status:${NC}"
docker-compose -f docker-compose.appwrite.yml ps 