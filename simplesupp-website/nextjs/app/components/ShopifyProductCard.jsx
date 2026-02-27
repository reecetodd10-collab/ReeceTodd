'use client';

import React, { useState } from 'react';
import { Plus, Check, X } from 'lucide-react';
import { addToCart } from '../lib/shopify';
import Image from 'next/image';

export default function ShopifyProductCard({ product }) {
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const mainImage = product.images && product.images.length > 0
    ? product.images[0]
    : product.image || null;

  const handleAddToCart = async (e) => {
    if (e) e.stopPropagation();

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

  const category = product.category || (product.tags && product.tags[0]) || 'Supplement';

  return (
    <>
      <div
        className="overflow-hidden transition-all"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '14px',
        }}
      >
        {/* Square product image */}
        <div className="relative w-full bg-[var(--bg-elev-1)]" style={{ aspectRatio: '1' }}>
          {mainImage ? (
            <Image
              src={mainImage}
              alt={product.imageAlt || product.title}
              fill
              className="object-contain p-3"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-20">💊</div>
          )}

          {product.badge && (
            <span
              className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-semibold"
              style={{
                background: product.badge === 'Sale' ? 'rgba(239,68,68,0.85)' : 'rgba(0,217,255,0.15)',
                color: product.badge === 'Sale' ? '#fff' : '#00d9ff',
                border: product.badge === 'Sale' ? 'none' : '1px solid rgba(0,217,255,0.3)',
              }}
            >
              {product.badge}
            </span>
          )}

          {!product.available && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
              <span className="text-white text-[11px] font-medium px-3 py-1 bg-red-500/80 rounded-full">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="px-3 pt-2.5 pb-3">
          <h3
            className="font-semibold leading-tight line-clamp-2 mb-0.5"
            style={{ fontSize: '12px', color: 'var(--txt)' }}
          >
            {product.title}
          </h3>

          <p
            className="mb-2 leading-tight"
            style={{ fontSize: '10px', color: 'var(--txt-dim, #52525b)' }}
          >
            {category}
          </p>

          {/* Price row + add button */}
          <div className="flex items-center justify-between">
            <span className="font-bold" style={{ fontSize: '13px', color: '#00d9ff' }}>
              ${product.price.toFixed(2)}
            </span>

            <button
              onClick={handleAddToCart}
              disabled={(!product.available || isAdding || added) && !product.isLocalProduct}
              className="flex items-center justify-center transition-all disabled:opacity-40"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: added ? 'rgba(16,185,129,0.2)' : 'rgba(0,217,255,0.1)',
                border: added ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(0,217,255,0.3)',
                flexShrink: 0,
              }}
              aria-label={added ? 'Added to cart' : 'Add to cart'}
            >
              {added ? (
                <Check size={14} style={{ color: '#10b981' }} strokeWidth={2.5} />
              ) : isAdding ? (
                <div className="w-3 h-3 border-2 border-[#00d9ff] border-t-transparent rounded-full animate-spin" />
              ) : (
                <Plus size={14} style={{ color: '#00d9ff' }} strokeWidth={2.5} />
              )}
            </button>
          </div>

          {/* More Info link */}
          <button
            onClick={() => setShowDetail(true)}
            className="mt-1.5 text-[10px] font-medium"
            style={{ color: 'var(--txt-muted)' }}
          >
            More Info
          </button>
        </div>
      </div>

      {/* Bottom sheet / detail panel */}
      {showDetail && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center md:items-center"
          onClick={() => setShowDetail(false)}
        >
          <div className="absolute inset-0 bg-black/60" />
          <div
            className="relative z-10 w-full max-w-md rounded-t-[20px] md:rounded-[20px] max-h-[80vh] overflow-y-auto"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowDetail(false)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'var(--bg-elev-1)' }}
            >
              <X size={16} style={{ color: 'var(--txt-muted)' }} />
            </button>

            {/* Product image */}
            <div className="w-full aspect-square flex items-center justify-center relative" style={{ background: 'var(--bg-elev-1)' }}>
              {mainImage ? (
                <Image
                  src={mainImage}
                  alt={product.imageAlt || product.title}
                  fill
                  className="object-contain p-6"
                  unoptimized
                />
              ) : (
                <span className="text-5xl opacity-20">💊</span>
              )}
            </div>

            <div className="p-5">
              <h3 className="text-[16px] font-bold mb-1" style={{ color: 'var(--txt)' }}>{product.title}</h3>
              <p className="text-[15px] font-bold mb-3" style={{ color: '#00d9ff' }}>${product.price.toFixed(2)}</p>

              {product.description && (
                <p className="text-[13px] leading-relaxed mb-4" style={{ color: 'var(--txt-muted)' }}>
                  {product.description.replace(/<[^>]*>/g, '')}
                </p>
              )}

              {/* Supplement Facts — use LAST image (nutrition label) */}
              {product.images && product.images.length > 1 && (
                <div className="mb-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.8px] mb-2" style={{ color: 'var(--txt-dim)' }}>
                    Supplement Facts
                  </p>
                  <img
                    src={product.images[product.images.length - 1]}
                    alt={`${product.title} supplement facts`}
                    className="w-full rounded-[10px]"
                    style={{ background: '#fff' }}
                  />
                </div>
              )}

              {/* Full Add to Cart button */}
              <button
                onClick={() => { handleAddToCart(); setShowDetail(false); }}
                disabled={!product.available && !product.isLocalProduct}
                className="w-full py-3.5 rounded-[10px] text-[14px] font-semibold transition-all disabled:opacity-40"
                style={{ background: '#00d9ff', color: '#09090b' }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
