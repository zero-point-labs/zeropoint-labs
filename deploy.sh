#!/bin/bash

echo "🚀 Zero Point Labs VPS Deployment Script"
echo "========================================"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command_exists docker; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command_exists docker-compose; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Check if nginx.conf exists
if [ ! -f "./nginx/nginx.conf" ]; then
    echo "⚠️  nginx.conf not found. Creating from template..."
    if [ -f "./nginx/nginx.conf.bak" ]; then
        cp "./nginx/nginx.conf.bak" "./nginx/nginx.conf"
        echo "✅ nginx.conf created from backup"
    else
        echo "❌ No nginx configuration found. Please check the nginx setup."
        exit 1
    fi
fi

# Check environment file
if [ ! -f "./.env.local" ]; then
    echo "⚠️  .env.local not found. Creating from template..."
    cat > .env.local << 'EOF'
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=6861736a0007a58bac63

# Server-side Appwrite API Key (replace with your actual key)
APPWRITE_API_KEY=your_appwrite_api_key_here

# Production settings
NODE_ENV=production
PORT=3000

# Add your domain for production
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your_nextauth_secret_here
EOF
    echo "✅ .env.local created. Please update with your actual values."
fi

# Function to update nginx config with actual domain
update_nginx_config() {
    if [ ! -z "$1" ]; then
        sed -i "s/your-domain.com/$1/g" ./nginx/nginx.conf
        echo "✅ Updated nginx config with domain: $1"
    fi
}

# Ask for domain if not provided
if [ -z "$1" ]; then
    echo "📝 Please enter your domain name (e.g., example.com):"
    read -r DOMAIN
    if [ ! -z "$DOMAIN" ]; then
        update_nginx_config "$DOMAIN"
    fi
else
    update_nginx_config "$1"
fi

# Build and start containers
echo "🔨 Building and starting containers..."
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Check container status
echo "📊 Checking container status..."
sleep 5
docker-compose ps

# Check if containers are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Containers are running successfully"
else
    echo "❌ Some containers failed to start. Check logs:"
    docker-compose logs
    exit 1
fi

echo ""
echo "🎉 Deployment completed!"
echo ""
echo "📋 Next steps:"
echo "1. Update your domain DNS to point to this server"
echo "2. Generate SSL certificates: ./ssl-setup.sh"
echo "3. Update .env.local with your actual Appwrite API key"
echo "4. Test your application at: http://your-domain.com"
echo ""
echo "🔧 Useful commands:"
echo "   • View logs: docker-compose logs -f"
echo "   • Restart: docker-compose restart"
echo "   • Stop: docker-compose down"
echo "   • Debug: ./debug-auth-issues.sh" 