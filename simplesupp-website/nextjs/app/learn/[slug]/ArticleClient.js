'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import PageLayout, { FadeInSection, TOKENS, FONTS } from '../../components/PageLayout';

/**
 * Converts markdown-style links [text](url) inside article content
 * into React elements.
 */
function renderContent(text) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (match) {
      return (
        <Link
          key={i}
          href={match[2]}
          style={{ color: TOKENS.CYAN, textDecoration: 'underline', textUnderlineOffset: '3px' }}
        >
          {match[1]}
        </Link>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

export default function ArticleClient({ article, slug }) {
  return (
    <PageLayout>
      {/* Hero */}
      <section
        className="relative"
        style={{
          background: '#000',
          paddingTop: '100px',
          paddingBottom: '48px',
          zIndex: 10,
        }}
      >
        <div className="max-w-[430px] md:max-w-3xl mx-auto px-5 md:px-8">
          <FadeInSection>
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 mb-8"
              style={{
                ...FONTS.mono,
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: TOKENS.CYAN,
                textDecoration: 'none',
              }}
            >
              <ArrowLeft size={14} />
              Back to Learn
            </Link>

            <p
              style={{
                ...FONTS.mono,
                fontSize: '10px',
                letterSpacing: '0.32em',
                color: TOKENS.CYAN,
                textTransform: 'uppercase',
                marginBottom: '14px',
              }}
            >
              Supplement Guide
            </p>

            <h1
              className="text-[28px] md:text-[44px] lg:text-[56px]"
              style={{
                ...FONTS.oswald,
                fontWeight: 700,
                textTransform: 'uppercase',
                lineHeight: 1,
                letterSpacing: '-0.02em',
                color: '#fff',
                marginBottom: '16px',
              }}
            >
              {article.title}
            </h1>

            <p
              style={{
                ...FONTS.mono,
                fontSize: '12px',
                color: 'rgba(255,255,255,0.5)',
                lineHeight: 1.7,
              }}
            >
              {article.description}
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* Article Body */}
      <section style={{ background: TOKENS.CREAM, color: TOKENS.INK }}>
        <div className="max-w-[430px] md:max-w-3xl mx-auto px-5 md:px-8 py-12 md:py-20">
          {article.sections.map((section, i) => (
            <FadeInSection key={i} delay={i * 0.04}>
              <div className="mb-12 md:mb-16">
                <h2
                  className="text-[22px] md:text-[28px] mb-4 md:mb-6"
                  style={{
                    ...FONTS.oswald,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    lineHeight: 1.15,
                    color: TOKENS.INK,
                  }}
                >
                  {section.heading}
                </h2>

                {section.content.split('\n\n').map((paragraph, j) => (
                  <p
                    key={j}
                    className="mb-4 md:mb-5"
                    style={{
                      ...FONTS.body,
                      fontSize: '15px',
                      lineHeight: 1.8,
                      color: 'rgba(40, 40, 42, 0.85)',
                    }}
                  >
                    {renderContent(paragraph)}
                  </p>
                ))}
              </div>
            </FadeInSection>
          ))}

          {/* Related Products */}
          <FadeInSection>
            <div
              className="mt-8 md:mt-12 p-6 md:p-10"
              style={{
                background: '#fff',
                borderRadius: '14px',
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
              }}
            >
              <h3
                className="text-[18px] md:text-[22px] mb-6"
                style={{
                  ...FONTS.oswald,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: TOKENS.INK,
                }}
              >
                Related Products
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {article.relatedProducts.map((product) => (
                  <Link
                    key={product.href}
                    href={product.href}
                    className="group block p-5 transition-all duration-300"
                    style={{
                      background: TOKENS.CYAN_TINT,
                      borderRadius: '10px',
                      border: '1px solid rgba(0, 229, 255, 0.15)',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0, 229, 255, 0.4)';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 229, 255, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0, 229, 255, 0.15)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <h4
                      className="text-[14px] mb-2 group-hover:text-[#00b8d4] transition-colors"
                      style={{
                        ...FONTS.oswald,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: TOKENS.INK,
                      }}
                    >
                      {product.name}
                    </h4>
                    <p
                      style={{
                        ...FONTS.mono,
                        fontSize: '11px',
                        color: 'rgba(40,40,42,0.6)',
                        lineHeight: 1.6,
                      }}
                    >
                      {product.description}
                    </p>
                    <div
                      className="mt-3 flex items-center gap-1 group-hover:gap-2 transition-all duration-300"
                      style={{
                        ...FONTS.mono,
                        fontSize: '10px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        color: TOKENS.CYAN,
                      }}
                    >
                      View Product <ArrowRight size={12} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </FadeInSection>

          {/* Back to Learn */}
          <FadeInSection>
            <div className="mt-10 text-center">
              <Link
                href="/learn"
                className="inline-flex items-center gap-2 transition-all duration-300 hover:gap-3"
                style={{
                  ...FONTS.mono,
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  color: TOKENS.CYAN,
                  textDecoration: 'none',
                }}
              >
                <ArrowLeft size={14} />
                Back to All Guides
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>
    </PageLayout>
  );
}
