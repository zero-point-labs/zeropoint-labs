#!/bin/bash

echo "🔐 SSL Certificate Setup Script"
echo "==============================="

# Check if domain is provided
if [ -z "$1" ]; then
    echo "📝 Please enter your domain name (e.g., example.com):"
    read -r DOMAIN
else
    DOMAIN="$1"
fi

if [ -z "$DOMAIN" ]; then
    echo "❌ Domain is required"
    exit 1
fi

echo "🌐 Setting up SSL for domain: $DOMAIN"

# Create directories for certbot
mkdir -p ./certbot/conf
mkdir -p ./certbot/www

# Create initial nginx config without SSL for certificate verification
cat > ./nginx/nginx-initial.conf << EOF
events {
    worker_connections 1024;
}

http {
    upstream zeropoint_app {
        server zeropoint-app:3000;
    }

    server {
        listen 80;
        server_name $DOMAIN www.$DOMAIN;
        
        # Let's Encrypt challenge
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }
        
        # Temporary redirect to app for testing
        location / {
            proxy_pass http://zeropoint_app;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }
    }
}
EOF

# Update docker-compose to use initial nginx config
cp ./docker-compose.yml ./docker-compose.yml.bak
sed -i 's|nginx.conf.bak|nginx-initial.conf|g' ./docker-compose.yml

echo "🚀 Starting containers with HTTP-only configuration..."
docker-compose down
docker-compose up -d nginx

# Wait for nginx to be ready
echo "⏱️  Waiting for nginx to be ready..."
sleep 10

# Request SSL certificate
echo "📜 Requesting SSL certificate from Let's Encrypt..."
docker-compose run --rm certbot certonly \
    --webroot \
    --webroot-path /var/www/certbot \
    --email admin@$DOMAIN \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN \
    -d www.$DOMAIN

# Check if certificate was created
if [ -f "./certbot/conf/live/$DOMAIN/fullchain.pem" ]; then
    echo "✅ SSL certificate created successfully"
    
    # Update nginx config with SSL
    cp ./nginx/nginx.conf.bak ./nginx/nginx.conf
    sed -i "s/your-domain.com/$DOMAIN/g" ./nginx/nginx.conf
    
    # Restore original docker-compose
    cp ./docker-compose.yml.bak ./docker-compose.yml
    
    # Restart with SSL configuration
    echo "🔄 Restarting with SSL configuration..."
    docker-compose down
    docker-compose up -d
    
    echo "🎉 SSL setup completed!"
    echo "✅ Your site should now be accessible at: https://$DOMAIN"
    
else
    echo "❌ SSL certificate creation failed"
    echo "📋 Common issues:"
    echo "   • Domain doesn't point to this server"
    echo "   • Port 80 is not accessible from internet"
    echo "   • Firewall blocking traffic"
    echo "   • DNS propagation not complete"
    
    # Restore original docker-compose
    cp ./docker-compose.yml.bak ./docker-compose.yml
    exit 1
fi

echo ""
echo "🔧 SSL certificate will auto-renew via the certbot container"
echo "📋 To manually renew: docker-compose exec certbot certbot renew" 