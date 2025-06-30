# Multi-Project VPS Deployment Guide
## Hosting Multiple Next.js Projects on One VPS with Individual Domains

This guide shows you how to host multiple Next.js projects on a single VPS, each with its own domain and SSL certificate.

## 📋 Overview

**What You'll Achieve:**
- Multiple Next.js projects on one VPS
- Each project has its own domain (e.g., client1.com, client2.com, portfolio.com)
- Individual SSL certificates for each domain
- Independent deployments
- Shared resources for cost efficiency

## 🏗️ Architecture

```
VPS Structure:
/var/www/
├── zeropoint-labs/          → zeropoint-labs.com
├── client-website-1/        → client1.com
├── client-website-2/        → client2.com
├── portfolio-site/          → yourportfolio.com
├── nginx-proxy/            → Main Nginx configuration
└── ssl-certificates/       → Shared SSL storage
```

**Port Allocation:**
- Project 1 (zeropoint-labs): Internal port 3000
- Project 2 (client1): Internal port 3001
- Project 3 (client2): Internal port 3002
- Project 4 (portfolio): Internal port 3003
- Main Nginx: Ports 80 & 443 (public)

## 🚀 Step-by-Step Setup

### Phase 1: Prepare VPS Structure

```bash
# Create main directories
mkdir -p /var/www/nginx-proxy
mkdir -p /var/www/ssl-certificates
mkdir -p /var/www/client-website-1
mkdir -p /var/www/client-website-2
mkdir -p /var/www/portfolio-site

# Set proper permissions
chown -R root:root /var/www/
chmod -R 755 /var/www/
```

### Phase 2: Create Main Nginx Proxy

Create the main Nginx configuration that will handle all domains:

```bash
cd /var/www/nginx-proxy
```

**Create `docker-compose.yml`:**
```yaml
version: '3.8'

services:
  nginx-proxy:
    image: nginx:alpine
    container_name: main-nginx-proxy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ../ssl-certificates:/etc/nginx/ssl:ro
    networks:
      - proxy-network

networks:
  proxy-network:
    external: true
```

**Create `nginx.conf`:**
```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log;

    # Basic Settings
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 16M;

    # Gzip Settings
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

    # HTTP to HTTPS redirect
    server {
        listen 80;
        server_name _;
        return 301 https://$host$request_uri;
    }

    # Zero Point Labs - zeropoint-labs.com
    server {
        listen 443 ssl http2;
        server_name zeropoint-labs.com www.zeropoint-labs.com;

        ssl_certificate /etc/nginx/ssl/zeropoint-labs.com/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/zeropoint-labs.com/key.pem;
        
        include /etc/nginx/ssl-params.conf;

        location / {
            proxy_pass http://host.docker.internal:3000;
            include /etc/nginx/proxy-params.conf;
        }
    }

    # Client Website 1 - client1.com
    server {
        listen 443 ssl http2;
        server_name client1.com www.client1.com;

        ssl_certificate /etc/nginx/ssl/client1.com/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/client1.com/key.pem;
        
        include /etc/nginx/ssl-params.conf;

        location / {
            proxy_pass http://host.docker.internal:3001;
            include /etc/nginx/proxy-params.conf;
        }
    }

    # Client Website 2 - client2.com
    server {
        listen 443 ssl http2;
        server_name client2.com www.client2.com;

        ssl_certificate /etc/nginx/ssl/client2.com/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/client2.com/key.pem;
        
        include /etc/nginx/ssl-params.conf;

        location / {
            proxy_pass http://host.docker.internal:3002;
            include /etc/nginx/proxy-params.conf;
        }
    }

    # Portfolio Site - yourportfolio.com
    server {
        listen 443 ssl http2;
        server_name yourportfolio.com www.yourportfolio.com;

        ssl_certificate /etc/nginx/ssl/yourportfolio.com/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/yourportfolio.com/key.pem;
        
        include /etc/nginx/ssl-params.conf;

        location / {
            proxy_pass http://host.docker.internal:3003;
            include /etc/nginx/proxy-params.conf;
        }
    }
}
```

