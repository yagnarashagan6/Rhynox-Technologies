# 🧪 Testing Guide - Contact Form Email Fix

## Pre-Deployment Testing (Local)

### 1. Test Locally First

Make sure your `.env` file has these variables:
```env
EMAIL_USER=rhynoxtechnologies@gmail.com
EMAIL_APP_PASSWORD=your-16-char-app-password
MONGODB_URI=your-mongodb-connection-string
```

### 2. Start the Backend Server

```bash
npm start
```

The server should start on `http://localhost:3000`

### 3. Start the Frontend (in another terminal)

```bash
npm run dev
```

The frontend should start on `http://localhost:5173`

### 4. Test the Contact Form Locally

1. Open `http://localhost:5173` in your browser
2. Navigate to the contact form section
3. Fill in the form with a Gmail address
4. Click "Verify Email"
5. Check your email for the verification code
6. Enter the code and submit
7. Check if the email arrives at rhynoxtechnologies@gmail.com

**Expected Result**: ✅ Email should be sent successfully

---

## Post-Deployment Testing (Production)

### 1. Wait for Vercel Deployment

- Go to https://vercel.com/dashboard
- Check that the deployment is complete
- Look for the green "Ready" status

### 2. Check Vercel Function Logs

1. Go to Vercel Dashboard → Your Project
2. Click on "Deployments"
3. Click on the latest deployment
4. Go to "Functions" tab
5. Look for `/api/contact/send`
6. Check for any errors

### 3. Test on Production

#### Test Email Verification

1. Go to https://www.rhynoxtechnologies.dev
2. Scroll to the contact form
3. Enter a Gmail address
4. Click "Verify Email"
5. Check your email inbox

**Expected Result**: 
- ✅ You should receive a 6-digit verification code
- ✅ No errors in browser console
- ✅ Success message appears

#### Test Contact Form Submission

1. Enter the verification code
2. Fill out the rest of the form:
   - Name: Your Name
   - Service: Select a service
   - Message: Test message
3. Click "Send Message"

**Expected Result**:
- ✅ Success message appears
- ✅ No 500 errors in console
- ✅ Email arrives at rhynoxtechnologies@gmail.com

### 4. Verify Email Content

Check the email at rhynoxtechnologies@gmail.com:

**Should contain**:
- ✅ Subject: "New Quote Request: [Service] from [Name]"
- ✅ Sender name, email (with verified badge)
- ✅ Service interested in
- ✅ Message content
- ✅ Professional HTML formatting

---

## Troubleshooting Tests

### Test 1: Check Environment Variables

```bash
# In Vercel Dashboard → Settings → Environment Variables
# Verify these exist:
EMAIL_USER
EMAIL_APP_PASSWORD
MONGODB_URI
```

### Test 2: Check Vercel Function Logs

Look for these specific errors:

| Error Message | Solution |
|--------------|----------|
| `Email configuration missing` | Set EMAIL_USER and EMAIL_APP_PASSWORD in Vercel |
| `Invalid credentials` | Regenerate Gmail App Password |
| `Email not verified` | Complete email verification first |
| `createTransport is not a function` | Should be fixed with v6.9.8 |

### Test 3: Test with Different Emails

Try with multiple Gmail addresses to ensure consistency:
- ✅ Personal Gmail
- ✅ Work Gmail
- ✅ Test Gmail account

### Test 4: Check MongoDB Connection

The verification should be stored in MongoDB:

1. Go to MongoDB Atlas
2. Check the `emailverifications` collection
3. After successful submission, the record should be deleted

---

## Performance Tests

### Email Delivery Time

- **Verification Email**: Should arrive within 10-30 seconds
- **Contact Form Email**: Should arrive within 10-30 seconds

### Response Times

- **Verify Email API**: < 2 seconds
- **Contact Send API**: < 3 seconds

---

## Edge Cases to Test

### 1. Invalid Email Format
- Enter non-Gmail address
- **Expected**: Error message "Invalid Gmail address"

### 2. Expired Verification Code
- Wait 10+ minutes after receiving code
- Try to submit
- **Expected**: Error message "Verification expired"

### 3. Wrong Verification Code
- Enter incorrect code
- **Expected**: Error message "Invalid verification code"

### 4. Duplicate Submission
- Submit form twice quickly
- **Expected**: Second submission should fail (email already verified)

### 5. Missing Fields
- Leave fields empty
- **Expected**: Validation errors

---

## Success Criteria

### ✅ All Tests Pass When:

1. Email verification sends code successfully
2. Contact form submits without 500 errors
3. Email arrives at rhynoxtechnologies@gmail.com
4. Email content is properly formatted
5. Verification records are cleaned up
6. No errors in Vercel function logs
7. No errors in browser console

---

## Monitoring After Deployment

### First 24 Hours

- Monitor Vercel function logs
- Check for any 500 errors
- Verify email delivery rate
- Test from different devices/browsers

### Ongoing

- Weekly test of contact form
- Monthly check of Gmail App Password validity
- Monitor MongoDB for orphaned verification records

---

## Rollback Plan (If Needed)

If the fix doesn't work:

1. Revert nodemailer version:
   ```bash
   npm install nodemailer@7.0.12
   ```

2. Commit and push:
   ```bash
   git add package.json package-lock.json
   git commit -m "revert: rollback nodemailer to v7.0.12"
   git push origin main
   ```

3. Investigate alternative solutions:
   - Use SendGrid instead of Gmail
   - Use Resend.com for email delivery
   - Implement custom SMTP solution

---

**Testing Status**: Ready to test ✅
**Last Updated**: December 23, 2024
