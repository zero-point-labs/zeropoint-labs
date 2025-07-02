#!/bin/bash

# Efficient transfer script for Zero Point Labs to VPS
# Only transfers source files, builds on VPS

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

# Check if VPS IP is provided
if [ -z "$1" ]; then
    print_error "Usage: $0 <vps_ip_address> [--clean]"
    print_error "Example: $0 192.168.1.100"
    print_error "Use --clean flag to clean build before transfer"
    exit 1
fi

VPS_IP=$1
PROJECT_DIR="/var/www/zeropoint-labs"
CLEAN_BUILD=${2:-""}

print_status "🚀 Starting efficient transfer to VPS: $VPS_IP"

# Optional: Clean local build
if [ "$CLEAN_BUILD" = "--clean" ]; then
    print_status "🧹 Cleaning local build files..."
    rm -rf .next node_modules
fi

# Only clean VPS directory if it's the first deployment
if [ "$CLEAN_BUILD" = "--clean" ]; then
    print_warning "🧹 Cleaning up VPS directory..."
    ssh root@$VPS_IP "rm -rf $PROJECT_DIR && mkdir -p $PROJECT_DIR"
else
    ssh root@$VPS_IP "mkdir -p $PROJECT_DIR"
fi

# Transfer only source files using rsync with delta sync (more efficient)
print_status "📦 Transferring changed files only..."
rsync -avz --progress --delete \
  --exclude 'node_modules/' \
  --exclude '.next/' \
  --exclude '.git/' \
  --exclude '.DS_Store' \
  --exclude '*.log' \
  --exclude '.env.local' \
  --exclude 'tsconfig.tsbuildinfo' \
  --exclude '.vercel/' \
  --exclude 'coverage/' \
  --exclude '.nyc_output/' \
  ./ root@$VPS_IP:$PROJECT_DIR/

print_status "✅ Transfer complete!"
print_status "Files transferred to: $PROJECT_DIR"
echo ""
print_status "🔧 Next steps on your VPS:"
print_status "1. SSH into VPS: ssh root@$VPS_IP"
print_status "2. Navigate to project: cd $PROJECT_DIR"
print_status "3. Deploy with Docker: ./deploy.sh"
echo ""
print_warning "💡 Tip: The Docker build will install dependencies and build the app on the VPS"
print_status "🚀 Or run this one-liner to deploy immediately:"
print_status "ssh root@$VPS_IP 'cd $PROJECT_DIR && ./deploy.sh'" 