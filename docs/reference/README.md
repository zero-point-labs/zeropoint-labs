# 📚 Reference Documentation

This section contains quick reference materials, technical specifications, and emergency command references.

## 📋 **Available References**

### **Quick References**
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Emergency commands and quick setup checklist

## 🎯 **Quick Access**

### **Emergency Commands**
For when things go wrong and you need immediate solutions:
```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs -f

# Restart everything
docker-compose restart

# Force rebuild
docker-compose up --build -d
```

### **Common File Locations**
- **Local Project**: `/Users/akyriakouu/Documents/Zero Point/Projects/zeropoint-labs-hostinger`
- **VPS Project**: `/var/www/zeropoint-labs/zeropoint-hostinger`
- **Environment**: `.env.local`
- **Docker Config**: `docker-compose.yml`
- **Deployment**: `deploy.sh`

## 🔧 **Technical Specifications**

### **System Requirements**
- **VPS**: 2GB RAM minimum, 4GB recommended
- **Storage**: 20GB+ available space
- **Node.js**: Version 18+ (LTS)
- **Docker**: Latest stable version
- **Ports**: 80 (HTTP), 443 (HTTPS), 3000 (dev)

### **Technology Stack**
- **Frontend**: Next.js 15.3.3, React 19, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Next.js API routes, Appwrite (optional)
- **Infrastructure**: Docker, Nginx, Let's Encrypt SSL
- **AI**: OpenAI GPT-4o integration

## 🚨 **Emergency Procedures**

### **Website Down**
1. Check container status: `docker-compose ps`
2. Restart services: `docker-compose restart`
3. Check logs: `docker-compose logs -f`
4. If still down: `docker-compose up --build -d`

### **SSL Certificate Issues**
1. Check certificate status: `docker-compose logs nginx`
2. Renew certificates: `docker-compose exec nginx certbot renew`
3. Restart nginx: `docker-compose restart nginx`

### **Build Failures**
1. Check disk space: `df -h`
2. Clear old containers: `docker system prune`
3. Force rebuild: `docker-compose build --no-cache`

### **Git Issues**
1. Force pull: `git reset --hard origin/master`
2. Check branch: `git branch -a`
3. Force push: `git push --force origin master`

## 📊 **Environment Variables Reference**

### **Required Variables**
```bash
# OpenAI Integration
OPENAI_API_KEY=sk-proj-your_api_key_here

# Appwrite Database (optional)
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://your-domain.com/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
APPWRITE_API_KEY=your-appwrite-api-key

# Chatbot Configuration
CHATBOT_SESSION_TIMEOUT=86400000
```

### **Docker Environment**
```bash
# Production settings
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# Build arguments
OPENAI_API_KEY=${OPENAI_API_KEY:-placeholder}
```

## 🔍 **Port Allocation**

| Service | Port | Purpose | Access |
|---------|------|---------|--------|
| **Next.js** | 3000 | Main application | Internal |
| **Nginx** | 80/443 | Web server/SSL | External |
| **Appwrite** | 80 | Database API | Internal |
| **MariaDB** | 3306 | Database | Internal |
| **Redis** | 6379 | Cache | Internal |

## 📁 **File Structure Reference**

### **Critical Files**
```
├── .env.local                 # Environment variables
├── docker-compose.yml         # Main containers
├── docker-compose.appwrite.yml # Database containers
├── Dockerfile                 # Container definition
├── deploy.sh                  # Deployment script
├── nginx.conf                 # Web server config
└── package.json              # Dependencies
```

### **Source Code Structure**
```
src/
├── app/
│   ├── api/chat/             # Chatbot API routes
│   ├── globals.css           # Global styles
│   └── layout.tsx            # Root layout
├── components/
│   ├── sections/
│   │   ├── ChatSection.tsx   # Chatbot component
│   │   ├── HeroSection.tsx   # Homepage hero
│   │   └── PricingSection.tsx # Pricing display
│   └── ui/                   # Reusable UI components
├── services/
│   ├── openai.ts            # OpenAI integration
│   ├── chatbot.ts           # Chatbot logic
│   └── appwrite.ts          # Database client
└── lib/
    └── appwrite.ts          # Appwrite configuration
```

## 💾 **Backup & Recovery**

### **Manual Backup**
```bash
# Database backup
docker-compose exec mariadb mysqldump -u root -p appwrite > backup.sql

# File backup
tar -czf website-backup.tar.gz /var/www/zeropoint-labs/

# Code backup (already in Git)
git push origin master
```

### **Recovery Procedures**
```bash
# Restore from Git
git pull origin master
./deploy.sh

# Restore database
docker-compose exec mariadb mysql -u root -p appwrite < backup.sql

# Full system restore
docker-compose down
docker-compose up --build -d
```

## 🔐 **Security Reference**

### **Access Controls**
- **SSH**: Key-based authentication only
- **Firewall**: Ports 22, 80, 443 open
- **SSL**: Let's Encrypt certificates
- **Environment**: Sensitive variables in `.env.local`
- **Git**: No secrets in repository

### **Security Commands**
```bash
# Check open ports
netstat -tulpn

# Check SSL certificate
openssl x509 -in /etc/letsencrypt/live/domain/fullchain.pem -text -noout

# Check firewall status
ufw status

# Update system packages
apt update && apt upgrade -y
```

## 📈 **Performance Monitoring**

### **System Resources**
```bash
# Check resource usage
docker stats

# Check disk space
df -h

# Check memory usage
free -h

# Check CPU usage
top
```

### **Application Performance**
```bash
# Check response times
curl -w "@curl-format.txt" -o /dev/null -s https://your-domain.com

# Monitor logs
docker-compose logs -f --tail=100

# Check build times
time docker-compose build
```

## 🎯 **Success Indicators**

### **Healthy System**
- ✅ All containers running: `docker-compose ps`
- ✅ Website accessible: HTTP 200 responses
- ✅ SSL certificate valid: No browser warnings
- ✅ Logs clean: No error messages
- ✅ Resources stable: <80% CPU/memory usage

### **Performance Targets**
- **Page Load**: <2 seconds first load
- **Response Time**: <500ms API responses
- **Uptime**: >99.9% availability
- **SSL Grade**: A+ rating
- **Build Time**: <2 minutes deployment

## 🆘 **Support Contacts**

### **Service Providers**
- **Hosting**: Hostinger support
- **Domain**: Domain registrar support
- **SSL**: Let's Encrypt documentation
- **OpenAI**: OpenAI API documentation

### **Technical Resources**
- **Next.js**: Official documentation and community
- **Docker**: Docker Hub and documentation
- **Nginx**: Official documentation
- **Appwrite**: Official documentation and Discord

---

**Need immediate help?** Start with [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for emergency commands and troubleshooting steps.
