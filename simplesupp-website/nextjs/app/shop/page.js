'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { fetchShopifyProducts, addToCart, initializeShopifyCart, getCheckoutUrl, removeFromCart, updateCartQuantity, fetchCart } from '../lib/shopify';
import { products as localProducts } from '../data/products';

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
function StickyNav({ menuOpen, setMenuOpen, cartCount, onCartClick }) {
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

          {/* Desktop links - hidden */}
          <div className="hidden">
            {/* Nav links removed - use hamburger menu */}
          </div>

          <div className="flex items-center gap-3">
            {/* Cart icon */}
            <button
              onClick={onCartClick}
              aria-label="Open cart"
              style={{
                position: 'relative',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                fontSize: '18px',
                color: '#fff',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {cartCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-4px',
                    background: '#ff2d55',
                    color: '#fff',
                    fontSize: '8px',
                    fontWeight: 700,
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: 1,
                  }}
                >
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {/* User icon */}
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

            {/* Hamburger menu */}
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
              { label: 'O.S.', href: '/supplement-optimization-score' },
              { label: 'Latest', href: '/news' },
              { label: 'About', href: '/about' },
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Sign In', href: '/auth' },
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

// ─── Category from catalog (source of truth) ───
// Returns the primary category for a product from PRODUCT_CATALOG.cat
// For cross-listed products (array cat), returns the first category.
function getProductCategory(product) {
  const catalog = getCatalogData(product);
  if (catalog && catalog.cat) {
    return Array.isArray(catalog.cat) ? catalog.cat[0] : catalog.cat;
  }
  return 'Health'; // fallback for unmatched products
}

// Returns all categories a product belongs to (handles cross-listed products)
function getProductCategories(product) {
  const catalog = getCatalogData(product);
  if (catalog && catalog.cat) {
    return Array.isArray(catalog.cat) ? catalog.cat : [catalog.cat];
  }
  return ['Health'];
}

// ═══════════════════════════════════════════
// PRODUCT CATALOG — Source of truth for all copy
// Descriptions from product-catalog.md (Aviera voice)
// Do NOT use Shopify descriptions
// ═══════════════════════════════════════════
const PRODUCT_CATALOG = {
  // ─── THE DROP ───
  'flow state x': {
    cat: 'Performance',
    desc: 'L-Citrulline + dual-form L-Arginine. Skin-splitting pumps, insane vascularity. No stim, no crash.',
    tags: ['Pumps', 'Blood Flow', 'No Caffeine'],
    formula: {
      rows: [
        { name: 'L-Citrulline DL-Malate', dose: '400 mg' },
        { name: 'L-Arginine Hydrochloride', dose: '350 mg' },
        { name: 'L-Arginine Alpha-Ketoglutarate', dose: '50 mg' },
      ],
      other: 'Other: Cellulose (vegetable capsule), Brown Rice Flour · 60 caps / 30 servings',
    },
  },

  // ─── PRE-WORKOUT & ENERGY ───
  'nitric shock': {
    cat: 'Pre-Workout',
    desc: 'Full-send pre-workout. Pumps, energy, and tunnel-vision focus in one scoop. Fruit Punch that actually tastes good.',
    tags: ['Energy', 'Pumps', 'Focus'],
    formula: null,
  },
  'energy powder (fruit punch)': {
    cat: 'Pre-Workout',
    desc: 'Clean energy without the crash. Smooth, sustained power for training or grinding through the day. Fruit Punch flavor.',
    tags: ['Energy', 'Endurance'],
    formula: null,
  },
  'energy powder (cotton candy)': {
    cat: 'Pre-Workout',
    desc: 'Same clean energy formula, Cotton Candy flavor. Tastes like a cheat meal, hits like a pre-workout.',
    tags: ['Energy', 'Endurance'],
    formula: null,
  },
  'energy powder (lychee': {
    cat: 'Pre-Workout',
    desc: 'Exotic Lychee Splash flavor. Light, refreshing, and loaded with clean energy. No jitters, no crash.',
    tags: ['Energy', 'Endurance'],
    formula: null,
  },
  'alpha energy': {
    cat: 'Pre-Workout',
    desc: 'Testosterone and energy support in one. Built for guys who want to feel dialed in — gym and life.',
    tags: ['Testosterone', 'Drive', 'Vitality'],
    formula: null,
  },
  'nootropic powder (sour gummi': {
    cat: ['Pre-Workout', 'Focus'],
    desc: 'Lock in mentally. Nootropic powder for deep focus and cognitive flow. Sour Gummi Worm flavor that slaps.',
    tags: ['Focus', 'Clarity', 'Nootropic'],
    formula: null,
  },
  'nootropic powder (sour candy)': {
    cat: ['Pre-Workout', 'Focus'],
    desc: 'Same brain-boosting nootropic formula, Sour Candy flavor. Focus on demand without the stim crash.',
    tags: ['Focus', 'Clarity', 'Nootropic'],
    formula: null,
  },

  // ─── PROTEIN ───
  'whey protein isolate (vanilla)': {
    cat: 'Protein',
    desc: '100% whey isolate. Fast-absorbing, low-fat, no bloat. Vanilla that mixes smooth and tastes clean.',
    tags: ['Protein', 'Muscle', 'Recovery'],
    formula: null,
  },
  'whey protein isolate (chocolate)': {
    cat: 'Protein',
    desc: 'Premium whey isolate in rich Chocolate. High protein per scoop, minimal filler. Builds muscle, not excuses.',
    tags: ['Protein', 'Muscle', 'Recovery'],
    formula: null,
  },
  'plant protein (chocolate)': {
    cat: 'Protein',
    desc: 'Plant-powered protein for lifters who skip the dairy. Chocolate flavor, smooth blend, no chalky aftertaste.',
    tags: ['Vegan', 'Protein', 'Plant-Based'],
    formula: null,
  },
  'plant protein (vanilla)': {
    cat: 'Protein',
    desc: "Vegan protein that doesn't taste like dirt. Vanilla, smooth, and packed with the aminos your muscles need.",
    tags: ['Vegan', 'Protein', 'Plant-Based'],
    formula: null,
  },

  // ─── PERFORMANCE ───
  'creatine': {
    cat: 'Performance',
    desc: 'The most researched supplement ever. Pure creatine monohydrate for strength, power, and muscle volume. No filler.',
    tags: ['Strength', 'Power', 'Recovery'],
    formula: {
      rows: [{ name: 'Creatine Monohydrate', dose: '5,000 mg' }],
      other: 'Pure micronized creatine monohydrate · No fillers',
    },
  },
  'l-glutamine': {
    cat: 'Performance',
    desc: 'Amino acid for recovery and gut support. Reduces soreness, supports immune function. Unflavored and stackable.',
    tags: ['Recovery', 'Gut Health', 'Muscle'],
    formula: null,
  },
  'beetroot powder': {
    cat: 'Performance',
    desc: 'Same beetroot benefits in powder form. Mix it, stack it, feel the blood flow. Natural nitric oxide support.',
    tags: ['Blood Flow', 'Endurance', 'Nitric Oxide'],
    formula: null,
  },
  'beetroot': {
    cat: 'Performance',
    desc: 'Natural nitrate source for blood flow and endurance. The OG vasodilator in capsule form. Simple, effective.',
    tags: ['Blood Flow', 'Endurance', 'Nitric Oxide'],
    formula: null,
  },

  // ─── RECOVERY & HYDRATION ───
  'bcaa shock': {
    cat: 'Recovery',
    desc: 'Branch-chain aminos for muscle recovery and reduced soreness. Fruit Punch flavor. Train harder, recover faster.',
    tags: ['BCAAs', 'Recovery', 'Muscle'],
    formula: null,
  },
  'bcaa post workout': {
    cat: 'Recovery',
    desc: 'Post-workout BCAA blend in refreshing Honeydew/Watermelon. Muscles need fuel after you destroy them. Give it to them.',
    tags: ['BCAAs', 'Post-Workout', 'Recovery'],
    formula: null,
  },
  'hydration powder (lemonade)': {
    cat: 'Recovery',
    desc: 'Electrolyte-packed hydration for training and recovery. Lemonade flavor. Outperforms water, every time.',
    tags: ['Hydration', 'Electrolytes', 'Recovery'],
    formula: null,
  },
  'hydration powder (matcha': {
    cat: 'Recovery',
    desc: 'Hydration meets antioxidants. Matcha Green Tea flavor with full electrolyte profile. Calm energy, deep hydration.',
    tags: ['Hydration', 'Electrolytes', 'Antioxidants'],
    formula: null,
  },
  'hydration powder (peach': {
    cat: 'Recovery',
    desc: 'Tropical Peach Mango hydration. Full electrolyte replenishment for athletes who sweat like they mean it.',
    tags: ['Hydration', 'Electrolytes', 'Recovery'],
    formula: null,
  },

  // ─── FOCUS & COGNITIVE ───
  "lion's mane": {
    cat: 'Focus',
    desc: 'The brain mushroom. Supports cognitive function, memory, and nerve health. Clarity without stimulants.',
    tags: ['Focus', 'Brain Health', 'Mushroom'],
    formula: null,
  },
  'ashwagandha': {
    cat: 'Focus',
    desc: 'Ancient adaptogen for modern stress. Lowers cortisol, improves recovery, keeps you calm under pressure.',
    tags: ['Stress', 'Adaptogen', 'Recovery'],
    formula: null,
  },

  // ─── SLEEP ───
  'sleep formula': {
    cat: 'Sleep',
    desc: 'Fall asleep faster, stay asleep longer, wake up recovered. Science-backed sleep support without the groggy hangover.',
    tags: ['Sleep', 'Recovery', 'Relaxation'],
    formula: null,
  },
  'sleep support': {
    cat: 'Sleep',
    desc: 'Gentle sleep support for restless nights. Non-habit forming. Wake up feeling like you actually rested.',
    tags: ['Sleep', 'Calm', 'Rest'],
    formula: null,
  },
  'magnesium': {
    cat: 'Sleep',
    desc: 'The most absorbable form of magnesium. Supports sleep, reduces cramps, keeps muscles and nerves functioning right.',
    tags: ['Mineral', 'Sleep', 'Muscle'],
    formula: null,
  },

  // ─── HEALTH & WELLNESS ───
  'complete multivitamin': {
    cat: 'Health',
    desc: 'Cover your bases. Complete daily multivitamin with essential vitamins and minerals. The foundation of any stack.',
    tags: ['Vitamins', 'Daily Health', 'Foundation'],
    formula: null,
  },
  'multivitamin bear': {
    cat: 'Health',
    desc: 'Same essential vitamins, gummy form. For people who hate swallowing pills but still want to cover their bases.',
    tags: ['Vitamins', 'Gummies', 'Daily Health'],
    formula: null,
  },
  'omega-3': {
    cat: 'Health',
    desc: 'Essential fatty acids for heart, brain, and joint support. The supplement everyone should take but most people skip.',
    tags: ['Heart', 'Brain', 'Joint Health'],
    formula: null,
  },
  'probiotic 20': {
    cat: 'Health',
    desc: '20 billion CFUs for gut health and immune support. Good gut, good gains. It\'s science.',
    tags: ['Gut Health', 'Digestion', 'Immunity'],
    formula: null,
  },
  'probiotic 40': {
    cat: 'Health',
    desc: 'Double the CFUs plus prebiotics to feed the good bacteria. Premium gut health for serious digestive support.',
    tags: ['Gut Health', 'Digestion', 'Prebiotics'],
    formula: null,
  },
  'gut health': {
    cat: 'Health',
    desc: 'Comprehensive gut support formula. Healthy gut means better absorption, better digestion, better everything.',
    tags: ['Digestion', 'Gut Support', 'Wellness'],
    formula: null,
  },
  'coq10': {
    cat: 'Health',
    desc: 'Cellular energy production and heart health support. CoQ10 is what your mitochondria run on. Feed them.',
    tags: ['Heart Health', 'Energy', 'Antioxidant'],
    formula: null,
  },
  'platinum turmeric': {
    cat: 'Health',
    desc: 'Premium turmeric for inflammation and joint support. Platinum-grade curcumin that your body actually absorbs.',
    tags: ['Anti-Inflammatory', 'Joint', 'Recovery'],
    formula: null,
  },
  'turmeric curcumin gummies': {
    cat: 'Health',
    desc: 'Anti-inflammatory turmeric in gummy form. Joint support that tastes good. No horse pills required.',
    tags: ['Anti-Inflammatory', 'Gummies', 'Joint'],
    formula: null,
  },
  'apple cider vinegar': {
    cat: 'Health',
    desc: 'All the ACV benefits without the taste. Supports digestion, metabolism, and gut health. No vinegar face.',
    tags: ['Digestion', 'Weight', 'Wellness'],
    formula: null,
  },

  // ─── WEIGHT MANAGEMENT ───
  'keto bhb': {
    cat: 'Weight',
    desc: 'Exogenous ketones for keto support and clean energy. Get into ketosis faster, stay there longer.',
    tags: ['Keto', 'Energy', 'Fat Burn'],
    formula: null,
  },
  'keto-5': {
    cat: 'Weight',
    desc: 'Advanced 5-compound keto support formula. Metabolism, energy, and fat utilization. For serious keto athletes.',
    tags: ['Keto', 'Metabolism', 'Energy'],
    formula: null,
  },
  'fat burner': {
    cat: 'Weight',
    desc: 'Thermogenic fat burner with MCT oil. Burn fat for fuel, not muscle. Clean energy from stored body fat.',
    tags: ['Fat Burn', 'MCT', 'Metabolism'],
    formula: null,
  },

  // ─── BEAUTY & SKIN ───
  'collagen': {
    cat: 'Beauty',
    desc: 'Grass-fed collagen for skin elasticity, joint support, and recovery. Beauty starts from the inside out.',
    tags: ['Collagen', 'Skin', 'Joint'],
    formula: null,
  },
  'hyaluronic acid': {
    cat: 'Beauty',
    desc: 'Deep hydration serum for plump, youthful skin. Locks in moisture at the cellular level. Glow different.',
    tags: ['Skin', 'Hydration', 'Anti-Aging'],
    formula: null,
  },
  'vitamin glow': {
    cat: 'Beauty',
    desc: 'Vitamin-packed glow serum. Brighten, nourish, and protect your skin. Because looking good is part of the game.',
    tags: ['Skin', 'Glow', 'Vitamins'],
    formula: null,
  },
};

// ─── Catalog lookup (matches Shopify product to catalog entry) ───
function getCatalogData(product) {
  const title = (product.title || '').toLowerCase();
  const keys = Object.keys(PRODUCT_CATALOG).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    if (title.includes(key)) return PRODUCT_CATALOG[key];
  }
  return null;
}

// ─── Parse ingredients from Shopify descriptionHtml ───
// Handles three HTML formats: <li> lists, bold-label text, comma-separated <p>
function parseIngredientsFromHtml(html) {
  if (!html) return null;

  const stripTags = (s) => s.replace(/<[^>]*>/g, '').trim();
  let ingredients = [];
  let servingInfo = null;

  // Look for serving info
  const servingMatch = html.match(/serving\s*size[:\s]*([^<\n]+)/i);
  if (servingMatch) servingInfo = stripTags(servingMatch[1]);

  // Pattern A: <li> list items after an Ingredients heading
  const listMatch = html.match(/ingredients?\s*:?\s*<\/(?:strong|b|p|h\d)>\s*<ul[^>]*>([\s\S]*?)<\/ul>/i)
    || html.match(/<ul[^>]*>([\s\S]*?)<\/ul>\s*$/i);
  if (listMatch) {
    const items = listMatch[1].match(/<li[^>]*>([\s\S]*?)<\/li>/gi);
    if (items && items.length > 0) {
      ingredients = items.map(li => stripTags(li)).filter(Boolean);
    }
  }

  // Pattern B: <strong>Ingredients:</strong> followed by text
  if (ingredients.length === 0) {
    const boldMatch = html.match(/<(?:strong|b)>\s*(?:other\s+)?ingredients?\s*:?\s*<\/(?:strong|b)>\s*([^<]+)/i);
    if (boldMatch) {
      ingredients = boldMatch[1].split(',').map(s => s.trim()).filter(Boolean);
    }
  }

  // Pattern C: Plain text "Ingredients:" in a <p> or standalone
  if (ingredients.length === 0) {
    const plainMatch = html.match(/(?:other\s+)?ingredients?\s*:\s*([^<]+)/i);
    if (plainMatch) {
      ingredients = plainMatch[1].split(',').map(s => s.trim()).filter(Boolean);
    }
  }

  if (ingredients.length === 0) return null;
  return { ingredients, servingInfo };
}

// ─── Multi-source formula lookup ───
// Priority: hardcoded catalog → local products.js → Shopify descriptionHtml → label image → fallback
function getFormulaData(product) {
  // Source 1: Hardcoded formulas in PRODUCT_CATALOG (only FSX and Creatine have real data)
  const catalog = getCatalogData(product);
  if (catalog && catalog.formula) {
    return { type: 'formula', ...catalog.formula };
  }

  // Source 2: Local products.js structured data
  const title = (product.title || '').toLowerCase();
  const localMatch = localProducts.find(lp => {
    const sName = (lp.suplifulName || '').toLowerCase();
    const pName = (lp.name || '').toLowerCase();
    return title.includes(sName) || sName.includes(title) || title.includes(pName);
  });
  if (localMatch && localMatch.ingredients) {
    const ingredientList = localMatch.ingredients.split(',').map(s => s.trim()).filter(Boolean);
    const servingLine = localMatch.servingSize
      ? `Serving Size: ${localMatch.servingSize}${localMatch.servings ? ` · ${localMatch.servings} servings` : ''}`
      : null;
    return {
      type: 'ingredients-list',
      ingredients: ingredientList,
      servingLine,
    };
  }

  // Source 3: Parse Shopify descriptionHtml
  if (product.descriptionHtml) {
    const parsed = parseIngredientsFromHtml(product.descriptionHtml);
    if (parsed) {
      return {
        type: 'ingredients-list',
        ingredients: parsed.ingredients,
        servingLine: parsed.servingInfo ? `Serving Size: ${parsed.servingInfo}` : null,
      };
    }
  }

  // Source 4: Supplement facts label image (last image if 2+ images)
  if (product.images && product.images.length >= 2) {
    return {
      type: 'label-image',
      labelImage: product.images[product.images.length - 1],
    };
  }

  // Source 5: Text fallback
  return { type: 'fallback' };
}

// ─── Featured product config (The Drop — only Flow State X) ───
const FEATURED_PRODUCTS = [
  {
    match: 'flow state x',
    badge: '50% Off',
    sub: 'Nitric Oxide Booster',
    urgency: 'Limited batch — selling fast',
    featTags: ['Pumps', 'Blood Flow', 'No Caffeine'],
    wasPrice: '$39.99',
    pct: '\u221250%',
    desc: 'L-Citrulline + dual-form L-Arginine. Skin-splitting pumps, insane vascularity. No stim, no crash.',
  },
];

// ─── Filter tabs config ───
const TABS = [
  { id: 'drop', label: '\uD83D\uDD25 The Drop', hot: true },
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
  const [expandedCard, setExpandedCard] = useState(null);
  const [addingProducts, setAddingProducts] = useState({});
  const [addedProducts, setAddedProducts] = useState({});
  const [checkoutUrl, setCheckoutUrl] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const expandedRef = useRef(null);

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

  // Scroll expanded card into view
  useEffect(() => {
    if (expandedCard && expandedRef.current) {
      expandedRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [expandedCard]);

  // Sync cart state on mount + listen for cart updates
  useEffect(() => {
    async function syncCart() {
      try {
        const cart = await fetchCart();
        if (cart) {
          setCartItems(cart.lineItems || []);
          const count = (cart.lineItems || []).reduce((sum, item) => sum + item.quantity, 0);
          setCartCount(count);
          setCartTotal(parseFloat(cart.subtotalPrice?.amount || cart.subtotalPrice || 0));
          if (cart.webUrl) setCheckoutUrl(cart.webUrl);
        }
      } catch (e) {
        console.warn('Cart sync failed:', e);
      }
    }
    syncCart();

    function handleCartUpdate(e) {
      const { cart } = e.detail || {};
      if (cart) {
        setCartItems(cart.lineItems || []);
        const count = (cart.lineItems || []).reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(count);
        setCartTotal(parseFloat(cart.subtotalPrice?.amount || cart.subtotalPrice || 0));
        if (cart.webUrl) setCheckoutUrl(cart.webUrl);
      }
    }
    window.addEventListener('shopify:cart:updated', handleCartUpdate);
    return () => window.removeEventListener('shopify:cart:updated', handleCartUpdate);
  }, []);

  // Categorized products (from PRODUCT_CATALOG.cat, supports cross-listed products)
  const categorized = useMemo(() => {
    const map = {};
    products.forEach((p) => {
      const cats = getProductCategories(p);
      cats.forEach((cat) => {
        if (!map[cat]) map[cat] = [];
        map[cat].push(p);
      });
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
  const handleAddToCart = useCallback(async (product) => {
    if (!product.variantId || addingProducts[product.id]) return;
    setAddingProducts((prev) => ({ ...prev, [product.id]: true }));
    try {
      const updatedCart = await addToCart(product.variantId);
      setAddedProducts((prev) => ({ ...prev, [product.id]: true }));
      // Sync cart state from response
      if (updatedCart) {
        setCartItems(updatedCart.lineItems || []);
        const count = (updatedCart.lineItems || []).reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(count);
        setCartTotal(parseFloat(updatedCart.subtotalPrice?.amount || updatedCart.subtotalPrice || 0));
        if (updatedCart.webUrl) setCheckoutUrl(updatedCart.webUrl);
      }
    } catch (err) {
      console.error('Add to cart error:', err);
    } finally {
      setAddingProducts((prev) => ({ ...prev, [product.id]: false }));
    }
  }, [addingProducts]);

  // Toggle expand category
  function toggleCategory(cat) {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  }

  // Render catalog section (shared between Drop tab and category tabs)
  function renderCatalog(categoriesToShow) {
    return (
      <div style={{ padding: '0 16px 0' }}>
        {categoriesToShow
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
                    color: '#00ffcc',
                    textTransform: 'uppercase',
                    margin: '20px 0 10px',
                    paddingBottom: '6px',
                    borderBottom: '1px solid rgba(0,255,204,0.1)',
                  }}
                >
                  {CATEGORY_DISPLAY[cat] || cat} · {catProducts.length} product{catProducts.length !== 1 ? 's' : ''}
                </div>

                {displayProducts.map((product) => (
                  <React.Fragment key={product.id}>
                    {expandedCard !== product.id && (
                      <CompactProductCard
                        product={product}
                        adding={addingProducts[product.id]}
                        added={addedProducts[product.id]}
                        onAdd={() => handleAddToCart(product)}
                        onExpand={() => setExpandedCard(product.id)}
                      />
                    )}
                    {expandedCard === product.id && (
                      <ExpandedProductCard
                        ref={expandedRef}
                        product={product}
                        adding={addingProducts[product.id]}
                        added={addedProducts[product.id]}
                        checkoutUrl={checkoutUrl}
                        onAdd={() => handleAddToCart(product)}
                        onClose={() => setExpandedCard(null)}
                        onViewCart={() => setCartOpen(true)}
                      />
                    )}
                  </React.Fragment>
                ))}

                {showLoadMore && (
                  <button
                    onClick={() => toggleCategory(cat)}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '10px',
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '6px',
                      fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                      fontSize: '11px',
                      color: '#666',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      textAlign: 'center',
                      cursor: 'pointer',
                      marginBottom: '12px',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = '#00ffcc';
                      e.target.style.color = '#00ffcc';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = 'rgba(255,255,255,0.06)';
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
    );
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
      {/* Scanline overlay — REQUIRED on every dark page */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(255,255,255,0.03) 59px, rgba(255,255,255,0.03) 60px)',
        }}
      />
      <div className="relative z-10">
      <StickyNav menuOpen={menuOpen} setMenuOpen={setMenuOpen} cartCount={cartCount} onCartClick={() => setCartOpen(true)} />

      {/* ═══ HERO ═══ */}
      <section
        style={{
          padding: '72px 16px 10px',
          maxWidth: '430px',
          margin: '0 auto',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          style={{
            display: 'inline-block',
            fontSize: '8px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: '#fff',
            background: '#ff2d55',
            padding: '3px 10px',
            borderRadius: '2px',
            marginBottom: '10px',
          }}
        >
          New Arrivals Live
        </motion.div>
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
            marginBottom: '6px',
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
            lineHeight: 1.5,
            marginBottom: '10px',
          }}
        >
          New launches. Limited batches. Creator-backed. This is what&apos;s hot right now.
        </motion.p>
      </section>

      <div className="max-w-[430px] mx-auto">
        {/* ═══ SEARCH ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ padding: '0 16px 2px', position: 'relative' }}
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
            placeholder="Search supplements..."
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
            fontSize: '7px',
            color: '#333',
            padding: '2px 16px 0',
            textAlign: 'right',
          }}
        >
          Results filter as you type
        </div>

        {/* ═══ FILTER TABS ═══ */}
        <div
          style={{
            display: 'flex',
            gap: '6px',
            padding: '8px 16px 10px',
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
                  gap: '3px',
                  flexShrink: 0,
                  transition: 'all 0.15s',
                }}
              >
                {tab.label}
                {tab.id !== 'drop' && (
                  <span style={{ fontSize: '7px', opacity: 0.6 }}>
                    {categoryCounts[tab.id] || 0}
                  </span>
                )}
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
                <React.Fragment key={product.id}>
                  {expandedCard !== product.id && (
                    <CompactProductCard
                      product={product}
                      adding={addingProducts[product.id]}
                      added={addedProducts[product.id]}
                      onAdd={() => handleAddToCart(product)}
                      onExpand={() => setExpandedCard(product.id)}
                    />
                  )}
                  {expandedCard === product.id && (
                    <ExpandedProductCard
                      ref={expandedRef}
                      product={product}
                      adding={addingProducts[product.id]}
                      added={addedProducts[product.id]}
                      checkoutUrl={checkoutUrl}
                      onAdd={() => handleAddToCart(product)}
                      onClose={() => setExpandedCard(null)}
                    />
                  )}
                </React.Fragment>
              ))}
              {searchFiltered.length === 0 && (
                <p style={{ fontSize: '11px', color: '#666', textAlign: 'center', padding: '40px 0' }}>
                  No products match your search.
                </p>
              )}
            </div>
          </FadeInSection>
        )}

        {/* ═══ THE DROP TAB — featured cards + full catalog ═══ */}
        {!isLoading && !searchQuery.trim() && activeTab === 'drop' && (
          <>
            <FadeInSection>
              <div
                style={{
                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                  fontSize: '11px',
                  letterSpacing: '0.3em',
                  color: '#00ffcc',
                  textTransform: 'uppercase',
                  padding: '10px 16px 6px',
                }}
              >
                🔥 The Drop — Now Live
              </div>
              <div style={{ padding: '0 16px' }}>
                {featuredProducts.map((fp) => (
                  <FeaturedProductCard
                    key={fp.id}
                    product={fp}
                    adding={addingProducts[fp.id]}
                    added={addedProducts[fp.id]}
                    checkoutUrl={checkoutUrl}
                    onAdd={() => handleAddToCart(fp.shopProduct)}
                    onViewCart={() => setCartOpen(true)}
                  />
                ))}
              </div>
            </FadeInSection>

            {/* Full catalog below The Drop */}
            <FadeInSection>
              <div style={{ padding: '14px 16px 6px' }}>
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
                  Browse By Category
                </div>
                <h2
                  style={{
                    fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                    fontSize: '28px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    lineHeight: 1,
                    marginBottom: '10px',
                  }}
                >
                  ALL <span style={{ color: '#00ffcc' }}>PRODUCTS</span>
                </h2>
              </div>
              {renderCatalog(Object.keys(CATEGORY_DISPLAY))}
            </FadeInSection>
          </>
        )}

        {/* ═══ CATEGORY BROWSING (All or specific category) ═══ */}
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
                  marginBottom: '14px',
                }}
              >
                ALL <span style={{ color: '#00ffcc' }}>PRODUCTS</span>
              </h2>
            </div>
            {renderCatalog(
              activeTab === 'all' ? Object.keys(CATEGORY_DISPLAY) : [activeTab]
            )}
          </FadeInSection>
        )}

        {/* ═══ AI QUIZ CTA ═══ */}
        {!isLoading && (
          <div
            style={{
              background: '#0a0a0a',
              borderTop: '1px solid rgba(255,255,255,0.04)',
              padding: '14px 0',
            }}
          >
            <FadeInSection>
              <div
                style={{
                  margin: '14px 16px',
                  padding: '16px 16px',
                  border: '1px solid rgba(0,255,204,0.2)',
                  borderRadius: '8px',
                  background: 'rgba(0,255,204,0.04)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '20px', marginBottom: '4px' }}>🧠</div>
                <div
                  style={{
                    fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                    fontSize: '16px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    marginBottom: '3px',
                    color: '#00ffcc',
                  }}
                >
                  Not sure what to take?
                </div>
                <p style={{ fontSize: '10px', color: '#666', lineHeight: 1.5, marginBottom: '10px' }}>
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
          </div>
        )}

        {/* ═══ BOTTOM CTA ═══ */}
        {!isLoading && (
          <FadeInSection>
            <section
              style={{
                padding: '28px 16px',
                textAlign: 'center',
                background:
                  'radial-gradient(ellipse at 50% 80%, rgba(0,255,204,0.06) 0%, transparent 60%)',
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                  fontSize: '40px',
                  lineHeight: 0.9,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  marginBottom: '12px',
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
                  marginBottom: '8px',
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
                  marginTop: '8px',
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
                  marginTop: '8px',
                }}
              >
                <span>✓ Free ship $50+</span>
                <span>✓ 30-day guarantee</span>
                <span>✓ GMP certified</span>
              </div>
            </section>
          </FadeInSection>
        )}

        {/* ═══ FOOTER ═══ */}
        <footer
          style={{
            padding: '16px 16px',
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
            AvieraFit · 4437 Lister St, San Diego, CA 92110 USA ·{' '}
            <a href="mailto:info@avierafit.com" style={{ color: '#00ffcc', textDecoration: 'none' }}>
              info@avierafit.com
            </a>
          </p>
          <div style={{ marginTop: '8px', marginBottom: '6px' }}>
            <Link
              href="/terms"
              style={{
                fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                fontSize: '9px',
                color: '#444',
                textTransform: 'uppercase',
                textDecoration: 'none',
                letterSpacing: '0.06em',
              }}
            >
              Terms
            </Link>
            {' · '}
            <Link
              href="/privacy"
              style={{
                fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                fontSize: '9px',
                color: '#444',
                textTransform: 'uppercase',
                textDecoration: 'none',
                letterSpacing: '0.06em',
              }}
            >
              Privacy
            </Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '8px', marginBottom: '8px' }}>
            <a href="https://instagram.com/avierafit" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ color: '#444', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#00ffcc'} onMouseLeave={e => e.currentTarget.style.color = '#444'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="https://tiktok.com/@avierafit" target="_blank" rel="noopener noreferrer" aria-label="TikTok" style={{ color: '#444', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#00ffcc'} onMouseLeave={e => e.currentTarget.style.color = '#444'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.98a8.21 8.21 0 0 0 4.76 1.52V7.05a4.84 4.84 0 0 1-1-.36z"/></svg>
            </a>
          </div>
          <p style={{ marginTop: '4px' }}>
            © 2026 Aviera Fit. All rights reserved. · *Not evaluated by the FDA.
          </p>
        </footer>
      </div>

      {/* ═══ CART BAR (floating bottom bar) ═══ */}
      {cartCount > 0 && !cartOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 150,
            background: '#0a0a0a',
            borderTop: '1px solid rgba(0,255,204,0.2)',
            padding: '10px 16px',
          }}
        >
          <div
            className="max-w-[430px] mx-auto"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00ffcc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span style={{ fontSize: '12px', color: '#fff', fontWeight: 700 }}>
                {cartCount} item{cartCount !== 1 ? 's' : ''}
              </span>
              <span style={{ fontSize: '12px', color: '#00ffcc', fontWeight: 700 }}>
                ${cartTotal.toFixed(2)}
              </span>
            </div>
            <button
              onClick={() => setCartOpen(true)}
              style={{
                padding: '8px 18px',
                background: '#00ffcc',
                border: 'none',
                borderRadius: '4px',
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontSize: '12px',
                letterSpacing: '0.1em',
                color: '#000',
                textTransform: 'uppercase',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              View Cart →
            </button>
          </div>
        </div>
      )}

      {/* ═══ CART DRAWER ═══ */}
      {cartOpen && (
        <CartDrawer
          cartItems={cartItems}
          cartCount={cartCount}
          cartTotal={cartTotal}
          checkoutUrl={checkoutUrl}
          onClose={() => setCartOpen(false)}
        />
      )}

      {/* Hide scrollbar CSS */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>
      </div>{/* close relative z-10 wrapper */}
    </div>
  );
}

