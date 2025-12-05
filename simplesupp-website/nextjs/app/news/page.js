'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Mail, Sparkles } from 'lucide-react';
import OptimizedImage from '../components/OptimizedImage';

export default function NewsPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const emailInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // Store email in localStorage for now (can be sent to backend later)
      if (typeof window !== 'undefined') {
        localStorage.setItem('aviera_news_notify_email', email);
        setSubmitted(true);
        setEmail('');
        setTimeout(() => setSubmitted(false), 3000);
      }
    }
  };

  // Handle responsive email input width
  useEffect(() => {
    const updateInputWidth = () => {
      if (emailInputRef.current && typeof window !== 'undefined') {
        if (window.innerWidth >= 640) {
          emailInputRef.current.style.minWidth = '400px';
        } else {
          emailInputRef.current.style.minWidth = '280px';
        }
      }
    };

    updateInputWidth();
    window.addEventListener('resize', updateInputWidth);
    return () => window.removeEventListener('resize', updateInputWidth);
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            filter: 'blur(20px)',
            WebkitFilter: 'blur(20px)',
            transform: 'scale(1.1)',
            opacity: 0.2
          }}
        >
          <OptimizedImage
            src="/images/hero/hero-background.jpg"
            alt="News background"
            width={1920}
            height={1080}
            className="!w-full !h-full"
            objectFit="cover"
            objectPosition="center center"
            fallbackText="News Background"
          />
        </div>
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-6">
            <div 
              className="relative transition-all duration-300 ease-in-out cursor-default"
              style={{
                width: '80px',
                height: '80px',
                background: 'rgba(30, 30, 30, 0.9)',
                border: '2px solid rgba(0, 217, 255, 0.4)',
                borderRadius: '50%',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 217, 255, 0.6), 0 4px 20px rgba(0, 0, 0, 0.3)';
                e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.8)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
                e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.4)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <Newspaper className="text-[#00d9ff]" size={40} />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-normal text-[var(--txt)] mb-6">
            Aviera News
          </h1>
          <p className="text-xl text-[var(--acc)] font-light mb-4">
            AI-Curated Fitness Industry Insights
          </p>
        </motion.div>

        {/* Coming Soon Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center transition-all duration-300"
          style={{
            background: 'rgba(30, 30, 30, 0.95)',
            border: '1px solid rgba(0, 217, 255, 0.4)',
            borderRadius: '20px',
            padding: '48px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 217, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4)';
          }}
        >
          <div className="mb-8">
            <Sparkles className="text-[var(--acc)] mx-auto mb-6" size={64} />
            <h2 className="text-3xl md:text-4xl font-normal text-[var(--txt)] mb-4">
              Coming Soon
            </h2>
            <p className="text-lg text-[var(--txt-muted)] font-light leading-relaxed max-w-2xl mx-auto mb-6">
              Get weekly AI-curated fitness and supplement news delivered to your inbox.
            </p>
            <p className="text-base text-[var(--txt-muted)] font-light">
              Stay ahead of the latest research, trends, and breakthroughs in fitness and nutrition.
            </p>
          </div>

          {/* Email Signup Form */}
          <div className="mt-10 max-w-lg mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-4">
                <input
                  ref={emailInputRef}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-1 rounded-lg text-white font-normal transition-all duration-300 w-full"
                  style={{
                    minWidth: '280px',
                    width: '100%',
                    height: '56px',
                    fontSize: '16px',
                    padding: '16px 20px',
                    background: 'rgba(30, 30, 30, 0.9)',
                    border: '1px solid rgba(0, 217, 255, 0.3)',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.7)';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseEnter={(e) => {
                    if (document.activeElement !== e.currentTarget) {
                      e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.5)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (document.activeElement !== e.currentTarget) {
                      e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
                    }
                  }}
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[var(--acc)] to-[#00b8d4] text-[#001018] rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap"
                  style={{
                    height: '56px',
                    boxShadow: '0 4px 12px rgba(0, 217, 255, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #00f0ff 0%, #00d9ff 100%)';
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 217, 255, 0.6), 0 4px 12px rgba(0, 217, 255, 0.3)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, var(--acc) 0%, #00b8d4 100%)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 217, 255, 0.3)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <Mail size={18} />
                  {submitted ? 'Subscribed!' : 'Notify Me When We Launch'}
                </button>
              </div>
              {submitted && (
                <p className="mt-4 text-sm text-[var(--acc)] font-light">
                  Thanks! We'll notify you when Aviera News launches.
                </p>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

