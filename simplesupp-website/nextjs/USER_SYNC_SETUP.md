# User Sync Setup: Clerk ↔ Supabase

## ✅ Completed Setup

1. **Clerk Webhook Handler** - Created at `/api/webhooks/clerk`
2. **Manual User Creation** - Updated `/api/user/create` route
3. **Dashboard User Check** - Added automatic sync on dashboard load
4. **Package Installation** - `svix` installed for webhook verification

## 🔧 Configuration Required

### Step 1: Get Clerk Webhook Secret

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Navigate to **Webhooks** in the sidebar
4. Click **"Add Endpoint"**
5. Enter your webhook URL:
   ```
   https://your-domain.com/api/webhooks/clerk
   ```
   (For local testing, use a tool like [ngrok](https://ngrok.com) or [Clerk's webhook testing](https://clerk.com/docs/integrations/webhooks/overview))

6. Select the event: **`user.created`**
7. Copy the **Signing Secret** (starts with `whsec_...`)

### Step 2: Add Webhook Secret to Environment

Add to your `.env.local` file:

```env
CLERK_WEBHOOK_SECRET=whsec_...
```

### Step 3: Deploy or Test Locally

For local testing, you'll need to expose your local server:
- Use [ngrok](https://ngrok.com): `ngrok http 3001`
- Or use Clerk's webhook testing tools

## 📋 How It Works

### 1. Automatic Webhook Sync (Primary Method)

When a user signs up with Clerk:
1. Clerk sends `user.created` webhook to `/api/webhooks/clerk`
2. Webhook handler verifies the signature
3. Extracts `clerk_user_id` and `email` from webhook payload
4. Creates user record in Supabase `users` table
5. Sets `premium_status` to `false` by default

### 2. Manual User Creation (Fallback)

The `/api/user/create` endpoint:
- **GET**: Checks if user exists in Supabase
- **POST**: Creates user if they don't exist
- Automatically fetches email from Clerk if not provided
- Idempotent - safe to call multiple times

### 3. Dashboard Auto-Sync

When user visits dashboard:
1. Checks if user exists in Supabase
2. If not, automatically calls `/api/user/create`
3. Ensures all signed-in users have Supabase records

## 🧪 Testing

### Test 1: Manual User Creation

```bash
# Make sure you're signed in, then:
curl -X POST http://localhost:3001/api/user/create \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

Expected response:
```json
{
  "user": {
    "id": "...",
    "clerk_user_id": "...",
    "email": "test@example.com",
    "premium_status": false
  }
}
```

### Test 2: Check User Exists

```bash
curl http://localhost:3001/api/user/create
```

Expected response:
```json
{
  "exists": true,
  "user": { ... }
}
```

### Test 3: Dashboard Auto-Sync

1. Sign in to your app
2. Navigate to `/dashboard`
3. Open browser console
4. Look for: `"User synced with Supabase"` message
5. Check Supabase dashboard to verify user was created

### Test 4: Webhook (Production/ngrok)

1. Set up ngrok: `ngrok http 3001`
2. Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)
3. Add webhook endpoint in Clerk: `https://abc123.ngrok.io/api/webhooks/clerk`
4. Sign up a new user
5. Check Supabase dashboard - user should appear automatically

## 🔍 Verification

### Check Supabase Users Table

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Table Editor** → `users` table
4. Verify new users appear with:
   - `clerk_user_id` matching Clerk user ID
   - `email` from Clerk account
   - `premium_status` = `false`
   - `created_at` timestamp

### Check Webhook Logs

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Navigate to **Webhooks**
3. Click on your webhook endpoint
4. View **Delivery Logs** to see webhook events

## 🐛 Troubleshooting

### Issue: "CLERK_WEBHOOK_SECRET is not set"

**Fix**: Add `CLERK_WEBHOOK_SECRET` to `.env.local`

### Issue: "Error verifying webhook"

**Fix**: 
- Verify webhook secret matches Clerk dashboard
- Check that webhook URL is correct
- Ensure request headers include `svix-id`, `svix-timestamp`, `svix-signature`

### Issue: "User not created in Supabase"

**Fix**:
- Check Supabase connection (verify env vars)
- Check webhook logs in Clerk dashboard
- Verify SQL migration was run
- Check server logs for errors

### Issue: "Email is required" error

**Fix**:
- Ensure Clerk user has an email address
- Check that email is verified in Clerk
- Provide email in request body if calling API directly

## 📝 API Endpoints

### `POST /api/user/create`
Creates user in Supabase if they don't exist.

**Request:**
```json
{
  "email": "user@example.com"  // Optional - will fetch from Clerk if not provided
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "clerk_user_id": "user_...",
    "email": "user@example.com",
    "premium_status": false,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### `GET /api/user/create`
Checks if user exists in Supabase.

**Response:**
```json
{
  "exists": true,
  "user": { ... }
}
```

### `POST /api/webhooks/clerk`
Clerk webhook endpoint (handled automatically).

## 🔒 Security Notes

1. **Webhook Verification**: All webhooks are verified using Svix signatures
2. **Authentication**: All API routes require Clerk authentication
3. **Idempotency**: User creation is idempotent - safe to call multiple times
4. **Error Handling**: Errors are logged but don't expose sensitive information

## ✅ Checklist

- [ ] Clerk webhook endpoint configured
- [ ] `CLERK_WEBHOOK_SECRET` added to `.env.local`
- [ ] Tested manual user creation
- [ ] Tested dashboard auto-sync
- [ ] Verified users appear in Supabase
- [ ] Tested webhook (if using ngrok or deployed)

## 🚀 Next Steps

After user sync is working:
1. Integrate user data into dashboard components
2. Add premium status checks
3. Set up subscription webhooks (if using payments)
4. Add user profile management

