import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request) {
  try {
    // Create Supabase client with anon key (read-only access is fine)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        auth: {
          persistSession: false,
        },
      }
    );

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')) : null;
    const latest = searchParams.get('latest') === 'true';

    // Build query
    let query = supabase
      .from('newsletters')
      .select('*')
      .order('published_date', { ascending: false });

    // If latest flag is set, get only the most recent one
    if (latest) {
      query = query.limit(1);
    } else if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch newsletters' },
        { status: 500 }
      );
    }

    // If latest flag is set, return single object instead of array
    if (latest) {
      return NextResponse.json(
        { newsletter: data[0] || null },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { newsletters: data },
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
