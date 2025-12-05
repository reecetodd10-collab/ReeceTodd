'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, Dumbbell, Brain, Heart, Zap, Star, Sparkles, Target, ShoppingCart, Award, Crown, X } from 'lucide-react';
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
import { useActiveSection } from './hooks/useScrollAnimation';
import { useScrollAnimation } from './hooks/useScrollAnimation';
import { fetchShopifyProducts } from './lib/shopify';
import { addToCart } from './lib/shopify';

export default function Home() {
  const [showQuizModal, setShowQuizModal] = useState(false);
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
    <>
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
                border: '1px solid rgba(0, 217, 255, 0.3)',
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
      {/* Promotional Banner */}
      <PromoBanner />

      {/* Section Indicators */}
      <SectionIndicators sections={sections} activeSection={activeSection} />

      <div className="scroll-snap-container">
        {/* ========================================
            HERO SECTION - Premium Full-Screen
            ======================================== */}
        <section
          id="hero"
          className="scroll-snap-section relative min-h-[80vh] flex items-center justify-center bg-cover bg-center text-[var(--txt)] overflow-hidden"
        >
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
          className="scroll-snap-section relative min-h-[80vh] flex items-center bg-[var(--bg)] py-20 md:py-32 px-4"
        >
          <div
            ref={howItWorksAnimation.ref}
            className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full slide-up ${howItWorksAnimation.isVisible ? 'visible' : ''}`}
          >
            <div className="text-center mb-20">
              <div 
                className="inline-block px-8 py-6 rounded-2xl mb-6 transition-all duration-300 ease-in-out hover:scale-[1.02] cursor-default"
                style={{
                  background: 'rgba(30, 30, 30, 0.85)',
                  boxShadow: '0 0 20px rgba(0, 255, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(0, 229, 255, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 255, 255, 0.6), 0 4px 12px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)';
                }}
              >
                <h2 className="text-5xl md:text-6xl font-normal text-[var(--txt)]">
                  How It Works
                </h2>
              </div>
              <p className="text-xl text-[#d1d5db] max-w-2xl mx-auto">
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
                    className="text-center"
                  >
                    {/* Icon - Charcoal rounded square with accent glow */}
                    <div className="flex justify-center mb-8">
                      <div className="relative">
                        <div className="absolute inset-0 bg-[var(--acc)]/20 rounded-2xl blur-xl"></div>
                        <div className="relative w-20 h-20 bg-[var(--charcoal-light)] rounded-2xl flex items-center justify-center shadow-premium border border-[var(--border)] icon-aivra">
                          <Icon className="text-white" size={40} />
                        </div>
                      </div>
                    </div>

                    <div className="inline-block px-4 py-2 bg-[var(--acc)] text-[#001018] rounded-full font-normal text-sm mb-6">
                      Step {item.step}
                    </div>
                    <h3 className="text-2xl font-normal text-[var(--txt)] mb-4">{item.title}</h3>
                    <p className="text-[var(--txt-secondary)] leading-relaxed text-lg">
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
          className="scroll-snap-section relative min-h-[80vh] flex items-center bg-[var(--bg)] py-20 md:py-32 px-4 overflow-hidden"
        >
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <OptimizedImage
              src="/images/stack/stack-background.jpg"
              alt="Fitness and supplements background"
              width={1920}
              height={1080}
              className="w-full h-full"
              objectFit="cover"
              objectPosition="center 45%"
              fallbackText="Background"
            />
            {/* Dark overlay for text readability - rgba(0,0,0,0.5) equivalent */}
            <div className="absolute inset-0 bg-black/50"></div>
            {/* Additional gradient overlay for better text contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
          </div>
          
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
                {/* Icon - Charcoal rounded square with Sparkles icon */}
                <div className="flex lg:justify-start justify-center mb-8">
                  <div className="relative">
                      <div className="absolute inset-0 bg-[var(--acc)]/20 rounded-3xl blur-2xl"></div>
                      <div className="relative w-32 h-32 bg-[var(--charcoal-light)] rounded-3xl flex items-center justify-center shadow-premium-lg border border-[var(--border)] icon-aivra">
                      <Sparkles className="text-white" size={56} />
                    </div>
                  </div>
                </div>

                <h2 className="text-5xl md:text-6xl font-normal text-white mb-6 text-shadow-lg drop-shadow-2xl">
                  Aviera Stack
                </h2>
                <p className="text-xl text-white/95 mb-8 leading-relaxed text-shadow drop-shadow-lg">
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
                      <div className="w-6 h-6 bg-[var(--acc)] rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle size={16} className="text-[#001018]" />
                      </div>
                      <span className="text-white/90 text-lg text-shadow drop-shadow-md">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/smartstack-ai"
                  className="btn-primary"
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
          className="scroll-snap-section relative min-h-[80vh] flex items-center bg-[var(--bg)] py-20 md:py-32 px-4 overflow-hidden"
        >
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <OptimizedImage
              src="/images/fit/fit-background.jpg"
              alt="Workout and gym background"
              width={1920}
              height={1080}
              className="w-full h-full"
              objectFit="cover"
              objectPosition="center 80%"
              fallbackText="Background"
            />
            {/* Dark overlay for text readability - rgba(0,0,0,0.5) equivalent */}
            <div className="absolute inset-0 bg-black/50"></div>
            {/* Additional gradient overlay for better text contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
          </div>
          
          <div
            ref={smartfittAnimation.ref}
            className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full slide-up ${smartfittAnimation.isVisible ? 'visible' : ''}`}
          >
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Visual/Image - Left side */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative order-2 lg:order-1"
              >
                <div className="relative p-8 bg-[var(--bg-elev-1)] rounded-3xl shadow-premium-lg border border-[var(--glass-border)]">
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="inline-block px-6 py-3 bg-[var(--acc)] text-[#001018] rounded-full font-normal mb-4">
                        Your Workout Plan
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-[var(--bg-elev-2)] rounded-xl shadow-sm">
                          <div className="text-3xl font-normal text-[var(--acc)] mb-1">4</div>
                          <div className="text-sm text-[var(--txt-muted)]">Days/Week</div>
                        </div>
                        <div className="p-4 bg-[var(--bg-elev-2)] rounded-xl shadow-sm">
                          <div className="text-3xl font-normal text-[var(--acc)] mb-1">60</div>
                          <div className="text-sm text-[var(--txt-muted)]">Min/Session</div>
                        </div>
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
                {/* Icon - Charcoal rounded square with Dumbbell icon */}
                <div className="flex lg:justify-start justify-center mb-8">
                  <div className="relative">
                      <div className="absolute inset-0 bg-[var(--acc)]/20 rounded-3xl blur-2xl"></div>
                      <div className="relative w-32 h-32 bg-[var(--charcoal-light)] rounded-3xl flex items-center justify-center shadow-premium-lg border border-[var(--border)] icon-aivra">
                      <Dumbbell className="text-white" size={56} />
                    </div>
                  </div>
                </div>

                <h2 className="text-5xl md:text-6xl font-normal text-white mb-6 text-shadow-lg drop-shadow-2xl">
                  Aviera Fit
                </h2>
                <p className="text-xl text-white/95 mb-8 leading-relaxed text-shadow drop-shadow-lg">
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
                      <div className="w-6 h-6 bg-[var(--acc)] rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle size={16} className="text-[#001018]" />
                      </div>
                      <span className="text-white/90 text-lg text-shadow drop-shadow-md">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/smartfitt"
                  className="btn-primary"
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
          className="scroll-snap-section relative min-h-[80vh] flex items-center bg-[var(--bg)] py-20 md:py-32 px-4 overflow-hidden"
        >
          {/* Background - Shop Background Image */}
          <div className="absolute inset-0 z-0">
            <OptimizedImage
              src="/images/shop/shop-background.jpg"
              alt="Shop background"
              width={1920}
              height={1080}
              className="w-full h-full"
              priority
              objectFit="cover"
              objectPosition="center center"
              fallbackText="Shop Background"
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/50"></div>
            {/* Additional gradient overlay for better text contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
          </div>
          
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
                {/* Icon - Charcoal rounded square with ShoppingCart icon */}
                <div className="flex lg:justify-start justify-center mb-8">
                  <div className="relative">
                      <div className="absolute inset-0 bg-[var(--acc)]/20 rounded-3xl blur-2xl"></div>
                      <div className="relative w-32 h-32 bg-[var(--charcoal-light)] rounded-3xl flex items-center justify-center shadow-premium-lg border border-[var(--border)] icon-aivra">
                      <ShoppingCart className="text-white" size={56} />
                    </div>
                  </div>
                </div>

                <h2 className="text-5xl md:text-6xl font-normal text-white mb-6 text-shadow-lg drop-shadow-2xl">
                  Aviera Shop
                </h2>
                <p className="text-xl text-white/95 mb-8 leading-relaxed text-shadow drop-shadow-lg">
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
                      <div className="w-6 h-6 bg-[var(--acc)] rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle size={16} className="text-[#001018]" />
                      </div>
                      <span className="text-white/90 text-lg text-shadow drop-shadow-md">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/shop"
                  className="btn-primary"
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
                    // Loading placeholders
                    Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="glass-card p-6 animate-pulse">
                        <div className="w-full h-24 bg-[var(--acc)]/20 rounded-xl mb-4"></div>
                        <div className="h-4 bg-[var(--bg-elev-1)] rounded mb-2"></div>
                        <div className="h-6 bg-[var(--bg-elev-1)] rounded w-20"></div>
                      </div>
                    ))
                  ) : featuredProducts.length > 0 ? (
                    featuredProducts.map((product, i) => (
                      <FeaturedProductCard key={product.id || i} product={product} />
                    ))
                  ) : (
                    // Fallback if products not found
                    [
                      { name: 'Creatine', price: '$33.90' },
                      { name: 'Protein', price: '$44.49' },
                      { name: 'Magnesium', price: '$24.90' },
                      { name: 'Omega-3', price: '$23.90' }
                    ].map((product, i) => (
                      <div key={i} className="glass-card p-6 hover:shadow-premium-lg transition-all duration-300"
                        style={{
                          background: 'rgba(30, 30, 30, 0.9)',
                          border: '1px solid rgba(0, 217, 255, 0.3)',
                          borderRadius: '16px',
                          boxShadow: '0 0 20px rgba(0, 217, 255, 0.15), 0 4px 12px rgba(0, 0, 0, 0.2)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 217, 255, 0.5), 0 8px 20px rgba(0, 0, 0, 0.3)';
                          e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.7)';
                          e.currentTarget.style.transform = 'translateY(-5px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.15), 0 4px 12px rgba(0, 0, 0, 0.2)';
                          e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <div className="w-full h-24 bg-[var(--acc)]/20 rounded-xl mb-4 flex items-center justify-center">
                          <div className="w-12 h-12 bg-[var(--acc)] rounded-lg opacity-100"></div>
                        </div>
                        <h4 className="font-normal text-white mb-2">{product.name}</h4>
                        <p className="text-2xl font-normal text-[var(--acc)]">{product.price}</p>
                      </div>
                    ))
                  )}
                </div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[var(--acc)]/20 rounded-3xl -z-10 blur-2xl"></div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ========================================
            GOALS SECTION (4 Goal Cards)
            ======================================== */}
        <section
          id="goals"
          className="scroll-snap-section relative min-h-[80vh] flex items-center bg-[var(--bg)] py-20 md:py-32 px-4"
        >
          <div
            ref={goalsAnimation.ref}
            className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full slide-up ${goalsAnimation.isVisible ? 'visible' : ''}`}
          >
            <div className="text-center mb-16">
              <div 
                className="inline-block px-8 py-6 rounded-2xl mb-6 transition-all duration-300 ease-in-out hover:scale-[1.02] cursor-default"
                style={{
                  background: 'rgba(30, 30, 30, 0.85)',
                  boxShadow: '0 0 20px rgba(0, 255, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(0, 229, 255, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 255, 255, 0.6), 0 4px 12px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)';
                }}
              >
                <h2 className="text-5xl md:text-6xl font-normal text-[var(--txt)]">
                  Whatever Your Goal
                </h2>
              </div>
              <p className="text-xl text-[#d1d5db] max-w-2xl mx-auto">
                Personalized supplement stacks for every fitness journey.
              </p>
            </div>

            <GoalCards />
          </div>
        </section>

        {/* ========================================
            REVIEWS / TESTIMONIALS SECTION
            ======================================== */}
        <section
          id="reviews"
          className="scroll-snap-section relative min-h-[80vh] flex items-center bg-[var(--bg)] py-20 md:py-32 px-4"
        >
          <div
            ref={reviewsAnimation.ref}
            className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full slide-up ${reviewsAnimation.isVisible ? 'visible' : ''}`}
          >
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-normal text-[#ffffff] mb-6">
                What Our Users Say
              </h2>
              <p className="text-xl text-[#d1d5db] max-w-2xl mx-auto">
                Real results from real people transforming their fitness journey with Aviera.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Sarah M.',
                  role: 'Fitness Enthusiast',
                  quote: 'Finally understand what supplements I actually need. The AI recommendations were spot-on!',
                  rating: 5
                },
                {
                  name: 'Mike T.',
                  role: 'Competitive Lifter',
                  quote: 'The quiz made it so easy. My strength is up 20% in 8 weeks.',
                  rating: 5
                },
                {
                  name: 'Jessica L.',
                  role: 'Busy Professional',
                  quote: 'No more confusion. Simple stack, clear results. Perfect for my hectic lifestyle.',
                  rating: 5
                }
              ].map((review, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="rounded-2xl p-6 transition-all duration-300"
                  style={{
                    background: 'rgba(30, 30, 30, 0.9)',
                    border: '1px solid rgba(0, 217, 255, 0.3)',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 217, 255, 0.5), 0 8px 20px rgba(0, 0, 0, 0.3)';
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.7)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
                  }}
                >
                  <div className="flex mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="text-yellow-400 fill-current" size={20} />
                    ))}
                  </div>
                  <p className="text-white leading-relaxed text-lg italic mb-6 font-light">"{review.quote}"</p>
                  <div className="font-normal text-white text-lg">{review.name}</div>
                  <div className="text-sm text-[var(--txt-muted)] font-light">{review.role}</div>
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
          className="scroll-snap-section relative min-h-[80vh] flex items-center bg-[var(--bg)] py-20 md:py-32 px-4"
        >
          <div
            ref={faqAnimation.ref}
            className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full slide-up ${faqAnimation.isVisible ? 'visible' : ''}`}
          >
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-normal text-[var(--txt)] mb-6">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-[#d1d5db] max-w-2xl mx-auto">
                Everything you need to know about Aviera and our AI-powered recommendations.
              </p>
            </div>

            <FAQAccordion />
          </div>
        </section>

        {/* ========================================
            PRO FEATURES SECTION
            ======================================== */}
        <section
          className="scroll-snap-section relative min-h-[60vh] flex items-center bg-gradient-to-b from-[var(--bg)] to-[var(--bg-elev-1)] text-[var(--txt)] py-32"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-center mb-12">
              <div className="premium-badge inline-flex items-center gap-2 mb-6">
                <Crown size={18} />
                <span>Pro Features</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-normal text-[var(--txt)] mb-4">
                Take Your Fitness to the Next Level
              </h2>
              <p className="text-lg text-[#d1d5db] max-w-2xl mx-auto">
                Unlock AI-powered personalization, advanced tracking, and custom workout plans
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                { icon: Sparkles, title: 'AI Stack Builder', desc: 'Personalized supplement tracking with notifications' },
                { icon: Zap, title: 'Custom Workouts', desc: 'AI-generated plans with progressive overload' },
                { icon: Crown, title: '10% Shop Discount', desc: 'Save on all supplement purchases' },
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    className="p-6 text-center rounded-2xl transition-all duration-300"
                    style={{
                      background: 'rgba(30, 30, 30, 0.9)',
                      border: '1px solid rgba(0, 217, 255, 0.3)',
                      borderRadius: '16px',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 217, 255, 0.5), 0 8px 20px rgba(0, 0, 0, 0.3)';
                      e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.7)';
                      e.currentTarget.style.transform = 'translateY(-5px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
                      e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div className="w-16 h-16 bg-[var(--acc)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="text-[var(--acc)]" size={32} />
                    </div>
                    <h3 className="text-xl font-normal text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-[var(--txt-muted)] font-light">{feature.desc}</p>
                  </motion.div>
                );
              })}
            </div>

            <div className="text-center">
              <Link href="/pricing">
                <button 
                  className="group text-lg px-8 py-4 rounded-2xl transition-all duration-300 ease-in-out hover:scale-[1.02] relative"
                  style={{
                    background: 'rgba(30, 30, 30, 0.9)',
                    boxShadow: '0 0 20px rgba(0, 255, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(0, 229, 255, 0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 255, 255, 0.6), 0 4px 12px rgba(0, 0, 0, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)';
                  }}
                >
                  <span className="flex items-center gap-2 text-[#00E5FF]">
                    <Crown size={24} />
                    Get Aviera Pro
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={24} />
                  </span>
                </button>
              </Link>
              <p className="text-sm text-[var(--txt-muted)] mt-4">
                7-day free trial • Cancel anytime • $9.99/month
              </p>
            </div>
          </div>
        </section>

        {/* ========================================
            FINAL CTA SECTION
            ======================================== */}
        <section
          className="scroll-snap-section relative min-h-[80vh] flex items-center bg-[var(--bg)] text-[var(--txt)] py-32"
        >
          <div
            ref={ctaAnimation.ref}
            className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center slide-up ${ctaAnimation.isVisible ? 'visible' : ''}`}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="mb-8">
                <Sparkles className="mx-auto mb-6" size={64} />
              </div>

              <h2 className="text-5xl md:text-7xl font-normal text-[var(--txt)] mb-8">
                Ready to Get Started?
              </h2>

              <p className="text-xl md:text-2xl text-[#d1d5db] mb-12 leading-relaxed max-w-3xl mx-auto">
                Simplify your supplement routine with Aviera. Get AI-powered recommendations
                in 2 minutes. Free to use, no credit card required.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
                <Link
                  href="/smartstack-ai"
                  className="btn-primary group text-lg"
                >
                  <Sparkles size={24} />
                  Build Your Stack
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={24} />
                </Link>

                <Link
                  href="/smartfitt"
                  className="btn-secondary text-lg"
                >
                  <Dumbbell size={24} />
                  Get Workout Plan
                </Link>
              </div>

              <div className="flex flex-wrap justify-center gap-8 text-sm md:text-base opacity-90">
                <div className="flex items-center gap-2">
                  <CheckCircle size={20} />
                  <span>100% Free to Use</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={20} />
                  <span>No Credit Card Required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={20} />
                  <span>Instant Results</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ========================================
            ABOUT SECTION
            ======================================== */}
        <section
          id="about"
          className="scroll-snap-section relative min-h-[80vh] flex items-center bg-[var(--bg)] py-20 md:py-32 px-4"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            {/* Section Title */}
            <div className="text-center mb-16">
              <div 
                className="inline-block px-8 py-6 rounded-2xl mb-6 transition-all duration-300 ease-in-out hover:scale-[1.02] cursor-default"
                style={{
                  background: 'rgba(30, 30, 30, 0.85)',
                  boxShadow: '0 0 20px rgba(0, 255, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(0, 229, 255, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 255, 255, 0.6), 0 4px 12px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)';
                }}
              >
                <h2 className="text-5xl md:text-6xl font-normal text-[var(--txt)]">
                  About Aviera
                </h2>
              </div>
              <p className="text-lg md:text-xl text-[var(--txt-muted)] max-w-3xl mx-auto">
                Built by fitness enthusiasts, for everyone on a fitness journey.
              </p>
            </div>

            <div className="grid lg:grid-cols-5 gap-12 items-start lg:items-center">
              {/* Photo Column (40%) */}
              <div className="lg:col-span-2 flex justify-center lg:justify-start">
                <div 
                  className="relative w-full max-w-md mx-auto lg:mx-0 transition-all duration-300 ease-in-out rounded-2xl overflow-hidden"
                  style={{
                    boxShadow: '0 0 0px rgba(0, 255, 255, 0)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.5), 0 4px 12px rgba(0, 0, 0, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 0px rgba(0, 255, 255, 0)';
                  }}
                >
                  <div className="relative rounded-2xl overflow-hidden shadow-premium-lg">
                    <div className="relative w-full aspect-[3/4] overflow-hidden founder-photo-container">
                      {/* 
                        If person is off-center, adjust objectPosition:
                        - Person too far LEFT in frame: try "55% center" or "60% center"
                        - Person too far RIGHT in frame: try "45% center" or "40% center"  
                        - Person too HIGH in frame: try "center 60%"
                        - Person too LOW in frame: try "center 40%"
                      */}
                      <OptimizedImage
                        src="/images/about/founder-photo.jpg"
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
                  </div>
                </div>
              </div>

              {/* Bio Column (60%) */}
              <div className="lg:col-span-3">
                <div 
                  className="glass-card p-8 md:p-12 transition-all duration-300 ease-in-out"
                  style={{
                    boxShadow: '0 0 0px rgba(0, 255, 255, 0)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.5), 0 4px 12px rgba(0, 0, 0, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 0px rgba(0, 255, 255, 0)';
                  }}
                >
                  <h3 className="text-3xl md:text-4xl font-normal text-white mb-6">
                    Why I Built Aviera
                  </h3>
                  <div className="space-y-6">
                    <p className="text-lg md:text-xl text-[#e5e5e5] leading-relaxed">
                      I am <strong className="text-white">Reece Todd</strong>, a passionate fitness enthusiast who learned firsthand how powerful the right supplements can be when they're simple, consistent, and matched to your goals.
                    </p>
                    <p className="text-lg md:text-xl text-[#e5e5e5] leading-relaxed">
                      I built <strong className="text-white">Aviera</strong> to help you stop guessing which supplements actually help you reach your goals. Whether you are building muscle, cutting fat, or optimizing health — Aviera's AI creates your perfect starting stack instantly.
                    </p>
                    <p className="text-lg md:text-xl text-[#e5e5e5] leading-relaxed">
                      The supplement industry is overwhelming. Hundreds of products, conflicting advice, and aggressive marketing make it nearly impossible to know where to start. <strong className="text-white">That confusion ends here.</strong>
                    </p>
                    <p className="text-lg md:text-xl text-[#e5e5e5] leading-relaxed">
                      What I love most: if you are brand-new and do not know where to begin, Aviera gets you on the right track fast. No confusion, no overwhelm—just a clear, science-backed plan you can actually follow.
                    </p>
                  </div>
                  <div className="mt-8 pt-8 border-t border-white/10">
                    <p className="text-white font-normal text-lg">Reece Todd</p>
                    <p className="text-sm text-[#a0a0a0] mt-1">Founder, Aviera</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================
            CONTACT SECTION
            ======================================== */}
        <section
          id="contact"
          className="scroll-snap-section relative min-h-[80vh] flex items-center bg-[var(--bg)] py-20 md:py-32 px-4"
        >
          <div
            ref={contactAnimation.ref}
            className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full slide-up ${contactAnimation.isVisible ? 'visible' : ''}`}
          >
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-normal text-[var(--txt)] mb-6">
                Get In Touch
              </h2>
              <p className="text-xl text-[#d1d5db] max-w-2xl mx-auto">
                Have questions? We're here to help. Send us a message and we'll get back to you as soon as possible.
              </p>
            </div>

            <ContactForm />
          </div>
        </section>
      </div>
    </>
  );
}

// Featured Product Card Component
function FeaturedProductCard({ product }) {
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const handleAddToCart = async () => {
    if (!product.variantId || !product.available) return;
    
    setIsAdding(true);
    try {
      await addToCart(product.variantId, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add product to cart. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const price = product.price ? parseFloat(product.price).toFixed(2) : '0.00';
  const description = product.description || '';
  const displayDescription = isDescriptionExpanded 
    ? description 
    : description.split(' ').slice(0, 12).join(' ') + (description.split(' ').length > 12 ? '...' : '');
  const hasMoreText = description.split(' ').length > 12;

  return (
    <motion.div
      className="glass-card p-6 transition-all duration-300"
      style={{
        background: 'rgba(30, 30, 30, 0.9)',
        border: '1px solid rgba(0, 217, 255, 0.3)',
        borderRadius: '16px',
        boxShadow: '0 0 20px rgba(0, 217, 255, 0.15), 0 4px 12px rgba(0, 0, 0, 0.2)'
      }}
      whileHover={{ y: -5 }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 217, 255, 0.5), 0 8px 20px rgba(0, 0, 0, 0.3)';
        e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.7)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.15), 0 4px 12px rgba(0, 0, 0, 0.2)';
        e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
      }}
    >
      {/* Product Image */}
      <div className="w-full h-32 mb-4 rounded-xl overflow-hidden bg-[var(--bg-elev-1)] flex items-center justify-center">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.displayName || product.title} 
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-16 h-16 bg-[var(--acc)]/20 rounded-lg flex items-center justify-center">
            <ShoppingCart className="text-[var(--acc)]" size={32} />
          </div>
        )}
      </div>

      {/* Product Name */}
      <h4 className="font-normal text-white mb-2 text-lg">{product.displayName || product.title}</h4>

      {/* Description */}
      {description && (
        <div className="mb-3">
          <p className="text-sm text-[var(--txt-muted)] leading-relaxed font-light">
            {displayDescription}
            {hasMoreText && (
              <button
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="text-[var(--acc)] hover:text-[var(--acc-hover)] ml-1 font-normal"
              >
                {isDescriptionExpanded ? 'View Less' : 'View More'}
              </button>
            )}
          </p>
        </div>
      )}

      {/* Price */}
      <p className="text-2xl font-normal text-[var(--acc)] mb-4">${price}</p>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={isAdding || !product.available || !product.variantId}
        className="w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-white transition-all duration-300 ease-in-out"
        style={{
          background: added
            ? 'rgba(16, 185, 129, 0.9)'
            : 'rgba(30, 30, 30, 0.9)',
          border: added
            ? '1px solid rgba(16, 185, 129, 0.4)'
            : '1px solid rgba(0, 217, 255, 0.4)',
          borderRadius: '12px',
          padding: '12px 24px',
          fontSize: '14px',
          fontWeight: 600,
          boxShadow: added
            ? '0 0 20px rgba(16, 185, 129, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)'
            : '0 0 20px rgba(0, 217, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)',
        }}
        onMouseEnter={(e) => {
          if (!isAdding && !added && product.available && product.variantId) {
            e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 217, 255, 0.6), 0 4px 12px rgba(0, 0, 0, 0.3)';
            e.currentTarget.style.transform = 'translateY(-3px)';
          }
        }}
        onMouseLeave={(e) => {
          if (!added) {
            e.currentTarget.style.boxShadow = added
              ? '0 0 20px rgba(16, 185, 129, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)'
              : '0 0 20px rgba(0, 217, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)';
            e.currentTarget.style.transform = 'translateY(0)';
          }
        }}
      >
        {isAdding ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Adding...
          </>
        ) : added ? (
          <>
            <CheckCircle size={16} className="mr-2" />
            Added!
          </>
        ) : (
          <>
            <ShoppingCart size={16} className="mr-2" />
            Add to Cart
          </>
        )}
      </button>
    </motion.div>
  );
}
