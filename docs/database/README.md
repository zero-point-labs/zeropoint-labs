# Database Documentation

This folder contains guides for setting up and configuring database solutions for the Zero Point Labs website.

## 📋 Available Guides

### 🗄️ [APPWRITE_DATABASE_SETUP.md](./APPWRITE_DATABASE_SETUP.md)
**Complete AppWrite Database Integration Guide**

A comprehensive guide for adding AppWrite Backend-as-a-Service to your existing Zero Point Labs website deployment. This guide covers:

- **AppWrite Overview**: What AppWrite provides and why use it
- **Docker Integration**: Adding AppWrite to your existing Docker setup
- **Database Configuration**: MariaDB and Redis setup
- **Nginx Proxy Setup**: Routing AppWrite API requests
- **Security Configuration**: Passwords, keys, and access control
- **Next.js Integration**: SDK setup and usage examples
- **Backup Procedures**: Database backup and recovery
- **Monitoring**: Resource usage and performance tracking

**Use this guide for**: Adding database functionality to your deployed website.

**Time required**: 45-90 minutes

---

## 🎯 What is AppWrite?

AppWrite is an open-source Backend-as-a-Service (BaaS) that provides:

- **Database**: Real-time NoSQL database with collections
- **Authentication**: User registration, login, and session management
- **Storage**: File upload and management
- **Functions**: Serverless function execution
- **Real-time**: WebSocket connections for live updates
- **REST & GraphQL APIs**: Multiple API interfaces

## 🚀 Quick Start

### Prerequisites
Before setting up AppWrite:
- ✅ Existing Zero Point Labs website deployment
- ✅ SSH access to your VPS
- ✅ Domain configured and working
- ✅ Docker and Docker Compose installed
- ✅ Basic understanding of databases

### Setup Process
1. **Read the guide**: [APPWRITE_DATABASE_SETUP.md](./APPWRITE_DATABASE_SETUP.md)
2. **Backup current setup**: Always backup before major changes
3. **Follow phase-by-phase instructions**: Update Docker configuration
4. **Test integration**: Verify AppWrite console access
5. **Integrate with Next.js**: Add SDK and create collections

## 🛠️ Technical Architecture

### With AppWrite Integration:
```
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐
│   Next.js App   │────│    Nginx     │────│   AppWrite      │
│   (Port 3000)   │    │  (80/443)    │    │   (Internal)    │
└─────────────────┘    └──────────────┘    └─────────────────┘
                              │                       │
                              │                ┌──────────────┐
                              │                │   MariaDB    │
                              │                │  (Database)  │
                              │                └──────────────┘
                              │                       │
                              │                ┌──────────────┐
                              │                │    Redis     │
                              │                │   (Cache)    │
                              └────────────────┴──────────────┘
```

### API Endpoints:
- **Website**: `https://your-domain.com/`
- **AppWrite API**: `https://your-domain.com/v1`
- **AppWrite Console**: `https://your-domain.com/console`

## 📊 Features & Benefits

### Database Features:
- **Collections**: Organize data into collections (like tables)
- **Documents**: JSON-based document storage
- **Relationships**: Link documents across collections
- **Indexes**: Optimize query performance
- **Real-time**: Live updates via WebSockets
- **Permissions**: Fine-grained access control

### Development Benefits:
- **Rapid Development**: Pre-built backend functionality
- **Type Safety**: TypeScript SDK support
- **Scalability**: Handles growth automatically
- **Security**: Built-in authentication and permissions
- **Monitoring**: Built-in analytics and logging

## 🔧 Common Use Cases

### For Zero Point Labs Website:
1. **User Management**: Customer accounts and profiles
2. **Content Management**: Blog posts, projects, testimonials
3. **Contact Forms**: Store and manage inquiries
4. **Analytics**: Custom event tracking
5. **File Storage**: Images, documents, media files
6. **Real-time Features**: Live chat, notifications

### Example Collections:
```javascript
// Users Collection
{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Tech Corp",
  "created": "2024-01-15"
}

// Projects Collection
{
  "title": "Website Redesign",
  "description": "Modern website with Next.js",
  "status": "completed",
  "client_id": "user_123"
}

// Inquiries Collection
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "message": "Interested in your services",
  "status": "new"
}
```

## 🔒 Security Considerations

### Built-in Security:
- **Encryption**: Data encrypted at rest and in transit
- **Authentication**: Multiple auth methods supported
- **Permissions**: Role-based access control
- **API Keys**: Secure API access management
- **Rate Limiting**: Protection against abuse
- **CORS**: Cross-origin request security

### Best Practices:
1. **Use strong passwords** for database access
2. **Limit API permissions** to minimum required
3. **Regular backups** of database content
4. **Monitor access logs** for suspicious activity
5. **Keep AppWrite updated** for security patches

## 📈 Performance & Scaling

### Resource Requirements:
- **Minimum**: 2GB RAM, 1 CPU core
- **Recommended**: 4GB RAM, 2 CPU cores
- **Storage**: 20GB+ for database and files
- **Network**: Stable internet connection

### Optimization Tips:
1. **Use indexes** for frequently queried fields
2. **Implement caching** with Redis
3. **Optimize queries** to reduce database load
4. **Monitor resource usage** regularly
5. **Scale vertically** by upgrading VPS specs

## 🆘 Troubleshooting

### Common Issues:
1. **AppWrite not accessible**: Check nginx configuration
2. **Database connection errors**: Verify MariaDB status
3. **Permission denied**: Check API keys and permissions
4. **Slow queries**: Add appropriate indexes
5. **Memory issues**: Monitor and upgrade resources

### Debug Commands:
```bash
# Check AppWrite logs
docker-compose logs -f appwrite

# Check database status
docker-compose logs -f mariadb

# Check Redis status
docker-compose logs -f redis

# Monitor resource usage
docker stats
```

## 🔄 Backup & Recovery

### Automated Backups:
The setup guide includes scripts for:
- **Daily database backups**
- **Retention policies** (keep 7 days)
- **Automated cleanup** of old backups
- **Cron job setup** for scheduling

### Manual Backup:
```bash
# Create manual backup
./backup-db.sh

# Restore from backup
docker exec appwrite-mariadb mysql -u appwrite -p appwrite < backup.sql
```

## 📚 Additional Resources

### Official Documentation:
- [AppWrite Documentation](https://appwrite.io/docs)
- [AppWrite SDK for Web](https://appwrite.io/docs/client/web)
- [AppWrite REST API](https://appwrite.io/docs/server/general)

### Community:
- [AppWrite Discord](https://discord.gg/GSeTUeA)
- [AppWrite GitHub](https://github.com/appwrite/appwrite)
- [AppWrite Blog](https://appwrite.io/blog)

---

**Ready to add database functionality?** Start with [APPWRITE_DATABASE_SETUP.md](./APPWRITE_DATABASE_SETUP.md) for complete setup instructions.
