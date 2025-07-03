# 🔌 API Reference

Complete API documentation for the ZeroPoint Labs analytics platform backend services.

## 📊 Analytics API Endpoints

### Core Tracking Endpoints

#### `POST /api/analytics/track`
Record page views, events, and user interactions.

**Request Body:**
```json
{
  "event_type": "page_view|click|form_submit|custom",
  "page_url": "https://example.com/page",
  "page_title": "Page Title",
  "referrer": "https://referrer.com",
  "user_agent": "Mozilla/5.0...",
  "event_data": {
    "button": "signup",
    "location": "header"
  }
}
```

**Response:**
```json
{
  "success": true,
  "event_id": "event_12345",
  "timestamp": "2025-01-XX"
}
```

#### `GET /api/analytics/data`
Retrieve aggregated analytics data and metrics.

**Query Parameters:**
- `start_date` - Start date (ISO format)
- `end_date` - End date (ISO format)  
- `metrics` - Comma-separated metrics list
- `dimensions` - Grouping dimensions
- `filters` - JSON filter object

**Response:**
```json
{
  "total_views": 1234,
  "unique_visitors": 456,
  "bounce_rate": 0.45,
  "avg_session_duration": 180,
  "top_pages": [...],
  "traffic_sources": [...],
  "device_breakdown": {...}
}
```

### Form Analytics Endpoints

#### `POST /api/analytics/forms`
Record form submissions and lead data.

**Request Body:**
```json
{
  "form_name": "Contact Form",
  "form_id": "contact-form",
  "fields": {
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Hello world"
  },
  "page_url": "https://example.com/contact",
  "utm_params": {
    "utm_source": "google",
    "utm_medium": "cpc"
  }
}
```

#### `GET /api/analytics/forms`
Retrieve form submission data and analytics.

**Query Parameters:**
- `form_name` - Filter by form name
- `status` - Filter by status (pending|processed|spam)
- `priority` - Filter by priority (high|medium|low)
- `start_date` - Date range start
- `end_date` - Date range end

### Reporting Endpoints

#### `POST /api/analytics/reports`
Generate comprehensive analytics reports.

**Request Body:**
```json
{
  "report_type": "overview|traffic|content|forms",
  "date_range": {
    "start": "2025-01-01",
    "end": "2025-01-31"
  },
  "format": "json|csv",
  "include_raw_data": false
}
```

#### `GET /api/analytics/reports/{report_id}`
Retrieve generated report data.

## 🔐 Authentication

### API Key Authentication
All API requests require authentication via API key in the header:

```http
Authorization: Bearer YOUR_API_KEY
X-API-Key: YOUR_API_KEY
```

### API Key Management
API keys can be generated and managed through:
- Dashboard interface at `/dashboard/settings/api`
- Appwrite Console under API Keys section

### Permissions Required
- `databases.read` - Read analytics data
- `databases.write` - Record tracking events
- `documents.read` - Access stored data
- `documents.write` - Create new records

## 📈 Data Models

### Event Model
```typescript
interface AnalyticsEvent {
  $id: string;
  event_type: 'page_view' | 'click' | 'form_submit' | 'custom';
  page_url: string;
  page_title?: string;
  referrer?: string;
  user_agent: string;
  ip_address: string;
  session_id: string;
  user_id?: string;
  event_data?: object;
  timestamp: string;
  domain: string;
  device_type?: string;
  browser?: string;
  os?: string;
  country?: string;
  city?: string;
}
```

### Form Submission Model
```typescript
interface FormSubmission {
  $id: string;
  form_name: string;
  form_id?: string;
  fields: object;
  page_url: string;
  user_agent: string;
  ip_address: string;
  session_id: string;
  user_id?: string;
  timestamp: string;
  status: 'pending' | 'processed' | 'spam';
  priority: 'high' | 'medium' | 'low';
  source: string;
  referrer?: string;
  utm_params?: object;
}
```

### API Key Model
```typescript
interface APIKey {
  $id: string;
  key_name: string;
  api_key: string;
  domain: string;
  user_id: string;
  created_at: string;
  last_used?: string;
  is_active: boolean;
  usage_count: number;
}
```

