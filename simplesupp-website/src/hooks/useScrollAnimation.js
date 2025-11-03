import { useEffect, useState, useRef } from 'react';

/**
 * useScrollAnimation Hook
 *
 * Uses Intersection Observer to detect when elements enter viewport
 * and trigger animations. Returns ref and animation state.
 *
 * @param {Object} options - Intersection Observer options
 * @returns {Object} { ref, isVisible } - ref to attach to element, visibility state
 */
export function useScrollAnimation(options = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Optional: Unobserve after first intersection for one-time animations
          if (options.once) {
            observer.unobserve(entry.target);
          }
        } else if (!options.once) {
          setIsVisible(false);
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px',
        ...options
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options.threshold, options.rootMargin, options.once]);

  return { ref, isVisible };
}

/**
 * useActiveSection Hook
 *
 * Tracks which section is currently in view using Intersection Observer.
 * Used for highlighting navigation indicators.
 *
 * @param {Array} sectionIds - Array of section IDs to track
 * @returns {string} - Currently active section ID
 */
export function useActiveSection(sectionIds) {
  const [activeSection, setActiveSection] = useState(sectionIds[0] || '');

  useEffect(() => {
    if (sectionIds.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0
    };

    const observerCallback = (entries) => {
      // Find the section that's currently in the center of the viewport
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    sectionIds.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [sectionIds]);

  return activeSection;
}