// ═══════════════════════════════════════════
// CART DRAWER (bottom-sheet)
// ═══════════════════════════════════════════
const FREE_SHIPPING_THRESHOLD = 50;

function CartDrawer({ cartItems, cartCount, cartTotal, checkoutUrl, onClose }) {
  const [updatingItem, setUpdatingItem] = useState(null);
  const remaining = FREE_SHIPPING_THRESHOLD - cartTotal;

  async function handleUpdateQty(lineItemId, newQty) {
    setUpdatingItem(lineItemId);
    try {
      if (newQty <= 0) {
        await removeFromCart(lineItemId);
      } else {
        await updateCartQuantity(lineItemId, newQty);
      }
    } catch (e) {
      console.error('Cart update error:', e);
    } finally {
      setUpdatingItem(null);
    }
  }

  async function handleRemove(lineItemId) {
    setUpdatingItem(lineItemId);
    try {
      await removeFromCart(lineItemId);
    } catch (e) {
      console.error('Cart remove error:', e);
    } finally {
      setUpdatingItem(null);
    }
  }

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          zIndex: 300,
        }}
      />
      {/* Drawer */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          maxHeight: '75vh',
          background: '#0a0a0a',
          borderTop: '2px solid #00ffcc',
          borderRadius: '16px 16px 0 0',
          zIndex: 301,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Handle bar */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 4px' }}>
          <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: '#333' }} />
        </div>

        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '4px 16px 10px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-oswald), Oswald, sans-serif',
              fontSize: '18px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            Your Cart
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#666',
              fontSize: '12px',
              cursor: 'pointer',
              fontFamily: 'var(--font-oswald), Oswald, sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            ✕ Close
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 16px' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#666', fontSize: '12px' }}>
              Your cart is empty.
            </div>
          ) : (
            cartItems.map((item) => {
              const itemPrice = parseFloat(item.variant?.price?.amount || item.variant?.price || 0);
              return (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '10px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    opacity: updatingItem === item.id ? 0.5 : 1,
                    transition: 'opacity 0.2s',
                  }}
                >
                  {/* Item image */}
                  <div
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '6px',
                      background: '#111',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                    }}
                  >
                    {item.variant?.image?.src ? (
                      <img src={item.variant.image.src} alt={item.title} style={{ maxHeight: '46px', maxWidth: '46px', objectFit: 'contain' }} />
                    ) : (
                      <span style={{ fontSize: '7px', color: '#333' }}>img</span>
                    )}
                  </div>

                  {/* Item details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                        fontSize: '12px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        marginBottom: '4px',
                      }}
                    >
                      {item.title}
                    </div>
                    <div style={{ fontSize: '12px', color: '#00ffcc', fontWeight: 700, marginBottom: '6px' }}>
                      ${(itemPrice * item.quantity).toFixed(2)}
                    </div>

                    {/* Qty controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                        disabled={updatingItem === item.id}
                        style={{
                          width: '26px',
                          height: '26px',
                          background: '#111',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '4px',
                          color: '#fff',
                          fontSize: '14px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        −
                      </button>
                      <span style={{ fontSize: '12px', fontWeight: 700, minWidth: '16px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                        disabled={updatingItem === item.id}
                        style={{
                          width: '26px',
                          height: '26px',
                          background: '#111',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '4px',
                          color: '#fff',
                          fontSize: '14px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        +
                      </button>
                      <button
                        onClick={() => handleRemove(item.id)}
                        disabled={updatingItem === item.id}
                        style={{
                          marginLeft: 'auto',
                          background: 'transparent',
                          border: 'none',
                          color: '#00ffcc',
                          fontSize: '9px',
                          cursor: 'pointer',
                          textTransform: 'uppercase',
                          fontWeight: 700,
                          letterSpacing: '0.05em',
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div
            style={{
              padding: '12px 16px 16px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              background: '#0a0a0a',
            }}
          >
            {/* Shipping threshold */}
            <div style={{ fontSize: '10px', textAlign: 'center', marginBottom: '8px' }}>
              {remaining > 0 ? (
                <span style={{ color: '#666' }}>
                  Add <span style={{ color: '#00ffcc', fontWeight: 700 }}>${remaining.toFixed(2)}</span> more for free shipping
                </span>
              ) : (
                <span style={{ color: '#00ffcc', fontWeight: 700 }}>✓ You qualify for free shipping</span>
              )}
            </div>

            {/* Subtotal */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: '10px',
              }}
            >
              <span style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Subtotal
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                  fontSize: '22px',
                  fontWeight: 700,
                  color: '#fff',
                }}
              >
                ${cartTotal.toFixed(2)}
              </span>
            </div>

            {/* Checkout button */}
            <a
              href={checkoutUrl || 'https://671mam-tn.myshopify.com/cart'}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                width: '100%',
                padding: '14px',
                background: '#00ffcc',
                borderRadius: '6px',
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontSize: '16px',
                letterSpacing: '0.12em',
                color: '#000',
                textTransform: 'uppercase',
                fontWeight: 700,
                textAlign: 'center',
                textDecoration: 'none',
                cursor: 'pointer',
              }}
            >
              Checkout →
            </a>
          </div>
        )}
      </div>
    </>
  );
}

