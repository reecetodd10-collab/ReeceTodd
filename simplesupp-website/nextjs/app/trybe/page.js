'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { fetchProductById } from '../lib/shopify';
import PageLayout, { SectionBlock, MissionBlock, FadeInSection, CTAButton, TOKENS, FONTS } from '../components/PageLayout';

// ─── Data ───
const howItWorksSteps = [
  { num: '01', title: 'Apply', desc: 'Hit the apply button. Fill out your info, connect your socials. Takes 2 minutes. We review every application personally.' },
  { num: '02', title: 'Get Free Product', desc: "Once approved, we ship you Flow State X on us. Try it yourself first — you can't sell what you don't believe in." },
  { num: '03', title: 'Create & Post', desc: "Make content your way. Gym clips, unboxings, day-in-my-life. Instagram Reels and TikTok are where it hits hardest." },
  { num: '04', title: 'Earn 15% Per Sale', desc: 'Share your unique creator link. Every sale tracked, every commission paid. Real money for real content.' },
];

const perks = [
  { icon: '💰', title: '15% Commission', desc: 'Every sale through your link earns you 15%. No minimums, no limits.' },
  { icon: '📦', title: 'Free Product', desc: "We send you Flow State X for free. Try it, film it, post it." },
  { icon: '🔗', title: 'Tracked Link', desc: 'Unique affiliate link with full attribution tracking. See clicks, conversions, earnings.' },
  { icon: '⚡', title: 'Fast Approval', desc: "No follower minimums. If you're making fitness content and bring real energy, you're in." },
  { icon: '🤝', title: 'Part of the Brand', desc: "Join the Aviera crew. Early creators get first access to new products and bigger opportunities." },
];

const lookingFor = [
  'You post gym / fitness / lifting content regularly',
  "You're active on Instagram Reels or TikTok",
  'You actually care about what you put in your body',
  'You can create authentic content — not scripted ads',
  'You want to build with a brand, not just promote one',
  'Any follower count — quality over numbers',
];

const contentIdeas = [
  { num: '01', title: 'Workout Clips', desc: 'Film your set. Show the pump. Tag us. Simple, real, effective.' },
  { num: '02', title: 'Unboxing', desc: "Open the package on camera. Show the bottle. Follow up with a review." },
  { num: '03', title: 'Day in My Life', desc: 'Natural product placement. The less it feels like an ad, the better.' },
  { num: '04', title: 'Before / During / After', desc: 'Show the progression. Take it → train → show the pump.' },
];

const faqItems = [
  { q: 'Do I need a minimum follower count?', a: 'No. We care about content quality and energy, not vanity metrics.' },
  { q: 'How do I get paid?', a: 'Commissions tracked and paid out automatically. Every sale through your link is attributed to you.' },
  { q: 'Is the product actually free?', a: 'Yes. Once approved, we ship you Flow State X at no cost.' },
  { q: 'What kind of content?', a: "Authentic gym content. Workout clips, unboxings, day-in-my-life. No scripts, no templates." },
  { q: 'How fast is approval?', a: "Most applications reviewed within 24-48 hours." },
  { q: 'Other platforms?', a: "Instagram Reels and TikTok are priority, but your link works anywhere." },
];

const APPLY_URL = 'https://jointrybe.com/auth/program-invite/cmmaxfasw000rp70snvb3l75z';

