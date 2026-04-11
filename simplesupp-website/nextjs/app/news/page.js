'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, CheckCircle } from 'lucide-react';
import PageLayout, { SectionBlock, FadeInSection, CTAButton, TOKENS, FONTS } from '../components/PageLayout';

// ─── Category config ───
const CATEGORIES = [
  { key: 'supplements',    label: 'Supps & Peptides', tagline: 'The Latest in Supplements',     accent: '#00e5ff', desc: "What's new in supps and peptides. Ingredient spotlights, stack breakdowns, and what actually works — straight to the point." },
  { key: 'fitness',        label: 'Fitness',          tagline: 'The Latest in Fitness',         accent: '#FF3B3B', desc: 'Training trends, program intel, and recovery hacks. The stuff that moves the needle in the gym.' },
  { key: 'fitness-socials', label: 'Fitness Socials',  tagline: 'The Latest in Fitness Socials', accent: '#a855f7', desc: "Who's up, who's down, and who just dropped a collab. The fitness creator scene, decoded." },
];

// ─── Category classification ───
function classifyNewsletter(newsletter) {
  const title = (newsletter.title || '').toLowerCase();
  const category = (newsletter.category || '').toLowerCase();
  const tags = (newsletter.tags || []).map((t) => t.toLowerCase());
  const all = `${title} ${category} ${tags.join(' ')}`;

  const socialKw = ['soosh','alex eubank','togi','tren twins','cbum','sam sulek','lexx little','jesse james west','mpmd','greg doucette','noel deyzel','influencer','youtuber','tiktok','instagram','viral','drama','collab','social'];
  if (socialKw.some((k) => all.includes(k))) return 'fitness-socials';

  const suppKw = ['supplement','creatine','vitamin','protein','peptide','bpc','semaglutide','mk-677','sarm','nootropic','ashwagandha','pre-workout','preworkout','stack','dose','formula','ingredient','turkesterone','tongkat','fadogia'];
  if (suppKw.some((k) => all.includes(k))) return 'supplements';

  const fitKw = ['fitness','workout','training','muscle','gym','bulk','cut','strength','hypertrophy','program','recovery','sleep','diet','nutrition','macro','cardio','gains'];
  if (fitKw.some((k) => all.includes(k))) return 'fitness';

  return 'supplements';
}

