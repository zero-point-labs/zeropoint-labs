#!/bin/bash

# Quick deployment script - transfers changes and deploys in one command

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if VPS IP is provided
if [ -z "$1" ]; then
    print_error "Usage: $0 <vps_ip_address> [--clean]"
    print_error "Example: $0 192.168.1.100"
    exit 1
fi

VPS_IP=$1
CLEAN_FLAG=${2:-""}

print_status "🚀 Quick deploy to VPS: $VPS_IP"

# Step 1: Transfer files
print_status "📦 Step 1: Transferring files..."
./transfer-to-vps.sh $VPS_IP $CLEAN_FLAG

# Step 2: Deploy on VPS
print_status "🐳 Step 2: Deploying with Docker..."
ssh root@$VPS_IP 'cd /var/www/zeropoint-labs && ./deploy.sh'

print_status "✅ Quick deployment complete!"
print_status "Your app should be available at your domain" 