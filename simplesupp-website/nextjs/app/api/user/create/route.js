import { NextResponse } from 'next/server';
import { getAuthUser } from '../../../lib/supabase-server';
import { createSupabaseAdmin } from '@/lib/supabase';

export async function POST(request) {
  try {
    console.log('POST /api/user/create - Starting...');

    const user = await getAuthUser(request);
    const userId = user?.id;

    if (!userId) {
      console.log('POST /api/user/create - No userId found');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('POST /api/user/create - UserId:', userId);

    const supabase = createSupabaseAdmin();

    // Check if user already exists in our users table
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (existingUser) {
      console.log('POST /api/user/create - User already exists');
      return NextResponse.json(
        { message: 'User already exists', user: existingUser },
        { status: 200 }
      );
    }

    // Get email from the authenticated user or request body
    let email = user.email;
    if (!email) {
      try {
        const body = await request.json();
        email = body.email;
      } catch {
        // Request body might be empty, that's okay
      }
    }

    if (!email) {
      console.error('POST /api/user/create - No email available');
      return NextResponse.json(
        { error: 'Email is required. Please ensure your account has an email address.' },
        { status: 400 }
      );
    }

    // Create user in our users table
    console.log('POST /api/user/create - Creating user in Supabase...');
    const { data: newUser, error } = await supabase
      .from('users')
      .upsert({
        id: userId,
        email: email,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    console.log('POST /api/user/create - User created successfully:', newUser.id);

    return NextResponse.json({ user: newUser }, { status: 200 });
  } catch (error) {
    console.error('POST /api/user/create - Error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    return NextResponse.json(
      {
        error: 'Failed to create user',
        details: error.message,
        type: error.constructor.name,
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check if user exists
export async function GET(request) {
  try {
    console.log('GET /api/user/create - Checking user...');

    const user = await getAuthUser(request);
    const userId = user?.id;

    if (!userId) {
      console.log('GET /api/user/create - No userId found');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('GET /api/user/create - UserId:', userId);

    const supabase = createSupabaseAdmin();

    try {
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      console.log('GET /api/user/create - User lookup result:', existingUser ? 'found' : 'not found');

      if (!existingUser) {
        return NextResponse.json(
          { exists: false },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { exists: true, user: existingUser },
        { status: 200 }
      );
    } catch (supabaseError) {
      console.error('GET /api/user/create - Supabase error:', supabaseError);
      console.error('Error details:', {
        message: supabaseError.message,
        code: supabaseError.code,
        details: supabaseError.details,
        hint: supabaseError.hint,
      });
      throw supabaseError;
    }
  } catch (error) {
    console.error('GET /api/user/create - Error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      {
        error: 'Failed to check user',
        details: error.message,
        type: error.constructor.name,
      },
      { status: 500 }
    );
  }
}
