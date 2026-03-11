'use client';

import React from 'react';
import CookieConsent from './CookieConsent';

export default function MarketingLayout({ children }) {
  return (
    <>
      {children}
      <CookieConsent />
    </>
  );
}