**Create `ssl-params.conf`:**
```nginx
# Modern SSL configuration
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384;
ssl_prefer_server_ciphers off;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;

# Security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

**Create `proxy-params.conf`:**
```nginx
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection 'upgrade';
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_cache_bypass $http_upgrade;
proxy_read_timeout 86400;
```

### Phase 3: Setup Individual Projects

For each new project, follow this template:

#### Project Template Structure

```bash
# Navigate to project directory
cd /var/www/client-website-1

# Clone or upload your project files
git clone YOUR_PROJECT_REPO .

# Create project-specific docker-compose.yml
```

**Project `docker-compose.yml` Template:**
```yaml
version: '3.8'

services:
  client1-website:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: client1-website
    restart: unless-stopped
    ports:
      - "3001:3000"  # Change port for each project
    environment:
      - NODE_ENV=production
      - NEXT_TELEMETRY_DISABLED=1
    networks:
      - proxy-network

networks:
  proxy-network:
    external: true
```

**Project `Dockerfile` (same for all projects):**
```dockerfile
# Use the official Node.js 18 Alpine image as base
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Phase 4: SSL Certificate Management

#### Setup SSL for Each Domain

```bash
# Create SSL directories
mkdir -p /var/www/ssl-certificates/zeropoint-labs.com
mkdir -p /var/www/ssl-certificates/client1.com
mkdir -p /var/www/ssl-certificates/client2.com
mkdir -p /var/www/ssl-certificates/yourportfolio.com

# Get SSL certificates for each domain
certbot certonly --standalone -d zeropoint-labs.com -d www.zeropoint-labs.com
certbot certonly --standalone -d client1.com -d www.client1.com
certbot certonly --standalone -d client2.com -d www.client2.com
certbot certonly --standalone -d yourportfolio.com -d www.yourportfolio.com

# Copy certificates to shared location
cp /etc/letsencrypt/live/zeropoint-labs.com/fullchain.pem /var/www/ssl-certificates/zeropoint-labs.com/cert.pem
cp /etc/letsencrypt/live/zeropoint-labs.com/privkey.pem /var/www/ssl-certificates/zeropoint-labs.com/key.pem

cp /etc/letsencrypt/live/client1.com/fullchain.pem /var/www/ssl-certificates/client1.com/cert.pem
cp /etc/letsencrypt/live/client1.com/privkey.pem /var/www/ssl-certificates/client1.com/key.pem

# Repeat for other domains...

# Set proper permissions
chmod 644 /var/www/ssl-certificates/*/cert.pem
chmod 600 /var/www/ssl-certificates/*/key.pem
```

### Phase 5: Deployment Process

#### Initial Setup

```bash
# Create the proxy network
docker network create proxy-network

# Start the main Nginx proxy
cd /var/www/nginx-proxy
docker-compose up -d

# Deploy each project
cd /var/www/zeropoint-labs/zeropoint-hostinger
docker-compose up -d

cd /var/www/client-website-1
docker-compose up -d

cd /var/www/client-website-2
docker-compose up -d

cd /var/www/portfolio-site
docker-compose up -d
```

#### Adding a New Project

```bash
# 1. Create project directory
mkdir -p /var/www/new-project

# 2. Upload/clone project files
cd /var/www/new-project
git clone YOUR_NEW_PROJECT_REPO .

# 3. Create docker-compose.yml with unique port (e.g., 3004)
# 4. Add server block to main nginx.conf
# 5. Get SSL certificate for new domain
# 6. Deploy the project
docker-compose up -d

# 7. Restart main Nginx to load new config
cd /var/www/nginx-proxy
docker-compose restart
```

## 🔧 Management Scripts

### Create Master Deployment Script

**Create `/var/www/deploy-all.sh`:**
```bash
#!/bin/bash

echo "🚀 Deploying All Projects"
echo "========================="

# Array of project directories
PROJECTS=(
    "/var/www/zeropoint-labs/zeropoint-hostinger"
    "/var/www/client-website-1"
    "/var/www/client-website-2"
    "/var/www/portfolio-site"
)

# Deploy each project
for project in "${PROJECTS[@]}"; do
    if [ -d "$project" ]; then
        echo "Deploying: $project"
        cd "$project"
        git pull
        docker-compose up --build -d
        echo "✅ $project deployed"
    else
        echo "⚠️  Directory not found: $project"
    fi
done

# Restart main proxy
echo "Restarting main Nginx proxy..."
cd /var/www/nginx-proxy
docker-compose restart

echo "🎉 All deployments complete!"
```

