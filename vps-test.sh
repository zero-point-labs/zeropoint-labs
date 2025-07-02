#!/bin/bash

# VPS Website Testing Script
# Run this ON YOUR VPS to test what's actually happening

set +e  # Don't exit on errors

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

print_section() {
    echo -e "\n${BLUE}=== $1 ===${NC}"
}

echo "🌐 Testing Zero Point Labs Website Functionality"
echo "================================================"

print_section "1. Basic HTTP Connectivity"
print_status "Testing localhost HTTP..."
HTTP_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}\nTIME:%{time_total}" http://localhost 2>/dev/null)
HTTP_STATUS=$(echo "$HTTP_RESPONSE" | grep "HTTPSTATUS:" | cut -d: -f2)
if [ "$HTTP_STATUS" = "200" ]; then
    print_status "✅ HTTP localhost working (Status: $HTTP_STATUS)"
else
    print_error "❌ HTTP localhost failed (Status: $HTTP_STATUS)"
fi

print_section "2. Domain HTTP Test"
print_status "Testing domain HTTP..."
DOMAIN_HTTP=$(curl -s -w "HTTPSTATUS:%{http_code}" http://zeropoint-labs.com 2>/dev/null)
DOMAIN_STATUS=$(echo "$DOMAIN_HTTP" | grep "HTTPSTATUS:" | cut -d: -f2)
if [ "$DOMAIN_STATUS" = "200" ] || [ "$DOMAIN_STATUS" = "301" ] || [ "$DOMAIN_STATUS" = "302" ]; then
    print_status "✅ Domain HTTP responding (Status: $DOMAIN_STATUS)"
else
    print_error "❌ Domain HTTP failed (Status: $DOMAIN_STATUS)"
fi

print_section "3. HTTPS Test"
print_status "Testing HTTPS..."
HTTPS_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" https://zeropoint-labs.com 2>/dev/null)
HTTPS_STATUS=$(echo "$HTTPS_RESPONSE" | grep "HTTPSTATUS:" | cut -d: -f2)
if [ "$HTTPS_STATUS" = "200" ]; then
    print_status "✅ HTTPS working (Status: $HTTPS_STATUS)"
else
    print_warning "⚠️ HTTPS not working (Status: $HTTPS_STATUS)"
fi

print_section "4. Content Analysis"
print_status "Checking actual content served..."
CONTENT=$(curl -s http://localhost | head -20)
if echo "$CONTENT" | grep -qi "html\|doctype\|<title"; then
    print_status "✅ HTML content detected"
    echo "Content preview:"
    echo "$CONTENT" | head -5
else
    print_error "❌ No HTML content detected"
    echo "Raw content:"
    echo "$CONTENT"
fi

print_section "5. Static Assets Test"
print_status "Testing Next.js static assets..."
STATIC_TEST=$(curl -s -w "HTTPSTATUS:%{http_code}" http://localhost/_next/static/ 2>/dev/null)
STATIC_STATUS=$(echo "$STATIC_TEST" | grep "HTTPSTATUS:" | cut -d: -f2)
print_status "Static assets status: $STATIC_STATUS"

print_section "6. Container Internal Test"
print_status "Testing direct container access..."
CONTAINER_TEST=$(docker exec zeropoint-labs-app curl -s http://localhost:3000 2>/dev/null | head -5)
if [ -n "$CONTAINER_TEST" ]; then
    print_status "✅ Container serving content directly"
    echo "Container content preview:"
    echo "$CONTAINER_TEST"
else
    print_error "❌ Container not serving content"
fi

print_section "7. Network Routing Test"
print_status "Testing nginx -> nextjs routing..."
NGINX_TO_APP=$(docker exec zeropoint-labs-nginx curl -s http://nextjs-app:3000 2>/dev/null | head -5)
if [ -n "$NGINX_TO_APP" ]; then
    print_status "✅ Nginx can reach Next.js app"
else
    print_error "❌ Nginx cannot reach Next.js app"
fi

print_section "8. SSL Certificate Check"
if [ -d "./certbot/conf/live/zeropoint-labs.com" ]; then
    print_status "SSL certificates found:"
    ls -la ./certbot/conf/live/zeropoint-labs.com/
    
    # Check certificate validity
    CERT_INFO=$(openssl x509 -in ./certbot/conf/live/zeropoint-labs.com/cert.pem -text -noout 2>/dev/null | grep "Not After")
    print_status "Certificate expiry: $CERT_INFO"
else
    print_warning "No SSL certificates found"
fi

print_section "9. Current Nginx Config"
print_status "Active nginx configuration:"
docker exec zeropoint-labs-nginx cat /etc/nginx/conf.d/default.conf 2>/dev/null | head -20

print_section "Summary & Recommendations"
echo ""
if [ "$HTTP_STATUS" = "200" ] && [ -n "$CONTAINER_TEST" ]; then
    print_status "🎉 Basic functionality appears to be working!"
    
    if [ "$HTTPS_STATUS" != "200" ]; then
        print_warning "🔒 HTTPS needs to be configured. Run: ./ssl-setup.sh zeropoint-labs.com"
    fi
    
    print_status "🌐 Try accessing your site at:"
    print_status "   http://zeropoint-labs.com"
    if [ "$HTTPS_STATUS" = "200" ]; then
        print_status "   https://zeropoint-labs.com"
    fi
else
    print_error "❌ There are issues with the deployment"
    print_error "Check the troubleshooting steps above"
fi 