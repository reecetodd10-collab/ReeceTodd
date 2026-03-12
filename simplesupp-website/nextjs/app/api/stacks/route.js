import { NextResponse } from 'next/server';
import { getAuthUser } from '../../lib/supabase-server';
import { createSupabaseAdmin, getOrCreateUser } from '@/lib/supabase';

// GET - Fetch user's supplement stacks
export async function GET(request) {
  try {
    const authUser = await getAuthUser(request);
    const userId = authUser?.id;

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = createSupabaseAdmin();

    // Ensure user exists
    const dbUser = await getOrCreateUser(userId, null);

    const { data, error } = await supabase
      .from('supplement_stacks')
      .select('*')
      .eq('user_id', dbUser.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ stacks: data || [] }, { status: 200 });
  } catch (error) {
    console.error('Error fetching stacks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stacks', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Save a new supplement stack
export async function POST(request) {
  try {
    const authUser = await getAuthUser(request);
    const userId = authUser?.id;

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { name, supplements } = await request.json();

    if (!name || !supplements) {
      return NextResponse.json(
        { error: 'Name and supplements are required' },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdmin();

    // Ensure user exists
    const dbUser = await getOrCreateUser(userId, null);

    const { data, error } = await supabase
      .from('supplement_stacks')
      .insert({
        user_id: dbUser.id,
        name,
        supplements,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ stack: data }, { status: 201 });
  } catch (error) {
    console.error('Error saving stack:', error);
    return NextResponse.json(
      { error: 'Failed to save stack', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update an existing supplement stack
export async function PUT(request) {
  try {
    const authUser = await getAuthUser(request);
    const userId = authUser?.id;

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { stackId, name, supplements } = await request.json();

    if (!stackId) {
      return NextResponse.json(
        { error: 'stackId is required' },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdmin();

    // Ensure user exists
    const dbUser = await getOrCreateUser(userId, null);

    // Build update payload (only include provided fields)
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (supplements !== undefined) updates.supplements = supplements;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('supplement_stacks')
      .update(updates)
      .eq('id', stackId)
      .eq('user_id', dbUser.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Stack not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ stack: data }, { status: 200 });
  } catch (error) {
    console.error('Error updating stack:', error);
    return NextResponse.json(
      { error: 'Failed to update stack', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete a supplement stack
export async function DELETE(request) {
  try {
    const authUser = await getAuthUser(request);
    const userId = authUser?.id;

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { stackId } = await request.json();

    if (!stackId) {
      return NextResponse.json(
        { error: 'stackId is required' },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdmin();

    // Ensure user exists
    const dbUser = await getOrCreateUser(userId, null);

    const { error, count } = await supabase
      .from('supplement_stacks')
      .delete({ count: 'exact' })
      .eq('id', stackId)
      .eq('user_id', dbUser.id);

    if (error) {
      throw error;
    }

    if (count === 0) {
      return NextResponse.json(
        { error: 'Stack not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting stack:', error);
    return NextResponse.json(
      { error: 'Failed to delete stack', details: error.message },
      { status: 500 }
    );
  }
}

