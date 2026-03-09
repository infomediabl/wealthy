# Advantis Quiz — README & Deployment

## What This Is
A multi-step investment profile quiz for Advantis Broker.
Users complete a 12-step quiz, receive an investment risk profile, and are captured as leads in Airtable.

**Live URL:** https://wealthy.advantiscapital.com

---

## Quick Start (Local Dev)

```bash
# 1. Install dependencies
npm install

# 2. Copy env template and fill in your keys
cp .env.example .env
# Edit .env with your Airtable and Postmark credentials

# 3. Run
node server.js

# App runs on http://localhost:3000
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in:

```
PORT=3000
AIRTABLE_API_KEY=          # Your Airtable Personal Access Token
AIRTABLE_BASE_ID=          # Your base ID (starts with "app...")
AIRTABLE_TABLE_NAME=Leads  # Must match your table name exactly
POSTMARK_API_KEY=          # Your Postmark Server API Token
POSTMARK_FROM_EMAIL=       # Verified sender email in Postmark
```

---

## DigitalOcean Deployment (Droplet)

```bash
# On a fresh Ubuntu 22.04 droplet:

# 1. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Install PM2 (process manager)
sudo npm install -g pm2

# 3. Clone / upload your project
# (use git clone, scp, or rsync)

# 4. Install dependencies
cd advantis-quiz
npm install --production

# 5. Create .env file with your credentials
nano .env

# 6. Start with PM2
pm2 start server.js --name advantis-quiz
pm2 startup
pm2 save

# 7. Install nginx for reverse proxy
sudo apt install nginx
```

### Nginx config for wealthy.advantiscapital.com
```nginx
server {
    listen 80;
    server_name wealthy.advantiscapital.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site and get SSL
sudo ln -s /etc/nginx/sites-available/advantis-quiz /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d wealthy.advantiscapital.com
```

---

## DNS Setup
Point an A record for `wealthy.advantiscapital.com` to your Droplet's IP address.
SSL cert will be issued automatically by Certbot.

---

## Airtable Setup
See AIRTABLE.md for the full field list.
Create the table manually in your existing Airtable base before deploying.

---

## Postmark Setup
See POSTMARK.md for the email template.
Ensure your sender domain is verified in Postmark before deploying.
