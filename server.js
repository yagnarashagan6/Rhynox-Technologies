import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    console.log("Multer processing file field:", file.fieldname);
    cb(null, true);
  }
});

// MongoDB Connection
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('ERROR: MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Project Schema
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: String,
  category: { type: String, required: true },
  description: String,
  images: [{ type: String }], // Changed from image to images array
  tags: [String],
  gradient: { type: String, default: "from-blue-600 to-indigo-600" },
  createdAt: { type: Date, default: Date.now },
  client: String,
  timeline: String,
  role: String,
  uploadedBy: String,
  challenges: [String],
  solutions: [String]
});

const Project = mongoose.model('Project', projectSchema);

// Email Verification Schema
const emailVerificationSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  verificationCode: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, expires: 600 } // Auto-delete after 10 minutes
});

const EmailVerification = mongoose.model('EmailVerification', emailVerificationSchema);

// Click Analytics Schema
const clickAnalyticsSchema = new mongoose.Schema({
  buttonType: { type: String, required: true, unique: true }, // 'whatsapp' or 'mobile'
  count: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

const ClickAnalytics = mongoose.model('ClickAnalytics', clickAnalyticsSchema);

// Nodemailer Configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD
    }
  });
};

// Click Analytics Routes
app.post('/api/analytics/click', async (req, res) => {
  try {
    const { buttonType } = req.body;
    if (!['whatsapp', 'mobile'].includes(buttonType)) {
      return res.status(400).json({ error: 'Invalid button type' });
    }

    const analytics = await ClickAnalytics.findOneAndUpdate(
      { buttonType },
      { $inc: { count: 1 }, updatedAt: Date.now() },
      { upsert: true, new: true }
    );

    res.json(analytics);
  } catch (err) {
    console.error('Error tracking click:', err);
    res.status(500).json({ error: 'Failed to track click' });
  }
});

