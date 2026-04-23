'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchShopifyProducts, addToCart, initializeShopifyCart, getCheckoutUrl } from '../lib/shopify';
import { trackAddToCart } from '../lib/tracking';
import PageLayout, { SectionBlock, ProductGrid, MissionBlock, FadeInSection, TOKENS, FONTS } from '../components/PageLayout';
import ProductDetailModal from '../components/ProductDetailModal';

// ─── Category accent colors ───
const CAT_COLORS = {
  Performance:            '#00e5ff',
  'Pre-Workout & Energy': '#FF3B3B',
  Protein:                '#8B5CF6',
  'Recovery & Hydration': '#FFD700',
  'Focus & Cognitive':    '#3B82F6',
  Sleep:                  '#a855f7',
  'Health & Wellness':    '#22C55E',
  'Weight Management':    '#F97316',
  'Beauty & Skin':        '#EC4899',
};

// ─── Categorization rules (order matters — first match wins) ───
function categorize(title = '') {
  const t = title.toLowerCase();

  if (t.includes('collagen') || t.includes('hyaluronic') || t.includes('vitamin glow'))
    return 'Beauty & Skin';

  if (t.includes('keto') || t.includes('fat burner'))
    return 'Weight Management';

  if (t.includes('nootropic') || t.includes("lion's mane") || t.includes('lions mane') || t.includes('lion’s mane'))
    return 'Focus & Cognitive';

  if (
    t.includes('magnesium') ||
    t.includes('sleep formula') ||
    t.includes('sleep support') ||
    t.includes('ashwagandha')
  ) return 'Sleep';

  if (
    t.includes('bcaa') ||
    t.includes('hydration') ||
    t.includes('post workout') ||
    t.includes('post-workout')
  ) return 'Recovery & Hydration';

  if (
    (t.includes('nitric shock') && t.includes('fruit punch')) ||
    t.includes('pre-workout') ||
    t.includes('pre workout') ||
    t.includes('energy powder') ||
    t.includes('alpha energy') ||
    t.includes('coq10') ||
    t.includes('ubiquinone')
  ) return 'Pre-Workout & Energy';

  if (t.includes('whey') || t.includes('protein isolate') || t.includes('plant protein'))
    return 'Protein';

  if (
    t.includes('flow state') ||
    t.includes('creatine') ||
    t.includes('beetroot') ||
    t.includes('l-glutamine') ||
    t.includes('glutamine')
  ) return 'Performance';

  if (
    t.includes('multivitamin') ||
    t.includes('probiotic') ||
    t.includes('turmeric') ||
    t.includes('omega') ||
    t.includes('apple cider') ||
    t.includes('acv') ||
    t.includes('gut health')
  ) return 'Health & Wellness';

  return null;
}

function productHref(title = '') {
  const t = title.toLowerCase();
  if (t.includes('flow state') && !t.includes('nootropic')) return '/nitric';
  if (t.includes('hydration') && t.includes('lemonade')) return '/hydration';
  if (t.includes('magnesium')) return '/magnesium';
  if (t.includes('creatine') && t.includes('electrolyte')) return '/creatine-electrolyte';
  if (t.includes('creatine')) return '/creatine';
  if (t.includes('nitric shock') && t.includes('fruit punch')) return '/preworkout';
  return null;
}

function displayName(title = '') {
  const t = title.toLowerCase();
  // Sleep Support contains 10mg melatonin (vs Sleep Formula's 2mg) — tag it as the melatonin product
  if (t.includes('sleep support') && !t.includes('melatonin')) return `${title} (Melatonin)`;
  return title;
}

const CATEGORY_ORDER = [
  'Performance',
  'Pre-Workout & Energy',
  'Protein',
  'Recovery & Hydration',
  'Focus & Cognitive',
  'Sleep',
  'Health & Wellness',
  'Weight Management',
  'Beauty & Skin',
];

