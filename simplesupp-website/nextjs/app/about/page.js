'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import PageLayout, {
  SectionBlock,
  MissionBlock,
  CTAButton,
  FadeInSection,
  TOKENS,
  FONTS,
} from '../components/PageLayout';

const values = [
  { num: '01', title: 'Health is Wealth',         desc: 'A healthy body is the foundation for a happy, successful life. Everything else builds on top of this.' },
  { num: '02', title: 'Accessibility',            desc: 'Everyone deserves access to a healthy lifestyle, regardless of where they start or what they know.' },
  { num: '03', title: 'Progress Over Perfection', desc: 'Go at your own pace. Your journey, your style. Small steps compound into massive results.' },
  { num: '04', title: 'Personalization',          desc: 'One size fits all does not work. Your plan should be as unique as your goals, body, and lifestyle.' },
];

const timeline = [
  { year: '2024', title: 'The Problem',    desc: 'Hundreds of supplement brands. Conflicting advice. Aggressive marketing. No way to know what actually works for you.' },
  { year: '2025', title: 'The Idea',       desc: 'What if AI could cut through the noise? Analyze your goals, body, and lifestyle — then recommend the exact stack you need.' },
  { year: '2026', title: 'Aviera Launches', desc: 'Clean formulas. Transparent labels. AI-powered personalization. No guessing. No proprietary blends. Just results.' },
];

