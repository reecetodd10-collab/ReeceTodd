'use client';

import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

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

          {/* Desktop links - hidden */}
          <div className="hidden">
            {/* Nav links removed - use hamburger menu */}
          </div>

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
                  color: link.href === '/about' ? '#00ffcc' : '#ffffff',
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

// ─── Data ───

const values = [
  {
    num: '01',
    title: 'Health is Wealth',
    desc: 'A healthy body is the foundation for a happy, successful life. Everything else builds on top of this.',
    color: '#00ffcc',
  },
  {
    num: '02',
    title: 'Accessibility',
    desc: 'Everyone deserves access to a healthy lifestyle, regardless of where they start or what they know.',
    color: '#a855f7',
  },
  {
    num: '03',
    title: 'Progress Over Perfection',
    desc: 'Go at your own pace. Your journey, your style. Small steps compound into massive results.',
    color: '#00ffcc',
  },
  {
    num: '04',
    title: 'Personalization',
    desc: 'One size fits all does not work. Your plan should be as unique as your goals, body, and lifestyle.',
    color: '#a855f7',
  },
];

const timeline = [
  {
    year: '2024',
    title: 'The Problem',
    desc: 'Hundreds of supplement brands. Conflicting advice. Aggressive marketing. No way to know what actually works for you.',
    color: '#ff2d55',
  },
  {
    year: '2025',
    title: 'The Idea',
    desc: 'What if AI could cut through the noise? Analyze your goals, body, and lifestyle — then recommend the exact stack you need.',
    color: '#a855f7',
  },
  {
    year: '2026',
    title: 'Aviera Launches',
    desc: 'Clean formulas. Transparent labels. AI-powered personalization. No guessing. No proprietary blends. Just results.',
    color: '#00ffcc',
  },
];

