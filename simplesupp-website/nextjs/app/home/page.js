'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { fetchProductById, addToCart, initializeShopifyCart, getCheckoutUrl } from '../lib/shopify';
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
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

  return (
    <>
      {/* Desktop / mobile top bar */}
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
            <Link href={user ? "/dashboard" : "/auth"} className="flex items-center justify-center no-underline" style={{width: '28px', height: '28px', borderRadius: '50%', border: avatarUrl ? '2px solid #00ffcc' : '1px solid rgba(255,255,255,0.15)', background: 'transparent', overflow: 'hidden'}}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="" width={28} height={28} style={{borderRadius: '50%', objectFit: 'cover'}} />
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              )}
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
              { label: 'About', href: '/about' },
              { label: 'Latest', href: '/news' },
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

// ─── Brand pillars data ───
const pillars = [
  {
    num: '01',
    title: 'AI-Powered Personalization',
    desc: 'Our optimization quiz analyzes your goals, body, and lifestyle to recommend the exact stack your body needs. Not guessing — calculating.',
  },
  {
    num: '02',
    title: 'Transparent Labels',
    desc: 'Every dose listed. No proprietary blends. No hidden fillers. You see exactly what you\'re putting in your body.',
  },
  {
    num: '03',
    title: 'Clean Formulas',
    desc: 'Vegetable capsules. Brown rice flour. That\'s it for inactive ingredients. No gelatin, no magnesium stearate, no garbage.',
  },
  {
    num: '04',
    title: 'GMP Certified, USA Made',
    desc: 'Manufactured in FDA-registered, GMP-certified facilities. 3rd party tested for purity. Built in San Diego, shipped nationwide.',
  },
];

// ─── AI steps data ───
const aiSteps = [
  'Take our 2-minute optimization quiz — goals, training, diet, sleep',
  'Our AI analyzes your inputs against clinical research data',
  'Get your personalized supplement stack — ranked by impact',
  'Order your stack with one click. Adjust as your goals evolve.',
];

// ─── Reviews data ───
const reviews = [
  {
    quote: 'The quiz recommended Flow State X and it\'s been a game changer. Pumps are insane. Already told my whole gym about it.',
    author: 'Marcus T. · Verified Buyer',
  },
  {
    quote: 'Finally a brand that doesn\'t hide behind proprietary blends. I can see every ingredient, every dose. Respect.',
    author: 'Dylan M. · Verified Buyer',
  },
  {
    quote: 'Took the AI quiz, got my stack, and I\'m feeling dialed in. The personalization is what sold me. This is the future.',
    author: 'Jake R. · Verified Buyer',
  },
];

