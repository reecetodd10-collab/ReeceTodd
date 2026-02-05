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
  const [isLoading, setIsLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [error, setError] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || isLoading) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/promo/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'promo_banner' }),
      });

      const data = await response.json();

      if (data.success) {
        setDiscountCode(data.discountCode);
        setIsSubmitted(true);

        // Dismiss after 5 seconds (longer to see code)
        setTimeout(() => {
          handleDismiss();
        }, 5000);
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      console.error('Promo subscribe error:', err);
      setError('Failed to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
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
                        disabled={isLoading}
                        className="btn-primary text-sm whitespace-nowrap disabled:opacity-50"
                      >
                        {isLoading ? 'Saving...' : 'Get Discount'}
                      </button>
                    </form>
                    {error && <span className="text-red-400 text-xs">{error}</span>}
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
                        disabled={isLoading}
                        className="btn-primary text-sm disabled:opacity-50"
                      >
                        {isLoading ? '...' : 'Get Code'}
                      </button>
                    </form>
                    {error && <span className="text-red-400 text-xs">{error}</span>}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center flex-1 py-1 gap-2">
                  <span className="font-semibold text-sm lg:text-base">
                    Your 10% code: <span className="bg-white/20 px-2 py-1 rounded font-mono">{discountCode}</span>
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

