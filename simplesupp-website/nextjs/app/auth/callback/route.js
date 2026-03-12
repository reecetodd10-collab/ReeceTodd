import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Handle OAuth callback — exchange code for session, then redirect to dashboard
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/dashboard';

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(next, origin));
    }
  }

  // Fallback: redirect to dashboard anyway — client-side auth will handle it
  return NextResponse.redirect(new URL(next, origin));
}
