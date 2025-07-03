#!/bin/bash

# Fix GP Realty Cyprus Migration Script
set -e

echo "🔧 Fixing GP Realty Cyprus Migration..."

# Navigate to project directory
cd /var/www/gprealty-cyprus

# Create missing directories
echo "📁 Creating directories..."
mkdir -p nginx/sites-available
mkdir -p nginx/sites-enabled
mkdir -p nginx/conf.d
mkdir -p certbot/conf
mkdir -p certbot/www
mkdir -p src

# Create main nginx.conf
echo "📝 Creating nginx.conf..."
cat > nginx/nginx.conf << 'EOF'
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log notice;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;
    sendfile on;
    tcp_nopush on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 100M;

    gzip on;
    gzip_vary on;
    gzip_min_length 1000;
    gzip_proxied any;
    gzip_comp_level 6;

    include /etc/nginx/sites-enabled/*;
}
EOF

# Create site configuration
echo "🌐 Creating site configuration..."
cat > nginx/sites-available/gprealty-cy.com << 'EOF'
server {
    listen 80;
    server_name gprealty-cy.com www.gprealty-cy.com;
    server_tokens off;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name gprealty-cy.com www.gprealty-cy.com;
    server_tokens off;

    ssl_certificate /etc/letsencrypt/live/gprealty-cy.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/gprealty-cy.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    add_header Strict-Transport-Security "max-age=63072000" always;

    location / {
        proxy_pass http://gprealty-app:3000;
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

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://gprealty-app:3000;
        proxy_set_header Host $host;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Enable site configuration
echo "🔗 Enabling site..."
ln -sf ../sites-available/gprealty-cy.com nginx/sites-enabled/gprealty-cy.com

# Create docker-compose.yml if it doesn't exist
if [ ! -f "docker-compose.yml" ]; then
    echo "🐳 Creating docker-compose.yml..."
    cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  gprealty-app:
    build:
      context: ./src
      dockerfile: Dockerfile
    container_name: gprealty-cyprus-app
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - PORT=3000
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    container_name: gprealty-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/sites-available:/etc/nginx/sites-available:ro
      - ./nginx/sites-enabled:/etc/nginx/sites-enabled:ro
      - ./certbot/conf:/etc/letsencrypt:ro
      - ./certbot/www:/var/www/certbot:ro
    depends_on:
      - gprealty-app
    networks:
      - app-network

  certbot:
    image: certbot/certbot
    container_name: gprealty-certbot
    volumes:
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    command: sleep infinity

networks:
  app-network:
    driver: bridge
EOF
fi

# Test nginx configuration
echo "🧪 Testing nginx configuration..."
docker run --rm -v "$PWD/nginx/nginx.conf:/etc/nginx/nginx.conf:ro" \
    -v "$PWD/nginx/sites-enabled:/etc/nginx/sites-enabled:ro" \
    nginx:alpine nginx -t

echo "✅ Migration fix complete!"
echo ""
echo "Next steps:"
echo "1. Copy your source code: cp -r /var/www/zeropoint-labs/simple-template-first/* ./src/"
echo "2. Build and start: docker-compose up -d --build"
echo "3. Get SSL: docker-compose run --rm certbot certonly --webroot --webroot-path /var/www/certbot --email admin@gprealty-cy.com --agree-tos --no-eff-email -d gprealty-cy.com -d www.gprealty-cy.com" 