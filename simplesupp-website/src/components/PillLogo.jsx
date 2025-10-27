import React from 'react';
import { Pill } from 'lucide-react';

export default function PillLogo({ size = 'large', shimmer = false }) {
  const sizes = {
    small: { pill: 32, text: 'text-xl' },
    large: { pill: 64, text: 'text-5xl md:text-7xl' }
  };

  const config = sizes[size];

  return (
    <div className="flex items-center gap-3 md:gap-4">
      <div className="relative">
        {/* Glow effect - SmartSupp gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-violet rounded-2xl blur-xl opacity-60 animate-pulse"></div>

        {/* Pill container */}
        <div className="relative bg-gradient-to-br from-slate-900 via-gray-800 to-black p-3 rounded-2xl shadow-2xl border border-slate-700/50">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-violet rounded-full blur-md opacity-50"></div>
            <Pill
              className="relative text-white fill-current glow-effect"
              size={config.pill}
            />
          </div>
        </div>
      </div>

      {/* Wordmark with SmartSupp branding */}
      <h1 className={`${config.text} font-extrabold ${shimmer ? 'gradient-shimmer' : 'gradient-text'}`}>
        SmartSupp
      </h1>
    </div>
  );
}
