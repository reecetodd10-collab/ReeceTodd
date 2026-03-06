---
name: aviera-page-builder
description: Use this skill whenever building or modifying ANY page on avierafit.com — product landing pages, the home page, shop, about, or any new page. This is the master build skill with design system, reusable code templates, and step-by-step process for turning a mockup into a finished Next.js page. Trigger when user mentions "landing page", "product page", "home page", "rebuild", "mockup", "redesign", or references the Hypebeast/Flow State design system.
---

# Aviera Page Builder — Master Build Skill

Turn any mockup into a polished, high-conversion Next.js page using the Aviera design system. This skill captures the exact patterns from the /nitric (Flow State X) build — the code, the animations, the Shopify integration, and the build process.

---

## 1. Design System

### Colors
```
#000000  — Page background (pure black)
#0a0a0a  — Cards, elevated surfaces
#00ffcc  — Primary accent (green-cyan) — CTAs, highlights, active states
#ff2d55  — Urgency — sale badges, limited offers, "DON'T TRAIN FLAT"
#ffffff  — Primary text
#999999  — Secondary text (descriptions, subtitles)
#666666  — Muted text (body copy, fine print)
#333333  — Footer text, disclaimers
```

### Typography

| Element | Font | Weight | Size | Extras |
|---------|------|--------|------|--------|
| Hero titles | Oswald | 700 | 72-96px | line-height: 0.85, uppercase |
| Section titles | Oswald | 700 | 32-48px | uppercase |
| CTA buttons | Oswald | 700 | 18-20px | letter-spacing: 0.15em, uppercase |
| Prices | Oswald | 700 | 48px | — |
| Section tags | Space Mono | 400 | 11-12px | letter-spacing: 0.4em, uppercase, #00ffcc |
| Body text | Space Mono | 400 | 12-13px | color: #666 or #999, line-height: 1.6 |
| Micro text | Space Mono | 400 | 9-10px | uppercase, tracking wider |
| Feature numbers | Oswald | 700 | 28-32px | #00ffcc at 40% opacity |

**Font loading** — Already configured in `app/layout.js`:
```jsx
// Fonts are loaded as CSS variables:
// var(--font-oswald)    → Oswald
// var(--font-space-mono) → Space Mono
// Montserrat is the default body font

// Usage in components:
style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif' }}
style={{ fontFamily: 'var(--font-space-mono), Space Mono, monospace' }}
```

### Background Pattern
Subtle horizontal scan lines — apply to the page wrapper:
```jsx
<div
  className="fixed inset-0 pointer-events-none z-0"
  style={{
    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(255,255,255,0.03) 59px, rgba(255,255,255,0.03) 60px)',
  }}
/>
```

### Section Structure
Every section follows this pattern:
```jsx
<section className="relative z-10 py-16 px-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
  <div className="max-w-[430px] mx-auto">
    <FadeInSection>
      {/* Section tag */}
      <p className="text-xs uppercase tracking-[0.4em] mb-3"
         style={{ color: '#00ffcc', fontFamily: 'var(--font-space-mono), Space Mono, monospace' }}>
        SECTION TAG
      </p>
      {/* Section title */}
      <h2 className="text-4xl sm:text-5xl font-bold uppercase mb-12 leading-tight"
          style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif' }}>
        TITLE <span style={{ color: '#00ffcc' }}>HIGHLIGHT</span>
      </h2>
    </FadeInSection>

    {/* Content with staggered children */}
    {items.map((item, i) => (
      <FadeInSection key={i} delay={i * 0.1}>
        {/* Item content */}
      </FadeInSection>
    ))}
  </div>
</section>
```

### Component Specs

**CTA Button (primary)**
```jsx
<button
  className="w-full max-w-md py-5 px-10 text-lg font-bold uppercase tracking-widest"
  style={{
    fontFamily: 'var(--font-oswald), Oswald, sans-serif',
    background: '#00ffcc',
    color: '#000000',
    clipPath: 'polygon(0 0, 100% 0, 96% 100%, 4% 100%)',
  }}
>
  BUTTON TEXT
</button>
```

**CTA Button (outline/secondary)**
```jsx
<button
  className="w-full max-w-md py-5 px-10 text-lg font-bold uppercase tracking-widest border-2"
  style={{
    fontFamily: 'var(--font-oswald), Oswald, sans-serif',
    borderColor: '#00ffcc',
    color: '#00ffcc',
    background: 'transparent',
    clipPath: 'polygon(0 0, 100% 0, 96% 100%, 4% 100%)',
  }}
>
  BUTTON TEXT
</button>
```

**Card / Surface**
```jsx
<div className="p-6" style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)' }}>
  {/* Card content */}
</div>
```

**Urgency Badge**
```jsx
<span className="text-xs font-bold uppercase tracking-wider px-3 py-1"
      style={{ background: '#ff2d55', color: '#ffffff', fontFamily: 'var(--font-space-mono)' }}>
  -50%
</span>
```

**Footer** (required on every page)
```
Logo: ◉ AVIERA
Manufacturer: Manufactured in the USA in a GMP-certified facility.
FDA: *These statements have not been evaluated by the FDA...
Copyright: © {year} Aviera. All rights reserved.
Style: Space Mono 9-10px, color #333-#444, centered
```

---

## 2. Reusable Code Templates

### FadeInSection — Scroll-Triggered Animation Wrapper
Copy this into every page file:
```jsx
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

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
```
**Usage**: Wrap any section or list item. Use `delay={i * 0.1}` for staggered lists.

