# Zero Point Labs Website Documentation

This documentation provides comprehensive guides for deploying, managing, and developing the Zero Point Labs website. The documentation is organized into logical categories for easy navigation.

## 📁 Documentation Structure

### 🚀 [Deployment](./deployment/)
Complete guides for deploying the website to production environments.

- **[DEPLOYMENT_GUIDE.md](./deployment/DEPLOYMENT_GUIDE.md)** - Complete step-by-step guide for deploying to Hostinger VPS with Docker, SSL, and domain configuration
- **[MULTI_PROJECT_DEPLOYMENT.md](./deployment/MULTI_PROJECT_DEPLOYMENT.md)** - Advanced guide for hosting multiple Next.js projects on a single VPS with individual domains

### 🗄️ [Database](./database/)
Database setup and configuration guides.

- **[APPWRITE_DATABASE_SETUP.md](./database/APPWRITE_DATABASE_SETUP.md)** - Complete guide for adding AppWrite database to your existing deployment with Docker configuration

### 💻 [Development](./development/)
Development workflow and update procedures.

- **[UPDATE_WORKFLOW.md](./development/UPDATE_WORKFLOW.md)** - Quick workflow for making changes and deploying updates to the live website

### 📖 [Guides](./guides/)
Integration guides and tutorials.

- **[integration.md](./guides/integration.md)** - Analytics integration guide for tracking website performance

### 📚 [Reference](./reference/)
Quick reference materials and cheat sheets.

- **[QUICK_REFERENCE.md](./reference/QUICK_REFERENCE.md)** - Emergency commands and quick setup checklist

## 🎯 Project Overview

**Zero Point Labs Website** is a modern Next.js application featuring:

- **Framework**: Next.js 15.3.3 with React 19
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: Radix UI primitives with custom magic UI components
- **3D Graphics**: Three.js with React Three Fiber
- **Database**: AppWrite (optional)
- **Deployment**: Docker containerization with Nginx reverse proxy
- **Infrastructure**: Hostinger VPS with SSL certificates

### Key Features
- Responsive design with mobile optimization
- 3D interactive elements and animations
- Chat functionality (when configured)
- Pricing section
- Hero section with dynamic content
- Professional deployment setup

## 🚀 Quick Start

### For New Deployments
1. Start with **[DEPLOYMENT_GUIDE.md](./deployment/DEPLOYMENT_GUIDE.md)** for initial setup
2. Use **[QUICK_REFERENCE.md](./reference/QUICK_REFERENCE.md)** for emergency commands
3. Follow **[APPWRITE_DATABASE_SETUP.md](./database/APPWRITE_DATABASE_SETUP.md)** if you need database functionality

### For Development Updates
1. Follow **[UPDATE_WORKFLOW.md](./development/UPDATE_WORKFLOW.md)** for making changes
2. Use the 3-step process: Edit → Push → Deploy

### For Multiple Projects
1. Use **[MULTI_PROJECT_DEPLOYMENT.md](./deployment/MULTI_PROJECT_DEPLOYMENT.md)** for hosting multiple sites

## 🛠️ Technical Stack

### Frontend
- **Next.js 15.3.3** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Three.js** - 3D graphics library

### Backend & Database
- **AppWrite** - Backend-as-a-Service (optional)
- **MariaDB** - Database for AppWrite
- **Redis** - Caching layer

### Infrastructure
- **Docker** - Containerization
- **Nginx** - Reverse proxy and web server
- **Let's Encrypt** - SSL certificates
- **Hostinger VPS** - Cloud hosting

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Git** - Version control

## 📋 Prerequisites

Before using these guides, ensure you have:

- ✅ Hostinger VPS account
- ✅ Domain name
- ✅ SSH access to your VPS
- ✅ Basic terminal/command line knowledge
- ✅ Git repository for your code

## 🆘 Getting Help

### Common Issues
1. **Deployment Problems**: Check [DEPLOYMENT_GUIDE.md](./deployment/DEPLOYMENT_GUIDE.md) troubleshooting section
2. **SSL Issues**: Refer to certificate setup in deployment guides
3. **Docker Problems**: Use commands in [QUICK_REFERENCE.md](./reference/QUICK_REFERENCE.md)
4. **Database Issues**: Check [APPWRITE_DATABASE_SETUP.md](./database/APPWRITE_DATABASE_SETUP.md)

### Emergency Commands
```bash
# Check if containers are running
docker-compose ps

# View logs
docker-compose logs -f

# Restart everything
docker-compose restart

# Rebuild and restart
docker-compose up --build -d
```

## 🔄 Update Process

The typical workflow for updates:

1. **Local Development**
   ```bash
   cd "/Users/akyriakouu/Documents/Zero Point/Projects/zeropoint-labs-hostinger"
   # Make your changes
   npm run dev  # Test locally (optional)
   ```

2. **Version Control**
   ```bash
   git add .
   git commit -m "Describe your changes"
   git push
   ```

3. **Production Deployment**
   ```bash
   ssh root@YOUR_VPS_IP
   cd /var/www/zeropoint-labs/zeropoint-hostinger
   git pull
   ./deploy.sh
   ```

## 📊 Documentation Maintenance

This documentation is organized to be:
- **Comprehensive**: Covers all aspects of the project
- **Practical**: Step-by-step instructions with real commands
- **Organized**: Logical folder structure for easy navigation
- **Up-to-date**: Reflects current project state and best practices

### Contributing to Documentation
When updating documentation:
1. Keep guides practical with real examples
2. Include troubleshooting sections
3. Update this index when adding new files
4. Test all commands and procedures

## 🎉 Success Metrics

After following these guides, you should have:
- ✅ Live website at your domain with HTTPS
- ✅ Automated deployment workflow
- ✅ Professional infrastructure setup
- ✅ Database integration (if needed)
- ✅ Monitoring and maintenance procedures

---

**Last Updated**: December 2024  
**Project**: Zero Point Labs Website  
**Version**: 1.0.0
