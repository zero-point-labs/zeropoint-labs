#!/bin/bash

# Git-based deployment script for Zero Point Labs

set -e

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

# Check if VPS IP is provided
if [ -z "$1" ]; then
    print_error "Usage: $0 <vps_ip_address> [commit_message]"
    print_error "Example: $0 192.168.1.100 'Fix analytics and deploy'"
    exit 1
fi

VPS_IP=$1
COMMIT_MSG=${2:-"Deploy changes $(date '+%Y-%m-%d %H:%M:%S')"}

print_status "🚀 Starting Git-based deployment"
print_status "Repository: https://github.com/ZioDude/zeropoint-labs-vps-appwrite"
print_status "VPS: $VPS_IP"
echo ""

# Step 1: Check if there are changes to commit
print_step "📝 Checking for changes..."
if git diff-index --quiet HEAD --; then
    print_warning "No changes detected, proceeding with deployment anyway"
else
    print_status "Changes detected, staging files..."
    git add .
    
    print_status "Committing changes..."
    git commit -m "$COMMIT_MSG"
fi

# Step 2: Push to repository
print_step "📤 Pushing to GitHub..."
git push origin main || {
    print_warning "Push to main failed, trying master branch..."
    git push origin master
}

# Step 3: Deploy on VPS
print_step "🐳 Deploying on VPS..."
ssh root@$VPS_IP << 'ENDSSH'
cd /var/www/zeropoint-labs

# Fix Git ownership if needed
git config --global --add safe.directory /var/www/zeropoint-labs 2>/dev/null || true

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main || git pull origin master

# Deploy with Docker
echo "🐳 Starting Docker deployment..."
./deploy.sh
ENDSSH

print_status "✅ Git deployment complete!"
print_status "Your app should be available at your domain"
echo ""
print_status "🔗 Repository: https://github.com/ZioDude/zeropoint-labs-vps-appwrite"
print_status "📊 Check deployment logs: ssh root@$VPS_IP 'cd /var/www/zeropoint-labs && docker-compose logs -f'" 