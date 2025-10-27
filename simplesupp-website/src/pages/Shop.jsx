import React, { useState, useMemo } from 'react';
import { Search, Filter, ShoppingCart, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { products, PRODUCT_CATEGORIES, getProductsByCategory } from '../data/products';

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
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            SmartSupp Store
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Premium supplements powered by Supliful
          </p>
          <p className="text-sm text-gray-500">
            {filteredProducts.length} products available
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-accent focus:outline-none"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-accent focus:outline-none appearance-none bg-white"
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
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-accent focus:outline-none appearance-none bg-white"
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
            <p className="text-gray-600 text-lg">No products found matching your search.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Coming Soon Notice */}
        <div className="mt-12 bg-gradient-to-br from-primary/10 via-accent/10 to-violet/10 rounded-2xl p-8 border border-primary/20 text-center">
          <ShoppingCart className="mx-auto mb-4 text-accent" size={48} />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Checkout Coming Soon
          </h3>
          <p className="text-gray-600 mb-4">
            We're finalizing our Shopify integration. You'll be able to purchase these products very soon!
          </p>
          <p className="text-sm text-gray-500">
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
      className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
      whileHover={{ y: -4 }}
    >
      {/* Category Badge */}
      <div className="relative">
        <div className="absolute top-3 left-3 z-10">
          <span className="px-3 py-1 bg-gradient-to-r from-primary via-accent to-violet text-white text-xs font-semibold rounded-full">
            {product.category}
          </span>
        </div>

        {/* Priority Badge */}
        {product.priority === 'essential' && (
          <div className="absolute top-3 right-3 z-10">
            <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
              <Check size={12} /> Essential
            </span>
          </div>
        )}

        {/* Product Image Placeholder */}
        <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <div className="text-6xl opacity-20">💊</div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</span>
          <span className="text-sm text-gray-500 line-through">${(product.price * 1.2).toFixed(2)}</span>
        </div>

        {/* Benefits Preview */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 mb-2">KEY BENEFITS:</p>
          <ul className="space-y-1">
            {product.benefits.slice(0, 2).map((benefit, i) => (
              <li key={i} className="text-xs text-gray-600 flex items-start">
                <Check size={12} className="text-accent mr-1 mt-0.5 flex-shrink-0" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        {/* Toggle Details */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-accent hover:text-primary font-medium mb-4"
        >
          {showDetails ? 'Hide Details' : 'Show More'}
        </button>

        {/* Expanded Details */}
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-4 pt-4 border-t border-gray-100"
          >
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">ALL BENEFITS:</p>
                <ul className="space-y-1">
                  {product.benefits.map((benefit, i) => (
                    <li key={i} className="text-xs text-gray-600 flex items-start">
                      <Check size={12} className="text-accent mr-1 mt-0.5 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">RECOMMENDED DOSAGE:</p>
                <p className="text-xs text-gray-600">{product.dosage}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">BEST FOR:</p>
                <div className="flex flex-wrap gap-1">
                  {product.goals.map((goal, i) => (
                    <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
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
          className="w-full px-4 py-3 bg-gradient-to-r from-primary via-accent to-violet text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Coming Soon
        </button>

        {/* Supliful ID (hidden - for integration) */}
        <p className="text-xs text-gray-400 mt-2 text-center">
          ID: {product.id.slice(0, 8)}...
        </p>
      </div>
    </motion.div>
  );
}
