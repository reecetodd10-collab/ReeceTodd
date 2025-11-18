import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { createUser, getOrCreateUser, getUserByClerkId } from '@/lib/supabase';

export async function POST(request) {
  try {
    console.log('POST /api/user/create - Starting...');
    
    const { userId } = await auth();
    
    if (!userId) {
      console.log('POST /api/user/create - No userId found');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('POST /api/user/create - UserId:', userId);

    // Check if user already exists
    let existingUser;
    try {
      existingUser = await getUserByClerkId(userId);
      if (existingUser) {
        console.log('POST /api/user/create - User already exists');
        return NextResponse.json(
          { message: 'User already exists', user: existingUser },
          { status: 200 }
        );
      }
    } catch (checkError) {
      console.error('POST /api/user/create - Error checking existing user:', checkError);
      // Continue to try creating user
    }

    // Try to get email from request body first
    let email;
    try {
      const body = await request.json();
      email = body.email;
      console.log('POST /api/user/create - Email from request:', email);
    } catch {
      // Request body might be empty, that's okay
      console.log('POST /api/user/create - No request body');
    }

    // If no email provided, fetch from Clerk
    if (!email) {
      try {
        console.log('POST /api/user/create - Fetching email from Clerk...');
        const client = await clerkClient();
        const clerkUser = await client.users.getUser(userId);
        email = clerkUser.emailAddresses?.[0]?.emailAddress;
        console.log('POST /api/user/create - Email from Clerk:', email);
      } catch (clerkError) {
        console.error('POST /api/user/create - Error fetching user from Clerk:', clerkError);
      }
    }

    if (!email) {
      console.error('POST /api/user/create - No email available');
      return NextResponse.json(
        { error: 'Email is required. Please provide email or ensure your Clerk account has an email address.' },
        { status: 400 }
      );
    }

    // Get or create user (idempotent - safe to call multiple times)
    console.log('POST /api/user/create - Creating user in Supabase...');
    const user = await getOrCreateUser(userId, email);
    console.log('POST /api/user/create - User created successfully:', user.id);

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('POST /api/user/create - Error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    return NextResponse.json(
      { 
        error: 'Failed to create user', 
        details: error.message,
        type: error.constructor.name,
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check if user exists
export async function GET() {
  try {
    console.log('GET /api/user/create - Checking user...');
    
    const { userId } = await auth();
    
    if (!userId) {
      console.log('GET /api/user/create - No userId found');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('GET /api/user/create - UserId:', userId);

    // Check Supabase connection
    try {
      const user = await getUserByClerkId(userId);
      console.log('GET /api/user/create - User lookup result:', user ? 'found' : 'not found');
      
      if (!user) {
        return NextResponse.json(
          { exists: false },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { exists: true, user },
        { status: 200 }
      );
    } catch (supabaseError) {
      console.error('GET /api/user/create - Supabase error:', supabaseError);
      console.error('Error details:', {
        message: supabaseError.message,
        code: supabaseError.code,
        details: supabaseError.details,
        hint: supabaseError.hint,
      });
      throw supabaseError;
    }
  } catch (error) {
    console.error('GET /api/user/create - Error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { 
        error: 'Failed to check user', 
        details: error.message,
        type: error.constructor.name,
      },
      { status: 500 }
    );
  }
}


