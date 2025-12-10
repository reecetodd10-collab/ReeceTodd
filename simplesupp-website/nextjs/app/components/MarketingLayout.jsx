'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navigation from './Navigation';
import Footer from './Footer';

export default function MarketingLayout({ children }) {
  const pathname = usePathname();
  
  // Don't show nav/footer on dashboard routes or landing page
  const isDashboardRoute = pathname?.startsWith('/dashboard');
  const isLandingPage = pathname === '/landing';
  const isSmartStackPage = pathname === '/smartstack-ai';
  
  // Landing page - no nav or footer
  if (isDashboardRoute || isLandingPage) {
    return <>{children}</>;
  }

  // SmartStack page - show nav but no footer (page has its own full-page background)
  if (isSmartStackPage) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1">{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

