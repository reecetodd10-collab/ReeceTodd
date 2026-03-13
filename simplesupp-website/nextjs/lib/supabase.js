import { createClient } from '@supabase/supabase-js';

// Client-side Supabase client (uses anon key)
export function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

// Server-side Supabase client (uses service role key for admin operations)
export function createSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables (URL or SERVICE_ROLE_KEY)');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Get user by Supabase auth user ID
export async function getUserByAuthId(authUserId) {
  const supabase = createSupabaseAdmin();

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('auth_user_id', authUserId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // not found
    throw error;
  }

  return data;
}

// Create user in Supabase
export async function createUser(authUserId, email) {
  const supabase = createSupabaseAdmin();

  const { data, error } = await supabase
    .from('users')
    .insert({
      auth_user_id: authUserId,
      email: email,
      premium_status: false,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Get or create user (ensures user exists in public.users)
export async function getOrCreateUser(authUserId, email) {
  let user = await getUserByAuthId(authUserId);

  if (!user && email) {
    user = await createUser(authUserId, email);
  } else if (!user) {
    throw new Error('User does not exist and email is required to create one');
  }

  return user;
}

// Update user email
export async function updateUserEmail(authUserId, newEmail) {
  const supabase = createSupabaseAdmin();

  const { data, error } = await supabase
    .from('users')
    .update({ email: newEmail })
    .eq('auth_user_id', authUserId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Update user streak data
export async function updateUserStreak(userId, streak, longestStreak, lastIntakeDate) {
  const supabase = createSupabaseAdmin();

  const { data, error } = await supabase
    .from('users')
    .update({
      current_streak: streak,
      longest_streak: longestStreak,
      last_intake_date: lastIntakeDate,
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Log supplement intake and update streak
// Streak rules:
//   - Can log again after 20 hours since last log
//   - Streak breaks after 48 hours of not logging
//   - Each valid log increments the streak by 1 day
export async function logIntake(userId, supplementName, notes = null) {
  const supabase = createSupabaseAdmin();
  const now = Date.now();

  // Check last intake to enforce 20-hour cooldown
  const { data: lastLog } = await supabase
    .from('intake_logs')
    .select('taken_at')
    .eq('user_id', userId)
    .order('taken_at', { ascending: false })
    .limit(1)
    .single();

  if (lastLog?.taken_at) {
    const hoursSinceLast = (now - new Date(lastLog.taken_at).getTime()) / (1000 * 60 * 60);
    if (hoursSinceLast < 20) {
      const hoursLeft = Math.ceil(20 - hoursSinceLast);
      return {
        log: null,
        streak: null,
        longestStreak: null,
        cooldown: true,
        hoursLeft,
      };
    }
  }

  // Insert intake log
  const { data: log, error: logError } = await supabase
    .from('intake_logs')
    .insert({
      user_id: userId,
      supplement_name: supplementName,
      notes,
    })
    .select()
    .single();

  if (logError) throw logError;

  // Calculate streak based on 48-hour window
  const { data: user } = await supabase
    .from('users')
    .select('current_streak, longest_streak, last_intake_date')
    .eq('id', userId)
    .single();

  let newStreak = 1;
  if (user?.last_intake_date) {
    const lastDate = new Date(user.last_intake_date + 'T00:00:00Z');
    const hoursSinceLastDate = (now - lastDate.getTime()) / (1000 * 60 * 60);

    if (hoursSinceLastDate < 48) {
      // Within 48 hours — check if this is a new day to increment
      const today = new Date(now).toISOString().split('T')[0];
      if (user.last_intake_date === today) {
        // Same day, keep current streak
        newStreak = user.current_streak || 1;
      } else {
        // New day within 48h window — increment
        newStreak = (user.current_streak || 0) + 1;
      }
    }
    // else: >48 hours, streak resets to 1 (default)
  }

  const today = new Date(now).toISOString().split('T')[0];
  const newLongest = Math.max(newStreak, user?.longest_streak || 0);

  await updateUserStreak(userId, newStreak, newLongest, today);

  return { log, streak: newStreak, longestStreak: newLongest };
}

// Record a purchase
export async function recordPurchase(userId, productName, shopifyProductId, shopifyVariantId, quantity = 1) {
  const supabase = createSupabaseAdmin();

  const { data, error } = await supabase
    .from('purchase_history')
    .insert({
      user_id: userId,
      product_name: productName,
      shopify_product_id: shopifyProductId,
      shopify_variant_id: shopifyVariantId,
      quantity,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Get users who need restock reminders
export async function getUsersNeedingRestock() {
  const supabase = createSupabaseAdmin();

  const { data, error } = await supabase
    .from('purchase_history')
    .select('*, users!inner(email, auth_user_id)')
    .lte('purchased_at', new Date(Date.now() - 25 * 86400000).toISOString()); // 25+ days ago

  if (error) throw error;
  return data || [];
}
