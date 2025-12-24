import nodemailer from 'nodemailer';
import connectDB from './db.js';
import EmailVerification from './models/EmailVerification.js';

const createTransporter = () => {
  // Validate environment variables
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    throw new Error('Email configuration missing. Please set EMAIL_USER and EMAIL_APP_PASSWORD environment variables.');
  }

  // Create transporter with nodemailer v6.9.8
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD
    }
  });

  return transporter;
};

export default async function handler(req, res) {
  // Enable CORS
  const allowedOrigins = [
    'https://www.rhynoxtechnologies.dev',
    'https://rhynoxtechnologies.dev',
    'https://rhynox-technologies.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin) || !origin) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  
  res.setHeader('Access-Control-Allow-Credentials', true);
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

    const { name, email, service, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !service || !message) {
      return res.status(400).json({ 
        error: 'All fields are required.' 
      });
    }

    // Verify that the email was verified
    const verification = await EmailVerification.findOne({ 
      email, 
      isVerified: true 
    });

    if (!verification) {
      return res.status(400).json({ 
        error: 'Email not verified. Please verify your email first.' 
      });
    }

    // Send email to Rhynox Technologies
    const transporter = createTransporter();
    
    const mailToRhynox = {
      from: `"Rhynox Technologies Contact Form" <${process.env.EMAIL_USER}>`,
      to: 'rhynoxtechnologies@gmail.com',
      replyTo: email,
      subject: `New Quote Request: ${service} from ${name}`,
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
            .info-row { margin: 20px 0; padding: 15px; background: #f9fafb; border-left: 4px solid #3b82f6; border-radius: 4px; }
            .label { font-weight: bold; color: #374151; margin-bottom: 5px; }
            .value { color: #6b7280; }
            .message-box { background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
            .badge { display: inline-block; background: #3b82f6; color: white; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📧 New Contact Request</h1>
            </div>
            <div class="content">
              <p style="color: #374151; font-size: 16px;">You have received a new quote request from your website:</p>
              
              <div class="info-row">
                <div class="label">Name:</div>
                <div class="value">${name}</div>
              </div>
              
              <div class="info-row">
                <div class="label">Email: <span class="badge">✓ Verified</span></div>
                <div class="value">${email}</div>
              </div>
              
              <div class="info-row">
                <div class="label">Service Interested In:</div>
                <div class="value">${service}</div>
              </div>
              
              <div class="message-box">
                <div class="label">Message:</div>
                <p style="color: #374151; line-height: 1.6; margin-top: 10px;">${message}</p>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                💡 You can reply directly to this email to respond to ${name}.
              </p>
            </div>
            <div class="footer">
              <p>© 2024 Rhynox Technologies. All rights reserved.</p>
              <p>This is an automated message from your website contact form.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const mailToClient = {
      from: `"Rhynox Technologies" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Thank you for contacting Rhynox Technologies`,
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
            .info-row { margin: 20px 0; padding: 15px; background: #f9fafb; border-left: 4px solid #3b82f6; border-radius: 4px; }
            .label { font-weight: bold; color: #374151; margin-bottom: 5px; }
            .value { color: #6b7280; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>👋 Thank You!</h1>
            </div>
            <div class="content">
              <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hi ${name},</p>
              <p style="color: #374151; font-size: 16px; line-height: 1.6;">Thanks for reaching out! We've received your inquiry regarding <strong>${service}</strong>.</p>
              
              <div class="info-row">
                <div class="label">We'll be in touch soon!</div>
                <div class="value">Our team is reviewing your details and will get back to you within 24 hours.</div>
              </div>

              <p style="color: #374151; font-size: 16px; line-height: 1.6;">If you have any urgent questions, feel free to reply to this email.</p>
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

    await transporter.sendMail(mailToRhynox);
    await transporter.sendMail(mailToClient);
    
    // Clean up verification record after successful submission
    await EmailVerification.deleteOne({ email });
    
    res.json({ 
      success: true, 
      message: 'Your message has been sent successfully! We will contact you shortly.' 
    });
  } catch (err) {
    console.error('Error sending contact email:', err);
    console.error('Error details:', {
      message: err.message,
      stack: err.stack,
      name: err.name
    });
    
    // Provide more specific error message
    let errorMessage = 'Failed to send message. Please try again.';
    if (err.message && err.message.includes('Email configuration')) {
      errorMessage = 'Email service is not configured properly. Please contact support.';
    } else if (err.message && err.message.includes('createTransport')) {
      errorMessage = 'Email service initialization failed. Please contact support.';
    }
    
    res.status(500).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}
