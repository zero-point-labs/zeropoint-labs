# Reference Documentation

This folder contains quick reference materials, cheat sheets, and emergency commands for the Zero Point Labs website.

## 📋 Available References

### ⚡ [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
**Emergency Commands & Quick Setup Guide**

A condensed reference guide containing essential commands and procedures for quick access during emergencies or setup. This guide covers:

- **Emergency Commands**: Critical commands for troubleshooting
- **Quick Setup Checklist**: Step-by-step deployment verification
- **Troubleshooting Commands**: Debug and diagnostic tools
- **Success Verification**: How to confirm everything is working
- **Contact Information**: Where to get help when stuck

**Use this guide for**: Emergency situations, quick troubleshooting, and setup verification.

**Time required**: Immediate reference (1-5 minutes)

---

## 🚨 Emergency Quick Reference

### Critical Commands

#### Check System Status:
```bash
# Check if containers are running
docker-compose ps

# View all logs
docker-compose logs -f

# Check specific service logs
docker-compose logs -f nginx
docker-compose logs -f zeropoint-website

# Check system resources
docker stats
df -h
free -h
```

#### Restart Services:
```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart nginx

# Stop and start (full restart)
docker-compose down && docker-compose up -d

# Force rebuild and restart
docker-compose up --build -d
```

#### Emergency Recovery:
```bash
# If website is down - quick recovery
cd /var/www/zeropoint-labs/zeropoint-hostinger
git pull
./deploy.sh

# If containers won't start
docker system prune -f
docker-compose up --build -d

# If out of disk space
docker system prune -a -f
```

### Network & SSL Issues:
```bash
# Check SSL certificate
openssl x509 -in ssl/cert.pem -text -noout

# Test website connectivity
curl -I https://your-domain.com

# Check nginx configuration
docker exec zeropoint-nginx nginx -t

# Reload nginx without restart
docker exec zeropoint-nginx nginx -s reload
```

## 🔧 Troubleshooting Quick Reference

### Common Issues & Solutions:

#### 1. Website Not Loading
```bash
# Check if containers are running
docker-compose ps

# If containers are down
docker-compose up -d

# Check logs for errors
docker-compose logs -f
```

#### 2. SSL Certificate Problems
```bash
# Check certificate files
ls -la ssl/

# Renew SSL certificate
docker-compose stop nginx
certbot renew
# Copy new certificates
cp /etc/letsencrypt/live/domain.com/fullchain.pem ssl/cert.pem
cp /etc/letsencrypt/live/domain.com/privkey.pem ssl/key.pem
docker-compose start nginx
```

#### 3. Out of Disk Space
```bash
# Check disk usage
df -h

# Clean Docker resources
docker system prune -a -f

# Clean logs
truncate -s 0 /var/lib/docker/containers/*/*-json.log
```

#### 4. Memory Issues
```bash
# Check memory usage
free -h

# Check which containers use most memory
docker stats

# Restart to free memory
docker-compose restart
```

#### 5. Git/Deployment Issues
```bash
# If git pull fails
git reset --hard origin/main
git pull

# If deployment fails
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 📊 System Monitoring Reference

### Health Check Commands:
```bash
# Overall system health
docker-compose ps
docker stats --no-stream
df -h
free -h

# Website accessibility
curl -I https://your-domain.com
curl -I http://your-domain.com  # Should redirect to HTTPS

# SSL certificate validity
echo | openssl s_client -servername your-domain.com -connect your-domain.com:443 2>/dev/null | openssl x509 -noout -dates
```

### Performance Monitoring:
```bash
# Container resource usage
docker stats

# Disk usage by container
docker system df

# Network connectivity
ping your-domain.com
nslookup your-domain.com

# Process monitoring
htop
ps aux | grep docker
```

## 🔄 Maintenance Quick Reference

### Regular Maintenance Tasks:

#### Daily Checks:
```bash
# Quick health check
docker-compose ps && curl -I https://your-domain.com
```

#### Weekly Maintenance:
```bash
# Update system packages
apt update && apt upgrade -y

# Clean Docker resources
docker system prune -f

