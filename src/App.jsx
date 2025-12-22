import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { 
  Code, 
  Smartphone, 
  Palette, 
  Megaphone, 
  Video, 
  CheckCircle, 
  Clock, 
  Zap, 
  Users, 
  Menu, 
  X, 
  ArrowRight, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Facebook,
  ChevronUp,
  Mail,
  MapPin,
  Phone,
  Maximize2,
  ExternalLink,
  Layers,
  Check,
  Home,
  LayoutGrid,
  Award,
  Briefcase,
  CreditCard,
  Info,
  Sparkles,
  PartyPopper
} from 'lucide-react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import { API_ENDPOINTS } from './config';

/* --- COMPONENT ARCHITECTURE & DATA --- */

// --- DATA CONSTANTS ---
// Updated colors for Dark Mode contrast
const SERVICES = [
  {
    id: 1,
    title: "Website Development",
    desc: "Custom, high-performance websites built with modern frameworks like React and Next.js.",
    icon: <Code size={32} />,
    color: "text-blue-400",
    bg: "bg-blue-900/20"
  },
  {
    id: 2,
    title: "App Development",
    desc: "Native and cross-platform mobile applications designed for seamless user experiences.",
    icon: <Smartphone size={32} />,
    color: "text-purple-400",
    bg: "bg-purple-900/20"
  },
  {
    id: 3,
    title: "Graphic Designing",
    desc: "Eye-catching posters, branding materials, and UI elements that tell your brand's story.",
    icon: <Palette size={32} />,
    color: "text-pink-400",
    bg: "bg-pink-900/20"
  },
  {
    id: 4,
    title: "YouTube Ads Creation",
    desc: "High-conversion video ads scripted and produced to maximize your ROI.",
    icon: <Megaphone size={32} />,
    color: "text-red-400",
    bg: "bg-red-900/20"
  },
  {
    id: 5,
    title: "Video Editing",
    desc: "Professional editing, color grading, and motion graphics for polished content.",
    icon: <Video size={32} />,
    color: "text-teal-400",
    bg: "bg-teal-900/20"
  }
];

const PRICING_PLANS = [
  {
    title: "Starter",
    price: "₹499",
    period: "starting price",
    description: "Essential digital presence for startups, small businesses, and freelancers.",
    features: [
      "Responsive Website (5 Pages)",
      "Basic SEO Optimization",
      "Contact Form Integration",
      "1 Month Maintenance",
      "Social Media Setup"
    ],
    cta: "Get Started",
    popular: false,
    color: "blue"
  },
  {
    title: "Business",
    price: "₹999",
    period: "starting price",
    description: "Advanced solutions for growing companies, freelance agencies, and dynamic features.",
    features: [
      "Dynamic React Application",
      "CMS / Admin Dashboard",
      "Advanced SEO & Analytics",
      "Brand Identity Design",
      "3 Months Support",
      "Payment Gateway Setup"
    ],
    cta: "Choose Business",
    popular: true,
    color: "purple"
  },
  {
    title: "Enterprise",
    price: "Custom",
    period: "project based",
    description: "Full-scale digital transformation and complex application development.",
    features: [
      "Custom Mobile App (iOS & Android)",
      "Complex E-commerce Solutions",
      "Full Video Production & Ads",
      "Dedicated Project Manager",
      "Priority 24/7 Support",
      "Cloud Infrastructure Setup"
    ],
    cta: "Contact Sales",
    popular: false,
    color: "pink"
  }
];

const FEATURES = [
  { title: "Fast Delivery", icon: <Clock size={24} />, desc: "We value your time. Quick turnarounds without compromising quality." },
  { title: "Affordable Pricing", icon: <CheckCircle size={24} />, desc: "Premium services tailored to fit startup and SME budgets." },
  { title: "Modern Tech", icon: <Zap size={24} />, desc: "We use the latest tools (React, Tailwind, Motion) for future-proof solutions." },
  { title: "Client Focused", icon: <Users size={24} />, desc: "Your vision is our priority. We collaborate closely at every step." }
];

