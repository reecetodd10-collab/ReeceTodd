# Background Image Setup Guide

## Directory Structure

```
nextjs/public/images/
├── hero/
│   └── hero-background.jpg ✅ (already added)
├── about/
│   ├── founder-photo.jpg ✅ (already added)
│   └── background.jpg (for about page background)
├── stack/
│   └── background.jpg (for Aviera Stack page)
├── fit/
│   └── background.jpg (for Aviera Fit page)
├── shop/
│   └── background.jpg (for Shop page)
└── dashboard/
    └── welcome-image.jpg (welcome image)
```

## Image Requirements

### Stack Background (`stack/background.jpg`)
- **Recommended Size**: 1920x1080px (16:9 aspect ratio)
- **Format**: JPG or WebP
- **Max File Size**: 500KB
- **Theme**: Fitness/supplements - could show supplements, gym equipment, or fitness lifestyle
- **Notes**: Will have dark overlay (rgba(0,0,0,0.5)) so image can be bright

### Fit Background (`fit/background.jpg`)
- **Recommended Size**: 1920x1080px (16:9 aspect ratio)
- **Format**: JPG or WebP
- **Max File Size**: 500KB
- **Theme**: Workout/gym - could show gym equipment, people working out, or fitness training
- **Notes**: Will have dark overlay (rgba(0,0,0,0.5)) so image can be bright

### About Background (`about/background.jpg`)
- **Recommended Size**: 1920x1080px (16:9 aspect ratio)
- **Format**: JPG or WebP
- **Max File Size**: 400KB
- **Theme**: Subtle fitness background - should be more muted/subtle than hero
- **Notes**: Lighter overlay (rgba(0,0,0,0.3)) for subtle effect, text should still be readable

### Shop Background (`shop/background.jpg`)
- **Recommended Size**: 1920x1080px (16:9 aspect ratio)
- **Format**: JPG or WebP
- **Max File Size**: 500KB
- **Theme**: Products/supplements - could show product displays or shopping experience
- **Notes**: Will have dark overlay (rgba(0,0,0,0.5)) so image can be bright

## Implementation Details

All background images include:
- ✅ Dark overlay: `bg-black/50` (rgba(0,0,0,0.5)) for hero sections
- ✅ Gradient overlay: Additional gradient for better text contrast
- ✅ White text with shadows: All text is white with drop shadows for readability
- ✅ Glass morphism pills: Feature pills use glass effect with white borders
- ✅ Optimized loading: Uses Next.js Image component with priority loading
- ✅ Responsive: Images scale properly on all screen sizes

## Text Readability

All pages now use:
- White text (`text-white`) instead of muted colors
- Text shadows (`text-shadow-lg`, `drop-shadow-2xl`) for contrast
- Dark overlays to ensure text is always readable
- Glass morphism effects that work over backgrounds

## Adding Your Images

1. Place images in the correct directories:
   - `nextjs/public/images/stack/background.jpg`
   - `nextjs/public/images/fit/background.jpg`
   - `nextjs/public/images/about/background.jpg`
   - `nextjs/public/images/shop/background.jpg`

2. Images will automatically:
   - Load with Next.js optimization
   - Show loading states
   - Fall back to placeholders if missing
   - Be responsive and optimized

3. No code changes needed - just drop in the files!

## Notes

- Images are served from `/public` directory (Next.js convention)
- File names must match exactly
- Images are automatically optimized by Next.js
- Placeholders show if images don't exist (no errors)
- All pages maintain the professional glass morphism aesthetic
- Folder structure is standardized and consistent across all pages
