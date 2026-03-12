import { NextResponse } from 'next/server';

export function middleware() {
  // Auth is handled client-side by SupabaseAuthProvider.
  // The dashboard page itself checks for auth and redirects if needed.
  // Middleware just passes through — no cookie check needed since
  // Supabase JS stores sessions in localStorage, not cookies.
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
