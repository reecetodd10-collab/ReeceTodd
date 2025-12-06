import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    // Parse request body
    const body = await request.json();
    const email = body.email;

    // Log for debugging
    console.log('Received email:', email);

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

    // Insert email into waitlist table
    const { data, error } = await supabase
      .from('waitlist')
      .insert([{ email: email.trim().toLowerCase() }])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      
      // Handle duplicate email
      if (error.code === '23505') {
        return NextResponse.json(
          { message: 'You are already on the waitlist!' },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to add email to waitlist' },
        { status: 500 }
      );
    }

    console.log('Email added successfully:', data);

    return NextResponse.json(
      { message: 'Successfully added to waitlist!' },
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