const PORTFOLIO = [
  { 
    id: 1, 
    category: "Web Dev", 
    title: "E-Commerce Platform", 
    subtitle: "Fashion Retail",
    description: "A comprehensive e-commerce solution featuring real-time inventory tracking, AI-powered product recommendations, and a seamless checkout process.",
    tags: ["React", "Node.js", "Stripe", "MongoDB"],
    gradient: "from-blue-600 to-indigo-600",
    image: "https://images.unsplash.com/photo-1661956602116-aa6865609028?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  { 
    id: 2, 
    category: "App Dev", 
    title: "Fitness Tracker", 
    subtitle: "iOS & Android",
    description: "A cross-platform mobile application that tracks workouts, nutrition, and sleep patterns with integration for wearable devices.",
    tags: ["React Native", "Firebase", "HealthKit"],
    gradient: "from-purple-600 to-fuchsia-600",
    image: "https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=800&q=80"
  },
  { 
    id: 3, 
    category: "Design", 
    title: "Brand Identity", 
    subtitle: "Tech Startup",
    description: "Complete visual identity overhaul including logo design, typography selection, and marketing collateral for a fintech startup.",
    tags: ["Adobe Illustrator", "Figma", "Branding"],
    gradient: "from-pink-600 to-rose-600",
    image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=800&q=80"
  },
  { 
    id: 4, 
    category: "Video", 
    title: "Product Launch", 
    subtitle: "Commercial Ad",
    description: "High-energy commercial video produced for a new consumer electronics product launch, featuring 3D motion graphics.",
    tags: ["Premiere Pro", "After Effects", "Cinema 4D"],
    gradient: "from-orange-500 to-red-600",
    image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80"
  },
  { 
    id: 5, 
    category: "Web Dev", 
    title: "SaaS Dashboard", 
    subtitle: "Analytics Tool",
    description: "An interactive data visualization dashboard for a B2B SaaS platform, handling large datasets with client-side caching.",
    tags: ["Next.js", "D3.js", "Tailwind CSS"],
    gradient: "from-teal-500 to-emerald-600",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
  },
  { 
    id: 6, 
    category: "Design", 
    title: "Social Media Kit", 
    subtitle: "Marketing Campaign",
    description: "A cohesive set of social media templates and assets designed to boost engagement across Instagram and LinkedIn.",
    tags: ["Photoshop", "Social Media", "Content Strategy"],
    gradient: "from-indigo-500 to-blue-500",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80"
  }
];

// --- ANIMATION VARIANTS ---

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring",
      stiffness: 100,
      damping: 20,
      duration: 0.8 
    } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const scaleOnHover = {
  hover: { scale: 1.05, transition: { type: "spring", stiffness: 400, damping: 10 } }
};

// --- SUB-COMPONENTS ---

