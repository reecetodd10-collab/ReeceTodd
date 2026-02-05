'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * SectionIndicators Component
 *
 * Vertical navigation dots that show current section and allow quick navigation.
 * Fixed to the right side of the viewport.
 * All dots visible at low opacity, active dot at full opacity with cyan glow.
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
              className="group relative flex items-center cursor-pointer"
              aria-label={`Go to ${section.label}`}
            >
              {/* Dot - All visible, active has full opacity and glow */}
              <div
                className="rounded-full transition-all duration-300"
                style={isActive ? {
                  width: '12px',
                  height: '12px',
                  background: '#00d9ff',
                  boxShadow: '0 0 12px rgba(0, 217, 255, 0.8), 0 0 24px rgba(0, 217, 255, 0.4)',
                  transform: 'scale(1.1)'
                } : {
                  width: '8px',
                  height: '8px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  opacity: 1
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = '#00d9ff';
                    e.currentTarget.style.opacity = '0.7';
                    e.currentTarget.style.transform = 'scale(1.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)';
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
              />

              {/* Label tooltip */}
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                whileHover={{ opacity: 1, x: 0 }}
                className="absolute right-full mr-3 px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap pointer-events-none transition-opacity duration-200"
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(0, 217, 255, 0.3)',
                  color: '#1a1a1a',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  opacity: isActive ? 1 : 0
                }}
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

