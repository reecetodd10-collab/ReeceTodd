import React, { useState, useMemo } from 'react';
import { Search, Filter, ShoppingCart, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { products, PRODUCT_CATEGORIES, getProductsByCategory } from '../data/products';


{/* Background Image */}
<div 
  className="fixed inset-0 -z-10"
  style={{
    backgroundImage: "url('/images/shop/shop-background.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(25px)',
    opacity: 0.3,
  }}
/>
<div className="fixed inset-0 -z-10 bg-black/60" />


export default function Shop() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(p => p.active);

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.benefits.some(b => b.toLowerCase().includes(query))
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
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategory, sortBy]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { all: products.filter(p => p.active).length };
    Object.values(PRODUCT_CATEGORIES).forEach(cat => {
      counts[cat] = getProductsByCategory(cat).length;
    });
    return counts;
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg)] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-normal text-[var(--txt)] mb-4" style={{ letterSpacing: '2px' }}>
            Aviera Shop
          </h1>
          <p className="text-xl text-[var(--txt-muted)] mb-2 font-light" style={{ letterSpacing: '15px' }}>
            Premium supplements powered by Supliful
          </p>
          <p className="text-sm text-[var(--txt-muted)]/80 font-light" style={{ letterSpacing: '5px' }}>
            {filteredProducts.length} products available
          </p>
        </div>

        {/* Search and Filters */}
        <div className="glass-card p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--txt-muted)]" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-[var(--bg-elev-1)] border-2 border-[var(--border)] text-[var(--txt)] focus:border-[var(--acc)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--txt-muted)]" size={20} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-[var(--bg-elev-1)] border-2 border-[var(--border)] text-[var(--txt)] focus:border-[var(--acc)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] appearance-none"
              >
                <option value="all">All Categories ({categoryCounts.all})</option>
                {Object.entries(PRODUCT_CATEGORIES).map(([key, value]) => (
                  <option key={key} value={value}>
                    {value} ({categoryCounts[value] || 0})
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[var(--bg-elev-1)] border-2 border-[var(--border)] text-[var(--txt)] focus:border-[var(--acc)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] appearance-none"
            >
              <option value="name">Sort: Name (A-Z)</option>
              <option value="price-low">Sort: Price (Low to High)</option>
              <option value="price-high">Sort: Price (High to Low)</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[var(--txt-muted)] text-lg">No products found matching your search.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Coming Soon Notice */}
        <div className="mt-12 glass-card p-8 text-center">
          <ShoppingCart className="mx-auto mb-4 text-[var(--acc)]" size={48} />
          <h3 className="text-2xl font-normal text-[var(--txt)] mb-2" style={{ letterSpacing: '2px' }}>
            Checkout Coming Soon
          </h3>
          <p className="text-[var(--txt-muted)] mb-4 font-light" style={{ letterSpacing: '5px' }}>
            We're finalizing our Shopify integration. You'll be able to purchase these products very soon!
          </p>
          <p className="text-sm text-[var(--txt-muted)]/80 font-light" style={{ letterSpacing: '5px' }}>
            All products are sourced from Supliful and ship directly to your door.
          </p>
        </div>
      </div>
    </div>
  );
}

// Product Card Component
function ProductCard({ product }) {
  const [showDetails, setShowDetails] = useState(false);

  const profitMargin = ((product.price - product.costPrice) / product.price * 100).toFixed(0);

  return (
    <motion.div
      className="glass-card overflow-hidden hover:shadow-premium-lg transition-all"
      whileHover={{ y: -4 }}
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
        <h3 className="text-lg font-normal text-[var(--txt)] mb-2" style={{ letterSpacing: '2px' }}>{product.name}</h3>
        <p className="text-sm text-[var(--txt-muted)] mb-4 line-clamp-2 font-light" style={{ letterSpacing: '5px' }}>{product.description}</p>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-normal text-[var(--acc)]">${product.price.toFixed(2)}</span>
          <span className="text-sm text-[var(--txt-muted)]/60 line-through">${(product.price * 1.2).toFixed(2)}</span>
        </div>

        {/* Benefits Preview */}
        <div className="mb-4">
          <p className="text-xs font-normal text-[var(--txt-muted)] mb-2">KEY BENEFITS:</p>
          <ul className="space-y-1">
            {product.benefits.slice(0, 2).map((benefit, i) => (
              <li key={i} className="text-xs text-[var(--txt-muted)] flex items-start">
                <Check size={12} className="text-[var(--acc)] mr-1 mt-0.5 flex-shrink-0" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        {/* Toggle Details */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-[var(--acc)] hover:text-[var(--acc-2)] font-normal mb-4"
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
                <p className="text-xs font-normal text-[var(--txt-muted)] mb-1">ALL BENEFITS:</p>
                <ul className="space-y-1">
                  {product.benefits.map((benefit, i) => (
                    <li key={i} className="text-xs text-[var(--txt-muted)] flex items-start">
                      <Check size={12} className="text-[var(--acc)] mr-1 mt-0.5 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-xs font-normal text-[var(--txt-muted)] mb-1">RECOMMENDED DOSAGE:</p>
                <p className="text-xs text-[var(--txt-muted)]">{product.dosage}</p>
              </div>

              <div>
                <p className="text-xs font-normal text-[var(--txt-muted)] mb-1">BEST FOR:</p>
                <div className="flex flex-wrap gap-1">
                  {product.goals.map((goal, i) => (
                    <span key={i} className="px-2 py-0.5 bg-[var(--bg-elev-1)] text-[var(--txt-muted)] text-xs rounded-full border border-[var(--border)]">
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
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
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
