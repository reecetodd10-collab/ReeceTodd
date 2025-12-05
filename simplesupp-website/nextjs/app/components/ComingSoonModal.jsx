'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Crown, X, ArrowLeft } from 'lucide-react';

export default function ComingSoonModal({ 
  isOpen, 
  onClose, 
  title = 'Aviera Pro',
  featureName = 'This Feature'
}) {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleBackToHome = () => {
    if (onClose) onClose();
    router.push('/');
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('aviera_pro_notify_email', email);
      alert('Thanks! We\'ll notify you when Aviera Pro launches.');
      setEmail('');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm"
        style={{ pointerEvents: 'all' }}
        onClick={(e) => {
          // Prevent closing by clicking outside - modal cannot be bypassed
          e.stopPropagation();
        }}
      >
        {/* Testing Mode Indicator - Top Right (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed top-4 right-4 z-[10000] px-3 py-1.5 bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-lg text-xs font-semibold text-yellow-400 flex items-center gap-1.5 shadow-lg">
            <span>⚠️</span>
            Testing Mode
          </div>
        )}

        {/* Coming Soon Modal */}
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Card */}
            <div 
              className="rounded-2xl p-8 md:p-12"
              style={{
                background: 'rgba(30, 30, 30, 0.95)',
                border: '2px solid rgba(0, 217, 255, 0.5)',
                boxShadow: '0 0 50px rgba(0, 217, 255, 0.3), 0 8px 32px rgba(0, 0, 0, 0.5)',
              }}
            >
              {/* Close button */}
              <button
                onClick={handleBackToHome}
                className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[var(--bg-elev-1)] transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-8">
                <Crown className="text-[#00d9ff] mx-auto mb-6" size={64} />
                <h1 className="text-4xl md:text-5xl font-normal text-white mb-4">
                  {title}
                </h1>
                <h2 className="text-2xl md:text-3xl font-light text-[#00d9ff] mb-6">
                  Coming Soon
                </h2>
                <p className="text-lg text-gray-300 font-light leading-relaxed max-w-xl mx-auto">
                  {featureName} is currently under development. Premium features launching soon!
                </p>
              </div>

              {/* Email Signup Form */}
              <div className="mt-10 mb-6">
                <form 
                  onSubmit={handleEmailSubmit}
                  className="max-w-md mx-auto"
                >
                  <div className="flex gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="flex-1 px-4 py-3 rounded-lg text-white font-light transition-all duration-300"
                      style={{
                        background: 'rgba(30, 30, 30, 0.9)',
                        border: '1px solid rgba(0, 217, 255, 0.3)',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.7)';
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.4)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-[var(--acc)] to-[#00b8d4] text-[#001018] rounded-lg font-semibold hover:from-[#00f0ff] hover:to-[var(--acc)] transition-all duration-300"
                      style={{
                        boxShadow: '0 0 20px rgba(0, 217, 255, 0.4)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 217, 255, 0.6)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.4)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      Notify Me
                    </button>
                  </div>
                </form>
              </div>

              {/* Back to Home Button */}
              <button
                onClick={handleBackToHome}
                className="w-full max-w-md mx-auto py-3 px-6 rounded-lg font-medium text-white transition-all duration-300 flex items-center justify-center gap-2"
                style={{
                  background: 'rgba(30, 30, 30, 0.9)',
                  border: '2px solid rgba(0, 217, 255, 0.4)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 217, 255, 0.5)';
                  e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.7)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.4)';
                }}
              >
                <ArrowLeft size={18} />
                Back to Home
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}

