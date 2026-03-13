import { NextResponse } from 'next/server';
import { getAuthUser } from '../../lib/supabase-server';
import { createSupabaseAdmin } from '@/lib/supabase';

// POST: Save a new optimization result
export async function POST(request) {
    try {
        const user = await getAuthUser(request);
        const userId = user?.id;
        const body = await request.json();

        const {
            email,
            primary_goal,
            optimization_score,
            primary_bottleneck,
            inputs,
            scores,
            recommended_products,
        } = body;

        const supabase = createSupabaseAdmin();

        const { data, error } = await supabase
            .from('supplement_optimization_results')
            .insert({
                auth_user_id: userId || null,
                email: email || null,
                primary_goal,
                optimization_score,
                primary_bottleneck,
                inputs,
                scores,
                recommended_products,
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        return NextResponse.json({ id: data.id }, { status: 201 });
    } catch (error) {
        console.error('Error saving optimization result:', error);
        return NextResponse.json(
            { error: 'Failed to save result', details: error.message },
            { status: 500 }
        );
    }
}

// GET: Fetch results history for the authenticated user
export async function GET(request) {
    try {
        const user = await getAuthUser(request);
        const userId = user?.id;
        const userEmail = user?.email;
        const { searchParams } = new URL(request.url);
        const history = searchParams.get('history');

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const supabase = createSupabaseAdmin();
        const limit = history === 'true' ? 10 : 100;

        // Query by auth_user_id first
        let { data, error } = await supabase
            .from('supplement_optimization_results')
            .select('*')
            .eq('auth_user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;

        // If no results found by auth_user_id, try by email
        // (handles quizzes taken before sign-in)
        if ((!data || data.length === 0) && userEmail) {
            const { data: emailData, error: emailError } = await supabase
                .from('supplement_optimization_results')
                .select('*')
                .eq('email', userEmail)
                .is('auth_user_id', null)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (!emailError && emailData && emailData.length > 0) {
                data = emailData;
                // Claim these results by updating auth_user_id
                const ids = emailData.map(r => r.id);
                await supabase
                    .from('supplement_optimization_results')
                    .update({ auth_user_id: userId })
                    .in('id', ids);
            }
        }

        return NextResponse.json({ results: data || [] }, { status: 200 });
    } catch (error) {
        console.error('Error fetching optimization history:', error);
        return NextResponse.json(
            { error: 'Failed to fetch history', details: error.message },
            { status: 500 }
        );
    }
}

// PATCH: Update added_to_cart or purchased by result_id
export async function PATCH(request) {
    try {
        const body = await request.json();
        const { id, added_to_cart, purchased } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'Result ID is required' },
                { status: 400 }
            );
        }

        const supabase = createSupabaseAdmin();

        const updateData = {};
        if (added_to_cart !== undefined) updateData.added_to_cart = added_to_cart;
        if (purchased !== undefined) updateData.purchased = purchased;

        const { data, error } = await supabase
            .from('supplement_optimization_results')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return NextResponse.json({ success: true, result: data }, { status: 200 });
    } catch (error) {
        console.error('Error updating optimization result:', error);
        return NextResponse.json(
            { error: 'Failed to update result', details: error.message },
            { status: 500 }
        );
    }
}
