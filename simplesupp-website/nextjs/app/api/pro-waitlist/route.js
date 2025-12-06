import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  console.log('=== PRO WAITLIST API CALLED ===');
  
  try {
    // Parse request body
    const body = await request.json();
    console.log('Request body:', JSON.stringify(body, null, 2));

    const email = body.email;

    // Validate email
    if (!email || typeof email !== 'string' || !email.trim()) {
      console.error('Validation failed: No email provided');
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      console.error('Validation failed: Invalid email format');
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing Supabase environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    console.log('Creating Supabase client...');
    
    // Create Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          persistSession: false,
        },
      }
    );

    // Prepare data - only include fields that exist in the table
    const insertData = {
      email: email.trim().toLowerCase(),
    };

    // Add optional fields if they exist in the request
    if (body.profile_type) insertData.profile_type = body.profile_type;
    if (body.goal) insertData.goal = body.goal;
    if (body.challenge) insertData.challenge = body.challenge;
    if (body.past_attempts) insertData.past_attempts = body.past_attempts;
    if (body.budget) insertData.budget = body.budget;
    if (typeof body.marketing_consent === 'boolean') {
      insertData.marketing_consent = body.marketing_consent;
    }

    console.log('Inserting data:', JSON.stringify(insertData, null, 2));

    // Insert into pro_waitlist table
    const { data, error } = await supabase
      .from('pro_waitlist')
      .insert([insertData])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      
      // Handle duplicate email
      if (error.code === '23505') {
        console.log('Duplicate email detected');
        return NextResponse.json(
          { message: 'You are already on the PRO waitlist!' },
          { status: 200 }
        );
      }

      // Log the full error for debugging
      console.error('Full Supabase error:', JSON.stringify(error, null, 2));
      
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      );
    }

    console.log('PRO Waitlist - Success! Data inserted:', data);

    return NextResponse.json(
      { message: 'Successfully added to PRO waitlist!' },
      { status: 200 }
    );

  } catch (error) {
    console.error('=== PRO WAITLIST API ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json(
      { error: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}
