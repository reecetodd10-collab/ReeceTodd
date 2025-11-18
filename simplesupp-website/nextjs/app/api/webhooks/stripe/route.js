import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      );
    }

    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET is not set');
      // In development, allow webhooks without secret (for testing)
      // In production, this should be required
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          { error: 'Webhook secret not configured' },
          { status: 500 }
        );
      }
    }

    let event;

    try {
      if (webhookSecret) {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      } else {
        // For development/testing without webhook secret
        event = JSON.parse(body);
        console.warn('⚠️ Webhook verification skipped (development mode)');
      }
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    // Handle the event
    console.log('Stripe webhook event received:', event.type);

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        const clerkUserId = session.metadata?.clerk_user_id;
        
        console.log('Checkout completed:', {
          sessionId: session.id,
          customerId: session.customer,
          clerkUserId: clerkUserId,
        });

        // TODO: Update user premium status in Supabase
        // await updateUserPremiumStatus(clerkUserId, true, session.customer, session.subscription);

        break;

      case 'customer.subscription.deleted':
        const subscription = event.data.object;
        
        console.log('Subscription deleted:', {
          subscriptionId: subscription.id,
          customerId: subscription.customer,
        });

        // TODO: Update user premium status in Supabase
        // await updateUserPremiumStatus(null, false, subscription.customer, null);

        break;

      case 'customer.subscription.updated':
        const updatedSubscription = event.data.object;
        
        console.log('Subscription updated:', {
          subscriptionId: updatedSubscription.id,
          status: updatedSubscription.status,
          customerId: updatedSubscription.customer,
        });

        // TODO: Update user premium status based on subscription status
        // const isActive = updatedSubscription.status === 'active';
        // await updateUserPremiumStatus(null, isActive, updatedSubscription.customer, updatedSubscription.id);

        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

