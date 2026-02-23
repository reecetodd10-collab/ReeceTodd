'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, ArrowRight } from 'lucide-react';

export default function NitricPopup() {
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        // Check if user has dismissed the popup before
        const dismissed = localStorage.getItem('nitricPopupDismissed');
        const dismissedTime = localStorage.getItem('nitricPopupDismissedTime');

        // Reset after 24 hours
        if (dismissed && dismissedTime) {
            const hoursSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60);
            if (hoursSinceDismissed > 24) {
                localStorage.removeItem('nitricPopupDismissed');
                localStorage.removeItem('nitricPopupDismissedTime');
            } else {
                setIsDismissed(true);
                return;
            }
        }

        // Show popup after 5 seconds of page load
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        setIsDismissed(true);
        localStorage.setItem('nitricPopupDismissed', 'true');
        localStorage.setItem('nitricPopupDismissedTime', Date.now().toString());
    };

    if (isDismissed) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ x: 400, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 400, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed right-4 bottom-24 z-50 w-[320px]"
                >
                    {/* Glowing border effect */}
                    <div
                        className="absolute -inset-[2px] rounded-2xl opacity-75"
                        style={{
                            background: 'linear-gradient(135deg, #ff4d4d, #ff6b35, #ff4d4d, #ff6b35)',
                            backgroundSize: '300% 300%',
                            animation: 'nitricShimmer 3s ease infinite',
                            filter: 'blur(4px)',
                        }}
                    />

                    {/* Main card */}
                    <div
                        className="relative rounded-2xl overflow-hidden"
                        style={{
                            background: 'linear-gradient(135deg, rgba(20, 10, 10, 0.98), rgba(30, 15, 15, 0.98))',
                            border: '1px solid rgba(255, 77, 77, 0.3)',
                        }}
                    >
                        {/* Close button */}
                        <button
                            onClick={handleDismiss}
                            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
                            aria-label="Close popup"
                        >
                            <X size={14} className="text-white/70" />
                        </button>

                        {/* Animated background gradient */}
                        <div
                            className="absolute inset-0 opacity-30"
                            style={{
                                background: 'radial-gradient(circle at 80% 20%, rgba(255, 77, 77, 0.4), transparent 50%)',
                            }}
                        />

                        {/* Content */}
                        <div className="relative p-5">
                            {/* Badge */}
                            <div className="flex items-center gap-2 mb-3">
                                <div
                                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(255, 77, 77, 0.3), rgba(255, 107, 53, 0.3))',
                                        border: '1px solid rgba(255, 77, 77, 0.4)',
                                        color: '#ff6b35',
                                    }}
                                >
                                    <Zap size={12} className="animate-pulse" />
                                    PUMP FORMULA
                                </div>
                            </div>

                            {/* Headline */}
                            <h3
                                className="text-xl font-bold mb-2 leading-tight"
                                style={{
                                    background: 'linear-gradient(135deg, #ffffff, #ff6b35)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Stop training flat.
                            </h3>

                            {/* Subtext */}
                            <p className="text-white/70 text-sm mb-4 leading-relaxed">
                                Unlock insane pumps and better blood flow with Nitric Oxide support. No stims. Just results.
                            </p>

                            {/* Benefits mini list */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {['Vascularity', 'Endurance', 'Blood Flow'].map((benefit) => (
                                    <span
                                        key={benefit}
                                        className="text-xs px-2 py-1 rounded-md"
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            color: 'rgba(255, 255, 255, 0.6)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                        }}
                                    >
                                        {benefit}
                                    </span>
                                ))}
                            </div>

                            {/* CTA Button */}
                            <Link
                                href="/nitric"
                                onClick={handleDismiss}
                                className="group flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                style={{
                                    background: 'linear-gradient(135deg, #ff4d4d, #ff6b35)',
                                    color: '#fff',
                                    boxShadow: '0 0 25px rgba(255, 77, 77, 0.4)',
                                }}
                            >
                                Unlock My Pump
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>

                            {/* Small link */}
                            <Link
                                href="/nitric"
                                onClick={handleDismiss}
                                className="block text-center text-xs text-white/40 hover:text-white/60 mt-3 transition-colors"
                            >
                                Learn more about Nitric Oxide
                            </Link>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Keyframe animation */}
            <style jsx global>{`
                @keyframes nitricShimmer {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `}</style>
        </AnimatePresence>
    );
}
