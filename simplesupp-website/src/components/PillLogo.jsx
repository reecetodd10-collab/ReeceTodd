import React from 'react';
import { Pill } from 'lucide-react';

// New Aviera "A" logo - two angled lines meeting at top (no crossbar)
const AvieraA = ({ size = 40, className = "" }) => {
  const strokeWidth = size > 32 ? 3 : 2.5;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Left angled line */}
      <path
        d="M 8 36 L 8 20 L 20 4"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right angled line */}
      <path
        d="M 32 36 L 32 20 L 20 4"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default function PillLogo({ size = 'large', shimmer = false }) {
  const sizes = {
    small: { pill: 24, text: 'text-xl', container: 'w-10 h-10 p-2', icon: 20 },
    large: { pill: 48, text: 'text-5xl md:text-7xl', container: 'w-20 h-20 p-4', icon: 40 }
  };

  const config = sizes[size];

  return (
    <div className="flex items-center gap-3 md:gap-4">
      <div className="relative">
        {/* Subtle glow effect - accent color */}
        <div className="absolute inset-0 bg-[var(--acc)]/20 rounded-2xl blur-xl"></div>

        {/* Pill container - Charcoal rounded square with new "A" icon */}
        <div className={`relative bg-[var(--charcoal-light)] ${config.container} rounded-2xl shadow-premium border border-[var(--border)] icon-aivra flex items-center justify-center`}>
          <AvieraA size={config.icon} className="text-white relative" />
          {/* Keep pill icon as secondary element (optional, can remove if desired) */}
          {/* <Pill
            className="relative text-white fill-current opacity-30"
            size={config.pill * 0.6}
          /> */}
        </div>
      </div>

      {/* Wordmark - Clean Aviera branding */}
      <h1 className={`${config.text} font-bold text-[var(--txt)]`}>
        Aviera
      </h1>
    </div>
  );
}
