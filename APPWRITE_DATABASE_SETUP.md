# AppWrite Database Setup on Hostinger VPS

This guide will help you add AppWrite database to your existing Zero Point Labs website deployment on Hostinger VPS.

## 📋 Prerequisites

- ✅ Existing Zero Point Labs website deployed on Hostinger VPS
- ✅ SSH access to your Hostinger VPS
- ✅ Domain name configured and working
- ✅ Docker and Docker Compose installed
- ✅ Basic firewall setup completed

## 🗄️ What is AppWrite?

AppWrite is an open-source Backend-as-a-Service (BaaS) that provides:
- Database with real-time capabilities
- User authentication
- File storage
- Functions (serverless)
- REST and GraphQL APIs

## 🚀 Phase 1: Update Docker Compose Configuration

### Step 1: Connect to Your VPS

```bash
ssh root@YOUR_VPS_IP_ADDRESS
cd /var/www/zeropoint-labs
```

### Step 2: Backup Current Configuration

```bash
# Create backup of current setup
cp docker-compose.yml docker-compose.yml.backup
cp nginx.conf nginx.conf.backup
```

### Step 3: Update Docker Compose with AppWrite

Replace your `docker-compose.yml` with the following configuration:

```yaml
version: '3.8'

services:
  # Your existing Next.js application
  zeropoint-website:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: zeropoint-labs-website
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_TELEMETRY_DISABLED=1
      # AppWrite configuration
      - NEXT_PUBLIC_APPWRITE_ENDPOINT=https://your-domain.com/v1
      - NEXT_PUBLIC_APPWRITE_PROJECT_ID=zeropoint-labs
    networks:
      - zeropoint-network
    depends_on:
      - appwrite
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # AppWrite services
  appwrite:
    image: appwrite/appwrite:1.5.7
    container_name: appwrite
    restart: unless-stopped
    networks:
      - zeropoint-network
    volumes:
      - appwrite-uploads:/storage/uploads:rw
      - appwrite-cache:/storage/cache:rw
      - appwrite-config:/storage/config:rw
      - appwrite-certificates:/storage/certificates:rw
      - appwrite-functions:/storage/functions:rw
    depends_on:
      - mariadb
      - redis
    environment:
      - _APP_ENV=production
      - _APP_WORKER_PER_CORE=6
      - _APP_LOCALE=en
      - _APP_CONSOLE_WHITELIST_ROOT=enabled
      - _APP_CONSOLE_WHITELIST_EMAILS=
      - _APP_CONSOLE_WHITELIST_IPS=
      - _APP_SYSTEM_EMAIL_NAME=Zero Point Labs
      - _APP_SYSTEM_EMAIL_ADDRESS=admin@your-domain.com
      - _APP_SYSTEM_SECURITY_EMAIL_ADDRESS=security@your-domain.com
      - _APP_SYSTEM_RESPONSE_FORMAT=
      - _APP_OPTIONS_ABUSE=enabled
      - _APP_OPTIONS_ROUTER_PROTECTION=disabled
      - _APP_OPENSSL_KEY_V1=your-secret-key
      - _APP_DOMAIN=your-domain.com
      - _APP_DOMAIN_TARGET=your-domain.com
      - _APP_REDIS_HOST=redis
      - _APP_REDIS_PORT=6379
      - _APP_REDIS_USER=
      - _APP_REDIS_PASS=
      - _APP_DB_HOST=mariadb
      - _APP_DB_PORT=3306
      - _APP_DB_SCHEMA=appwrite
      - _APP_DB_USER=appwrite
      - _APP_DB_PASS=your-db-password
      - _APP_SMTP_HOST=
      - _APP_SMTP_PORT=
      - _APP_SMTP_SECURE=
      - _APP_SMTP_USERNAME=
      - _APP_SMTP_PASSWORD=
      - _APP_USAGE_STATS=enabled
      - _APP_INFLUXDB_HOST=
      - _APP_INFLUXDB_PORT=
      - _APP_STORAGE_LIMIT=30000000
      - _APP_STORAGE_PREVIEW_LIMIT=20000000
      - _APP_STORAGE_ANTIVIRUS=disabled
      - _APP_STORAGE_ANTIVIRUS_HOST=clamav
      - _APP_STORAGE_ANTIVIRUS_PORT=3310
      - _APP_STORAGE_DEVICE=local
      - _APP_STORAGE_S3_ACCESS_KEY=
      - _APP_STORAGE_S3_SECRET=
      - _APP_STORAGE_S3_REGION=
      - _APP_STORAGE_S3_BUCKET=
      - _APP_STORAGE_DO_SPACES_ACCESS_KEY=
      - _APP_STORAGE_DO_SPACES_SECRET=
      - _APP_STORAGE_DO_SPACES_REGION=
      - _APP_STORAGE_DO_SPACES_BUCKET=
      - _APP_STORAGE_BACKBLAZE_ACCESS_KEY=
      - _APP_STORAGE_BACKBLAZE_SECRET=
      - _APP_STORAGE_BACKBLAZE_REGION=
      - _APP_STORAGE_BACKBLAZE_BUCKET=
      - _APP_STORAGE_LINODE_ACCESS_KEY=
      - _APP_STORAGE_LINODE_SECRET=
      - _APP_STORAGE_LINODE_REGION=
      - _APP_STORAGE_LINODE_BUCKET=
      - _APP_STORAGE_WASABI_ACCESS_KEY=
      - _APP_STORAGE_WASABI_SECRET=
      - _APP_STORAGE_WASABI_REGION=
      - _APP_STORAGE_WASABI_BUCKET=
      - _APP_FUNCTIONS_SIZE_LIMIT=30000000
      - _APP_FUNCTIONS_TIMEOUT=900
      - _APP_FUNCTIONS_BUILD_TIMEOUT=900
      - _APP_FUNCTIONS_CONTAINERS=10
      - _APP_FUNCTIONS_CPUS=0
      - _APP_FUNCTIONS_MEMORY=0
      - _APP_FUNCTIONS_MEMORY_SWAP=0
      - _APP_FUNCTIONS_RUNTIMES=node-16.0,php-8.0,python-3.9,ruby-3.0

  # AppWrite MariaDB Database
  mariadb:
    image: mariadb:10.7
    container_name: appwrite-mariadb
    restart: unless-stopped
    networks:
      - zeropoint-network
    volumes:
      - appwrite-mariadb:/var/lib/mysql:rw
    environment:
      - MYSQL_ROOT_PASSWORD=your-root-password
      - MYSQL_DATABASE=appwrite
      - MYSQL_USER=appwrite
      - MYSQL_PASSWORD=your-db-password
    command: 'mysqld --innodb-flush-method=fsync'

  # AppWrite Redis Cache
  redis:
    image: redis:7.0-alpine
    container_name: appwrite-redis
    restart: unless-stopped
    networks:
      - zeropoint-network
    volumes:
      - appwrite-redis:/data:rw

  # Your existing Nginx
  nginx:
    image: nginx:alpine
    container_name: zeropoint-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - zeropoint-website
      - appwrite
    networks:
      - zeropoint-network

volumes:
  appwrite-mariadb:
  appwrite-redis:
  appwrite-uploads:
  appwrite-cache:
  appwrite-config:
  appwrite-certificates:
  appwrite-functions:

networks:
  zeropoint-network:
    driver: bridge
```