export default function AboutPage() {
  return (
    <PageLayout>
      {/* HERO with background image */}
      <section className="relative overflow-hidden" style={{ minHeight: '50vh', zIndex: 10 }}>
        <div className="absolute inset-0">
          <img
            src="/about-background.jpg"
            alt=""
            className="w-full h-full object-cover"
            style={{ filter: 'grayscale(20%) contrast(1.06)' }}
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

        <div className="relative max-w-[430px] md:max-w-5xl lg:max-w-6xl mx-auto px-5 md:px-8 text-center flex flex-col justify-end" style={{ paddingTop: '140px', paddingBottom: '72px', minHeight: '50vh' }}>
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            style={{
              ...FONTS.mono,
              fontSize: '11px',
              letterSpacing: '0.32em',
              color: TOKENS.CYAN,
              textTransform: 'uppercase',
              marginBottom: '14px',
              textShadow: '0 0 20px rgba(0,229,255,0.6), 0 2px 8px rgba(0,0,0,0.8)',
            }}
          >
            Our Story
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="text-[44px] md:text-[80px] lg:text-[104px]"
            style={{
              ...FONTS.oswald,
              fontWeight: 700,
              textTransform: 'uppercase',
              lineHeight: 0.92,
              letterSpacing: '-0.02em',
              color: '#fff',
              marginBottom: '20px',
              textShadow: '0 2px 12px rgba(0,0,0,0.6)',
            }}
          >
            Built for you.<br />
            Not the <span style={{ color: TOKENS.CYAN }}>industry.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.45 }}
            className="md:text-[14px]"
            style={{
              ...FONTS.mono,
              fontSize: '12px',
              color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.7,
              maxWidth: '520px',
              margin: '0 auto',
              textShadow: '0 2px 8px rgba(0,0,0,0.6)',
            }}
          >
            We believe everyone deserves access to a healthy lifestyle.{' '}
            <span style={{ color: TOKENS.CYAN, fontWeight: 700 }}>Health is wealth.</span>{' '}
            The foundation everything else is built on. Aviera exists to help you build that foundation and discover your best self.
          </motion.p>
        </div>
      </section>

      {/* MISSION */}
      <MissionBlock
        eyebrow="Our Mission"
        body="Stop guessing which supplements actually help you. Whether you're building muscle, cutting fat, or optimizing health — Aviera's AI creates your perfect stack instantly."
        accent="The confusion ends here."
        variant="cream"
      />

      {/* FOUNDER */}
      <SectionBlock variant="cyan-tint" eyebrow="The Founder · Est. 2024">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <FadeInSection y={40}>
            <div
              className="relative w-full overflow-hidden"
              style={{
                aspectRatio: '4 / 5',
                borderRadius: '12px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
              }}
            >
              <Image
                src="/images/about/founder-photo.jpeg"
                alt="Reece Todd, Founder of Aviera"
                fill
                className="object-cover"
                priority
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 45%, transparent 65%)',
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
                <div
                  style={{
                    ...FONTS.oswald,
                    fontSize: '32px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#fff',
                    lineHeight: 1,
                    letterSpacing: '-0.01em',
                  }}
                  className="md:text-[44px]"
                >
                  Reece Todd
                </div>
                <div
                  style={{
                    ...FONTS.mono,
                    fontSize: '10px',
                    color: TOKENS.CYAN,
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    marginTop: '6px',
                  }}
                >
                  Founder & CEO
                </div>
              </div>
            </div>
          </FadeInSection>

          <FadeInSection delay={0.15}>
            <div style={{ ...FONTS.mono, fontSize: '12px', color: 'rgba(0,0,0,0.7)', lineHeight: 1.75 }} className="md:text-[13px] space-y-4">
              <p>
                I&apos;m <strong style={{ color: TOKENS.INK, fontWeight: 700 }}>Reece Todd</strong>, a passionate fitness enthusiast who learned firsthand how powerful the right supplements can be when they&apos;re simple, consistent, and matched to your goals.
              </p>
              <p>
                I built <strong style={{ color: TOKENS.CYAN, fontWeight: 700 }}>Aviera</strong> to help you stop guessing which supplements actually work. Whether you&apos;re building muscle, cutting fat, or optimizing health — Aviera&apos;s AI creates your perfect starting stack instantly.
              </p>
              <div
                style={{
                  borderLeft: `3px solid ${TOKENS.CYAN}`,
                  paddingLeft: '16px',
                  fontStyle: 'italic',
                  color: 'rgba(0,0,0,0.55)',
                  marginTop: '18px',
                }}
              >
                The supplement industry is overwhelming. Hundreds of products, conflicting advice, and aggressive marketing make it nearly impossible to know where to start.{' '}
                <strong style={{ color: TOKENS.INK }}>That confusion ends here.</strong>
              </div>
            </div>
          </FadeInSection>
        </div>
      </SectionBlock>

      {/* TIMELINE */}
      <SectionBlock variant="cream" eyebrow="The Journey" title="How we" titleAccent="got here.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
          {timeline.map((t, i) => (
            <FadeInSection key={t.year} delay={i * 0.1} y={32}>
              <div
                className="p-6 md:p-7 h-full"
                style={{
                  background: '#ffffff',
                  borderRadius: '10px',
                  borderLeft: `3px solid ${TOKENS.CYAN}`,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ ...FONTS.oswald, fontSize: '40px', fontWeight: 700, color: TOKENS.CYAN, lineHeight: 1, marginBottom: '10px' }}>
                  {t.year}
                </div>
                <h3 style={{ ...FONTS.oswald, fontSize: '18px', fontWeight: 700, textTransform: 'uppercase', color: TOKENS.INK, marginBottom: '8px' }}>
                  {t.title}
                </h3>
                <p style={{ ...FONTS.mono, fontSize: '11px', color: 'rgba(0,0,0,0.6)', lineHeight: 1.7 }}>
                  {t.desc}
                </p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </SectionBlock>

      {/* VALUES */}
      <SectionBlock variant="cyan-tint" eyebrow="What We Stand For" title="Our" titleAccent="values.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
          {values.map((v, i) => (
            <FadeInSection key={v.num} delay={i * 0.08}>
              <div
                className="flex gap-4 p-4 md:p-5 rounded-r-lg transition-all duration-300 hover:translate-x-1"
                style={{
                  background: '#ffffff',
                  borderLeft: `3px solid ${TOKENS.CYAN}`,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                }}
              >
                <span className="text-2xl md:text-3xl font-bold shrink-0" style={{ ...FONTS.oswald, color: TOKENS.CYAN, opacity: 0.65, lineHeight: 1 }}>
                  {v.num}
                </span>
                <div>
                  <h3 className="text-base md:text-lg font-bold uppercase mb-1 tracking-wide" style={{ ...FONTS.oswald, color: TOKENS.INK }}>
                    {v.title}
                  </h3>
                  <p style={{ ...FONTS.mono, fontSize: '11px', color: 'rgba(0,0,0,0.6)', lineHeight: 1.65 }}>
                    {v.desc}
                  </p>
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </SectionBlock>

      {/* CTA */}
      <SectionBlock variant="cream" align="center" narrow>
        <FadeInSection>
          {/* Entity paragraph — GEO/AI visibility */}
          <p style={{ ...FONTS.mono, fontSize: '11px', color: 'rgba(0,0,0,0.45)', lineHeight: 1.8, maxWidth: '600px', margin: '0 auto 40px', textAlign: 'center' }}>
            Aviera Fit is a San Diego-based supplement brand focused on personalized performance nutrition. The company sells premium supplements for nitric oxide support, pre-workout energy, hydration, creatine, sleep, and recovery, and uses a guided quiz experience to help athletes and active adults build a stack matched to their goals.
          </p>

          <h2
            className="text-[32px] md:text-[48px] lg:text-[60px]"
            style={{
              ...FONTS.oswald,
              fontWeight: 700,
              textTransform: 'uppercase',
              lineHeight: 0.95,
              letterSpacing: '-0.01em',
              color: TOKENS.INK,
              marginBottom: '18px',
            }}
          >
            Ready to <span style={{ color: TOKENS.CYAN }}>start?</span>
          </h2>
          <p style={{ ...FONTS.mono, fontSize: '12px', color: 'rgba(0,0,0,0.6)', lineHeight: 1.7, maxWidth: '440px', margin: '0 auto 32px' }}>
            Two minutes of input. A lifetime of clarity. Stop guessing.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <CTAButton href="/supplement-optimization-score" variant="primary" size="lg">
              Take the Quiz
            </CTAButton>
            <CTAButton href="/shop" variant="secondary" size="md">
              Shop the Lineup
            </CTAButton>
          </div>
        </FadeInSection>
      </SectionBlock>
    </PageLayout>
  );
}
