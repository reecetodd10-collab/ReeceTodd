'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';

export default function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        // Check if user has already consented
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            // Small delay before showing banner
            const timer = setTimeout(() => {
                setShowBanner(true);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'accepted');
        localStorage.setItem('cookieConsentDate', new Date().toISOString());
        setShowBanner(false);

        // Here you would initialize analytics, pixels, etc.
        // Example: initializeGoogleAnalytics();
        // Example: initializeMetaPixel();
    };

    const handleDecline = () => {
        localStorage.setItem('cookieConsent', 'declined');
        localStorage.setItem('cookieConsentDate', new Date().toISOString());
        setShowBanner(false);
    };

    return (
        <AnimatePresence>
            {showBanner && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed bottom-0 left-0 right-0 z-50 p-4"
                >
                    <div
                        className="max-w-4xl mx-auto rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-center gap-4 md:gap-6"
                        style={{
                            background: 'rgba(20, 20, 25, 0.98)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: '0 -4px 30px rgba(0, 0, 0, 0.3)',
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        {/* Icon */}
                        <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-[var(--acc)]/20 flex-shrink-0">
                            <Cookie size={20} className="text-[var(--acc)]" />
                        </div>

                        {/* Text */}
                        <div className="flex-1 text-center md:text-left">
                            <p className="text-white/90 text-sm md:text-base">
                                We use cookies to ensure you get the best experience on our website.{' '}
                                <Link href="/privacy" className="text-[var(--acc)] hover:underline">
                                    Learn more
                                </Link>
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                            <button
                                onClick={handleDecline}
                                className="px-4 py-2 text-sm text-white/60 hover:text-white/90 transition-colors"
                            >
                                Decline
                            </button>
                            <button
                                onClick={handleAccept}
                                className="px-5 py-2.5 rounded-xl font-medium text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                                style={{
                                    background: 'linear-gradient(135deg, #00d9ff, #00b8d4)',
                                    color: '#001018',
                                }}
                            >
                                Accept Cookies
                            </button>
                        </div>

                        {/* Close button (mobile) */}
                        <button
                            onClick={handleDecline}
                            className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-white/10 transition-colors md:hidden"
                            aria-label="Close"
                        >
                            <X size={16} className="text-white/50" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
