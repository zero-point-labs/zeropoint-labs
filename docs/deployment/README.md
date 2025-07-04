# 🚀 Zero Point Labs - Deployment Guide

Modern deployment guide for the Zero Point Labs analytics platform using **Cloudflare Tunnels** architecture.

## 🏗️ Current Architecture

Zero Point Labs is deployed using the **Cloudflare Tunnels** approach:
- **Docker container** running Next.js application
- **Cloudflare Tunnel** for secure public access (no exposed ports)
- **Cloudflare DNS** for domain routing and SSL
- **Single VPS** hosting isolated container

## ✅ Prerequisites

- **VPS Server** with Docker installed
- **Cloudflare Account** with domain added
- **Domain** pointing to Cloudflare nameservers
- **SSH Access** to your VPS

## 🚀 Quick Deployment

### 1. Server Preparation
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
sudo apt install docker-compose -y

# Install Cloudflared
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb
```

### 2. Clone and Build Application
```bash
# Clone repository
git clone [your-repo-url]
cd zeropoint-labs-hostinger

# Build Docker image
docker build -t zeropoint-labs-app .
```

### 3. Cloudflare Tunnel Setup
```bash
# Authenticate with Cloudflare
cloudflared tunnel login

# Create tunnel for Zero Point Labs
cloudflared tunnel create zeropoint-labs

# Configure tunnel (creates config.yml)
cloudflared tunnel route dns zeropoint-labs zeropoint-labs.com
```

### 4. Deploy with Docker Compose
```bash
# Start the application
docker-compose up -d

# Verify running
docker ps
```

## 📁 Project Structure

```
zeropoint-labs-hostinger/
├── Dockerfile                    # Application container
├── docker-compose.yml           # Orchestration with tunnel
├── next.config.ts               # Next.js production config
├── .dockerignore               # Optimized build context
├── src/                        # Application source code
└── docs/                       # Current documentation
```

## 🐳 Docker Configuration

### Application Container
- **Base**: Node.js 18 Alpine
- **Port**: 3000 (internal only)
- **Environment**: Production optimized
- **Build**: Multi-stage for efficiency

### Tunnel Container
- **Image**: cloudflare/cloudflared
- **Function**: Secure tunnel to Cloudflare
- **Network**: Internal connection to app

## 🌐 Domain & DNS Setup

### 1. Cloudflare DNS Configuration
```bash
# Ensure domain uses Cloudflare nameservers
# Add CNAME record pointing to tunnel
zeropoint-labs.com → [tunnel-id].cfargotunnel.com
```

### 2. SSL/TLS Configuration
- **SSL Mode**: Full (strict) in Cloudflare dashboard
- **Always Use HTTPS**: Enabled
- **HSTS**: Enabled for security

## 🔧 Environment Configuration

### Required Environment Variables
```env
# .env.local
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
APPWRITE_API_KEY=your_api_key_here
NODE_ENV=production
```

### Appwrite Setup
1. **Create Appwrite Project** following [Setup Guide](../setup/README.md)
2. **Configure Authentication** and database collections
3. **Generate API keys** with appropriate permissions

## 📊 Monitoring & Maintenance

### Health Checks
```bash
# Check container status
docker ps

# Check tunnel status
cloudflared tunnel list

# View application logs
docker logs zeropoint-labs-app

# View tunnel logs
docker logs zeropoint-cloudflared
```

### Updates & Maintenance
```bash
# Update application
git pull
docker-compose down
docker-compose up -d --build

# Restart tunnel only
docker-compose restart zeropoint-cloudflared

# View real-time logs
docker-compose logs -f
```

## 🛡️ Security Features

### Cloudflare Protection
- **DDoS Protection**: Automatic protection
- **WAF**: Web Application Firewall enabled
- **SSL/TLS**: Automatic certificate management
- **Bot Protection**: Built-in bot mitigation

### Application Security
- **No Public Ports**: All traffic via Cloudflare Tunnel
- **Environment Isolation**: Containerized application
- **Secure Headers**: Configured in Next.js
- **API Security**: Appwrite authentication

## 🚀 Performance Optimization

### Cloudflare Features
- **Global CDN**: Automatic content caching
- **Image Optimization**: Automatic image resizing
- **Minification**: CSS/JS minification
- **Brotli Compression**: Enhanced compression

### Application Optimization
- **Next.js Standalone**: Optimized production build
- **Static Asset Caching**: Efficient asset delivery
- **Database Optimization**: Appwrite performance tuning

## 📈 Adding New Sites to Infrastructure

Since this deployment uses the multi-site Cloudflare Tunnels infrastructure, adding new projects is straightforward:

### 1. Prepare New Project
```bash
# Create new Next.js project directory
mkdir new-project-name
cd new-project-name

# Add Dockerfile and docker-compose.yml
# Configure for internal port (e.g., 3001, 3002, etc.)
```

### 2. Create New Tunnel
```bash
# Create tunnel for new domain
cloudflared tunnel create new-project-tunnel

# Configure DNS routing
cloudflared tunnel route dns new-project-tunnel newdomain.com
```

### 3. Update Infrastructure
```bash
# Add new service to main docker-compose.yml
# or create separate compose file for the new project

# Deploy new container
docker-compose up -d new-project-app
```

### 4. Benefits of This Approach
- ✅ **Isolated Containers**: Each project in its own container
- ✅ **Independent Tunnels**: Separate secure connections
- ✅ **Shared Infrastructure**: Cost-effective single VPS
- ✅ **Easy Scaling**: Add unlimited sites without port conflicts

## 🔍 Troubleshooting

### Common Issues

**Application Won't Start**
```bash
# Check container logs
docker logs zeropoint-labs-app

# Verify environment variables
docker exec zeropoint-labs-app env
```

**Tunnel Connection Issues**
```bash
# Check tunnel status
cloudflared tunnel list

# Restart tunnel
docker-compose restart zeropoint-cloudflared

# Check tunnel logs
docker logs zeropoint-cloudflared
```

**Domain Not Accessible**
1. Verify DNS settings in Cloudflare dashboard
2. Check tunnel routing configuration
3. Ensure Cloudflare nameservers are configured
4. Wait for DNS propagation (up to 24 hours)

**Performance Issues**
1. Monitor VPS resources with `htop`
2. Check container resource usage with `docker stats`
3. Review Cloudflare analytics for traffic patterns
4. Optimize application code if needed

## 📚 Related Documentation

- **[Setup Guides](../setup/)** - Initial Appwrite and environment configuration
- **[Features Documentation](../features/)** - Platform capabilities and features  
- **[API Reference](../api/)** - Backend integration details
- **[Main Workspace README](../../../README.md)** - Overall infrastructure overview

## 🎯 Next Steps

### After Successful Deployment
1. **Configure Analytics** using [Setup Guides](../setup/)
2. **Customize Dashboard** per your requirements
3. **Set Up Monitoring** for application health
4. **Add More Sites** following the multi-site process above

### Production Optimization
1. **Enable Cloudflare Features** (caching, optimization)
2. **Configure Backup Strategy** for Appwrite data
3. **Set Up Monitoring Alerts** for uptime
4. **Performance Tuning** based on traffic patterns

---

**🌐 Zero Point Labs is now deployed with modern, secure, and scalable infrastructure!**

*Last updated: January 2025*  
*Architecture: Cloudflare Tunnels + Docker + Next.js* 