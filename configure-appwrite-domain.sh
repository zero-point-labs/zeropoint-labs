#!/bin/bash

echo "🔧 CONFIGURING APPWRITE DOMAIN SETTINGS"
echo "======================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🛑 Stopping Appwrite container...${NC}"
docker-compose -f docker-compose.appwrite.yml stop appwrite

echo -e "${YELLOW}🔧 Updating Appwrite configuration...${NC}"

# Update the docker-compose file with proper domain configuration
echo -e "${BLUE}📝 Configuring domain environment variables...${NC}"

# Create updated environment for Appwrite
cat > appwrite.env << 'EOF'
_APP_ENV=production
_APP_WORKER_PER_CORE=6
_APP_LOCALE=en
_APP_CONSOLE_WHITELIST_ROOT=enabled
_APP_CONSOLE_WHITELIST_EMAILS=
_APP_CONSOLE_WHITELIST_IPS=
_APP_SYSTEM_EMAIL_NAME=Zero Point Labs
_APP_SYSTEM_EMAIL_ADDRESS=admin@zeropoint-labs.com
_APP_SYSTEM_SECURITY_EMAIL_ADDRESS=security@zeropoint-labs.com
_APP_SYSTEM_RESPONSE_FORMAT=
_APP_OPTIONS_ABUSE=enabled
_APP_OPTIONS_ROUTER_PROTECTION=disabled
_APP_DOMAIN=zeropoint-labs.com
_APP_DOMAIN_TARGET=zeropoint-labs.com
_APP_DOMAIN_FUNCTIONS=zeropoint-labs.com
_APP_REDIS_HOST=redis
_APP_REDIS_PORT=6379
_APP_REDIS_USER=
_APP_REDIS_PASS=
_APP_DB_HOST=mariadb
_APP_DB_PORT=3306
_APP_DB_SCHEMA=appwrite
_APP_DB_USER=appwrite
_APP_DB_PASS=${MYSQL_PASSWORD:-ZeroPoint2025SecurePassword!}
_APP_SMTP_HOST=
_APP_SMTP_PORT=
_APP_SMTP_SECURE=
_APP_SMTP_USERNAME=
_APP_SMTP_PASSWORD=
_APP_USAGE_STATS=enabled
_APP_INFLUXDB_HOST=
_APP_INFLUXDB_PORT=
_APP_STORAGE_LIMIT=30000000
_APP_STORAGE_PREVIEW_LIMIT=20000000
_APP_STORAGE_ANTIVIRUS=disabled
_APP_STORAGE_ANTIVIRUS_HOST=clamav
_APP_STORAGE_ANTIVIRUS_PORT=3310
_APP_STORAGE_DEVICE=local
_APP_FUNCTIONS_SIZE_LIMIT=30000000
_APP_FUNCTIONS_TIMEOUT=900
_APP_FUNCTIONS_BUILD_TIMEOUT=900
_APP_FUNCTIONS_CONTAINERS=10
_APP_FUNCTIONS_CPUS=0
_APP_FUNCTIONS_MEMORY=0
_APP_FUNCTIONS_MEMORY_SWAP=0
_APP_FUNCTIONS_RUNTIMES=node-16.0,php-8.0,python-3.9,ruby-3.0
EOF

echo -e "${YELLOW}🚀 Starting Appwrite with new configuration...${NC}"
docker-compose -f docker-compose.appwrite.yml up -d appwrite

echo -e "${YELLOW}⏳ Waiting for Appwrite to initialize...${NC}"
sleep 20

# Test if Appwrite console is accessible
echo -e "${YELLOW}🔍 Testing console access...${NC}"
for i in {1..10}; do
    if curl -f -s https://zeropoint-labs.com/console > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Console accessible${NC}"
        break
    else
        echo "Attempt $i/10 failed, retrying in 3 seconds..."
        sleep 3
    fi
done

echo ""
echo -e "${GREEN}🎉 DOMAIN CONFIGURATION COMPLETED!${NC}"
echo ""
echo -e "${BLUE}📋 Next steps:${NC}"
echo "1. 🌐 Visit: https://zeropoint-labs.com/console"
echo "2. 👤 Create your admin account"
echo "3. 🗂️ Create project with ID: 'zeropoint-labs'"
echo "4. 🔑 Copy the API key"
echo "5. 📝 Update .env.local with the API key"
echo "6. ⚡ Run: npm run init-appwrite"
echo ""

echo -e "${YELLOW}📊 Container Status:${NC}"
docker-compose -f docker-compose.appwrite.yml ps 