### Hero Stagger Animation
```jsx
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  }}
>
  <motion.p variants={{ hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0 } }}>
    SUBTITLE TAG
  </motion.p>
  <motion.h1 variants={{ hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0 } }}>
    LINE ONE
  </motion.h1>
  <motion.h1 variants={{ hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0 } }}>
    LINE TWO
  </motion.h1>
  <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
    Description text
  </motion.p>
</motion.div>
```

### Product Image with Glow
```jsx
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.8, delay: 0.6 }}
  className="relative"
>
  <div className="relative mx-auto" style={{ maxWidth: '320px' }}>
    {/* Glow behind product */}
    <div className="absolute inset-0 blur-3xl opacity-20"
         style={{ background: 'radial-gradient(circle, #00ffcc 0%, transparent 70%)' }} />
    <img
      src={productImage}
      alt="Product"
      className="relative z-10 w-full h-auto object-contain"
      style={{ filter: 'drop-shadow(0 20px 40px rgba(0, 255, 204, 0.15))' }}
    />
  </div>
</motion.div>
```

### Shopify Integration Pattern
```jsx
import { fetchProductById, addToCart, initializeShopifyCart, getCheckoutUrl } from '../lib/shopify';

// State
const [variantId, setVariantId] = useState(null);
const [isAdding, setIsAdding] = useState(false);
const [added, setAdded] = useState(false);
const [isLoading, setIsLoading] = useState(true);
const [checkoutUrl, setCheckoutUrl] = useState(null);
const [productImage, setProductImage] = useState(null);

const SHOPIFY_PRODUCT_ID = 'YOUR_PRODUCT_ID';

// Fetch product on mount
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

// Add to cart handler
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
```

### For Multiple Products (home page, shop)
```jsx
import { fetchShopifyProducts, addToCart, initializeShopifyCart, getCheckoutUrl } from '../lib/shopify';

const [products, setProducts] = useState([]);

useEffect(() => {
  fetchShopifyProducts()
    .then(products => setProducts(products))
    .catch(console.error);
  initializeShopifyCart().catch(console.error);
}, []);

// Add individual product
const handleAddProduct = async (variantId) => {
  await addToCart(variantId, 1);
  const url = await getCheckoutUrl();
  // Update UI...
};
```

---

## 3. Build Process

### Step-by-step: Mockup → Finished Page

**Step 1: Analyze the mockup**
- Identify all sections (hero, features, products, testimonials, CTA, footer)
- Note which sections need Shopify integration (product images, cart buttons)
- Note the copy/content for each section

**Step 2: Create the page file**
```jsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
// Add Shopify imports if products are involved
// Add any Lucide icons needed

// FadeInSection component (paste from templates above)

export default function PageName() {
  // Shopify state (if needed)
  // Page-specific state

  return (
    <div className="min-h-screen relative" style={{ background: '#000000', color: '#ffffff', overflowX: 'hidden' }}>
      {/* Background pattern */}
      {/* Header */}
      {/* Sections... */}
      {/* Footer */}
    </div>
  );
}
```

**Step 3: Build section-by-section**
For each section in the mockup:
1. Wrap in `<section className="relative z-10 py-16 px-6">`
2. Add inner container `<div className="max-w-[430px] mx-auto">`
3. Add section tag (small uppercase #00ffcc text)
4. Add section title (Oswald, large, uppercase)
5. Add content using the component patterns
6. Wrap in `<FadeInSection>` for scroll animation

**Step 4: Add hero animations**
- Wrap hero text in stagger container
- Add product image with scale-in + glow
- Add price block with delayed fade-in

**Step 5: Wire Shopify (if products)**
- Add useEffect for product fetch
- Add handleAddToCart
- Wire CTA buttons to cart functions

**Step 6: Add footer**
- Always include: logo, manufacturer info, FDA disclaimer, copyright

**Step 7: Verify**
- Mobile-first at 430px width
- All animations trigger on scroll
- Shopify cart works (add + checkout)
- Build passes (`npx next build`)

---

## 4. Page Type Adaptations

### Product Landing Page (e.g., /nitric)
- Single product hero with giant name
- 4 feature items (numbered 01-04)
- Ingredient/formula section
- 3 review cards
- Bottom urgency CTA
- Footer with FDA disclaimer

### Home Page
- Brand hero with tagline (not product-specific)
- Value proposition section (what makes Aviera different)
- Featured products carousel (fetch from Shopify)
- Quiz/score CTA section
- Social proof / testimonials
- Newsletter signup
- Footer
- **Key difference**: Uses MarketingLayout wrapper (has nav + footer + bottom nav)

### Content Page (about, news)
- Hero with page title
- Text-heavy sections with FadeInSection wrapping
- Minimal CTAs (link to shop or quiz)
- Uses MarketingLayout wrapper
- Lighter on animations

---

## 5. Reference Files

| File | Purpose |
|------|---------|
| `app/nitric/page.js` | Living code reference — the canonical implementation |
| `skills/aviera-site-design-skill.md` | Quick-reference design system |
| `skills/mockup-b-hypebeast-final.html` | Original HTML mockup for /nitric |
| `app/lib/shopify.js` | Shopify integration functions |
| `app/layout.js` | Font loading (Oswald + Space Mono CSS variables) |
| `app/components/MarketingLayout.jsx` | Layout wrapper (conditional nav/footer) |

---

## 6. Copy Guidelines

- Lead with the outcome, not the ingredient
- Use words like: sick, insane, massive, locked in, no BS, legit
- Reviews should sound like real gym bros, not marketing copy
- Never make medical claims
- Always include FDA disclaimer on product pages
- Feature "no stim / no crash" as a differentiator when applicable
- Headlines: short, punchy, uppercase
- Descriptions: one or two sentences max
