'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { fetchProductById } from '../lib/shopify';

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
                  color: '#ffffff',
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

const howItWorksSteps = [
  {
    num: '01',
    title: 'Apply Through Trybe',
    desc: 'Hit the apply button. Fill out your info, connect your socials. Takes 2 minutes. We review every application personally.',
  },
  {
    num: '02',
    title: 'Get Your Free Product',
    desc: 'Once approved, we ship you Flow State X on us. Try it yourself first — you can\'t sell what you don\'t believe in.',
  },
  {
    num: '03',
    title: 'Create & Post',
    desc: 'Make content your way. Gym clips, unboxings, day-in-my-life, reviews — we leave the creativity to you. Instagram Reels and TikTok are where it hits hardest.',
  },
  {
    num: '04',
    title: 'Earn 15% on Every Sale',
    desc: 'Share your unique creator link. Every sale tracked, every commission paid. Real money for real content. No cap on earnings.',
  },
];

const perks = [
  { icon: '💰', title: '15% Commission', desc: 'Every sale through your link earns you 15%. No minimums, no limits. The more you sell, the more you make.' },
  { icon: '📦', title: 'Free Product', desc: 'We send you Flow State X for free. Try it, film it, post it. You\'re repping something you\'ve actually used.' },
  { icon: '🔗', title: 'Your Own Tracked Link', desc: 'Get a unique affiliate link with full attribution tracking. See your clicks, conversions, and earnings in real time through Trybe.' },
  { icon: '⚡', title: 'Fast Approval', desc: 'We don\'t gatekeep. If you\'re making fitness content and bring real energy, you\'re in. No follower minimums.' },
  { icon: '🤝', title: 'Be Part of the Brand', desc: 'This isn\'t a one-off sponsorship. You\'re joining the Aviera crew. Early creators get first access to new products and bigger opportunities.' },
];

const lookingForItems = [
  'You post gym / fitness / lifting content regularly',
  'You\'re active on Instagram Reels or TikTok',
  'You actually care about what you put in your body',
  'You can create authentic content — not scripted ads',
  'You want to build with a brand, not just promote one',
  'Any follower count — we care about quality over numbers',
];

const contentIdeas = [
  {
    num: '01',
    title: 'Workout Clips',
    desc: 'Film your set. Show the pump. Tag us. "This is what Flow State X does to my arms mid-set" — simple, real, effective.',
  },
  {
    num: '02',
    title: 'Unboxing / First Impressions',
    desc: 'Open the package on camera. Show the bottle. Talk about what you\'re expecting. Follow up with a "one week later" review.',
  },
  {
    num: '03',
    title: 'Day in My Life',
    desc: 'Natural product placement. Pop the capsules before your workout, mention it casually. The less it feels like an ad, the better it performs.',
  },
  {
    num: '04',
    title: 'Before / During / After',
    desc: 'Show the progression. Take Flow State X → train → show the pump. Let the product speak for itself.',
  },
];

const faqItems = [
  { q: 'Do I need a minimum follower count?', a: 'No. We care about content quality and energy, not vanity metrics. Micro-creators often outperform big accounts.' },
  { q: 'How do I get paid?', a: 'Commissions are tracked through Trybe and paid out automatically. Every sale through your unique link is attributed to you.' },
  { q: 'Is the product actually free?', a: 'Yes. Once approved, we ship you Flow State X at no cost. We want you to try it before you sell it.' },
  { q: 'What kind of content do you want?', a: 'Authentic gym content. Workout clips, unboxings, day-in-my-life. We leave the creativity to you — no scripts, no templates.' },
  { q: 'How fast is approval?', a: 'Most applications are reviewed within 24-48 hours. If you\'re making legit fitness content, you\'re in.' },
  { q: 'Can I promote on other platforms?', a: 'Instagram Reels and TikTok are our priority, but your link works anywhere — YouTube, Twitter, wherever your audience is.' },
];

const APPLY_URL = 'https://jointrybe.com/auth/program-invite/cmmaxfasw000rp70snvb3l75z';
const DM_URL = 'https://instagram.com/avierafit';

