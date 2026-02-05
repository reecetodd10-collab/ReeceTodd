'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { UserButton, useUser } from '@clerk/nextjs';
import { Menu, X, LayoutDashboard, Crown, ShoppingCart, Trash2 } from 'lucide-react';
import PillLogo from './PillLogo';
import WaitlistModal from './WaitlistModal';
import DashboardBlockingModal from './DashboardBlockingModal';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [showDashboardModal, setShowDashboardModal] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === '/';
  const { isSignedIn } = useUser();

  // Intercept Dashboard navigation
  const handleDashboardClick = (e) => {
    e.preventDefault();
    setShowDashboardModal(true);
  };

  // Listen for cart updates
  useEffect(() => {
    const updateCartCount = (event) => {
      if (typeof window !== 'undefined') {
        if (event && event.detail && event.detail.lineItems) {
          const count = event.detail.lineItems.reduce((sum, item) => sum + item.quantity, 0);
          setCartCount(count);
        } else {
          // Fallback: try to get from cart toggle if it exists
          const cartToggleNode = document.getElementById('shopify-cart-toggle');
          if (cartToggleNode) {
            const countElement = cartToggleNode.querySelector('[data-element="count"]');
            if (countElement) {
              const count = parseInt(countElement.textContent) || 0;
              setCartCount(count);
            }
          }
        }
      }
    };

    // Initial check
    updateCartCount();
    
    // Listen for cart updates
    window.addEventListener('shopify:cart:updated', updateCartCount);
    
    // Also check periodically in case cart was updated elsewhere
    const interval = setInterval(() => {
      const cartToggleNode = document.getElementById('shopify-cart-toggle');
      if (cartToggleNode) {
        const countElement = cartToggleNode.querySelector('[data-element="count"]');
        if (countElement) {
          const count = parseInt(countElement.textContent) || 0;
          setCartCount((prevCount) => {
            if (count !== prevCount) {
              return count;
            }
            return prevCount;
          });
        }
      }
    }, 1000);

    return () => {
      window.removeEventListener('shopify:cart:updated', updateCartCount);
      clearInterval(interval);
    };
  }, []); // Empty dependency array - only run once on mount

  // Main navigation links - always visible
  const mainNavLinks = [
    { name: 'Aviera Stack', sectionId: 'aviera-stack', isHomeSection: true },
    { name: 'Aviera Fit', sectionId: 'aviera-fit', isHomeSection: true },
    { name: 'Aviera Shop', sectionId: 'aviera-shop', isHomeSection: true },
    { name: 'Aviera News', href: '/news', isCyan: true },
    { name: 'About', sectionId: 'about', isHomeSection: true },
  ];

  // Other page links (only show if not on homepage)
  const pageLinks = [];

  // Scroll spy for active section highlighting using Intersection Observer
  useEffect(() => {
    if (typeof window === 'undefined' || !isHomePage) return;

    const sections = ['hero', 'how-it-works', 'aviera-stack', 'aviera-fit', 'aviera-shop', 'goals', 'reviews', 'faq', 'contact', 'about'];
    
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observers = sections.map(sectionId => {
      const element = document.getElementById(sectionId);
      if (element) {
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        observer.observe(element);
        return observer;
      }
      return null;
    }).filter(Boolean);

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, [isHomePage]);

  const scrollToSection = (sectionId) => {
    if (typeof window === 'undefined') return;
    
    if (isHomePage) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setIsOpen(false);
      }
    } else {
      // Navigate to homepage then scroll
      router.push('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      setIsOpen(false);
    }
  };

  const isActive = (path) => pathname === path || pathname.startsWith(path);

  // Custom cart modal function
  const openCustomCartModal = async () => {
    if (typeof window === 'undefined') return;

    try {
      // Import getCheckoutUrl dynamically
      const { getCheckoutUrl } = await import('../lib/shopify');
      const { initializeShopifyCart } = await import('../lib/shopify');
      
      // Get cart data
      const cartId = localStorage.getItem('shopify_cart_id');
      let cart = null;
      let lineItems = [];
      let totalPrice = 0;

      let checkoutUrl = 'https://671mam-tn.myshopify.com/cart';

      if (cartId && window.ShopifyBuy && window.ShopifyBuy.buildClient) {
        try {
          const client = window.ShopifyBuy.buildClient({
            domain: '671mam-tn.myshopify.com',
            storefrontAccessToken: '0c065c971704ea64c81537bc81e8be16',
          });
          cart = await client.checkout.fetch(cartId);
          lineItems = cart.lineItems || [];
          totalPrice = parseFloat(cart.totalPrice?.amount || 0);
          // Use the checkout URL from the cart object
          if (cart && cart.webUrl) {
            checkoutUrl = cart.webUrl;
          }
        } catch (e) {
          console.warn('Could not fetch cart, showing empty cart:', e);
          // Try to get checkout URL anyway
          try {
            checkoutUrl = await getCheckoutUrl();
          } catch (urlError) {
            console.warn('Could not get checkout URL:', urlError);
          }
        }
      } else {
        // Try to get checkout URL even without cart
        try {
          checkoutUrl = await getCheckoutUrl();
        } catch (urlError) {
          console.warn('Could not get checkout URL:', urlError);
        }
      }

      // Create modal
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4';
      modal.style.background = 'rgba(0, 0, 0, 0.8)';
      modal.style.backdropFilter = 'blur(8px)';
      
      modal.innerHTML = `
        <div class="glass-card p-8 max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col relative" style="box-shadow: 0 0 40px rgba(0, 217, 255, 0.4); border: 1px solid rgba(0, 217, 255, 0.3);">
          <button onclick="this.closest('.fixed').remove()" class="absolute top-4 right-4 text-[var(--txt-muted)] hover:text-[var(--txt)] transition z-10">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          
          <h2 class="text-2xl font-normal text-[var(--txt)] mb-6 flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-[var(--acc)]">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            Shopping Cart ${lineItems.length > 0 ? `(${lineItems.length} ${lineItems.length === 1 ? 'item' : 'items'})` : ''}
          </h2>
          
          <div class="flex-1 overflow-y-auto mb-6" style="max-height: calc(90vh - 200px);">
            ${lineItems.length === 0 ? `
              <div class="text-center py-12">
                <p class="text-[var(--txt-muted)] text-lg font-light">Your cart is empty</p>
                <button onclick="window.location.href='/shop'" class="mt-4 px-6 py-3 bg-[var(--acc)] text-[#001018] rounded-lg font-semibold hover:bg-[var(--acc-hover)] transition">
                  Browse Products
                </button>
              </div>
            ` : `
              <div class="space-y-4">
                ${lineItems.map((item, idx) => {
                  const itemPrice = parseFloat(item.variant?.price?.amount || item.price || 0);
                  const itemTotal = itemPrice * item.quantity;
                  const itemImage = item.variant?.image?.src || item.image || null;
                  const variantTitle = item.variant?.title || '';
                  return `
                  <div class="flex items-center gap-4 p-4 bg-[var(--bg-elev-1)] rounded-lg border border-[var(--border)]">
                    ${itemImage ? `
                      <img src="${itemImage}" alt="${item.title}" class="w-16 h-16 object-contain rounded" />
                    ` : `
                      <div class="w-16 h-16 bg-[var(--bg-elev-2)] rounded flex items-center justify-center text-2xl opacity-50">💊</div>
                    `}
                    <div class="flex-1">
                      <h3 class="text-[var(--txt)] font-normal mb-1">${item.title}</h3>
                      <p class="text-sm text-[var(--txt-muted)]">Supplement</p>
                    </div>
                    <div class="flex items-center gap-3">
                      <div class="flex items-center gap-2 bg-[var(--bg-elev-2)] rounded-lg border border-[var(--border)]">
                        <button onclick="updateCartQuantity('${item.id}', ${item.quantity - 1})" class="px-3 py-1 text-[var(--acc)] hover:bg-[var(--acc)]/10 transition rounded-l-lg" ${item.quantity <= 1 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>−</button>
                        <span class="px-3 py-1 text-white text-sm font-normal">${item.quantity}</span>
                        <button onclick="updateCartQuantity('${item.id}', ${item.quantity + 1})" class="px-3 py-1 text-[var(--acc)] hover:bg-[var(--acc)]/10 transition rounded-r-lg">+</button>
                      </div>
                      <div class="text-right min-w-[80px]">
                        <p class="text-[var(--acc)] font-semibold">$${itemTotal.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                `;
                }).join('')}
              </div>
            `}
          </div>
          
          ${lineItems.length > 0 ? `
            <div class="border-t border-[var(--border)] pt-6">
              <div class="flex justify-between items-center mb-6">
                <span class="text-lg text-[var(--txt)] font-normal">Total:</span>
                <span class="text-2xl text-[var(--acc)] font-bold">$${totalPrice.toFixed(2)}</span>
              </div>
              <a href="${checkoutUrl}" target="_blank" class="block w-full px-8 py-4 bg-gradient-to-r from-[var(--acc)] to-[#00b8d4] text-[#001018] rounded-lg font-bold text-lg hover:from-[#00f0ff] hover:to-[var(--acc)] transition-all duration-300 text-center" style="box-shadow: 0 0 25px rgba(0, 217, 255, 0.5);">
                Proceed to Checkout
              </a>
            </div>
          ` : ''}
        </div>
      `;
      
      // Add updateCartQuantity function to window for inline onclick handlers
      window.updateCartQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) {
          // Remove item
          if (window.ShopifyBuy && window.ShopifyBuy.buildClient) {
            try {
              const client = window.ShopifyBuy.buildClient({
                domain: '671mam-tn.myshopify.com',
                storefrontAccessToken: '0c065c971704ea64c81537bc81e8be16',
              });
              const cartId = localStorage.getItem('shopify_cart_id');
              if (cartId) {
                await client.checkout.removeLineItems(cartId, [itemId]);
                // Refresh modal
                modal.remove();
                openCustomCartModal();
              }
            } catch (e) {
              console.error('Error removing item:', e);
            }
          }
        } else {
          // Update quantity
          if (window.ShopifyBuy && window.ShopifyBuy.buildClient) {
            try {
              const client = window.ShopifyBuy.buildClient({
                domain: '671mam-tn.myshopify.com',
                storefrontAccessToken: '0c065c971704ea64c81537bc81e8be16',
              });
              const cartId = localStorage.getItem('shopify_cart_id');
              if (cartId) {
                await client.checkout.updateLineItems(cartId, [{
                  id: itemId,
                  quantity: newQuantity
                }]);
                // Refresh modal
                modal.remove();
                openCustomCartModal();
              }
            } catch (e) {
              console.error('Error updating quantity:', e);
            }
          }
        }
      };

      document.body.appendChild(modal);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
      });
    } catch (error) {
      console.error('Error opening cart modal:', error);
      // Ultimate fallback: redirect to shop page
      router.push('/shop');
    }
  };

  return (
    <>
    <nav className="sticky top-0 z-50 glass-dark shadow-premium transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center" style={{ background: 'none', border: 'none', boxShadow: 'none' }}>
            <PillLogo size="small" />
          </Link>

          <div className="hidden lg:flex items-center space-x-2">
            {/* Main navigation links - always visible */}
            {mainNavLinks.map((link) => {
              // Handle homepage sections (scroll to section)
              if (link.isHomeSection && link.sectionId) {
                if (isHomePage) {
                  return (
                    <button
                      key={link.sectionId}
                      onClick={() => scrollToSection(link.sectionId)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        activeSection === link.sectionId
                          ? 'bg-[var(--acc)] text-[#001018] shadow-accent'
                          : 'text-[var(--txt-muted)] hover:bg-[var(--bg-elev-1)] hover:text-[var(--acc-2)]'
                      }`}
                    >
                      {link.name}
                    </button>
                  );
                } else {
                  // Navigate to homepage then scroll
                  return (
                    <button
                      key={link.sectionId}
                      onClick={() => {
                        router.push('/');
                        setTimeout(() => {
                          const element = document.getElementById(link.sectionId);
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }, 100);
                      }}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 text-[var(--txt-muted)] hover:bg-[var(--bg-elev-1)] hover:text-[var(--acc-2)]"
                    >
                      {link.name}
                    </button>
                  );
                }
              }
              
              // Handle regular links (like Aviera News)
              if (link.href) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      link.isCyan
                        ? 'text-[var(--acc)] hover:text-[var(--acc-hover)] hover:bg-[var(--acc)]/10'
                        : isActive(link.href)
                        ? 'bg-[var(--acc)] text-[#001018] shadow-accent'
                        : 'text-[var(--txt-muted)] hover:bg-[var(--bg-elev-1)] hover:text-[var(--acc-2)]'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              }
              
              return null;
            })}

            {/* Dashboard link - always visible (in cyan) */}
            <button
              onClick={handleDashboardClick}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 text-[var(--acc)] hover:text-[var(--acc-hover)] hover:bg-[var(--acc)]/10"
            >
              <LayoutDashboard size={16} />
              Dashboard
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {/* Shopping Cart Button */}
            <button
              onClick={async () => {
                // Open Shopify cart with fallback to custom modal
                if (typeof window !== 'undefined') {
                  // Try to open Shopify cart toggle first
                  const cartToggleNode = document.getElementById('shopify-cart-toggle');
                  if (cartToggleNode) {
                    const toggleButton = cartToggleNode.querySelector('button') || cartToggleNode;
                    if (toggleButton && toggleButton.click) {
                      try {
                        toggleButton.click();
                        // Wait a moment to see if Shopify cart opened
                        setTimeout(() => {
                          const shopifyCart = document.querySelector('.shopify-buy__layout-vertical, .shopify-buy__cart');
                          if (!shopifyCart || shopifyCart.style.display === 'none') {
                            // Shopify cart didn't open, use custom modal
                            openCustomCartModal();
                          }
                        }, 300);
                        return;
                      } catch (e) {
                        console.warn('Shopify cart toggle failed, using custom modal:', e);
                      }
                    }
                  }
                  
                  // Fallback: Open custom cart modal
                  openCustomCartModal();
                }
              }}
              className="relative flex items-center justify-center transition-all duration-300"
              style={{
                width: '48px',
                height: '48px',
                background: 'rgba(30, 30, 30, 0.9)',
                border: '1px solid rgba(0, 217, 255, 0.4)',
                borderRadius: '12px',
                boxShadow: '0 0 20px rgba(0, 217, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 217, 255, 0.6), 0 4px 12px rgba(0, 0, 0, 0.3)';
                e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.7)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)';
                e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.4)';
              }}
              aria-label="Shopping cart"
            >
              <ShoppingCart size={20} className="text-white" />
              {cartCount > 0 && (
                <span
                  key={`cart-badge-${cartCount}`}
                  className="absolute -top-1 -right-1 flex items-center justify-center text-xs font-bold text-white"
                  style={{
                    minWidth: cartCount > 9 ? '24px' : '20px',
                    height: '20px',
                    padding: '0 6px',
                    background: '#00d9ff',
                    borderRadius: '10px',
                    boxShadow: '0 0 10px rgba(0, 217, 255, 0.6)',
                    fontSize: '12px',
                    animation: 'pulse-once 0.3s ease-in-out',
                  }}
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            {isSignedIn ? (
              <>
                <button
                  onClick={() => setShowWaitlistModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer"
                  style={{
                    background: 'rgba(30, 30, 30, 0.9)',
                    boxShadow: '0 0 20px rgba(0, 217, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(0, 217, 255, 0.2)',
                    color: '#00E5FF'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 217, 255, 0.6), 0 4px 12px rgba(0, 0, 0, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)';
                  }}
                >
                  <Crown size={16} />
                  Get Aviera Pro
                </button>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10",
                    },
                  }}
                />
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--txt-muted)] hover:bg-[var(--bg-elev-1)] hover:text-[var(--acc-2)] transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="btn-primary"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-3 rounded-lg hover:bg-[var(--bg-elev-1)] transition min-w-[48px] min-h-[48px] flex items-center justify-center"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} className="text-[var(--txt)]" /> : <Menu size={24} className="text-[var(--txt)]" />}
          </button>
        </div>

        {isOpen && (
          <div className="lg:hidden py-4 space-y-2 border-t border-[var(--border)]">
            {/* Main navigation links - always visible */}
            {mainNavLinks.map((link) => {
              // Handle homepage sections (scroll to section)
              if (link.isHomeSection && link.sectionId) {
                return (
                  <button
                    key={link.sectionId}
                    onClick={() => {
                      scrollToSection(link.sectionId);
                      setIsOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                      activeSection === link.sectionId
                        ? 'bg-[var(--acc)] text-[#001018]'
                        : 'text-[var(--txt-muted)] hover:bg-[var(--bg-elev-1)]'
                    }`}
                  >
                    {link.name}
                  </button>
                );
              }
              
              // Handle regular links (like Aviera News)
              if (link.href) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                      link.isCyan
                        ? 'text-[var(--acc)] hover:bg-[var(--acc)]/10'
                        : isActive(link.href)
                        ? 'bg-[var(--acc)] text-[#001018]'
                        : 'text-[var(--txt-muted)] hover:bg-[var(--bg-elev-1)]'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              }
              
              return null;
            })}


            {/* Other page links */}
            {!isHomePage && pageLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive(link.path)
                    ? 'bg-[var(--acc)] text-[#001018]'
                    : 'text-[var(--txt-muted)] hover:bg-[var(--bg-elev-1)]'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Dashboard link - always visible in mobile (in cyan) */}
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsOpen(false);
                setShowDashboardModal(true);
              }}
              className="flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all w-full text-left text-[var(--acc)] hover:bg-[var(--acc)]/10"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </button>

            {/* Auth links - mobile */}
            {isSignedIn ? (
              <>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setShowWaitlistModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 w-full text-left"
                  style={{
                    background: 'rgba(30, 30, 30, 0.9)',
                    boxShadow: '0 0 20px rgba(0, 217, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(0, 217, 255, 0.2)',
                    color: '#00E5FF'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 217, 255, 0.6), 0 4px 12px rgba(0, 0, 0, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)';
                  }}
                >
                  <Crown size={18} />
                  Get Aviera Pro
                </button>
                <div className="px-4 py-3 flex items-center justify-center">
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10",
                      },
                    }}
                  />
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-lg font-medium text-[var(--txt-muted)] hover:bg-[var(--bg-elev-1)] transition text-center"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 bg-[var(--acc)] text-[#001018] rounded-lg font-semibold text-center hover:bg-blue-600 hover:text-white transition"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>

    {/* Waitlist Modal */}
    <WaitlistModal
      isOpen={showWaitlistModal}
      onClose={() => setShowWaitlistModal(false)}
    />

    {/* Dashboard Blocking Modal */}
    <DashboardBlockingModal
      isOpen={showDashboardModal}
      onClose={() => setShowDashboardModal(false)}
    />
    </>
  );
}

