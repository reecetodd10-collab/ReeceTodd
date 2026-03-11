import { NextResponse } from 'next/server';

export function middleware(request) {
  // Protect dashboard routes — redirect to /auth if no Supabase session cookie
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // Supabase stores auth in cookies prefixed with sb-
    const cookies = request.cookies.getAll();
    const hasAuthCookie = cookies.some(
      (c) => c.name.includes('auth-token') || c.name.includes('sb-')
    );

    if (!hasAuthCookie) {
      return NextResponse.redirect(new URL('/auth', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
