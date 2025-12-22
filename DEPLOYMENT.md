# Vercel Deployment Guide for Rhynox Technologies

This guide will help you deploy your Rhynox Technologies website to Vercel with both frontend and backend functionality.

## 🔒 Security Features Implemented

1. **Environment Variables**: MongoDB credentials are now stored in `.env` file (not committed to Git)
2. **`.gitignore` Updated**: Sensitive files and uploads directory are excluded from version control
3. **Cloudinary Integration**: File uploads use Cloudinary instead of local storage (required for Vercel)

## 📋 Prerequisites

Before deploying, you need:

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Cloudinary Account**: Sign up at [cloudinary.com](https://cloudinary.com) (free tier is sufficient)
3. **GitHub/GitLab/Bitbucket**: Your code should be in a Git repository

## 🚀 Deployment Steps

### Step 1: Set Up Cloudinary

1. Go to [cloudinary.com](https://cloudinary.com) and create a free account
2. From your dashboard, note down:
   - Cloud Name
   - API Key
   - API Secret

### Step 2: Install New Dependencies

Run the following command to install required packages:

```bash
npm install
```

This will install:
- `dotenv` - For environment variable management
- `cloudinary` - For file uploads
- `multiparty` - For parsing form data in serverless functions

### Step 3: Push to Git Repository

Make sure your code is in a Git repository:

```bash
git add .
git commit -m "Configure for Vercel deployment"
git push origin main
```

**Note**: The `.env` file will NOT be pushed (it's in `.gitignore`)

### Step 4: Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your Git repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add Environment Variables (click "Environment Variables"):
   ```
   MONGODB_URI = mongodb+srv://yagnarashagan:Yagnarashagan6@rhynox-technologies.d1n5erd.mongodb.net/rhynox?retryWrites=true&w=majority
   CLOUDINARY_CLOUD_NAME = your_cloud_name_here
   CLOUDINARY_API_KEY = your_api_key_here
   CLOUDINARY_API_SECRET = your_api_secret_here
   NODE_ENV = production
   ```

6. Click "Deploy"

#### Option B: Using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Follow the prompts and add environment variables when asked

### Step 5: Configure Environment Variables in Vercel

After deployment, you can manage environment variables:

1. Go to your project in Vercel Dashboard
2. Click "Settings" → "Environment Variables"
3. Add the following variables:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `MONGODB_URI` | Your MongoDB connection string | Production, Preview, Development |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | Production, Preview, Development |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key | Production, Preview, Development |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret | Production, Preview, Development |
| `NODE_ENV` | production | Production |

### Step 6: Update Frontend API URL (If Needed)

Check your frontend code (App.jsx) and update the API URL if it's hardcoded:

```javascript
// Change from:
const API_URL = 'http://localhost:5000/api';

// To:
const API_URL = import.meta.env.VITE_API_URL || '/api';
```

Then add to your Vercel environment variables:
```
VITE_API_URL = /api
```

## 🔄 How It Works

### Frontend
- Built with Vite and served as static files from the `dist` folder
- Deployed to Vercel's CDN for fast global access

### Backend
- API routes are converted to Vercel Serverless Functions
- Located in the `/api` directory
- Each request creates a new function instance
- MongoDB connection is cached to prevent connection exhaustion

### File Uploads
- **Local Development**: Files saved to `uploads/` folder
- **Production (Vercel)**: Files uploaded to Cloudinary
- Cloudinary provides permanent URLs for images

## 📁 Project Structure

```
rhynox-technologies-main/
├── api/                      # Vercel Serverless Functions
│   ├── db.js                # Database connection with caching
│   ├── index.js             # Main API handler
│   └── models/
│       └── Project.js       # Project model
├── src/                     # Frontend source code
├── dist/                    # Built frontend (generated)
├── uploads/                 # Local uploads (not deployed)
├── .env                     # Environment variables (NOT in Git)
├── .env.example             # Example env file (in Git)
├── .gitignore              # Excludes sensitive files
├── vercel.json             # Vercel configuration
├── server.js               # Local development server
└── package.json            # Dependencies and scripts
```

## 🧪 Testing Locally

Before deploying, test locally:

1. Make sure `.env` file exists with your credentials
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Run the backend server (in a separate terminal):
   ```bash
   npm start
   ```

## 🔐 Security Best Practices

✅ **Implemented:**
- MongoDB credentials in environment variables
- `.env` file excluded from Git
- Uploads directory excluded from Git
- CORS configured properly

⚠️ **Additional Recommendations:**
1. **Rotate MongoDB Credentials**: Create a new database user with limited permissions
2. **Enable MongoDB IP Whitelist**: Add Vercel's IP ranges (or use 0.0.0.0/0 for serverless)
3. **Use MongoDB Atlas Network Access**: Configure allowed IP addresses
4. **Enable Rate Limiting**: Add rate limiting to your API routes
5. **Add Authentication**: Implement admin authentication for project management

## 🐛 Troubleshooting

### Issue: "MONGODB_URI is not defined"
**Solution**: Make sure you've added the environment variable in Vercel Dashboard

### Issue: File uploads not working
**Solution**: Verify Cloudinary credentials are correct in Vercel environment variables

### Issue: 404 on API routes
**Solution**: Check that `vercel.json` is properly configured and deployed

### Issue: MongoDB connection timeout
**Solution**: 
1. Check MongoDB Atlas Network Access settings
2. Allow access from anywhere (0.0.0.0/0) for serverless functions
3. Verify connection string is correct

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for frontend errors
3. Check Vercel function logs for backend errors

## 🎉 Success!

Once deployed, your site will be available at:
- **Production**: `https://your-project-name.vercel.app`
- **Custom Domain**: Configure in Vercel Dashboard → Settings → Domains

---

**Note**: Every time you push to your Git repository, Vercel will automatically redeploy your site!
