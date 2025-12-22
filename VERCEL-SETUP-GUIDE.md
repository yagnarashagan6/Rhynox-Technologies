# 🎯 STEP-BY-STEP: Fix Your Vercel Deployment

## The Problem

Your code is correct and deployed, but **Vercel doesn't have the environment variables** it needs to:
- Connect to MongoDB
- Upload images to Cloudinary  
- Send emails via Gmail

**Without these, the API functions crash with 500 errors.**

---

## 🚀 THE FIX (Follow These Exact Steps)

### STEP 1: Open Vercel Dashboard

1. Go to: **https://vercel.com/dashboard**
2. Log in if needed
3. You should see your project: **rhynox-technologies**
4. **Click on the project name**

---

### STEP 2: Go to Environment Variables

1. At the top of the page, click **"Settings"**
2. On the left sidebar, click **"Environment Variables"**
3. You should now see a page with a button **"Add New"**

---

### STEP 3: Add Environment Variables (ONE BY ONE)

Click **"Add New"** and add each variable below:

#### Variable 1: MONGODB_URI
```
Key: MONGODB_URI
Value: [Paste your MongoDB connection string]
Environments: ✅ Production ✅ Preview ✅ Development
```
Click **"Save"**

**Where to get the value:**
- Go to https://cloud.mongodb.com
- Click your cluster → **"Connect"**
- Choose **"Connect your application"**
- Copy the connection string
- Replace `<password>` with your actual MongoDB password

---

#### Variable 2: CLOUDINARY_CLOUD_NAME
```
Key: CLOUDINARY_CLOUD_NAME
Value: [Your Cloudinary cloud name]
Environments: ✅ Production ✅ Preview ✅ Development
```
Click **"Save"**

**Where to get the value:**
- Go to https://cloudinary.com/console
- Look at the top - you'll see "Cloud name: xxxxx"
- Copy that value

---

#### Variable 3: CLOUDINARY_API_KEY
```
Key: CLOUDINARY_API_KEY
Value: [Your Cloudinary API key]
Environments: ✅ Production ✅ Preview ✅ Development
```
Click **"Save"**

**Where to get the value:**
- Same Cloudinary dashboard
- Look for "API Key: 123456789012345"
- Copy that number

---

#### Variable 4: CLOUDINARY_API_SECRET
```
Key: CLOUDINARY_API_SECRET
Value: [Your Cloudinary API secret]
Environments: ✅ Production ✅ Preview ✅ Development
```
Click **"Save"**

**Where to get the value:**
- Same Cloudinary dashboard
- Look for "API Secret: ****************"
- Click the eye icon to reveal it
- Copy the value

---

#### Variable 5: EMAIL_USER
```
Key: EMAIL_USER
Value: rhynoxtechnologies@gmail.com
Environments: ✅ Production ✅ Preview ✅ Development
```
Click **"Save"**

**This is your Gmail address that sends emails**

---

#### Variable 6: EMAIL_APP_PASSWORD
```
Key: EMAIL_APP_PASSWORD
Value: [Your Gmail App Password - 16 characters]
Environments: ✅ Production ✅ Preview ✅ Development
```
Click **"Save"**

**Where to get the value:**
1. Go to https://myaccount.google.com/security
2. Search for "App passwords" or "App-specific passwords"
3. Click "App passwords"
4. Select "Mail" and "Other (Custom name)"
5. Type "Rhynox Website"
6. Click "Generate"
7. Copy the 16-character password (looks like: `abcd efgh ijkl mnop`)
8. Paste it WITHOUT spaces: `abcdefghijklmnop`

---

#### Variable 7: NODE_ENV
```
Key: NODE_ENV
Value: production
Environments: ✅ Production ✅ Preview ✅ Development
```
Click **"Save"**

**Just type the word "production" (no quotes)**

---

### STEP 4: Verify All Variables Are Added

After adding all 7 variables, you should see them listed:

```
✅ MONGODB_URI
✅ CLOUDINARY_CLOUD_NAME
✅ CLOUDINARY_API_KEY
✅ CLOUDINARY_API_SECRET
✅ EMAIL_USER
✅ EMAIL_APP_PASSWORD
✅ NODE_ENV
```

