import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    // Parse request body
    const body = await request.json();
    const email = body.email;
    const { sub_supplements, sub_fitness, sub_fitness_socials } = body;

    // Log for debugging
    console.log('Received newsletter subscription email:', email);

    // Validate email exists
    if (!email || typeof email !== 'string' || !email.trim()) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Create Supabase client with service role key
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          persistSession: false,
        },
      }
    );

    // Build subscriber record with optional category preferences
    const subscriberData = { email: email.trim().toLowerCase() };

    // Only include category preferences if explicitly provided (booleans)
    if (typeof sub_supplements === 'boolean') subscriberData.sub_supplements = sub_supplements;
    if (typeof sub_fitness === 'boolean') subscriberData.sub_fitness = sub_fitness;
    if (typeof sub_fitness_socials === 'boolean') subscriberData.sub_fitness_socials = sub_fitness_socials;

    // Insert email into newsletter_subscribers table
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([subscriberData])
      .select();

    if (error) {
      console.error('Supabase error:', error);

      // Handle duplicate email - update category preferences if provided
      if (error.code === '23505') {
        const hasPreferences = typeof sub_supplements === 'boolean' ||
          typeof sub_fitness === 'boolean' ||
          typeof sub_fitness_socials === 'boolean';

        if (hasPreferences) {
          const updateData = {};
          if (typeof sub_supplements === 'boolean') updateData.sub_supplements = sub_supplements;
          if (typeof sub_fitness === 'boolean') updateData.sub_fitness = sub_fitness;
          if (typeof sub_fitness_socials === 'boolean') updateData.sub_fitness_socials = sub_fitness_socials;

          const { error: updateError } = await supabase
            .from('newsletter_subscribers')
            .update(updateData)
            .eq('email', email.trim().toLowerCase());

          if (updateError) {
            console.error('Failed to update preferences:', updateError);
            return NextResponse.json(
              { error: 'Failed to update subscription preferences' },
              { status: 500 }
            );
          }

          return NextResponse.json(
            { message: 'Subscription preferences updated!' },
            { status: 200 }
          );
        }

        return NextResponse.json(
          { message: 'You are already subscribed to our newsletter!' },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to subscribe to newsletter' },
        { status: 500 }
      );
    }

    console.log('Newsletter subscription successful:', data);

    return NextResponse.json(
      { message: 'Successfully subscribed to newsletter!' },
      { status: 200 }
    );

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
