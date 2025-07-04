# 📈 Adding New Projects to Zero Point Labs Infrastructure

Complete guide for adding new Next.js websites to the existing Cloudflare Tunnels infrastructure.

## 🏗️ Infrastructure Overview

The Zero Point Labs infrastructure supports **unlimited websites** on a single VPS using:
- **Individual Docker containers** for each project (port isolation)
- **Separate Cloudflare Tunnels** for each domain (security isolation)
- **Shared VPS resources** (cost-effective hosting)
- **Independent deployments** (no cross-project interference)

## 🎯 Adding a New Project: Step-by-Step

### 1. Project Preparation

#### Create Project Directory
```bash
# In the main workspace
cd /path/to/websites

# Create new project directory
mkdir my-new-project
cd my-new-project
```

#### Initialize Next.js Project
```bash
# Create new Next.js app
npx create-next-app@latest . --typescript --tailwind --eslint --app

# Or clone existing Next.js project
git clone https://github.com/your-repo/project.git .
```

### 2. Docker Configuration

#### Create Dockerfile
```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build with standalone output
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

#### Configure Next.js for Standalone
```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',
  
  // Other configuration...
  experimental: {
    // Any experimental features
  },
}

export default nextConfig
```

#### Create Docker Compose File
```yaml
# docker-compose.yml
version: '3.8'

services:
  # Your New Project App
  my-new-project-app:
    build: .
    container_name: my-new-project-app
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - PORT=3000
      # Add your environment variables
    networks:
      - project-network

  # Cloudflare Tunnel for your domain
  my-new-project-cloudflared:
    image: cloudflare/cloudflared:latest
    container_name: my-new-project-cloudflared
    restart: unless-stopped
    command: tunnel --no-autoupdate run --token YOUR_TUNNEL_TOKEN
    networks:
      - project-network
    depends_on:
      - my-new-project-app

networks:
  project-network:
    driver: bridge
```

### 3. Cloudflare Tunnel Setup

#### Create Tunnel
```bash
# Authenticate with Cloudflare (if not already done)
cloudflared tunnel login

# Create tunnel for your new domain
cloudflared tunnel create my-new-project

# Note the tunnel ID and token from output
```

#### Configure Tunnel Routing
```bash
# Route your domain through the tunnel
cloudflared tunnel route dns my-new-project mynewdomain.com

# Optionally add www subdomain
cloudflared tunnel route dns my-new-project www.mynewdomain.com
```

#### Create Tunnel Configuration
```yaml
# Create ~/.cloudflared/config.yml for this tunnel
tunnel: my-new-project
credentials-file: ~/.cloudflared/YOUR_TUNNEL_ID.json

ingress:
  - hostname: mynewdomain.com
    service: http://my-new-project-app:3000
  - hostname: www.mynewdomain.com
    service: http://my-new-project-app:3000
  - service: http_status:404
```

### 4. Domain & DNS Configuration

#### Cloudflare Dashboard Setup
1. **Add Domain** to Cloudflare (if not already added)
2. **Update Nameservers** at your domain registrar
3. **Configure DNS Records**:
   ```
   Type: CNAME
   Name: mynewdomain.com
   Target: YOUR_TUNNEL_ID.cfargotunnel.com
   Proxy: Enabled (orange cloud)
   ```

#### SSL/TLS Configuration
1. **SSL Mode**: Full (strict)
2. **Always Use HTTPS**: Enabled
3. **HSTS**: Enabled
4. **Edge Certificates**: Auto (Let's Encrypt)

### 5. Deployment

#### Build and Deploy
```bash
# Build Docker image
docker build -t my-new-project-app .

# Start services
docker-compose up -d

# Verify deployment
docker ps
docker logs my-new-project-app
docker logs my-new-project-cloudflared
```

#### Test Deployment
```bash
# Test local container
curl http://localhost:3000

# Test domain (after DNS propagation)
curl https://mynewdomain.com
```

### 6. Integration with Existing Infrastructure

#### Port Management
- **Zero Point Labs**: Port 3000 (zeropoint-labs.com)
- **GP Realty**: Port 3100 (gprealty-cy.com)  
- **Your New Project**: Port 3000 (isolated in its own container)

#### VPS Resource Sharing
```bash
# Monitor VPS resources
htop                    # CPU and memory usage
docker stats           # Container resource usage
df -h                  # Disk space
```

#### Network Isolation
Each project runs in its own Docker network, providing:
- **Container isolation** - Projects can't interfere with each other
- **Port reuse** - Multiple projects can use port 3000 internally
- **Security** - No direct container-to-container communication

## 📋 Project Templates

### Basic Next.js Template
```bash
# Quick start for new Next.js project
npx create-next-app@latest my-project --typescript --tailwind --eslint --app
cd my-project

# Copy Dockerfile from existing project
cp ../zeropoint-labs-hostinger/Dockerfile .

# Modify docker-compose.yml with new project details
```

### E-commerce Template
```bash
# For e-commerce projects, add additional services
services:
  my-ecommerce-app:
    # ... app configuration
  
  redis:
    image: redis:alpine
    container_name: my-ecommerce-redis
    
  postgres:
    image: postgres:15
    container_name: my-ecommerce-db
    environment:
      POSTGRES_DB: mystore
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
```

### Multi-Stage Projects
```bash
# For projects with separate frontend/backend
services:
  my-frontend:
    build: ./frontend
    container_name: my-frontend
    
  my-backend:
    build: ./backend
    container_name: my-backend
    
  my-database:
    image: mongodb:latest
    container_name: my-database
