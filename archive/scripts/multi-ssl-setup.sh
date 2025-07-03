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

# Download recommended TLS parameters
if [ ! -f "certbot/conf/options-ssl-nginx.conf" ]; then
    print_status "Downloading recommended TLS parameters..."
    curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > certbot/conf/options-ssl-nginx.conf
fi

if [ ! -f "certbot/conf/ssl-dhparams.pem" ]; then
    print_status "Downloading SSL DH parameters..."
    curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > certbot/conf/ssl-dhparams.pem
fi

# Enable site configurations
print_status "Enabling site configurations..."
ln -sf /etc/nginx/sites-available/zeropoint-labs.com /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/gprealty-cy.com /etc/nginx/sites-enabled/

# Remove old default config
rm -f nginx/default.conf

# Restart containers
print_status "Restarting containers..."
if command -v docker-compose &> /dev/null; then
    docker-compose down
    docker-compose up -d
else
    docker compose down
    docker compose up -d
fi

# Wait for containers to be ready
sleep 10

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

print_status "✅ SSL certificate setup complete!"
print_status "Your sites should now be available at:"
print_status "🔒 https://$DOMAIN1"
print_status "🔒 https://www.$DOMAIN1"
print_status "🔒 https://$DOMAIN2"
print_status "🔒 https://www.$DOMAIN2"

# Test auto-renewal
print_status "Testing certificate auto-renewal..."
if command -v docker-compose &> /dev/null; then
    docker-compose run --rm certbot renew --dry-run
else
    docker compose run --rm certbot renew --dry-run
fi

print_status "✅ SSL auto-renewal test successful!"
print_warning "Remember to update DNS records for $DOMAIN2 to point to this server's IP address." 