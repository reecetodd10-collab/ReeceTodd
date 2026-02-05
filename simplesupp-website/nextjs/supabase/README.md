# Supabase Setup for Aviera Newsletters

## Overview
This directory contains SQL migration files for your Supabase database.

## Setting Up the Newsletters Table

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project (the one with URL: `https://ewmgyjsluooktlftttea.supabase.co`)
3. Navigate to **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste the contents of `migrations/create_newsletters_table.sql`
6. Click **Run** to execute the SQL

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
cd nextjs
supabase db push
```

## Table Structure

The `newsletters` table includes:

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `title` | TEXT | Newsletter title/headline |
| `content` | TEXT | Full newsletter content (markdown/HTML) |
| `excerpt` | TEXT | Brief preview/summary |
| `published_date` | TIMESTAMP | Date when published |
| `created_at` | TIMESTAMP | When record was created |

## API Endpoints

### GET /api/newsletters

Fetch newsletters from the database.

**Query Parameters:**
- `limit` (optional) - Number of newsletters to return
- `latest=true` (optional) - Get only the most recent newsletter

**Examples:**

```javascript
// Get all newsletters (sorted by published_date, newest first)
const response = await fetch('/api/newsletters');
const { newsletters } = await response.json();

// Get latest newsletter only
const response = await fetch('/api/newsletters?latest=true');
const { newsletter } = await response.json();

// Get 5 most recent newsletters
const response = await fetch('/api/newsletters?limit=5');
const { newsletters } = await response.json();
```

**Response Format:**

```json
// Multiple newsletters
{
  "newsletters": [
    {
      "id": "uuid",
      "title": "Newsletter Title",
      "content": "Full content...",
      "excerpt": "Brief preview...",
      "published_date": "2026-01-23T12:00:00Z",
      "created_at": "2026-01-20T10:00:00Z"
    }
  ]
}

// Single newsletter (latest=true)
{
  "newsletter": {
    "id": "uuid",
    "title": "Newsletter Title",
    ...
  }
}
```

## Adding Newsletter Content

### Using Supabase Dashboard

1. Go to **Table Editor** in your Supabase dashboard
2. Select the `newsletters` table
3. Click **Insert row**
4. Fill in the fields:
   - `title`: Your newsletter title
   - `content`: Full newsletter content (can use markdown or HTML)
   - `excerpt`: A brief summary (2-3 sentences)
   - `published_date`: The date to display (format: YYYY-MM-DD HH:MM:SS)
5. Click **Save**

### Using SQL

```sql
INSERT INTO newsletters (title, content, excerpt, published_date)
VALUES (
  'The Future of AI-Powered Fitness: Weekly Insights #1',
  'Full content of your newsletter here...',
  'Our first edition features cutting-edge research on supplement efficacy...',
  '2026-01-23 09:00:00'
);
```

## Security

- **Row Level Security (RLS)** is enabled
- Public read access is allowed (anyone can fetch newsletters)
- Write access requires service role authentication (protected API endpoints only)

## Next Steps

After creating the table:
1. Add your first newsletter using the Supabase dashboard
2. Update the newsletter page to fetch real data from the API
3. The page will automatically display your published newsletters
