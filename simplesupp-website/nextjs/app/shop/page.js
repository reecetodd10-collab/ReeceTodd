'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { fetchShopifyProducts, addToCart, initializeShopifyCart } from '../lib/shopify';

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
  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: 'rgba(0,0,0,0.95)',
          backdropFilter: 'blur(10px)',
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

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-4">
            {[
              { label: 'Shop', href: '/shop', active: true },
              { label: 'Flow State X', href: '/nitric' },
              { label: 'Trybe', href: '/trybe' },
              { label: 'Quiz', href: '/supplement-optimization-score' },
              { label: 'About', href: '/about' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                  fontSize: '9px',
                  textTransform: 'uppercase',
                  color: link.active ? '#00ffcc' : '#666',
                  textDecoration: 'none',
                  letterSpacing: '0.08em',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => (e.target.style.color = '#00ffcc')}
                onMouseLeave={(e) => {
                  if (!link.active) e.target.style.color = '#666';
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-[5px] bg-transparent border-none cursor-pointer p-1"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <span className="block w-5 h-[2px] bg-white" />
            <span className="block w-5 h-[2px] bg-white" />
            <span className="block w-5 h-[2px] bg-white" />
          </button>
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
              { label: 'Quiz', href: '/supplement-optimization-score' },
              { label: 'About', href: '/about' },
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
          </div>
        </div>
      )}
    </>
  );
}

// ─── Category mapping (granular 9-category) ───
function mapToShopCategory(product) {
  const title = (product.title || '').toLowerCase();
  const desc = (product.description || '').toLowerCase();
  const tags = (product.tags || []).map((t) => t.toLowerCase()).join(' ');
  const all = `${title} ${desc} ${tags}`;

  if (all.includes('energy') || all.includes('pre-workout') || all.includes('nitric shock') || all.includes('alpha energy'))
    return 'Pre-Workout';
  if (all.includes('protein') || all.includes('whey') || all.includes('plant protein'))
    return 'Protein';
  if (all.includes('creatine') || all.includes('glutamine') || all.includes('beetroot') || (all.includes('bcaa') && !all.includes('recovery')))
    return 'Performance';
  if (all.includes('bcaa') || all.includes('hydration') || all.includes('recovery'))
    return 'Recovery';
  if (all.includes("lion's mane") || all.includes('ashwagandha') || all.includes('nootropic') || all.includes('focus'))
    return 'Focus';
  if (all.includes('sleep') || all.includes('melatonin') || all.includes('magnesium'))
    return 'Sleep';
  if (all.includes('collagen') || all.includes('hyaluronic') || all.includes('serum') || all.includes('biotin') || all.includes('glow'))
    return 'Beauty';
  if (all.includes('keto') || all.includes('fat burner') || all.includes('weight') || all.includes('mct'))
    return 'Weight';
  // Health catchall
  return 'Health';
}

// ─── Featured product config (The Drop) ───
const FEATURED_PRODUCTS = [
  {
    match: 'flow state x',
    badge: '50% Off',
    sub: 'Nitric Oxide Booster',
    urgency: 'Limited batch — selling fast',
    tags: ['Pumps', 'Blood Flow', 'No Caffeine'],
    wasPrice: '$39.99',
    pct: '−50%',
  },
  {
    match: 'nitric shock',
    badge: 'New',
    sub: 'Pre-Workout Powder',
    urgency: 'Just dropped — Trybe approved',
    tags: ['Energy', 'Pumps', 'Focus'],
  },
  {
    match: 'nootropic',
    badge: 'New',
    sub: 'Cognitive Performance',
    urgency: 'Creator favorite',
    tags: ['Focus', 'Clarity', 'Nootropic'],
  },
  {
    match: 'creatine',
    badge: 'Popular',
    sub: 'Muscle & Strength',
    urgency: 'Gym essential — now in The Drop',
    tags: ['Strength', 'Power', 'Recovery'],
  },
];

