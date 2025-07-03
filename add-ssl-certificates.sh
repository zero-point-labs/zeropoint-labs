#!/bin/bash

# Add SSL certificates to existing HTTP setup

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

# Configuration
DOMAIN1="zeropoint-labs.com"
DOMAIN2="gprealty-cy.com"
EMAIL="admin@zeropoint-labs.com"

print_status "🔒 Adding SSL certificates to existing HTTP setup..."

# Check if HTTP is working first
print_status "Checking HTTP connectivity first..."
if ! curl -f -H "Host: $DOMAIN1" http://localhost/ > /dev/null 2>&1; then
    print_error "❌ HTTP for $DOMAIN1 not working! Run fix-nginx-restart.sh first"
    exit 1
fi

if ! curl -f -H "Host: $DOMAIN2" http://localhost/ > /dev/null 2>&1; then
    print_error "❌ HTTP for $DOMAIN2 not working! Run fix-nginx-restart.sh first"
    exit 1
fi

print_status "✅ HTTP connectivity confirmed for both domains"

# Create directories for certbot
mkdir -p certbot/conf
mkdir -p certbot/www

# Download recommended TLS parameters
if [ ! -f "certbot/conf/options-ssl-nginx.conf" ]; then
    print_status "Downloading recommended TLS parameters..."
    curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > certbot/conf/options-ssl-nginx.conf
fi

if [ ! -f "certbot/conf/ssl-dhparams.pem" ]; then
    print_status "Downloading SSL DH parameters..."
    curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > certbot/conf/ssl-dhparams.pem
fi

# Get SSL certificate for first domain
print_status "Requesting SSL certificate for $DOMAIN1..."
docker compose run --rm certbot certonly --webroot --webroot-path /var/www/certbot --email $EMAIL --agree-tos --no-eff-email -d $DOMAIN1 -d www.$DOMAIN1

# Get SSL certificate for second domain  
print_status "Requesting SSL certificate for $DOMAIN2..."
docker compose run --rm certbot certonly --webroot --webroot-path /var/www/certbot --email $EMAIL --agree-tos --no-eff-email -d $DOMAIN2 -d www.$DOMAIN2

# Now switch to SSL configurations
print_status "Switching to SSL configurations..."

# Remove HTTP-only configs
rm -f nginx/sites-enabled/zeropoint-labs-http.com
rm -f nginx/sites-enabled/gprealty-cy-http.com

# Enable SSL configs
ln -sf ../sites-available/zeropoint-labs.com nginx/sites-enabled/
ln -sf ../sites-available/gprealty-cy.com nginx/sites-enabled/

# Restart nginx to use SSL
print_status "Restarting Nginx to enable SSL..."
docker compose restart nginx

# Wait for nginx to restart
sleep 10

# Test nginx configuration
print_status "Testing nginx SSL configuration..."
if docker exec multi-site-nginx nginx -t; then
    print_status "✅ Nginx SSL configuration is valid"
else
    print_error "❌ Nginx SSL configuration has errors"
    print_error "Rolling back to HTTP-only..."
    
    # Rollback to HTTP-only if SSL fails
    rm -f nginx/sites-enabled/zeropoint-labs.com
    rm -f nginx/sites-enabled/gprealty-cy.com
    ln -sf ../sites-available/zeropoint-labs-http.com nginx/sites-enabled/
    ln -sf ../sites-available/gprealty-cy-http.com nginx/sites-enabled/
    docker compose restart nginx
    
    print_error "SSL setup failed. HTTP-only configuration restored."
    exit 1
fi

print_status "✅ SSL certificate setup complete!"
print_status "Your sites should now be available at:"
print_status "🔒 https://$DOMAIN1"
print_status "🔒 https://www.$DOMAIN1"
print_status "🔒 https://$DOMAIN2"
print_status "🔒 https://www.$DOMAIN2"

# Test HTTPS connectivity
print_status "Testing HTTPS connectivity..."
sleep 5

if curl -k -f https://$DOMAIN1/ > /dev/null 2>&1; then
    print_status "✅ HTTPS response for $DOMAIN1 working"
else
    print_warning "⚠️ HTTPS response for $DOMAIN1 not working yet"
    print_warning "This may be due to DNS propagation. Try again in a few minutes."
fi

if curl -k -f https://$DOMAIN2/ > /dev/null 2>&1; then
    print_status "✅ HTTPS response for $DOMAIN2 working"
else
    print_warning "⚠️ HTTPS response for $DOMAIN2 not working yet"
    print_warning "This may be due to DNS propagation. Try again in a few minutes."
fi

# Test auto-renewal
print_status "Testing certificate auto-renewal..."
docker compose run --rm certbot renew --dry-run

print_status "🎉 SSL setup complete!"
print_warning "If domains are not accessible externally, ensure:"
print_warning "1. DNS records for both domains point to this server's IP"
print_warning "2. Firewall allows ports 80 and 443"  
print_warning "3. Wait for DNS propagation (up to 24 hours)" 