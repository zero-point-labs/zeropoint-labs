#!/bin/bash

# Enhanced deployment script for Zero Point Labs on VPS with Docker

set -e

echo "🚀 Starting enhanced deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Function to check prerequisites
check_prerequisites() {
    print_step "🔍 Checking prerequisites..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    # Check if Docker Compose is available
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not available. Please install Docker Compose."
        exit 1
    fi

    # Check if required files exist
    if [ ! -f "docker-compose.yml" ]; then
        print_error "docker-compose.yml not found in current directory"
        exit 1
    fi

    if [ ! -f "Dockerfile" ]; then
        print_error "Dockerfile not found in current directory"
        exit 1
    fi

    print_status "✅ Prerequisites check passed"
}

# Function to clean up old containers and images
cleanup_old_deployment() {
    print_step "🧹 Cleaning up old deployment..."
    
    # Stop and remove existing containers
    docker-compose down --remove-orphans 2>/dev/null || docker compose down --remove-orphans 2>/dev/null || true
    
    # Remove old images to force rebuild
    docker image prune -f || true
    
    print_status "✅ Cleanup completed"
}

# Function to check SSL configuration
check_ssl_config() {
    print_step "🔒 Checking SSL configuration..."
    
    if [ -d "./certbot/conf/live/zeropoint-labs.com" ]; then
        print_status "SSL certificates found, using HTTPS configuration"
        
        # Copy HTTPS nginx config if it exists
        if [ -f "./nginx/default.conf" ] && [ -f "./nginx/default-http-only.conf" ]; then
            print_status "Switching to HTTPS nginx configuration"
            # Update docker-compose to use HTTPS config
            sed -i.bak 's/default-http-only.conf/default.conf/g' docker-compose.yml
        fi
    else
        print_warning "No SSL certificates found, using HTTP-only configuration"
        
        # Ensure HTTP-only config is used
        if [ -f "./nginx/default.conf" ] && [ -f "./nginx/default-http-only.conf" ]; then
            print_status "Using HTTP-only nginx configuration"
            # Update docker-compose to use HTTP-only config
            sed -i.bak 's/default.conf/default-http-only.conf/g' docker-compose.yml
        fi
    fi
}

# Function to build and start containers
deploy_containers() {
    print_step "🐳 Building and starting containers..."
    
    # Build and start containers with verbose output
    if command -v docker-compose &> /dev/null; then
        docker-compose up -d --build --force-recreate
    else
        docker compose up -d --build --force-recreate
    fi
    
    print_status "✅ Containers started"
}

# Function to verify deployment
verify_deployment() {
    print_step "🔍 Verifying deployment..."
    
    # Wait for containers to be ready
    print_status "Waiting for containers to start..."
    sleep 15
    
    # Check if containers are running
    if ! docker ps | grep -q "zeropoint-labs"; then
        print_error "❌ Containers are not running properly"
        print_error "Check logs with: docker-compose logs"
        exit 1
    fi
    
    # Test internal connectivity
    print_status "Testing internal connectivity..."
    if docker exec zeropoint-labs-nginx ping -c 1 nextjs-app &> /dev/null; then
        print_status "✅ Internal connectivity working"
    else
        print_warning "⚠️ Internal connectivity issues detected"
    fi
    
    # Test HTTP endpoint
    print_status "Testing HTTP endpoint..."
    if curl -f -s http://localhost > /dev/null; then
        print_status "✅ HTTP endpoint responding"
    else
        print_warning "⚠️ HTTP endpoint not responding"
    fi
    
    print_status "✅ Basic deployment verification completed"
}

# Function to show deployment status
show_deployment_status() {
    echo ""
    print_status "🎉 Deployment process completed!"
    print_status "=============================================="
    
    print_status "📊 Container Status:"
    docker ps --filter "name=zeropoint-labs" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    
    echo ""
    print_status "🌐 Your application should be available at:"
    
    if [ -d "./certbot/conf/live/zeropoint-labs.com" ]; then
        print_status "- HTTPS: https://zeropoint-labs.com (Primary)"
        print_status "- HTTP: http://zeropoint-labs.com (Redirects to HTTPS)"
    else
        print_status "- HTTP: http://zeropoint-labs.com"
        print_warning "- HTTPS: Not configured (run ./ssl-setup.sh zeropoint-labs.com)"
    fi
    
    echo ""
    print_status "🔧 Useful commands:"
    print_status "- View logs: docker-compose logs -f"
    print_status "- Restart: docker-compose restart"
    print_status "- Stop: docker-compose down"
    print_status "- Troubleshoot: ./troubleshoot.sh"
    
    echo ""
    print_status "🆘 If there are issues, run: ./troubleshoot.sh"
}

# Main deployment process
main() {
    check_prerequisites
    cleanup_old_deployment
    check_ssl_config
    deploy_containers
    verify_deployment
    show_deployment_status
}

# Run main function
main 