import React from 'react';
import { Pill } from 'lucide-react';

export default function PillLogo({ size = 'large' }) {
  const sizes = {
    small: { pill: 32, text: 'text-xl' },
    large: { pill: 64, text: 'text-5xl md:text-7xl' }
  };

  const config = sizes[size];

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary rounded-2xl blur-xl opacity-60 animate-pulse"></div>

        {/* Pill container */}
        <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black p-3 rounded-2xl shadow-2xl border border-gray-700">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary rounded-full blur-md opacity-50"></div>
            <Pill
              className="relative text-white fill-current glow-effect"
              size={config.pill}
            />
          </div>
        </div>
      </div>

      {/* Wordmark */}
      <h1 className={`${config.text} font-bold gradient-text`}>
        SimpleSupp
      </h1>
    </div>
  );
}
