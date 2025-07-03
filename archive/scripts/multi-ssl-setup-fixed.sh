#!/bin/bash

# Multi-domain SSL Setup script for Let's Encrypt certificates with Docker

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

print_status "Setting up SSL certificates for multiple domains:"
print_status "- $DOMAIN1"
print_status "- $DOMAIN2"

# Create directories for certbot
mkdir -p certbot/conf
mkdir -p certbot/www

# Create nginx directories if they don't exist
mkdir -p nginx/sites-available
mkdir -p nginx/sites-enabled

# Download recommended TLS parameters
if [ ! -f "certbot/conf/options-ssl-nginx.conf" ]; then
    print_status "Downloading recommended TLS parameters..."
    curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > certbot/conf/options-ssl-nginx.conf
fi

if [ ! -f "certbot/conf/ssl-dhparams.pem" ]; then
    print_status "Downloading SSL DH parameters..."
    curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > certbot/conf/ssl-dhparams.pem
fi

# Enable site configurations (correct paths on host filesystem)
print_status "Enabling site configurations..."
ln -sf ../sites-available/zeropoint-labs.com nginx/sites-enabled/ 2>/dev/null || true
ln -sf ../sites-available/gprealty-cy.com nginx/sites-enabled/ 2>/dev/null || true

# Remove old default config
rm -f nginx/default.conf

# Check if containers are running and restart them
print_status "Restarting containers..."
if command -v docker-compose &> /dev/null; then
    docker-compose down
    docker-compose up -d
else
    docker compose down
    docker compose up -d
fi

# Wait for containers to be ready
print_status "Waiting for containers to start..."
sleep 15

# Check if containers are healthy
print_status "Checking container status..."
if command -v docker-compose &> /dev/null; then
    docker-compose ps
else
    docker compose ps
fi

# Test nginx configuration
print_status "Testing nginx configuration..."
if docker exec multi-site-nginx nginx -t; then
    print_status "✅ Nginx configuration is valid"
else
    print_error "❌ Nginx configuration has errors"
    print_error "Check the configuration and try again"
    exit 1
fi

# Test HTTP connectivity first
print_status "Testing HTTP connectivity..."
if curl -f -H "Host: $DOMAIN1" http://localhost/ > /dev/null 2>&1; then
    print_status "✅ HTTP response for $DOMAIN1 working"
else
    print_warning "⚠️ HTTP response for $DOMAIN1 not working"
fi

if curl -f -H "Host: $DOMAIN2" http://localhost/ > /dev/null 2>&1; then
    print_status "✅ HTTP response for $DOMAIN2 working"
else
    print_warning "⚠️ HTTP response for $DOMAIN2 not working"
fi

# Get SSL certificate for first domain
print_status "Requesting SSL certificate for $DOMAIN1..."
if command -v docker-compose &> /dev/null; then
    docker-compose run --rm certbot certonly --webroot --webroot-path /var/www/certbot --email $EMAIL --agree-tos --no-eff-email -d $DOMAIN1 -d www.$DOMAIN1
else
    docker compose run --rm certbot certonly --webroot --webroot-path /var/www/certbot --email $EMAIL --agree-tos --no-eff-email -d $DOMAIN1 -d www.$DOMAIN1
fi

# Get SSL certificate for second domain
print_status "Requesting SSL certificate for $DOMAIN2..."
if command -v docker-compose &> /dev/null; then
    docker-compose run --rm certbot certonly --webroot --webroot-path /var/www/certbot --email $EMAIL --agree-tos --no-eff-email -d $DOMAIN2 -d www.$DOMAIN2
else
    docker compose run --rm certbot certonly --webroot --webroot-path /var/www/certbot --email $EMAIL --agree-tos --no-eff-email -d $DOMAIN2 -d www.$DOMAIN2
fi

# Restart nginx to use SSL
print_status "Restarting Nginx to enable SSL..."
if command -v docker-compose &> /dev/null; then
    docker-compose restart nginx
else
    docker compose restart nginx
fi

# Wait for nginx to restart
sleep 5

print_status "✅ SSL certificate setup complete!"
print_status "Your sites should now be available at:"
print_status "🔒 https://$DOMAIN1"
print_status "🔒 https://www.$DOMAIN1"
print_status "🔒 https://$DOMAIN2"
print_status "🔒 https://www.$DOMAIN2"

# Test HTTPS connectivity
print_status "Testing HTTPS connectivity..."
if curl -k -f https://$DOMAIN1/ > /dev/null 2>&1; then
    print_status "✅ HTTPS response for $DOMAIN1 working"
else
    print_warning "⚠️ HTTPS response for $DOMAIN1 not working yet (may need DNS propagation)"
fi

if curl -k -f https://$DOMAIN2/ > /dev/null 2>&1; then
    print_status "✅ HTTPS response for $DOMAIN2 working"
else
    print_warning "⚠️ HTTPS response for $DOMAIN2 not working yet (may need DNS propagation)"
fi

# Test auto-renewal
print_status "Testing certificate auto-renewal..."
if command -v docker-compose &> /dev/null; then
    docker-compose run --rm certbot renew --dry-run
else
    docker compose run --rm certbot renew --dry-run
fi

print_status "✅ SSL auto-renewal test successful!"
print_warning "If domains are not accessible externally, ensure:"
print_warning "1. DNS records for $DOMAIN2 point to this server's IP"
print_warning "2. Firewall allows ports 80 and 443"
print_warning "3. Wait for DNS propagation (up to 24 hours)" 