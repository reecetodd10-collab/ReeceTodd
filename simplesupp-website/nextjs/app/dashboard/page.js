'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSupabaseUser } from '../components/SupabaseAuthProvider';
import { fetchShopifyProducts } from '../lib/shopify';

// ─── Max supplement slots ───
const MAX_SLOTS = 6;

// ─── Category → Color mapping ───
// Red (#ff2d55) = Strength / Performance
// Green (#00ffcc) = Recovery / Focus / Sleep
// Purple (#a855f7) = Weight Management / Skin / Health
const CATEGORY_COLOR_MAP = {
  'Performance': '#ff2d55',
  'Pre-Workout': '#ff2d55',
  'Protein': '#ff2d55',
  'Recovery & Sleep': '#00ffcc',
  'Recovery': '#00ffcc',
  'Sleep': '#00ffcc',
  'Focus & Energy': '#00ffcc',
  'Focus': '#00ffcc',
  'Weight Management': '#a855f7',
  'Weight': '#a855f7',
  'Beauty & Anti-Aging': '#a855f7',
  'Beauty': '#a855f7',
  'Health & Wellness': '#a855f7',
  'Health': '#a855f7',
};

const CATEGORY_COLOR_RGB = {
  '#ff2d55': '255, 45, 85',
  '#00ffcc': '0, 255, 204',
  '#a855f7': '168, 85, 247',
};

// Map product name/title to a category using keyword matching
function getCategoryForProduct(name = '') {
  const n = name.toLowerCase();
  // Strength / Performance (Red)
  if (/protein|whey|creatine|bcaa|pre.?workout|post.?workout|beta.?alanine|performance|muscle|strength|nitric|flow state/i.test(n)) return 'Performance';
  // Recovery / Sleep (Green)
  if (/magnesium|melatonin|sleep|recovery|zma|ashwagandha|rest/i.test(n)) return 'Recovery';
  if (/caffeine|energy|focus|alpha energy|nootropic|rhodiola|cognitive|l.?theanine/i.test(n)) return 'Focus';
  // Weight / Skin / Health (Purple)
  if (/fat.?burn|weight|metabolism|thermogenic|l.?carnitine|green tea/i.test(n)) return 'Weight';
  if (/collagen|biotin|beauty|skin|hair|anti.?aging|vitamin c/i.test(n)) return 'Beauty';
  if (/omega|vitamin d|coq10|multivitamin|health|wellness|immune/i.test(n)) return 'Health';
  return 'Health'; // default
}

function getCategoryColor(name) {
  const cat = getCategoryForProduct(name);
  return CATEGORY_COLOR_MAP[cat] || '#a855f7';
}

