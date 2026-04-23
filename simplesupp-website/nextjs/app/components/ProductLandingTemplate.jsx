'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fetchShopifyProducts, addToCart, initializeShopifyCart, getCheckoutUrl } from '../lib/shopify';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { trackViewContent, trackAddToCart, trackInitiateCheckout } from '../lib/tracking';
import ProductDetailModal from './ProductDetailModal';
import CartDrawer from './CartDrawer';
import { ShoppingBag } from 'lucide-react';

// ─── Animated section wrapper ───
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

// ─── Hex → "r, g, b" string helper ───
function hexToRgbStr(hex) {
  const m = hex.replace('#', '').match(/.{2}/g);
  if (!m) return '0, 0, 0';
  const [r, g, b] = m.map((x) => parseInt(x, 16));
  return `${r}, ${g}, ${b}`;
}
function hexToRgbArr(hex) {
  return hexToRgbStr(hex).split(',').map((x) => parseInt(x.trim(), 10));
}

// ─── Themed dot grid canvas ───
function DotGridCanvas({ primaryHex }) {
  const canvasRef = useRef(null);
  const dotsRef = useRef([]);
  const scrollYRef = useRef(0);
  const timeRef = useRef(0);
  const frameRef = useRef(null);

  const lineColor = hexToRgbArr(primaryHex);
  const idleColor = `rgba(${lineColor.join(',')}, 0.18)`;
  const activeColor = `rgba(${lineColor.join(',')}, `;

  const CONFIG = {
    spacingX: 48,
    spacingY: 48,
    dotRadius: 1.2,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const { lineMaxOpacity, connectRadiusX, connectRadiusY, activationBand, dotRadius } = CONFIG;
      const [lr, lg, lb] = lineColor;

      const visible = [];
      for (let i = 0; i < dotsRef.current.length; i++) {
        const d = dotsRef.current[i];
        if (d.y >= viewTop && d.y <= viewBot) visible.push(d);
      }

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
          activation *= 0.5 + connPhase * 0.5;
          if (activation < 0.05) continue;

          const opacity = lineMaxOpacity * activation;
          const screenBY = by - sY;
          ctx.strokeStyle = `rgba(${lr},${lg},${lb},${opacity.toFixed(3)})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(ax, screenAY);
          ctx.lineTo(bx, screenBY);
          ctx.stroke();

          if (activation > 0.55) {
            const pulseT = (time * 1.5 + a.phase) % 1;
            const px = ax + (bx - ax) * pulseT;
            const py = screenAY + (screenBY - screenAY) * pulseT;
            const pulseOpacity = activation * 0.25 * Math.sin(pulseT * Math.PI);
            if (pulseOpacity > 0.02) {
              ctx.fillStyle = `${activeColor}${pulseOpacity.toFixed(3)})`;
              ctx.beginPath();
              ctx.arc(px, py, 1.0, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }

      for (let i = 0; i < visible.length; i++) {
        const d = visible[i];
        const ddx = d.x + d.jitterX;
        const ddy = d.y + d.jitterY;
        const screenY = ddy - sY;
        const proximity = Math.max(0, 1 - Math.abs(ddy - viewMid) / activationBand);

        if (proximity > 0.25) {
          const alpha = 0.2 + proximity * 0.25;
          const r = dotRadius + proximity * 0.4;
          ctx.fillStyle = `${activeColor}${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(ddx, screenY, r, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = idleColor;
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
  }, [buildGrid, lineColor, activeColor, idleColor]);

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

// ═══════════════════════════════════════════════════════════════════
// PRODUCT LANDING TEMPLATE
// ═══════════════════════════════════════════════════════════════════
export default function ProductLandingTemplate({ config }) {
  const {
    displayName,
    productMatchers,            // array of lowercase substrings; product must include all
    fallbackEmoji,
    hero,                       // { eyebrow, titleLines: [str, str, str], titleAccentLine: number, subtitle, badge }
    price,                      // { display: '$24.99', value: 24.99 }
    servingsText,               // 'CAPSULES' or '30 SERVINGS'
    colors,                     // { primary, dark, bg, accent, bodyText, mutedText, borderTint }
    benefits,                   // array of {num, title, desc}
    ingredients,                // array of {name, dose, desc}
    reviews,                    // array of {name, rating, text, tag}
    bottomCTA,                  // { titleLines: [s,s,s], accentLineIdx, body }
    formulaSubtitle,            // small line under formula list
    transparencyTagline,        // muted line above ingredients
    faqs,                       // optional array of {q, a} — renders visible FAQ/AI-quotable answer section
    learnLinks,                 // optional array of {label, href} — links to /learn articles
  } = config;

  const PRIMARY = colors.primary;
  const DARK = colors.dark;
  const BG = colors.bg;
  const ACCENT = colors.accent;
  const BODY_TXT = colors.bodyText;
  const MUTED_TXT = colors.mutedText;
  const BORDER_TINT = colors.borderTint;
  const PRIMARY_RGB = hexToRgbStr(PRIMARY);

  const [variantId, setVariantId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [checkoutUrl, setCheckoutUrl] = useState(null);
  const [productImage, setProductImage] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [fullProduct, setFullProduct] = useState(null);
  const [showProductCard, setShowProductCard] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const handleCartUpdate = (e) => setCartCount(e.detail?.itemCount || 0);
    window.addEventListener('shopify:cart:updated', handleCartUpdate);
    return () => window.removeEventListener('shopify:cart:updated', handleCartUpdate);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const all = await fetchShopifyProducts();
        const found = all.find((p) => {
          const t = (p.title || '').toLowerCase();
          return productMatchers.every((m) => t.includes(m.toLowerCase()));
        });
        if (found) {
          setVariantId(found.variantId);
          const img = found.images?.[0] || found.image || null;
          if (img) setProductImage(img);
          if (found.images?.length > 0) setProductImages(found.images);
          setFullProduct(found);
          trackViewContent(found.title, found.variantId, price.value);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
    initializeShopifyCart().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddToCart = async () => {
    if (!variantId) return;
    setIsAdding(true);
    try {
      await addToCart(variantId, 1);
      setAdded(true);
      setCartCount((prev) => prev + 1);
      trackAddToCart(displayName, variantId, price.value);
      const url = await getCheckoutUrl();
      setCheckoutUrl(url);
      window.dispatchEvent(new CustomEvent('shopify:cart:updated', { detail: { itemCount: cartCount + 1 } }));
    } catch (err) {
      console.error('Failed to add to cart:', err);
    } finally {
      setIsAdding(false);
    }
  };

  const oswald = { fontFamily: 'var(--font-oswald), Oswald, sans-serif' };
  const mono = { fontFamily: 'var(--font-space-mono), Space Mono, monospace' };

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
              ...oswald,
              background: PRIMARY,
              color: DARK,
              boxShadow: `0 4px 24px rgba(${PRIMARY_RGB}, 0.3)`,
              border: 'none',
              cursor: isAdding ? 'wait' : 'pointer',
            }}
          >
            {isAdding ? 'ADDING...' : `ADD TO CART — ${price.display}`}
          </button>
        ) : (
          <>
            <div
              className={`w-full max-w-md ${padding} font-bold uppercase tracking-widest rounded-md text-center`}
              style={{
                ...oswald,
                background: 'transparent',
                color: PRIMARY,
                border: `2px solid ${PRIMARY}`,
              }}
            >
              ADDED TO CART ✓
            </div>
            <button
              onClick={async () => {
                trackInitiateCheckout(price.value, [variantId]);
                const url = checkoutUrl || (await getCheckoutUrl());
                if (url) window.location.href = url;
              }}
              className="w-full max-w-md py-4 px-8 text-base font-bold uppercase tracking-widest rounded-md transition-all duration-300 hover:-translate-y-0.5"
              style={{
                ...oswald,
                background: DARK,
                color: PRIMARY,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              }}
            >
              CHECKOUT →
            </button>
          </>
        )}
        <p className="text-xs uppercase tracking-wider" style={{ color: MUTED_TXT, ...mono }}>
          Free shipping on orders over $50
        </p>
      </div>
    );
  };

  return (
    <div
      className="min-h-screen relative"
      style={{ background: BG, color: '#1a1a1a', overflowX: 'hidden' }}
    >
      <DotGridCanvas primaryHex={PRIMARY} />

      {/* HEADER */}
      <header className="relative z-10 py-3.5 px-6 sticky top-0" style={{ background: DARK, zIndex: 100 }}>
        <div className="max-w-[430px] md:max-w-5xl lg:max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/home" className="flex items-center gap-2 no-underline" style={{ textDecoration: 'none', color: '#fff' }}>
            <svg width="20" height="20" viewBox="0 0 42 42" fill="none">
              <circle cx="21" cy="21" r="19" stroke={PRIMARY} strokeWidth="2"/>
              <path d="M21 12 L21 30" stroke={PRIMARY} strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M15 18 L21 12 L27 18" stroke={PRIMARY} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontFamily: "'Orbitron', var(--font-oswald), sans-serif", fontSize: '11px', fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase' }}>
              AVIERA
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCartOpen(true)}
              className="relative bg-transparent border-none cursor-pointer p-1 flex items-center justify-center"
              aria-label={`Open cart${cartCount > 0 ? ` (${cartCount} items)` : ''}`}
              style={{ color: '#fff' }}
            >
              <ShoppingBag size={20} strokeWidth={1.8} />
              {cartCount > 0 && (
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    minWidth: '18px',
                    height: '18px',
                    padding: '0 5px',
                    background: PRIMARY,
                    color: DARK,
                    borderRadius: '9px',
                    fontSize: '10px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...oswald,
                    boxShadow: `0 0 10px ${PRIMARY}99`,
                    lineHeight: 1,
                  }}
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>
            {hero.badge && (
              <span
                className="text-xs uppercase tracking-wider px-2.5 py-1 rounded-sm"
                style={{ color: '#fff', ...mono, background: ACCENT, fontWeight: 700, letterSpacing: '0.1em', fontSize: '9px' }}
              >
                {hero.badge}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative z-10 pt-8 md:pt-16 pb-6 md:pb-16 px-6">
        <div className="max-w-[430px] md:max-w-5xl lg:max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-center">
          {/* LEFT — copy + price + CTA */}
          <div className="md:order-1 order-2">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
            >
              <motion.p
                variants={{ hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0 } }}
                className="text-[10px] md:text-xs uppercase tracking-[0.4em] mb-3 font-bold"
                style={{ color: DARK, ...mono }}
              >
                {hero.eyebrow}
              </motion.p>

              {hero.titleLines.map((line, i) => {
                const isAccent = i === hero.titleAccentLine;
                return (
                  <motion.h1
                    key={i}
                    variants={{ hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0 } }}
                    className={
                      isAccent
                        ? 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.9] mb-4 uppercase'
                        : 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.9] mb-1 uppercase'
                    }
                    style={{
                      ...oswald,
                      color: isAccent ? PRIMARY : DARK,
                      textShadow: isAccent ? `0 4px 30px rgba(${PRIMARY_RGB}, 0.35)` : 'none',
                    }}
                  >
                    {line}
                  </motion.h1>
                );
              })}

              <motion.p
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="leading-snug mt-5 mb-5 md:mb-7 max-w-sm md:max-w-md md:text-[14px]"
                style={{ color: BODY_TXT, ...mono, fontSize: '12px' }}
              >
                {hero.subtitle}
              </motion.p>
            </motion.div>

            {/* Price Block */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex items-center gap-3 mb-5"
            >
              <span className="text-4xl md:text-5xl font-bold" style={{ ...oswald, color: DARK }}>
                {price.display}
              </span>
              <span
                className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-sm"
                style={{
                  background: `rgba(${PRIMARY_RGB}, 0.18)`,
                  color: DARK,
                  ...mono,
                  border: `1px solid rgba(${PRIMARY_RGB}, 0.4)`,
                }}
              >
                {servingsText}
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

          {/* RIGHT — product image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative md:order-2 order-1"
          >
            <div
              className="relative mx-auto rounded-2xl overflow-hidden cursor-pointer group"
              style={{
                maxWidth: '260px',
                width: '100%',
                background: `linear-gradient(160deg, ${BG} 0%, ${BG} 40%, rgba(${PRIMARY_RGB}, 0.08) 100%)`,
                boxShadow: '0 20px 60px rgba(0,0,0,0.10)',
              }}
              onClick={() => fullProduct && setShowProductCard(true)}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: `radial-gradient(circle at 40% 60%, rgba(${PRIMARY_RGB}, 0.18) 0%, transparent 65%)` }}
              />
              {productImage ? (
                <img
                  src={productImage}
                  alt={displayName}
                  className="relative z-10 w-full h-auto object-contain"
                  style={{ filter: `drop-shadow(0 14px 28px rgba(${PRIMARY_RGB}, 0.25))` }}
                />
              ) : isLoading ? (
                <div className="relative z-10 w-full aspect-square flex items-center justify-center">
                  <div
                    className="w-10 h-10 border-2 rounded-full animate-spin"
                    style={{ borderColor: PRIMARY, borderTopColor: 'transparent' }}
                  />
                </div>
              ) : (
                <div className="relative z-10 w-full aspect-square flex items-center justify-center">
                  <span className="text-5xl">{fallbackEmoji}</span>
                </div>
              )}
              <div
                className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `rgba(${hexToRgbStr(DARK)}, 0.35)` }}
              >
                <span style={{ ...oswald, fontSize: '18px', fontWeight: 700, color: '#fff', letterSpacing: '3px', textTransform: 'uppercase' }}>
                  VIEW
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHY THIS HITS DIFFERENT */}
      <section className="relative z-10 py-10 px-6" style={{ borderTop: `1px solid ${BORDER_TINT}` }}>
        <div className="max-w-[430px] md:max-w-5xl lg:max-w-6xl mx-auto">
          <FadeInSection>
            <p className="text-xs uppercase tracking-[0.4em] mb-3 font-bold" style={{ color: DARK, ...mono }}>
              THE DIFFERENCE
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold uppercase mb-6 leading-tight" style={{ ...oswald, color: DARK }}>
              WHY THIS HITS<br />
              <span style={{ color: PRIMARY }}>DIFFERENT</span>
            </h2>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
            {benefits.map((item, i) => (
              <FadeInSection key={i} delay={i * 0.08}>
                <div
                  className="flex gap-4 p-4 rounded-r-lg transition-all duration-300 hover:translate-x-1"
                  style={{
                    background: '#ffffff',
                    borderLeft: `3px solid ${PRIMARY}`,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
                  }}
                >
                  <span
                    className="text-2xl font-bold shrink-0"
                    style={{ ...oswald, color: PRIMARY, opacity: 0.6, lineHeight: 1 }}
                  >
                    {item.num}
                  </span>
                  <div>
                    <h3 className="text-base font-bold uppercase mb-0.5 tracking-wide" style={{ ...oswald, color: DARK }}>
                      {item.title}
                    </h3>
                    <p style={{ color: BODY_TXT, ...mono, fontSize: '10px', lineHeight: '1.6' }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* THE FORMULA */}
      <section className="relative z-10 py-10 px-6" style={{ background: `rgba(${PRIMARY_RGB}, 0.04)` }}>
        <div className="max-w-[430px] md:max-w-5xl lg:max-w-6xl mx-auto">
          <FadeInSection>
            <p className="text-xs uppercase tracking-[0.4em] mb-3 font-bold" style={{ color: DARK, ...mono }}>
              WHAT&apos;S INSIDE
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold uppercase mb-6 leading-tight" style={{ ...oswald, color: DARK }}>
              THE <span style={{ color: PRIMARY }}>FORMULA</span>
            </h2>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-12">
            {ingredients.map((ing, i) => (
              <FadeInSection key={i} delay={i * 0.08}>
                <div
                  className="flex items-center justify-between py-3 transition-all duration-300 hover:pl-2"
                  style={{ borderBottom: `1px solid ${BORDER_TINT}` }}
                >
                  <div>
                    <span className="text-sm font-bold uppercase tracking-wide" style={{ ...oswald, color: DARK }}>
                      {ing.name}
                    </span>
                    <p className="mt-0.5" style={{ color: MUTED_TXT, ...mono, fontSize: '9px' }}>
                      {ing.desc}
                    </p>
                  </div>
                  <span
                    className="text-sm font-bold shrink-0 ml-4"
                    style={{
                      color: DARK,
                      ...mono,
                      background: `rgba(${PRIMARY_RGB}, 0.18)`,
                      padding: '2px 8px',
                      borderRadius: '3px',
                    }}
                  >
                    {ing.dose}
                  </span>
                </div>
              </FadeInSection>
            ))}
          </div>

          <FadeInSection delay={0.4}>
            <p className="text-xs mt-6 text-center uppercase tracking-wider" style={{ color: MUTED_TXT, ...mono }}>
              {transparencyTagline}
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="relative z-10 py-10 px-6" style={{ borderTop: `1px solid ${BORDER_TINT}` }}>
        <div className="max-w-[430px] md:max-w-5xl lg:max-w-6xl mx-auto">
          <FadeInSection>
            <p className="text-xs uppercase tracking-[0.4em] mb-3 font-bold" style={{ color: DARK, ...mono }}>
              REAL TALK
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold uppercase mb-6 leading-tight" style={{ ...oswald, color: DARK }}>
              WHAT THEY&apos;RE<br />
              <span style={{ color: PRIMARY }}>SAYING</span>
            </h2>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5">
            {reviews.map((review, i) => (
              <FadeInSection key={i} delay={i * 0.1}>
                <div
                  className="p-4 rounded-r-lg transition-all duration-300 hover:translate-x-1"
                  style={{
                    background: '#ffffff',
                    borderLeft: `3px solid ${PRIMARY}`,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
                  }}
                >
                  <div className="flex gap-1 mb-2">
                    {Array.from({ length: review.rating }).map((_, j) => (
                      <span key={j} style={{ color: PRIMARY, fontSize: '12px' }}>
                        ★
                      </span>
                    ))}
                  </div>
                  <p
                    className="mb-3"
                    style={{ color: BODY_TXT, ...mono, fontSize: '10px', lineHeight: '1.7' }}
                  >
                    {review.text}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold uppercase tracking-wider" style={{ ...oswald, color: DARK }}>
                      {review.name}
                    </span>
                    <span
                      className="text-xs uppercase tracking-wider px-2 py-1 rounded-sm"
                      style={{
                        color: DARK,
                        border: `1px solid rgba(${PRIMARY_RGB}, 0.4)`,
                        ...mono,
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

      {/* BOTTOM CTA */}
      <section className="relative z-10 py-12 px-6" style={{ background: `rgba(${PRIMARY_RGB}, 0.04)` }}>
        <div className="max-w-[430px] md:max-w-3xl mx-auto text-center">
          <FadeInSection>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold uppercase mb-3 leading-[0.9]" style={{ ...oswald, color: DARK }}>
              {bottomCTA.titleLines.map((line, i) => (
                <React.Fragment key={i}>
                  {i === bottomCTA.accentLineIdx ? (
                    <span style={{ color: ACCENT }}>{line}</span>
                  ) : (
                    line
                  )}
                  {i < bottomCTA.titleLines.length - 1 && <br />}
                </React.Fragment>
              ))}
            </h2>
            <p className="mb-6 max-w-xs mx-auto" style={{ color: MUTED_TXT, ...mono, fontSize: '10px', lineHeight: '1.7' }}>
              {bottomCTA.body}
            </p>
            <div className="flex items-center justify-center gap-3 mb-5">
              <span className="text-3xl font-bold" style={{ ...oswald, color: DARK }}>
                {price.display}
              </span>
              <span
                className="text-xs font-bold uppercase px-3 py-1 rounded-sm"
                style={{
                  background: `rgba(${PRIMARY_RGB}, 0.18)`,
                  color: DARK,
                  ...mono,
                  border: `1px solid rgba(${PRIMARY_RGB}, 0.4)`,
                }}
              >
                {servingsText}
              </span>
            </div>
            {ctaButton('lg')}
          </FadeInSection>
        </div>
      </section>

      {/* FAQ — visible Q&A section (matches JSON-LD FAQ schema for AI citation) */}
      {faqs && faqs.length > 0 && (
        <section
          className="relative z-10 py-14 px-6"
          style={{ background: '#ffffff', borderTop: `1px solid ${BORDER_TINT}` }}
        >
          <div className="max-w-[430px] md:max-w-3xl mx-auto">
            <FadeInSection>
              <p
                style={{
                  ...mono,
                  fontSize: '10px',
                  letterSpacing: '0.32em',
                  color: PRIMARY,
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                  textAlign: 'center',
                }}
              >
                Common Questions
              </p>
              <h2
                className="text-3xl md:text-4xl font-bold uppercase mb-8 text-center"
                style={{ ...oswald, color: DARK, lineHeight: 0.95, letterSpacing: '-0.01em' }}
              >
                {displayName} <span style={{ color: PRIMARY }}>FAQ</span>
              </h2>
            </FadeInSection>

            <div className="space-y-3">
              {faqs.map((item, i) => (
                <FadeInSection key={i} delay={i * 0.04}>
                  <details
                    className="group"
                    style={{
                      background: `rgba(${PRIMARY_RGB}, 0.04)`,
                      border: `1px solid ${BORDER_TINT}`,
                      borderRadius: '10px',
                      padding: '16px 20px',
                    }}
                  >
                    <summary
                      className="cursor-pointer flex items-center justify-between gap-4"
                      style={{
                        ...oswald,
                        fontSize: '14px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.02em',
                        color: DARK,
                        listStyle: 'none',
                      }}
                    >
                      <span>{item.q}</span>
                      <span
                        className="transition-transform duration-200 group-open:rotate-45 shrink-0"
                        style={{ color: PRIMARY, fontSize: '20px', lineHeight: 1, fontWeight: 300 }}
                      >
                        +
                      </span>
                    </summary>
                    <p
                      className="mt-3"
                      style={{
                        ...mono,
                        fontSize: '12px',
                        lineHeight: 1.75,
                        color: BODY_TXT,
                      }}
                    >
                      {item.a}
                    </p>
                  </details>
                </FadeInSection>
              ))}
            </div>

            {learnLinks && learnLinks.length > 0 && (
              <FadeInSection delay={0.2}>
                <div
                  className="mt-10 p-5 text-center"
                  style={{
                    background: `rgba(${PRIMARY_RGB}, 0.06)`,
                    border: `1px solid rgba(${PRIMARY_RGB}, 0.2)`,
                    borderRadius: '10px',
                  }}
                >
                  <p
                    style={{
                      ...mono,
                      fontSize: '9px',
                      letterSpacing: '0.2em',
                      color: MUTED_TXT,
                      textTransform: 'uppercase',
                      marginBottom: '10px',
                    }}
                  >
                    Related Guides
                  </p>
                  <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
                    {learnLinks.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        style={{
                          ...mono,
                          fontSize: '11px',
                          color: PRIMARY,
                          textDecoration: 'underline',
                          textUnderlineOffset: '4px',
                        }}
                      >
                        {l.label} →
                      </Link>
                    ))}
                  </div>
                </div>
              </FadeInSection>
            )}
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="relative z-10 py-10 px-6" style={{ borderTop: `1px solid ${BORDER_TINT}` }}>
        <div className="max-w-[430px] md:max-w-5xl mx-auto text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: PRIMARY, boxShadow: `0 0 6px ${PRIMARY}` }} />
            <span className="text-sm font-bold uppercase tracking-[0.3em]" style={{ ...oswald, color: DARK }}>
              AVIERA
            </span>
          </div>
          <p className="text-xs leading-relaxed max-w-sm mx-auto" style={{ color: MUTED_TXT, ...mono, fontSize: '10px' }}>
            Manufactured in the USA in a GMP-certified facility. Third-party tested for purity and potency.
          </p>
          <p className="text-xs leading-relaxed max-w-sm mx-auto" style={{ color: '#aaa', ...mono, fontSize: '9px' }}>
            *These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.
          </p>
          <p className="text-xs pt-4" style={{ color: '#aaa', ...mono, fontSize: '10px' }}>
            © 2026 Aviera. All rights reserved.
          </p>
          <div className="flex justify-center gap-6 pt-2">
            <Link href="/terms" style={{ ...mono, fontSize: '9px', color: MUTED_TXT, textTransform: 'uppercase', textDecoration: 'none' }}>Terms</Link>
            <Link href="/privacy" style={{ ...mono, fontSize: '9px', color: MUTED_TXT, textTransform: 'uppercase', textDecoration: 'none' }}>Privacy</Link>
            <Link href="/shop" style={{ ...mono, fontSize: '9px', color: MUTED_TXT, textTransform: 'uppercase', textDecoration: 'none' }}>Shop</Link>
          </div>
        </div>
      </footer>

      {showProductCard && fullProduct && (
        <ProductDetailModal
          product={{ ...fullProduct, images: productImages, price: price.value }}
          onClose={() => setShowProductCard(false)}
          onAddToCart={() => {
            handleAddToCart();
            setShowProductCard(false);
          }}
          adding={isAdding}
          added={added}
        />
      )}

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
