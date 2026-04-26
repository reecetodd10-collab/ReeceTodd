'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSupabaseUser } from '../components/SupabaseAuthProvider';
import { fetchShopifyProducts, addToCart, addMultipleToCart, getCheckoutUrl } from '../lib/shopify';
import ProductDetailModal from '../components/ProductDetailModal';
import PageLayout from '../components/PageLayout';

// ─── Max supplement slots ───
const MAX_SLOTS = 6;

// ─── Category → Color mapping ───
// Red (#ff2d55) = Strength / Performance
// Green (#00e5ff) = Recovery / Focus / Sleep
// Purple (#a855f7) = Weight Management / Skin / Health
const CATEGORY_COLOR_MAP = {
  'Performance': '#00e5ff',
  'Pre-Workout': '#FF3B3B',
  'Pre-Workout & Energy': '#FF3B3B',
  'Protein': '#8B5CF6',
  'Recovery & Hydration': '#FFD700',
  'Recovery': '#FFD700',
  'Recovery & Sleep': '#FFD700',
  'Sleep': '#6366F1',
  'Focus & Cognitive': '#3B82F6',
  'Focus': '#3B82F6',
  'Focus & Energy': '#3B82F6',
  'Health & Wellness': '#22C55E',
  'Health': '#22C55E',
  'Weight Management': '#F97316',
  'Weight': '#F97316',
  'Beauty & Skin': '#EC4899',
  'Beauty': '#EC4899',
  'Beauty & Anti-Aging': '#EC4899',
};

const CATEGORY_COLOR_RGB = {
  '#00e5ff': '0, 229, 255',
  '#FF3B3B': '255, 59, 59',
  '#8B5CF6': '139, 92, 246',
  '#FFD700': '255, 215, 0',
  '#6366F1': '99, 102, 241',
  '#3B82F6': '59, 130, 246',
  '#22C55E': '34, 197, 94',
  '#F97316': '249, 115, 22',
  '#EC4899': '236, 72, 153',
};

// Map product name/title to a category using keyword matching
function getCategoryForProduct(name = '') {
  const n = name.toLowerCase();
  // Performance (cyan) — nitric oxide, creatine, bcaa, beetroot, glutamine
  if (/nitric|pump|flow state x(?!.*nootropic)|creatine|bcaa(?!.*post)|beetroot|glutamine/i.test(n)) return 'Performance';
  // Pre-Workout & Energy (red) — pre-workout, alpha energy
  if (/pre.?workout|alpha energy|nitric shock/i.test(n)) return 'Pre-Workout';
  // Protein (purple) — whey, plant protein
  if (/protein|whey|plant protein/i.test(n)) return 'Protein';
  // Recovery & Hydration (gold) — hydration, electrolyte, bcaa post
  if (/hydration|electrolyte|bcaa post/i.test(n)) return 'Recovery';
  // Focus & Cognitive (blue) — nootropic, lion's mane, energy powder, methylene, flow state nootropic
  if (/nootropic|lion.?s mane|energy powder|methylene|focus|cognitive/i.test(n)) return 'Focus';
  // Sleep (indigo) — sleep, melatonin, magnesium, ashwagandha
  if (/sleep|melatonin|magnesium|ashwagandha/i.test(n)) return 'Sleep';
  // Weight Management (orange) — fat burner, keto, green tea
  if (/fat.?burn|keto|weight|metabolism|thermogenic|green tea/i.test(n)) return 'Weight';
  // Beauty & Skin (pink) — collagen, hyaluronic, vitamin glow, skin, beauty
  if (/collagen|hyaluronic|vitamin glow|skin|beauty|hair/i.test(n)) return 'Beauty';
  // Health & Wellness (green) — everything else
  return 'Health';
}

function getCategoryColor(name) {
  const cat = getCategoryForProduct(name);
  return CATEGORY_COLOR_MAP[cat] || '#a855f7';
}

function getCategoryLabel(name) {
  const cat = getCategoryForProduct(name);
  const labels = {
    'Performance': 'PERFORMANCE',
    'Pre-Workout': 'PRE-WORKOUT & ENERGY',
    'Protein': 'PROTEIN',
    'Recovery': 'RECOVERY & HYDRATION',
    'Sleep': 'SLEEP',
    'Focus': 'FOCUS & COGNITIVE',
    'Weight': 'WEIGHT MANAGEMENT',
    'Beauty': 'BEAUTY & SKIN',
    'Health': 'HEALTH & WELLNESS',
  };
  return labels[cat] || 'HEALTH & WELLNESS';
}

