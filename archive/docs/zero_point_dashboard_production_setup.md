# 🚀 ZeroPoint Labs Dashboard Production Setup (Detailed Guide)

This Markdown file walks through every step—from environment prep to creating Appwrite collections with attributes to wiring up your Next.js UI—so that your *ZeroPoint Labs* dashboard becomes fully functional in production.

---

## 📋 Prerequisites

1. **Next.js Codebase**

   - Hosted on VPS (e.g., `dashboard.zeropointlabs.dev`).
   - Mock UI implemented with placeholder data.
   - Auth flow (Sign Up / Login) wired to Appwrite’s Account.

2. **Appwrite Cloud Pro**

   - Project created; you have `PROJECT_ID`, `API_KEY`, and endpoint URL (`https://cloud.appwrite.io/v1`).

3. **Environment Variables**

   - In your Next.js project, create a `.env.local` with:
     ```dotenv
     NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
     NEXT_PUBLIC_APPWRITE_PROJECT=<YOUR_PROJECT_ID>
     APPWRITE_API_KEY=<YOUR_API_KEY>
     ```
   - Install dependencies:
     ```bash
     npm install appwrite
     ```

4. **CLI Tools (Optional but recommended)**

   - [Appwrite CLI](https://appwrite.io/docs/cli) for scripted collection creation.
   - `npx create-next-app`, `pm2` or `systemd` on your VPS for deployment.

---

## 🗄️ Step 1: Create Appwrite Collections & Attributes

Use the Appwrite Console or CLI to define the following **collections** and **attributes** exactly as specified.

### 1. `clients`

| Key             | Type     | Size | Required | Description                   |
| --------------- | -------- | ---- | -------- | ----------------------------- |
| `name`          | String   | 128  | ✅        | Client’s full name            |
| `email`         | Email    | 128  | ✅        | Unique login email            |
| `password_hash` | String   | 256  | ✅        | Hashed password               |
| `website_id`    | String   | 36   | ✅        | Foreign key to `websites.$id` |
| `created_at`    | Datetime | —    | ✅        | Auto-generated timestamp      |

### 2. `websites`

| Key          | Type     | Size | Required | Description                 |
| ------------ | -------- | ---- | -------- | --------------------------- |
| `domain`     | String   | 128  | ✅        | e.g., `clientsite.com`      |
| `client_id`  | String   | 36   | ✅        | FK to `clients.$id`         |
| `features`   | JSON     | 1024 | ❌        | E.g., `{ssl:true,seo:true}` |
| `created_at` | Datetime | —    | ✅        | Timestamp                   |

### 3. `pages`

| Key          | Type     | Size | Required | Description                   |
| ------------ | -------- | ---- | -------- | ----------------------------- |
| `website_id` | String   | 36   | ✅        | FK to `websites.$id`          |
| `title`      | String   | 128  | ✅        | Page title (e.g., "Homepage") |
| `path`       | String   | 128  | ✅        | Route path (e.g., `/about`)   |
| `status`     | String   | 32   | ✅        | `published` / `draft`         |
| `views`      | Integer  | —    | ❌        | Page view count               |
| `updated_at` | Datetime | —    | ✅        | Timestamp                     |

### 4. `media_library`

| Key          | Type     | Size | Required | Description               |
| ------------ | -------- | ---- | -------- | ------------------------- |
| `website_id` | String   | 36   | ✅        | FK to `websites.$id`      |
| `file_name`  | String   | 256  | ✅        | Original filename         |
| `url`        | String   | 1024 | ✅        | Public file URL           |
| `type`       | String   | 64   | ✅        | `image` / `video` / `doc` |
| `size`       | Integer  | —    | ✅        | File size in bytes        |
| `created_at` | Datetime | —    | ✅        | Timestamp                 |

### 5. `forms`

| Key          | Type     | Size | Required | Description                      |
| ------------ | -------- | ---- | -------- | -------------------------------- |
| `website_id` | String   | 36   | ✅        | FK to `websites.$id`             |
| `name`       | String   | 128  | ✅        | Form name (e.g., "Contact Form") |
| `fields`     | JSON     | 8192 | ✅        | Array of field definitions       |
| `created_at` | Datetime | —    | ✅        | Timestamp                        |

### 6. `form_submissions`

| Key            | Type     | Size  | Required | Description        |
| -------------- | -------- | ----- | -------- | ------------------ |
| `form_id`      | String   | 36    | ✅        | FK to `forms.$id`  |
| `submitted_at` | Datetime | —     | ✅        | Timestamp          |
| `data`         | JSON     | 16384 | ✅        | Submission payload |
| `ip_address`   | String   | 64    | ❌        | Client IP          |
| `utm_params`   | JSON     | 2048  | ❌        | Optional UTM tags  |

### 7. `analytics`

| Key                | Type     | Size | Required | Description                 |
| ------------------ | -------- | ---- | -------- | --------------------------- |
| `website_id`       | String   | 36   | ✅        | FK to `websites.$id`        |
| `timestamp`        | Datetime | —    | ✅        | When the event occurred     |
| `page_url`         | String   | 256  | ✅        | Path or full URL            |
| `session_id`       | String   | 64   | ✅        | Unique session UUID         |
| `referrer`         | String   | 256  | ❌        | Document referrer           |
| `user_agent`       | String   | 256  | ❌        | Browser UA string           |
| `screen_width`     | Integer  | —    | ❌        | px                          |
| `timezone`         | String   | 64   | ❌        | e.g., `Europe/Nicosia`      |
| `bounce`           | Boolean  | —    | ❌        | True if single-page session |
| `session_duration` | Integer  | —    | ❌        | Seconds                     |

### 8. CRM: `crm_leads`, `crm_stages`, `crm_notes`

#### `crm_stages`

| Key          | Type    | Size | Required | Description                    |
| ------------ | ------- | ---- | -------- | ------------------------------ |
| `website_id` | String  | 36   | ✅        | FK                             |
| `name`       | String  | 64   | ✅        | Stage name (e.g., "Qualified") |
| `order`      | Integer | —    | ✅        | Sort order                     |

#### `crm_leads`

| Key                  | Type     | Size | Required | Description                  |
| -------------------- | -------- | ---- | -------- | ---------------------------- |
| `website_id`         | String   | 36   | ✅        | FK                           |
| `name`               | String   | 128  | ✅        |                              |
| `email`              | Email    | 128  | ❌        |                              |
| `phone`              | String   | 32   | ❌        |                              |
| `stage_id`           | String   | 36   | ❌        | FK to `crm_stages.$id`       |
| `source`             | String   | 32   | ❌        | `form` / `manual` / `import` |
| `form_submission_id` | String   | 36   | ❌        | FK to `form_submissions.$id` |
| `custom_fields`      | JSON     | 4096 | ❌        | Additional dynamic data      |
| `created_at`         | Datetime | —    | ✅        |                              |

#### `crm_notes`

| Key          | Type     | Size | Required | Description           |
| ------------ | -------- | ---- | -------- | --------------------- |
| `lead_id`    | String   | 36   | ✅        | FK to `crm_leads.$id` |
| `author`     | String   | 64   | ❌        | User who wrote it     |
| `content`    | Text     | 8192 | ✅        | Note text             |
| `created_at` | Datetime | —    | ✅        | Timestamp             |

### 9. `email_campaigns` (Optional metadata for third-party)

| Key              | Type     | Size | Required | Description                |
| ---------------- | -------- | ---- | -------- | -------------------------- |
| `website_id`     | String   | 36   | ✅        | FK                         |
| `campaign_name`  | String   | 128  | ✅        | Name                       |
| `third_party_id` | String   | 128  | ✅        | Mailchimp/Klaviyo ID       |
| `status`         | String   | 32   | ✅        | `draft`/`scheduled`/`sent` |
| `sent_at`        | Datetime | —    | ❌        | When sent                  |

### 10. `activity_log`

| Key          | Type     | Size | Required | Description                       |
| ------------ | -------- | ---- | -------- | --------------------------------- |
| `website_id` | String   | 36   | ✅        | FK                                |
| `type`       | String   | 64   | ✅        | e.g., `form_submission`, `deploy` |
| `message`    | String   | 512  | ✅        | Human-readable description        |
| `timestamp`  | Datetime | —    | ✅        | When occurred                     |

---

## 🔗 Step 2: Configure SDK in Next.js

```ts
// lib/appwrite.ts
import { Client, Account, Databases } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

export const account = new Account(client);
export const databases = new Databases(client);
```

Ensure `NEXT_PUBLIC_APPWRITE_ENDPOINT` and `NEXT_PUBLIC_APPWRITE_PROJECT` are set.

---

## 🔨 Step 3: Implement API Routes & Data Fetching

### 3.1. **Analytics Endpoint**

```ts
// pages/api/track.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { databases } from '../../lib/appwrite';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { websiteId, pageUrl, sessionId, referrer, userAgent, screenWidth, timezone } = req.body;
  const promise = databases.createDocument(
    'default', // databaseId
    'analytics', // collectionId
    sessionId + Date.now(), // unique ID
    { website_id: websiteId, timestamp: new Date().toISOString(), page_url: pageUrl, session_id: sessionId, referrer, user_agent: userAgent, screen_width: screenWidth, timezone }
  );
  const response = await promise;
  res.status(201).json(response);
}
```

### 3.2. **Form Submission Endpoint**

```ts
// pages/api/forms/submit.ts
import { databases } from '../../../lib/appwrite';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { formId, data, utmParams, ip } = req.body;
  const doc = await databases.createDocument('default', 'form_submissions', `${formId}_${Date.now()}`, { form_id: formId, submitted_at: new Date().toISOString(), data, utm_params: utmParams, ip_address: ip });
  res.status(201).json(doc);
}
```

### 3.3. **Fetch Dashboard Data**

Use Next.js `getServerSideProps` or React hooks to query each collection:

```ts
// Example: Fetch pages for Website tab
const pages = await databases.listDocuments('default', 'pages', [
  Query.equal('website_id', [websiteId])
]);
```

Repeat for `media_library`, `forms`, `analytics`, `crm_*`, `activity_log`.

---

## 🧪 Step 4: Testing & Validation

1. **Auth**: Login/signup, verify JWT token is issued.
2. **Forms**: Submit dummy forms, check `form_submissions` in Appwrite.
3. **Analytics**: Navigate pages, check records in `analytics`.
4. **CRM**: Create stages, leads, notes; verify UI list and CRUD.
5. **Pages/Media**: Create pages, upload media, ensure UI displays them.
6. **Activity Log**: Trigger events (form submit, deploy), confirm logs.

Use Postman or Appwrite Console to inspect collections.

---

## 🚀 Step 5: Deploy & Go Live

1. **Push code** to your VPS (Git + PM2/systemd).
2. **Restart** Next.js server.
3. **DNS**: Ensure `dashboard.zeropointlabs.dev` points to your VPS.
4. **SSL**: Configure Let's Encrypt or your cert for HTTPS.
5. **Env**: Confirm `.env` variables on server.
6. **Cron jobs / Functions**: Schedule cleanup jobs (e.g., purge old logs).

---

## 📝 Conclusion

Your ZeroPoint Labs dashboard is now backed by real Appwrite collections, with all UI screens connected to live data. You’ve covered:

- Collection schemas with exact attributes and sizes
- Next.js SDK configuration
- API routes for analytics and forms
- Data fetching for all dashboard modules
- Testing and deployment

Congratulations—your product is now truly in production!

