'use client';

import React, { useState, useEffect, useRef } from 'react';
import { fetchProductById, addToCart, initializeShopifyCart, getCheckoutUrl } from '../lib/shopify';
import { motion, useInView } from 'framer-motion';

// Animated section wrapper - fades up when scrolled into view
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

export default function FlowStateXPage() {
  const [variantId, setVariantId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [checkoutUrl, setCheckoutUrl] = useState(null);
  const [productImage, setProductImage] = useState(null);

  const SHOPIFY_PRODUCT_ID = '8645601657022';

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

  const ingredients = [
    { name: 'L-Citrulline DL-Malate', dose: '400 mg', desc: 'Vasodilation & blood flow' },
    { name: 'L-Arginine Hydrochloride', dose: '350 mg', desc: 'Nitric oxide precursor' },
    { name: 'L-Arginine Alpha-Ketoglutarate', dose: '50 mg', desc: 'Enhanced NO production' },
  ];

  const reviews = [
    {
      name: 'JAKE M.',
      rating: 5,
      text: '"Pumps are insane. I feel it within 30 minutes of taking it. This is my new staple."',
      tag: 'VERIFIED BUYER',
    },
    {
      name: 'SARAH K.',
      rating: 5,
      text: '"I bought this for my husband and now I take it too. Energy without the crash. Love it."',
      tag: 'VERIFIED BUYER',
    },
    {
      name: 'MARCUS T.',
      rating: 5,
      text: '"Been through every NO supplement on the market. This one actually delivers. Period."',
      tag: 'VERIFIED BUYER',
    },
  ];

  const ctaButton = (size = 'lg') => {
    const padding = size === 'lg' ? 'py-5 px-10 text-lg' : 'py-4 px-8 text-base';
    return (
      <div className="flex flex-col items-center gap-3 w-full">
        {!added ? (
          <button
            onClick={handleAddToCart}
            disabled={isAdding || isLoading || !variantId}
            className={`w-full max-w-md ${padding} font-bold uppercase tracking-widest transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed`}
            style={{
              fontFamily: 'var(--font-oswald), Oswald, sans-serif',
              background: '#00ffcc',
              color: '#000000',
              clipPath: 'polygon(0 0, 100% 0, 96% 100%, 4% 100%)',
            }}
          >
            {isAdding ? 'ADDING...' : 'ADD TO CART — $19.99'}
          </button>
        ) : (
          <>
            <div
              className={`w-full max-w-md ${padding} font-bold uppercase tracking-widest text-center`}
              style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                background: '#00ffcc',
                color: '#000000',
                clipPath: 'polygon(0 0, 100% 0, 96% 100%, 4% 100%)',
              }}
            >
              ADDED TO CART
            </div>
            {checkoutUrl && (
              <a
                href={checkoutUrl}
                className={`w-full max-w-md ${padding} font-bold uppercase tracking-widest text-center border-2 transition-all duration-300 block`}
                style={{
                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                  borderColor: '#00ffcc',
                  color: '#00ffcc',
                  background: 'transparent',
                  clipPath: 'polygon(0 0, 100% 0, 96% 100%, 4% 100%)',
                }}
              >
                CHECKOUT NOW
              </a>
            )}
          </>
        )}
        <p className="text-xs uppercase tracking-wider" style={{ color: '#666', fontFamily: 'var(--font-space-mono), Space Mono, monospace' }}>
          Free shipping on orders over $50
        </p>
      </div>
    );
  };

  return (
    <div
      className="min-h-screen relative"
      style={{ background: '#000000', color: '#ffffff', overflowX: 'hidden' }}
    >
      {/* Subtle horizontal line pattern background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(255,255,255,0.03) 59px, rgba(255,255,255,0.03) 60px)',
        }}
      />

      {/* ==================== HEADER ==================== */}
      <header className="relative z-10 py-4 px-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-[430px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: '#00ffcc' }} />
            <span
              className="text-sm font-bold uppercase tracking-[0.3em]"
              style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif' }}
            >
              AVIERA
            </span>
          </div>
          <span
            className="text-xs uppercase tracking-wider px-2 py-1"
            style={{ color: '#00ffcc', fontFamily: 'var(--font-space-mono), Space Mono, monospace', background: 'rgba(0,255,204,0.1)', fontWeight: 700, letterSpacing: '0.1em', fontSize: '9px' }}
          >
            LIMITED DROP
          </span>
        </div>
      </header>

      {/* ==================== HERO ==================== */}
      <section className="relative z-10 pt-12 pb-8 px-6">
        <div className="max-w-[430px] mx-auto">
          {/* Staggered hero text */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15 } },
            }}
          >
            <motion.p
              variants={{ hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0 } }}
              className="text-xs uppercase tracking-[0.4em] mb-6"
              style={{ color: '#00ffcc', fontFamily: 'var(--font-space-mono), Space Mono, monospace' }}
            >
              NITRIC OXIDE FORMULA
            </motion.p>

            <motion.h1
              variants={{ hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0 } }}
              className="text-7xl sm:text-8xl font-bold leading-[0.85] mb-2 uppercase"
              style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif' }}
            >
              FLOW
            </motion.h1>

            <motion.h1
              variants={{ hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0 } }}
              className="text-7xl sm:text-8xl font-bold leading-[0.85] mb-2 uppercase"
              style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif' }}
            >
              STATE
            </motion.h1>

            <motion.h1
              variants={{ hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0 } }}
              className="text-8xl sm:text-9xl font-bold leading-[0.85] mb-8"
              style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                color: '#00ffcc',
                textShadow: '0 0 40px rgba(0, 255, 204, 0.3)',
              }}
            >
              X
            </motion.h1>

            <motion.p
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="text-base leading-relaxed mb-8 max-w-sm"
              style={{ color: '#999', fontFamily: 'var(--font-space-mono), Space Mono, monospace', fontSize: '13px' }}
            >
              Engineered for athletes who refuse to plateau.
              Premium nitric oxide for blood flow, pumps, and
              sustained performance.
            </motion.p>
          </motion.div>

          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative mb-8"
          >
            <div className="relative mx-auto" style={{ maxWidth: '320px' }}>
              {/* Glow behind product */}
              <div
                className="absolute inset-0 blur-3xl opacity-20"
                style={{ background: 'radial-gradient(circle, #00ffcc 0%, transparent 70%)' }}
              />
              {productImage ? (
                <img
                  src={productImage}
                  alt="Flow State X - Nitric Oxide Formula"
                  className="relative z-10 w-full h-auto object-contain"
                  style={{ filter: 'drop-shadow(0 20px 40px rgba(0, 255, 204, 0.15))' }}
                />
              ) : isLoading ? (
                <div className="relative z-10 w-full aspect-square flex items-center justify-center">
                  <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#00ffcc', borderTopColor: 'transparent' }} />
                </div>
              ) : (
                <div className="relative z-10 w-full aspect-square flex items-center justify-center rounded-lg" style={{ background: '#0a0a0a' }}>
                  <span className="text-5xl">💊</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Price Block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex items-center gap-4 mb-8"
          >
            <span
              className="text-5xl font-bold"
              style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif', color: '#ffffff' }}
            >
              $19.99
            </span>
            <span
              className="text-xl line-through"
              style={{ color: '#666' }}
            >
              $39.99
            </span>
            <span
              className="text-xs font-bold uppercase tracking-wider px-3 py-1"
              style={{
                background: '#ff2d55',
                color: '#ffffff',
                fontFamily: 'var(--font-space-mono), Space Mono, monospace',
              }}
            >
              -50%
            </span>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            {ctaButton('lg')}
          </motion.div>
        </div>
      </section>

      {/* ==================== WHY THIS HITS DIFFERENT ==================== */}
      <section className="relative z-10 py-16 px-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-[430px] mx-auto">
          <FadeInSection>
            <p
              className="text-xs uppercase tracking-[0.4em] mb-3"
              style={{ color: '#00ffcc', fontFamily: 'var(--font-space-mono), Space Mono, monospace' }}
            >
              THE DIFFERENCE
            </p>
            <h2
              className="text-4xl sm:text-5xl font-bold uppercase mb-12 leading-tight"
              style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif' }}
            >
              WHY THIS HITS<br />
              <span style={{ color: '#00ffcc' }}>DIFFERENT</span>
            </h2>
          </FadeInSection>

          <div className="space-y-8">
            {[
              {
                num: '01',
                title: 'VASODILATION ON DEMAND',
                desc: 'L-Citrulline and L-Arginine open your blood vessels wider. More blood. More oxygen. More performance.',
              },
              {
                num: '02',
                title: 'NO CRASH FORMULA',
                desc: 'Zero caffeine, zero stimulants. Just clean, sustained flow that doesn\'t leave you wrecked.',
              },
              {
                num: '03',
                title: 'ABSORPTION FIRST',
                desc: 'Beetroot extract delivers natural nitrates that your body actually uses — not expensive urine.',
              },
              {
                num: '04',
                title: 'STACK FRIENDLY',
                desc: 'Designed to pair with pre-workout, creatine, or protein. No conflicting ingredients.',
              },
            ].map((item, i) => (
              <FadeInSection key={i} delay={i * 0.1}>
                <div className="flex gap-5">
                  <span
                    className="text-3xl font-bold shrink-0"
                    style={{
                      fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                      color: '#00ffcc',
                      opacity: 0.4,
                    }}
                  >
                    {item.num}
                  </span>
                  <div>
                    <h3
                      className="text-lg font-bold uppercase mb-1 tracking-wide"
                      style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif' }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: '#999', fontFamily: 'var(--font-space-mono), Space Mono, monospace', fontSize: '12px' }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== THE FORMULA ==================== */}
      <section className="relative z-10 py-16 px-6" style={{ background: '#0a0a0a' }}>
        <div className="max-w-[430px] mx-auto">
          <FadeInSection>
            <p
              className="text-xs uppercase tracking-[0.4em] mb-3"
              style={{ color: '#00ffcc', fontFamily: 'var(--font-space-mono), Space Mono, monospace' }}
            >
              WHAT&apos;S INSIDE
            </p>
            <h2
              className="text-4xl sm:text-5xl font-bold uppercase mb-12 leading-tight"
              style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif' }}
            >
              THE <span style={{ color: '#00ffcc' }}>FORMULA</span>
            </h2>
          </FadeInSection>

          <div className="space-y-0">
            {ingredients.map((ing, i) => (
              <FadeInSection key={i} delay={i * 0.08}>
                <div
                  className="flex items-center justify-between py-5"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div>
                    <span
                      className="text-lg font-bold uppercase tracking-wide"
                      style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif' }}
                    >
                      {ing.name}
                    </span>
                    <p
                      className="text-xs mt-1"
                      style={{ color: '#666', fontFamily: 'var(--font-space-mono), Space Mono, monospace' }}
                    >
                      {ing.desc}
                    </p>
                  </div>
                  <span
                    className="text-sm font-bold shrink-0 ml-4"
                    style={{ color: '#00ffcc', fontFamily: 'var(--font-space-mono), Space Mono, monospace' }}
                  >
                    {ing.dose}
                  </span>
                </div>
              </FadeInSection>
            ))}
          </div>

          <FadeInSection delay={0.4}>
            <p
              className="text-xs mt-6 text-center"
              style={{ color: '#444', fontFamily: 'var(--font-space-mono), Space Mono, monospace' }}
            >
              Full transparent label. No proprietary blends.
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* ==================== REVIEWS ==================== */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-[430px] mx-auto">
          <FadeInSection>
            <p
              className="text-xs uppercase tracking-[0.4em] mb-3"
              style={{ color: '#00ffcc', fontFamily: 'var(--font-space-mono), Space Mono, monospace' }}
            >
              REAL TALK
            </p>
            <h2
              className="text-4xl sm:text-5xl font-bold uppercase mb-12 leading-tight"
              style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif' }}
            >
              WHAT THEY&apos;RE<br />
              <span style={{ color: '#00ffcc' }}>SAYING</span>
            </h2>
          </FadeInSection>

          <div className="space-y-6">
            {reviews.map((review, i) => (
              <FadeInSection key={i} delay={i * 0.12}>
                <div
                  className="p-6"
                  style={{
                    background: '#0a0a0a',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: review.rating }).map((_, j) => (
                      <span key={j} style={{ color: '#00ffcc', fontSize: '14px' }}>&#9733;</span>
                    ))}
                  </div>

                  <p
                    className="text-sm leading-relaxed mb-4"
                    style={{ color: '#ccc', fontFamily: 'var(--font-space-mono), Space Mono, monospace', fontSize: '12px' }}
                  >
                    {review.text}
                  </p>

                  <div className="flex items-center justify-between">
                    <span
                      className="text-sm font-bold uppercase tracking-wider"
                      style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif' }}
                    >
                      {review.name}
                    </span>
                    <span
                      className="text-xs uppercase tracking-wider px-2 py-1"
                      style={{
                        color: '#00ffcc',
                        border: '1px solid rgba(0, 255, 204, 0.2)',
                        fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                        fontSize: '9px',
                      }}
                    >
                      {review.tag}
                    </span>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== BOTTOM CTA ==================== */}
      <section className="relative z-10 py-20 px-6" style={{ background: '#0a0a0a' }}>
        <div className="max-w-[430px] mx-auto text-center">
          <FadeInSection>
            <h2
              className="text-5xl sm:text-6xl font-bold uppercase mb-4 leading-[0.9]"
              style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif' }}
            >
              DON&apos;T<br />TRAIN<br />
              <span style={{ color: '#ff2d55' }}>FLAT.</span>
            </h2>

            <p
              className="text-sm mb-10 max-w-xs mx-auto"
              style={{ color: '#666', fontFamily: 'var(--font-space-mono), Space Mono, monospace', fontSize: '12px' }}
            >
              Limited batch. Once it&apos;s gone, it&apos;s gone.
              Get yours before we restock at full price.
            </p>

            {/* Price repeat */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span
                className="text-4xl font-bold"
                style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif' }}
              >
                $19.99
              </span>
              <span className="text-lg line-through" style={{ color: '#666' }}>
                $39.99
              </span>
              <span
                className="text-xs font-bold uppercase px-3 py-1"
                style={{
                  background: '#ff2d55',
                  color: '#fff',
                  fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                }}
              >
                -50%
              </span>
            </div>

            {ctaButton('lg')}
          </FadeInSection>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="relative z-10 py-10 px-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-[430px] mx-auto text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full" style={{ background: '#00ffcc' }} />
            <span
              className="text-sm font-bold uppercase tracking-[0.3em]"
              style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif' }}
            >
              AVIERA
            </span>
          </div>

          <p
            className="text-xs leading-relaxed max-w-sm mx-auto"
            style={{ color: '#444', fontFamily: 'var(--font-space-mono), Space Mono, monospace', fontSize: '10px' }}
          >
            Manufactured in the USA in a GMP-certified facility.
            Third-party tested for purity and potency.
          </p>

          <p
            className="text-xs leading-relaxed max-w-sm mx-auto"
            style={{ color: '#333', fontFamily: 'var(--font-space-mono), Space Mono, monospace', fontSize: '9px' }}
          >
            *These statements have not been evaluated by the Food and Drug
            Administration. This product is not intended to diagnose, treat,
            cure, or prevent any disease.
          </p>

          <p
            className="text-xs pt-4"
            style={{ color: '#333', fontFamily: 'var(--font-space-mono), Space Mono, monospace', fontSize: '10px' }}
          >
            &copy; {new Date().getFullYear()} Aviera. All rights reserved.
          </p>
          <div className="flex justify-center gap-4 mt-3">
            <a href="/terms" style={{ fontFamily: 'var(--font-space-mono), Space Mono, monospace', fontSize: '9px', color: '#444', textTransform: 'uppercase', textDecoration: 'none' }}>Terms</a>
            <a href="/privacy" style={{ fontFamily: 'var(--font-space-mono), Space Mono, monospace', fontSize: '9px', color: '#444', textTransform: 'uppercase', textDecoration: 'none' }}>Privacy</a>
          </div>
          <div className="flex justify-center gap-5 mt-4">
            <a href="https://instagram.com/avierafit" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ color: '#444', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#00ffcc'} onMouseLeave={e => e.currentTarget.style.color = '#444'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="https://tiktok.com/@avierafit" target="_blank" rel="noopener noreferrer" aria-label="TikTok" style={{ color: '#444', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#00ffcc'} onMouseLeave={e => e.currentTarget.style.color = '#444'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.98a8.21 8.21 0 0 0 4.76 1.52V7.05a4.84 4.84 0 0 1-1-.36z"/></svg>
            </a>
          </div>
        </div>
      </footer>

      {/* Hidden Shopify cart elements */}
      <div id="shopify-cart-toggle" className="hidden" />
      <div id="shopify-cart" className="hidden" />
    </div>
  );
}