function getCategoryLabel(name) {
  const cat = getCategoryForProduct(name);
  const labels = {
    'Performance': 'STRENGTH',
    'Pre-Workout': 'STRENGTH',
    'Protein': 'STRENGTH',
    'Recovery': 'RECOVERY',
    'Sleep': 'SLEEP',
    'Focus': 'FOCUS',
    'Weight': 'WEIGHT',
    'Beauty': 'BEAUTY',
    'Health': 'HEALTH',
  };
  return labels[cat] || 'HEALTH';
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

// ─── Sticky Navigation ───
function StickyNav({ menuOpen, setMenuOpen, user }) {
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: '#000000',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="max-w-[430px] mx-auto flex items-center justify-between px-4 py-3">
          <Link
            href="/home"
            className="no-underline"
            style={{
              fontFamily: 'var(--font-oswald), Oswald, sans-serif',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.4em',
              color: '#00ffcc',
              textTransform: 'uppercase',
              textDecoration: 'none',
            }}
          >
            ◉ Aviera
          </Link>

          {/* User icon + hamburger */}
          <div className="flex items-center gap-3">
            <Link
              href="/auth"
              className="flex items-center justify-center no-underline"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                border: avatarUrl ? '2px solid #00ffcc' : '1px solid rgba(255,255,255,0.15)',
                background: 'transparent',
                color: '#ffffff',
                textDecoration: 'none',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt="Profile"
                  width={28}
                  height={28}
                  style={{ borderRadius: '50%', objectFit: 'cover', width: '100%', height: '100%' }}
                  unoptimized
                />
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              )}
            </Link>
            <button
              className="flex flex-col gap-[5px] bg-transparent border-none cursor-pointer p-1"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <span className="block w-5 h-[2px] bg-white" />
              <span className="block w-5 h-[2px] bg-white" />
              <span className="block w-5 h-[2px] bg-white" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center"
          style={{ background: '#000000' }}
        >
          <button
            className="absolute top-4 right-4 bg-transparent border-none cursor-pointer"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            style={{
              fontFamily: 'var(--font-oswald), Oswald, sans-serif',
              fontSize: '28px',
              color: '#fff',
            }}
          >
            ✕
          </button>

          <div className="flex flex-col items-center gap-8">
            {[
              { label: 'Home', href: '/home' },
              { label: 'Shop', href: '/shop' },
              { label: 'Flow State X', href: '/nitric' },
              { label: 'Trybe', href: '/trybe' },
              { label: 'O.S.', href: '/supplement-optimization-score' },
              { label: 'About', href: '/about' },
              { label: 'Latest', href: '/news' },
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Sign In', href: '/auth' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                  fontSize: '24px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: link.href === '/dashboard' ? '#00ffcc' : '#ffffff',
                  textDecoration: 'none',
                  letterSpacing: '0.1em',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

// ─── Loading Skeleton ───
function DashboardSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Score ring skeleton */}
      <div className="flex justify-center mb-8 mt-4">
        <div
          className="rounded-full"
          style={{
            width: '150px',
            height: '150px',
            background: '#111',
            border: '6px solid #1a1a1a',
          }}
        />
      </div>

      {/* Section label skeleton */}
      <div
        className="mb-3"
        style={{ width: '120px', height: '12px', background: '#111', borderRadius: '4px' }}
      />

      {/* Stack grid skeleton */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-lg"
            style={{
              background: '#0a0a0a',
              minHeight: '100px',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          />
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
  const { user, session, loading: authLoading } = useSupabaseUser();

  const [menuOpen, setMenuOpen] = useState(false);
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

  // Stack builder state
  const [stackItems, setStackItems] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [shopifyProducts, setShopifyProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [savingStack, setSavingStack] = useState(false);
  const [stackSaved, setStackSaved] = useState(false);
  const searchRef = useRef(null);

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

  // Redirect to /auth if not signed in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [authLoading, user, router]);

  // Close search dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
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
      const [intakeRes, stacksRes, optimizationRes] = await Promise.allSettled([
        fetch('/api/intake?days=30', { headers }),
        fetch('/api/stacks', { headers }),
        fetch('/api/optimization-results?history=true', { headers }),
      ]);

      // Process intake data
      if (intakeRes.status === 'fulfilled' && intakeRes.value.ok) {
        const intakeData = await intakeRes.value.json();
        setCurrentStreak(intakeData.streak || 0);
        setLongestStreak(intakeData.longest_streak || 0);
        setIntakeLogs(intakeData.logs || []);
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
              tierColor: (supp.tier || '').toUpperCase() === 'MUST HAVE' || idx < 2 ? '#00ffcc' : '#a855f7',
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
          // Extract recommended products from quiz result
          const recs = latestResult.recommended_products || [];
          setRecommendedProducts(Array.isArray(recs) ? recs : []);
        }
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

  // Log intake for a supplement
  const handleLogIntake = async (supplementName) => {
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
        // Show celebration then refresh data
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
      handleLogIntake(selectedSupplement.name);
    }
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedSupplement(null);
  };

  const handleBackToStack = () => {
    setCurrentView('dashboard');
  };

  // ─── Stack Builder helpers ───
  const addToStack = (item) => {
    if (stackItems.length >= MAX_SLOTS) return;
    const alreadyIn = stackItems.some(
      (s) => s.name.toLowerCase() === item.name.toLowerCase()
    );
    if (alreadyIn) return;
    setStackItems((prev) => [
      ...prev,
      { id: item.id || `custom-${Date.now()}`, name: item.name, price: item.price || '' },
    ]);
    setStackSaved(false);
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
          name: 'My Stack',
          supplements: stackItems.map((s) => ({ name: s.name, price: s.price })),
        }),
      });
      if (res.ok) {
        setStackSaved(true);
        setTimeout(() => setStackSaved(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save stack:', err);
    } finally {
      setSavingStack(false);
    }
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
  const confettiColors = ['#00ffcc', '#ff2d55', '#a855f7'];

  // Empty slot count for the existing stack display
  const emptySlots = Math.max(0, MAX_SLOTS - supplements.length);

  // Empty slot count for the stack builder
  const builderEmptySlots = Math.max(0, MAX_SLOTS - stackItems.length);

  // Show loading or redirect states
  if (authLoading) {
    return (
      <div
        className="relative min-h-screen"
        style={{ background: '#000000', color: '#ffffff' }}
      >
        <StickyNav menuOpen={menuOpen} setMenuOpen={setMenuOpen} user={user} />
        <main className="relative z-10 pt-[60px] pb-24 px-5">
          <div className="max-w-[430px] mx-auto">
            <DashboardSkeleton />
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    // Will redirect via useEffect
    return null;
  }

  return (
    <div
      className="relative min-h-screen"
      style={{
        background: '#000000',
        color: '#ffffff',
      }}
    >
      {/* Scanline overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 204, 0.015) 2px, rgba(0, 255, 204, 0.015) 4px)',
        }}
      />

      <StickyNav menuOpen={menuOpen} setMenuOpen={setMenuOpen} user={user} />

      {/* Main content */}
      <main className="relative z-10 pt-[60px] pb-24 px-5">
        <div className="max-w-[430px] mx-auto">

          {/* Show skeleton while data is loading */}
          {dataLoading && currentView === 'dashboard' && <DashboardSkeleton />}

          {/* ═══ VIEW 1: DASHBOARD HOME ═══ */}
          {!dataLoading && currentView === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* O.S. Score Section */}
              <FadeInSection>
                <p
                  className="text-center mb-4"
                  style={{
                    fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                    fontSize: '9px',
                    color: '#00ffcc',
                    letterSpacing: '3px',
                    textTransform: 'uppercase',
                  }}
                >
                  YOUR O.S.
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
                      stroke="#111"
                      strokeWidth="6"
                    />
                    <motion.circle
                      cx="75"
                      cy="75"
                      r={radius}
                      fill="none"
                      stroke="#00ffcc"
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
                        color: '#fff',
                        lineHeight: 1,
                      }}
                    >
                      {scoreValue}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                        fontSize: '24px',
                        color: '#666',
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
                    color: '#00ffcc',
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
                    color: '#666',
                  }}
                >
                  {getScoreSubtext(scoreValue)}
                </p>
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
                          color: '#666',
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
                    background: 'rgba(255,255,255,0.06)',
                  }}
                />
                <div className="flex justify-between items-baseline mb-4">
                  <h2
                    style={{
                      fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                      fontSize: '16px',
                      color: '#fff',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                    }}
                  >
                    YOUR STACK
                  </h2>
                  <span
                    style={{
                      fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                      fontSize: '9px',
                      color: '#666',
                    }}
                  >
                    {stackItems.length}/{MAX_SLOTS} slots
                  </span>
                </div>

                {/* AI Recommendations — Product Cards */}
                {recommendedProducts.length > 0 && (
                  <div className="mb-5">
                    <p
                      className="mb-3"
                      style={{
                        fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                        fontSize: '8px',
                        color: '#a855f7',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                      }}
                    >
                      BASED ON YOUR O.S.
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {recommendedProducts.slice(0, 4).map((rec, idx) => {
                        const catColor = getCategoryColor(rec.title || '');
                        const catLabel = getCategoryLabel(rec.title || '');
                        const catRgb = CATEGORY_COLOR_RGB[catColor] || '168, 85, 247';
                        const alreadyAdded = stackItems.some(
                          (s) => s.name.toLowerCase() === (rec.title || '').toLowerCase()
                        );
                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: idx * 0.08 }}
                            className="rounded-lg relative overflow-hidden"
                            style={{
                              background: '#0a0a0a',
                              border: `1px solid rgba(${catRgb}, 0.25)`,
                              padding: '14px 12px 12px',
                              minHeight: '110px',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
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
                                  color: '#fff',
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
                                  color: '#555',
                                }}>
                                  ${rec.price}
                                </p>
                              )}
                            </div>

                            {/* Add button */}
                            <button
                              onClick={() =>
                                addToStack({
                                  id: `rec-${idx}`,
                                  name: rec.title,
                                  price: rec.price || '',
                                })
                              }
                              disabled={alreadyAdded || stackItems.length >= MAX_SLOTS}
                              className="w-full mt-2 rounded cursor-pointer transition-all"
                              style={{
                                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                                fontSize: '9px',
                                letterSpacing: '1.5px',
                                color: alreadyAdded ? '#333' : catColor,
                                background: alreadyAdded ? 'transparent' : `rgba(${catRgb}, 0.06)`,
                                border: `1px solid ${alreadyAdded ? '#1a1a1a' : `rgba(${catRgb}, 0.3)`}`,
                                padding: '6px 8px',
                                textTransform: 'uppercase',
                              }}
                            >
                              {alreadyAdded ? 'IN STACK' : '+ ADD'}
                            </button>
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
                          background: '#0a0a0a',
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
                            color: '#444',
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
                            color: '#fff',
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
                              color: '#555',
                              marginTop: '4px',
                            }}
                          >
                            ${item.price}
                          </p>
                        )}
                      </motion.div>
                    );
                  })}

                  {/* Empty slots */}
                  {Array.from({ length: builderEmptySlots }).map((_, i) => (
                    <button
                      key={`builder-empty-${i}`}
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery('');
                        setTimeout(() => {
                          document.getElementById('stack-search-input')?.focus();
                        }, 50);
                      }}
                      className="rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors"
                      style={{
                        border: '1px dashed rgba(255,255,255,0.08)',
                        minHeight: '90px',
                        background: 'transparent',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#333';
                        e.currentTarget.style.background = 'rgba(0, 255, 204, 0.02)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                          fontSize: '18px',
                          color: '#333',
                          marginBottom: '2px',
                        }}
                      >
                        +
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                          fontSize: '7px',
                          color: '#333',
                        }}
                      >
                        Add
                      </span>
                    </button>
                  ))}
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
                      background: '#0a0a0a',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '6px',
                      padding: '10px 14px',
                      fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                      fontSize: '11px',
                      color: '#fff',
                      outline: 'none',
                      boxSizing: 'border-box',
                      opacity: stackItems.length >= MAX_SLOTS ? 0.4 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (stackItems.length < MAX_SLOTS)
                        e.currentTarget.style.borderColor = 'rgba(0,255,204,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      if (!e.currentTarget.matches(':focus'))
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                    }}
                  />
                  {searchQuery.length > 0 && (
                    <p
                      style={{
                        fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                        fontSize: '8px',
                        color: '#444',
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
                          background: '#0f0f0f',
                          border: '1px solid rgba(255,255,255,0.1)',
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
                                borderBottom: '1px solid rgba(255,255,255,0.05)',
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
                                    color: '#fff',
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
                                    color: '#666',
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

                {/* Save Stack button */}
                {stackItems.length > 0 && (
                  <button
                    onClick={handleSaveStack}
                    disabled={savingStack || stackSaved}
                    className="w-full rounded-lg cursor-pointer transition-all"
                    style={{
                      padding: '13px',
                      background: stackSaved
                        ? 'rgba(0,255,204,0.1)'
                        : savingStack
                        ? '#0a0a0a'
                        : 'transparent',
                      color: stackSaved ? '#00ffcc' : savingStack ? '#666' : '#00ffcc',
                      fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                      fontSize: '13px',
                      letterSpacing: '2px',
                      border: `1px solid ${stackSaved ? 'rgba(0,255,204,0.4)' : 'rgba(0,255,204,0.3)'}`,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      marginBottom: '6px',
                    }}
                    onMouseEnter={(e) => {
                      if (!savingStack && !stackSaved) {
                        e.currentTarget.style.background = 'rgba(0,255,204,0.08)';
                        e.currentTarget.style.boxShadow = '0 0 16px rgba(0,255,204,0.15)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!savingStack && !stackSaved) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                  >
                    {stackSaved ? 'STACK SAVED ✓' : savingStack ? 'SAVING...' : 'SAVE STACK'}
                  </button>
                )}
              </FadeInSection>

              {/* Divider */}
              <div
                className="mb-6 mt-2"
                style={{
                  height: '1px',
                  background: 'rgba(255,255,255,0.06)',
                }}
              />

              {/* Your Stack (existing supplement tracker) */}
              <FadeInSection delay={0.1}>
                <div className="flex justify-between items-baseline mb-3">
                  <h2
                    style={{
                      fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                      fontSize: '16px',
                      color: '#fff',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                    }}
                  >
                    INTAKE TRACKER
                  </h2>
                  <span
                    style={{
                      fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                      fontSize: '9px',
                      color: '#666',
                    }}
                  >
                    {supplements.length}/{MAX_SLOTS} slots filled
                  </span>
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
                    return (
                      <div
                        key={supp.id}
                        className="rounded-lg cursor-pointer transition-colors relative overflow-hidden"
                        style={{
                          background: '#0a0a0a',
                          border: `1px solid rgba(${catRgb}, 0.2)`,
                          padding: '12px',
                          minHeight: '100px',
                        }}
                        onClick={() => handleSlotClick(supp)}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#0f0f0f')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = '#0a0a0a')}
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
                          className="mb-[3px]"
                          style={{
                            fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                            fontSize: '11px',
                            color: '#fff',
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
                              color: '#666',
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
                            background: '#1a1a1a',
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
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLogIntake(supp.name);
                            }}
                            disabled={loggingIntake}
                            className="bg-transparent border-none cursor-pointer"
                            style={{
                              fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                              fontSize: '8px',
                              color: catColor,
                              padding: '2px 6px',
                              border: `1px solid rgba(${catRgb}, 0.3)`,
                              borderRadius: '3px',
                              opacity: loggingIntake ? 0.5 : 1,
                            }}
                            title="Log intake"
                          >
                            LOG
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Empty Slots */}
                  {Array.from({ length: emptySlots }).map((_, i) => (
                    <Link
                      key={`empty-${i}`}
                      href="/supplement-optimization-score"
                      className="rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors no-underline"
                      style={{
                        border: '1px dashed rgba(255,255,255,0.1)',
                        minHeight: '100px',
                        background: 'transparent',
                        textDecoration: 'none',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#333';
                        e.currentTarget.style.background = 'rgba(0, 255, 204, 0.02)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                          fontSize: '20px',
                          color: '#333',
                          marginBottom: '4px',
                        }}
                      >
                        +
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                          fontSize: '8px',
                          color: '#333',
                        }}
                      >
                        Add
                      </span>
                    </Link>
                  ))}
                </div>
              </FadeInSection>

              {/* No stack prompt */}
              {supplements.length === 0 && (
                <FadeInSection delay={0.2}>
                  <Link
                    href="/supplement-optimization-score"
                    className="block rounded-lg text-center no-underline"
                    style={{
                      background: '#0a0a0a',
                      padding: '24px',
                      border: '1px solid rgba(0, 255, 204, 0.2)',
                      textDecoration: 'none',
                    }}
                  >
                    <p
                      style={{
                        fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                        fontSize: '16px',
                        color: '#fff',
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
                        color: '#666',
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
                        color: '#00ffcc',
                        letterSpacing: '2px',
                      }}
                    >
                      START QUIZ &rarr;
                    </span>
                  </Link>
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
                  color: '#00ffcc',
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
                  color: '#fff',
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

              {/* Why It's In Your Stack */}
              {selectedSupplement.aiNote && (
                <div className="mb-6">
                  <h3
                    className="mb-[10px]"
                    style={{
                      fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                      fontSize: '12px',
                      color: '#fff',
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
                      color: '#999',
                      lineHeight: 1.6,
                      borderLeft: '2px solid #00ffcc',
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
                      color: '#fff',
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
                          background: '#0a0a0a',
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
                            color: '#666',
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
                            color: '#fff',
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
                    color: '#fff',
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
                    background: '#111',
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
                      background: 'linear-gradient(90deg, #00ffcc, #ff2d55)',
                    }}
                  />
                </div>

                <p
                  className="mb-[2px]"
                  style={{
                    fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                    fontSize: '10px',
                    color: '#fff',
                  }}
                >
                  {selectedSupplement.servingsCompleted} / {selectedSupplement.servingsTotal} servings completed
                </p>
                <p
                  className="mb-4"
                  style={{
                    fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                    fontSize: '9px',
                    color: '#666',
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
                      color: '#666',
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
                  background: loggingIntake ? '#0a0a0a' : '#00ffcc',
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
                    e.currentTarget.style.background = '#00ffcc';
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
                    background: 'radial-gradient(circle, rgba(255,45,85,0.15) 0%, rgba(0,255,204,0.08) 40%, transparent 70%)',
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
                    border: '2px solid rgba(0,255,204,0.4)',
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
                    color: '#00ffcc',
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
                    color: '#fff',
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
                    color: '#666',
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
                      background: '#111',
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
                        background: 'linear-gradient(90deg, #00ffcc, #ff2d55)',
                        boxShadow: '0 0 10px rgba(0,255,204,0.3)',
                      }}
                    />
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                      fontSize: '9px',
                      color: '#666',
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
                    color: '#fff',
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
          color: '#333',
          lineHeight: 1.6,
          borderTop: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        <div className="max-w-[430px] mx-auto">
          <div className="mb-3">
            <Link href="/shop" style={{ color: '#00ffcc', textDecoration: 'none' }}>Shop</Link>
            {' · '}
            <Link href="/about" style={{ color: '#00ffcc', textDecoration: 'none' }}>About</Link>
            {' · '}
            <Link href="/news" style={{ color: '#00ffcc', textDecoration: 'none' }}>News</Link>
          </div>
          <div className="mb-3">
            <Link href="/terms" style={{ fontFamily: 'var(--font-space-mono), Space Mono, monospace', fontSize: '9px', color: '#444', textTransform: 'uppercase', textDecoration: 'none' }}>Terms</Link>
            {' · '}
            <Link href="/privacy" style={{ fontFamily: 'var(--font-space-mono), Space Mono, monospace', fontSize: '9px', color: '#444', textTransform: 'uppercase', textDecoration: 'none' }}>Privacy</Link>
          </div>
          <div className="flex justify-center gap-5 mb-4">
            <a href="https://instagram.com/avierafit" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ color: '#444', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#00ffcc'} onMouseLeave={e => e.currentTarget.style.color = '#444'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="https://tiktok.com/@avierafit" target="_blank" rel="noopener noreferrer" aria-label="TikTok" style={{ color: '#444', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#00ffcc'} onMouseLeave={e => e.currentTarget.style.color = '#444'}>
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
              background: '#0a0a0a',
              borderTop: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div
              className="max-w-[430px] mx-auto flex items-center justify-between"
              style={{ padding: '16px' }}
            >
              <div className="flex items-center gap-3">
                <span style={{ color: '#00ffcc', fontSize: '14px' }}>◉</span>
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                      fontSize: '12px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: '#ffffff',
                      letterSpacing: '0.1em',
                    }}
                  >
                    STAY OPTIMIZED
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                      fontSize: '10px',
                      color: '#666',
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
                    color: '#666',
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
    </div>
  );
}