export default function LatestPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [newsletters, setNewsletters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const [subSupps, setSubSupps] = useState(true);
  const [subFitness, setSubFitness] = useState(true);
  const [subSocials, setSubSocials] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aviera_news_subscribed');
      if (saved) { setIsSubscribed(true); setEmail(saved); }
    }
  }, []);

  useEffect(() => {
    fetch('/api/newsletters?limit=20')
      .then((r) => r.json())
      .then((d) => { if (d.newsletters?.length) setNewsletters(d.newsletters); })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, sub_supplements: subSupps, sub_fitness: subFitness, sub_fitness_socials: subSocials }),
      });
      if (res.ok) {
        localStorage.setItem('aviera_news_subscribed', email);
        setIsSubscribed(true);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
      }
    } catch { /* silently fail */ }
  };

  const formatDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const tabs = [{ key: 'all', label: 'All' }, ...CATEGORIES.map((c) => ({ key: c.key, label: c.label, accent: c.accent }))];
  const classified = newsletters.map((n) => ({ ...n, _category: classifyNewsletter(n) }));
  const filtered = activeTab === 'all' ? classified : classified.filter((n) => n._category === activeTab);
  const getCat = (key) => CATEGORIES.find((c) => c.key === key) || CATEGORIES[0];

  return (
    <PageLayout>
      {/* ═══ HERO ═══ */}
      <section className="relative" style={{ background: '#000', paddingTop: '120px', paddingBottom: '60px', zIndex: 10 }}>
        <div className="max-w-[430px] md:max-w-5xl lg:max-w-6xl mx-auto px-5 md:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex items-center justify-center gap-3 mb-5"
          >
            <span style={{ ...FONTS.mono, fontSize: '10px', letterSpacing: '0.3em', color: TOKENS.CYAN, textTransform: 'uppercase' }}>
              Every Sunday
            </span>
            <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: TOKENS.CYAN, boxShadow: '0 0 8px rgba(0,229,255,0.5)' }} />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="text-[44px] md:text-[80px] lg:text-[104px]"
            style={{ ...FONTS.oswald, fontWeight: 700, textTransform: 'uppercase', lineHeight: 0.92, letterSpacing: '-0.02em', color: '#fff', marginBottom: '18px' }}
          >
            The <span style={{ color: TOKENS.CYAN }}>Latest</span><br />from Aviera
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="md:text-[14px]"
            style={{ ...FONTS.mono, fontSize: '12px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, maxWidth: '520px', margin: '0 auto' }}
          >
            Supplements, fitness, and the creators running the game.{' '}
            <span style={{ color: TOKENS.CYAN }}>No fluff.</span>
          </motion.p>
        </div>
      </section>

      {/* ═══ CATEGORY CARDS ═══ */}
      <SectionBlock variant="cream">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {CATEGORIES.map((cat, i) => (
            <FadeInSection key={cat.key} delay={i * 0.1}>
              <div
                className="p-5 md:p-6 h-full rounded-r-lg transition-all duration-300 hover:translate-x-1"
                style={{ background: '#ffffff', borderLeft: `3px solid ${cat.accent}`, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span style={{ ...FONTS.oswald, fontSize: '15px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: cat.accent }}>
                    {cat.tagline}
                  </span>
                  <span style={{ ...FONTS.mono, fontSize: '8px', color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                    Weekly
                  </span>
                </div>
                <p style={{ ...FONTS.mono, fontSize: '11px', color: 'rgba(0,0,0,0.6)', lineHeight: 1.65 }}>
                  {cat.desc}
                </p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </SectionBlock>

      {/* ═══ SUBSCRIBE ═══ */}
      <SectionBlock variant="cyan-tint">
        <FadeInSection>
          <div className="max-w-xl mx-auto">
            <p style={{ ...FONTS.oswald, fontSize: '20px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: TOKENS.INK, marginBottom: '4px' }}>
              Get the <span style={{ color: '#FF3B3B' }}>drop</span> every Sunday
            </p>
            <p style={{ ...FONTS.mono, fontSize: '10px', color: 'rgba(0,0,0,0.5)', marginBottom: '16px' }}>
              Pick your categories. Unsubscribe anytime.
            </p>

            {!isSubscribed && (
              <div className="flex flex-wrap gap-2 mb-4">
                {[
                  { label: 'Supps & Peptides', active: subSupps, toggle: () => setSubSupps(!subSupps), accent: '#00e5ff' },
                  { label: 'Fitness',           active: subFitness, toggle: () => setSubFitness(!subFitness), accent: '#FF3B3B' },
                  { label: 'Fitness Socials',   active: subSocials, toggle: () => setSubSocials(!subSocials), accent: '#a855f7' },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={opt.toggle}
                    className="cursor-pointer transition-all duration-200"
                    style={{
                      ...FONTS.mono,
                      fontSize: '9px',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      padding: '7px 14px',
                      background: opt.active ? `${opt.accent}18` : '#ffffff',
                      color: opt.active ? opt.accent : 'rgba(0,0,0,0.4)',
                      border: `1.5px solid ${opt.active ? opt.accent : 'rgba(0,0,0,0.12)'}`,
                      borderRadius: '999px',
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
                  style={{ ...FONTS.mono, fontSize: '12px', background: '#fff', border: '1.5px solid rgba(0,0,0,0.12)', borderRadius: '10px', color: TOKENS.INK, minHeight: '44px' }}
                />
                <button
                  type="submit"
                  className="px-5 py-3 font-bold uppercase flex items-center gap-2 shrink-0 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 border-none"
                  style={{ ...FONTS.oswald, fontSize: '13px', letterSpacing: '0.12em', background: '#FF3B3B', color: '#fff', minHeight: '44px', borderRadius: '10px', boxShadow: '0 4px 20px rgba(255,45,85,0.35)' }}
                >
                  <Mail size={14} />
                  Subscribe
                </button>
              </form>
            ) : (
              <div
                className="flex items-center gap-3 px-4 py-3"
                style={{ background: `rgba(0,229,255,0.08)`, border: `1.5px solid rgba(0,229,255,0.25)`, borderRadius: '10px' }}
              >
                <CheckCircle size={16} style={{ color: TOKENS.CYAN }} />
                <span style={{ ...FONTS.mono, fontSize: '11px', color: 'rgba(0,0,0,0.7)' }}>
                  Subscribed as <span style={{ color: TOKENS.CYAN, fontWeight: 700 }}>{email}</span>
                </span>
              </div>
            )}

            {submitted && (
              <div
                className="flex items-center gap-2 mt-3 px-4 py-2"
                style={{ background: 'rgba(255,45,85,0.08)', border: '1px solid rgba(255,45,85,0.2)', borderRadius: '10px' }}
              >
                <CheckCircle size={14} style={{ color: '#FF3B3B' }} />
                <span style={{ ...FONTS.mono, fontSize: '11px', color: '#FF3B3B' }}>
                  You&apos;re in. First drop this Sunday.
                </span>
              </div>
            )}
          </div>
        </FadeInSection>
      </SectionBlock>

      {/* ═══ PAST DROPS (tabs + articles) ═══ */}
      <SectionBlock variant="cream" eyebrow="Archive" title="Past" titleAccent="drops.">
        {/* Category filter tabs */}
        <div className="flex gap-2 md:gap-3 overflow-x-auto md:overflow-visible pb-3 mb-8" style={{ scrollbarWidth: 'none' }}>
          {tabs.map((tab, i) => {
            const accent = tab.accent || TOKENS.CYAN;
            const isActive = activeTab === tab.key;
            return (
              <motion.button
                key={tab.key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveTab(tab.key)}
                className="shrink-0 cursor-pointer border-none"
                style={{
                  ...FONTS.oswald,
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  padding: '8px 16px',
                  background: isActive ? accent : '#ffffff',
                  color: isActive ? (tab.key === 'all' ? TOKENS.INK : '#fff') : 'rgba(0,0,0,0.5)',
                  borderRadius: '999px',
                  boxShadow: isActive ? `0 4px 16px ${accent}44` : '0 1px 3px rgba(0,0,0,0.06)',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </motion.button>
            );
          })}
        </div>

        {/* Newsletter list */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: TOKENS.CYAN, borderTopColor: 'transparent' }} />
          </div>
        ) : filtered.length === 0 ? (
          <FadeInSection>
            <div className="p-8 md:p-12 text-center" style={{ background: '#ffffff', borderRadius: '10px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <p style={{ ...FONTS.mono, fontSize: '10px', letterSpacing: '0.3em', color: '#FF3B3B', textTransform: 'uppercase', marginBottom: '10px' }}>
                Dropping Soon
              </p>
              <h3 style={{ ...FONTS.oswald, fontSize: '22px', fontWeight: 700, textTransform: 'uppercase', color: TOKENS.INK, marginBottom: '8px' }}>
                First Drop This Sunday
              </h3>
              <p style={{ ...FONTS.mono, fontSize: '11px', color: 'rgba(0,0,0,0.55)', lineHeight: 1.7, marginBottom: '20px' }}>
                Three quick reads covering supplements, fitness, and the creators shaping the game. Subscribe above to get it in your inbox.
              </p>
              <div className="space-y-2 max-w-md mx-auto text-left">
                {CATEGORIES.map((cat) => (
                  <div
                    key={cat.key}
                    className="p-3 flex items-center gap-3"
                    style={{ background: TOKENS.CYAN_TINT, borderLeft: `2px solid ${cat.accent}`, borderRadius: '6px' }}
                  >
                    <span style={{ ...FONTS.oswald, fontSize: '11px', fontWeight: 700, color: cat.accent, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                      {cat.tagline}
                    </span>
                    <span style={{ ...FONTS.mono, fontSize: '9px', color: 'rgba(0,0,0,0.35)' }}>
                      — Coming Sunday
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </FadeInSection>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {filtered.map((newsletter, i) => {
              const cat = getCat(newsletter._category);
              return (
                <FadeInSection key={newsletter.id} delay={(i % 6) * 0.06}>
                  <Link
                    href={`/news/${newsletter.id}`}
                    className="block h-full p-5 rounded-r-lg transition-all duration-300 hover:translate-x-1 no-underline"
                    style={{
                      background: '#ffffff',
                      borderLeft: `3px solid ${cat.accent}`,
                      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                      textDecoration: 'none',
                      color: 'inherit',
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className="px-2 py-0.5 uppercase"
                        style={{
                          ...FONTS.mono,
                          fontSize: '8px',
                          letterSpacing: '0.15em',
                          background: `${cat.accent}12`,
                          color: cat.accent,
                          border: `1px solid ${cat.accent}30`,
                          borderRadius: '3px',
                        }}
                      >
                        {cat.tagline}
                      </span>
                      <span style={{ ...FONTS.mono, fontSize: '9px', color: 'rgba(0,0,0,0.35)' }}>
                        {formatDate(newsletter.published_date)}
                      </span>
                    </div>

                    <h3 style={{ ...FONTS.oswald, fontSize: '17px', fontWeight: 700, textTransform: 'uppercase', color: TOKENS.INK, marginBottom: '6px', lineHeight: 1.2 }}>
                      {newsletter.title}
                    </h3>

                    {newsletter.excerpt && (
                      <p className="line-clamp-2 mb-3" style={{ ...FONTS.mono, fontSize: '11px', color: 'rgba(0,0,0,0.55)', lineHeight: 1.65 }}>
                        {newsletter.excerpt}
                      </p>
                    )}

                    <span style={{ ...FONTS.mono, fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: cat.accent }}>
                      Read →
                    </span>
                  </Link>
                </FadeInSection>
              );
            })}
          </div>
        )}
      </SectionBlock>
    </PageLayout>
  );
}
