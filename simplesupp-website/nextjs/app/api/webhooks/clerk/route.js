import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { createUser, getUserByClerkId } from '@/lib/supabase';

export async function POST(request) {
  try {
    // Get the Svix headers for verification
    const headerPayload = headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return NextResponse.json(
        { error: 'Error occurred -- no svix headers' },
        { status: 400 }
      );
    }

    // Get the body
    const payload = await request.json();
    const body = JSON.stringify(payload);

    // Get the webhook secret from environment variables
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      console.error('CLERK_WEBHOOK_SECRET is not set');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // Create a new Svix instance with your webhook secret
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt;

    // Verify the webhook
    try {
      evt = wh.verify(body, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      });
    } catch (err) {
      console.error('Error verifying webhook:', err);
      return NextResponse.json(
        { error: 'Error occurred -- webhook verification failed' },
        { status: 400 }
      );
    }

    // Handle the webhook
    const eventType = evt.type;

    if (eventType === 'user.created') {
      const { id, email_addresses } = evt.data;
      
      // Get the primary email address
      const primaryEmail = email_addresses?.find(email => email.id === evt.data.primary_email_address_id)?.email_address 
        || email_addresses?.[0]?.email_address;

      if (!primaryEmail) {
        console.error('No email address found for user:', id);
        return NextResponse.json(
          { error: 'No email address found' },
          { status: 400 }
        );
      }

      // Check if user already exists (idempotent)
      const existingUser = await getUserByClerkId(id);
      
      if (existingUser) {
        console.log('User already exists in Supabase:', id);
        return NextResponse.json(
          { message: 'User already exists', user: existingUser },
          { status: 200 }
        );
      }

      // Create user in Supabase
      try {
        const user = await createUser(id, primaryEmail);
        console.log('User created in Supabase:', user.id);
        
        return NextResponse.json(
          { message: 'User created successfully', user },
          { status: 201 }
        );
      } catch (error) {
        console.error('Error creating user in Supabase:', error);
        return NextResponse.json(
          { error: 'Failed to create user in Supabase', details: error.message },
          { status: 500 }
        );
      }
    }

    // Return a response for other event types
    return NextResponse.json(
      { message: `Event ${eventType} received, no action taken` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

