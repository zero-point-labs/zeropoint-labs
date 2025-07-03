#!/bin/bash

# Setup script to enable nginx site configurations

set -e

# Colors for output
GREEN='\033[0;32m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_status "Setting up nginx site configurations..."

# Create sites-enabled directory if it doesn't exist
mkdir -p nginx/sites-enabled

# Enable zeropoint-labs.com site
print_status "Enabling zeropoint-labs.com..."
ln -sf ../sites-available/zeropoint-labs.com nginx/sites-enabled/

# Enable gprealty-cy.com site
print_status "Enabling gprealty-cy.com..."
ln -sf ../sites-available/gprealty-cy.com nginx/sites-enabled/

# Remove old default configuration if it exists
if [ -f "nginx/default.conf" ]; then
    print_status "Removing old default.conf..."
    rm -f nginx/default.conf
fi

print_status "✅ Site configurations enabled!"
print_status "Enabled sites:"
print_status "- zeropoint-labs.com"
print_status "- gprealty-cy.com" 