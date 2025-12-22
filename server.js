import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
