# Stripe Integration Setup Guide

This guide covers how to set up and test Stripe subscription payments for Aviera Premium.

## Environment Variables

The following environment variables are required in `.env.local`:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...  # For production webhooks
```

## Testing Payments

### Test Card Numbers

Use these test card numbers in Stripe Checkout:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

**Test Card Details:**
- Expiry: Any future date (e.g., `12/34`)
- CVC: Any 3 digits (e.g., `123`)
- ZIP: Any 5 digits (e.g., `12345`)

### Testing Flow

1. **Start Checkout:**
   - Go to `/dashboard`
   - Click "Upgrade to Premium" button
   - You'll be redirected to Stripe Checkout

2. **Complete Payment:**
   - Enter test card: `4242 4242 4242 4242`
   - Fill in any future expiry date and CVC
   - Click "Subscribe"

3. **Success Redirect:**
   - After successful payment, you'll be redirected to `/dashboard?success=true`
   - A success message will appear
   - The message auto-dismisses after 5 seconds

4. **Cancel Flow:**
   - Click "Cancel" in Stripe Checkout
   - You'll be redirected to `/dashboard?canceled=true`
   - A cancel message will appear

## Webhook Setup

### Local Development (Using Stripe CLI)

1. **Install Stripe CLI:**
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe

   # Windows (using Scoop)
   scoop install stripe
   ```

2. **Login to Stripe:**
   ```bash
   stripe login
   ```

3. **Forward Webhooks to Local Server:**
   ```bash
   stripe listen --forward-to localhost:3001/api/webhooks/stripe
   ```

4. **Copy Webhook Secret:**
   - The CLI will output a webhook signing secret (starts with `whsec_`)
   - Add it to `.env.local` as `STRIPE_WEBHOOK_SECRET`

### Production Webhook Setup

1. **Go to Stripe Dashboard:**
   - Navigate to: https://dashboard.stripe.com/webhooks

2. **Add Endpoint:**
   - Click "Add endpoint"
   - Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
   - Select events to listen for:
     - `checkout.session.completed`
     - `customer.subscription.deleted`
     - `customer.subscription.updated`

3. **Copy Webhook Secret:**
   - After creating the endpoint, click on it
   - Copy the "Signing secret" (starts with `whsec_`)
   - Add it to your production environment variables as `STRIPE_WEBHOOK_SECRET`

## API Routes

### 1. Create Checkout Session
**Endpoint:** `POST /api/stripe/create-checkout-session`

**Description:** Creates a Stripe Checkout session for subscription payment.

**Response:**
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/..."
}
```

### 2. Create Portal Session
**Endpoint:** `POST /api/stripe/create-portal-session`

**Description:** Creates a Stripe Billing Portal session for managing subscriptions.

**Request Body:**
```json
{
  "customerId": "cus_..."
}
```

**Response:**
```json
{
  "url": "https://billing.stripe.com/..."
}
```

### 3. Webhook Handler
**Endpoint:** `POST /api/webhooks/stripe`

**Description:** Handles Stripe webhook events.

**Events Handled:**
- `checkout.session.completed` - When a subscription is created
- `customer.subscription.deleted` - When a subscription is canceled
- `customer.subscription.updated` - When a subscription is updated

**Note:** Currently logs events. TODO: Connect to Supabase to update user premium status.

## Product Configuration

**Product:** Aviera Premium
**Price:** $9.99/month
**Billing:** Recurring monthly subscription
**Currency:** USD

## Integration Status

✅ **Completed:**
- Stripe Checkout integration
- Billing Portal integration
- Webhook handler (logging only)
- UI components (upgrade button, success/cancel messages)
- Dashboard premium status display

⚠️ **TODO:**
- Connect webhook to Supabase to update user premium status
- Store Stripe customer ID in Supabase user record
- Fetch premium status from Supabase in dashboard
- Update premium status check to use real data instead of mock

## Troubleshooting

### Checkout Not Loading
- Verify `STRIPE_SECRET_KEY` is set in `.env.local`
- Check browser console for errors
- Verify API route is accessible: `http://localhost:3001/api/stripe/create-checkout-session`

### Webhook Not Receiving Events
- Verify `STRIPE_WEBHOOK_SECRET` is set correctly
- Check webhook endpoint URL is correct
- Use Stripe CLI for local testing: `stripe listen --forward-to localhost:3001/api/webhooks/stripe`
- Check Stripe Dashboard → Webhooks → Events for delivery status

### Payment Succeeds But Status Not Updated
- Webhook handler currently only logs events
- Need to implement Supabase update logic in webhook handler
- Check webhook logs in Stripe Dashboard

## Next Steps

1. **Connect to Supabase:**
   - Update webhook handler to save subscription data to Supabase
   - Store `customer_id` and `subscription_id` in `users` table
   - Update `premium_status` based on subscription status

2. **Fetch Premium Status:**
   - Update dashboard to fetch premium status from Supabase
   - Replace mock `userIsPremium = false` with real data

3. **Billing Portal:**
   - Get `customer_id` from Supabase user record
   - Pass it to billing portal API route

4. **Testing:**
   - Test full subscription flow end-to-end
   - Test cancellation flow
   - Test subscription updates

