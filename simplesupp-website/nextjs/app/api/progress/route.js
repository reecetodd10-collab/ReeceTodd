import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createSupabaseAdmin, getOrCreateUser } from '@/lib/supabase';

// POST - Save a progress log
export async function POST(request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { log_type, log_data } = await request.json();

    if (!log_type || !log_data) {
      return NextResponse.json(
        { error: 'log_type and log_data are required' },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdmin();
    
    // Ensure user exists
    const user = await getOrCreateUser(userId, null);
    
    const { data, error } = await supabase
      .from('progress_logs')
      .insert({
        user_id: user.id,
        log_type,
        log_data,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ log: data }, { status: 201 });
  } catch (error) {
    console.error('Error saving progress log:', error);
    return NextResponse.json(
      { error: 'Failed to save progress log', details: error.message },
      { status: 500 }
    );
  }
}

// GET - Fetch user's progress logs (optional - filter by type)
export async function GET(request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const logType = searchParams.get('type');

    const supabase = createSupabaseAdmin();
    
    // Ensure user exists
    const user = await getOrCreateUser(userId, null);
    
    let query = supabase
      .from('progress_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (logType) {
      query = query.eq('log_type', logType);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({ logs: data || [] }, { status: 200 });
  } catch (error) {
    console.error('Error fetching progress logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress logs', details: error.message },
      { status: 500 }
    );
  }
}

