'use client';

import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useSupabaseUser } from './SupabaseAuthProvider';

// ════════════════════════════════════════════════════════════
//  AVIERA DESIGN SYSTEM
//  Single source of truth for all non-product-landing pages.
// ════════════════════════════════════════════════════════════

// ── Design tokens ──
export const TOKENS = {
  CYAN: '#00e5ff',           // Electric cyan — sole accent (matches /creatine)
  CYAN_TINT: '#f4fdff',      // Pale cyan-washed white
  CREAM: '#F5F0EB',          // Warm tan/cream
  INK: '#28282A',            // Soft near-black body text
  CYAN_GLOW: '0 4px 24px rgba(0, 229, 255, 0.35)',
  CYAN_GLOW_HOVER: '0 8px 36px rgba(0, 229, 255, 0.45)',
};

export const FONTS = {
  oswald: { fontFamily: 'var(--font-oswald), Oswald, sans-serif' },
  mono: { fontFamily: 'var(--font-space-mono), Space Mono, monospace' },
  body: { fontFamily: 'Montserrat, var(--font-space-mono), sans-serif' },
};

// ── Container max-widths (matches home page) ──
const CONTAINER_CLASSES = 'max-w-[430px] md:max-w-5xl lg:max-w-6xl mx-auto';
const CONTAINER_NARROW = 'max-w-[430px] md:max-w-3xl mx-auto';