## 🔧 Phase 2: Update Nginx Configuration

### Step 1: Update Nginx Config

Update your `nginx.conf` to proxy AppWrite requests:

```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;

    # Upstream for Next.js app
    upstream nextjs_upstream {
        server zeropoint-website:3000;
    }

    # Upstream for AppWrite
    upstream appwrite_upstream {
        server appwrite:80;
    }

    # HTTP to HTTPS redirect
    server {
        listen 80;
        server_name your-domain.com www.your-domain.com;
        return 301 https://$server_name$request_uri;
    }

    # HTTPS server
    server {
        listen 443 ssl http2;
        server_name your-domain.com www.your-domain.com;

        # SSL configuration
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

        # AppWrite API routes
        location /v1 {
            proxy_pass http://appwrite_upstream;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
            
            # Rate limiting for API
            limit_req zone=api burst=20 nodelay;
            
            # Increase timeouts for AppWrite
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        # AppWrite Console (optional, for admin access)
        location /console {
            proxy_pass http://appwrite_upstream;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Your Next.js application (default)
        location / {
            proxy_pass http://nextjs_upstream;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
```

## 🔐 Phase 3: Generate Secure Passwords and Keys

### Step 1: Generate Required Secrets

```bash
# Generate secure passwords
DB_PASSWORD=$(openssl rand -base64 32)   \\ I3iOzHtht+RATt368NKpS2hY1s67xLZlLU7iEjn3X5E=
ROOT_PASSWORD=$(openssl rand -base64 32)  \\  YYRsy2xNbuuJ1VzhzUTHIPylnNfnsfqpfUT1HCXExUQ=
APPWRITE_KEY=$(openssl rand -base64 64)    # Example: your_generated_appwrite_api_key_here

echo "Database Password: $DB_PASSWORD"
echo "Root Password: $ROOT_PASSWORD"
echo "AppWrite Key: $APPWRITE_KEY"

# Save these to a secure file
cat > .env.secrets << EOF
DB_PASSWORD=$DB_PASSWORD
ROOT_PASSWORD=$ROOT_PASSWORD
APPWRITE_KEY=$APPWRITE_KEY
EOF

# Secure the secrets file
chmod 600 .env.secrets
```

