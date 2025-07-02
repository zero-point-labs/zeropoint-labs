#!/bin/bash

# Script to switch from HTTP-only to HTTPS configuration
# Run this on your VPS

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

echo "🔒 Switching Zero Point Labs to HTTPS Configuration"
echo "=================================================="

# Check if SSL certificates exist
if [ ! -d "./certbot/conf/live/zeropoint-labs.com" ]; then
    print_error "SSL certificates not found! Run ./ssl-setup.sh first"
    exit 1
fi

print_status "✅ SSL certificates found"

# Check if HTTPS config exists
if [ ! -f "./nginx/default.conf" ]; then
    print_error "HTTPS nginx config (default.conf) not found!"
    exit 1
fi

print_step "🔄 Stopping containers..."
docker-compose down

print_step "🔧 Updating docker-compose.yml to use HTTPS config..."
# Update docker-compose to use the HTTPS configuration
sed -i.backup 's/default-http-only.conf/default.conf/g' docker-compose.yml

print_status "✅ Updated docker-compose.yml"

print_step "🐳 Starting containers with HTTPS configuration..."
docker-compose up -d --build

print_step "⏱️  Waiting for containers to start..."
sleep 10

print_step "🧪 Testing HTTPS configuration..."
if docker ps | grep -q "zeropoint-labs"; then
    print_status "✅ Containers are running"
    
    # Test HTTPS
    sleep 5
    HTTPS_TEST=$(curl -s -w "HTTPSTATUS:%{http_code}" https://zeropoint-labs.com 2>/dev/null)
    HTTPS_STATUS=$(echo "$HTTPS_TEST" | grep "HTTPSTATUS:" | cut -d: -f2)
    
    if [ "$HTTPS_STATUS" = "200" ]; then
        print_status "🎉 HTTPS is now working!"
        print_status "✅ Your website should now be available at:"
        print_status "   🌐 https://zeropoint-labs.com (Primary)"
        print_status "   🌐 http://zeropoint-labs.com (Redirects to HTTPS)"
    else
        print_warning "⚠️ HTTPS test returned status: $HTTPS_STATUS"
        print_warning "Give it a few more seconds and try accessing the site manually"
    fi
else
    print_error "❌ Containers failed to start"
    print_error "Check logs: docker-compose logs"
    exit 1
fi

echo ""
print_status "🎊 HTTPS Configuration Complete!"
print_status "=================================================="
print_status "Your website should now be fully working with SSL!"
print_status ""
print_status "🔗 Test your website:"
print_status "   • https://zeropoint-labs.com"
print_status "   • http://zeropoint-labs.com (should redirect to HTTPS)"
print_status ""
print_status "🔧 If you have any issues:"
print_status "   • Check logs: docker-compose logs -f"
print_status "   • Run diagnostics: ./troubleshoot.sh" 