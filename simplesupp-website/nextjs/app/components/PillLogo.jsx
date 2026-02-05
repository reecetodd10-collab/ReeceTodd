'use client';

import React from 'react';
import Image from 'next/image';

export default function PillLogo({ size = 'large', shimmer = false }) {
  const sizes = {
    small: {
      icon: 40,
      text: 'text-xl',
      showText: true
    },
    large: {
      icon: 80,
      text: 'text-5xl md:text-7xl',
      showText: true
    }
  };

  const config = sizes[size];

  return (
    <div
      className="flex items-center gap-3 md:gap-4"
      style={{ background: 'transparent', border: 'none', padding: 0 }}
    >
      {/* Neon Aviera Icon - matches AI widget styling */}
      <Image
        src="/aviera-icon-glow.png"
        alt="Aviera"
        width={config.icon}
        height={config.icon}
        className="object-cover rounded-full"
        style={{
          filter: 'drop-shadow(0 0 12px rgba(0, 217, 255, 0.6))',
          background: 'none',
          border: 'none',
          boxShadow: 'none',
        }}
        priority
      />

      {/* Wordmark - Clean Aviera branding */}
      {config.showText && (
        <h1 className={`${config.text} font-normal uppercase text-[var(--txt)]`} style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}>
          Aviera
        </h1>
      )}
    </div>
  );
}

