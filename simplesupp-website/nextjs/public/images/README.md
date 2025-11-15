# Images Directory

This directory contains all images used throughout the application.

## Directory Structure

```
images/
├── hero/
│   └── hero-background.jpg    # Hero section background image (1920x1080 recommended)
├── about/
│   └── founder-photo.jpg      # Founder photo for About section (600x800, 3:4 aspect ratio)
└── dashboard/
    └── welcome-image.jpg       # Welcome image for dashboard (400x400, square)
```

## Image Requirements

### Hero Background (`hero/hero-background.jpg`)
- **Recommended Size**: 1920x1080px (16:9 aspect ratio)
- **Format**: JPG or WebP
- **Max File Size**: 500KB (optimize for web)
- **Purpose**: Background image for homepage hero section
- **Notes**: Should be fitness/wellness themed, not too busy (text will overlay)

### Founder Photo (`about/founder-photo.jpg`)
- **Recommended Size**: 600x800px (3:4 aspect ratio)
- **Format**: JPG or WebP
- **Max File Size**: 200KB
- **Purpose**: Founder photo in About section
- **Notes**: Professional headshot or fitness photo, portrait orientation

### Dashboard Welcome Image (`dashboard/welcome-image.jpg`)
- **Recommended Size**: 400x400px (1:1 aspect ratio)
- **Format**: JPG or WebP
- **Max File Size**: 150KB
- **Purpose**: Welcome image in dashboard header
- **Notes**: Motivational fitness image, square format

## Image Optimization Tips

1. **Use WebP format** when possible for better compression
2. **Optimize images** before uploading (use tools like TinyPNG, ImageOptim, or Squoosh)
3. **Keep file sizes small** for faster page loads
4. **Use appropriate dimensions** - don't upload images larger than needed
5. **Consider retina displays** - 2x resolution for high-DPI screens

## Adding Images

1. Place your optimized images in the appropriate subdirectory
2. Use the exact filenames listed above
3. The Next.js Image component will automatically optimize and serve them
4. Images will fall back to placeholders if files don't exist

## Next.js Image Optimization

The application uses Next.js Image component which provides:
- Automatic image optimization
- Lazy loading (except priority images)
- Responsive images
- WebP format when supported
- Blur placeholders

