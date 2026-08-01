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
  PartyPopper,
  MessageCircle,
  Code2,
  Building2,
  ChevronRight,
  ShieldCheck,
  Headset,
  Gem,
  Github,
  Dribbble
} from 'lucide-react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import Chatbot from './Chatbot';
import { API_ENDPOINTS } from './config';
import { getSafeImageUrl } from './utils/imageUtils';
import { trackButtonClick } from './utils/analytics.js';
import NewHero from './components/hero/Hero';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* --- COMPONENT ARCHITECTURE & DATA --- */

// --- DATA CONSTANTS ---
// Updated colors for Dark Mode contrast
const SERVICES = [
  {
    id: 1,
    title: "Website Development",
    desc: "Custom, high-performance websites built with modern frameworks like React and Next.js.",
    icon: <Code size={28} />,
    color: "#6fd8c7",
    glow: "0 0 20px rgba(111, 216, 199, 0.35)",
    glowHover: "0 0 35px rgba(111, 216, 199, 0.55)",
    badgeBg: "radial-gradient(circle, rgba(111, 216, 199, 0.25) 0%, rgba(111, 216, 199, 0.05) 70%)",
    border: "rgba(111, 216, 199, 0.35)",
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "App Development",
    desc: "Native and cross-platform mobile applications designed for seamless user experiences.",
    icon: <Smartphone size={28} />,
    color: "#9b8cf0",
    glow: "0 0 20px rgba(155, 140, 240, 0.35)",
    glowHover: "0 0 35px rgba(155, 140, 240, 0.55)",
    badgeBg: "radial-gradient(circle, rgba(155, 140, 240, 0.25) 0%, rgba(155, 140, 240, 0.05) 70%)",
    border: "rgba(155, 140, 240, 0.35)",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    title: "Graphic Designing",
    desc: "Eye-catching posters, branding materials, and UI elements that tell your brand's story.",
    icon: <Palette size={28} />,
    color: "#f472b6",
    glow: "0 0 20px rgba(244, 114, 182, 0.35)",
    glowHover: "0 0 35px rgba(244, 114, 182, 0.55)",
    badgeBg: "radial-gradient(circle, rgba(244, 114, 182, 0.25) 0%, rgba(244, 114, 182, 0.05) 70%)",
    border: "rgba(244, 114, 182, 0.35)",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    title: "YouTube Ads Creation",
    desc: "High-conversion video ads scripted and produced to maximize your ROI.",
    icon: <Megaphone size={28} />,
    color: "#ff6b6b",
    glow: "0 0 20px rgba(255, 107, 107, 0.35)",
    glowHover: "0 0 35px rgba(255, 107, 107, 0.55)",
    badgeBg: "radial-gradient(circle, rgba(255, 107, 107, 0.25) 0%, rgba(255, 107, 107, 0.05) 70%)",
    border: "rgba(255, 107, 107, 0.35)",
    image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    title: "Video Editing",
    desc: "Professional editing, color grading, and motion graphics for polished content.",
    icon: <Video size={28} />,
    color: "#60a5fa",
    glow: "0 0 20px rgba(96, 165, 250, 0.35)",
    glowHover: "0 0 35px rgba(96, 165, 250, 0.55)",
    badgeBg: "radial-gradient(circle, rgba(96, 165, 250, 0.25) 0%, rgba(96, 165, 250, 0.05) 70%)",
    border: "rgba(96, 165, 250, 0.35)",
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    title: "SEO & Growth",
    desc: "Data-driven SEO strategies, technical audits, and search optimization to scale your reach.",
    icon: <Zap size={28} />,
    color: "#34d399",
    glow: "0 0 20px rgba(52, 211, 153, 0.35)",
    glowHover: "0 0 35px rgba(52, 211, 153, 0.55)",
    badgeBg: "radial-gradient(circle, rgba(52, 211, 153, 0.25) 0%, rgba(52, 211, 153, 0.05) 70%)",
    border: "rgba(52, 211, 153, 0.35)",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
  }
];