### Create SSL Renewal Script

**Create `/var/www/renew-ssl.sh`:**
```bash
#!/bin/bash

echo "🔒 Renewing SSL Certificates"
echo "============================"

# Stop main nginx to free ports 80/443
cd /var/www/nginx-proxy
docker-compose stop

# Renew all certificates
certbot renew --quiet

# Copy renewed certificates
DOMAINS=("zeropoint-labs.com" "client1.com" "client2.com" "yourportfolio.com")

for domain in "${DOMAINS[@]}"; do
    if [ -d "/etc/letsencrypt/live/$domain" ]; then
        cp "/etc/letsencrypt/live/$domain/fullchain.pem" "/var/www/ssl-certificates/$domain/cert.pem"
        cp "/etc/letsencrypt/live/$domain/privkey.pem" "/var/www/ssl-certificates/$domain/key.pem"
        chmod 644 "/var/www/ssl-certificates/$domain/cert.pem"
        chmod 600 "/var/www/ssl-certificates/$domain/key.pem"
        echo "✅ Renewed: $domain"
    fi
done

# Restart main nginx
docker-compose up -d

echo "🎉 SSL renewal complete!"
```

### Make Scripts Executable

```bash
chmod +x /var/www/deploy-all.sh
chmod +x /var/www/renew-ssl.sh
```

## 📅 Automated SSL Renewal

Add to crontab:
```bash
crontab -e

# Add this line:
0 3 * * 0 /var/www/renew-ssl.sh >> /var/log/ssl-renewal.log 2>&1
```

## 🔍 Monitoring & Maintenance

### Check All Services

```bash
# Check all containers
docker ps

# Check specific project
cd /var/www/client-website-1
docker-compose logs -f

# Check main proxy
cd /var/www/nginx-proxy
docker-compose logs -f
```

### Resource Monitoring

```bash
# Check resource usage
docker stats

# Check disk usage
df -h

# Check memory usage
free -h
```

## 📊 VPS Resource Requirements

### Recommended Specs by Number of Projects

| Projects | RAM | CPU | Storage | Monthly Cost |
|----------|-----|-----|---------|--------------|
| 1-2      | 2GB | 1 Core | 50GB | $10-15 |
| 3-5      | 4GB | 2 Cores | 80GB | $20-30 |
| 6-10     | 8GB | 4 Cores | 160GB | $40-60 |

### Performance Optimization

```bash
# Optimize Docker
echo '{"log-driver":"json-file","log-opts":{"max-size":"10m","max-file":"3"}}' > /etc/docker/daemon.json
systemctl restart docker

# Set up log rotation
echo '/var/lib/docker/containers/*/*.log {
    daily
    rotate 7
    compress
    size=1M
    missingok
    delaycompress
    copytruncate
}' > /etc/logrotate.d/docker
```

## 🚨 Troubleshooting

### Common Issues

**Port Conflicts:**
```bash
# Check what's using a port
netstat -tlnp | grep :3001

# Kill process if needed
kill -9 PID
```

**SSL Certificate Issues:**
```bash
# Check certificate validity
openssl x509 -in /var/www/ssl-certificates/domain.com/cert.pem -text -noout

# Test SSL
curl -I https://domain.com
```

**Container Issues:**
```bash
# Restart specific project
cd /var/www/project-name
docker-compose restart

# Rebuild if needed
docker-compose up --build -d
```

## 🎯 Benefits of This Setup

✅ **Cost Effective**: One VPS hosts multiple sites
✅ **Independent Deployments**: Each project deploys separately
✅ **Individual SSL**: Each domain has its own certificate
✅ **Easy Scaling**: Add new projects easily
✅ **Resource Sharing**: Efficient use of VPS resources
✅ **Professional Setup**: Production-ready configuration

## 🔄 Adding Your Next Project

1. **Create project directory**: `mkdir -p /var/www/new-project`
2. **Upload project files**: Git clone or SCP
3. **Configure docker-compose.yml**: Use next available port
4. **Add Nginx server block**: Update main nginx.conf
5. **Get SSL certificate**: Run certbot for new domain
6. **Deploy**: `docker-compose up -d`
7. **Test**: Visit your new domain

This setup allows you to efficiently manage multiple client projects on a single VPS while maintaining professional standards and security! 🚀
