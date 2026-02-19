# Aviera Design System

## Quick Reference

All colors now reference CSS variables from `globals.css` through Tailwind classes.

### Colors - Use These Tailwind Classes

| Purpose | Tailwind Class | CSS Variable | Value |
|---------|---------------|--------------|-------|
| **Backgrounds** |||
| Main background | `bg-bg` | `--bg` | #0a0a0a |
| Cards/elevated | `bg-bg-elevated` | `--bg-elev-1` | #1a1a1a |
| Higher elevation | `bg-bg-elevated2` | `--bg-elev-2` | #242424 |
| **Text** |||
| Primary text | `text-txt` | `--txt` | #ffffff |
| Secondary text | `text-txt-secondary` | `--txt-secondary` | #e5e5e5 |
| Muted text | `text-txt-muted` | `--txt-muted` | #a0a0a0 |
| **Accent (Cyan)** |||
| Primary cyan | `text-accent` / `bg-accent` | `--acc` | #00d9ff |
| Hover state | `text-accent-hover` | `--acc-hover` | #00b8d4 |
| Light accent bg | `bg-accent-light` | `--acc-light` | rgba(0,217,255,0.1) |
| **Status** |||
| Success | `text-success` / `bg-success` | `--success` | #10b981 |
| Warning | `text-warning` / `bg-warning` | `--warning` | #f59e0b |
| Error | `text-error` / `bg-error` | `--error` | #ef4444 |

### Borders & Glass

| Purpose | Tailwind Class | CSS Variable |
|---------|---------------|--------------|
| Glass background | `bg-glass-bg` | `--glass-bg` |
| Glass border | `border-glass-border` | `--glass-border` |

### Shadows

| Purpose | Tailwind Class |
|---------|---------------|
| Small | `shadow-sm` |
| Medium | `shadow-md` |
| Large | `shadow-lg` |
| Extra large | `shadow-xl` |
| Glass | `shadow-glass` |
| Accent glow | `shadow-accent` |
| Accent glow large | `shadow-accent-lg` |

### Border Radius

| Purpose | Tailwind Class | Value |
|---------|---------------|-------|
| Small | `rounded-sm` | 8px |
| Medium | `rounded-md` | 12px |
| Large | `rounded-lg` | 16px |
| Extra large | `rounded-xl` | 20px |
| Full (pills) | `rounded-full` | 9999px |

## Do's and Don'ts

### DO:
```jsx
// Use semantic color classes
<p className="text-txt-muted">Muted text</p>
<button className="bg-accent text-white">Button</button>
<div className="border border-glass-border">Card</div>
```

### DON'T:
```jsx
// Avoid hardcoded hex values
<p className="text-[#a0a0a0]">Muted text</p>  // BAD
<button className="bg-[#00d9ff]">Button</button>  // BAD
<div style={{ color: '#ffffff' }}>Text</div>  // BAD
```

## Pre-built Components

Use these CSS classes from `globals.css`:

- `.glass` - Standard glass morphism card
- `.glass-card` - Premium glass card with hover effects
- `.glass-card-premium` - Cyan-accented premium card
- `.btn-primary` - Primary cyan button
- `.btn-secondary` - Secondary glass button
- `.btn-tertiary` - Text-only button
- `.badge` - Standard badge
- `.badge-primary` - Cyan badge
- `.badge-success` / `.badge-warning` / `.badge-error` - Status badges

## Changing Brand Colors

To change the entire site's accent color, modify ONE variable in `globals.css`:

```css
:root {
  --acc: #00d9ff;  /* Change this to update all cyan throughout the site */
}
```

All Tailwind classes and components will automatically use the new color.
