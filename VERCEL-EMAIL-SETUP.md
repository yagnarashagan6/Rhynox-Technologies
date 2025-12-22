# Vercel Email Configuration Guide

## ✅ Changes Pushed to GitHub

I've created serverless functions for Vercel to handle email verification and contact form submissions:

### New Files Created:
1. **`api/verify-email-send.js`** - Sends verification codes
2. **`api/verify-email-confirm.js`** - Confirms verification codes
3. **`api/contact-send.js`** - Sends contact form emails
4. **`api/models/EmailVerification.js`** - Database model for verification records
5. **Updated `vercel.json`** - Added routing for new endpoints

---

## 🔧 Required Environment Variables on Vercel

You **MUST** add these environment variables in your Vercel dashboard:

### 1. Go to Your Vercel Project
https://vercel.com/yagnarashagan6/rhynox-technologies

### 2. Navigate to Settings → Environment Variables

### 3. Add These Variables:

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `EMAIL_USER` | `rhynoxtechnologies@gmail.com` | Your Gmail address |
| `EMAIL_APP_PASSWORD` | `your-app-password-here` | Gmail App Password (NOT your regular password) |
| `MONGODB_URI` | `your-mongodb-connection-string` | MongoDB Atlas connection string |

---

## 📧 How to Get Gmail App Password

1. Go to your Google Account: https://myaccount.google.com/
2. Click on **Security** (left sidebar)
3. Enable **2-Step Verification** (if not already enabled)
4. Search for **"App passwords"** in the search bar
5. Click **App passwords**
6. Select:
   - **App**: Mail
   - **Device**: Other (Custom name) → Type "Vercel Rhynox"
7. Click **Generate**
8. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)
9. **Remove the spaces** and use it as `EMAIL_APP_PASSWORD`

---

## 🚀 After Adding Environment Variables

1. **Redeploy** your Vercel project:
   - Go to **Deployments** tab
   - Click on the latest deployment
   - Click **"Redeploy"** button
   - OR just push a new commit to trigger auto-deployment

2. **Test the Contact Form**:
   - Visit https://rhynox-technologies.vercel.app/
   - Scroll to Contact section
   - Fill in the form
   - Click "Send Verification Code"
   - Check your Gmail for the code
   - Enter the code and submit

---

## 🔍 Troubleshooting

### If you still get errors:

1. **Check Vercel Logs**:
   - Go to your deployment
   - Click on **"Functions"** tab
   - Check logs for any errors

2. **Verify Environment Variables**:
   - Make sure there are no extra spaces
   - Make sure `EMAIL_APP_PASSWORD` has no spaces
   - Make sure `MONGODB_URI` is correct

3. **Check MongoDB Connection**:
   - Ensure your MongoDB Atlas cluster allows connections from anywhere (0.0.0.0/0)
   - Or add Vercel's IP ranges to the whitelist

---

## 📝 API Endpoints (After Deployment)

- **Send Verification**: `POST /api/verify-email/send`
- **Confirm Verification**: `POST /api/verify-email/confirm`
- **Send Contact Form**: `POST /api/contact/send`
- **Projects**: `GET/POST/PUT/DELETE /api/projects`

---

## ✨ What This Fixes

✅ Email verification will work on Vercel
✅ Contact form will send emails directly
✅ Success notification with blast icons
✅ No more "unsupported content-type" errors
✅ Serverless functions properly configured

---

**Important**: After adding the environment variables, you MUST redeploy for them to take effect!
