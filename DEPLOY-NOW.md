# 🚀 Quick Deployment Checklist

## ✅ What We Fixed

1. **✓ Updated `src/config.js`** - Better production mode detection
2. **✓ Updated `vercel.json`** - Force production build mode
3. **✓ Created `.env.production`** - Explicit production API URL
4. **✓ Updated all API CORS headers** - Allow your production domains
   - `api/index.js`
   - `api/contact-send.js`
   - `api/verify-email-send.js`
   - `api/verify-email-confirm.js`

## 📋 Next Steps - DO THESE NOW!

### 1. Verify Vercel Environment Variables ⚠️ CRITICAL

Go to [Vercel Dashboard](https://vercel.com/dashboard) → Your Project → Settings → Environment Variables

**Make sure ALL these are set:**

```
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password
NODE_ENV=production
```

**Important:** Select **Production**, **Preview**, AND **Development** for each variable!

### 2. Commit and Push Changes

```bash
git add .
git commit -m "Fix CORS and production API configuration"
git push
```

### 3. Redeploy on Vercel

**Option A - Automatic (if connected to Git):**
- Vercel will auto-deploy when you push

**Option B - Manual:**
1. Go to Vercel Dashboard → Your Project → Deployments
2. Click **Redeploy** on the latest deployment
3. ✅ Check "Clear Build Cache"
4. Click **Redeploy**

### 4. Test After Deployment

1. **Open your site:** https://www.rhynoxtechnologies.dev
2. **Open DevTools:** Press F12
3. **Check Console:** Look for API configuration logs
4. **Test Contact Form:**
   - Fill out the form
   - Click "Get Verification Code"
   - Check for errors in Console and Network tabs
5. **Test Admin Dashboard:**
   - Try uploading a project
   - Check if it works

## 🔍 What to Look For

### ✅ Success Indicators:
- No CORS errors in console
- API calls go to `/api/...` (not `localhost:5000`)
- Contact form sends emails
- Admin can upload projects
- Projects display on main page

### ❌ If Still Failing:

**Check Vercel Function Logs:**
1. Vercel Dashboard → Your Project → Functions
2. Click on the function that's failing
3. Read the error logs

**Common Issues:**
- Missing environment variables → Add them in Vercel dashboard
- MongoDB connection failed → Check MongoDB Network Access (allow 0.0.0.0/0)
- Email not sending → Verify Gmail App Password is correct
- 403 Forbidden → CORS issue, check if domain is in allowedOrigins array

## 📞 Need Help?

If errors persist:
1. Share the **exact error message** from browser console
2. Share the **Vercel function logs**
3. Verify all environment variables are set correctly

## 🎯 Quick Test Commands

After deployment, test these URLs directly:

```
https://www.rhynoxtechnologies.dev/api/projects
```
Should return JSON with projects (or empty array)

```
https://rhynox-technologies.vercel.app/api/projects
```
Should also work

If these don't work, there's a deployment issue with the API functions.
