'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Heart, Target, ArrowRight, TrendingUp, Globe, Sparkles, DoorOpen, Flag } from 'lucide-react';
import OptimizedImage from '../components/OptimizedImage';

export default function About() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] py-16 relative overflow-hidden">

            {/* Side Background Image */}
            <div
                className="absolute top-0 right-0 h-full w-1/3 md:w-1/4 z-0 pointer-events-none opacity-40 mix-blend-overlay"
                style={{
                    maskImage: 'linear-gradient(to right, transparent, black)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent, black)'
                }}
            >
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: 'url(/images/about/about-background.jpg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                {/* Interaction with lines overlay */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(to right, #0a0a0a 0%, transparent 100%)',
                    }}
                />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Our Mission */}
                <div className="mb-24">
                    <div className="text-center mb-12">
                        {/* Standalone Flag Icon Box */}
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                {/* Subtle glow effect */}
                                <div className="absolute inset-0 bg-[var(--acc)]/20 rounded-3xl blur-2xl"></div>
                                {/* Icon container */}
                                <div className="relative w-28 h-28 bg-[var(--charcoal-light)] rounded-3xl flex items-center justify-center shadow-premium-lg border border-[var(--border)] icon-aivra">
                                    <Flag className="text-white" size={56} strokeWidth={1.5} />
                                </div>
                            </div>
                        </div>
                        <div
                            className="inline-block px-8 py-6 rounded-2xl mb-6 relative transition-all duration-300 ease cursor-default"
                            style={{
                                background: 'rgba(20, 20, 20, 0.9)',
                                boxShadow: '0 0 20px rgba(0, 217, 255, 0.25)',
                                border: '1px solid rgba(0, 217, 255, 0.3)',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 217, 255, 0.5)';
                                e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.6)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.25)';
                                e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            <h2 className="text-4xl md:text-6xl font-normal text-[var(--txt)] tracking-tight">
                                Our Mission
                            </h2>
                        </div>
                    </div>
                    <div
                        className="rounded-3xl p-10 md:p-16 relative overflow-hidden transition-all duration-300 ease"
                        style={{
                            background: 'rgba(20, 20, 20, 0.9)',
                            boxShadow: '0 0 20px rgba(0, 217, 255, 0.25)',
                            border: '1px solid rgba(0, 217, 255, 0.3)',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 217, 255, 0.5)';
                            e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.6)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.25)';
                            e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--acc)] to-transparent opacity-50"></div>
                        <p className="text-2xl md:text-3xl text-[var(--txt)] font-light leading-relaxed italic border-l-4 border-[var(--acc)] pl-8 md:pl-12">
                            "We believe everyone deserves access to a healthy lifestyle. Health is wealth. The foundation upon which every aspect of life is built. A happy life is always built on top of a healthy, confident body. Aviera exists to help you build that foundation and discover your best self."
                        </p>
                    </div>
                </div>

                {/* Hero Header */}
                <div className="text-center mb-16">
                    <div
                        className="inline-block px-8 py-6 rounded-2xl mb-6 relative transition-all duration-300 ease cursor-default"
                        style={{
                            background: 'rgba(20, 20, 20, 0.9)',
                            boxShadow: '0 0 20px rgba(0, 217, 255, 0.25)',
                            border: '1px solid rgba(0, 217, 255, 0.3)',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 217, 255, 0.5)';
                            e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.6)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.25)';
                            e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <h1 className="text-4xl md:text-6xl font-normal text-[var(--txt)] tracking-tight">
                            Why I Built Aviera
                        </h1>
                    </div>
                </div>

                {/* Story Section with Image on Left */}
                <div className="grid lg:grid-cols-5 gap-12 items-start lg:items-center mb-24">
                    {/* Photo Column (40%) */}
                    <div className="lg:col-span-2 flex justify-center lg:justify-start">
                        <div
                            className="relative w-full max-w-md mx-auto lg:mx-0 transition-all duration-300 ease-in-out rounded-2xl overflow-hidden"
                            style={{
                                boxShadow: '0 0 30px rgba(0, 217, 255, 0.2), 0 0 60px rgba(0, 217, 255, 0.1)',
                                border: '1px solid rgba(0, 217, 255, 0.1)',
                            }}
                        >
                            <div
                                className="relative rounded-2xl overflow-hidden"
                            >
                                <div className="relative w-full aspect-[3/4] overflow-hidden founder-photo-container">
                                    <OptimizedImage
                                        src="/images/about/founder-photo.jpeg"
                                        alt="Reece Todd, Founder of Aviera"
                                        width={600}
                                        height={800}
                                        className="w-full h-full"
                                        objectFit="cover"
                                        objectPosition="center center"
                                        fallbackText="Founder Photo"
                                        priority
                                    />
                                </div>
                                <div className="p-6 text-center bg-[var(--bg-elev-1)] border-t border-[var(--border)]">
                                    <p className="text-[var(--txt)] font-semibold text-lg">Reece Todd</p>
                                    <p className="text-sm text-[var(--txt-muted)]">Founder, Aviera</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bio Column (60%) */}
                    <div className="lg:col-span-3">
                        <div
                            className="p-8 md:p-12 transition-all duration-300 ease rounded-3xl"
                            style={{
                                background: 'rgba(20, 20, 20, 0.9)',
                                border: '1px solid rgba(0, 217, 255, 0.2)',
                                boxShadow: '0 0 15px rgba(0, 217, 255, 0.15)',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 217, 255, 0.4)';
                                e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.5)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 217, 255, 0.15)';
                                e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.2)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            <div className="prose prose-lg max-w-none">
                                <p className="text-lg md:text-xl text-[var(--txt-secondary)] leading-relaxed mb-8">
                                    I am <strong className="text-[var(--txt)]">Reece Todd</strong>, a passionate fitness enthusiast who learned firsthand how powerful the right supplements can be when they are simple, consistent, and matched to your goals.
                                </p>

                                <p className="text-lg md:text-xl text-[var(--txt-secondary)] leading-relaxed mb-8">
                                    I built <strong className="text-[var(--txt)]">Aviera</strong> to help you stop guessing which supplements actually help you reach your goals. Whether you are building muscle, cutting fat, or optimizing health. Aviera's AI creates your perfect starting stack instantly.
                                </p>

                                <p className="text-lg md:text-xl text-[var(--txt-secondary)] leading-relaxed mb-8 border-l-2 border-[var(--acc)]/30 pl-6 italic">
                                    The supplement industry is overwhelming. Hundreds of products, conflicting advice, and aggressive marketing make it nearly impossible to know where to start. <strong className="text-[var(--txt)]">That confusion ends here.</strong>
                                </p>

                                <p className="text-lg md:text-xl text-[var(--txt-secondary)] leading-relaxed">
                                    What I love most: if you are brand new and do not know where to begin, Aviera gets you on the right track fast. No confusion, no overwhelm. Just a clear, science backed plan you can actually follow.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* What We Stand For */}
                <div className="mb-24">
                    <div className="text-center mb-12">
                        <div
                            className="inline-block px-8 py-6 rounded-2xl mb-6 relative transition-all duration-300 ease cursor-default"
                            style={{
                                background: 'rgba(20, 20, 20, 0.9)',
                                boxShadow: '0 0 20px rgba(0, 217, 255, 0.25)',
                                border: '1px solid rgba(0, 217, 255, 0.3)',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 217, 255, 0.5)';
                                e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.6)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.25)';
                                e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            <h2 className="text-4xl md:text-6xl font-normal text-[var(--txt)] tracking-tight">
                                What We Stand For
                            </h2>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {/* Health is Wealth */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.6,
                                delay: 0,
                                ease: [0.25, 0.46, 0.45, 0.94]
                            }}
                            viewport={{ once: true }}
                            whileHover={{ transition: { duration: 0.3 } }}
                            className="card-premium"
                        >
                            <div
                                className="rounded-2xl p-8 h-full flex flex-col transition-all duration-300"
                                style={{
                                    background: 'rgba(15, 15, 15, 0.85)',
                                    backdropFilter: 'blur(8px)',
                                    border: '1px solid rgba(0, 217, 255, 0.3)',
                                    boxShadow: '0 0 20px rgba(0, 217, 255, 0.25)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 217, 255, 0.5)';
                                    e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.5)';
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.25)';
                                    e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                {/* Icon - Charcoal rounded square with accent glow */}
                                <div className="flex justify-center mb-6">
                                    <div className="relative">
                                        {/* Subtle glow effect */}
                                        <div className="absolute inset-0 bg-[var(--acc)]/20 rounded-2xl blur-2xl"></div>
                                        {/* Icon container */}
                                        <div className="relative w-20 h-20 bg-[var(--charcoal-light)] rounded-2xl flex items-center justify-center shadow-premium border border-[var(--border)] icon-aivra">
                                            <Heart className="text-white" size={40} strokeWidth={2} />
                                        </div>
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="text-xl md:text-2xl font-bold text-[var(--txt)] mb-3 text-center">
                                    Health is Wealth
                                </h3>

                                {/* Description */}
                                <p className="text-[#d1d5db] text-base md:text-lg leading-relaxed mb-6 text-center flex-grow">
                                    A healthy body is the foundation for a happy, successful life.
                                </p>

                                {/* Features */}
                                <ul className="space-y-2">
                                    <li className="flex items-center text-sm text-[#e5e5e5]">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#00d9ff] mr-2" />
                                        Foundation for success
                                    </li>
                                    <li className="flex items-center text-sm text-[#e5e5e5]">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#00d9ff] mr-2" />
                                        Long-term wellness
                                    </li>
                                    <li className="flex items-center text-sm text-[#e5e5e5]">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#00d9ff] mr-2" />
                                        Quality of life
                                    </li>
                                </ul>
                            </div>
                        </motion.div>

                        {/* Accessibility */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.6,
                                delay: 0.1,
                                ease: [0.25, 0.46, 0.45, 0.94]
                            }}
                            viewport={{ once: true }}
                            whileHover={{ transition: { duration: 0.3 } }}
                            className="card-premium"
                        >
                            <div
                                className="rounded-2xl p-8 h-full flex flex-col transition-all duration-300"
                                style={{
                                    background: 'rgba(15, 15, 15, 0.85)',
                                    backdropFilter: 'blur(8px)',
                                    border: '1px solid rgba(0, 217, 255, 0.3)',
                                    boxShadow: '0 0 20px rgba(0, 217, 255, 0.25)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 217, 255, 0.5)';
                                    e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.5)';
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.25)';
                                    e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                {/* Icon - Charcoal rounded square with accent glow */}
                                <div className="flex justify-center mb-6">
                                    <div className="relative">
                                        {/* Subtle glow effect */}
                                        <div className="absolute inset-0 bg-[var(--acc)]/20 rounded-2xl blur-2xl"></div>
                                        {/* Icon container */}
                                        <div className="relative w-20 h-20 bg-[var(--charcoal-light)] rounded-2xl flex items-center justify-center shadow-premium border border-[var(--border)] icon-aivra">
                                            <DoorOpen className="text-white" size={40} strokeWidth={2} />
                                        </div>
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="text-xl md:text-2xl font-bold text-[var(--txt)] mb-3 text-center">
                                    Accessibility
                                </h3>

                                {/* Description */}
                                <p className="text-[#d1d5db] text-base md:text-lg leading-relaxed mb-6 text-center flex-grow">
                                    Everyone deserves access to a healthy lifestyle, regardless of where they start.
                                </p>

                                {/* Features */}
                                <ul className="space-y-2">
                                    <li className="flex items-center text-sm text-[#e5e5e5]">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#00d9ff] mr-2" />
                                        Inclusive approach
                                    </li>
                                    <li className="flex items-center text-sm text-[#e5e5e5]">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#00d9ff] mr-2" />
                                        No barriers to entry
                                    </li>
                                    <li className="flex items-center text-sm text-[#e5e5e5]">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#00d9ff] mr-2" />
                                        Support for all
                                    </li>
                                </ul>
                            </div>
                        </motion.div>

                        {/* Progress Over Perfection */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.6,
                                delay: 0.2,
                                ease: [0.25, 0.46, 0.45, 0.94]
                            }}
                            viewport={{ once: true }}
                            whileHover={{ transition: { duration: 0.3 } }}
                            className="card-premium"
                        >
                            <div
                                className="rounded-2xl p-8 h-full flex flex-col transition-all duration-300"
                                style={{
                                    background: 'rgba(15, 15, 15, 0.85)',
                                    backdropFilter: 'blur(8px)',
                                    border: '1px solid rgba(0, 217, 255, 0.3)',
                                    boxShadow: '0 0 20px rgba(0, 217, 255, 0.25)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 217, 255, 0.5)';
                                    e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.5)';
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.25)';
                                    e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                {/* Icon - Charcoal rounded square with accent glow */}
                                <div className="flex justify-center mb-6">
                                    <div className="relative">
                                        {/* Subtle glow effect */}
                                        <div className="absolute inset-0 bg-[var(--acc)]/20 rounded-2xl blur-2xl"></div>
                                        {/* Icon container */}
                                        <div className="relative w-20 h-20 bg-[var(--charcoal-light)] rounded-2xl flex items-center justify-center shadow-premium border border-[var(--border)] icon-aivra">
                                            <TrendingUp className="text-white" size={40} strokeWidth={2} />
                                        </div>
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="text-xl md:text-2xl font-bold text-[var(--txt)] mb-3 text-center">
                                    Progress Over Perfection
                                </h3>

                                {/* Description */}
                                <p className="text-[#d1d5db] text-base md:text-lg leading-relaxed mb-6 text-center flex-grow">
                                    Go at your own pace. Your journey, your style.
                                </p>

                                {/* Features */}
                                <ul className="space-y-2">
                                    <li className="flex items-center text-sm text-[#e5e5e5]">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#00d9ff] mr-2" />
                                        Your own pace
                                    </li>
                                    <li className="flex items-center text-sm text-[#e5e5e5]">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#00d9ff] mr-2" />
                                        Consistent growth
                                    </li>
                                    <li className="flex items-center text-sm text-[#e5e5e5]">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#00d9ff] mr-2" />
                                        Sustainable change
                                    </li>
                                </ul>
                            </div>
                        </motion.div>

                        {/* Personalization */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.6,
                                delay: 0.3,
                                ease: [0.25, 0.46, 0.45, 0.94]
                            }}
                            viewport={{ once: true }}
                            whileHover={{ transition: { duration: 0.3 } }}
                            className="card-premium"
                        >
                            <div
                                className="rounded-2xl p-8 h-full flex flex-col transition-all duration-300"
                                style={{
                                    background: 'rgba(15, 15, 15, 0.85)',
                                    backdropFilter: 'blur(8px)',
                                    border: '1px solid rgba(0, 217, 255, 0.3)',
                                    boxShadow: '0 0 20px rgba(0, 217, 255, 0.25)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 217, 255, 0.5)';
                                    e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.5)';
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.25)';
                                    e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                {/* Icon - Charcoal rounded square with accent glow */}
                                <div className="flex justify-center mb-6">
                                    <div className="relative">
                                        {/* Subtle glow effect */}
                                        <div className="absolute inset-0 bg-[var(--acc)]/20 rounded-2xl blur-2xl"></div>
                                        {/* Icon container */}
                                        <div className="relative w-20 h-20 bg-[var(--charcoal-light)] rounded-2xl flex items-center justify-center shadow-premium border border-[var(--border)] icon-aivra">
                                            <Target className="text-white" size={40} strokeWidth={2} />
                                        </div>
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="text-xl md:text-2xl font-bold text-[var(--txt)] mb-3 text-center">
                                    Personalization
                                </h3>

                                {/* Description */}
                                <p className="text-[#d1d5db] text-base md:text-lg leading-relaxed mb-6 text-center flex-grow">
                                    One size fits all does not work. Your plan should be as unique as you.
                                </p>

                                {/* Features */}
                                <ul className="space-y-2">
                                    <li className="flex items-center text-sm text-[#e5e5e5]">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#00d9ff] mr-2" />
                                        Tailored to you
                                    </li>
                                    <li className="flex items-center text-sm text-[#e5e5e5]">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#00d9ff] mr-2" />
                                        Unique approach
                                    </li>
                                    <li className="flex items-center text-sm text-[#e5e5e5]">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#00d9ff] mr-2" />
                                        Individual goals
                                    </li>
                                </ul>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center p-12 md:p-20 rounded-3xl mb-16 transition-all duration-300 ease"
                    style={{
                        background: 'rgba(20, 20, 20, 0.9)',
                        border: '1px solid rgba(0, 217, 255, 0.2)',
                        boxShadow: '0 0 15px rgba(0, 217, 255, 0.15)',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 217, 255, 0.4)';
                        e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.5)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 217, 255, 0.15)';
                        e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.2)';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    <h2 className="text-4xl md:text-5xl font-normal text-[var(--txt)] mb-6 tracking-tight">
                        Ready to Start Your Journey?
                    </h2>
                    <p className="text-xl mb-10 text-[var(--txt-secondary)] font-light tracking-wide">
                        Get your personalized supplement stack in 2 minutes.
                    </p>
                    <Link
                        href="/supplement-optimization-score"
                        className="btn-primary inline-flex items-center px-10 py-4 text-lg"
                        style={{ boxShadow: '0 0 25px rgba(0, 217, 255, 0.5)' }}
                    >
                        Try Aviera Stack <ArrowRight className="ml-2" size={24} />
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
