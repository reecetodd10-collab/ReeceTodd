'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, ShoppingCart, Flame, Brain, Dumbbell, Moon, Sparkles, Zap, Heart, Activity } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { fetchShopifyProducts } from '../lib/shopify';

// Aviera "A" Logo - matches site header branding
const AvieraLogo = ({ size = 24, className = '' }) => {
  const strokeWidth = size > 20 ? 2.5 : 2;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M 8 36 L 8 20 L 20 4"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 32 36 L 32 20 L 20 4"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// Proactive suggestions matching Aviera Stack categories
const PROACTIVE_SUGGESTIONS = [
  {
    goal: 'Build Muscle & Strength',
    subtitle: 'Pack on size, max strength',
    icon: Dumbbell,
    supplement: 'Creatine Monohydrate',
    price: 29.99,
    description: 'Proven strength and muscle builder'
  },
  {
    goal: 'Lose Fat & Get Lean',
    subtitle: 'Shed pounds, get defined',
    icon: Flame,
    supplement: 'Fat Burner with MCT',
    price: 34.99,
    description: 'Thermogenic metabolism booster'
  },
  {
    goal: 'Focus & Productivity',
    subtitle: 'Mental clarity, crush work',
    icon: Brain,
    supplement: 'Nootropic Complex',
    price: 39.99,
    description: 'Enhanced cognitive performance'
  },
  {
    goal: 'Sleep & Recovery',
    subtitle: 'Deep rest, repair, recharge',
    icon: Moon,
    supplement: 'Sleep Formula',
    price: 32.99,
    description: 'Restorative sleep support'
  },
  {
    goal: 'Athletic Performance',
    subtitle: 'Speed, endurance, power',
    icon: Zap,
    supplement: 'Pre-Workout',
    price: 36.99,
    description: 'Explosive energy and focus'
  },
  {
    goal: 'Beauty & Anti-Aging',
    subtitle: 'Glowing skin, strong hair',
    icon: Sparkles,
    supplement: 'Collagen Peptides',
    price: 34.99,
    description: 'Skin, hair and nail support'
  }
];

export default function AvieraAIWidget() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [shopifyProducts, setShopifyProducts] = useState([]);
  const chatContainerRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const pathname = usePathname();

  // Don't show on landing page
  if (pathname === '/landing') return null;

  // Fetch Shopify products for images
  useEffect(() => {
    fetchShopifyProducts()
      .then((products) => setShopifyProducts(products))
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  // Get product image from Shopify
  const getProductImage = (supplementName) => {
    if (!shopifyProducts.length) return null;
    const product = shopifyProducts.find(p =>
      p.title.toLowerCase().includes(supplementName.toLowerCase().split(' ')[0]) ||
      supplementName.toLowerCase().includes(p.title.toLowerCase().split(' ')[0])
    );
    return product?.images?.[0] || product?.image || null;
  };

  // Add to cart function
  const addToCart = (supplementName, price) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('aviera:add-to-cart', {
        detail: { name: supplementName, price }
      }));
    }
    setChatMessages(prev => [...prev, {
      role: 'assistant',
      content: `${supplementName} has been added to your cart.`
    }]);
    setHoveredProduct(null);
  };

  // Handle hover with proper cleanup
  const handleMouseEnter = (supplement) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setHoveredProduct(supplement);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredProduct(null);
    }, 150);
  };

  // Auto-scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, isChatLoading]);

  // Send message to AI
  const sendChatMessage = async (message) => {
    if (!message.trim()) return;

    const newMessages = [...chatMessages, { role: 'user', content: message }];
    setChatMessages(newMessages);
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/ai/quiz-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          conversationHistory: newMessages,
          userContext: { currentPage: pathname }
        }),
      });

      const data = await response.json();

      if (data.success && data.response) {
        setChatMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        setChatMessages(prev => [...prev, {
          role: 'assistant',
          content: "I can help with supplement recommendations, dosing, and timing. What would you like to know?"
        }]);
      }
    } catch (error) {
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: "I can help with supplement questions. Feel free to ask about any of our products or check out our Aviera Stacks."
      }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Product hover card - positioned below card
  const ProductHoverCard = ({ supplement, price, description }) => {
    const productImage = getProductImage(supplement);
    const productSlug = supplement.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    return (
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.15 }}
        className="absolute top-full left-0 right-0 mt-1 z-[200] pointer-events-auto"
        onMouseEnter={() => handleMouseEnter(supplement)}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="p-3 rounded-xl mx-1"
          style={{
            background: 'rgba(12, 12, 12, 0.98)',
            border: '1px solid #00D9FF',

          }}
        >
          <div className="flex gap-3">
            {productImage && (
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/5 flex items-center justify-center flex-shrink-0">
                <img
                  src={productImage}
                  alt={supplement}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold mb-0.5 truncate">{supplement}</p>
              <p className="text-gray-500 text-[10px] mb-1 line-clamp-2">{description}</p>
              <p className="text-[#00d9ff] text-sm font-bold">${price.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <Link
              href={`/shop?product=${productSlug}`}
              className="flex-1 py-2 rounded-lg text-[11px] font-semibold text-center transition-all duration-200 border border-[rgba(255,255,255,0.15)] text-gray-300 hover:border-[#00d9ff] hover:text-[#00d9ff]"
            >
              View Details
            </Link>
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                addToCart(supplement, price);
              }}

            >
              <ShoppingCart size={12} />
              Add to Cart
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      {/* Floating Button - positioned to not conflict with mobile cart */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        className="fixed bottom-6 left-6 z-[100] flex flex-col items-center lg:left-auto lg:right-6"
      >
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-14 h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center relative"
          style={{
            background: 'rgba(0, 0, 0, 0.9)',
            border: '2px solid #00D9FF',
            boxShadow: '0 0 20px rgba(0, 217, 255, 0.5), 0 4px 15px rgba(0, 0, 0, 0.3)',
            cursor: 'pointer',
          }}
        >
          {isChatOpen ? (
            <X size={28} className="text-[#00D9FF]" />
          ) : (
            <AvieraLogo size={28} className="text-[#00D9FF]" />
          )}
        </button>
        {!isChatOpen && (
          <span
            className="mt-2 text-[10px] lg:text-[11px] font-bold tracking-wider px-2 py-1 rounded-full"
            style={{
              color: '#ffffff',
              background: 'rgba(0, 217, 255, 0.9)',
              boxShadow: '0 0 10px rgba(0, 217, 255, 0.5)'
            }}
          >
            AI
          </span>
        )}
      </motion.div>

      {/* Chat Panel */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 left-4 right-4 z-[99] lg:left-auto lg:right-6 lg:w-[380px] rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(12, 12, 12, 0.98)',
              border: '1px solid #00D9FF',
              maxWidth: '100%',
            }}
          >
            {/* Prominent Close Button - Always visible */}
            <button
              onClick={() => setIsChatOpen(false)}
              className="absolute top-2 right-2 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200"
              style={{
                background: '#00D9FF',
                border: '3px solid #ffffff',
                boxShadow: '0 0 20px rgba(0, 217, 255, 0.6), 0 4px 10px rgba(0,0,0,0.3)',
              }}
              aria-label="Close chat"
            >
              <X size={24} className="text-[#001018]" strokeWidth={3} />
            </button>

            {/* Header */}
            <div
              className="px-4 py-3 border-b border-[rgba(255,255,255,0.08)]"
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
              }}
            >
              <div className="flex items-center gap-3 pr-12">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    background: '#000000ff',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                  }}
                >
                  <AvieraLogo size={16} className="text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold text-sm">Aviera AI</h4>
                  <p className="text-[10px] text-gray-500">Your Personal Fitness Expert</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div ref={chatContainerRef} className="p-4 max-h-[400px] overflow-y-auto">
              {/* Welcome State */}
              {chatMessages.length === 0 && (
                <div>
                  <p className="text-white text-sm font-medium mb-1">
                    What are you looking to achieve?
                  </p>
                  <p className="text-gray-500 text-xs mb-4">
                    Select a goal or ask me anything about supplements.
                  </p>

                  {/* Suggestions Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    {PROACTIVE_SUGGESTIONS.map((item, idx) => {
                      const Icon = item.icon;
                      const isHovered = hoveredProduct === item.supplement;

                      return (
                        <div
                          key={idx}
                          className="relative"
                          onMouseEnter={() => handleMouseEnter(item.supplement)}
                          onMouseLeave={handleMouseLeave}
                        >
                          <button
                            onClick={() => sendChatMessage(`Tell me about ${item.supplement} for ${item.goal}`)}
                            className="w-full p-2.5 rounded-xl text-left transition-all duration-200"
                            style={{
                              background: isHovered ? '#00D9FF' : 'rgba(255, 255, 255, 0.02)',
                              border: isHovered ? '1px solid #00D9FF' : '1px solid rgba(255, 255, 255, 0.06)',
                            }}
                          >
                            <div className="flex items-start gap-2">
                              <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{
                                  background: 'rgba(0, 0, 0, 0.4)',
                                  border: '1px solid #00D9FF',
                                }}
                              >
                                <Icon size={14} className="text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white text-[11px] font-medium leading-tight truncate">{item.goal}</p>
                                <p className="text-gray-600 text-[9px] truncate">{item.subtitle}</p>
                              </div>
                            </div>
                            <p className="text-[#00d9ff] text-[10px] font-medium mt-1.5 truncate">
                              {item.supplement}
                            </p>
                          </button>

                          {/* Hover Card */}
                          <AnimatePresence>
                            {isHovered && (
                              <ProductHoverCard
                                supplement={item.supplement}
                                price={item.price}
                                description={item.description}
                              />
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>

                  {/* Shop Link */}
                  <Link
                    href="/shop"
                    className="block w-full mt-4 py-2 text-center text-[11px] text-gray-500 hover:text-[#00d9ff] transition-colors"
                  >
                    Browse all supplements
                  </Link>
                </div>
              )}

              {/* Messages */}
              {chatMessages.length > 0 && (
                <div className="space-y-3">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`rounded-xl text-sm ${msg.role === 'user'
                        ? 'p-3 bg-[#00D9FF] border border-[#00D9FF] text-white ml-6'
                        : 'p-3 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] text-gray-300 mr-4'
                        }`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="flex items-center gap-1.5 mb-2">
                          <AvieraLogo size={10} className="text-[#00d9ff]" />
                          <span className="text-[9px] text-[#00d9ff] font-medium uppercase tracking-wider">Aviera AI</span>
                        </div>
                      )}
                      <div className="whitespace-pre-wrap text-[13px] leading-relaxed">
                        {msg.content}
                      </div>
                    </div>
                  ))}

                  {isChatLoading && (
                    <div className="p-3 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] mr-4">
                      <div className="flex items-center gap-1.5 mb-2">
                        <AvieraLogo size={10} className="text-[#00d9ff]" />
                        <span className="text-[9px] text-[#00d9ff] font-medium uppercase tracking-wider">Aviera AI</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-[#00d9ff] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1.5 h-1.5 bg-[#00d9ff] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-1.5 h-1.5 bg-[#00d9ff] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setChatMessages([])}
                    className="text-[10px] text-gray-600 hover:text-gray-400 transition-colors"
                  >
                    Clear conversation
                  </button>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-[rgba(255,255,255,0.06)]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && chatInput.trim() && !isChatLoading) {
                      const message = chatInput.trim();
                      setChatInput('');
                      sendChatMessage(message);
                    }
                  }}
                  disabled={isChatLoading}
                  placeholder="Ask me anything..."
                  className="flex-1 px-3 py-2.5 rounded-xl text-sm text-white placeholder-gray-600 transition-all duration-200 disabled:opacity-50 outline-none"
                  style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#00D9FF';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  }}
                />
                <button
                  onClick={() => {
                    if (chatInput.trim() && !isChatLoading) {
                      const message = chatInput.trim();
                      setChatInput('');
                      sendChatMessage(message);
                    }
                  }}
                  disabled={isChatLoading || !chatInput.trim()}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-40"
                  style={{
                    background: chatInput.trim() ? '#00d9ff' : '#00D9FF',
                  }}
                >
                  <Send size={16} className={chatInput.trim() ? 'text-[#001018]' : 'text-[#00d9ff]'} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
