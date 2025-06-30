# Zero Point Labs Website - Hostinger VPS Deployment Guide

This guide will walk you through deploying your Zero Point Labs website to your Hostinger VPS using Docker.

## 📋 Prerequisites

Before starting, make sure you have:
- ✅ Hostinger VPS purchased and active
- ✅ Domain name purchased
- ✅ SSH access details from Hostinger
- ✅ Terminal access on your Mac

## 🔧 Phase 1: SSH Setup and VPS Connection

### Step 1: Find Your VPS Connection Details

1. Check your email from Hostinger for VPS details:
   - **IP Address** (e.g., 192.168.1.100)
   - **Username** (usually 'root')
   - **Password**

### Step 2: Connect to Your VPS

Open Terminal on your Mac and run:

```bash
ssh root@YOUR_VPS_IP_ADDRESS
```

Replace `YOUR_VPS_IP_ADDRESS` with your actual IP address.

**Example:**
```bash
ssh root@192.168.1.100
```

When prompted:
- Type `yes` to accept the server fingerprint
- Enter your password when prompted

### Step 3: Update Your VPS

Once connected, update the system:

```bash
apt update && apt upgrade -y
```

## 🐳 Phase 2: Install Docker and Docker Compose

### Step 1: Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Start Docker service
systemctl start docker
systemctl enable docker

# Add current user to docker group (if not root)
usermod -aG docker $USER
```

### Step 2: Install Docker Compose

```bash
# Download Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make it executable
chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### Step 3: Install Additional Tools

```bash
# Install Git, Nginx tools, and Certbot for SSL
apt install -y git curl wget unzip certbot python3-certbot-nginx ufw
```

## 🔒 Phase 3: Basic Security Setup

### Step 1: Configure Firewall

```bash
# Enable UFW firewall
ufw --force enable

# Allow SSH, HTTP, and HTTPS
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp

# Check status
ufw status
```

### Step 2: Create Deployment Directory

```bash
# Create directory for your website
mkdir -p /var/www/zeropoint-labs
cd /var/www/zeropoint-labs
```

## 📁 Phase 4: Upload Your Website Files

### Option A: Using Git (Recommended)

If your code is in a Git repository:

```bash
# Clone your repository
git clone YOUR_REPOSITORY_URL .

# If you need to set up Git credentials:
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Option B: Using SCP from Your Mac

Open a new Terminal window on your Mac (keep the SSH session open) and run:

```bash
# Navigate to your project directory on Mac
cd /Users/akyriakouu/Documents/Zero\ Point/Projects/zeropoint-labs-hostinger

# Upload files to VPS
scp -r . root@YOUR_VPS_IP:/var/www/zeropoint-labs/
```

## 🌐 Phase 5: Domain Configuration

### Step 1: Configure DNS

1. Log into your domain registrar (where you bought the domain)
2. Go to DNS settings
3. Add an **A Record**:
   - **Name/Host**: @ (or leave blank)
   - **Value/Points to**: Your VPS IP address
   - **TTL**: 300 (or default)

4. Add a **CNAME Record** for www:
   - **Name/Host**: www
   - **Value/Points to**: your-domain.com
   - **TTL**: 300 (or default)

### Step 2: Wait for DNS Propagation

Wait 5-30 minutes for DNS changes to propagate. You can check with:

```bash
# On your VPS, test DNS resolution
nslookup your-domain.com
```

## 🚀 Phase 6: Deploy the Website

### Step 1: Prepare SSL Directory

```bash
# Create SSL directory
mkdir -p /var/www/zeropoint-labs/ssl

# Create temporary self-signed certificates (will be replaced with Let's Encrypt)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /var/www/zeropoint-labs/ssl/key.pem \
    -out /var/www/zeropoint-labs/ssl/cert.pem \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=your-domain.com"
```

### Step 2: Update Nginx Configuration

Edit the nginx.conf file to use your domain:

```bash
# Edit nginx configuration
nano nginx.conf
```

Find this line:
```
server_name _;
```

Replace with your domain:
```
server_name your-domain.com www.your-domain.com;
```

Save and exit (Ctrl+X, then Y, then Enter).

### Step 3: Run the Deployment

```bash
# Make sure you're in the project directory
cd /var/www/zeropoint-labs

