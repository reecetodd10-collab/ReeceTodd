'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// ─── Mock supplement data ───
const SUPPLEMENTS = [
  {
    id: 1,
    name: 'Creatine Monohydrate',
    tier: 'MUST HAVE',
    tierColor: '#00ffcc',
    dosage: '5g · Morning',
    progress: 65,
    streak: 12,
    servingsCompleted: 39,
    servingsTotal: 60,
    personalBest: 14,
    aiNote:
      "Based on your training frequency (5x/week) and goals, creatine is the single most effective supplement for strength and cognitive performance. Your optimization score increases by ~8 points with consistent use.",
    howToTake: [
      { icon: '\u{1F4CA}', label: 'Dosage', value: '5g (1 scoop)' },
      { icon: '\u23F0', label: 'When', value: 'Morning, with water' },
      { icon: '\u{1F37D}', label: 'With', value: 'Can be taken with any meal' },
    ],
  },
  {
    id: 2,
    name: 'Omega-3 Fish Oil',
    tier: 'MUST HAVE',
    tierColor: '#00ffcc',
    dosage: '2g · With food',
    progress: 45,
    streak: 8,
    servingsCompleted: 27,
    servingsTotal: 60,
    personalBest: 10,
    aiNote:
      "Your diet analysis shows low EPA/DHA intake. Omega-3s reduce inflammation from high-intensity training and support cardiovascular health. Critical for recovery between sessions.",
    howToTake: [
      { icon: '\u{1F4CA}', label: 'Dosage', value: '2g (2 softgels)' },
      { icon: '\u23F0', label: 'When', value: 'With lunch or dinner' },
      { icon: '\u{1F37D}', label: 'With', value: 'Always take with a meal containing fat' },
    ],
  },
  {
    id: 3,
    name: 'Vitamin D3',
    tier: 'RECOMMENDED',
    tierColor: '#a855f7',
    dosage: '5000 IU · Morning',
    progress: 30,
    streak: 5,
    servingsCompleted: 18,
    servingsTotal: 60,
    personalBest: 7,
    aiNote:
      "Based on your location and indoor training schedule, your Vitamin D levels are likely suboptimal. D3 supplementation supports immune function, bone density, and mood — all critical for consistent training.",
    howToTake: [
      { icon: '\u{1F4CA}', label: 'Dosage', value: '5000 IU (1 softgel)' },
      { icon: '\u23F0', label: 'When', value: 'Morning, with breakfast' },
      { icon: '\u{1F37D}', label: 'With', value: 'Take with a fat-containing meal' },
    ],
  },
  {
    id: 4,
    name: 'Magnesium Glycinate',
    tier: 'RECOMMENDED',
    tierColor: '#a855f7',
    dosage: '400mg · Night',
    progress: 20,
    streak: 3,
    servingsCompleted: 12,
    servingsTotal: 60,
    personalBest: 5,
    aiNote:
      "Your sleep quality data and high training volume suggest magnesium depletion. Glycinate form is best absorbed and promotes relaxation. Should improve sleep onset and reduce muscle cramping.",
    howToTake: [
      { icon: '\u{1F4CA}', label: 'Dosage', value: '400mg (2 capsules)' },
      { icon: '\u23F0', label: 'When', value: '30-60 min before bed' },
      { icon: '\u{1F37D}', label: 'With', value: 'Can be taken on an empty stomach' },
    ],
  },
];

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
function StickyNav({ menuOpen, setMenuOpen }) {
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
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'transparent',
                color: '#ffffff',
                textDecoration: 'none',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
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

// ═══════════════════════════════════════════
// DASHBOARD PAGE
// ═══════════════════════════════════════════
export default function DashboardPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  // Views: 'dashboard' | 'detail' | 'celebration'
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedSupplement, setSelectedSupplement] = useState(null);

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

  const handleSlotClick = (supplement) => {
    setSelectedSupplement(supplement);
    setCurrentView('detail');
  };

  const handleConfirmIntake = () => {
    setCurrentView('celebration');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedSupplement(null);
  };

  const handleBackToStack = () => {
    setCurrentView('dashboard');
  };

  // Score ring calculations
  const scoreValue = 87;
  const radius = 65;
  const circumference = 2 * Math.PI * radius; // ~408
  const scoreOffset = circumference - (scoreValue / 100) * circumference;

  // Confetti colors
  const confettiColors = ['#00ffcc', '#ff2d55', '#a855f7'];

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

      <StickyNav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* Main content */}
      <main className="relative z-10 pt-[60px] pb-24 px-5">
        <div className="max-w-[430px] mx-auto">

          {/* ═══ VIEW 1: DASHBOARD HOME ═══ */}
          {currentView === 'dashboard' && (
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
                  YOU&apos;RE CRUSHING IT
                </p>
                <p
                  className="text-center mb-7"
                  style={{
                    fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                    fontSize: '10px',
                    color: '#666',
                  }}
                >
                  You&apos;re in the top 15% of optimizers
                </p>
              </FadeInSection>

              {/* Divider */}
              <div
                className="mb-6"
                style={{
                  height: '1px',
                  background: 'rgba(255,255,255,0.06)',
                }}
              />

              {/* Your Stack */}
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
                    YOUR STACK
                  </h2>
                  <span
                    style={{
                      fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                      fontSize: '9px',
                      color: '#666',
                    }}
                  >
                    4/6 slots filled
                  </span>
                </div>

                {/* Stack Grid */}
                <div
                  className="grid grid-cols-2 gap-2 mb-6"
                >
                  {/* Filled Slots */}
                  {SUPPLEMENTS.map((supp) => (
                    <div
                      key={supp.id}
                      className="rounded-lg cursor-pointer transition-colors"
                      style={{
                        background: '#0a0a0a',
                        borderLeft: `3px solid ${supp.tierColor}`,
                        padding: '12px',
                        minHeight: '100px',
                      }}
                      onClick={() => handleSlotClick(supp)}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#0f0f0f')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = '#0a0a0a')}
                    >
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
                      <p
                        className="mb-1"
                        style={{
                          fontSize: '7px',
                          color: supp.tierColor,
                          letterSpacing: '1px',
                          textTransform: 'uppercase',
                          fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                        }}
                      >
                        {supp.tier}
                      </p>
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
                            background: 'linear-gradient(90deg, #00ffcc, #ff2d55)',
                          }}
                        />
                      </div>
                      <p style={{ fontSize: '9px', color: '#ff2d55' }}>
                        {'\u{1F525}'} {supp.streak} days
                      </p>
                    </div>
                  ))}

                  {/* Empty Slots */}
                  {[1, 2].map((i) => (
                    <div
                      key={`empty-${i}`}
                      className="rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors"
                      style={{
                        border: '1px dashed rgba(255,255,255,0.1)',
                        minHeight: '100px',
                        background: 'transparent',
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
                    </div>
                  ))}
                </div>
              </FadeInSection>

              {/* AI Recommended Next */}
              <FadeInSection delay={0.2}>
                <p
                  className="mb-2"
                  style={{
                    fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                    fontSize: '9px',
                    color: '#a855f7',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                  }}
                >
                  AI RECOMMENDED NEXT
                </p>
                <div
                  className="rounded-lg flex justify-between items-center"
                  style={{
                    background: '#0a0a0a',
                    padding: '14px',
                    border: '1px solid rgba(168, 85, 247, 0.2)',
                    borderLeft: '3px solid #a855f7',
                  }}
                >
                  <div className="flex-1">
                    <p
                      className="mb-[2px]"
                      style={{
                        fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                        fontSize: '14px',
                        color: '#fff',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Ashwagandha KSM-66
                    </p>
                    <p
                      style={{
                        fontSize: '8px',
                        color: '#a855f7',
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                      }}
                    >
                      NEXT BEST
                    </p>
                    <p
                      className="mt-1"
                      style={{
                        fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                        fontSize: '9px',
                        color: '#666',
                      }}
                    >
                      Stress &amp; recovery support
                    </p>
                  </div>
                  <button
                    className="bg-transparent border-none cursor-pointer"
                    style={{
                      fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                      fontSize: '11px',
                      color: '#a855f7',
                      letterSpacing: '1px',
                    }}
                    onMouseEnter={(e) => (e.target.style.color = '#c084fc')}
                    onMouseLeave={(e) => (e.target.style.color = '#a855f7')}
                  >
                    Add to Stack &rarr;
                  </button>
                </div>
              </FadeInSection>
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

              {/* Badge */}
              <span
                className="inline-block mb-6"
                style={{
                  background: selectedSupplement.tierColor,
                  color: '#000',
                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                  fontSize: '9px',
                  letterSpacing: '1.5px',
                  padding: '3px 10px',
                  borderRadius: '3px',
                  fontWeight: 600,
                }}
              >
                {selectedSupplement.tier}
              </span>

              {/* Why It's In Your Stack */}
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

              {/* How To Take It */}
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
                  {selectedSupplement.servingsTotal - selectedSupplement.servingsCompleted} servings remaining · ~{selectedSupplement.servingsTotal - selectedSupplement.servingsCompleted} days left
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
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleConfirmIntake}
                className="w-full rounded-lg cursor-pointer transition-all"
                style={{
                  padding: '14px',
                  background: '#00ffcc',
                  color: '#000',
                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                  fontSize: '14px',
                  letterSpacing: '2px',
                  border: 'none',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#00e6b8';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 204, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#00ffcc';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                I TOOK IT TODAY ✓
              </button>
              <p
                className="text-center mt-[10px]"
                style={{
                  fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                  fontSize: '9px',
                  color: '#444',
                }}
              >
                Last confirmed: Today at 8:32 AM
              </p>
            </motion.div>
          )}

          {/* ═══ VIEW 3: CELEBRATION ═══ */}
          <AnimatePresence>
            {currentView === 'celebration' && selectedSupplement && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center justify-center text-center relative overflow-hidden"
                style={{ minHeight: '640px' }}
              >
                {/* Confetti */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className="confetti-particle"
                      style={{
                        position: 'absolute',
                        width: '6px',
                        height: '6px',
                        borderRadius: Math.random() > 0.5 ? '50%' : '1px',
                        background: confettiColors[Math.floor(Math.random() * confettiColors.length)],
                        left: `${Math.random() * 100}%`,
                        top: `${60 + Math.random() * 40}%`,
                        animationDuration: `${1.5 + Math.random() * 2}s`,
                        animationDelay: `${Math.random() * 0.8}s`,
                      }}
                    />
                  ))}
                </div>

                {/* Flame */}
                <motion.div
                  initial={{ scale: 0.3, y: 40, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  style={{ fontSize: '48px', marginBottom: '16px' }}
                >
                  {'\u{1F525}'}
                </motion.div>

                {/* Streak count */}
                <p
                  className="streak-glow mb-2"
                  style={{
                    fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                    fontSize: '36px',
                    color: '#ff2d55',
                    letterSpacing: '3px',
                  }}
                >
                  STREAK: {selectedSupplement.streak + 1} DAYS!
                </p>

                <p
                  className="mb-2"
                  style={{
                    fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                    fontSize: '18px',
                    color: '#fff',
                    letterSpacing: '1px',
                  }}
                >
                  You&apos;re crushing it!
                </p>

                <p
                  className="mb-7"
                  style={{
                    fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                    fontSize: '10px',
                    color: '#666',
                    maxWidth: '260px',
                    lineHeight: 1.5,
                  }}
                >
                  Keep going — only {selectedSupplement.servingsTotal - selectedSupplement.servingsCompleted - 1} servings left
                </p>

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
                      animate={{ width: '67%' }}
                      transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
                      style={{
                        height: '100%',
                        borderRadius: '8px',
                        background: 'linear-gradient(90deg, #00ffcc, #ff2d55)',
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
                    67% complete
                  </p>
                </div>

                {/* Dismiss button */}
                <button
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
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 45, 85, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  NICE! &rarr;
                </button>
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
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-400px) rotate(720deg);
            opacity: 0;
          }
        }
        .streak-glow {
          animation: pulseGlow 2s ease-in-out infinite;
        }
        .confetti-particle {
          animation: confettiFloat linear forwards;
        }
      `}</style>
    </div>
  );
}