// ═══════════════════════════════════════════
// ABOUT PAGE
// ═══════════════════════════════════════════
export default function AboutPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: '#000000',
        color: '#ffffff',
        overflowX: 'hidden',
      }}
    >
      {/* Scanline overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 204, 0.015) 2px, rgba(0, 255, 204, 0.015) 4px)',
        }}
      />

      {/* Sticky Nav */}
      <StickyNav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* ═══ SECTION 1: HERO ═══ */}
      <section
        className="relative z-10 min-h-screen flex flex-col px-4"
        style={{ paddingTop: '60px' }}
      >
        <div className="max-w-[430px] mx-auto w-full flex-1 flex flex-col justify-center">
          {/* Top strip */}
          <div
            className="flex items-center justify-between py-2 mb-5"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
          >
            <span
              style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.4em',
                color: '#00ffcc',
                textTransform: 'uppercase',
              }}
            >
              ◉ Aviera
            </span>
            <span
              style={{
                fontSize: '9px',
                color: '#00ffcc',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                background: 'rgba(0,255,204,0.1)',
                padding: '3px 8px',
                borderRadius: '2px',
              }}
            >
              Our Story
            </span>
          </div>

          {/* Hero headline stagger */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15 } },
            }}
          >
            <motion.h1
              variants={{
                hidden: { opacity: 0, x: -30 },
                visible: { opacity: 1, x: 0 },
              }}
              style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontSize: '68px',
                lineHeight: 0.88,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                marginBottom: '16px',
              }}
            >
              BUILT
              <br />
              FOR
              <br />
              <span style={{ color: '#00ffcc' }}>YOU</span>
              <br />
              <span
                style={{
                  color: '#666',
                  fontSize: '36px',
                  display: 'block',
                  marginTop: '4px',
                }}
              >
                NOT THE <span style={{ color: '#ff2d55' }}>INDUSTRY</span> ///
              </span>
            </motion.h1>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              style={{
                fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                fontSize: '12px',
                color: '#666',
                lineHeight: 1.6,
                marginBottom: '24px',
                maxWidth: '360px',
              }}
            >
              We believe everyone deserves access to a healthy lifestyle.{' '}
              <strong style={{ color: '#00ffcc', fontWeight: 700 }}>
                Health is wealth.
              </strong>{' '}
              The foundation upon which every aspect of life is built. Aviera
              exists to help you build that foundation and discover your best
              self.
            </motion.p>

            {/* Mission box */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="relative overflow-hidden mb-5"
              style={{
                background: '#0a0a0a',
                border: '1px solid rgba(0,255,204,0.2)',
                borderRadius: '8px',
                padding: '24px 16px',
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse at 50% 0%, rgba(0,255,204,0.06) 0%, transparent 70%)',
                }}
              />
              <div
                className="relative"
                style={{
                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                  fontSize: '14px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  color: '#00ffcc',
                  marginBottom: '12px',
                }}
              >
                Our Mission
              </div>
              <div
                className="relative"
                style={{
                  fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                  fontSize: '12px',
                  color: '#999',
                  lineHeight: 1.7,
                  borderLeft: '2px solid #00ffcc',
                  paddingLeft: '14px',
                }}
              >
                &ldquo;Stop guessing which supplements actually help you. Whether
                you&apos;re building muscle, cutting fat, or optimizing health —
                Aviera&apos;s AI creates your perfect stack instantly. The
                confusion ends here.&rdquo;
              </div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 },
              }}
              className="flex items-center gap-2 mt-4"
              style={{
                fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                fontSize: '9px',
                color: '#333',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              <span>Scroll</span>
              <span style={{ color: '#00ffcc' }}>↓</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══ SECTION 2: FOUNDER ═══ */}
      <section className="relative z-10 px-4 py-20">
        <div className="max-w-[430px] mx-auto">
          <FadeInSection>
            {/* Section label */}
            <div
              className="flex items-center gap-3 mb-6"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '10px' }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                  fontSize: '9px',
                  color: '#00ffcc',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                }}
              >
                The Founder
              </span>
              <span
                style={{
                  flex: 1,
                  height: '1px',
                  background: 'rgba(255,255,255,0.06)',
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                  fontSize: '9px',
                  color: '#333',
                }}
              >
                EST. 2024
              </span>
            </div>
          </FadeInSection>

          <FadeInSection delay={0.1}>
            {/* Founder photo */}
            <div
              className="relative overflow-hidden mb-5"
              style={{
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div className="relative w-full" style={{ aspectRatio: '4/5' }}>
                <Image
                  src="/images/about/founder-photo.jpeg"
                  alt="Reece Todd, Founder of Aviera"
                  fill
                  className="object-cover"
                  priority
                />
                {/* Gradient overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 40%, transparent 60%)',
                  }}
                />
                {/* Name overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div
                    style={{
                      fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                      fontSize: '32px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '-0.01em',
                      lineHeight: 1,
                    }}
                  >
                    Reece Todd
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                      fontSize: '10px',
                      color: '#00ffcc',
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      marginTop: '6px',
                    }}
                  >
                    Founder & CEO
                  </div>
                </div>
              </div>
            </div>
          </FadeInSection>

          <FadeInSection delay={0.2}>
            {/* Founder story */}
            <div
              className="space-y-4 mb-6"
              style={{
                fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                fontSize: '12px',
                color: '#888',
                lineHeight: 1.7,
              }}
            >
              <p>
                I&apos;m{' '}
                <strong style={{ color: '#fff', fontWeight: 700 }}>
                  Reece Todd
                </strong>
                , a passionate fitness enthusiast who learned firsthand how
                powerful the right supplements can be when they are simple,
                consistent, and matched to your goals.
              </p>
              <p>
                I built{' '}
                <strong style={{ color: '#00ffcc', fontWeight: 700 }}>
                  Aviera
                </strong>{' '}
                to help you stop guessing which supplements actually help you
                reach your goals. Whether you are building muscle, cutting fat,
                or optimizing health — Aviera&apos;s AI creates your perfect
                starting stack instantly.
              </p>
              <div
                style={{
                  borderLeft: '2px solid #00ffcc',
                  paddingLeft: '14px',
                  fontStyle: 'italic',
                  color: '#666',
                }}
              >
                The supplement industry is overwhelming. Hundreds of products,
                conflicting advice, and aggressive marketing make it nearly
                impossible to know where to start.{' '}
                <strong style={{ color: '#fff' }}>
                  That confusion ends here.
                </strong>
              </div>
              <p>
                What I love most: if you are brand new and do not know where to
                begin, Aviera gets you on the right track fast. No confusion, no
                overwhelm. Just a clear, science-backed plan you can actually
                follow.
              </p>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ═══ SECTION 3: TIMELINE ═══ */}
      <section className="relative z-10 px-4 py-20" style={{ background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-[430px] mx-auto">
          <FadeInSection>
            <div
              className="flex items-center gap-3 mb-8"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '10px' }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                  fontSize: '9px',
                  color: '#00ffcc',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                }}
              >
                The Journey
              </span>
              <span
                style={{
                  flex: 1,
                  height: '1px',
                  background: 'rgba(255,255,255,0.06)',
                }}
              />
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontSize: '42px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                lineHeight: 0.95,
                marginBottom: '32px',
              }}
            >
              HOW WE
              <br />
              <span style={{ color: '#00ffcc' }}>GOT HERE</span>
            </h2>
          </FadeInSection>

          <div className="relative">
            {/* Timeline line */}
            <div
              className="absolute left-[18px] top-0 bottom-0 w-px"
              style={{ background: 'linear-gradient(to bottom, rgba(255,45,85,0.2), rgba(168,85,247,0.2), rgba(0,255,204,0.2))' }}
            />

            {timeline.map((item, i) => (
              <FadeInSection key={i} delay={i * 0.15}>
                <div className="relative pl-12 pb-10">
                  {/* Timeline dot */}
                  <div
                    className="absolute left-[11px] top-[6px] w-[15px] h-[15px] rounded-full"
                    style={{
                      background: '#000',
                      border: `2px solid ${item.color}`,
                      boxShadow: `0 0 12px ${item.color}40`,
                    }}
                  />
                  <div
                    style={{
                      fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                      fontSize: '36px',
                      fontWeight: 700,
                      color: item.color,
                      lineHeight: 1,
                      marginBottom: '6px',
                    }}
                  >
                    {item.year}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                      fontSize: '16px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '8px',
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                      fontSize: '11px',
                      color: '#666',
                      lineHeight: 1.6,
                    }}
                  >
                    {item.desc}
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 4: VALUES ═══ */}
      <section className="relative z-10 px-4 py-20">
        <div className="max-w-[430px] mx-auto">
          <FadeInSection>
            <div
              className="flex items-center gap-3 mb-8"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '10px' }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                  fontSize: '9px',
                  color: '#a855f7',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                }}
              >
                What We Stand For
              </span>
              <span
                style={{
                  flex: 1,
                  height: '1px',
                  background: 'rgba(255,255,255,0.06)',
                }}
              />
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontSize: '42px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                lineHeight: 0.95,
                marginBottom: '32px',
              }}
            >
              OUR
              <br />
              <span style={{ color: '#a855f7' }}>VALUES</span>
            </h2>
          </FadeInSection>

          <div className="flex flex-col gap-[2px]">
            {values.map((item, i) => (
              <FadeInSection key={i} delay={i * 0.1}>
                <div
                  className="relative overflow-hidden"
                  style={{
                    background: '#0a0a0a',
                    padding: '20px 16px',
                    borderRadius: i === 0 ? '8px 8px 0 0' : i === values.length - 1 ? '0 0 8px 8px' : '0',
                  }}
                >
                  {/* Number accent */}
                  <div
                    className="absolute top-3 right-4"
                    style={{
                      fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                      fontSize: '48px',
                      fontWeight: 700,
                      color: item.color === '#a855f7' ? 'rgba(168,85,247,0.04)' : 'rgba(0,255,204,0.04)',
                      lineHeight: 1,
                    }}
                  >
                    {item.num}
                  </div>
                  <div className="relative">
                    <div className="flex items-baseline gap-3 mb-2">
                      <span
                        style={{
                          fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                          fontSize: '10px',
                          color: item.color,
                          fontWeight: 700,
                        }}
                      >
                        {item.num}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                          fontSize: '18px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.03em',
                        }}
                      >
                        {item.title}
                      </span>
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                        fontSize: '11px',
                        color: '#666',
                        lineHeight: 1.6,
                        paddingLeft: '28px',
                      }}
                    >
                      {item.desc}
                    </div>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 5: CTA ═══ */}
      <section className="relative z-10 px-4 pt-10 pb-32" style={{ background: 'radial-gradient(ellipse at 50% 80%, rgba(0,255,204,0.06) 0%, transparent 60%), #000000' }}>
        <div className="max-w-[430px] mx-auto">
          <FadeInSection>
            <div
              className="relative overflow-hidden text-center"
              style={{
                background: '#0a0a0a',
                border: '1px solid rgba(255,45,85,0.25)',
                borderRadius: '8px',
                padding: '40px 20px',
              }}
            >
              {/* Radial glow */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse at 50% 0%, rgba(255,45,85,0.08) 0%, transparent 70%)',
                }}
              />
              <div
                className="relative"
                style={{
                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                  fontSize: '36px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                  marginBottom: '12px',
                }}
              >
                READY TO
                <br />
                <span style={{ color: '#ff2d55' }}>START?</span>
              </div>
              <div
                className="relative"
                style={{
                  fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                  fontSize: '11px',
                  color: '#666',
                  marginBottom: '24px',
                  lineHeight: 1.5,
                }}
              >
                Get your personalized supplement stack in 2 minutes.
              </div>
              <Link
                href="/supplement-optimization-score"
                className="inline-block w-full no-underline"
                style={{
                  padding: '18px',
                  background: '#00ffcc',
                  borderRadius: '6px',
                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                  fontSize: '20px',
                  letterSpacing: '0.15em',
                  color: '#000',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                Get My Score →
              </Link>
              <div
                className="relative mt-4"
                style={{
                  fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                  fontSize: '9px',
                  color: '#333',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}
              >
                Free · 2 minutes · AI-powered
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer
        className="relative z-10 px-4 pb-24"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="max-w-[430px] mx-auto pt-8">
          <div className="flex items-center justify-between mb-4">
            <span
              style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.3em',
                color: '#00ffcc',
                textTransform: 'uppercase',
              }}
            >
              ◉ Aviera
            </span>
            <span
              style={{
                fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                fontSize: '9px',
                color: '#333',
              }}
            >
              © {new Date().getFullYear()}
            </span>
          </div>
          <div
            className="flex flex-wrap gap-4"
            style={{
              fontFamily: 'var(--font-space-mono), Space Mono, monospace',
              fontSize: '9px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {[
              { label: 'Shop', href: '/shop' },
              { label: 'O.S.', href: '/supplement-optimization-score' },
              { label: 'Trybe', href: '/trybe' },
              { label: 'Latest', href: '/news' },
              { label: 'Terms', href: '/terms' },
              { label: 'Privacy', href: '/privacy' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{ color: '#444', textDecoration: 'none' }}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex justify-center gap-5 mt-4">
            <a href="https://instagram.com/avierafit" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ color: '#444', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#00ffcc'} onMouseLeave={e => e.currentTarget.style.color = '#444'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="https://tiktok.com/@avierafit" target="_blank" rel="noopener noreferrer" aria-label="TikTok" style={{ color: '#444', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#00ffcc'} onMouseLeave={e => e.currentTarget.style.color = '#444'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.98a8.21 8.21 0 0 0 4.76 1.52V7.05a4.84 4.84 0 0 1-1-.36z"/></svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
