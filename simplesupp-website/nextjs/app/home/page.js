'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { fetchProductById, fetchShopifyProducts, addToCart, initializeShopifyCart, getCheckoutUrl } from '../lib/shopify';
import { useSupabaseUser } from '../components/SupabaseAuthProvider';
import PageLayout, { MissionBlock, CTAButton } from '../components/PageLayout';

const CYAN = '#00e5ff';           // Electric cyan — sole accent (matches /creatine)
const CYAN_TINT = '#f4fdff';      // Pale cyan-washed white (creatine bg)
const CREAM = '#F5F0EB';          // Warm tan/cream for alternating sections
const INK = '#28282A';            // Soft near-black for body text
const BORDER_CYAN = '#d4eef2';    // Soft cyan hairline (not used as divider — for accents)

// Curated drop — 5 hero products with category accents
const dropProducts = [
  { name: 'Creatine + Electrolyte',    category: 'Performance', accent: '#00e5ff', href: '/creatine-electrolyte', match: 'creatine + electrolyte' },
  { name: 'Flow State X',              category: 'Performance', accent: '#00e5ff', href: '/nitric',    match: 'flow state' },
  { name: 'Hydration Powder Lemonade', category: 'Hydration',   accent: '#FFD700', href: '/hydration', match: 'lemonade' },
  { name: 'Magnesium Glycinate',       category: 'Sleep',       accent: '#a855f7', href: '/magnesium', match: 'magnesium' },
  { name: 'Creatine',                  category: 'Performance', accent: '#00e5ff', href: '/creatine',  match: 'creatine monohydrate' },
  { name: 'Pre-Workout (Fruit Punch)', category: 'Performance', accent: '#FF3B3B', href: '/preworkout', match: 'fruit punch' },
];

function findShopifyMatch(products, matcher) {
  if (!products?.length) return null;
  const m = matcher.toLowerCase();
  return products.find((p) => (p.title || '').toLowerCase().includes(m)) || null;
}

