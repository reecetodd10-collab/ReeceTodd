'use client';

import React, { useState, useEffect } from 'react';
import { X, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * PromoBanner Component
 *
 * Dismissible promotional banner offering 10% off first purchase.
 * Appears at top of page above navigation.
 * Stores dismiss state in localStorage to prevent repeated showing.
 */
export default function PromoBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Check if user previously dismissed banner (client-side only)
    if (typeof window !== 'undefined') {
      setIsVisible(!localStorage.getItem('promoBannerDismissed'));
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('promoBannerDismissed', 'true');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // TODO: Connect to backend email capture API
      console.log('Email captured:', email);
      setIsSubmitted(true);

      // Show success message then dismiss after 3 seconds
      setTimeout(() => {
        handleDismiss();
      }, 3000);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="glass-dark text-[var(--txt)] overflow-hidden border-b border-[var(--border)]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between gap-4">
              {!isSubmitted ? (
                <>
                  {/* Desktop Layout */}
                  <div className="hidden md:flex items-center gap-4 flex-1">
                    <div className="flex items-center gap-2">
                      <Mail size={20} className="flex-shrink-0" />
                      <span className="font-semibold text-sm lg:text-base">
                        Get 10% off your first purchase!
                      </span>
                    </div>

                    <form onSubmit={handleSubmit} className="flex items-center gap-2 flex-1 max-w-md">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="flex-1 px-4 py-2 rounded-lg text-[#001018] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                      />
                      <button
                        type="submit"
                        className="btn-primary text-sm whitespace-nowrap"
                      >
                        Get Discount
                      </button>
                    </form>
                  </div>

                  {/* Mobile Layout */}
                  <div className="flex md:hidden flex-col gap-2 flex-1">
                    <div className="flex items-center gap-2">
                      <Mail size={18} />
                      <span className="font-semibold text-sm">
                        Get 10% off your first purchase!
                      </span>
                    </div>
                    <form onSubmit={handleSubmit} className="flex items-center gap-2">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="flex-1 px-3 py-1.5 rounded-lg text-[#001018] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                      />
                      <button
                        type="submit"
                        className="btn-primary text-sm"
                      >
                        Get Code
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center flex-1 py-1">
                  <span className="font-semibold text-sm lg:text-base">
                    🎉 Success! Check your email for your 10% discount code.
                  </span>
                </div>
              )}

              {/* Dismiss Button */}
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 p-1 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Dismiss banner"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

