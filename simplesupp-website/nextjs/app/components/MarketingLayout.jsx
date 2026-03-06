'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navigation from './Navigation';
import Footer from './Footer';
import BottomNav from './BottomNav';
import AvieraAIWidget from './AvieraAIWidget';
import CookieConsent from './CookieConsent';
import PWAInstallPrompt from './PWAInstallPrompt';

export default function MarketingLayout({ children }) {
  const pathname = usePathname();
  
  // Don't show nav/footer on dashboard routes or landing page
  const isDashboardRoute = pathname?.startsWith('/dashboard');
  const isLandingPage = pathname === '/landing';
  const isNitricPage = pathname === '/nitric';
  const isSmartStackPage = pathname === '/smartstack-ai';
  const isHomePage = pathname === '/home';
  const isTrybePage = pathname === '/trybe';
  const isShopPage = pathname === '/shop';

  // Landing page - no nav or footer or widget
  if (isLandingPage) {
    return <>{children}</>;
  }

  // Nitric Oxide landing page - standalone, no nav or footer or widget
  if (isNitricPage) {
    return <>{children}</>;
  }

  // Home page - standalone with its own nav and footer
  if (isHomePage) {
    return <>{children}</>;
  }

  // Trybe page - standalone with its own nav and footer
  if (isTrybePage) {
    return <>{children}</>;
  }

  // Shop page - standalone with its own nav and footer
  if (isShopPage) {
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
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        <BottomNav />
        <AvieraAIWidget />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <Footer />
      <BottomNav />
      <AvieraAIWidget />
      <CookieConsent />
      <PWAInstallPrompt />
    </div>
  );
}

