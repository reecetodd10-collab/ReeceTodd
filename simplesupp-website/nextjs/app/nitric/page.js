'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fetchProductById, addToCart, initializeShopifyCart, getCheckoutUrl } from '../lib/shopify';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { trackAddToCart, trackInitiateCheckout, trackViewContent } from '../components/TikTokPixel';

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

// Interactive dot grid canvas background
function DotGridCanvas() {
  const canvasRef = useRef(null);
  const dotsRef = useRef([]);
  const scrollYRef = useRef(0);
  const timeRef = useRef(0);
  const frameRef = useRef(null);

  const CONFIG = {
    spacingX: 48,
    spacingY: 48,
    dotRadius: 1.2,
    dotColorIdle: 'rgba(170, 190, 178, 0.25)',
    lineColor: [0, 200, 160],
    lineMaxOpacity: 0.16,
    connectRadiusY: 100,
    connectRadiusX: 36,
    activationBand: 240,
  };

  const buildGrid = useCallback((W, pageH) => {
    const dots = [];
    const { spacingX, spacingY } = CONFIG;
    for (let row = 0; row <= Math.ceil(pageH / spacingY); row++) {
      for (let col = 0; col <= Math.ceil(W / spacingX); col++) {
        dots.push({
          x: col * spacingX + (row % 2 === 0 ? 0 : spacingX * 0.5),
          y: row * spacingY,
          phase: Math.random() * Math.PI * 2,
          jitterX: (Math.random() - 0.5) * 2,
          jitterY: (Math.random() - 0.5) * 2,
        });
      }
    }
    return dots;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H;

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      const pageH = document.body.scrollHeight;
      dotsRef.current = buildGrid(W, pageH);
    };

    const draw = () => {
      timeRef.current += 0.01;
      const time = timeRef.current;
      ctx.clearRect(0, 0, W, H);

      const sY = scrollYRef.current;
      const viewTop = sY - 80;
      const viewBot = sY + H + 80;
      const viewMid = sY + H * 0.5;
      const { lineColor, lineMaxOpacity, connectRadiusX, connectRadiusY, activationBand, dotRadius, dotColorIdle } = CONFIG;
      const [lr, lg, lb] = lineColor;

      // Visible dots
      const visible = [];
      for (let i = 0; i < dotsRef.current.length; i++) {
        const d = dotsRef.current[i];
        if (d.y >= viewTop && d.y <= viewBot) visible.push(d);
      }

      // Draw connections
      for (let i = 0; i < visible.length; i++) {
        const a = visible[i];
        const ax = a.x + a.jitterX;
        const ay = a.y + a.jitterY;
        const screenAY = ay - sY;

        for (let j = i + 1; j < visible.length; j++) {
          const b = visible[j];
          const bx = b.x + b.jitterX;
          const by = b.y + b.jitterY;
          const dx = Math.abs(ax - bx);
          const dy = Math.abs(ay - by);

          if (dx > connectRadiusX || dy > connectRadiusY || dy < CONFIG.spacingY * 0.5) continue;

          const avgMid = (Math.abs(ay - viewMid) + Math.abs(by - viewMid)) / 2;
          let activation = Math.max(0, 1 - avgMid / activationBand);

          const wave = Math.sin((ay + by) * 0.008 + time * 1.5) * 0.5 + 0.5;
          activation *= wave;

          const connPhase = Math.sin(a.phase + b.phase + time * 0.8);
          activation *= (0.5 + connPhase * 0.5);

          if (activation < 0.05) continue;

          const opacity = lineMaxOpacity * activation;
          const screenBY = by - sY;

          ctx.strokeStyle = `rgba(${lr},${lg},${lb},${opacity.toFixed(3)})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(ax, screenAY);
          ctx.lineTo(bx, screenBY);
          ctx.stroke();

          // Subtle data pulse on strong connections
          if (activation > 0.55) {
            const pulseT = (time * 1.5 + a.phase) % 1;
            const px = ax + (bx - ax) * pulseT;
            const py = screenAY + (screenBY - screenAY) * pulseT;
            const pulseOpacity = activation * 0.25 * Math.sin(pulseT * Math.PI);
            if (pulseOpacity > 0.02) {
              ctx.fillStyle = `rgba(0, 210, 160, ${pulseOpacity.toFixed(3)})`;
              ctx.beginPath();
              ctx.arc(px, py, 1.0, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }

      // Draw dots
      for (let i = 0; i < visible.length; i++) {
        const d = visible[i];
        const ddx = d.x + d.jitterX;
        const ddy = d.y + d.jitterY;
        const screenY = ddy - sY;
        const proximity = Math.max(0, 1 - Math.abs(ddy - viewMid) / activationBand);

        if (proximity > 0.25) {
          const alpha = 0.2 + proximity * 0.25;
          const r = dotRadius + proximity * 0.4;
          ctx.fillStyle = `rgba(0, 200, 160, ${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(ddx, screenY, r, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = dotColorIdle;
          ctx.beginPath();
          ctx.arc(ddx, screenY, dotRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    const onScroll = () => {
      scrollYRef.current = window.pageYOffset || document.documentElement.scrollTop;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', resize);
    resize();
    frameRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resize);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [buildGrid]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}

export default function FlowStateXPage() {
  const [variantId, setVariantId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [checkoutUrl, setCheckoutUrl] = useState(null);
  const [productImage, setProductImage] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const SHOPIFY_PRODUCT_ID = '8645601657022';

  // Listen for cart updates
  useEffect(() => {
    const handleCartUpdate = (e) => {
      setCartCount(e.detail?.itemCount || 0);
    };
    window.addEventListener('shopify:cart:updated', handleCartUpdate);
    return () => window.removeEventListener('shopify:cart:updated', handleCartUpdate);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await fetchProductById(SHOPIFY_PRODUCT_ID);
        if (product?.variantId) setVariantId(product.variantId);
        const img = product?.images?.[0] || product?.image || null;
        if (img) setProductImage(img);
        trackViewContent({ contentId: SHOPIFY_PRODUCT_ID, contentName: 'Flow State X', price: 19.99 });
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
      setCartCount(prev => prev + 1);
      trackAddToCart({ contentId: SHOPIFY_PRODUCT_ID, contentName: 'Flow State X', price: 19.99 });
      const url = await getCheckoutUrl();
      setCheckoutUrl(url);
      window.dispatchEvent(new CustomEvent('shopify:cart:updated', { detail: { itemCount: cartCount + 1 } }));
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
            className={`w-full max-w-md ${padding} font-bold uppercase tracking-widest transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed rounded-md hover:-translate-y-0.5`}
            style={{
              fontFamily: 'var(--font-oswald), Oswald, sans-serif',
              background: '#00e6b0',
              color: '#0a4a3a',
              boxShadow: '0 4px 20px rgba(0, 230, 176, 0.2)',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 230, 176, 0.35)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 230, 176, 0.2)'}
          >
            {isAdding ? 'ADDING...' : 'ADD TO CART — $19.99'}
          </button>
        ) : (
          <>
            <div
              className={`w-full max-w-md ${padding} font-bold uppercase tracking-widest text-center rounded-md`}
              style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                background: '#00e6b0',
                color: '#0a4a3a',
              }}
            >
              ADDED TO CART
            </div>
            {checkoutUrl && (
              <a
                href={checkoutUrl}
                onClick={() => trackInitiateCheckout({ contentIds: [SHOPIFY_PRODUCT_ID], value: 19.99 })}
                className={`w-full max-w-md ${padding} font-bold uppercase tracking-widest text-center border-2 transition-all duration-300 block rounded-md hover:-translate-y-0.5`}
                style={{
                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                  borderColor: '#00e6b0',
                  color: '#0a4a3a',
                  background: 'transparent',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#00e6b0'; e.currentTarget.style.color = '#0a4a3a'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#0a4a3a'; }}
              >
                CHECKOUT NOW
              </a>
            )}
          </>
        )}
        <p className="text-xs uppercase tracking-wider" style={{ color: '#8a8a8a', fontFamily: 'var(--font-space-mono), Space Mono, monospace' }}>
          Free shipping on orders over $50
        </p>
      </div>
    );
  };

  return (
    <div
      className="min-h-screen relative"
      style={{ background: '#fafaf5', color: '#1a1a1a', overflowX: 'hidden' }}
    >
      {/* Interactive dot grid canvas */}
      <DotGridCanvas />

      {/* ==================== HEADER ==================== */}
      <header className="relative z-10 py-3.5 px-6 sticky top-0" style={{ background: '#0a4a3a', zIndex: 100 }}>
        <div className="max-w-[430px] mx-auto flex items-center justify-between">
          <Link href="/home" className="flex items-center gap-2 no-underline" style={{ textDecoration: 'none', color: '#ffffff' }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#00e6b0', boxShadow: '0 0 6px #00e6b0' }} />
            <span
              className="text-sm font-bold uppercase tracking-[0.3em]"
              style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif' }}
            >
              AVIERA
            </span>
          </Link>
          <div className="flex items-center gap-3">
            {/* Cart icon */}
            {cartCount > 0 && (
              <button
                onClick={async () => {
                  trackInitiateCheckout({ contentIds: [SHOPIFY_PRODUCT_ID], value: 19.99 });
                  const url = checkoutUrl || await getCheckoutUrl();
                  if (url) window.location.href = url;
                }}
                className="relative bg-transparent border-none cursor-pointer p-1"
                aria-label="Shopping cart"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{
                    background: '#00e6b0',
                    color: '#0a4a3a',
                    fontSize: '9px',
                    fontWeight: 700,
                    fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                  }}
                >
                  {cartCount}
                </span>
              </button>
            )}
            <span
              className="text-xs uppercase tracking-wider px-2.5 py-1 rounded-sm"
              style={{ color: '#ffffff', fontFamily: 'var(--font-space-mono), Space Mono, monospace', background: '#ff6b4a', fontWeight: 700, letterSpacing: '0.1em', fontSize: '9px' }}
            >
              LIMITED DROP
            </span>
          </div>
        </div>
      </header>

      {/* ==================== HERO ==================== */}
      <section className="relative z-10 pt-14 pb-8 px-6">
        <div className="max-w-[430px] mx-auto">
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
              className="text-xs uppercase tracking-[0.4em] mb-6 font-bold"
              style={{ color: '#0a4a3a', fontFamily: 'var(--font-space-mono), Space Mono, monospace' }}
            >
              NITRIC OXIDE FORMULA
            </motion.p>

            <motion.h1
              variants={{ hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0 } }}
              className="text-7xl sm:text-8xl font-bold leading-[0.85] mb-2 uppercase"
              style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif', color: '#0a4a3a' }}
            >
              FLOW
            </motion.h1>

            <motion.h1
              variants={{ hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0 } }}
              className="text-7xl sm:text-8xl font-bold leading-[0.85] mb-2 uppercase"
              style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif', color: '#0a4a3a' }}
            >
              STATE
            </motion.h1>

            <motion.h1
              variants={{ hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0 } }}
              className="text-8xl sm:text-9xl font-bold leading-[0.85] mb-8"
              style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                color: '#00e6b0',
                textShadow: '0 4px 30px rgba(0, 230, 176, 0.25)',
              }}
            >
              X
            </motion.h1>

            <motion.p
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="text-base leading-relaxed mb-8 max-w-sm"
              style={{ color: '#5a5a5a', fontFamily: 'var(--font-space-mono), Space Mono, monospace', fontSize: '13px' }}
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
            <div className="relative mx-auto rounded-2xl overflow-hidden" style={{ maxWidth: '320px', background: 'linear-gradient(160deg, #e8f5f0 0%, #f5f5eb 40%, #e0f0e8 100%)', boxShadow: '0 20px 60px rgba(10, 74, 58, 0.08)' }}>
              {/* Subtle radial glow */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(circle at 40% 60%, rgba(0, 230, 176, 0.1) 0%, transparent 60%)' }}
              />
              {productImage ? (
                <img
                  src={productImage}
                  alt="Flow State X - Nitric Oxide Formula"
                  className="relative z-10 w-full h-auto object-contain"
                  style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.08))' }}
                />
              ) : isLoading ? (
                <div className="relative z-10 w-full aspect-square flex items-center justify-center">
                  <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#00e6b0', borderTopColor: 'transparent' }} />
                </div>
              ) : (
                <div className="relative z-10 w-full aspect-square flex items-center justify-center">
                  <span className="text-5xl" style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.08))' }}>💊</span>
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
              style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif', color: '#0a4a3a' }}
            >
              $19.99
            </span>
            <span
              className="text-xl line-through"
              style={{ color: '#8a8a8a' }}
            >
              $39.99
            </span>
            <span
              className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-sm"
              style={{
                background: '#ff6b4a',
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
      <section className="relative z-10 py-16 px-6" style={{ borderTop: '1px solid #e8e8e0' }}>
        <div className="max-w-[430px] mx-auto">
          <FadeInSection>
            <p
              className="text-xs uppercase tracking-[0.4em] mb-3 font-bold"
              style={{ color: '#0a4a3a', fontFamily: 'var(--font-space-mono), Space Mono, monospace' }}
            >
              THE DIFFERENCE
            </p>
            <h2
              className="text-4xl sm:text-5xl font-bold uppercase mb-12 leading-tight"
              style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif', color: '#0a4a3a' }}
            >
              WHY THIS HITS<br />
              <span style={{ color: '#00e6b0' }}>DIFFERENT</span>
            </h2>
          </FadeInSection>

          <div className="space-y-6">
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
                <div
                  className="flex gap-5 p-5 rounded-r-lg transition-all duration-300 hover:translate-x-1.5"
                  style={{
                    background: '#ffffff',
                    borderLeft: '3px solid #00e6b0',
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.03)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(0, 230, 176, 0.1)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.03)'}
                >
                  <span
                    className="text-3xl font-bold shrink-0"
                    style={{
                      fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                      color: '#00e6b0',
                      opacity: 0.5,
                    }}
                  >
                    {item.num}
                  </span>
                  <div>
                    <h3
                      className="text-lg font-bold uppercase mb-1 tracking-wide"
                      style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif', color: '#0a4a3a' }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: '#5a5a5a', fontFamily: 'var(--font-space-mono), Space Mono, monospace', fontSize: '11px', lineHeight: '1.7' }}
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
      <section className="relative z-10 py-16 px-6" style={{ background: 'rgba(0, 230, 176, 0.03)' }}>
        <div className="max-w-[430px] mx-auto">
          <FadeInSection>
            <p
              className="text-xs uppercase tracking-[0.4em] mb-3 font-bold"
              style={{ color: '#0a4a3a', fontFamily: 'var(--font-space-mono), Space Mono, monospace' }}
            >
              WHAT&apos;S INSIDE
            </p>
            <h2
              className="text-4xl sm:text-5xl font-bold uppercase mb-12 leading-tight"
              style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif', color: '#0a4a3a' }}
            >
              THE <span style={{ color: '#00e6b0' }}>FORMULA</span>
            </h2>
          </FadeInSection>

          <div className="space-y-0">
            {ingredients.map((ing, i) => (
              <FadeInSection key={i} delay={i * 0.08}>
                <div
                  className="flex items-center justify-between py-5 transition-all duration-300 hover:pl-2"
                  style={{ borderBottom: '1px solid #e8e8e0' }}
                >
                  <div>
                    <span
                      className="text-lg font-bold uppercase tracking-wide"
                      style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif', color: '#0a4a3a' }}
                    >
                      {ing.name}
                    </span>
                    <p
                      className="text-xs mt-1"
                      style={{ color: '#8a8a8a', fontFamily: 'var(--font-space-mono), Space Mono, monospace' }}
                    >
                      {ing.desc}
                    </p>
                  </div>
                  <span
                    className="text-sm font-bold shrink-0 ml-4"
                    style={{ color: '#00e6b0', fontFamily: 'var(--font-space-mono), Space Mono, monospace' }}
                  >
                    {ing.dose}
                  </span>
                </div>
              </FadeInSection>
            ))}
          </div>

          <FadeInSection delay={0.4}>
            <p
              className="text-xs mt-6 text-center uppercase tracking-wider"
              style={{ color: '#8a8a8a', fontFamily: 'var(--font-space-mono), Space Mono, monospace' }}
            >
              Full transparent label. No proprietary blends.
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* ==================== REVIEWS ==================== */}
      <section className="relative z-10 py-16 px-6" style={{ borderTop: '1px solid #e8e8e0' }}>
        <div className="max-w-[430px] mx-auto">
          <FadeInSection>
            <p
              className="text-xs uppercase tracking-[0.4em] mb-3 font-bold"
              style={{ color: '#0a4a3a', fontFamily: 'var(--font-space-mono), Space Mono, monospace' }}
            >
              REAL TALK
            </p>
            <h2
              className="text-4xl sm:text-5xl font-bold uppercase mb-12 leading-tight"
              style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif', color: '#0a4a3a' }}
            >
              WHAT THEY&apos;RE<br />
              <span style={{ color: '#00e6b0' }}>SAYING</span>
            </h2>
          </FadeInSection>

          <div className="space-y-4">
            {reviews.map((review, i) => (
              <FadeInSection key={i} delay={i * 0.12}>
                <div
                  className="p-6 rounded-r-lg transition-all duration-300 hover:translate-x-1"
                  style={{
                    background: '#ffffff',
                    borderLeft: '3px solid #00e6b0',
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.03)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(0, 230, 176, 0.1)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.03)'}
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: review.rating }).map((_, j) => (
                      <span key={j} style={{ color: '#00e6b0', fontSize: '13px' }}>&#9733;</span>
                    ))}
                  </div>

                  <p
                    className="text-sm leading-relaxed mb-4"
                    style={{ color: '#5a5a5a', fontFamily: 'var(--font-space-mono), Space Mono, monospace', fontSize: '11px', lineHeight: '1.8' }}
                  >
                    {review.text}
                  </p>

                  <div className="flex items-center justify-between">
                    <span
                      className="text-sm font-bold uppercase tracking-wider"
                      style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif', color: '#0a4a3a' }}
                    >
                      {review.name}
                    </span>
                    <span
                      className="text-xs uppercase tracking-wider px-2 py-1 rounded-sm"
                      style={{
                        color: '#00e6b0',
                        border: '1px solid rgba(0, 230, 176, 0.3)',
                        fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                        fontSize: '8px',
                        fontWeight: 700,
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
      <section className="relative z-10 py-20 px-6" style={{ background: 'rgba(0, 230, 176, 0.03)' }}>
        <div className="max-w-[430px] mx-auto text-center">
          <FadeInSection>
            <h2
              className="text-5xl sm:text-6xl font-bold uppercase mb-4 leading-[0.9]"
              style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif', color: '#0a4a3a' }}
            >
              DON&apos;T<br />TRAIN<br />
              <span style={{ color: '#ff6b4a' }}>FLAT.</span>
            </h2>

            <p
              className="text-sm mb-10 max-w-xs mx-auto"
              style={{ color: '#ff6b4a', fontFamily: 'var(--font-space-mono), Space Mono, monospace', fontSize: '11px', lineHeight: '1.7' }}
            >
              Limited batch. Once it&apos;s gone, it&apos;s gone.
              Get yours before we restock at full price.
            </p>

            {/* Price repeat */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span
                className="text-4xl font-bold"
                style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif', color: '#0a4a3a' }}
              >
                $19.99
              </span>
              <span className="text-lg line-through" style={{ color: '#8a8a8a' }}>
                $39.99
              </span>
              <span
                className="text-xs font-bold uppercase px-3 py-1 rounded-sm"
                style={{
                  background: '#ff6b4a',
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
      <footer className="relative z-10 py-10 px-6" style={{ borderTop: '1px solid #e8e8e0' }}>
        <div className="max-w-[430px] mx-auto text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#00e6b0', boxShadow: '0 0 6px #00e6b0' }} />
            <span
              className="text-sm font-bold uppercase tracking-[0.3em]"
              style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif', color: '#0a4a3a' }}
            >
              AVIERA
            </span>
          </div>

          <p
            className="text-xs leading-relaxed max-w-sm mx-auto"
            style={{ color: '#8a8a8a', fontFamily: 'var(--font-space-mono), Space Mono, monospace', fontSize: '10px' }}
          >
            Manufactured in the USA in a GMP-certified facility.
            Third-party tested for purity and potency.
          </p>

          <p
            className="text-xs leading-relaxed max-w-sm mx-auto"
            style={{ color: '#aaa', fontFamily: 'var(--font-space-mono), Space Mono, monospace', fontSize: '9px' }}
          >
            *These statements have not been evaluated by the Food and Drug
            Administration. This product is not intended to diagnose, treat,
            cure, or prevent any disease.
          </p>

          <p
            className="text-xs pt-4"
            style={{ color: '#aaa', fontFamily: 'var(--font-space-mono), Space Mono, monospace', fontSize: '10px' }}
          >
            &copy; {new Date().getFullYear()} Aviera. All rights reserved.
          </p>
          <div className="flex justify-center gap-4 mt-3">
            <a href="/terms" style={{ fontFamily: 'var(--font-space-mono), Space Mono, monospace', fontSize: '9px', color: '#8a8a8a', textTransform: 'uppercase', textDecoration: 'none', letterSpacing: '0.1em' }}>Terms</a>
            <a href="/privacy" style={{ fontFamily: 'var(--font-space-mono), Space Mono, monospace', fontSize: '9px', color: '#8a8a8a', textTransform: 'uppercase', textDecoration: 'none', letterSpacing: '0.1em' }}>Privacy</a>
          </div>
          <div className="flex justify-center gap-5 mt-4">
            <a href="https://instagram.com/avierafit" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ color: '#8a8a8a', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#00e6b0'} onMouseLeave={e => e.currentTarget.style.color = '#8a8a8a'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="https://tiktok.com/@avierafit" target="_blank" rel="noopener noreferrer" aria-label="TikTok" style={{ color: '#8a8a8a', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#00e6b0'} onMouseLeave={e => e.currentTarget.style.color = '#8a8a8a'}>
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
