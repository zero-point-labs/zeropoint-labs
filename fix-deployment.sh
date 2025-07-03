#!/bin/bash

# Fix deployment script to resolve directory and container issues

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

print_status "🔧 Fixing multi-website deployment..."

# Step 1: Find template directory
print_status "1. Locating template directory..."
TEMPLATE_DIR=""

# Check common locations
if [ -d "/var/www/simple-template-first copy" ]; then
    TEMPLATE_DIR="/var/www/simple-template-first copy"
elif [ -d "../simple-template-first copy" ]; then
    TEMPLATE_DIR="../simple-template-first copy"
elif [ -d "/var/www/template" ]; then
    TEMPLATE_DIR="/var/www/template"
else
    # Search for any directory with template in name
    FOUND_DIRS=$(find /var/www -maxdepth 2 -name "*template*" -type d 2>/dev/null | head -5)
    if [ ! -z "$FOUND_DIRS" ]; then
        print_warning "Found potential template directories:"
        echo "$FOUND_DIRS"
        FIRST_DIR=$(echo "$FOUND_DIRS" | head -1)
        print_status "Using first found directory: $FIRST_DIR"
        
        # Create symlink or copy to expected location
        if [ ! -d "/var/www/simple-template-first copy" ]; then
            print_status "Creating symlink to template directory..."
            ln -sf "$FIRST_DIR" "/var/www/simple-template-first copy"
            TEMPLATE_DIR="/var/www/simple-template-first copy"
        fi
    else
        print_error "Template directory not found! Please ensure it exists at /var/www/"
        print_error "Expected location: /var/www/simple-template-first copy"
        exit 1
    fi
fi

print_status "✅ Template directory found: $TEMPLATE_DIR"

# Step 2: Clean up old containers
print_status "2. Cleaning up old containers..."
docker compose down 2>/dev/null || true
docker rm -f zeropoint-labs-app zeropoint-labs-nginx zeropoint-labs-certbot 2>/dev/null || true
docker rm -f multi-site-nginx gprealty-cyprus-app multi-site-certbot 2>/dev/null || true

# Step 3: Update docker-compose.yml context path if needed
print_status "3. Checking docker-compose.yml context path..."
CURRENT_PATH=$(grep -A 2 "template-app:" docker-compose.yml | grep "context:" | awk '{print $2}')
EXPECTED_PATH="../simple-template-first copy"

if [ "$CURRENT_PATH" != "$EXPECTED_PATH" ]; then
    print_status "Updating docker-compose.yml context path..."
    # Create backup
    cp docker-compose.yml docker-compose.yml.backup
    
    # Update the context path
    sed -i "s|context: .*simple.*|context: $EXPECTED_PATH|g" docker-compose.yml
    print_status "✅ Updated context path to: $EXPECTED_PATH"
fi

# Step 4: Ensure template has required files
print_status "4. Checking template files..."
if [ ! -f "$TEMPLATE_DIR/Dockerfile" ]; then
    print_error "Dockerfile not found in template directory!"
    print_error "Please ensure the template directory has all required files"
    exit 1
fi

# Step 5: Set up nginx sites
print_status "5. Setting up nginx site configurations..."
mkdir -p nginx/sites-enabled

# Enable sites
ln -sf ../sites-available/zeropoint-labs.com nginx/sites-enabled/ 2>/dev/null || true
ln -sf ../sites-available/gprealty-cy.com nginx/sites-enabled/ 2>/dev/null || true

# Remove old config
rm -f nginx/default.conf

# Step 6: Build and start containers
print_status "6. Building and starting containers..."
docker compose up -d --build

# Step 7: Wait for containers to start
print_status "7. Waiting for containers to start..."
sleep 15

# Step 8: Test the deployment
print_status "8. Testing deployment..."
docker compose ps

print_status "🎉 Deployment fix complete!"
print_status ""
print_status "Next steps:"
print_status "1. Test both websites:"
print_status "   - http://your-vps-ip (should show zeropoint-labs.com)"
print_status "   - http://your-vps-ip with Host header for gprealty-cy.com"
print_status "2. Run ./multi-ssl-setup.sh once DNS is properly configured"
print_status "3. Check container logs if issues persist:"
print_status "   - docker compose logs zeropoint-app"
print_status "   - docker compose logs template-app"
print_status "   - docker compose logs nginx" 