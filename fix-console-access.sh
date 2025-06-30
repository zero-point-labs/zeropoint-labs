#!/bin/bash

echo "🔧 FIXING APPWRITE CONSOLE ACCESS"
echo "================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📋 Current issue: nginx forcing HTTPS redirect${NC}"
echo -e "${BLUE}🔧 Solution: Temporarily allow HTTP access for console setup${NC}"
echo ""

# Method 1: Try direct container access first
echo -e "${YELLOW}🔍 Method 1: Testing direct Appwrite container access...${NC}"
APPWRITE_IP=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' appwrite)
echo "Appwrite container IP: $APPWRITE_IP"

if curl -f -s "http://$APPWRITE_IP/console" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Direct container access works!${NC}"
    echo -e "${BLUE}🌐 You can access console at: http://$APPWRITE_IP/console${NC}"
    echo -e "${YELLOW}⚠️ Note: This is only accessible from the VPS itself${NC}"
else
    echo -e "${RED}❌ Direct container access failed${NC}"
fi

echo ""
echo -e "${YELLOW}🔧 Method 2: Temporarily modifying nginx config...${NC}"

# Backup current nginx config
cp nginx.conf nginx.conf.backup

# Create temporary nginx config that allows HTTP console access
cat > nginx.conf.temp << 'EOF'
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Basic Settings
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    client_max_body_size 16M;

    # Upstream for Next.js app
    upstream nextjs_upstream {
        server zeropoint-website:3000;
    }

    # Upstream for Appwrite
    upstream appwrite_upstream {
        server appwrite:80;
    }

    # HTTP server - ALLOW for console setup
    server {
        listen 80;
        server_name _;

        # Appwrite Console - allow HTTP for setup
        location /console {
            proxy_pass http://appwrite_upstream;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Appwrite API routes
        location /v1 {
            proxy_pass http://appwrite_upstream;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Root location - proxy to Next.js
        location / {
            proxy_pass http://nextjs_upstream;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
EOF

echo -e "${YELLOW}🔄 Applying temporary nginx configuration...${NC}"
cp nginx.conf.temp nginx.conf

echo -e "${YELLOW}🔄 Restarting nginx with new config...${NC}"
docker-compose -f docker-compose.appwrite.yml restart nginx

echo -e "${YELLOW}⏳ Waiting for nginx to restart...${NC}"
sleep 10

echo -e "${YELLOW}🔍 Testing HTTP console access...${NC}"
for i in {1..10}; do
    if curl -f -s "http://zeropoint-labs.com/console" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ HTTP Console access working!${NC}"
        CONSOLE_WORKING=true
        break
    else
        echo "Attempt $i/10 failed, retrying in 3 seconds..."
        sleep 3
    fi
done

if [ "$CONSOLE_WORKING" = true ]; then
    echo ""
    echo -e "${GREEN}🎉 SUCCESS! Console is now accessible${NC}"
    echo ""
    echo -e "${BLUE}📋 Next steps:${NC}"
    echo "1. 🌐 Visit: http://zeropoint-labs.com/console (HTTP - no S)"
    echo "2. 👤 Create your admin account"
    echo "3. 🗂️ Create project with ID: 'zeropoint-labs'"
    echo "4. 🔑 Copy the API key"
    echo "5. 📝 Update .env.local with the API key"
    echo "6. ⚡ Run: npm run init-appwrite"
    echo "7. 🔒 Run: ./restore-nginx.sh (to restore HTTPS after setup)"
    echo ""
    
    # Create restore script
    cat > restore-nginx.sh << 'EOF'
#!/bin/bash
echo "🔒 Restoring original nginx configuration with HTTPS..."
cp nginx.conf.backup nginx.conf
docker-compose -f docker-compose.appwrite.yml restart nginx
echo "✅ HTTPS configuration restored!"
EOF
    chmod +x restore-nginx.sh
    
else
    echo -e "${RED}❌ Console access still not working${NC}"
    echo -e "${YELLOW}🔄 Restoring original nginx config...${NC}"
    cp nginx.conf.backup nginx.conf
    docker-compose -f docker-compose.appwrite.yml restart nginx
fi

echo ""
echo -e "${YELLOW}📊 Current Status:${NC}"
docker-compose -f docker-compose.appwrite.yml ps 