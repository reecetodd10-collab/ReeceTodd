'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Mail, Sparkles, Calendar, ArrowRight, CheckCircle, TrendingUp, BookOpen, Zap } from 'lucide-react';
import OptimizedImage from '../components/OptimizedImage';
import Link from 'next/link';

export default function NewsPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email) {
      // Store email in localStorage (can be sent to backend/API later)
      if (typeof window !== 'undefined') {
        localStorage.setItem('aviera_news_subscribed', email);
        setIsSubscribed(true);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        
        // TODO: Send to backend API endpoint
        // await fetch('/api/newsletter/subscribe', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ email })
        // });
      }
    }
  };

  // Placeholder newsletter data structure
  const upcomingFeatures = [
    {
      icon: TrendingUp,
      title: 'Weekly Research Roundup',
      description: 'AI-curated summaries of the latest fitness and supplement research published each week.',
    },
    {
      icon: BookOpen,
      title: 'Expert Insights',
      description: 'Deep dives into supplement science, workout optimization, and nutrition strategies.',
    },
    {
      icon: Zap,
      title: 'Industry Trends',
      description: 'Stay ahead with analysis of emerging trends in fitness, wellness, and supplementation.',
    },
  ];

  return (
    <div className="relative min-h-screen bg-[var(--bg)]">
      {/* Background with subtle pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-[var(--bg-elev-1)] to-[var(--bg)]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-[var(--acc)]/20 rounded-3xl blur-2xl"></div>
              <div 
                className="relative w-24 h-24 bg-[var(--charcoal-light)] rounded-3xl flex items-center justify-center shadow-premium-lg border border-[var(--border)] transition-all duration-300"
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 40px rgba(0, 217, 255, 0.6), 0 8px 32px rgba(0, 0, 0, 0.4)';
                  e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                <Newspaper className="text-[var(--acc)]" size={48} />
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-normal text-[var(--txt)] mb-6" style={{ letterSpacing: '2px' }}>
            Aviera News
          </h1>
          <p className="text-xl md:text-2xl text-[var(--acc)] font-light mb-4" style={{ letterSpacing: '5px' }}>
            AI-Curated Weekly Newsletter
          </p>
          <p className="text-lg text-[var(--txt-muted)] font-light max-w-2xl mx-auto">
            Get the latest fitness and supplement insights delivered to your inbox every week.
          </p>
        </motion.div>

        {/* Subscription Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <div 
            className="glass-card p-8 md:p-12 transition-all duration-300"
            style={{
              background: 'rgba(30, 30, 30, 0.95)',
              border: '1px solid rgba(0, 217, 255, 0.3)',
              borderRadius: '24px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 30px rgba(0, 217, 255, 0.3)';
              e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4)';
              e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
            }}
          >
            {!isSubscribed ? (
              <>
                <div className="text-center mb-8">
                  <Sparkles className="text-[var(--acc)] mx-auto mb-4" size={48} />
                  <h2 className="text-3xl md:text-4xl font-normal text-[var(--txt)] mb-4">
                    Subscribe to Aviera News
                  </h2>
                  <p className="text-lg text-[var(--txt-muted)] font-light leading-relaxed max-w-2xl mx-auto">
                    Join thousands of fitness enthusiasts getting weekly AI-curated insights on supplements, workouts, and nutrition science.
                  </p>
                </div>

                {/* Email Signup Form */}
                <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      className="flex-1 rounded-xl text-white font-normal transition-all duration-300"
                      style={{
                        height: '56px',
                        fontSize: '16px',
                        padding: '16px 20px',
                        background: 'rgba(10, 10, 10, 0.8)',
                        border: '1px solid rgba(0, 217, 255, 0.3)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.7)';
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.2)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                      }}
                    />
                    <button
                      type="submit"
                      className="btn-primary px-8 py-3 h-[56px] flex items-center justify-center gap-2 whitespace-nowrap"
                      style={{
                        boxShadow: '0 0 25px rgba(0, 217, 255, 0.5)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 217, 255, 0.7)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 217, 255, 0.5)';
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
                      className="mt-4 text-center text-sm text-[var(--acc)] font-light flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={16} />
                      Thanks! You're subscribed. Check your email for confirmation.
                    </motion.p>
                  )}
                </form>
              </>
            ) : (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-[var(--acc)]/20 rounded-full mb-6">
                  <CheckCircle className="text-[var(--acc)]" size={40} />
                </div>
                <h2 className="text-3xl font-normal text-[var(--txt)] mb-4">
                  You're Subscribed!
                </h2>
                <p className="text-lg text-[var(--txt-muted)] font-light mb-6">
                  We'll send you weekly newsletters at <span className="text-[var(--acc)]">{email}</span>
                </p>
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      localStorage.removeItem('aviera_news_subscribed');
                      setIsSubscribed(false);
                      setEmail('');
                    }
                  }}
                  className="text-sm text-[var(--txt-muted)] hover:text-[var(--acc)] transition-colors"
                >
                  Unsubscribe
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Upcoming Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-normal text-[var(--txt)] mb-8 text-center">
            What to Expect
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {upcomingFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  className="glass-card p-6 transition-all duration-300"
                  style={{
                    background: 'rgba(30, 30, 30, 0.9)',
                    border: '1px solid rgba(0, 217, 255, 0.3)',
                    borderRadius: '20px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 25px rgba(0, 217, 255, 0.4)';
                    e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.6)';
                    e.currentTarget.style.transform = 'translateY(-5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
                    e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div className="w-16 h-16 bg-[var(--acc)]/20 rounded-2xl flex items-center justify-center mb-4">
                    <Icon className="text-[var(--acc)]" size={32} />
                  </div>
                  <h3 className="text-xl font-normal text-[var(--txt)] mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-[var(--txt-muted)] font-light leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Newsletter Archive Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-normal text-[var(--txt)]">
              Newsletter Archive
            </h2>
            <div className="flex items-center gap-2 text-[var(--txt-muted)] text-sm">
              <Calendar size={18} />
              <span>Weekly editions</span>
            </div>
          </div>

          {/* Placeholder for newsletter articles */}
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="glass-card p-6 transition-all duration-300 cursor-pointer"
                style={{
                  background: 'rgba(30, 30, 30, 0.9)',
                  border: '1px solid rgba(0, 217, 255, 0.2)',
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 217, 255, 0.3)';
                  e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.5)';
                  e.currentTarget.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
                  e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.2)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm text-[var(--acc)] font-light">Coming Soon</span>
                      <span className="text-sm text-[var(--txt-muted)]">•</span>
                      <span className="text-sm text-[var(--txt-muted)] font-light">Weekly Edition #{item}</span>
                    </div>
                    <h3 className="text-xl font-normal text-[var(--txt)] mb-2">
                      Newsletter Title Placeholder
                    </h3>
                    <p className="text-[var(--txt-muted)] font-light">
                      This is where newsletter articles will appear once the automated system is live.
                    </p>
                  </div>
                  <ArrowRight className="text-[var(--acc)] flex-shrink-0" size={24} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <div 
            className="glass-card p-8 md:p-12 transition-all duration-300"
            style={{
              background: 'rgba(30, 30, 30, 0.95)',
              border: '1px solid rgba(0, 217, 255, 0.3)',
              borderRadius: '24px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 30px rgba(0, 217, 255, 0.3)';
              e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4)';
              e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
            }}
          >
            <h2 className="text-3xl md:text-4xl font-normal text-[var(--txt)] mb-4">
              Ready to Stay Informed?
            </h2>
            <p className="text-lg text-[var(--txt-muted)] font-light mb-8 max-w-2xl mx-auto">
              Join our community and never miss the latest insights in fitness and supplementation.
            </p>
            {!isSubscribed && (
              <Link
                href="#subscribe"
                className="btn-primary inline-flex items-center gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('input[type="email"]')?.focus();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Subscribe Now
                <ArrowRight size={20} />
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