### Step 2: Update Docker Compose with Generated Secrets

Edit your `docker-compose.yml` and replace:
- `your-db-password` with your generated `DB_PASSWORD`
- `your-root-password` with your generated `ROOT_PASSWORD`
- `your-secret-key` with your generated `APPWRITE_KEY`
- `your-domain.com` with your actual domain

```bash
# Use sed to replace placeholders (adjust as needed)
sed -i "s/your-db-password/$DB_PASSWORD/g" docker-compose.yml
sed -i "s/your-root-password/$ROOT_PASSWORD/g" docker-compose.yml
sed -i "s/your-secret-key/$APPWRITE_KEY/g" docker-compose.yml
sed -i "s/your-domain.com/YOUR_ACTUAL_DOMAIN/g" docker-compose.yml
```

## 🚀 Phase 4: Deploy the Updated Stack

### Step 1: Update Firewall for AppWrite

```bash
# Allow additional ports if needed (optional, since we're using nginx proxy)
ufw allow 6379/tcp  # Redis (internal only)
ufw allow 3306/tcp  # MariaDB (internal only)
```

### Step 2: Deploy the Stack

```bash
# Stop current containers
docker-compose down

# Pull new images
docker-compose pull

# Build and start all services
docker-compose up -d --build

# Check if all services are running
docker-compose ps
```

### Step 3: Monitor Logs

```bash
# Check all logs
docker-compose logs -f

# Check specific service logs
docker-compose logs -f appwrite
docker-compose logs -f mariadb
docker-compose logs -f redis
```

## 🔧 Phase 5: AppWrite Initial Setup

### Step 1: Access AppWrite Console

1. Open your browser and go to: `https://your-domain.com/console`
2. You should see the AppWrite setup screen

### Step 2: Create Admin Account

1. Fill in the admin account details:
   - **Email**: your-admin@your-domain.com
   - **Password**: Use a strong password
   - **Name**: Your Name

### Step 3: Create Your First Project

1. Click "Create Project"
2. **Project Name**: Zero Point Labs
3. **Project ID**: `zeropoint-labs` (must match your docker-compose environment)

### Step 4: Configure Project Settings

