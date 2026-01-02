import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, Activity, BarChart2, Settings, LogOut, Upload, Folder, User, Trash2, Edit2, Calendar, Plus, X, MessageCircle, Phone } from 'lucide-react';
import { API_ENDPOINTS } from './config';
import { getSafeImageUrl } from './utils/imageUtils';

const AdminDashboard = ({ user }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [uploadedProjects, setUploadedProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  
  const [analytics, setAnalytics] = useState({ whatsapp: 0, mobile: 0 });

  const stats = [
    { title: 'Total Revenue', value: '₹12,45,000', icon: <DollarSign size={24} />, color: 'bg-green-500/20 text-green-500' },
    { title: 'Active Projects', value: uploadedProjects.length, icon: <Activity size={24} />, color: 'bg-blue-500/20 text-blue-500' },
    { title: 'WhatsApp Clicks', value: analytics.whatsapp, icon: <MessageCircle size={24} />, color: 'bg-[#25D366]/20 text-[#25D366]' },
    { title: 'Mobile Clicks', value: analytics.mobile, icon: <Phone size={24} />, color: 'bg-purple-500/20 text-purple-500' },
  ];

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    category: 'Web Dev',
    description: '',
    images: [], // This will now store { type: 'url' | 'file', value: string | File }
    tags: '',
    client: '',
    timeline: '',
    role: '',
    challenges: '',
    solutions: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);
  const [replacingIndex, setReplacingIndex] = useState(null);

  useEffect(() => {
    fetchProjects();
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.ANALYTICS_CLICKS);
      if (res.ok) {
        const data = await res.json();
        const counts = { whatsapp: 0, mobile: 0 };
        data.forEach(item => {
          if (counts.hasOwnProperty(item.buttonType)) {
            counts[item.buttonType] = item.count;
          }
        });
        setAnalytics(counts);
      }
    } catch (err) {
      console.error("Failed to fetch analytics", err);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.PROJECTS);
      if (res.ok) {
        const data = await res.json();
        const sanitizedData = data.map(project => ({
          ...project,
          image: getSafeImageUrl(project.image),
          images: project.images?.map(getSafeImageUrl) || []
        }));
        setUploadedProjects(sanitizedData);
      }
    } catch (err) {
      console.error("Failed to fetch projects", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'images') {
      const newFiles = Array.from(files).map(file => ({ 
        type: 'file', 
        value: file,
        preview: URL.createObjectURL(file)
      }));
      
      if (replacingIndex !== null) {
        // Replace specific image
        setFormData(prev => {
          const newImages = [...prev.images];
          // Revoke old object URL if it exists
          if (newImages[replacingIndex]?.type === 'file') {
            URL.revokeObjectURL(newImages[replacingIndex].preview);
          }
          newImages[replacingIndex] = newFiles[0];
          return { ...prev, images: newImages };
        });
        setReplacingIndex(null);
      } else {
        // Add multiple images
        setFormData(prev => ({ ...prev, images: [...prev.images, ...newFiles] }));
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const removeImage = (index) => {
    setFormData(prev => {
      const newImages = [...prev.images];
      if (newImages[index]?.type === 'file') {
        URL.revokeObjectURL(newImages[index].preview);
      }
      return {
        ...prev,
        images: newImages.filter((_, i) => i !== index)
      };
    });
  };

  const triggerReplace = (index) => {
    setReplacingIndex(index);
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    const projectImages = project.images && project.images.length > 0 ? project.images : [project.image];
    setFormData({
      title: project.title,
      subtitle: project.subtitle || '',
      category: project.category,
      description: project.description || '',
      images: projectImages.filter(img => img).map(img => ({ type: 'url', value: img, preview: img })),
      tags: Array.isArray(project.tags) ? project.tags.join(', ') : project.tags,
      client: project.client || '',
      timeline: project.timeline || '',
      role: project.role || '',
      challenges: Array.isArray(project.challenges) ? project.challenges.join(', ') : (project.challenges || ''),
      solutions: Array.isArray(project.solutions) ? project.solutions.join(', ') : (project.solutions || '')
    });
    setActiveSection('upload');
    setMessage('');
  };

  const cancelEdit = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      subtitle: '',
      category: 'Web Dev',
      description: '',
      images: [],
      tags: '',
      client: '',
      timeline: '',
      role: '',
      challenges: '',
      solutions: ''
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.images.length === 0) {
      setMessage('Please upload at least one image.');
      return;
    }
    setLoading(true);
    setMessage('');

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('subtitle', formData.subtitle);
      data.append('category', formData.category);
      data.append('description', formData.description);
      data.append('tags', formData.tags);
      data.append('client', formData.client);
      data.append('timeline', formData.timeline);
      data.append('role', formData.role);
      data.append('challenges', formData.challenges);
      data.append('solutions', formData.solutions);
      
      if (!editingProject) {
        data.append('uploadedBy', user?.username || 'Admin');
      }

      // Send the image structure
      const imageStructure = [];
      formData.images.forEach((img, index) => {
        if (img.type === 'file') {
          data.append('images', img.value);
          imageStructure.push({ type: 'file', index: index }); // We'll map this on backend
        } else {
          imageStructure.push({ type: 'url', value: img.value });
        }
      });
      data.append('imageStructure', JSON.stringify(imageStructure));

      const url = editingProject 
        ? API_ENDPOINTS.PROJECT_BY_ID(editingProject._id)
        : API_ENDPOINTS.PROJECTS;
      
      const method = editingProject ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        body: data,
      });

      const contentType = response.headers.get("content-type");
      if (response.ok) {
        const savedProject = (contentType && contentType.includes("application/json")) 
          ? await response.json() 
          : null;
          
        setMessage(editingProject ? 'Project updated successfully!' : 'Project uploaded successfully!');
        
        if (editingProject && savedProject) {
          // Update form with saved data to refresh badges and URLs
          setEditingProject(savedProject);
          const projectImages = savedProject.images && savedProject.images.length > 0 ? savedProject.images : [savedProject.image];
          setFormData(prev => ({
            ...prev,
            images: projectImages.filter(img => img).map(img => ({ type: 'url', value: img }))
          }));
        } else if (!editingProject) {
            setFormData({
              title: '',
              subtitle: '',
              category: 'Web Dev',
              description: '',
              images: [],
              tags: '',
              client: '',
              timeline: '',
              role: '',
              challenges: '',
              solutions: ''
            });
        }
        fetchProjects();
      } else {
        let errorMessage = 'Failed to save project.';
        if (contentType && contentType.includes("application/json")) {
          const errData = await response.json();
          errorMessage = errData.error || errorMessage;
        } else {
          const errorText = await response.text();
          console.error("Server returned non-JSON error:", errorText);
        }
        setMessage(errorMessage);
      }
    } catch (error) {
      console.error('Error saving project:', error);
      setMessage('Error connecting to server.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await fetch(API_ENDPOINTS.PROJECT_BY_ID(id), {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchProjects();
        } else {
          alert('Failed to delete project');
        }
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 overflow-y-auto">
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 border-r border-gray-700 hidden md:flex flex-col">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white">Rhynox <span className="text-blue-500">Admin</span></h2>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <button 
              onClick={() => setActiveSection('dashboard')}
              className={`flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg transition-colors ${activeSection === 'dashboard' ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'}`}
            >
              <Activity size={20} /> Dashboard
            </button>
            <button 
              onClick={() => { setActiveSection('upload'); cancelEdit(); }}
              className={`flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg transition-colors ${activeSection === 'upload' ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'}`}
            >
              <Upload size={20} /> {editingProject ? 'Edit Project' : 'Upload Project'}
            </button>
            <button 
              onClick={() => setActiveSection('projects')}
              className={`flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg transition-colors ${activeSection === 'projects' ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'}`}
            >
              <Folder size={20} /> All Projects
            </button>
          </nav>
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center gap-3 px-4 py-3 text-gray-400 mb-2">
                <User size={20} /> {user?.username || 'Admin'}
            </div>
            <button className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 w-full rounded-lg transition-colors" onClick={() => window.location.reload()}>
              <LogOut size={20} /> Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-900 p-4 md:p-8">
          <header className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">
                {activeSection === 'dashboard' && 'Dashboard Overview'}
                {activeSection === 'upload' && (editingProject ? 'Edit Project' : 'Upload New Project')}
                {activeSection === 'projects' && 'Project Management'}
              </h1>
              <p className="text-gray-400">Welcome back, {user?.username || 'Admin'}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold uppercase">
                {user?.username?.substring(0, 2) || 'AD'}
              </div>
            </div>
          </header>

          {activeSection === 'dashboard' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-800 p-6 rounded-xl border border-gray-700"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-lg ${stat.color}`}>
                        {stat.icon}
                      </div>
                    </div>
                    <h3 className="text-gray-400 text-sm mb-1">{stat.title}</h3>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                  </motion.div>
                ))}
              </div>
              
              {/* Recent Uploads Preview */}
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">Recent Uploads</h3>
                    <button onClick={() => setActiveSection('projects')} className="text-blue-400 hover:text-blue-300 text-sm font-medium">View All</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {uploadedProjects.slice(0, 3).map((project) => (
                        <div key={project._id} className="bg-gray-900 rounded-lg p-4 border border-gray-700 flex gap-4">
                            <img src={project.images?.[0] || project.image} alt={project.title} className="w-16 h-16 rounded-lg object-cover" />
                            <div>
                                <h4 className="text-white font-bold">{project.title}</h4>
                                <p className="text-gray-400 text-xs mb-1">{project.category}</p>
                                <p className="text-blue-400 text-xs">By: {project.uploadedBy || 'Unknown'}</p>
                            </div>
                        </div>
                    ))}
                    {uploadedProjects.length === 0 && <p className="text-gray-500">No projects uploaded yet.</p>}
                </div>
              </div>
            </>
          )}

          {activeSection === 'upload' && (
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-8 max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">{editingProject ? 'Edit Project Details' : 'Enter Project Details'}</h3>
                {editingProject && (
                    <button onClick={cancelEdit} className="text-sm text-red-400 hover:text-red-300">Cancel Edit</button>
                )}
              </div>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-gray-400 text-sm">Project Title</label>
                  <input 
                    type="text" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleInputChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-gray-400 text-sm">Subtitle</label>
                  <input 
                    type="text" 
                    name="subtitle" 
                    value={formData.subtitle} 
                    onChange={handleInputChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-gray-400 text-sm">Client Name</label>
                  <input 
                    type="text" 
                    name="client" 
                    value={formData.client} 
                    onChange={handleInputChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="e.g. TechCorp"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-gray-400 text-sm">Timeline</label>
                  <input 
                    type="text" 
                    name="timeline" 
                    value={formData.timeline} 
                    onChange={handleInputChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="e.g. 4 Weeks"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-gray-400 text-sm">My Role</label>
                  <input 
                    type="text" 
                    name="role" 
                    value={formData.role} 
                    onChange={handleInputChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="e.g. Full Stack Dev"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-gray-400 text-sm">Service Type</label>
                  <select 
                    name="category" 
                    value={formData.category} 
                    onChange={handleInputChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Web Dev">Web Development</option>
                    <option value="App Dev">App Development</option>
                    <option value="Design">Graphic Design</option>
                    <option value="Video">Video Editing</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
                <div className="space-y-4 md:col-span-2">
                  <label className="text-gray-400 text-sm font-bold uppercase tracking-wider">Project Gallery</label>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {formData.images.map((img, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-700 group cursor-pointer"
                        onClick={() => triggerReplace(idx)}
                      >
                        <img 
                          src={img.preview} 
                          alt={`Gallery ${idx}`} 
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                          <div className="p-2 bg-blue-600 rounded-full text-white shadow-lg">
                            <Upload size={16} />
                          </div>
                          <span className="text-[10px] text-white font-black uppercase tracking-widest">Replace</span>
                        </div>

                        {/* Delete Button */}
                        <button 
                          onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                          className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow-lg"
                        >
                          <X size={14} />
                        </button>

                        {/* Badge */}
                        <div className={`absolute bottom-2 left-2 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-tighter ${img.type === 'file' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300'}`}>
                          {img.type === 'file' ? 'New' : 'Saved'}
                        </div>
                      </motion.div>
                    ))}

                    {/* Add Button */}
                    <button 
                      type="button"
                      onClick={() => { setReplacingIndex(null); fileInputRef.current.click(); }}
                      className="relative aspect-square rounded-xl border-2 border-dashed border-gray-700 hover:border-blue-500 hover:bg-blue-500/5 transition-all flex flex-col items-center justify-center gap-2 group"
                    >
                      <div className="p-3 bg-gray-800 rounded-full text-gray-400 group-hover:text-blue-400 group-hover:bg-gray-700 transition-all">
                        <Plus size={24} />
                      </div>
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest group-hover:text-blue-400">Add Image</span>
                    </button>
                  </div>

                  <input 
                    type="file" 
                    name="images"
                    ref={fileInputRef}
                    onChange={handleInputChange}
                    className="hidden"
                    multiple={replacingIndex === null}
                    accept="image/*"
                  />
                  
                  <p className="text-xs text-gray-500 italic">
                    * Click an image to replace it, or use the "Add Image" button to append new ones. Drag and drop to reorder (coming soon).
                  </p>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-gray-400 text-sm">Description</label>
                  <textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleInputChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none h-32"
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-gray-400 text-sm">Tags (comma separated)</label>
                  <input 
                    type="text" 
                    name="tags" 
                    value={formData.tags} 
                    onChange={handleInputChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="React, Node.js, Design"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-gray-400 text-sm">Key Challenges (comma separated)</label>
                  <textarea 
                    name="challenges" 
                    value={formData.challenges} 
                    onChange={handleInputChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none h-24"
                    placeholder="Challenge 1, Challenge 2, Challenge 3"
                  ></textarea>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-gray-400 text-sm">Solutions (comma separated)</label>
                  <textarea 
                    name="solutions" 
                    value={formData.solutions} 
                    onChange={handleInputChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none h-24"
                    placeholder="Solution 1, Solution 2, Solution 3"
                  ></textarea>
                </div>
                <div className="md:col-span-2">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors w-full md:w-auto"
                  >
                    {loading ? 'Saving...' : (editingProject ? 'Update Project' : 'Upload Project')}
                  </button>
                  {message && (
                    <p className={`mt-4 ${message.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
                      {message}
                    </p>
                  )}
                </div>
              </form>
            </div>
          )}

          {activeSection === 'projects' && (
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-xl font-bold text-white">All Uploaded Projects</h3>
              </div>
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left">
                  <thead className="bg-gray-900/50 text-gray-400 text-sm uppercase">
                    <tr>
                      <th className="px-6 py-4">Images</th>
                      <th className="px-6 py-4">Title</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Client</th>
                      <th className="px-6 py-4">Timeline</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Uploaded By</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {uploadedProjects.map((project) => (
                      <tr key={project._id} className="text-gray-300 hover:bg-gray-700/30 transition-colors">
                        <td className="px-6 py-4">
                            <div className="flex -space-x-3 hover:space-x-1 transition-all">
                                {(project.images && project.images.length > 0 ? project.images : [project.image]).slice(0, 3).map((img, idx) => (
                                    <img key={idx} src={img} alt={project.title} className="w-10 h-10 rounded-lg object-cover border-2 border-gray-800 shadow-lg" />
                                ))}
                                {(project.images?.length > 3) && (
                                    <div className="w-10 h-10 rounded-lg bg-gray-700 border-2 border-gray-800 flex items-center justify-center text-[10px] font-bold text-white">
                                        +{project.images.length - 3}
                                    </div>
                                )}
                            </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-white">
                            {project.title}
                            <div className="text-xs text-blue-400 mt-1">{project.category}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                                <Calendar size={14} />
                                {formatDate(project.createdAt)}
                            </div>
                        </td>
                        <td className="px-6 py-4">{project.client || '-'}</td>
                        <td className="px-6 py-4">{project.timeline || '-'}</td>
                        <td className="px-6 py-4">{project.role || '-'}</td>
                        <td className="px-6 py-4 text-blue-400">{project.uploadedBy || 'Admin'}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button 
                                onClick={() => handleEdit(project)}
                                className="text-blue-400 hover:text-blue-300 p-2 hover:bg-blue-500/10 rounded-lg transition-colors"
                                title="Edit Project"
                            >
                                <Edit2 size={18} />
                            </button>
                            {user?.username === project.uploadedBy && (
                                <button 
                                onClick={() => handleDelete(project._id)}
                                className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                                title="Delete Project"
                                >
                                <Trash2 size={18} />
                                </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {uploadedProjects.length === 0 && (
                        <tr>
                            <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                                No projects found. Start by uploading one!
                            </td>
                        </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
