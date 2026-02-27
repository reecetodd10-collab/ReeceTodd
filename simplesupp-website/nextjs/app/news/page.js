'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Calendar, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function NewsPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [newsletters, setNewsletters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const subscribedEmail = localStorage.getItem('aviera_news_subscribed');
      if (subscribedEmail) {
        setIsSubscribed(true);
        setEmail(subscribedEmail);
      }
    }
  }, []);

  useEffect(() => {
    const fetchNewsletters = async () => {
      try {
        const response = await fetch('/api/newsletters?limit=20');
        const data = await response.json();
        if (data.newsletters && data.newsletters.length > 0) {
          setNewsletters(data.newsletters);
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
    if (!email) return;
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (response.ok) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('aviera_news_subscribed', email);
          setIsSubscribed(true);
          setSubmitted(true);
          setTimeout(() => setSubmitted(false), 3000);
        }
      } else {
        alert(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      alert('Network error. Please check your connection and try again.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'fitness', label: 'Fitness' },
    { key: 'supplements', label: 'Supplements' },
    { key: 'health', label: 'Health & Lifestyle' },
  ];

  // Category emoji mapping
  const getCategoryEmoji = (newsletter) => {
    const title = (newsletter.title || '').toLowerCase();
    const category = (newsletter.category || '').toLowerCase();
    const tags = (newsletter.tags || []).map(t => t.toLowerCase());
    const all = `${title} ${category} ${tags.join(' ')}`;

    if (all.includes('fitness') || all.includes('workout') || all.includes('training') || all.includes('muscle')) return '💪';
    if (all.includes('supplement') || all.includes('creatine') || all.includes('vitamin') || all.includes('protein')) return '⚡';
    if (all.includes('health') || all.includes('sleep') || all.includes('recovery') || all.includes('lifestyle')) return '❤️';
    return '⚡'; // default
  };

  // Category label for tag
  const getCategoryLabel = (newsletter) => {
    const emoji = getCategoryEmoji(newsletter);
    if (emoji === '💪') return 'Fitness';
    if (emoji === '❤️') return 'Health & Lifestyle';
    return 'Supplements';
  };

  // Filter by tab
  const filteredNewsletters = activeTab === 'all'
    ? newsletters
    : newsletters.filter(n => {
        const label = getCategoryLabel(n).toLowerCase();
        if (activeTab === 'fitness') return label === 'fitness';
        if (activeTab === 'supplements') return label === 'supplements';
        if (activeTab === 'health') return label.includes('health');
        return true;
      });

  const hasNewsletters = newsletters.length > 0;

  return (
    <div className="relative min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Cyan glow backdrop */}
      <div className="absolute top-0 left-0 right-0 h-[400px] pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(0,217,255,0.06), transparent 60%)' }} />

      <div className="relative z-10 px-5 pt-8 pb-24 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-bold mb-1" style={{ fontSize: '22px', color: 'var(--txt)' }}>
            Newsletter Hub
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--txt-muted)' }}>
            Weekly insights on fitness, supplements & health. Every Sunday.
          </p>
        </div>

        {/* Subscribe bar */}
        {!isSubscribed ? (
          <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              required
              className="flex-1 px-4 py-2.5 rounded-[10px] outline-none"
              style={{
                fontSize: '13px',
                background: 'var(--bg-elev-1)',
                border: '1px solid var(--border)',
                color: 'var(--txt)',
                minHeight: '44px',
              }}
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-[10px] font-semibold flex items-center gap-1.5 flex-shrink-0"
              style={{ fontSize: '13px', background: '#00d9ff', color: '#09090b', minHeight: '44px' }}
            >
              <Mail size={14} />
              Subscribe
            </button>
          </form>
        ) : (
          <div
            className="flex items-center gap-2 mb-6 px-4 py-3 rounded-[10px]"
            style={{ background: 'rgba(0,217,255,0.08)', border: '1px solid rgba(0,217,255,0.2)' }}
          >
            <CheckCircle size={16} style={{ color: '#00d9ff' }} />
            <span style={{ fontSize: '13px', color: 'var(--txt-muted)' }}>
              Subscribed as <span style={{ color: '#00d9ff' }}>{email}</span>
            </span>
          </div>
        )}

        {submitted && (
          <div className="flex items-center gap-2 mb-4 px-4 py-2 rounded-[10px]" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
            <CheckCircle size={14} style={{ color: '#10b981' }} />
            <span style={{ fontSize: '12px', color: '#10b981' }}>You&apos;re subscribed!</span>
          </div>
        )}

        {/* Tab chips */}
        <div className="flex gap-2 overflow-x-auto mb-5 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex-shrink-0 px-4 py-[7px] rounded-full whitespace-nowrap transition-all"
              style={{
                fontSize: '12px',
                fontWeight: activeTab === tab.key ? 600 : 500,
                background: activeTab === tab.key ? '#00d9ff' : 'transparent',
                color: activeTab === tab.key ? '#09090b' : 'var(--txt-muted)',
                border: activeTab === tab.key ? '1px solid #00d9ff' : '1px solid var(--border)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-[#00d9ff] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !hasNewsletters ? (
          /* Empty state */
          <div
            className="rounded-[14px] p-6 text-center"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <p className="text-4xl mb-3">📰</p>
            <h3 className="text-[15px] font-bold mb-1" style={{ color: 'var(--txt)' }}>
              No articles yet — check back Sunday!
            </h3>
            <p className="text-[12px] mb-5" style={{ color: 'var(--txt-muted)' }}>
              Our first newsletter drops this Sunday. Subscribe to get it.
            </p>
            {!isSubscribed && (
              <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="flex-1 px-3.5 py-2.5 rounded-[10px] outline-none text-[13px]"
                  style={{ background: 'var(--bg-elev-1)', border: '1px solid var(--border)', color: 'var(--txt)', minHeight: '44px' }}
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-[10px] text-[13px] font-semibold flex-shrink-0"
                  style={{ background: '#00d9ff', color: '#09090b', minHeight: '44px' }}
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        ) : filteredNewsletters.length === 0 ? (
          <div
            className="rounded-[14px] p-6 text-center"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <p className="text-[13px]" style={{ color: 'var(--txt-muted)' }}>
              No articles in this category yet.
            </p>
          </div>
        ) : (
          /* Article list */
          <div className="space-y-3">
            {filteredNewsletters.map((newsletter) => {
              const emoji = getCategoryEmoji(newsletter);
              const categoryLabel = getCategoryLabel(newsletter);
              return (
                <Link
                  key={newsletter.id}
                  href={`/news/${newsletter.id}`}
                  className="flex gap-3 rounded-[14px] p-3 transition-all"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                >
                  {/* Emoji thumbnail */}
                  <div
                    className="flex-shrink-0 rounded-[10px] flex items-center justify-center"
                    style={{ width: '88px', height: '88px', background: 'var(--bg-elev-1)', fontSize: '36px' }}
                  >
                    {emoji}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className="px-1.5 py-0.5 rounded font-medium"
                        style={{ fontSize: '9px', background: 'rgba(0,217,255,0.1)', color: '#00d9ff' }}
                      >
                        {categoryLabel}
                      </span>
                      <span style={{ fontSize: '10px', color: 'var(--txt-dim)' }}>
                        {formatDate(newsletter.published_date)}
                      </span>
                    </div>
                    <h4
                      className="font-semibold line-clamp-2 mb-0.5"
                      style={{ fontSize: '13px', color: 'var(--txt)' }}
                    >
                      {newsletter.title}
                    </h4>
                    <p className="line-clamp-2" style={{ fontSize: '11px', color: 'var(--txt-muted)' }}>
                      {newsletter.excerpt}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
