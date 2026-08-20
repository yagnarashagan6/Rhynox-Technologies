import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  X, 
  Send, 
  Minimize2,
  Bot,
  User,
  Package,
  DollarSign,
  ArrowLeft,
  Check,
  Info,
  CheckCircle
} from 'lucide-react';
import { getAnalyticsSessionId, trackButtonClick, trackEvent } from './utils/analytics.js';

const Chatbot = ({ openWithPlan }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewingServiceDetail, setViewingServiceDetail] = useState(null);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 Hello! I'm Rhynox Assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [currentFlow, setCurrentFlow] = useState(null);
  const [orderData, setOrderData] = useState({
    service: '',
    name: '',
    email: '',
    phone: '',
    details: ''
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Detailed Service Offerings for the Chatbot Logic
  const services = [
    // Starter Tier
    { 
        id: 'portfolio-basic', 
        name: "Basic Portfolio", 
        price: "₹199", 
        icon: "👤", 
        category: "Starter", 
        detail: "Single-page responsive site",
        fullDetails: [
            "Single-page responsive website",
            "Clean modern design",
            "Free Vercel Hosting 🌐"
        ]
    },
    { 
        id: 'portfolio-std', 
        name: "Standard Portfolio", 
        price: "₹499", 
        icon: "💼", 
        category: "Starter", 
        detail: "Up to 5 pages + Contact Form",
        fullDetails: [
            "Up to 5 pages (Home, About, Projects, Services, Contact)",
            "Responsive design & SEO Friendly",
            "Contact form integration",
            "WhatsApp Chat Button",
            "Free Vercel Hosting 🌐"
        ]
    },
    { 
        id: 'portfolio-prem', 
        name: "Premium Portfolio", 
        price: "₹699", 
        icon: "🚀", 
        category: "Starter", 
        detail: "7 Pages + Free Hosting",
        fullDetails: [
            "Up to 7 pages with Premium UI",
            "Advanced Animations & Transitions",
            "Contact form + Email Alerts",
            "Advanced SEO Optimization",
            "Social Media Integration",
            "Performance Optimization (Fast Load)",
            "Free Vercel Hosting 🌐"
        ]
    },
    { 
        id: 'business-static', 
        name: "Static Business Website", 
        price: "₹499", 
        icon: "🏢", 
        category: "Starter", 
        detail: "5 Pages + Business Verified",
        fullDetails: [
            "Up to 5 Pages (About, Services, Contact, etc.)",
            "Business Email Integration (e.g., info@yourbiz.com)",
            "Google Maps & Social Media Links",
            "SEO Friendly Structure",
            "Fast Loading Speed",
            "Free Vercel Hosting 🌐"
        ]
    },
    
    // Business Tier
    { 
        id: 'business-dynamic', 
        name: "Dynamic Business Website", 
        price: "₹999", 
        icon: "⚡", 
        category: "Business", 
        detail: "Admin Panel + SEO",
        fullDetails: [
            "Admin Dashboard to Edit Content Easily",
            "Blog / News Section",
            "User Enquiry Management",
            "Advanced SEO Setup",
            "Analytics Dashboard Integration",
            "Database Connectivity (MongoDB)",
            "Deployment Support"
        ]
    },
    { 
        id: 'app-mvp', 
        name: "Business App (MVP)", 
        price: "₹999", 
        icon: "📱", 
        category: "Business", 
        detail: "React App (No Backend)",
        fullDetails: [
            "Progressive Web App (PWA) Support",
            "Mobile-First Responsive UI",
            "App-like Experience on Phones",
            "Local Storage for Data Persistence",
            "Fast Performance & Offline Capable",
            "Installable on Home Screen"
        ]
    },

    // Enterprise Tier
    { 
        id: 'custom-web', 
        name: "Full Stack Web App", 
        price: "Custom", 
        icon: "🌐", 
        category: "Enterprise", 
        detail: "MERN Stack / Next.js",
        fullDetails: [
            "Complete Custom Solution (Frontend + Backend)",
            "User Authentication (Login/Signup)",
            "Payment Gateway Integration",
            "Dashboard for Users & Admins",
            "API Development & Integration",
            "Cloud Hosting (AWS/DigitalOcean) Setup"
        ]
    },
    { 
        id: 'custom-app', 
        name: "Mobile App (iOS/Android)", 
        price: "Custom", 
        icon: "📲", 
        category: "Enterprise", 
        detail: "React Native / Flutter",
        fullDetails: [
            "Cross-Platform App (iOS & Android)",
            "Push Notifications",
            "Native Device Features (Camera, GPS)",
            "App Store & Play Store Submission Support",
            "High Performance Native Code",
            "Real-time Data Sync"
        ]
    },
    { 
        id: 'youtube-ads', 
        name: "YouTube Ads Creation", 
        price: "Custom", 
        icon: "📺", 
        category: "Enterprise", 
        detail: "Script + Production",
        fullDetails: [
            "Professional Script Writing",
            "High-Quality Video Production",
            "Voiceover & Sound Design",
            "Motion Graphics & Animation",
            "Ad Campaign Strategy",
            "Thumbnail Design"
        ]
    },
    { 
        id: 'video-editing', 
        name: "Professional Video Editing", 
        price: "Custom", 
        icon: "🎬", 
        category: "Enterprise", 
        detail: "Any duration",
        fullDetails: [
            "Cinematic Color Grading",
            "Advanced Transitions & Effects",
            "Sound Mixing & Mastering",
            "Subtitles & Captions",
            "4K Rendering",
            "highlight & Reels Editing"
        ]
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "₹499",
      features: [
        "Responsive website",
        "Up to 5 pages",
        "Contact form",
        "WhatsApp integration",
        "Basic SEO",
        "Email integration"
      ]
    },
    {
      name: "Business",
      price: "₹999",
      features: [
        "Dynamic website OR small app",
        "React-based UI",
        "Admin-editable content",
        "SEO & analytics setup",
        "WhatsApp & email integration",
        "Deployment support"
      ]
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: [
        "Full-stack web / mobile apps",
        "Backend & database",
        "Payment gateway",
        "AI chatbot integration",
        "Cloud & hosting setup",
        "Dedicated support"
      ]
    }
  ];

  const quickActions = [
    { id: 'pricing', label: '💰 View Pricing', icon: <DollarSign size={16} /> },
    { id: 'order', label: '📦 Place Order', icon: <Package size={16} /> },
    { id: 'help', label: '❓ Get Help', icon: <Info size={16} /> }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) trackEvent('chatbot_open');
  }, [isOpen]);

  // Handle opening chatbot with a specific plan
  useEffect(() => {
    if (openWithPlan) {
      setIsOpen(true);
      setShowQuickActions(false);
      
      const initializeOrder = () => {
        addMessage(
          `Great choice! You're interested in our ${openWithPlan} plan. Let me help you get started with placing an order.`,
          'bot'
        );
        setTimeout(() => {
          startOrderFlow(openWithPlan);
        }, 500);
      };
      
      simulateTyping(initializeOrder);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openWithPlan]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (text, sender = 'bot', options = {}) => {
    const newMessage = {
      id: Date.now(),
      text,
      sender,
      timestamp: new Date(),
      ...options
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const simulateTyping = (callback, delay = 1000) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, delay);
  };

  const handleQuickAction = (actionId) => {
    setShowQuickActions(false);
    
    switch(actionId) {
      case 'pricing':
        addMessage("I'd like to know about pricing", 'user');
        simulateTyping(() => {
          handlePricingInquiry();
        });
        break;
      case 'order':
        addMessage("I want to place an order", 'user');
        simulateTyping(() => {
          startOrderFlow();
        });
        break;
      case 'help':
        addMessage("I need help", 'user');
        simulateTyping(() => {
          handleHelpRequest();
        });
        break;
    }
  };

  const handlePricingInquiry = () => {
    addMessage(
      "Here are our pricing plans:",
      'bot'
    );
    
    setTimeout(() => {
      addMessage(
        `📊 Our Pricing Plans:\n\n` +
        pricingPlans.map(plan => 
          `${plan.name} - ${plan.price}\n` +
          plan.features.map(f => `  ✓ ${f}`).join('\n')
        ).join('\n\n'),
        'bot',
        { isFormatted: true }
      );
      
      setTimeout(() => {
        addMessage(
          "Would you like to place an order or need more details about any specific plan?",
          'bot',
          { 
            suggestions: [
              'Place an order',
              'Tell me about Starter plan',
              'Tell me about Business plan',
              'Compare all plans'
            ]
          }
        );
      }, 500);
    }, 300);
  };

  const startOrderFlow = (planPlan = null) => {
    setCurrentFlow('order-category-select');
    
    // If a plan is pre-selected (from website click)
    if (planPlan) {
        if (planPlan === 'Starter') {
            addMessage(
                "Excellent choice! For the Starter plan (₹499), are you looking for a **Personal Portfolio** or a **Small Business Website**?",
                'bot',
                { suggestions: ['Portfolio', 'Small Business'] }
            );
        } else if (planPlan === 'Business') {
            addMessage(
                "The Business Plan (₹999) is perfect for growth! Are you interested in a **Dynamic Website** or a **Simple App (MVP)**?",
                'bot',
                { suggestions: ['Dynamic Website', 'Business App'] }
            );
        } else if (planPlan === 'Enterprise') {
            const entServices = services.filter(s => s.category === 'Enterprise');
            addMessage(
                "You need a powerful solution! Our Enterprise plan covers Full-stack apps, Custom backends, and more. What are you looking for?",
                'bot',
                { serviceOptions: entServices }
            );
            setCurrentFlow('order'); //Direct selection for enterprise
        }
    } else {
        // Generic start - ask for category
        addMessage(
             "Great! Let's get your order started. Which plan fits your needs best?",
             'bot',
             { suggestions: ['Starter (₹499)', 'Business (₹999)', 'Enterprise (Custom)'] }
        );
    }
  };

  const handleServiceSelection = (serviceName) => {
    setOrderData(prev => ({ ...prev, service: serviceName }));
    addMessage(serviceName, 'user');
    
    simulateTyping(() => {
      addMessage(
        `Perfect! ${serviceName} is an excellent choice. To proceed with your order, I'll need some information.\n\nWhat's your name?`,
        'bot'
      );
      setCurrentFlow('order-name');
    });
  };

  const handleHelpRequest = () => {
    addMessage(
      "I'm here to help! Here's what I can assist you with:\n\n" +
      "🌐 Services Information - Learn about our web, app, design, and video services\n" +
      "💰 Pricing & Plans - View detailed pricing for all our packages\n" +
      "📦 Place Orders - Start your project with us\n" +
      "⏱️ Delivery Timeline - Know how long your project will take\n" +
      "💬 Custom Quotes - Get a personalized quote for your needs\n\n" +
      "What would you like to know more about?",
      'bot',
      {
        suggestions: [
          'Service details',
          'Delivery timeline',
          'Place an order',
          'Get a custom quote'
        ]
      }
    );
  };

  const processUserMessage = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Handle order flow stages
    if (currentFlow === 'order-category-select') {
        const lower = message.toLowerCase();
        
        // STARTER LOGIC
        if (lower.includes('starter') || lower.includes('499')) {
             addMessage("For the Starter plan, are you looking for a **Portfolio** or a **Small Business Website**?", 'bot', { suggestions: ['Portfolio', 'Small Business'] });
             return;
        }
        if (lower.includes('portfolio')) {
             const portfolioServices = services.filter(s => s.id.includes('portfolio'));
             addMessage(
                 "Great! For Portfolios we have three special tiers:\n\n" +
                 "1. 👤 **Basic (₹199)**: Single page, modern design.\n" +
                 "2. 💼 **Standard (₹499)**: Up to 5 pages, contact form (Recommended).\n" +
                 "3. 🚀 **Premium (₹699)**: 7 pages + Free Hosting.\n\n" +
                 "Which one would you like to proceed with?",
                 'bot',
                 { serviceOptions: portfolioServices }
             );
             setCurrentFlow('order'); // Now pick specific service
             return;
        }
        if (lower.includes('small business') || (lower.includes('business') && !lower.includes('app') && !lower.includes('dynamic'))) {
             // Catch "Business" if it's meant for starter, but safeguard against Business Plan 999
             // If they came from Starter path "Small Business" is unique
             const staticBiz = services.filter(s => s.id === 'business-static');
             addMessage(
                 "Perfect! Our **Static Business Website (₹499)** includes 5 pages, business email, and WhatsApp integration. Shall we proceed with this?",
                 'bot',
                 { serviceOptions: staticBiz }
             );
             setCurrentFlow('order');
             return;
        }

        // BUSINESS LOGIC
        if (lower.includes('business') && (lower.includes('999') || lower.includes('plan'))) {
             addMessage("Are you interested in a **Dynamic Website** or a **Business App**?", 'bot', { suggestions: ['Dynamic Website', 'Business App'] });
             return;
        }
        if (lower.includes('dynamic')) {
            const dynBiz = services.filter(s => s.id === 'business-dynamic');
            addMessage(
                "Our **Dynamic Business Website (₹999)** comes with an Admin Panel to edit content, SEO optimization, and more. Ready to build this?",
                'bot',
                { serviceOptions: dynBiz }
            );
            setCurrentFlow('order');
            return;
        }
        if (lower.includes('app') && !lower.includes('mobile')) {
            const appMvp = services.filter(s => s.id === 'app-mvp');
            addMessage(
                "Awesome! Our **Business App Plan (₹999)** is ideal for startups. It includes a modern React/Frontend app, responsive design (No complex backend). Shall we start your MVP?",
                'bot',
                { serviceOptions: appMvp }
            );
            setCurrentFlow('order');
            return;
        }

        // ENTERPRISE LOGIC
        if (lower.includes('enterprise') || lower.includes('custom') || lower.includes('mobile')) {
             const entServices = services.filter(s => s.category === 'Enterprise');
             addMessage(
                 "Enterprise solutions! Select a service to get a custom quote:",
                 'bot',
                 { serviceOptions: entServices }
             );
             setCurrentFlow('order');
             return;
        }
    }

    if (currentFlow === 'order-name') {
      setOrderData(prev => ({ ...prev, name: message }));
      setCurrentFlow('order-email');
      simulateTyping(() => {
        addMessage(
          `Thanks, ${message}! What's your email address?`,
          'bot'
        );
      });
      return;
    }
    
    if (currentFlow === 'order-email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(message)) {
        simulateTyping(() => {
          addMessage(
            "Please provide a valid email address.",
            'bot'
          );
        });
        return;
      }
      setOrderData(prev => ({ ...prev, email: message }));
      setCurrentFlow('order-phone');
      simulateTyping(() => {
        addMessage(
          "Great! What's your phone number?",
          'bot'
        );
      });
      return;
    }
    
    if (currentFlow === 'order-phone') {
      setOrderData(prev => ({ ...prev, phone: message }));
      setCurrentFlow('order-details');
      simulateTyping(() => {
        addMessage(
          "Perfect! Please tell me more about your project requirements:",
          'bot'
        );
      });
      return;
    }
    
    if (currentFlow === 'order-details') {
      setOrderData(prev => ({ ...prev, details: message }));
      setCurrentFlow('order-terms');
      setTermsAccepted(false);
      simulateTyping(() => {
        addMessage(
          "📋 TERMS AND CONDITIONS\n\n" +
          "────────────────────────\n\n" +
          "📌 Payment Terms:\n" +
          "• 50% advance payment required\n" +
          "• 50% balance on delivery\n" +
          "• Payment via UPI, Bank Transfer, Cards\n\n" +
          "⏰ Delivery Timeline:\n" +
          "• Based on project scope\n" +
          "• Timeline shared before start\n" +
          "• Rush delivery available (extra charges)\n\n" +
          "🔄 Revisions Policy:\n" +
          "• Up to 3 free revisions\n" +
          "• Extra revisions charged separately\n" +
          "• Within original scope only\n\n" +
          "💰 Refund Policy:\n" +
          "• No refunds after work starts\n" +
          "• 100% refund if work not started\n" +
          "• Partial refunds at discretion\n\n" +
          "📜 Intellectual Property:\n" +
          "• Rights remain with Rhynox until\n   full payment\n" +
          "• Complete ownership transferred\n   after final payment\n" +
          "• Source files provided post-payment\n\n" +
          "────────────────────────\n\n" +
          "Please review and accept to proceed.",
          'bot',
          {
            isFormatted: true,
            showTermsCheckbox: true
          }
        );
      }, 1000);
      return;
    }

    // Intent-based responses
    if (lowerMessage.includes('price') || lowerMessage.includes('pricing') || lowerMessage.includes('cost')) {
      simulateTyping(() => handlePricingInquiry());
    } else if (lowerMessage.includes('order') || lowerMessage.includes('buy') || lowerMessage.includes('purchase')) {
      simulateTyping(() => startOrderFlow());
    } else if (lowerMessage.includes('service') || lowerMessage.includes('what do you')) {
      simulateTyping(() => {
        addMessage(
          "We offer the following services:\n\n" +
          services.map(s => `${s.icon} ${s.name} - ${s.price}`).join('\n'),
          'bot',
          { 
            isFormatted: true,
            suggestions: ['View pricing', 'Place an order', 'Tell me more']
          }
        );
      });
    } else if (lowerMessage.includes('starter') && lowerMessage.includes('plan')) {
      simulateTyping(() => {
        const plan = pricingPlans[0];
        addMessage(
          `${plan.name} Plan - ${plan.price}\n\n` +
          plan.features.map(f => `✓ ${f}`).join('\n') +
          "\n\nPerfect for startups and small businesses! Would you like to order this plan?",
          'bot',
          { 
            isFormatted: true,
            suggestions: ['Yes, order Starter', 'Show other plans', 'Ask a question']
          }
        );
      });
    } else if (lowerMessage.includes('business') && lowerMessage.includes('plan')) {
      simulateTyping(() => {
        const plan = pricingPlans[1];
        addMessage(
          `${plan.name} Plan - ${plan.price}\n\n` +
          plan.features.map(f => `✓ ${f}`).join('\n') +
          "\n\nIdeal for growing companies! Would you like to order this plan?",
          'bot',
          { 
            isFormatted: true,
            suggestions: ['Yes, order Business', 'Show other plans', 'Compare plans']
          }
        );
      });
    } else if (lowerMessage.includes('delivery') || lowerMessage.includes('timeline') || lowerMessage.includes('how long')) {
      simulateTyping(() => {
        addMessage(
          "⏱️ Typical Delivery Times:\n\n" +
          "• Basic Website: 3-5 days\n" +
          "• Dynamic Web App: 7-14 days\n" +
          "• Mobile App: 14-21 days\n" +
          "• Graphic Design: 1-3 days\n" +
          "• Video Editing: 2-5 days\n\n" +
          "We value your time and deliver quality work quickly!",
          'bot',
          { 
            isFormatted: true,
            suggestions: ['Place an order', 'View pricing', 'Ask another question']
          }
        );
      });
    } else if (lowerMessage.includes('compare') || lowerMessage.includes('difference')) {
      simulateTyping(() => {
        addMessage(
          "📊 Plan Comparison:\n\n" +
          "Starter (₹499) - Best for basic presence\n" +
          "• 5-page website, basic SEO, 1 month support\n\n" +
          "Business (₹999) - Best for growing companies\n" +
          "• Dynamic app, admin dashboard, 3 months support\n\n" +
          "Enterprise (Custom) - Best for full-scale projects\n" +
          "• Mobile apps, complex systems, 24/7 support\n\n" +
          "Which one suits your needs?",
          'bot',
          {
            isFormatted: true,
            suggestions: ['Order Starter', 'Order Business', 'Get custom quote']
          }
        );
      });
    } else if (lowerMessage.includes('custom quote') || lowerMessage.includes('personalized')) {
      simulateTyping(() => {
        addMessage(
          "I'd be happy to help you get a custom quote! Please tell me:\n\n" +
          "1. What type of project do you have in mind?\n" +
          "2. What's your budget range?\n" +
          "3. When do you need it completed?\n\n" +
          "Or would you like to place an order directly?",
          'bot',
          {
            suggestions: ['Place an order', 'Contact sales', 'View standard pricing']
          }
        );
      });
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      simulateTyping(() => {
        addMessage(
          "Hello! 👋 How can I help you today? I can assist with pricing, orders, or answer any questions!",
          'bot',
          {
            suggestions: ['View pricing', 'Place order', 'Get help']
          }
        );
      });
    } else if (lowerMessage.includes('thank')) {
      simulateTyping(() => {
        addMessage(
          "You're welcome! Feel free to reach out if you have any other questions. 😊",
          'bot',
          {
            suggestions: ['Place an order', 'View services', 'Exit chat']
          }
        );
      });
    } else {
      simulateTyping(() => {
        addMessage(
          "I'm here to help! I can assist you with:\n\n" +
          "• View pricing and plans\n" +
          "• Place an order\n" +
          "• Answer questions about our services\n" +
          "• Provide delivery timelines\n\n" +
          "What would you like to know?",
          'bot',
          {
            suggestions: ['View pricing', 'Place order', 'Our services', 'Delivery time']
          }
        );
      });
    }
  };

  const submitOrder = async (data) => {
    try {
      // Send order to backend
      const response = await fetch('/api/chatbot-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      body: JSON.stringify({ ...data, sessionId: getAnalyticsSessionId(), page: window.location.pathname, messageCount: messages.length }),
      });

      if (response.ok) {
        // Construct WhatsApp message with proper formatting
        const messageText = ` *New Order Request*\n\n` +
          `━━━━━━━━━━━━━━━━━━━━━\n\n` +
          ` *Service:* ${data.service}\n` +
          ` *Name:* ${data.name}\n` +
          ` *Email:* ${data.email}\n` +
          ` *Phone:* ${data.phone}\n` +
          ` *Details:* ${data.details}\n` +
          `━━━━━━━━━━━━━━━━━━━━━\n` +
          ` *Time:* ${new Date().toLocaleString()}\n` +
          ` *Order ID:* #${Date.now().toString().slice(-6)}`;
        
        const waLink = `https://wa.me/918148311669?text=${encodeURIComponent(messageText)}`;

        addMessage(
          `✅ Order Received!\n\n` +
          `Thank you, ${data.name}! We've received your order for ${data.service}.\n\n` +
          `📧 Email: ${data.email}\n` +
          `📱 Phone: ${data.phone}\n\n` +
          `Order ID: #${Date.now().toString().slice(-6)}`,
          'bot',
          { 
            isFormatted: true,
            icon: <CheckCircle className="text-green-500" />,
            actionUrl: waLink,
            actionLabel: "Send Details to WhatsApp"
          }
        );

        // Sequence: Wait 3 seconds, then send the closing message, then show quick actions
        setTimeout(() => {
            addMessage(
                "Thanks for placing the order! We will call you within 24 hours to discuss the details.",
                'bot'
            );
            
            setTimeout(() => {
                setShowQuickActions(true);
            }, 2000);
        }, 3000);

      } else {
        throw new Error('Failed to submit order');
      }
    } catch (error) {
      addMessage(
        "I apologize, but there was an issue submitting your order. Please try contacting us directly at contact@rhynox.com or call us.",
        'bot'
      );
      setTimeout(() => {
          setShowQuickActions(true);
      }, 2000);
    }
    
    // Reset order data
    setOrderData({
      service: '',
      name: '',
      email: '',
      phone: '',
      details: ''
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() === '') return;

    addMessage(inputMessage, 'user');
    const messageToProcess = inputMessage;
    setInputMessage('');
    
    processUserMessage(messageToProcess);
  };

  const handleSuggestionClick = (suggestion) => {
    addMessage(suggestion, 'user');
    processUserMessage(suggestion);
  };

  const handleBackToMain = () => {
    setCurrentFlow(null);
    setShowQuickActions(true);
    addMessage(
      "Back to main menu. How can I help you?",
      'bot',
      { showActions: true }
    );
  };

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-[55] bg-[#00C2BB] hover:bg-[#00e5ff] text-black p-3.5 md:p-4 rounded-full shadow-[0_0_25px_rgba(0,194,187,0.45)] hover:shadow-[0_0_35px_rgba(0,194,187,0.65)] transition-all duration-300 flex items-center justify-center"
          >
            <MessageCircle size={26} className="md:w-7 md:h-7 stroke-[2.5]" />
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -top-1 -right-1 bg-white text-[#00C2BB] text-[11px] w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center font-extrabold shadow-md border border-[#00C2BB]"
            >
              1
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1
            }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-20 md:bottom-6 right-2 md:right-6 left-2 md:left-auto z-[55] md:w-96 bg-[#121316] rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden border border-[#00C2BB]/30 max-h-[calc(100vh-9rem)] md:max-h-[600px]"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#00C2BB] to-[#00e5ff] p-4 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="bg-black/20 p-2 rounded-full backdrop-blur-sm border border-black/10">
                  <Bot size={22} className="text-black" />
                </div>
                <div>
                  <h3 className="font-extrabold text-black text-base tracking-tight font-mono">Rhynox Assistant</h3>
                  <p className="text-xs text-black/80 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-950 animate-pulse" />
                    Online • Ready to help
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-black/80 hover:text-black hover:bg-black/10 p-1.5 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
                <div className="h-96 overflow-y-auto p-4 space-y-4 bg-[#0B0C10]">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-2 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.sender === 'user' 
                            ? 'bg-[#00C2BB] text-black font-bold' 
                            : 'bg-[#1D1F24] border border-[#00C2BB]/40 text-[#00C2BB]'
                        }`}>
                          {message.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                        </div>
                        <div>
                          <div className={`p-3.5 rounded-2xl ${
                            message.sender === 'user'
                              ? 'bg-[#00C2BB] text-black font-semibold shadow-[0_0_15px_rgba(0,194,187,0.25)]'
                              : 'bg-[#1D1F24] text-gray-100 border border-white/10'
                          }`}>
                            <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                          </div>
                          
                          {/* Service Options */}
                          {message.serviceOptions && (
                            <div className="mt-2 space-y-2">
                              {message.serviceOptions.map((service, index) => (
                                <div key={index} className="relative group">
                                    <motion.button
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        onClick={() => handleServiceSelection(service.name)}
                                        className="w-full bg-[#16181D] hover:bg-[#1D1F26] p-3.5 rounded-xl text-left transition-all border border-white/10 hover:border-[#00C2BB]/60 shadow-sm relative pr-10"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl p-2 bg-[#0B0C10] rounded-lg border border-white/5">{service.icon}</span>
                                                <div>
                                                    <span className="font-bold text-white block text-sm">{service.name}</span>
                                                    <span className="text-[10px] text-gray-400 block mt-0.5">{service.detail}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end min-w-[60px]">
                                                <span className="text-xs text-[#00C2BB] font-extrabold bg-[#00C2BB]/10 px-2 py-1 rounded-md border border-[#00C2BB]/30">{service.price}</span>
                                            </div>
                                        </div>
                                    </motion.button>
                                    
                                    {/* Info Icon Button - Absolute Top Right of the Card */}
                                    {service.fullDetails && (
                                        <motion.button
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.1 + 0.1 }}
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent card click
                                                setViewingServiceDetail(service);
                                            }}
                                            className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-[#00C2BB] hover:bg-[#00C2BB]/10 rounded-full transition-colors z-10"
                                        >
                                            <Info size={18} />
                                        </motion.button>
                                    )}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Terms and Conditions Checkbox */}
                          {message.showTermsCheckbox && (
                            <div className="mt-3 space-y-3">
                              <div 
                                onClick={() => setTermsAccepted(!termsAccepted)}
                                className="flex items-start gap-3 cursor-pointer group"
                              >
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all mt-0.5 ${
                                  termsAccepted 
                                    ? 'bg-[#00C2BB] border-[#00C2BB]' 
                                    : 'border-gray-600 group-hover:border-[#00C2BB]'
                                }`}>
                                  {termsAccepted && (
                                    <Check size={14} className="text-black" strokeWidth={3} />
                                  )}
                                </div>
                                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                                  I accept the terms and conditions
                                </span>
                              </div>
                              {termsAccepted && (
                                <motion.button
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  onClick={() => {
                                    simulateTyping(() => {
                                      addMessage(
                                        "✅ Thank you for accepting our terms!\n\nProcessing your order...",
                                        'bot',
                                        {
                                          isFormatted: true
                                        }
                                      );
                                      setTimeout(() => {
                                        submitOrder(orderData);
                                      }, 500);
                                      setCurrentFlow(null);
                                    });
                                  }}
                                  className="w-full bg-[#00C2BB] hover:bg-[#00e5ff] text-black font-extrabold py-2.5 rounded-lg transition-all shadow-[0_0_15px_rgba(0,194,187,0.35)]"
                                >
                                  Confirm and Submit Order
                                </motion.button>
                              )}
                            </div>
                          )}

                          {/* Action Button */}
                          {message.actionUrl && (
                            <div className="mt-3">
                              <a
                                href={message.actionUrl}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 onClick={() => {
                                   if (message.actionUrl.includes('wa.me')) {
                                     trackButtonClick('whatsapp');
                                   }
                                 }}
                                 className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-4 py-2 rounded-full transition-all font-medium text-sm shadow-md hover:shadow-lg"
                              >
                                <MessageCircle size={16} />
                                {message.actionLabel || 'Open Link'}
                              </a>
                            </div>
                          )}

                          {/* Suggestions */}
                          {message.suggestions && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {message.suggestions.map((suggestion, index) => (
                                <motion.button
                                  key={index}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: index * 0.1 }}
                                  onClick={() => handleSuggestionClick(suggestion)}
                                  className="text-xs bg-[#1A1C23] hover:bg-[#00C2BB] text-gray-300 hover:text-black font-medium px-3 py-1.5 rounded-full transition-all border border-white/10 hover:border-[#00C2BB]"
                                >
                                  {suggestion}
                                </motion.button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-2"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#1D1F24] border border-[#00C2BB]/40 flex items-center justify-center text-[#00C2BB]">
                        <Bot size={16} />
                      </div>
                      <div className="bg-[#1D1F24] p-3 rounded-2xl border border-white/10">
                        <div className="flex gap-1.5">
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                            className="w-2 h-2 bg-[#00C2BB] rounded-full"
                          />
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                            className="w-2 h-2 bg-[#00C2BB] rounded-full"
                          />
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                            className="w-2 h-2 bg-[#00C2BB] rounded-full"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Quick Actions */}
                  {showQuickActions && !currentFlow && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col gap-2"
                    >
                      {quickActions.map((action, index) => (
                        <motion.button
                          key={action.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => handleQuickAction(action.id)}
                          className="bg-[#16181D] hover:bg-[#00C2BB] p-3 rounded-xl text-left transition-all border border-white/10 hover:border-[#00C2BB] flex items-center gap-3 group"
                        >
                          <div className="text-[#00C2BB] group-hover:text-black transition-colors">{action.icon}</div>
                          <span className="text-sm font-medium text-white group-hover:text-black transition-colors">{action.label}</span>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 bg-[#121316] border-t border-white/10">
                  {currentFlow && (
                    <button
                      onClick={handleBackToMain}
                      className="text-xs text-[#00C2BB] hover:text-[#00e5ff] mb-2 flex items-center gap-1 font-mono"
                    >
                      <ArrowLeft size={14} />
                      Back to main menu
                    </button>
                  )}
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 bg-[#1D1F24] text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00C2BB] border border-white/10 text-sm"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={inputMessage.trim() === ''}
                      className="bg-[#00C2BB] hover:bg-[#00e5ff] text-black p-2.5 rounded-full transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_12px_rgba(0,194,187,0.3)]"
                    >
                      <Send size={18} strokeWidth={2.5} />
                    </motion.button>
                  </form>
                </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Service Detail Modal/Popup */}
      <AnimatePresence>
        {viewingServiceDetail && (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed bottom-24 md:bottom-10 right-4 md:right-8 z-[60] w-[90vw] md:w-80 bg-[#121316] border border-[#00C2BB]/40 rounded-2xl shadow-2xl p-5 overflow-hidden"
            >
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">{viewingServiceDetail.icon}</span>
                        <div>
                            <h3 className="font-bold text-lg text-white leading-tight">{viewingServiceDetail.name}</h3>
                            <span className="text-[#00C2BB] font-extrabold">{viewingServiceDetail.price}</span>
                        </div>
                    </div>
                    <button 
                        onClick={() => setViewingServiceDetail(null)}
                        className="p-1 bg-[#1D1F24] rounded-full hover:bg-[#252830] text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
                
                <div className="space-y-3 mb-5">
                    {viewingServiceDetail.fullDetails.map((detail, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                            <CheckCircle size={16} className="text-[#00C2BB] mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-300 leading-snug">{detail}</span>
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => {
                        handleServiceSelection(viewingServiceDetail.name);
                        setViewingServiceDetail(null);
                    }}
                    className="w-full py-2.5 bg-[#00C2BB] hover:bg-[#00e5ff] text-black font-extrabold rounded-xl transition-all shadow-[0_0_20px_rgba(0,194,187,0.35)]"
                >
                    Select This Plan
                </button>
            </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
