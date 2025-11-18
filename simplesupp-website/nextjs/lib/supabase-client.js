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
    console.error('Missing Supabase environment variables');
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

/**
 * Get user by Clerk user ID (client-side)
 */
export async function getUserByClerkId(clerkUserId) {
  const supabase = createSupabaseClient();
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_user_id', clerkUserId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // PGRST116 = not found - this is expected for new users
        return null;
      }
      console.error('Error fetching user:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('getUserByClerkId error:', error);
    throw error;
  }
}

/**
 * Create user in Supabase (client-side)
 * Note: This requires RLS policy to allow inserts
 */
export async function createUser(clerkUserId, email) {
  const supabase = createSupabaseClient();
  
  try {
    const { data, error } = await supabase
      .from('users')
      .insert({
        clerk_user_id: clerkUserId,
        email: email,
        premium_status: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('createUser error:', error);
    throw error;
  }
}

/**
 * Get or create user (client-side, idempotent)
 */
export async function getOrCreateUser(clerkUserId, email) {
  try {
    // First, try to get existing user
    let user = await getUserByClerkId(clerkUserId);
    
    if (user) {
      return user;
    }

    // User doesn't exist, create them
    if (!email) {
      throw new Error('Email is required to create user');
    }

    user = await createUser(clerkUserId, email);
    return user;
  } catch (error) {
    console.error('getOrCreateUser error:', error);
    throw error;
  }
}

