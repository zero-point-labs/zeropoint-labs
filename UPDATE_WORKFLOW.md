# Quick Update Workflow for Zero Point Labs Website

This guide shows you the simple process to make changes to your website and deploy them to your live VPS.

## 🚀 Quick Update Process (3 Steps)

### Step 1: Make Changes Locally (On Your Mac)

```bash
# Navigate to your project
cd "/Users/akyriakouu/Documents/Zero Point/Projects/zeropoint-labs-hostinger"

# Make your edits to any files (components, styles, content, etc.)
# Test locally if needed:
npm run dev  # Optional: test at http://localhost:3000
```

### Step 2: Push Changes to Git (On Your Mac)

```bash
# Add all changes
git add .

# Commit with a descriptive message
git commit -m "Update: describe what you changed"

# Push to repository
git push
```

### Step 3: Deploy to VPS (On Your VPS)

```bash
# SSH into your VPS
ssh root@YOUR_VPS_IP

# Navigate to project directory
cd /var/www/zeropoint-labs/zeropoint-hostinger

# Pull latest changes
git pull

# Rebuild and restart containers
./deploy.sh
```

**That's it! Your changes are now live! 🎉**

---

## 📝 Detailed Workflow Examples

### Example 1: Update Text Content

**On Your Mac:**
```bash
# Edit a component file
nano src/components/sections/HeroSection.tsx

# Change some text, save the file

# Commit and push
git add .
git commit -m "Update hero section text"
git push
```

**On Your VPS:**
```bash
cd /var/www/zeropoint-labs/zeropoint-hostinger
git pull
./deploy.sh
```

### Example 2: Add New Images

**On Your Mac:**
```bash
# Add new images to public/ folder
cp new-image.jpg public/

# Update component to use new image
# Edit the relevant component file

# Commit and push
git add .
git commit -m "Add new hero image"
git push
```

**On Your VPS:**
```bash
cd /var/www/zeropoint-labs/zeropoint-hostinger
git pull
./deploy.sh
```

### Example 3: Update Styling

**On Your Mac:**
```bash
# Edit CSS or component styles
nano src/app/globals.css
# or edit any component file

# Test locally (optional)
npm run dev

# Commit and push
git add .
git commit -m "Update button styles"
git push
```

**On Your VPS:**
```bash
cd /var/www/zeropoint-labs/zeropoint-hostinger
git pull
./deploy.sh
```

---

## ⚡ Super Quick Commands

### For Your Mac (Local Development)
```bash
# Quick commit and push (after making changes)
git add . && git commit -m "Quick update" && git push
```

### For Your VPS (Deployment)
```bash
# Quick pull and deploy
cd /var/www/zeropoint-labs/zeropoint-hostinger && git pull && ./deploy.sh
```

---

## 🔍 Verification Steps

After deployment, verify your changes:

1. **Check containers are running:**
   ```bash
   docker ps
   ```

2. **Check website is accessible:**
   ```bash
   curl -I https://zeropoint-labs.com
   ```

3. **Visit your website:**
   - Open browser and go to https://zeropoint-labs.com
   - Check that your changes are visible

---

## 🚨 Troubleshooting

### If Git Pull Fails
```bash
# Check Git status
git status

# If there are conflicts, reset to remote version
git reset --hard origin/master
git pull
```

### If Deploy Script Fails
```bash
# Check what's wrong
docker-compose logs

# Try manual rebuild
docker-compose down
docker-compose up --build -d
```

### If Website Doesn't Update
```bash
# Force rebuild without cache
docker-compose build --no-cache
docker-compose up -d
```

---

## 📊 Deployment Timeline

| Step | Time | What Happens |
|------|------|--------------|
| Local Changes | 1-5 min | Edit files on your Mac |
| Git Push | 10 sec | Upload changes to repository |
| VPS Pull | 5 sec | Download changes to VPS |
| Docker Build | 1-3 min | Rebuild containers with changes |
| **Total** | **2-8 min** | **Changes are live!** |

---

## 🎯 Best Practices

### 1. **Test Locally First (Optional but Recommended)**
```bash
# Before pushing, test your changes
npm run dev
# Visit http://localhost:3000 to verify changes
```

### 2. **Use Descriptive Commit Messages**
```bash
# Good commit messages:
git commit -m "Update pricing section with new plans"
git commit -m "Fix mobile responsive issues in hero section"
git commit -m "Add new client testimonials"

# Avoid vague messages:
git commit -m "updates"
git commit -m "fix stuff"
```

### 3. **Check Status Before Committing**
```bash
# See what files you've changed
git status

# See exactly what changed
git diff
```

### 4. **Backup Important Changes**
```bash
# Create a backup branch before major changes
git checkout -b backup-before-major-update
git checkout master
# Make your changes...
```

---

## 🔄 Advanced: Automated Deployment (Optional)

You can set up automatic deployment so changes deploy automatically when you push to Git:

### GitHub Actions (if using GitHub)
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to VPS
on:
  push:
    branches: [ master ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Deploy to VPS
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.VPS_IP }}
        username: root
        key: ${{ secrets.VPS_SSH_KEY }}
        script: |
          cd /var/www/zeropoint-labs/zeropoint-hostinger
          git pull
          ./deploy.sh
```

### Webhook (Alternative)
Set up a webhook that triggers deployment when you push to your repository.

---

## 📱 Mobile Workflow

You can even update your website from your phone using GitHub's mobile app:

1. **GitHub Mobile App** - Edit files directly
2. **Commit changes** - Add commit message
3. **SSH app** - Connect to VPS and run deployment

---

## 🎉 Summary

**The workflow is simple:**
1. **Edit** files on your Mac
2. **Push** to Git (`git add . && git commit -m "message" && git push`)
3. **Deploy** on VPS (`git pull && ./deploy.sh`)

Your website will be updated and live within 2-8 minutes! 🚀

This workflow scales perfectly - whether you're making small text changes or major feature updates, the process remains the same.
