import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createSupabaseAdmin, getOrCreateUser } from '@/lib/supabase';

// GET - Fetch user's workout plans
export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = createSupabaseAdmin();
    
    // Ensure user exists
    const user = await getOrCreateUser(userId, null);
    
    const { data, error } = await supabase
      .from('workout_plans')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ workouts: data || [] }, { status: 200 });
  } catch (error) {
    console.error('Error fetching workouts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workouts', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Save a new workout plan
export async function POST(request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { name, plan_data } = await request.json();

    if (!name || !plan_data) {
      return NextResponse.json(
        { error: 'Name and plan_data are required' },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdmin();
    
    // Ensure user exists
    const user = await getOrCreateUser(userId, null);
    
    const { data, error } = await supabase
      .from('workout_plans')
      .insert({
        user_id: user.id,
        name,
        plan_data,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ workout: data }, { status: 201 });
  } catch (error) {
    console.error('Error saving workout:', error);
    return NextResponse.json(
      { error: 'Failed to save workout', details: error.message },
      { status: 500 }
    );
  }
}

