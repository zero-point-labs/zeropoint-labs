# Authentication Troubleshooting Guide

## Current Issue
The application is showing "Unauthorized" errors when trying to connect a website. The server logs show:
- `No session cookie found for project 6861736a0007a58bac63`
- `POST /api/website - User: Not found`
- `POST /api/website 401 in 1111ms`

## Root Causes

### 1. Environment Variable Configuration
The application expects these environment variables in `.env.local`:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=6861736a0007a58bac63
```

**Action**: Create a `.env.local` file in your project root with these values.

### 2. Cookie Domain Issues
When running locally, cookies might not be properly shared between client and server due to:
- Different domains (localhost vs 127.0.0.1)
- Cookie security settings
- Browser restrictions

### 3. Docker Environment Variables
When running in Docker, environment variables need to be passed correctly.

## Solutions

### Step 1: Create/Update Environment Variables

1. Create `.env.local` in your project root:
```bash
touch .env.local
```

2. Add the following content:
```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=6861736a0007a58bac63
```

### Step 2: Update Docker Configuration

If using Docker, update your `docker-compose.yml`:

```yaml
services:
  nextjs-app:
    environment:
      - NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
      - NEXT_PUBLIC_APPWRITE_PROJECT_ID=6861736a0007a58bac63
```

### Step 3: Clear Browser Data

1. Clear all cookies for localhost:3000
2. Clear localStorage
3. Hard refresh the page (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows/Linux)

### Step 4: Test Authentication Flow

1. Go to `/test-appwrite` to verify Appwrite connection
2. Go to `/debug-auth` to check session status
3. Try logging in again

### Step 5: Verify Appwrite Configuration

In your Appwrite Console:
1. Go to your project settings
2. Check that your domain is whitelisted:
   - Add `localhost`
   - Add `localhost:3000`
   - Add your production domain
3. Verify OAuth settings if using Google login:
   - Success URL: `http://localhost:3000/dashboard`
   - Failure URL: `http://localhost:3000/login`

### Step 6: Check Cookie Settings

The Appwrite session cookie name should be: `a_session_6861736a0007a58bac63`

To verify:
1. Open browser DevTools
2. Go to Application → Cookies
3. Look for cookies starting with `a_session_`

### Step 7: Rebuild and Restart

```bash
# If using Docker
docker-compose down
docker-compose build --no-cache
docker-compose up

# If running locally
npm run build
npm run start
```

## Common Issues and Fixes

### Issue: Cookie not being set
**Fix**: Ensure you're accessing the app via `http://localhost:3000` not `http://127.0.0.1:3000`

### Issue: Session works on client but not server
**Fix**: This usually means the cookie isn't being sent with server requests. Check:
- Cookie httpOnly settings
- Cookie sameSite settings
- Domain consistency

### Issue: OAuth login redirects but doesn't authenticate
**Fix**: 
1. Check OAuth redirect URLs in Appwrite Console
2. Ensure the success URL matches exactly
3. Add a delay after OAuth redirect to allow session establishment

## Debug Endpoints

Use these endpoints to diagnose issues:

1. `/api/auth/debug` - Check server-side session
2. `/debug-auth` - Comprehensive auth debugging page
3. `/test-appwrite` - Test Appwrite connection

## Next Steps

If the issue persists after following these steps:

1. Check the browser console for JavaScript errors
2. Check the server logs for more detailed error messages
3. Verify that the Appwrite project ID matches everywhere
4. Ensure the Appwrite endpoint is accessible from your server

## Production Considerations

When deploying to production:
1. Update environment variables on your VPS
2. Ensure SSL is properly configured
3. Update cookie settings for secure contexts
4. Add production domain to Appwrite whitelist 