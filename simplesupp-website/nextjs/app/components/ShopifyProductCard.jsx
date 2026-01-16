'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Check, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { addToCart } from '../lib/shopify';
import Image from 'next/image';

export default function ShopifyProductCard({ product }) {
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showArrows, setShowArrows] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const imageContainerRef = useRef(null);

  // TODO: Upload supplement facts and ingredients images to Shopify
  // Use actual product images from Shopify if available, otherwise duplicate main image
  const productImages = product.images && product.images.length >= 2
    ? product.images // Use actual images from Shopify (front, supplement facts, ingredients)
    : product.image 
      ? [product.image, product.image, product.image] // Fallback: duplicate main image 3 times
      : [];

  const hasMultipleImages = productImages.length > 1;

  const handleAddToCart = async () => {
    // Handle local products without variant IDs
    if (product.isLocalProduct && !product.variantId) {
      alert('This product will be available for purchase soon. Please check back later!');
      return;
    }
    
    if (!product.variantId || !product.available) return;

    setIsAdding(true);
    try {
      await addToCart(product.variantId, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add product to cart. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  // Image carousel functions
  const goToPreviousImage = (e) => {
    e.stopPropagation();
    if (productImages.length === 0) return;
    setCurrentImageIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
  };

  const goToNextImage = (e) => {
    e.stopPropagation();
    if (productImages.length === 0) return;
    setCurrentImageIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
  };

  // Touch swipe handlers
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && hasMultipleImages) {
      goToNextImage({ stopPropagation: () => {} });
    }
    if (isRightSwipe && hasMultipleImages) {
      goToPreviousImage({ stopPropagation: () => {} });
    }
  };

  return (
    <motion.div
      className="glass-card overflow-hidden transition-all group"
      style={{
        border: '1px solid rgba(0, 217, 255, 0.3)',
        boxShadow: '0 0 20px rgba(0, 217, 255, 0.25)',
        transition: 'all 0.3s ease'
      }}
      whileHover={{ 
        y: -2
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 217, 255, 0.5)';
        e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.6)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.25)';
        e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
      }}
    >
      {/* Product Image Carousel */}
      <div 
        className="relative w-full h-64 bg-gradient-to-b from-[var(--bg-elev-1)] to-[var(--bg)] flex items-center justify-center overflow-hidden"
        onMouseEnter={() => hasMultipleImages && setShowArrows(true)}
        onMouseLeave={() => setShowArrows(false)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        ref={imageContainerRef}
      >
        {productImages.length > 0 ? (
          <div className="relative w-full h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 w-full h-full"
              >
                <Image
                  src={productImages[currentImageIndex]}
                  alt={product.imageAlt || product.title}
                  width={400}
                  height={400}
                  className="w-full h-full object-contain p-4"
                  style={{ mixBlendMode: 'normal' }}
                  unoptimized
                />
              </motion.div>
            </AnimatePresence>
            {/* Subtle dark overlay to blend with dark card */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 pointer-events-none"></div>
            
            {/* Navigation Arrows */}
            {hasMultipleImages && (
              <>
                {/* Left Arrow */}
                <button
                  onClick={goToPreviousImage}
                  className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 transition-all duration-300 ${
                    showArrows ? 'opacity-100' : 'opacity-100 md:opacity-0'
                  }`}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(0, 217, 255, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    cursor: 'pointer',
                    backdropFilter: 'blur(4px)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 217, 255, 1)';
                    e.currentTarget.style.transform = 'scale(1.1) translateY(-50%)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 217, 255, 0.8)';
                    e.currentTarget.style.transform = 'scale(1) translateY(-50%)';
                  }}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} className="text-[#001018]" strokeWidth={2.5} />
                </button>

                {/* Right Arrow */}
                <button
                  onClick={goToNextImage}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 transition-all duration-300 ${
                    showArrows ? 'opacity-100' : 'opacity-100 md:opacity-0'
                  }`}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(0, 217, 255, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    cursor: 'pointer',
                    backdropFilter: 'blur(4px)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 217, 255, 1)';
                    e.currentTarget.style.transform = 'scale(1.1) translateY(-50%)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 217, 255, 0.8)';
                    e.currentTarget.style.transform = 'scale(1) translateY(-50%)';
                  }}
                  aria-label="Next image"
                >
                  <ChevronRight size={20} className="text-[#001018]" strokeWidth={2.5} />
                </button>
              </>
            )}

            {/* Image Indicator Dots */}
            {hasMultipleImages && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                {productImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                    className="transition-all duration-300"
                    style={{
                      width: currentImageIndex === index ? '24px' : '8px',
                      height: '8px',
                      borderRadius: '4px',
                      background: currentImageIndex === index 
                        ? 'rgba(0, 217, 255, 1)' 
                        : 'rgba(255, 255, 255, 0.4)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (currentImageIndex !== index) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentImageIndex !== index) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.4)';
                      }
                    }}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-6xl opacity-20">💊</div>
        )}
        {!product.available && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
            <span className="text-white font-normal px-4 py-2 bg-red-500/80 rounded-lg">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Content */}
      <div className="p-6">
        {/* Product Title */}
        <h3 className="text-lg font-normal text-white mb-3 line-clamp-2 min-h-[3.5rem]">
          {product.title}
        </h3>

        {/* Product Description (expandable) */}
        {product.description && (
          <div className="mb-4">
            <p 
              className={`text-sm text-[var(--txt-muted)] font-light leading-relaxed transition-all duration-300 ${
                isDescriptionExpanded ? '' : 'line-clamp-2'
              }`}
              style={{
                display: isDescriptionExpanded ? 'block' : '-webkit-box',
                WebkitLineClamp: isDescriptionExpanded ? 'none' : 2,
                WebkitBoxOrient: 'vertical',
                overflow: isDescriptionExpanded ? 'visible' : 'hidden',
              }}
            >
              {product.description.replace(/<[^>]*>/g, '')}
            </p>
            <button
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="text-sm text-[#00d9ff] hover:text-[#00f0ff] font-normal mt-2 transition-colors duration-300 flex items-center gap-1"
            >
              {isDescriptionExpanded ? (
                <>
                  View Less
                  <ChevronUp size={14} />
                </>
              ) : (
                <>
                  View More
                  <ChevronDown size={14} />
                </>
              )}
            </button>
          </div>
        )}

        {/* Price */}
        <div className="mb-6 pt-4 border-t border-[var(--border)]">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#00d9ff]">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-sm text-[var(--txt-muted)] font-light">
              {product.currencyCode}
            </span>
          </div>
        </div>

        {/* Add to Cart Button - Matches "Get Aviera Pro" style */}
        <button
          onClick={handleAddToCart}
          disabled={(!product.available || isAdding || added) && !product.isLocalProduct}
          className="w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-white transition-all duration-300 ease-in-out"
          style={{
            background: added 
              ? 'rgba(16, 185, 129, 0.9)' 
              : 'rgba(30, 30, 30, 0.9)',
            border: added 
              ? '1px solid rgba(16, 185, 129, 0.4)' 
              : '1px solid rgba(0, 217, 255, 0.4)',
            borderRadius: '12px',
            padding: '14px 28px',
            fontSize: '16px',
            fontWeight: 600,
            boxShadow: added
              ? '0 0 20px rgba(16, 185, 129, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)'
              : '0 0 20px rgba(0, 217, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)',
          }}
          onMouseEnter={(e) => {
            if (!added && !isAdding && product.available) {
              e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 217, 255, 0.6), 0 4px 12px rgba(0, 0, 0, 0.3)';
              e.currentTarget.style.transform = 'translateY(-3px)';
            }
          }}
          onMouseLeave={(e) => {
            if (!added) {
              e.currentTarget.style.boxShadow = added
                ? '0 0 20px rgba(16, 185, 129, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)'
                : '0 0 20px rgba(0, 217, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)';
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
        >
          {added ? (
            <>
              <Check size={18} />
              Added to Cart
            </>
          ) : isAdding ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Adding...
            </>
          ) : (
            <>
              <ShoppingCart size={18} />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}