const CATEGORY_META = {
  Performance:            { eyebrow: 'Strength · Power · Pumps',       title: 'Performance.',            subtitle: 'Stims-free performance support. Blood flow, recovery, strength — the foundation.' },
  'Pre-Workout & Energy': { eyebrow: 'Stims · Focus · Drive',          title: 'Pre-Workout & Energy.',   subtitle: 'Full-send formulas for the hardest sessions. Clean energy, tunnel-vision focus.' },
  Protein:                { eyebrow: 'Build · Repair · Grow',          title: 'Protein.',                subtitle: 'Premium whey isolate and clean plant protein. High protein per scoop, minimal filler.' },
  'Recovery & Hydration': { eyebrow: 'Electrolytes · BCAAs · Post',    title: 'Recovery & Hydration.',   subtitle: 'Replenish what training takes. Electrolytes, aminos, post-workout repair.' },
  'Focus & Cognitive':    { eyebrow: 'Clarity · Flow · Nootropics',    title: 'Focus & Cognitive.',      subtitle: 'Lock in mentally. Nootropics and adaptogens for deep work and clean focus.' },
  Sleep:                  { eyebrow: 'Recovery · Calm · Rest',          title: 'Sleep.',                  subtitle: 'Recovery happens at night. Fix the foundation everything else is built on.' },
  'Health & Wellness':    { eyebrow: 'Foundation · Daily Health',       title: 'Health & Wellness.',      subtitle: 'Multivitamins, probiotics, omega-3 — cover your bases first.' },
  'Weight Management':    { eyebrow: 'Metabolism · Fat Loss',           title: 'Weight Management.',      subtitle: 'Clean keto support and thermogenic fat burners. Fuel the cut.' },
  'Beauty & Skin':        { eyebrow: 'Glow · Elasticity · Hydration',   title: 'Beauty & Skin.',          subtitle: 'Collagen, hyaluronic acid, vitamin serums. Inside-out support.' },
};

const PREVIEW_COUNT = 4;
const bgVariantForIndex = (i) => (i % 2 === 0 ? 'cyan-tint' : 'cream');

