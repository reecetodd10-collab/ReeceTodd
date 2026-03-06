---
name: aviera-site-design
description: Use this skill for ALL Aviera Fit page builds, redesigns, and UI work. This defines the exact design system, component patterns, and implementation details for every page on avierafit.com. Built from the /nitric page that shipped — this is the source of truth for the entire site aesthetic.
---

# Aviera Fit — Site-Wide Design System

Every page on avierafit.com follows this system. No exceptions. When rebuilding or creating any page, reference this document for colors, fonts, components, layout, and implementation patterns.

## Tech Stack

- **Next.js 14** (App Router) — all pages use `'use client'` directive
- **React 18**
- **Tailwind CSS** with custom CSS variables from `globals.css`
- **Framer Motion** for animations (already installed)
- **Shopify integration** via `lib/shopify.js` — `addToCart()`, `addMultipleToCart()`, `getCheckoutUrl()`, `fetchShopifyProducts()`
- **Google Fonts**: Oswald (headlines) + Space Mono (body) — load via CDN

## Design Identity

- **Aesthetic**: Hypebeast — aggressive, high contrast, oversized typography, streetwear energy
- **Target audience**: Male lifters 18-25, intense, want to look and feel elite
- **Tone**: Direct, confident, no-BS. Talks like the audience talks.
- **Mobile-first**: 430px max-width container, centered. Must look perfect on phone first.

## Colors

```css
--bg: #000000;          /* Pure black — page background */
--surface: #0a0a0a;     /* Cards, elevated containers */
--accent: #00ffcc;      /* Primary accent — green-cyan. Used for: CTAs, highlights, active states, badges */
--hot: #ff2d55;         /* Urgency — sale badges, limited offers, warnings */
--text: #ffffff;        /* Primary text */
--muted: #666666;       /* Body copy, secondary text, descriptions */
```

Always use these. No other colors unless explicitly needed for a specific element.

## Typography

| Element | Font | Weight | Size | Extras |
|---------|------|--------|------|--------|
| Page titles / product names | Oswald | 700 | 80px mobile | line-height: 0.85, uppercase, tight tracking |
| Section titles | Oswald | 700 | 32px | uppercase |
| CTA buttons | Oswald | 700 | 20px | letter-spacing: 0.15em, uppercase |
| Prices | Oswald | 700 | 48px | — |
| Section tags | Oswald | 700 | 11px | letter-spacing: 0.3em, uppercase, #00ffcc |
| Body text | Space Mono | 400 | 12px | color: #666, line-height: 1.6 |
| Micro text (trust, fine print) | Space Mono | 400 | 10px | uppercase, letter-spacing: 0.08em |
| Feature numbers | Oswald | 700 | 32px | #00ffcc at 15% opacity |
| Ingredient doses | Oswald | 700 | 18px | #00ffcc |
| Footer | Space Mono | 400 | 9px | color: #333 |

## Background Pattern

Every page uses this subtle scan-line pattern:

```css
background: repeating-linear-gradient(
  0deg,
  transparent,
  transparent 40px,
  rgba(255,255,255,0.015) 40px,
  rgba(255,255,255,0.015) 41px
), #000000;
```

## Component Library

### Top Strip (every page)
- Logo left: "◉ AVIERA" — Oswald, 12px, 700 weight, letter-spacing 0.4em, #00ffcc
- Optional badge right: urgency text in #ff2d55, bg rgba(255,45,85,0.15), 9px uppercase

### Navigation
- Sticky top, black bg with subtle bottom border (rgba(255,255,255,0.08))
- Links in Space Mono, 11px, uppercase, #666 default, #00ffcc on hover/active
- Mobile: hamburger menu, full-screen overlay, same aesthetic

### CTA Button (primary)
```css
display: block;
width: 100%;
padding: 18px;
background: #00ffcc;
border: none;
border-radius: 6px;
font-family: 'Oswald', sans-serif;
font-size: 20px;
letter-spacing: 0.15em;
color: #000000;
text-transform: uppercase;
font-weight: 700;
cursor: pointer;
/* Active state */
opacity: 0.85;
transform: scale(0.98);
```

### CTA Button (secondary / outline)
Same as above but:
```css
background: transparent;
border: 1px solid #00ffcc;
color: #00ffcc;
```