## 🔍 Query Parameters

### Date Filtering
- `start_date` - ISO 8601 format (e.g., "2025-01-01T00:00:00Z")
- `end_date` - ISO 8601 format (e.g., "2025-01-31T23:59:59Z")
- `timezone` - Timezone offset (e.g., "-05:00")

### Pagination
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 50, max: 1000)
- `offset` - Number of records to skip

### Sorting
- `sort_by` - Field to sort by (e.g., "timestamp")
- `sort_order` - "asc" or "desc" (default: "desc")

### Filtering
- `filter` - JSON object with filter conditions
- `search` - Text search across relevant fields
- `exclude` - Fields to exclude from response

## 📊 Metrics and Dimensions

### Available Metrics
- `page_views` - Total page view count
- `unique_visitors` - Unique visitor count  
- `sessions` - Session count
- `bounce_rate` - Percentage of single-page sessions
- `avg_session_duration` - Average session length in seconds
- `conversion_rate` - Form submission rate
- `form_submissions` - Total form submissions

### Available Dimensions
- `date` - Group by date (day/week/month)
- `page_url` - Group by page URL
- `referrer` - Group by traffic source
- `device_type` - Group by device category
- `browser` - Group by browser type
- `country` - Group by visitor country
- `utm_source` - Group by campaign source

## 🚨 Error Handling

### HTTP Status Codes
- `200` - Success
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (invalid API key)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

### Error Response Format
```json
{
  "error": true,
  "code": 400,
  "type": "validation_error",
  "message": "Invalid date format",
  "details": {
    "field": "start_date",
    "expected": "ISO 8601 format"
  }
}
```

## 🔄 Rate Limiting

### Default Limits
- **Tracking Endpoint**: 1000 requests/minute
- **Data Endpoint**: 100 requests/minute  
- **Reports Endpoint**: 10 requests/minute
- **General API**: 500 requests/minute

### Rate Limit Headers
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## 📚 SDK & Libraries

### JavaScript SDK
```javascript
// Client-side tracking
Analytics.init('your_api_key');
Analytics.track('page_view');
Analytics.track('button_click', { button: 'signup' });
```

### Node.js SDK
```javascript
const { AnalyticsAPI } = require('@zeropoint/analytics');

const analytics = new AnalyticsAPI('your_api_key');
await analytics.track({
  event_type: 'page_view',
  page_url: 'https://example.com'
});
```

### REST API Examples

#### cURL Examples
```bash
# Track a page view
curl -X POST https://your-domain.com/api/analytics/track \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "page_view",
    "page_url": "https://example.com",
    "user_agent": "Mozilla/5.0..."
  }'

# Get analytics data
curl -X GET "https://your-domain.com/api/analytics/data?start_date=2025-01-01&end_date=2025-01-31" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

#### Python Example
```python
import requests

headers = {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
}

# Track event
response = requests.post(
    'https://your-domain.com/api/analytics/track',
    headers=headers,
    json={
        'event_type': 'page_view',
        'page_url': 'https://example.com'
    }
)

# Get data
data_response = requests.get(
    'https://your-domain.com/api/analytics/data',
    headers=headers,
    params={
        'start_date': '2025-01-01',
        'end_date': '2025-01-31'
    }
)
```

## 🔐 Security Considerations

### API Key Security
- Store API keys securely (environment variables)
- Use different keys for different environments
- Rotate keys regularly
- Monitor key usage

### Data Privacy
- IP address anonymization options
- GDPR compliance features
- Data retention configuration
- User consent tracking

### Request Security
- HTTPS required for all requests
- CORS configuration for web requests
- Request signature validation (optional)
- Domain whitelisting

## 📞 Support & Resources

### API Support
- **Documentation**: Complete API reference
- **Postman Collection**: Ready-to-use API collection
- **OpenAPI Spec**: Machine-readable API specification
- **Code Examples**: Implementation samples

### Rate Limit Increases
Contact support for higher rate limits:
- Business use cases
- High-traffic websites  
- Enterprise implementations
- Custom requirements

---

For additional API details and examples, refer to the [main documentation](../README.md) or specific integration guides. 