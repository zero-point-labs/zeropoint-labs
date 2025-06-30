# Development Documentation

This folder contains guides for development workflows, update procedures, and ongoing maintenance of the Zero Point Labs website.

## 📋 Available Guides

### 🔄 [UPDATE_WORKFLOW.md](./UPDATE_WORKFLOW.md)
**Quick Update Workflow Guide**

A streamlined guide for making changes to your website and deploying them to your live VPS. This guide covers:

- **3-Step Update Process**: Edit → Push → Deploy
- **Local Development**: Making changes on your Mac
- **Version Control**: Git workflow for updates
- **Production Deployment**: Automated deployment to VPS
- **Verification Steps**: Ensuring updates are live
- **Troubleshooting**: Common issues and solutions
- **Best Practices**: Commit messages, testing, backups

**Use this guide for**: Day-to-day updates and maintenance of your live website.

**Time required**: 2-8 minutes per update

---

## 🚀 Development Workflow Overview

The Zero Point Labs website uses a modern development workflow designed for efficiency and reliability:

### Local Development → Version Control → Production
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Local Changes  │───▶│   Git Push      │───▶│ VPS Deployment  │
│   (Your Mac)    │    │  (Repository)   │    │  (Live Site)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Key Benefits:
- **Fast Updates**: Changes live in 2-8 minutes
- **Version Control**: Full history of all changes
- **Rollback Capability**: Easy to revert if needed
- **Automated Deployment**: Minimal manual steps
- **Testing Options**: Local testing before deployment

## 🛠️ Development Environment

### Local Setup (Your Mac):
- **Project Location**: `/Users/akyriakouu/Documents/Zero Point/Projects/zeropoint-labs-hostinger`
- **Node.js**: Version 18+ for Next.js development
- **Package Manager**: npm for dependency management
- **Editor**: Any code editor (VS Code recommended)
- **Git**: Version control for change tracking

### Production Environment (VPS):
- **Location**: `/var/www/zeropoint-labs/zeropoint-hostinger`
- **Docker**: Containerized deployment
- **Nginx**: Reverse proxy and web server
- **SSL**: Let's Encrypt certificates
- **Monitoring**: Docker health checks

## 📝 Common Development Tasks

### 1. Content Updates
**Examples**: Text changes, image updates, pricing modifications

```bash
# Edit files locally
nano src/components/sections/HeroSection.tsx

# Quick deploy
git add . && git commit -m "Update hero text" && git push
```

### 2. Styling Changes
**Examples**: CSS updates, layout modifications, responsive fixes

```bash
# Edit styles
nano src/app/globals.css

# Test locally (optional)
npm run dev

# Deploy
git add . && git commit -m "Fix mobile layout" && git push
```

### 3. Component Updates
**Examples**: New features, functionality changes, bug fixes

```bash
# Edit components
nano src/components/sections/PricingSection.tsx

# Test thoroughly
npm run dev

# Deploy with descriptive message
git add . && git commit -m "Add new pricing tier" && git push
```

### 4. Configuration Changes
**Examples**: Environment variables, build settings, dependencies

```bash
# Update configuration
nano next.config.js

# Install new dependencies (if needed)
npm install new-package

# Deploy
git add . && git commit -m "Add new configuration" && git push
```

## ⚡ Quick Commands Reference

### Local Development:
```bash
# Navigate to project
cd "/Users/akyriakouu/Documents/Zero Point/Projects/zeropoint-labs-hostinger"

# Start development server
npm run dev

# Build for production (testing)
npm run build

# Quick commit and push
git add . && git commit -m "Quick update" && git push
```

