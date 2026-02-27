import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Dashboard routes are open during development — re-enable protection before launch
// const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

export default clerkMiddleware(
  async (auth, req) => {
    // Auth protection temporarily disabled for development
  },
  {
    publicRoutes: [
      '/landing',
      '/api/waitlist',
      '/api/pro-waitlist',
      '/api/ai/supplement-recommendation',
      '/smartstack-ai',
      '/dashboard(.*)',
    ],
  }
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

