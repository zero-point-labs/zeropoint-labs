# Deployment Documentation

This folder contains comprehensive guides for deploying the Zero Point Labs website to production environments.

## 📋 Available Guides

### 🚀 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
**Complete Hostinger VPS Deployment Guide**

A comprehensive step-by-step guide for deploying your Zero Point Labs website to a Hostinger VPS using Docker. This guide covers:

- **Prerequisites**: VPS setup, domain configuration, SSH access
- **Phase-by-phase deployment**: From initial server setup to live website
- **Docker containerization**: Next.js app with Nginx reverse proxy
- **SSL certificate setup**: Let's Encrypt integration with auto-renewal
- **Security configuration**: Firewall setup and best practices
- **Troubleshooting**: Common issues and solutions
- **Monitoring**: Health checks and maintenance commands

**Use this guide for**: First-time deployment to a single VPS with one domain.

**Time required**: 30-60 minutes

---

### 🏗️ [MULTI_PROJECT_DEPLOYMENT.md](./MULTI_PROJECT_DEPLOYMENT.md)
**Multi-Project VPS Deployment Guide**

Advanced guide for hosting multiple Next.js projects on a single VPS, each with its own domain and SSL certificate. This guide covers:

- **Architecture overview**: How to structure multiple projects
- **Port allocation**: Managing different projects on different ports
- **Nginx proxy configuration**: Central reverse proxy for all domains
- **SSL management**: Individual certificates for each domain
- **Resource optimization**: Efficient use of VPS resources
- **Management scripts**: Automated deployment and maintenance
- **Scaling considerations**: Performance and resource requirements

**Use this guide for**: Hosting multiple client websites or projects on one VPS.

**Benefits**:
- Cost-effective hosting of multiple sites
- Independent deployments for each project
- Professional SSL setup for all domains
- Centralized management with individual control

---

## 🎯 Which Guide Should You Use?

### Choose **DEPLOYMENT_GUIDE.md** if:
- ✅ You're deploying a single website
- ✅ You have one domain
- ✅ This is your first deployment
- ✅ You want a straightforward setup

### Choose **MULTI_PROJECT_DEPLOYMENT.md** if:
- ✅ You plan to host multiple websites
- ✅ You have multiple domains
- ✅ You want to maximize VPS cost efficiency
- ✅ You need independent deployments for different projects

## 🚀 Quick Start

### For Single Project Deployment:
1. Read [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
2. Follow the phase-by-phase instructions
3. Use [../reference/QUICK_REFERENCE.md](../reference/QUICK_REFERENCE.md) for emergency commands

### For Multi-Project Setup:
1. Start with [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) to understand the basics
2. Then follow [MULTI_PROJECT_DEPLOYMENT.md](./MULTI_PROJECT_DEPLOYMENT.md) for advanced setup
3. Use the provided management scripts for ongoing maintenance

## 🛠️ Prerequisites

Before starting any deployment:

- **VPS Access**: Hostinger VPS with root access
- **Domain(s)**: Registered domain name(s) with DNS control
- **Local Setup**: Git repository with your project code
- **Tools**: SSH client, terminal access
- **Knowledge**: Basic command line familiarity

## 📊 Deployment Comparison

| Feature | Single Project | Multi-Project |
|---------|---------------|---------------|
| **Complexity** | Simple | Advanced |
| **Setup Time** | 30-60 min | 1-2 hours |
| **Cost Efficiency** | Good | Excellent |
| **Maintenance** | Easy | Moderate |
| **Scalability** | Limited | High |
| **SSL Management** | Simple | Automated |

## 🆘 Troubleshooting

### Common Issues:
1. **SSH Connection Problems**: Check VPS IP and credentials
2. **Domain Not Resolving**: Verify DNS configuration
3. **SSL Certificate Errors**: Ensure domain points to VPS
4. **Docker Build Failures**: Check available disk space
5. **Port Conflicts**: Verify port allocation in multi-project setup

### Getting Help:
- Check troubleshooting sections in each guide
- Use [../reference/QUICK_REFERENCE.md](../reference/QUICK_REFERENCE.md) for emergency commands
- Review logs with `docker-compose logs -f`

## 🔄 Post-Deployment

After successful deployment:

1. **Test your website**: Verify HTTPS and functionality
2. **Set up monitoring**: Use provided health check commands
3. **Configure backups**: Follow backup procedures in guides
4. **Update workflow**: Use [../development/UPDATE_WORKFLOW.md](../development/UPDATE_WORKFLOW.md)

## 📈 Next Steps

- **Database Integration**: See [../database/](../database/) for AppWrite setup
- **Analytics**: Check [../guides/integration.md](../guides/integration.md)
- **Development Workflow**: Review [../development/](../development/) folder
- **Maintenance**: Regular updates and security patches

---

**Need help?** Each guide includes comprehensive troubleshooting sections and emergency commands to help you resolve issues quickly.
