import { NextResponse } from 'next/server';
import { getAuthUser } from '../../lib/supabase-server';
import { createSupabaseAdmin, getOrCreateUser, recordPurchase } from '@/lib/supabase';

// POST - Record a purchase
export async function POST(request) {
  try {
    const authUser = await getAuthUser(request);
    const userId = authUser?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { product_name, shopify_product_id, shopify_variant_id, quantity } = await request.json();

    if (!product_name) {
      return NextResponse.json(
        { error: 'product_name is required' },
        { status: 400 }
      );
    }

    const dbUser = await getOrCreateUser(userId, authUser.email);
    const purchase = await recordPurchase(
      dbUser.id,
      product_name,
      shopify_product_id || null,
      shopify_variant_id || null,
      quantity || 1
    );

    return NextResponse.json({ purchase }, { status: 201 });
  } catch (error) {
    console.error('Error recording purchase:', error);
    return NextResponse.json(
      { error: 'Failed to record purchase', details: error.message },
      { status: 500 }
    );
  }
}

// GET - Fetch user's purchase history
export async function GET(request) {
  try {
    const authUser = await getAuthUser(request);
    const userId = authUser?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await getOrCreateUser(userId, authUser.email);
    const supabase = createSupabaseAdmin();

    const { data, error } = await supabase
      .from('purchase_history')
      .select('*')
      .eq('user_id', dbUser.id)
      .order('purchased_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ purchases: data || [] }, { status: 200 });
  } catch (error) {
    console.error('Error fetching purchases:', error);
    return NextResponse.json(
      { error: 'Failed to fetch purchases', details: error.message },
      { status: 500 }
    );
  }
}
