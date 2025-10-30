import React from 'react';
import { useParallax } from '../hooks/useParallax';

/**
 * ParallaxLayer Component
 *
 * Wraps content in a parallax-enabled layer with 3D transforms.
 * Automatically disables on mobile and for users with reduced motion preferences.
 *
 * @param {number} depth - Z-axis depth (0-100, default: 20). Higher = more parallax effect
 * @param {number} speed - Scroll speed multiplier (default: 0.5). Higher = faster movement
 * @param {string} className - Additional CSS classes
 * @param {React.ReactNode} children - Content to apply parallax to
 */
export default function ParallaxLayer({
  depth = 20,
  speed = 0.5,
  className = '',
  children
}) {
  const { offsetY, isEnabled } = useParallax(speed);

  // Calculate transform based on depth and scroll offset
  const transform = isEnabled
    ? `translateY(${offsetY * 0.1}px) translateZ(${-depth}px) scale(${1 + depth * 0.001})`
    : 'none';

  return (
    <div
      className={`parallax-layer ${className}`}
      style={{
        transform,
        transformStyle: 'preserve-3d'
      }}
    >
      {children}
    </div>
  );
}
