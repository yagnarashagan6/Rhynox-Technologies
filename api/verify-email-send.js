import nodemailer from 'nodemailer';
import crypto from 'crypto';
import connectDB from './db.js';
import EmailVerification from './models/EmailVerification.js';

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD
    }
  });
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { email } = req.body;
    
    // Validate Gmail format with regex
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid Gmail address. Please enter a valid @gmail.com email address.' 
      });
    }

    // Generate 6-digit verification code
    const verificationCode = crypto.randomInt(100000, 999999).toString();

    // Delete any existing verification for this email
    await EmailVerification.deleteMany({ email });

    // Save new verification code
    const verification = new EmailVerification({
      email,
      verificationCode,
      isVerified: false
    });
    await verification.save();

    // Send verification email
    const transporter = createTransporter();
    const mailOptions = {
      from: `"Rhynox Technologies" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email - Rhynox Technologies',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Arial', sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 40px 20px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 28px; font-weight: bold; }
            .content { padding: 40px 30px; }
            .code-box { background: linear-gradient(135deg, #eff6ff 0%, #f3e8ff 100%); border: 2px dashed #3b82f6; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0; }
            .code { font-size: 42px; font-weight: bold; color: #3b82f6; letter-spacing: 8px; font-family: 'Courier New', monospace; }
            .message { color: #374151; line-height: 1.6; font-size: 16px; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
            .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; color: #92400e; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Email Verification</h1>
            </div>
            <div class="content">
              <p class="message">Hello,</p>
              <p class="message">Thank you for your interest in Rhynox Technologies! To complete your contact request, please verify your email address using the code below:</p>
              
              <div class="code-box">
                <div class="code">${verificationCode}</div>
              </div>
              
              <p class="message">Enter this code on our website to verify your email address and submit your message.</p>
              
              <div class="warning">
                <strong>⏰ Important:</strong> This code will expire in 10 minutes for security reasons.
              </div>
              
              <p class="message">If you didn't request this verification, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>© 2024 Rhynox Technologies. All rights reserved.</p>
              <p>Building digital experiences that grow your business.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    
    res.json({ 
      success: true, 
      message: 'Verification code sent to your email. Please check your inbox.' 
    });
  } catch (err) {
    console.error('Error sending verification email:', err);
    res.status(500).json({ 
      error: 'Failed to send verification email. Please try again.' 
    });
  }
}