export default function CreatorsProgramPage() {
  const [productImage, setProductImage] = useState(null);
  const SHOPIFY_PRODUCT_ID = '8645601657022';

  useEffect(() => {
    fetchProductById(SHOPIFY_PRODUCT_ID)
      .then((p) => {
        const img = p?.images?.[0] || p?.image || null;
        if (img) setProductImage(img);
      })
      .catch(console.error);
  }, []);

  return (
    <PageLayout>
      {/* ═══ HERO with background image ═══ */}
      <section className="relative overflow-hidden" style={{ minHeight: '50vh', zIndex: 10 }}>
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/creators-background.jpg"
            alt=""
            className="w-full h-full object-cover"
            style={{ filter: 'grayscale(15%) contrast(1.06)' }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,1) 100%)',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 30% 70%, rgba(0,229,255,0.08) 0%, transparent 50%)',
            }}
          />
        </div>

        <div className="relative max-w-[430px] md:max-w-5xl lg:max-w-6xl mx-auto px-5 md:px-8" style={{ paddingTop: '140px', paddingBottom: '60px' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 mb-6"
              >
                <span style={{ ...FONTS.mono, fontSize: '10px', letterSpacing: '0.3em', color: '#FF3B3B', textTransform: 'uppercase', textShadow: '0 0 12px rgba(255,59,59,0.5), 0 2px 8px rgba(0,0,0,0.8)' }}>
                  Now Recruiting
                </span>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FF3B3B', display: 'inline-block', boxShadow: '0 0 8px rgba(255,59,59,0.5)' }} />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="text-[48px] md:text-[72px] lg:text-[96px]"
                style={{ ...FONTS.oswald, fontWeight: 700, textTransform: 'uppercase', lineHeight: 0.92, letterSpacing: '-0.02em', color: '#fff', marginBottom: '20px', textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}
              >
                Creators <span style={{ color: TOKENS.CYAN }}>Program</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="md:text-[14px] max-w-md"
                style={{ ...FONTS.mono, fontSize: '12px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: '28px', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}
              >
                We&apos;re building a crew of fitness creators who rep <span style={{ color: TOKENS.CYAN, fontWeight: 700 }}>Aviera</span>. Free product, your own link, and <span style={{ color: TOKENS.CYAN, fontWeight: 700 }}>15% commission</span> on every sale. No follower minimum.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <a href={APPLY_URL} target="_blank" rel="noopener noreferrer" className="no-underline">
                  <CTAButton variant="primary" size="lg">Apply Now</CTAButton>
                </a>
              </motion.div>
            </div>
            {/* Commission callout */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="hidden md:flex flex-col items-center justify-center text-center p-10"
              style={{ background: 'rgba(0,229,255,0.08)', borderRadius: '20px', border: '1px solid rgba(0,229,255,0.2)', backdropFilter: 'blur(8px)' }}
            >
              <div style={{ ...FONTS.oswald, fontSize: '96px', fontWeight: 700, color: TOKENS.CYAN, lineHeight: 1, textShadow: '0 0 30px rgba(0,229,255,0.4)' }}>15%</div>
              <div style={{ ...FONTS.mono, fontSize: '11px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.2em', marginTop: '8px' }}>Commission Per Sale</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <SectionBlock variant="cream" eyebrow="The Process" title="How it" titleAccent="works.">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {howItWorksSteps.map((s, i) => (
            <FadeInSection key={s.num} delay={i * 0.08}>
              <div
                className="p-5 h-full rounded-r-lg transition-all duration-300 hover:translate-x-1"
                style={{ background: '#fff', borderLeft: `3px solid ${TOKENS.CYAN}`, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
              >
                <span style={{ ...FONTS.oswald, fontSize: '28px', fontWeight: 700, color: TOKENS.CYAN, opacity: 0.65, lineHeight: 1 }}>{s.num}</span>
                <h3 className="mt-2 mb-2" style={{ ...FONTS.oswald, fontSize: '16px', fontWeight: 700, textTransform: 'uppercase', color: TOKENS.INK }}>{s.title}</h3>
                <p style={{ ...FONTS.mono, fontSize: '11px', color: 'rgba(0,0,0,0.6)', lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </SectionBlock>

      {/* ═══ PERKS ═══ */}
      <SectionBlock variant="cyan-tint" eyebrow="What You Get" title="Creator" titleAccent="perks.">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {perks.map((p, i) => (
            <FadeInSection key={p.title} delay={i * 0.06}>
              <div
                className="p-5 h-full transition-all duration-300 hover:-translate-y-1"
                style={{ background: '#fff', borderRadius: '10px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
              >
                <div className="text-2xl mb-3">{p.icon}</div>
                <h3 style={{ ...FONTS.oswald, fontSize: '16px', fontWeight: 700, textTransform: 'uppercase', color: TOKENS.INK, marginBottom: '6px' }}>{p.title}</h3>
                <p style={{ ...FONTS.mono, fontSize: '11px', color: 'rgba(0,0,0,0.6)', lineHeight: 1.65 }}>{p.desc}</p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </SectionBlock>

      {/* ═══ WHO WE'RE LOOKING FOR ═══ */}
      <SectionBlock variant="cream" eyebrow="Ideal Fit" title="Who we're" titleAccent="looking for.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {lookingFor.map((item, i) => (
            <FadeInSection key={i} delay={i * 0.06}>
              <div className="flex items-center gap-3 p-4" style={{ background: '#fff', borderRadius: '10px', boxShadow: '0 1px 6px rgba(0,0,0,0.03)' }}>
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: `rgba(0,229,255,0.12)`, color: TOKENS.CYAN }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <span style={{ ...FONTS.mono, fontSize: '12px', color: TOKENS.INK }}>{item}</span>
              </div>
            </FadeInSection>
          ))}
        </div>
      </SectionBlock>

      {/* ═══ CONTENT IDEAS ═══ */}
      <SectionBlock variant="cyan-tint" eyebrow="Inspiration" title="Content that" titleAccent="works.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {contentIdeas.map((c, i) => (
            <FadeInSection key={c.num} delay={i * 0.08}>
              <div
                className="flex gap-4 p-4 md:p-5 rounded-r-lg transition-all duration-300 hover:translate-x-1"
                style={{ background: '#fff', borderLeft: `3px solid ${TOKENS.CYAN}`, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
              >
                <span style={{ ...FONTS.oswald, fontSize: '24px', fontWeight: 700, color: TOKENS.CYAN, opacity: 0.65, lineHeight: 1 }}>{c.num}</span>
                <div>
                  <h3 style={{ ...FONTS.oswald, fontSize: '16px', fontWeight: 700, textTransform: 'uppercase', color: TOKENS.INK, marginBottom: '4px' }}>{c.title}</h3>
                  <p style={{ ...FONTS.mono, fontSize: '11px', color: 'rgba(0,0,0,0.6)', lineHeight: 1.65 }}>{c.desc}</p>
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </SectionBlock>

      {/* ═══ PRODUCT SPOTLIGHT ═══ */}
      <SectionBlock variant="cream" eyebrow="Featured Product" title="Flow State" titleAccent="X.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-center">
          <FadeInSection>
            {productImage ? (
              <div className="relative mx-auto" style={{ maxWidth: '260px' }}>
                <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 60%, rgba(0,229,255,0.14) 0%, transparent 65%)` }} />
                <img src={productImage} alt="Flow State X" className="w-full h-auto object-contain" style={{ filter: `drop-shadow(0 14px 28px rgba(0,229,255,0.2))` }} />
              </div>
            ) : (
              <div className="w-full aspect-square flex items-center justify-center" style={{ background: '#fff', borderRadius: '12px' }}>
                <span className="text-5xl">💊</span>
              </div>
            )}
          </FadeInSection>
          <FadeInSection delay={0.15}>
            <p style={{ ...FONTS.mono, fontSize: '12px', color: 'rgba(0,0,0,0.6)', lineHeight: 1.75, marginBottom: '20px' }}>
              This is the product you&apos;ll be repping. <strong style={{ color: TOKENS.INK }}>Flow State X</strong> — clinical-dose nitric oxide for skin-splitting pumps. No caffeine, no crash. Your audience will feel the difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <CTAButton href="/nitric" variant="secondary" size="md">View Product</CTAButton>
            </div>
          </FadeInSection>
        </div>
      </SectionBlock>

      {/* ═══ FAQ ═══ */}
      <SectionBlock variant="cyan-tint" eyebrow="Common Questions" title="FAQ.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {faqItems.map((f, i) => (
            <FadeInSection key={i} delay={i * 0.06}>
              <div className="p-5 h-full" style={{ background: '#fff', borderRadius: '10px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                <h4 style={{ ...FONTS.oswald, fontSize: '15px', fontWeight: 700, textTransform: 'uppercase', color: TOKENS.INK, marginBottom: '6px' }}>{f.q}</h4>
                <p style={{ ...FONTS.mono, fontSize: '11px', color: 'rgba(0,0,0,0.6)', lineHeight: 1.65 }}>{f.a}</p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </SectionBlock>

      {/* ═══ BOTTOM CTA ═══ */}
      <SectionBlock variant="cream" align="center" narrow>
        <FadeInSection>
          <h2
            className="text-[32px] md:text-[48px] lg:text-[60px]"
            style={{ ...FONTS.oswald, fontWeight: 700, textTransform: 'uppercase', lineHeight: 0.95, color: TOKENS.INK, marginBottom: '14px' }}
          >
            Ready to <span style={{ color: TOKENS.CYAN }}>create?</span>
          </h2>
          <p style={{ ...FONTS.mono, fontSize: '12px', color: 'rgba(0,0,0,0.6)', lineHeight: 1.7, maxWidth: '440px', margin: '0 auto 28px' }}>
            Apply now. Get approved. Start earning. No follower minimums.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={APPLY_URL} target="_blank" rel="noopener noreferrer" className="no-underline">
              <CTAButton variant="primary" size="lg">Apply to Creators Program</CTAButton>
            </a>
          </div>
        </FadeInSection>
      </SectionBlock>
    </PageLayout>
  );
}
