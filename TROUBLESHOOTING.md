# 🔧 VPS Deployment Troubleshooting Guide

## Quick Deployment

1. **Make scripts executable:**
   ```bash
   chmod +x deploy.sh ssl-setup.sh debug-auth-issues.sh
   ```

2. **Run deployment:**
   ```bash
   ./deploy.sh your-domain.com
   ```

3. **Setup SSL (after DNS is configured):**
   ```bash
   ./ssl-setup.sh your-domain.com
   ```

## Common Issues & Solutions

### 1. **Container Won't Start**

**Symptoms:**
- `docker-compose up -d` fails
- Containers show "Exited" status

**Solutions:**
```bash
# Check logs
docker-compose logs zeropoint-app

# Common fixes:
# 1. Port conflict (check if port 3000 is already in use)
sudo lsof -i :3000

# 2. Memory issues (check available memory)
free -h

# 3. Build issues (clean build)
docker-compose down
docker system prune -a
docker-compose build --no-cache
docker-compose up -d
```

### 2. **Nginx Configuration Issues**

**Symptoms:**
- 502 Bad Gateway
- Connection refused

**Solutions:**
```bash
# Check nginx config syntax
docker-compose exec nginx nginx -t

# Check if app container is running
docker-compose ps

# Check nginx logs
docker-compose logs nginx

# Fix: Update nginx config with correct upstream
# Edit nginx/nginx.conf and ensure:
# - server zeropoint-app:3000 (matches container name and port)
# - Container network connectivity
```

### 3. **SSL Certificate Issues**

**Symptoms:**
- HTTPS not working
- Certificate errors

**Solutions:**
```bash
# Check if certificates exist
ls -la ./certbot/conf/live/your-domain.com/

# Check DNS propagation
dig your-domain.com
nslookup your-domain.com

# Test certificate renewal
docker-compose exec certbot certbot renew --dry-run

# Fix: Ensure domain points to your server IP
# Fix: Check firewall allows port 80 and 443
```

### 4. **Appwrite Connection Issues**

**Symptoms:**
- Authentication not working
- API errors

**Solutions:**
```bash
# Run auth debug script
./debug-auth-issues.sh

# Check environment variables
docker-compose exec zeropoint-app printenv | grep APPWRITE

# Common fixes:
# 1. Update .env.local with correct Appwrite API key
# 2. Check Appwrite Console platform settings
# 3. Verify domain whitelist in Appwrite Console
```

### 5. **Cloudflare Tunnel Issues**

**Symptoms:**
- Site not accessible via Cloudflare tunnel
- SSL/TLS errors

**Solutions:**
```bash
# For Cloudflare Tunnels, use HTTP only internally
# Update nginx config to listen on HTTP only:

# nginx/nginx-tunnel.conf
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://zeropoint-app:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Update docker-compose.yml ports for tunnel:
# ports:
#   - "8080:80"  # Use different port for tunnel
```

### 6. **Memory/Performance Issues**

**Symptoms:**
- Slow response times
- Container crashes

**Solutions:**
```bash
# Check system resources
htop
df -h

# Monitor container resource usage
docker stats

# Optimize build for production
# Add to Dockerfile:
# RUN npm ci --only=production
# ENV NODE_OPTIONS="--max-old-space-size=1024"
```

### 7. **Network/Firewall Issues**

**Symptoms:**
- Can't access site externally
- Port connection refused

**Solutions:**
```bash
# Check listening ports
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :443

# Check firewall (Ubuntu/Debian)
sudo ufw status
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Check firewall (CentOS/RHEL)
sudo firewall-cmd --list-all
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --reload
```

## Environment Variables Checklist

Create `.env.local` with these variables:

```env
# Required for Appwrite
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=6861736a0007a58bac63
APPWRITE_API_KEY=your_actual_api_key_here

# Production settings
NODE_ENV=production
PORT=3000

# Domain configuration
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your_secret_here
```

## Appwrite Console Checklist

1. **Platform Settings:**
   - Add your domain to platform list
   - Enable required OAuth providers
   - Set success/failure URLs

2. **Database Setup:**
   - Create analytics database
   - Set up required collections
   - Configure permissions

3. **API Keys:**
   - Generate server API key
   - Set appropriate scopes
   - Add to environment variables

## Useful Commands

```bash
# View all container logs
docker-compose logs -f

# Restart specific service
docker-compose restart zeropoint-app

# Check container health
docker-compose exec zeropoint-app curl -f http://localhost:3000/

# Test database connectivity
docker-compose exec zeropoint-app node -e "console.log('Test')"

# Update and restart
git pull
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Clean up Docker resources
docker system prune -a
docker volume prune
```

## Getting Help

If you're still experiencing issues:

1. **Check logs:** `docker-compose logs -f`
2. **Run debug script:** `./debug-auth-issues.sh`
3. **Test connectivity:** `curl -I http://localhost:3000`
4. **Check resources:** `htop` and `df -h`

## Quick Fixes Summary

| Issue | Quick Fix |
|-------|-----------|
| Container won't start | `docker-compose down && docker-compose up -d` |
| 502 Bad Gateway | Check nginx config and app container status |
| SSL not working | Run `./ssl-setup.sh your-domain.com` |
| Auth issues | Update .env.local and check Appwrite Console |
| Out of memory | Add swap space or upgrade VPS |
| Port conflicts | Change ports in docker-compose.yml | 