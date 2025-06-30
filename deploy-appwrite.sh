#!/bin/bash

# AppWrite Deployment Script for Zero Point Labs
# This script will deploy AppWrite alongside your existing Next.js application

set -e

echo "🚀 Starting AppWrite deployment for Zero Point Labs..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo -e "${RED}Error: docker-compose.yml not found. Please run this script from your project directory.${NC}"
    exit 1
fi

# Step 1: Backup current configuration
echo -e "${YELLOW}📦 Backing up current configuration...${NC}"
cp docker-compose.yml docker-compose.yml.backup.$(date +%Y%m%d_%H%M%S)
cp nginx.conf nginx.conf.backup.$(date +%Y%m%d_%H%M%S)

# Step 2: Replace configuration files
echo -e "${YELLOW}🔧 Updating configuration files...${NC}"
cp docker-compose.appwrite.yml docker-compose.yml
cp nginx.appwrite.conf nginx.conf

# Step 3: Stop current containers
echo -e "${YELLOW}⏹️  Stopping current containers...${NC}"
docker-compose down

# Step 4: Pull new images
echo -e "${YELLOW}📥 Pulling Docker images...${NC}"
docker-compose pull

# Step 5: Build and start all services
echo -e "${YELLOW}🏗️  Building and starting services...${NC}"
docker-compose up -d --build

# Step 6: Wait for services to be ready
echo -e "${YELLOW}⏳ Waiting for services to start...${NC}"
sleep 30

# Step 7: Check service status
echo -e "${YELLOW}🔍 Checking service status...${NC}"
docker-compose ps

# Step 8: Show logs
echo -e "${YELLOW}📋 Showing recent logs...${NC}"
docker-compose logs --tail=20

echo -e "${GREEN}✅ AppWrite deployment completed!${NC}"
echo -e "${GREEN}🌐 Your AppWrite console will be available at: https://zeropoint-labs.com/console${NC}"
echo -e "${GREEN}🔗 Your AppWrite API endpoint: https://zeropoint-labs.com/v1${NC}"
echo -e "${YELLOW}📝 Next steps:${NC}"
echo -e "   1. Visit https://zeropoint-labs.com/console to set up your admin account"
echo -e "   2. Create your first project with ID: zeropoint-labs"
echo -e "   3. Configure your database collections"
echo -e "   4. Test your API endpoints"

echo -e "${YELLOW}🔧 Useful commands:${NC}"
echo -e "   - View logs: docker-compose logs -f"
echo -e "   - Check status: docker-compose ps"
echo -e "   - Restart AppWrite: docker-compose restart appwrite" 