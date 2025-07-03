#!/bin/bash

# 🚀 GP.Realty Cyprus - Automated Deployment Script
# Domain: gprealty-cy.com

set -e  # Exit on any error

# Configuration
DOMAIN="gprealty-cy.com"
APP_NAME="gprealty"
COMPOSE_FILE="docker-compose.yml"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_step() {
    echo -e "${BLUE}=== $1 ===${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Docker is installed
check_docker() {
    print_step "Checking Docker installation"
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_success "Docker and Docker Compose are installed"
}

# Create necessary directories
create_directories() {
    print_step "Creating necessary directories"
    
    mkdir -p certbot/conf
    mkdir -p certbot/www
    mkdir -p nginx/sites-enabled
    
    print_success "Directories created"
}

# Enable the site in nginx
enable_site() {
    print_step "Enabling site in nginx"
    
    if [ ! -f "nginx/sites-available/${DOMAIN}" ]; then
        print_error "Site configuration not found: nginx/sites-available/${DOMAIN}"
        exit 1
    fi
    
    # Create symlink if it doesn't exist
    if [ ! -L "nginx/sites-enabled/${DOMAIN}" ]; then
        ln -sf ../sites-available/${DOMAIN} nginx/sites-enabled/${DOMAIN}
        print_success "Site enabled: ${DOMAIN}"
    else
        print_success "Site already enabled: ${DOMAIN}"
    fi
}

# Start services without SSL first
start_services_http() {
    print_step "Starting services (HTTP only)"
    
    # Stop any running services
    docker-compose down 2>/dev/null || true
    
    # Start nginx and app (without certbot initially)
    docker-compose up -d gprealty-app nginx
    
    # Wait for services to be ready
    sleep 10
    
    print_success "Services started in HTTP mode"
}

# Setup SSL certificates
setup_ssl() {
    print_step "Setting up SSL certificates"
    
    # Check if domain is pointing to this server
    echo -e "${YELLOW}Before setting up SSL, make sure your domain ${DOMAIN} is pointing to this server.${NC}"
    read -p "Is ${DOMAIN} pointing to this server? (y/n): " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Please configure your DNS first, then run this script again."
        exit 1
    fi
    
    # Test if the domain is accessible
    print_step "Testing domain accessibility"
    if ! curl -f -s "http://${DOMAIN}/.well-known/acme-challenge/test" &>/dev/null; then
        print_warning "Domain might not be properly configured, but continuing with SSL setup..."
    fi
    
    # Get SSL certificate
    docker-compose run --rm certbot \
        certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        --email admin@${DOMAIN} \
        --agree-tos \
        --no-eff-email \
        -d ${DOMAIN} \
        -d www.${DOMAIN} || {
        print_error "SSL certificate generation failed"
        exit 1
    }
    
    print_success "SSL certificate obtained"
}

# Restart services with SSL
restart_with_ssl() {
    print_step "Restarting services with SSL"
    
    # Restart all services including certbot
    docker-compose down
    docker-compose up -d
    
    # Wait for services to be ready
    sleep 10
    
    print_success "Services restarted with SSL"
}

# Verify deployment
verify_deployment() {
    print_step "Verifying deployment"
    
    # Check if services are running
    if ! docker-compose ps | grep -q "Up"; then
        print_error "Some services are not running"
        docker-compose ps
        exit 1
    fi
    
    # Test HTTP redirect
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://${DOMAIN} || echo "000")
    if [ "$HTTP_STATUS" != "301" ] && [ "$HTTP_STATUS" != "302" ]; then
        print_warning "HTTP redirect might not be working (Status: $HTTP_STATUS)"
    else
        print_success "HTTP redirect working"
    fi
    
    # Test HTTPS
    HTTPS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://${DOMAIN} || echo "000")
    if [ "$HTTPS_STATUS" != "200" ]; then
        print_warning "HTTPS might not be working (Status: $HTTPS_STATUS)"
    else
        print_success "HTTPS working"
    fi
    
    print_success "Deployment verification completed"
}

# Display final information
show_completion_info() {
    print_step "Deployment Complete! 🎉"
    
    echo -e "${GREEN}"
    echo "🏠 GP.Realty Cyprus is now deployed!"
    echo "🌐 Domain: https://${DOMAIN}"
    echo "🔒 SSL: Let's Encrypt"
    echo "📱 App Port: 3001 (internal)"
    echo -e "${NC}"
    
    echo -e "${BLUE}Useful Commands:${NC}"
    echo "  View logs:           docker-compose logs -f"
    echo "  Restart services:    docker-compose restart"
    echo "  Stop services:       docker-compose down"
    echo "  Update app:          git pull && docker-compose up -d --build gprealty-app"
    echo ""
    
    echo -e "${YELLOW}SSL Certificate Renewal:${NC}"
    echo "Add this to crontab for auto-renewal:"
    echo "0 12 * * * cd $(pwd) && docker-compose run --rm certbot renew --quiet"
}

# Main deployment process
main() {
    echo -e "${BLUE}"
    echo "🚀 GP.Realty Cyprus Deployment Script"
    echo "🌐 Domain: ${DOMAIN}"
    echo "📁 Path: $(pwd)"
    echo -e "${NC}"
    
    check_docker
    create_directories
    enable_site
    start_services_http
    setup_ssl
    restart_with_ssl
    verify_deployment
    show_completion_info
}

# Run main function
main "$@" 