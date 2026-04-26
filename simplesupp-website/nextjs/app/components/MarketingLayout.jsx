'use client';

import React from 'react';
import PromoBanner from './PromoBanner';

export default function MarketingLayout({ children }) {
  return (
    <>
      <PromoBanner />
      {children}
    </>
  );
}
