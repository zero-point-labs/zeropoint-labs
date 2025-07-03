#!/bin/bash

# Troubleshooting script for Zero Point Labs deployment

set +e  # Don't exit on errors, we want to see everything

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

echo "🔍 Zero Point Labs Deployment Troubleshooter"
echo "=============================================="

print_section "1. Docker Status"
print_status "Checking Docker installation..."
docker --version
docker-compose --version || docker compose version

print_status "Checking running containers..."
docker ps -a

print_section "2. Container Logs"
print_status "Next.js app logs (last 20 lines):"
docker-compose logs --tail=20 nextjs-app 2>/dev/null || docker compose logs --tail=20 nextjs-app 2>/dev/null

print_status "Nginx logs (last 20 lines):"
docker-compose logs --tail=20 nginx 2>/dev/null || docker compose logs --tail=20 nginx 2>/dev/null

print_section "3. Network Connectivity"
print_status "Testing internal container connectivity..."
docker exec -it zeropoint-labs-nginx ping -c 3 nextjs-app 2>/dev/null || print_error "Cannot ping Next.js container from Nginx"

print_section "4. Port and Service Status"
print_status "Checking if ports are listening..."
netstat -tlnp | grep -E ":(80|443|3000)"

print_status "Testing local connectivity..."
curl -I http://localhost 2>/dev/null || print_error "Cannot connect to localhost:80"
curl -I https://localhost 2>/dev/null || print_warning "Cannot connect to localhost:443 (SSL might not be configured)"

print_section "5. SSL Certificate Status"
print_status "Checking SSL certificates..."
if [ -d "/var/www/zeropoint-labs/certbot/conf/live/zeropoint-labs.com" ]; then
    ls -la /var/www/zeropoint-labs/certbot/conf/live/zeropoint-labs.com/
else
    print_warning "No SSL certificates found"
fi

print_section "6. Nginx Configuration"
print_status "Testing Nginx configuration..."
docker exec -it zeropoint-labs-nginx nginx -t 2>/dev/null || print_error "Nginx configuration has errors"

print_status "Current Nginx configuration being used:"
docker exec -it zeropoint-labs-nginx cat /etc/nginx/conf.d/default.conf 2>/dev/null || print_error "Cannot read Nginx config"

print_section "7. File Permissions and Ownership"
print_status "Checking project directory permissions..."
ls -la /var/www/zeropoint-labs/

print_section "8. DNS and External Access"
print_status "Testing external domain resolution..."
nslookup zeropoint-labs.com
dig zeropoint-labs.com A

print_status "Testing external HTTP access..."
curl -I http://zeropoint-labs.com 2>/dev/null || print_error "Cannot access http://zeropoint-labs.com externally"

print_section "9. Recent Container Events"
print_status "Docker system events (last 10):"
docker system events --since 1h --until now 2>/dev/null | tail -10 || print_warning "Cannot get Docker events"

print_section "Troubleshooting Complete"
echo ""
print_status "🔧 Common fixes to try:"
echo "  1. Rebuild containers: docker-compose down && docker-compose up -d --build"
echo "  2. Check SSL setup: ./ssl-setup.sh zeropoint-labs.com"
echo "  3. Restart containers: docker-compose restart"
echo "  4. Check firewall: ufw status"
echo "  5. Verify DNS: dig zeropoint-labs.com"
echo ""
print_status "📋 For more help, share the output of this script." 