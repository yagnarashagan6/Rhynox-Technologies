# ✅ UPDATE THESE 3 VARIABLES IN VERCEL NOW

## 🎯 Your Correct Values

### 1. EMAIL_APP_PASSWORD (NEW!)
```
desmjoktjrfnuzfg
```
(Remove spaces: `desm jokt jrfn uzfg` → `desmjoktjrfnuzfg`)

### 2. CLOUDINARY_API_SECRET (FIX TYPO!)
```
-jNi8z3lKTHkgaxoEeQpHSDz7Oc
```
(You had typos: `Ni8z31` and `SDz70`)

### 3. MONGODB_URI (GET FULL STRING!)
You need to get the FULL connection string from MongoDB Atlas.
It should look like:
```
mongodb+srv://yagnarashagan:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/database?retryWrites=true&w=majority
```

---

## 🚀 STEP-BY-STEP FIX

### Step 1: Update EMAIL_APP_PASSWORD

1. **Vercel Dashboard** → Settings → Environment Variables
2. Find `EMAIL_APP_PASSWORD`
3. Click **Edit**
4. Change value to: `desmjoktjrfnuzfg` (no spaces!)
5. Make sure ✅ Production ✅ Preview ✅ Development are checked
6. Click **Save**

---

### Step 2: Fix CLOUDINARY_API_SECRET

1. Find `CLOUDINARY_API_SECRET`
2. Click **Edit**
3. Change value to: `-jNi8z3lKTHkgaxoEeQpHSDz7Oc` (EXACT!)
4. Make sure ✅ Production ✅ Preview ✅ Development are checked
5. Click **Save**

---

### Step 3: Fix MONGODB_URI

#### First, get the FULL connection string:

1. Go to: **https://cloud.mongodb.com**
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. **Driver:** Node.js
5. **Copy the connection string** (looks like: `mongodb+srv://...`)
6. **Replace `<password>`** with your actual MongoDB password

#### Then update in Vercel:

1. **DELETE** the variable `MONGODB-URI` (with dash - it's wrong!)
2. Click **"Add New"**
3. **Key:** `MONGODB_URI` (with underscore!)
4. **Value:** [Paste the FULL connection string with password]
5. ✅ Production ✅ Preview ✅ Development
6. Click **Save**

---

### Step 4: Delete PORT (Not Needed)

1. Find `PORT` variable
2. Click **Delete**
3. Confirm

---

## 🔄 After Updating All Variables

### Redeploy:

1. Click **"Deployments"** tab
2. Click **"Redeploy"** on latest deployment
3. ✅ Check **"Clear Build Cache"**
4. Click **"Redeploy"**
5. **Wait 2-3 minutes**

---

## ✅ Final Variables List

After fixing, you should have exactly 7 variables:

```
1. EMAIL_USER = rhynoxtechnologies@gmail.com
2. EMAIL_APP_PASSWORD = desmjoktjrfnuzfg
3. MONGODB_URI = mongodb+srv://yagnarashagan:PASSWORD@cluster...
4. CLOUDINARY_CLOUD_NAME = dlvpoyvf2
5. CLOUDINARY_API_KEY = 145676111353439
6. CLOUDINARY_API_SECRET = -jNi8z3lKTHkgaxoEeQpHSDz7Oc
7. NODE_ENV = production
```

**Each should have:** ✅ Production ✅ Preview ✅ Development

---

## 🧪 After Redeployment - Test

1. Go to: https://rhynox-technologies.vercel.app
2. Press F12 (DevTools)
3. Test contact form → Should work! ✅
4. Test project upload → Should work! ✅

---

## 📋 Quick Checklist

- [ ] Updated EMAIL_APP_PASSWORD to `desmjoktjrfnuzfg`
- [ ] Fixed CLOUDINARY_API_SECRET to `-jNi8z3lKTHkgaxoEeQpHSDz7Oc`
- [ ] Got FULL MongoDB connection string from Atlas
- [ ] Deleted MONGODB-URI (with dash)
- [ ] Added MONGODB_URI (with underscore) with full string
- [ ] Deleted PORT variable
- [ ] All 7 variables have 3 checkmarks
- [ ] Redeployed with cache cleared
- [ ] Waited for deployment to complete
- [ ] Tested site

---

## ⏱️ Time Required

- Update 3 variables: **5 minutes**
- Get MongoDB string: **2 minutes**
- Redeploy: **3 minutes**
- Test: **2 minutes**

**Total: ~12 minutes**

---

## 🎉 What Will Work After This

- ✅ Email verification (new app password!)
- ✅ Contact form submission (MongoDB + Email)
- ✅ Project uploads (Cloudinary fixed!)
- ✅ Everything! 🚀

---

**GO UPDATE THEM NOW!**

1. EMAIL_APP_PASSWORD → `desmjoktjrfnuzfg`
2. CLOUDINARY_API_SECRET → `-jNi8z3lKTHkgaxoEeQpHSDz7Oc`
3. MONGODB_URI → Get full string from MongoDB Atlas
4. Redeploy
5. Test!

**THEN IT WILL WORK!** 🚀
