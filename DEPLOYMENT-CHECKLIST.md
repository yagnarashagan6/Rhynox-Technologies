# 🚀 Vercel Deployment Checklist

Use this checklist to ensure a smooth deployment to Vercel.

## ✅ Pre-Deployment Checklist

### 1. Environment Setup
- [ ] `.env` file created with MongoDB credentials
- [ ] `.env` file is in `.gitignore` (already done ✓)
- [ ] All dependencies installed (`npm install` completed)
- [ ] Local development tested (frontend + backend running)

### 2. Cloudinary Setup (Required for Production)
- [ ] Cloudinary account created at [cloudinary.com](https://cloudinary.com)
- [ ] Cloud Name obtained
- [ ] API Key obtained
- [ ] API Secret obtained
- [ ] Credentials added to `.env` file for testing

### 3. MongoDB Atlas Configuration
- [ ] MongoDB Atlas account active
- [ ] Database cluster created
- [ ] Connection string obtained
- [ ] **IMPORTANT**: Network Access configured to allow `0.0.0.0/0`
  - Go to MongoDB Atlas → Network Access
  - Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
  - This is required for Vercel serverless functions

### 4. Code Verification
- [ ] All hardcoded API URLs removed (already done ✓)
- [ ] `src/config.js` properly configured (already done ✓)
- [ ] No sensitive data in code (already done ✓)
- [ ] All files saved and committed

### 5. Git Repository
- [ ] Code pushed to GitHub/GitLab/Bitbucket
- [ ] `.env` file NOT in repository (verify with `git status`)
- [ ] All changes committed
- [ ] Repository is public or accessible to Vercel

## 🌐 Vercel Deployment Steps

### Step 1: Import Project
- [ ] Go to [vercel.com/dashboard](https://vercel.com/dashboard)
- [ ] Click "Add New Project"
- [ ] Select "Import Git Repository"
- [ ] Choose your repository

### Step 2: Configure Build Settings
- [ ] Framework Preset: **Vite**
- [ ] Build Command: `npm run vercel-build`
- [ ] Output Directory: `dist`
- [ ] Install Command: `npm install`
- [ ] Root Directory: `./` (leave as default)

### Step 3: Add Environment Variables
Add these environment variables in Vercel:

- [ ] `MONGODB_URI` = `your_mongodb_connection_string`
- [ ] `CLOUDINARY_CLOUD_NAME` = `your_cloudinary_cloud_name`
- [ ] `CLOUDINARY_API_KEY` = `your_cloudinary_api_key`
- [ ] `CLOUDINARY_API_SECRET` = `your_cloudinary_api_secret`
- [ ] `NODE_ENV` = `production`

**Important**: Apply to all environments (Production, Preview, Development)

### Step 4: Deploy
- [ ] Click "Deploy"
- [ ] Wait for deployment to complete (usually 2-5 minutes)
- [ ] Check deployment logs for any errors

## ✅ Post-Deployment Checklist

### 1. Verify Deployment
- [ ] Visit your Vercel deployment URL
- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] All sections visible
- [ ] No console errors in browser

### 2. Test Backend Functionality
- [ ] Admin login works
- [ ] Can access admin dashboard
- [ ] Can upload a test project
- [ ] Images upload to Cloudinary successfully
- [ ] Projects display on main page
- [ ] Can edit projects
- [ ] Can delete projects

### 3. Test API Endpoints
- [ ] `GET /api/projects` returns data
- [ ] `POST /api/projects` creates new project
- [ ] `PUT /api/projects/:id` updates project
- [ ] `DELETE /api/projects/:id` deletes project

### 4. Performance Check
- [ ] Page load speed is acceptable
- [ ] Images load properly
- [ ] Animations work smoothly
- [ ] Mobile responsiveness works

### 5. Security Verification
- [ ] Environment variables not visible in browser
- [ ] MongoDB credentials not exposed
- [ ] API endpoints secured
- [ ] No sensitive data in console logs

## 🔧 Optional: Custom Domain Setup

- [ ] Go to Vercel Dashboard → Your Project → Settings → Domains
- [ ] Add your custom domain
- [ ] Configure DNS records as instructed by Vercel
- [ ] Wait for DNS propagation (can take up to 48 hours)
- [ ] Verify SSL certificate is active

## 📊 Monitoring & Maintenance

### Regular Checks
- [ ] Monitor Vercel deployment logs
- [ ] Check MongoDB Atlas usage
- [ ] Check Cloudinary storage usage
- [ ] Review error logs in Vercel dashboard

### Monthly Tasks
- [ ] Review and rotate API keys if needed
- [ ] Check for dependency updates
- [ ] Review MongoDB database size
- [ ] Clean up unused Cloudinary assets

## 🆘 Troubleshooting

### If deployment fails:
1. Check Vercel deployment logs
2. Verify all environment variables are set
3. Ensure MongoDB allows connections from 0.0.0.0/0
4. Check Cloudinary credentials are correct
5. Review build logs for specific errors

### If API doesn't work:
1. Check browser console for errors
2. Verify API routes in Vercel dashboard
3. Check MongoDB connection
4. Verify environment variables in Vercel

### If images don't upload:
1. Verify Cloudinary credentials
2. Check Cloudinary dashboard for errors
3. Review Vercel function logs
4. Ensure file size is within limits

## 📚 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Detailed deployment guide
- [QUICKSTART.md](./QUICKSTART.md) - Quick reference

## ✨ Congratulations!

Once all items are checked, your Rhynox Technologies website is successfully deployed on Vercel! 🎉

---

**Need Help?** Refer to [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed troubleshooting.