Each should show: **Production, Preview, Development**

---

### STEP 5: Redeploy Your Site

1. Click **"Deployments"** at the top
2. You'll see your latest deployment
3. Click the **three dots (•••)** on the right
4. Click **"Redeploy"**
5. A popup appears - **CHECK the box** "Clear Build Cache"
6. Click **"Redeploy"**

**Wait 2-3 minutes for deployment to complete**

---

### STEP 6: Test Your Site

1. Go to: **https://rhynox-technologies.vercel.app**
2. Press **F12** to open Developer Tools
3. Click the **"Console"** tab
4. Try the contact form:
   - Fill in your email
   - Click "Get Verification Code"
   - Check console for errors

**Expected result:** No errors, email sent successfully!

---

### STEP 7: Fix Mixed Content (Old Projects)

The mixed content error is from old projects with `localhost:5000` URLs.

**Option 1 - Delete Old Projects:**
1. Go to your admin dashboard
2. Delete all existing projects
3. Re-upload them (they'll use Cloudinary URLs now)

**Option 2 - Keep Projects, Fix URLs:**
1. Go to MongoDB Atlas
2. Browse Collections → Projects
3. Delete projects with `localhost:5000` in image URLs

---

## ✅ Success Checklist

After completing all steps:

- [ ] All 7 environment variables added to Vercel
- [ ] Each variable has 3 checkmarks (Production, Preview, Development)
- [ ] Redeployed with "Clear Build Cache" checked
- [ ] Deployment completed successfully (green checkmark)
- [ ] Tested contact form - no 500 error
- [ ] Tested admin upload - no 403 error
- [ ] No mixed content warnings (after deleting old projects)

---

## 🚨 Troubleshooting

### Still getting 500 error?
- Check Vercel → Functions → Click the failing function → Read logs
- Most likely: Wrong MongoDB URI or Email credentials

### Still getting 403 error?
- Make sure you redeployed AFTER adding environment variables
- Clear your browser cache (Ctrl + Shift + Delete)

### Still getting mixed content?
- Delete old projects from admin dashboard
- Or delete them from MongoDB Atlas directly

---

## 📸 Visual Guide

### Where to find MongoDB URI:
```
MongoDB Atlas → Clusters → Connect → Connect your application
→ Copy connection string
→ Replace <password> with your actual password
```

### Where to find Cloudinary credentials:
```
Cloudinary Dashboard (top of page)
Cloud name: your-cloud-name
API Key: 123456789012345
API Secret: **************** (click eye to reveal)
```

### Where to create Gmail App Password:
```
Google Account → Security → 2-Step Verification
→ App passwords → Select app: Mail
→ Select device: Other (Custom name)
→ Generate → Copy 16-character password
```

---

## ⏱️ Time Required

- Adding environment variables: **5 minutes**
- Redeploying: **3 minutes** (automatic)
- Testing: **2 minutes**
- **Total: ~10 minutes**

---

## 💡 Important Notes

1. **Environment variables are SECRET** - Don't share them publicly
2. **App Password ≠ Gmail Password** - You need to generate a special app password
3. **MongoDB URI must include password** - Replace `<password>` with actual password
4. **Redeploy is REQUIRED** - Variables won't work until you redeploy
5. **Clear cache helps** - Check "Clear Build Cache" when redeploying

---

## 🎉 What Happens After This

Once you complete all steps:

1. ✅ Contact form will send emails
2. ✅ Admin can upload projects to Cloudinary
3. ✅ Projects will be saved to MongoDB
4. ✅ No more CORS errors
5. ✅ No more 500 errors
6. ✅ No more 403 errors
7. ✅ Website fully functional!

---

## 📞 Need Help?

If you're stuck on a specific step:

1. **Screenshot the error** (browser console or Vercel logs)
2. **Screenshot your environment variables page** (hide the values)
3. **Tell me which step you're on**

**Remember: The code is already correct and deployed. You just need to add the environment variables!** 🚀
