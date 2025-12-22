# 🚀 Quick Start - Email Verification

## ⚡ 3-Minute Setup

### 1. Get Gmail App Password (2 minutes)
1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification** (if not already enabled)
3. Click **App passwords** → **Mail** → **Other**
4. Name it "Rhynox Website" → **Generate**
5. **Copy the 16-character password**

### 2. Update .env File (30 seconds)
Add these lines to your `.env` file:

```env
EMAIL_USER=your_email@gmail.com
EMAIL_APP_PASSWORD=your_16_char_password
```

### 3. Restart Server (30 seconds)
```bash
# Stop current server (Ctrl+C)
npm start
```

## ✅ Done!

Test it by:
1. Go to Contact section
2. Enter your Gmail
3. Click "Send Verification Code"
4. Check your inbox
5. Enter the code
6. Submit the form

---

## 🎯 What Changed?

### Frontend (App.jsx):
- ✅ Gmail regex validation
- ✅ Verification code UI
- ✅ Email verification state management
- ✅ Beautiful animations and feedback

### Backend (server.js):
- ✅ Email verification schema
- ✅ Nodemailer integration
- ✅ `/api/verify-email/send` endpoint
- ✅ `/api/verify-email/confirm` endpoint

### Dependencies:
- ✅ `nodemailer` installed

---

## 🔥 Key Features

1. **Regex Validation**: Only `@gmail.com` addresses accepted
2. **6-Digit Codes**: Sent via email, expire in 10 minutes
3. **Secure**: Cryptographically random codes
4. **Beautiful**: Professional email template
5. **User-Friendly**: Clear feedback and error messages

---

## 📧 Email Preview

Users receive:
```
🔐 Email Verification

Hello,

Thank you for your interest in Rhynox Technologies!

┌─────────────┐
│   123456    │  ← 6-digit code
└─────────────┘

⏰ Expires in 10 minutes
```

---

## 🐛 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Email not sending | Check `.env` has correct credentials |
| Code not arriving | Check spam folder, wait 1-2 minutes |
| Invalid code error | Ensure exact 6 digits, check expiration |
| Server error | Restart server after `.env` changes |

---

## 📚 Full Documentation

See `EMAIL-VERIFICATION-SETUP.md` for complete details.

---

**Status**: ✅ Ready to use!
