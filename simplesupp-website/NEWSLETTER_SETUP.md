# Aviera Newsletter System - Complete Setup Guide

## Overview

Your newsletter system is now fully automated! Here's how it works:

1. **Modal** runs weekly (Sundays 8am PT) to generate newsletters
2. Newsletters are automatically **saved to Supabase**
3. The `/news` page **automatically displays** new newsletters
4. Subscribers receive emails via **Resend**

---

## 🎯 What's Been Set Up

### 1. **Supabase Database Table**
- ✅ Created `newsletters` table with proper schema
- ✅ Configured Row Level Security (RLS)
- ✅ Public read access enabled
- ✅ Indexed for fast queries

**Location:** `nextjs/supabase/migrations/create_newsletters_table.sql`

### 2. **API Endpoint**
- ✅ GET `/api/newsletters` - Fetch all newsletters
- ✅ GET `/api/newsletters?latest=true` - Get most recent
- ✅ GET `/api/newsletters?limit=5` - Limit results

**Location:** `nextjs/app/api/newsletters/route.js`

### 3. **Modal Integration**
- ✅ Updated workflow to save newsletters to Supabase
- ✅ Runs automatically every Sunday at 8am PT
- ✅ Generates title, content, and excerpt automatically

**Location:** `reece_workspace/execution/modal_fitness_newsletter.py`

### 4. **Frontend Pages**
- ✅ Newsletter list page with white background design
- ✅ Latest edition featured section
- ✅ Archive of past newsletters
- ✅ Individual newsletter view pages
- ✅ Automatic date formatting

**Locations:**
- List: `nextjs/app/news/page.js`
- Detail: `nextjs/app/news/[id]/page.js`

---

## 📋 Initial Setup (One-Time)

### Step 1: Create the Database Table

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** → **New Query**
4. Copy and paste from: `nextjs/supabase/migrations/create_newsletters_table.sql`
5. Click **Run**

✅ You should see "Success. No rows returned"

### Step 2: Configure Modal Secrets

Make sure your Modal secrets include:
```bash
SUPABASE_URL=https://ewmgyjsluooktlftttea.supabase.co
SUPABASE_KEY=your-service-role-key
OPENAI_API_KEY=your-openai-key
RESEND_API_KEY=your-resend-key
NEWSLETTER_FROM_EMAIL=news@aviera.com
NEWSLETTER_FROM_NAME=Aviera News
```

### Step 3: Deploy Modal Function

```bash
cd reece_workspace/execution
modal deploy modal_fitness_newsletter.py
```

---

## 🚀 How It Works

### Automated Workflow (Every Sunday)

1. **8:00 AM PT** - Modal triggers automatically
2. **Research Phase** - Fetches PubMed papers, RSS feeds, news
3. **Curation Phase** - GPT-5.1 curates top trends
4. **HTML Generation** - Creates formatted newsletter
5. **💾 Save to Supabase** - Stores newsletter in database with:
   - Title: "Aviera News - [Date]"
   - Content: Full HTML
   - Excerpt: First 300 chars of intro
   - Published Date: Current timestamp
6. **Email Delivery** - Sends to all subscribers via Resend

### Website Updates Automatically

The `/news` page:
- ✅ Fetches newsletters on page load
- ✅ Shows latest edition in featured section
- ✅ Lists past editions in archive
- ✅ Updates automatically when new newsletters are published
- ✅ No manual intervention needed!

---

## 📝 Adding Newsletters Manually (Optional)

If you want to add a newsletter manually:

### Via Supabase Dashboard

1. Go to **Table Editor** → `newsletters`
2. Click **Insert row**
3. Fill in:
   - `title`: Newsletter title
   - `content`: HTML content
   - `excerpt`: Brief summary (2-3 sentences)
   - `published_date`: Date (YYYY-MM-DD HH:MM:SS)
4. Click **Save**

### Via SQL

```sql
INSERT INTO newsletters (title, content, excerpt, published_date)
VALUES (
  'Aviera News - January 23, 2026',
  '<h1>Newsletter Content</h1><p>Your HTML content here...</p>',
  'Brief summary of this edition...',
  '2026-01-23 09:00:00'
);
```

---

## 🧪 Testing the System

### Test Manual Newsletter Trigger

```bash
modal run modal_fitness_newsletter.py::manual_newsletter
```

This will:
1. Generate a newsletter
2. Save it to Supabase
3. Send emails to subscribers
4. Automatically appear on `/news` page

### Test API Endpoints

