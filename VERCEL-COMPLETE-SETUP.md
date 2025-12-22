# Complete Vercel Environment Setup Guide

## 🚨 **CRITICAL: All Environment Variables Must Be Set**

Your website won't work on Vercel until you add ALL these environment variables.

---

## 📋 **Required Environment Variables**

Go to: **https://vercel.com/yagnarashagan6/rhynox-technologies/settings/environment-variables**

Add these **6 variables**:

### 1. MongoDB Configuration

| Variable | Value | Where to Get It |
|----------|-------|-----------------|
| `MONGODB_URI` | `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority` | MongoDB Atlas Dashboard |

**How to Get MongoDB URI:**
1. Go to https://cloud.mongodb.com/
2. Click on your cluster → **Connect**
3. Choose **"Connect your application"**
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Replace `<database>` with your database name (e.g., `rhynox`)

**IMPORTANT**: Make sure to whitelist all IPs in MongoDB Atlas:
- Go to **Network Access** in MongoDB Atlas
- Click **"Add IP Address"**
- Click **"Allow Access from Anywhere"** (0.0.0.0/0)
- Click **Confirm**

---

### 2. Email Configuration

| Variable | Value | Where to Get It |
|----------|-------|-----------------|
| `EMAIL_USER` | `rhynoxtechnologies@gmail.com` | Your Gmail address |
| `EMAIL_APP_PASSWORD` | `abcdefghijklmnop` (16 chars, no spaces) | Google Account → Security → App Passwords |

**How to Get Gmail App Password:**
1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification** (if not already)
3. Search for **"App passwords"**
4. Click **App passwords**
5. Select **Mail** and **Other (Custom name)**
6. Type "Vercel Rhynox"
7. Click **Generate**
8. Copy the 16-character password
9. **Remove all spaces** before adding to Vercel

---

### 3. Cloudinary Configuration (For Image Uploads)

| Variable | Value | Where to Get It |
|----------|-------|-----------------|
| `CLOUDINARY_CLOUD_NAME` | Your cloud name | Cloudinary Dashboard |
| `CLOUDINARY_API_KEY` | Your API key | Cloudinary Dashboard |
| `CLOUDINARY_API_SECRET` | Your API secret | Cloudinary Dashboard |

**How to Get Cloudinary Credentials:**
1. Go to https://cloudinary.com/
2. Sign up or log in
3. Go to **Dashboard**
4. You'll see:
   - **Cloud Name**
   - **API Key**
   - **API Secret** (click "Reveal" to see it)
5. Copy each value to Vercel

**OR if you don't want to use Cloudinary yet:**
- You can skip this for now
- But project image uploads won't work on Vercel
- They'll work fine on localhost

---

## 🔧 **How to Add Variables to Vercel**

### Step 1: Go to Settings
https://vercel.com/yagnarashagan6/rhynox-technologies/settings/environment-variables

### Step 2: Add Each Variable
For each variable above:
1. Click **"Add New"**
2. Enter the **Name** (e.g., `MONGODB_URI`)
3. Enter the **Value** (your actual connection string)
4. Select **All Environments** (Production, Preview, Development)
5. Click **Save**

### Step 3: Redeploy
After adding ALL variables:
1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click the **"..."** menu (three dots)
4. Click **"Redeploy"**
5. Wait for deployment to complete

---

## ✅ **Verification Checklist**

Before redeploying, make sure:

- [ ] `MONGODB_URI` is added with correct connection string
- [ ] MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- [ ] `EMAIL_USER` is your Gmail address
- [ ] `EMAIL_APP_PASSWORD` is 16 characters with NO spaces
- [ ] 2-Step Verification is enabled on your Gmail
- [ ] (Optional) Cloudinary credentials are added if you want image uploads
- [ ] All variables are set for **All Environments**

---

## 🐛 **Troubleshooting**

### Error: "500 Internal Server Error" on /api/projects

**Cause**: MongoDB connection failed

**Solution**:
1. Check `MONGODB_URI` is correct
2. Check MongoDB Atlas Network Access allows 0.0.0.0/0
3. Check your MongoDB password doesn't have special characters that need URL encoding
4. If password has special characters, encode them:
   - `@` → `%40`
   - `#` → `%23`
   - `$` → `%24`
   - `%` → `%25`

### Error: "unsupported content-type" on email verification

**Cause**: Missing email environment variables

**Solution**:
1. Add `EMAIL_USER` and `EMAIL_APP_PASSWORD`
2. Make sure App Password has no spaces
3. Redeploy

### Projects not loading

**Cause**: MongoDB not connected

**Solution**:
1. Check Vercel Function logs:
   - Go to deployment → Functions tab
   - Look for error messages
2. Verify `MONGODB_URI` format
3. Test connection string locally first

---

## 📝 **Example Environment Variables**

```env
# MongoDB
MONGODB_URI=mongodb+srv://rhynox:MyP%40ssw0rd@cluster0.abc123.mongodb.net/rhynox?retryWrites=true&w=majority

# Email
EMAIL_USER=rhynoxtechnologies@gmail.com
EMAIL_APP_PASSWORD=abcdefghijklmnop

# Cloudinary (Optional for now)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
```

---

## 🚀 **After Setup**

Once all variables are added and you've redeployed:

1. **Test MongoDB Connection**:
   - Visit https://rhynox-technologies.vercel.app/
   - Projects should load automatically

2. **Test Email Verification**:
   - Go to Contact section
   - Click "Send Verification Code"
   - Should receive email

3. **Test Project Upload** (if Cloudinary is set up):
   - Login to admin
   - Try uploading a project

---

## 📞 **Need Help?**

If you're still having issues:
1. Check Vercel Function logs for specific errors
2. Verify each environment variable is exactly as shown
3. Make sure MongoDB Atlas network access is configured
4. Try redeploying after each change

---

**Remember**: Environment variables only take effect AFTER redeploying!