const ProjectModal = ({ project, onClose }) => {
  const [activeImage, setActiveImage] = useState(project.images?.[0] || project.image);
  const [showScreenshots, setShowScreenshots] = useState(false);
  
  if (!project) return null;

  const allImages = project.images && project.images.length > 0 ? project.images : [project.image];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0, transition: { type: "spring", duration: 0.5 } }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className={`bg-gray-900 w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl border border-gray-700 ${showScreenshots ? 'h-[90vh]' : 'max-h-[90vh]'} flex flex-col transition-all duration-300`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mock Screenshot Display Area */}
        <div className={`${showScreenshots ? 'flex-1' : 'h-64 md:h-80'} w-full relative flex-shrink-0 group overflow-hidden bg-black/40`}>
            {/* Background Image */}
            <AnimatePresence mode="wait">
              <motion.img 
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                src={activeImage} 
                alt={project.title} 
                className="absolute inset-0 w-full h-full object-contain z-10"
              />
            </AnimatePresence>
            
            <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-50 mix-blend-multiply`}></div>

            <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors z-20 backdrop-blur-sm"
            >
                <X size={24} />
            </button>

            {showScreenshots && (
              <button 
                onClick={() => setShowScreenshots(false)}
                className="absolute top-4 left-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors z-20 backdrop-blur-sm font-bold text-xs uppercase tracking-widest"
              >
                Back to Details
              </button>
            )}
        </div>

        {/* Thumbnail Mockups - Only shown when showScreenshots is true */}
        {showScreenshots && (
          <div className="flex justify-center gap-3 py-4 bg-gray-900 border-b border-gray-800 overflow-x-auto px-4 no-scrollbar shrink-0">
             {allImages.map((img, idx) => (
               <div 
                 key={idx} 
                 onClick={() => setActiveImage(img)}
                 className={`w-20 h-14 md:w-24 md:h-16 rounded-lg border-2 flex-shrink-0 ${activeImage === img ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 bg-gray-800/50'} cursor-pointer hover:border-blue-400/50 transition-all shadow-lg overflow-hidden`}
               >
                 <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
               </div>
             ))}
          </div>
        )}

        {/* Content - Hidden when showScreenshots is true */}
        {!showScreenshots && (
          <div className="p-8 overflow-y-auto custom-scrollbar">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                  <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-500/20">
                          {project.category}
                        </span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold text-white mb-1">{project.title}</h2>
                      <p className="text-xl text-gray-400">{project.subtitle}</p>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setShowScreenshots(true)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors font-medium border border-gray-700"
                    >
                        <Layers size={18} /> Screenshots
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium shadow-lg shadow-blue-900/20">
                        <ExternalLink size={18} /> Live Demo
                    </button>
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Project Overview</h4>
                    <p className="text-gray-300 leading-relaxed text-lg">
                        {project.description}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Key Challenges & Solutions</h4>
                    <p className="text-gray-400 leading-relaxed">
                      We focused on creating a user-centric design that maximizes engagement. By leveraging modern caching techniques, we reduced load times by 40%, ensuring a smooth experience even on slower connections.
                    </p>
                  </div>
                </div>

                <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 h-fit">
                    <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                      <Code size={18} className="text-blue-400"/> Technologies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {project.tags.map((tech) => (
                            <span key={tech} className="px-3 py-1.5 bg-gray-900 text-gray-300 rounded-lg text-sm border border-gray-700 font-medium">
                                {tech}
                            </span>
                        ))}
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-gray-700">
                      <h4 className="text-white font-bold mb-3">Project Details</h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between text-gray-400">
                          <span>Client</span>
                          <span className="text-gray-200">Confidential</span>
                        </div>
                        <div className="flex justify-between text-gray-400">
                          <span>Timeline</span>
                          <span className="text-gray-200">{project.timeline || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between text-gray-400">
                          <span>Role</span>
                          <span className="text-gray-200">{project.role || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                </div>
              </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 origin-left z-50"
        style={{ scaleX }}
      />
      <AnimatePresence>
        {isVisible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={scrollToTop}
            className="fixed bottom-32 right-8 p-3 bg-gray-800 text-blue-400 rounded-full shadow-xl border border-gray-700 z-40 hover:bg-gray-700 focus:outline-none"
            whileHover={{ y: -5 }}
          >
            <ChevronUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

// --- NEW NAVIGATION SYSTEM ---

const TopBar = () => {
  return (
    // Changed layout to center the title and position button absolutely
    <div className="absolute top-0 left-0 right-0 p-8 flex justify-center items-center z-40 pointer-events-none">
       <motion.div 
         initial={{ opacity: 0, y: -20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.8, ease: "easeOut" }}
         className="pointer-events-auto cursor-pointer" 
         onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
       >
          {/* Increased text size to 4xl/6xl and centered text alignment */}
          <div className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 backdrop-blur-sm bg-black/10 rounded-lg px-2 text-center tracking-tight drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
             Rhynox <span className="text-white">Technologies</span>
          </div>
       </motion.div>
       {/* Button positioned absolutely to the right, hidden on smaller screens to avoid overlap */}
       <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
          className="pointer-events-auto absolute right-8 top-9 px-6 py-2.5 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-all shadow-[0_0_20px_rgba(37,99,235,0.5)] hover:shadow-[0_0_30px_rgba(37,99,235,0.8)] backdrop-blur-md hidden lg:block"
       >
          Get a Quote
       </motion.button>
    </div>
  );
};

const DockItem = ({ item }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative flex flex-col items-center gap-2 group">
      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            className="absolute -top-10 bg-gray-800 text-white text-[10px] font-semibold py-0.5 px-2 rounded border border-gray-700 shadow-xl whitespace-nowrap"
          >
            {item.label}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => {
            const el = document.querySelector(item.href);
            if(el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        whileHover={{ scale: 1.25, y: -8 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        // Reduced size: w-10 h-10 (mobile), w-12 h-12 (desktop), rounded-xl
        className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl bg-gray-800/60 hover:bg-gray-700/80 border border-white/10 text-gray-400 hover:text-blue-400 hover:border-blue-400/30 transition-colors shadow-lg backdrop-blur-md"
      >
        {item.icon}
      </motion.button>
      
      {/* Active Indicator Dot */}
      <div className="w-1 h-1 rounded-full bg-transparent group-hover:bg-blue-500 transition-colors" />
    </div>
  );
};

const Dock = () => {
  // Reduced icon size to 20
  const navItems = [
    { icon: <Home size={20} />, label: "Home", href: "#home" },
    { icon: <LayoutGrid size={20} />, label: "Services", href: "#services" },
    { icon: <Award size={20} />, label: "Why Us", href: "#why-us" },
    { icon: <Briefcase size={20} />, label: "Portfolio", href: "#portfolio" },
    { icon: <CreditCard size={20} />, label: "Pricing", href: "#pricing" },
    { icon: <Info size={20} />, label: "About", href: "#about" },
    { icon: <Mail size={20} />, label: "Contact", href: "#contact" },
  ];

  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
        // Reduced container padding (px-3 py-2) and gap
        className="pointer-events-auto flex items-end gap-1 md:gap-3 px-3 py-2 bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl"
      >
        {navItems.map((item) => (
           <DockItem key={item.label} item={item} />
        ))}
      </motion.div>
    </div>
  );
};

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-gray-950 snap-start">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-black"></div>
      
      {/* Animated Blobs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          x: [0, 50, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 mix-blend-screen" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, -60, 0],
          x: [0, -30, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 mix-blend-screen" 
      />

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="mb-4 inline-block px-4 py-1.5 rounded-full bg-blue-900/30 text-blue-300 border border-blue-800/50 text-sm font-semibold tracking-wide uppercase backdrop-blur-sm">
            Transforming Ideas into Reality
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 tracking-tight">
            We Build Digital Experiences That <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-pulse">Grow Your Business</span>
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            From stunning websites and apps to engaging video ads, Rhynox Technologies is your all-in-one partner for digital success.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-blue-700 shadow-blue-900/30 transition-all flex items-center justify-center gap-2"
            >
              Get a Free Quote <ArrowRight size={20} />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              onClick={() => document.getElementById('portfolio').scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-white/5 backdrop-blur-sm text-white border border-white/10 text-lg font-semibold rounded-full hover:bg-white/10 transition-colors"
            >
              View Our Work
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const ServiceCard = ({ service }) => {
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -8, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.5)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-gray-800/40 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-gray-700/50 hover:border-blue-500/30 transition-all group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className={`w-16 h-16 rounded-xl ${service.bg} ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 ease-out relative z-10`}>
        {service.icon}
      </div>
      <h3 className="text-2xl font-bold text-white mb-3 relative z-10">{service.title}</h3>
      <p className="text-gray-400 leading-relaxed relative z-10">{service.desc}</p>
    </motion.div>
  );
};

const Services = () => {
  return (
    <section id="services" className="pt-4 pb-24 bg-gray-900 relative overflow-hidden snap-start min-h-screen flex flex-col justify-center">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Our Expertise
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: 100 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1 bg-blue-600 mx-auto rounded-full" 
          />
          <p className="text-gray-400 mt-4 max-w-xl mx-auto">
            Comprehensive digital solutions designed to elevate your brand presence across all platforms.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {SERVICES.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const WhyUs = () => {
  const stats = [
    { number: "50+", label: "Projects Completed", gradient: "from-blue-600 to-indigo-700", icon: <Briefcase size={28} /> },
    { number: "98%", label: "Client Satisfaction", gradient: "from-purple-600 to-pink-600", icon: <Award size={28} /> },
    { number: "3+", label: "Years Experience", gradient: "from-teal-600 to-emerald-600", icon: <Clock size={28} /> },
    { number: "10+", label: "Team Members", gradient: "from-orange-600 to-red-600", icon: <Users size={28} /> }
  ];

  return (
    <section id="why-us" className="py-24 bg-gray-950 relative overflow-hidden snap-start min-h-screen flex items-center">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
            className="lg:w-1/2 w-full"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Why Choose <span className="text-blue-500">Rhynox?</span></h2>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              We don't just deliver projects; we build partnerships. Our unique blend of creative design and technical robustness ensures your business stands out in a crowded digital landscape.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {FEATURES.map((feature, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, type: "spring" }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                  className="flex flex-col p-5 bg-gray-900 rounded-xl shadow-sm border border-gray-800 hover:border-gray-700 transition-colors hover:shadow-lg hover:shadow-blue-900/10"
                >
                  <div className="mb-3 text-blue-400 bg-blue-900/20 w-12 h-12 rounded-full flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <h4 className="font-bold text-gray-100 mb-2 text-base">{feature.title}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Stats Grid - Hidden on mobile, shown on lg+ */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ type: "spring", stiffness: 50, damping: 20 }}
             className="hidden lg:grid lg:w-1/2 grid-cols-2 gap-4"
          >
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15, type: "spring" }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`bg-gradient-to-br ${stat.gradient} p-6 rounded-2xl shadow-xl backdrop-blur-sm relative overflow-hidden group ${idx % 2 === 0 ? 'mt-8' : ''}`}
              >
                {/* Animated background effect */}
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="text-white/80 mb-3">
                    {stat.icon}
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-white/90 font-medium text-sm">
                    {stat.label}
                  </div>
                </div>

                {/* Decorative corner element */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
              </motion.div>
            ))}
          </motion.div>

          {/* Mobile Stats - Shown only on mobile as a horizontal scroll */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
            className="lg:hidden w-full overflow-x-auto pb-4 -mx-6 px-6"
          >
            <div className="flex gap-4 min-w-max">
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1, type: "spring" }}
                  viewport={{ once: true }}
                  className={`bg-gradient-to-br ${stat.gradient} p-6 rounded-2xl shadow-xl backdrop-blur-sm relative overflow-hidden min-w-[160px]`}
                >
                  <div className="relative z-10">
                    <div className="text-white/80 mb-2">
                      {stat.icon}
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">
                      {stat.number}
                    </div>
                    <div className="text-white/90 font-medium text-xs">
                      {stat.label}
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/5 rounded-full blur-2xl"></div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Portfolio = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [projects, setProjects] = useState(PORTFOLIO);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.PROJECTS);
        if (response.ok) {
          const data = await response.json();
          const formattedData = data.map(p => ({
            id: p._id,
            category: p.category,
            title: p.title,
            subtitle: p.subtitle,
            description: p.description,
            tags: p.tags,
            gradient: p.gradient || "from-blue-600 to-indigo-600",
            image: p.images?.[0] || p.image,
            images: p.images || [p.image],
            client: p.client,
            timeline: p.timeline,
            role: p.role
          }));
          setProjects([...PORTFOLIO, ...formattedData]);
        }
      } catch (error) {
        console.error("Failed to fetch projects", error);
      }
    };

    fetchProjects();
    const interval = setInterval(fetchProjects, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="portfolio" className="pt-10 pb-40 bg-gray-900 overflow-hidden relative snap-start min-h-screen flex flex-col justify-center">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Featured Work</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            A selection of projects where we helped businesses achieve their digital goals. Click on any project to see more details.
          </p>
        </div>
      </div>

      {/* Marquee Container */}
      <div 
        className="relative w-full"
      >
        {/* Gradients to fade edges */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-gray-900 to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-gray-900 to-transparent z-20 pointer-events-none" />

        <div className="flex overflow-hidden">
          <div 
            className="flex gap-8 px-4 animate-marquee pause-on-hover"
            style={{ 
              width: "fit-content",
            }}
          >
            {/* Double the array to create seamless loop */}
            {[...projects, ...projects].map((item, index) => (
              <motion.div 
                key={`${item.id}-${index}`}
                onClick={() => setSelectedProject(item)}
                className="group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer bg-gray-800 border border-gray-700 flex-shrink-0 w-[350px] md:w-[450px] aspect-[4/3]"
                whileHover={{ scale: 0.98, transition: { duration: 0.3 } }}
              >
                {/* Image */}
                <div className="absolute inset-0">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-300`}></div>
                </div>
                
                {/* Content Overlay */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                   <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                          {item.category}
                        </span>
                        {item.subtitle && (
                          <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
                            • {item.subtitle}
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl md:text-3xl font-black text-white mb-2 drop-shadow-lg uppercase tracking-tight">{item.title}</h3>
                      <p className="text-gray-300 text-sm mb-5 drop-shadow-sm line-clamp-2 font-medium leading-relaxed max-w-sm">{item.description}</p>
                      
                      <div className="flex items-center text-blue-400 font-bold text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        View Project <ArrowRight size={16} className="ml-2" />
                      </div>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </section>
  );
};

const Pricing = () => {
  return (
    <section id="pricing" className="pt-4 pb-24 bg-gray-950 relative snap-start min-h-screen flex flex-col justify-center">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Transparent Pricing
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: 100 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-1 bg-blue-600 mx-auto rounded-full" 
          />
          <p className="text-gray-400 mt-4 max-w-xl mx-auto">
            Choose a plan that fits your business needs. No hidden fees, just quality results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto -mt-8">
          {PRICING_PLANS.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 100, damping: 20 }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className={`relative bg-gray-900 rounded-2xl p-8 border flex flex-col ${
                plan.popular 
                  ? 'border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.15)] z-10 scale-105 md:scale-110' 
                  : 'border-gray-800'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">
                  MOST POPULAR
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">{plan.title}</h3>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400 text-sm mb-1">/ {plan.period}</span>
                </div>
                <p className="text-gray-400 text-sm">{plan.description}</p>
              </div>

              <div className="flex-grow space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className={`mt-0.5 p-0.5 rounded-full ${plan.popular ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-800 text-gray-400'}`}>
                      <Check size={14} strokeWidth={3} />
                    </div>
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                plan.popular 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 shadow-lg shadow-purple-500/30' 
                  : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700'
              }`}>
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const About = () => {
  return (
    <section id="about" className="py-24 bg-gradient-to-b from-gray-900 to-black snap-start min-h-screen flex items-center">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <h2 className="text-4xl font-bold text-white mb-8">About <span className="text-blue-500">Rhynox Technologies</span></h2>
            <p className="text-xl text-gray-300 leading-relaxed mb-6">
              Founded on the belief that digital transformation should be accessible and impactful, Rhynox Technologies is a new-age digital agency. We combine technical expertise with creative flair to build products that not only look good but perform exceptionally.
            </p>
            <p className="text-lg text-gray-400 mb-10">
              Our mission is to empower startups and established businesses alike with the tools they need to thrive in the modern economy. Whether it's code, design, or strategy, we pour our passion into every pixel.
            </p>
            
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="text-center px-6">
                <div className="text-4xl font-bold text-blue-500 mb-2">50+</div>
                <div className="text-gray-500 font-medium">Projects Completed</div>
              </div>
              <div className="text-center px-6 border-l border-gray-800">
                <div className="text-4xl font-bold text-purple-500 mb-2">100%</div>
                <div className="text-gray-500 font-medium">Client Satisfaction</div>
              </div>
              <div className="text-center px-6 border-l border-gray-800">
                <div className="text-4xl font-bold text-pink-500 mb-2">24/7</div>
                <div className="text-gray-500 font-medium">Support</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Website Development',
    message: ''
  });
  
  const [emailVerification, setEmailVerification] = useState({
    isVerified: false,
    codeSent: false,
    verificationCode: '',
    loading: false,
    error: '',
    success: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Reset verification if email changes
    if (e.target.name === 'email' && emailVerification.isVerified) {
      setEmailVerification({
        isVerified: false,
        codeSent: false,
        verificationCode: '',
        loading: false,
        error: '',
        success: ''
      });
    }
  };

  const sendVerificationCode = async () => {
    // Validate Gmail format with regex
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(formData.email)) {
      setEmailVerification(prev => ({
        ...prev,
        error: 'Please enter a valid @gmail.com email address',
        success: ''
      }));
      return;
    }

    setEmailVerification(prev => ({ ...prev, loading: true, error: '', success: '' }));

    try {
      const response = await fetch(`${API_ENDPOINTS.BASE_URL}/verify-email/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });

      const data = await response.json();

      if (response.ok) {
        setEmailVerification(prev => ({
          ...prev,
          codeSent: true,
          loading: false,
          success: 'Verification code sent! Please check your email.',
          error: ''
        }));
      } else {
        setEmailVerification(prev => ({
          ...prev,
          loading: false,
          error: data.error || 'Failed to send verification code',
          success: ''
        }));
      }
    } catch (error) {
      setEmailVerification(prev => ({
        ...prev,
        loading: false,
        error: 'Network error. Please try again.',
        success: ''
      }));
    }
  };

  const verifyCode = async () => {
    if (!emailVerification.verificationCode || emailVerification.verificationCode.length !== 6) {
      setEmailVerification(prev => ({
        ...prev,
        error: 'Please enter a valid 6-digit code',
        success: ''
      }));
      return;
    }

    setEmailVerification(prev => ({ ...prev, loading: true, error: '', success: '' }));

    try {
      const response = await fetch(`${API_ENDPOINTS.BASE_URL}/verify-email/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email, 
          code: emailVerification.verificationCode 
        })
      });

      const data = await response.json();

      if (response.ok) {
        setEmailVerification(prev => ({
          ...prev,
          isVerified: true,
          loading: false,
          success: 'Email verified successfully! ✓',
          error: ''
        }));
      } else {
        setEmailVerification(prev => ({
          ...prev,
          loading: false,
          error: data.error || 'Invalid verification code',
          success: ''
        }));
      }
    } catch (error) {
      setEmailVerification(prev => ({
        ...prev,
        loading: false,
        error: 'Network error. Please try again.',
        success: ''
      }));
    }
  };

  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getServiceIcon = (service) => {
    const iconMap = {
      'Website Development': <Code size={40} />,
      'App Development': <Smartphone size={40} />,
      'Graphic Design': <Palette size={40} />,
      'YouTube Ads': <Megaphone size={40} />,
      'Video Editing': <Video size={40} />
    };
    return iconMap[service] || <Sparkles size={40} />;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!emailVerification.isVerified) {
      setEmailVerification(prev => ({
        ...prev,
        error: 'Please verify your email address first',
        success: ''
      }));
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_ENDPOINTS.BASE_URL}/contact/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Show success notification
        setShowSuccessNotification(true);
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          service: 'Website Development',
          message: ''
        });
        
        setEmailVerification({
          codeSent: false,
          verificationCode: '',
          isVerified: false,
          loading: false,
          error: '',
          success: ''
        });

        // Hide notification after 5 seconds
        setTimeout(() => {
          setShowSuccessNotification(false);
        }, 5000);
      } else {
        setEmailVerification(prev => ({
          ...prev,
          error: data.error || 'Failed to send message. Please try again.',
          success: ''
        }));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setEmailVerification(prev => ({
        ...prev,
        error: 'Network error. Please try again.',
        success: ''
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-gray-900 relative overflow-hidden snap-start min-h-screen flex items-center">
      {/* Background Shape */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-900/5 skew-x-12 translate-x-32 z-0 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="lg:w-1/3"
          >
            <h2 className="text-4xl font-bold text-white mb-6">Let's Build Something <br/><span className="text-blue-500">Amazing Together</span></h2>
            <p className="text-gray-400 mb-8 text-lg">
              Have a project in mind? We'd love to hear about it. Send us a message and we'll get back to you within 24 hours.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-gray-300">
                <div className="w-12 h-12 bg-blue-900/20 rounded-full flex items-center justify-center text-blue-400">
                  <Mail size={20} />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Email Us</div>
                  <div className="font-semibold">rhynoxtechnologies@gmail.com</div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-gray-300">
                <div className="w-12 h-12 bg-purple-900/20 rounded-full flex items-center justify-center text-purple-400">
                  <Phone size={20} />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Call Us</div>
                  <div className="font-semibold">+91 79043 09363, +91 63740 08719</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
            className="lg:w-2/3"
          >
            <form className="bg-gray-800 p-8 md:p-10 rounded-3xl shadow-xl border border-gray-700 relative overflow-hidden" onSubmit={handleSubmit}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 relative z-10">
                <div>
                  <label className="block text-gray-400 font-medium mb-2">Your Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:border-blue-500 focus:bg-gray-900 focus:ring-2 focus:ring-blue-900 outline-none transition-all placeholder-gray-600" 
                    placeholder="John Doe" 
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-medium mb-2">
                    Your Gmail Address
                    {emailVerification.isVerified && (
                      <span className="ml-2 text-green-400 text-sm">✓ Verified</span>
                    )}
                  </label>
                  <div className="relative">
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={emailVerification.isVerified}
                      className={`w-full px-4 py-3 rounded-lg bg-gray-900 border ${
                        emailVerification.isVerified 
                          ? 'border-green-500 bg-green-900/10' 
                          : 'border-gray-700'
                      } text-white focus:border-blue-500 focus:bg-gray-900 focus:ring-2 focus:ring-blue-900 outline-none transition-all placeholder-gray-600 disabled:opacity-70`} 
                      placeholder="john@gmail.com" 
                    />
                    {emailVerification.isVerified && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400">
                        <CheckCircle size={20} />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Email Verification Section */}
              {!emailVerification.isVerified && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-6 p-6 bg-blue-900/10 border border-blue-800/30 rounded-xl relative z-10"
                >
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Mail size={18} className="text-blue-400" />
                    Email Verification Required
                  </h4>
                  <p className="text-gray-400 text-sm mb-4">
                    To ensure genuine communication, please verify your Gmail address by entering the code we'll send to your inbox.
                  </p>
                  
                  {!emailVerification.codeSent ? (
                    <button
                      type="button"
                      onClick={sendVerificationCode}
                      disabled={emailVerification.loading || !formData.email}
                      className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {emailVerification.loading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Mail size={18} />
                          Send Verification Code
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-300 font-medium mb-2 text-sm">
                          Enter 6-Digit Verification Code
                        </label>
                        <div className="flex gap-3">
                          <input
                            type="text"
                            maxLength="6"
                            value={emailVerification.verificationCode}
                            onChange={(e) => setEmailVerification(prev => ({
                              ...prev,
                              verificationCode: e.target.value.replace(/\D/g, '')
                            }))}
                            className="flex-1 px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white text-center text-2xl font-bold tracking-widest focus:border-blue-500 focus:ring-2 focus:ring-blue-900 outline-none transition-all"
                            placeholder="000000"
                          />
                          <button
                            type="button"
                            onClick={verifyCode}
                            disabled={emailVerification.loading || emailVerification.verificationCode.length !== 6}
                            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {emailVerification.loading ? 'Verifying...' : 'Verify'}
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={sendVerificationCode}
                        disabled={emailVerification.loading}
                        className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                      >
                        Didn't receive code? Resend
                      </button>
                    </div>
                  )}

                  {/* Status Messages */}
                  <AnimatePresence>
                    {emailVerification.error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-4 p-3 bg-red-900/20 border border-red-800/30 rounded-lg text-red-400 text-sm flex items-center gap-2"
                      >
                        <X size={16} />
                        {emailVerification.error}
                      </motion.div>
                    )}
                    {emailVerification.success && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-4 p-3 bg-green-900/20 border border-green-800/30 rounded-lg text-green-400 text-sm flex items-center gap-2"
                      >
                        <CheckCircle size={16} />
                        {emailVerification.success}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
              
              <div className="mb-6 relative z-10">
                <label className="block text-gray-400 font-medium mb-2">Service Interested In</label>
                <select 
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:border-blue-500 focus:bg-gray-900 focus:ring-2 focus:ring-blue-900 outline-none transition-all"
                >
                  <option className="bg-gray-900" value="Website Development">Website Development</option>
                  <option className="bg-gray-900" value="App Development">App Development</option>
                  <option className="bg-gray-900" value="Graphic Design">Graphic Design</option>
                  <option className="bg-gray-900" value="YouTube Ads">YouTube Ads</option>
                  <option className="bg-gray-900" value="Video Editing">Video Editing</option>
                </select>
              </div>
              
              <div className="mb-8 relative z-10">
                <label className="block text-gray-400 font-medium mb-2">Message</label>
                <textarea 
                  rows="4" 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:border-blue-500 focus:bg-gray-900 focus:ring-2 focus:ring-blue-900 outline-none transition-all placeholder-gray-600" 
                  placeholder="Tell us about your project..."
                ></textarea>
              </div>
              
              <motion.button 
                whileHover={{ scale: emailVerification.isVerified && !isSubmitting ? 1.02 : 1 }}
                whileTap={{ scale: emailVerification.isVerified && !isSubmitting ? 0.98 : 1 }}
                type="submit"
                disabled={!emailVerification.isVerified || isSubmitting}
                className={`w-full font-bold py-4 rounded-xl shadow-lg transition-all relative z-10 flex items-center justify-center gap-2 ${
                  emailVerification.isVerified && !isSubmitting
                    ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Sending...
                  </>
                ) : emailVerification.isVerified ? (
                  <>
                    <Mail size={20} />
                    Send Message
                  </>
                ) : (
                  'Verify Email to Continue'
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Success Notification */}
      <AnimatePresence>
        {showSuccessNotification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowSuccessNotification(false)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-gradient-to-br from-green-900 to-emerald-900 p-8 rounded-3xl shadow-2xl border-2 border-green-500/30 max-w-md w-full relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Animated Background Particles */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                  animate={{
                    scale: [0, 1, 0],
                    x: [0, (Math.random() - 0.5) * 300],
                    y: [0, (Math.random() - 0.5) * 300],
                    opacity: [1, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.1,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                  className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-400 rounded-full"
                />
              ))}

              {/* Blast Icons */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(8)].map((_, i) => {
                  const angle = (i * 360) / 8;
                  const radius = 150;
                  return (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
                      animate={{
                        scale: [0, 1.2, 0.8],
                        x: [0, Math.cos((angle * Math.PI) / 180) * radius],
                        y: [0, Math.sin((angle * Math.PI) / 180) * radius],
                        opacity: [0, 1, 0],
                        rotate: [0, 360]
                      }}
                      transition={{
                        duration: 1.5,
                        delay: i * 0.1,
                        ease: "easeOut"
                      }}
                      className="absolute top-1/2 left-1/2 text-green-400"
                    >
                      {getServiceIcon(formData.service)}
                    </motion.div>
                  );
                })}
              </div>

              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: 0.2, duration: 0.6 }}
                className="w-20 h-20 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center relative z-10"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <CheckCircle size={48} className="text-white" />
                </motion.div>
              </motion.div>

              {/* Success Message */}
              <div className="text-center relative z-10">
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold text-white mb-3"
                >
                  Thank You! 🎉
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-green-100 text-lg mb-2"
                >
                  Thanks for contacting us!
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-green-200 text-sm"
                >
                  We'll call you shortly to discuss your <strong>{formData.service}</strong> project.
                </motion.p>

                {/* Close Button */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  onClick={() => setShowSuccessNotification(false)}
                  className="mt-6 px-6 py-3 bg-white text-green-900 rounded-full font-bold hover:bg-green-50 transition-colors shadow-lg"
                >
                  Got it!
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const Footer = ({ onAdminTrigger }) => {
  // Triple tap detection for admin page
  const clickCountRef = useRef(0);
  const timerRef = useRef(null);

  const handleFooterClick = () => {
    clickCountRef.current += 1;
    if (clickCountRef.current === 3) {
      if (onAdminTrigger) onAdminTrigger();
      clickCountRef.current = 0;
      clearTimeout(timerRef.current);
    } else {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 2000); // reset after 2 seconds
    }
  };

  return (
    <footer className="bg-black text-white pt-20 pb-32 border-t border-gray-900 snap-start" onClick={handleFooterClick}>
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="text-2xl font-bold mb-6">Rhynox <span className="text-blue-500">Technologies</span></div>
            <p className="text-gray-500 leading-relaxed">
              We create digital experiences that transform businesses. Your growth is our mission.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-6">Services</h3>
            <ul className="space-y-3 text-gray-500">
              <li className="hover:text-white transition-colors cursor-pointer">Web Development</li>
              <li className="hover:text-white transition-colors cursor-pointer">App Development</li>
              <li className="hover:text-white transition-colors cursor-pointer">Graphic Design</li>
              <li className="hover:text-white transition-colors cursor-pointer">Video Editing</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-6">Company</h3>
            <ul className="space-y-3 text-gray-500">
              <li className="hover:text-white transition-colors cursor-pointer">About Us</li>
              <li className="hover:text-white transition-colors cursor-pointer">Portfolio</li>
              <li className="hover:text-white transition-colors cursor-pointer">Pricing</li>
              <li className="hover:text-white transition-colors cursor-pointer">Contact</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-6">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors text-gray-400 hover:text-white">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center hover:bg-blue-400 transition-colors text-gray-400 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors text-gray-400 hover:text-white">
                <Linkedin size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors text-gray-400 hover:text-white">
                <Facebook size={20} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">© 2024 Rhynox Technologies. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-gray-600">
            <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
const App = () => {
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <div className="font-sans text-white bg-gray-900 selection:bg-blue-500/30 selection:text-blue-200">
      <style>
        {`
          html { scroll-behavior: smooth; scroll-snap-type: y mandatory; }
          ::-webkit-scrollbar { width: 8px; }
          ::-webkit-scrollbar-track { background: #111827; }
          ::-webkit-scrollbar-thumb { background: #374151; border-radius: 4px; }
          ::-webkit-scrollbar-thumb:hover { background: #4B5563; }
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>
      <ScrollToTop />
      <TopBar />
      <Dock />
      <main>
        <Hero />
        <Services />
        <WhyUs />
        <Portfolio />
        <Pricing />
        <About />
        <Contact />
      </main>
        {showAdmin && (
          adminAuthenticated ? (
            <AdminDashboard user={currentUser} />
          ) : (
            <AdminLogin onSuccess={(user) => {
              setAdminAuthenticated(true);
              setCurrentUser(user);
            }} />
          )
        )}
      <Footer onAdminTrigger={() => setShowAdmin(true)} />
    </div>
  );
};

export default App;