```

## 🛠️ Management & Maintenance

### Individual Project Management
```bash
# Start specific project
cd my-new-project
docker-compose up -d

# Stop specific project
docker-compose down

# Update specific project
git pull
docker-compose up -d --build

# View logs
docker-compose logs -f
```

### Multi-Project Management
```bash
# Start all projects
for dir in */; do 
  if [ -f "$dir/docker-compose.yml" ]; then
    cd "$dir" && docker-compose up -d && cd ..
  fi
done

# Check all running containers
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Monitor all projects
docker stats
```

### Backup Strategy
```bash
# Backup project configurations
tar -czf projects-backup-$(date +%Y%m%d).tar.gz */docker-compose.yml */Dockerfile

# Backup environment files
tar -czf env-backup-$(date +%Y%m%d).tar.gz */.env*

# Backup Cloudflare tunnel configs
tar -czf tunnels-backup-$(date +%Y%m%d).tar.gz ~/.cloudflared/
```

## 🔧 Advanced Configurations

### Load Balancing (High Traffic)
```yaml
# For high-traffic projects, run multiple instances
services:
  my-app-1:
    build: .
    container_name: my-app-1
  
  my-app-2:
    build: .
    container_name: my-app-2
    
  my-app-3:
    build: .
    container_name: my-app-3

  # Configure tunnel to load balance between instances
```

### Database Sharing
```yaml
# Share database between related projects
services:
  shared-postgres:
    image: postgres:15
    container_name: shared-db
    environment:
      POSTGRES_MULTIPLE_DATABASES: project1,project2,project3
    volumes:
      - shared-db-data:/var/lib/postgresql/data
    networks:
      - shared-network

volumes:
  shared-db-data:

networks:
  shared-network:
    external: true
```

### Staging Environments
```yaml
# Add staging subdomain for testing
services:
  my-app-staging:
    build: .
    container_name: my-app-staging
    environment:
      - NODE_ENV=staging
      
  # Configure separate tunnel for staging.mynewdomain.com
```

## 📊 Monitoring & Analytics

### Project Health Monitoring
```bash
# Create monitoring script
#!/bin/bash
# monitor-projects.sh

projects=("zeropoint-labs" "gprealty" "my-new-project")

for project in "${projects[@]}"; do
  if docker ps | grep -q "$project-app"; then
    echo "✅ $project is running"
  else
    echo "❌ $project is down"
  fi
done
```

### Resource Monitoring
```bash
# Monitor VPS resources
echo "=== VPS Resources ==="
free -h
df -h
uptime

echo "=== Docker Stats ==="
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"
```

### Log Aggregation
```bash
# Centralized logging for all projects
mkdir -p /var/log/projects

# Add to each docker-compose.yml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

## 🚨 Troubleshooting

### Common Issues

**Port Conflicts**
- ✅ **Solution**: Each project uses its own Docker network
- ✅ **Internal ports can be reused** (multiple apps on port 3000)
- ❌ **Don't map to host ports** unless absolutely necessary

**Domain Not Accessible**
1. Check tunnel status: `cloudflared tunnel list`
2. Verify DNS settings in Cloudflare dashboard
3. Test tunnel connectivity: `cloudflared tunnel run my-new-project`
4. Check container logs: `docker logs my-new-project-app`

**Resource Exhaustion**
1. Monitor with `docker stats`
2. Check available disk space: `df -h`
3. Review memory usage: `free -h`
4. Consider upgrading VPS or optimizing containers

**SSL Issues**
1. Ensure Cloudflare SSL mode is "Full (strict)"
2. Verify tunnel is properly configured
3. Check certificate status in Cloudflare dashboard
4. Test with `curl -I https://mynewdomain.com`

## 🎯 Business Benefits

### Cost Efficiency
- **Single VPS** hosts unlimited projects ($20/month vs $100+/month for separate hosting)
- **Shared resources** while maintaining isolation
- **No per-site hosting fees**

### Scalability
- **Easy addition** of new client projects
- **Independent deployments** without affecting existing sites
- **Flexible resource allocation**

### Professional Features
- **Custom domains** for each client
- **Automatic SSL certificates**
- **DDoS protection** via Cloudflare
- **Global CDN** for performance

### Agency Benefits
- **Standardized deployment** process
- **Consistent infrastructure** across all projects
- **Easy client onboarding**
- **Professional presentation**

---

## 📚 Quick Reference

### New Project Checklist
- [ ] Create project directory and initialize code
- [ ] Add Dockerfile and docker-compose.yml
- [ ] Configure Next.js for standalone output
- [ ] Create Cloudflare tunnel
- [ ] Configure DNS in Cloudflare dashboard
- [ ] Test local deployment
- [ ] Deploy to production
- [ ] Verify domain accessibility
- [ ] Set up monitoring

### Essential Commands
```bash
# Create tunnel
cloudflared tunnel create project-name

# Route DNS
cloudflared tunnel route dns project-name domain.com

# Deploy project
docker-compose up -d

# Check status
docker ps | grep project-name

# View logs
docker logs project-name-app
```

---

**🚀 Ready to scale your agency with unlimited professional websites!**

*Add as many projects as you need with this proven, scalable infrastructure.* 