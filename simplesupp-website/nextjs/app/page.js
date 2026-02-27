'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Target, Check, Plus, X, Info } from 'lucide-react';
import { SignUpButton, SignInButton } from '@clerk/nextjs';
import { fetchShopifyProducts, addToCart } from './lib/shopify';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);
  const [nlEmail, setNlEmail] = useState('');
  const [nlSubmitted, setNlSubmitted] = useState(false);
  const [nlLoading, setNlLoading] = useState(false);
  const [addedProducts, setAddedProducts] = useState({});
  const [addingProducts, setAddingProducts] = useState({});
  const [expandedProduct, setExpandedProduct] = useState(null);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const allProducts = await fetchShopifyProducts();
        const findProduct = (searchTerms) =>
          allProducts.find(p =>
            searchTerms.some(term => p.title.toLowerCase().includes(term.toLowerCase()))
          );

        const creatine = findProduct(['creatine', 'monohydrate']);
        const protein = findProduct(['whey', 'protein', 'isolate']);
        const magnesium = findProduct(['magnesium', 'glycinate']);
        const omega = findProduct(['omega', 'fish oil']);
        const preworkout = findProduct(['pre-workout', 'preworkout']);

        setFeaturedProducts(
          [
            creatine && { ...creatine, badge: 'Popular' },
            protein && { ...protein, badge: 'Best' },
            magnesium,
            omega,
            preworkout,
          ].filter(Boolean)
        );
      } catch (error) {
        console.error('Error loading featured products:', error);
      } finally {
        setIsLoadingFeatured(false);
      }
    };
    loadFeaturedProducts();
  }, []);

  const handleAddToCart = async (product) => {
    if (!product.variantId || addedProducts[product.id] || addingProducts[product.id]) return;
    setAddingProducts(prev => ({ ...prev, [product.id]: true }));
    try {
      await addToCart(product.variantId, 1);
      setAddedProducts(prev => ({ ...prev, [product.id]: true }));
      setTimeout(() => setAddedProducts(prev => ({ ...prev, [product.id]: false })), 2000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setAddingProducts(prev => ({ ...prev, [product.id]: false }));
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!nlEmail || !nlEmail.includes('@')) return;
    setNlLoading(true);
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: nlEmail }),
      });
      if (res.ok) {
        setNlSubmitted(true);
      }
    } catch (err) {
      console.error('Newsletter error:', err);
    } finally {
      setNlLoading(false);
    }
  };

  // Get the supplement facts image — last image in the array (nutrition label)
  const getSupplementFactsImage = (product) => {
    if (!product.images || product.images.length < 2) return null;
    return product.images[product.images.length - 1];
  };

  return (
    <div className="relative" style={{ background: 'var(--bg)' }}>
      {/* Cyan glow backdrop */}
      <div className="absolute top-0 left-0 right-0 h-[400px] pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(0,217,255,0.06), transparent 60%)' }} />

      {/* ═══ SECTION 1: HERO ═══ */}
      <section className="relative pt-8 sm:pt-16 md:pt-24 pb-6 px-5">
        <div className="max-w-3xl mx-auto md:text-center">
          {/* Badge */}
          <div className="flex md:justify-center mb-4">
            <span
              className="inline-flex items-center gap-[5px] px-3 py-[5px] rounded-full text-[11px] font-semibold tracking-wide"
              style={{ background: 'rgba(0,217,255,0.08)', border: '1px solid rgba(0,217,255,0.16)', color: '#00d9ff' }}
            >
              <span className="w-[5px] h-[5px] rounded-full bg-[#00d9ff] animate-pulse" />
              AI-Powered Supplements
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-[28px] sm:text-[40px] md:text-[48px] font-extrabold leading-[1.15] tracking-tight mb-4">
            <span style={{ color: 'var(--txt)' }}>Stop guessing.</span>
            <br />
            <span style={{ color: '#00d9ff' }}>Start progressing.</span>
          </h1>

          {/* 3 Value props with cyan checkmarks */}
          <div className="space-y-2 mb-4 md:max-w-md md:mx-auto">
            {[
              'See where you land compared to the average',
              'Find your supplement bottlenecks',
              'Get personalized supplement solutions',
            ].map((text) => (
              <div key={text} className="flex items-start gap-2">
                <Check size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#00d9ff' }} strokeWidth={3} />
                <span className="text-[13px] leading-relaxed" style={{ color: 'var(--txt-muted)' }}>{text}</span>
              </div>
            ))}
          </div>

          {/* CTA line — NOT a checkmark */}
          <p className="text-[14px] font-semibold mb-5 md:text-center" style={{ color: '#00d9ff' }}>
            Get your Optimization Score now — in under 60 seconds!
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-3 md:justify-center mb-7">
            <Link
              href="/supplement-optimization-score"
              className="inline-flex items-center gap-1.5 px-5 py-3 rounded-[10px] text-sm font-semibold transition-all"
              style={{ background: '#00d9ff', color: '#09090b' }}
            >
              Get My Score <ArrowRight size={15} />
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center px-5 py-3 rounded-[10px] text-sm font-semibold transition-all"
              style={{ border: '1px solid rgba(255,255,255,0.06)', color: 'var(--txt)' }}
            >
              Shop All
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 2: TRUST ROW ═══ */}
      <div className="flex gap-5 overflow-x-auto px-5 pb-6 scrollbar-hide">
        {[
          { icon: '✓', text: '3rd Party Tested' },
          { icon: '⚡', text: 'Free Shipping $50+' },
          { icon: '🔬', text: 'Science-Backed' },
          { icon: '↩', text: '30-Day Returns' },
        ].map((item) => (
          <div key={item.text} className="flex items-center gap-2 flex-shrink-0">
            <span style={{ color: '#00d9ff' }}>{item.icon}</span>
            <span className="text-[12px] font-medium whitespace-nowrap" style={{ color: 'var(--txt-muted)' }}>
              {item.text}
            </span>
          </div>
        ))}
      </div>

      {/* ═══ SECTION 3: WHAT IS AVIERA? ═══ */}
      <section className="mx-5 mb-6">
        <div
          className="rounded-[14px] p-5"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <p className="text-[10px] font-bold uppercase tracking-[1px] mb-2" style={{ color: '#00d9ff' }}>
            What is Aviera?
          </p>
          <h2 className="text-[18px] font-bold mb-2" style={{ color: 'var(--txt)' }}>
            Your AI fitness &amp; supplement advisor
          </h2>
          <p className="text-[13px] leading-relaxed mb-4" style={{ color: 'var(--txt-muted)' }}>
            Aviera uses AI to build your perfect supplement stack, personalized workout plans, and progress tracking — all based on your unique goals. No guesswork, no overwhelm. Just a clear, science-backed plan you can actually follow.
          </p>
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold"
            style={{ color: '#00d9ff' }}
          >
            Learn More <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ═══ SECTION 4: JOIN AVIERA + OUR MISSION ═══ */}
      <section className="mx-5 mb-6">
        <div
          className="rounded-[18px] p-5 sm:p-8 relative overflow-hidden"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          {/* Mobile: stacked / Desktop: side by side */}
          <div className="flex flex-col md:flex-row md:items-center md:gap-12">
            {/* Left side: heading + image */}
            <div className="md:w-[45%] md:flex-shrink-0">
              <h2 className="text-[22px] font-bold mb-4" style={{ color: '#00d9ff' }}>
                Join Aviera
              </h2>

              {/* Hero background image */}
              <div className="relative w-full rounded-[14px] overflow-hidden mb-6 md:mb-0" style={{ maxHeight: '200px' }}>
                <Image
                  src="/images/hero/hero-background.jpg"
                  alt="Aviera community"
                  width={800}
                  height={400}
                  className="w-full h-full object-cover"
                  style={{ maxHeight: '200px' }}
                />
              </div>
            </div>

            {/* Right side: mission + CTA */}
            <div className="md:flex-1">
              <h3 className="text-[18px] font-bold mb-3 md:mt-0 mt-4" style={{ color: 'var(--txt)' }}>
                Our Mission
              </h3>
              <p
                className="text-[13px] leading-relaxed mb-5"
                style={{ color: 'var(--txt-muted)' }}
              >
                Our mission is to help you unlock your full potential. Through eliminating the guesswork, we give you the roadmap to success through smart supplementation, personalized fitness, and an accountability-driven dashboard. Join the community that fuels healthy progress.
              </p>

              {/* Sign up button */}
              <div className="flex flex-col items-start md:items-start">
                <SignUpButton mode="modal">
                  <button
                    className="inline-flex items-center gap-1.5 px-6 py-3 rounded-[10px] text-sm font-semibold transition-all"
                    style={{ background: '#00d9ff', color: '#09090b' }}
                  >
                    Start Now
                  </button>
                </SignUpButton>
                <p className="mt-2.5 text-[12px]" style={{ color: 'var(--txt-muted)' }}>
                  Already have an account?{' '}
                  <SignInButton mode="modal">
                    <button className="font-semibold" style={{ color: '#00d9ff' }}>Sign In</button>
                  </SignInButton>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 5: BEST SELLERS ═══ */}
      <section className="mb-6">
        <div className="flex items-baseline justify-between px-5 mb-3">
          <h2 className="text-[17px] font-bold" style={{ color: 'var(--txt)' }}>Best Sellers</h2>
          <Link href="/shop" className="text-[12px] font-medium" style={{ color: '#00d9ff' }}>View All →</Link>
        </div>
        <div className="flex gap-[10px] overflow-x-auto px-5 pb-6 scrollbar-hide" style={{ scrollSnapType: 'x mandatory' }}>
          {isLoadingFeatured ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[148px] rounded-[14px] overflow-hidden animate-pulse"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', scrollSnapAlign: 'start' }}
              >
                <div className="w-full aspect-square" style={{ background: 'var(--bg-elev-1)' }} />
                <div className="p-[10px]">
                  <div className="h-3 rounded mb-2" style={{ background: 'var(--bg-elev-2)' }} />
                  <div className="h-4 w-14 rounded" style={{ background: 'var(--bg-elev-2)' }} />
                </div>
              </div>
            ))
          ) : (
            featuredProducts.map((product, i) => (
              <div key={product.id || i} className="flex-shrink-0 w-[148px]" style={{ scrollSnapAlign: 'start' }}>
                <div
                  className="rounded-[14px] overflow-hidden transition-colors"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                >
                  <div className="w-full aspect-square flex items-center justify-center relative" style={{ background: 'var(--bg-elev-1)' }}>
                    {product.badge && (
                      <span className="absolute top-1.5 left-1.5 px-[7px] py-[2px] rounded-full text-[9px] font-bold" style={{ background: '#00d9ff', color: '#09090b' }}>
                        {product.badge}
                      </span>
                    )}
                    {product.images?.[0] || product.image ? (
                      <img src={product.images?.[0] || product.image} alt={product.title} className="w-full h-full object-contain p-2" />
                    ) : (
                      <span className="text-3xl">💊</span>
                    )}
                  </div>
                  <div className="px-[11px] py-[10px]">
                    <p className="text-[12px] font-semibold mb-1 line-clamp-2 leading-tight" style={{ color: 'var(--txt)' }}>
                      {product.title}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-[13px] font-bold" style={{ color: '#00d9ff' }}>
                        ${product.price}
                      </p>
                      {/* Add to cart button */}
                      <button
                        onClick={(e) => { e.preventDefault(); handleAddToCart(product); }}
                        disabled={!product.variantId || addingProducts[product.id]}
                        className="flex items-center justify-center transition-all disabled:opacity-40"
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: addedProducts[product.id] ? 'rgba(16,185,129,0.2)' : 'rgba(0,217,255,0.1)',
                          border: addedProducts[product.id] ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(0,217,255,0.3)',
                          flexShrink: 0,
                        }}
                      >
                        {addedProducts[product.id] ? (
                          <Check size={12} style={{ color: '#10b981' }} strokeWidth={3} />
                        ) : addingProducts[product.id] ? (
                          <div className="w-3 h-3 border-2 border-[#00d9ff] border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Plus size={12} style={{ color: '#00d9ff' }} strokeWidth={3} />
                        )}
                      </button>
                    </div>
                    {/* More Info link */}
                    <button
                      onClick={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)}
                      className="mt-1.5 text-[10px] font-medium"
                      style={{ color: 'var(--txt-muted)' }}
                    >
                      More Info
                    </button>
                  </div>
                </div>

                {/* Expanded panel — bottom sheet */}
                {expandedProduct === product.id && (
                  <div
                    className="fixed inset-0 z-[60] flex items-end justify-center md:items-center"
                    onClick={() => setExpandedProduct(null)}
                  >
                    <div className="absolute inset-0 bg-black/60" />
                    <div
                      className="relative z-10 w-full max-w-md rounded-t-[20px] md:rounded-[20px] max-h-[80vh] overflow-y-auto"
                      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Close button */}
                      <button
                        onClick={() => setExpandedProduct(null)}
                        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: 'var(--bg-elev-1)' }}
                      >
                        <X size={16} style={{ color: 'var(--txt-muted)' }} />
                      </button>

                      {/* Product image */}
                      <div className="w-full aspect-square flex items-center justify-center" style={{ background: 'var(--bg-elev-1)' }}>
                        {product.images?.[0] || product.image ? (
                          <img src={product.images?.[0] || product.image} alt={product.title} className="w-full h-full object-contain p-6" />
                        ) : (
                          <span className="text-5xl">💊</span>
                        )}
                      </div>

                      <div className="p-5">
                        <h3 className="text-[16px] font-bold mb-1" style={{ color: 'var(--txt)' }}>{product.title}</h3>
                        <p className="text-[15px] font-bold mb-3" style={{ color: '#00d9ff' }}>${product.price}</p>

                        {product.description && (
                          <p className="text-[13px] leading-relaxed mb-4" style={{ color: 'var(--txt-muted)' }}>
                            {product.description.replace(/<[^>]*>/g, '')}
                          </p>
                        )}

                        {/* Supplement Facts — use LAST image (nutrition label) */}
                        {getSupplementFactsImage(product) && (
                          <div className="mb-4">
                            <p className="text-[11px] font-bold uppercase tracking-[0.8px] mb-2" style={{ color: 'var(--txt-dim)' }}>
                              Supplement Facts
                            </p>
                            <img
                              src={getSupplementFactsImage(product)}
                              alt={`${product.title} supplement facts`}
                              className="w-full rounded-[10px]"
                              style={{ background: '#fff' }}
                            />
                          </div>
                        )}

                        {/* Add to Cart */}
                        <button
                          onClick={() => { handleAddToCart(product); setExpandedProduct(null); }}
                          disabled={!product.variantId}
                          className="w-full py-3.5 rounded-[10px] text-[14px] font-semibold transition-all disabled:opacity-40"
                          style={{ background: '#00d9ff', color: '#09090b' }}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* ═══ SECTION 6: QUIZ CTA BANNER ═══ */}
      <section className="mx-5 mb-6">
        <div
          className="rounded-[18px] p-5 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(0,217,255,0.08), transparent)',
            border: '1px solid rgba(0,217,255,0.15)',
          }}
        >
          <div className="absolute bottom-[-20px] right-[-10px] w-[100px] h-[100px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(0,217,255,0.20), transparent 70%)' }} />
          <div className="w-9 h-9 rounded-[10px] flex items-center justify-center mb-2.5 text-base" style={{ background: '#00d9ff' }}>
            🎯
          </div>
          <h2 className="text-[16px] font-bold mb-1" style={{ color: 'var(--txt)' }}>
            Not sure where to start?
          </h2>
          <p className="text-[12px] leading-relaxed mb-3.5" style={{ color: 'var(--txt-muted)' }}>
            Take our 60-second optimization quiz — we&apos;ll score your current routine, find your bottlenecks, and build your perfect stack.
          </p>
          <Link
            href="/supplement-optimization-score"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-[13px] font-semibold"
            style={{ background: '#00d9ff', color: '#09090b' }}
          >
            Get My Score <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ═══ SECTION 7: OPTIMIZATION SCORE CTA ═══ */}
      <section className="mx-5 mb-6">
        <div
          className="rounded-[18px] p-5 relative overflow-hidden"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <div className="absolute bottom-[-30px] right-[-20px] w-[120px] h-[120px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(0,217,255,0.12), transparent 70%)' }} />
          <div className="w-9 h-9 rounded-[10px] flex items-center justify-center mb-2.5" style={{ background: 'rgba(0,217,255,0.1)' }}>
            <Target size={18} style={{ color: '#00d9ff' }} />
          </div>
          <h2 className="text-[16px] font-bold mb-1" style={{ color: 'var(--txt)' }}>
            Find My Supplement Optimization Score
          </h2>
          <p className="text-[12px] leading-relaxed mb-3.5" style={{ color: 'var(--txt-muted)' }}>
            Get scored on your current supplement routine. We identify your bottlenecks, gaps, and suggest the most personalized supplements to add to your stack.
          </p>
          <Link
            href="/supplement-optimization-score"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-[13px] font-semibold"
            style={{ background: '#00d9ff', color: '#09090b' }}
          >
            Get My Score <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ═══ SECTION 8: AI WIDGET ACCESS CARD ═══ */}
      <section className="mx-5 mb-6">
        <button
          onClick={() => window.dispatchEvent(new Event('open-aviera-ai'))}
          className="w-full rounded-[18px] px-4 py-3.5 flex items-center gap-3 text-left transition-colors"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <div
            className="w-10 h-10 rounded-[11px] flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #00d9ff, #0088aa)' }}
          >
            <Sparkles size={18} style={{ color: '#09090b' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold" style={{ color: 'var(--txt)' }}>Aviera AI</p>
            <p className="text-[11px]" style={{ color: 'var(--txt-muted)' }}>Ask anything about supplements &amp; fitness</p>
          </div>
          <span className="text-lg flex-shrink-0" style={{ color: 'var(--txt-dim, #52525b)' }}>›</span>
        </button>
      </section>

      {/* ═══ SECTION 9: LATEST NEWS ═══ */}
      <section className="mb-7">
        <div className="flex items-baseline justify-between px-5 mb-3">
          <h2 className="text-[17px] font-bold" style={{ color: 'var(--txt)' }}>Latest</h2>
          <Link href="/news" className="text-[12px] font-medium" style={{ color: '#00d9ff' }}>All Articles →</Link>
        </div>
        <Link href="/news" className="block mx-5">
          <div
            className="rounded-[18px] overflow-hidden transition-colors"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <div
              className="h-[120px] flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--bg-elev-1), #1a1a2e)' }}
            >
              <span className="text-sm" style={{ color: 'var(--txt-dim, #52525b)' }}>📰 Featured</span>
            </div>
            <div className="p-3.5">
              <p className="text-[9px] font-bold uppercase tracking-[0.8px] mb-1" style={{ color: '#00d9ff' }}>
                Supplements &amp; Science
              </p>
              <p className="text-[14px] font-semibold leading-snug mb-1" style={{ color: 'var(--txt)' }}>
                Why Most Supplement Stacks Are Wasting Your Money
              </p>
              <p className="text-[11px] leading-relaxed line-clamp-2" style={{ color: 'var(--txt-muted)' }}>
                The evidence behind effective dosing, bioavailability, and what actually matters.
              </p>
            </div>
          </div>
        </Link>
      </section>

      {/* ═══ SECTION 10: NEWSLETTER SIGNUP ═══ */}
      <section className="mx-5 mb-8 sm:mb-12">
        <div
          className="rounded-[18px] p-5 sm:p-8"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <h2 className="text-[17px] font-bold mb-1" style={{ color: 'var(--txt)' }}>
            Stay in the loop
          </h2>
          <p className="text-[13px] mb-4" style={{ color: 'var(--txt-muted)' }}>
            Latest in fitness, supplements, and lifestyle — delivered weekly.
          </p>
          {nlSubmitted ? (
            <p className="text-[13px] font-semibold" style={{ color: '#22c55e' }}>You&apos;re subscribed!</p>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input
                type="email"
                value={nlEmail}
                onChange={(e) => setNlEmail(e.target.value)}
                placeholder="Your email"
                className="flex-1 px-3.5 py-2.5 rounded-[10px] text-sm outline-none transition-colors"
                style={{
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  color: 'var(--txt)',
                  minHeight: '44px',
                }}
              />
              <button
                type="submit"
                disabled={nlLoading}
                className="px-5 py-2.5 rounded-[10px] text-sm font-semibold transition-all"
                style={{ background: '#00d9ff', color: '#09090b', minHeight: '44px', opacity: nlLoading ? 0.7 : 1 }}
              >
                {nlLoading ? '...' : 'Subscribe'}
              </button>
            </form>
          )}
          <p className="text-[10px] mt-2" style={{ color: 'var(--txt-dim, #52525b)' }}>
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </div>
  );
}
