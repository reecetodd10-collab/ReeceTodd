'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import OptimizedImage from '../components/OptimizedImage';
import WaitlistModal from '../components/WaitlistModal';

// Cyan color constant
const CYAN = '#00D9FF';
const CYAN_RGBA_03 = 'rgba(0, 217, 255, 0.3)';
const CYAN_RGBA_04 = 'rgba(0, 217, 255, 0.4)';
const CYAN_RGBA_05 = 'rgba(0, 217, 255, 0.5)';
const CYAN_RGBA_06 = 'rgba(0, 217, 255, 0.6)';
const CYAN_RGBA_07 = 'rgba(0, 217, 255, 0.7)';

export default function LandingPage() {

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setStatus({ type: null, message: '' });
    
    // Get email from form
    const formData = new FormData(e.target);
    const emailValue = formData.get('email') || email;
    
    // Simple validation
    if (!emailValue || !emailValue.trim()) {
      setStatus({ type: 'error', message: 'Please enter your email' });
      return;
    }
    
    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      setStatus({ type: 'error', message: 'Please enter a valid email' });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailValue.trim() })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus({ type: 'success', message: 'Thank you! We\'ll notify you when we launch.' });
        setEmail('');
        e.target.reset();
      } else {
        setStatus({ type: 'error', message: data.error || 'Something went wrong. Please try again.' });
      }
    } catch (err) {
      console.error('Submit error:', err);
      setStatus({ type: 'error', message: 'Failed to submit. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden relative">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <OptimizedImage
          src="/images/hero/hero-background.jpg"
          alt="Avierafit background"
          width={1920}
          height={1080}
          className="!w-full !h-full object-cover"
          objectFit="cover"
          objectPosition="center center"
          fallbackText="Avierafit Background"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
      </div>

      {/* Content - Centered */}
      <div className="relative z-10 h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl text-center flex flex-col items-center"
        >
          {/* LAUNCHING SOON - At the very top */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-block mb-8"
          >
            <div 
              className="relative px-8 py-4 bg-[rgba(30,30,30,0.9)] rounded-2xl border border-[#00D9FF]/30"
              style={{ 
                boxShadow: '0 0 30px rgba(0, 217, 255, 0.3)'
              }}
            >
              <span 
                className="text-white uppercase font-light tracking-[0.3em]"
                style={{ 
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '13px',
                  fontWeight: 300
                }}
              >
                Launching Soon
              </span>
            </div>
          </motion.div>

          {/* Logo - Icon only, no text */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative group cursor-pointer mb-8">
              {/* Subtle glow effect with hover */}
              <div 
                className="absolute inset-0 rounded-2xl blur-xl group-hover:bg-[#00D9FF]/40 transition-all duration-300"
                style={{ background: `${CYAN}20` }}
              ></div>
              {/* Logo icon only - no text */}
              <div 
                className="relative w-20 h-20 bg-[rgba(30,30,30,0.9)] rounded-2xl flex items-center justify-center border border-[#00D9FF]/30 group-hover:border-[#00D9FF]/60 transition-all duration-300"
                style={{ boxShadow: '0 0 20px rgba(0, 217, 255, 0.3)' }}
              >
                <svg
                  width={40}
                  height={40}
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M 8 36 L 8 20 L 20 4"
                    stroke="white"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M 32 36 L 32 20 L 20 4"
                    stroke="white"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* AVIERAFIT Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-sm md:text-base font-light uppercase text-white mb-8 opacity-90"
            style={{
              letterSpacing: '0.35em',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 300,
            }}
          >
            AVIERAFIT
          </motion.h1>

          {/* STOP GUESSING. START PROGRESSING. Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-[10px] md:text-xs font-light uppercase leading-tight text-white mb-12 opacity-90"
            style={{
              letterSpacing: '0.18em',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 300,
            }}
          >
            STOP GUESSING. START PROGRESSING.
          </motion.p>

          {/* Email Capture Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            onSubmit={handleSubmit}
            className="max-w-md mx-auto mb-8"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={isSubmitting}
                className="flex-1 px-6 py-4 rounded-lg text-white font-light transition-all duration-300 text-base"
                style={{
                  background: 'rgba(30, 30, 30, 0.9)',
                  border: `1px solid ${CYAN_RGBA_03}`,
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 300,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = CYAN_RGBA_07;
                  e.currentTarget.style.boxShadow = `0 0 20px ${CYAN_RGBA_04}`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = CYAN_RGBA_03;
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-4 rounded-lg font-light text-white transition-all duration-300 whitespace-nowrap"
                style={{
                  background: 'rgba(30, 30, 30, 0.9)',
                  border: `2px solid ${CYAN_RGBA_04}`,
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 300,
                  boxShadow: '0 0 20px rgba(0, 217, 255, 0.4)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.boxShadow = '0 0 40px rgba(0, 217, 255, 0.7)';
                    e.currentTarget.style.borderColor = CYAN_RGBA_07;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.4)';
                  e.currentTarget.style.borderColor = CYAN_RGBA_04;
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Notify Me'}
              </button>
            </div>

            {/* Status Message */}
            {status.type && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 text-sm font-light ${
                  status.type === 'success' ? '' : 'text-red-400'
                }`}
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 300,
                  color: status.type === 'success' ? CYAN : undefined,
                }}
              >
                {status.message}
              </motion.p>
            )}
          </motion.form>

          {/* AVIERA PRO Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            onClick={() => setShowWaitlistModal(true)}
            className="px-6 py-3 rounded-lg font-light text-white transition-all duration-300 cursor-pointer mb-8"
            style={{
              background: 'rgba(30, 30, 30, 0.9)',
              border: `2px solid ${CYAN_RGBA_04}`,
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 300,
              letterSpacing: '2px',
              boxShadow: '0 0 20px rgba(0, 217, 255, 0.4)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 40px rgba(0, 217, 255, 0.7)';
              e.currentTarget.style.borderColor = CYAN_RGBA_07;
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.4)';
              e.currentTarget.style.borderColor = CYAN_RGBA_04;
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            AVIERA PRO
          </motion.button>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-sm font-light text-gray-400"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 300,
            }}
          >
            Questions? Email us at{' '}
            <a
              href="mailto:info@avierafit.com"
              className="transition-colors"
              style={{
                color: CYAN,
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#00b8d4';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = CYAN;
              }}
            >
              info@avierafit.com
            </a>
          </motion.p>
        </motion.div>
      </div>

      {/* Waitlist Modal */}
      <WaitlistModal 
        isOpen={showWaitlistModal} 
        onClose={() => setShowWaitlistModal(false)} 
      />
    </div>
  );
}
