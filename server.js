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
  uploadedBy: String
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
    const { title, subtitle, category, description, tags, gradient, client, timeline, role, uploadedBy, imageStructure } = req.body;
    
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
      uploadedBy
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
    
    const { title, subtitle, category, description, tags, gradient, client, timeline, role, imageStructure } = req.body;
    
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

    await transporter.sendMail(mailToRhynox);
    
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
