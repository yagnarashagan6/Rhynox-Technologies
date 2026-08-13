import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import ReactLenis from 'lenis/react';
import {
  Code,
  Smartphone,
  Palette,
  Megaphone,
  Video,
  Zap,
  Users,
  Clock,
  CheckCircle,
  Menu,
  X,
  ArrowRight,
  ChevronRight,
  Instagram,
  Linkedin,
  Facebook,
  Mail,
  MapPin,
  Phone,
  User,
  Sparkles,
  ExternalLink,
  Check,
  ShieldCheck,
  Building2,
  Headset,
  Award,
  Layers,
  Send
} from 'lucide-react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import Chatbot from './Chatbot';

// --- DATA CONSTANTS FOR RHYNOX TECHNOLOGIES ---
const SERVICES = [
  {
    id: 1,
    title: "Website Development",
    shortTitle: "Web Dev",
    category: "Engineering",
    desc: "Custom, high-performance web applications built with modern frameworks like React, Next.js, and Tailwind CSS.",
    icon: <Code className="w-6 h-6 text-[#00C2BB]" />,
    features: ["Responsive Design", "SEO Optimized", "Fast Page Speed", "Custom CMS Integrations"]
  },
  {
    id: 2,
    title: "App Development",
    shortTitle: "Mobile Dev",
    category: "Mobile",
    desc: "Native and cross-platform mobile applications designed for fluid, seamless iOS & Android user experiences.",
    icon: <Smartphone className="w-6 h-6 text-[#00C2BB]" />,
    features: ["iOS & Android Apps", "React Native", "Push Notifications", "Offline-first Storage"]
  },
  {
    id: 3,
    title: "Graphic Designing",
    shortTitle: "Design",
    category: "Creative",
    desc: "Eye-catching branding materials, UI/UX mockups, social media posters, and vector illustrations.",
    icon: <Palette className="w-6 h-6 text-[#00C2BB]" />,
    features: ["Brand Identity", "UI/UX Mockups", "Social Media Graphics", "Marketing Collateral"]
  },
  {
    id: 4,
    title: "YouTube Ads Creation",
    shortTitle: "Advertising",
    category: "Marketing",
    desc: "High-conversion video ad copy, strategic targeting, and visual scripts engineered to maximize ROI.",
    icon: <Megaphone className="w-6 h-6 text-[#00C2BB]" />,
    features: ["High Conversion Scripts", "Target Audience Research", "A/B Test Graphics", "Performance Analytics"]
  },
  {
    id: 5,
    title: "Video Editing",
    shortTitle: "Post-Production",
    category: "Video",
    desc: "Professional video post-production, motion graphics, audio mastering, and color grading.",
    icon: <Video className="w-6 h-6 text-[#00C2BB]" />,
    features: ["4K Video Editing", "Dynamic Transitions", "Color Grading", "Sound Design & VFX"]
  },
  {
    id: 6,
    title: "SEO & Digital Scale",
    shortTitle: "SEO Growth",
    category: "Marketing",
    desc: "Data-driven SEO strategies, technical site audits, keyword domination, and organic growth scaling.",
    icon: <Zap className="w-6 h-6 text-[#00C2BB]" />,
    features: ["Technical SEO", "Keyword Optimization", "Link Building", "Analytics & Reporting"]
  }
];

const PRICING_PLANS = [
  {
    id: "starter",
    title: "Starter",
    price: "₹499",
    period: "starting price",
    description: "Ideal for personal portfolios, landing pages & small static websites.",
    features: [
      "Responsive Single Page / Portfolio",
      "Up to 5 Custom Sections",
      "Contact Form & Email Delivery",
      "WhatsApp Chat Direct Link",
      "Basic On-Page SEO",
      "1 Month Free Maintenance"
    ],
    popular: false
  },
  {
    id: "business",
    title: "Business",
    price: "₹999",
    period: "starting price",
    description: "Best for dynamic startup websites, business portals & web apps.",
    features: [
      "Full Modern React/Next.js Web App",
      "Admin Editable Content & CMS",
      "SEO & Google Analytics Integration",
      "Custom Animations & Micro-Interactions",
      "WhatsApp & Lead Management",
      "3 Months Priority Support"
    ],
    popular: true
  },
  {
    id: "enterprise",
    title: "Enterprise",
    price: "Custom",
    period: "tailored scope",
    description: "Comprehensive end-to-end full stack web, mobile & AI integrations.",
    features: [
      "Full-Stack Web & Native Mobile Apps",
      "Custom Backend API & Cloud Infrastructure",
      "Secure Payment Gateway Integration",
      "AI Chatbot & Automation Bot",
      "Custom Graphic Design Package",
      "Dedicated Technical Account Manager"
    ],
    popular: false
  }
];

const METRICS = [
  { value: "100+", label: "Projects Delivered" },
  { value: "99%", label: "Client Satisfaction" },
  { value: "5+", label: "Years Experience" },
  { value: "24/7", label: "Dedicated Support" },
  { value: "50+", label: "Enterprise Clients" }
];

const PARTNER_LOGOS = [
  { name: "React", text: "REACT" },
  { name: "Next.js", text: "NEXT.JS" },
  { name: "Node.js", text: "NODE.JS" },
  { name: "Tailwind", text: "TAILWIND" },
  { name: "AWS", text: "AWS CLOUD" },
  { name: "Python", text: "PYTHON" },
  { name: "Figma", text: "FIGMA" }
];

const BLOG_POSTS = [
  {
    id: 1,
    title: "Building High-Performance React Web Apps in 2026",
    category: "Engineering",
    date: "August 2, 2026",
    readTime: "5 min read",
    desc: "Discover the architectural patterns and optimization techniques driving ultra-fast modern web applications.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "Why Modern Tech Branding Needs Geometric Motion",
    category: "Design",
    date: "July 28, 2026",
    readTime: "4 min read",
    desc: "How sleek dark aesthetics, subtle micro-animations, and sharp typography transform user trust.",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    title: "Maximizing YouTube Ad ROI With Data Analytics",
    category: "Marketing",
    date: "July 15, 2026",
    readTime: "6 min read",
    desc: "A breakdown of creative video scripting, targeted audience hooks, and post-campaign tracking.",
    image: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=80"
  }
];