# Check disk space
df -h
```

#### Monthly Tasks:
```bash
# SSL certificate check
certbot certificates

# Security updates
apt update && apt upgrade -y

# Backup verification
ls -la /var/backups/
```

### Backup Commands:
```bash
# Create manual backup
tar -czf backup-$(date +%Y%m%d).tar.gz /var/www/zeropoint-labs/

# Database backup (if using AppWrite)
docker exec appwrite-mariadb mysqldump -u appwrite -p appwrite > backup-db-$(date +%Y%m%d).sql
```

## 📋 Setup Verification Checklist

### Post-Deployment Verification:
- [ ] **Containers Running**: `docker-compose ps` shows all services up
- [ ] **Website Accessible**: https://your-domain.com loads correctly
- [ ] **HTTPS Redirect**: http://your-domain.com redirects to HTTPS
- [ ] **SSL Certificate**: Valid and not expired
- [ ] **Mobile Responsive**: Website works on mobile devices
- [ ] **Performance**: Page loads in under 3 seconds

### Security Verification:
- [ ] **Firewall Active**: `ufw status` shows active with proper rules
- [ ] **SSH Access**: Can connect via SSH
- [ ] **SSL Grade**: A+ rating on SSL Labs test
- [ ] **Headers**: Security headers present
- [ ] **Ports**: Only necessary ports open (22, 80, 443)

## 🆘 Emergency Contacts & Resources

### When You Need Help:

#### 1. Check Documentation First:
- [Deployment Guide](../deployment/DEPLOYMENT_GUIDE.md)
- [Update Workflow](../development/UPDATE_WORKFLOW.md)
- [Database Setup](../database/APPWRITE_DATABASE_SETUP.md)

#### 2. Common Error Solutions:
- **502 Bad Gateway**: Container not running → `docker-compose up -d`
- **SSL Errors**: Certificate expired → Renew SSL certificate
- **Out of Space**: Clean Docker → `docker system prune -a -f`
- **Can't Connect**: Check firewall → `ufw status`

#### 3. External Resources:
- [Docker Documentation](https://docs.docker.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Help](https://letsencrypt.org/docs/)
- [Hostinger Support](https://www.hostinger.com/help)

## 🔍 Diagnostic Information

### System Information Commands:
```bash
# System details
uname -a
lsb_release -a
docker --version
docker-compose --version

# Network configuration
ip addr show
netstat -tlnp

# Service status
systemctl status docker
systemctl status ufw
```

### Log Locations:
```bash
# Docker logs
/var/lib/docker/containers/*/

# Nginx logs (inside container)
docker exec zeropoint-nginx ls /var/log/nginx/

# System logs
/var/log/syslog
/var/log/auth.log
```

## 📈 Performance Benchmarks

### Expected Performance:
- **Page Load Time**: < 3 seconds
- **SSL Handshake**: < 1 second
- **Container Start Time**: < 30 seconds
- **Memory Usage**: < 1GB total
- **Disk Usage**: < 10GB for basic setup

### Performance Testing:
```bash
# Test page load time
curl -w "@curl-format.txt" -o /dev/null -s https://your-domain.com

# Create curl-format.txt:
echo "     time_namelookup:  %{time_namelookup}\n
        time_connect:  %{time_connect}\n
     time_appconnect:  %{time_appconnect}\n
    time_pretransfer:  %{time_pretransfer}\n
       time_redirect:  %{time_redirect}\n
  time_starttransfer:  %{time_starttransfer}\n
                     ----------\n
          time_total:  %{time_total}\n" > curl-format.txt
```

## 🎯 Quick Actions

### Most Common Tasks:

#### Deploy Updates:
```bash
ssh root@VPS_IP
cd /var/www/zeropoint-labs/zeropoint-hostinger
git pull && ./deploy.sh
```

#### Restart Everything:
```bash
docker-compose restart
```

#### Check Status:
```bash
docker-compose ps && curl -I https://your-domain.com
```

#### View Logs:
```bash
docker-compose logs -f --tail=50
```

#### Clean Up Space:
```bash
docker system prune -f
```

---

**Need immediate help?** Use the emergency commands above, then consult the detailed guides in other documentation folders.
