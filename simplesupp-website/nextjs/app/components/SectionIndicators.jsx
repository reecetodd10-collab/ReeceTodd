'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * SectionIndicators Component
 *
 * Vertical navigation dots that show current section and allow quick navigation.
 * Fixed to the right side of the viewport.
 * Highlights active section based on scroll position.
 */
export default function SectionIndicators({ sections, activeSection }) {
  const scrollToSection = (sectionId) => {
    if (typeof window === 'undefined') return;
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
      <nav className="flex flex-col gap-4">
        {sections.map((section, index) => {
          const isActive = activeSection === section.id;

          return (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className="group relative flex items-center"
              aria-label={`Go to ${section.label}`}
            >
              {/* Dot */}
              <div className={`rounded-full transition-all duration-300 ${
                isActive
                  ? 'w-3 h-3 bg-[var(--acc)] scale-125'
                  : 'w-2 h-2 bg-[var(--txt-muted)]/40 hover:bg-[var(--txt-muted)]/60 hover:scale-110'
              }`} 
              style={isActive ? {
                boxShadow: '0 0 12px rgba(6, 182, 212, 0.6), 0 0 24px rgba(6, 182, 212, 0.3)'
              } : {}} />

              {/* Label tooltip */}
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                whileHover={{ opacity: 1, x: 0 }}
                className={`absolute right-full mr-3 px-3 py-1 bg-[var(--bg)] border border-[var(--border)] text-[var(--txt)] text-sm font-medium rounded-lg whitespace-nowrap pointer-events-none ${
                  isActive ? 'opacity-100' : 'opacity-0'
                } group-hover:opacity-100 transition-opacity glass`}
              >
                {section.label}
              </motion.span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