// --- CANVAS PARTICLE BACKGROUND COMPONENT ---
const ConstellationCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement.offsetWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes
    const particleCount = Math.floor((width * height) / 14000);
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.8 + 0.8
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle background gradient glow
      const radialGlow = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.max(width, height) / 1.2
      );
      radialGlow.addColorStop(0, 'rgba(0, 194, 187, 0.04)');
      radialGlow.addColorStop(0.5, 'rgba(15, 23, 42, 0.05)');
      radialGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, width, height);

      // Update & render particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fill();

        // Connect nearby nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const alpha = (1 - dist / 130) * 0.22;
            ctx.strokeStyle = `rgba(0, 194, 187, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
    />
  );
};

// --- TYPEWRITER TEXT ANIMATION COMPONENT ---
const TypewriterText = ({
  text = "Full-spectrum digital transformation — web & mobile apps, video ads, and graphic design.",
  speed = 100,
  deleteSpeed = 50,
  pauseDuration = 2000,
  loop = true,
  className = "",
  showCursor = true
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let timeout;
    if (isPaused) {
      timeout = setTimeout(() => {
        setIsPaused(false);
        if (loop) {
          setIsDeleting(true);
        }
      }, pauseDuration);
    } else if (isDeleting) {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(text.substring(0, displayText.length - 1));
        }, deleteSpeed);
      } else {
        setIsDeleting(false);
      }
    } else {
      if (displayText.length < text.length) {
        timeout = setTimeout(() => {
          setDisplayText(text.substring(0, displayText.length + 1));
        }, speed);
      } else if (loop) {
        setIsPaused(true);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, isPaused, text, speed, deleteSpeed, pauseDuration, loop]);

  return (
    <div className={`font-mono ${className}`}>
      <span className="text-[#E2ECE9] font-mono text-base sm:text-lg leading-relaxed">
        {displayText}
        {showCursor && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
            className="text-[#00C2BB] font-bold ml-1"
          >
            |
          </motion.span>
        )}
      </span>
    </div>
  );
};

// --- HERO SECTION (LEFT-ALIGNED, COMPACT REFINED TYPOGRAPHY & SMOOTH KINETIC REVEAL) ---
const HeroSection = ({ handleNavClick }) => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  // Dynamic scroll transformations
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.75], [1, 0.95]);

  // Smooth Kinetic Letter Slide Component
  const AnimatedTextLine = ({ text, delay = 0, className = "" }) => {
    return (
      <span className={`inline-flex overflow-hidden ${className}`}>
        {text.split("").map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: "100%", rotateX: -45 }}
            animate={{ opacity: 1, y: "0%", rotateX: 0 }}
            transition={{
              duration: 0.6,
              delay: delay + index * 0.03,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="inline-block transform-gpu origin-bottom select-none"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </span>
    );
  };

  return (
    <section ref={sectionRef} className="relative pt-28 pb-12 px-6 lg:px-16 min-h-screen h-screen flex items-center justify-start overflow-hidden bg-black">
      <ConstellationCanvas />

      {/* Subtle Ambient Glow behind text */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-[#00C2BB]/10 blur-[130px] pointer-events-none rounded-full" />

      <motion.div style={{ opacity, scale, y: textY }} className="relative z-10 w-full max-w-4xl mr-auto py-6 flex flex-col items-start text-left">

        {/* Futuristic Badge */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2.5 text-[#00C2BB] text-xs font-mono uppercase tracking-widest mb-6"
        >
          <span className="h-2 w-2 rounded-full bg-[#00C2BB] animate-pulse shadow-[0_0_10px_#00C2BB]" />
          <Sparkles className="w-3.5 h-3.5" />
          <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#00C2BB] to-cyan-200">
            The New Standard in Digital Solutions
          </span>
        </motion.div>

        {/* Refined Left-Aligned Headline Stack */}
        <div className="font-mono uppercase tracking-tight font-extrabold flex flex-col items-start gap-1 mb-8 select-none">
          <div className="leading-tight">
            <AnimatedTextLine word="THE NEW" text="THE NEW" delay={0.2} className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-[#E2ECE9]" />
          </div>
          <div className="leading-none">
            <AnimatedTextLine word="STANDARD IN" text="STANDARD IN" delay={0.4} className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-[#E2ECE9]" />
          </div>
          <div className="leading-tight">
            <span className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-[#00C2BB] via-teal-300 to-cyan-200 drop-shadow-[0_0_20px_rgba(0,194,187,0.35)]">
              <AnimatedTextLine word="DIGITAL SOLUTIONS" text="DIGITAL SOLUTIONS" delay={0.6} />
            </span>
          </div>
        </div>

        {/* Subtitle with Typewriter Animation */}
        <div className="max-w-xl text-left mb-8 min-h-[72px]">
          <TypewriterText
            text="Full-spectrum digital transformation — web & mobile apps, video ads, and graphic design."
            speed={35}
            deleteSpeed={20}
            pauseDuration={3500}
            loop={true}
          />
        </div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="flex items-center gap-4"
        >
          <button
            onClick={() => handleNavClick('solutions')}
            className="group bg-[#00C2BB] hover:bg-[#00e5ff] text-black font-mono font-bold text-sm uppercase px-7 py-3.5 rounded-xl shadow-[0_0_25px_rgba(0,194,187,0.4)] hover:shadow-[0_0_35px_rgba(0,194,187,0.6)] hover:scale-105 transition-all flex items-center gap-2"
          >
            <span>Learn More</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => handleNavClick('contact')}
            className="bg-[#141518] hover:bg-[#1E2025] border border-white/10 text-white font-mono text-sm px-7 py-3.5 rounded-xl hover:border-white/20 transition-all"
          >
            Contact Sales
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
};

// --- SOLUTION CARD ANIMATED COMPONENT ---
const SolutionCard = ({ service, index, setSelectedServiceModal }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  // Determine entry direction based on card position in grid (3 cols)
  const col = index % 3;
  const entryVariants = {
    hidden: {
      opacity: 0,
      x: col === 0 ? -60 : col === 2 ? 60 : 0,
      y: col === 1 ? 50 : 20,
      scale: 0.92,
      rotateY: col === 0 ? -8 : col === 2 ? 8 : 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.75,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={entryVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      onClick={() => setSelectedServiceModal(service)}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      style={{ perspective: 1000 }}
      className="relative rounded-2xl bg-[#121316] border border-white/10 p-6 group cursor-pointer flex flex-col justify-between shadow-xl overflow-hidden"
    >
      {/* Animated shimmer border overlay */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none z-0"
        style={{
          background:
            "linear-gradient(135deg, transparent 40%, rgba(0,194,187,0.15) 50%, transparent 60%)",
          backgroundSize: "200% 200%",
        }}
        animate={{
          backgroundPosition: ["200% 200%", "-200% -200%"],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          repeatDelay: 1.5,
          ease: "linear",
          delay: index * 0.4,
        }}
      />

      {/* Glow spot on hover */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#00C2BB]/0 group-hover:bg-[#00C2BB]/10 rounded-full blur-2xl transition-all duration-500 pointer-events-none z-0" />
      <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-[#00C2BB]/0 group-hover:bg-[#00C2BB]/8 rounded-full blur-2xl transition-all duration-700 pointer-events-none z-0" />

      {/* Animated top border line */}
      <motion.div
        className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-[#00C2BB] to-cyan-400 rounded-t-2xl"
        initial={{ width: "0%" }}
        animate={isInView ? { width: "100%" } : { width: "0%" }}
        transition={{ duration: 0.9, delay: index * 0.1 + 0.4, ease: [0.16, 1, 0.3, 1] }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <motion.div
            className="w-12 h-12 rounded-xl bg-[#1D1F24] border border-white/10 flex items-center justify-center"
            whileHover={{ scale: 1.15, borderColor: "rgba(0,194,187,0.8)" }}
            animate={isInView ? { rotate: [0, -4, 4, 0] } : {}}
            transition={{
              rotate: {
                duration: 2.5,
                delay: index * 0.15 + 0.6,
                ease: "easeInOut",
              },
            }}
          >
            {service.icon}
          </motion.div>
          <motion.span
            className="text-[10px] font-mono uppercase text-[#00C2BB] tracking-widest px-2.5 py-0.5 bg-[#00C2BB]/10 rounded-full border border-[#00C2BB]/20"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: index * 0.1 + 0.5 }}
          >
            0{service.id}
          </motion.span>
        </div>

        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#00C2BB] transition-colors duration-300">
          {service.title}
        </h3>
        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed line-clamp-3 mb-4">
          {service.desc}
        </p>

        {/* Feature tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {service.features.slice(0, 2).map((feat, fi) => (
            <motion.span
              key={fi}
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.35, delay: index * 0.1 + 0.55 + fi * 0.08 }}
              className="text-[10px] font-mono text-gray-400 bg-white/5 border border-white/8 px-2 py-0.5 rounded-md"
            >
              {feat}
            </motion.span>
          ))}
        </div>
      </div>

      <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-300 group-hover:text-[#00C2BB] transition-colors duration-300 font-mono">
        <span>Explore Service</span>
        <motion.div
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
        >
          <ArrowRight className="w-4 h-4" />
        </motion.div>
      </div>
    </motion.div>
  );
};

// --- SOLUTIONS SECTION COMPONENT ---
const SolutionsSection = ({ handleNavClick, setSelectedServiceModal }) => {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section id="solutions" className="py-16 lg:py-24 px-6 lg:px-12 bg-[#0A0B0D] border-t border-white/10 relative overflow-hidden">
      {/* Subtle background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,194,187,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,194,187,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#00C2BB]/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header Section */}
        <motion.div
          ref={headerRef}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-16 gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="max-w-2xl">
            <motion.span
              className="text-[#00C2BB] font-mono text-xs uppercase tracking-widest block mb-3"
              initial={{ opacity: 0, x: -20 }}
              animate={headerInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              // OUR CAPABILITIES
            </motion.span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white uppercase font-mono tracking-tight leading-tight">
              Let Our Tech Take Your Business to <span className="text-[#00C2BB]">Higher Grounds</span>
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#141518] border border-white/10 text-xs text-gray-300">
              <ShieldCheck className="w-4 h-4 text-[#00C2BB] shrink-0" />
              <span>Guaranteed Quality & Performance</span>
            </div>
            <button
              onClick={() => handleNavClick('contact')}
              className="inline-flex items-center gap-2 text-[#00C2BB] font-mono text-sm hover:underline font-bold whitespace-nowrap"
            >
              <span>Book a Consultation</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Cards Grid: 3 in a row on lg screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {SERVICES.map((service, index) => (
            <SolutionCard
              key={service.id}
              service={service}
              index={index}
              setSelectedServiceModal={setSelectedServiceModal}
            />
          ))}
        </div>

      </div>
    </section>
  );
};


// --- MAIN REDESIGNED APP COMPONENT ---
export default function RedesignedApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [selectedServiceModal, setSelectedServiceModal] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterAgreed, setNewsletterAgreed] = useState(false);
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '', service: 'General Inquiry' });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Scroll to section when tab is clicked
  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    if (tab === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(tab);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail && newsletterAgreed) {
      setNewsletterSubmitted(true);
      setTimeout(() => setNewsletterSubmitted(false), 5000);
      setNewsletterEmail('');
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (contactForm.name && contactForm.email && contactForm.message) {
      setContactSubmitted(true);
      setTimeout(() => setContactSubmitted(false), 5000);
      setContactForm({ name: '', email: '', message: '', service: 'General Inquiry' });
    }
  };

  return (
    <ReactLenis root>
      <div className="bg-[#050505] text-white font-sans min-h-screen selection:bg-[#00C2BB] selection:text-black overflow-x-hidden">

        {/* ── 1. HEADER / NAVIGATION (VISTA.IO STYLE) ────────────────────── */}
        <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200 px-6 lg:px-12 py-4 transition-all shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between">

            {/* Logo (Left) */}
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center group text-left focus:outline-none overflow-visible py-1"
              aria-label="Rhynox Technologies Logo"
            >
              <img
                src="/rhynox svg logo.svg"
                alt="RHYNOX TECHNOLOGIES"
                className="h-10 sm:h-12 md:h-14 w-auto object-contain filter brightness-90 contrast-125 scale-[3.8] sm:scale-[4.2] origin-left transition-transform hover:scale-[4.4]"
              />
            </button>

            {/* Navigation Bar (Center - White Pill Bar) */}
            <nav className="hidden md:flex items-center bg-gray-100/90 border border-gray-300 rounded-full px-5 py-1.5 gap-1 shadow-sm">
              {[
                { id: 'home', label: 'Home' },
                { id: 'solutions', label: 'Solutions' },
                { id: 'vision', label: 'Vision' },
                { id: 'blog', label: 'Blog' },
                { id: 'contact', label: 'Contact' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleNavClick(tab.id)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${activeTab === tab.id
                    ? 'bg-[#00C2BB] text-black shadow-sm'
                    : 'text-[#1A1A1A] hover:text-black hover:bg-gray-200'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* CTA Buttons (Far Right) */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => setShowAdminLogin(true)}
                className="flex items-center gap-2 text-xs font-mono uppercase text-[#1A1A1A] hover:text-[#00C2BB] px-3 py-2 rounded-lg hover:bg-gray-100 transition-all font-bold"
              >
                <User className="w-4 h-4 text-[#00C2BB]" />
                <span>{isAdminLoggedIn ? "Admin Dashboard" : "Log In"}</span>
              </button>

              <button
                onClick={() => handleNavClick('contact')}
                className="bg-[#00C2BB] hover:bg-[#00e5ff] text-black font-extrabold text-sm px-5 py-2.5 rounded-full shadow-[0_0_20px_rgba(0,194,187,0.4)] hover:shadow-[0_0_30px_rgba(0,194,187,0.6)] hover:scale-105 transition-all"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-gray-100 border border-gray-300 text-gray-800 hover:text-[#00C2BB]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Dropdown Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden bg-[#0D0E11] border-t border-white/10 mt-4 px-4 py-6 rounded-2xl flex flex-col gap-3"
              >
                {['home', 'solutions', 'vision', 'blog', 'contact'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleNavClick(tab)}
                    className={`text-left px-4 py-3 rounded-xl font-mono text-sm capitalize ${activeTab === tab ? 'bg-[#00C2BB] text-black font-bold' : 'text-gray-300 hover:bg-white/5'
                      }`}
                  >
                    {tab}
                  </button>
                ))}

                <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                  <button
                    onClick={() => { setMobileMenuOpen(false); setShowAdminLogin(true); }}
                    className="flex items-center gap-2 text-sm text-gray-300 px-4 py-2 hover:text-[#00C2BB]"
                  >
                    <User className="w-4 h-4 text-[#00C2BB]" />
                    <span>Admin / Client Portal</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('contact')}
                    className="w-full bg-[#00C2BB] text-black font-bold py-3 rounded-xl text-center"
                  >
                    Get Started
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* ── 2. HERO SECTION (EXACT VISTA.IO ASYMMETRIC DESIGN & SCROLL ANIMATION) ───────────────── */}
        <HeroSection handleNavClick={handleNavClick} />

        {/* ── 3. FEATURES / SERVICES GRID ("Let Our Tech Take Your Business Higher") */}
        <SolutionsSection handleNavClick={handleNavClick} setSelectedServiceModal={setSelectedServiceModal} />

        {/* ── 4. METRICS / NUMBERS SECTION ("We Take Pride in Our Numbers") ────── */}
        <section className="pt-12 pb-20 px-6 lg:px-12 bg-black border-t border-white/10 relative overflow-hidden">
          {/* Subtle particle wave effect */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,194,187,0.06)_0,transparent_70%)] pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10 text-center">
            <span className="text-[#00C2BB] font-mono text-xs uppercase tracking-widest block mb-3">
            // OUR IMPACT & ACCELERATION
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase font-mono tracking-tight mb-16">
              We Take Pride in Our <span className="text-[#00C2BB]">Numbers</span>
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center">
              {METRICS.map((metric, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex flex-col items-center p-6 rounded-2xl bg-[#0F1012] border border-white/10 hover:border-[#00C2BB]/40 transition-all"
                >
                  <span className="text-4xl sm:text-6xl font-black font-mono text-[#00C2BB] tracking-tight mb-2">
                    {metric.value}
                  </span>
                  <span className="text-xs sm:text-sm font-mono text-gray-400 uppercase tracking-wider text-center">
                    {metric.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. VISION / ABOUT SECTION ─────────────────────────────────── */}
        {(() => {
          const VisionSection = () => {
            const sectionRef = useRef(null);
            const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

            const checkItems = [
              "Modern Stack",
              "Transparent Pricing",
              "Rapid Deployment",
              "24/7 Monitoring",
            ];

            return (
              <section id="vision" ref={sectionRef} className="py-24 px-6 lg:px-12 bg-[#0A0B0D] border-t border-white/10 relative overflow-hidden">
                {/* Ambient background glow */}
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#00C2BB]/5 blur-[140px] pointer-events-none rounded-full -translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#00C2BB]/4 blur-[120px] pointer-events-none rounded-full translate-x-1/3 translate-y-1/3" />

                <div className="max-w-7xl mx-auto relative z-10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* ── LEFT: Text Content ── */}
                    <div>
                      {/* Label */}
                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-center gap-2 mb-4"
                      >
                        <motion.span
                          className="h-[2px] w-8 bg-[#00C2BB] rounded-full inline-block"
                          initial={{ scaleX: 0 }}
                          animate={isInView ? { scaleX: 1 } : {}}
                          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                          style={{ transformOrigin: "left" }}
                        />
                        <span className="text-[#00C2BB] font-mono text-xs uppercase tracking-widest">
                          // OUR VISION &amp; MISSION
                        </span>
                      </motion.div>

                      {/* Heading – word-by-word reveal */}
                      <h2 className="text-3xl sm:text-5xl font-black text-white uppercase font-mono tracking-tight leading-tight mb-6 overflow-hidden">
                        {["Engineered for Impact,", "Built for"].map((line, li) => (
                          <span key={li} className="block overflow-hidden">
                            <motion.span
                              className="block"
                              initial={{ y: "100%", opacity: 0 }}
                              animate={isInView ? { y: "0%", opacity: 1 } : {}}
                              transition={{ duration: 0.65, delay: 0.15 + li * 0.12, ease: [0.16, 1, 0.3, 1] }}
                            >
                              {line}
                            </motion.span>
                          </span>
                        ))}
                        <span className="block overflow-hidden">
                          <motion.span
                            className="block text-[#00C2BB]"
                            initial={{ y: "100%", opacity: 0 }}
                            animate={isInView ? { y: "0%", opacity: 1 } : {}}
                            transition={{ duration: 0.65, delay: 0.39, ease: [0.16, 1, 0.3, 1] }}
                          >
                            Growth
                          </motion.span>
                        </span>
                      </h2>

                      {/* Paragraph 1 */}
                      <motion.p
                        className="text-gray-300 text-base leading-relaxed mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                      >
                        Rhynox Technologies was founded with a singular mission: to make high-end, enterprise-grade software development, web engineering, graphic design, and video marketing accessible to forward-thinking businesses and ambitious startups.
                      </motion.p>

                      {/* Paragraph 2 */}
                      <motion.p
                        className="text-gray-400 text-sm leading-relaxed mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.62, ease: "easeOut" }}
                      >
                        We believe that modern technology shouldn't be overly complex or cost-prohibitive. By combining clean architectural principles with responsive design and modern AI tooling, we deliver scalable solutions that outpace the competition.
                      </motion.p>

                      {/* Animated divider */}
                      <motion.div
                        className="h-px bg-gradient-to-r from-[#00C2BB]/60 via-white/10 to-transparent mb-6"
                        initial={{ scaleX: 0 }}
                        animate={isInView ? { scaleX: 1 } : {}}
                        transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        style={{ transformOrigin: "left" }}
                      />

                      {/* Checklist items – staggered slide-in */}
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        {checkItems.map((item, i) => (
                          <motion.div
                            key={item}
                            className="flex items-center gap-3"
                            initial={{ opacity: 0, x: -24 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.78 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                          >
                            <motion.div
                              className="w-8 h-8 rounded-lg bg-[#00C2BB]/10 flex items-center justify-center shrink-0 border border-[#00C2BB]/20"
                              initial={{ scale: 0, rotate: -20 }}
                              animate={isInView ? { scale: 1, rotate: 0 } : {}}
                              transition={{ duration: 0.45, delay: 0.85 + i * 0.1, type: "spring", stiffness: 200 }}
                            >
                              <Check className="w-4 h-4 text-[#00C2BB]" />
                            </motion.div>
                            <span className="text-sm font-mono text-white">{item}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* ── RIGHT: Image Panel ── */}
                    <motion.div
                      className="relative"
                      initial={{ opacity: 0, x: 60, scale: 0.95 }}
                      animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
                      transition={{ duration: 0.85, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {/* Glowing frame border */}
                      <motion.div
                        className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-[#00C2BB]/30 via-transparent to-cyan-400/20 blur-sm pointer-events-none"
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      />

                      <div className="relative z-10 rounded-2xl overflow-hidden border border-white/15 shadow-2xl">
                        <motion.img
                          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                          alt="Rhynox Technologies Team Vision"
                          className="w-full h-auto object-cover"
                          initial={{ scale: 1.1 }}
                          animate={isInView ? { scale: 1 } : {}}
                          transition={{ duration: 1.1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        />

                        {/* Overlay badge */}
                        <motion.div
                          className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md border border-white/15 rounded-xl px-4 py-2.5 flex items-center gap-2"
                          initial={{ opacity: 0, y: 16 }}
                          animate={isInView ? { opacity: 1, y: 0 } : {}}
                          transition={{ duration: 0.55, delay: 1.1 }}
                        >
                          <span className="h-2 w-2 rounded-full bg-[#00C2BB] animate-pulse shadow-[0_0_8px_#00C2BB]" />
                          <span className="text-xs font-mono text-white">Empowering Businesses Since 2019</span>
                        </motion.div>
                      </div>

                      <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-[#00C2BB]/20 blur-3xl pointer-events-none rounded-full" />
                    </motion.div>

                  </div>
                </div>
              </section>
            );
          };
          return <VisionSection />;
        })()}


        {/* ── 7. PARTNER / INTEGRATIONS MARQUEE TICKER ───────────────────── */}
        {(() => {
          const techRow1 = [
            { text: "REACT", icon: "⚛" },
            { text: "NEXT.JS", icon: "▲" },
            { text: "NODE.JS", icon: "⬡" },
            { text: "TAILWIND", icon: "✦" },
            { text: "AWS CLOUD", icon: "☁" },
            { text: "PYTHON", icon: "🐍" },
            { text: "FIGMA", icon: "◈" },
          ];
          const techRow2 = [
            { text: "FIGMA", icon: "◈" },
            { text: "AWS CLOUD", icon: "☁" },
            { text: "PYTHON", icon: "🐍" },
            { text: "REACT", icon: "⚛" },
            { text: "NEXT.JS", icon: "▲" },
            { text: "NODE.JS", icon: "⬡" },
            { text: "TAILWIND", icon: "✦" },
          ];

          const MarqueeTicker = ({ items, direction = "left", speed = 32 }) => {
            const doubled = [...items, ...items];
            return (
              <div
                className="flex overflow-hidden group"
                style={{ maskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)" }}
              >
                <div
                  className={`flex gap-4 shrink-0 ${direction === "left" ? "animate-[marqueeLeft_var(--speed)_linear_infinite]" : "animate-[marqueeRight_var(--speed)_linear_infinite]"} group-hover:[animation-play-state:paused]`}
                  style={{ "--speed": `${speed}s` }}
                >
                  {doubled.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-[#111316] border border-white/10 hover:border-[#00C2BB]/60 hover:bg-[#1A1C22] transition-all duration-300 cursor-default group/badge shrink-0"
                    >
                      <span className="text-[#00C2BB] text-sm group-hover/badge:animate-spin" style={{ display: "inline-block" }}>
                        {item.icon}
                      </span>
                      <span className="text-gray-200 font-mono font-bold text-xs tracking-widest whitespace-nowrap group-hover/badge:text-white transition-colors">
                        {item.text}
                      </span>
                      <span className="h-1.5 w-1.5 rounded-full bg-[#00C2BB]/40 group-hover/badge:bg-[#00C2BB] group-hover/badge:shadow-[0_0_8px_#00C2BB] transition-all" />
                    </div>
                  ))}
                </div>
              </div>
            );
          };

          return (
            <section className="py-16 bg-[#090A0C] border-t border-b border-white/10 overflow-hidden relative">
              {/* Corner glows */}
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#090A0C] to-transparent pointer-events-none z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#090A0C] to-transparent pointer-events-none z-10" />

              {/* Title */}
              <div className="text-center mb-10 relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-3"
                >
                  <motion.span
                    className="h-px w-12 bg-[#00C2BB]/50"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    style={{ transformOrigin: "right" }}
                  />
                  <span className="text-gray-400 font-mono text-xs uppercase tracking-[0.25em]">
                    POWERING BUSINESSES WITH INDUSTRY-LEADING TECH
                  </span>
                  <motion.span
                    className="h-px w-12 bg-[#00C2BB]/50"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    style={{ transformOrigin: "left" }}
                  />
                </motion.div>
              </div>

              {/* Row 1 — scrolls left */}
              <style>{`
                @keyframes marqueeLeft {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
                @keyframes marqueeRight {
                  0% { transform: translateX(-50%); }
                  100% { transform: translateX(0); }
                }
              `}</style>

              <div className="flex flex-col gap-4 relative z-0">
                <MarqueeTicker items={techRow1} direction="left" speed={28} />
                <MarqueeTicker items={techRow2} direction="right" speed={34} />
              </div>
            </section>
          );
        })()}

        {/* ── 8. BLOG / ARTICLES SECTION ───────────────────────────────── */}
        {(() => {
          const BlogSection = () => {
            const headerRef = useRef(null);
            const headerInView = useInView(headerRef, { once: true, margin: "-80px" });

            return (
              <section id="blog" className="py-24 px-6 lg:px-12 bg-[#0A0B0D] relative overflow-hidden">
                {/* Background texture */}
                <div className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: "radial-gradient(circle at 80% 20%, rgba(255,90,54,0.04) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(255,90,54,0.03) 0%, transparent 50%)"
                  }}
                />

                <div className="max-w-7xl mx-auto relative z-10">

                  {/* Section Header */}
                  <div ref={headerRef} className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div>
                      <motion.div
                        className="flex items-center gap-2 mb-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={headerInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        <span className="h-px w-6 bg-[#00C2BB]" />
                        <span className="text-[#00C2BB] font-mono text-xs uppercase tracking-widest">// LATEST INSIGHTS</span>
                      </motion.div>
                      <h2 className="text-3xl sm:text-5xl font-black text-white font-mono uppercase leading-tight overflow-hidden">
                        {["Engineering &", "Design"].map((word, wi) => (
                          <span key={wi} className="block overflow-hidden">
                            <motion.span
                              className="block"
                              initial={{ y: "100%" }}
                              animate={headerInView ? { y: "0%" } : {}}
                              transition={{ duration: 0.65, delay: wi * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            >
                              {word}{wi === 1 && <span className="text-[#00C2BB]"> Blog</span>}
                            </motion.span>
                          </span>
                        ))}
                      </h2>
                    </div>
                    <motion.p
                      className="text-gray-400 text-sm max-w-xs leading-relaxed"
                      initial={{ opacity: 0, y: 12 }}
                      animate={headerInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.55, delay: 0.3 }}
                    >
                      Expert articles on frontend performance, UI/UX aesthetics, video marketing, and digital acceleration.
                    </motion.p>
                  </div>

                  {/* ── CARD GRID: 3 Unique Styles ── */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7">

                    {/* CARD 1 — Featured large card with diagonal overlay */}
                    <motion.article
                      className="lg:col-span-5 relative rounded-3xl overflow-hidden group cursor-pointer bg-[#0E0F12] border border-white/10 hover:border-[#00C2BB]/50 shadow-2xl"
                      initial={{ opacity: 0, x: -50, scale: 0.95 }}
                      whileInView={{ opacity: 1, x: 0, scale: 1 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                      whileHover={{ y: -6, transition: { duration: 0.3 } }}
                    >
                      {/* Image fills card */}
                      <div className="relative h-72 overflow-hidden">
                        <motion.img
                          src={BLOG_POSTS[0].image}
                          alt={BLOG_POSTS[0].title}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.08 }}
                          transition={{ duration: 0.6 }}
                        />
                        {/* Diagonal gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tl from-black/90 via-black/30 to-transparent" />
                        {/* Category badge */}
                        <motion.span
                          className="absolute top-5 left-5 bg-[#00C2BB] text-black text-[10px] font-mono font-bold uppercase px-3 py-1.5 rounded-full shadow-[0_0_16px_rgba(0,194,187,0.5)]"
                          initial={{ opacity: 0, y: -10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: 0.5 }}
                        >
                          {BLOG_POSTS[0].category}
                        </motion.span>
                        {/* Featured tag */}
                        <span className="absolute top-5 right-5 bg-white/10 backdrop-blur-md text-white text-[10px] font-mono uppercase px-3 py-1.5 rounded-full border border-white/20">
                          ★ Featured
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-7">
                        <div className="flex items-center gap-3 text-[10px] text-gray-500 font-mono mb-4">
                          <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{BLOG_POSTS[0].readTime}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-600" />
                          <span>{BLOG_POSTS[0].date}</span>
                        </div>
                        <h3 className="text-xl font-black text-white group-hover:text-[#00C2BB] transition-colors duration-300 leading-snug mb-3">
                          {BLOG_POSTS[0].title}
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-2">{BLOG_POSTS[0].desc}</p>
                        <div className="flex items-center justify-between">
                          <motion.button
                            className="inline-flex items-center gap-2 bg-[#00C2BB]/10 hover:bg-[#00C2BB] text-[#00C2BB] hover:text-black border border-[#00C2BB]/30 font-mono font-bold text-xs px-4 py-2 rounded-lg transition-all duration-300"
                            whileHover={{ scale: 1.04 }}
                          >
                            <span>Read Article</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </motion.button>
                          <span className="text-[10px] text-gray-600 font-mono">01 / 03</span>
                        </div>
                      </div>

                      {/* Animated bottom border */}
                      <motion.div
                        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#00C2BB] to-cyan-400"
                        initial={{ width: "0%" }}
                        whileInView={{ width: "100%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </motion.article>

                    {/* RIGHT COLUMN: stacked cards */}
                    <div className="lg:col-span-7 flex flex-col gap-6">

                      {/* CARD 2 — Horizontal split panel */}
                      <motion.article
                        className="relative flex rounded-2xl overflow-hidden group cursor-pointer border border-white/10 hover:border-[#00C2BB]/50 bg-[#0E0F12] shadow-xl"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        whileHover={{ y: -5, transition: { duration: 0.3 } }}
                      >
                        {/* Left image strip */}
                        <div className="w-2/5 relative overflow-hidden shrink-0">
                          <motion.img
                            src={BLOG_POSTS[1].image}
                            alt={BLOG_POSTS[1].title}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0E0F12]" />
                          {/* Vertical category label */}
                          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                            <span className="bg-black/70 backdrop-blur-sm text-[#00C2BB] text-[9px] font-mono uppercase px-2 py-1 rounded border border-[#00C2BB]/30 tracking-widest">
                              {BLOG_POSTS[1].category}
                            </span>
                          </div>
                        </div>
                        {/* Right content */}
                        <div className="p-6 flex flex-col justify-center flex-1 relative">
                          {/* Glowing number */}
                          <span className="absolute top-4 right-5 text-5xl font-black font-mono text-white/5 select-none pointer-events-none">02</span>
                          <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono mb-3">
                            <Clock className="w-3 h-3" />
                            <span>{BLOG_POSTS[1].readTime}</span>
                            <span className="mx-1 text-gray-700">·</span>
                            <span>{BLOG_POSTS[1].date}</span>
                          </div>
                          <h3 className="text-base font-bold text-white group-hover:text-[#00C2BB] transition-colors duration-300 leading-snug mb-2">
                            {BLOG_POSTS[1].title}
                          </h3>
                          <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">{BLOG_POSTS[1].desc}</p>
                          <motion.button
                            className="self-start inline-flex items-center gap-1.5 text-[#00C2BB] font-mono text-xs font-bold"
                            whileHover={{ x: 4 }}
                            transition={{ duration: 0.2 }}
                          >
                            <span>Read More</span>
                            <ArrowRight className="w-3 h-3" />
                          </motion.button>
                        </div>
                      </motion.article>

                      {/* CARD 3 — Terminal / code aesthetic */}
                      <motion.article
                        className="relative rounded-2xl overflow-hidden group cursor-pointer bg-[#080A0D] border border-white/10 hover:border-[#00C2BB]/50 shadow-xl"
                        initial={{ opacity: 0, y: 40, scale: 0.96 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        whileHover={{ y: -5, transition: { duration: 0.3 } }}
                      >
                        {/* Terminal header bar */}
                        <div className="bg-[#111316] border-b border-white/10 px-5 py-3 flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-[#00C2BB]/80" />
                          <span className="w-3 h-3 rounded-full bg-amber-400/60" />
                          <span className="w-3 h-3 rounded-full bg-green-500/60" />
                          <span className="ml-3 text-[10px] font-mono text-gray-500 tracking-widest uppercase">{BLOG_POSTS[2].category}.md</span>
                          <span className="ml-auto text-[10px] font-mono text-[#00C2BB] bg-[#00C2BB]/10 px-2 py-0.5 rounded border border-[#00C2BB]/20">03 / 03</span>
                        </div>

                        <div className="flex">
                          {/* Line numbers column */}
                          <div className="py-5 px-3 border-r border-white/5 flex flex-col gap-1 text-[10px] font-mono text-gray-700 select-none shrink-0">
                            {[1, 2, 3, 4, 5, 6].map(n => <span key={n}>{n}</span>)}
                          </div>

                          <div className="flex-1 p-5">
                            {/* Image in terminal as "output" */}
                            <div className="h-36 rounded-lg overflow-hidden mb-4 border border-white/10 relative">
                              <motion.img
                                src={BLOG_POSTS[2].image}
                                alt={BLOG_POSTS[2].title}
                                className="w-full h-full object-cover opacity-70 group-hover:opacity-90"
                                whileHover={{ scale: 1.06 }}
                                transition={{ duration: 0.5 }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#080A0D]/80 to-transparent" />
                            </div>

                            <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono mb-2">
                              <span className="text-green-500">▸</span>
                              <span>{BLOG_POSTS[2].date}</span>
                              <span className="text-gray-700">·</span>
                              <span className="text-amber-400">{BLOG_POSTS[2].readTime}</span>
                            </div>
                            <h3 className="text-base font-bold text-white group-hover:text-[#00C2BB] transition-colors duration-300 leading-snug mb-2">
                              {BLOG_POSTS[2].title}
                            </h3>
                            <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">{BLOG_POSTS[2].desc}</p>
                            <motion.button
                              className="inline-flex items-center gap-2 bg-[#00C2BB]/10 hover:bg-[#00C2BB] text-[#00C2BB] hover:text-black border border-[#00C2BB]/30 font-mono font-bold text-xs px-4 py-2 rounded-lg transition-all duration-300"
                              whileHover={{ scale: 1.04 }}
                            >
                              <span>$ read --article</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </motion.button>
                          </div>
                        </div>

                        {/* Scan line effect */}
                        <motion.div
                          className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00C2BB]/30 to-transparent pointer-events-none"
                          animate={{ top: ["0%", "100%"] }}
                          transition={{ duration: 3.5, repeat: Infinity, ease: "linear", delay: 1 }}
                        />
                      </motion.article>

                    </div>
                  </div>
                </div>
              </section>
            );
          };
          return <BlogSection />;
        })()}

        {/* ── 9. CTA BANNER ("Are You Ready to Accelerate Your Business?") ─── */}
        <section className="py-20 px-6 lg:px-12 bg-black">
          <div className="max-w-7xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#051A18] via-[#0E0F14] to-[#041D1F] border border-[#00C2BB]/40 p-10 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-[0_0_50px_rgba(0,194,187,0.15)]">
              <div className="max-w-2xl text-center lg:text-left">
                <span className="text-[#00C2BB] font-mono text-xs uppercase tracking-widest block mb-2">
                // START YOUR PROJECT TODAY
                </span>
                <h2 className="text-3xl sm:text-5xl font-black text-white font-mono uppercase tracking-tight leading-tight mb-4">
                  Are You Ready to Accelerate Your Business?
                </h2>
                <p className="text-gray-400 text-sm sm:text-base">
                  Get in touch with our engineering team for a customized blueprint, quick estimate, and strategic deployment.
                </p>
              </div>

              <button
                onClick={() => handleNavClick('contact')}
                className="bg-[#00C2BB] hover:bg-[#00e5ff] text-black font-extrabold text-base px-9 py-4 rounded-full shadow-[0_0_30px_rgba(0,194,187,0.5)] hover:scale-105 transition-all shrink-0 flex items-center gap-3"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* ── 10. CONTACT SECTION ───────────────────────────────────────── */}
        {(() => {
          const ContactSection = () => {
            const sectionRef = useRef(null);
            const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

            // Form state
            const [form, setForm] = useState({
              name: '', email: '', service: 'Website Development', message: ''
            });
            // Email verification state
            const [verifyStep, setVerifyStep] = useState('idle'); // idle | sending | code_sent | verifying | verified
            const [enteredCode, setEnteredCode] = useState('');
            const [codeError, setCodeError] = useState('');
            const [submitted, setSubmitted] = useState(false);
            const [isSubmitting, setIsSubmitting] = useState(false);

            const isGmail = form.email.toLowerCase().endsWith('@gmail.com');

            const handleSendCode = async () => {
              if (!isGmail) return;
              setVerifyStep('sending');
              setCodeError('');

              try {
                const res = await fetch('/api/verify-email-send', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email: form.email })
                });

                const data = await res.json().catch(() => ({}));
                if (res.ok) {
                  setVerifyStep('code_sent');
                } else if (res.status === 404) {
                  setVerifyStep('idle');
                  setCodeError('Server route not found (404). Please restart "node server.js" in your terminal.');
                } else {
                  setVerifyStep('idle');
                  setCodeError(data.error || 'Failed to send code.');
                }
              } catch (err) {
                setVerifyStep('idle');
                setCodeError('Connection refused. Please make sure "node server.js" is running on port 5000.');
              }
            };

            const handleVerifyCode = async () => {
              if (enteredCode.length !== 6) return;
              setVerifyStep('verifying');
              setCodeError('');

              try {
                const res = await fetch('/api/verify-email-confirm', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email: form.email, code: enteredCode })
                });

                const data = await res.json().catch(() => ({}));
                if (res.ok) {
                  setVerifyStep('verified');
                  setCodeError('');
                } else if (res.status === 404) {
                  setVerifyStep('code_sent');
                  setCodeError('Server route 404. Please restart "node server.js".');
                } else {
                  setVerifyStep('code_sent');
                  setCodeError(data.error || 'Invalid code.');
                }
              } catch (err) {
                setVerifyStep('code_sent');
                setCodeError('Connection error. Please try again.');
              }
            };

            const handleSubmit = async (e) => {
              e.preventDefault();
              if (verifyStep !== 'verified') return;
              setIsSubmitting(true);
              setCodeError('');

              try {
                const res = await fetch('/api/contact-send', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(form)
                });

                const data = await res.json().catch(() => ({}));
                if (res.ok) {
                  setSubmitted(true);
                  setTimeout(() => setSubmitted(false), 6000);
                  setForm({ name: '', email: '', service: 'Website Development', message: '' });
                  setVerifyStep('idle');
                  setEnteredCode('');
                } else {
                  setCodeError(data.error || 'Failed to send message.');
                }
              } catch (err) {
                setCodeError('Connection error. Please try again.');
              } finally {
                setIsSubmitting(false);
              }
            };

            const inputClass = "w-full bg-[#0E0F12] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#00C2BB] transition-all duration-300";
            const labelClass = "block text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-2";

            return (
              <section id="contact" ref={sectionRef} className="py-24 px-6 lg:px-12 bg-[#090A0C] border-t border-white/10 relative overflow-hidden">
                {/* Background glows */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00C2BB]/4 blur-[140px] pointer-events-none rounded-full translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#00C2BB]/3 blur-[120px] pointer-events-none rounded-full -translate-x-1/3 translate-y-1/3" />

                <div className="max-w-7xl mx-auto relative z-10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

                    {/* ── LEFT: Info panel ── */}
                    <div>
                      <motion.div
                        className="flex items-center gap-2 mb-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        <span className="h-px w-6 bg-[#00C2BB]" />
                        <span className="text-[#00C2BB] font-mono text-xs uppercase tracking-widest">// GET IN TOUCH</span>
                      </motion.div>

                      <h2 className="text-3xl sm:text-5xl font-black text-white font-mono uppercase leading-tight mb-4 overflow-hidden">
                        {["Let's Build Something", "Amazing Together"].map((line, li) => (
                          <span key={li} className="block overflow-hidden">
                            <motion.span
                              className="block"
                              initial={{ y: "100%" }}
                              animate={isInView ? { y: "0%" } : {}}
                              transition={{ duration: 0.65, delay: 0.1 + li * 0.12, ease: [0.16, 1, 0.3, 1] }}
                            >
                              {li === 1 ? <><span className="text-[#00C2BB]">{line}</span></> : line}
                            </motion.span>
                          </span>
                        ))}
                      </h2>

                      <motion.p
                        className="text-gray-400 text-base leading-relaxed mb-10 max-w-md"
                        initial={{ opacity: 0, y: 16 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.55, delay: 0.38 }}
                      >
                        Have a project in mind? We'd love to hear about it. Send us a message and we'll get back to you within 24 hours.
                      </motion.p>

                      {/* Contact cards */}
                      {[
                        { icon: <Mail className="w-5 h-5" />, label: "Email Us", value: "rhynoxtechnologies@gmail.com", href: "mailto:rhynoxtechnologies@gmail.com" },
                        { icon: <Phone className="w-5 h-5" />, label: "Call Us", value: "+91 81483 11669", href: "tel:+918148311669" },
                      ].map((item, i) => (
                        <motion.a
                          key={i}
                          href={item.href}
                          className="flex items-center gap-4 mb-5 group w-fit"
                          initial={{ opacity: 0, x: -24 }}
                          animate={isInView ? { opacity: 1, x: 0 } : {}}
                          transition={{ duration: 0.5, delay: 0.45 + i * 0.12 }}
                        >
                          <motion.div
                            className="w-12 h-12 rounded-xl bg-[#00C2BB]/10 border border-[#00C2BB]/20 flex items-center justify-center text-[#00C2BB] shrink-0 group-hover:bg-[#00C2BB] group-hover:text-black transition-all duration-300"
                            whileHover={{ scale: 1.1, rotate: -5 }}
                          >
                            {item.icon}
                          </motion.div>
                          <div>
                            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">{item.label}</span>
                            <span className="text-sm font-bold text-white group-hover:text-[#00C2BB] transition-colors">{item.value}</span>
                          </div>
                        </motion.a>
                      ))}

                      {/* Decorative floating card */}
                      <motion.div
                        className="mt-10 p-5 rounded-2xl bg-[#111316] border border-white/10 flex items-center gap-4 max-w-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.7 }}
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                      >
                        <div className="w-10 h-10 rounded-lg bg-[#00C2BB] flex items-center justify-center text-black font-black text-xl shrink-0 shadow-[0_0_20px_rgba(0,194,187,0.4)]">R</div>
                        <div>
                          <p className="text-white text-sm font-bold font-mono">Average response time</p>
                          <p className="text-[#00C2BB] text-xs font-mono">Within 24 hours ⚡</p>
                        </div>
                        <span className="ml-auto h-2 w-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_#4ade80]" />
                      </motion.div>
                    </div>

                    {/* ── RIGHT: Contact Form with Gmail Verification ── */}
                    <motion.div
                      className="bg-[#0E0F12] border border-white/10 rounded-2xl p-8 lg:p-10 relative overflow-hidden shadow-2xl"
                      initial={{ opacity: 0, x: 50, scale: 0.97 }}
                      animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
                      transition={{ duration: 0.75, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {/* Animated top border */}
                      <motion.div
                        className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-[#00C2BB] to-cyan-400 rounded-t-2xl"
                        initial={{ width: "0%" }}
                        animate={isInView ? { width: "100%" } : {}}
                        transition={{ duration: 0.9, delay: 0.5 }}
                      />

                      <AnimatePresence mode="wait">
                        {submitted ? (
                          <motion.div
                            key="success"
                            className="text-center py-16"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                          >
                            <motion.div
                              className="w-20 h-20 bg-[#00C2BB]/15 border border-[#00C2BB]/40 rounded-full flex items-center justify-center mx-auto mb-6"
                              animate={{ scale: [1, 1.08, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <CheckCircle className="w-10 h-10 text-[#00C2BB]" />
                            </motion.div>
                            <h3 className="text-2xl font-black text-white font-mono mb-3">Message Sent! 🎉</h3>
                            <p className="text-gray-400 text-sm max-w-xs mx-auto">Thank you for reaching out. We've received your request and will respond within 24 hours.</p>
                          </motion.div>
                        ) : (
                          <motion.form
                            key="form"
                            onSubmit={handleSubmit}
                            className="space-y-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            {/* Name */}
                            <div>
                              <label className={labelClass}>Your Name</label>
                              <input
                                type="text" required
                                placeholder="John Doe"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                className={inputClass}
                              />
                            </div>

                            {/* Gmail Address + Verification */}
                            <div>
                              <label className={labelClass}>Your Gmail Address</label>
                              <div className="flex gap-2">
                                <input
                                  type="email" required
                                  placeholder="john@gmail.com"
                                  value={form.email}
                                  onChange={e => { setForm({ ...form, email: e.target.value }); setVerifyStep('idle'); setEnteredCode(''); setCodeError(''); }}
                                  className={`${inputClass} flex-1`}
                                  disabled={verifyStep === 'verified'}
                                />
                                {verifyStep === 'verified' && (
                                  <div className="flex items-center gap-1 px-4 text-green-400 text-xs font-mono shrink-0 border border-green-400/30 rounded-xl bg-green-400/10">
                                    <Check className="w-4 h-4" /> Verified
                                  </div>
                                )}
                              </div>

                              {/* Gmail-only note */}
                              {!isGmail && form.email.length > 3 && verifyStep !== 'verified' && (
                                <p className="text-amber-400 text-[10px] font-mono mt-1.5">⚠ Only Gmail addresses are accepted.</p>
                              )}

                              {/* Verification panel */}
                              {verifyStep !== 'verified' && (
                                <div className="mt-3 p-4 rounded-xl bg-[#111316] border border-white/8">
                                  <div className="flex items-center gap-2 mb-2">
                                    <ShieldCheck className="w-4 h-4 text-[#00C2BB]" />
                                    <span className="text-xs font-mono text-white font-bold">Email Verification Required</span>
                                  </div>
                                  <p className="text-gray-500 text-[11px] leading-relaxed mb-4">
                                    To ensure genuine communication, please verify your Gmail address by entering the code we've sent to your inbox.
                                  </p>

                                  {verifyStep === 'idle' && (
                                    <button
                                      type="button"
                                      disabled={!isGmail}
                                      onClick={handleSendCode}
                                      className="w-full py-3 rounded-xl text-xs font-mono font-bold border border-[#00C2BB]/40 text-[#00C2BB] hover:bg-[#00C2BB] hover:text-black disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                    >
                                      Send Verification Code
                                    </button>
                                  )}

                                  {verifyStep === 'sending' && (
                                    <div className="flex items-center justify-center gap-2 py-3 border border-transparent text-xs font-mono text-gray-400">
                                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                                        <Zap className="w-4 h-4 text-[#00C2BB]" />
                                      </motion.div>
                                      Sending code...
                                    </div>
                                  )}

                                  {(verifyStep === 'code_sent' || verifyStep === 'verifying') && (
                                    <div className="space-y-3">
                                      <p className="text-[10px] text-green-400 font-mono">✓ Code sent to your inbox.</p>
                                      <input
                                        type="text"
                                        maxLength={6}
                                        placeholder="Enter 6-digit code"
                                        value={enteredCode}
                                        onChange={e => { setEnteredCode(e.target.value.replace(/\D/g, '')); setCodeError(''); }}
                                        className="w-full bg-[#18191D] border border-white/10 rounded-xl px-4 py-3 text-sm text-white text-center tracking-widest font-mono focus:outline-none focus:border-[#00C2BB] transition-all"
                                        disabled={verifyStep === 'verifying'}
                                      />
                                      {codeError && <p className="text-red-400 text-[10px] font-mono">{codeError}</p>}
                                      <div className="flex gap-2">
                                        <button
                                          type="button"
                                          onClick={handleVerifyCode}
                                          disabled={enteredCode.length !== 6 || verifyStep === 'verifying'}
                                          className="flex-1 py-3 rounded-xl text-xs font-mono font-bold bg-[#00C2BB] text-black hover:bg-[#00e5ff] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                                        >
                                          {verifyStep === 'verifying' ? (
                                            <><Zap className="w-3.5 h-3.5 animate-spin" /> Verifying...</>
                                          ) : "Verify Code"}
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => { setVerifyStep('idle'); setEnteredCode(''); setCodeError(''); }}
                                          className="px-5 py-3 rounded-xl text-xs font-mono text-gray-400 border border-white/10 hover:border-white/20 transition-all disabled:opacity-40"
                                          disabled={verifyStep === 'verifying'}
                                        >
                                          Resend
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Service */}
                            <div>
                              <label className={labelClass}>Service Interested In</label>
                              <select
                                value={form.service}
                                onChange={e => setForm({ ...form, service: e.target.value })}
                                className={inputClass}
                              >
                                <option>Website Development</option>
                                <option>App Development</option>
                                <option>AI Solutions</option>
                                <option>Graphic Designing</option>
                                <option>YouTube Ads Creation</option>
                                <option>Video Editing</option>
                                <option>UI/UX Design</option>
                                <option>General Inquiry</option>
                              </select>
                            </div>

                            {/* Message */}
                            <div>
                              <label className={labelClass}>Message</label>
                              <textarea
                                rows={4} required
                                placeholder="Tell us about your project..."
                                value={form.message}
                                onChange={e => setForm({ ...form, message: e.target.value })}
                                className={inputClass}
                              />
                            </div>

                            {codeError && !['code_sent', 'verifying', 'sending'].includes(verifyStep) && (
                              <p className="text-red-400 text-[11px] font-mono text-center">{codeError}</p>
                            )}

                            {/* Submit */}
                            <motion.button
                              type="submit"
                              disabled={verifyStep !== 'verified' || isSubmitting}
                              className="w-full py-4 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                              style={{
                                background: verifyStep === 'verified' ? '#00C2BB' : '#1a1b1e',
                                color: verifyStep === 'verified' ? '#000' : '#666',
                                border: verifyStep !== 'verified' ? '1px solid rgba(255,255,255,0.1)' : 'none',
                                boxShadow: verifyStep === 'verified' ? '0 0 24px rgba(0,194,187,0.45)' : 'none',
                              }}
                              whileHover={verifyStep === 'verified' && !isSubmitting ? { scale: 1.02 } : {}}
                            >
                              {verifyStep !== 'verified' ? (
                                <>
                                  <ShieldCheck className="w-4 h-4" />
                                  <span>Verify Email to Continue</span>
                                </>
                              ) : isSubmitting ? (
                                <>
                                  <Zap className="w-4 h-4 animate-spin" />
                                  <span>Sending Message...</span>
                                </>
                              ) : (
                                <>
                                  <Send className="w-4 h-4" />
                                  <span>Send Message</span>
                                </>
                              )}
                            </motion.button>
                          </motion.form>
                        )}
                      </AnimatePresence>
                    </motion.div>

                  </div>
                </div>
              </section>
            );
          };
          return <ContactSection />;
        })()}

        {/* ── 11. FOOTER ─────────────────────────────────────────────────── */}
        {(() => {
          const Footer = () => {
            const footerRef = useRef(null);
            const isInView = useInView(footerRef, { once: true, margin: "-60px" });

            const services = [
              "Web Development", "App Development", "AI Solutions",
              "UI/UX Design", "Cloud Solutions", "Video Production"
            ];
            const company = ["About Us", "Portfolio", "Services", "Why Us"];
            const trustBadges = [
              { icon: <ShieldCheck className="w-4 h-4" />, label: "Secure & Reliable" },
              { icon: <Zap className="w-4 h-4" />, label: "Fast Delivery" },
              { icon: <Layers className="w-4 h-4" />, label: "Modern Technologies" },
              { icon: <Headset className="w-4 h-4" />, label: "Long-Term Support" },
            ];

            return (
              <footer ref={footerRef} className="bg-[#050607] border-t border-white/10 relative overflow-hidden">
                {/* Subtle background glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#00C2BB]/4 blur-[120px] pointer-events-none rounded-full" />

                {/* Animated top gradient line */}
                <motion.div
                  className="h-[2px] bg-gradient-to-r from-transparent via-[#00C2BB] to-transparent"
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : {}}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                />

                <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-10 relative z-10">

                  {/* ── Main 4-column grid ── */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-14">

                    {/* Col 1 — Brand */}
                    <motion.div
                      className="lg:col-span-5 flex flex-col gap-6"
                      initial={{ opacity: 0, y: 30 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {/* Logo */}
                      <div className="flex items-center overflow-visible py-2">
                        <img
                          src="/rhynox svg logo.svg"
                          alt="RHYNOX TECHNOLOGIES"
                          className="h-36 sm:h-44 md:h-52 w-auto object-contain filter drop-shadow-[0_0_25px_rgba(255,255,255,0.9)] drop-shadow-[0_0_50px_rgba(255,255,255,0.65)] scale-[1.35] origin-left"
                        />
                      </div>

                      {/* Tagline */}
                      <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                        Building modern websites, AI-powered solutions, mobile applications, and digital experiences that help businesses grow faster.
                      </p>

                      {/* Contact info */}
                      <div className="flex flex-col gap-3">
                        <a href="https://maps.google.com/?q=Chennai,India" target="_blank" rel="noreferrer"
                          className="flex items-center gap-2.5 text-gray-400 hover:text-[#00C2BB] transition-colors text-sm group">
                          <MapPin className="w-4 h-4 text-[#00C2BB] shrink-0 group-hover:scale-110 transition-transform" />
                          <span>Chennai, India</span>
                        </a>
                        <a href="mailto:rhynoxtechnologies@gmail.com"
                          className="flex items-center gap-2.5 text-gray-400 hover:text-[#00C2BB] transition-colors text-sm group">
                          <Mail className="w-4 h-4 text-[#00C2BB] shrink-0 group-hover:scale-110 transition-transform" />
                          <span>rhynoxtechnologies@gmail.com</span>
                        </a>
                        <a href="tel:+918148311669"
                          className="flex items-center gap-2.5 text-gray-400 hover:text-[#00C2BB] transition-colors text-sm group">
                          <Phone className="w-4 h-4 text-[#00C2BB] shrink-0 group-hover:scale-110 transition-transform" />
                          <span>+91 81483 11669</span>
                        </a>
                      </div>

                      {/* Social icons */}
                      <div className="flex items-center gap-3 pt-1">
                        {[
                          { icon: <Instagram className="w-4 h-4" />, href: "https://instagram.com", name: "Instagram" },
                          {
                            icon: (
                              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                              </svg>
                            ),
                            href: "https://wa.me/918148311669",
                            name: "WhatsApp"
                          },
                          { icon: <Linkedin className="w-4 h-4" />, href: "https://linkedin.com", name: "LinkedIn" },
                        ].map((s, i) => (
                          <motion.a
                            key={i}
                            href={s.href}
                            target="_blank"
                            rel="noreferrer"
                            title={s.name}
                            className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#00C2BB] hover:border-[#00C2BB]/50 hover:bg-[#00C2BB]/10 transition-all"
                            whileHover={{ y: -3, scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                          >
                            {s.icon}
                          </motion.a>
                        ))}
                      </div>
                    </motion.div>

                    {/* Col 2 — Services */}
                    <motion.div
                      className="lg:col-span-3"
                      initial={{ opacity: 0, y: 30 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <h4 className="text-white font-mono font-bold text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                        <span className="h-px w-4 bg-[#00C2BB]" />
                        Services
                      </h4>
                      <ul className="flex flex-col gap-3">
                        {services.map((s, i) => (
                          <motion.li
                            key={s}
                            initial={{ opacity: 0, x: -12 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.4, delay: 0.3 + i * 0.07 }}
                          >
                            <button
                              onClick={() => handleNavClick('solutions')}
                              className="text-gray-400 hover:text-[#00C2BB] text-sm transition-colors flex items-center gap-2 group"
                            >
                              <ChevronRight className="w-3 h-3 text-[#00C2BB]/50 group-hover:text-[#00C2BB] group-hover:translate-x-1 transition-all" />
                              {s}
                            </button>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>

                    {/* Col 3 — Company */}
                    <motion.div
                      className="lg:col-span-2"
                      initial={{ opacity: 0, y: 30 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <h4 className="text-white font-mono font-bold text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                        <span className="h-px w-4 bg-[#00C2BB]" />
                        Company
                      </h4>
                      <ul className="flex flex-col gap-3">
                        {company.map((c, i) => (
                          <motion.li
                            key={c}
                            initial={{ opacity: 0, x: -12 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.4, delay: 0.4 + i * 0.07 }}
                          >
                            <button
                              onClick={() => handleNavClick(c === "About Us" ? "vision" : c === "Services" ? "solutions" : "contact")}
                              className="text-gray-400 hover:text-[#00C2BB] text-sm transition-colors flex items-center gap-2 group"
                            >
                              <ChevronRight className="w-3 h-3 text-[#00C2BB]/50 group-hover:text-[#00C2BB] group-hover:translate-x-1 transition-all" />
                              {c}
                            </button>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>

                    {/* Col 4 — Newsletter CTA */}
                    <motion.div
                      className="lg:col-span-2 flex flex-col gap-4"
                      initial={{ opacity: 0, y: 30 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="h-2 w-2 rounded-full bg-[#00C2BB] animate-pulse shadow-[0_0_8px_#00C2BB]" />
                        <span className="text-[10px] font-mono text-[#00C2BB] uppercase tracking-widest">Live Support</span>
                      </div>
                      <p className="text-gray-400 text-xs leading-relaxed">
                        Have a project in mind? Our team is ready to help you build it.
                      </p>
                      <motion.button
                        onClick={() => handleNavClick('contact')}
                        className="mt-2 bg-[#00C2BB] hover:bg-[#00e5ff] text-black font-extrabold text-xs px-5 py-3 rounded-xl shadow-[0_0_20px_rgba(0,194,187,0.35)] hover:shadow-[0_0_30px_rgba(0,194,187,0.55)] transition-all flex items-center gap-2 w-fit"
                        whileHover={{ scale: 1.05 }}
                      >
                        <span>Get Started</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </motion.button>
                    </motion.div>
                  </div>

                  {/* ── Trust Badges Row ── */}
                  <motion.div
                    className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.55 }}
                  >
                    {trustBadges.map((badge, i) => (
                      <motion.div
                        key={i}
                        className="flex items-center gap-2.5 bg-white/3 border border-white/8 rounded-xl px-4 py-3 hover:border-[#00C2BB]/40 hover:bg-[#00C2BB]/5 transition-all group"
                        whileHover={{ scale: 1.03 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.4, delay: 0.6 + i * 0.08 }}
                      >
                        <span className="text-[#00C2BB] group-hover:scale-110 transition-transform">{badge.icon}</span>
                        <span className="text-gray-300 text-xs font-mono">{badge.label}</span>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* ── Bottom bar ── */}
                  <motion.div
                    className="border-t border-white/8 pt-7 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-600"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.7 }}
                  >
                    <p>© 2026 Rhynox Technologies. All rights reserved.</p>
                    <div className="flex items-center gap-5 text-gray-600">
                      <span className="hover:text-gray-400 cursor-pointer transition-colors">Privacy Policy</span>
                      <span className="hover:text-gray-400 cursor-pointer transition-colors">Terms of Service</span>
                      <span className="flex items-center gap-1.5 text-[#FF5A36]/70">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#FF5A36] animate-pulse" />
                        All systems operational
                      </span>
                    </div>
                  </motion.div>

                </div>
              </footer>
            );
          };
          return <Footer />;
        })()}

        {/* ── 12. SERVICE DETAIL MODAL ───────────────────────────────────── */}
        <AnimatePresence>
          {selectedServiceModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
              onClick={() => setSelectedServiceModal(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#121316] border border-[#FF5A36]/40 rounded-2xl max-w-lg w-full p-8 shadow-2xl relative"
              >
                <button
                  onClick={() => setSelectedServiceModal(null)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="w-12 h-12 rounded-xl bg-[#1D1F24] border border-[#FF5A36]/40 flex items-center justify-center mb-4">
                  {selectedServiceModal.icon}
                </div>

                <h3 className="text-2xl font-bold font-mono text-white mb-2">
                  {selectedServiceModal.title}
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed mb-6">
                  {selectedServiceModal.desc}
                </p>

                <h4 className="text-xs font-mono uppercase text-[#FF5A36] tracking-widest mb-3">Key Deliverables:</h4>
                <ul className="space-y-2 mb-8">
                  {selectedServiceModal.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-gray-300">
                      <Check className="w-4 h-4 text-[#FF5A36]" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => {
                    setSelectedServiceModal(null);
                    handleNavClick('contact');
                  }}
                  className="w-full bg-[#FF5A36] text-black font-extrabold py-3 rounded-xl text-center shadow-[0_0_20px_rgba(255,90,54,0.4)] hover:bg-[#ff7253] transition-all"
                >
                  Book This Service Now
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── 13. ADMIN LOGIN / DASHBOARD OVERLAY ───────────────────────── */}
        <AnimatePresence>
          {showAdminLogin && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg">
              {isAdminLoggedIn ? (
                <div className="bg-[#121316] w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 border border-white/10 relative">
                  <button
                    onClick={() => setShowAdminLogin(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <AdminDashboard onLogout={() => setIsAdminLoggedIn(false)} />
                </div>
              ) : (
                <div className="relative w-full max-w-md">
                  <button
                    onClick={() => setShowAdminLogin(false)}
                    className="absolute -top-10 right-0 text-gray-400 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <AdminLogin onLoginSuccess={() => setIsAdminLoggedIn(true)} />
                </div>
              )}
            </div>
          )}
        </AnimatePresence>

        {/* ── 14. FLOATING AI CHATBOT INTEGRATION ───────────────────────── */}
        <Chatbot />

      </div>
    </ReactLenis>
  );
}
