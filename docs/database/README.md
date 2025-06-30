# 💾 Database Documentation

This section contains all documentation related to Appwrite database setup, configuration, and management.

## 📋 **Available Guides**

### **Setup & Configuration**
- **[APPWRITE_DATABASE_SETUP.md](./APPWRITE_DATABASE_SETUP.md)** - Complete Appwrite database integration guide with Docker
- **[FIX_APPWRITE_CONNECTION.md](./FIX_APPWRITE_CONNECTION.md)** - Troubleshooting Appwrite connection issues
- **[APPWRITE_DATABASE_SETUP.md](./APPWRITE_DATABASE_SETUP.md)** - Original database setup documentation

## 🎯 **Quick Start**

### **First Time Setup**
1. Follow [APPWRITE_DATABASE_SETUP.md](./APPWRITE_DATABASE_SETUP.md) for complete integration
2. Use Docker Compose setup for production deployment
3. Configure environment variables properly

### **Troubleshooting**
1. Connection issues: [FIX_APPWRITE_CONNECTION.md](./FIX_APPWRITE_CONNECTION.md)
2. Check docker-compose.appwrite.yml configuration
3. Verify environment variables are loaded

## 🏗️ **Database Architecture**

### **Appwrite Services**
- **Main App**: Port 80 (proxied)
- **MariaDB**: Port 3306 (internal)
- **Redis**: Port 6379 (internal)
- **InfluxDB**: Port 8086 (internal)

### **Collections Structure**
```
main (Database)
├── conversations          # Chat conversations
├── chat_sessions         # User sessions
├── knowledge_base        # Business knowledge
├── leads                 # Qualified leads
└── knowledge_vectors     # RAG embeddings (future)
```

## 🔧 **Configuration Files**

- **Docker Compose**: `docker-compose.appwrite.yml`
- **Environment**: `.env.local` (Appwrite variables)
- **Nginx Config**: `nginx.appwrite.conf`
- **Deployment Script**: `deploy-appwrite.sh`

## 📊 **Database Services**

| Service | Purpose | Port | Status |
|---------|---------|------|--------|
| **Appwrite** | Main database API | 80 | ✅ Running |
| **MariaDB** | SQL database | 3306 | ✅ Running |
| **Redis** | Caching layer | 6379 | ✅ Running |
| **InfluxDB** | Time series data | 8086 | ✅ Running |

## 🔐 **Security Configuration**

### **Environment Variables**
```bash
# Required Appwrite variables
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://your-domain.com/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
APPWRITE_API_KEY=your-api-key

# Database credentials
_APP_DB_USER=appwrite
_APP_DB_PASS=your-secure-password
_APP_OPENSSL_KEY_V1=your-openssl-key
```

### **Access Control**
- API keys with appropriate permissions
- Collection-level security rules
- User authentication and sessions
- CORS configuration for web access

## 🚀 **Deployment Process**

### **Production Deployment**
```bash
# Deploy Appwrite alongside main app
./deploy-appwrite.sh

# Or manually
docker-compose -f docker-compose.appwrite.yml up -d
```

### **Health Checks**
```bash
# Check services
docker-compose -f docker-compose.appwrite.yml ps

# Check logs
docker-compose -f docker-compose.appwrite.yml logs -f appwrite

# Test connection
curl https://your-domain.com/v1/health
```

## 📈 **Performance Optimization**

### **Current Setup**
- MariaDB for relational data
- Redis for caching and sessions
- InfluxDB for analytics and metrics
- Connection pooling enabled

### **Recommended Optimizations**
- Regular database cleanup
- Index optimization for queries
- Cache strategy for frequently accessed data
- Monitor resource usage

## 🆘 **Troubleshooting**

### **Common Issues**

1. **Connection Refused**
   - Check if Appwrite container is running
   - Verify port 80 is not blocked
   - Check nginx configuration

2. **Authentication Errors**
   - Verify API key in environment
   - Check project ID configuration
   - Validate endpoint URL

3. **Database Errors**
   - Check MariaDB container status
   - Verify database credentials
   - Monitor disk space

### **Debug Commands**
```bash
# Check container status
docker-compose -f docker-compose.appwrite.yml ps

# View Appwrite logs
docker-compose -f docker-compose.appwrite.yml logs appwrite

# Check database connectivity
docker-compose -f docker-compose.appwrite.yml exec mariadb mysql -u appwrite -p

# Test API endpoint
curl -X GET https://your-domain.com/v1/health
```

## 📋 **Maintenance Tasks**

### **Regular Maintenance**
- Weekly: Check service health and logs
- Monthly: Database optimization and cleanup
- Quarterly: Security audit and updates
- As needed: Backup and restore procedures

### **Backup Strategy**
```bash
# Database backup
docker-compose -f docker-compose.appwrite.yml exec mariadb mysqldump -u root -p appwrite > backup.sql

# Volume backup
docker run --rm -v appwrite_appwrite:/data -v $(pwd):/backup alpine tar czf /backup/appwrite-backup.tar.gz -C /data .
```

## 🎯 **Success Criteria**

A properly configured database should have:
- ✅ All Appwrite services running
- ✅ API endpoints responding
- ✅ Database connectivity working
- ✅ Authentication functioning
- ✅ Collections created and accessible
- ✅ No connection errors in logs

## 📈 **Future Enhancements**

### **Planned Improvements**
1. **Vector Database**: For RAG implementation
2. **Analytics Dashboard**: Real-time metrics
3. **Advanced Queries**: Complex business logic
4. **Automated Backups**: Scheduled maintenance
5. **Performance Monitoring**: Resource optimization

---

**Status**: ✅ Functional - Database is set up and working, ready for chatbot integration and RAG implementation.