// ═══════════════════════════════════════════
// FEATURED PRODUCT CARD (The Drop)
// ═══════════════════════════════════════════
function FeaturedProductCard({ product, adding, added, checkoutUrl, onAdd, onViewCart }) {
  const formulaData = getFormulaData(product);

  return (
    <div
      style={{
        background: '#0a0a0a',
        border: '1px solid rgba(0,255,204,0.15)',
        borderRadius: '8px',
        overflow: 'hidden',
        position: 'relative',
        marginBottom: '12px',
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
          height: '160px',
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
            style={{ maxHeight: '150px', maxWidth: '90%', objectFit: 'contain' }}
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
            fontSize: '20px',
            fontWeight: 700,
            textTransform: 'uppercase',
            margin: '0 0 5px 0',
          }}
        >
          {product.title}
        </h3>
        <p style={{ fontSize: '10px', color: '#666', lineHeight: 1.45, marginBottom: '8px' }}>
          {product.desc || product.description}
        </p>

        {/* Tags */}
        {product.featTags && product.featTags.length > 0 && (
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
            {product.featTags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: '7px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
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
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
          <span
            style={{
              fontFamily: 'var(--font-oswald), Oswald, sans-serif',
              fontSize: '28px',
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
                color: '#00ffcc',
                fontWeight: 700,
                background: 'rgba(0,255,204,0.12)',
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
              color: '#00ffcc',
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
            padding: '14px',
            background: added ? '#111' : '#00ffcc',
            border: added ? '1px solid #00ffcc' : 'none',
            borderRadius: '6px',
            fontFamily: 'var(--font-oswald), Oswald, sans-serif',
            fontSize: '16px',
            letterSpacing: '0.12em',
            color: added ? '#00ffcc' : '#000',
            textTransform: 'uppercase',
            fontWeight: 700,
            textAlign: 'center',
            cursor: adding ? 'wait' : 'pointer',
            opacity: adding ? 0.7 : 1,
            transition: 'all 0.2s',
            marginBottom: '6px',
          }}
        >
          {adding ? 'Adding...' : added ? 'Added ✓' : 'Add to Cart'}
        </button>

        {/* View Cart button — appears after adding */}
        {added && (
          <button
            onClick={onViewCart}
            style={{
              display: 'block',
              width: '100%',
              padding: '12px',
              background: 'transparent',
              border: '1px solid #00ffcc',
              borderRadius: '6px',
              fontFamily: 'var(--font-oswald), Oswald, sans-serif',
              fontSize: '14px',
              letterSpacing: '0.1em',
              color: '#00ffcc',
              textTransform: 'uppercase',
              fontWeight: 700,
              textAlign: 'center',
              cursor: 'pointer',
              marginBottom: '6px',
            }}
          >
            View Cart →
          </button>
        )}

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
          <span>✓ GMP certified</span>
        </div>

        {/* Formula */}
        <FormulaSection formulaData={formulaData} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// FORMULA SECTION (shared renderer)
// ═══════════════════════════════════════════
function FormulaSection({ formulaData }) {
  if (!formulaData) return null;

  return (
    <div
      style={{
        marginTop: '12px',
        paddingTop: '12px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-oswald), Oswald, sans-serif',
          fontSize: '12px',
          letterSpacing: '0.2em',
          color: '#00ffcc',
          textTransform: 'uppercase',
          marginBottom: '8px',
        }}
      >
        The Formula
      </div>

      {/* Type: hardcoded formula with rows + doses */}
      {formulaData.type === 'formula' && (
        <>
          {formulaData.rows.map((row, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '6px 0',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                fontSize: '11px',
              }}
            >
              <span style={{ color: '#ccc' }}>{row.name}</span>
              <span
                style={{
                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                  fontWeight: 700,
                  color: '#00ffcc',
                }}
              >
                {row.dose}
              </span>
            </div>
          ))}
          {formulaData.other && (
            <div style={{ fontSize: '9px', color: '#444', marginTop: '6px' }}>
              {formulaData.other}
            </div>
          )}
        </>
      )}

      {/* Type: ingredient list (no doses) from products.js or Shopify HTML */}
      {formulaData.type === 'ingredients-list' && (
        <>
          {formulaData.servingLine && (
            <div style={{ fontSize: '9px', color: '#666', marginBottom: '6px' }}>
              {formulaData.servingLine}
            </div>
          )}
          {formulaData.ingredients.map((ing, i) => (
            <div
              key={i}
              style={{
                padding: '5px 0',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                fontSize: '11px',
                color: '#ccc',
              }}
            >
              {ing}
            </div>
          ))}
        </>
      )}

      {/* Type: label image fallback */}
      {formulaData.type === 'label-image' && formulaData.labelImage && (
        <div style={{ textAlign: 'center', marginTop: '4px' }}>
          <img
            src={formulaData.labelImage}
            alt="Supplement Facts"
            style={{
              maxWidth: '100%',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          />
          <div style={{ fontSize: '8px', color: '#444', marginTop: '4px' }}>
            Supplement Facts Label
          </div>
        </div>
      )}

      {/* Type: text fallback */}
      {formulaData.type === 'fallback' && (
        <div style={{ fontSize: '10px', color: '#666', fontStyle: 'italic' }}>
          Full formula available on product label
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// COMPACT PRODUCT CARD (category browsing)
// Uses catalog descriptions (Aviera voice)
// ═══════════════════════════════════════════
function CompactProductCard({ product, adding, added, onAdd, onExpand }) {
  const catalog = getCatalogData(product);

  const shortDesc = useMemo(() => {
    const d = catalog ? catalog.desc : (product.description || '');
    if (d.length <= 80) return d;
    return d.substring(0, 77) + '...';
  }, [catalog, product.description]);

  return (
    <div
      onClick={onExpand}
      style={{
        display: 'flex',
        gap: '10px',
        background: '#0a0a0a',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '8px',
        padding: '10px',
        marginBottom: '6px',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(0,255,204,0.2)')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
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
            letterSpacing: '0.08em',
            marginBottom: '2px',
          }}
        >
          {CATEGORY_DISPLAY[getProductCategory(product)] || getProductCategory(product)}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-oswald), Oswald, sans-serif',
            fontSize: '13px',
            fontWeight: 700,
            textTransform: 'uppercase',
            marginBottom: '2px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {product.title}
        </div>
        {shortDesc && (
          <div style={{ fontSize: '9px', color: '#666', lineHeight: 1.3, marginBottom: '4px' }}>
            {shortDesc}
          </div>
        )}
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
            onClick={(e) => {
              e.stopPropagation();
              onAdd();
            }}
            disabled={adding}
            style={{
              padding: '5px 14px',
              background: added ? '#111' : '#00ffcc',
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
              transition: 'all 0.2s',
            }}
          >
            {adding ? '...' : added ? '✓' : 'Add'}
          </button>
        </div>
        <div style={{ fontSize: '7px', color: '#333', textAlign: 'right', marginTop: '2px' }}>
          Tap to expand ↓
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// EXPANDED PRODUCT CARD (tap to expand)
// Uses catalog descriptions, tags, and formulas
// ═══════════════════════════════════════════
const ExpandedProductCard = React.forwardRef(function ExpandedProductCard(
  { product, adding, added, checkoutUrl, onAdd, onClose, onViewCart },
  ref
) {
  const catalog = getCatalogData(product);
  const formulaData = getFormulaData(product);
  const displayDesc = catalog ? catalog.desc : product.description;
  const displayTags = catalog ? catalog.tags : (product.tags || []).slice(0, 4);

  return (
    <div
      ref={ref}
      style={{
        background: '#0a0a0a',
        border: '1px solid rgba(0,255,204,0.15)',
        borderRadius: '8px',
        overflow: 'hidden',
        marginBottom: '8px',
      }}
    >
      {/* Close button */}
      <div
        onClick={onClose}
        style={{
          fontSize: '9px',
          color: '#666',
          textAlign: 'right',
          cursor: 'pointer',
          padding: '8px 14px 0',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}
      >
        ✕ Close
      </div>

      {/* Image */}
      <div
        style={{
          width: '100%',
          height: '160px',
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
            style={{ maxHeight: '150px', maxWidth: '90%', objectFit: 'contain' }}
          />
        ) : (
          <span style={{ fontSize: '9px', color: '#333' }}>[ {product.title} ]</span>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '14px' }}>
        <div
          style={{
            fontSize: '9px',
            color: '#00ffcc',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            marginBottom: '3px',
          }}
        >
          {CATEGORY_DISPLAY[getProductCategory(product)] || getProductCategory(product)}
        </div>
        <h3
          style={{
            fontFamily: 'var(--font-oswald), Oswald, sans-serif',
            fontSize: '20px',
            fontWeight: 700,
            textTransform: 'uppercase',
            margin: '0 0 5px 0',
          }}
        >
          {product.title}
        </h3>
        <p style={{ fontSize: '10px', color: '#666', lineHeight: 1.45, marginBottom: '8px' }}>
          {displayDesc}
        </p>

        {/* Tags from catalog */}
        {displayTags && displayTags.length > 0 && (
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
            {displayTags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: '7px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
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
              fontSize: '28px',
              fontWeight: 700,
            }}
          >
            ${product.price?.toFixed(2)}
          </span>
        </div>

        {/* Add to Cart */}
        <button
          onClick={onAdd}
          disabled={adding}
          style={{
            display: 'block',
            width: '100%',
            padding: '14px',
            background: added ? '#111' : '#00ffcc',
            border: added ? '1px solid #00ffcc' : 'none',
            borderRadius: '6px',
            fontFamily: 'var(--font-oswald), Oswald, sans-serif',
            fontSize: '16px',
            letterSpacing: '0.12em',
            color: added ? '#00ffcc' : '#000',
            textTransform: 'uppercase',
            fontWeight: 700,
            textAlign: 'center',
            cursor: adding ? 'wait' : 'pointer',
            opacity: adding ? 0.7 : 1,
            transition: 'all 0.2s',
            marginBottom: '6px',
          }}
        >
          {adding ? 'Adding...' : added ? 'Added ✓' : 'Add to Cart'}
        </button>

        {/* View Cart button */}
        {added && (
          <button
            onClick={onViewCart}
            style={{
              display: 'block',
              width: '100%',
              padding: '12px',
              background: 'transparent',
              border: '1px solid #00ffcc',
              borderRadius: '6px',
              fontFamily: 'var(--font-oswald), Oswald, sans-serif',
              fontSize: '14px',
              letterSpacing: '0.1em',
              color: '#00ffcc',
              textTransform: 'uppercase',
              fontWeight: 700,
              textAlign: 'center',
              cursor: 'pointer',
              marginBottom: '6px',
            }}
          >
            View Cart →
          </button>
        )}

        {/* Trust */}
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

        {/* Formula — shown for EVERY product */}
        <FormulaSection formulaData={formulaData} />
      </div>
    </div>
  );
});
