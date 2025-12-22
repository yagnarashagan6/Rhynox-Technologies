# Rhynox Technologies Website

A modern, full-stack website for Rhynox Technologies built with React, Vite, Tailwind CSS, Framer Motion, Express, and MongoDB.

## ✨ Features

### Frontend
- ✨ Modern UI/UX with smooth animations
- 🎨 Tailwind CSS for styling
- 🚀 Framer Motion for animations
- 📱 Fully responsive design
- 🎯 Interactive navigation dock
- 💼 Portfolio showcase with modal details
- 📧 Contact form integration
- 🎭 Service cards and pricing plans

### Backend
- 🔐 Admin authentication system
- 📊 Admin dashboard for project management
- 🖼️ Multiple image upload support
- 🗄️ MongoDB database integration
- 🌐 RESTful API
- ☁️ Cloudinary integration for production file storage

### Security
- 🔒 Environment variables for sensitive data
- 🚫 MongoDB credentials protected
- 📁 Uploads directory excluded from Git
- 🛡️ Secure API configuration

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Git
- MongoDB Atlas account (for database)
- Cloudinary account (for production deployment)

### Installation

1. **Clone the repository:**
```bash
git clone <your-repo-url>
cd rhynox-technologies-main
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
Create a `.env` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. **Run the application:**

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

## 📦 Dependencies

### Core Dependencies
- `react` (^19.2.0) - UI library
- `react-dom` (^19.2.0) - React DOM rendering
- `framer-motion` (^12.23.26) - Animation library
- `lucide-react` (^0.562.0) - Icon library
- `express` (^5.2.1) - Backend framework
- `mongoose` (^9.0.2) - MongoDB ODM
- `cors` (^2.8.5) - CORS middleware
- `multer` (^2.0.2) - File upload handling
- `dotenv` (^16.4.5) - Environment variables
- `cloudinary` (^1.41.3) - Cloud file storage
- `multiparty` (^4.2.3) - Form data parsing

### Development Dependencies
- `vite` (^7.2.4) - Build tool
- `@vitejs/plugin-react` (^5.1.1) - Vite React plugin
- `tailwindcss` (^3.4.17) - CSS framework
- `@tailwindcss/postcss` (^4.1.18) - PostCSS plugin
- `postcss` (^8.5.6) - CSS processor
- `autoprefixer` (^10.4.23) - CSS autoprefixer
- `eslint` (^9.39.1) - Linting tool

## 🏗️ Project Structure

```
rhynox-technologies-main/
├── api/                      # Vercel Serverless Functions
│   ├── db.js                # Database connection with caching
│   ├── index.js             # Main API handler
│   └── models/
│       └── Project.js       # Project model
├── public/                  # Static assets
├── src/
│   ├── assets/             # Images and other assets
│   ├── App.jsx             # Main application component
│   ├── AdminDashboard.jsx  # Admin panel
│   ├── AdminLogin.jsx      # Admin login
│   ├── config.js           # API configuration
│   ├── App.css             # Component styles
│   ├── index.css           # Global styles
│   └── main.jsx            # Application entry point
├── uploads/                # Local file uploads (not in Git)
├── .env                    # Environment variables (not in Git)
├── .env.example            # Example environment file
├── .gitignore             # Git ignore rules
├── .vercelignore          # Vercel ignore rules
├── server.js              # Express backend server
├── vercel.json            # Vercel configuration
├── index.html             # HTML template
├── tailwind.config.js     # Tailwind configuration
├── postcss.config.js      # PostCSS configuration
├── vite.config.js         # Vite configuration
├── DEPLOYMENT.md          # Deployment guide
├── QUICKSTART.md          # Quick start guide
└── package.json           # Project dependencies
```

## 🌐 Deployment to Vercel

This project is configured for easy deployment to Vercel with both frontend and backend.

### Quick Deploy

1. **Set up Cloudinary** (required for file uploads in production)
   - Create account at [cloudinary.com](https://cloudinary.com)
   - Get your Cloud Name, API Key, and API Secret

2. **Push to Git**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

3. **Deploy to Vercel**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Import your repository
   - Add environment variables (see DEPLOYMENT.md)
   - Deploy!

For detailed deployment instructions, see **[DEPLOYMENT.md](./DEPLOYMENT.md)**

## 🔧 Available Scripts

- `npm run dev` - Start Vite development server
- `npm start` - Start Express backend server
- `npm run build` - Build for production
- `npm run vercel-build` - Build for Vercel deployment
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## 🔐 Security Features

- ✅ MongoDB credentials stored in environment variables
- ✅ `.env` file excluded from Git
- ✅ Uploads directory excluded from Git
- ✅ API URLs automatically configured for local/production
- ✅ Secure admin authentication
- ✅ Protected API endpoints

## 📚 Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Comprehensive deployment guide
- **[QUICKSTART.md](./QUICKSTART.md)** - Quick reference guide
- **[SUMMARY.md](./SUMMARY.md)** - Configuration summary

## 🎯 Key Features Explained

### Admin Dashboard
- Upload and manage projects
- Multiple image support per project
- Edit and delete projects
- View project analytics

### API Endpoints
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### File Upload System
- **Local Development**: Files saved to `uploads/` folder
- **Production (Vercel)**: Files uploaded to Cloudinary
- Automatic switching based on environment

## 🆘 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB Atlas allows connections from `0.0.0.0/0`
- Verify connection string in `.env`

### File Upload Issues
- Check Cloudinary credentials
- Verify environment variables in Vercel

For more troubleshooting, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📞 Contact

For inquiries, reach out to:
- Email: rhynoxtechnologies@gmail.com
- Phone: +91 79043 09363, +91 63740 08719

## 📄 License

© 2024 Rhynox Technologies. All rights reserved.

---

**Made with ❤️ by Rhynox Technologies**