// ════════════════════════════════════════════════════════════
//  FadeInSection — scroll-triggered wrapper
// ════════════════════════════════════════════════════════════
export function FadeInSection({ children, delay = 0, y = 32, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════
//  StickyNav — shared header/hamburger
// ════════════════════════════════════════════════════════════
export function StickyNav({ menuOpen, setMenuOpen }) {
  const auth = useSupabaseUser();
  const user = auth?.user;
  const session = auth?.session;
  const signOut = auth?.signOut;
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: 'rgba(0,0,0,0.78)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className={`${CONTAINER_CLASSES} flex items-center justify-between px-5 md:px-8 py-4`}>
          <Link
            href="/home"
            className="no-underline"
            style={{
              ...FONTS.oswald,
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.4em',
              color: TOKENS.CYAN,
              textTransform: 'uppercase',
              textDecoration: 'none',
            }}
          >
            ◉ Aviera
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href={user ? '/dashboard' : '/auth'}
              className="flex items-center justify-center no-underline"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                border: avatarUrl ? `2px solid ${TOKENS.CYAN}` : '1px solid rgba(255,255,255,0.15)',
                background: 'transparent',
                overflow: 'hidden',
              }}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="" width={28} height={28} style={{ borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
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

      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[59]"
              style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}
              onClick={() => setMenuOpen(false)}
            />
            {/* Slide-in panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-[60] w-[85vw] max-w-[360px] flex flex-col"
              style={{ background: TOKENS.CREAM, boxShadow: '-8px 0 40px rgba(0,0,0,0.12)' }}
            >
              {/* Header row */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4">
                <span
                  style={{
                    ...FONTS.oswald,
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '0.4em',
                    color: TOKENS.CYAN,
                    textTransform: 'uppercase',
                  }}
                >
                  ◉ Aviera
                </span>
                <motion.button
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="bg-transparent border-none cursor-pointer p-2"
                  style={{ color: TOKENS.INK }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </motion.button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 flex flex-col px-6 pt-4 gap-1">
                {[
                  { label: 'Home', href: '/home' },
                  { label: 'Shop', href: '/shop' },
                  { label: 'Personalized Supplements', href: '/supplement-optimization-score' },
                  { label: 'Creators Program', href: '/trybe' },
                  { label: 'About', href: '/about' },
                  { label: 'News', href: '/news' },
                  { label: 'My Supplement Plan', href: '/dashboard' },
                ].map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.04, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="block py-3 no-underline transition-colors duration-200"
                      style={{
                        ...FONTS.body,
                        fontSize: '18px',
                        fontWeight: 500,
                        color: TOKENS.INK,
                        textDecoration: 'none',
                        borderBottom: '1px solid rgba(0,0,0,0.06)',
                      }}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Bottom: Auth + branding */}
              <div className="px-6 pb-8 pt-4">
                {session ? (
                  <button
                    onClick={async () => {
                      if (signOut) await signOut();
                      setMenuOpen(false);
                      window.location.href = '/auth';
                    }}
                    className="w-full py-3 border-none cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
                    style={{
                      ...FONTS.oswald,
                      fontSize: '13px',
                      fontWeight: 700,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      background: 'transparent',
                      color: 'rgba(0,0,0,0.5)',
                      border: '1.5px solid rgba(0,0,0,0.15)',
                      borderRadius: '10px',
                    }}
                  >
                    Sign Out
                  </button>
                ) : (
                  <Link
                    href="/auth"
                    onClick={() => setMenuOpen(false)}
                    className="block w-full py-3 text-center no-underline transition-all duration-300 hover:-translate-y-0.5"
                    style={{
                      ...FONTS.oswald,
                      fontSize: '13px',
                      fontWeight: 700,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      background: TOKENS.CYAN,
                      color: TOKENS.INK,
                      borderRadius: '10px',
                      textDecoration: 'none',
                      boxShadow: TOKENS.CYAN_GLOW,
                    }}
                  >
                    Sign In / Sign Up
                  </Link>
                )}
                <p className="text-center mt-4" style={{ ...FONTS.mono, fontSize: '8px', color: 'rgba(0,0,0,0.35)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                  © 2026 Aviera Fit
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ════════════════════════════════════════════════════════════
//  Footer — shared
// ════════════════════════════════════════════════════════════
export function Footer() {
  return (
    <footer
      className="relative py-10 md:py-14 px-5 md:px-8"
      style={{
        ...FONTS.mono,
        fontSize: '9px',
        color: 'rgba(255,255,255,0.35)',
        lineHeight: 1.7,
        textAlign: 'center',
        background: '#000',
      }}
    >
      <div className={CONTAINER_CLASSES}>
        <div className="mb-4" style={{ letterSpacing: '0.18em', textTransform: 'uppercase' }}>
          <Link href="/shop" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Shop</Link>
          {' · '}
          <Link href="/about" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>About</Link>
          {' · '}
          <Link href="/news" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>News</Link>
          {' · '}
          <Link href="/supplement-optimization-score" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Quiz</Link>
          {' · '}
          <Link href="/trybe" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Creators</Link>
        </div>
        <div className="mb-4" style={{ letterSpacing: '0.18em', textTransform: 'uppercase' }}>
          <Link href="/terms" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Terms</Link>
          {' · '}
          <Link href="/privacy" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Privacy</Link>
        </div>
        <p>
          Manufactured for and Distributed by AvieraFit
          <br />
          4437 Lister St, San Diego, CA 92110 USA
          <br />
          <a href="mailto:info@avierafit.com" style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>
            info@avierafit.com
          </a>
        </p>
        <p className="mt-3">
          © 2026 Aviera Fit. All rights reserved.
          <br />
          *These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease.
        </p>
      </div>
    </footer>
  );
}

// ════════════════════════════════════════════════════════════
//  PageLayout — main wrapper
// ════════════════════════════════════════════════════════════
export default function PageLayout({ children, hideFooter = false }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className="min-h-screen relative"
      style={{ background: '#000', color: TOKENS.INK, overflowX: 'hidden' }}
    >
      <StickyNav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main className="relative">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
//  SectionBlock — alternating bg + container + animation
//
//  Usage:
//    <SectionBlock variant="cream" eyebrow="THE LIST" title="Drops, early.">
//      ...content
//    </SectionBlock>
//
//  Variants: 'white' | 'cream' | 'cyan-tint' | 'auto' (alternates by index)
// ════════════════════════════════════════════════════════════
export function SectionBlock({
  variant = 'white',
  eyebrow,
  title,
  titleAccent,        // optional — appended to title in cyan
  subtitle,
  align = 'left',     // 'left' | 'center'
  narrow = false,     // narrow container (max-w-3xl) for mission/newsletter blocks
  children,
  className = '',
  id,
}) {
  const bg =
    variant === 'cream'
      ? TOKENS.CREAM
      : variant === 'cyan-tint'
      ? TOKENS.CYAN_TINT
      : '#ffffff';

  const containerCls = narrow ? CONTAINER_NARROW : CONTAINER_CLASSES;
  const alignCls = align === 'center' ? 'text-center' : '';

  return (
    <section
      id={id}
      className={`relative ${className}`}
      style={{ zIndex: 10, background: bg, color: TOKENS.INK }}
    >
      <div className={`${containerCls} px-5 md:px-8 py-12 md:py-16 ${alignCls}`}>
        {(eyebrow || title) && (
          <FadeInSection>
            {eyebrow && (
              <p
                style={{
                  ...FONTS.mono,
                  fontSize: '10px',
                  letterSpacing: '0.32em',
                  color: TOKENS.CYAN,
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}
              >
                {eyebrow}
              </p>
            )}
            {title && (
              <h2
                className="text-[32px] md:text-[48px] lg:text-[60px] mb-6 md:mb-8"
                style={{
                  ...FONTS.oswald,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  lineHeight: 0.95,
                  letterSpacing: '-0.01em',
                  color: TOKENS.INK,
                }}
              >
                {title}
                {titleAccent && (
                  <>
                    {' '}
                    <span style={{ color: TOKENS.CYAN }}>{titleAccent}</span>
                  </>
                )}
              </h2>
            )}
            {subtitle && (
              <p
                style={{
                  ...FONTS.mono,
                  fontSize: '12px',
                  color: 'rgba(0,0,0,0.6)',
                  lineHeight: 1.7,
                  marginBottom: '32px',
                  maxWidth: align === 'center' ? '480px' : '520px',
                  marginLeft: align === 'center' ? 'auto' : undefined,
                  marginRight: align === 'center' ? 'auto' : undefined,
                }}
              >
                {subtitle}
              </p>
            )}
          </FadeInSection>
        )}
        {children}
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════
//  CTAButton — primary cyan / secondary outline
// ════════════════════════════════════════════════════════════
export function CTAButton({
  href,
  children,
  variant = 'primary',  // 'primary' | 'secondary'
  size = 'lg',          // 'lg' | 'md'
  onClick,
  type,
  disabled = false,
  className = '',
}) {
  const padding = size === 'lg' ? '18px 36px' : '14px 28px';
  const fontSize = size === 'lg' ? '14px' : '13px';

  const primaryStyle = {
    background: TOKENS.CYAN,
    color: TOKENS.INK,
    boxShadow: TOKENS.CYAN_GLOW,
    border: 'none',
  };
  const secondaryStyle = {
    background: 'transparent',
    color: TOKENS.INK,
    border: `2px solid ${TOKENS.CYAN}`,
    boxShadow: 'none',
  };

  const baseStyle = {
    ...FONTS.oswald,
    padding,
    fontSize,
    fontWeight: 700,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    borderRadius: '10px',
    textDecoration: 'none',
    display: 'inline-block',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    ...(variant === 'primary' ? primaryStyle : secondaryStyle),
  };

  const Wrap = ({ children: c }) => (
    <span
      className={`transition-all duration-300 hover:-translate-y-0.5 ${className}`}
      style={baseStyle}
    >
      {c}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="no-underline">
        <Wrap>{children}</Wrap>
      </Link>
    );
  }

  return (
    <button onClick={onClick} type={type} disabled={disabled} className={`border-none cursor-pointer transition-all duration-300 hover:-translate-y-0.5 ${className}`} style={baseStyle}>
      {children}
    </button>
  );
}

// ════════════════════════════════════════════════════════════
//  HeroSection — full-bleed image hero with overlay + headline
// ════════════════════════════════════════════════════════════
export function HeroSection({
  image,
  imageAlt = '',
  eyebrow,
  headlineLines = [],     // [line1, line2, ...]
  accentLineIdx = -1,     // which line gets cyan accent
  subtitle,
  primaryCta,             // { href, label }
  secondaryCta,           // { href, label }  — rendered as underline link
  minHeight = '100vh',
}) {
  return (
    <section className="relative" style={{ minHeight, zIndex: 10 }}>
      {image && (
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={image}
            alt={imageAlt}
            className="w-full h-full object-cover"
            style={{ filter: 'grayscale(15%) contrast(1.06)' }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.45) 35%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,1) 100%)',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at 20% 80%, rgba(0,229,255,0.08) 0%, transparent 50%)',
            }}
          />
        </div>
      )}

      <div
        className={`relative ${CONTAINER_CLASSES} px-5 md:px-8 flex flex-col`}
        style={{ minHeight, paddingTop: '100px', paddingBottom: '60px' }}
      >
        {eyebrow && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            style={{
              ...FONTS.mono,
              fontSize: '10px',
              color: 'rgba(255,255,255,0.65)',
              textTransform: 'uppercase',
              letterSpacing: '0.32em',
            }}
          >
            {eyebrow}
          </motion.p>
        )}

        <div className="flex-1" />

        <div className="md:max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              ...FONTS.oswald,
              lineHeight: 0.92,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              marginBottom: '24px',
              color: '#fff',
            }}
            className="text-[48px] sm:text-[64px] md:text-[88px] lg:text-[112px]"
          >
            {headlineLines.map((line, i) => (
              <React.Fragment key={i}>
                {i === accentLineIdx ? (
                  <span style={{ color: TOKENS.CYAN }}>{line}</span>
                ) : (
                  line
                )}
                {i < headlineLines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </motion.h1>

          {subtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.5 }}
              style={{
                ...FONTS.mono,
                color: 'rgba(255,255,255,0.7)',
                lineHeight: 1.7,
                marginBottom: '28px',
              }}
              className="text-[12px] md:text-[14px] max-w-[340px] md:max-w-[480px]"
            >
              {subtitle}
            </motion.p>
          )}

          {(primaryCta || secondaryCta) && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.65 }}
              className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6"
            >
              {primaryCta && (
                <CTAButton href={primaryCta.href} variant="primary" size="lg">
                  {primaryCta.label}
                </CTAButton>
              )}
              {secondaryCta && (
                <Link
                  href={secondaryCta.href}
                  className="text-center no-underline"
                  style={{
                    ...FONTS.mono,
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.75)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    textDecoration: 'underline',
                    textDecorationColor: 'rgba(0,229,255,0.4)',
                    textUnderlineOffset: '6px',
                  }}
                >
                  {secondaryCta.label}
                </Link>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════
//  MissionBlock — centered text block (cream bg by default)
// ════════════════════════════════════════════════════════════
export function MissionBlock({ eyebrow, body, accent, ctaHref, ctaLabel, variant = 'cream' }) {
  const bg = variant === 'cyan-tint' ? TOKENS.CYAN_TINT : variant === 'white' ? '#ffffff' : TOKENS.CREAM;
  return (
    <section className="relative" style={{ zIndex: 10, background: bg, color: TOKENS.INK }}>
      <div className={`${CONTAINER_NARROW} px-6 py-14 md:py-20 text-center`}>
        {eyebrow && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{
              ...FONTS.mono,
              fontSize: '10px',
              letterSpacing: '0.32em',
              color: TOKENS.CYAN,
              textTransform: 'uppercase',
              marginBottom: '18px',
            }}
          >
            {eyebrow}
          </motion.p>
        )}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            ...FONTS.body,
            fontWeight: 300,
            fontSize: '18px',
            lineHeight: 1.6,
            color: TOKENS.INK,
            maxWidth: '560px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
          className="md:text-[22px]"
        >
          {body}
          {accent && (
            <>
              {' '}
              <span style={{ color: TOKENS.CYAN, fontWeight: 500 }}>{accent}</span>
            </>
          )}
        </motion.p>
        {ctaHref && ctaLabel && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8"
          >
            <CTAButton href={ctaHref} variant="secondary" size="md">
              {ctaLabel}
            </CTAButton>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════
//  ProductCard inner — extracted so it can be wrapped in either
//  a <Link> or a clickable <div>
// ════════════════════════════════════════════════════════════
function ProductCardInner({ product: p, showViewDetails = false }) {
  return (
    <>
      <div
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: '1 / 1',
          background: '#ffffff',
          borderRadius: '10px',
          borderTop: `3px solid ${p.accent}`,
          boxShadow: `0 1px 3px rgba(40,40,42,0.06), 0 4px 14px rgba(40,40,42,0.05), inset 0 -40px 60px -20px ${p.accent}1A`,
          transition: 'box-shadow 0.5s cubic-bezier(0.22, 1, 0.36, 1), transform 0.5s',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 55%, ${p.accent}28 0%, ${p.accent}10 30%, transparent 65%)`,
          }}
        />
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 55%, ${p.accent}33 0%, transparent 60%)`,
          }}
        />
        {p.image ? (
          <img
            src={p.image}
            alt={p.name}
            className="absolute inset-0 w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.08]"
            style={{ padding: '14px', filter: `drop-shadow(0 8px 16px ${p.accent}40)` }}
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ ...FONTS.mono, fontSize: '9px', color: '#999' }}
          >
            {p.name}
          </div>
        )}
        <span
          className="absolute top-2 left-2"
          style={{
            ...FONTS.mono,
            fontSize: '7px',
            fontWeight: 700,
            color: '#fff',
            background: p.accent,
            padding: '3px 7px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            borderRadius: '3px',
            boxShadow: `0 2px 8px ${p.accent}55`,
          }}
        >
          {p.category}
        </span>
      </div>

      <div className="mt-2 md:mt-4 px-1">
        <div className="flex items-baseline justify-between gap-2">
          <h3
            className="md:text-[17px]"
            style={{
              ...FONTS.oswald,
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.01em',
              color: TOKENS.INK,
              lineHeight: 1.15,
            }}
          >
            {p.name}
          </h3>
          {p.price && (
            <p
              className="md:text-[15px]"
              style={{ ...FONTS.oswald, fontSize: '11px', color: TOKENS.INK, whiteSpace: 'nowrap' }}
            >
              {p.price}
            </p>
          )}
        </div>
        {showViewDetails && (
          <p
            className="mt-2"
            style={{
              ...FONTS.mono,
              fontSize: '8px',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: p.accent,
              fontWeight: 700,
            }}
          >
            View Details →
          </p>
        )}
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════════
//  ProductGrid — compact product card grid
//
//  products: array of { name, category, accent, href, image, price }
//  onProductClick: optional click handler — if provided, each card
//                  becomes a clickable div instead of a Link
// ════════════════════════════════════════════════════════════
export function ProductGrid({ products, columns = 'lg:grid-cols-4', onProductClick }) {
  const gridCls = `grid grid-cols-2 sm:grid-cols-3 ${columns} gap-3 md:gap-6`;
  const useClick = !!onProductClick;

  return (
    <div className={gridCls}>
      {products.map((p, i) => (
        <motion.div
          key={(p.name || 'p') + i}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: (i % 8) * 0.05, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -6 }}
          className="h-full"
        >
          {useClick ? (
            <div
              onClick={() => onProductClick(p)}
              className="group block no-underline h-full cursor-pointer"
              style={{ color: 'inherit' }}
            >
              <ProductCardInner product={p} showViewDetails />
            </div>
          ) : (
            <Link
              href={p.href || '/shop'}
              className="group block no-underline h-full"
              style={{ color: 'inherit' }}
            >
              <ProductCardInner product={p} />
            </Link>
          )}
        </motion.div>
      ))}
    </div>
  );
}