const PRICING_PLANS = [
  {
    title: "Starter",
    price: "₹499",
    period: "starting price",
    description: "Best for portfolios & small static websites",
    features: [
      "Responsive website",
      "Up to 5 pages",
      "Contact form",
      "WhatsApp integration",
      "Basic SEO",
      "Email integration"
    ],
    cta: "Get Started",
    popular: false,
    color: "blue"
  },
  {
    title: "Business",
    price: "₹999",
    period: "starting price",
    description: "Best for dynamic websites & simple apps",
    features: [
      "Dynamic website OR small app",
      "React-based UI",
      "Admin-editable content",
      "SEO & analytics setup",
      "WhatsApp & email integration",
      "Deployment support"
    ],
    cta: "Choose Business",
    popular: true,
    color: "purple"
  },
  {
    title: "Enterprise",
    price: "Custom",
    period: "project based",
    description: "Advanced & scalable solutions",
    features: [
      "Full-stack web / mobile apps",
      "Backend & database",
      "Payment gateway",
      "AI chatbot integration",
      "Cloud & hosting setup",
      "Dedicated support"
    ],
    cta: "Contact Sales",
    popular: false,
    color: "pink"
  }
];

const FEATURES = [
  {
    title: "Fast Delivery",
    icon: <Clock size={24} />,
    desc: "We value your time. Quick turnarounds without compromising quality.",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Affordable Pricing",
    icon: <CheckCircle size={24} />,
    desc: "Premium services tailored to fit startup and SME budgets.",
    image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Modern Tech",
    icon: <Zap size={24} />,
    desc: "We use the latest tools (React, Tailwind, Motion) for future-proof solutions.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Client Focused",
    icon: <Users size={24} />,
    desc: "Your vision is our priority. We collaborate closely at every step.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
  }
];

