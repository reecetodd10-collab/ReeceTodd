'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import PromoBanner from './PromoBanner';

const STANDALONE_PAGES = ['/command-center'];

export default function MarketingLayout({ children }) {
  const pathname = usePathname();
  const isStandalone = STANDALONE_PAGES.some(p => pathname?.startsWith(p));

  if (isStandalone) return <>{children}</>;

  return (
    <>
      <PromoBanner />
      {children}
    </>
  );
}
