'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PillLogo from '../components/PillLogo';
import { fetchProductById, addToCart, initializeShopifyCart } from '../lib/shopify';
import { ArrowRight, Check, Brain, Zap, Heart, Dumbbell, Shield, Truck, Award } from 'lucide-react';

export default function NitricOxidePage() {
  const [variantId, setVariantId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const SHOPIFY_PRODUCT_ID = '8645601657022';
  const PRODUCT_IMAGE = 'https://cdn.shopify.com/s/files/1/0731/7209/1070/files/1766350734704-generated-label-image-0.jpg?v=1766350977';

  // Fetch variant ID from Shopify
  useEffect(() => {
    const fetchVariant = async () => {
      try {
        const product = await fetchProductById(SHOPIFY_PRODUCT_ID);
        if (product && product.variantId) {
          setVariantId(product.variantId);
        }
      } catch (error) {
        console.error('Error fetching product variant:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVariant();
    
    // Initialize Shopify cart
    initializeShopifyCart().catch(error => {
      console.error('Error initializing Shopify cart:', error);
    });
  }, []);

  const handleAddToCart = async () => {
    if (!variantId) {
      alert('Product is loading, please try again in a moment.');
      return;
    }

    setIsAdding(true);
    try {
      await addToCart(variantId, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add product to cart. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #ffffff, #f5f5f5)',
      }}
    >
      {/* Minimal Header */}
      <header 
        className="relative z-20 px-4 sm:px-6 lg:px-8 py-6"
        style={{
          background: '#ffffff',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <Link href="/home" className="inline-flex items-center gap-3">
            <div className="[&_h1]:hidden">
              <PillLogo size="small" />
            </div>
            <span 
              className="text-2xl font-bold"
              style={{ 
                fontFamily: 'Montserrat, sans-serif',
                color: '#1a1a1a'
              }}
            >
              AVIERA
            </span>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            
            {/* Left Side - Content */}
            <div className="order-2 md:order-1 text-center md:text-left">
              {/* Premium Label */}
              <div className="inline-block mb-4">
                <span 
                  className="px-4 py-2 rounded-full text-sm font-medium tracking-wider uppercase"
                  style={{
                    background: 'rgba(0, 217, 255, 0.1)',
                    border: '1px solid rgba(0, 217, 255, 0.3)',
                    color: '#00d9ff'
                  }}
                >
                  Premium Supplement
                </span>
              </div>

              {/* Headline */}
              <h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight"
                style={{ 
                  fontFamily: 'Montserrat, sans-serif',
                  color: '#1a1a1a'
                }}
              >
                Better Blood Flow.<br />
                Better Everything.
              </h1>

              {/* Subheadline */}
              <p className="text-xl md:text-2xl mb-8 font-light" style={{ color: '#4a4a4a' }}>
                Premium Nitric Oxide for just $19.99
              </p>

              {/* Price Display */}
              <div className="flex flex-col md:flex-row items-center md:items-baseline gap-3 md:gap-4 mb-8">
                <div className="flex items-baseline gap-3">
                  <span 
                    className="text-5xl md:text-6xl font-bold"
                    style={{ color: '#00d9ff' }}
                  >
                    $19.99
                  </span>
                  <span className="text-xl md:text-2xl line-through" style={{ color: '#9ca3af' }}>
                    $39.99
                  </span>
                </div>
                <div 
                  className="px-4 py-2 rounded-lg font-semibold text-sm"
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    color: '#10b981'
                  }}
                >
                  Save 50%
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={handleAddToCart}
                disabled={isAdding || added || isLoading || !variantId}
                className="w-full md:w-auto md:min-w-[280px] px-8 py-4 rounded-xl font-semibold text-lg text-white transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{
                  background: added ? 'rgba(16, 185, 129, 0.9)' : '#00d9ff',
                  boxShadow: added 
                    ? '0 0 30px rgba(16, 185, 129, 0.5)' 
                    : '0 0 30px rgba(0, 217, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
                onMouseEnter={(e) => {
                  if (!added && !isAdding && !isLoading && variantId) {
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.4)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!added && !isAdding && !isLoading && variantId) {
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 217, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {added ? (
                  <>
                    <Check size={20} />
                    <span>Added to Cart!</span>
                  </>
                ) : isAdding ? (
                  <span>Adding...</span>
                ) : (
                  <>
                    <span>Add to Cart</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>

              {/* Trust Line */}
              <div className="mt-6 flex items-center justify-center md:justify-start gap-2 text-sm" style={{ color: '#4a4a4a' }}>
                <Check size={16} style={{ color: '#10b981' }} />
                <span>Free shipping over $50</span>
                <span className="mx-2">·</span>
                <Check size={16} style={{ color: '#10b981' }} />
                <span>30-day guarantee</span>
              </div>
            </div>

            {/* Right Side - Product Image */}
            <div className="order-1 md:order-2 relative">
              <div className="relative flex items-center justify-center">
                {/* Image Container - Natural floating style */}
                <div 
                  className="relative rounded-3xl p-8 md:p-12"
                  style={{
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <img
                    src="https://cdn.shopify.com/s/files/1/0731/7209/1070/files/1766350734704-generated-label-image-0.jpg?v=1766350977"
                    alt="Nitric Oxide Premium Supplement"
                    className="w-full h-auto max-w-md mx-auto object-contain"
                    style={{
                      maxHeight: '600px',
                    }}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Benefits Grid Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
              style={{ 
                fontFamily: 'Montserrat, sans-serif',
                color: '#1a1a1a'
              }}
            >
              Feel The Difference
            </h2>
            <p className="text-lg md:text-xl font-light" style={{ color: '#4a4a4a' }}>
              Why thousands are making the switch
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Benefit Card 1 */}
            <div
              className="rounded-2xl p-6 md:p-8 transition-all duration-300"
              style={{
                background: '#ffffff',
                border: '1px solid #e0e0e0',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 217, 255, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                e.currentTarget.style.borderColor = '#e0e0e0';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Brain 
                size={48} 
                className="mb-4"
                style={{ color: '#00d9ff' }}
              />
              <h3 className="text-xl md:text-2xl font-bold mb-3" style={{ 
                fontFamily: 'Montserrat, sans-serif',
                color: '#1a1a1a'
              }}>
                Sharper Focus
              </h3>
              <p className="leading-relaxed" style={{ color: '#4a4a4a' }}>
                Better blood flow means better oxygen to your brain. Think clearer, work smarter.
              </p>
            </div>

            {/* Benefit Card 2 */}
            <div
              className="rounded-2xl p-6 md:p-8 transition-all duration-300"
              style={{
                background: '#ffffff',
                border: '1px solid #e0e0e0',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 217, 255, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                e.currentTarget.style.borderColor = '#e0e0e0';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Zap 
                size={48} 
                className="mb-4"
                style={{ color: '#00d9ff' }}
              />
              <h3 className="text-xl md:text-2xl font-bold mb-3" style={{ 
                fontFamily: 'Montserrat, sans-serif',
                color: '#1a1a1a'
              }}>
                Natural Energy
              </h3>
              <p className="leading-relaxed" style={{ color: '#4a4a4a' }}>
                No caffeine crashes. Just clean, sustained energy throughout your day.
              </p>
            </div>

            {/* Benefit Card 3 */}
            <div
              className="rounded-2xl p-6 md:p-8 transition-all duration-300"
              style={{
                background: '#ffffff',
                border: '1px solid #e0e0e0',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 217, 255, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                e.currentTarget.style.borderColor = '#e0e0e0';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Heart 
                size={48} 
                className="mb-4"
                style={{ color: '#00d9ff' }}
              />
              <h3 className="text-xl md:text-2xl font-bold mb-3" style={{ 
                fontFamily: 'Montserrat, sans-serif',
                color: '#1a1a1a'
              }}>
                Heart Health
              </h3>
              <p className="leading-relaxed" style={{ color: '#4a4a4a' }}>
                Support healthy circulation and cardiovascular function naturally.
              </p>
            </div>

            {/* Benefit Card 4 */}
            <div
              className="rounded-2xl p-6 md:p-8 transition-all duration-300"
              style={{
                background: '#ffffff',
                border: '1px solid #e0e0e0',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 217, 255, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                e.currentTarget.style.borderColor = '#e0e0e0';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Dumbbell 
                size={48} 
                className="mb-4"
                style={{ color: '#00d9ff' }}
              />
              <h3 className="text-xl md:text-2xl font-bold mb-3" style={{ 
                fontFamily: 'Montserrat, sans-serif',
                color: '#1a1a1a'
              }}>
                Better Pumps
              </h3>
              <p className="leading-relaxed" style={{ color: '#4a4a4a' }}>
                Enhanced blood flow for fuller muscles and faster recovery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
              style={{ 
                fontFamily: 'Montserrat, sans-serif',
                color: '#1a1a1a'
              }}
            >
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div 
                className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 rounded-full flex items-center justify-center text-2xl md:text-3xl font-bold"
                style={{
                  background: 'rgba(0, 217, 255, 0.1)',
                  border: '2px solid #00d9ff',
                  color: '#00d9ff',
                  boxShadow: '0 0 20px rgba(0, 217, 255, 0.15)',
                }}
              >
                1
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-4" style={{ 
                fontFamily: 'Montserrat, sans-serif',
                color: '#1a1a1a'
              }}>
                Take 2 Capsules
              </h3>
              <p className="leading-relaxed" style={{ color: '#4a4a4a' }}>
                Just 2 capsules daily with water. Morning or pre-workout.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div 
                className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 rounded-full flex items-center justify-center text-2xl md:text-3xl font-bold"
                style={{
                  background: 'rgba(0, 217, 255, 0.1)',
                  border: '2px solid #00d9ff',
                  color: '#00d9ff',
                  boxShadow: '0 0 20px rgba(0, 217, 255, 0.15)',
                }}
              >
                2
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-4" style={{ 
                fontFamily: 'Montserrat, sans-serif',
                color: '#1a1a1a'
              }}>
                Feel The Flow
              </h3>
              <p className="leading-relaxed" style={{ color: '#4a4a4a' }}>
                Nitric oxide expands blood vessels for better circulation within days.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div 
                className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 rounded-full flex items-center justify-center text-2xl md:text-3xl font-bold"
                style={{
                  background: 'rgba(0, 217, 255, 0.1)',
                  border: '2px solid #00d9ff',
                  color: '#00d9ff',
                  boxShadow: '0 0 20px rgba(0, 217, 255, 0.15)',
                }}
              >
                3
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-4" style={{ 
                fontFamily: 'Montserrat, sans-serif',
                color: '#1a1a1a'
              }}>
                Perform Better
              </h3>
              <p className="leading-relaxed" style={{ color: '#4a4a4a' }}>
                More energy, clearer thinking, better workouts. Every day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Guarantee Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Trust Badge 1 */}
            <div className="text-center">
              <Shield 
                size={48} 
                className="mx-auto mb-4"
                style={{ color: '#00d9ff' }}
              />
              <h3 className="text-lg md:text-xl font-semibold mb-2" style={{ 
                fontFamily: 'Montserrat, sans-serif',
                color: '#1a1a1a'
              }}>
                30-Day Money Back Guarantee
              </h3>
            </div>

            {/* Trust Badge 2 */}
            <div className="text-center">
              <Truck 
                size={48} 
                className="mx-auto mb-4"
                style={{ color: '#00d9ff' }}
              />
              <h3 className="text-lg md:text-xl font-semibold mb-2" style={{ 
                fontFamily: 'Montserrat, sans-serif',
                color: '#1a1a1a'
              }}>
                Free Shipping Over $50
              </h3>
            </div>

            {/* Trust Badge 3 */}
            <div className="text-center">
              <Award 
                size={48} 
                className="mx-auto mb-4"
                style={{ color: '#00d9ff' }}
              />
              <h3 className="text-lg md:text-xl font-semibold mb-2" style={{ 
                fontFamily: 'Montserrat, sans-serif',
                color: '#1a1a1a'
              }}>
                Premium Quality Ingredients
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* Urgency Banner */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-4xl mx-auto text-center">
          <div 
            className="inline-block px-6 py-3 rounded-full font-semibold text-lg animate-pulse"
            style={{
              background: 'rgba(0, 217, 255, 0.1)',
              border: '1px solid rgba(0, 217, 255, 0.3)',
              color: '#00d9ff',
              boxShadow: '0 0 20px rgba(0, 217, 255, 0.2)',
            }}
          >
            Limited Time: 50% off ends soon
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
            style={{ 
              fontFamily: 'Montserrat, sans-serif',
              color: '#1a1a1a'
            }}
          >
            Start Your Journey Today
          </h2>

          <p className="text-lg md:text-xl mb-8 font-light" style={{ color: '#4a4a4a' }}>
            Join thousands who feel the difference
          </p>

          {/* Price Display */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 mb-8">
            <div className="flex items-baseline gap-3">
              <span 
                className="text-5xl md:text-6xl font-bold"
                style={{ color: '#00d9ff' }}
              >
                $19.99
              </span>
              <span className="text-xl md:text-2xl line-through" style={{ color: '#9ca3af' }}>
                $39.99
              </span>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleAddToCart}
            disabled={isAdding || added || isLoading || !variantId}
            className="w-full md:w-auto md:min-w-[320px] px-8 py-5 rounded-xl font-semibold text-xl text-white transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto mb-8"
            style={{
              background: added ? 'rgba(16, 185, 129, 0.9)' : '#00d9ff',
              boxShadow: added 
                ? '0 0 30px rgba(16, 185, 129, 0.5)' 
                : '0 0 30px rgba(0, 217, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)',
            }}
            onMouseEnter={(e) => {
              if (!added && !isAdding && !isLoading && variantId) {
                e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.4)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!added && !isAdding && !isLoading && variantId) {
                e.currentTarget.style.boxShadow = added 
                  ? '0 0 30px rgba(16, 185, 129, 0.5)' 
                  : '0 0 30px rgba(0, 217, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {added ? (
              <>
                <Check size={24} />
                <span>Added to Cart!</span>
              </>
            ) : isAdding ? (
              <span>Adding...</span>
            ) : (
              <>
                <span>Add to Cart</span>
                <ArrowRight size={24} />
              </>
            )}
          </button>

          {/* Trust Badges - Small Below Button */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-sm" style={{ color: '#4a4a4a' }}>
            <div className="flex items-center gap-2">
              <Shield size={20} style={{ color: '#00d9ff' }} />
              <span>30-Day Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck size={20} style={{ color: '#00d9ff' }} />
              <span>Free Shipping Over $50</span>
            </div>
            <div className="flex items-center gap-2">
              <Award size={20} style={{ color: '#00d9ff' }} />
              <span>Premium Quality</span>
            </div>
          </div>
        </div>
      </section>

      {/* Shopify Cart Toggle - Hidden but functional */}
      <div id="shopify-cart-toggle" className="hidden"></div>
      <div id="shopify-cart" className="hidden"></div>
    </div>
  );
}
