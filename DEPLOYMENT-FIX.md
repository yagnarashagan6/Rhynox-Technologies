# 🔧 Deployment Issues Fix Guide

## 🚨 Current Issues

You're experiencing the following errors on your deployed site:

1. **CORS Error**: Access to localhost:5000 from HTTPS site blocked
2. **Mixed Content Error**: HTTPS page trying to load HTTP resources
3. **403 Forbidden**: POST requests to `/api/projects` failing
4. **500 Server Error**: Contact form submission failing

## 🎯 Root Causes

### 1. **Frontend Still Pointing to Localhost**
The production build is somehow still using `localhost:5000` instead of the deployed API endpoints.

### 2. **Missing CORS Headers on Vercel**
The serverless functions need proper CORS configuration to accept requests from your domain.

### 3. **Environment Variables Not Set**
Vercel needs all environment variables configured in the dashboard.

## ✅ Complete Fix

### Step 1: Update CORS Configuration in API Files

The API files already have CORS headers, but we need to ensure they're properly configured for your domain.

**Update `api/index.js`** - Change line 40 to allow your specific domain:

```javascript
res.setHeader('Access-Control-Allow-Origin', 'https://www.rhynoxtechnologies.dev');
```

Or keep it as `'*'` for all domains (less secure but easier for testing):

```javascript
res.setHeader('Access-Control-Allow-Origin', '*');
```

**Do the same for:**
- `api/contact-send.js` (line 18)
- `api/verify-email-send.js` (line 18)
- `api/verify-email-confirm.js` (line 18)

### Step 2: Verify Vercel Environment Variables

Go to your Vercel dashboard and ensure ALL these environment variables are set:

#### Required Variables:
```
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password
NODE_ENV=production
```

**How to set them:**
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable above
5. Make sure to select **Production**, **Preview**, and **Development** for each

### Step 3: Force Production Mode in Build

Update `vercel.json` to ensure production mode:

```json
{
  "buildCommand": "NODE_ENV=production npm run build",
  "outputDirectory": "dist",
  "env": {
    "NODE_ENV": "production"
  },
  "rewrites": [
    {
      "source": "/api/projects/:path*",
      "destination": "/api/index.js"
    },
    {
      "source": "/api/verify-email/send",
      "destination": "/api/verify-email-send.js"
    },
    {
      "source": "/api/verify-email/confirm",
      "destination": "/api/verify-email-confirm.js"
    },
    {
      "source": "/api/contact/send",
      "destination": "/api/contact-send.js"
    }
  ]
}
```

### Step 4: Add Vercel-Specific Environment Variable

Create a `.env.production` file (if it doesn't exist):

```bash
VITE_API_URL=/api
NODE_ENV=production
```

### Step 5: Update Config to Be More Explicit

Update `src/config.js` to be more explicit about production:

```javascript
// API Configuration
const isProduction = import.meta.env.MODE === 'production' || 
                     import.meta.env.PROD || 
                     window.location.hostname !== 'localhost';

const API_BASE_URL = import.meta.env.VITE_API_URL || 
                     (isProduction ? '/api' : 'http://localhost:5000/api');

console.log('API Mode:', import.meta.env.MODE);
console.log('API Base URL:', API_BASE_URL);
console.log('Is Production:', isProduction);

export const API_ENDPOINTS = {
  BASE_URL: API_BASE_URL,
  PROJECTS: `${API_BASE_URL}/projects`,
  PROJECT_BY_ID: (id) => `${API_BASE_URL}/projects/${id}`,
};

export default API_BASE_URL;
```

### Step 6: Clear Cache and Redeploy

After making these changes:

1. **Commit all changes:**
   ```bash
   git add .
   git commit -m "Fix CORS and production API configuration"
   git push
   ```

2. **In Vercel Dashboard:**
   - Go to **Deployments**
   - Click on the latest deployment
   - Click **Redeploy**
   - Check "Clear Build Cache"
   - Click **Redeploy**

3. **Wait for deployment to complete**

4. **Test the site:**
   - Open browser DevTools (F12)
   - Go to Console tab
   - Look for the console.log messages showing API configuration
   - Try submitting the contact form
   - Check Network tab for API calls

### Step 7: Verify MongoDB Network Access

Make sure your MongoDB Atlas allows connections from Vercel:

1. Go to MongoDB Atlas Dashboard
2. Click **Network Access**
3. Add IP Address: `0.0.0.0/0` (allows all IPs)
   - Or add Vercel's IP ranges specifically

### Step 8: Check Cloudinary Configuration

Ensure your Cloudinary account is properly set up:

1. Log in to Cloudinary
2. Go to Dashboard
3. Copy your Cloud Name, API Key, and API Secret
4. Verify they match what's in Vercel environment variables

## 🧪 Testing After Deployment

### Test Contact Form:
1. Go to https://www.rhynoxtechnologies.dev
2. Open DevTools → Console
3. Fill out contact form
4. Click "Get Verification Code"
5. Check console for any errors
6. Check Network tab for API calls

### Test Project Upload (Admin):
1. Go to admin dashboard
2. Try uploading a project
3. Check console and network tabs

## 🔍 Debugging Tips

### If CORS errors persist:
1. Check browser console for exact error message
2. Verify the API endpoint being called (should be `/api/...` not `localhost:5000`)
3. Check Vercel function logs in dashboard

### If 403 Forbidden errors:
1. This usually means CORS is blocking the request
2. Verify CORS headers in API files
3. Check if request is OPTIONS (preflight) - should return 200

### If 500 Server errors:
1. Go to Vercel Dashboard → Your Project → Functions
2. Click on the failing function
3. Check the logs for error details
4. Common issues:
   - Missing environment variables
   - MongoDB connection failed
   - Email credentials incorrect

## 📝 Quick Checklist

- [ ] All environment variables set in Vercel
- [ ] CORS headers updated in all API files
- [ ] `vercel.json` updated with NODE_ENV
- [ ] `.env.production` file created
- [ ] `src/config.js` updated with better detection
- [ ] MongoDB allows Vercel IPs
- [ ] Cloudinary credentials verified
- [ ] Code committed and pushed
- [ ] Vercel redeployed with cache cleared
- [ ] Tested contact form
- [ ] Tested admin project upload

## 🆘 Still Having Issues?

If problems persist after following all steps:

1. **Check Vercel Function Logs:**
   - Dashboard → Your Project → Functions
   - Look for specific error messages

2. **Test API Endpoints Directly:**
   - Try: `https://www.rhynoxtechnologies.dev/api/projects`
   - Should return JSON with projects

3. **Verify Build Output:**
   - Check Vercel build logs
   - Look for any build errors or warnings

4. **Check Browser Console:**
   - Look for the console.log messages from config.js
   - Verify API_BASE_URL is `/api` not `localhost:5000`

## 🎉 Success Indicators

You'll know it's working when:
- ✅ No CORS errors in console
- ✅ API calls go to `/api/...` endpoints
- ✅ Contact form sends emails successfully
- ✅ Admin can upload projects
- ✅ Projects display on main page