// ─── Filter tabs config ───
const TABS = [
  { id: 'drop', label: '🔥 The Drop', hot: true },
  { id: 'all', label: 'All' },
  { id: 'Pre-Workout', label: 'Pre-Workout' },
  { id: 'Protein', label: 'Protein' },
  { id: 'Performance', label: 'Performance' },
  { id: 'Recovery', label: 'Recovery' },
  { id: 'Focus', label: 'Focus' },
  { id: 'Sleep', label: 'Sleep' },
  { id: 'Health', label: 'Health' },
  { id: 'Weight', label: 'Weight' },
  { id: 'Beauty', label: 'Beauty' },
];

// ─── Category display names ───
const CATEGORY_DISPLAY = {
  'Pre-Workout': 'Pre-Workout & Energy',
  Protein: 'Protein',
  Performance: 'Performance',
  Recovery: 'Recovery & Hydration',
  Focus: 'Focus & Cognitive',
  Sleep: 'Sleep',
  Health: 'Health & Wellness',
  Weight: 'Weight Management',
  Beauty: 'Beauty & Skin',
};

// ═══════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════
export default function ShopPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('drop');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [addingProducts, setAddingProducts] = useState({});
  const [addedProducts, setAddedProducts] = useState({});

  // Fetch products on mount
  useEffect(() => {
    async function load() {
      try {
        await initializeShopifyCart();
        const data = await fetchShopifyProducts();
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  // Categorized products
  const categorized = useMemo(() => {
    const map = {};
    products.forEach((p) => {
      const cat = mapToShopCategory(p);
      if (!map[cat]) map[cat] = [];
      map[cat].push(p);
    });
    return map;
  }, [products]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { all: products.length, drop: FEATURED_PRODUCTS.length };
    Object.keys(CATEGORY_DISPLAY).forEach((cat) => {
      counts[cat] = (categorized[cat] || []).length;
    });
    return counts;
  }, [products, categorized]);

  // Filtered products based on search
  const searchFiltered = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(q))
    );
  }, [products, searchQuery]);

  // Featured products (matched from Shopify)
  const featuredProducts = useMemo(() => {
    return FEATURED_PRODUCTS.map((fp) => {
      const match = products.find((p) => p.title.toLowerCase().includes(fp.match));
      if (!match) return null;
      return { ...match, ...fp, shopProduct: match };
    }).filter(Boolean);
  }, [products]);

  // Handle add to cart
  async function handleAddToCart(product) {
    if (!product.variantId || addingProducts[product.id]) return;
    setAddingProducts((prev) => ({ ...prev, [product.id]: true }));
    try {
      await addToCart(product.variantId);
      setAddedProducts((prev) => ({ ...prev, [product.id]: true }));
      setTimeout(() => {
        setAddedProducts((prev) => ({ ...prev, [product.id]: false }));
      }, 2000);
    } catch (err) {
      console.error('Add to cart error:', err);
    } finally {
      setAddingProducts((prev) => ({ ...prev, [product.id]: false }));
    }
  }

  // Toggle expand category
  function toggleCategory(cat) {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  }

  // ─── RENDER ───
  return (
    <div
      style={{
        background: '#000000',
        minHeight: '100vh',
        fontFamily: 'var(--font-space-mono), Space Mono, monospace',
        color: '#ffffff',
        overflowX: 'hidden',
      }}
    >
      <StickyNav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* ═══ HERO ═══ */}
      <section
        style={{
          padding: '80px 16px 20px',
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.015) 40px, rgba(255,255,255,0.015) 41px), #000',
          maxWidth: '430px',
          margin: '0 auto',
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: 'var(--font-oswald), Oswald, sans-serif',
            fontSize: '52px',
            lineHeight: 0.9,
            fontWeight: 700,
            textTransform: 'uppercase',
            marginBottom: '10px',
          }}
        >
          THE
          <br />
          <span style={{ color: '#00ffcc' }}>DROP.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          style={{
            fontSize: '11px',
            color: '#666',
            lineHeight: 1.6,
            marginBottom: '16px',
          }}
        >
          New launches. Limited batches. Creator-backed products. This is what&apos;s hot right now.
        </motion.p>
      </section>

      <div className="max-w-[430px] mx-auto">
        {/* ═══ SEARCH ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ padding: '0 16px 12px', position: 'relative' }}
        >
          <span
            style={{
              position: 'absolute',
              left: '28px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#444',
              fontSize: '14px',
              pointerEvents: 'none',
            }}
          >
            ⌕
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${products.length} supplements...`}
            style={{
              width: '100%',
              padding: '12px 16px 12px 36px',
              background: '#0a0a0a',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '6px',
              color: '#fff',
              fontFamily: 'var(--font-space-mono), Space Mono, monospace',
              fontSize: '11px',
              outline: 'none',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#00ffcc')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
          />
        </motion.div>
        <div
          style={{
            fontSize: '8px',
            color: '#333',
            padding: '0 16px 4px',
            textAlign: 'right',
          }}
        >
          Autocomplete as you type
        </div>

        {/* ═══ FILTER TABS ═══ */}
        <div
          style={{
            display: 'flex',
            gap: '6px',
            padding: '8px 16px 16px',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          className="hide-scrollbar"
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const isHot = tab.hot && isActive;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                  fontSize: '10px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  padding: '7px 12px',
                  borderRadius: '4px',
                  border: isActive
                    ? isHot
                      ? '1px solid rgba(255,45,85,0.3)'
                      : '1px solid #00ffcc'
                    : '1px solid rgba(255,255,255,0.1)',
                  color: isActive
                    ? isHot
                      ? '#ff2d55'
                      : '#000'
                    : '#666',
                  background: isActive
                    ? isHot
                      ? 'rgba(255,45,85,0.15)'
                      : '#00ffcc'
                    : 'transparent',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  flexShrink: 0,
                }}
              >
                {tab.label}
                <span style={{ fontSize: '8px', color: isActive && !isHot ? '#000' : '#666', fontWeight: 400 }}>
                  {categoryCounts[tab.id] || 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* ═══ LOADING STATE ═══ */}
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '60px 16px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                border: '2px solid rgba(0,255,204,0.2)',
                borderTopColor: '#00ffcc',
                borderRadius: '50%',
                margin: '0 auto 12px',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            <p style={{ fontSize: '11px', color: '#666' }}>Loading products...</p>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        )}

        {/* ═══ SEARCH RESULTS MODE ═══ */}
        {!isLoading && searchQuery.trim() && (
          <FadeInSection>
            <div style={{ padding: '0 16px 8px' }}>
              <div
                style={{
                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                  fontSize: '11px',
                  letterSpacing: '0.3em',
                  color: '#00ffcc',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                }}
              >
                {searchFiltered.length} result{searchFiltered.length !== 1 ? 's' : ''} for &ldquo;{searchQuery}&rdquo;
              </div>
            </div>
            <div style={{ padding: '0 16px 20px' }}>
              {searchFiltered.map((product) => (
                <CompactProductCard
                  key={product.id}
                  product={product}
                  adding={addingProducts[product.id]}
                  added={addedProducts[product.id]}
                  onAdd={() => handleAddToCart(product)}
                />
              ))}
              {searchFiltered.length === 0 && (
                <p style={{ fontSize: '11px', color: '#666', textAlign: 'center', padding: '40px 0' }}>
                  No products match your search.
                </p>
              )}
            </div>
          </FadeInSection>
        )}

        {/* ═══ THE DROP (featured tab) ═══ */}
        {!isLoading && !searchQuery.trim() && activeTab === 'drop' && (
          <FadeInSection>
            <div
              style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.3em',
                color: '#00ffcc',
                textTransform: 'uppercase',
                padding: '16px 16px 8px',
              }}
            >
              🔥 The Drop — Now Live
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '0 16px 20px' }}>
              {featuredProducts.map((fp) => (
                <FeaturedProductCard
                  key={fp.id}
                  product={fp}
                  adding={addingProducts[fp.id]}
                  added={addedProducts[fp.id]}
                  onAdd={() => handleAddToCart(fp.shopProduct)}
                />
              ))}
            </div>
          </FadeInSection>
        )}

        {/* ═══ CATEGORY BROWSING ═══ */}
        {!isLoading && !searchQuery.trim() && activeTab !== 'drop' && (
          <FadeInSection>
            <div style={{ padding: '20px 16px 8px' }}>
              <div
                style={{
                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                  fontSize: '11px',
                  letterSpacing: '0.3em',
                  color: '#00ffcc',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                }}
              >
                Browse by Category
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                  fontSize: '28px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  lineHeight: 1,
                  marginBottom: '16px',
                }}
              >
                ALL <span style={{ color: '#00ffcc' }}>PRODUCTS</span>
              </h2>
            </div>

            <div style={{ padding: '0 16px 0' }}>
              {(activeTab === 'all'
                ? Object.keys(CATEGORY_DISPLAY)
                : [activeTab]
              )
                .filter((cat) => (categorized[cat] || []).length > 0)
                .map((cat) => {
                  const catProducts = categorized[cat] || [];
                  const isExpanded = expandedCategories[cat];
                  const showLoadMore = catProducts.length > 5 && !isExpanded;
                  const displayProducts = showLoadMore ? catProducts.slice(0, 5) : catProducts;

                  return (
                    <div key={cat}>
                      <div
                        style={{
                          fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                          fontSize: '11px',
                          letterSpacing: '0.2em',
                          color: '#ff2d55',
                          textTransform: 'uppercase',
                          margin: '20px 0 8px',
                        }}
                      >
                        {CATEGORY_DISPLAY[cat] || cat} · {catProducts.length} product{catProducts.length !== 1 ? 's' : ''}
                      </div>

                      {displayProducts.map((product) => (
                        <CompactProductCard
                          key={product.id}
                          product={product}
                          adding={addingProducts[product.id]}
                          added={addedProducts[product.id]}
                          onAdd={() => handleAddToCart(product)}
                        />
                      ))}

                      {showLoadMore && (
                        <button
                          onClick={() => toggleCategory(cat)}
                          style={{
                            display: 'block',
                            width: '100%',
                            padding: '12px',
                            background: 'transparent',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '6px',
                            fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                            fontSize: '12px',
                            letterSpacing: '0.1em',
                            color: '#666',
                            textTransform: 'uppercase',
                            fontWeight: 700,
                            textAlign: 'center',
                            cursor: 'pointer',
                            marginBottom: '8px',
                            transition: 'border-color 0.2s, color 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.borderColor = '#00ffcc';
                            e.target.style.color = '#00ffcc';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.borderColor = 'rgba(255,255,255,0.08)';
                            e.target.style.color = '#666';
                          }}
                        >
                          Show {catProducts.length - 5} more in {CATEGORY_DISPLAY[cat] || cat} ↓
                        </button>
                      )}
                    </div>
                  );
                })}
            </div>
          </FadeInSection>
        )}

        {/* ═══ AI QUIZ CTA ═══ */}
        {!isLoading && (
          <FadeInSection>
            <div
              style={{
                margin: '20px 16px',
                padding: '20px 16px',
                border: '1px solid rgba(0,255,204,0.15)',
                borderRadius: '8px',
                background: 'rgba(0,255,204,0.03)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '20px', marginBottom: '6px' }}>🧠</div>
              <div
                style={{
                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                  fontSize: '16px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  marginBottom: '4px',
                }}
              >
                Not sure what to take?
              </div>
              <p style={{ fontSize: '10px', color: '#666', lineHeight: 1.5, marginBottom: '12px' }}>
                Our AI analyzes your goals, training, and lifestyle — then builds your perfect stack in 60 seconds.
              </p>
              <Link
                href="/supplement-optimization-score"
                style={{
                  display: 'inline-block',
                  padding: '10px 24px',
                  background: '#00ffcc',
                  borderRadius: '6px',
                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                  fontSize: '12px',
                  letterSpacing: '0.1em',
                  color: '#000',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                Get My Personalized Stack →
              </Link>
            </div>
          </FadeInSection>
        )}

        {/* ═══ BOTTOM CTA ═══ */}
        {!isLoading && (
          <FadeInSection>
            <section
              style={{
                padding: '40px 16px',
                textAlign: 'center',
                background:
                  'radial-gradient(ellipse at 50% 80%, rgba(0,255,204,0.06) 0%, transparent 60%), #000',
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                  fontSize: '40px',
                  lineHeight: 0.9,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  marginBottom: '14px',
                }}
              >
                FUEL
                <br />
                YOUR
                <br />
                <span style={{ color: '#ff2d55' }}>GRIND.</span>
              </h2>
              <Link
                href="/supplement-optimization-score"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '16px',
                  background: '#00ffcc',
                  border: 'none',
                  borderRadius: '6px',
                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                  fontSize: '18px',
                  letterSpacing: '0.15em',
                  color: '#000',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  textAlign: 'center',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  marginBottom: '10px',
                }}
              >
                Take the Quiz →
              </Link>
              <Link
                href="/trybe"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '14px',
                  background: 'transparent',
                  border: '1px solid #00ffcc',
                  borderRadius: '6px',
                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                  fontSize: '16px',
                  letterSpacing: '0.12em',
                  color: '#00ffcc',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  textAlign: 'center',
                  textDecoration: 'none',
                  marginTop: '10px',
                }}
              >
                Join the Trybe — Earn 15%
              </Link>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  fontSize: '8px',
                  color: '#666',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginTop: '14px',
                }}
              >
                <span>✓ Free ship $50+</span>
                <span>✓ 30-day guarantee</span>
                <span>✓ GMP</span>
              </div>
            </section>
          </FadeInSection>
        )}

        {/* ═══ FOOTER ═══ */}
        <footer
          style={{
            padding: '20px 16px',
            textAlign: 'center',
            fontSize: '9px',
            color: '#333',
            lineHeight: 1.6,
            borderTop: '1px solid rgba(255,255,255,0.04)',
          }}
        >
          <div style={{ marginBottom: '8px' }}>
            <Link href="/home" style={{ color: '#00ffcc', textDecoration: 'none' }}>Home</Link>
            {' · '}
            <Link href="/shop" style={{ color: '#00ffcc', textDecoration: 'none' }}>Shop</Link>
            {' · '}
            <Link href="/nitric" style={{ color: '#00ffcc', textDecoration: 'none' }}>Flow State X</Link>
            {' · '}
            <Link href="/trybe" style={{ color: '#00ffcc', textDecoration: 'none' }}>Trybe</Link>
            {' · '}
            <Link href="/about" style={{ color: '#00ffcc', textDecoration: 'none' }}>About</Link>
          </div>
          <p>
            Manufactured for and Distributed by: AvieraFit · 4437 Lister St, San Diego, CA 92110 USA
          </p>
          <p>
            Questions?{' '}
            <a href="mailto:info@avierafit.com" style={{ color: '#00ffcc', textDecoration: 'none' }}>
              info@avierafit.com
            </a>
          </p>
          <p style={{ marginTop: '8px' }}>© 2026 Aviera Fit. All rights reserved.</p>
          <p style={{ marginTop: '4px', fontSize: '8px' }}>
            *These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure,
            or prevent any disease.
          </p>
        </footer>
      </div>

      {/* Hide scrollbar CSS */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════
// FEATURED PRODUCT CARD (The Drop)
// ═══════════════════════════════════════════
function FeaturedProductCard({ product, adding, added, onAdd }) {
  return (
    <div
      style={{
        background: '#0a0a0a',
        border: '1px solid rgba(0,255,204,0.15)',
        borderRadius: '8px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Badge */}
      {product.badge && (
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            fontSize: '8px',
            color: '#fff',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            background: '#ff2d55',
            padding: '3px 7px',
            borderRadius: '2px',
            zIndex: 5,
          }}
        >
          {product.badge}
        </div>
      )}

      {/* Image */}
      <div
        style={{
          width: '100%',
          height: '140px',
          background: 'linear-gradient(145deg, #111, #0a0a0a)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            style={{ maxHeight: '130px', maxWidth: '90%', objectFit: 'contain' }}
          />
        ) : (
          <span style={{ fontSize: '9px', color: '#333' }}>[ {product.title} ]</span>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '12px 14px' }}>
        <div
          style={{
            fontSize: '9px',
            color: '#00ffcc',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            marginBottom: '3px',
          }}
        >
          {product.sub}
        </div>
        <h3
          style={{
            fontFamily: 'var(--font-oswald), Oswald, sans-serif',
            fontSize: '18px',
            fontWeight: 700,
            textTransform: 'uppercase',
            marginBottom: '4px',
            margin: '0 0 4px 0',
          }}
        >
          {product.title}
        </h3>
        <p style={{ fontSize: '10px', color: '#666', lineHeight: 1.4, marginBottom: '8px' }}>
          {product.description}
        </p>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
            {product.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: '7px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  padding: '2px 6px',
                  border: '1px solid rgba(0,255,204,0.15)',
                  borderRadius: '2px',
                  color: '#00ffcc',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
          <span
            style={{
              fontFamily: 'var(--font-oswald), Oswald, sans-serif',
              fontSize: '24px',
              fontWeight: 700,
            }}
          >
            ${product.shopProduct?.price?.toFixed(2) || product.price?.toFixed(2)}
          </span>
          {product.wasPrice && (
            <span style={{ fontSize: '12px', color: '#666', textDecoration: 'line-through' }}>
              {product.wasPrice}
            </span>
          )}
          {product.pct && (
            <span
              style={{
                fontSize: '10px',
                color: '#ff2d55',
                fontWeight: 700,
                background: 'rgba(255,45,85,0.12)',
                padding: '2px 6px',
                borderRadius: '3px',
              }}
            >
              {product.pct}
            </span>
          )}
        </div>

        {/* Urgency */}
        {product.urgency && (
          <div
            style={{
              fontSize: '9px',
              color: '#ff2d55',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 700,
              marginBottom: '8px',
            }}
          >
            ⚡ {product.urgency}
          </div>
        )}

        {/* Add to Cart */}
        <button
          onClick={onAdd}
          disabled={adding}
          style={{
            display: 'block',
            width: '100%',
            padding: '12px',
            background: added ? '#1a1a1a' : '#00ffcc',
            border: added ? '1px solid #00ffcc' : 'none',
            borderRadius: '6px',
            fontFamily: 'var(--font-oswald), Oswald, sans-serif',
            fontSize: '14px',
            letterSpacing: '0.12em',
            color: added ? '#00ffcc' : '#000',
            textTransform: 'uppercase',
            fontWeight: 700,
            textAlign: 'center',
            cursor: adding ? 'wait' : 'pointer',
            opacity: adding ? 0.7 : 1,
            transition: 'all 0.2s',
          }}
        >
          {adding ? 'Adding...' : added ? '✓ Added' : 'Add to Cart'}
        </button>

        {/* Micro trust */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            fontSize: '8px',
            color: '#666',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginTop: '8px',
          }}
        >
          <span>✓ Free ship $50+</span>
          <span>✓ 30-day guarantee</span>
          <span>✓ GMP</span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// COMPACT PRODUCT CARD (category browsing)
// ═══════════════════════════════════════════
function CompactProductCard({ product, adding, added, onAdd }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '12px',
        background: '#0a0a0a',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '8px',
      }}
    >
      {/* Image */}
      <div
        style={{
          width: '60px',
          height: '60px',
          background: 'linear-gradient(145deg, #111, #0a0a0a)',
          borderRadius: '6px',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            style={{ maxHeight: '56px', maxWidth: '56px', objectFit: 'contain' }}
          />
        ) : (
          <span style={{ fontSize: '7px', color: '#333' }}>img</span>
        )}
      </div>

      {/* Body */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '8px',
            color: '#00ffcc',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '2px',
          }}
        >
          {mapToShopCategory(product)}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-oswald), Oswald, sans-serif',
            fontSize: '13px',
            fontWeight: 700,
            textTransform: 'uppercase',
            marginBottom: '3px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {product.title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontFamily: 'var(--font-oswald), Oswald, sans-serif',
              fontSize: '16px',
              fontWeight: 700,
            }}
          >
            ${product.price?.toFixed(2)}
          </span>
          <button
            onClick={onAdd}
            disabled={adding}
            style={{
              display: 'inline-block',
              padding: '5px 12px',
              background: added ? '#1a1a1a' : '#00ffcc',
              border: added ? '1px solid #00ffcc' : 'none',
              borderRadius: '4px',
              fontFamily: 'var(--font-oswald), Oswald, sans-serif',
              fontSize: '9px',
              letterSpacing: '0.08em',
              color: added ? '#00ffcc' : '#000',
              textTransform: 'uppercase',
              fontWeight: 700,
              cursor: adding ? 'wait' : 'pointer',
              opacity: adding ? 0.7 : 1,
              verticalAlign: 'middle',
              transition: 'all 0.2s',
            }}
          >
            {adding ? '...' : added ? '✓' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
