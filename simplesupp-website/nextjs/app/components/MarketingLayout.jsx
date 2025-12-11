'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navigation from './Navigation';
import Footer from './Footer';
import AvieraAIWidget from './AvieraAIWidget';

export default function MarketingLayout({ children }) {
  const pathname = usePathname();
  
  // Don't show nav/footer on dashboard routes or landing page
  const isDashboardRoute = pathname?.startsWith('/dashboard');
  const isLandingPage = pathname === '/landing';
  const isSmartStackPage = pathname === '/smartstack-ai';
  
  // Landing page - no nav or footer or widget
  if (isLandingPage) {
    return <>{children}</>;
  }
  
  // Dashboard routes - no nav/footer but show widget
  if (isDashboardRoute) {
    return (
      <>
        {children}
        <AvieraAIWidget />
      </>
    );
  }

  // SmartStack page - show nav but no footer (page has its own full-page background)
  if (isSmartStackPage) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1">{children}</main>
        <AvieraAIWidget />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">{children}</main>
      <Footer />
      <AvieraAIWidget />
    </div>
  );
}

