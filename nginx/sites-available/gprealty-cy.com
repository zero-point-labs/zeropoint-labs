# HTTP redirect to HTTPS
server {
    listen 80;
    server_name gprealty-cy.com www.gprealty-cy.com;
    server_tokens off;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name gprealty-cy.com www.gprealty-cy.com;
    server_tokens off;

    # SSL configuration
    ssl_certificate /etc/letsencrypt/live/gprealty-cy.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/gprealty-cy.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=63072000" always;

    # Proxy to Template Next.js app (using actual container name)
    location / {
        proxy_pass http://gprealty-cyprus-app:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_buffering off;
    }

    # Cache static assets
    location /_next/static/ {
        proxy_pass http://gprealty-cyprus-app:3001;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2)$ {
        proxy_pass http://gprealty-cyprus-app:3001;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
} 