# 3D Parallax Framework & Brand Color Unification

## Overview

This document explains the 3D parallax scrolling system and centralized color palette implemented for the SimpleSupp website. The system provides subtle depth and motion while maintaining excellent performance and accessibility.

## Parallax System Architecture

### Core Components

#### 1. `useParallax` Hook (`src/hooks/useParallax.js`)

A lightweight React hook that calculates scroll-based parallax offsets.

**Props:**
- `speed` (number, default: 0.5) - Parallax speed multiplier

**Returns:**
- `offsetY` (number) - Current scroll offset for transforms
- `isEnabled` (boolean) - Whether parallax is active

**Features:**
- Automatically disables on mobile devices (< 768px)
- Respects `prefers-reduced-motion` user preference
- Uses passive scroll listeners for optimal performance
- Cleanup on unmount to prevent memory leaks

#### 2. `ParallaxLayer` Component (`src/components/ParallaxLayer.jsx`)

A wrapper component that applies 3D transforms to create depth.

**Props:**
- `depth` (number, 0-100, default: 20) - Z-axis depth. Higher = stronger effect
- `speed` (number, default: 0.5) - Scroll speed multiplier
- `className` (string) - Additional CSS classes
- `children` (ReactNode) - Content to parallax

**Transform Calculation:**
```js
translateY(offsetY * 0.1) translateZ(-depth) scale(1 + depth * 0.001)
```

### CSS Utilities (`src/index.css`)

#### Parallax Classes

- `.parallax-container` - Applies perspective to parent elements
- `.parallax-layer` - Base styles for parallax children
- Automatic disable via media queries for mobile and reduced-motion

#### CSS Variables

All brand colors centralized in `:root`:

```css
--brand-primary: #2563eb        /* Blue */
--brand-accent: #06b6d4         /* Cyan */
--brand-violet: #7c3aed         /* Violet */
--brand-gradient: linear-gradient(90deg, #2563eb 0%, #06b6d4 50%, #7c3aed 100%)
```

## Implementation Examples

### Home Page Hero Section

```jsx
<section className="parallax-container">
  {/* Subtle background parallax */}
  <ParallaxLayer depth={10} speed={0.2}>
    <div className="bg-gradient-to-br from-slate-900 via-primary to-slate-900" />
  </ParallaxLayer>

  {/* Floating logo with more visible effect */}
  <ParallaxLayer depth={30} speed={0.8}>
    <PillLogo size="large" shimmer={true} />
  </ParallaxLayer>
</section>
```

**Depth Guidelines:**
- Background layers: `depth={10}` with `speed={0.2}` (very subtle)
- Hero content: `depth={30}` with `speed={0.8}` (noticeable float)
- Decorative elements: `depth={20}` with `speed={0.5}` (balanced)

## Color Palette System

### Centralized Location

All brand colors are defined in two places:
1. **CSS Variables** - `src/index.css` (`:root` block)
2. **Tailwind Config** - `tailwind.config.js` (theme.extend.colors)

### Brand Gradient Usage

The brand uses a three-color gradient across the site:

**Primary Gradient:**
```
Blue (#2563eb) → Cyan (#06b6d4) → Violet (#7c3aed)
```

**Tailwind Classes:**
```jsx
// Three-color gradient
className="bg-gradient-to-r from-primary via-accent to-violet"

// Variations for variety
className="bg-gradient-to-r from-accent via-violet to-primary"
className="bg-gradient-to-r from-violet via-primary to-accent"
```

### Updated Components

#### Smart Stack AI (`src/SupplementQuiz.jsx`)

All goal category cards now use brand gradient variations:
- Muscle: `from-primary via-accent to-violet`
- Fat Loss: `from-accent via-violet to-primary`
- Sleep: `from-violet via-primary to-accent`

All buttons updated from green/emerald to brand gradient:
- "Add to Cart" buttons
- "Checkout with Supliful" button
- Selection states use `border-primary` and `bg-primary/10`

#### Home Page (`src/pages/Home.jsx`)

Already using brand colors, now enhanced with parallax:
- Hero background: Subtle parallax layer
- PillLogo: Floating parallax effect
- All gradient CTAs consistent

## Accessibility & Performance

### Reduced Motion Support

**Automatic Disable:**
```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --parallax-enabled: 0;
  }
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**JavaScript Detection:**
The `useParallax` hook checks:
- `window.matchMedia('(prefers-reduced-motion: reduce)')`
- Window width < 768px
- Returns `isEnabled: false` when either condition is true

### Mobile Behavior

Parallax automatically disables on screens < 768px to:
- Prevent janky scrolling on mobile devices
- Reduce JavaScript execution overhead
- Maintain smooth 60fps scrolling

### Performance Metrics

**Bundle Size Impact:**
- JS: 392.77 KB (only +1.2 KB increase)
- CSS: 41.66 KB (minimal increase)

**Optimization Techniques:**
- Passive scroll listeners (`{ passive: true }`)
- `will-change: transform` on parallax layers
- CSS `perspective` instead of JavaScript 3D calculations
- Cubic bezier easing for smooth transforms

## Extending the System

### Adding Parallax to New Pages

1. Import the component:
```jsx
import ParallaxLayer from '../components/ParallaxLayer';
```

2. Add container class to parent section:
```jsx
<section className="parallax-container">
```

3. Wrap elements in ParallaxLayer:
```jsx
<ParallaxLayer depth={20} speed={0.5}>
  <YourComponent />
</ParallaxLayer>
```

### Custom Depth Values

- **0-10**: Imperceptible (background ambiance)
- **10-20**: Subtle (recommended for backgrounds)
- **20-40**: Noticeable (hero content, logos)
- **40-60**: Strong (decorative elements)
- **60-100**: Extreme (use sparingly for special effects)

### Adding New Brand Colors

If expanding the palette:

1. Update CSS variables in `src/index.css`:
```css
:root {
  --brand-new-color: #123456;
}
```

2. Update Tailwind config:
```js
theme: {
  extend: {
    colors: {
      'new-color': '#123456'
    }
  }
}
```

3. Use via Tailwind utilities:
```jsx
className="text-new-color bg-new-color/10"
```

## Testing Checklist

- [x] Parallax works on desktop Chrome
- [x] Parallax disabled on mobile (< 768px)
- [x] Parallax disabled for `prefers-reduced-motion: reduce`
- [x] No layout shift (CLS < 0.05)
- [x] Smooth 60fps scrolling
- [x] All Smart Stack colors use brand gradient
- [x] Buttons consistent across site
- [x] Build succeeds with minimal bundle increase

## Maintenance Notes

- **DO NOT** add heavy canvas or WebGL effects
- **KEEP** depth values < 40 for most use cases
- **ALWAYS** test with reduced motion enabled
- **VERIFY** mobile experience remains smooth
- **MAINTAIN** color consistency via Tailwind utilities

## Future Enhancements

Potential additions (if needed):
- Horizontal parallax for landscape images
- Mouse parallax for interactive elements (desktop only)
- Intersection Observer for viewport-based effects
- Staggered reveal animations with parallax

---

**Last Updated:** 2025-10-30
**Version:** 1.0.0
**Maintainer:** Claude Code