```bash
# Get all newsletters
curl http://localhost:3000/api/newsletters

# Get latest only
curl http://localhost:3000/api/newsletters?latest=true

# Get 5 most recent
curl http://localhost:3000/api/newsletters?limit=5
```

### View on Website

1. Visit http://localhost:3000/news
2. You should see:
   - Latest newsletter in featured section
   - Archive of past newsletters
   - Proper dates and titles
   - Click to view full newsletter

---

## 📊 Database Schema

```sql
newsletters
├── id (UUID, Primary Key)
├── title (TEXT, NOT NULL)
├── content (TEXT, NOT NULL)         -- Full HTML
├── excerpt (TEXT)                   -- Preview text
├── published_date (TIMESTAMP)       -- Display date
└── created_at (TIMESTAMP)           -- Record creation
```

**Indexes:**
- `newsletters_published_date_idx` - Fast sorting by date

**Policies:**
- Public read access (SELECT)
- Service role write access (INSERT/UPDATE/DELETE)

---

## 🎨 Newsletter Page Features

### Main Newsletter Page (`/news`)
- ✅ White, professional design
- ✅ Email subscription form (connected to Supabase)
- ✅ Latest edition featured prominently
- ✅ "What to Expect" section with benefits
- ✅ Newsletter archive with hover effects
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Loading states
- ✅ Empty states when no newsletters exist

### Individual Newsletter Page (`/news/[id]`)
- ✅ Full newsletter content display
- ✅ Styled HTML rendering
- ✅ Publication date
- ✅ Back navigation
- ✅ Responsive typography
- ✅ Code syntax highlighting
- ✅ Image support
- ✅ Link styling

---

## 🔧 Customization

### Change Newsletter Schedule

Edit `modal_fitness_newsletter.py`:

```python
@app.function(
    schedule=modal.Cron("0 16 * * 0"),  # Current: Sunday 8am PT
)
```

Cron format: `minute hour day month weekday`

Examples:
- `"0 16 * * 1"` - Every Monday 8am PT
- `"0 16 * * 1-5"` - Weekdays only
- `"0 16 1 * *"` - First day of every month

### Change Newsletter Title Format

Edit `modal_fitness_newsletter.py` around line 275:

```python
newsletter_title = f"Aviera News - {newsletter_date.strftime('%B %d, %Y')}"
```

### Change Email Sender

Update Modal secrets:
```bash
NEWSLETTER_FROM_EMAIL=updates@aviera.com
NEWSLETTER_FROM_NAME=Aviera Fitness Updates
```

---

## 📈 Monitoring

### Check Newsletter Generation

1. **Modal Dashboard**: View logs at modal.com
2. **Supabase Dashboard**: Check `newsletters` table for new entries
3. **Website**: Visit `/news` to see live newsletters

### Check Email Delivery

1. **Resend Dashboard**: View email send logs
2. **Modal Logs**: See delivery confirmations

---

## 🐛 Troubleshooting

### Newsletters Not Appearing on Website

1. Check Supabase table has data:
   ```sql
   SELECT * FROM newsletters ORDER BY published_date DESC;
   ```

2. Check API endpoint:
   ```bash
   curl http://localhost:3000/api/newsletters
   ```

3. Check browser console for errors

### Modal Not Saving to Supabase

1. Verify Modal secrets are set correctly
2. Check Modal logs for errors
3. Verify `SUPABASE_URL` and `SUPABASE_KEY` are correct

### Email Not Sending

1. Check `newsletter_subscribers` table has subscribers
2. Verify Resend API key is valid
3. Check Modal logs for delivery errors

---

## 🎯 Next Steps

1. ✅ **Database created** - You've already done this!
2. 🔄 **Wait for Sunday** - Modal will auto-generate first newsletter
3. 📧 **Check emails** - Subscribers will receive it
4. 🌐 **Visit /news** - See it live on your website
5. 🎉 **Done!** - System runs automatically from now on

---

## 📞 Quick Reference

| Task | Location |
|------|----------|
| View newsletters | https://yoursite.com/news |
| Supabase table | Table Editor → `newsletters` |
| API endpoint | `/api/newsletters` |
| Modal logs | modal.com dashboard |
| Manual trigger | `modal run modal_fitness_newsletter.py::manual_newsletter` |
| Database migration | `nextjs/supabase/migrations/create_newsletters_table.sql` |

---

## 🎉 Summary

Your newsletter system is **fully automated**:
- ✅ Generates every Sunday at 8am PT
- ✅ Saves to database automatically
- ✅ Displays on website automatically
- ✅ Sends emails to subscribers
- ✅ No manual work required!

Just sit back and let the AI handle your weekly newsletters! 🚀