// ─── Scroll-triggered fade-up wrapper ───
function FadeInSection({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}


// ─── Dashboard Loading Skeleton ───
function DashboardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex justify-center mb-8 mt-4">
        <div className="rounded-full" style={{ width: '150px', height: '150px', background: 'rgba(0,0,0,0.04)', border: '6px solid rgba(0,0,0,0.08)' }} />
      </div>
      <div className="mb-3" style={{ width: '120px', height: '12px', background: 'rgba(0,0,0,0.04)', borderRadius: '4px' }} />
      <div className="grid grid-cols-2 gap-2 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-lg" style={{ background: '#ffffff', minHeight: '100px', border: '1px solid rgba(0,0,0,0.06)' }} />
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// DASHBOARD PAGE
// ═══════════════════════════════════════════
export default function DashboardPage() {
  const router = useRouter();
  const { user, session, loading: authLoading, signOut } = useSupabaseUser();

  
  // Views: 'dashboard' | 'detail' | 'celebration'
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedSupplement, setSelectedSupplement] = useState(null);

  // Real data state
  const [dataLoading, setDataLoading] = useState(true);
  const [optimizationScore, setOptimizationScore] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [supplements, setSupplements] = useState([]);
  const [intakeLogs, setIntakeLogs] = useState([]);
  const [loggingIntake, setLoggingIntake] = useState(false);
  const [purchases, setPurchases] = useState([]);
  const [loggedToday, setLoggedToday] = useState(new Set());

  // Stack builder state
  const [stackItems, setStackItems] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [shopifyProducts, setShopifyProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [savingStack, setSavingStack] = useState(false);
  const [stackSaved, setStackSaved] = useState(false);
  const [lastResultId, setLastResultId] = useState(null);
  const [lastResultData, setLastResultData] = useState(null);
  const searchRef = useRef(null);

  // Cart state
  const [addingToCart, setAddingToCart] = useState({});
  const [addingStackToCart, setAddingStackToCart] = useState(false);
  const [stackAddedToCart, setStackAddedToCart] = useState(false);

  // Intake log dropdown state
  const [showLogDropdown, setShowLogDropdown] = useState(false);
  const logDropdownRef = useRef(null);

  // Suggestions panel (shown when clicking empty slot)
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Cart item count for nav badge
  const [cartCount, setCartCount] = useState(0);

  // Product detail modal
  const [detailProduct, setDetailProduct] = useState(null);

  // Expandable category browsing
  const [expandedCategories, setExpandedCategories] = useState({});
  const toggleCategory = (cat) => setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));

  // Install App CTA - shows after 15 seconds on first visit
  const [showInstallCTA, setShowInstallCTA] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    const hasSeenInstall = localStorage.getItem('aviera_install_dismissed');
    if (!hasSeenInstall) {
      const timer = setTimeout(() => setShowInstallCTA(true), 15000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Listen for cart updates to show badge count
  useEffect(() => {
    const handleCartUpdate = (e) => {
      setCartCount(e.detail?.itemCount || 0);
    };
    window.addEventListener('shopify:cart:updated', handleCartUpdate);
    return () => window.removeEventListener('shopify:cart:updated', handleCartUpdate);
  }, []);

  // Auto-save stack to Supabase whenever stackItems change (debounced)
  const autoSaveTimerRef = useRef(null);
  useEffect(() => {
    if (!session?.access_token || stackItems.length === 0) return;
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(async () => {
      try {
        await fetch('/api/stacks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            name: 'My Supplement Plan',
            supplements: stackItems.map((s) => ({ name: s.name, price: s.price })),
          }),
        });
      } catch (_) {}
    }, 1500);
    return () => { if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current); };
  }, [stackItems, session?.access_token]);

  // Redirect to /auth if not signed in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [authLoading, user, router]);

  // Close search dropdown and log dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
      if (logDropdownRef.current && !logDropdownRef.current.contains(e.target)) {
        setShowLogDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch Shopify products for search
  useEffect(() => {
    async function loadShopifyProducts() {
      try {
        const products = await fetchShopifyProducts();
        setShopifyProducts(products || []);
      } catch (err) {
        console.error('Failed to load Shopify products:', err);
      }
    }
    loadShopifyProducts();
  }, []);

  // Filter search results as user types
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      setSearchOpen(false);
      return;
    }
    const q = searchQuery.toLowerCase();
    const filtered = shopifyProducts
      .filter((p) => {
        const title = (p.title || p.node?.title || '').toLowerCase();
        return title.includes(q);
      })
      .slice(0, 6)
      .map((p) => ({
        id: p.id || p.node?.id || Math.random().toString(),
        name: p.title || p.node?.title || 'Unknown',
        price: p.priceRange?.minVariantPrice?.amount || p.node?.priceRange?.minVariantPrice?.amount || '',
      }));
    setSearchResults(filtered);
    setSearchOpen(filtered.length > 0);
  }, [searchQuery, shopifyProducts]);

  // Fetch real data on mount
  const fetchDashboardData = useCallback(async () => {
    if (!session?.access_token) return;

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    };

    setDataLoading(true);

    try {
      const [intakeRes, stacksRes, optimizationRes, purchasesRes] = await Promise.allSettled([
        fetch('/api/intake?days=30', { headers }),
        fetch('/api/stacks', { headers }),
        fetch('/api/optimization-results?history=true', { headers }),
        fetch('/api/purchases', { headers }),
      ]);

      // Process intake data
      if (intakeRes.status === 'fulfilled' && intakeRes.value.ok) {
        const intakeData = await intakeRes.value.json();
        setCurrentStreak(intakeData.streak || 0);
        setLongestStreak(intakeData.longest_streak || 0);
        setIntakeLogs(intakeData.logs || []);

        // Build set of supplements logged today
        const todayStr = new Date().toDateString();
        const todaySet = new Set();
        (intakeData.logs || []).forEach(log => {
          if (new Date(log.taken_at).toDateString() === todayStr) {
            todaySet.add(log.supplement_name.toLowerCase());
          }
        });
        setLoggedToday(todaySet);
      }

      // Process stacks data
      if (stacksRes.status === 'fulfilled' && stacksRes.value.ok) {
        const stacksData = await stacksRes.value.json();
        const stacks = stacksData.stacks || [];
        if (stacks.length > 0) {
          // Use the latest stack
          const latestStack = stacks[0];
          const stackSupplements = (latestStack.supplements || latestStack.items || []).map(
            (supp, idx) => ({
              id: supp.id || idx + 1,
              name: supp.name || supp.supplement_name || 'Unknown',
              tier: supp.tier || (idx < 2 ? 'MUST HAVE' : 'RECOMMENDED'),
              tierColor: (supp.tier || '').toUpperCase() === 'MUST HAVE' || idx < 2 ? '#00e5ff' : '#a855f7',
              dosage: supp.dosage || supp.dose || '',
              progress: supp.progress || 0,
              streak: supp.streak || 0,
              servingsCompleted: supp.servings_completed || 0,
              servingsTotal: supp.servings_total || 60,
              personalBest: supp.personal_best || 0,
              aiNote: supp.ai_note || supp.reason || '',
              howToTake: supp.how_to_take || [],
            })
          );
          setSupplements(stackSupplements);
          // Populate stack builder items from saved stack
          setStackItems(
            (latestStack.supplements || latestStack.items || []).slice(0, MAX_SLOTS).map((supp, idx) => ({
              id: supp.id || `saved-${idx}`,
              name: supp.name || supp.supplement_name || 'Unknown',
              price: supp.price || '',
            }))
          );
        }
      }

      // Process optimization score and recommended products
      if (optimizationRes.status === 'fulfilled' && optimizationRes.value.ok) {
        const optimizationData = await optimizationRes.value.json();
        const results = optimizationData.results || [];
        if (results.length > 0) {
          const latestResult = results[0];
          setOptimizationScore(latestResult.optimization_score || 0);
          setLastResultId(latestResult.id);
          setLastResultData(latestResult);
          // Extract recommended products from quiz result
          const recs = latestResult.recommended_products || [];
          setRecommendedProducts(Array.isArray(recs) ? recs : []);
        }
      }
      // Process purchase history
      if (purchasesRes.status === 'fulfilled' && purchasesRes.value.ok) {
        const purchasesData = await purchasesRes.value.json();
        setPurchases(purchasesData.purchases || []);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setDataLoading(false);
    }
  }, [session?.access_token]);

  useEffect(() => {
    if (session?.access_token) {
      fetchDashboardData();
    }
  }, [session?.access_token, fetchDashboardData]);

  // Recover quiz results from sessionStorage (for post-signup redirect)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = sessionStorage.getItem('aviera_quiz_results');
      if (saved && recommendedProducts.length === 0) {
        const parsed = JSON.parse(saved);
        if (parsed.recommendations?.length > 0) {
          setRecommendedProducts(parsed.recommendations);
        }
        if (parsed.scores?.total) {
          setOptimizationScore(parsed.scores.total);
        }
        // Clear after loading so it doesn't override future API data
        sessionStorage.removeItem('aviera_quiz_results');
      }
    } catch (_) {}
  }, [recommendedProducts.length]);

  // Cooldown state
  const [cooldownHours, setCooldownHours] = useState(0);
  const [showCooldown, setShowCooldown] = useState(false);

  // Log intake for a supplement
  const handleLogIntake = async (supplementName, supplementObj = null) => {
    if (!session?.access_token || loggingIntake) return;

    setLoggingIntake(true);
    try {
      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ supplement_name: supplementName }),
      });

      if (res.ok) {
        const data = await res.json();

        // Check cooldown
        if (data.cooldown) {
          setCooldownHours(data.hoursLeft || 0);
          setShowCooldown(true);
          setTimeout(() => setShowCooldown(false), 4000);
          return;
        }

        // Mark this supplement as logged today
        setLoggedToday(prev => new Set([...prev, supplementName.toLowerCase()]));

        // Update streak immediately from response
        if (data.streak != null) setCurrentStreak(data.streak);
        if (data.longestStreak != null) setLongestStreak(data.longestStreak);

        // Set selectedSupplement for celebration view if not already set
        if (!selectedSupplement || selectedSupplement.name !== supplementName) {
          const matchedSupp = supplements.find(s => s.name === supplementName);
          setSelectedSupplement(matchedSupp || {
            name: supplementName,
            servingsCompleted: 0,
            servingsTotal: 60,
            streak: data.streak || 1,
            personalBest: data.longestStreak || 0,
          });
        }

        // Show celebration
        setCurrentView('celebration');
        // Refresh data in background
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Failed to log intake:', err);
    } finally {
      setLoggingIntake(false);
    }
  };

  const handleSlotClick = (supplement) => {
    setSelectedSupplement(supplement);
    setCurrentView('detail');
  };

  const handleConfirmIntake = () => {
    if (selectedSupplement) {
      handleLogIntake(selectedSupplement.name, selectedSupplement);
    }
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedSupplement(null);
  };

  const handleBackToStack = () => {
    setCurrentView('dashboard');
  };

  // ─── Helper: find Shopify variantId by product name ───
  const findVariantId = (name) => {
    const match = shopifyProducts.find(
      (p) => (p.title || '').toLowerCase() === name.toLowerCase()
    );
    return match?.variantId || null;
  };

  const findShopifyProduct = (name) => {
    if (!name || !shopifyProducts.length) return null;
    const n = (name || '').toLowerCase();
    // Exact match first
    const exact = shopifyProducts.find((p) => (p.title || '').toLowerCase() === n);
    if (exact) return exact;
    // Partial match - product title contains name or name contains first word of title
    return shopifyProducts.find(
      (p) => {
        const t = (p.title || '').toLowerCase();
        return t.includes(n) || n.includes(t) || n.includes(t.split(' ')[0]) || t.includes(n.split(' ')[0]);
      }
    ) || null;
  };

  // ─── Stack Builder helpers ───
  const addToStack = (item) => {
    if (stackItems.length >= MAX_SLOTS) return;
    const alreadyIn = stackItems.some(
      (s) => s.name.toLowerCase() === item.name.toLowerCase()
    );
    if (alreadyIn) return;
    // Resolve variantId from Shopify products for cart functionality
    const variantId = item.variantId || findVariantId(item.name);
    setStackItems((prev) => [
      ...prev,
      { id: item.id || `custom-${Date.now()}`, name: item.name, price: item.price || '', variantId },
    ]);
    setStackSaved(false);
    setStackAddedToCart(false);
  };

  const removeFromStack = (id) => {
    setStackItems((prev) => prev.filter((s) => s.id !== id));
    setStackSaved(false);
  };

  const handleSearchSelect = (product) => {
    addToStack(product);
    setSearchQuery('');
    setSearchOpen(false);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim().length > 0) {
      addToStack({ id: `custom-${Date.now()}`, name: searchQuery.trim(), price: '' });
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const handleSaveStack = async () => {
    if (!session?.access_token || stackItems.length === 0) return;
    setSavingStack(true);
    try {
      const res = await fetch('/api/stacks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          name: 'My Supplement Plan',
          supplements: stackItems.map((s) => ({ name: s.name, price: s.price })),
        }),
      });
      if (res.ok) {
        setStackSaved(true);
        setTimeout(() => setStackSaved(false), 3000);
        // Sync stack items to intake tracker so they appear there
        const newSupplements = stackItems.map((s, idx) => ({
          id: s.id || idx + 1,
          name: s.name,
          tier: idx < 2 ? 'MUST HAVE' : 'RECOMMENDED',
          tierColor: idx < 2 ? '#00e5ff' : '#a855f7',
          dosage: '',
          progress: 0,
          streak: 0,
          servingsCompleted: 0,
          servingsTotal: 60,
          personalBest: 0,
          aiNote: '',
          howToTake: [],
        }));
        setSupplements(newSupplements);
      }
    } catch (err) {
      console.error('Failed to save stack:', err);
    } finally {
      setSavingStack(false);
    }
  };

  // ─── Cart helpers ───
  const handleAddItemToCart = async (item) => {
    if (!item.variantId) {
      // Try to find variantId from Shopify products
      const vid = findVariantId(item.name);
      if (!vid) return; // Can't add to cart without variantId
      item = { ...item, variantId: vid };
    }
    setAddingToCart((prev) => ({ ...prev, [item.id]: true }));
    try {
      await addToCart(item.variantId, 1);
      setAddingToCart((prev) => ({ ...prev, [item.id]: 'done' }));
      setTimeout(() => setAddingToCart((prev) => ({ ...prev, [item.id]: false })), 2000);
    } catch (err) {
      console.error('Failed to add to cart:', err);
      setAddingToCart((prev) => ({ ...prev, [item.id]: false }));
    }
  };

  const handleAddStackToCart = async () => {
    const cartableItems = stackItems
      .map((s) => ({ variantId: s.variantId || findVariantId(s.name), quantity: 1 }))
      .filter((i) => i.variantId);
    if (cartableItems.length === 0) return;
    setAddingStackToCart(true);
    try {
      await addMultipleToCart(cartableItems);
      setStackAddedToCart(true);
      setTimeout(() => setStackAddedToCart(false), 3000);
    } catch (err) {
      console.error('Failed to add stack to cart:', err);
    } finally {
      setAddingStackToCart(false);
    }
  };

  const handleCheckout = async () => {
    const url = await getCheckoutUrl();
    window.open(url, '_blank');
  };

  // Score ring calculations
  const scoreValue = optimizationScore;
  const radius = 65;
  const circumference = 2 * Math.PI * radius;
  const scoreOffset = circumference - (scoreValue / 100) * circumference;

  // Score label based on value
  const getScoreLabel = (score) => {
    if (score >= 80) return "YOU'RE CRUSHING IT";
    if (score >= 60) return 'SOLID PROGRESS';
    if (score >= 40) return 'BUILDING MOMENTUM';
    if (score > 0) return 'JUST GETTING STARTED';
    return 'TAKE THE QUIZ';
  };

  const getScoreSubtext = (score) => {
    if (score >= 80) return "You're in the top 15% of optimizers";
    if (score >= 60) return 'Above average optimization';
    if (score >= 40) return 'Room to improve your stack';
    if (score > 0) return 'Consistency is key';
    return 'Complete the O.S. quiz to get your score';
  };

  // Confetti colors
  const confettiColors = ['#00e5ff', '#FF3B3B', '#a855f7'];

  // Empty slot count for the existing stack display
  const emptySlots = Math.max(0, MAX_SLOTS - supplements.length);

  // Empty slot count for the stack builder
  const builderEmptySlots = Math.max(0, MAX_SLOTS - stackItems.length);

  // Show loading or redirect states
  if (authLoading) {
    return (
      <PageLayout hideFooter>
        <div className="relative min-h-screen" style={{ background: '#F5F0EB', color: '#28282A' }}>
          <main className="relative z-10 pt-[60px] pb-24 px-5">
            <div className="max-w-[430px] md:max-w-3xl mx-auto">
              <DashboardSkeleton />
            </div>
          </main>
        </div>
      </PageLayout>
    );
  }

  if (!user) {
    // Will redirect via useEffect
    return null;
  }

  return (
    <PageLayout hideFooter>
    <div
      className="relative min-h-screen"
      style={{
        background: '#F5F0EB',
        color: '#28282A',
      }}
    >
      {/* Main content */}
      <main className="relative z-10 pt-[85px] pb-24 px-5">
        <div className="max-w-[430px] md:max-w-3xl mx-auto">

          {/* Show skeleton while data is loading */}
          {dataLoading && currentView === 'dashboard' && <DashboardSkeleton />}

          {/* ═══ VIEW 1: DASHBOARD HOME ═══ */}
          {!dataLoading && currentView === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Page Title */}
              <h1
                className="text-center mb-6"
                style={{
                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                  fontSize: '28px',
                  fontWeight: 700,
                  letterSpacing: '4px',
                  textTransform: 'uppercase',
                  color: '#28282A',
                }}
              >
                My Supplement Plan
              </h1>

              {/* O.S. Score Section */}
              <FadeInSection>
              <div style={{ background: 'rgba(0,0,0,0.03)', borderRadius: '16px', padding: '20px 16px', marginBottom: '8px', border: '1px solid rgba(0,0,0,0.04)' }}>
                <p
                  className="text-center mb-4"
                  style={{
                    fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                    fontSize: '9px',
                    color: '#00e5ff',
                    letterSpacing: '3px',
                    textTransform: 'uppercase',
                  }}
                >
                  START PROGRESSING
                </p>

                {/* Score Ring */}
                <div className="flex justify-center mb-2 relative">
                  <svg
                    width="150"
                    height="150"
                    viewBox="0 0 150 150"
                    style={{ transform: 'rotate(-90deg)' }}
                  >
                    <circle
                      cx="75"
                      cy="75"
                      r={radius}
                      fill="none"
                      stroke="rgba(0,0,0,0.08)"
                      strokeWidth="6"
                    />
                    <motion.circle
                      cx="75"
                      cy="75"
                      r={radius}
                      fill="none"
                      stroke="#00e5ff"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset: scoreOffset }}
                      transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
                      style={{
                        filter: 'drop-shadow(0 0 6px rgba(0, 255, 204, 0.4))',
                      }}
                    />
                  </svg>
                  <div
                    className="absolute"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                        fontSize: '72px',
                        fontWeight: 700,
                        color: '#28282A',
                        lineHeight: 1,
                      }}
                    >
                      {scoreValue}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                        fontSize: '24px',
                        color: 'rgba(0,0,0,0.5)',
                        fontWeight: 400,
                      }}
                    >
                      /100
                    </span>
                  </div>
                </div>

                {/* Score Label */}
                <p
                  className="text-center mb-1"
                  style={{
                    fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                    fontSize: '14px',
                    color: '#00e5ff',
                    letterSpacing: '4px',
                    textShadow: '0 0 20px rgba(0, 255, 204, 0.3)',
                  }}
                >
                  {getScoreLabel(scoreValue)}
                </p>
                <p
                  className="text-center mb-7"
                  style={{
                    fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                    fontSize: '10px',
                    color: 'rgba(0,0,0,0.5)',
                  }}
                >
                  {getScoreSubtext(scoreValue)}
                </p>
                {/* View Last Results link */}
                {lastResultId ? (
                  <Link
                    href={`/supplement-optimization-score?results=${lastResultId}`}
                    className="block text-center no-underline mb-1"
                    style={{
                      fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                      fontSize: '9px',
                      color: '#00e5ff',
                      letterSpacing: '1px',
                      textDecoration: 'none',
                    }}
                  >
                    VIEW LAST RESULTS &rarr;
                  </Link>
                ) : (
                  <Link
                    href="/supplement-optimization-score"
                    className="block text-center no-underline mb-1"
                    style={{
                      fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                      fontSize: '9px',
                      color: '#00e5ff',
                      letterSpacing: '1px',
                      textDecoration: 'none',
                    }}
                  >
                    TAKE THE QUIZ &rarr;
                  </Link>
                )}
              </div>
              </FadeInSection>

              {/* Streak Banner */}
              {currentStreak > 0 && (
                <FadeInSection delay={0.05}>
                  <div
                    className="text-center mb-4 py-3 rounded-lg"
                    style={{
                      background: 'rgba(255, 45, 85, 0.08)',
                      border: '1px solid rgba(255, 45, 85, 0.2)',
                    }}
                  >
                    <p
                      className="streak-glow"
                      style={{
                        fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                        fontSize: '16px',
                        color: '#ff2d55',
                        letterSpacing: '2px',
                      }}
                    >
                      {'\u{1F525}'} {currentStreak} DAY STREAK
                    </p>
                    {longestStreak > currentStreak && (
                      <p
                        style={{
                          fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                          fontSize: '9px',
                          color: 'rgba(0,0,0,0.5)',
                          marginTop: '4px',
                        }}
                      >
                        Personal best: {longestStreak} days
                      </p>
                    )}
                  </div>
                </FadeInSection>
              )}

              {/* ═══ STACK BUILDER SECTION ═══ */}
              <FadeInSection delay={0.08}>
                {/* Section header */}
                <div
                  className="mb-5"
                  style={{
                    height: '1px',
                    background: 'rgba(0,0,0,0.04)',
                  }}
                />
                <h2
                  className="text-center mb-4"
                  style={{
                    fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#28282A',
                    letterSpacing: '3px',
                    textTransform: 'uppercase',
                  }}
                >
                  Build Your <span style={{ color: '#00b8d4' }}>Stack</span>
                </h2>

                {/* Divider */}
              <div
                className="mb-6 mt-2"
                style={{
                  height: '1px',
                  background: 'rgba(0,0,0,0.04)',
                }}
              />

              {/* Your Stack (existing supplement tracker) */}
              <FadeInSection delay={0.1}>
              <div style={{ background: 'rgba(0,0,0,0.03)', borderRadius: '16px', padding: '20px 16px', marginBottom: '8px', border: '1px solid rgba(0,0,0,0.04)' }}>
                <h2
                  className="text-center mb-4"
                  style={{
                    fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#28282A',
                    letterSpacing: '3px',
                    textTransform: 'uppercase',
                  }}
                >
                  Your <span style={{ color: '#00b8d4' }}>Stack</span>
                  {supplements.length > 0 && (
                    <span style={{ fontFamily: 'var(--font-space-mono), Space Mono, monospace', fontSize: '10px', color: 'rgba(0,0,0,0.35)', fontWeight: 400, letterSpacing: '1px', marginLeft: '8px' }}>
                      {supplements.length} {supplements.length === 1 ? 'product' : 'products'}
                    </span>
                  )}
                </h2>

                {/* Today's progress bar */}
                {supplements.length > 0 && (() => {
                  const todayCount = supplements.filter(s => loggedToday.has(s.name.toLowerCase())).length;
                  const total = supplements.length;
                  const allDone = todayCount === total;
                  const pct = total > 0 ? Math.round((todayCount / total) * 100) : 0;
                  return (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span style={{ fontFamily: 'var(--font-space-mono), Space Mono, monospace', fontSize: '9px', color: allDone ? '#10b981' : 'rgba(0,0,0,0.45)', letterSpacing: '0.5px' }}>
                          {allDone ? '✓ ALL LOGGED TODAY' : `TODAY: ${todayCount}/${total} LOGGED`}
                        </span>
                        <span style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif', fontSize: '11px', color: allDone ? '#10b981' : '#00b8d4', letterSpacing: '1px' }}>
                          {currentStreak > 0 && `🔥 ${currentStreak} DAY STREAK`}
                        </span>
                      </div>
                      <div style={{ height: '6px', background: 'rgba(0,0,0,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          style={{
                            height: '100%',
                            borderRadius: '3px',
                            background: allDone
                              ? 'linear-gradient(90deg, #10b981, #34d399)'
                              : 'linear-gradient(90deg, #00b8d4, #00e5ff)',
                          }}
                        />
                      </div>
                    </div>
                  );
                })()}

                <div className="flex justify-end items-baseline mb-3">
                  {/* Log Intake dropdown button */}
                  <div ref={logDropdownRef} className="relative">
                    <button
                      onClick={() => setShowLogDropdown(!showLogDropdown)}
                      className="rounded cursor-pointer transition-all"
                      style={{
                        fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                        fontSize: '10px',
                        letterSpacing: '1px',
                        color: '#00e5ff',
                        background: 'transparent',
                        border: '1px solid rgba(0,229,255,0.3)',
                        padding: '4px 10px',
                        textTransform: 'uppercase',
                      }}
                    >
                      LOG INTAKE {showLogDropdown ? '\u25B2' : '\u25BC'}
                    </button>

                    <AnimatePresence>
                      {showLogDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 z-20 rounded-lg overflow-hidden"
                          style={{
                            top: 'calc(100% + 4px)',
                            width: '200px',
                            background: '#ffffff',
                            border: '1px solid rgba(0,0,0,0.1)',
                          }}
                        >
                          {(supplements.length > 0 ? supplements : stackItems).map((item, idx) => {
                            const dCatColor = getCategoryColor(item.name);
                            const dCatRgb = CATEGORY_COLOR_RGB[dCatColor] || '168, 85, 247';
                            const dIsLogged = loggedToday.has(item.name.toLowerCase());
                            return (
                              <button
                                key={`log-${idx}`}
                                onClick={() => {
                                  if (!dIsLogged) {
                                    handleLogIntake(item.name);
                                    setShowLogDropdown(false);
                                  }
                                }}
                                disabled={loggingIntake || dIsLogged}
                                className="w-full text-left"
                                style={{
                                  padding: '10px 12px',
                                  background: dIsLogged ? 'rgba(16,185,129,0.04)' : 'transparent',
                                  border: 'none',
                                  borderBottom: '1px solid rgba(0,0,0,0.05)',
                                  borderLeft: `3px solid ${dIsLogged ? '#10b981' : dCatColor}`,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  cursor: dIsLogged ? 'default' : 'pointer',
                                }}
                                onMouseEnter={(e) => { if (!dIsLogged) e.currentTarget.style.background = `rgba(${dCatRgb},0.05)`; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = dIsLogged ? 'rgba(16,185,129,0.04)' : 'transparent'; }}
                              >
                                <span style={{
                                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                                  fontSize: '11px',
                                  color: dIsLogged ? 'rgba(0,0,0,0.35)' : '#28282A',
                                  letterSpacing: '0.5px',
                                  textTransform: 'uppercase',
                                }}>
                                  {item.name}
                                </span>
                                <span style={{
                                  fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                                  fontSize: '8px',
                                  color: dIsLogged ? '#10b981' : '#00e5ff',
                                }}>
                                  {dIsLogged ? 'DONE ✓' : 'LOG'}
                                </span>
                              </button>
                            );
                          })}
                          {supplements.length === 0 && stackItems.length === 0 && (
                            <p style={{
                              padding: '12px',
                              fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                              fontSize: '9px',
                              color: 'rgba(0,0,0,0.55)',
                              textAlign: 'center',
                            }}>
                              Build your stack first
                            </p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Stack Grid — Category-colored product cards */}
                <div
                  className="grid grid-cols-2 gap-2 mb-6"
                >
                  {/* Filled Slots */}
                  {supplements.map((supp) => {
                    const catColor = getCategoryColor(supp.name);
                    const catLabel = getCategoryLabel(supp.name);
                    const catRgb = CATEGORY_COLOR_RGB[catColor] || '168, 85, 247';
                    const shopifyMatch = findShopifyProduct(supp.name);
                    const productImg = shopifyMatch?.images?.[0] || shopifyMatch?.image || null;
                    const isLogged = loggedToday.has(supp.name.toLowerCase());
                    return (
                      <div
                        key={supp.id}
                        className="rounded-xl cursor-pointer transition-all relative overflow-hidden"
                        style={{
                          background: isLogged ? `rgba(16,185,129,0.04)` : '#ffffff',
                          border: `1px solid ${isLogged ? 'rgba(16,185,129,0.3)' : `rgba(${catRgb}, 0.15)`}`,
                          padding: '14px',
                          minHeight: '110px',
                          boxShadow: isLogged ? '0 2px 12px rgba(16,185,129,0.1)' : '0 2px 8px rgba(0,0,0,0.04)',
                        }}
                        onClick={() => {
                          if (shopifyMatch) {
                            setDetailProduct(shopifyMatch);
                          } else {
                            handleSlotClick(supp);
                          }
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = `0 4px 16px rgba(${catRgb}, 0.15)`;
                          e.currentTarget.style.borderColor = catColor;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
                          e.currentTarget.style.borderColor = `rgba(${catRgb}, 0.2)`;
                        }}
                      >
                        {/* Top color bar */}
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '3px',
                          background: isLogged ? '#10b981' : catColor,
                        }} />

                        {/* Logged checkmark badge */}
                        {isLogged && (
                          <div style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: '#10b981',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 6px rgba(16,185,129,0.3)',
                            zIndex: 2,
                          }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </div>
                        )}

                        {/* Product image */}
                        {productImg && (
                          <div className="w-full flex items-center justify-center mb-3" style={{ height: '72px', background: '#fafafa', borderRadius: '10px', overflow: 'hidden' }}>
                            <img src={productImg} alt={supp.name} className="h-full object-contain" style={{ maxWidth: '100%', padding: '6px' }} />
                          </div>
                        )}

                        {/* Category badge */}
                        <span
                          style={{
                            display: 'inline-block',
                            background: `rgba(${catRgb}, 0.12)`,
                            border: `1px solid rgba(${catRgb}, 0.3)`,
                            color: catColor,
                            fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                            fontSize: '6px',
                            letterSpacing: '1.5px',
                            padding: '2px 5px',
                            borderRadius: '2px',
                            marginBottom: '6px',
                          }}
                        >
                          {catLabel}
                        </span>

                        <p
                          className="mb-1"
                          style={{
                            fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                            fontSize: '13px',
                            fontWeight: 700,
                            color: '#28282A',
                            letterSpacing: '0.5px',
                            textTransform: 'uppercase',
                            lineHeight: 1.2,
                          }}
                        >
                          {supp.name}
                        </p>
                        {supp.dosage && (
                          <p
                            className="mb-[6px]"
                            style={{
                              fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                              fontSize: '9px',
                              color: 'rgba(0,0,0,0.5)',
                            }}
                          >
                            {supp.dosage}
                          </p>
                        )}
                        {/* Progress bar */}
                        <div
                          className="mb-1 overflow-hidden"
                          style={{
                            height: '4px',
                            background: 'rgba(0,0,0,0.08)',
                            borderRadius: '4px',
                          }}
                        >
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${supp.progress}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            style={{
                              height: '100%',
                              borderRadius: '4px',
                              background: `linear-gradient(90deg, ${catColor}, ${catColor}88)`,
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <p style={{ fontSize: '9px', color: '#ff2d55' }}>
                            {'\u{1F525}'} {supp.streak} days
                          </p>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const sp = findShopifyProduct(supp.name);
                                if (sp) setDetailProduct(sp);
                              }}
                              className="bg-transparent border-none cursor-pointer"
                              style={{
                                fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                                fontSize: '8px',
                                color: '#00e5ff',
                                padding: '2px 6px',
                                border: '1px solid rgba(0,229,255,0.4)',
                                borderRadius: '3px',
                                background: 'rgba(0,229,255,0.08)',
                              }}
                              title="View product details"
                            >
                              VIEW CARD
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!isLogged) handleLogIntake(supp.name);
                              }}
                              disabled={loggingIntake || isLogged}
                              className="bg-transparent border-none cursor-pointer"
                              style={{
                                fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                                fontSize: '8px',
                                color: isLogged ? '#10b981' : catColor,
                                padding: '2px 6px',
                                border: `1px solid ${isLogged ? 'rgba(16,185,129,0.4)' : `rgba(${catRgb}, 0.3)`}`,
                                borderRadius: '3px',
                                background: isLogged ? 'rgba(16,185,129,0.08)' : 'transparent',
                                opacity: loggingIntake ? 0.5 : 1,
                                cursor: isLogged ? 'default' : 'pointer',
                              }}
                              title={isLogged ? 'Logged today' : 'Log intake'}
                            >
                              {isLogged ? 'DONE ✓' : 'LOG'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Empty Slots — show 1 "add from stack" button, rest are placeholders */}
                  {emptySlots > 0 && (
                    <div
                      key="add-from-stack"
                      className="rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors relative"
                      style={{
                        border: '1px dashed rgba(0,229,255,0.15)',
                        minHeight: '100px',
                        background: 'transparent',
                      }}
                      onClick={() => setShowLogDropdown(!showLogDropdown)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(0,229,255,0.3)';
                        e.currentTarget.style.background = 'rgba(0, 255, 204, 0.02)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(0,229,255,0.15)';
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <span style={{
                        fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                        fontSize: '18px',
                        color: '#00e5ff',
                        marginBottom: '2px',
                      }}>+</span>
                      <span style={{
                        fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                        fontSize: '7px',
                        color: '#00e5ff',
                      }}>
                        ADD FROM STACK
                      </span>
                    </div>
                  )}
                  {emptySlots > 1 && Array.from({ length: emptySlots - 1 }).map((_, i) => (
                    <div
                      key={`empty-${i}`}
                      className="rounded-lg flex flex-col items-center justify-center"
                      style={{
                        border: '1px dashed rgba(0,0,0,0.06)',
                        minHeight: '100px',
                        background: 'transparent',
                      }}
                    >
                      <span style={{
                        fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                        fontSize: '18px',
                        color: '#222',
                      }}>+</span>
                    </div>
                  ))}
                </div>
              </div>
              </FadeInSection>


{/* Personalized Recommendations */}
                {(recommendedProducts.length > 0 || shopifyProducts.length > 0) && (
                  <div style={{ background: 'rgba(0,0,0,0.03)', borderRadius: '16px', padding: '20px 16px', marginBottom: '8px', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <h2
                      className="mb-4 text-center"
                      style={{
                        fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                        fontSize: '20px',
                        fontWeight: 700,
                        color: '#28282A',
                        letterSpacing: '3px',
                        textTransform: 'uppercase',
                      }}
                    >
                      Personalized <span style={{ color: '#00b8d4' }}>Recommendations</span>
                    </h2>
                    <div className="grid grid-cols-2 gap-2">
                      {(() => {
                        // Show quiz recommendations + AI-suggested extras from Shopify catalog
                        const quizRecs = recommendedProducts.slice(0, 3);
                        const quizTitles = new Set(quizRecs.map(r => (r.title || '').toLowerCase()));
                        const stackTitles = new Set(stackItems.map(s => s.name.toLowerCase()));
                        // Add extra AI picks from Shopify products not already in quiz recs or stack
                        const extras = shopifyProducts
                          .filter(p => !quizTitles.has(p.title.toLowerCase()) && !stackTitles.has(p.title.toLowerCase()))
                          .slice(0, 6 - quizRecs.length)
                          .map(p => ({ title: p.title, price: p.price?.toFixed(2), isAISuggested: true }));
                        return [...quizRecs, ...extras];
                      })().map((rec, idx) => {
                        const catColor = getCategoryColor(rec.title || '');
                        const catLabel = getCategoryLabel(rec.title || '');
                        const catRgb = CATEGORY_COLOR_RGB[catColor] || '168, 85, 247';
                        const recShopify = findShopifyProduct(rec.title);
                        const recImg = recShopify?.images?.[0] || recShopify?.image || null;
                        const alreadyAdded = stackItems.some(
                          (s) => s.name.toLowerCase() === (rec.title || '').toLowerCase()
                        );
                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: idx * 0.08 }}
                            className="rounded-lg relative overflow-hidden cursor-pointer"
                            style={{
                              background: '#ffffff',
                              border: `1px solid rgba(${catRgb}, 0.25)`,
                              padding: '14px 12px 12px',
                              minHeight: '110px',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                            }}
                            onClick={() => {
                              if (recShopify) setDetailProduct({ ...recShopify, price: rec.price || recShopify.price });
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.boxShadow = `0 4px 16px rgba(${catRgb}, 0.15)`;
                              e.currentTarget.style.borderColor = catColor;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
                              e.currentTarget.style.borderColor = `rgba(${catRgb}, 0.25)`;
                            }}
                          >
                            {/* Top glow line */}
                            <div style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              height: '2px',
                              background: `linear-gradient(90deg, ${catColor}, transparent)`,
                            }} />

                            <div>
                              {/* Product image */}
                              {recImg && (
                                <div className="w-full flex items-center justify-center mb-2" style={{ height: '60px', background: '#f8f8f8', borderRadius: '6px', overflow: 'hidden' }}>
                                  <img src={recImg} alt={rec.title} className="h-full object-contain" style={{ maxWidth: '100%', padding: '4px' }} />
                                </div>
                              )}

                              {/* Category badge */}
                              <span
                                style={{
                                  display: 'inline-block',
                                  background: `rgba(${catRgb}, 0.12)`,
                                  border: `1px solid rgba(${catRgb}, 0.3)`,
                                  color: catColor,
                                  fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                                  fontSize: '7px',
                                  letterSpacing: '1.5px',
                                  padding: '2px 6px',
                                  borderRadius: '3px',
                                  marginBottom: '8px',
                                }}
                              >
                                {catLabel}
                              </span>

                              {/* Product name */}
                              <p
                                style={{
                                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                                  fontSize: '12px',
                                  color: '#28282A',
                                  letterSpacing: '0.5px',
                                  textTransform: 'uppercase',
                                  lineHeight: 1.2,
                                  marginBottom: '4px',
                                }}
                              >
                                {rec.title}
                              </p>

                              {rec.price && (
                                <p style={{
                                  fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                                  fontSize: '9px',
                                  color: 'rgba(0,0,0,0.5)',
                                }}>
                                  ${rec.price}
                                </p>
                              )}
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-1 mt-2">
                              <button
                                onClick={() => {
                                  const sp = findShopifyProduct(rec.title);
                                  if (sp) setDetailProduct({ ...sp, price: rec.price || sp.price });
                                }}
                                className="rounded cursor-pointer transition-all"
                                style={{
                                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                                  fontSize: '9px',
                                  letterSpacing: '1.5px',
                                  color: 'rgba(0,0,0,0.5)',
                                  background: 'transparent',
                                  border: '1px solid rgba(0,0,0,0.1)',
                                  padding: '6px 8px',
                                  textTransform: 'uppercase',
                                }}
                              >
                                VIEW
                              </button>
                              <button
                                onClick={() =>
                                  addToStack({
                                    id: `rec-${idx}`,
                                    name: rec.title,
                                    price: rec.price || '',
                                  })
                                }
                                disabled={alreadyAdded || stackItems.length >= MAX_SLOTS}
                                className="flex-1 rounded cursor-pointer transition-all"
                                style={{
                                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                                  fontSize: '9px',
                                  letterSpacing: '1.5px',
                                  color: alreadyAdded ? '#333' : catColor,
                                  background: alreadyAdded ? 'transparent' : `rgba(${catRgb}, 0.06)`,
                                  border: `1px solid ${alreadyAdded ? 'rgba(0,0,0,0.2)' : `rgba(${catRgb}, 0.3)`}`,
                                  padding: '6px 8px',
                                  textTransform: 'uppercase',
                                }}
                              >
                                {alreadyAdded ? 'IN STACK' : '+ ADD'}
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Stack slots grid — Product Cards with category colors */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {/* Filled slots */}
                  {stackItems.map((item, idx) => {
                    const catColor = getCategoryColor(item.name);
                    const catLabel = getCategoryLabel(item.name);
                    const catRgb = CATEGORY_COLOR_RGB[catColor] || '168, 85, 247';
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className="rounded-lg relative overflow-hidden"
                        style={{
                          background: '#ffffff',
                          border: `1px solid rgba(${catRgb}, 0.2)`,
                          padding: '12px 10px 10px',
                          minHeight: '90px',
                        }}
                      >
                        {/* Top color bar */}
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '2px',
                          background: catColor,
                        }} />

                        {/* Remove button */}
                        <button
                          onClick={() => removeFromStack(item.id)}
                          className="absolute top-1 right-1 bg-transparent border-none cursor-pointer"
                          style={{
                            color: 'rgba(0,0,0,0.55)',
                            fontSize: '10px',
                            lineHeight: 1,
                            padding: '2px 4px',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#ff2d55')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = '#444')}
                          aria-label={`Remove ${item.name}`}
                        >
                          ✕
                        </button>

                        {/* Category badge */}
                        <span
                          style={{
                            display: 'inline-block',
                            background: `rgba(${catRgb}, 0.12)`,
                            border: `1px solid rgba(${catRgb}, 0.3)`,
                            color: catColor,
                            fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                            fontSize: '6px',
                            letterSpacing: '1.5px',
                            padding: '2px 5px',
                            borderRadius: '2px',
                            marginBottom: '6px',
                          }}
                        >
                          {catLabel}
                        </span>

                        {/* Product name */}
                        <p
                          style={{
                            fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                            fontSize: '11px',
                            color: '#28282A',
                            letterSpacing: '0.3px',
                            textTransform: 'uppercase',
                            lineHeight: 1.2,
                          }}
                        >
                          {item.name}
                        </p>
                        {item.price && (
                          <p
                            style={{
                              fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                              fontSize: '8px',
                              color: 'rgba(0,0,0,0.5)',
                              marginTop: '4px',
                            }}
                          >
                            ${item.price}
                          </p>
                        )}
                        {/* Add to Cart button */}
                        {(item.variantId || findVariantId(item.name)) && (
                          <button
                            onClick={() => handleAddItemToCart(item)}
                            disabled={addingToCart[item.id] === true || addingToCart[item.id] === 'done'}
                            className="w-full mt-2 rounded cursor-pointer"
                            style={{
                              fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                              fontSize: '7px',
                              letterSpacing: '1px',
                              color: addingToCart[item.id] === 'done' ? '#00e5ff' : '#28282A',
                              background: addingToCart[item.id] === 'done' ? 'rgba(0,229,255,0.08)' : 'rgba(0,0,0,0.05)',
                              border: `1px solid ${addingToCart[item.id] === 'done' ? 'rgba(0,229,255,0.3)' : 'rgba(0,0,0,0.1)'}`,
                              padding: '4px 6px',
                              textTransform: 'uppercase',
                            }}
                          >
                            {addingToCart[item.id] === 'done' ? 'ADDED \u2713' : addingToCart[item.id] === true ? '...' : 'ADD TO CART'}
                          </button>
                        )}
                      </motion.div>
                    );
                  })}

                  {/* Empty slots removed — cleaner layout */}
                </div>

                {/* Search bar */}
                <div ref={searchRef} className="relative mb-4">
                  <input
                    id="stack-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    onFocus={() => {
                      if (searchResults.length > 0) setSearchOpen(true);
                    }}
                    placeholder="Search supplements..."
                    disabled={stackItems.length >= MAX_SLOTS}
                    style={{
                      width: '100%',
                      background: '#ffffff',
                      border: '1px solid rgba(0,0,0,0.1)',
                      borderRadius: '6px',
                      padding: '10px 14px',
                      fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                      fontSize: '11px',
                      color: '#28282A',
                      outline: 'none',
                      boxSizing: 'border-box',
                      opacity: stackItems.length >= MAX_SLOTS ? 0.4 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (stackItems.length < MAX_SLOTS)
                        e.currentTarget.style.borderColor = 'rgba(0,229,255,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      if (!e.currentTarget.matches(':focus'))
                        e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)';
                    }}
                  />
                  {searchQuery.length > 0 && (
                    <p
                      style={{
                        fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                        fontSize: '8px',
                        color: 'rgba(0,0,0,0.55)',
                        marginTop: '4px',
                        paddingLeft: '2px',
                      }}
                    >
                      Press Enter to add &quot;{searchQuery}&quot; as custom
                    </p>
                  )}

                  {/* Dropdown results */}
                  <AnimatePresence>
                    {searchOpen && searchResults.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 right-0 z-10 rounded-lg overflow-hidden"
                        style={{
                          top: 'calc(100% + 4px)',
                          background: '#ffffff',
                          border: '1px solid rgba(0,0,0,0.1)',
                        }}
                      >
                        {searchResults.map((result) => {
                          const rCatColor = getCategoryColor(result.name);
                          const rCatLabel = getCategoryLabel(result.name);
                          const rCatRgb = CATEGORY_COLOR_RGB[rCatColor] || '168, 85, 247';
                          return (
                            <button
                              key={result.id}
                              onClick={() => handleSearchSelect(result)}
                              className="w-full flex items-center justify-between text-left cursor-pointer"
                              style={{
                                padding: '10px 14px',
                                background: 'transparent',
                                border: 'none',
                                borderBottom: '1px solid rgba(0,0,0,0.05)',
                                borderLeft: `3px solid ${rCatColor}`,
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.background = `rgba(${rCatRgb},0.05)`)
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.background = 'transparent')
                              }
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  style={{
                                    fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                                    fontSize: '6px',
                                    letterSpacing: '1px',
                                    color: rCatColor,
                                    background: `rgba(${rCatRgb},0.1)`,
                                    padding: '1px 4px',
                                    borderRadius: '2px',
                                  }}
                                >
                                  {rCatLabel}
                                </span>
                                <span
                                  style={{
                                    fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                                    fontSize: '12px',
                                    color: '#28282A',
                                    letterSpacing: '0.5px',
                                    textTransform: 'uppercase',
                                  }}
                                >
                                  {result.name}
                                </span>
                              </div>
                              {result.price && (
                                <span
                                  style={{
                                    fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                                    fontSize: '9px',
                                    color: 'rgba(0,0,0,0.5)',
                                  }}
                                >
                                  ${result.price}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Browse by Category */}
                {shopifyProducts.length > 0 && stackItems.length < MAX_SLOTS && (
                  <div className="mb-4">
                    <p
                      className="mb-2"
                      style={{
                        fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                        fontSize: '8px',
                        color: 'rgba(0,0,0,0.5)',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                      }}
                    >
                      BROWSE BY CATEGORY
                    </p>
                    {(() => {
                      const grouped = {};
                      shopifyProducts.forEach((p) => {
                        const cat = getCategoryForProduct(p.title);
                        if (!grouped[cat]) grouped[cat] = [];
                        grouped[cat].push(p);
                      });
                      const catOrder = ['Performance', 'Recovery', 'Focus', 'Sleep', 'Weight', 'Beauty', 'Health'];
                      return catOrder
                        .filter((cat) => grouped[cat]?.length > 0)
                        .map((cat) => {
                          const catColor = CATEGORY_COLOR_MAP[cat] || '#a855f7';
                          const catRgb = CATEGORY_COLOR_RGB[catColor] || '168, 85, 247';
                          const isOpen = expandedCategories[cat];
                          const items = grouped[cat];
                          return (
                            <div key={cat} className="mb-1">
                              <button
                                onClick={() => toggleCategory(cat)}
                                className="w-full flex items-center justify-between cursor-pointer transition-all"
                                style={{
                                  padding: '10px 12px',
                                  background: isOpen ? `rgba(${catRgb}, 0.06)` : '#ffffff',
                                  border: `1px solid ${isOpen ? `rgba(${catRgb}, 0.25)` : 'rgba(0,0,0,0.06)'}`,
                                  borderRadius: '6px',
                                  borderLeft: `3px solid ${catColor}`,
                                }}
                              >
                                <div className="flex items-center gap-2">
                                  <span
                                    style={{
                                      fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                                      fontSize: '12px',
                                      color: isOpen ? catColor : '#28282A',
                                      letterSpacing: '1px',
                                      textTransform: 'uppercase',
                                    }}
                                  >
                                    {cat}
                                  </span>
                                  <span
                                    style={{
                                      fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                                      fontSize: '8px',
                                      color: 'rgba(0,0,0,0.5)',
                                    }}
                                  >
                                    {items.length}
                                  </span>
                                </div>
                                <span style={{ color: isOpen ? catColor : '#444', fontSize: '14px', transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}>
                                  ▾
                                </span>
                              </button>
                              <AnimatePresence>
                                {isOpen && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                  >
                                    <div style={{ padding: '4px 0' }}>
                                      {items.map((product) => {
                                        const alreadyIn = stackItems.some(
                                          (s) => s.name.toLowerCase() === product.title.toLowerCase()
                                        );
                                        return (
                                          <div
                                            key={product.id}
                                            className="flex items-center justify-between"
                                            style={{
                                              padding: '8px 12px',
                                              borderBottom: '1px solid rgba(0,0,0,0.04)',
                                            }}
                                          >
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                              {product.image && (
                                                <div style={{ width: '28px', height: '28px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0, background: '#fff' }}>
                                                  <img src={product.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                                </div>
                                              )}
                                              <span
                                                className="truncate cursor-pointer"
                                                onClick={() => setDetailProduct(product)}
                                                style={{
                                                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                                                  fontSize: '11px',
                                                  color: '#28282A',
                                                  letterSpacing: '0.5px',
                                                  textTransform: 'uppercase',
                                                }}
                                              >
                                                {product.title}
                                              </span>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                              <span style={{ fontFamily: 'var(--font-space-mono), Space Mono, monospace', fontSize: '9px', color: 'rgba(0,0,0,0.5)' }}>
                                                ${product.price?.toFixed(2)}
                                              </span>
                                              <button
                                                onClick={() => {
                                                  if (!alreadyIn && stackItems.length < MAX_SLOTS) {
                                                    addToStack({ id: product.id, name: product.title, price: product.price?.toFixed(2) || '', variantId: product.variantId });
                                                  }
                                                }}
                                                disabled={alreadyIn || stackItems.length >= MAX_SLOTS}
                                                style={{
                                                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                                                  fontSize: '8px',
                                                  letterSpacing: '1px',
                                                  color: alreadyIn ? '#333' : catColor,
                                                  background: 'transparent',
                                                  border: `1px solid ${alreadyIn ? 'rgba(0,0,0,0.2)' : `rgba(${catRgb}, 0.3)`}`,
                                                  borderRadius: '3px',
                                                  padding: '3px 8px',
                                                  cursor: alreadyIn ? 'default' : 'pointer',
                                                  textTransform: 'uppercase',
                                                }}
                                              >
                                                {alreadyIn ? 'IN STACK' : '+ ADD'}
                                              </button>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        });
                    })()}
                  </div>
                )}

                {/* Save Stack button */}
                {stackItems.length > 0 && (
                  <button
                    onClick={handleSaveStack}
                    disabled={savingStack || stackSaved}
                    className="w-full rounded-lg cursor-pointer transition-all"
                    style={{
                      padding: '13px',
                      background: stackSaved
                        ? 'rgba(0,229,255,0.1)'
                        : savingStack
                        ? '#ffffff'
                        : 'transparent',
                      color: stackSaved ? '#00e5ff' : savingStack ? '#666' : '#00e5ff',
                      fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                      fontSize: '13px',
                      letterSpacing: '2px',
                      border: `1px solid ${stackSaved ? 'rgba(0,229,255,0.4)' : 'rgba(0,229,255,0.3)'}`,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      marginBottom: '6px',
                    }}
                    onMouseEnter={(e) => {
                      if (!savingStack && !stackSaved) {
                        e.currentTarget.style.background = 'rgba(0,229,255,0.08)';
                        e.currentTarget.style.boxShadow = '0 0 16px rgba(0,229,255,0.15)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!savingStack && !stackSaved) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                  >
                    {stackSaved ? 'STACK SAVED \u2713' : savingStack ? 'SAVING...' : 'SAVE STACK'}
                  </button>
                )}

                {/* Add Stack to Cart + Checkout */}
                {stackItems.length > 0 && stackItems.some(s => s.variantId || findVariantId(s.name)) && (
                  <div className="flex gap-2 mb-2">
                    <button
                      onClick={handleAddStackToCart}
                      disabled={addingStackToCart || stackAddedToCart}
                      className="flex-1 rounded-lg cursor-pointer transition-all"
                      style={{
                        padding: '12px',
                        background: stackAddedToCart ? 'rgba(0,229,255,0.08)' : '#ffffff',
                        color: stackAddedToCart ? '#00e5ff' : '#28282A',
                        fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                        fontSize: '11px',
                        letterSpacing: '1.5px',
                        border: `1px solid ${stackAddedToCart ? 'rgba(0,229,255,0.3)' : 'rgba(0,0,0,0.1)'}`,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                      }}
                    >
                      {stackAddedToCart ? 'ADDED \u2713' : addingStackToCart ? 'ADDING...' : 'ADD STACK TO CART'}
                    </button>
                    <button
                      onClick={handleCheckout}
                      className="rounded-lg cursor-pointer transition-all"
                      style={{
                        padding: '12px 16px',
                        background: '#00e5ff',
                        color: '#000',
                        fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                        fontSize: '11px',
                        letterSpacing: '1.5px',
                        border: 'none',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 16px rgba(0,229,255,0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      CHECKOUT
                    </button>
                  </div>
                )}

                {/* Suggestions panel — shown when clicking empty slot */}
                <AnimatePresence>
                  {showSuggestions && recommendedProducts.length > 0 && stackItems.length < MAX_SLOTS && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mb-4 overflow-hidden"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <p style={{
                          fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                          fontSize: '8px',
                          color: '#a855f7',
                          letterSpacing: '2px',
                          textTransform: 'uppercase',
                        }}>
                          SUGGESTED FOR YOU
                        </p>
                        <button
                          onClick={() => setShowSuggestions(false)}
                          className="bg-transparent border-none cursor-pointer"
                          style={{ color: 'rgba(0,0,0,0.55)', fontSize: '12px', padding: '2px 4px' }}
                        >
                          \u2715
                        </button>
                      </div>
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {recommendedProducts
                          .filter(rec => !stackItems.some(s => s.name.toLowerCase() === (rec.title || '').toLowerCase()))
                          .slice(0, 3)
                          .map((rec, idx) => {
                            const sCatColor = getCategoryColor(rec.title || '');
                            const sCatLabel = getCategoryLabel(rec.title || '');
                            const sCatRgb = CATEGORY_COLOR_RGB[sCatColor] || '168, 85, 247';
                            return (
                              <button
                                key={`sug-${idx}`}
                                onClick={() => {
                                  addToStack({ id: `sug-${idx}`, name: rec.title, price: rec.price || '' });
                                  setShowSuggestions(false);
                                }}
                                className="flex-shrink-0 rounded-lg text-left cursor-pointer relative overflow-hidden"
                                style={{
                                  width: '140px',
                                  background: '#ffffff',
                                  border: `1px solid rgba(${sCatRgb}, 0.2)`,
                                  padding: '10px',
                                }}
                              >
                                <div style={{
                                  position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                                  background: sCatColor,
                                }} />
                                <span style={{
                                  display: 'inline-block',
                                  background: `rgba(${sCatRgb}, 0.12)`,
                                  color: sCatColor,
                                  fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                                  fontSize: '6px',
                                  letterSpacing: '1px',
                                  padding: '1px 4px',
                                  borderRadius: '2px',
                                  marginBottom: '5px',
                                }}>
                                  {sCatLabel}
                                </span>
                                <p style={{
                                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                                  fontSize: '10px',
                                  color: '#28282A',
                                  letterSpacing: '0.3px',
                                  textTransform: 'uppercase',
                                  lineHeight: 1.2,
                                  marginBottom: '4px',
                                }}>
                                  {rec.title}
                                </p>
                                <p style={{
                                  fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                                  fontSize: '8px',
                                  color: '#00e5ff',
                                }}>
                                  + ADD
                                </p>
                              </button>
                            );
                          })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </FadeInSection>

              {/* No stack prompt */}
              {supplements.length === 0 && (
                <FadeInSection delay={0.2}>
                  <Link
                    href="/supplement-optimization-score"
                    className="block rounded-lg text-center no-underline"
                    style={{
                      background: '#ffffff',
                      padding: '24px',
                      border: '1px solid rgba(0, 255, 204, 0.2)',
                      textDecoration: 'none',
                    }}
                  >
                    <p
                      style={{
                        fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                        fontSize: '16px',
                        color: '#28282A',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        marginBottom: '8px',
                      }}
                    >
                      BUILD YOUR STACK
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                        fontSize: '10px',
                        color: 'rgba(0,0,0,0.5)',
                        lineHeight: 1.5,
                        marginBottom: '16px',
                      }}
                    >
                      Take the Optimization Score quiz to get your personalized supplement stack
                    </p>
                    <span
                      style={{
                        fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                        fontSize: '12px',
                        color: '#00e5ff',
                        letterSpacing: '2px',
                      }}
                    >
                      START QUIZ &rarr;
                    </span>
                  </Link>
                </FadeInSection>
              )}

              {/* ═══ PURCHASE HISTORY ═══ */}
              {purchases.length > 0 && (
                <FadeInSection delay={0.3}>
                  <div style={{ background: 'rgba(0,0,0,0.03)', borderRadius: '16px', padding: '20px 16px', marginTop: '16px', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <h2 style={{
                      fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                      fontSize: '20px',
                      color: '#28282A',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      textAlign: 'center',
                      marginBottom: '16px',
                    }}>
                      Purchase <span style={{ color: '#00e5ff' }}>History</span>
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {purchases.map((p) => {
                        const catColor = getCategoryColor(p.product_name);
                        const catRgb = CATEGORY_COLOR_RGB[catColor] || '0, 229, 255';
                        const date = new Date(p.purchased_at);
                        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                        const shopifyProduct = shopifyProducts.find(sp => {
                          const title = (sp.title || sp.node?.title || '').toLowerCase();
                          return title.includes(p.product_name.toLowerCase()) || p.product_name.toLowerCase().includes(title);
                        });
                        const imgSrc = shopifyProduct?.images?.[0]?.src || shopifyProduct?.node?.images?.edges?.[0]?.node?.src;

                        return (
                          <div
                            key={p.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              padding: '12px',
                              background: '#ffffff',
                              borderRadius: '10px',
                              border: `1px solid rgba(${catRgb}, 0.15)`,
                              borderLeft: `3px solid ${catColor}`,
                              cursor: shopifyProduct ? 'pointer' : 'default',
                              transition: 'box-shadow 0.2s',
                            }}
                            onClick={() => {
                              if (shopifyProduct) {
                                const prod = shopifyProduct.node || shopifyProduct;
                                setDetailProduct({
                                  title: prod.title,
                                  images: (prod.images?.edges || prod.images || []).map(i => ({ src: i.node?.src || i.src })),
                                  description: prod.descriptionHtml || prod.description || '',
                                  price: prod.priceRange?.minVariantPrice?.amount || '',
                                  variantId: prod.variants?.edges?.[0]?.node?.id || prod.variants?.[0]?.id,
                                });
                              }
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 2px 12px rgba(${catRgb}, 0.15)`; }}
                            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
                          >
                            {/* Product image */}
                            <div style={{ width: '40px', height: '40px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, background: '#f8f8f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {imgSrc ? (
                                <img src={imgSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <span style={{ fontSize: '16px', color: catColor }}>●</span>
                              )}
                            </div>

                            {/* Info */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{
                                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                                fontSize: '13px',
                                color: '#28282A',
                                letterSpacing: '0.5px',
                                textTransform: 'uppercase',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}>
                                {p.product_name}
                              </div>
                              <div style={{
                                fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                                fontSize: '9px',
                                color: 'rgba(0,0,0,0.4)',
                                marginTop: '2px',
                              }}>
                                {dateStr} · Qty: {p.quantity || 1}
                              </div>
                            </div>

                            {/* Category badge */}
                            <span style={{
                              fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                              fontSize: '8px',
                              fontWeight: 700,
                              letterSpacing: '0.5px',
                              color: catColor,
                              padding: '2px 6px',
                              border: `1px solid rgba(${catRgb}, 0.3)`,
                              borderRadius: '2px',
                              textTransform: 'uppercase',
                              flexShrink: 0,
                            }}>
                              {getCategoryLabel(p.product_name)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </FadeInSection>
              )}
            </motion.div>
          )}

          {/* ═══ VIEW 2: SUPPLEMENT DETAIL ═══ */}
          {currentView === 'detail' && selectedSupplement && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Back link */}
              <button
                onClick={handleBackToStack}
                className="bg-transparent border-none cursor-pointer mb-5 block"
                style={{
                  fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                  fontSize: '11px',
                  color: '#00e5ff',
                }}
                onMouseEnter={(e) => (e.target.style.opacity = '0.7')}
                onMouseLeave={(e) => (e.target.style.opacity = '1')}
              >
                &larr; Your Stack
              </button>

              {/* Supplement Name */}
              <h1
                className="mb-2"
                style={{
                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                  fontSize: '28px',
                  color: '#28282A',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  lineHeight: 1.1,
                }}
              >
                {selectedSupplement.name}
              </h1>

              {/* Category Badge */}
              {(() => {
                const detailCatColor = getCategoryColor(selectedSupplement.name);
                const detailCatLabel = getCategoryLabel(selectedSupplement.name);
                const detailCatRgb = CATEGORY_COLOR_RGB[detailCatColor] || '168, 85, 247';
                return (
                  <span
                    className="inline-block mb-6"
                    style={{
                      background: `rgba(${detailCatRgb}, 0.15)`,
                      color: detailCatColor,
                      fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                      fontSize: '8px',
                      letterSpacing: '2px',
                      padding: '4px 10px',
                      borderRadius: '3px',
                      border: `1px solid rgba(${detailCatRgb}, 0.3)`,
                    }}
                  >
                    {detailCatLabel}
                  </span>
                );
              })()}

              {/* View Full Product Details button */}
              <button
                onClick={() => {
                  const sp = findShopifyProduct(selectedSupplement.name);
                  if (sp) setDetailProduct(sp);
                }}
                className="w-full mb-6 py-3 rounded-lg cursor-pointer transition-all"
                style={{
                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                  fontSize: '12px',
                  letterSpacing: '1.5px',
                  color: '#00e5ff',
                  background: 'rgba(0, 255, 204, 0.06)',
                  border: '1px solid rgba(0, 255, 204, 0.2)',
                  textTransform: 'uppercase',
                }}
              >
                VIEW PRODUCT DETAILS & INGREDIENTS
              </button>

              {/* Why It's In Your Stack */}
              {selectedSupplement.aiNote && (
                <div className="mb-6">
                  <h3
                    className="mb-[10px]"
                    style={{
                      fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                      fontSize: '12px',
                      color: '#28282A',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                    }}
                  >
                    WHY IT&apos;S IN YOUR STACK
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                      fontSize: '11px',
                      color: 'rgba(0,0,0,0.45)',
                      lineHeight: 1.6,
                      borderLeft: '2px solid #00e5ff',
                      paddingLeft: '14px',
                    }}
                  >
                    {selectedSupplement.aiNote}
                  </p>
                </div>
              )}

              {/* How To Take It */}
              {selectedSupplement.howToTake && selectedSupplement.howToTake.length > 0 && (
                <div className="mb-6">
                  <h3
                    className="mb-[10px]"
                    style={{
                      fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                      fontSize: '12px',
                      color: '#28282A',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                    }}
                  >
                    HOW TO TAKE IT
                  </h3>
                  {selectedSupplement.howToTake.map((row, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-[10px]"
                      style={{
                        padding: '10px 0',
                        borderBottom:
                          idx < selectedSupplement.howToTake.length - 1
                            ? '1px solid #111'
                            : 'none',
                      }}
                    >
                      <div
                        className="flex items-center justify-center flex-shrink-0"
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          background: '#ffffff',
                          fontSize: '13px',
                        }}
                      >
                        {row.icon}
                      </div>
                      <div className="flex-1">
                        <p
                          className="mb-[2px]"
                          style={{
                            fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                            fontSize: '9px',
                            color: 'rgba(0,0,0,0.5)',
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                          }}
                        >
                          {row.label}
                        </p>
                        <p
                          style={{
                            fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                            fontSize: '13px',
                            color: '#28282A',
                            letterSpacing: '0.5px',
                          }}
                        >
                          {row.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Your Progress */}
              <div className="mb-6">
                <h3
                  className="mb-[10px]"
                  style={{
                    fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                    fontSize: '12px',
                    color: '#28282A',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                  }}
                >
                  YOUR PROGRESS
                </h3>

                {/* Large progress bar */}
                <div
                  className="mb-2 overflow-hidden"
                  style={{
                    height: '12px',
                    background: 'rgba(0,0,0,0.04)',
                    borderRadius: '8px',
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${selectedSupplement.progress}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    style={{
                      height: '100%',
                      borderRadius: '8px',
                      background: 'linear-gradient(90deg, #00e5ff, #ff2d55)',
                    }}
                  />
                </div>

                <p
                  className="mb-[2px]"
                  style={{
                    fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                    fontSize: '10px',
                    color: '#28282A',
                  }}
                >
                  {selectedSupplement.servingsCompleted} / {selectedSupplement.servingsTotal} servings completed
                </p>
                <p
                  className="mb-4"
                  style={{
                    fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                    fontSize: '9px',
                    color: 'rgba(0,0,0,0.5)',
                  }}
                >
                  {selectedSupplement.servingsTotal - selectedSupplement.servingsCompleted} servings remaining
                </p>

                {/* Streak Display */}
                <div className="text-center mb-[6px]">
                  <p
                    className="streak-glow"
                    style={{
                      fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                      fontSize: '18px',
                      color: '#ff2d55',
                      letterSpacing: '2px',
                    }}
                  >
                    {'\u{1F525}'} {selectedSupplement.streak} DAY STREAK
                  </p>
                </div>
                {selectedSupplement.personalBest > 0 && (
                  <p
                    className="text-center mb-5"
                    style={{
                      fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                      fontSize: '9px',
                      color: 'rgba(0,0,0,0.5)',
                    }}
                  >
                    Personal best: {selectedSupplement.personalBest} days
                  </p>
                )}
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleConfirmIntake}
                disabled={loggingIntake}
                className="w-full rounded-lg cursor-pointer transition-all"
                style={{
                  padding: '14px',
                  background: loggingIntake ? '#ffffff' : '#00e5ff',
                  color: loggingIntake ? '#666' : '#000',
                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                  fontSize: '14px',
                  letterSpacing: '2px',
                  border: 'none',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  opacity: loggingIntake ? 0.6 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!loggingIntake) {
                    e.currentTarget.style.background = '#00e6b8';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 204, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loggingIntake) {
                    e.currentTarget.style.background = '#00e5ff';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                {loggingIntake ? 'LOGGING...' : 'I TOOK IT TODAY \u2713'}
              </button>
            </motion.div>
          )}

          {/* ═══ VIEW 3: CELEBRATION ═══ */}
          <AnimatePresence>
            {currentView === 'celebration' && selectedSupplement && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center text-center relative overflow-hidden"
                style={{ minHeight: '640px' }}
              >
                {/* Background glow */}
                <div
                  className="absolute pointer-events-none celebration-glow"
                  style={{
                    top: '20%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '300px',
                    height: '300px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,45,85,0.15) 0%, rgba(0,229,255,0.08) 40%, transparent 70%)',
                    filter: 'blur(40px)',
                  }}
                />

                {/* Confetti burst — 40 particles */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <div
                      key={i}
                      className="confetti-particle"
                      style={{
                        position: 'absolute',
                        width: `${4 + Math.random() * 6}px`,
                        height: `${4 + Math.random() * 6}px`,
                        borderRadius: Math.random() > 0.5 ? '50%' : '1px',
                        background: confettiColors[Math.floor(Math.random() * confettiColors.length)],
                        left: `${Math.random() * 100}%`,
                        top: `${50 + Math.random() * 50}%`,
                        animationDuration: `${1.5 + Math.random() * 2.5}s`,
                        animationDelay: `${Math.random() * 1}s`,
                        opacity: 0.8 + Math.random() * 0.2,
                      }}
                    />
                  ))}
                </div>

                {/* Animated ring burst */}
                <motion.div
                  initial={{ scale: 0, opacity: 0.8 }}
                  animate={{ scale: 3, opacity: 0 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="absolute"
                  style={{
                    top: '25%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    border: '2px solid rgba(0,229,255,0.4)',
                  }}
                />

                {/* Fire emoji with bounce */}
                <motion.div
                  initial={{ scale: 0, y: 60, opacity: 0 }}
                  animate={{ scale: [0, 1.3, 1], y: 0, opacity: 1 }}
                  transition={{ duration: 0.7, ease: 'easeOut', times: [0, 0.7, 1] }}
                  style={{ fontSize: '64px', marginBottom: '12px' }}
                >
                  {'\u{1F525}'}
                </motion.div>

                {/* LOGGED headline */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  style={{
                    fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                    fontSize: '14px',
                    color: '#00e5ff',
                    letterSpacing: '4px',
                    marginBottom: '8px',
                    textShadow: '0 0 20px rgba(0, 255, 204, 0.4)',
                  }}
                >
                  INTAKE LOGGED
                </motion.p>

                {/* Streak count */}
                <motion.p
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="streak-glow mb-2"
                  style={{
                    fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                    fontSize: '42px',
                    color: '#ff2d55',
                    letterSpacing: '3px',
                  }}
                >
                  {currentStreak} DAY STREAK
                </motion.p>

                {/* Motivational message */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="mb-2"
                  style={{
                    fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                    fontSize: '18px',
                    color: '#28282A',
                    letterSpacing: '1px',
                  }}
                >
                  {currentStreak >= 30
                    ? 'ABSOLUTE MACHINE.'
                    : currentStreak >= 14
                    ? 'UNSTOPPABLE.'
                    : currentStreak >= 7
                    ? "YOU'RE ON FIRE!"
                    : currentStreak >= 3
                    ? 'BUILDING MOMENTUM!'
                    : "LET'S GO!"}
                </motion.p>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="mb-7"
                  style={{
                    fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                    fontSize: '10px',
                    color: 'rgba(0,0,0,0.5)',
                    maxWidth: '260px',
                    lineHeight: 1.5,
                  }}
                >
                  {currentStreak >= 7
                    ? `Top ${Math.max(5, 100 - currentStreak * 3)}% of Aviera users`
                    : selectedSupplement.servingsTotal - selectedSupplement.servingsCompleted > 0
                    ? `Keep going — only ${selectedSupplement.servingsTotal - selectedSupplement.servingsCompleted} servings left`
                    : 'Consistency is what separates good from great'}
                </motion.p>

                {/* Progress bar */}
                <div className="w-[80%] mb-7">
                  <div
                    className="mb-[6px] overflow-hidden"
                    style={{
                      height: '8px',
                      background: 'rgba(0,0,0,0.04)',
                      borderRadius: '8px',
                    }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${selectedSupplement.servingsTotal > 0
                          ? Math.round((selectedSupplement.servingsCompleted / selectedSupplement.servingsTotal) * 100)
                          : 0}%`,
                      }}
                      transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
                      style={{
                        height: '100%',
                        borderRadius: '8px',
                        background: 'linear-gradient(90deg, #00e5ff, #ff2d55)',
                        boxShadow: '0 0 10px rgba(0,229,255,0.3)',
                      }}
                    />
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                      fontSize: '9px',
                      color: 'rgba(0,0,0,0.5)',
                    }}
                  >
                    {selectedSupplement.servingsTotal > 0
                      ? `${Math.round((selectedSupplement.servingsCompleted / selectedSupplement.servingsTotal) * 100)}% complete`
                      : 'Logged!'}
                  </p>
                </div>

                {/* Dismiss button */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.4 }}
                  onClick={handleBackToDashboard}
                  className="rounded-lg cursor-pointer transition-all"
                  style={{
                    padding: '14px 48px',
                    background: '#ff2d55',
                    color: '#28282A',
                    fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                    fontSize: '14px',
                    letterSpacing: '2px',
                    border: 'none',
                    fontWeight: 600,
                    boxShadow: '0 0 30px rgba(255, 45, 85, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 40px rgba(255, 45, 85, 0.5)';
                    e.currentTarget.style.transform = 'scale(1.03)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 45, 85, 0.3)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  NICE! &rarr;
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* ═══ FOOTER ═══ */}
      <footer
        className="relative z-10 py-6 px-4 text-center"
        style={{
          fontFamily: 'var(--font-space-mono), Space Mono, monospace',
          fontSize: '9px',
          color: 'rgba(0,0,0,0.7)',
          lineHeight: 1.6,
          borderTop: '1px solid rgba(0,0,0,0.04)',
        }}
      >
        <div className="max-w-[430px] mx-auto">
          <div className="mb-3">
            <Link href="/shop" style={{ color: '#00e5ff', textDecoration: 'none' }}>Shop</Link>
            {' · '}
            <Link href="/about" style={{ color: '#00e5ff', textDecoration: 'none' }}>About</Link>
            {' · '}
            <Link href="/news" style={{ color: '#00e5ff', textDecoration: 'none' }}>News</Link>
          </div>
          <div className="mb-3">
            <Link href="/terms" style={{ fontFamily: 'var(--font-space-mono), Space Mono, monospace', fontSize: '9px', color: 'rgba(0,0,0,0.55)', textTransform: 'uppercase', textDecoration: 'none' }}>Terms</Link>
            {' · '}
            <Link href="/privacy" style={{ fontFamily: 'var(--font-space-mono), Space Mono, monospace', fontSize: '9px', color: 'rgba(0,0,0,0.55)', textTransform: 'uppercase', textDecoration: 'none' }}>Privacy</Link>
          </div>
          <div className="flex justify-center gap-5 mb-4">
            <a href="https://instagram.com/avierafit" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ color: 'rgba(0,0,0,0.55)', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#00e5ff'} onMouseLeave={e => e.currentTarget.style.color = '#444'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="https://tiktok.com/@avierafit" target="_blank" rel="noopener noreferrer" aria-label="TikTok" style={{ color: 'rgba(0,0,0,0.55)', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#00e5ff'} onMouseLeave={e => e.currentTarget.style.color = '#444'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.98a8.21 8.21 0 0 0 4.76 1.52V7.05a4.84 4.84 0 0 1-1-.36z"/></svg>
            </a>
          </div>
          <p>
            © 2026 Aviera Fit. All rights reserved.
            <br />
            *These statements have not been evaluated by the FDA. This product is not intended to
            diagnose, treat, cure, or prevent any disease.
          </p>
        </div>
      </footer>


      {/* Cooldown Toast */}
      <AnimatePresence>
        {showCooldown && (
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed z-[70] left-0 right-0"
            style={{ bottom: '80px' }}
          >
            <div
              className="max-w-[430px] mx-auto rounded-lg text-center"
              style={{
                margin: '0 20px',
                padding: '14px 16px',
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(255, 45, 85, 0.3)',
              }}
            >
              <p style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontSize: '12px',
                color: '#ff2d55',
                letterSpacing: '1px',
                marginBottom: '4px',
              }}>
                COOLDOWN ACTIVE
              </p>
              <p style={{
                fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                fontSize: '10px',
                color: 'rgba(0,0,0,0.5)',
              }}>
                You can log again in ~{cooldownHours} hour{cooldownHours !== 1 ? 's' : ''}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Install App CTA */}
      <AnimatePresence>
        {showInstallCTA && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed z-[55] left-0 right-0"
            style={{
              bottom: '64px',
              background: '#ffffff',
              borderTop: '1px solid rgba(0,0,0,0.08)',
            }}
          >
            <div
              className="max-w-[430px] mx-auto flex items-center justify-between"
              style={{ padding: '16px' }}
            >
              <div className="flex items-center gap-3">
                <span style={{ color: '#00e5ff', fontSize: '14px' }}>◉</span>
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                      fontSize: '12px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: '#28282A',
                      letterSpacing: '0.1em',
                    }}
                  >
                    STAY OPTIMIZED
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                      fontSize: '10px',
                      color: 'rgba(0,0,0,0.5)',
                    }}
                  >
                    Install Aviera as an app
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (deferredPrompt) {
                      deferredPrompt.prompt();
                      deferredPrompt.userChoice.then(() => {
                        setDeferredPrompt(null);
                        setShowInstallCTA(false);
                        localStorage.setItem('aviera_install_dismissed', 'true');
                      });
                    } else {
                      window.location.href = '/home';
                    }
                  }}
                  style={{
                    fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                    fontSize: '11px',
                    fontWeight: 700,
                    background: '#fff',
                    color: '#000',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  INSTALL
                </button>
                <button
                  onClick={() => {
                    setShowInstallCTA(false);
                    localStorage.setItem('aviera_install_dismissed', 'true');
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(0,0,0,0.5)',
                    cursor: 'pointer',
                    fontSize: '16px',
                    padding: '4px 8px',
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS Keyframes */}
      <style jsx global>{`
        @keyframes pulseGlow {
          0%, 100% {
            text-shadow: 0 0 10px rgba(255, 45, 85, 0.3);
          }
          50% {
            text-shadow: 0 0 25px rgba(255, 45, 85, 0.6), 0 0 50px rgba(255, 45, 85, 0.3);
          }
        }
        @keyframes confettiFloat {
          0% {
            transform: translateY(0) rotate(0deg) scale(1);
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-500px) rotate(900deg) scale(0.5);
            opacity: 0;
          }
        }
        @keyframes celebrationGlow {
          0%, 100% {
            opacity: 0.5;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.8;
            transform: translate(-50%, -50%) scale(1.15);
          }
        }
        .streak-glow {
          animation: pulseGlow 2s ease-in-out infinite;
        }
        .confetti-particle {
          animation: confettiFloat linear forwards;
        }
        .celebration-glow {
          animation: celebrationGlow 3s ease-in-out infinite;
        }
      `}</style>

      {/* Product Detail Modal */}
      {detailProduct && (
        <ProductDetailModal
          product={detailProduct}
          onClose={() => setDetailProduct(null)}
          onAddToCart={() => {
            handleAddItemToCart({ name: detailProduct.title, variantId: detailProduct.variantId });
            setDetailProduct(null);
          }}
        />
      )}
    </div>
    </PageLayout>
  );
}
