# Dashboard Style Guide

## Background & Surface
- **Page background**: `#000000` (pure black)
- **Scanline overlay**: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 204, 0.015) 2px, rgba(0, 255, 204, 0.015) 4px)` — subtle green tinted scanlines
- **Card/surface background**: `#0a0a0a`
- **Card borders**: `1px solid rgba(255,255,255,0.06)`
- **Elevated cards**: `border: 1px solid rgba(0,255,204,0.15)` with radial glow `radial-gradient(ellipse at 50% 0%, rgba(0,255,204,0.06) 0%, transparent 70%)`

## Colors
- **Primary accent (cyan)**: `#00ffcc` — used for score rings, tier badges (MUST HAVE), active states, labels, glow effects
- **Secondary accent (purple)**: `#a855f7` — used for RECOMMENDED tier badges, alternating accents
- **Hot pink/red**: `#ff2d55` — used for alerts, urgent CTAs, error states
- **Text primary**: `#ffffff`
- **Text muted**: `#666`
- **Text dim**: `#333`
- **Streak glow**: `0 0 12px rgba(0,255,204,0.4)` on cyan elements

## Typography
- **Headers**: `var(--font-oswald), Oswald, sans-serif` — weight 700, uppercase, letter-spacing -0.02em to 0.4em
- **Body/labels**: `var(--font-space-mono), Space Mono, monospace` — weight 400/700
- **Score number**: Oswald, 72px, weight 700
- **Section labels**: Space Mono, 9px, uppercase, letter-spacing 3px, color #00ffcc
- **Card titles**: Oswald, 14-18px, uppercase
- **Card body text**: Space Mono, 11-12px, color #666

## Layout
- **Max width**: `430px` centered with `mx-auto`
- **Page padding**: `px-5`, `pt-[60px]` (below sticky nav), `pb-24`
- **Card padding**: `16px` to `20px`
- **Card border-radius**: `8px`
- **Grid**: 2-column grid for supplement slots with `gap-3`

## Components

### Score Ring (SVG)
- 150x150 SVG, radius 65
- Background circle: `stroke="#111"`, strokeWidth 6
- Score circle: `stroke="#00ffcc"`, animated strokeDashoffset, filter `drop-shadow(0 0 6px rgba(0,255,204,0.4))`

### Supplement Slot Card
- Background `#0a0a0a`, border `rgba(255,255,255,0.06)`
- Tier badge: small uppercase label, MUST HAVE = cyan bg `rgba(0,255,204,0.15)`, RECOMMENDED = purple bg `rgba(168,85,247,0.15)`
- Progress bar: 2px height, `rgba(255,255,255,0.06)` track, colored fill matching tier
- Streak counter: Space Mono 9px, fire emoji + day count

### Empty Slot
- Dashed border `2px dashed rgba(255,255,255,0.08)`
- "+" icon centered, 24px, color #333
- "ADD SUPPLEMENT" label, Oswald 10px, color #333

### Celebration View
- Confetti particles: CSS animated absolute positioned divs, colors `['#00ffcc', '#ff2d55', '#a855f7']`
- Pulsing streak text with `@keyframes pulseGlow` animation
- Large check circle with glow

## Animations
- **FadeInSection**: scroll-triggered, opacity 0 -> 1, y 40 -> 0, duration 0.7s, easeOut
- **Score ring**: strokeDashoffset animation, 1.5s delay 0.3s
- **pulseGlow keyframes**: `0%,100%: textShadow none` / `50%: textShadow 0 0 20px rgba(0,255,204,0.6)`
- **Confetti**: random translateY(-100vh) + rotate(720deg) over 2-3s with random delays

## Navigation
- Uses inline StickyNav (not shared component)
- Logo: `◉ Aviera` in Oswald 12px, cyan, letter-spacing 0.4em
- White user icon (28px circle, border rgba(255,255,255,0.15))
- Hamburger menu: 3 white bars, 20px wide, 2px height
- Mobile overlay: full black, centered links in Oswald 24px
- Active link highlighted in `#00ffcc`
