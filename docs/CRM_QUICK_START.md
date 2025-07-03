# CRM Quick Start Guide

Get your Appwrite-powered CRM system running in 15 minutes!

## 🚀 Quick Setup

### 1. Appwrite Project (5 minutes)

1. **Create Account & Project:**
   - Sign up at [cloud.appwrite.io](https://cloud.appwrite.io)
   - Create new project: "My CRM"
   - Copy the Project ID

2. **Add Platform:**
   - Settings → Platforms → Add Platform → Web
   - Name: "CRM Web App"
   - Hostname: `localhost:3000`

### 2. Database Setup (5 minutes)

1. **Create Database:**
   - Databases → Create Database
   - ID: `crm_database`
   - Name: "CRM Database"

2. **Create Collections:**

**Collection: `customers`**
```bash
# Quick attributes setup
ID: customers
Permissions: Document-level

# Essential attributes:
user_id (string, 36, required)
name (string, 255, required)  
email (email, 255, required)
phone (string, 50)
company (string, 255)
status (string, 50, default: "prospect")
value (integer, default: 0)
website (url, 500)
notes (string, 2000)
created_at (datetime, required)
updated_at (datetime, required)
```

**Collection: `crm_configurations`**
```bash
ID: crm_configurations
Permissions: Document-level

# Attributes:
user_id (string, 36, required)
fields (string, 10000)
columns (string, 5000) 
dashboard_cards (string, 5000)
created_at (datetime, required)
updated_at (datetime, required)
```

### 3. Permissions Setup (3 minutes)

For **both collections**, set these permissions:

**Create Documents:** `users`
**Read Documents:** `user:{{user_id}}`
**Update Documents:** `user:{{user_id}}`
**Delete Documents:** `user:{{user_id}}`

### 4. Environment Configuration (2 minutes)

Update `src/lib/appwrite.ts`:
```typescript
client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('YOUR_PROJECT_ID_HERE'); // ← Replace with your Project ID
```

Create `.env.local`:
```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here
```

## ✅ Test Your Setup

1. **Start Development:**
   ```bash
   npm run dev
   ```

2. **Create Account:**
   - Visit `http://localhost:3000/login`
   - Create new account or use demo mode

3. **Test CRM:**
   - Navigate to `/dashboard/crm`
   - Add a customer
   - Customize fields and columns
   - Verify real-time updates

## 🎯 Key Features Working

✅ **Multi-user Authentication** - Each user sees only their data
✅ **Real-time Updates** - Changes sync instantly across tabs
✅ **Custom Fields** - Add any field type you need
✅ **Dynamic Columns** - Show/hide and reorder table columns
✅ **Dashboard Cards** - Configurable metrics and KPIs
✅ **Responsive Design** - Works on desktop and mobile
✅ **Demo Mode** - Try without setting up database

## 🔧 Troubleshooting

**Can't connect to Appwrite?**
- Verify Project ID is correct
- Check platform hostname matches your domain

**Permission errors?**
- Ensure permissions are set on both collections
- Verify `user_id` field exists and is indexed

**Real-time not working?**
- Enable real-time on database settings
- Check browser console for WebSocket errors

**Need help?**
- Check `docs/APPWRITE_CRM_SETUP.md` for detailed setup
- View browser console for error messages
- Verify all collection attributes are created correctly

## 🚀 Ready for Production?

1. **Add Production Platform:**
   - Add your domain to Appwrite platforms
   - Update environment variables

2. **Enable Security:**
   - Configure email verification
   - Set up rate limiting
   - Add monitoring

3. **Performance:**
   - Add database indexes for large datasets
   - Configure caching strategies
   - Monitor real-time connection limits

## 📋 What You Built

🎉 **Congratulations!** You now have a fully functional CRM with:

- **User Authentication** with Google OAuth support
- **Customer Management** with CRUD operations
- **Real-time Collaboration** - multiple users can work simultaneously
- **Customizable Interface** - fields, columns, and dashboard cards
- **Multi-tenant Architecture** - proper data isolation
- **Responsive Design** - works on all devices
- **Demo Mode** - for testing and demonstrations

## 🔮 Next Steps

- **Advanced Fields:** Add file upload fields for customer documents
- **Reporting:** Build custom reports and analytics
- **Integrations:** Connect with email marketing tools
- **Mobile App:** Use Appwrite's mobile SDKs for native apps
- **API Access:** Build integrations using Appwrite's REST API

---

**Time to build amazing customer relationships!** 🎯 