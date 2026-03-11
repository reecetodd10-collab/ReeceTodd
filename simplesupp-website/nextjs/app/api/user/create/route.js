import { NextResponse } from 'next/server';
import { getAuthUser } from '../../../lib/supabase-server';
import { createSupabaseAdmin } from '@/lib/supabase';

export async function POST(request) {
  try {
    const authUser = await getAuthUser(request);
    const userId = authUser?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createSupabaseAdmin();

    // Check if user already exists by auth_user_id
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('auth_user_id', userId)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists', user: existingUser },
        { status: 200 }
      );
    }

    // Get email from auth user or request body
    let email = authUser.email;
    if (!email) {
      try {
        const body = await request.json();
        email = body.email;
      } catch {
        // body might be empty
      }
    }

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Create user record
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        auth_user_id: userId,
        email: email,
        premium_status: false,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ user: newUser }, { status: 200 });
  } catch (error) {
    console.error('POST /api/user/create error:', error);
    return NextResponse.json(
      { error: 'Failed to create user', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const authUser = await getAuthUser(request);
    const userId = authUser?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createSupabaseAdmin();

    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('auth_user_id', userId)
      .single();

    if (!existingUser) {
      return NextResponse.json({ exists: false }, { status: 200 });
    }

    return NextResponse.json({ exists: true, user: existingUser }, { status: 200 });
  } catch (error) {
    console.error('GET /api/user/create error:', error);
    return NextResponse.json(
      { error: 'Failed to check user', details: error.message },
      { status: 500 }
    );
  }
}
