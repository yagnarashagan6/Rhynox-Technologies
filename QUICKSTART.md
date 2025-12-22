# Rhynox Technologies - Quick Start Guide

## 🚀 Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create a `.env` file in the root directory (already created for you):
```env
MONGODB_URI=mongodb+srv://yagnarashagan:Yagnarashagan6@rhynox-technologies.d1n5erd.mongodb.net/rhynox?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
```

### 3. Run the Application

**Frontend (Vite Dev Server):**
```bash
npm run dev
```
Access at: `http://localhost:5173`

**Backend (Express Server):**
```bash
npm start
```
Runs on: `http://localhost:5000`

## 📦 Vercel Deployment

### Quick Deploy
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables (see DEPLOYMENT.md)
5. Deploy!

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📁 Project Structure

```
rhynox-technologies-main/
├── api/                    # Vercel Serverless Functions
│   ├── db.js              # Database connection
│   ├── index.js           # Main API handler
│   └── models/
│       └── Project.js     # Project model
├── src/                   # Frontend source
│   ├── App.jsx           # Main app component
│   ├── AdminDashboard.jsx # Admin panel
│   ├── AdminLogin.jsx    # Admin login
│   └── config.js         # API configuration
├── .env                  # Environment variables (NOT in Git)
├── .env.example          # Example env file
├── server.js             # Local development server
├── vercel.json           # Vercel configuration
└── package.json          # Dependencies

```

## 🔐 Security Features

✅ MongoDB credentials in environment variables  
✅ `.env` file excluded from Git  
✅ Uploads directory excluded from Git  
✅ API URLs configured automatically (local/production)  

## 🛠️ Available Scripts

- `npm run dev` - Start Vite development server
- `npm start` - Start Express backend server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## 📝 Notes

- **Local Development**: Uses local file uploads to `uploads/` folder
- **Production (Vercel)**: Uses Cloudinary for file storage
- **API URLs**: Automatically switch between local and production

## 🆘 Need Help?

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment guide and troubleshooting.
