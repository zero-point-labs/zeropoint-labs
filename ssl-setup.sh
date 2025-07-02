#!/bin/bash

# SSL Setup script for Let's Encrypt certificates with Docker

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

print_status "Setting up SSL certificate for $DOMAIN"

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

# Update nginx config with actual domain (no longer needed since we've already set zeropoint-labs.com)
print_status "Domain already configured in nginx: $DOMAIN"

# Restart nginx to pick up changes
print_status "Restarting Nginx..."
if command -v docker-compose &> /dev/null; then
    docker-compose restart nginx
else
    docker compose restart nginx
fi

# Wait for nginx to be ready
sleep 5

# Get SSL certificate
print_status "Requesting SSL certificate from Let's Encrypt..."
if command -v docker-compose &> /dev/null; then
    docker-compose run --rm certbot certonly --webroot --webroot-path /var/www/certbot --email $EMAIL --agree-tos --no-eff-email -d $DOMAIN -d www.$DOMAIN
else
    docker compose run --rm certbot certonly --webroot --webroot-path /var/www/certbot --email $EMAIL --agree-tos --no-eff-email -d $DOMAIN -d www.$DOMAIN
fi

# Restart nginx to use SSL
print_status "Restarting Nginx to enable SSL..."
if command -v docker-compose &> /dev/null; then
    docker-compose restart nginx
else
    docker compose restart nginx
fi

print_status "✅ SSL certificate setup complete!"
print_status "Your site should now be available at:"
print_status "🔒 https://$DOMAIN"
print_status "🔒 https://www.$DOMAIN"

# Set up auto-renewal test
print_status "Testing certificate auto-renewal..."
if command -v docker-compose &> /dev/null; then
    docker-compose run --rm certbot renew --dry-run
else
    docker compose run --rm certbot renew --dry-run
fi

print_status "✅ SSL auto-renewal test successful!"
print_warning "Remember to update your DNS records to point to this server's IP address." 