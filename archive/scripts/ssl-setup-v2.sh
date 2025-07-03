#!/bin/bash

# Improved SSL Setup script for Let's Encrypt certificates with Docker

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

# Check if domain is provided
if [ -z "$1" ]; then
    print_error "Usage: $0 <domain.com>"
    print_error "Example: $0 zeropoint-labs.com"
    exit 1
fi

DOMAIN=$1
EMAIL="admin@$DOMAIN"  # You can change this to your email

print_status "🔒 Setting up SSL certificate for $DOMAIN"

# Create directories for certbot
mkdir -p certbot/conf
mkdir -p certbot/www

# Step 1: Test if the HTTP site is working
print_status "🌐 Testing HTTP connectivity..."
if ! curl -f http://$DOMAIN > /dev/null 2>&1; then
    print_error "❌ HTTP site is not accessible. Please ensure your site is working before setting up SSL."
    exit 1
fi
print_status "✅ HTTP site is accessible"

# Step 2: Get SSL certificate using HTTP challenge
print_status "📜 Requesting SSL certificate from Let's Encrypt..."
if command -v docker-compose &> /dev/null; then
    docker-compose run --rm certbot certonly \
        --webroot \
        --webroot-path /var/www/certbot \
        --email $EMAIL \
        --agree-tos \
        --no-eff-email \
        --force-renewal \
        -d $DOMAIN -d www.$DOMAIN
else
    docker compose run --rm certbot certonly \
        --webroot \
        --webroot-path /var/www/certbot \
        --email $EMAIL \
        --agree-tos \
        --no-eff-email \
        --force-renewal \
        -d $DOMAIN -d www.$DOMAIN
fi

# Step 3: Download recommended TLS parameters if not exists
if [ ! -f "certbot/conf/options-ssl-nginx.conf" ]; then
    print_status "📥 Downloading recommended TLS parameters..."
    curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > certbot/conf/options-ssl-nginx.conf
fi

if [ ! -f "certbot/conf/ssl-dhparams.pem" ]; then
    print_status "📥 Downloading SSL DH parameters..."
    curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > certbot/conf/ssl-dhparams.pem
fi

# Step 4: Update docker-compose to use SSL configuration
print_status "🔧 Switching to SSL configuration..."
sed -i.bak 's|default-http-only.conf|default.conf|g' docker-compose.yml

# Step 5: Restart nginx with SSL configuration
print_status "🔄 Restarting Nginx with SSL configuration..."
if command -v docker-compose &> /dev/null; then
    docker-compose restart nginx
else
    docker compose restart nginx
fi

# Wait for nginx to be ready
sleep 5

# Step 6: Test SSL
print_status "🧪 Testing SSL configuration..."
if curl -f https://$DOMAIN > /dev/null 2>&1; then
    print_status "🎉 ✅ SSL certificate setup complete!"
    print_status "Your site is now available at:"
    print_status "🔒 https://$DOMAIN"
    print_status "🔒 https://www.$DOMAIN"
    
    # Test auto-renewal
    print_status "🔄 Testing certificate auto-renewal..."
    if command -v docker-compose &> /dev/null; then
        docker-compose run --rm certbot renew --dry-run
    else
        docker compose run --rm certbot renew --dry-run
    fi
    print_status "✅ SSL auto-renewal test successful!"
else
    print_error "❌ SSL test failed. Check nginx logs:"
    print_error "docker-compose logs nginx"
fi 