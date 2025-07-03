#!/bin/bash

# Multi-Site Deployment Fix Script
# This script fixes the nginx configuration and SSL certificate issues

set -e

echo "🔧 Starting Multi-Site Deployment Fix..."

# Change to the project directory
cd /var/www/zeropoint-labs

echo "📋 Current container status:"
docker ps

echo ""
echo "🔍 Checking current nginx configuration..."

# Check if sites are enabled
echo "Current sites-enabled directory:"
ls -la nginx/sites-enabled/ || echo "Directory empty or doesn't exist"

echo ""
echo "🔗 Step 1: Enabling site configurations..."

# Create symbolic links to enable sites
if [ ! -f nginx/sites-enabled/zeropoint-labs.com ]; then
    ln -sf /etc/nginx/sites-available/zeropoint-labs.com nginx/sites-enabled/zeropoint-labs.com
    echo "✅ Enabled zeropoint-labs.com configuration"
else
    echo "✅ zeropoint-labs.com already enabled"
fi

if [ ! -f nginx/sites-enabled/gprealty-cy.com ]; then
    ln -sf /etc/nginx/sites-available/gprealty-cy.com nginx/sites-enabled/gprealty-cy.com
    echo "✅ Enabled gprealty-cy.com configuration"
else
    echo "✅ gprealty-cy.com already enabled"
fi

echo ""
echo "🧪 Step 2: Testing nginx configuration..."

# Test nginx configuration
docker exec multi-site-nginx nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx configuration is valid"
else
    echo "❌ Nginx configuration has errors"
    exit 1
fi

echo ""
echo "🔄 Step 3: Reloading nginx..."

# Reload nginx to apply changes
docker exec multi-site-nginx nginx -s reload

echo "✅ Nginx reloaded successfully"

echo ""
echo "🔐 Step 4: Checking SSL certificates..."

# Check existing certificates
echo "Existing SSL certificates:"
docker exec multi-site-certbot ls -la /etc/letsencrypt/live/ || echo "No certificates found"

echo ""
echo "🆕 Step 5: Obtaining SSL certificate for gprealty-cy.com..."

# Stop nginx temporarily to obtain certificate
docker stop multi-site-nginx

# Get SSL certificate for gprealty-cy.com
docker run --rm \
    -v "$PWD/certbot/conf:/etc/letsencrypt" \
    -v "$PWD/certbot/www:/var/www/certbot" \
    -p 80:80 \
    certbot/certbot certonly \
    --standalone \
    --email admin@gprealty-cy.com \
    --agree-tos \
    --no-eff-email \
    -d gprealty-cy.com \
    -d www.gprealty-cy.com

if [ $? -eq 0 ]; then
    echo "✅ SSL certificate obtained for gprealty-cy.com"
else
    echo "⚠️  Failed to obtain SSL certificate for gprealty-cy.com"
    echo "This might be due to DNS not pointing to this server yet"
fi

# Restart nginx
docker start multi-site-nginx

# Wait for nginx to start
sleep 5

echo ""
echo "🧪 Step 6: Testing the deployments..."

echo "Testing local connectivity:"
echo "- Testing zeropoint app connection:"
docker exec multi-site-nginx curl -s -o /dev/null -w "%{http_code}" http://zeropoint-app:3000 || echo "Failed"

echo "- Testing template app connection:"
docker exec multi-site-nginx curl -s -o /dev/null -w "%{http_code}" http://template-app:3001 || echo "Failed"

echo ""
echo "Testing external access:"
echo "- Testing HTTP access:"
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost/

echo "- Testing zeropoint-labs.com:"
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://zeropoint-labs.com/ || echo "Failed (DNS might not be configured)"

echo "- Testing gprealty-cy.com:"
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://gprealty-cy.com/ || echo "Failed (DNS might not be configured)"

echo ""
echo "📊 Step 7: Final status check..."

echo "Container status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "Nginx sites enabled:"
ls -la nginx/sites-enabled/

echo ""
echo "SSL certificates:"
docker exec multi-site-certbot ls -la /etc/letsencrypt/live/ 2>/dev/null || echo "No certificates directory"

echo ""
echo "🎉 Multi-site deployment fix completed!"
echo ""
echo "📝 Next Steps:"
echo "1. Verify DNS records point to this server (147.93.95.195):"
echo "   - zeropoint-labs.com A record → 147.93.95.195"
echo "   - gprealty-cy.com A record → 147.93.95.195"
echo ""
echo "2. Test your sites:"
echo "   - https://zeropoint-labs.com"
echo "   - https://gprealty-cy.com"
echo ""
echo "3. If HTTPS doesn't work immediately, run this command to get certificates:"
echo "   docker run --rm -v \$PWD/certbot/conf:/etc/letsencrypt -v \$PWD/certbot/www:/var/www/certbot -p 80:80 certbot/certbot certonly --standalone --email admin@gprealty-cy.com --agree-tos --no-eff-email -d gprealty-cy.com -d www.gprealty-cy.com"
echo ""
echo "✅ Script completed successfully!" 