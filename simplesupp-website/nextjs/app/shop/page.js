'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, ShoppingCart, Check, Dumbbell, Flame, Zap, Brain, Moon, Heart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { products, PRODUCT_CATEGORIES, getProductsByCategory } from '../data/products';
import GlassCard from '../components/shared/GlassCard';
import ShopifyProductCard from '../components/ShopifyProductCard';
import { fetchShopifyProducts, initializeShopifyCart, addMultipleToCart } from '../lib/shopify';

// Component that handles URL params
function ShopContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(
    tabParam === 'stacks' ? 'stacks' : 
    tabParam === 'apparel' ? 'apparel' : 
    'products'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [shopifyProducts, setShopifyProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [shopifyCartInitialized, setShopifyCartInitialized] = useState(false);

  // Handle URL tab parameter changes (e.g., /shop?tab=stacks)
  useEffect(() => {
    if (tabParam === 'stacks') {
      setActiveTab('stacks');
    } else if (tabParam === 'products') {
      setActiveTab('products');
    }
  }, [tabParam]);

  // Fetch Shopify products when products tab is active
  useEffect(() => {
    if (activeTab === 'products' && shopifyProducts.length === 0) {
      setIsLoadingProducts(true);
      fetchShopifyProducts()
        .then((products) => {
          setShopifyProducts(products);
          setIsLoadingProducts(false);
        })
        .catch((error) => {
          console.error('Error fetching Shopify products:', error);
          setIsLoadingProducts(false);
        });
    }
  }, [activeTab, shopifyProducts.length]);

  // Initialize Shopify cart SDK for cart functionality
  useEffect(() => {
    if (typeof window !== 'undefined' && !shopifyCartInitialized) {
      initializeShopifyCart()
        .then(async (client) => {
          setShopifyCartInitialized(true);
          
          // Get or create cart to ensure we have a cart ID
          let cart = null;
          try {
            // Get existing cart ID from localStorage
            const cartId = localStorage.getItem('shopify_cart_id');
            if (cartId) {
              try {
                cart = await client.checkout.fetch(cartId);
              } catch (e) {
                // Cart doesn't exist, create new one
                cart = await client.checkout.create();
                localStorage.setItem('shopify_cart_id', cart.id);
              }
            } else {
              cart = await client.checkout.create();
              localStorage.setItem('shopify_cart_id', cart.id);
            }
          } catch (e) {
            console.error('Error getting cart:', e);
            // Create new cart if fetch fails
            try {
              cart = await client.checkout.create();
              localStorage.setItem('shopify_cart_id', cart.id);
            } catch (createError) {
              console.error('Error creating cart:', createError);
            }
          }
          
          // NOTE: If cart errors persist, restart Next.js dev server (Ctrl+C, npm run dev)
          // BEFORE LAUNCH: Test full checkout with Shopify test card (4242 4242 4242 4242)
          // Configure Shopify Payments in Admin → Settings → Payments
          
          // Suppress Shopify SDK console errors
          const originalError = console.error;
          console.error = (...args) => {
            const errorMsg = args[0]?.toString() || '';
            if (errorMsg.includes('componentTypes') || errorMsg.includes('updateComponent') || errorMsg.includes('is not a constructor')) {
              return; // Suppress Shopify SDK errors
            }
            originalError(...args);
          };
          
          // Initialize cart UI components - wait for DOM to be ready
          setTimeout(() => {
            try {
              if (!window.ShopifyBuy || !window.ShopifyBuy.UI) {
                console.warn('ShopifyBuy SDK not loaded. Cart UI will not be available.');
                return;
              }

              window.ShopifyBuy.UI.onReady(client).then((ui) => {
                try {
                  // Initialize cart toggle button (floating button) - only if it doesn't already exist
                  const cartToggleNode = document.getElementById('shopify-cart-toggle');
                  if (cartToggleNode && cart && !cartToggleNode.hasAttribute('data-shopify-component')) {
                    try {
                      ui.createComponent('cartToggle', {
                        node: cartToggleNode,
                        cart: cart,
                        options: {
                          toggle: {
                            styles: {
                              toggle: {
                                'background-color': '#00d9ff',
                                'border-radius': '50%',
                                'box-shadow': '0 0 30px rgba(0, 217, 255, 0.6)',
                              },
                              count: {
                                'background-color': '#ffffff',
                                'color': '#1a1a1a',
                                'font-weight': '600',
                              }
                            }
                          }
                        }
                      }).then(() => {
                        cartToggleNode.setAttribute('data-shopify-component', 'true');
                        console.log('Cart toggle initialized successfully');
                      }).catch((err) => {
                        console.error('Cart toggle creation failed:', err);
                        console.warn('Falling back to custom cart implementation');
                      });
                    } catch (createError) {
                      console.error('Error creating cart toggle component:', createError);
                      console.warn('Falling back to custom cart implementation');
                    }
                  } else if (cartToggleNode && cartToggleNode.hasAttribute('data-shopify-component')) {
                    console.log('Cart toggle already initialized');
                  } else {
                    console.warn('Cart toggle node not found or cart is null');
                  }

                  // Initialize cart overlay (modal) - only if it doesn't already exist
                  const cartNode = document.getElementById('shopify-cart');
                  if (cartNode && cart && !cartNode.hasAttribute('data-shopify-component')) {
                    try {
                      ui.createComponent('cart', {
                        node: cartNode,
                        cart: cart,
                        options: {
                          cart: {
                            styles: {
                              button: {
                                'background-color': '#00d9ff',
                                ':hover': {
                                  'background-color': '#00c3e6'
                                },
                                'border-radius': '12px',
                                'font-weight': '600',
                              },
                              'close-button': {
                                'color': '#ffffff',
                              },
                              'cart': {
                                'display': 'none', // Hide by default, only show when opened
                              }
                            },
                            text: {
                              title: 'Shopping Cart',
                              empty: 'Your cart is empty',
                              button: 'Checkout',
                              total: 'Total',
                              subtotal: 'Subtotal'
                            },
                            toggle: {
                              // Don't auto-open cart
                              'iframe': false
                            }
                          }
                        }
                      }).then(() => {
                        cartNode.setAttribute('data-shopify-component', 'true');
                        // Hide cart overlay by default and ensure it's closed
                        setTimeout(() => {
                          const cartOverlay = cartNode.querySelector('.shopify-buy__cart');
                          if (cartOverlay) {
                            cartOverlay.style.display = 'none';
                            cartOverlay.classList.remove('is-open');
                            cartOverlay.setAttribute('data-state', 'closed');
                          }
                          // Also try to close via Shopify's API if available
                          if (window.ShopifyBuy && window.ShopifyBuy.UI) {
                            try {
                              const cartComponent = ui.components.cart;
                              if (cartComponent && cartComponent.close) {
                                cartComponent.close();
                              }
                            } catch (e) {
                              // Ignore errors
                            }
                          }
                        }, 100);
                        console.log('Cart overlay initialized successfully');
                      }).catch((err) => {
                        console.error('Cart overlay creation failed:', err);
                        console.warn('Falling back to custom cart implementation');
                      });
                    } catch (createError) {
                      console.error('Error creating cart overlay component:', createError);
                      console.warn('Falling back to custom cart implementation');
                    }
                  } else if (cartNode && cartNode.hasAttribute('data-shopify-component')) {
                    console.log('Cart overlay already initialized');
                  } else {
                    console.warn('Cart node not found or cart is null');
                  }
                } catch (uiError) {
                  console.error('Error creating Shopify UI components:', uiError);
                  console.warn('Falling back to custom cart implementation');
                }
              }).catch((error) => {
                console.error('Error initializing Shopify UI:', error);
                console.warn('Falling back to custom cart implementation');
              });
            } catch (error) {
              console.error('Error in cart initialization timeout:', error);
            }
          }, 100);
        })
        .catch((error) => {
          console.error('Error initializing Shopify cart:', error);
        });
    }
  }, [shopifyCartInitialized]);

  // Category options
  const CATEGORIES = {
    all: 'All Products',
    'Performance': 'Performance',
    'Health & Wellness': 'Health & Wellness',
    'Recovery & Sleep': 'Recovery & Sleep',
    'Focus & Energy': 'Focus & Energy',
    'Beauty & Anti-Aging': 'Beauty & Anti-Aging',
    'Weight Management': 'Weight Management',
  };

  // Filter and sort Shopify products
  const filteredShopifyProducts = useMemo(() => {
    let filtered = [...shopifyProducts];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        (p.tags && p.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
      default:
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return filtered;
  }, [shopifyProducts, searchQuery, selectedCategory, sortBy]);

  // Category counts from Shopify products
  const categoryCounts = useMemo(() => {
    const counts = { all: shopifyProducts.length };
    Object.keys(CATEGORIES).forEach(cat => {
      if (cat !== 'all') {
        counts[cat] = shopifyProducts.filter(p => p.category === cat).length;
      }
    });
    return counts;
  }, [shopifyProducts]);


  return (
    <div className="min-h-screen relative py-16 overflow-hidden">
      {/* Background */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          backgroundImage: 'url(/images/shop/shop-background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(4px)',
          WebkitFilter: 'blur(4px)',
          opacity: 0.25,
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div 
            className="inline-block px-8 py-6 rounded-2xl mb-4 relative transition-all duration-300 ease-in-out hover:scale-[1.02] cursor-default"
            style={{
              background: 'rgba(30, 30, 30, 0.85)',
              boxShadow: '0 0 30px rgba(0, 255, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(0, 229, 255, 0.2)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 50px rgba(0, 255, 255, 0.6), 0 4px 12px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)';
            }}
          >
            <h1 className="text-5xl md:text-6xl font-normal text-[var(--txt)] tracking-tight">
            Aviera Shop
          </h1>
          </div>
          <p className="text-xl text-[var(--txt-muted)] mb-3 font-light leading-relaxed">
            Premium Supplements for Premium Goals
          </p>
          <p className="text-sm text-[var(--txt-muted)]/80 font-light tracking-wide">
            {activeTab === 'products' 
              ? isLoadingProducts 
                ? 'Loading products...' 
                : `${filteredShopifyProducts.length}+ products available`
              : activeTab === 'apparel'
              ? 'Coming soon...'
              : '6 pre-made stacks available'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8 gap-4">
          <button
            onClick={() => setActiveTab('apparel')}
            className={`px-8 py-3 rounded-xl font-normal transition-all duration-300 ${
              activeTab === 'apparel'
                ? 'bg-[var(--acc)] text-[#001018] shadow-lg shadow-[var(--acc)]/30'
                : 'bg-[var(--bg-elev-1)] text-[var(--txt-muted)] border-2 border-[var(--border)] hover:border-[var(--acc)]/50'
            }`}
          >
            Aviera Apparel
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-8 py-3 rounded-xl font-normal transition-all duration-300 ${
              activeTab === 'products'
                ? 'bg-[var(--acc)] text-[#001018] shadow-lg shadow-[var(--acc)]/30'
                : 'bg-[var(--bg-elev-1)] text-[var(--txt-muted)] border-2 border-[var(--border)] hover:border-[var(--acc)]/50'
            }`}
          >
            Browse Products
          </button>
          <button
            onClick={() => setActiveTab('stacks')}
            className={`px-8 py-3 rounded-xl font-normal transition-all duration-300 ${
              activeTab === 'stacks'
                ? 'bg-[var(--acc)] text-[#001018] shadow-lg shadow-[var(--acc)]/30'
                : 'bg-[var(--bg-elev-1)] text-[var(--txt-muted)] border-2 border-[var(--border)] hover:border-[var(--acc)]/50'
            }`}
          >
            Aviera Stacks
          </button>
        </div>

        {/* Search and Filters - Only show for products tab */}
        {activeTab === 'products' && (
          <div className="glass-card p-6 mb-10">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--txt-muted)]" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-[var(--bg-elev-1)] border-2 border-[var(--border)] text-[var(--txt)] focus:border-[var(--acc)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] font-normal"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--txt-muted)]" size={20} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-[var(--bg-elev-1)] border-2 border-[var(--border)] text-[var(--txt)] focus:border-[var(--acc)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] appearance-none font-normal"
                >
                  {Object.entries(CATEGORIES).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label} {key !== 'all' && `(${categoryCounts[key] || 0})`}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[var(--bg-elev-1)] border-2 border-[var(--border)] text-[var(--txt)] focus:border-[var(--acc)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] appearance-none font-normal"
            >
              <option value="name">Sort: Name (A-Z)</option>
              <option value="price-low">Sort: Price (Low to High)</option>
              <option value="price-high">Sort: Price (High to Low)</option>
            </select>
          </div>
        </div>
        )}

        {/* Aviera Apparel Section */}
        {activeTab === 'apparel' && (
          <AvieraApparelSection />
        )}

        {/* Aviera Stacks Section */}
        {activeTab === 'stacks' && (
          <AvieraStacksSection shopifyProducts={shopifyProducts} />
        )}

        {/* Custom Shopify Product Cards - Only show for products tab */}
        {activeTab === 'products' && (
          <div>
            {isLoadingProducts ? (
              <div className="text-center py-12">
                <div className="inline-block w-12 h-12 border-4 border-[var(--acc)] border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-[var(--txt-muted)] text-lg font-light">Loading products...</p>
              </div>
            ) : filteredShopifyProducts.length === 0 ? (
          <div className="text-center py-12">
                <p className="text-[var(--txt-muted)] text-lg font-light">No products found matching your search.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredShopifyProducts.map((product) => (
                  <ShopifyProductCard key={product.id} product={product} />
            ))}
              </div>
            )}
          </div>
        )}

        {/* Shopify Cart Toggle Button - Floating button */}
        <div id="shopify-cart-toggle" className="fixed bottom-8 right-8 z-50"></div>

        {/* Shopify Cart Overlay */}
        <div id="shopify-cart"></div>

      </div>
    </div>
  );
}

// Main export with Suspense wrapper for useSearchParams
export default function Shop() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-[var(--acc)] border-t-transparent rounded-full animate-spin"></div></div>}>
      <ShopContent />
    </Suspense>
  );
}

// Helper function to find Shopify product by name/keywords
// searchTerms can be:
// - Array of strings: all must match (e.g., ['whey', 'protein', 'isolate'])
// - Array with alternatives: first try all, then try any (e.g., ['beta-alanine', 'beta alanine', 'bcaa'])
function findProductByName(products, searchTerms) {
  if (!products || products.length === 0) return null;
  
  const searchLower = searchTerms.map(term => term.toLowerCase());
  
  // First pass: Try to match ALL terms (most specific)
  for (const product of products) {
    const titleLower = product.title.toLowerCase();
    const descriptionLower = (product.description || '').toLowerCase();
    const tagsLower = (product.tags || []).map(tag => tag.toLowerCase()).join(' ');
    const allText = `${titleLower} ${descriptionLower} ${tagsLower}`;
    
    // Check if ALL search terms are found
    const allTermsFound = searchLower.every(term => 
      allText.includes(term)
    );
    
    if (allTermsFound) {
      return product;
    }
  }
  
  // Second pass: Try matching any term (for alternatives like "beta-alanine" OR "bcaa")
  for (const product of products) {
    const titleLower = product.title.toLowerCase();
    const descriptionLower = (product.description || '').toLowerCase();
    const tagsLower = (product.tags || []).map(tag => tag.toLowerCase()).join(' ');
    const allText = `${titleLower} ${descriptionLower} ${tagsLower}`;
    
    // Check if any search term matches
    for (const term of searchLower) {
      if (allText.includes(term)) {
        return product;
      }
    }
  }
  
  return null;
}

// Aviera Apparel Section Component
function AvieraApparelSection() {
  const apparelItems = [
    {
      id: 'hat',
      name: 'Aviera Hat',
      description: 'Premium quality cap featuring the Aviera logo. Perfect for your workouts and everyday wear.',
      price: 0,
      image: null,
    },
    {
      id: 'shirt',
      name: 'Aviera Shirt',
      description: 'Comfortable and stylish t-shirt with the Aviera brand. Made from high-quality materials.',
      price: 0,
      image: null,
    },
  ];

  return (
    <div>
      {/* Coming Soon Banner */}
      <div 
        className="glass-card p-8 mb-10 text-center transition-all duration-300"
        style={{
          background: 'rgba(30, 30, 30, 0.95)',
          border: '1px solid rgba(0, 217, 255, 0.4)',
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 30px rgba(0, 217, 255, 0.3)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 40px rgba(0, 217, 255, 0.5)';
          e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 30px rgba(0, 217, 255, 0.3)';
          e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.4)';
        }}
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-[var(--acc)]/20 rounded-full mb-6">
          <Sparkles className="text-[var(--acc)]" size={48} />
        </div>
        <h2 
          className="text-3xl md:text-4xl font-normal text-[var(--acc)] mb-4"
          style={{
            textShadow: '0 0 20px rgba(0, 217, 255, 0.6)',
            filter: 'drop-shadow(0 0 10px rgba(0, 217, 255, 0.4))'
          }}
        >
          Coming Soon...
        </h2>
        <p className="text-lg text-[var(--txt-muted)] font-light max-w-2xl mx-auto">
          We're working on bringing you premium Aviera apparel. Stay tuned for updates!
        </p>
      </div>

      {/* Apparel Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apparelItems.map((item) => (
          <motion.div
            key={item.id}
            className="glass-card overflow-hidden transition-all group"
            style={{
              background: 'rgba(30, 30, 30, 0.9)',
              border: '1px solid rgba(0, 217, 255, 0.3)',
              borderRadius: '20px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
            }}
            whileHover={{ 
              y: -4
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 25px rgba(0, 217, 255, 0.4)';
              e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
              e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
            }}
          >
            {/* Product Image Placeholder */}
            <div className="h-64 bg-[var(--bg-elev-1)] flex items-center justify-center border-b border-[var(--border)] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--acc)]/10 via-transparent to-[var(--acc)]/5"></div>
              <div className="text-6xl opacity-20 relative z-10">
                {item.id === 'hat' ? '🧢' : '👕'}
              </div>
              {/* Coming Soon Badge */}
              <div className="absolute top-4 right-4 z-10">
                <span 
                  className="px-3 py-1 text-xs font-normal rounded-full"
                  style={{
                    background: 'rgba(0, 217, 255, 0.2)',
                    border: '1px solid rgba(0, 217, 255, 0.5)',
                    color: '#00d9ff',
                    boxShadow: '0 0 15px rgba(0, 217, 255, 0.4)',
                    textShadow: '0 0 10px rgba(0, 217, 255, 0.6)'
                  }}
                >
                  Coming Soon
                </span>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-6">
              <h3 className="text-xl font-normal text-[var(--txt)] mb-3">{item.name}</h3>
              <p className="text-sm text-[var(--txt-muted)] mb-6 leading-relaxed font-light">
                {item.description}
              </p>

              {/* Price Placeholder */}
              <div className="mb-6 pt-4 border-t border-[var(--border)]">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-normal text-[var(--txt-muted)]/50">Price TBD</span>
                </div>
              </div>

              {/* CTA Button - Disabled */}
              <button
                disabled
                className="w-full font-semibold flex items-center justify-center gap-2 text-white transition-all duration-300 ease-in-out cursor-not-allowed opacity-50"
                style={{
                  background: 'rgba(30, 30, 30, 0.9)',
                  border: '1px solid rgba(0, 217, 255, 0.3)',
                  borderRadius: '12px',
                  padding: '14px 28px',
                  fontSize: '16px',
                  boxShadow: '0 0 15px rgba(0, 217, 255, 0.2)'
                }}
              >
                <ShoppingCart size={18} />
                Coming Soon
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Aviera Stacks Section Component
function AvieraStacksSection({ shopifyProducts = [] }) {
  const [addingStack, setAddingStack] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [hoveredSupplement, setHoveredSupplement] = useState(null);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  // Stack definitions with product search terms
  const stacks = [
    {
      id: 'muscle',
      name: 'Muscle Builder Stack',
      goal: 'Build Muscle & Strength',
      icon: Dumbbell,
      supplements: [
        'Creatine Monohydrate',
        'Advanced 100% Whey Protein Isolate (Chocolate)',
        'BCAA Post Workout Powder (Honeydew/Watermelon)',
        'Nitric Shock Pre-Workout Powder (Fruit Punch)'
      ],
      productSearchTerms: [
        ['creatine', 'monohydrate'],
        ['whey', 'protein', 'isolate', 'chocolate'],
        ['bcaa', 'post workout', 'honeydew', 'watermelon'],
        ['nitric shock', 'pre-workout', 'fruit punch']
      ],
      originalPrice: 137.62,
      discountedPrice: 116.99,
      description: 'Maximize muscle growth and strength gains with this powerful combination. These supplements work together to enhance power output, support muscle repair, and improve endurance for longer, more intense workouts.',
    },
    {
      id: 'fatloss',
      name: 'Fat Loss Stack',
      goal: 'Lose Fat & Get Lean',
      icon: Flame,
      supplements: [
        'Fat Burner with MCT',
        'Keto BHB',
        'Apple Cider Vinegar Capsules'
      ],
      productSearchTerms: [
        ['fat burner', 'mct'],
        ['keto', 'bhb'],
        ['apple cider vinegar', 'acv']
      ],
      originalPrice: 91.88,
      discountedPrice: 82.99,
      description: 'Accelerate fat burning and boost metabolism naturally. This stack provides thermogenic effects, transports fat for energy conversion, and increases energy expenditure to help you achieve a leaner physique.',
    },
    {
      id: 'athletic',
      name: 'Athletic Performance Stack',
      goal: 'Athletic Performance',
      icon: Zap,
      supplements: [
        'Creatine Monohydrate',
        'Nitric Shock Pre-Workout Powder (Fruit Punch)',
        'BCAA Post Workout Powder (Honeydew/Watermelon)',
        'Hydration Powder (Lemonade)'
      ],
      productSearchTerms: [
        ['creatine', 'monohydrate'],
        ['nitric shock', 'pre-workout', 'fruit punch'],
        ['bcaa', 'post workout', 'honeydew', 'watermelon'],
        ['hydration', 'powder', 'lemonade']
      ],
      originalPrice: 118.78,
      discountedPrice: 100.99,
      description: 'Enhance speed, endurance, and explosiveness for peak athletic performance. This combination boosts power output, delays fatigue, and maintains optimal hydration during intense training and competition.',
    },
    {
      id: 'focus',
      name: 'Focus & Energy Stack',
      goal: 'Focus & Energy',
      icon: Brain,
      supplements: [
        'Alpha Energy',
        'Flow State Nootropic Powder (Sour Gummi Worm)',
        'Energy Powder (Fruit Punch)'
      ],
      productSearchTerms: [
        ['alpha energy'],
        ['flow state', 'nootropic', 'sour gummi worm'],
        ['energy', 'powder', 'fruit punch']
      ],
      originalPrice: 113.38,
      discountedPrice: 102.99,
      description: 'Enhance mental clarity and sustained energy throughout your day. This stack provides clean alertness without crashes, reduces stress, and improves cognitive function for maximum productivity.',
    },
    {
      id: 'sleep',
      name: 'Sleep & Recovery Stack',
      goal: 'Sleep & Recovery',
      icon: Moon,
      supplements: [
        'Sleep Formula',
        'Magnesium Glycinate',
        'Ashwagandha'
      ],
      productSearchTerms: [
        ['sleep formula'],
        ['magnesium', 'glycinate'],
        ['ashwagandha']
      ],
      originalPrice: 70.95,
      discountedPrice: 63.99,
      description: 'Promote deep rest and faster recovery from intense training. This combination supports muscle relaxation, regulates sleep cycles, and reduces stress for optimal rest and repair.',
    },
    {
      id: 'longevity',
      name: 'Health & Longevity Stack',
      goal: 'Health & Longevity',
      icon: Heart,
      supplements: [
        'Omega-3 EPA 180mg + DHA 120mg',
        'CoQ10 Ubiquinone',
        'Complete Multivitamin'
      ],
      productSearchTerms: [
        ['omega', 'epa', 'dha'],
        ['coq10', 'ubiquinone'],
        ['multivitamin', 'complete']
      ],
      originalPrice: 84.38,
      discountedPrice: 75.99,
      description: 'Support long-term health and disease prevention with essential nutrients. This stack promotes heart and brain health, strengthens immunity, and provides cellular energy and antioxidant protection.',
    },
  ];

  const handleAddStack = async (stack) => {
    if (!shopifyProducts || shopifyProducts.length === 0) {
      alert('Products are still loading. Please try again in a moment.');
      return;
    }

    setAddingStack(stack.id);
    setSuccessMessage(null);

    try {
      // Find products for this stack
      const productsToAdd = [];
      const foundProducts = [];
      const missingProducts = [];
      
      for (let i = 0; i < stack.productSearchTerms.length; i++) {
        const searchTerms = stack.productSearchTerms[i];
        const product = findProductByName(shopifyProducts, searchTerms);
        
        if (product && product.variantId && product.available) {
          productsToAdd.push({
            variantId: product.variantId,
            quantity: 1,
          });
          foundProducts.push(stack.supplements[i] || `Product ${i + 1}`);
        } else {
          missingProducts.push(stack.supplements[i] || `Product ${i + 1}`);
        }
      }

      if (productsToAdd.length === 0) {
        alert(`Sorry, none of the products in the ${stack.name} are currently available.`);
        setAddingStack(null);
        return;
      }

      if (missingProducts.length > 0) {
        console.warn(`Some products not found for ${stack.name}:`, missingProducts);
        // Still add what we found, but show a message
        if (productsToAdd.length < stack.productSearchTerms.length) {
          const message = `Added ${productsToAdd.length} of ${stack.productSearchTerms.length} products. Some items may be unavailable.`;
          console.log(message);
        }
      }

      // Add all products to cart
      await addMultipleToCart(productsToAdd);

      // Show success message
      setSuccessMessage({
        stackId: stack.id,
        count: productsToAdd.length,
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);

    } catch (error) {
      console.error('Error adding stack to cart:', error);
      alert('Failed to add stack to cart. Please try again.');
    } finally {
      setAddingStack(null);
    }
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
      {stacks.map((stack) => {
        const Icon = stack.icon;

        return (
          <motion.div
            key={stack.id}
            className="glass-card overflow-hidden transition-all group"
            style={{
              boxShadow: '0 0 20px rgba(0, 229, 255, 0.15), 0 4px 12px rgba(0, 0, 0, 0.2)'
            }}
            whileHover={{ 
              y: -4
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 229, 255, 0.3), 0 8px 20px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 229, 255, 0.15), 0 4px 12px rgba(0, 0, 0, 0.2)';
            }}
          >
            {/* Stack Header with Icon */}
            <div className="p-6 bg-[var(--bg-elev-1)] border-b border-[var(--border)]">
              <div className="flex items-center gap-4 mb-4">
                <div 
                  className="relative transition-all duration-300 ease-in-out flex items-center justify-center"
                  style={{
                    background: 'rgba(30, 30, 30, 0.9)',
                    border: '1px solid rgba(0, 217, 255, 0.3)',
                    borderRadius: '12px',
                    padding: '20px',
                    width: '64px',
                    height: '64px',
                    boxShadow: '0 0 15px rgba(0, 217, 255, 0.2)',
                    cursor: 'default'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.7)';
                    e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 217, 255, 0.5)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 217, 255, 0.2)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <Icon 
                    className="text-white" 
                    size={32}
                    style={{
                      filter: 'drop-shadow(0 0 8px rgba(0, 217, 255, 0.5))'
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-normal text-[var(--txt)] mb-1">{stack.name}</h3>
                  <p className="text-xs text-[var(--txt-muted)] font-light">{stack.goal}</p>
                </div>
              </div>
            </div>

            {/* Stack Content */}
            <div className="p-6">
              {/* Supplements List */}
              <div className="mb-4 relative">
                <p className="text-xs font-normal text-[var(--txt-muted)] mb-3 uppercase tracking-wider">
                  Includes ({stack.supplements.length} Supplements)
                </p>
                <ul className="space-y-2">
                  {stack.supplements.map((supplement, idx) => {
                    const searchTerms = stack.productSearchTerms[idx] || [];
                    const product = findProductByName(shopifyProducts, searchTerms);
                    const isHovered = hoveredSupplement === `${stack.id}-${idx}`;
                    
                    return (
                      <li 
                        key={idx} 
                        className="text-sm text-[var(--txt)] flex items-start font-light relative"
                        onMouseEnter={() => {
                          setHoveredSupplement(`${stack.id}-${idx}`);
                          if (product) setHoveredProduct(product);
                        }}
                        onMouseLeave={() => {
                          setHoveredSupplement(null);
                          setHoveredProduct(null);
                        }}
                      >
                        <Check size={14} className="text-[var(--acc)] mr-2 mt-0.5 flex-shrink-0" />
                        <span className="relative">
                          {supplement}
                          {/* Product Image Tooltip */}
                          {isHovered && hoveredProduct && hoveredProduct.image && (
                            <div
                              className="absolute z-50 pointer-events-none"
                              style={{
                                bottom: 'calc(100% + 12px)',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                opacity: 1,
                                transition: 'opacity 0.2s ease',
                              }}
                            >
                              <div
                                style={{
                                  width: '150px',
                                  height: '150px',
                                  background: 'rgba(30, 30, 30, 0.95)',
                                  border: '1px solid rgba(0, 217, 255, 0.5)',
                                  borderRadius: '8px',
                                  padding: '8px',
                                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 217, 255, 0.3)',
                                  backdropFilter: 'blur(10px)',
                                }}
                              >
                                <img
                                  src={hoveredProduct.image}
                                  alt={hoveredProduct.title}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                    borderRadius: '4px',
                                  }}
                                />
                              </div>
                              {/* Tooltip arrow */}
                              <div
                                style={{
                                  position: 'absolute',
                                  bottom: '-6px',
                                  left: '50%',
                                  transform: 'translateX(-50%)',
                                  width: 0,
                                  height: 0,
                                  borderLeft: '6px solid transparent',
                                  borderRight: '6px solid transparent',
                                  borderTop: '6px solid rgba(0, 217, 255, 0.5)',
                                }}
                              />
                            </div>
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Description */}
              <p className="text-sm text-[var(--txt-muted)] mb-6 leading-relaxed font-light">
                {stack.description}
              </p>

              {/* Pricing */}
              <div className="mb-6 pt-4 border-t border-[var(--border)]">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-normal text-[var(--acc)]">${stack.discountedPrice.toFixed(2)}</span>
                  <span className="text-sm text-[var(--txt-muted)]/60 line-through font-light">${stack.originalPrice.toFixed(2)}</span>
                </div>
                <p className="text-xs text-[var(--acc)] font-light">
                  Save ${(stack.originalPrice - stack.discountedPrice).toFixed(2)} ({Math.round(((stack.originalPrice - stack.discountedPrice) / stack.originalPrice) * 100)}% off)
                </p>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handleAddStack(stack)}
                disabled={addingStack === stack.id || shopifyProducts.length === 0}
                className="w-full disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2 text-white transition-all duration-300 ease-in-out"
                style={{
                  background: successMessage?.stackId === stack.id
                    ? 'rgba(16, 185, 129, 0.9)'
                    : 'rgba(30, 30, 30, 0.9)',
                  border: successMessage?.stackId === stack.id
                    ? '1px solid rgba(16, 185, 129, 0.4)'
                    : '1px solid rgba(0, 217, 255, 0.4)',
                  borderRadius: '12px',
                  padding: '14px 28px',
                  fontSize: '16px',
                  boxShadow: successMessage?.stackId === stack.id
                    ? '0 0 20px rgba(16, 185, 129, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)'
                    : '0 0 20px rgba(0, 217, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)',
                }}
                onMouseEnter={(e) => {
                  if (!addingStack && !successMessage?.stackId && shopifyProducts.length > 0) {
                    e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 217, 255, 0.6), 0 4px 12px rgba(0, 0, 0, 0.3)';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!successMessage?.stackId) {
                    e.currentTarget.style.boxShadow = successMessage?.stackId === stack.id
                      ? '0 0 20px rgba(16, 185, 129, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)'
                      : '0 0 20px rgba(0, 217, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {addingStack === stack.id ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding...
                  </>
                ) : successMessage?.stackId === stack.id ? (
                  <>
                    <Check size={18} />
                    Stack Added! {successMessage.count} items in cart
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} />
                    Add Stack to Cart
                  </>
                )}
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// Product Card Component
function ProductCard({ product }) {
  const [showDetails, setShowDetails] = useState(false);

  const profitMargin = ((product.price - product.costPrice) / product.price * 100).toFixed(0);

  return (
    <motion.div
      className="glass-card overflow-hidden transition-all group"
      style={{
        boxShadow: '0 0 20px rgba(0, 229, 255, 0.15), 0 4px 12px rgba(0, 0, 0, 0.2)'
      }}
      whileHover={{ 
        y: -4
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 229, 255, 0.3), 0 8px 20px rgba(0, 0, 0, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 229, 255, 0.15), 0 4px 12px rgba(0, 0, 0, 0.2)';
      }}
    >
      {/* Category Badge */}
      <div className="relative">
        <div className="absolute top-3 left-3 z-10">
            <span className="px-3 py-1 bg-[var(--acc)] text-[#001018] text-xs font-normal rounded-full">
            {product.category}
          </span>
        </div>

        {/* Priority Badge */}
        {product.priority === 'essential' && (
          <div className="absolute top-3 right-3 z-10">
              <span className="px-3 py-1 bg-green-500 text-white text-xs font-normal rounded-full flex items-center gap-1">
              <Check size={12} /> Essential
            </span>
          </div>
        )}

        {/* Product Image Placeholder */}
        <div className="h-48 bg-[var(--bg-elev-1)] flex items-center justify-center border-b border-[var(--border)]">
          <div className="text-6xl opacity-20">💊</div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <h3 className="text-lg font-normal text-[var(--txt)] mb-2">{product.name}</h3>
        <p className="text-sm text-[var(--txt-muted)] mb-4 line-clamp-2 font-light">{product.description}</p>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-normal text-[var(--acc)]">${product.price.toFixed(2)}</span>
          <span className="text-sm text-[var(--txt-muted)]/60 line-through font-light">${(product.price * 1.2).toFixed(2)}</span>
        </div>

        {/* Benefits Preview */}
        <div className="mb-4">
          <p className="text-xs font-normal text-[var(--txt-muted)] mb-2 uppercase tracking-wider">Key Benefits</p>
          <ul className="space-y-1">
            {product.benefits.slice(0, 2).map((benefit, i) => (
              <li key={i} className="text-xs text-[var(--txt-muted)] flex items-start font-light">
                <Check size={12} className="text-[var(--acc)] mr-1 mt-0.5 flex-shrink-0" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        {/* Toggle Details */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-[var(--acc)] hover:text-[var(--acc-2)] font-normal mb-4 transition-colors"
        >
          {showDetails ? 'Hide Details' : 'Show More'}
        </button>

        {/* Expanded Details */}
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-4 pt-4 border-t border-[var(--border)]"
          >
            <div className="space-y-3">
              <div>
                <p className="text-xs font-normal text-[var(--txt-muted)] mb-1 uppercase tracking-wider">All Benefits</p>
                <ul className="space-y-1">
                  {product.benefits.map((benefit, i) => (
                    <li key={i} className="text-xs text-[var(--txt-muted)] flex items-start font-light">
                      <Check size={12} className="text-[var(--acc)] mr-1 mt-0.5 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-xs font-normal text-[var(--txt-muted)] mb-1 uppercase tracking-wider">Recommended Dosage</p>
                <p className="text-xs text-[var(--txt-muted)] font-light">{product.dosage}</p>
              </div>

              <div>
                <p className="text-xs font-normal text-[var(--txt-muted)] mb-1 uppercase tracking-wider">Best For</p>
                <div className="flex flex-wrap gap-1">
                  {product.goals.map((goal, i) => (
                    <span key={i} className="px-2 py-0.5 bg-[var(--bg-elev-1)] text-[var(--txt-muted)] text-xs rounded-full border border-[var(--border)] font-light">
                      {goal.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* CTA Button */}
          <button
            disabled
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed font-normal"
          >
            Coming Soon
          </button>

        {/* Supliful ID (hidden - for integration) */}
        <p className="text-xs text-[var(--txt-muted)]/40 mt-2 text-center">
          ID: {product.id.slice(0, 8)}...
        </p>
      </div>
    </motion.div>
  );
}

