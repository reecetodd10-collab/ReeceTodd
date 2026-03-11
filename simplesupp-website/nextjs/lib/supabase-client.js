'use client';

import { createClient } from '@supabase/supabase-js';

/**
 * Client-side Supabase client (runs in browser)
 * Uses anon key - RLS policies handle security
 */
export function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

/**
 * Get user by Supabase auth user ID (client-side)
 */
export async function getUserByAuthId(authUserId) {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('auth_user_id', authUserId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data;
}
