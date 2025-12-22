import connectDB from './db.js';
import Project from './models/Project.js';
import multiparty from 'multiparty';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary (you'll need to add these to Vercel env vars)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to parse multipart form data
const parseForm = (req) => {
  return new Promise((resolve, reject) => {
    const form = new multiparty.Form();
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

// Helper to upload to Cloudinary
const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(file.path, {
      folder: 'rhynox-projects',
      resource_type: 'auto'
    }, (error, result) => {
      if (error) reject(error);
      else resolve(result.secure_url);
    });
  });
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
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    await connectDB();

    // GET all projects
    if (req.method === 'GET') {
      const projects = await Project.find().sort({ createdAt: -1 });
      return res.status(200).json(projects);
    }

    // POST new project
    if (req.method === 'POST') {
      const { fields, files } = await parseForm(req);
      
      const title = fields.title?.[0];
      const subtitle = fields.subtitle?.[0];
      const category = fields.category?.[0];
      const description = fields.description?.[0];
      const tags = fields.tags?.[0];
      const gradient = fields.gradient?.[0];
      const client = fields.client?.[0];
      const timeline = fields.timeline?.[0];
      const role = fields.role?.[0];
      const uploadedBy = fields.uploadedBy?.[0];
      const imageStructure = fields.imageStructure?.[0];

      let imageUrls = [];
      
      if (imageStructure) {
        const structure = JSON.parse(imageStructure);
        const uploadedFiles = files.images || [];
        let fileIndex = 0;
        
        for (const item of structure) {
          if (item.type === 'url') {
            imageUrls.push(item.value);
          } else if (item.type === 'file' && uploadedFiles[fileIndex]) {
            const url = await uploadToCloudinary(uploadedFiles[fileIndex]);
            imageUrls.push(url);
            fileIndex++;
          }
        }
      } else if (files.images) {
        for (const file of files.images) {
          const url = await uploadToCloudinary(file);
          imageUrls.push(url);
        }
      }

      const parsedTags = typeof tags === 'string' 
        ? tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : [];

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
      return res.status(201).json(newProject);
    }

    // DELETE project
    if (req.method === 'DELETE') {
      const { id } = req.query;
      const deletedProject = await Project.findByIdAndDelete(id);
      
      if (!deletedProject) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      return res.status(200).json({ message: 'Project deleted successfully' });
    }

    // PUT update project
    if (req.method === 'PUT') {
      const { id } = req.query;
      const { fields, files } = await parseForm(req);
      
      const project = await Project.findById(id);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      // Update basic fields
      if (fields.title?.[0]) project.title = fields.title[0];
      if (fields.subtitle?.[0]) project.subtitle = fields.subtitle[0];
      if (fields.category?.[0]) project.category = fields.category[0];
      if (fields.description?.[0]) project.description = fields.description[0];
      if (fields.gradient?.[0]) project.gradient = fields.gradient[0];
      if (fields.client?.[0]) project.client = fields.client[0];
      if (fields.timeline?.[0]) project.timeline = fields.timeline[0];
      if (fields.role?.[0]) project.role = fields.role[0];

      // Update tags
      if (fields.tags?.[0]) {
        const tags = fields.tags[0];
        project.tags = typeof tags === 'string'
          ? tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
          : [];
      }

      // Handle image updates
      if (fields.imageStructure?.[0]) {
        const structure = JSON.parse(fields.imageStructure[0]);
        const uploadedFiles = files.images || [];
        const newImages = [];
        let fileIndex = 0;

        for (const item of structure) {
          if (item.type === 'url') {
            newImages.push(item.value);
          } else if (item.type === 'file' && uploadedFiles[fileIndex]) {
            const url = await uploadToCloudinary(uploadedFiles[fileIndex]);
            newImages.push(url);
            fileIndex++;
          }
        }

        project.images = newImages;
      }

      await project.save();
      return res.status(200).json(project);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
