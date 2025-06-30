# 🛠️ Development Documentation

This section contains documentation for development workflows, best practices, and local setup procedures.

## 📋 **Available Guides**

### **Development Workflow**
- **[UPDATE_WORKFLOW.md](./UPDATE_WORKFLOW.md)** - Quick workflow for making changes and deploying updates to the live website
- **[INSTALL_NODEJS_VPS.md](./INSTALL_NODEJS_VPS.md)** - Node.js installation guide for VPS environments

## 🎯 **Quick Start**

### **Local Development Setup**
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run development server: `npm run dev`

### **Update Workflow**
1. Follow [UPDATE_WORKFLOW.md](./UPDATE_WORKFLOW.md) for the 3-step process
2. Edit → Push → Deploy
3. Test changes locally first
4. Deploy to production

## 🔄 **Development Workflow**

### **Standard Process**
```bash
# 1. Local Development
cd "/Users/akyriakouu/Documents/Zero Point/Projects/zeropoint-labs-hostinger"
npm run dev  # Test locally (optional)

# 2. Version Control
git add .
git commit -m "Describe your changes"
git push origin master

# 3. Production Deployment
ssh root@YOUR_VPS_IP
cd /var/www/zeropoint-labs/zeropoint-hostinger
git pull origin master
./deploy.sh
```

### **Environment Setup**
- **Local**: `.env.local` for development
- **Production**: Environment variables in VPS
- **Docker**: Build arguments and runtime variables
- **Security**: Never commit sensitive keys

## 🛠️ **Development Stack**

### **Frontend Technologies**
- **Framework**: Next.js 15.3.3 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with custom components
- **UI Library**: Radix UI primitives
- **Animations**: Framer Motion
- **3D Graphics**: Three.js with React Three Fiber

### **Backend & API**
- **API Routes**: Next.js API routes
- **Database**: Appwrite (optional)
- **AI Integration**: OpenAI GPT-4o
- **Authentication**: Appwrite auth (when enabled)

### **Development Tools**
- **Linting**: ESLint with Next.js config
- **Formatting**: Prettier (recommended)
- **Type Checking**: TypeScript compiler
- **Package Manager**: npm
- **Version Control**: Git with GitHub

## 📁 **Project Structure**

```
zeropoint-labs-hostinger/
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # React components
│   ├── lib/                 # Utility libraries
│   ├── services/            # API services
│   └── data/               # Static data
├── public/                 # Static assets
├── docs/                   # Documentation
├── scripts/                # Build and deployment scripts
├── docker-compose.yml      # Docker configuration
├── Dockerfile             # Container definition
└── deploy.sh              # Deployment script
```

## 🎯 **Development Environment**

### **Local Setup Requirements**
- **Node.js**: Version 18+ (LTS recommended)
- **npm**: Comes with Node.js
- **Git**: For version control
- **Code Editor**: VS Code recommended
- **Terminal**: Command line access

### **Recommended VS Code Extensions**
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features
- Prettier - Code formatter
- GitLens — Git supercharged

## 🔧 **Common Development Commands**

### **Local Development**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### **Docker Development**
```bash
docker-compose up --build    # Build and run containers
docker-compose logs -f       # View logs
docker-compose down          # Stop containers
docker-compose restart       # Restart services
```

### **Git Workflow**
```bash
git status                   # Check file changes
git add .                    # Stage all changes
git commit -m "message"      # Commit with message
git push origin master       # Push to remote
git pull origin master       # Pull latest changes
```

## 🚀 **Deployment Process**

### **Automated Deployment**
```bash
# On VPS
./deploy.sh
```

### **Manual Deployment Steps**
```bash
# 1. Pull latest code
git pull origin master

# 2. Install dependencies
npm ci

# 3. Build application
npm run build

# 4. Restart containers
docker-compose up --build -d
```

## 🔍 **Troubleshooting Development Issues**

### **Common Problems**

1. **Build Errors**
   - Check TypeScript errors: `npm run type-check`
   - Verify dependencies: `npm install`
   - Clear Next.js cache: `rm -rf .next`

2. **Environment Variables**
   - Ensure `.env.local` exists
   - Check variable names and syntax
   - Restart development server

3. **Docker Issues**
   - Check container status: `docker-compose ps`
   - View logs: `docker-compose logs -f`
   - Rebuild containers: `docker-compose up --build`

4. **Git Problems**
   - Check branch: `git branch -a`
   - Resolve conflicts manually
   - Force push (careful): `git push --force`

### **Debug Commands**
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Verify environment variables
echo $NODE_ENV

# Check file permissions
ls -la .env.local

# Docker container logs
docker logs container_name
```

## 📊 **Performance Optimization**

### **Development Performance**
- **Fast Refresh**: Hot reloading in development
- **TypeScript**: Type checking for fewer runtime errors
- **ESLint**: Code quality and consistency
- **Source Maps**: Better debugging experience

### **Production Optimization**
- **Code Splitting**: Automatic with Next.js
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: Analyze build output
- **Performance Monitoring**: Core Web Vitals

## 🔒 **Security Best Practices**

### **Development Security**
- **Environment Variables**: Never commit sensitive data
- **Dependencies**: Regular security audits with `npm audit`
- **HTTPS**: Use HTTPS in all environments
- **Access Control**: Limit access to development resources

### **Code Security**
- **Input Validation**: Validate all user inputs
- **SQL Injection**: Use parameterized queries
- **XSS Protection**: Sanitize user content
- **Authentication**: Implement proper auth flows

## 📈 **Development Metrics**

### **Code Quality**
- TypeScript coverage
- ESLint error count
- Test coverage (when implemented)
- Bundle size analysis

### **Performance Metrics**
- Build time
- Hot reload speed
- Development server startup time
- Memory usage during development

## 🎯 **Success Criteria**

A well-configured development environment should have:
- ✅ Fast development server startup
- ✅ Hot reloading working properly
- ✅ No TypeScript or ESLint errors
- ✅ Environment variables loaded correctly
- ✅ Git workflow functioning smoothly
- ✅ Docker containers running properly

## 📚 **Additional Resources**

### **Official Documentation**
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### **Best Practices**
- [Next.js Best Practices](https://nextjs.org/docs/pages/building-your-application/optimizing)
- [React Best Practices](https://react.dev/learn/thinking-in-react)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

---

**Ready to start developing?** Follow the [UPDATE_WORKFLOW.md](./UPDATE_WORKFLOW.md) for the standard development process, or set up Node.js on VPS using [INSTALL_NODEJS_VPS.md](./INSTALL_NODEJS_VPS.md).
