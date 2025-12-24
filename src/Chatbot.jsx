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
  HelpCircle,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
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
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Service data matching your website
  const services = [
    { name: "Website Development", price: "Starting at ₹499", icon: "🌐" },
    { name: "App Development", price: "Starting at ₹999", icon: "📱" },
    { name: "Graphic Designing", price: "Starting at ₹499", icon: "🎨" },
    { name: "YouTube Ads Creation", price: "Custom Quote", icon: "📺" },
    { name: "Video Editing", price: "Custom Quote", icon: "🎬" }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "₹499",
      features: [
        "Responsive Website (5 Pages)",
        "Basic SEO Optimization",
        "Contact Form Integration",
        "1 Month Maintenance"
      ]
    },
    {
      name: "Business",
      price: "₹999",
      features: [
        "Dynamic React Application",
        "CMS / Admin Dashboard",
        "Advanced SEO & Analytics",
        "Brand Identity Design",
        "3 Months Support"
      ]
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: [
        "Custom Mobile App",
        "Complex E-commerce Solutions",
        "Full Video Production & Ads",
        "Dedicated Project Manager",
        "Priority 24/7 Support"
      ]
    }
  ];

  const quickActions = [
    { id: 'pricing', label: '💰 View Pricing', icon: <DollarSign size={16} /> },
    { id: 'order', label: '📦 Place Order', icon: <Package size={16} /> },
    { id: 'help', label: '❓ Get Help', icon: <HelpCircle size={16} /> }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const startOrderFlow = () => {
    setCurrentFlow('order');
    addMessage(
      "Great! Let's get your order started. Which service are you interested in?",
      'bot',
      {
        serviceOptions: services
      }
    );
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
      setCurrentFlow(null);
      simulateTyping(() => {
        submitOrder({ ...orderData, details: message });
      }, 1500);
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
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Construct WhatsApp message with proper formatting
        const messageText = `🚀 *New Order Request*\n\n` +
          `━━━━━━━━━━━━━━━━━━━━━\n\n` +
          `📦 *Service:*\n${data.service}\n\n` +
          `👤 *Name:*\n${data.name}\n\n` +
          `📧 *Email:*\n${data.email}\n\n` +
          `📱 *Phone:*\n${data.phone}\n\n` +
          `📝 *Details:*\n${data.details}\n\n` +
          `━━━━━━━━━━━━━━━━━━━━━\n` +
          `🕒 *Time:* ${new Date().toLocaleString()}\n` +
          `📋 *Order ID:* #${Date.now().toString().slice(-6)}`;
        
        const waLink = `https://wa.me/918148311669?text=${encodeURIComponent(messageText)}`;

        addMessage(
          `✅ Order Received!\n\n` +
          `Thank you, ${data.name}! We've received your order for ${data.service}.\n\n` +
          `📧 Email: ${data.email}\n` +
          `📱 Phone: ${data.phone}\n\n` +
          `Our team will contact you within 24 hours to discuss your project in detail!\n\n` +
          `Order ID: #${Date.now().toString().slice(-6)}`,
          'bot',
          { 
            isFormatted: true,
            icon: <CheckCircle className="text-green-500" />,
            actionUrl: waLink,
            actionLabel: "Send Details to WhatsApp"
          }
        );
      } else {
        throw new Error('Failed to submit order');
      }
    } catch (error) {
      addMessage(
        "I apologize, but there was an issue submitting your order. Please try contacting us directly at contact@rhynox.com or call us.",
        'bot'
      );
    }
    
    // Reset order data
    setOrderData({
      service: '',
      name: '',
      email: '',
      phone: '',
      details: ''
    });
    
    setTimeout(() => {
      setShowQuickActions(true);
    }, 2000);
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
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-[55] bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 md:p-4 rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all duration-300"
          >
            <MessageCircle size={24} className="md:w-7 md:h-7" />
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center font-bold"
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
            className="fixed bottom-20 md:bottom-6 right-2 md:right-6 left-2 md:left-auto z-[55] md:w-96 bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700 max-h-[calc(100vh-9rem)] md:max-h-[600px]"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <Bot size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Rhynox Assistant</h3>
                  <p className="text-xs text-white/80">Online • Ready to help</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
                <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-950">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.sender === 'user' 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                            : 'bg-gradient-to-r from-purple-500 to-pink-500'
                        }`}>
                          {message.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                        </div>
                        <div>
                          <div className={`p-3 rounded-2xl ${
                            message.sender === 'user'
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                              : 'bg-gray-800 text-gray-100'
                          }`}>
                            <p className="text-sm whitespace-pre-line">{message.text}</p>
                          </div>
                          
                          {/* Service Options */}
                          {message.serviceOptions && (
                            <div className="mt-2 space-y-2">
                              {message.serviceOptions.map((service, index) => (
                                <motion.button
                                  key={index}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  onClick={() => handleServiceSelection(service.name)}
                                  className="w-full bg-gray-800 hover:bg-gray-700 p-3 rounded-xl text-left transition-all border border-gray-700 hover:border-purple-500"
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <span className="text-2xl mr-2">{service.icon}</span>
                                      <span className="text-sm font-semibold text-white">{service.name}</span>
                                    </div>
                                    <span className="text-xs text-purple-400">{service.price}</span>
                                  </div>
                                </motion.button>
                              ))}
                            </div>
                          )}

                          {/* Action Button */}
                          {message.actionUrl && (
                            <div className="mt-3">
                              <a
                                href={message.actionUrl}
                                target="_blank"
                                rel="noopener noreferrer"
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
                                  className="text-xs bg-gray-800 hover:bg-purple-600 text-gray-300 hover:text-white px-3 py-1.5 rounded-full transition-all border border-gray-700 hover:border-purple-500"
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
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <Bot size={16} />
                      </div>
                      <div className="bg-gray-800 p-3 rounded-2xl">
                        <div className="flex gap-1">
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                            className="w-2 h-2 bg-purple-400 rounded-full"
                          />
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                            className="w-2 h-2 bg-purple-400 rounded-full"
                          />
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                            className="w-2 h-2 bg-purple-400 rounded-full"
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
                          className="bg-gradient-to-r from-gray-800 to-gray-700 hover:from-purple-600 hover:to-blue-600 p-3 rounded-xl text-left transition-all border border-gray-700 hover:border-purple-500 flex items-center gap-3"
                        >
                          <div className="text-purple-400">{action.icon}</div>
                          <span className="text-sm font-medium text-white">{action.label}</span>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 bg-gray-900 border-t border-gray-700">
                  {currentFlow && (
                    <button
                      onClick={handleBackToMain}
                      className="text-xs text-purple-400 hover:text-purple-300 mb-2 flex items-center gap-1"
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
                      className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={inputMessage.trim() === ''}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={20} />
                    </motion.button>
                  </form>
                </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
