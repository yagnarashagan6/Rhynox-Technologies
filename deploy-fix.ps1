# Quick Deployment Script for Contact Form Fix

Write-Host "🚀 Deploying Contact Form Email Fix..." -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (-not (Test-Path .git)) {
    Write-Host "❌ Git repository not found!" -ForegroundColor Red
    Write-Host "Please initialize git first: git init" -ForegroundColor Yellow
    exit 1
}

# Check for uncommitted changes
Write-Host "📝 Checking for changes..." -ForegroundColor Yellow
git status --short

Write-Host ""
Write-Host "📦 Adding all changes..." -ForegroundColor Yellow
git add .

Write-Host ""
Write-Host "💾 Committing changes..." -ForegroundColor Yellow
git commit -m "fix: downgrade nodemailer to v6.9.8 for Vercel serverless compatibility

- Downgraded nodemailer from v7.0.12 to v6.9.8
- Enhanced error handling in contact-send.js
- Added environment variable validation
- Improved error messages for debugging

This fixes the 500 Internal Server Error when sending contact form emails on Vercel."

Write-Host ""
Write-Host "🌐 Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host ""
Write-Host "✅ Changes pushed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Vercel will automatically start deploying" -ForegroundColor White
Write-Host "2. Go to https://vercel.com to monitor the deployment" -ForegroundColor White
Write-Host "3. Once deployed, test the contact form at https://www.rhynoxtechnologies.dev" -ForegroundColor White
Write-Host ""
Write-Host "🔍 To check deployment status:" -ForegroundColor Cyan
Write-Host "   Visit: https://vercel.com/dashboard" -ForegroundColor White
Write-Host ""
Write-Host "📧 Environment Variables to Verify:" -ForegroundColor Cyan
Write-Host "   - EMAIL_USER" -ForegroundColor White
Write-Host "   - EMAIL_APP_PASSWORD" -ForegroundColor White
Write-Host "   - MONGODB_URI" -ForegroundColor White
Write-Host ""
Write-Host "✨ Deployment initiated! Good luck! ✨" -ForegroundColor Green
