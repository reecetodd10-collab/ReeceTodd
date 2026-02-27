'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Check, ArrowRight } from 'lucide-react';

const STORAGE_KEY = 'optimization_popup_dismissed';

// Only show on these paths
const ALLOWED_PATHS = ['/', '/shop'];

export default function OptimizationScorePopup() {
    const [isVisible, setIsVisible] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        // Don't show if not on an allowed page
        if (!ALLOWED_PATHS.includes(pathname)) return;

        // Don't show if already dismissed
        if (typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY)) return;

        // Show after 3-second delay
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 3000);

        return () => clearTimeout(timer);
    }, [pathname]);

    const handleDismiss = () => {
        setIsVisible(false);
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, 'true');
        }
    };

    const handleStart = () => {
        handleDismiss();
        router.push('/supplement-optimization-score');
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    key="optimization-popup"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4"
                    style={{
                        background: 'rgba(0, 0, 0, 0.75)',
                        backdropFilter: 'blur(8px)',
                    }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) handleDismiss();
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="relative w-full max-w-md rounded-2xl overflow-hidden"
                        style={{
                            background: 'rgba(15, 15, 20, 0.98)',
                            border: '1px solid rgba(0, 217, 255, 0.25)',
                            boxShadow: '0 0 60px rgba(0, 217, 255, 0.15), 0 25px 50px rgba(0, 0, 0, 0.5)',
                        }}
                    >
                        {/* Close button */}
                        <button
                            onClick={handleDismiss}
                            className="absolute top-4 right-4 text-[var(--txt-muted)] hover:text-[var(--txt)] transition z-10"
                            aria-label="Close"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-8">
                            {/* Icon */}
                            <div className="flex justify-center mb-6">
                                <div
                                    className="w-14 h-14 rounded-full flex items-center justify-center"
                                    style={{
                                        background: 'rgba(0, 217, 255, 0.1)',
                                        border: '1px solid rgba(0, 217, 255, 0.3)',
                                        boxShadow: '0 0 20px rgba(0, 217, 255, 0.2)',
                                    }}
                                >
                                    <Sparkles size={24} className="text-[#00d9ff]" />
                                </div>
                            </div>

                            {/* Title */}
                            <h2 className="text-2xl font-bold text-[var(--txt)] text-center mb-2">
                                Get Your Optimization Score
                            </h2>
                            <p className="text-[var(--txt-muted)] text-center text-sm mb-6">
                                Find out how your recovery and performance compare to the average.
                            </p>

                            {/* Bullet points */}
                            <div className="space-y-3 mb-8">
                                {[
                                    '60-second performance diagnostic',
                                    'See your biggest bottleneck',
                                    'Get personalized supplement recommendations',
                                ].map((item) => (
                                    <div key={item} className="flex items-center gap-3">
                                        <div
                                            className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                                            style={{
                                                background: 'rgba(0, 217, 255, 0.15)',
                                                border: '1px solid rgba(0, 217, 255, 0.3)',
                                            }}
                                        >
                                            <Check size={12} className="text-[#00d9ff]" />
                                        </div>
                                        <span className="text-[var(--txt)] text-sm">{item}</span>
                                    </div>
                                ))}
                            </div>

                            {/* CTAs */}
                            <button
                                onClick={handleStart}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-base transition-all duration-300"
                                style={{
                                    background: 'linear-gradient(135deg, #00d9ff, #00b8d4)',
                                    color: '#001018',
                                    boxShadow: '0 0 25px rgba(0, 217, 255, 0.4)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 217, 255, 0.6)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 217, 255, 0.4)';
                                }}
                            >
                                Start My Score
                                <ArrowRight size={18} />
                            </button>

                            <button
                                onClick={handleDismiss}
                                className="w-full mt-3 px-6 py-2.5 rounded-xl text-sm text-[var(--txt-muted)] hover:text-[var(--txt)] transition"
                            >
                                Maybe later
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
