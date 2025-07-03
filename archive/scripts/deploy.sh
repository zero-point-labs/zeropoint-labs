#!/bin/bash

# Deployment script for Zero Point Labs on VPS with Docker

set -e

echo "🚀 Starting deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

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

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose down 2>/dev/null || docker compose down 2>/dev/null || true

# Build and start containers
print_status "Building and starting containers..."
if command -v docker-compose &> /dev/null; then
    docker-compose up -d --build
else
    docker compose up -d --build
fi

# Wait for containers to be ready
print_status "Waiting for containers to start..."
sleep 10

# Check if containers are running
if docker ps | grep -q "zeropoint-labs"; then
    print_status "✅ Deployment successful!"
    print_status "Your application should be available at:"
    print_status "- HTTP: http://zeropoint-labs.com"
    print_status "- HTTPS: https://zeropoint-labs.com (after SSL setup)"
    echo ""
    print_status "To check logs, run:"
    print_status "docker-compose logs -f"
    echo ""
    print_status "To get SSL certificate, run:"
    print_status "./ssl-setup.sh zeropoint-labs.com"
else
    print_error "❌ Deployment failed. Check logs with:"
    print_error "docker-compose logs"
    exit 1
fi 