app.get('/api/analytics/clicks', async (req, res) => {
  try {
    const analytics = await ClickAnalytics.find();
    res.json(analytics);
  } catch (err) {
    console.error('Error fetching analytics:', err);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Routes
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/projects', (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        console.error("Multer Error:", err.message, "Field:", err.field);
        return res.status(500).json({ error: `Multer Error: ${err.message} ${err.field ? `on field ${err.field}` : ''}` });
      }
      console.error("Upload Error:", err);
      return res.status(500).json({ error: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    console.log("Creating new project...");
    const { title, subtitle, category, description, tags, gradient, client, timeline, role, uploadedBy, imageStructure, challenges, solutions } = req.body;
    
    let imageUrls = [];
    if (imageStructure) {
        try {
            const structure = JSON.parse(imageStructure);
            const uploadedFiles = req.files ? req.files.filter(f => f.fieldname === 'images') : [];
            let fileIndex = 0;
            structure.forEach(item => {
                if (item.type === 'url') {
                    imageUrls.push(item.value);
                } else if (item.type === 'file' && uploadedFiles[fileIndex]) {
                    const file = uploadedFiles[fileIndex];
                    imageUrls.push(`${req.protocol}://${req.get('host')}/uploads/${file.filename}`);
                    fileIndex++;
                }
            });
        } catch (parseErr) {
            console.error("Error parsing imageStructure in POST:", parseErr);
            return res.status(400).json({ error: "Invalid image structure data" });
        }
    } else {
        imageUrls = req.files 
          ? req.files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`)
          : [];
    }

    // Parse tags if it's a string
    let parsedTags = [];
    if (typeof tags === 'string') {
        parsedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    } else if (Array.isArray(tags)) {
        parsedTags = tags;
    }

    // Parse challenges if it's a string
    let parsedChallenges = [];
    if (typeof challenges === 'string') {
        parsedChallenges = challenges.split(',').map(c => c.trim()).filter(c => c.length > 0);
    } else if (Array.isArray(challenges)) {
        parsedChallenges = challenges;
    }

    // Parse solutions if it's a string
    let parsedSolutions = [];
    if (typeof solutions === 'string') {
        parsedSolutions = solutions.split(',').map(s => s.trim()).filter(s => s.length > 0);
    } else if (Array.isArray(solutions)) {
        parsedSolutions = solutions;
    }

    const newProject = new Project({
      title,
      subtitle,
      category,
      description,
      images: imageUrls,
      tags: parsedTags,
      gradient,
      client,
      timeline,
      role,
      uploadedBy,
      challenges: parsedChallenges,
      solutions: parsedSolutions
    });
    await newProject.save();
    console.log("New project created successfully.");
    res.status(201).json(newProject);
  } catch (err) {
    console.error("Error saving project:", err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProject = await Project.findByIdAndDelete(id);
    if (!deletedProject) {
      return res.status(404).json({ error: "Project not found" });
    }
    
    // Delete all image files associated with the project
    if (deletedProject.images && deletedProject.images.length > 0) {
        deletedProject.images.forEach(imageUrl => {
            const imageName = imageUrl.split('/').pop();
            const imagePath = path.join(__dirname, 'uploads', imageName);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        });
    }

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/projects/:id', (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        console.error("Multer Error:", err.message, "Field:", err.field);
        return res.status(500).json({ error: `Multer Error: ${err.message} ${err.field ? `on field ${err.field}` : ''}` });
      }
      console.error("Upload Error:", err);
      return res.status(500).json({ error: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Updating project ${id}...`);
    
    const { title, subtitle, category, description, tags, gradient, client, timeline, role, imageStructure, challenges, solutions } = req.body;
    
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Update fields
    project.title = title || project.title;
    project.subtitle = subtitle || project.subtitle;
    project.category = category || project.category;
    project.description = description || project.description;
    project.gradient = gradient || project.gradient;
    project.client = client || project.client;
    project.timeline = timeline || project.timeline;
    project.role = role || project.role;

    // Update tags
    if (tags) {
        if (typeof tags === 'string') {
            project.tags = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        } else if (Array.isArray(tags)) {
            project.tags = tags;
        }
    }

    // Update challenges
    if (challenges !== undefined) {
        if (typeof challenges === 'string') {
            project.challenges = challenges.split(',').map(c => c.trim()).filter(c => c.length > 0);
        } else if (Array.isArray(challenges)) {
            project.challenges = challenges;
        }
    }

    // Update solutions
    if (solutions !== undefined) {
        if (typeof solutions === 'string') {
            project.solutions = solutions.split(',').map(s => s.trim()).filter(s => s.length > 0);
        } else if (Array.isArray(solutions)) {
            project.solutions = solutions;
        }
    }

    // Handle Image Updates
    if (imageStructure) {
        try {
            const structure = JSON.parse(imageStructure);
            const uploadedFiles = req.files ? req.files.filter(f => f.fieldname === 'images') : [];
            const newImages = [];
            let fileIndex = 0;

            structure.forEach(item => {
                if (item.type === 'url') {
                    newImages.push(item.value);
                } else if (item.type === 'file' && uploadedFiles[fileIndex]) {
                    const file = uploadedFiles[fileIndex];
                    newImages.push(`${req.protocol}://${req.get('host')}/uploads/${file.filename}`);
                    fileIndex++;
                }
            });

            // Identify images to delete from disk (only if they are local uploads)
            if (project.images && project.images.length > 0) {
                const baseUrl = `${req.protocol}://${req.get('host')}/uploads/`;
                project.images.forEach(oldUrl => {
                    if (oldUrl.startsWith(baseUrl) && !newImages.includes(oldUrl)) {
                        const oldImageName = oldUrl.split('/').pop();
                        const oldImagePath = path.join(__dirname, 'uploads', oldImageName);
                        if (fs.existsSync(oldImagePath)) {
                            try {
                                fs.unlinkSync(oldImagePath);
                            } catch (unlinkErr) {
                                console.error(`Failed to delete old image: ${oldImagePath}`, unlinkErr);
                            }
                        }
                    }
                });
            }

            project.images = newImages;
        } catch (parseErr) {
            console.error("Error parsing imageStructure:", parseErr);
            return res.status(400).json({ error: "Invalid image structure data" });
        }
    }

    await project.save();
    console.log(`Project ${id} updated successfully.`);
    res.json(project);
  } catch (err) {
    console.error("Error updating project:", err);
    res.status(500).json({ error: err.message });
  }
});

// Email Verification Routes
// Send verification email
app.post('/api/verify-email/send', async (req, res) => {
  try {
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
});

// Verify code
app.post('/api/verify-email/confirm', async (req, res) => {
  try {
    const { email, code } = req.body;
    
    const verification = await EmailVerification.findOne({ 
      email, 
      verificationCode: code 
    });

    if (!verification) {
      return res.status(400).json({ 
        error: 'Invalid verification code. Please check and try again.' 
      });
    }

    // Mark as verified
    verification.isVerified = true;
    await verification.save();

    res.json({ 
      success: true, 
      message: 'Email verified successfully!' 
    });
  } catch (err) {
    console.error('Error verifying code:', err);
    res.status(500).json({ 
      error: 'Verification failed. Please try again.' 
    });
  }
});

// Contact Form Submission
app.post('/api/contact/send', async (req, res) => {
  try {
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
    
    // Email to Rhynox Technologies
    const mailToRhynox = {
      from: `"Rhynox Technologies Contact Form" <${process.env.EMAIL_USER}>`,
      to: 'rhynoxtechnologies@gmail.com, yaknarashagan2@gmail.com',
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
              
              <div style="background: #f0f4ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #3b82f6; margin-top: 0;">📞 Contact Us</h3>
                <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:rhynoxtechnologies@gmail.com" style="color: #3b82f6; text-decoration: none;">rhynoxtechnologies@gmail.com</a></p>
                <p style="margin: 8px 0;"><strong>Phone:</strong> <a href="tel:+918148311669" style="color: #3b82f6; text-decoration: none;">+91 81483 11669</a></p>
                <p style="margin: 8px 0;"><strong>Website:</strong> <a href="https://rhynoxtechnologies.dev" style="color: #3b82f6; text-decoration: none;">rhynoxtechnologies.dev</a></p>
              </div>
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
    res.status(500).json({ 
      error: 'Failed to send message. Please try again.' 
    });
  }
});

// Chatbot Order Submission
app.post('/api/chatbot-order', async (req, res) => {
  try {
    const { service, name, email, phone, details } = req.body;

    // Validate required fields
    if (!service || !name || !email || !phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Generate order ID
    const orderId = `RHX-${Date.now().toString().slice(-8)}`;
    const orderDate = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const transporter = createTransporter();

    // Email to Admin/Company (Rhynox)
    const adminMailOptions = {
        from: `"Rhynox Chatbot Order" <${process.env.EMAIL_USER}>`,
        to: 'rhynoxtechnologies@gmail.com, yaknarashagan2@gmail.com', // Assuming this is the admin email
        subject: `🚀 New Order from Chatbot - ${service}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
              .detail-row { display: flex; padding: 10px 0; border-bottom: 1px solid #eee; }
              .detail-label { font-weight: bold; width: 150px; color: #667eea; }
              .detail-value { flex: 1; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
              .badge { background: #667eea; color: white; padding: 5px 15px; border-radius: 20px; font-size: 12px; display: inline-block; margin: 10px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 New Order Received!</h1>
                <p>Order from Rhynox Chatbot</p>
                <span class="badge">Order ID: ${orderId}</span>
              </div>
              <div class="content">
                <h2 style="color: #667eea;">Order Details</h2>
                <div class="order-details">
                  <div class="detail-row">
                    <div class="detail-label">📦 Service:</div>
                    <div class="detail-value"><strong>${service}</strong></div>
                  </div>
                  <div class="detail-row">
                    <div class="detail-label">👤 Name:</div>
                    <div class="detail-value">${name}</div>
                  </div>
                  <div class="detail-row">
                    <div class="detail-label">📧 Email:</div>
                    <div class="detail-value">${email}</div>
                  </div>
                  <div class="detail-row">
                    <div class="detail-label">📱 Phone:</div>
                    <div class="detail-value">${phone}</div>
                  </div>
                  <div class="detail-row">
                    <div class="detail-label">📝 Details:</div>
                    <div class="detail-value">${details || 'No additional details provided'}</div>
                  </div>
                  <div class="detail-row">
                    <div class="detail-label">🕐 Date:</div>
                    <div class="detail-value">${orderDate}</div>
                  </div>
                </div>
                <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 5px; margin-top: 20px;">
                  <strong>⚡ Action Required:</strong>
                  <p style="margin: 10px 0 0 0;">Please contact the customer within 24 hours to discuss project requirements and provide a detailed quote.</p>
                </div>
              </div>
              <div class="footer">
                <p>This is an automated message from Rhynox Chatbot System</p>
                <p>&copy; ${new Date().getFullYear()} Rhynox. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
    };

    // Email to Customer
    const customerMailOptions = {
        from: `"Rhynox Technologies" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Order Confirmation - ${service} | Rhynox`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .order-summary { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .success-badge { background: #10b981; color: white; padding: 10px 20px; border-radius: 25px; display: inline-block; margin: 10px 0; }
              .next-steps { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .step { display: flex; align-items: start; margin: 15px 0; }
              .step-number { background: #667eea; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; flex-shrink: 0; }
              .contact-info { background: #f0f4ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
              .button { background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✅ Order Confirmed!</h1>
                <div class="success-badge">Order ID: ${orderId}</div>
              </div>
              <div class="content">
                <p>Hi <strong>${name}</strong>,</p>
                <p>Thank you for choosing Rhynox! We're excited to work on your project.</p>
                
                <div class="order-summary">
                  <h3 style="color: #667eea; margin-top: 0;">📦 Your Order Summary</h3>
                  <p><strong>Service:</strong> ${service}</p>
                  <p><strong>Order Date:</strong> ${orderDate}</p>
                  ${details ? `<p><strong>Project Details:</strong> ${details}</p>` : ''}
                </div>
  
                <div class="next-steps">
                  <h3 style="color: #667eea; margin-top: 0;">📋 What Happens Next?</h3>
                  <div class="step">
                    <div class="step-number">1</div>
                    <div>
                      <strong>We'll Contact You</strong>
                      <p style="margin: 5px 0 0 0;">Our team will reach out within 24 hours to discuss your requirements in detail.</p>
                    </div>
                  </div>
                  <div class="step">
                    <div class="step-number">2</div>
                    <div>
                      <strong>Project Planning</strong>
                      <p style="margin: 5px 0 0 0;">We'll create a detailed project plan and provide you with a comprehensive quote.</p>
                    </div>
                  </div>
                  <div class="step">
                    <div class="step-number">3</div>
                    <div>
                      <strong>Development Begins</strong>
                      <p style="margin: 5px 0 0 0;">Once approved, our expert team will start bringing your vision to life.</p>
                    </div>
                  </div>
                </div>
  
                <div class="contact-info">
                  <h3 style="color: #667eea; margin-top: 0;">📞 Need Immediate Assistance?</h3>
                  <p><strong>Email:</strong> <a href="mailto:rhynoxtechnologies@gmail.com" style="color: #667eea; text-decoration: none;">rhynoxtechnologies@gmail.com</a></p>
                  <p><strong>Phone:</strong> <a href="tel:+918148311669" style="color: #667eea; text-decoration: none;">+91 81483 11669</a></p>
                  <p><strong>Website:</strong> <a href="https://rhynoxtechnologies.dev" style="color: #667eea; text-decoration: none;">rhynoxtechnologies.dev</a></p>
                  <p style="margin-bottom: 0;"><strong>Business Hours:</strong> Mon-Sat, 9 AM - 7 PM IST</p>
                </div>
  
                <div style="text-align: center; margin: 30px 0;">
                  <a href="https://rhynoxtechnologies.dev" class="button">Visit Our Website</a>
                </div>
              </div>
              <div class="footer">
                <p>Thank you for trusting Rhynox with your digital needs!</p>
                <p>&copy; ${new Date().getFullYear()} Rhynox. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
    };

    // Send emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(customerMailOptions);

    res.json({
        success: true,
        message: 'Order placed successfully',
        orderId,
    });
  } catch (err) {
    console.error('Chatbot order error:', err);
    res.status(500).json({ 
      error: 'Failed to process order',
      details: err.message 
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
