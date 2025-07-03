#!/bin/bash

# Fix nginx restart loop by using HTTP-only configs first

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

print_status "🔧 Fixing nginx restart loop..."

# Stop all containers
print_status "Stopping containers..."
docker compose down

# Create temporary HTTP-only configurations
print_status "Creating temporary HTTP-only nginx configurations..."

# Create HTTP-only config for zeropoint-labs.com
cat > nginx/sites-available/zeropoint-labs-http.com << 'EOF'
# HTTP only server for zeropoint-labs.com
server {
    listen 80;
    server_name zeropoint-labs.com www.zeropoint-labs.com;
    server_tokens off;

    # ACME challenge location
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Proxy to Zeropoint Next.js app
    location / {
        proxy_pass http://zeropoint-app:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_buffering off;
    }

    # Cache static assets
    location /_next/static/ {
        proxy_pass http://zeropoint-app:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2)$ {
        proxy_pass http://zeropoint-app:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Create HTTP-only config for gprealty-cy.com
cat > nginx/sites-available/gprealty-cy-http.com << 'EOF'
# HTTP only server for gprealty-cy.com
server {
    listen 80;
    server_name gprealty-cy.com www.gprealty-cy.com;
    server_tokens off;

    # ACME challenge location
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Proxy to Template Next.js app
    location / {
        proxy_pass http://template-app:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_buffering off;
    }

    # Cache static assets
    location /_next/static/ {
        proxy_pass http://template-app:3001;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2)$ {
        proxy_pass http://template-app:3001;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Remove SSL configs from sites-enabled
print_status "Removing SSL configurations temporarily..."
rm -f nginx/sites-enabled/zeropoint-labs.com
rm -f nginx/sites-enabled/gprealty-cy.com

# Enable HTTP-only configs
print_status "Enabling HTTP-only configurations..."
mkdir -p nginx/sites-enabled
ln -sf ../sites-available/zeropoint-labs-http.com nginx/sites-enabled/
ln -sf ../sites-available/gprealty-cy-http.com nginx/sites-enabled/

# Start containers
print_status "Starting containers with HTTP-only configuration..."
docker compose up -d

# Wait for containers to start
print_status "Waiting for containers to start..."
sleep 20

# Check container status
print_status "Checking container status..."
docker compose ps

# Test nginx configuration
print_status "Testing nginx configuration..."
if docker exec multi-site-nginx nginx -t; then
    print_status "✅ Nginx configuration is valid"
else
    print_error "❌ Nginx configuration still has errors"
    print_error "Checking nginx logs..."
    docker compose logs nginx
    exit 1
fi

# Test HTTP connectivity
print_status "Testing HTTP connectivity..."
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

print_status "🎉 Nginx is now running with HTTP-only configuration!"
print_status ""
print_status "Next steps:"
print_status "1. Test both websites work via HTTP"
print_status "2. Ensure DNS records point to this server"
print_status "3. Run SSL setup once HTTP is confirmed working"
print_status ""
print_status "Test commands:"
print_status "curl -H 'Host: zeropoint-labs.com' http://your-vps-ip/"
print_status "curl -H 'Host: gprealty-cy.com' http://your-vps-ip/" 