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

  if (!supabaseUrl) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL');
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
  }

  if (!supabaseServiceKey) {
    console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  }

  // Validate URL format
  try {
    new URL(supabaseUrl);
  } catch (urlError) {
    console.error('Invalid Supabase URL format:', supabaseUrl);
    throw new Error(`Invalid Supabase URL format: ${urlError.message}`);
  }

  console.log('Creating Supabase admin client with URL:', supabaseUrl);

  try {
    const client = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    console.log('Supabase admin client created successfully');
    return client;
  } catch (clientError) {
    console.error('Error creating Supabase client:', clientError);
    throw new Error(`Failed to create Supabase client: ${clientError.message}`);
  }
}

// Get user by Clerk user ID (server-side only - uses admin client)
export async function getUserByClerkId(clerkUserId) {
  try {
    const supabase = createSupabaseAdmin();
    
    console.log('Querying Supabase for user with clerk_user_id:', clerkUserId);
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_user_id', clerkUserId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // PGRST116 = not found - this is expected for new users
        console.log('User not found (expected for new users)');
        return null;
      }
      console.error('Error fetching user from Supabase:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      throw error;
    }

    console.log('User found in Supabase:', data?.id);
    return data;
  } catch (error) {
    console.error('getUserByClerkId error:', {
      message: error.message,
      type: error.constructor.name,
      stack: error.stack,
    });
    throw error;
  }
}

// Create user in Supabase (server-side only - uses admin client)
export async function createUser(clerkUserId, email) {
  try {
    console.log('Creating user in Supabase:', { clerkUserId, email });
    const supabase = createSupabaseAdmin();
    
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
      console.error('Error creating user in Supabase:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      throw error;
    }

    console.log('User created successfully in Supabase:', data?.id);
    return data;
  } catch (error) {
    console.error('createUser error:', {
      message: error.message,
      type: error.constructor.name,
      stack: error.stack,
    });
    throw error;
  }
}

// Get or create user (useful for ensuring user exists)
export async function getOrCreateUser(clerkUserId, email) {
  let user = await getUserByClerkId(clerkUserId);
  
  if (!user && email) {
    user = await createUser(clerkUserId, email);
  } else if (!user) {
    throw new Error('User does not exist and email is required to create one');
  }
  
  return user;
}

