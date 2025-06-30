# 🚀 Quick Reference - Zero Point Labs Deployment

## 📞 When You Need Help

**✅ YOU'RE READY TO START!** Follow these steps in order:

### 1. Connect to Your VPS (YOU DO THIS)
```bash
ssh root@YOUR_VPS_IP_ADDRESS
```
*Replace YOUR_VPS_IP_ADDRESS with your actual IP from Hostinger email*

### 2. Update System (YOU RUN THIS)
```bash
apt update && apt upgrade -y
```

### 3. Install Docker (YOU RUN THIS)
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
systemctl start docker
systemctl enable docker
```

### 4. Install Docker Compose (YOU RUN THIS)
```bash
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

### 5. Install Tools (YOU RUN THIS)
```bash
apt install -y git curl wget unzip certbot python3-certbot-nginx ufw
```

### 6. Setup Firewall (YOU RUN THIS)
```bash
ufw --force enable
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
```

### 7. Create Directory (YOU RUN THIS)
```bash
mkdir -p /var/www/zeropoint-labs
cd /var/www/zeropoint-labs
```

### 8. Upload Files (YOU DO THIS)
**Option A - From your Mac terminal:**
```bash
cd /Users/akyriakouu/Documents/Zero\ Point/Projects/zeropoint-labs-hostinger
scp -r . root@YOUR_VPS_IP:/var/www/zeropoint-labs/
```

### 9. Configure Domain DNS (YOU DO THIS)
- Log into your domain registrar
- Add A Record: @ → YOUR_VPS_IP
- Add CNAME Record: www → your-domain.com

### 10. Setup SSL Directory (YOU RUN THIS ON VPS)
```bash
mkdir -p ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout ssl/key.pem \
    -out ssl/cert.pem \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=your-domain.com"
```

### 11. Update Domain in Config (YOU DO THIS)
```bash
nano nginx.conf
```
*Change `server_name _;` to `server_name your-domain.com www.your-domain.com;`*

### 12. Deploy Website (YOU RUN THIS)
```bash
./deploy.sh
```

### 13. Setup Real SSL (YOU RUN THIS)
```bash
docker-compose stop nginx
certbot certonly --standalone -d your-domain.com -d www.your-domain.com
cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ssl/cert.pem
cp /etc/letsencrypt/live/your-domain.com/privkey.pem ssl/key.pem
chmod 644 ssl/cert.pem
chmod 600 ssl/key.pem
docker-compose up -d
```

## 🆘 Emergency Commands

### Check if website is running:
```bash
docker-compose ps
```

### View logs if something's wrong:
```bash
docker-compose logs
```

### Restart everything:
```bash
docker-compose restart
```

### Stop everything:
```bash
docker-compose down
```

### Rebuild and restart:
```bash
docker-compose up --build -d
```

## 📋 What You Need Ready

- [ ] VPS IP address from Hostinger email
- [ ] VPS password from Hostinger email  
- [ ] Your domain name
- [ ] Access to domain DNS settings

## 🎯 Success Checklist

- [ ] Can SSH into VPS
- [ ] Docker installed and running
- [ ] Files uploaded to VPS
- [ ] Domain DNS configured
- [ ] Website containers running
- [ ] SSL certificate installed
- [ ] Website loads at https://your-domain.com

## 📞 If You Get Stuck

1. **Can't connect to VPS?** 
   - Double-check IP address and password from Hostinger email
   - Try: `ssh -v root@YOUR_IP` for verbose output

2. **Docker commands fail?**
   - Run: `systemctl status docker`
   - Try: `systemctl restart docker`

3. **Website won't load?**
   - Check: `docker-compose ps`
   - Check: `docker-compose logs`
   - Check: `ufw status`

4. **SSL issues?**
   - Check: `ls -la ssl/`
   - Try: `docker-compose logs nginx`

## 🎉 When It's Working

Your website will be live at:
- ✅ https://your-domain.com
- ✅ Automatic HTTPS redirect
- ✅ Professional SSL certificate
- ✅ Fast Docker deployment

**Total time: 30-60 minutes** ⏱️
