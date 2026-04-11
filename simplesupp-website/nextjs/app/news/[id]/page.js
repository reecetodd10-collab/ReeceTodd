'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar } from 'lucide-react';
import PageLayout, { FadeInSection, CTAButton, TOKENS, FONTS } from '../../components/PageLayout';

export default function NewsletterDetailPage() {
  const params = useParams();
  const [newsletter, setNewsletter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!params.id) return;
    fetch('/api/newsletters')
      .then((r) => r.json())
      .then((data) => {
        const found = data.newsletters?.find((n) => n.id === params.id);
        if (found) setNewsletter(found);
        else setError('Newsletter not found');
      })
      .catch(() => setError('Failed to load newsletter'))
      .finally(() => setIsLoading(false));
  }, [params.id]);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <PageLayout>
      {/* Hero strip */}
      <section className="relative" style={{ background: '#000', paddingTop: '100px', paddingBottom: '32px', zIndex: 10 }}>
        <div className="max-w-[430px] md:max-w-3xl mx-auto px-5 md:px-8">
          <FadeInSection>
            <Link
              href="/news"
              className="inline-flex items-center gap-2 mb-6"
              style={{ ...FONTS.mono, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: TOKENS.CYAN, textDecoration: 'none' }}
            >
              <ArrowLeft size={14} />
              Back to News
            </Link>

            {!isLoading && newsletter && (
              <>
                <div className="flex items-center gap-2 mb-4" style={{ ...FONTS.mono, fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                  <Calendar size={14} style={{ color: TOKENS.CYAN }} />
                  <time dateTime={newsletter.published_date}>{formatDate(newsletter.published_date)}</time>
                </div>
                <h1
                  className="text-[28px] md:text-[44px] font-bold uppercase leading-tight"
                  style={{ ...FONTS.oswald, color: '#fff', marginBottom: '12px' }}
                >
                  {newsletter.title}
                </h1>
                {newsletter.excerpt && (
                  <p style={{ ...FONTS.mono, fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
                    {newsletter.excerpt}
                  </p>
                )}
              </>
            )}
          </FadeInSection>
        </div>
      </section>

      {/* Body */}
      <section style={{ background: '#F5F0EB', color: '#28282A' }}>
        <div className="max-w-[430px] md:max-w-3xl mx-auto px-5 md:px-8 py-12 md:py-16">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: TOKENS.CYAN, borderTopColor: 'transparent' }} />
            </div>
          ) : error ? (
            <FadeInSection>
              <div className="p-8 text-center" style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                <h2 style={{ ...FONTS.oswald, fontSize: '24px', fontWeight: 700, textTransform: 'uppercase', color: TOKENS.INK, marginBottom: '16px' }}>
                  {error}
                </h2>
                <CTAButton href="/news" variant="primary" size="md">
                  <ArrowLeft size={16} className="inline mr-2" />
                  Back to News
                </CTAButton>
              </div>
            </FadeInSection>
          ) : newsletter ? (
            <article>
              <FadeInSection>
                <div
                  className="p-6 md:p-10"
                  style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
                >
                  <div
                    className="newsletter-content prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: newsletter.content }}
                  />
                </div>
              </FadeInSection>

              <FadeInSection delay={0.15}>
                <div className="mt-10 text-center">
                  <CTAButton href="/news" variant="primary" size="lg">
                    All Articles
                  </CTAButton>
                </div>
              </FadeInSection>
            </article>
          ) : null}
        </div>
      </section>

      {/* Newsletter content styling — light theme */}
      <style jsx global>{`
        .newsletter-content h1,
        .newsletter-content h2,
        .newsletter-content h3 {
          font-family: var(--font-oswald), Oswald, sans-serif;
          font-weight: 700;
          text-transform: uppercase;
          color: #28282A;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .newsletter-content h1 { font-size: 1.5rem; }
        .newsletter-content h2 { font-size: 1.25rem; color: #00e5ff; }
        .newsletter-content h3 { font-size: 1.1rem; }
        .newsletter-content p {
          font-family: var(--font-space-mono), Space Mono, monospace;
          font-size: 12px;
          margin-bottom: 1rem;
          color: rgba(0,0,0,0.65);
          line-height: 1.8;
        }
        .newsletter-content a { color: #00e5ff; text-decoration: underline; }
        .newsletter-content a:hover { opacity: 0.7; }
        .newsletter-content ul, .newsletter-content ol { margin-left: 1.5rem; margin-bottom: 1rem; }
        .newsletter-content li {
          font-family: var(--font-space-mono), Space Mono, monospace;
          font-size: 12px;
          margin-bottom: 0.5rem;
          color: rgba(0,0,0,0.65);
          line-height: 1.7;
        }
        .newsletter-content strong { color: #28282A; font-weight: 700; }
        .newsletter-content blockquote {
          border-left: 3px solid #00e5ff;
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: rgba(0,0,0,0.5);
        }
        .newsletter-content img { max-width: 100%; height: auto; margin: 1.5rem 0; border-radius: 8px; }
        .newsletter-content code { background: rgba(0,229,255,0.08); padding: 0.2rem 0.4rem; font-size: 0.9em; color: #00e5ff; border-radius: 4px; }
        .newsletter-content pre { background: rgba(0,0,0,0.04); padding: 1rem; overflow-x: auto; margin: 1rem 0; border: 1px solid rgba(0,0,0,0.06); border-radius: 8px; }
        .newsletter-content pre code { background: none; padding: 0; }
      `}</style>
    </PageLayout>
  );
}
