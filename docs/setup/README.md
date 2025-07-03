# 🔧 Setup & Configuration

This directory contains setup guides and configuration documentation for the ZeroPoint Labs analytics platform.

## 📋 Setup Guides

### [🔑 Appwrite Setup](./appwrite.md)
Complete guide for configuring Appwrite Cloud Pro with:
- Authentication setup (email/password)
- CRM database configuration
- Knowledge base for RAG/GPT integration
- Project and collection setup

### 🌐 Environment Configuration
Required environment variables and configuration files:

```bash
# .env.local
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
APPWRITE_API_KEY=your_api_key_here
```

## 🚀 Quick Setup Steps

### 1. Appwrite Backend
1. Follow the [Appwrite Setup Guide](./appwrite.md)
2. Create project and configure authentication
3. Set up CRM database and collections
4. Generate API keys

### 2. Analytics Database
1. Use the interactive setup: `npm run setup-analytics`
2. Create required database collections
3. Configure permissions and attributes
4. Validate setup: `npm run test-setup`

### 3. Environment Variables
1. Copy environment template: `cp .env.example .env.local`
2. Add your Appwrite credentials
3. Configure any additional settings

## 🔍 Validation

### Setup Validation Tools
- **Web Interface**: `http://localhost:3000/dashboard/setup`
- **Terminal Command**: `npm run test-setup`
- **Manual Validation**: `npm run validate-analytics`

### Common Setup Issues
- **Database not found**: Ensure analytics database is created in Appwrite Console
- **Permission errors**: Verify API key has required scopes
- **Missing attributes**: Check all collection attributes are added correctly

## 📚 Related Documentation

- [Analytics Capabilities](../features/analytics-capabilities.md) - What you can track
- [Integration Guide](../guides/integration.md) - Add tracking to websites  
- [Deployment Guide](../deployment/DEPLOYMENT_GUIDE.md) - Production setup

---

Need help? Check the [main documentation](../README.md) or specific setup guides above. 