// ═══════════════════════════════════════════
// TRYBE PAGE
// ═══════════════════════════════════════════
export default function TrybePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [productImage, setProductImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const SHOPIFY_PRODUCT_ID = '8645601657022';

  // Fetch Flow State X image from Shopify
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await fetchProductById(SHOPIFY_PRODUCT_ID);
        const img = product?.images?.[0] || product?.image || null;
        if (img) setProductImage(img);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, []);

  return (
    <div
      className="min-h-screen relative"
      style={{
        color: '#ffffff',
        overflowX: 'hidden',
      }}
    >

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
                color: '#ff2d55',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                background: 'rgba(255,45,85,0.15)',
                padding: '3px 8px',
                borderRadius: '2px',
              }}
            >
              Now Recruiting
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
              variants={{ hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0 } }}
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
              JOIN
              <br />
              THE
              <br />
              <span style={{ color: '#00ffcc' }}>TRYBE</span>
              <br />
              <span style={{ color: '#666', fontSize: '36px', display: 'block', marginTop: '4px' }}>
                <span style={{ color: '#ff2d55' }}>GET PAID</span> TO POST ///
              </span>
            </motion.h1>

            <motion.p
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              style={{
                fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                fontSize: '12px',
                color: '#666',
                lineHeight: 1.6,
                marginBottom: '24px',
                maxWidth: '360px',
              }}
            >
              We&apos;re building a crew of fitness creators who rep{' '}
              <strong style={{ color: '#00ffcc', fontWeight: 700 }}>Aviera Fit</strong>. You create
              the content. We give you free product, your own link, and{' '}
              <strong style={{ color: '#00ffcc', fontWeight: 700 }}>15% commission</strong> on every
              sale. No followers minimum. Just bring the energy.
            </motion.p>

            {/* Commission box */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="relative overflow-hidden text-center mb-5"
              style={{
                background: '#0a0a0a',
                border: '1px solid rgba(0,255,204,0.2)',
                borderRadius: '8px',
                padding: '24px 16px',
              }}
            >
              {/* Radial glow */}
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
                  fontSize: '72px',
                  fontWeight: 700,
                  color: '#ff2d55',
                  lineHeight: 1,
                }}
              >
                15<span style={{ fontSize: '36px', verticalAlign: 'super' }}>%</span>
              </div>
              <div
                className="relative"
                style={{
                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                  fontSize: '18px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginTop: '4px',
                }}
              >
                Commission Per Sale
              </div>
              <div
                className="relative"
                style={{
                  fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                  fontSize: '11px',
                  color: '#666',
                  marginTop: '6px',
                }}
              >
                Tracked through your unique creator link
              </div>
              <p
                className="relative"
                style={{
                  fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                  fontSize: '10px',
                  color: '#ff2d55',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontWeight: 700,
                  marginTop: '8px',
                }}
              >
                ⚡ Limited spots — apply now
              </p>
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="flex flex-col gap-[10px] mb-5"
            >
              <a
                href={APPLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center no-underline"
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
                Apply Now →
              </a>
              <a
                href={DM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center no-underline"
                style={{
                  padding: '16px',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '6px',
                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                  fontSize: '16px',
                  letterSpacing: '0.12em',
                  color: '#ffffff',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                Have Questions? DM Us @avierafit
              </a>
            </motion.div>

            {/* Micro trust */}
            <motion.div
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              className="flex justify-around"
              style={{
                fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                fontSize: '10px',
                color: '#666',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              <span>✓ Free product</span>
              <span>✓ 15% commission</span>
              <span>✓ Fast approval</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══ SECTION 2: HOW IT WORKS ═══ */}
      <section
        className="relative z-10 py-10 px-4"
        style={{ background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div className="max-w-[430px] mx-auto">
          <FadeInSection>
            <p
              className="mb-2"
              style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.3em',
                color: '#00ffcc',
                textTransform: 'uppercase',
              }}
            >
              The Program
            </p>
            <h2
              className="mb-5"
              style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontSize: '32px',
                fontWeight: 700,
                textTransform: 'uppercase',
                lineHeight: 1,
              }}
            >
              HOW IT <span style={{ color: '#00ffcc' }}>WORKS</span>
            </h2>
          </FadeInSection>

          {howItWorksSteps.map((step, i) => (
            <FadeInSection key={i} delay={i * 0.1}>
              <div
                className="flex gap-[14px] py-[18px]"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                    fontSize: '36px',
                    fontWeight: 700,
                    color: 'rgba(0,255,204,0.12)',
                    minWidth: '44px',
                    lineHeight: 1,
                  }}
                >
                  {step.num}
                </div>
                <div>
                  <h3
                    className="mb-[3px]"
                    style={{
                      fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                      fontSize: '16px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                      fontSize: '11px',
                      color: '#666',
                      lineHeight: 1.5,
                    }}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* ═══ SECTION 3: CREATOR PERKS ═══ */}
      <section
        className="relative z-10 py-10 px-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div className="max-w-[430px] mx-auto">
          <FadeInSection>
            <p
              className="mb-2"
              style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.3em',
                color: '#00ffcc',
                textTransform: 'uppercase',
              }}
            >
              Creator Perks
            </p>
            <h2
              className="mb-5"
              style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontSize: '32px',
                fontWeight: 700,
                textTransform: 'uppercase',
                lineHeight: 1,
              }}
            >
              WHAT YOU <span style={{ color: '#00ffcc' }}>GET</span>
            </h2>
          </FadeInSection>

          {perks.map((perk, i) => (
            <FadeInSection key={i} delay={i * 0.08}>
              <div
                className="mb-3"
                style={{
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '8px',
                  padding: '16px',
                  background: 'rgba(255,255,255,0.02)',
                }}
              >
                <div className="flex items-center gap-[10px] mb-2">
                  <div
                    className="flex items-center justify-center shrink-0"
                    style={{
                      width: '32px',
                      height: '32px',
                      border: '1px solid rgba(0,255,204,0.3)',
                      borderRadius: '6px',
                      fontSize: '14px',
                      color: '#00ffcc',
                    }}
                  >
                    {perk.icon}
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                      fontSize: '15px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                    }}
                  >
                    {perk.title}
                  </h3>
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                    fontSize: '11px',
                    color: '#666',
                    lineHeight: 1.5,
                  }}
                >
                  {perk.desc}
                </p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* ═══ SECTION 4: WHO WE'RE LOOKING FOR ═══ */}
      <section
        className="relative z-10 py-10 px-4"
        style={{ background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div className="max-w-[430px] mx-auto">
          <FadeInSection>
            <p
              className="mb-2"
              style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.3em',
                color: '#00ffcc',
                textTransform: 'uppercase',
              }}
            >
              Ideal Creators
            </p>
            <h2
              className="mb-5"
              style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontSize: '32px',
                fontWeight: 700,
                textTransform: 'uppercase',
                lineHeight: 1,
              }}
            >
              WHO WE&apos;RE <span style={{ color: '#00ffcc' }}>LOOKING FOR</span>
            </h2>
          </FadeInSection>

          <ul className="list-none">
            {lookingForItems.map((item, i) => (
              <FadeInSection key={i} delay={i * 0.08}>
                <li
                  className="flex gap-[10px] items-start py-[10px]"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                >
                  <span
                    className="shrink-0"
                    style={{ color: '#00ffcc', fontSize: '14px', marginTop: '1px' }}
                  >
                    ◉
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                      fontSize: '12px',
                      color: '#ccc',
                      lineHeight: 1.5,
                    }}
                  >
                    {item}
                  </span>
                </li>
              </FadeInSection>
            ))}
          </ul>
        </div>
      </section>

      {/* ═══ SECTION 5: CONTENT THAT WORKS ═══ */}
      <section
        className="relative z-10 py-10 px-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div className="max-w-[430px] mx-auto">
          <FadeInSection>
            <p
              className="mb-2"
              style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.3em',
                color: '#00ffcc',
                textTransform: 'uppercase',
              }}
            >
              Content That Works
            </p>
            <h2
              className="mb-5"
              style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontSize: '32px',
                fontWeight: 700,
                textTransform: 'uppercase',
                lineHeight: 1,
              }}
            >
              WHAT TO <span style={{ color: '#00ffcc' }}>POST</span>
            </h2>
          </FadeInSection>

          {contentIdeas.map((idea, i) => (
            <FadeInSection key={i} delay={i * 0.1}>
              <div
                className="flex gap-[14px] py-[18px]"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                    fontSize: '36px',
                    fontWeight: 700,
                    color: 'rgba(0,255,204,0.12)',
                    minWidth: '44px',
                    lineHeight: 1,
                  }}
                >
                  {idea.num}
                </div>
                <div>
                  <h3
                    className="mb-[3px]"
                    style={{
                      fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                      fontSize: '16px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                    }}
                  >
                    {idea.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                      fontSize: '11px',
                      color: '#666',
                      lineHeight: 1.5,
                    }}
                  >
                    {idea.desc}
                  </p>
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* ═══ SECTION 6: PRODUCT SPOTLIGHT ═══ */}
      <section
        className="relative z-10 py-10 px-4"
        style={{
          background: '#0a0a0a',
          borderTop: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        <div className="max-w-[430px] mx-auto">
          <FadeInSection>
            <p
              className="mb-2"
              style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.3em',
                color: '#00ffcc',
                textTransform: 'uppercase',
              }}
            >
              What You&apos;re Selling
            </p>
            <h2
              className="mb-5"
              style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontSize: '32px',
                fontWeight: 700,
                textTransform: 'uppercase',
                lineHeight: 1,
              }}
            >
              FLOW STATE <span style={{ color: '#00ffcc' }}>X</span>
            </h2>
          </FadeInSection>

          <FadeInSection delay={0.15}>
            <div
              className="text-center"
              style={{
                border: '1px solid rgba(0,255,204,0.15)',
                borderRadius: '8px',
                padding: '20px 16px',
                marginTop: '16px',
              }}
            >
              {/* Product image */}
              <div
                className="mx-auto mb-[14px] flex items-center justify-center"
                style={{
                  width: '140px',
                  height: '200px',
                  background: 'linear-gradient(145deg, #111, #0a0a0a)',
                  border: '1px solid rgba(0,255,204,0.1)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
              >
                {productImage ? (
                  <img
                    src={productImage}
                    alt="Flow State X"
                    className="w-full h-full object-contain p-2"
                    style={{ filter: 'drop-shadow(0 10px 20px rgba(0, 255, 204, 0.15))' }}
                  />
                ) : (
                  <span
                    style={{
                      fontSize: '9px',
                      color: '#666',
                      fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                    }}
                  >
                    {isLoading ? 'Loading...' : 'Product Image'}
                  </span>
                )}
              </div>

              <div
                className="mb-2"
                style={{
                  fontSize: '10px',
                  color: '#00ffcc',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                }}
              >
                Nitric Oxide Booster
              </div>
              <div
                className="mb-[2px]"
                style={{
                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                  fontSize: '24px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}
              >
                Flow State X
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                  fontSize: '11px',
                  color: '#666',
                  lineHeight: 1.5,
                  marginTop: '8px',
                }}
              >
                L-Citrulline DL-Malate + dual-form L-Arginine for skin-splitting pumps and
                vascularity. No stim, no crash. Clean vegetable capsule formula. 60 capsules / 30
                servings.
              </p>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ═══ SECTION 7: PLATFORMS ═══ */}
      <section className="relative z-10 py-[30px] px-4 text-center">
        <div className="max-w-[430px] mx-auto">
          <FadeInSection>
            <p
              className="mb-2"
              style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.3em',
                color: '#00ffcc',
                textTransform: 'uppercase',
              }}
            >
              Where to Post
            </p>
            <h2
              className="mb-4"
              style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontSize: '24px',
                fontWeight: 700,
                textTransform: 'uppercase',
                lineHeight: 1,
              }}
            >
              OUR <span style={{ color: '#00ffcc' }}>PLATFORMS</span>
            </h2>

            <div className="flex justify-center gap-5 mt-4 mb-4">
              {[
                { icon: '📱', name: 'Instagram\nReels' },
                { icon: '🎵', name: 'TikTok' },
              ].map((platform, i) => (
                <div key={i} className="text-center">
                  <div
                    className="flex items-center justify-center mx-auto mb-[6px]"
                    style={{
                      width: '48px',
                      height: '48px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '10px',
                      fontSize: '18px',
                    }}
                  >
                    {platform.icon}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                      fontSize: '9px',
                      color: '#666',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {platform.name}
                  </div>
                </div>
              ))}
            </div>

            <p
              style={{
                fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                fontSize: '10px',
                color: '#666',
                lineHeight: 1.5,
              }}
            >
              Short-form video is where our audience lives. Reels and TikTok get the most engagement
              and drive the most sales.
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* ═══ SECTION 8: FAQ ═══ */}
      <section
        className="relative z-10 py-10 px-4"
        style={{ background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div className="max-w-[430px] mx-auto">
          <FadeInSection>
            <p
              className="mb-2"
              style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.3em',
                color: '#00ffcc',
                textTransform: 'uppercase',
              }}
            >
              Questions
            </p>
            <h2
              className="mb-5"
              style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontSize: '32px',
                fontWeight: 700,
                textTransform: 'uppercase',
                lineHeight: 1,
              }}
            >
              <span style={{ color: '#00ffcc' }}>FAQ</span>
            </h2>
          </FadeInSection>

          {faqItems.map((faq, i) => (
            <FadeInSection key={i} delay={i * 0.08}>
              <div
                className="py-[14px]"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
              >
                <div
                  className="mb-[6px]"
                  style={{
                    fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                    fontSize: '15px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                  }}
                >
                  {faq.q}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                    fontSize: '11px',
                    color: '#666',
                    lineHeight: 1.5,
                  }}
                >
                  {faq.a}
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* ═══ SECTION 9: BOTTOM CTA ═══ */}
      <section
        className="relative z-10 py-[50px] px-4 text-center"
        style={{
          background:
            'radial-gradient(ellipse at 50% 80%, rgba(0,255,204,0.06) 0%, transparent 60%), #000000',
        }}
      >
        <div className="max-w-[430px] mx-auto">
          <FadeInSection>
            <h2
              className="mb-5"
              style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontSize: '48px',
                lineHeight: 0.88,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
              }}
            >
              CREATE.
              <br />
              <span style={{ color: '#00ffcc' }}>EARN.</span>
              <br />
              <span style={{ color: '#ff2d55' }}>REPEAT.</span>
            </h2>
          </FadeInSection>

          <FadeInSection delay={0.15}>
            <a
              href={APPLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center no-underline"
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
              Apply to Join the Trybe →
            </a>

            <div
              className="flex justify-around mt-4"
              style={{
                fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                fontSize: '10px',
                color: '#666',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              <span>✓ Free product</span>
              <span>✓ 15% per sale</span>
              <span>✓ No minimums</span>
            </div>

            <p
              className="mt-5"
              style={{
                fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                fontSize: '10px',
                color: '#666',
                lineHeight: 1.5,
              }}
            >
              Questions? Hit us at{' '}
              <a
                href="mailto:info@avierafit.com"
                style={{ color: '#00ffcc', textDecoration: 'none' }}
              >
                info@avierafit.com
              </a>{' '}
              or DM us on Instagram.
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* ═══ SECTION 10: FOOTER ═══ */}
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
            <Link href="/home" style={{ color: '#00ffcc', textDecoration: 'none' }}>
              Home
            </Link>
            {' · '}
            <Link href="/shop" style={{ color: '#00ffcc', textDecoration: 'none' }}>
              Shop
            </Link>
            {' · '}
            <Link href="/nitric" style={{ color: '#00ffcc', textDecoration: 'none' }}>
              Flow State X
            </Link>
            {' · '}
            <Link href="/about" style={{ color: '#00ffcc', textDecoration: 'none' }}>
              About
            </Link>
          </div>
          <div className="mb-3">
            <Link href="/terms" style={{ fontFamily: 'var(--font-space-mono), Space Mono, monospace', fontSize: '9px', color: '#444', textTransform: 'uppercase', textDecoration: 'none' }}>Terms</Link>
            {' · '}
            <Link href="/privacy" style={{ fontFamily: 'var(--font-space-mono), Space Mono, monospace', fontSize: '9px', color: '#444', textTransform: 'uppercase', textDecoration: 'none' }}>Privacy</Link>
          </div>
          <div className="flex justify-center gap-5 mt-2 mb-3">
            <a href="https://instagram.com/avierafit" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ color: '#444', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#00ffcc'} onMouseLeave={e => e.currentTarget.style.color = '#444'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="https://tiktok.com/@avierafit" target="_blank" rel="noopener noreferrer" aria-label="TikTok" style={{ color: '#444', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#00ffcc'} onMouseLeave={e => e.currentTarget.style.color = '#444'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.98a8.21 8.21 0 0 0 4.76 1.52V7.05a4.84 4.84 0 0 1-1-.36z"/></svg>
            </a>
          </div>
          <p>
            Manufactured for and Distributed by: AvieraFit
            <br />
            4437 Lister St, San Diego, CA 92110 USA
            <br />
            Questions?{' '}
            <a
              href="mailto:info@avierafit.com"
              style={{ color: '#00ffcc', textDecoration: 'none' }}
            >
              info@avierafit.com
            </a>
          </p>
          <p className="mt-3">© 2026 Aviera Fit. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
