# Newsletter System Troubleshooting Guide

## Issue: Newsletter Not Showing on Website

### Quick Checklist

- [ ] **Step 1**: Did you create the `newsletters` table in Supabase?
- [ ] **Step 2**: Is your Next.js dev server running?
- [ ] **Step 3**: Did Modal successfully save the newsletter to Supabase?
- [ ] **Step 4**: Can the API fetch newsletters from Supabase?

---

## Step-by-Step Fixes

### 1. Create the Newsletters Table (One-Time Setup)

**If you haven't done this yet:**

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** → **New Query**
4. Copy the entire contents from:
   `nextjs/supabase/migrations/create_newsletters_table.sql`
5. Paste and click **Run**
6. You should see: "Success. No rows returned"

**Verify it worked:**
- Go to **Table Editor** in Supabase
- You should see a `newsletters` table in the list

---

### 2. Start Your Next.js Dev Server

**The website needs to be running to see updates!**

```bash
cd nextjs
npm run dev
```

You should see:
```
> next dev
> - ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

**Leave this running** in a terminal window.

---

### 3. Check if Newsletter Was Saved to Supabase

**Option A: Via Supabase Dashboard (Easiest)**

1. Go to https://supabase.com/dashboard
2. Click **Table Editor**
3. Select `newsletters` table
4. Check if there are any rows

**If you see rows:** Great! Skip to Step 4.
**If no rows:** The Modal script didn't save to database. See "Modal Issues" below.

**Option B: Via Browser (if Next.js is running)**

Open in your browser:
```
http://localhost:3000/api/newsletters
```

You should see JSON with newsletters, or an empty array `{"newsletters":[]}` if none exist.

---

### 4. Test the Frontend

**With Next.js running**, visit:
```
http://localhost:3000/news
```

**What you should see:**

- ✅ **If newsletters exist in database:** They appear automatically
- ⚠️ **If no newsletters:** You'll see "No newsletters published yet"

---

## Common Issues & Solutions

### Issue: "No newsletters published yet"

**Cause:** The database is empty. Modal didn't save anything.

**Solution:** Create a test newsletter manually:

1. Go to Supabase Dashboard → Table Editor → `newsletters`
2. Click **Insert row**
3. Fill in:
   ```
   title: Test Newsletter - January 23, 2026
   content: <h1>Welcome</h1><p>This is a test!</p>
   excerpt: This is a test newsletter
   published_date: 2026-01-23 12:00:00
   ```
4. Click **Save**
5. Refresh http://localhost:3000/news

---

### Issue: Modal Script Ran But Nothing in Database

**Check Modal Logs:**

Look for this in the Modal output:
```
=== PHASE 4: SAVE TO SUPABASE ===
✅ Newsletter saved to database with ID: [some-uuid]
```

**If you see an error instead:**

Common errors:
- `relation "newsletters" does not exist` → Run the SQL migration (Step 1)
- `SUPABASE_URL` or `SUPABASE_KEY` not found → Check Modal secrets
- `Invalid API key` → Wrong Supabase key in Modal secrets

**Fix Modal Secrets:**

```bash
# Check what secrets Modal has
modal secret list

# Update the newsletter secrets
modal secret create fitness-newsletter-secrets \
  SUPABASE_URL=https://ewmgyjsluooktlftttea.supabase.co \
  SUPABASE_KEY=your-service-role-key \
  OPENAI_API_KEY=your-openai-key \
  RESEND_API_KEY=your-resend-key
```

---

### Issue: "Failed to fetch newsletters" Error in Console

**Check:**

1. Is Next.js running? (`npm run dev` in `nextjs` folder)
2. Open browser console (F12) and look for errors
3. Try the API directly: http://localhost:3000/api/newsletters

**If API returns error:**
- Check `nextjs/.env.local` has correct Supabase credentials
- Restart Next.js server after changing `.env.local`

---

### Issue: Emails Not Sending

**This is separate from the website display!**

The Modal script has two phases:
1. **PHASE 4**: Save to Supabase (for website)
2. **PHASE 5**: Send emails (via Resend)

**Check Modal logs for:**
```
=== PHASE 5: EMAIL DELIVERY ===
Found X subscribers
✅ Sent to: email@example.com
```

**Common email issues:**
- No subscribers in `newsletter_subscribers` table
- Invalid `RESEND_API_KEY` in Modal secrets
- `NEWSLETTER_FROM_EMAIL` not verified in Resend

---

## Quick Test: Insert a Newsletter Manually

### Via Supabase Dashboard

1. Go to Supabase → Table Editor → `newsletters`
2. Click **Insert row**
3. Enter:
   ```
   title: My First Newsletter
   content: <h1>Hello World!</h1><p>This works!</p>
   excerpt: This is my first test newsletter
   published_date: 2026-01-23 12:00:00
   ```
4. Click **Save**
5. Visit http://localhost:3000/news (with Next.js running)
6. **You should see it immediately!**

### Via SQL

In Supabase SQL Editor:
```sql
INSERT INTO newsletters (title, content, excerpt, published_date)
VALUES (
  'My First Newsletter',
  '<h1>Hello World!</h1><p>This works!</p>',
  'This is my first test newsletter',
  NOW()
);
```

---

## Verify Everything Is Working

### ✅ Checklist

Run through this checklist:

1. **Database table exists**
   - [ ] Go to Supabase → Table Editor
   - [ ] See `newsletters` table

2. **Can insert data**
   - [ ] Insert a test newsletter (see above)
   - [ ] See it in the table

3. **Next.js server running**
   - [ ] Run `npm run dev` in `nextjs` folder
   - [ ] See "ready started server on 0.0.0.0:3000"

4. **API works**
   - [ ] Visit http://localhost:3000/api/newsletters
   - [ ] See JSON response (even if empty array)

5. **Frontend displays newsletters**
   - [ ] Visit http://localhost:3000/news
   - [ ] See test newsletter you inserted

6. **Modal can save to database**
   - [ ] Modal secrets configured with correct `SUPABASE_URL` and `SUPABASE_KEY`
   - [ ] Run Modal script
   - [ ] Check Supabase table for new row

---

## Still Not Working?

### Debug Steps

1. **Check Supabase table directly:**
   ```sql
   SELECT * FROM newsletters ORDER BY published_date DESC LIMIT 5;
   ```

2. **Check API endpoint (browser):**
   ```
   http://localhost:3000/api/newsletters
   ```

3. **Check browser console:**
   - Visit http://localhost:3000/news
   - Press F12
   - Look for errors in Console tab
   - Look for failed requests in Network tab

4. **Check Next.js terminal:**
   - Look for errors when visiting `/news` or `/api/newsletters`

---

## Summary: Most Common Issue

**The #1 reason the website doesn't update:**

🚨 **Next.js dev server isn't running!**

**Solution:**
```bash
cd nextjs
npm run dev
```

Then visit http://localhost:3000/news

The page will automatically fetch newsletters from Supabase via the API!

---

## Need Help?

1. Check if table exists: Supabase → Table Editor → `newsletters`
2. Check if server is running: http://localhost:3000
3. Check if API works: http://localhost:3000/api/newsletters
4. Check if data exists: Insert test newsletter manually

If all these work, the newsletter system is working correctly! 🎉
