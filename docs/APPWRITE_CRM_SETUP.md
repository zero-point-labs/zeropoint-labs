# Appwrite CRM Setup Guide

This guide will help you set up the complete Appwrite backend for the CRM system with proper multi-tenant architecture, authentication, and real-time capabilities.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Appwrite Project Setup](#appwrite-project-setup)
3. [Database Configuration](#database-configuration)
4. [Collections Schema](#collections-schema)
5. [Permissions Configuration](#permissions-configuration)
6. [Environment Setup](#environment-setup)
7. [Testing the Setup](#testing-the-setup)
8. [Deployment Considerations](#deployment-considerations)
9. [Troubleshooting](#troubleshooting)

## Prerequisites

- [Appwrite Cloud](https://appwrite.io/) account or self-hosted Appwrite instance
- Node.js 18+ 
- Your existing Next.js project

## Appwrite Project Setup

### 1. Create New Appwrite Project

1. Log in to [Appwrite Cloud](https://cloud.appwrite.io/)
2. Click "Create Project"
3. Enter project name: "CRM System"
4. Copy your Project ID (you'll need this later)

### 2. Configure Platform

1. Go to "Settings" → "Platforms"
2. Click "Add Platform" → "Web"
3. Enter your platform details:
   - **Name**: CRM Web App
   - **Hostname**: `localhost` (for development)
   - **Port**: `3000` (or your dev port)

For production, add your production domain.

## Database Configuration

### 1. Create Database

1. Go to "Databases" in your Appwrite console
2. Click "Create Database"
3. Enter Database ID: `crm_database`
4. Name: "CRM Database"

### 2. Enable Real-time

1. In your database settings
2. Enable "Real-time" option
3. This allows live updates across connected clients

## Collections Schema

Create the following collections in your `crm_database`:

### Collection 1: `customers`

**Configuration:**
- Collection ID: `customers`
- Collection Name: "Customers"
- Permissions: Document-level

**Attributes:**
```
| Attribute      | Type      | Size  | Required | Array | Default    |
|---------------|-----------|-------|----------|-------|------------|
| user_id       | string    | 36    | Yes      | No    | -          |
| name          | string    | 255   | Yes      | No    | -          |
| email         | email     | 255   | Yes      | No    | -          |
| phone         | string    | 50    | No       | No    | -          |
| company       | string    | 255   | No       | No    | -          |
| status        | string    | 50    | No       | No    | prospect   |
| value         | integer   | -     | No       | No    | 0          |
| website       | url       | 500   | No       | No    | -          |
| notes         | string    | 2000  | No       | No    | -          |
| lastContact   | datetime  | -     | No       | No    | -          |
| industry      | string    | 100   | No       | No    | -          |
| priority      | string    | 20    | No       | No    | Medium     |
| isVip         | boolean   | -     | No       | No    | false      |
| created_at    | datetime  | -     | Yes      | No    | -          |
| updated_at    | datetime  | -     | Yes      | No    | -          |
```

**Custom Fields Support:**
Add these for dynamic field support:
```
| custom_field_1 | string   | 500   | No       | No    | -          |
| custom_field_2 | string   | 500   | No       | No    | -          |
| custom_field_3 | string   | 500   | No       | No    | -          |
| custom_field_4 | string   | 500   | No       | No    | -          |
| custom_field_5 | string   | 500   | No       | No    | -          |
```

**Indexes:**
1. **user_id_index**
   - Type: Key
   - Attributes: `user_id`
   - Orders: ASC

2. **user_status_index**
   - Type: Key  
   - Attributes: `user_id`, `status`
   - Orders: ASC, ASC

3. **created_at_index**
   - Type: Key
   - Attributes: `created_at`
   - Orders: DESC

### Collection 2: `crm_configurations`

**Configuration:**
- Collection ID: `crm_configurations`
- Collection Name: "CRM Configurations"
- Permissions: Document-level

**Attributes:**
```
| Attribute       | Type     | Size  | Required | Array | Default |
|----------------|----------|-------|----------|-------|---------|
| user_id        | string   | 36    | Yes      | No    | -       |
| fields         | string   | 10000 | No       | No    | -       |
| columns        | string   | 5000  | No       | No    | -       |
| dashboard_cards| string   | 5000  | No       | No    | -       |
| created_at     | datetime | -     | Yes      | No    | -       |
| updated_at     | datetime | -     | Yes      | No    | -       |
```

**Indexes:**
1. **user_config_index**
   - Type: Unique
   - Attributes: `user_id`
   - Orders: ASC

### Collection 3: `field_configs` (Optional - for advanced field management)

**Configuration:**
- Collection ID: `field_configs`
- Collection Name: "Field Configurations"
- Permissions: Document-level

**Attributes:**
```
| Attribute    | Type     | Size | Required | Array | Default |
|-------------|----------|------|----------|-------|---------|
| user_id     | string   | 36   | Yes      | No    | -       |
| field_id    | string   | 100  | Yes      | No    | -       |
| field_label | string   | 255  | Yes      | No    | -       |
| field_type  | string   | 50   | Yes      | No    | -       |
| field_config| string   | 2000 | No       | No    | -       |
| is_active   | boolean  | -    | No       | No    | true    |
| created_at  | datetime | -    | Yes      | No    | -       |
| updated_at  | datetime | -    | Yes      | No    | -       |
```

## Permissions Configuration

### Authentication Setup

1. Go to "Auth" → "Settings"
2. Configure these settings:
   - **Session Length**: 1 year (525600 minutes)
   - **Email/Password**: Enabled
   - **Google OAuth**: Configure with your credentials
   - **Email Verification**: Optional (recommended for production)

### Database Permissions

For each collection, configure these permissions:

#### `customers` Collection Permissions:

**Create Documents:**
```
users
```

**Read Documents:**
```
user:{{user_id}}
```

**Update Documents:**
```
user:{{user_id}}
```

**Delete Documents:**
```
user:{{user_id}}
```

#### `crm_configurations` Collection Permissions:

**Create Documents:**
```
users
```

**Read Documents:**
```
user:{{user_id}}
```

**Update Documents:**
```
user:{{user_id}}
```

**Delete Documents:**
```
user:{{user_id}}
```

#### `field_configs` Collection Permissions:

Same as above - user can only access their own configurations.

## Environment Setup

### 1. Environment Variables

Create or update your `.env.local` file:

```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here

# Optional: For server-side operations
APPWRITE_API_KEY=your_api_key_here
```

### 2. Update Appwrite Configuration

Update `src/lib/appwrite.ts` with your project ID:

```typescript
client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('YOUR_PROJECT_ID_HERE'); // Replace with your actual project ID
```

## Testing the Setup

### 1. Test Authentication

1. Start your development server: `npm run dev`
2. Navigate to `/login`
3. Try both email/password and Google OAuth
4. Verify successful redirect to `/dashboard`

### 2. Test CRM Functionality

1. Navigate to `/dashboard/crm`
2. Try adding a new customer
3. Test field customization
4. Test column configuration
5. Test dashboard cards

### 3. Test Multi-tenancy

1. Create two different user accounts
2. Add customers to each account
3. Verify that users can only see their own data
4. Test in different browser sessions

### 4. Test Real-time Updates

1. Open the CRM in two browser tabs with the same user
2. Add/edit a customer in one tab
3. Verify the change appears in the other tab
4. Test with different users to ensure proper isolation

## Deployment Considerations

### Production Environment

1. **Update Platform Settings:**
   - Add your production domain to Appwrite platforms
   - Configure proper CORS settings

2. **Environment Variables:**
   ```env
   NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_production_project_id
   ```

3. **Security:**
   - Enable email verification in production
   - Configure rate limiting
   - Set up proper error monitoring

### Scaling Considerations

1. **Database Indexes:**
   - Monitor query performance
   - Add additional indexes as needed
   - Consider database-level caching

2. **Real-time Connections:**
   - Appwrite Cloud handles this automatically
   - For self-hosted: configure Redis for scaling

3. **File Uploads** (Future Enhancement):
   - Configure Appwrite Storage
   - Set up proper file permissions
   - Implement file size limits

## Troubleshooting

### Common Issues

#### 1. "User not authenticated" errors
**Solution:**
- Check if user session is valid
- Verify JWT token hasn't expired
- Clear browser storage and re-login

#### 2. Permission denied errors
**Solution:**
- Verify collection permissions are set correctly
- Ensure `user_id` field is properly set on documents
- Check if user has proper role assignments

#### 3. Real-time updates not working
**Solution:**
- Verify real-time is enabled on database
- Check WebSocket connection in browser dev tools
- Ensure proper subscription setup in code

#### 4. Database connection errors
**Solution:**
- Verify project ID is correct
- Check network connectivity
- Verify Appwrite endpoint URL

### Debug Mode

Enable debug mode by adding to your environment:

```env
NEXT_PUBLIC_APPWRITE_DEBUG=true
```

This will log all Appwrite operations to the console.

### Performance Monitoring

Monitor these metrics:
- Database query times
- Real-time connection stability
- Authentication success rates
- Error rates by operation type

## Next Steps

1. **Enhanced Security:**
   - Implement rate limiting
   - Add audit logging
   - Configure backup strategies

2. **Advanced Features:**
   - File upload support for customer documents
   - Advanced search and filtering
   - Data export/import functionality
   - Integration with external services

3. **Analytics:**
   - Implement usage tracking
   - Performance monitoring
   - User behavior analytics

## Support

- [Appwrite Documentation](https://appwrite.io/docs)
- [Appwrite Discord Community](https://discord.gg/appwrite)
- [GitHub Issues](https://github.com/appwrite/appwrite/issues)

---

*This setup provides a production-ready, scalable CRM system with proper user isolation, real-time capabilities, and comprehensive security measures.* 