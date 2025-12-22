import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: String,
  category: { type: String, required: true },
  description: String,
  images: [{ type: String }],
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

export default mongoose.models.Project || mongoose.model('Project', projectSchema);