### Price Block
Dark surface card (#0a0a0a), 1px border rgba(255,255,255,0.06), rounded-lg (8px):
- Price: Oswald 48px bold
- Strikethrough original: 18px #666 line-through
- Percentage badge: #ff2d55, 14px bold, bg rgba(255,45,85,0.12), 2px radius
- CTA button below
- Micro trust row: 3 items with ✓ prefix, 10px Space Mono, #666

### Feature Items (numbered)
- Large number (01, 02, etc): Oswald 32px, #00ffcc at 15% opacity
- Title: Oswald 16px, 600 weight, uppercase
- Description: Space Mono 11px, #666, line-height 1.5
- Separated by 1px border-bottom rgba(255,255,255,0.04)

### Ingredient Rows
- Name left: Space Mono 13px, 500 weight
- Dose right: Oswald 18px, 700 weight, #00ffcc
- 1px border-bottom between rows

### Review Cards
- Stars: #00ffcc, 12px, letter-spacing 3px
- Quote: italic, 13px, #ccc
- Author: 10px, #666, uppercase, letter-spacing 0.08em
- Separated by subtle borders

### Section Pattern
Every content section follows:
1. Section tag: small uppercase letterspaced text in #00ffcc (e.g., "WHY THIS HITS DIFFERENT")
2. Section title: Oswald, large, uppercase (e.g., "BUILT FOR THE PUMP")
3. Content specific to that section
4. 30px vertical padding, 16px horizontal padding

### Cards / Surfaces
- Background: #0a0a0a
- Border: 1px solid rgba(255,255,255,0.06)
- Border-radius: 8px
- Padding: 20px 16px

### Product Image Frame
- 1px border rgba(0,255,204,0.15)
- 4px border-radius
- Vertical rotated text on the side (product name, Oswald 10px, #00ffcc, 30% opacity)

### Footer (every page)
```
Manufactured for and Distributed by: AvieraFit
4437 Lister St, San Diego, CA 92110 USA
Questions? info@avierafit.com

© 2026 Aviera Fit. All rights reserved.
*These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease.
```
Space Mono 9px, #333, centered, with subtle top border.

## Animations (Framer Motion)

- **Hero**: staggered fade-in — headline (0ms) → description (100ms) → image (200ms) → price block (300ms)
- **Sections**: scroll-triggered fade-up with `whileInView`, 0.6s duration, ease-out
- **Buttons**: `active` scale 0.98, 0.15s transition
- **Keep it lean**: disable heavy animations on mobile if needed for performance

## Page Templates

### Product Landing Page (e.g., /nitric)
1. Hero: top strip + giant product name + description + product image + price block with CTA
2. Features: 4 numbered benefit items
3. Formula/Ingredients: clean rows with doses
4. Social Proof: 3 review cards
5. Bottom CTA: urgency headline + repeat price block
6. Footer

### Home Page (/)
1. Hero: brand statement + primary CTA
2. Featured product spotlight (Flow State X)
3. Brand pillars (3-4 items: Science, AI, Clean, Transparent)
4. Social proof / testimonials
5. Newsletter signup
6. Footer

### Shop Page (/shop)
1. Hero: minimal header
2. Product grid: dark cards with product image, name, price, quick-add CTA
3. Each card follows the surface/card pattern
4. Footer

### About Page (/about)
1. Hero: brand story headline
2. Mission statement
3. Team / founder section
4. Values (numbered feature items pattern)
5. Footer

### Dashboard Pages (/dashboard/*)
1. Dark sidebar navigation
2. Content area with card-based layout
3. Same color system, more functional/less marketing energy

## Copy Guidelines

- Lead with the outcome, not the ingredient
- Use words like: sick, insane, massive, locked in, no BS, legit
- Reviews should sound like real gym bros, not marketing copy
- Never make medical claims
- Always include FDA disclaimer on any page with product/health claims
- Feature "no stim / no crash" as a differentiator when applicable

## Implementation Notes

- Every page file: `'use client'` directive at top
- Mobile-first: 430px max-width container centered, scales up
- Shopify cart: always use functions from `lib/shopify.js`
- Product images: fetch from Shopify or use CDN URLs
- Google Fonts: load Oswald + Space Mono in layout.js or via CSS import
- CSS variables: reference from globals.css where they exist, inline Tailwind for component-specific styles
- No inline JS hover handlers — use CSS `:hover` or Framer Motion
- No mixed CSS/Tailwind — prefer Tailwind utilities, use CSS variables via arbitrary values `text-[var(--accent)]`

## Reference File

`mockup-b-hypebeast-final.html` in `skills/` — this is the canonical HTML mockup for the /nitric page. Use it as the visual source of truth for layout, spacing, colors, and copy patterns. Every other page adapts this same system.
