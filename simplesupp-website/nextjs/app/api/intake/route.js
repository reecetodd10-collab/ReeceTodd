import { NextResponse } from 'next/server';
import { getAuthUser } from '../../lib/supabase-server';
import { createSupabaseAdmin, getOrCreateUser, logIntake } from '@/lib/supabase';

// POST - Log a supplement intake
export async function POST(request) {
  try {
    const authUser = await getAuthUser(request);
    const userId = authUser?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { supplement_name, notes } = await request.json();

    if (!supplement_name) {
      return NextResponse.json(
        { error: 'supplement_name is required' },
        { status: 400 }
      );
    }

    const dbUser = await getOrCreateUser(userId, authUser.email);
    const result = await logIntake(dbUser.id, supplement_name, notes);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error logging intake:', error);
    return NextResponse.json(
      { error: 'Failed to log intake', details: error.message },
      { status: 500 }
    );
  }
}

// GET - Fetch user's intake logs + streak info
export async function GET(request) {
  try {
    const authUser = await getAuthUser(request);
    const userId = authUser?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30', 10);

    const dbUser = await getOrCreateUser(userId, authUser.email);
    const supabase = createSupabaseAdmin();

    const since = new Date(Date.now() - days * 86400000).toISOString();

    const { data: logs, error } = await supabase
      .from('intake_logs')
      .select('*')
      .eq('user_id', dbUser.id)
      .gte('taken_at', since)
      .order('taken_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      logs: logs || [],
      streak: dbUser.current_streak || 0,
      longest_streak: dbUser.longest_streak || 0,
      last_intake_date: dbUser.last_intake_date,
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching intake logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch intake logs', details: error.message },
      { status: 500 }
    );
  }
}