// ═══════════════════════════════════════════
// HOME PAGE
// ═══════════════════════════════════════════
export default function HomePage() {
  // Nav state
  const [menuOpen, setMenuOpen] = useState(false);

  // Shopify state
  const [variantId, setVariantId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState(null);
  const [productImage, setProductImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Newsletter state
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  const SHOPIFY_PRODUCT_ID = '8645601657022';

  // Fetch Flow State X from Shopify
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await fetchProductById(SHOPIFY_PRODUCT_ID);
        if (product?.variantId) setVariantId(product.variantId);
        const img = product?.images?.[0] || product?.image || null;
        if (img) setProductImage(img);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
    initializeShopifyCart().catch(console.error);
  }, []);

  // Add to cart
  const handleAddToCart = async () => {
    if (!variantId) return;
    setIsAdding(true);
    try {
      await addToCart(variantId, 1);
      setAdded(true);
      const url = await getCheckoutUrl();
      setCheckoutUrl(url);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  // Newsletter submit
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
      if (res.ok) {
        setEmailSubmitted(true);
      }
    } catch (error) {
      console.error('Newsletter error:', error);
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: '#000000',
        color: '#ffffff',
        overflowX: 'hidden',
      }}
    >
      {/* Scanline overlay — REQUIRED on every dark page */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 204, 0.015) 2px, rgba(0, 255, 204, 0.015) 4px)',
        }}
      />

      {/* Sticky Nav */}
      <StickyNav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* ═══ SECTION 1: HERO ═══ */}
      <section
        className="relative z-10 min-h-screen flex flex-col px-4"
        style={{ paddingTop: '60px' }}
      >
        <div className="max-w-[430px] mx-auto w-full flex-1 flex flex-col justify-center">
          {/* Top strip */}
          <div
            className="flex items-center justify-between py-2 mb-5"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
          >
            <span
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
            </span>
            <span
              style={{
                fontSize: '9px',
                color: '#ff2d55',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                background: 'rgba(255,45,85,0.15)',
                padding: '3px 8px',
                borderRadius: '2px',
              }}
            >
              Launch Sale — 50% Off
            </span>
          </div>

          {/* Hero headline stagger */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15 } },
            }}
          >
            <motion.h1
              variants={{ hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0 } }}
              style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontSize: '72px',
                lineHeight: 0.88,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                marginBottom: '16px',
              }}
            >
              YOUR
              <br />
              <span style={{ color: '#00ffcc' }}>BODY.</span>
              <br />
              <span style={{ color: '#a855f7' }}>YOUR</span>
              <br />
              FORMULA.
              <br />
              <span style={{ color: '#666', fontSize: '42px', display: 'block' }}>
                POWERED BY <span style={{ color: '#ff2d55' }}>AI</span> ///
              </span>
            </motion.h1>

            <motion.p
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              style={{
                fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                fontSize: '12px',
                color: '#666',
                lineHeight: 1.6,
                marginBottom: '24px',
                maxWidth: '360px',
              }}
            >
              Premium supplements meets{' '}
              <strong style={{ color: '#00ffcc', fontWeight: 700 }}>artificial intelligence</strong>.
              We don&apos;t guess what your body needs — we calculate it. Science-backed formulas.
              Personalized stacks. Zero filler.
            </motion.p>

            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="flex flex-col gap-[10px] mb-5"
            >
              <Link
                href="/shop"
                className="block w-full text-center no-underline"
                style={{
                  padding: '18px',
                  background: '#00ffcc',
                  borderRadius: '6px',
                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                  fontSize: '20px',
                  letterSpacing: '0.15em',
                  color: '#000',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                Shop Now
              </Link>
              <Link
                href="/supplement-optimization-score"
                className="block w-full text-center no-underline"
                style={{
                  padding: '16px',
                  background: 'transparent',
                  border: '1px solid #ff2d55',
                  borderRadius: '6px',
                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                  fontSize: '18px',
                  letterSpacing: '0.15em',
                  color: '#ff2d55',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                Take the Quiz →
              </Link>
            </motion.div>

            <motion.div
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              className="flex justify-around"
              style={{
                fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                fontSize: '10px',
                color: '#666',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              <span>✓ Science-backed</span>
              <span>✓ AI-personalized</span>
              <span>✓ USA made</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══ SECTION 2: STATS ROW ═══ */}
      <FadeInSection>
        <div
          className="relative z-10 flex justify-around mx-4 py-6"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.04)',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
          }}
        >
          <div className="max-w-[430px] mx-auto w-full flex justify-around">
            {[
              { num: '800mg', label: 'Total Active\nPer Serving', color: '#00ffcc' },
              { num: '0', label: 'Fillers &\nProp Blends', color: '#ff2d55' },
              { num: '30', label: 'Servings\nPer Bottle', color: '#a855f7' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div
                  style={{
                    fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                    fontSize: '28px',
                    fontWeight: 700,
                    color: stat.color || '#00ffcc',
                  }}
                >
                  {stat.num}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                    fontSize: '9px',
                    color: '#666',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginTop: '2px',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeInSection>

      {/* ═══ SECTION 3: FEATURED PRODUCT ═══ */}
      <section
        className="relative z-10 py-10 px-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div className="max-w-[430px] mx-auto">
          <FadeInSection>
            <p
              className="mb-2"
              style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.3em',
                color: '#00ffcc',
                textTransform: 'uppercase',
              }}
            >
              Our Flagship
            </p>
            <h2
              className="mb-5"
              style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontSize: '32px',
                fontWeight: 700,
                textTransform: 'uppercase',
                lineHeight: 1,
              }}
            >
              FLOW STATE <span style={{ color: '#ff2d55' }}>X</span>
            </h2>
          </FadeInSection>

          <FadeInSection delay={0.15}>
            <div
              className="overflow-hidden mb-4"
              style={{
                background: '#0a0a0a',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
              }}
            >
              {/* Product image */}
              <div
                className="w-full flex items-center justify-center relative"
                style={{
                  aspectRatio: '1',
                  background: 'linear-gradient(145deg, #111, #0a0a0a)',
                }}
              >
                {productImage ? (
                  <img
                    src={productImage}
                    alt="Flow State X"
                    className="w-full h-full object-contain p-6"
                    style={{ filter: 'drop-shadow(0 20px 40px rgba(0, 255, 204, 0.15))' }}
                  />
                ) : (
                  <span
                    style={{
                      fontSize: '10px',
                      color: '#666',
                      textAlign: 'center',
                      fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                    }}
                  >
                    {isLoading ? 'Loading...' : 'Product Image'}
                  </span>
                )}
                {/* Rotated product name overlay */}
                <span
                  className="absolute"
                  style={{
                    bottom: '10px',
                    right: '-4px',
                    fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                    fontSize: '9px',
                    letterSpacing: '0.3em',
                    color: '#00ffcc',
                    opacity: 0.2,
                    transform: 'rotate(-90deg)',
                    transformOrigin: 'bottom right',
                    textTransform: 'uppercase',
                  }}
                >
                  Flow State X
                </span>
              </div>

              {/* Card body */}
              <div className="p-4">
                <div
                  className="mb-[10px]"
                  style={{
                    fontSize: '10px',
                    color: '#a855f7',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                  }}
                >
                  Nitric Oxide Booster
                </div>
                <h3
                  className="mb-1"
                  style={{
                    fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                    fontSize: '22px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  Flow State X
                </h3>
                <p
                  className="mb-[14px]"
                  style={{
                    fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                    fontSize: '11px',
                    color: '#666',
                    lineHeight: 1.5,
                  }}
                >
                  Skin-splitting pumps. Insane vascularity. L-Citrulline + dual-form L-Arginine for
                  maximum blood flow. No stim, no crash, just pump.
                </p>

                {/* Price row */}
                <div className="flex items-baseline gap-[10px] mb-3">
                  <span
                    style={{
                      fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                      fontSize: '36px',
                      fontWeight: 700,
                    }}
                  >
                    $19.99
                  </span>
                  <span style={{ fontSize: '16px', color: '#666', textDecoration: 'line-through' }}>
                    $39.99
                  </span>
                  <span
                    style={{
                      fontSize: '12px',
                      color: '#ff2d55',
                      fontWeight: 700,
                      background: 'rgba(255,45,85,0.12)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                    }}
                  >
                    −50%
                  </span>
                </div>

                {/* Urgency line */}
                <p
                  className="mb-[10px]"
                  style={{
                    fontSize: '10px',
                    color: '#ff2d55',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontWeight: 700,
                    fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                  }}
                >
                  ⚡ Limited batch — selling fast
                </p>

                {/* CTA button */}
                {!added ? (
                  <button
                    onClick={handleAddToCart}
                    disabled={isAdding || !variantId}
                    className="w-full border-none cursor-pointer"
                    style={{
                      padding: '18px',
                      background: '#00ffcc',
                      borderRadius: '6px',
                      fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                      fontSize: '20px',
                      letterSpacing: '0.15em',
                      color: '#000',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      opacity: isAdding ? 0.7 : 1,
                      transition: 'all 0.15s',
                    }}
                  >
                    {isAdding ? 'Adding...' : 'Add to Cart'}
                  </button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div
                      className="w-full text-center py-4"
                      style={{
                        background: 'rgba(0,255,204,0.1)',
                        borderRadius: '6px',
                        fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                        fontSize: '18px',
                        letterSpacing: '0.15em',
                        color: '#00ffcc',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                      }}
                    >
                      Added ✓
                    </div>
                    {checkoutUrl && (
                      <a
                        href={checkoutUrl}
                        className="block w-full text-center"
                        style={{
                          padding: '16px',
                          background: '#ff2d55',
                          border: '1px solid #ff2d55',
                          borderRadius: '6px',
                          fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                          fontSize: '18px',
                          letterSpacing: '0.15em',
                          color: '#fff',
                          textTransform: 'uppercase',
                          fontWeight: 700,
                          textDecoration: 'none',
                        }}
                      >
                        Checkout →
                      </a>
                    )}
                  </div>
                )}

                {/* Micro trust */}
                <div
                  className="flex justify-around mt-[10px]"
                  style={{
                    fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                    fontSize: '10px',
                    color: '#666',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  <span>✓ Free shipping $50+</span>
                  <span>✓ 30-day guarantee</span>
                  <span>✓ GMP certified</span>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ═══ SECTION 4: BRAND PILLARS ═══ */}
      <section
        className="relative z-10 py-10 px-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div className="max-w-[430px] mx-auto">
          <FadeInSection>
            <p
              className="mb-2"
              style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.3em',
                color: '#a855f7',
                textTransform: 'uppercase',
              }}
            >
              Why Aviera Fit
            </p>
            <h2
              className="mb-5"
              style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontSize: '32px',
                fontWeight: 700,
                textTransform: 'uppercase',
                lineHeight: 1,
              }}
            >
              NOT YOUR
              <br />
              AVERAGE <span style={{ color: '#a855f7' }}>SUPPS</span>
            </h2>
          </FadeInSection>

          {pillars.map((pillar, i) => (
            <FadeInSection key={i} delay={i * 0.1}>
              <div
                className="flex gap-[14px] py-4"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                    fontSize: '36px',
                    fontWeight: 700,
                    color: i % 2 === 0 ? 'rgba(0,255,204,0.12)' : 'rgba(168,85,247,0.15)',
                    minWidth: '44px',
                    lineHeight: 1,
                  }}
                >
                  {pillar.num}
                </div>
                <div>
                  <h3
                    className="mb-[3px]"
                    style={{
                      fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                      fontSize: '16px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                    }}
                  >
                    {pillar.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                      fontSize: '11px',
                      color: '#666',
                      lineHeight: 1.5,
                    }}
                  >
                    {pillar.desc}
                  </p>
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* ═══ SECTION 5: AI SECTION ═══ */}
      <section
        className="relative z-10 py-10 px-4"
        style={{
          background: '#0a0a0a',
          borderTop: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        <div className="max-w-[430px] mx-auto">
          <FadeInSection>
            <p
              className="mb-2"
              style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.3em',
                color: '#a855f7',
                textTransform: 'uppercase',
              }}
            >
              Personalized Supplements
            </p>
            <h2
              className="mb-5"
              style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontSize: '32px',
                fontWeight: 700,
                textTransform: 'uppercase',
                lineHeight: 1,
              }}
            >
              YOUR BODY IS
              <br />
              <span style={{ color: '#ff2d55' }}>UNIQUE</span>
            </h2>
            <p
              className="mb-4"
              style={{
                fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                fontSize: '12px',
                color: '#666',
                lineHeight: 1.6,
              }}
            >
              Most brands sell you a one-size-fits-all bottle and hope for the best. We built an AI
              system that actually looks at your goals, training style, diet gaps, and lifestyle —
              then tells you exactly what to take.
            </p>
          </FadeInSection>

          <FadeInSection delay={0.15}>
            <div
              className="relative"
              style={{
                border: '1px solid rgba(0,255,204,0.15)',
                borderRadius: '8px',
                padding: '20px 16px',
                marginTop: '16px',
              }}
            >
              {/* Radial glow */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  borderRadius: '8px',
                  background:
                    'radial-gradient(ellipse at 50% 0%, rgba(0,255,204,0.04) 0%, transparent 70%)',
                }}
              />

              {/* How It Works tag */}
              <div
                className="flex items-center gap-[6px] mb-[10px] relative z-10"
                style={{
                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                  fontSize: '10px',
                  letterSpacing: '0.2em',
                  color: '#00ffcc',
                  textTransform: 'uppercase',
                }}
              >
                <span
                  className="inline-block"
                  style={{
                    width: '6px',
                    height: '6px',
                    background: '#00ffcc',
                    borderRadius: '50%',
                    boxShadow: '0 0 8px rgba(0,255,204,0.6)',
                    animation: 'pulse 2s infinite',
                  }}
                />
                How It Works
              </div>

              {/* Steps */}
              <ul className="list-none mt-3 relative z-10">
                {aiSteps.map((step, i) => (
                  <FadeInSection key={i} delay={0.2 + i * 0.08}>
                    <li
                      className="flex gap-2 py-[6px]"
                      style={{
                        borderBottom: '1px solid rgba(255,255,255,0.03)',
                        fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                        fontSize: '11px',
                        color: '#666',
                        lineHeight: 1.5,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                          color: i % 2 === 0 ? '#00ffcc' : '#a855f7',
                          fontWeight: 700,
                          fontSize: '12px',
                          minWidth: '20px',
                        }}
                      >
                        0{i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  </FadeInSection>
                ))}
              </ul>
            </div>
          </FadeInSection>

          <FadeInSection delay={0.3}>
            <div className="mt-4">
              <Link
                href="/supplement-optimization-score"
                className="block w-full text-center no-underline"
                style={{
                  padding: '18px',
                  background: '#00ffcc',
                  borderRadius: '6px',
                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                  fontSize: '20px',
                  letterSpacing: '0.15em',
                  color: '#000',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                Get My Stack →
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ═══ SECTION 6: SOCIAL PROOF ═══ */}
      <section className="relative z-10 py-10 px-4">
        <div className="max-w-[430px] mx-auto">
          <FadeInSection>
            <p
              className="mb-2"
              style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.3em',
                color: '#a855f7',
                textTransform: 'uppercase',
              }}
            >
              From the Community
            </p>
            <h2
              className="mb-5"
              style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontSize: '32px',
                fontWeight: 700,
                textTransform: 'uppercase',
                lineHeight: 1,
              }}
            >
              REAL <span style={{ color: '#a855f7' }}>RESULTS</span>
            </h2>
          </FadeInSection>

          {reviews.map((review, i) => (
            <FadeInSection key={i} delay={i * 0.1}>
              <div
                className="py-4"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
              >
                <div
                  className="mb-[6px]"
                  style={{ color: i % 2 === 0 ? '#00ffcc' : '#a855f7', fontSize: '12px', letterSpacing: '3px' }}
                >
                  ★★★★★
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                    fontSize: '13px',
                    lineHeight: 1.5,
                    color: '#ccc',
                    fontStyle: 'italic',
                  }}
                >
                  &ldquo;{review.quote}&rdquo;
                </p>
                <cite
                  className="block mt-[6px]"
                  style={{
                    fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                    fontSize: '10px',
                    color: '#666',
                    fontStyle: 'normal',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  — {review.author}
                </cite>
              </div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* ═══ SECTION 7: NEWSLETTER ═══ */}
      <section
        className="relative z-10 py-10 px-4 text-center"
        style={{
          background: '#0a0a0a',
          borderTop: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        <div className="max-w-[430px] mx-auto">
          <FadeInSection>
            <p
              className="mb-2"
              style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.3em',
                color: '#a855f7',
                textTransform: 'uppercase',
              }}
            >
              Stay Locked In
            </p>
            <h2
              className="mb-5"
              style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontSize: '32px',
                fontWeight: 700,
                textTransform: 'uppercase',
                lineHeight: 1,
              }}
            >
              JOIN THE <span style={{ color: '#ff2d55' }}>CREW</span>
            </h2>
            <p
              className="mb-4"
              style={{
                fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                fontSize: '11px',
                color: '#666',
                lineHeight: 1.5,
              }}
            >
              New drops, training tips, exclusive deals. No spam — just gains.
            </p>
          </FadeInSection>

          <FadeInSection delay={0.1}>
            {!emailSubmitted ? (
              <form onSubmit={handleNewsletter}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="w-full mb-[10px] outline-none"
                  style={{
                    padding: '14px 16px',
                    background: '#000',
                    border: '1px solid rgba(168,85,247,0.3)',
                    borderRadius: '6px',
                    color: '#fff',
                    fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                    fontSize: '12px',
                  }}
                />
                <button
                  type="submit"
                  disabled={emailLoading}
                  className="w-full border-none cursor-pointer"
                  style={{
                    padding: '18px',
                    background: '#ff2d55',
                    borderRadius: '6px',
                    fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                    fontSize: '20px',
                    letterSpacing: '0.15em',
                    color: '#fff',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    opacity: emailLoading ? 0.7 : 1,
                  }}
                >
                  {emailLoading ? 'Subscribing...' : 'Subscribe'}
                </button>
                <p
                  className="mt-2"
                  style={{
                    fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                    fontSize: '9px',
                    color: '#444',
                  }}
                >
                  Unsubscribe anytime. We respect your inbox.
                </p>
              </form>
            ) : (
              <div
                className="py-6"
                style={{
                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                  fontSize: '20px',
                  color: '#00ffcc',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}
              >
                You&apos;re in ✓
              </div>
            )}
          </FadeInSection>
        </div>
      </section>

      {/* ═══ SECTION 8: BOTTOM CTA ═══ */}
      <section
        className="relative z-10 py-[50px] px-4 text-center"
        style={{
          background:
            'radial-gradient(ellipse at 50% 80%, rgba(0,255,204,0.06) 0%, transparent 60%), #000000',
        }}
      >
        <div className="max-w-[430px] mx-auto">
          <FadeInSection>
            <h2
              className="mb-4"
              style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontSize: '48px',
                lineHeight: 0.88,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
              }}
            >
              STOP
              <br />
              <span style={{ color: '#00ffcc' }}>GUESSING.</span>
              <br />
              START
              <br />
              <span style={{ color: '#ff2d55' }}>PROGRESSING.</span>
            </h2>
          </FadeInSection>

          <FadeInSection delay={0.15}>
            <div className="px-4">
              <Link
                href="/shop"
                className="block w-full text-center no-underline mb-[10px]"
                style={{
                  padding: '18px',
                  background: '#00ffcc',
                  borderRadius: '6px',
                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                  fontSize: '20px',
                  letterSpacing: '0.15em',
                  color: '#000',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                Shop Supplements
              </Link>
              <Link
                href="/supplement-optimization-score"
                className="block w-full text-center no-underline"
                style={{
                  padding: '16px',
                  background: 'transparent',
                  border: '1px solid #a855f7',
                  borderRadius: '6px',
                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                  fontSize: '18px',
                  letterSpacing: '0.15em',
                  color: '#a855f7',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                Take the Quiz
              </Link>

              <div
                className="flex justify-around mt-[14px]"
                style={{
                  fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                  fontSize: '10px',
                  color: '#666',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                <span>✓ Free shipping $50+</span>
                <span>✓ 30-day guarantee</span>
                <span>✓ GMP certified</span>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ═══ SECTION 9: FOOTER ═══ */}
      <footer
        className="relative z-10 py-6 px-4 text-center"
        style={{
          fontFamily: 'var(--font-space-mono), Space Mono, monospace',
          fontSize: '9px',
          color: '#333',
          lineHeight: 1.6,
          borderTop: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        <div className="max-w-[430px] mx-auto">
          <div className="mb-3">
            <Link href="/shop" style={{ color: '#00ffcc', textDecoration: 'none' }}>
              Shop
            </Link>
            {' · '}
            <Link href="/about" style={{ color: '#00ffcc', textDecoration: 'none' }}>
              About
            </Link>
            {' · '}
            <Link href="/news" style={{ color: '#00ffcc', textDecoration: 'none' }}>
              News
            </Link>
            {' · '}
            <Link href="/nitric" style={{ color: '#00ffcc', textDecoration: 'none' }}>
              Flow State X
            </Link>
          </div>
          <div className="mb-3">
            <Link href="/terms" style={{ fontFamily: 'var(--font-space-mono), Space Mono, monospace', fontSize: '9px', color: '#444', textTransform: 'uppercase', textDecoration: 'none' }}>Terms</Link>
            {' · '}
            <Link href="/privacy" style={{ fontFamily: 'var(--font-space-mono), Space Mono, monospace', fontSize: '9px', color: '#444', textTransform: 'uppercase', textDecoration: 'none' }}>Privacy</Link>
          </div>
          <div className="flex justify-center gap-5 mb-4">
            <a href="https://instagram.com/avierafit" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ color: '#444', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#00ffcc'} onMouseLeave={e => e.currentTarget.style.color = '#444'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="https://tiktok.com/@avierafit" target="_blank" rel="noopener noreferrer" aria-label="TikTok" style={{ color: '#444', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#00ffcc'} onMouseLeave={e => e.currentTarget.style.color = '#444'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.98a8.21 8.21 0 0 0 4.76 1.52V7.05a4.84 4.84 0 0 1-1-.36z"/></svg>
            </a>
          </div>
          <p>
            Manufactured for and Distributed by: AvieraFit
            <br />
            4437 Lister St, San Diego, CA 92110 USA
            <br />
            Questions?{' '}
            <a href="mailto:info@avierafit.com" style={{ color: '#00ffcc', textDecoration: 'none' }}>
              info@avierafit.com
            </a>
          </p>
          <p className="mt-3">
            © 2026 Aviera Fit. All rights reserved.
            <br />
            *These statements have not been evaluated by the FDA. This product is not intended to
            diagnose, treat, cure, or prevent any disease.
          </p>
        </div>
      </footer>

      {/* Pulse animation for AI dot */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
