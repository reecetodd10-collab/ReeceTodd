# ⚠️ IMPORTANT: Image Location

## Correct Location for Next.js Images

**All images MUST be in:** `nextjs/public/images/`

**NOT in:** `public/images/` (root folder)

## Why?

Next.js only serves static files from the `public` folder **within the Next.js project directory**. Since your Next.js app is in the `nextjs/` folder, images must be in `nextjs/public/images/`.

## Current Image Locations

✅ **Correct:**
- `nextjs/public/images/about/founder-photo.jpg` ✅
- `nextjs/public/images/hero/hero-background.jpg`
- `nextjs/public/images/dashboard/welcome-image.jpg`

❌ **Wrong (won't work):**
- `public/images/about/founder-photo.jpg` ❌
- `public/images/hero/hero-background.jpg` ❌

## How to Fix

If you have images in the root `public/` folder, copy them to `nextjs/public/images/`:

```powershell
# From nextjs directory
Copy-Item -Path "..\public\images\*" -Destination "public\images\" -Recurse -Force
```

## Path in Code

In your code, reference images as:
```jsx
src="/images/about/founder-photo.jpg"
```

Next.js automatically serves from `public/`, so `/images/` maps to `nextjs/public/images/`.