const PORTFOLIO = [];

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

  // Debug: Log project data to see if challenges and solutions are present
  console.log('ProjectModal - Project data:', {
    title: project.title,
    hasChallenges: !!project.challenges,
    challengesLength: project.challenges?.length,
    challenges: project.challenges,
    hasSolutions: !!project.solutions,
    solutionsLength: project.solutions?.length,
    solutions: project.solutions
  });

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
                  {project.challenges && project.challenges.length > 0 ? (
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-md font-semibold text-blue-400 mb-2">Challenges</h5>
                        <ul className="list-disc list-inside text-gray-300 leading-relaxed space-y-1">
                          {project.challenges.map((challenge, idx) => (
                            <li key={idx}>{challenge}</li>
                          ))}
                        </ul>
                      </div>
                      {project.solutions && project.solutions.length > 0 && (
                        <div>
                          <h5 className="text-md font-semibold text-green-400 mb-2">Solutions</h5>
                          <ul className="list-disc list-inside text-gray-300 leading-relaxed space-y-1">
                            {project.solutions.map((solution, idx) => (
                              <li key={idx}>{solution}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-400 leading-relaxed">
                      We focused on creating a user-centric design that maximizes engagement. By leveraging modern caching techniques, we reduced load times by 40%, ensuring a smooth experience even on slower connections.
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 h-fit">
                <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Code size={18} className="text-blue-400" /> Technologies
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
    </>
  );
};

// --- NAVIGATION SYSTEM ---
// TopBar is now integrated inside src/components/hero/Hero.jsx

const DockItem = ({ item }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative flex items-center group overflow-visible">
      {/* Tooltip - shown on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            style={{ translateX: '-50%' }}
            className="absolute bottom-full mb-4 left-1/2 bg-gray-900/95 backdrop-blur-md text-white text-[10px] md:text-xs font-medium px-3 py-1.5 rounded-lg shadow-xl border border-white/10 whitespace-nowrap z-[9999] pointer-events-none origin-bottom"
          >
            {item.label}
            {/* Tiny triangle pointer */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 border-r border-b border-white/10 rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => {
          const el = document.querySelector(item.href);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        whileHover={{ scale: 1.15, y: -4 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        // Better touch targets for mobile
        className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full md:rounded-xl bg-gray-800/50 hover:bg-gray-700/80 border border-white/10 text-gray-400 hover:text-blue-400 hover:border-blue-400/50 transition-colors shadow-lg backdrop-blur-sm"
      >
        {item.icon}
      </motion.button>
    </div>
  );
};

const Dock = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Hide dock when near bottom of page (footer area)
      const footerThreshold = document.documentElement.scrollHeight - 600;
      if ((window.innerHeight + window.scrollY) >= footerThreshold) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reduced icon size to 20 for desktop, 18 for mobile
  const navItems = [
    { icon: <Home size={18} className="md:w-5 md:h-5" />, label: "Home", href: "#home" },
    { icon: <LayoutGrid size={18} className="md:w-5 md:h-5" />, label: "Services", href: "#services" },
    { icon: <Award size={18} className="md:w-5 md:h-5" />, label: "Why Us", href: "#why-us" },
    { icon: <Briefcase size={18} className="md:w-5 md:h-5" />, label: "Portfolio", href: "#portfolio" },
    { icon: <Info size={18} className="md:w-5 md:h-5" />, label: "About", href: "#about" },
    { icon: <Mail size={18} className="md:w-5 md:h-5" />, label: "Contact", href: "#contact" },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed bottom-3 md:bottom-5 left-0 right-0 flex justify-center z-[45] pointer-events-none px-2">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            // Optimized container with better mobile support - removed overflow to allow tooltips
            className="pointer-events-auto flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 bg-gray-900/90 backdrop-blur-xl border border-white/20 rounded-full md:rounded-2xl shadow-2xl overflow-visible relative"
          >
            {navItems.map((item) => (
              <DockItem key={item.label} item={item} />
            ))}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Hero is now the new premium component from src/components/hero/Hero.jsx
const Hero = NewHero;

const ServiceCard = ({ service, isClicked, onClick }) => {
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -8, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.7)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
      className={`backdrop-blur-md rounded-2xl shadow-xl border-2 transition-all group relative overflow-hidden cursor-pointer ${isClicked
        ? 'border-white shadow-[0_0_30px_rgba(255,255,255,0.3)]'
        : 'border-gray-700/50 hover:border-white/60 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]'
        }`}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <img
          src={service.image}
          alt={service.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/80" />
      </div>

      <div className="relative z-10 p-8">
        {isClicked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-white/5 pointer-events-none rounded-2xl"
          />
        )}
        <div className={`w-16 h-16 rounded-xl ${service.bg} ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 ease-out relative z-10 ${isClicked ? 'ring-2 ring-white shadow-[0_0_20px_rgba(255,255,255,0.4)]' : ''
          }`}>
          {service.icon}
        </div>
        <h3 className={`text-2xl font-bold mb-3 relative z-10 transition-colors ${isClicked ? 'text-white' : 'text-white'
          }`}>{service.title}</h3>
        <p className="text-gray-200 leading-relaxed relative z-10">{service.desc}</p>
      </div>

      {isClicked && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 0.5 }}
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-white/60 via-white to-white/60"
        />
      )}
    </motion.div>
  );
};

const Services = () => {
  const [clickedCard, setClickedCard] = useState(null);

  const handleCardClick = (serviceId) => {
    setClickedCard(clickedCard === serviceId ? null : serviceId);
  };

  return (
    <section id="services" className="pt-4 pb-24 bg-transparent relative overflow-hidden snap-start min-h-screen flex flex-col justify-center">

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-blue-800 to-purple-800 mb-4"
          >
            Our Expertise
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: 100 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"
          />
          <p className="text-gray-700 font-medium mt-4 max-w-xl mx-auto">
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
            <ServiceCard
              key={service.id}
              service={service}
              isClicked={clickedCard === service.id}
              onClick={() => handleCardClick(service.id)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const WhyUs = () => {
  const [clickedFeature, setClickedFeature] = useState(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Track window dimensions for resize re-calculations
  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial values
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const gsapCtxRef = useRef(null);

  const handleFeatureClick = (index) => {
    setClickedFeature(clickedFeature === index ? null : index);
  };

  // Core: set up stacked state, then auto-play to grid on enter, reverse on leave
  useEffect(() => {
    if (prefersReducedMotion) return;

    const timer = setTimeout(() => {
      const container = containerRef.current;
      const section   = sectionRef.current;
      const cards     = cardsRef.current.filter(Boolean);
      if (!container || !section || cards.length !== 4) return;

      // Kill previous context on resize
      if (gsapCtxRef.current) {
        gsapCtxRef.current.revert();
        gsapCtxRef.current = null;
      }

      const ctx = gsap.context(() => {
        // 1. Clear transforms so positions are natural
        gsap.set(cards, { clearProps: 'all', opacity: 1 });

        // 2. Measure natural grid centres
        const containerRect  = container.getBoundingClientRect();
        const cCX = containerRect.left + containerRect.width  / 2;
        const cCY = containerRect.top  + containerRect.height / 2;

        const stackCfg = [
          { scale: 1.00, rotate:  0,  zIndex: 40 },
          { scale: 0.97, rotate: -2,  zIndex: 30 },
          { scale: 0.94, rotate:  2,  zIndex: 20 },
          { scale: 0.91, rotate: -1,  zIndex: 10 },
        ];

        // 3. Snap all cards to the stacked centre immediately
        cards.forEach((card, idx) => {
          const r   = card.getBoundingClientRect();
          const cfg = stackCfg[idx];
          gsap.set(card, {
            x: cCX - (r.left + r.width  / 2),
            y: cCY - (r.top  + r.height / 2),
            scale:    cfg.scale,
            rotation: cfg.rotate,
            zIndex:   cfg.zIndex,
            opacity:  1,
            transformOrigin: 'center center',
            willChange: 'transform',
          });
        });

        // 4. Build the timeline that triggers via ScrollTrigger toggleActions
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            end: "bottom 25%",
            toggleActions: "play reverse play reverse",
            onToggle: (self) => {
              cards.forEach(card => {
                if (card) card.style.willChange = self.isActive ? 'transform' : 'auto';
              });
            }
          }
        });

        cards.forEach((card, idx) => {
          tl.to(card, {
            x: 0, y: 0, scale: 1, rotation: 0,
            ease: 'power3.out',
            duration: 0.75,
          }, idx * 0.07); // 70ms stagger — slight but not mechanical
        });
      }, section);

      gsapCtxRef.current = ctx;
    }, 120);

    return () => {
      clearTimeout(timer);
      if (gsapCtxRef.current) {
        gsapCtxRef.current.revert();
        gsapCtxRef.current = null;
      }
    };
  }, [prefersReducedMotion, dimensions]);

  return (
    <section id="why-us" ref={sectionRef} className="py-24 bg-transparent relative overflow-hidden snap-start min-h-screen flex items-center">
      {/* Floating Particles */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -20, 0],
            x: [0, Math.random() * 30 - 15, 0],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 4
          }}
          className="absolute w-1.5 h-1.5 bg-blue-400/30 rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`
          }}
        />
      ))}

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-800">Rhynox?</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: 100 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 mx-auto rounded-full"
          />
          <p className="text-gray-800 mt-4 max-w-2xl mx-auto text-lg font-medium">
            We don't just deliver projects; we build partnerships. Our unique blend of creative design and technical robustness ensures your business stands out.
          </p>
        </div>

        {/* Features Grid with Images */}
        <div
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto relative min-h-[500px]"
        >
          {FEATURES.map((feature, idx) => {
            const isGSAP = !prefersReducedMotion;
            const CardWrapper = prefersReducedMotion ? motion.div : 'div';
            const motionProps = prefersReducedMotion ? {
              initial: { opacity: 0, y: 30 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { duration: 0.6, delay: idx * 0.1 }
            } : {};

            return (
              <CardWrapper
                key={idx}
                ref={el => {
                  if (cardsRef.current) cardsRef.current[idx] = el;
                }}
                {...motionProps}
                className={`relative rounded-2xl min-h-[280px] ${isGSAP ? 'opacity-0' : ''}`}
                style={{
                  willChange: isGSAP ? 'transform' : 'auto'
                }}
              >
                <div
                  onClick={() => handleFeatureClick(idx)}
                  className={`w-full min-h-[280px] backdrop-blur-md rounded-2xl shadow-xl border-2 transition-all duration-300 relative overflow-hidden cursor-pointer ${
                    clickedFeature === idx
                      ? 'border-white shadow-[0_0_30px_rgba(255,255,255,0.3)]'
                      : 'border-gray-700/50 hover:border-white/60 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:-translate-y-2'
                  }`}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0 overflow-hidden rounded-2xl">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-black/90" />
                  </div>

                  <div className="relative z-10 p-6">
                    {clickedFeature === idx && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.2, 0.4, 0.2] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-white/5 pointer-events-none rounded-2xl"
                      />
                    )}
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 relative ${clickedFeature === idx ? 'ring-2 ring-white shadow-[0_0_20px_rgba(255,255,255,0.4)]' : ''
                      }`}>
                      {feature.icon}
                    </div>
                    <h4 className="font-bold mb-2 text-lg text-white">{feature.title}</h4>
                    <p className="text-gray-200 text-sm leading-relaxed">{feature.desc}</p>
                  </div>

                  {clickedFeature === idx && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.5 }}
                      className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-white/60 via-white to-white/60"
                    />
                  )}
                </div>
              </CardWrapper>
            );
          })}
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
            image: getSafeImageUrl(p.images?.[0] || p.image),
            images: (p.images || [p.image]).map(getSafeImageUrl),
            client: p.client,
            timeline: p.timeline,
            role: p.role,
            challenges: p.challenges || [],
            solutions: p.solutions || []
          }));
          setProjects(formattedData);
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
    <section id="portfolio" className="pt-10 pb-40 bg-transparent overflow-hidden relative snap-start min-h-screen flex flex-col justify-center">
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
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black/40 to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black/40 to-transparent z-20 pointer-events-none" />

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
                className="group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer bg-gray-800 border border-gray-700 flex-shrink-0 w-[300px] md:w-[450px] aspect-[4/3]"
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

const Pricing = ({ onSelectPlan }) => {
  // Entire pricing section commented out — returns nothing
  return null;
  /*
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
        </div>
      </div>
    </section>
  );
  */
};

const STATS = [
  {
    number: '50+',
    label: 'Projects Completed',
    gradient: 'from-teal-400 via-blue-500 to-purple-600',
    glow: 'rgba(45,212,191,0.25)',
  },
  {
    number: '100%',
    label: 'Client Satisfaction',
    gradient: 'from-purple-500 via-pink-500 to-teal-400',
    glow: 'rgba(168,85,247,0.25)',
  },
  {
    number: '24/7',
    label: 'Support',
    gradient: 'from-pink-500 via-rose-400 to-orange-400',
    glow: 'rgba(236,72,153,0.25)',
  },
];

const About = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const sectionRef      = useRef(null);
  const circlesRef      = useRef([]);   // outer wrappers — x / y / opacity only
  const circleSpinRefs  = useRef([]);   // inner circle divs — squish + rotation only
  const gsapCtxRef      = useRef(null);

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // GSAP: drop → squish → roll right (rotation always ends upright)
  useEffect(() => {
    if (prefersReducedMotion) return;

    const timer = setTimeout(() => {
      const section    = sectionRef.current;
      const wrappers   = circlesRef.current.filter(Boolean);
      const spinners   = circleSpinRefs.current.filter(Boolean);
      if (!section || wrappers.length !== 3 || spinners.length !== 3) return;

      if (gsapCtxRef.current) {
        gsapCtxRef.current.revert();
        gsapCtxRef.current = null;
      }

      const ctx = gsap.context(() => {
        // Clear any leftover transforms
        gsap.set([...wrappers, ...spinners], { clearProps: 'all' });

        // Measure final natural positions of each outer wrapper
        const rects      = wrappers.map(w => w.getBoundingClientRect());
        const diameter   = rects[0].width;          // px
        const circumf    = Math.PI * diameter;       // px per full rotation
        const DROP_H     = 480;                      // px above final Y

        // ── Initial state ──
        // Outer wrappers: all stacked at circle[0]'s X, high above Y
        wrappers.forEach((w, idx) => {
          gsap.set(w, {
            x:       rects[0].left - rects[idx].left,
            y:       -DROP_H,
            opacity: 0,
            willChange: 'transform, opacity',
          });
        });
        // Inner spinners: upright, no squish
        gsap.set(spinners, { scaleX: 1, scaleY: 1, rotation: 0, transformOrigin: 'center center' });

        // ── Master timeline ──
        const masterTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start:   'top 70%',
            toggleActions: 'restart none none reset',
          },
          onComplete: () => {
            [...wrappers, ...spinners].forEach(el => { if (el) el.style.willChange = 'auto'; });
          },
        });

        wrappers.forEach((wrapper, idx) => {
          const spinner  = spinners[idx];
          const rollDist = rects[idx].left - rects[0].left; // px to travel right after landing

          // Round up to nearest full rotation so circle always lands upright
          const rawRot   = (rollDist / circumf) * 360;
          const fullRot  = Math.ceil(rawRot / 360) * 360; // e.g. 0°, 360°, 720°

          const tl = gsap.timeline();

          // Phase 1 — FALL (gravity: power4.in = slow start → slams)
          tl.to(wrapper, {
            y: 0, opacity: 1,
            duration: 0.52,
            ease: 'power4.in',
          });

          // Phase 2 — SQUISH at impact (water-droplet splat)
          tl.to(spinner, {
            scaleX: 1.32, scaleY: 0.68,
            duration: 0.07,
            ease: 'none',
          }, '<0.48'); // overlap: starts just before fall ends

          // Phase 3 — ROLL RIGHT (wrapper slides to X=0, spinner unsquishes + spins to full rotation)
          tl.to(wrapper, {
            x: 0,
            duration: 0.52,
            ease: 'power2.out',
          }, '>');
          tl.to(spinner, {
            scaleX: 1, scaleY: 1,
            rotation: fullRot,   // always a multiple of 360° → lands perfectly upright
            duration: 0.52,
            ease: 'power2.out',
          }, '<'); // sync with roll

          masterTl.add(tl, idx * 0.25); // 0.25s stagger per circle
        });
      }, section);

      gsapCtxRef.current = ctx;
    }, 150);

    return () => {
      clearTimeout(timer);
      if (gsapCtxRef.current) {
        gsapCtxRef.current.revert();
        gsapCtxRef.current = null;
      }
    };
  }, [prefersReducedMotion]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-24 bg-transparent snap-start min-h-screen flex items-center"
    >
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">

          {/* ── Static text — no animation ── */}
          <h2 className="text-4xl font-bold text-white mb-8">
            About <span className="text-blue-500">Rhynox Technologies</span>
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed mb-6">
            Founded on the belief that digital transformation should be accessible and impactful,
            Rhynox Technologies is a new-age digital agency. We combine technical expertise with
            creative flair to build products that not only look good but perform exceptionally.
          </p>
          <p className="text-lg text-gray-400 mb-10">
            Our mission is to empower startups and established businesses alike with the tools
            they need to thrive in the modern economy. Whether it's code, design, or strategy,
            we pour our passion into every pixel.
          </p>

          {/* ── Animated stat circles ── */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-10 md:gap-16 mt-16">
            {STATS.map((stat, idx) => {

              /* prefers-reduced-motion: simple fade-in, no physics */
              if (prefersReducedMotion) {
                return (
                  <motion.div
                    key={idx}
                    className="flex flex-col items-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.12 }}
                  >
                    <StatCircle stat={stat} spinRef={null} />
                    <span className="text-gray-400 font-semibold mt-4 text-center max-w-[160px] text-sm md:text-base leading-snug">
                      {stat.label}
                    </span>
                  </motion.div>
                );
              }

              /* GSAP path */
              return (
                <div
                  key={idx}
                  ref={el => { circlesRef.current[idx] = el; }}
                  className="flex flex-col items-center opacity-0"
                >
                  {/* Inner wrapper: only this gets squish + rotation — label is sibling, stays upright */}
                  <StatCircle
                    stat={stat}
                    spinRef={el => { circleSpinRefs.current[idx] = el; }}
                  />
                  <span className="text-gray-400 font-semibold mt-4 text-center max-w-[160px] text-sm md:text-base leading-snug">
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};

/* ── StatCircle: the glass gradient ring + number
   spinRef attaches to the outer div so squish/rotation affects the circle only, not the label ── */
const StatCircle = ({ stat, spinRef }) => (
  <div
    ref={spinRef}
    className={`relative w-[140px] h-[140px] md:w-[155px] md:h-[155px] rounded-full p-[2.5px] bg-gradient-to-br ${stat.gradient} select-none`}
    style={{
      boxShadow: `0 0 32px 0 ${stat.glow}, 0 4px 24px rgba(0,0,0,0.5)`,
      transformOrigin: 'center center',
    }}
  >
    {/* Inner dark fill */}
    <div className="w-full h-full rounded-full bg-slate-950/90 flex items-center justify-center">
      <span className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
        {stat.number}
      </span>
    </div>
    {/* Subtle inner glow */}
    <div
      className="absolute inset-0 rounded-full pointer-events-none"
      style={{ boxShadow: `inset 0 0 18px 0 ${stat.glow}` }}
    />
  </div>
);






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
    <section id="contact" className="py-24 bg-transparent relative overflow-hidden snap-start min-h-screen flex items-center">

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ type: "spring", stiffness: 80, damping: 18, duration: 0.8 }}
            className="lg:w-1/3"
          >
            <motion.h2 
              initial={{ opacity: 0, x: -80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl font-bold text-white mb-6"
            >
              Let's Build Something <br /><span className="text-blue-500">Amazing Together</span>
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, x: -80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-400 mb-8 text-lg"
            >
              Have a project in mind? We'd love to hear about it. Send us a message and we'll get back to you within 24 hours.
            </motion.p>

            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: -80 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex items-center gap-4 text-gray-300"
              >
                <div className="w-12 h-12 bg-blue-900/20 rounded-full flex items-center justify-center text-blue-400">
                  <Mail size={20} />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Email Us</div>
                  <a href="mailto:rhynoxtechnologies@gmail.com" className="font-semibold hover:text-blue-400 transition-colors cursor-pointer">rhynoxtechnologies@gmail.com</a>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -80 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex items-center gap-4 text-gray-300"
              >
                <div className="w-12 h-12 bg-purple-900/20 rounded-full flex items-center justify-center text-purple-400">
                  <Phone size={20} />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Call Us</div>
                  <div className="font-semibold">
                    <a
                      href="tel:+91 81483 11669"
                      className="hover:text-purple-400 transition-colors cursor-pointer"
                      onClick={() => trackButtonClick('mobile')}
                    >
                      +91 81483 11669
                    </a>
                  </div>
                </div>
              </motion.div>
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
                      className={`w-full px-4 py-3 rounded-lg bg-gray-900 border ${emailVerification.isVerified
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
                        <div className="flex flex-col sm:flex-row gap-3">
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
                            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
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
                className={`w-full font-bold py-4 rounded-xl shadow-lg transition-all relative z-10 flex items-center justify-center gap-2 ${emailVerification.isVerified && !isSubmitting
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
    <footer className="bg-[#fafafa] text-gray-800 pt-16 pb-12 border-t border-gray-200 snap-start" onClick={handleFooterClick}>
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12">
          
          {/* Column 1: Brand & Contact (5 cols) */}
          <div className="md:col-span-5 pr-0 lg:pr-8">
            <div className="flex items-center gap-3 mb-6">
              <img 
                src="/rhynox_logo.png" 
                alt="Rhynox Technologies" 
                className="h-10 w-auto object-contain" 
              />
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-wider text-slate-900 leading-none">RHYNOX</span>
                <span className="text-[10px] font-bold tracking-[0.25em] text-slate-500 uppercase mt-1">TECHNOLOGIES</span>
              </div>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed mb-6 max-w-md">
              Building modern websites, AI-powered solutions, mobile applications, and digital experiences that help businesses grow faster.
            </p>

            {/* Contact Details */}
            <div className="space-y-2.5 text-sm text-gray-700 mb-6">
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-blue-600 shrink-0" />
                <span>Chennai, India</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-blue-600 shrink-0" />
                <a href="mailto:rhynoxtechnologies@gmail.com" className="hover:text-blue-600 transition-colors">rhynoxtechnologies@gmail.com</a>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-blue-600 shrink-0" />
                <a href="tel:+918148311669" className="hover:text-blue-600 transition-colors">+91 81483 11669</a>
              </div>
            </div>

            {/* Social Icons (Instagram, LinkedIn, WhatsApp only) */}
            <div className="flex flex-wrap gap-2.5">
              <a 
                href="https://www.instagram.com/rhynox_technologies/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-rose-500 hover:border-blue-400 hover:shadow-md transition-all"
                title="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="https://www.linkedin.com/in/rhynox-technologies-85b6a53a1/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-blue-600 hover:border-blue-400 hover:shadow-md transition-all"
                title="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a 
                href="https://wa.me/918148311669" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-emerald-500 hover:border-emerald-400 hover:shadow-md transition-all"
                title="WhatsApp"
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Vertical Divider (Desktop) */}
          <div className="hidden md:block md:col-span-1 flex justify-center">
            <div className="h-full w-[1px] bg-gray-200/80 mx-auto" />
          </div>

          {/* Column 2: Services (3 cols) */}
          <div className="md:col-span-3">
            <div className="flex items-center gap-2 mb-2 text-blue-600 font-semibold">
              <Code2 size={20} />
              <h3 className="text-lg font-bold text-slate-900">Services</h3>
            </div>
            <div className="w-10 h-[2px] bg-blue-600 mb-6" />

            <ul className="space-y-3.5 text-sm text-gray-600">
              {['Web Development', 'App Development', 'AI Solutions', 'UI/UX Design', 'Cloud Solutions', 'Video Production'].map((item) => (
                <li key={item} className="flex items-center gap-2 hover:text-blue-600 transition-colors cursor-pointer group">
                  <ChevronRight size={15} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Vertical Divider (Desktop) */}
          <div className="hidden md:block md:col-span-1 flex justify-center">
            <div className="h-full w-[1px] bg-gray-200/80 mx-auto" />
          </div>

          {/* Column 3: Company (2 cols) */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-2 text-blue-600 font-semibold">
              <Building2 size={20} />
              <h3 className="text-lg font-bold text-slate-900">Company</h3>
            </div>
            <div className="w-10 h-[2px] bg-blue-600 mb-6" />

            <ul className="space-y-3.5 text-sm text-gray-600">
              {[
                { label: 'About Us', href: '#about' },
                { label: 'Portfolio', href: '#portfolio' },
                { label: 'Services', href: '#services' },
                { label: 'Why Us', href: '#why-us' }
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="flex items-center gap-2 hover:text-blue-600 transition-colors cursor-pointer group">
                    <ChevronRight size={15} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar Separator */}
        <div className="border-t border-gray-200 pt-6 flex flex-col lg:flex-row justify-between items-center gap-6 text-xs text-gray-500">
          <div>
            © 2026 Rhynox Technologies. All rights reserved.
          </div>

          {/* Quality Badges matching design */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-blue-600 shrink-0" />
              <span>Secure & Reliable</span>
            </div>
            <div className="hidden md:block w-[1px] h-3 bg-gray-300" />

            <div className="flex items-center gap-2">
              <Zap size={16} className="text-blue-600 shrink-0" />
              <span>Fast Delivery</span>
            </div>
            <div className="hidden md:block w-[1px] h-3 bg-gray-300" />

            <div className="flex items-center gap-2">
              <Gem size={16} className="text-purple-600 shrink-0" />
              <span>Modern Technologies</span>
            </div>
            <div className="hidden md:block w-[1px] h-3 bg-gray-300" />

            <div className="flex items-center gap-2">
              <Headset size={16} className="text-blue-600 shrink-0" />
              <span>Long-Term Support</span>
            </div>
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
  const [selectedPlan, setSelectedPlan] = useState(null);

  return (
    <div className="font-sans text-white bg-gray-900 selection:bg-blue-500/30 selection:text-blue-200">
      <style>
        {`
          html { scroll-behavior: smooth;  }
          ::-webkit-scrollbar { width: 8px; }
          ::-webkit-scrollbar-track { background: #111827; }
          ::-webkit-scrollbar-thumb { background: #374151; border-radius: 4px; }
          ::-webkit-scrollbar-thumb:hover { background: #4B5563; }
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>
      <ScrollToTop />
      <Dock />
      <main>
        <Hero />
        <div className="bg-gradient-to-b from-gray-100 via-gray-400 via-gray-700 to-gray-950">
          <Services />
          <WhyUs />
          <Portfolio />
          <Pricing onSelectPlan={setSelectedPlan} />
          <About />
          <Contact />
        </div>
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
      <Chatbot openWithPlan={selectedPlan} />
    </div>
  );
};

export default App;
