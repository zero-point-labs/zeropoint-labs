#!/bin/bash

# Test deployment script to verify both websites are working

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

print_status "Testing multi-website deployment..."

# Check if containers are running
print_status "Checking container status..."
if command -v docker-compose &> /dev/null; then
    docker-compose ps
else
    docker compose ps
fi

# Test local connectivity to services
print_status "Testing local service connectivity..."

# Test zeropoint-app
if docker exec zeropoint-labs-app curl -f http://localhost:3000 > /dev/null 2>&1; then
    print_status "✅ Zeropoint app (port 3000) is responding"
else
    print_error "❌ Zeropoint app (port 3000) is not responding"
fi

# Test template-app
if docker exec gprealty-cyprus-app curl -f http://localhost:3001 > /dev/null 2>&1; then
    print_status "✅ Template app (port 3001) is responding"
else
    print_error "❌ Template app (port 3001) is not responding"
fi

# Test nginx configuration
print_status "Testing nginx configuration..."
if docker exec multi-site-nginx nginx -t; then
    print_status "✅ Nginx configuration is valid"
else
    print_error "❌ Nginx configuration has errors"
fi

# Check SSL certificates (if they exist)
print_status "Checking SSL certificate status..."
if [ -d "certbot/conf/live/zeropoint-labs.com" ]; then
    print_status "✅ SSL certificate for zeropoint-labs.com exists"
else
    print_warning "⚠️ SSL certificate for zeropoint-labs.com not found"
fi

if [ -d "certbot/conf/live/gprealty-cy.com" ]; then
    print_status "✅ SSL certificate for gprealty-cy.com exists"
else
    print_warning "⚠️ SSL certificate for gprealty-cy.com not found"
fi

# Test external connectivity (if possible)
print_status "Testing external connectivity..."

# Test HTTP response (will work even without SSL)
if curl -f -H "Host: zeropoint-labs.com" http://localhost/ > /dev/null 2>&1; then
    print_status "✅ HTTP response for zeropoint-labs.com working"
else
    print_warning "⚠️ HTTP response for zeropoint-labs.com not working"
fi

if curl -f -H "Host: gprealty-cy.com" http://localhost/ > /dev/null 2>&1; then
    print_status "✅ HTTP response for gprealty-cy.com working"
else
    print_warning "⚠️ HTTP response for gprealty-cy.com not working"
fi

print_status "🔍 Deployment test complete!"
print_status "Next steps:"
print_status "1. Ensure DNS records point to your VPS IP"
print_status "2. Run ./multi-ssl-setup.sh to generate SSL certificates"
print_status "3. Test external access to both domains" 