# Run the deployment script
./deploy.sh
```

## 🔐 Phase 7: Set Up SSL Certificate

### Step 1: Stop Nginx Container Temporarily

```bash
docker-compose stop nginx
```

### Step 2: Get Let's Encrypt Certificate

```bash
# Get SSL certificate from Let's Encrypt
certbot certonly --standalone -d your-domain.com -d www.your-domain.com
```

When prompted:
- Enter your email address
- Agree to terms of service
- Choose whether to share email with EFF

### Step 3: Copy Certificates

```bash
# Copy Let's Encrypt certificates to your SSL directory
cp /etc/letsencrypt/live/your-domain.com/fullchain.pem /var/www/zeropoint-labs/ssl/cert.pem
cp /etc/letsencrypt/live/your-domain.com/privkey.pem /var/www/zeropoint-labs/ssl/key.pem

# Set proper permissions
chmod 644 /var/www/zeropoint-labs/ssl/cert.pem
chmod 600 /var/www/zeropoint-labs/ssl/key.pem
```

### Step 4: Restart Services

```bash
# Restart all services
docker-compose up -d
```

## ✅ Phase 8: Verify Deployment

### Step 1: Check Container Status

```bash
# Check if containers are running
docker-compose ps

# View logs if needed
docker-compose logs -f
```

### Step 2: Test Your Website

1. Open your browser
2. Visit `http://your-domain.com` (should redirect to HTTPS)
3. Visit `https://your-domain.com` (should show your website with SSL)

### Step 3: Test SSL Certificate

Visit: https://www.ssllabs.com/ssltest/analyze.html?d=your-domain.com

## 🔄 Phase 9: Set Up Auto-Renewal for SSL

```bash
# Add cron job for automatic SSL renewal
crontab -e

# Add this line to renew certificates twice daily:
0 12 * * * /usr/bin/certbot renew --quiet --deploy-hook "cp /etc/letsencrypt/live/your-domain.com/fullchain.pem /var/www/zeropoint-labs/ssl/cert.pem && cp /etc/letsencrypt/live/your-domain.com/privkey.pem /var/www/zeropoint-labs/ssl/key.pem && docker-compose -f /var/www/zeropoint-labs/docker-compose.yml restart nginx"
```

## 🛠️ Useful Commands

### Docker Management
```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up --build -d

# Clean up unused Docker resources
docker system prune -f
```

### System Monitoring
```bash
# Check disk usage
df -h

# Check memory usage
free -h

# Check running processes
htop

# Check nginx status
docker-compose logs nginx

# Check website status
docker-compose logs zeropoint-website
```

## 🚨 Troubleshooting

### Website Not Loading
1. Check if containers are running: `docker-compose ps`
2. Check logs: `docker-compose logs`
3. Verify DNS: `nslookup your-domain.com`
4. Check firewall: `ufw status`

### SSL Certificate Issues
1. Check certificate files exist: `ls -la ssl/`
2. Verify certificate validity: `openssl x509 -in ssl/cert.pem -text -noout`
3. Check nginx logs: `docker-compose logs nginx`

### Container Build Failures
1. Check Docker space: `docker system df`
2. Clean up: `docker system prune -f`
3. Rebuild: `docker-compose build --no-cache`

## 📞 Support

If you encounter issues:
1. Check the logs: `docker-compose logs`
2. Verify all steps were completed
3. Check Hostinger support documentation
4. Ensure your domain DNS is properly configured

## 🎉 Congratulations!

Your Zero Point Labs website should now be live at `https://your-domain.com` with:
- ✅ HTTPS/SSL encryption
- ✅ Automatic HTTP to HTTPS redirect
- ✅ Docker containerization
- ✅ Nginx reverse proxy
- ✅ Auto-renewing SSL certificates
- ✅ Production optimizations

Your website is now professionally deployed and ready for visitors!
