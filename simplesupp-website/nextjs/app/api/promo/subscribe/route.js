import { NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase';

// Fixed Shopify discount code — matches the code created in Shopify Admin
const DISCOUNT_CODE = 'AVIERA10';

export async function POST(request) {
  try {
    const { email, source = 'promo_banner' } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdmin();

    // Try to insert the email
    const { data, error } = await supabase
      .from('promo_subscribers')
      .insert({
        email: email.toLowerCase().trim(),
        source,
        discount_code: DISCOUNT_CODE,
      })
      .select()
      .single();

    if (error) {
      // Check if email already exists
      if (error.code === '23505') {
        // Unique constraint violation - email exists
        // Fetch existing discount code
        const { data: existing } = await supabase
          .from('promo_subscribers')
          .select('discount_code')
          .eq('email', email.toLowerCase().trim())
          .single();

        return NextResponse.json({
          success: true,
          message: 'You\'re already subscribed!',
          discountCode: DISCOUNT_CODE,
          alreadySubscribed: true,
        });
      }

      console.error('Error saving promo subscriber:', error);
      return NextResponse.json(
        { error: 'Failed to subscribe' },
        { status: 500 }
      );
    }

    console.log('Promo subscriber added:', email);

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed!',
      discountCode: DISCOUNT_CODE,
    });
  } catch (error) {
    console.error('Promo subscribe error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
