'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import PageLayout, { FadeInSection, TOKENS, FONTS } from '../components/PageLayout';

const articles = [
  {
    slug: 'best-nitric-oxide-supplements',
    title: 'Best Nitric Oxide Supplements for Pumps and Performance',
    summary:
      'L-citrulline, L-arginine, and beetroot extract all boost nitric oxide — but they are not interchangeable. Learn which ingredients actually improve blood flow, what doses matter, and how to stack them for training.',
  },
  {
    slug: 'electrolytes-for-athletes',
    title: 'Electrolytes for Athletes: When and Why They Matter',
    summary:
      'Sweat costs you more than water. Sodium, potassium, and magnesium drive muscle contractions, nerve signaling, and hydration status. Here is when supplementing beats just drinking more water.',
  },
  {
    slug: 'creatine-guide',
    title: 'The Complete Creatine Guide for Strength Athletes',
    summary:
      'Creatine monohydrate is the most studied supplement in sports nutrition. This guide covers dosing, timing, loading protocols, myths, and how to combine creatine with your existing stack.',
  },
  {
    slug: 'best-magnesium-for-sleep',
    title: 'Best Magnesium for Sleep: Why Glycinate Wins',
    summary:
      'Not all magnesium is created equal. Glycinate crosses the blood-brain barrier more effectively than oxide or citrate, making it the top choice for sleep quality and overnight recovery.',
  },
  {
    slug: 'pre-workout-without-jitters',
    title: 'Pre-Workout Without Jitters: What to Look For',
    summary:
      'Jitters, crashes, and heart-racing anxiety are not signs of a good pre-workout. Learn which ingredients cause them, what clean alternatives exist, and how to dose caffeine without the downsides.',
  },
  {
    slug: 'personalized-supplements-worth-it',
    title: 'Are Personalized Supplements Worth It?',
    summary:
      'Generic multivitamins treat every body the same. Personalized approaches use your goals, training style, and lifestyle to build a stack that actually fits. Here is when that matters and when it does not.',
  },
  {
    slug: 'best-supplement-stack-for-muscle-building',
    title: 'Best Supplement Stack for Muscle Building',
    summary:
      'A muscle-building stack is not about buying everything on the shelf. Start with the foundation (creatine + protein), add a performance layer, then layer in recovery. This guide shows you how.',
  },
  {
    slug: 'how-to-choose-supplements-for-your-goals',
    title: 'How to Choose Supplements for Your Goals',
    summary:
      'Most people buy supplements backwards — picking products before defining goals. This guide flips that process and shows you how AI tools and quizzes can cut through the noise.',
  },
];

export default function LearnPage() {
  return (
    <PageLayout>
      {/* Hero */}
      <section
        className="relative"
        style={{
          background: '#000',
          paddingTop: '120px',
          paddingBottom: '64px',
          zIndex: 10,
        }}
      >
        <div className="max-w-[430px] md:max-w-5xl lg:max-w-6xl mx-auto px-5 md:px-8 text-center">
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            style={{
              ...FONTS.mono,
              fontSize: '10px',
              letterSpacing: '0.32em',
              color: TOKENS.CYAN,
              textTransform: 'uppercase',
              marginBottom: '14px',
            }}
          >
            Aviera Learn
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-[36px] md:text-[64px] lg:text-[80px]"
            style={{
              ...FONTS.oswald,
              fontWeight: 700,
              textTransform: 'uppercase',
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
              color: '#fff',
              marginBottom: '20px',
            }}
          >
            Supplement Guides{' '}
            <span style={{ color: TOKENS.CYAN }}>&amp; Training Tips</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.45 }}
            className="md:text-[14px]"
            style={{
              ...FONTS.mono,
              fontSize: '12px',
              color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.7,
              maxWidth: '560px',
              margin: '0 auto',
            }}
          >
            Evidence-based articles on performance nutrition, recovery, and
            building smarter supplement stacks. No bro-science. No filler.
          </motion.p>
        </div>
      </section>

      {/* Article Grid */}
      <section style={{ background: TOKENS.CREAM, color: TOKENS.INK }}>
        <div className="max-w-[430px] md:max-w-5xl lg:max-w-6xl mx-auto px-5 md:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {articles.map((article, i) => (
              <FadeInSection key={article.slug} delay={i * 0.06}>
                <Link
                  href={`/learn/${article.slug}`}
                  className="group block h-full"
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    className="h-full flex flex-col justify-between p-6 md:p-8 transition-all duration-300"
                    style={{
                      background: '#fff',
                      borderRadius: '14px',
                      border: '1px solid rgba(0,0,0,0.06)',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = TOKENS.CYAN_GLOW;
                      e.currentTarget.style.borderColor = 'rgba(0, 229, 255, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)';
                      e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)';
                    }}
                  >
                    <div>
                      <h2
                        className="text-[18px] md:text-[20px] mb-3 group-hover:text-[#00b8d4] transition-colors duration-300"
                        style={{
                          ...FONTS.oswald,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          lineHeight: 1.2,
                          color: TOKENS.INK,
                        }}
                      >
                        {article.title}
                      </h2>
                      <p
                        style={{
                          ...FONTS.mono,
                          fontSize: '12px',
                          lineHeight: 1.7,
                          color: 'rgba(40,40,42,0.7)',
                        }}
                      >
                        {article.summary}
                      </p>
                    </div>
                    <div
                      className="mt-5 flex items-center gap-2 group-hover:gap-3 transition-all duration-300"
                      style={{
                        ...FONTS.mono,
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        color: TOKENS.CYAN,
                      }}
                    >
                      Read Guide <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