### VPS Deployment:
```bash
# SSH to VPS
ssh root@YOUR_VPS_IP

# Navigate and deploy
cd /var/www/zeropoint-labs/zeropoint-hostinger && git pull && ./deploy.sh

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

## 🔍 Testing & Quality Assurance

### Local Testing (Optional but Recommended):
1. **Development Server**: `npm run dev` - Test at http://localhost:3000
2. **Build Test**: `npm run build` - Ensure production build works
3. **Lint Check**: `npm run lint` - Check for code issues

### Production Verification:
1. **Website Access**: Visit https://your-domain.com
2. **HTTPS Check**: Ensure SSL certificate is working
3. **Functionality Test**: Test key features and pages
4. **Mobile Check**: Verify responsive design

### Automated Checks:
- **Docker Health Checks**: Automatic container monitoring
- **Nginx Status**: Web server health monitoring
- **SSL Monitoring**: Certificate expiration tracking

## 📊 Development Timeline

| Task Type | Local Time | Deploy Time | Total Time |
|-----------|------------|-------------|------------|
| **Text Changes** | 1-2 min | 2-3 min | 3-5 min |
| **Style Updates** | 2-5 min | 2-3 min | 4-8 min |
| **Component Changes** | 5-15 min | 2-3 min | 7-18 min |
| **Major Features** | 30+ min | 2-3 min | 32+ min |

## 🎯 Best Practices

### 1. Commit Messages
```bash
# Good examples:
git commit -m "Update pricing section with new plans"
git commit -m "Fix mobile navigation menu"
git commit -m "Add contact form validation"

# Avoid:
git commit -m "updates"
git commit -m "fix stuff"
```

### 2. Testing Strategy
- **Small Changes**: Deploy directly (text, simple styling)
- **Medium Changes**: Test locally first (components, functionality)
- **Large Changes**: Thorough local testing + staging environment

### 3. Backup Strategy
```bash
# Create backup branch before major changes
git checkout -b backup-before-major-update
git checkout main
# Make changes...
```

### 4. Monitoring
- **Check logs** after deployment: `docker-compose logs -f`
- **Monitor resource usage**: `docker stats`
- **Verify website functionality** after updates

## 🚨 Troubleshooting Development Issues

### Common Local Issues:
1. **Node.js Version**: Ensure Node 18+ is installed
2. **Dependencies**: Run `npm install` if packages are missing
3. **Port Conflicts**: Kill processes using port 3000
4. **Build Errors**: Check syntax and import statements

### Common Deployment Issues:
1. **Git Push Fails**: Check repository permissions
2. **Docker Build Fails**: Check available disk space
3. **Website Not Updating**: Force rebuild with `--no-cache`
4. **SSL Issues**: Verify domain DNS configuration

### Debug Commands:
```bash
# Local debugging
npm run build  # Check for build errors
npm run lint   # Check for code issues

# Production debugging
docker-compose logs        # Check container logs
docker system df          # Check disk usage
docker-compose ps         # Check container status
```

## 🔄 Advanced Workflows

### Feature Branch Workflow:
```bash
# Create feature branch
git checkout -b new-feature

# Make changes and test
# ... development work ...

# Merge to main
git checkout main
git merge new-feature
git push
```

### Hotfix Workflow:
```bash
# Quick fix for urgent issues
git add .
git commit -m "Hotfix: urgent issue description"
git push

# Deploy immediately
ssh root@VPS_IP "cd /var/www/zeropoint-labs/zeropoint-hostinger && git pull && ./deploy.sh"
```

### Rollback Workflow:
```bash
# If something goes wrong, rollback
git log --oneline  # Find previous commit
git reset --hard COMMIT_HASH
git push --force

# Deploy previous version
ssh root@VPS_IP "cd /var/www/zeropoint-labs/zeropoint-hostinger && git pull && ./deploy.sh"
```

## 📈 Performance Optimization

### Development Performance:
- **Fast Refresh**: Next.js hot reloading for quick development
- **Incremental Builds**: Only rebuild changed components
- **TypeScript**: Type checking for fewer runtime errors

### Deployment Performance:
- **Docker Layer Caching**: Faster subsequent builds
- **Multi-stage Builds**: Optimized production images
- **Nginx Caching**: Static asset optimization

## 📚 Additional Resources

### Next.js Documentation:
- [Next.js Docs](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Development Tools:
- [VS Code](https://code.visualstudio.com/)
- [Git Documentation](https://git-scm.com/doc)
- [Docker Documentation](https://docs.docker.com/)

---

**Ready to start developing?** Begin with [UPDATE_WORKFLOW.md](./UPDATE_WORKFLOW.md) for the complete development workflow.
