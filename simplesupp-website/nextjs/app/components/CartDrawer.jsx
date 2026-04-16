'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import {
  fetchCart,
  updateCartQuantity,
  removeFromCart,
  getCheckoutUrl,
} from '../lib/shopify';

const CYAN = '#00e5ff';
const RED = '#FF3B3B';
const SHOPIFY_CART_URL = 'https://671mam-tn.myshopify.com/cart';

const FONTS = {
  oswald: { fontFamily: 'var(--font-oswald), Oswald, sans-serif' },
  mono: { fontFamily: 'var(--font-space-mono), Space Mono, monospace' },
  body: { fontFamily: 'Montserrat, sans-serif' },
};

/**
 * CartDrawer — right-side slide-in showing current Shopify cart contents.
 *
 * Syncs with Shopify Buy SDK via fetchCart/updateCartQuantity/removeFromCart.
 * Listens to window 'shopify:cart:updated' to stay in sync with add-to-cart
 * actions on other pages/components.
 *
 * InitiateCheckout pixel event fires inside getCheckoutUrl() when the user
 * taps the Checkout button.
 */
export default function CartDrawer({ isOpen, onClose }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mutating, setMutating] = useState(false);

  // Load cart when drawer opens
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    setLoading(true);
    fetchCart()
      .then((c) => {
        if (!cancelled) setCart(c);
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  // Listen for cart updates from anywhere else in the app
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = (e) => {
      if (e?.detail?.cart) {
        setCart(e.detail.cart);
      } else {
        // Fallback: refetch
        fetchCart().then(setCart).catch(console.error);
      }
    };
    window.addEventListener('shopify:cart:updated', handler);
    return () => window.removeEventListener('shopify:cart:updated', handler);
  }, []);

  const lineItems = cart?.lineItems || [];
  const subtotal = lineItems.reduce((sum, item) => {
    const price = parseFloat(item.variant?.price?.amount || 0);
    return sum + price * item.quantity;
  }, 0);

  const handleQtyChange = async (lineItemId, newQty) => {
    if (newQty < 1 || mutating) return;
    setMutating(true);
    try {
      const updated = await updateCartQuantity(lineItemId, newQty);
      setCart(updated);
    } catch (err) {
      console.error('Failed to update quantity:', err);
    } finally {
      setMutating(false);
    }
  };

  const handleRemove = async (lineItemId) => {
    if (mutating) return;
    setMutating(true);
    try {
      const updated = await removeFromCart(lineItemId);
      setCart(updated);
    } catch (err) {
      console.error('Failed to remove item:', err);
    } finally {
      setMutating(false);
    }
  };

  const handleCheckout = async () => {
    try {
      // getCheckoutUrl() fires trackInitiateCheckout() internally
      const url = await getCheckoutUrl();
      if (typeof window !== 'undefined') {
        window.location.href = url;
      }
    } catch (err) {
      console.error('Failed to get checkout URL:', err);
      if (typeof window !== 'undefined') {
        window.location.href = SHOPIFY_CART_URL;
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[59]"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
          />

          {/* Drawer panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-[60] w-full sm:w-[420px] flex flex-col"
            style={{
              background: '#0a0a0a',
              borderLeft: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '-8px 0 40px rgba(0,0,0,0.6)',
            }}
            role="dialog"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} style={{ color: CYAN }} />
                <span
                  style={{
                    ...FONTS.oswald,
                    fontSize: '13px',
                    fontWeight: 700,
                    letterSpacing: '0.3em',
                    color: '#fff',
                    textTransform: 'uppercase',
                  }}
                >
                  Your Cart
                </span>
                {lineItems.length > 0 && (
                  <span
                    style={{
                      ...FONTS.mono,
                      fontSize: '10px',
                      color: 'rgba(255,255,255,0.5)',
                      letterSpacing: '0.1em',
                    }}
                  >
                    ({lineItems.reduce((s, i) => s + i.quantity, 0)})
                  </span>
                )}
              </div>
              <motion.button
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
                onClick={onClose}
                aria-label="Close cart"
                className="bg-transparent border-none cursor-pointer p-2"
                style={{ color: 'rgba(255,255,255,0.8)' }}
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div
                  className="flex items-center justify-center py-16"
                  style={{ ...FONTS.mono, fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}
                >
                  Loading cart…
                </div>
              ) : lineItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <ShoppingBag size={40} style={{ color: 'rgba(255,255,255,0.15)', marginBottom: 16 }} />
                  <p
                    style={{
                      ...FONTS.oswald,
                      fontSize: '16px',
                      fontWeight: 700,
                      color: '#fff',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: 6,
                    }}
                  >
                    Cart is empty
                  </p>
                  <p
                    style={{
                      ...FONTS.mono,
                      fontSize: '11px',
                      color: 'rgba(255,255,255,0.45)',
                      lineHeight: 1.6,
                      maxWidth: 260,
                    }}
                  >
                    Add supplements from any product page to get started.
                  </p>
                </div>
              ) : (
                <ul className="px-5 py-4 space-y-4">
                  {lineItems.map((item) => {
                    const price = parseFloat(item.variant?.price?.amount || 0);
                    const lineTotal = (price * item.quantity).toFixed(2);
                    const image = item.variant?.image?.src || null;
                    const variantTitle = item.variant?.title || '';
                    const showVariant = variantTitle && variantTitle.toLowerCase() !== 'default title';
                    return (
                      <li
                        key={item.id}
                        className="flex gap-3 pb-4"
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                      >
                        {/* Thumbnail */}
                        <div
                          className="flex-shrink-0 w-20 h-20 rounded-md flex items-center justify-center overflow-hidden"
                          style={{ background: '#fff' }}
                        >
                          {image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={image}
                              alt={item.title}
                              className="w-full h-full object-contain"
                              style={{ padding: 6 }}
                            />
                          ) : (
                            <span style={{ fontSize: 24, opacity: 0.3 }}>💊</span>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h3
                                className="truncate"
                                style={{
                                  ...FONTS.oswald,
                                  fontSize: '13px',
                                  fontWeight: 700,
                                  color: '#fff',
                                  textTransform: 'uppercase',
                                  lineHeight: 1.2,
                                }}
                              >
                                {item.title}
                              </h3>
                              {showVariant && (
                                <p
                                  style={{
                                    ...FONTS.mono,
                                    fontSize: '10px',
                                    color: 'rgba(255,255,255,0.45)',
                                    letterSpacing: '0.05em',
                                    marginTop: 3,
                                  }}
                                >
                                  {variantTitle}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => handleRemove(item.id)}
                              disabled={mutating}
                              aria-label={`Remove ${item.title}`}
                              className="bg-transparent border-none cursor-pointer p-1 flex-shrink-0"
                              style={{
                                color: RED,
                                opacity: mutating ? 0.4 : 0.7,
                                transition: 'opacity 0.2s',
                              }}
                              onMouseEnter={(e) => {
                                if (!mutating) e.currentTarget.style.opacity = '1';
                              }}
                              onMouseLeave={(e) => {
                                if (!mutating) e.currentTarget.style.opacity = '0.7';
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            {/* Quantity stepper */}
                            <div
                              className="inline-flex items-center"
                              style={{
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 6,
                              }}
                            >
                              <button
                                onClick={() => handleQtyChange(item.id, item.quantity - 1)}
                                disabled={mutating || item.quantity <= 1}
                                aria-label="Decrease quantity"
                                className="flex items-center justify-center border-none bg-transparent cursor-pointer"
                                style={{
                                  width: 28,
                                  height: 28,
                                  color: CYAN,
                                  opacity: item.quantity <= 1 ? 0.3 : 1,
                                }}
                              >
                                <Minus size={12} />
                              </button>
                              <span
                                style={{
                                  ...FONTS.oswald,
                                  fontSize: '13px',
                                  fontWeight: 700,
                                  color: '#fff',
                                  minWidth: 20,
                                  textAlign: 'center',
                                }}
                              >
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQtyChange(item.id, item.quantity + 1)}
                                disabled={mutating}
                                aria-label="Increase quantity"
                                className="flex items-center justify-center border-none bg-transparent cursor-pointer"
                                style={{ width: 28, height: 28, color: CYAN }}
                              >
                                <Plus size={12} />
                              </button>
                            </div>

                            {/* Line total */}
                            <span
                              style={{
                                ...FONTS.oswald,
                                fontSize: '14px',
                                fontWeight: 700,
                                color: CYAN,
                              }}
                            >
                              ${lineTotal}
                            </span>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Footer */}
            {lineItems.length > 0 && (
              <div
                className="px-5 py-4"
                style={{ borderTop: '1px solid rgba(255,255,255,0.08)', background: '#050505' }}
              >
                <div className="flex items-baseline justify-between mb-4">
                  <span
                    style={{
                      ...FONTS.mono,
                      fontSize: '10px',
                      color: 'rgba(255,255,255,0.5)',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Subtotal
                  </span>
                  <span
                    style={{
                      ...FONTS.oswald,
                      fontSize: '22px',
                      fontWeight: 700,
                      color: '#fff',
                    }}
                  >
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <p
                  style={{
                    ...FONTS.mono,
                    fontSize: '9px',
                    color: 'rgba(255,255,255,0.35)',
                    lineHeight: 1.5,
                    marginBottom: 12,
                    letterSpacing: '0.05em',
                  }}
                >
                  Shipping and taxes calculated at checkout.
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={SHOPIFY_CART_URL}
                    className="flex items-center justify-center no-underline transition-all duration-200"
                    style={{
                      ...FONTS.oswald,
                      fontSize: '12px',
                      fontWeight: 700,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      padding: '12px 14px',
                      background: 'transparent',
                      color: '#fff',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: 8,
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                    }}
                  >
                    View Cart
                  </a>
                  <button
                    onClick={handleCheckout}
                    className="border-none cursor-pointer transition-all duration-200"
                    style={{
                      ...FONTS.oswald,
                      fontSize: '12px',
                      fontWeight: 700,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      padding: '12px 14px',
                      background: CYAN,
                      color: '#001018',
                      borderRadius: 8,
                      boxShadow: '0 4px 20px rgba(0,229,255,0.35)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 6px 28px rgba(0,229,255,0.55)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,229,255,0.35)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Checkout
                  </button>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
