'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Mail, Calendar, ArrowRight, CheckCircle, Dumbbell, Pill, Heart, Check } from 'lucide-react';
import Link from 'next/link';
import PillLogo from '../components/PillLogo';
// CyanWavyLines removed for mobile performance

export default function NewsPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [latestNewsletter, setLatestNewsletter] = useState(null);
  const [newsletterArchive, setNewsletterArchive] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch for animated elements
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check if user is already subscribed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const subscribedEmail = localStorage.getItem('aviera_news_subscribed');
      if (subscribedEmail) {
        setIsSubscribed(true);
        setEmail(subscribedEmail);
      }
    }
  }, []);

  // Fetch newsletters from API
  useEffect(() => {
    const fetchNewsletters = async () => {
      try {
        // Fetch latest newsletter
        const latestResponse = await fetch('/api/newsletters?latest=true');
        const latestData = await latestResponse.json();

        if (latestData.newsletter) {
          setLatestNewsletter(latestData.newsletter);
        }

        // Fetch archive (excluding the latest one)
        const archiveResponse = await fetch('/api/newsletters?limit=10');
        const archiveData = await archiveResponse.json();

        if (archiveData.newsletters && archiveData.newsletters.length > 0) {
          // Skip the first one if we already have it as latest
          const archive = latestData.newsletter
            ? archiveData.newsletters.slice(1)
            : archiveData.newsletters;
          setNewsletterArchive(archive);
        }
      } catch (error) {
        console.error('Error fetching newsletters:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewsletters();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email) {
      try {
        // Send to backend API endpoint
        const response = await fetch('/api/newsletter/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok) {
          // Store email in localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('aviera_news_subscribed', email);
            setIsSubscribed(true);
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 3000);
          }
        } else {
          // Handle error response
          console.error('Subscription error:', data.error);
          alert(data.error || 'Failed to subscribe. Please try again.');
        }
      } catch (error) {
        console.error('Network error:', error);
        alert('Network error. Please check your connection and try again.');
      }
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Coming Soon';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #ffffff, #f5f5f5)',
      }}
    >
      {/* Background decoration removed for mobile performance */}

      {/* Header - White bar with AVIERA branding */}
      <header
        className="relative z-20 px-4 sm:px-6 lg:px-8 py-6"
        style={{
          background: '#ffffff',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <Link href="/home" className="inline-flex items-center gap-3">
            <div className="[&_h1]:hidden">
              <PillLogo size="small" />
            </div>
            <span
              className="text-2xl font-bold"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                color: '#1a1a1a'
              }}
            >
              AVIERA
            </span>
          </Link>
        </div>
      </header>

      {/* Hero Section with Subscription Form */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Standalone Newsletter Icon Box - EXACTLY Like Flag Icon */}
          <motion.div
            className="flex justify-center mb-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-[#00d9ff]/20 rounded-3xl blur-2xl"></div>
              {/* Icon container - EXACT same as flag icon with icon-aivra class */}
              <div className="relative w-28 h-28 bg-[#1a1a1a] rounded-3xl flex items-center justify-center shadow-premium-lg border border-[var(--border)] icon-aivra">
                <Newspaper className="text-white" size={56} strokeWidth={1.5} />
              </div>
            </div>
          </motion.div>

          {/* Bordered Title Container - Exactly Like About Page "Our Mission" */}
          <motion.div
            className="inline-block mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div
              className="inline-block px-8 py-6 rounded-2xl relative transition-all duration-300 ease cursor-default"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
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
              <h1
                className="text-4xl md:text-6xl font-normal tracking-tight"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  color: '#1a1a1a',
                }}
              >
                Aviera News
              </h1>
            </div>
          </motion.div>

          <motion.p
            className="text-xl md:text-2xl mb-4 font-light tracking-wider"
            style={{ color: '#00d9ff' }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            THIS WEEK IN PERFORMANCE
          </motion.p>

          <motion.p
            className="text-lg md:text-xl mb-12 font-light max-w-2xl mx-auto"
            style={{ color: '#4a4a4a' }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Three focused insights on fitness, supplements, and health. Every week. No fluff.
          </motion.p>

          {/* Email Subscription Form */}
          {!isSubscribed ? (
            <div
              className="rounded-2xl p-8 md:p-10 mb-16 transition-all duration-300 cursor-default"
              style={{
                background: '#ffffff',
                border: '1px solid rgba(0, 217, 255, 0.3)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 217, 255, 0.4), 0 4px 16px rgba(0, 0, 0, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.6)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <h2
                className="text-2xl md:text-3xl font-bold mb-4"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  color: '#1a1a1a'
                }}
              >
                Subscribe to Aviera News
              </h2>
              <p className="text-lg mb-8 font-light" style={{ color: '#4a4a4a' }}>
                Three things that matter each week. No fluff. Just results.
              </p>

              <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="flex-1 rounded-xl font-normal transition-all duration-300"
                    style={{
                      height: '56px',
                      fontSize: '16px',
                      padding: '16px 20px',
                      background: '#f9fafb',
                      border: '1px solid #e0e0e0',
                      color: '#1a1a1a',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#00d9ff';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 217, 255, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e0e0e0';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                  <button
                    type="submit"
                    className="px-8 py-3 h-[56px] flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold text-white transition-all duration-300"
                    style={{
                      background: '#00d9ff',
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
                    <Mail size={20} />
                    Subscribe
                  </button>
                </div>
                {submitted && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 text-center text-sm font-light flex items-center justify-center gap-2"
                    style={{ color: '#10b981' }}
                  >
                    <CheckCircle size={16} />
                    Thanks! You're subscribed. Check your email for confirmation.
                  </motion.p>
                )}
              </form>
            </div>
          ) : (
            <div
              className="rounded-2xl p-8 md:p-10 mb-16 text-center transition-all duration-300"
              style={{
                background: '#ffffff',
                border: '1px solid #e0e0e0',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
              }}
            >
              <div
                className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
                style={{ background: 'rgba(0, 217, 255, 0.1)' }}
              >
                <CheckCircle style={{ color: '#00d9ff' }} size={40} />
              </div>
              <h2
                className="text-3xl font-bold mb-4"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  color: '#1a1a1a'
                }}
              >
                You're Subscribed!
              </h2>
              <p className="text-lg font-light mb-6" style={{ color: '#4a4a4a' }}>
                We'll send you weekly newsletters at <span style={{ color: '#00d9ff', fontWeight: '500' }}>{email}</span>
              </p>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem('aviera_news_subscribed');
                    setIsSubscribed(false);
                    setEmail('');
                  }
                }}
                className="text-sm transition-colors"
                style={{ color: '#6b7280' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#00d9ff'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
              >
                Unsubscribe
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Latest Newsletter Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                color: '#1a1a1a'
              }}
            >
              Latest Edition
            </h2>
            <p className="text-lg font-light" style={{ color: '#4a4a4a' }}>
              Our most recent newsletter
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12" style={{ color: '#6b7280' }}>
              Loading newsletters...
            </div>
          ) : latestNewsletter ? (
            <div
              className="rounded-2xl p-8 md:p-12 transition-all duration-300"
              style={{
                background: '#ffffff',
                border: '1px solid #e0e0e0',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 217, 255, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.08)';
                e.currentTarget.style.borderColor = '#e0e0e0';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
                  style={{
                    background: 'rgba(0, 217, 255, 0.1)',
                    color: '#00d9ff',
                  }}
                >
                  Latest
                </span>
                <span className="flex items-center gap-2 text-sm font-light" style={{ color: '#6b7280' }}>
                  <Calendar size={16} />
                  {formatDate(latestNewsletter.published_date)}
                </span>
              </div>

              <h3
                className="text-2xl md:text-3xl font-bold mb-4"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  color: '#1a1a1a'
                }}
              >
                {latestNewsletter.title}
              </h3>

              <p className="text-lg font-light mb-6 leading-relaxed" style={{ color: '#4a4a4a' }}>
                {latestNewsletter.excerpt}
              </p>

              <Link
                href={`/news/${latestNewsletter.id}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                style={{
                  background: '#00d9ff',
                  color: '#ffffff',
                  boxShadow: '0 0 20px rgba(0, 217, 255, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 217, 255, 0.5)';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.3)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                Read Full Newsletter
                <ArrowRight size={20} />
              </Link>
            </div>
          ) : (
            <div
              className="rounded-2xl p-8 md:p-12 text-center"
              style={{
                background: '#ffffff',
                border: '1px solid #e0e0e0',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
              }}
            >
              <p className="text-lg font-light mb-4" style={{ color: '#4a4a4a' }}>
                No newsletters published yet. Subscribe to be notified when the first edition drops!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* What You Get Section - 3 Focused Categories */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                color: '#1a1a1a'
              }}
            >
              Three Things That Matter
            </h2>
            <p className="text-lg font-light" style={{ color: '#4a4a4a' }}>
              Focused. Actionable. Under 2 minutes to read.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {/* Section 1: Fitness */}
            <div
              className="rounded-2xl p-6 md:p-8 transition-all duration-300"
              style={{
                background: '#ffffff',
                border: '1px solid #e0e0e0',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 217, 255, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                e.currentTarget.style.borderColor = '#e0e0e0';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'rgba(0, 217, 255, 0.1)' }}
              >
                <Dumbbell style={{ color: '#00d9ff' }} size={32} />
              </div>
              <h3
                className="text-xl font-bold mb-3"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  color: '#1a1a1a'
                }}
              >
                Fitness
              </h3>
              <p className="font-light leading-relaxed" style={{ color: '#4a4a4a' }}>
                One actionable training insight to improve your performance this week.
              </p>
            </div>

            {/* Section 2: Supplements & Peptides */}
            <div
              className="rounded-2xl p-6 md:p-8 transition-all duration-300"
              style={{
                background: '#ffffff',
                border: '1px solid #e0e0e0',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 217, 255, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                e.currentTarget.style.borderColor = '#e0e0e0';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'rgba(0, 217, 255, 0.1)' }}
              >
                <Pill style={{ color: '#00d9ff' }} size={32} />
              </div>
              <h3
                className="text-xl font-bold mb-3"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  color: '#1a1a1a'
                }}
              >
                Supplements & Peptides
              </h3>
              <p className="font-light leading-relaxed" style={{ color: '#4a4a4a' }}>
                The latest research and what actually works, without the hype.
              </p>
            </div>

            {/* Section 3: Health & Lifestyle */}
            <div
              className="rounded-2xl p-6 md:p-8 transition-all duration-300"
              style={{
                background: '#ffffff',
                border: '1px solid #e0e0e0',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 217, 255, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                e.currentTarget.style.borderColor = '#e0e0e0';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'rgba(0, 217, 255, 0.1)' }}
              >
                <Heart style={{ color: '#00d9ff' }} size={32} />
              </div>
              <h3
                className="text-xl font-bold mb-3"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  color: '#1a1a1a'
                }}
              >
                Health & Lifestyle
              </h3>
              <p className="font-light leading-relaxed" style={{ color: '#4a4a4a' }}>
                Sleep, recovery, and mental focus tips you can use immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Archive Section */}
      {newsletterArchive.length > 0 && (
        <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  color: '#1a1a1a'
                }}
              >
                Newsletter Archive
              </h2>
              <p className="text-lg font-light" style={{ color: '#4a4a4a' }}>
                Browse past editions
              </p>
            </div>

            <div className="space-y-4">
              {newsletterArchive.map((newsletter, index) => (
                <Link
                  key={newsletter.id}
                  href={`/news/${newsletter.id}`}
                  className="block rounded-2xl p-6 md:p-8 transition-all duration-300 cursor-pointer"
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e0e0e0',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 217, 255, 0.15)';
                    e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
                    e.currentTarget.style.transform = 'translateX(8px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                    e.currentTarget.style.borderColor = '#e0e0e0';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className="text-sm font-light"
                          style={{ color: '#00d9ff' }}
                        >
                          {formatDate(newsletter.published_date)}
                        </span>
                        <span style={{ color: '#6b7280' }}>•</span>
                        <span
                          className="text-sm font-light"
                          style={{ color: '#6b7280' }}
                        >
                          Edition #{newsletterArchive.length - index + 1}
                        </span>
                      </div>
                      <h3
                        className="text-xl md:text-2xl font-bold mb-2"
                        style={{
                          fontFamily: 'Montserrat, sans-serif',
                          color: '#1a1a1a'
                        }}
                      >
                        {newsletter.title}
                      </h3>
                      <p className="font-light" style={{ color: '#4a4a4a' }}>
                        {newsletter.excerpt}
                      </p>
                    </div>
                    <ArrowRight
                      className="flex-shrink-0 transition-transform duration-300"
                      style={{ color: '#00d9ff' }}
                      size={24}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA Section */}
      {!isSubscribed && (
        <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div
              className="rounded-2xl p-8 md:p-12 transition-all duration-300"
              style={{
                background: '#ffffff',
                border: '1px solid #e0e0e0',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
              }}
            >
              <h2
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  color: '#1a1a1a'
                }}
              >
                Train Hard. Recover Smarter.
              </h2>
              <p className="text-lg mb-8 font-light max-w-2xl mx-auto" style={{ color: '#4a4a4a' }}>
                Get the insights that matter. No information overload. Just what you need to perform.
              </p>
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('input[type="email"]')?.focus();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
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
                Subscribe Now
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

/*
========================================
BACKUP: Original Vertical Lines Animation
========================================
To restore this animation, replace lines 113-266 with the code below.

Original animated background code (vertical breathing lines):
Lines 113-266 contain 4 vertical lines on each side with traveling glow orbs
*/
