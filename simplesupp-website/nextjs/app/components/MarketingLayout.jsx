'use client';

import React from 'react';
import CookieConsent from './CookieConsent';
import PWAInstallPrompt from './PWAInstallPrompt';

export default function MarketingLayout({ children }) {
  return (
    <>
      {children}
      <CookieConsent />
      <PWAInstallPrompt />
    </>
  );
}

