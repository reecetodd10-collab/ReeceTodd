'use client';

import { useEffect, useState, useCallback } from 'react';

/**
 * useParallax Hook
 *
 * Provides scroll-based parallax offset values for 3D transforms.
 * Automatically disables on mobile (<768px) and when prefers-reduced-motion is set.
 *
 * @param {number} speed - Parallax speed multiplier (default: 0.5)
 * @returns {Object} { offsetY, isEnabled } - offsetY for transforms, isEnabled flag
 */
export function useParallax(speed = 0.5) {
  const [offsetY, setOffsetY] = useState(0);
  const [isEnabled, setIsEnabled] = useState(true);

  // Check if parallax should be disabled
  useEffect(() => {
    const checkDisabled = () => {
      if (typeof window === 'undefined') return;
      const isMobile = window.innerWidth < 768;
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setIsEnabled(!isMobile && !prefersReduced);
    };

    checkDisabled();
    window.addEventListener('resize', checkDisabled);

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', checkDisabled);
    }

    return () => {
      window.removeEventListener('resize', checkDisabled);
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', checkDisabled);
      }
    };
  }, []);

  // Handle scroll events
  const handleScroll = useCallback(() => {
    if (isEnabled && typeof window !== 'undefined') {
      setOffsetY(window.scrollY * speed);
    }
  }, [speed, isEnabled]);

  useEffect(() => {
    if (!isEnabled || typeof window === 'undefined') {
      setOffsetY(0);
      return;
    }

    // Use passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll, isEnabled]);

  return { offsetY, isEnabled };
}

