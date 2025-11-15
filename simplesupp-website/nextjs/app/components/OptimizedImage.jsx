'use client';

import Image from 'next/image';
import { useState } from 'react';

/**
 * OptimizedImage Component
 * 
 * Wrapper around Next.js Image component with placeholder support
 * Falls back to placeholder if image doesn't exist
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  placeholder = 'blur',
  objectFit = 'cover',
  objectPosition = 'center',
  fallbackText = 'Image',
  ...props
}) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // If image fails to load, show placeholder
  if (imageError) {
    return (
      <div 
        className={`bg-gradient-to-br from-[var(--charcoal-light)] to-[var(--bg)] flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <div className="text-center p-4">
          <div className="w-16 h-16 mx-auto mb-2 bg-[var(--acc)]/20 rounded-full flex items-center justify-center">
            <span className="text-[var(--acc)] text-2xl">📷</span>
          </div>
          <p className="text-[var(--txt-muted)] text-sm">{fallbackText}</p>
          {process.env.NODE_ENV === 'development' && (
            <p className="text-[var(--txt-muted)] text-xs mt-2">Path: {src}</p>
          )}
        </div>
      </div>
    );
  }

  // Create blur data URL for placeholder
  const blurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==';

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        placeholder={placeholder === 'blur' ? 'blur' : 'empty'}
        blurDataURL={placeholder === 'blur' ? blurDataURL : undefined}
        style={{ 
          objectFit: objectFit || 'cover', 
          objectPosition: objectPosition || 'center center',
          width: '100%',
          height: '100%',
          display: 'block'
        }}
        className={`transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onError={(e) => {
          console.error('Image load error:', src, e);
          setImageError(true);
        }}
        onLoadingComplete={() => {
          setImageLoaded(true);
        }}
        unoptimized={false}
        {...props}
      />
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--charcoal-light)] to-[var(--bg)] animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[var(--acc)]/20 border-t-[var(--acc)] rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}

