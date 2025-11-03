import React from 'react';
import { Pill } from 'lucide-react';

export default function PillLogo({ size = 'large', shimmer = false }) {
  const sizes = {
    small: { pill: 24, text: 'text-xl', container: 'w-10 h-10 p-2' },
    large: { pill: 48, text: 'text-5xl md:text-7xl', container: 'w-20 h-20 p-4' }
  };

  const config = sizes[size];

  return (
    <div className="flex items-center gap-3 md:gap-4">
      <div className="relative">
                {/* Subtle glow effect - accent color */}
                <div className="absolute inset-0 bg-[var(--acc)]/20 rounded-2xl blur-xl"></div>

                {/* Pill container - Charcoal rounded square */}
                <div className={`relative bg-[var(--charcoal-light)] ${config.container} rounded-2xl shadow-premium border border-[var(--border)] icon-aivra`}>
                  <Pill
                    className="relative text-white fill-current"
                    size={config.pill}
                  />
                </div>
              </div>

              {/* Wordmark - Clean Aivra branding */}
              <h1 className={`${config.text} font-bold text-[var(--txt)]`}>
                Aivra
              </h1>
    </div>
  );
}