// ─── Scroll-triggered fade-up wrapper ───
function FadeInSection({ children, delay = 0, className = '', y = 32 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}


// ─── Static data ───
const quizSteps = [
  { num: '01', title: 'Your Baseline', desc: 'Tell us about your current fitness, training, sleep, and diet. Two minutes — no fluff.' },
  { num: '02', title: 'Your Goals', desc: 'Strength, endurance, recovery, focus. We learn what you are actually chasing.' },
  { num: '03', title: 'Your Stack', desc: 'Personalized supplement plan with insights you can read. Stop guessing. Start progressing.' },
];

const reviews = [
  { quote: 'The quiz recommended Flow State X and it has been a game changer. Pumps are insane. Already told my whole gym.', author: 'Marcus T.' },
  { quote: 'Finally a brand that doesn\'t hide behind proprietary blends. I can see every ingredient, every dose. Respect.', author: 'Dylan M.' },
  { quote: 'Took the quiz, got my stack, locked in. The personalization is what sold me. This is the future.', author: 'Jake R.' },
];

// Map known product names → product page slugs
function productHref(title = '') {
  const t = title.toLowerCase();
  if (t.includes('flow state') || t.includes('nitric')) return '/nitric';
  if (t.includes('hydration')) return '/hydration';
  return '/shop';
}

// ═══════════════════════════════════════════
// HOME PAGE
// ═══════════════════════════════════════════
export default function HomePage() {
  // Shopify
  const [products, setProducts] = useState([]);
  const [featuredVariantId, setFeaturedVariantId] = useState(null);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState(null);
  const FEATURED_ID = '8645601657022'; // Flow State X

  // Newsletter
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  // Hero parallax
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroImgY = useTransform(heroScroll, [0, 1], ['0%', '20%']);
  const heroTextY = useTransform(heroScroll, [0, 1], ['0%', '-10%']);
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0.3]);

  useEffect(() => {
    fetchProductById(FEATURED_ID)
      .then((p) => {
        if (p?.variantId) setFeaturedVariantId(p.variantId);
        const img = p?.images?.[0] || p?.image || null;
        if (img) setFeaturedImage(img);
      })
      .catch(console.error);

    fetchShopifyProducts()
      .then((all) => setProducts(all || []))
      .catch(console.error);

    initializeShopifyCart().catch(console.error);
  }, []);

  const handleAddFeatured = async () => {
    if (!featuredVariantId || isAdding) return;
    setIsAdding(true);
    try {
      await addToCart(featuredVariantId, 1);
      setAdded(true);
      const url = await getCheckoutUrl();
      setCheckoutUrl(url);
    } catch (err) {
      console.error('Add to cart failed:', err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleNewsletter = async (e) => {
    e.preventDefault();
    if (!email || emailLoading) return;
    setEmailLoading(true);
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) setEmailSubmitted(true);
    } catch (err) {
      console.error('Newsletter error:', err);
    } finally {
      setEmailLoading(false);
    }
  };

  const oswald = { fontFamily: 'var(--font-oswald), Oswald, sans-serif' };
  const mono = { fontFamily: 'var(--font-space-mono), Space Mono, monospace' };
  const hairline = '1px solid rgba(255,255,255,0.08)';

  // Reusable section eyebrow + title
  const Eyebrow = ({ children }) => (
    <p
      style={{
        ...mono,
        fontSize: '10px',
        letterSpacing: '0.32em',
        color: CYAN,
        textTransform: 'uppercase',
        marginBottom: '10px',
      }}
    >
      {children}
    </p>
  );

  const SectionTitle = ({ children, className = '' }) => (
    <h2
      className={className}
      style={{
        ...oswald,
        fontWeight: 700,
        textTransform: 'uppercase',
        lineHeight: 0.95,
        letterSpacing: '-0.01em',
      }}
    >
      {children}
    </h2>
  );

  return (
    <PageLayout>
    <div
      className="min-h-screen relative"
      style={{ background: '#000', color: '#fff', overflowX: 'hidden' }}
    >
      {/* Scanline overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.012) 2px, rgba(0,255,255,0.012) 4px)',
        }}
      />

      {/* ═══ 1. HERO ═══ */}
      <section
        ref={heroRef}
        className="relative"
        style={{ minHeight: '100vh', zIndex: 10 }}
      >
        {/* Background image with parallax */}
        <motion.div className="absolute inset-0 overflow-hidden" style={{ y: heroImgY }}>
          <img
            src="/images/hero.jpg"
            alt=""
            className="w-full h-[120%] object-cover"
            style={{ filter: 'grayscale(15%) contrast(1.06)' }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.45) 35%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,1) 100%)',
            }}
          />
          {/* Subtle cyan vignette accent */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 20% 80%, rgba(0,255,255,0.08) 0%, transparent 50%)',
            }}
          />
        </motion.div>

        <motion.div
          className="relative max-w-[430px] md:max-w-5xl lg:max-w-6xl mx-auto px-5 md:px-8 flex flex-col"
          style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '60px', y: heroTextY, opacity: heroOpacity }}
        >
          {/* Top label */}
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            style={{
              ...mono,
              fontSize: '10px',
              color: 'rgba(255,255,255,0.6)',
              textTransform: 'uppercase',
              letterSpacing: '0.32em',
            }}
          >
            Aviera — Issue 01 / Spring 26
          </motion.p>

          <div className="flex-1" />

          <div className="md:max-w-2xl">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{
                ...oswald,
                lineHeight: 0.92,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                marginBottom: '24px',
              }}
              className="text-[56px] sm:text-[72px] md:text-[96px] lg:text-[120px]"
            >
              Stop guessing.
              <br />
              Start <span style={{ color: CYAN }}>progressing.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.5 }}
              style={{
                ...mono,
                color: 'rgba(255,255,255,0.7)',
                lineHeight: 1.7,
                marginBottom: '32px',
              }}
              className="text-[12px] md:text-[14px] max-w-[340px] md:max-w-[480px]"
            >
              Premium supplements meets artificial intelligence. We don&apos;t guess what your body needs — we calculate it. Science-backed formulas, personalized stacks, zero filler.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.65 }}
              className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6"
            >
              <Link
                href="/shop"
                className="block text-center no-underline"
                style={{
                  ...oswald,
                  padding: '18px 36px',
                  background: CYAN,
                  color: INK,
                  fontSize: '14px',
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  borderRadius: '10px',
                }}
              >
                Shop Supplements
              </Link>

              <Link
                href="/supplement-optimization-score"
                className="text-center no-underline"
                style={{
                  ...mono,
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.75)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  textDecoration: 'underline',
                  textDecorationColor: 'rgba(0,255,255,0.4)',
                  textUnderlineOffset: '6px',
                }}
              >
                Get My Recommendations →
              </Link>
            </motion.div>
          </div>

          {/* Scroll cue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
          >
            <span style={{ ...mono, fontSize: '9px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
              Scroll
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              style={{ width: '1px', height: '32px', background: 'linear-gradient(180deg, rgba(0,255,255,0.6), transparent)' }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ 1.5. MISSION ═══ */}
      <MissionBlock
        eyebrow="Why Aviera"
        body="Everyone deserves to thrive. We personalize supplements to your body, your goals, your life."
        accent="That's Aviera."
        ctaHref="/about"
        ctaLabel="More About Us"
        variant="cream"
      />

      {/* ═══ 2. THE DROP ═══ */}
      <section className="relative" style={{ zIndex: 10, background: CYAN_TINT, color: INK }}>
        <div className="max-w-[430px] md:max-w-5xl lg:max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-28">
          <FadeInSection>
            <div className="flex items-end justify-between mb-6 md:mb-14">
              <div>
                <p style={{ ...mono, fontSize: '10px', letterSpacing: '0.32em', color: CYAN, textTransform: 'uppercase', marginBottom: '10px' }}>
                  The Catalog
                </p>
                <h2
                  style={{
                    ...oswald,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    lineHeight: 0.95,
                    letterSpacing: '-0.01em',
                    color: INK,
                  }}
                  className="text-[28px] md:text-[64px] lg:text-[80px]"
                >
                  The Drop
                </h2>
              </div>
              <Link
                href="/shop"
                className="hidden md:inline-block no-underline"
                style={{
                  ...mono,
                  fontSize: '11px',
                  color: 'rgba(0,0,0,0.6)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  textDecoration: 'underline',
                  textDecorationColor: CYAN,
                  textUnderlineOffset: '6px',
                }}
              >
                View all →
              </Link>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
            {dropProducts.map((dp, i) => {
              const match = findShopifyMatch(products, dp.match);
              const img = match?.images?.[0] || match?.image || null;
              const price = match?.price ? `$${parseFloat(match.price).toFixed(2)}` : null;
              return (
                <motion.div
                  key={dp.name}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.7, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -6 }}
                  className="h-full"
                >
                  <Link
                    href={dp.href}
                    className="group block no-underline h-full"
                    style={{ color: 'inherit' }}
                  >
                    <div
                      className="relative w-full overflow-hidden"
                      style={{
                        aspectRatio: '1 / 1',
                        background: '#ffffff',
                        borderRadius: '10px',
                        borderTop: `3px solid ${dp.accent}`,
                        boxShadow: `0 1px 3px rgba(40,40,42,0.06), 0 4px 14px rgba(40,40,42,0.05), inset 0 -40px 60px -20px ${dp.accent}1A`,
                        transition: 'box-shadow 0.5s cubic-bezier(0.22, 1, 0.36, 1), transform 0.5s',
                      }}
                    >
                      {/* Always-on category glow behind product */}
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: `radial-gradient(ellipse at 50% 55%, ${dp.accent}28 0%, ${dp.accent}10 30%, transparent 65%)`,
                        }}
                      />
                      {/* Hover glow boost */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{
                          background: `radial-gradient(ellipse at 50% 55%, ${dp.accent}33 0%, transparent 60%)`,
                        }}
                      />
                      {img ? (
                        <img
                          src={img}
                          alt={dp.name}
                          className="absolute inset-0 w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.08]"
                          style={{ padding: '14px', filter: `drop-shadow(0 8px 16px ${dp.accent}40)` }}
                        />
                      ) : (
                        <div
                          className="absolute inset-0 flex items-center justify-center"
                          style={{ ...mono, fontSize: '9px', color: '#999' }}
                        >
                          {dp.name}
                        </div>
                      )}
                      {/* Category pill */}
                      <span
                        className="absolute top-2 left-2"
                        style={{
                          ...mono,
                          fontSize: '7px',
                          fontWeight: 700,
                          color: '#fff',
                          background: dp.accent,
                          padding: '3px 7px',
                          letterSpacing: '0.14em',
                          textTransform: 'uppercase',
                          borderRadius: '3px',
                          boxShadow: `0 2px 8px ${dp.accent}55`,
                        }}
                      >
                        {dp.category}
                      </span>
                    </div>

                    <div className="mt-2 md:mt-4 px-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <h3
                          style={{
                            ...oswald,
                            fontSize: '12px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.01em',
                            color: INK,
                            lineHeight: 1.15,
                          }}
                          className="md:text-[17px]"
                        >
                          {dp.name}
                        </h3>
                        {price && (
                          <p style={{ ...oswald, fontSize: '11px', color: INK, whiteSpace: 'nowrap' }} className="md:text-[15px]">
                            {price}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <FadeInSection delay={0.4}>
            <Link
              href="/shop"
              className="md:hidden block text-center no-underline mt-10"
              style={{
                ...mono,
                fontSize: '11px',
                color: 'rgba(0,0,0,0.6)',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                textDecoration: 'underline',
                textDecorationColor: CYAN,
                textUnderlineOffset: '6px',
              }}
            >
              View all products →
            </Link>
          </FadeInSection>
        </div>
      </section>

      {/* ═══ 3. QUIZ STEPS ═══ */}
      <section className="relative" style={{ zIndex: 10, background: CREAM, color: INK }}>
        <div className="max-w-[430px] md:max-w-5xl lg:max-w-6xl mx-auto px-5 md:px-8 py-12 md:py-16">
          <FadeInSection>
            <p style={{ ...mono, fontSize: '10px', letterSpacing: '0.32em', color: CYAN, textTransform: 'uppercase', marginBottom: '10px' }}>
              The Optimization Quiz
            </p>
            <h2
              style={{ ...oswald, fontWeight: 700, textTransform: 'uppercase', lineHeight: 0.95, letterSpacing: '-0.01em', color: INK }}
              className="text-[32px] md:text-[48px] lg:text-[60px] mb-4"
            >
              Three steps.
              <br />
              Your <span style={{ color: CYAN }}>formula.</span>
            </h2>
            <p style={{ ...mono, fontSize: '12px', color: 'rgba(0,0,0,0.6)', lineHeight: 1.7, marginBottom: '32px', maxWidth: '480px' }}>
              Two minutes of input, a lifetime of clarity. Stop guessing. Start progressing.
            </p>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5">
            {quizSteps.map((s, i) => (
              <FadeInSection key={i} delay={i * 0.08}>
                <div
                  className="flex gap-4 p-4 md:p-5 rounded-r-lg transition-all duration-300 hover:translate-x-1"
                  style={{
                    background: '#ffffff',
                    borderLeft: `3px solid ${CYAN}`,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                  }}
                >
                  <span
                    className="text-2xl md:text-3xl font-bold shrink-0"
                    style={{ ...oswald, color: CYAN, opacity: 0.65, lineHeight: 1 }}
                  >
                    {s.num}
                  </span>
                  <div>
                    <h3
                      className="text-base md:text-lg font-bold uppercase mb-1 tracking-wide"
                      style={{ ...oswald, color: INK }}
                    >
                      {s.title}
                    </h3>
                    <p style={{ ...mono, fontSize: '11px', color: 'rgba(0,0,0,0.6)', lineHeight: 1.65 }}>
                      {s.desc}
                    </p>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>

          <FadeInSection delay={0.4}>
            <div className="flex justify-center mt-8 md:mt-10">
              <Link
                href="/supplement-optimization-score"
                className="text-center no-underline transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  ...oswald,
                  padding: '18px 48px',
                  background: CYAN,
                  color: INK,
                  fontSize: '14px',
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 24px rgba(0, 229, 255, 0.35)',
                }}
              >
                Take the Quiz →
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ═══ 4. REVIEWS ═══ */}
      <section className="relative" style={{ zIndex: 10, background: CYAN_TINT, color: INK }}>
        <div className="max-w-[430px] md:max-w-5xl lg:max-w-6xl mx-auto px-5 md:px-8 py-12 md:py-16">
          <FadeInSection>
            <p style={{ ...mono, fontSize: '10px', letterSpacing: '0.32em', color: CYAN, textTransform: 'uppercase', marginBottom: '10px' }}>
              From the field
            </p>
            <h2
              style={{ ...oswald, fontWeight: 700, textTransform: 'uppercase', lineHeight: 0.95, letterSpacing: '-0.01em', color: INK }}
              className="text-[32px] md:text-[48px] lg:text-[60px] mb-6 md:mb-10"
            >
              What they&apos;re saying.
            </h2>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            {reviews.map((r, i) => (
              <FadeInSection key={i} delay={i * 0.1} y={36}>
                <div
                  className="h-full py-8 px-6 md:px-8"
                  style={{ background: CREAM, borderRadius: '10px', borderTop: `3px solid ${CYAN}` }}
                >
                  <div style={{ color: CYAN, letterSpacing: '0.3em', fontSize: '12px', marginBottom: '14px' }}>
                    ★ ★ ★ ★ ★
                  </div>
                  <p
                    style={{
                      ...mono,
                      fontSize: '13px',
                      color: 'rgba(0,0,0,0.85)',
                      lineHeight: 1.7,
                      fontStyle: 'italic',
                      marginBottom: '20px',
                    }}
                  >
                    &ldquo;{r.quote}&rdquo;
                  </p>
                  <p
                    style={{
                      ...mono,
                      fontSize: '9px',
                      color: 'rgba(0,0,0,0.5)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.2em',
                    }}
                  >
                    — {r.author} / Verified Buyer
                  </p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 5. NEWSLETTER ═══ */}
      <section className="relative" style={{ zIndex: 10, background: CREAM, color: INK }}>
        <div className="max-w-[430px] md:max-w-3xl mx-auto px-5 md:px-8 py-12 md:py-16 text-center">
          <FadeInSection>
            <p style={{ ...mono, fontSize: '10px', letterSpacing: '0.32em', color: CYAN, textTransform: 'uppercase', marginBottom: '10px' }}>
              The list
            </p>
            <h2
              style={{ ...oswald, fontWeight: 700, textTransform: 'uppercase', lineHeight: 0.95, letterSpacing: '-0.01em', color: INK }}
              className="text-[40px] md:text-[64px] lg:text-[72px] mb-5"
            >
              Drops, <span style={{ color: CYAN }}>early.</span>
            </h2>
            <p
              style={{
                ...mono,
                fontSize: '12px',
                color: 'rgba(0,0,0,0.6)',
                lineHeight: 1.7,
                marginBottom: '36px',
                maxWidth: '420px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              New formulas, training notes, and quiet pre-launches. No spam — just gains.
            </p>
          </FadeInSection>

          <FadeInSection delay={0.15}>
            {!emailSubmitted ? (
              <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 outline-none"
                  style={{
                    ...mono,
                    background: 'transparent',
                    border: 'none',
                    borderBottom: `1px solid rgba(0,0,0,0.3)`,
                    color: INK,
                    fontSize: '13px',
                    padding: '14px 4px',
                    textAlign: 'center',
                  }}
                />
                <button
                  type="submit"
                  disabled={emailLoading}
                  className="border-none cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    ...oswald,
                    padding: '14px 32px',
                    background: CYAN,
                    color: INK,
                    fontSize: '13px',
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    borderRadius: '10px',
                    opacity: emailLoading ? 0.6 : 1,
                    boxShadow: '0 4px 24px rgba(0, 229, 255, 0.35)',
                  }}
                >
                  {emailLoading ? 'Subscribing…' : 'Subscribe'}
                </button>
              </form>
            ) : (
              <p
                style={{
                  ...oswald,
                  fontSize: '16px',
                  color: CYAN,
                  textTransform: 'uppercase',
                  letterSpacing: '0.18em',
                  padding: '20px 0',
                }}
              >
                You&apos;re in ✓
              </p>
            )}
          </FadeInSection>
        </div>
      </section>

    </div>
    </PageLayout>
  );
}
