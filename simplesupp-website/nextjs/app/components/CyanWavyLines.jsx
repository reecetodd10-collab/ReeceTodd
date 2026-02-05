'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * CyanWavyLines Component
 * 
 * Renders animated vertical cyan wavy lines on left and right edges of the page.
 * Includes glowing beam animation and corner gradient orbs for depth.
 * Used on Home page, News page, and other pages for consistent branding.
 */
export default function CyanWavyLines({ duration = 150 }) {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[10]">
            {/* LEFT SIDE - Static Wavy Lines with Synchronized Glowing Orbs */}
            <div className="absolute left-0 top-0 w-64 h-full">
                {/* Two static wavy lines - Thinner base lines */}
                {[0, 1].map((lineIndex) => (
                    <svg
                        key={`wave-left-${lineIndex}`}
                        className="absolute top-0 left-0 w-full h-full"
                        style={{ opacity: 0.3 }}
                        preserveAspectRatio="none"
                        viewBox="0 0 100 1000"
                    >
                        <path
                            id={`wavepath-left-${lineIndex}`}
                            d={`M ${40 + lineIndex * 20} 0 
                 Q ${-20 + lineIndex * 20} 250 ${40 + lineIndex * 20} 500 
                 Q ${100 + lineIndex * 20} 750 ${40 + lineIndex * 20} 1000`}
                            fill="none"
                            stroke="#00d9ff"
                            strokeWidth="1"
                        />
                    </svg>
                ))}

                {/* Glowing BEAMS - Sliding light effect */}
                {[0, 1].map((beamIndex) => (
                    <svg
                        key={`beam-left-${beamIndex}`}
                        className="absolute top-0 left-0 w-full h-full"
                        preserveAspectRatio="none"
                        viewBox="0 0 100 1000"
                    >
                        <defs>
                            <filter id={`glow-blur-left-${beamIndex}`} x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                        <motion.path
                            d={`M ${40 + beamIndex * 20} 0 
                 Q ${-20 + beamIndex * 20} 250 ${40 + beamIndex * 20} 500 
                 Q ${100 + beamIndex * 20} 750 ${40 + beamIndex * 20} 1000`}
                            fill="none"
                            stroke="#00d9ff"
                            strokeWidth="3"
                            strokeLinecap="round"
                            filter={`url(#glow-blur-left-${beamIndex})`}
                            initial={{ strokeDasharray: "150 1500", strokeDashoffset: 150 }}
                            animate={{
                                strokeDashoffset: [-150, -1500],
                                opacity: [0, 1, 1, 0],
                            }}
                            transition={{
                                duration: duration,
                                repeat: Infinity,
                                ease: "linear",
                                delay: 0,
                            }}
                        />
                    </svg>
                ))}

                {/* Fade to white gradient */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.7) 60%, rgba(255,255,255,1) 100%)',
                    }}
                />
            </div>

            {/* RIGHT SIDE - Static Wavy Lines with Synchronized Glowing Orbs (Mirrored) */}
            <div className="absolute right-0 top-0 w-64 h-full">
                {/* Two static wavy lines - Mirrored & Thinner */}
                {[0, 1].map((lineIndex) => (
                    <svg
                        key={`wave-right-${lineIndex}`}
                        className="absolute top-0 right-0 w-full h-full"
                        style={{ opacity: 0.3 }}
                        preserveAspectRatio="none"
                        viewBox="0 0 100 1000"
                    >
                        <path
                            id={`wavepath-right-${lineIndex}`}
                            d={`M ${60 - lineIndex * 20} 0 
                 Q ${120 - lineIndex * 20} 250 ${60 - lineIndex * 20} 500 
                 Q ${0 - lineIndex * 20} 750 ${60 - lineIndex * 20} 1000`}
                            fill="none"
                            stroke="#00d9ff"
                            strokeWidth="1"
                        />
                    </svg>
                ))}

                {/* Glowing BEAMS - Sliding light effect */}
                {[0, 1].map((beamIndex) => (
                    <svg
                        key={`beam-right-${beamIndex}`}
                        className="absolute top-0 right-0 w-full h-full"
                        preserveAspectRatio="none"
                        viewBox="0 0 100 1000"
                    >
                        <defs>
                            <filter id={`glow-blur-right-${beamIndex}`} x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                        <motion.path
                            d={`M ${60 - beamIndex * 20} 0 
                 Q ${120 - beamIndex * 20} 250 ${60 - beamIndex * 20} 500 
                 Q ${0 - beamIndex * 20} 750 ${60 - beamIndex * 20} 1000`}
                            fill="none"
                            stroke="#00d9ff"
                            strokeWidth="3"
                            strokeLinecap="round"
                            filter={`url(#glow-blur-right-${beamIndex})`}
                            initial={{ strokeDasharray: "150 1500", strokeDashoffset: 150 }}
                            animate={{
                                strokeDashoffset: [-150, -1500],
                                opacity: [0, 1, 1, 0],
                            }}
                            transition={{
                                duration: duration,
                                repeat: Infinity,
                                ease: "linear",
                                delay: 0,
                            }}
                        />
                    </svg>
                ))}

                {/* Fade to white gradient */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(to left, transparent 0%, rgba(255,255,255,0.7) 60%, rgba(255,255,255,1) 100%)',
                    }}
                />
            </div>

            {/* Corner gradient orbs - for depth */}
            <motion.div
                className="absolute -top-32 -right-32 w-80 h-80 rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(0, 217, 255, 0.08) 0%, transparent 60%)',
                }}
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                }}
            />
            <motion.div
                className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(0, 217, 255, 0.08) 0%, transparent 60%)',
                }}
                animate={{
                    scale: [1.1, 1, 1.1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                }}
            />
        </div>
    );
}