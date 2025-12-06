# Avierafit Landing Page Setup

## Overview
This is a standalone coming-soon landing page for avierafit.com. It collects email addresses and stores them in Supabase.

## Files Created
- `app/landing/page.js` - Main landing page component
- `app/landing/layout.js` - Layout for landing page (no nav/footer)
- `app/api/waitlist/route.js` - API endpoint for email capture (updated to use Supabase)

## Environment Variables Required

Create a `.env.local` file in the `nextjs` directory with:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ewmgyjsluooktlftttea.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3bWd5anNsdW9va3RsZnR0dGVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNTYyMzAsImV4cCI6MjA3ODczMjIzMH0.z1xPu3wuLhf5tr-lZDMLSjD_1je0ku3h1Bv81jjTO8A
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3bWd5anNsdW9va3RsZnR0dGVhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzE1NjIzMCwiZXhwIjoyMDc4NzMyMjMwfQ.3Kf7ZzVsWsAR9zS6oGQbimBRRwW6yCbApPhZjofmxAY
```

## Supabase Setup

1. **Create the waitlist table in Supabase:**
   - Go to your Supabase project: https://supabase.com/dashboard/project/ewmgyjsluooktlftttea
   - Navigate to SQL Editor
   - Run this SQL:

```sql
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at DESC);
```

2. **Enable RLS (Row Level Security) if needed:**
   - The API uses the service role key, so it bypasses RLS
   - For additional security, you can set up RLS policies later

## Testing

1. **Start the dev server:**
   ```bash
   cd nextjs
   npm run dev
   ```

2. **Visit the landing page:**
   - Local: http://localhost:3001/landing
   - Or configure it to be the default route

3. **Test email submission:**
   - Enter your email in the form
   - Check Supabase dashboard to verify the email was saved

## Deployment to Vercel

1. **Set Environment Variables in Vercel:**
   - Go to your Vercel project settings
   - Add all three Supabase environment variables
   - Redeploy

2. **Configure Domain:**
   - Point avierafit.com to your Vercel deployment
   - The landing page is available at `/landing`

3. **Make Landing Page Default (Optional):**
   - To make `/landing` the homepage, you can:
     - Rename `app/page.js` to `app/page-backup.js`
     - Copy `app/landing/page.js` to `app/page.js`
     - Or configure Vercel rewrites to redirect `/` to `/landing`

## Features

- ✅ Single-page, no scrolling design
- ✅ Centered content with hero background
- ✅ Email capture form with validation
- ✅ Supabase integration for email storage
- ✅ Success/error message handling
- ✅ Responsive design (mobile-friendly)
- ✅ Montserrat Light font
- ✅ Cyan accent colors (#00FFD1)
- ✅ Smooth animations with Framer Motion
- ✅ Prevents body scrolling

## Notes

- The landing page is completely separate from the main site
- It doesn't use Navigation or Footer components
- All emails are stored in Supabase `waitlist` table
- Duplicate emails are handled gracefully (shows "already on waitlist" message)

