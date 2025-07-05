# Analytics System Setup Guide

This guide will help you set up the complete analytics system for Zero Point Labs.

## 🚀 Quick Start

### 1. Environment Variables

Create a `.env.local` file in the `zeropoint-labs` directory with the following variables:

```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here

# Server-side Appwrite API Key (for collection creation and server operations)
APPWRITE_API_KEY=your_server_api_key_here

# Analytics Configuration
ANALYTICS_DOMAIN=zeropoint-labs.com
```

### 2. Install Dependencies

Make sure all dependencies are installed:

```bash
cd zeropoint-labs
npm install
```

### 3. Set Up Appwrite Collections

Run the setup script to create the necessary Appwrite collections:

```bash
npm run setup-analytics
```

This will create:
- `websites` collection (for tracking configured websites)
- `events` collection (for storing analytics events)

### 4. Start Development Servers

Start both projects:

```bash
# Terminal 1 - Analytics Dashboard
cd zeropoint-labs
npm run dev

# Terminal 2 - Test Website
cd gprealty-cy
npm run dev
```

The analytics dashboard will be available at `http://localhost:3000`
The test website will be available at `http://localhost:3001`

## 📋 System Architecture

### Components

1. **Tracking Script** (`public/tracker.js`)
   - Collects page views, clicks, form submissions, scroll events
   - Sends data to `/api/track` endpoint
   - Automatically tracks SPA navigation

2. **Analytics API** (`/api/track`)
   - Validates incoming tracking data
   - Rate limiting and security checks
   - Stores events in Appwrite database

3. **Setup Page** (`/setup`)
   - Add and manage websites
   - Generate tracking scripts
   - Test connection status

4. **Analytics Dashboard** (`/dashboard/analytics`)
   - Real-time analytics display
   - Website selection and date filtering
   - Key metrics and top pages

### Database Schema

#### Websites Collection
```json
{
  "userId": "string",
  "domain": "string",
  "verified": "boolean",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

#### Events Collection
```json
{
  "userId": "string",
  "website": "string",
  "eventType": "string",
  "path": "string",
  "timestamp": "datetime",
  "sessionId": "string",
  "hashedIP": "string",
  "metadata": "string", // JSON
  "createdAt": "datetime"
}
```

## 🔧 Configuration

### Tracking Script Configuration

The tracking script can be configured with the following attributes:

```html
<script 
  src="http://localhost:3000/tracker.js" 
  data-website="your-domain.com" 
  async
></script>
```

### Event Types Tracked

- `page_view` - Page visits
- `page_blur` - User leaves page (for session duration)
- `page_focus` - User returns to page
- `link_click` - Link clicks
- `button_click` - Button clicks
- `form_submit` - Form submissions
- `scroll` - Scroll events (throttled)

## 🧪 Testing

### 1. Add Test Website

1. Navigate to `http://localhost:3000/setup`
2. Add `gprealty-cy.com` as a test website
3. Copy the generated tracking script

### 2. Verify Tracking

1. Visit `http://localhost:3001` (test website)
2. Navigate between pages and interact with elements
3. Check the analytics dashboard at `http://localhost:3000/dashboard/analytics`
4. Use "Check Connection" in the setup page to verify data flow

### 3. Debug Issues

- Check browser console for tracking script errors
- Verify API endpoint is receiving requests
- Check Appwrite console for data storage
- Use network tab to monitor tracking requests

## 🔒 Security Features

### Rate Limiting
- 100 requests per minute per IP address
- Configurable via environment variables

### Data Privacy
- IP addresses are hashed before storage
- No personally identifiable information stored
- GDPR-compliant data handling

### Domain Validation
- Only verified domains can send tracking data
- Prevents unauthorized data injection

## 📊 Analytics Metrics

### Key Metrics Calculated
- **Total Visitors**: Unique session count
- **Page Views**: Total page view events
- **Bounce Rate**: Single-page sessions percentage
- **Average Duration**: Mean session length
- **Conversion Rate**: Form submissions per visitor
- **Active Users**: Real-time active sessions

### Data Aggregation
- Real-time calculations from raw events
- Efficient querying with Appwrite indexes
- Configurable date ranges (1d, 7d, 30d, 90d)

## 🚀 Deployment

### Production Checklist

1. **Environment Variables**
   - Set production Appwrite credentials
   - Configure production domain
   - Set appropriate rate limits

2. **Tracking Script**
   - Update script URL to production domain
   - Ensure HTTPS for security

3. **Database**
   - Verify Appwrite collections are created
   - Set appropriate permissions
   - Configure indexes for performance

4. **Security**
   - Enable CORS restrictions
   - Set up proper rate limiting
   - Monitor for abuse

## 🔧 Customization

### Adding New Event Types

1. Update tracking script to capture new events
2. Modify API validation to accept new event types
3. Update analytics calculations if needed

### Custom Metrics

1. Add new aggregation functions in `appwrite.ts`
2. Update dashboard to display new metrics
3. Create new UI components as needed

## 📞 Support

For issues or questions:
1. Check the browser console for errors
2. Verify Appwrite configuration
3. Test with the included test website
4. Review this documentation

## 🎯 Next Steps

1. **Enhanced Analytics**
   - Add geographic data
   - Device and browser tracking
   - Referrer analysis

2. **Real-time Features**
   - WebSocket connections
   - Live visitor tracking
   - Real-time alerts

3. **Export Features**
   - PDF reports
   - CSV data export
   - Scheduled reports

4. **Multi-user Support**
   - Team collaboration
   - Permission management
   - Shared dashboards 