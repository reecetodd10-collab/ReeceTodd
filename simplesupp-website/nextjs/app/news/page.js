'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { Mail, CheckCircle } from 'lucide-react';
import { useSupabaseUser } from '../components/SupabaseAuthProvider';

// ─── Scroll-triggered fade-up wrapper ───
function FadeInSection({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Sticky Navigation ───
function StickyNav({ menuOpen, setMenuOpen }) {
  const { user, session, signOut } = useSupabaseUser();
  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: '#000000',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="max-w-[430px] mx-auto flex items-center justify-between px-4 py-3">
          <Link
            href="/home"
            className="no-underline"
            style={{
              fontFamily: 'var(--font-oswald), Oswald, sans-serif',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.4em',
              color: '#00ffcc',
              textTransform: 'uppercase',
              textDecoration: 'none',
            }}
          >
            ◉ Aviera
          </Link>

          {/* Desktop links - hidden */}
          <div className="hidden">
            {/* Nav links removed - use hamburger menu */}
          </div>

          {/* User icon + hamburger */}
          <div className="flex items-center gap-3">
            <Link
              href="/auth"
              className="flex items-center justify-center no-underline"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'transparent',
                color: '#ffffff',
                textDecoration: 'none',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </Link>
            <button
              className="flex flex-col gap-[5px] bg-transparent border-none cursor-pointer p-1"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <span className="block w-5 h-[2px] bg-white" />
              <span className="block w-5 h-[2px] bg-white" />
              <span className="block w-5 h-[2px] bg-white" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center"
          style={{ background: '#000000' }}
        >
          <button
            className="absolute top-4 right-4 bg-transparent border-none cursor-pointer"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            style={{
              fontFamily: 'var(--font-oswald), Oswald, sans-serif',
              fontSize: '28px',
              color: '#fff',
            }}
          >
            ✕
          </button>

          <div className="flex flex-col items-center gap-8">
            {[
              { label: 'Shop', href: '/shop' },
              { label: 'Flow State X', href: '/nitric' },
              { label: 'Trybe', href: '/trybe' },
              { label: 'Optimize Quiz', href: '/supplement-optimization-score' },
              { label: 'Latest', href: '/news' },
              { label: 'About', href: '/about' },
              { label: 'My Stack', href: '/dashboard' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                  fontSize: '24px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#ffffff',
                  textDecoration: 'none',
                  letterSpacing: '0.1em',
                }}
              >
                {link.label}
              </Link>
            ))}
            {session ? (
              <button
                onClick={async () => {
                  await signOut();
                  setMenuOpen(false);
                  window.location.href = '/auth';
                }}
                style={{
                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                  fontSize: '24px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#ff2d55',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  letterSpacing: '0.1em',
                  padding: 0,
                  textAlign: 'left',
                }}
              >
                SIGN OUT
              </button>
            ) : (
              <Link
                href="/auth"
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                  fontSize: '24px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#ffffff',
                  textDecoration: 'none',
                  letterSpacing: '0.1em',
                }}
              >
                SIGN IN
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ─── Category config ───
const CATEGORIES = [
  {
    key: 'supplements',
    label: 'Supps & Peptides',
    tagline: "The Latest in Supplements",
    accent: '#00ffcc',
    dbKey: 'supplements',
  },
  {
    key: 'fitness',
    label: 'Fitness',
    tagline: "The Latest in Fitness",
    accent: '#ff2d55',
    dbKey: 'fitness',
  },
  {
    key: 'fitness-socials',
    label: 'Fitness Socials',
    tagline: "The Latest in Fitness Socials",
    accent: '#a855f7',
    dbKey: 'fitness_socials',
  },
];

// ─── Category classification ───
function classifyNewsletter(newsletter) {
  const title = (newsletter.title || '').toLowerCase();
  const category = (newsletter.category || '').toLowerCase();
  const tags = (newsletter.tags || []).map((t) => t.toLowerCase());
  const all = `${title} ${category} ${tags.join(' ')}`;

  const socialKeywords = [
    'soosh', 'alex eubank', 'togi', 'tren twins', 'cbum', 'sam sulek',
    'lexx little', 'jesse james west', 'mpmd', 'greg doucette', 'noel deyzel',
    'influencer', 'youtuber', 'tiktok', 'instagram', 'viral', 'drama', 'collab', 'social',
  ];
  if (socialKeywords.some((k) => all.includes(k))) return 'fitness-socials';

  const suppKeywords = [
    'supplement', 'creatine', 'vitamin', 'protein', 'peptide', 'bpc',
    'semaglutide', 'mk-677', 'sarm', 'nootropic', 'ashwagandha',
    'pre-workout', 'preworkout', 'stack', 'dose', 'formula', 'ingredient',
    'turkesterone', 'tongkat', 'fadogia',
  ];
  if (suppKeywords.some((k) => all.includes(k))) return 'supplements';

  const fitnessKeywords = [
    'fitness', 'workout', 'training', 'muscle', 'gym', 'bulk', 'cut',
    'strength', 'hypertrophy', 'program', 'recovery', 'sleep', 'diet',
    'nutrition', 'macro', 'cardio', 'gains',
  ];
  if (fitnessKeywords.some((k) => all.includes(k))) return 'fitness';

  return 'supplements';
}

export default function LatestPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [newsletters, setNewsletters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // Category subscribe toggles
  const [subSupps, setSubSupps] = useState(true);
  const [subFitness, setSubFitness] = useState(true);
  const [subSocials, setSubSocials] = useState(true);

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
        body: JSON.stringify({
          email,
          sub_supplements: subSupps,
          sub_fitness: subFitness,
          sub_fitness_socials: subSocials,
        }),
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
    ...CATEGORIES.map((c) => ({ key: c.key, label: c.label })),
  ];

  const classifiedNewsletters = newsletters.map((n) => ({
    ...n,
    _category: classifyNewsletter(n),
  }));

  const filteredNewsletters =
    activeTab === 'all'
      ? classifiedNewsletters
      : classifiedNewsletters.filter((n) => n._category === activeTab);

  const getCatConfig = (key) => CATEGORIES.find((c) => c.key === key) || CATEGORIES[0];

  return (
    <div
      className="min-h-screen relative"
      style={{ background: '#000000', color: '#ffffff', overflowX: 'hidden' }}
    >
      {/* Scanlines */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(255,255,255,0.03) 59px, rgba(255,255,255,0.03) 60px)',
        }}
      />

      <StickyNav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* ═══ HERO ═══ */}
      <section className="relative z-10 pt-20 pb-6 px-6">
        <div className="max-w-[430px] mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
          >
            <motion.div
              variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
              className="flex items-center gap-3 mb-4"
            >
              <span
                style={{
                  fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                  fontSize: '10px',
                  letterSpacing: '0.3em',
                  color: '#ff2d55',
                  textTransform: 'uppercase',
                }}
              >
                Every Sunday
              </span>
              <span
                style={{
                  display: 'inline-block',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#ff2d55',
                  boxShadow: '0 0 8px rgba(255,45,85,0.4)',
                }}
              />
            </motion.div>

            <motion.h1
              variants={{ hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0 } }}
              className="font-bold uppercase leading-[0.85] mb-4"
              style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontSize: '48px',
              }}
            >
              THE
              <br />
              <span style={{ color: '#00ffcc' }}>LATEST</span>
              <br />
              FROM AVIERA
            </motion.h1>

            <motion.p
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              style={{
                fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                fontSize: '12px',
                color: '#888',
                lineHeight: 1.7,
              }}
            >
              Giving you the latest in supplements, fitness, and the creators running the game.{' '}
              <span style={{ color: '#ff2d55' }}>No fluff.</span>
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ═══ 3 CATEGORY CARDS ═══ */}
      <section
        className="relative z-10 py-6 px-6"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div className="max-w-[430px] mx-auto space-y-3">
          {CATEGORIES.map((cat, i) => (
            <FadeInSection key={cat.key} delay={i * 0.1}>
              <div
                className="p-4"
                style={{
                  background: '#0a0a0a',
                  border: `1px solid ${cat.accent}15`,
                  borderLeft: `3px solid ${cat.accent}`,
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    style={{
                      fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                      fontSize: '14px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: cat.accent,
                    }}
                  >
                    {cat.tagline}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                      fontSize: '8px',
                      color: '#444',
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                    }}
                  >
                    Weekly
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                    fontSize: '11px',
                    color: '#666',
                    lineHeight: 1.6,
                  }}
                >
                  {cat.key === 'supplements' &&
                    "What's new in supps and peptides. Ingredient spotlights, stack breakdowns, and what actually works — straight to the point."}
                  {cat.key === 'fitness' &&
                    "Training trends, program intel, and recovery hacks. The stuff that moves the needle in the gym."}
                  {cat.key === 'fitness-socials' &&
                    "Who's up, who's down, and who just dropped a collab. The fitness creator scene, decoded."}
                </p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* ═══ SUBSCRIBE ═══ */}
      <section
        className="relative z-10 py-8 px-6"
        style={{
          background: '#0a0a0a',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        <div className="max-w-[430px] mx-auto">
          <FadeInSection>
            <p
              className="mb-1"
              style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontSize: '18px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#fff',
              }}
            >
              Get the <span style={{ color: '#ff2d55' }}>drop</span> every Sunday
            </p>
            <p
              className="mb-4"
              style={{
                fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                fontSize: '10px',
                color: '#555',
              }}
            >
              Pick your categories. Unsubscribe anytime.
            </p>

            {/* Category toggles */}
            {!isSubscribed && (
              <div className="flex flex-wrap gap-2 mb-4">
                {[
                  { label: 'Supps & Peptides', active: subSupps, toggle: () => setSubSupps(!subSupps), accent: '#00ffcc' },
                  { label: 'Fitness', active: subFitness, toggle: () => setSubFitness(!subFitness), accent: '#ff2d55' },
                  { label: 'Fitness Socials', active: subSocials, toggle: () => setSubSocials(!subSocials), accent: '#a855f7' },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={opt.toggle}
                    style={{
                      fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                      fontSize: '9px',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      padding: '6px 12px',
                      background: opt.active ? `${opt.accent}15` : 'transparent',
                      color: opt.active ? opt.accent : '#444',
                      border: `1px solid ${opt.active ? `${opt.accent}40` : 'rgba(255,255,255,0.08)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {opt.active ? '✓ ' : ''}{opt.label}
                  </button>
                ))}
              </div>
            )}

            {!isSubscribed ? (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="flex-1 px-4 py-3 outline-none"
                  style={{
                    fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                    fontSize: '12px',
                    background: '#000',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#ffffff',
                    minHeight: '44px',
                  }}
                />
                <button
                  type="submit"
                  className="px-5 py-3 font-bold uppercase flex items-center gap-2 flex-shrink-0"
                  style={{
                    fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                    fontSize: '13px',
                    letterSpacing: '0.1em',
                    background: '#ff2d55',
                    color: '#fff',
                    minHeight: '44px',
                    border: 'none',
                    cursor: 'pointer',
                    textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                  }}
                >
                  <Mail size={14} />
                  Subscribe
                </button>
              </form>
            ) : (
              <div
                className="flex items-center gap-3 px-4 py-3"
                style={{
                  background: 'rgba(0,255,204,0.05)',
                  border: '1px solid rgba(0,255,204,0.15)',
                }}
              >
                <CheckCircle size={16} style={{ color: '#00ffcc' }} />
                <span
                  style={{
                    fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                    fontSize: '11px',
                    color: '#999',
                  }}
                >
                  Subscribed as <span style={{ color: '#00ffcc' }}>{email}</span>
                </span>
              </div>
            )}

            {submitted && (
              <div
                className="flex items-center gap-2 mt-3 px-4 py-2"
                style={{
                  background: 'rgba(255,45,85,0.08)',
                  border: '1px solid rgba(255,45,85,0.2)',
                }}
              >
                <CheckCircle size={14} style={{ color: '#ff2d55' }} />
                <span
                  style={{
                    fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                    fontSize: '11px',
                    color: '#ff2d55',
                  }}
                >
                  You&apos;re in. First drop this Sunday.
                </span>
              </div>
            )}
          </FadeInSection>
        </div>
      </section>

      {/* ═══ CATEGORY FILTER TABS ═══ */}
      <section className="relative z-10 pt-8 px-6 pb-4">
        <div className="max-w-[430px] mx-auto">
          <FadeInSection>
            <p
              className="mb-3"
              style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontSize: '13px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: '#fff',
              }}
            >
              Past Drops
            </p>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {tabs.map((tab) => {
                const catConfig = CATEGORIES.find((c) => c.key === tab.key);
                const tabAccent = catConfig ? catConfig.accent : '#00ffcc';
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className="flex-shrink-0 px-4 py-2 uppercase whitespace-nowrap transition-all"
                    style={{
                      fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                      fontSize: '10px',
                      letterSpacing: '0.12em',
                      background: isActive ? (tab.key === 'all' ? '#00ffcc' : tabAccent) : 'transparent',
                      color: isActive ? (tab.key === 'fitness' || tab.key === 'fitness-socials' ? '#fff' : '#000') : '#555',
                      border: isActive
                        ? `1px solid ${tab.key === 'all' ? '#00ffcc' : tabAccent}`
                        : '1px solid rgba(255,255,255,0.08)',
                      cursor: 'pointer',
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ═══ NEWSLETTER LIST ═══ */}
      <section className="relative z-10 px-6 pb-16">
        <div className="max-w-[430px] mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div
                className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: '#00ffcc', borderTopColor: 'transparent' }}
              />
            </div>
          ) : filteredNewsletters.length === 0 ? (
            <FadeInSection>
              <div
                className="p-8 text-center"
                style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div
                  className="mb-3"
                  style={{
                    fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                    fontSize: '10px',
                    letterSpacing: '0.3em',
                    color: '#ff2d55',
                    textTransform: 'uppercase',
                  }}
                >
                  Dropping Soon
                </div>
                <h3
                  className="font-bold uppercase mb-2"
                  style={{
                    fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                    fontSize: '22px',
                    color: '#ffffff',
                  }}
                >
                  First Drop This Sunday
                </h3>
                <p
                  className="mb-5"
                  style={{
                    fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                    fontSize: '11px',
                    color: '#555',
                    lineHeight: 1.6,
                  }}
                >
                  Three quick reads covering supplements, fitness, and the creators shaping the game. Subscribe above to get it in your inbox.
                </p>

                {/* Preview cards */}
                <div className="space-y-2 text-left">
                  {CATEGORIES.map((cat) => (
                    <div
                      key={cat.key}
                      className="p-3 flex items-center gap-3"
                      style={{
                        background: '#000',
                        border: `1px solid ${cat.accent}15`,
                        borderLeft: `2px solid ${cat.accent}`,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                          fontSize: '11px',
                          fontWeight: 700,
                          color: cat.accent,
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {cat.tagline}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                          fontSize: '9px',
                          color: '#333',
                        }}
                      >
                        — Coming Sunday
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeInSection>
          ) : (
            <div className="space-y-3">
              {filteredNewsletters.map((newsletter, i) => {
                const cat = newsletter._category;
                const config = getCatConfig(cat);
                return (
                  <FadeInSection key={newsletter.id} delay={i * 0.06}>
                    <Link
                      href={`/news/${newsletter.id}`}
                      className="block p-4 transition-all"
                      style={{
                        background: '#0a0a0a',
                        border: '1px solid rgba(255,255,255,0.04)',
                        borderLeft: `3px solid ${config.accent}`,
                        textDecoration: 'none',
                      }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className="px-2 py-0.5 uppercase"
                          style={{
                            fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                            fontSize: '8px',
                            letterSpacing: '0.15em',
                            background: `${config.accent}12`,
                            color: config.accent,
                            border: `1px solid ${config.accent}25`,
                          }}
                        >
                          {config.tagline}
                        </span>
                        <span
                          style={{
                            fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                            fontSize: '9px',
                            color: '#333',
                          }}
                        >
                          {formatDate(newsletter.published_date)}
                        </span>
                      </div>

                      <h3
                        className="font-bold uppercase mb-1 leading-tight"
                        style={{
                          fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                          fontSize: '16px',
                          color: '#ffffff',
                        }}
                      >
                        {newsletter.title}
                      </h3>

                      {newsletter.excerpt && (
                        <p
                          className="line-clamp-2 mb-2"
                          style={{
                            fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                            fontSize: '11px',
                            color: '#555',
                            lineHeight: 1.6,
                          }}
                        >
                          {newsletter.excerpt}
                        </p>
                      )}

                      <span
                        className="uppercase inline-flex items-center gap-1"
                        style={{
                          fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                          fontSize: '9px',
                          letterSpacing: '0.15em',
                          color: config.accent,
                        }}
                      >
                        Read &rarr;
                      </span>
                    </Link>
                  </FadeInSection>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ═══ BOTTOM NAV ═══ */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        style={{
          background: 'rgba(0,0,0,0.95)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="max-w-[430px] mx-auto flex justify-around py-2">
          {[
            { label: 'Home', href: '/home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4' },
            { label: 'Shop', href: '/shop', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
            { label: 'Trybe', href: '/trybe', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
            { label: 'Optimize Quiz', href: '/supplement-optimization-score', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-0.5 py-1 px-3"
              style={{ textDecoration: 'none', minWidth: '48px', minHeight: '48px' }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#666"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={item.icon} />
              </svg>
              <span
                style={{
                  fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                  fontSize: '8px',
                  color: '#666',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </nav>

      {/* ═══ FOOTER ═══ */}
      <footer
        className="relative z-10 py-12 px-6"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="max-w-[430px] mx-auto text-center">
          <p
            className="mb-4"
            style={{
              fontFamily: 'var(--font-oswald), Oswald, sans-serif',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.4em',
              color: '#00ffcc',
              textTransform: 'uppercase',
            }}
          >
            ◉ Aviera
          </p>
          <p
            className="mb-2"
            style={{
              fontFamily: 'var(--font-space-mono), Space Mono, monospace',
              fontSize: '9px',
              color: '#444',
              lineHeight: 1.6,
            }}
          >
            Manufactured in the USA in a GMP-certified facility.
          </p>
          <p
            className="mb-4"
            style={{
              fontFamily: 'var(--font-space-mono), Space Mono, monospace',
              fontSize: '9px',
              color: '#333',
              lineHeight: 1.6,
            }}
          >
            *These statements have not been evaluated by the FDA. This product is not intended to
            diagnose, treat, cure, or prevent any disease.
          </p>
          <p
            style={{
              fontFamily: 'var(--font-space-mono), Space Mono, monospace',
              fontSize: '9px',
              color: '#333',
            }}
          >
            &copy; {new Date().getFullYear()} Aviera. All rights reserved.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '12px' }}>
            <a href="https://instagram.com/avierafit" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ color: '#444', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#00ffcc'} onMouseLeave={e => e.currentTarget.style.color = '#444'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="https://tiktok.com/@avierafit" target="_blank" rel="noopener noreferrer" aria-label="TikTok" style={{ color: '#444', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#00ffcc'} onMouseLeave={e => e.currentTarget.style.color = '#444'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.98a8.21 8.21 0 0 0 4.76 1.52V7.05a4.84 4.84 0 0 1-1-.36z"/></svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
