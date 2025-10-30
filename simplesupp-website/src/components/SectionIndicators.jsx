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
              <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                isActive
                  ? 'bg-primary scale-125'
                  : 'bg-gray-300 hover:bg-gray-400 hover:scale-110'
              }`} />

              {/* Label tooltip */}
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                whileHover={{ opacity: 1, x: 0 }}
                className={`absolute right-full mr-3 px-3 py-1 bg-gray-900 text-white text-sm font-medium rounded-lg whitespace-nowrap pointer-events-none ${
                  isActive ? 'opacity-100' : 'opacity-0'
                } group-hover:opacity-100 transition-opacity`}
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