1. Go to **Settings** → **General**
2. Add your domain to **Platforms**:
   - **Type**: Web
   - **Name**: Zero Point Labs Website
   - **Hostname**: your-domain.com

## 💻 Phase 6: Integrate AppWrite in Your Next.js App

### Step 1: Install AppWrite SDK

```bash
# On your local development machine
cd /Users/akyriakouu/Documents/Zero\ Point/Projects/zeropoint-labs-hostinger
npm install appwrite
```

### Step 2: Create AppWrite Configuration

Create `src/lib/appwrite.ts`:

```typescript
import { Client, Account, Databases, Storage, Functions } from 'appwrite';

const client = new Client();

client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://your-domain.com/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'zeropoint-labs');

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

export default client;
```

### Step 3: Create Database Collections

In AppWrite Console:

1. Go to **Databases** → **Create Database**
2. **Database ID**: `main`
3. **Name**: Main Database

Create collections as needed, for example:
- **Users**: User profiles
- **Projects**: Project information
- **Blog Posts**: Blog content

### Step 4: Example Usage in Components

```typescript
// src/hooks/useAppwrite.ts
import { useState, useEffect } from 'react';
import { databases } from '@/lib/appwrite';

export const useAppwriteData = (databaseId: string, collectionId: string) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await databases.listDocuments(databaseId, collectionId);
                setData(response.documents);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [databaseId, collectionId]);

    return { data, loading, error };
};
```

## 🔒 Phase 7: Security and Backup

### Step 1: Set Up Database Backups

```bash
# Create backup script
cat > /var/www/zeropoint-labs/backup-db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/appwrite"
DATE=$(date +%Y%m%d_%H%M%S)
DB_CONTAINER="appwrite-mariadb"

mkdir -p $BACKUP_DIR

# Backup database
docker exec $DB_CONTAINER mysqldump -u appwrite -p$DB_PASSWORD appwrite > $BACKUP_DIR/appwrite_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "appwrite_*.sql" -mtime +7 -delete

echo "Backup completed: appwrite_$DATE.sql"
EOF

chmod +x backup-db.sh

# Set up daily backup cron job
(crontab -l 2>/dev/null; echo "0 2 * * * /var/www/zeropoint-labs/backup-db.sh") | crontab -
```

### Step 2: Monitor Resources

```bash
# Check resource usage
docker stats

# Check disk usage
df -h

# Check AppWrite specific volumes
docker volume ls | grep appwrite
```

## 🚨 Troubleshooting

### Common Issues:

1. **AppWrite not accessible**: Check nginx configuration and ensure proper proxying
2. **Database connection issues**: Verify MariaDB is running and credentials are correct
3. **SSL issues**: Ensure certificates are properly configured
4. **Memory issues**: AppWrite requires at least 2GB RAM

### Useful Commands:

```bash
# Restart specific service
docker-compose restart appwrite

# View AppWrite logs
docker-compose logs -f appwrite

# Access MariaDB directly
docker exec -it appwrite-mariadb mysql -u appwrite -p

# Check nginx configuration
docker exec zeropoint-nginx nginx -t

# Reload nginx without restart
docker exec zeropoint-nginx nginx -s reload
```

## 📝 Environment Variables Summary

Add these to your Next.js environment:

```bash
# .env.local (for local development)
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://your-domain.com/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=zeropoint-labs

# Production (already in docker-compose.yml)
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://your-domain.com/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=zeropoint-labs
```

## 🎉 Conclusion

You now have:
- ✅ AppWrite database running on your Hostinger VPS
- ✅ Integrated with your existing Next.js application
- ✅ Secure nginx proxy configuration
- ✅ Automated backups
- ✅ Monitoring setup

Your AppWrite console is available at: `https://your-domain.com/console`
Your API endpoint is: `https://your-domain.com/v1`

Remember to:
- Replace all placeholder values with your actual domain and secrets
- Test the setup thoroughly
- Monitor resource usage
- Keep regular backups
- Update AppWrite periodically for security patches 