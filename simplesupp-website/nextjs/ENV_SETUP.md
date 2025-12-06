# Environment Variables Setup for Landing Page

## Quick Setup

Create a `.env.local` file in the `nextjs` directory with these values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://ewmgyjsluooktlftttea.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3bWd5anNsdW9va3RsZnR0dGVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNTYyMzAsImV4cCI6MjA3ODczMjIzMH0.z1xPu3wuLhf5tr-lZDMLSjD_1je0ku3h1Bv81jjTO8A
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3bWd5anNsdW9va3RsZnR0dGVhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzE1NjIzMCwiZXhwIjoyMDc4NzMyMjMwfQ.3Kf7ZzVsWsAR9zS6oGQbimBRRwW6yCbApPhZjofmxAY
```

## For Vercel Deployment

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add all three variables above
4. Redeploy

## Supabase Table Setup

Run this SQL in your Supabase SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at DESC);
```

