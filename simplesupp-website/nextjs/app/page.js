'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, Dumbbell, Brain, Heart, Zap, Star, Sparkles, Target, ShoppingCart, Award, Crown, X, Flag } from 'lucide-react';
import PillLogo from './components/PillLogo';
import ParallaxLayer from './components/ParallaxLayer';
import PromoBanner from './components/PromoBanner';
import SectionIndicators from './components/SectionIndicators';
import StackedBlocks from './components/StackedBlocks';
import GoalCards from './components/GoalCards';
import FAQAccordion from './components/FAQAccordion';
import ContactForm from './components/ContactForm';
import GlassCard from './components/shared/GlassCard';
import OptimizedImage from './components/OptimizedImage';
// CyanWavyLines removed for performance optimization
// import CyanWavyLines from './components/CyanWavyLines';
import { useActiveSection } from './hooks/useScrollAnimation';
import { useScrollAnimation } from './hooks/useScrollAnimation';
import { fetchShopifyProducts } from './lib/shopify';
import { addToCart } from './lib/shopify';

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);

  // Show quiz modal on first visit (after 2 seconds)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if user has dismissed the modal before
    const hasSeenModal = localStorage.getItem('aviera_quiz_modal_dismissed');

    if (!hasSeenModal) {
      const timer = setTimeout(() => {
        setShowQuizModal(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismissModal = () => {
    setShowQuizModal(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('aviera_quiz_modal_dismissed', 'true');
    }
  };

  const handleGetStarted = () => {
    handleDismissModal();
    if (typeof window !== 'undefined') {
      const element = document.getElementById('aviera-stack');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Fetch featured products for shop section
  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const allProducts = await fetchShopifyProducts();
        // Find products by name search terms
        const findProduct = (searchTerms) => {
          return allProducts.find(p =>
            searchTerms.some(term =>
              p.title.toLowerCase().includes(term.toLowerCase())
            )
          );
        };

        const creatine = findProduct(['creatine', 'monohydrate']);
        const protein = findProduct(['whey', 'protein', 'isolate']);
        const magnesium = findProduct(['magnesium', 'glycinate']);
        const omega = findProduct(['omega', 'fish oil']);

        setFeaturedProducts([
          { ...creatine, displayName: 'Creatine', searchTerms: ['creatine', 'monohydrate'] },
          { ...protein, displayName: 'Protein', searchTerms: ['whey', 'protein', 'isolate'] },
          { ...magnesium, displayName: 'Magnesium', searchTerms: ['magnesium', 'glycinate'] },
          { ...omega, displayName: 'Omega-3', searchTerms: ['omega', 'fish oil'] }
        ].filter(p => p.id)); // Filter out undefined products
      } catch (error) {
        console.error('Error loading featured products:', error);
      } finally {
        setIsLoadingFeatured(false);
      }
    };

    loadFeaturedProducts();
  }, []);
  // Define all sections for navigation
  const sections = [
    { id: 'hero', label: 'Home' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'aviera-stack', label: 'Aviera Stack' },
    { id: 'aviera-fit', label: 'Aviera Fit' },
    { id: 'aviera-shop', label: 'Aviera Shop' },
    { id: 'goals', label: 'Your Goals' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'faq', label: 'FAQ' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  // Track active section for indicators
  const activeSection = useActiveSection(sections.map(s => s.id));

  // Scroll animation hooks
  const heroAnimation = useScrollAnimation({ threshold: 0.2, once: true });
  const howItWorksAnimation = useScrollAnimation({ threshold: 0.2, once: true });
  const smartstackAnimation = useScrollAnimation({ threshold: 0.2, once: true });
  const smartfittAnimation = useScrollAnimation({ threshold: 0.2, once: true });
  const shopAnimation = useScrollAnimation({ threshold: 0.2, once: true });
  const goalsAnimation = useScrollAnimation({ threshold: 0.2, once: true });
  const reviewsAnimation = useScrollAnimation({ threshold: 0.2, once: true });
  const faqAnimation = useScrollAnimation({ threshold: 0.2, once: true });
  const ctaAnimation = useScrollAnimation({ threshold: 0.2, once: true });
  const contactAnimation = useScrollAnimation({ threshold: 0.2, once: true });

  const scrollToSection = (sectionId) => {
    if (typeof window === 'undefined') return;
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, #ffffff, #f5f5f5)' }}>
      {/* Quiz Modal Popup */}
      <AnimatePresence>
        {showQuizModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(8px)',
            }}
            onClick={handleDismissModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="glass-card p-8 max-w-md w-full text-center relative"
              style={{
                boxShadow: '0 0 40px rgba(0, 217, 255, 0.4), 0 8px 32px rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(0, 217, 255, 0.2)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={handleDismissModal}
                className="absolute top-4 right-4 text-[var(--txt-muted)] hover:text-[var(--txt)] transition-colors"
                aria-label="Close"
              >
                <X size={24} />
              </button>

              {/* Icon */}
              <div className="mb-6">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-[var(--acc)]/20 rounded-2xl blur-xl"></div>
                  <div className="relative w-20 h-20 bg-[var(--charcoal-light)] rounded-2xl flex items-center justify-center border border-[var(--border)]">
                    <Sparkles className="text-[var(--acc)]" size={40} />
                  </div>
                </div>
              </div>

              {/* Content */}
              <h2 className="text-3xl font-normal text-[var(--txt)] mb-3">
                Discover Your Perfect Supplement Stack
              </h2>
              <p className="text-lg text-[var(--txt-muted)] font-light mb-8">
                Take our 2-minute quiz
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleGetStarted}
                  className="flex-1 px-6 py-3 bg-[var(--acc)] text-[#001018] rounded-lg font-semibold hover:bg-[var(--acc-hover)] transition shadow-accent"
                >
                  Get Started
                </button>
                <button
                  onClick={handleDismissModal}
                  className="px-6 py-3 bg-[var(--bg-elev-1)] text-[var(--txt-muted)] rounded-lg font-normal hover:bg-[var(--bg-elev-2)] hover:text-[var(--txt)] transition border border-[var(--border)]"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section Indicators */}
      <SectionIndicators sections={sections} activeSection={activeSection} />

      {/* Cyan Wavy Lines removed for performance optimization */}

      <div className="scroll-snap-container relative z-10">
        {/* ========================================
            HERO SECTION - Premium Full-Screen
            ======================================== */}
        <section
          id="hero"
          className="scroll-snap-section relative min-h-screen w-screen -ml-[calc((100vw-100%)/2)] flex items-center justify-center bg-cover bg-center text-[var(--txt)] overflow-hidden"
          style={{ background: '#000' }}
        >
          {/* Promotional Banner - overlays hero at top */}
          <div className="absolute top-0 left-0 right-0 z-30">
            <PromoBanner />
          </div>

          {/* Hero Background Image */}
          <div className="absolute inset-0 z-0">
            <OptimizedImage
              src="/images/hero/hero-background.jpg"
              alt="Fitness and wellness background"
              width={1920}
              height={1080}
              className="w-full h-full"
              priority
              objectFit="cover"
              objectPosition="center center"
              fallbackText="Hero Background"
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/70"></div>
            {/* Additional gradient overlay for better text contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
          </div>

          {/* Hero Content */}
          <div
            ref={heroAnimation.ref}
            className={`relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 text-center slide-up ${heroAnimation.isVisible ? 'visible' : ''}`}
          >
            <div className="relative z-10">
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="flex justify-center mb-8 sm:mb-12"
              >
                <PillLogo size="large" shimmer={true} />
              </motion.div>

              {/* AVIERAFIT Wordmark with Tagline */}
              <div className="mb-8 sm:mb-12">
                <p className="text-sm md:text-base tracking-[0.35em] font-light text-white/80 uppercase mb-0.5">
                  AVIERAFIT
                </p>
                {/* Subtle Tagline */}
                <p className="text-[10px] md:text-xs tracking-[0.18em] font-light text-white/75 uppercase leading-tight">
                  STOP GUESSING. START PROGRESSING.
                </p>
              </div>

              {/* Subtitle */}
              <p className="text-xl sm:text-2xl md:text-3xl text-white/95 max-w-3xl mx-auto mb-4 font-light leading-tight tracking-tight">
                Your AI-Powered Fitness & Supplement Advisor
              </p>

              {/* Supporting Line */}
              <p className="text-base sm:text-lg md:text-xl text-white/85 max-w-2xl mx-auto mb-12 leading-relaxed px-4">
                Get a personalized supplement stack and weekly workout plan in under 60 seconds.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                <motion.button
                  onClick={() => scrollToSection('aviera-stack')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative px-8 py-4 bg-gradient-to-r from-[var(--acc)] via-cyan-500 to-blue-500 text-white font-normal rounded-xl shadow-lg shadow-[var(--acc)]/30 hover:shadow-xl hover:shadow-[var(--acc)]/40 transition-all duration-300 border border-white/20 hover:border-white/30"
                >
                  <span className="relative z-10 flex items-center gap-2 text-lg">
                    Start My 60-Second Quiz
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                  </span>
                  {/* Glowing border effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[var(--acc)] via-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10"></div>
                </motion.button>

                <motion.button
                  onClick={() => scrollToSection('aviera-shop')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-white/5 backdrop-blur-sm text-white font-normal rounded-xl border border-white/20 hover:border-white/30 hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-white/10"
                >
                  <span className="flex items-center gap-2 text-lg">
                    Browse Supplements
                  </span>
                </motion.button>
              </div>

              {/* Trust Indicators */}
              <div className="hidden md:flex flex-wrap justify-center gap-8 text-sm md:text-base text-white/90">
                <div className="flex items-center gap-2">
                  <CheckCircle size={20} className="text-[var(--acc)]" />
                  <span className="font-normal">Science-backed</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={20} className="text-[var(--acc)]" />
                  <span className="font-normal">Takes 60 seconds</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={20} className="text-[var(--acc)]" />
                  <span className="font-normal">AI-powered</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="hidden md:block absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2 backdrop-blur-sm">
              <div className="w-1 h-3 bg-white/60 rounded-full"></div>
            </div>
          </div>
        </section>

        {/* ========================================
            HOW IT WORKS SECTION
            ======================================== */}
        <section
          id="how-it-works"
          className="scroll-snap-section relative min-h-[80vh] flex items-center py-20 md:py-32 px-4 overflow-hidden"
        >
          <div
            ref={howItWorksAnimation.ref}
            className={`relative z-[2] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full slide-up ${howItWorksAnimation.isVisible ? 'visible' : ''}`}
          >
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-normal mb-4" style={{ fontFamily: 'Montserrat, sans-serif', color: '#1a1a1a' }}>
                How It Works
              </h2>
              <p className="text-xl max-w-2xl mx-auto font-light" style={{ color: '#4a4a4a' }}>
                Simple. Smart. Personalized. Get your perfect stack in three easy steps.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              {[
                {
                  step: '1',
                  title: 'Share Your Goals',
                  description: 'Tell us about your fitness goals, lifestyle, diet, and what you want to achieve.',
                  icon: Target,
                },
                {
                  step: '2',
                  title: 'AI Builds Your Stack',
                  description: 'Our AI analyzes 42+ supplements and creates your personalized recommendation.',
                  icon: Brain,
                },
                {
                  step: '3',
                  title: 'Shop & Optimize',
                  description: 'Order premium supplements with fast shipping. Track progress and refine your stack.',
                  icon: ShoppingCart,
                }
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: i * 0.15 }}
                    viewport={{ once: true }}
                    className="text-center p-8 rounded-2xl transition-all duration-300"
                    style={{
                      background: '#ffffff',
                      border: '1px solid rgba(0, 217, 255, 0.2)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                    }}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: '0 8px 32px rgba(0, 217, 255, 0.25), 0 0 20px rgba(0, 217, 255, 0.15)',
                      borderColor: 'rgba(0, 217, 255, 0.5)',
                      y: -4
                    }}
                  >
                    <div className="flex justify-center mb-8">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(0, 217, 255, 0.1)' }}>
                        <Icon style={{ color: '#00d9ff' }} size={32} />
                      </div>
                    </div>

                    <div className="inline-block px-4 py-2 rounded-full font-normal text-sm mb-6" style={{ background: 'rgba(0, 217, 255, 0.1)', color: '#00d9ff' }}>
                      Step {item.step}
                    </div>
                    <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Montserrat, sans-serif', color: '#1a1a1a' }}>{item.title}</h3>
                    <p className="leading-relaxed text-lg font-light" style={{ color: '#4a4a4a' }}>
                      {item.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================
            AVIERA STACK SECTION
            ======================================== */}
        <section
          id="aviera-stack"
          className="scroll-snap-section relative min-h-[80vh] flex items-center py-20 md:py-32 px-4 overflow-hidden"
        >
          <div
            ref={smartstackAnimation.ref}
            className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full slide-up ${smartstackAnimation.isVisible ? 'visible' : ''}`}
          >
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Icon and Content */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="flex lg:justify-start justify-center mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#00d9ff]/20 rounded-3xl blur-2xl"></div>
                    <div
                      className="relative w-28 h-28 rounded-3xl flex items-center justify-center shadow-lg border border-[#e0e0e0]"
                      style={{
                        background: '#1a1a1a',
                        boxShadow: '0 0 25px rgba(0, 217, 255, 0.4), 0 0 50px rgba(0, 217, 255, 0.2)'
                      }}
                    >
                      <Sparkles className="text-white" size={56} strokeWidth={1.5} />
                    </div>
                  </div>
                </div>

                <h2 className="text-5xl md:text-6xl font-normal mb-6" style={{ fontFamily: 'Montserrat, sans-serif', color: '#1a1a1a' }}>
                  Aviera Stack
                </h2>
                <p className="text-xl mb-8 leading-relaxed font-light" style={{ color: '#4a4a4a' }}>
                  Answer a quick 2-minute quiz and get an AI-generated supplement stack tailored to your exact
                  goals, lifestyle, and experience level. Our intelligence engine analyzes 42+ premium supplements
                  to build your perfect combination.
                </p>

                <div className="space-y-4 mb-8">
                  {[
                    'Personalized to your fitness goals',
                    'Science-backed supplement combinations',
                    'Dosage and timing recommendations',
                    'Beginner to advanced stacks'
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#00d9ff' }}>
                        <CheckCircle size={16} className="text-[#001018]" />
                      </div>
                      <span className="text-lg font-light" style={{ color: '#4a4a4a' }}>{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/supplement-optimization-score"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all duration-300"
                  style={{
                    background: '#00d9ff',
                    color: '#ffffff',
                    boxShadow: '0 0 20px rgba(0, 217, 255, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 217, 255, 0.5)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.3)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Build Your Stack
                  <ArrowRight size={20} />
                </Link>
              </motion.div>

              {/* 3D Stacked Blocks Visualization */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative flex items-center justify-center"
              >
                <StackedBlocks />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ========================================
            AVIERA FIT SECTION
            ======================================== */}
        <section
          id="aviera-fit"
          className="scroll-snap-section relative min-h-[80vh] flex items-center py-20 md:py-32 px-4 overflow-hidden"
        >
          <div
            ref={smartfittAnimation.ref}
            className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full slide-up ${smartfittAnimation.isVisible ? 'visible' : ''}`}
          >
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Visual - Left side */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative order-2 lg:order-1"
              >
                <div
                  className="relative p-8 rounded-2xl transition-all duration-300"
                  style={{
                    background: '#ffffff',
                    border: '1px solid rgba(0, 217, 255, 0.2)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 217, 255, 0.25), 0 0 20px rgba(0, 217, 255, 0.15)';
                    e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.5)';
                    e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.2)';
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  }}
                >
                  <div className="text-center">
                    <div className="inline-block px-6 py-3 rounded-full font-semibold mb-4" style={{ background: '#00d9ff', color: '#ffffff' }}>
                      Your Workout Plan
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl" style={{ background: '#f9fafb', border: '1px solid #e0e0e0' }}>
                        <div className="text-3xl font-normal mb-1" style={{ color: '#00d9ff' }}>4</div>
                        <div className="text-sm font-light" style={{ color: '#6b7280' }}>Days/Week</div>
                      </div>
                      <div className="p-4 rounded-xl" style={{ background: '#f9fafb', border: '1px solid #e0e0e0' }}>
                        <div className="text-3xl font-normal mb-1" style={{ color: '#00d9ff' }}>60</div>
                        <div className="text-sm font-light" style={{ color: '#6b7280' }}>Min/Session</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Icon and Content - Right side */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="order-1 lg:order-2"
              >
                <div className="flex lg:justify-start justify-center mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#00d9ff]/20 rounded-3xl blur-2xl"></div>
                    <div
                      className="relative w-28 h-28 rounded-3xl flex items-center justify-center shadow-lg border border-[#e0e0e0]"
                      style={{
                        background: '#1a1a1a',
                        boxShadow: '0 0 25px rgba(0, 217, 255, 0.4), 0 0 50px rgba(0, 217, 255, 0.2)'
                      }}
                    >
                      <Dumbbell className="text-white" size={56} strokeWidth={1.5} />
                    </div>
                  </div>
                </div>

                <h2 className="text-5xl md:text-6xl font-normal mb-6" style={{ fontFamily: 'Montserrat, sans-serif', color: '#1a1a1a' }}>
                  Aviera Fit
                </h2>
                <p className="text-xl mb-8 leading-relaxed font-light" style={{ color: '#4a4a4a' }}>
                  Get AI-powered workout recommendations tailored to your goals and experience level.
                  Match your training plan with the perfect supplement stack for maximum results.
                </p>

                <div className="space-y-4 mb-8">
                  {[
                    'Personalized training programs',
                    'Exercise form guides and videos',
                    'Progressive overload tracking',
                    'Supplement-workout synchronization'
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#00d9ff' }}>
                        <CheckCircle size={16} className="text-[#001018]" />
                      </div>
                      <span className="text-lg font-light" style={{ color: '#4a4a4a' }}>{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/smartfitt"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all duration-300"
                  style={{
                    background: '#00d9ff',
                    color: '#ffffff',
                    boxShadow: '0 0 20px rgba(0, 217, 255, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 217, 255, 0.5)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.3)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Get Workout Plan
                  <ArrowRight size={20} />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ========================================
            AVIERA SHOP SECTION
            ======================================== */}
        <section
          id="aviera-shop"
          className="scroll-snap-section relative min-h-[80vh] flex items-center py-20 md:py-32 px-4 overflow-hidden"
        >
          <div
            ref={shopAnimation.ref}
            className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full slide-up ${shopAnimation.isVisible ? 'visible' : ''}`}
          >
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Icon and Content */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="flex lg:justify-start justify-center mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#00d9ff]/20 rounded-3xl blur-2xl"></div>
                    <div
                      className="relative w-28 h-28 rounded-3xl flex items-center justify-center shadow-lg border border-[#e0e0e0]"
                      style={{
                        background: '#1a1a1a',
                        boxShadow: '0 0 25px rgba(0, 217, 255, 0.4), 0 0 50px rgba(0, 217, 255, 0.2)'
                      }}
                    >
                      <ShoppingCart className="text-white" size={56} strokeWidth={1.5} />
                    </div>
                  </div>
                </div>

                <h2 className="text-5xl md:text-6xl font-normal mb-6" style={{ fontFamily: 'Montserrat, sans-serif', color: '#1a1a1a' }}>
                  Aviera Shop
                </h2>
                <p className="text-xl mb-8 leading-relaxed font-light" style={{ color: '#4a4a4a' }}>
                  Order premium supplements directly through our Supliful integration.
                  Quality guaranteed, fast shipping, hassle-free returns. Your perfect stack,
                  delivered to your door.
                </p>

                <div className="space-y-4 mb-8">
                  {[
                    'Premium quality supplements',
                    'Fast, reliable shipping',
                    'Secure checkout process',
                    'Money-back guarantee'
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#00d9ff' }}>
                        <CheckCircle size={16} className="text-[#001018]" />
                      </div>
                      <span className="text-lg font-light" style={{ color: '#4a4a4a' }}>{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all duration-300"
                  style={{
                    background: '#00d9ff',
                    color: '#ffffff',
                    boxShadow: '0 0 20px rgba(0, 217, 255, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 217, 255, 0.5)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.3)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Browse Products
                  <ArrowRight size={20} />
                </Link>
              </motion.div>

              {/* Visual - Featured Products */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="grid grid-cols-2 gap-4">
                  {isLoadingFeatured ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="p-6 rounded-2xl animate-pulse" style={{ background: '#ffffff', border: '1px solid #e0e0e0' }}>
                        <div className="w-full h-24 rounded-xl mb-4" style={{ background: 'rgba(0, 217, 255, 0.1)' }}></div>
                        <div className="h-4 rounded mb-2" style={{ background: '#e0e0e0' }}></div>
                        <div className="h-6 rounded w-20" style={{ background: '#e0e0e0' }}></div>
                      </div>
                    ))
                  ) : featuredProducts.length > 0 ? (
                    featuredProducts.map((product, i) => (
                      <FeaturedProductCard key={product.id || i} product={product} />
                    ))
                  ) : (
                    [
                      { name: 'Creatine', price: '$33.90' },
                      { name: 'Protein', price: '$44.49' },
                      { name: 'Magnesium', price: '$24.90' },
                      { name: 'Omega-3', price: '$23.90' }
                    ].map((product, i) => (
                      <div key={i} className="p-6 rounded-2xl transition-all duration-300"
                        style={{
                          background: '#ffffff',
                          border: '1px solid rgba(0, 217, 255, 0.2)',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 217, 255, 0.25), 0 0 20px rgba(0, 217, 255, 0.15)';
                          e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.5)';
                          e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                          e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.2)';
                          e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        }}
                      >
                        <div className="w-full h-24 rounded-xl mb-4 flex items-center justify-center" style={{ background: 'rgba(0, 217, 255, 0.1)', boxShadow: '0 0 12px rgba(0, 217, 255, 0.2)' }}>
                          <div className="w-12 h-12 rounded-lg" style={{ background: '#00d9ff', boxShadow: '0 0 15px rgba(0, 217, 255, 0.5)' }}></div>
                        </div>
                        <h4 className="font-semibold mb-2" style={{ color: '#1a1a1a' }}>{product.name}</h4>
                        <p className="text-2xl font-normal" style={{ color: '#00d9ff' }}>{product.price}</p>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ========================================
            GOALS SECTION (4 Goal Cards)
            ======================================== */}
        <section
          id="goals"
          className="scroll-snap-section relative min-h-[80vh] flex items-center py-20 md:py-32 px-4 overflow-hidden"
        >
          <div
            ref={goalsAnimation.ref}
            className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full slide-up ${goalsAnimation.isVisible ? 'visible' : ''}`}
          >
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-normal mb-4" style={{ fontFamily: 'Montserrat, sans-serif', color: '#1a1a1a' }}>
                Your Goals
              </h2>
              <p className="text-xl max-w-2xl mx-auto font-light" style={{ color: '#4a4a4a' }}>
                No matter your objective, we have the right strategy for you.
              </p>
            </div>

            <GoalCards />
          </div>
        </section>

        {/* ========================================
            REVIEWS SECTION
            ======================================== */}
        <section
          id="reviews"
          className="scroll-snap-section relative min-h-[80vh] flex items-center py-20 md:py-32 px-4 overflow-hidden"
        >
          <div
            ref={reviewsAnimation.ref}
            className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full slide-up ${reviewsAnimation.isVisible ? 'visible' : ''}`}
          >
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-normal mb-4" style={{ fontFamily: 'Montserrat, sans-serif', color: '#1a1a1a' }}>
                Success Stories
              </h2>
              <p className="text-xl max-w-2xl mx-auto font-light" style={{ color: '#4a4a4a' }}>
                Real results from real people using Aviera.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Sarah J.',
                  role: 'Busy Professional',
                  quote: 'Aviera took the guesswork out of my routine. I feel more energized and recovered than ever.',
                  rating: 5,
                },
                {
                  name: 'Mike T.',
                  role: 'Fitness Enthusiast',
                  quote: 'The personalized stack was spot on. I\'ve broken through my plateaus in just 4 weeks.',
                  rating: 5,
                },
                {
                  name: 'Jessica L.',
                  role: 'Runner',
                  quote: 'Finally, supplements that actually make sense for my endurance training. Highly recommended!',
                  rating: 5,
                },
              ].map((review, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="rounded-2xl p-8 transition-all duration-300"
                  style={{
                    background: '#ffffff',
                    border: '1px solid rgba(0, 217, 255, 0.2)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 217, 255, 0.25), 0 0 20px rgba(0, 217, 255, 0.15)';
                    e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.5)';
                    e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.2)';
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  }}
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(review.rating)].map((_, j) => (
                      <Star key={j} size={18} style={{ color: '#00d9ff', fill: '#00d9ff' }} />
                    ))}
                  </div>
                  <p className="mb-6 text-lg italic font-light" style={{ color: '#4a4a4a' }}>"{review.quote}"</p>
                  <div>
                    <p className="font-semibold" style={{ color: '#1a1a1a' }}>{review.name}</p>
                    <p className="text-sm font-light" style={{ color: '#6b7280' }}>{review.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================
            FAQ SECTION
            ======================================== */}
        <section
          id="faq"
          className="scroll-snap-section relative min-h-[80vh] flex items-center py-20 md:py-32 px-4 overflow-hidden"
        >
          <div
            ref={faqAnimation.ref}
            className={`relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full slide-up ${faqAnimation.isVisible ? 'visible' : ''}`}
          >
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-normal mb-4" style={{ fontFamily: 'Montserrat, sans-serif', color: '#1a1a1a' }}>
                FAQ
              </h2>
              <p className="text-xl font-light" style={{ color: '#4a4a4a' }}>
                Common questions about Aviera and our personalized approach.
              </p>
            </div>

            <FAQAccordion />
          </div>
        </section>

        {/* ========================================
            ABOUT SECTION
            ======================================== */}
        <section
          id="about"
          className="scroll-snap-section relative min-h-[80vh] flex items-center py-20 md:py-32 px-4 overflow-hidden"
        >
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full slide-up visible">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-normal mb-4" style={{ fontFamily: 'Montserrat, sans-serif', color: '#1a1a1a' }}>
                About Us
              </h2>
              <p className="text-xl font-light max-w-2xl mx-auto" style={{ color: '#4a4a4a' }}>
                We're on a mission to simplify fitness and nutrition through AI and science.
              </p>
            </div>

            <div className="text-center">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all duration-300"
                style={{
                  background: '#00d9ff',
                  color: '#ffffff',
                  boxShadow: '0 0 20px rgba(0, 217, 255, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 217, 255, 0.5)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.3)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Learn Our Story <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================
            CONTACT SECTION
            ======================================== */}
        <section
          id="contact"
          className="scroll-snap-section relative min-h-[80vh] flex items-center py-20 md:py-32 px-4 overflow-hidden"
        >
          <div
            ref={contactAnimation.ref}
            className={`relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full slide-up ${contactAnimation.isVisible ? 'visible' : ''}`}
          >
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-normal mb-4" style={{ fontFamily: 'Montserrat, sans-serif', color: '#1a1a1a' }}>
                Contact Us
              </h2>
              <p className="text-xl font-light" style={{ color: '#4a4a4a' }}>
                Have questions? We're here to help you on your journey.
              </p>
            </div>

            <ContactForm />
          </div>
        </section>
      </div>
    </div>
  );
}

// Separate component for featured product cards to reduce complexity
function FeaturedProductCard({ product }) {
  const [hovered, setHovered] = useState(false);

  const productImage = product.images && product.images.length > 0
    ? product.images[0]
    : product.image;

  return (
    <div
      className="p-6 rounded-2xl transition-all duration-300"
      style={{
        background: '#ffffff',
        border: '1px solid ' + (hovered ? 'rgba(0, 217, 255, 0.5)' : 'rgba(0, 217, 255, 0.2)'),
        boxShadow: hovered
          ? '0 8px 32px rgba(0, 217, 255, 0.25), 0 0 20px rgba(0, 217, 255, 0.15)'
          : '0 4px 12px rgba(0, 0, 0, 0.08)',
        transform: hovered ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)'
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="w-full h-32 rounded-xl mb-4 flex items-center justify-center overflow-hidden transition-all duration-300"
        style={{
          background: '#f9fafb',
          boxShadow: hovered ? '0 0 20px rgba(0, 217, 255, 0.3), inset 0 0 10px rgba(0, 217, 255, 0.1)' : 'none'
        }}
      >
        {productImage ? (
          <img
            src={productImage}
            alt={product.title}
            className="w-full h-full object-contain p-2 transition-transform duration-300"
            style={{ transform: hovered ? 'scale(1.05)' : 'scale(1)' }}
          />
        ) : (
          <div className="text-4xl">💊</div>
        )}
      </div>
      <h4 className="font-semibold mb-2 line-clamp-1" style={{ color: '#1a1a1a' }}>{product.displayName || product.title}</h4>
      <p className="text-2xl font-normal" style={{ color: '#00d9ff' }}>${product.price}</p>
    </div>
  );
}