// ═══════════════════════════════════════════
// SHOP PAGE
// ═══════════════════════════════════════════
// Anchor id for a category (used for scroll-to)
const catId = (cat) => `cat-${cat.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState({});

  // Search
  const [search, setSearch] = useState('');

  // Modal state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  // Smooth scroll to a category anchor, accounting for sticky nav height
  const scrollToCategory = (cat) => {
    const el = document.getElementById(catId(cat));
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.pageYOffset - 130;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  useEffect(() => {
    fetchShopifyProducts()
      .then((all) => {
        // Exclude discontinued products
        const filtered = (all || []).filter((p) => {
          const t = (p.title || '').toLowerCase();
          if (t.includes('turmeric') && t.includes('gumm')) return false;
          if (t.includes('multivitamin bear') || (t.includes('multivitamin') && t.includes('gumm'))) return false;
          return true;
        });
        setProducts(filtered);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
    initializeShopifyCart().catch(console.error);
  }, []);

  // Group by category. Each entry: { grid: [...], raw: [...] } where raw is the full Shopify product.
  const grouped = useMemo(() => {
    const groups = {};
    for (const cat of CATEGORY_ORDER) groups[cat] = { grid: [], raw: [] };
    for (const p of products) {
      const category = categorize(p.title);
      if (!category) continue;
      const accent = CAT_COLORS[category];
      const item = {
        name: displayName(p.title),
        category,
        accent,
        href: productHref(p.title) || '/shop',
        image: p.images?.[0] || p.image || null,
        price: p.price ? `$${parseFloat(p.price).toFixed(2)}` : null,
      };
      groups[category].grid.push(item);
      groups[category].raw.push(p);

      // Dual-category: Creatine + Electrolyte appears in both Performance and Recovery & Hydration
      const tl = (p.title || '').toLowerCase();
      if (tl.includes('creatine') && tl.includes('electrolyte') && groups['Recovery & Hydration']) {
        groups['Recovery & Hydration'].grid.push({ ...item, category: 'Recovery & Hydration', accent: CAT_COLORS['Recovery & Hydration'] });
        groups['Recovery & Hydration'].raw.push(p);
      }
    }
    return groups;
  }, [products]);

  // Open modal with full Shopify product
  const handleProductClick = (gridItem, categoryRaw) => {
    // Find the raw product whose title matches this grid item's displayed name (minus any "(Melatonin)" suffix we added)
    const cleanName = gridItem.name.replace(/ \(Melatonin\)$/, '');
    const raw = categoryRaw.find((r) => r.title === cleanName) || categoryRaw.find((r) => r.title.toLowerCase() === cleanName.toLowerCase());
    if (!raw) return;
    setAdded(false);
    setIsAdding(false);
    setSelectedProduct(raw);
  };

  const handleAddToCart = async () => {
    if (!selectedProduct?.variantId || isAdding) return;
    setIsAdding(true);
    try {
      await addToCart(selectedProduct.variantId, 1);
      const priceNum = selectedProduct.price ? parseFloat(selectedProduct.price) : 0;
      trackAddToCart(selectedProduct.title, selectedProduct.variantId, priceNum);
      setAdded(true);
      // Dispatch so any global cart counter updates
      window.dispatchEvent(new CustomEvent('shopify:cart:updated'));
    } catch (err) {
      console.error('Failed to add to cart:', err);
    } finally {
      setIsAdding(false);
    }
  };

  const toggleCategory = (cat) => {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  // Flatten all grid items for search
  const allItems = useMemo(() => {
    const arr = [];
    for (const cat of CATEGORY_ORDER) {
      const g = grouped[cat];
      if (!g) continue;
      g.grid.forEach((item, idx) => arr.push({ item, raw: g.raw[idx] }));
    }
    return arr;
  }, [grouped]);

  // Simple smart search: matches name + category, case-insensitive, tokenized
  const searchResults = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return null;
    const tokens = q.split(/\s+/).filter(Boolean);
    return allItems.filter(({ item }) => {
      const hay = `${item.name} ${item.category}`.toLowerCase();
      return tokens.every((tok) => hay.includes(tok));
    });
  }, [search, allItems]);

  const isSearching = searchResults !== null;

  // Visible category pills — only those with items
  const visibleCategories = CATEGORY_ORDER.filter(
    (cat) => grouped[cat]?.grid.length > 0
  );

  return (
    <PageLayout>
      {/* HERO with background image */}
      <section
        className="relative overflow-hidden"
        style={{
          minHeight: '50vh',
          zIndex: 10,
        }}
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/shop-background.jpg"
            alt=""
            className="w-full h-full object-cover"
            style={{ filter: 'grayscale(20%) contrast(1.06)' }}
          />
          {/* Dark gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,1) 100%)',
            }}
          />
          {/* Cyan vignette accent */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 30% 70%, rgba(0,229,255,0.08) 0%, transparent 50%)',
            }}
          />
        </div>

        <div className="relative max-w-[430px] md:max-w-5xl lg:max-w-6xl mx-auto px-5 md:px-8 text-center flex flex-col justify-end" style={{ paddingTop: '140px', paddingBottom: '60px', minHeight: '50vh' }}>
          <p style={{ ...FONTS.mono, fontSize: '11px', letterSpacing: '0.32em', color: TOKENS.CYAN, textTransform: 'uppercase', marginBottom: '14px', textShadow: '0 0 20px rgba(0,229,255,0.6), 0 2px 8px rgba(0,0,0,0.8)' }}>
            The full catalog
          </p>
          <h1
            className="text-[44px] md:text-[80px] lg:text-[104px]"
            style={{
              ...FONTS.oswald,
              fontWeight: 700,
              textTransform: 'uppercase',
              lineHeight: 0.92,
              letterSpacing: '-0.02em',
              color: '#fff',
              marginBottom: '18px',
            }}
          >
            Shop <span style={{ color: TOKENS.CYAN }}>Aviera.</span>
          </h1>
          <p
            className="md:text-[14px]"
            style={{ ...FONTS.mono, fontSize: '12px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, maxWidth: '480px', margin: '0 auto' }}
          >
            Every formula. Every dose. Every label transparent. Find your stack.
          </p>
        </div>
      </section>

      {/* ═══ STICKY SUB-NAV: Search + Category Pills ═══ */}
      <div
        className="sticky z-40"
        style={{
          top: '64px',
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <div className="max-w-[430px] md:max-w-5xl lg:max-w-6xl mx-auto px-4 md:px-8 py-3 md:py-4">
          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative mb-3"
          >
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke={TOKENS.CYAN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, categories, ingredients…"
              className="w-full outline-none transition-all duration-300"
              style={{
                ...FONTS.mono,
                fontSize: '12px',
                padding: '11px 40px 11px 40px',
                background: '#ffffff',
                border: `1.5px solid ${search ? TOKENS.CYAN : 'rgba(0,0,0,0.12)'}`,
                borderRadius: '10px',
                color: TOKENS.INK,
                boxShadow: search ? `0 4px 20px ${TOKENS.CYAN}33` : '0 1px 3px rgba(0,0,0,0.04)',
              }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 border-none cursor-pointer bg-transparent p-1"
                style={{ color: 'rgba(0,0,0,0.5)' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </motion.div>

          {/* Category pills — horizontal scroll on mobile, wraps on desktop */}
          <div
            className="flex md:flex-wrap gap-2 md:gap-3 overflow-x-auto md:overflow-visible pb-1 md:pb-0"
            style={{ scrollbarWidth: 'none' }}
          >
            {visibleCategories.map((cat, i) => {
              const accent = CAT_COLORS[cat];
              return (
                <motion.button
                  key={cat}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: isSearching ? 0.4 : 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.15 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -2, boxShadow: `0 6px 20px ${accent}55` }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => scrollToCategory(cat)}
                  disabled={isSearching}
                  className="shrink-0 cursor-pointer border-none"
                  style={{
                    ...FONTS.oswald,
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    padding: '8px 14px',
                    background: '#ffffff',
                    color: accent,
                    border: `1.5px solid ${accent}`,
                    borderRadius: '999px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {cat}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {isLoading && (
        <SectionBlock variant="white" align="center">
          <p style={{ ...FONTS.mono, fontSize: '11px', color: 'rgba(0,0,0,0.5)' }}>
            Loading the catalog…
          </p>
        </SectionBlock>
      )}

      {/* ═══ SEARCH RESULTS ═══ */}
      <AnimatePresence mode="wait">
        {!isLoading && isSearching && (
          <motion.div
            key="search"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <SectionBlock
              variant="cyan-tint"
              eyebrow={`${searchResults.length} match${searchResults.length === 1 ? '' : 'es'}`}
              title="Search"
              titleAccent={`"${search}"`}
            >
              {searchResults.length === 0 ? (
                <p style={{ ...FONTS.mono, fontSize: '12px', color: 'rgba(0,0,0,0.55)', lineHeight: 1.7 }}>
                  No products matched your search. Try a different term or clear the search to browse by category.
                </p>
              ) : (
                <ProductGrid
                  products={searchResults.map(({ item }) => item)}
                  columns="lg:grid-cols-4"
                  onProductClick={(gi) => {
                    const match = searchResults.find(({ item }) => item.name === gi.name);
                    if (match) {
                      setAdded(false);
                      setIsAdding(false);
                      setSelectedProduct(match.raw);
                    }
                  }}
                />
              )}
            </SectionBlock>
          </motion.div>
        )}
      </AnimatePresence>

      {!isLoading && !isSearching &&
        CATEGORY_ORDER.map((cat, i) => {
          const group = grouped[cat];
          if (!group?.grid.length) return null;
          const meta = CATEGORY_META[cat];
          const accent = CAT_COLORS[cat];
          const isExpanded = !!expandedCategories[cat];
          const totalCount = group.grid.length;
          const visibleItems = isExpanded ? group.grid : group.grid.slice(0, PREVIEW_COUNT);
          const hasMore = totalCount > PREVIEW_COUNT;

          return (
            <SectionBlock
              key={cat}
              id={catId(cat)}
              variant={bgVariantForIndex(i)}
              eyebrow={meta.eyebrow}
              title={meta.title}
              subtitle={meta.subtitle}
            >
              <ProductGrid
                products={visibleItems}
                columns="lg:grid-cols-4"
                onProductClick={(gi) => handleProductClick(gi, group.raw)}
              />

              {hasMore && (
                <FadeInSection delay={0.2}>
                  <div className="flex justify-center mt-8 md:mt-10">
                    <button
                      onClick={() => toggleCategory(cat)}
                      className="border-none cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
                      style={{
                        ...FONTS.oswald,
                        padding: '14px 36px',
                        background: accent,
                        color: TOKENS.INK,
                        fontSize: '13px',
                        fontWeight: 700,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        borderRadius: '10px',
                        boxShadow: `0 4px 24px ${accent}55`,
                      }}
                    >
                      {isExpanded ? 'Show Fewer' : `View All ${totalCount} →`}
                    </button>
                  </div>
                </FadeInSection>
              )}
            </SectionBlock>
          );
        })}

      <MissionBlock
        eyebrow="Not sure what to take?"
        body="Two minutes of input. Your stack, calibrated. Stop guessing."
        accent="Start progressing."
        ctaHref="/supplement-optimization-score"
        ctaLabel="Take the Quiz"
        variant="cream"
      />

      {/* Detail modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={{
            ...selectedProduct,
            price: typeof selectedProduct.price === 'string' ? parseFloat(selectedProduct.price) : selectedProduct.price,
          }}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          adding={isAdding}
          added={added}
        />
      )}
    </PageLayout>
  );
}
