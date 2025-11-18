# Supabase Database Setup Guide

## ✅ Completed Setup

1. **Environment Variables** - Added to `.env.local`
2. **Supabase Package** - `@supabase/supabase-js` installed
3. **Supabase Client** - Created at `lib/supabase.js`
4. **Database Schema** - SQL migration file created
5. **API Routes** - All endpoints created
6. **Helper Utilities** - Database functions ready

## 📋 Next Steps: Run SQL Migration

### Step 1: Access Supabase Dashboard

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Select your project: **ewmgyjsluooklflttea**

### Step 2: Open SQL Editor

1. In the left sidebar, click **"SQL Editor"**
2. Click **"New query"** button

### Step 3: Run Migration

1. Open the file: `supabase/migrations/001_initial_schema.sql`
2. Copy the **entire contents** of the file
3. Paste it into the SQL Editor in Supabase dashboard
4. Click **"Run"** button (or press `Ctrl+Enter`)

### Step 4: Verify Tables Were Created

1. In the left sidebar, click **"Table Editor"**
2. You should see these tables:
   - ✅ `users`
   - ✅ `supplement_stacks`
   - ✅ `workout_plans`
   - ✅ `progress_logs`

### Step 5: Verify RLS Policies

1. Click on any table (e.g., `users`)
2. Click the **"Policies"** tab
3. You should see RLS policies listed:
   - Users can view own data
   - Users can update own data
   - (Similar policies for other tables)

## 🧪 Testing the Connection

### Test 1: Verify Environment Variables

```bash
# In your terminal, from the nextjs folder:
npm run dev
```

Check the console for any Supabase connection errors.

### Test 2: Test User Creation API

After signing up with Clerk, the user should be automatically created in Supabase via the API route.

You can test manually:

```bash
# Make sure you're signed in first, then:
curl -X POST http://localhost:3001/api/user/create \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

### Test 3: Verify Database Connection

Create a test file `test-supabase.js` in the root:

```javascript
import { createSupabaseClient } from './lib/supabase.js';

const supabase = createSupabaseClient();
const { data, error } = await supabase.from('users').select('count');

console.log('Connection test:', error ? 'Failed' : 'Success');
```

## 📊 Database Schema Overview

### `users` Table
- Stores user accounts linked to Clerk
- Fields: `id`, `clerk_user_id`, `email`, `premium_status`, `subscription_id`, `created_at`

### `supplement_stacks` Table
- Stores user's supplement stacks
- Fields: `id`, `user_id`, `name`, `supplements` (JSONB), `created_at`

### `workout_plans` Table
- Stores user's workout plans
- Fields: `id`, `user_id`, `name`, `plan_data` (JSONB), `created_at`

### `progress_logs` Table
- Stores user's progress tracking data
- Fields: `id`, `user_id`, `log_type`, `log_data` (JSONB), `created_at`

## 🔒 Row Level Security (RLS)

All tables have RLS enabled with policies that ensure:
- Users can only access their own data
- Data is automatically filtered by `user_id`
- Secure by default - no data leakage between users

## 🛠️ API Endpoints

### User Management
- `POST /api/user/create` - Create user in Supabase (called after Clerk signup)

### Supplement Stacks
- `GET /api/stacks` - Get all user's stacks
- `POST /api/stacks` - Save a new stack

### Workout Plans
- `GET /api/workouts` - Get all user's workout plans
- `POST /api/workouts` - Save a new workout plan

### Progress Logs
- `GET /api/progress` - Get user's progress logs (optional `?type=...` filter)
- `POST /api/progress` - Save a progress log

## 🔧 Helper Functions

Located in `lib/supabase.js`:

- `createSupabaseClient()` - Client-side Supabase client
- `createSupabaseAdmin()` - Server-side admin client (service role)
- `getUserByClerkId(clerkUserId)` - Get user by Clerk ID
- `createUser(clerkUserId, email)` - Create new user
- `getOrCreateUser(clerkUserId, email)` - Get or create user (idempotent)

## ⚠️ Important Notes

1. **Service Role Key**: Keep `SUPABASE_SERVICE_ROLE_KEY` secret - never expose it to the client
2. **RLS Policies**: Currently use JWT claims. You may need to adjust based on your Clerk integration
3. **User Creation**: Users are created via API route, not directly through Supabase auth
4. **Clerk Integration**: The system uses Clerk for authentication, Supabase for data storage

## 🐛 Troubleshooting

### Issue: "Missing Supabase environment variables"
- **Fix**: Ensure `.env.local` has all three Supabase keys
- **Location**: `nextjs/.env.local`

### Issue: "RLS policy violation"
- **Fix**: Check that the user exists in the `users` table first
- **Fix**: Verify Clerk user ID matches `clerk_user_id` in database

### Issue: "Table doesn't exist"
- **Fix**: Run the SQL migration in Supabase dashboard
- **Fix**: Check that migration completed without errors

### Issue: "Connection refused"
- **Fix**: Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- **Fix**: Check Supabase project is active in dashboard

## 📝 Next Steps After Setup

1. ✅ Run SQL migration in Supabase dashboard
2. ✅ Verify tables and policies are created
3. ✅ Test API endpoints
4. ✅ Integrate API calls into your app components
5. ✅ Set up automatic user creation on Clerk signup

## 🔗 Useful Links

- [Supabase Dashboard](https://supabase.com/dashboard)
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)

