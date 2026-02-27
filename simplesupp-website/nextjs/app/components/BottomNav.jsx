'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, ClipboardList, Newspaper, User } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Shop', href: '/shop', icon: ShoppingBag },
  { label: 'Quiz', href: '/supplement-optimization-score', icon: ClipboardList },
  { label: 'News', href: '/news', icon: Newspaper },
  { label: 'Account', href: '/dashboard', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t"
      style={{
        background: 'rgba(10, 10, 15, 0.97)',
        backdropFilter: 'blur(12px)',
        borderColor: 'rgba(0, 217, 255, 0.15)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex justify-around items-center h-16">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href === '/' && pathname === '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2 min-h-[48px] transition-colors"
              style={{ color: isActive ? '#00d9ff' : '#6b7280' }}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
