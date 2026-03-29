'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Calendar } from 'lucide-react';

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

          <div className="hidden md:flex items-center gap-5">
            {[
              { label: 'Shop', href: '/shop' },
              { label: 'Flow State X', href: '/nitric' },
              { label: 'Trybe', href: '/trybe' },
              { label: 'Optimize Quiz', href: '/supplement-optimization-score' },
              { label: 'Latest', href: '/news', active: true },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  color: link.active ? '#00ffcc' : '#666',
                  textDecoration: 'none',
                  letterSpacing: '0.05em',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => (e.target.style.color = '#00ffcc')}
                onMouseLeave={(e) => (e.target.style.color = link.active ? '#00ffcc' : '#666')}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            className="md:hidden flex flex-col gap-[5px] bg-transparent border-none cursor-pointer p-1"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <span className="block w-5 h-[2px] bg-white" />
            <span className="block w-5 h-[2px] bg-white" />
            <span className="block w-5 h-[2px] bg-white" />
          </button>
        </div>
      </nav>

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
              { label: 'Optimize Quiz', href: '/supplement-optimization-score' },
              { label: 'Latest', href: '/news' },
              { label: 'About', href: '/about' },
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

export default function NewsletterDetailPage() {
  const params = useParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [newsletter, setNewsletter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewsletter = async () => {
      try {
        const response = await fetch('/api/newsletters');
        const data = await response.json();

        if (data.newsletters) {
          const found = data.newsletters.find(n => n.id === params.id);
          if (found) {
            setNewsletter(found);
          } else {
            setError('Newsletter not found');
          }
        }
      } catch (err) {
        console.error('Error fetching newsletter:', err);
        setError('Failed to load newsletter');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchNewsletter();
    }
  }, [params.id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen relative" style={{ background: '#000000', color: '#ffffff', overflowX: 'hidden' }}>
      {/* Scan line background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(255,255,255,0.03) 59px, rgba(255,255,255,0.03) 60px)',
        }}
      />

      <StickyNav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="relative z-10 pt-20 pb-16 px-6">
        <div className="max-w-[430px] mx-auto">
          {/* Back link */}
          <FadeInSection>
            <Link
              href="/news"
              className="inline-flex items-center gap-2 mb-8"
              style={{
                fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: '#00ffcc',
                textDecoration: 'none',
                transition: 'opacity 0.15s',
              }}
            >
              <ArrowLeft size={14} />
              Back to News
            </Link>
          </FadeInSection>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div
                className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: '#00ffcc', borderTopColor: 'transparent' }}
              />
            </div>
          ) : error ? (
            <FadeInSection>
              <div
                className="p-8 text-center"
                style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <h2
                  className="font-bold uppercase mb-4"
                  style={{
                    fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                    fontSize: '24px',
                    color: '#ffffff',
                  }}
                >
                  {error}
                </h2>
                <Link
                  href="/news"
                  className="inline-flex items-center gap-2 px-6 py-3 font-bold uppercase"
                  style={{
                    fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                    fontSize: '14px',
                    letterSpacing: '0.15em',
                    background: '#00ffcc',
                    color: '#000000',
                    textDecoration: 'none',
                  }}
                >
                  <ArrowLeft size={16} />
                  Back to News
                </Link>
              </div>
            </FadeInSection>
          ) : newsletter ? (
            <article>
              {/* Article header */}
              <FadeInSection>
                <header className="mb-8">
                  <div
                    className="flex items-center gap-2 mb-4"
                    style={{
                      fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                      fontSize: '11px',
                      color: '#666',
                    }}
                  >
                    <Calendar size={14} style={{ color: '#00ffcc' }} />
                    <time dateTime={newsletter.published_date}>
                      {formatDate(newsletter.published_date)}
                    </time>
                  </div>
                  <h1
                    className="font-bold uppercase leading-tight mb-4"
                    style={{
                      fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                      fontSize: '36px',
                      color: '#ffffff',
                    }}
                  >
                    {newsletter.title}
                  </h1>
                  {newsletter.excerpt && (
                    <p
                      className="leading-relaxed"
                      style={{
                        fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                        fontSize: '12px',
                        color: '#999',
                        lineHeight: 1.7,
                      }}
                    >
                      {newsletter.excerpt}
                    </p>
                  )}
                </header>
              </FadeInSection>

              {/* Article content */}
              <FadeInSection delay={0.15}>
                <div
                  className="p-6"
                  style={{
                    background: '#0a0a0a',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <div
                    className="newsletter-content prose prose-lg max-w-none"
                    style={{
                      color: '#cccccc',
                      lineHeight: '1.8',
                    }}
                    dangerouslySetInnerHTML={{ __html: newsletter.content }}
                  />
                </div>
              </FadeInSection>

              {/* Bottom nav */}
              <FadeInSection delay={0.2}>
                <div className="mt-10 text-center">
                  <Link
                    href="/news"
                    className="inline-flex items-center gap-2 px-8 py-4 font-bold uppercase"
                    style={{
                      fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                      fontSize: '14px',
                      letterSpacing: '0.15em',
                      background: '#00ffcc',
                      color: '#000000',
                      textDecoration: 'none',
                      clipPath: 'polygon(0 0, 100% 0, 96% 100%, 4% 100%)',
                    }}
                  >
                    <ArrowLeft size={16} />
                    All Articles
                  </Link>
                </div>
              </FadeInSection>
            </article>
          ) : null}
        </div>
      </div>

      {/* ─── Footer ─── */}
      <footer className="relative z-10 py-12 px-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-[430px] mx-auto text-center">
          <p
            className="mb-4"
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
          </p>
          <p
            className="mb-2"
            style={{
              fontFamily: 'var(--font-space-mono), Space Mono, monospace',
              fontSize: '9px',
              color: '#444',
              lineHeight: 1.6,
            }}
          >
            Manufactured in the USA in a GMP-certified facility.
          </p>
          <p
            className="mb-4"
            style={{
              fontFamily: 'var(--font-space-mono), Space Mono, monospace',
              fontSize: '9px',
              color: '#333',
              lineHeight: 1.6,
            }}
          >
            *These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease.
          </p>
          <p
            style={{
              fontFamily: 'var(--font-space-mono), Space Mono, monospace',
              fontSize: '9px',
              color: '#333',
            }}
          >
            &copy; {new Date().getFullYear()} Aviera. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Newsletter Content Styling — dark theme */}
      <style jsx global>{`
        .newsletter-content h1,
        .newsletter-content h2,
        .newsletter-content h3 {
          font-family: var(--font-oswald), Oswald, sans-serif;
          font-weight: 700;
          text-transform: uppercase;
          color: #ffffff;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }

        .newsletter-content h1 {
          font-size: 1.75rem;
        }

        .newsletter-content h2 {
          font-size: 1.35rem;
          color: #00ffcc;
        }

        .newsletter-content h3 {
          font-size: 1.1rem;
        }

        .newsletter-content p {
          font-family: var(--font-space-mono), Space Mono, monospace;
          font-size: 12px;
          margin-bottom: 1rem;
          color: #999;
          line-height: 1.7;
        }

        .newsletter-content a {
          color: #00ffcc;
          text-decoration: underline;
          transition: opacity 0.2s;
        }

        .newsletter-content a:hover {
          opacity: 0.7;
        }

        .newsletter-content ul,
        .newsletter-content ol {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }

        .newsletter-content li {
          font-family: var(--font-space-mono), Space Mono, monospace;
          font-size: 12px;
          margin-bottom: 0.5rem;
          color: #999;
          line-height: 1.7;
        }

        .newsletter-content strong {
          color: #ffffff;
          font-weight: 600;
        }

        .newsletter-content blockquote {
          border-left: 3px solid #00ffcc;
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #666;
        }

        .newsletter-content img {
          max-width: 100%;
          height: auto;
          margin: 1.5rem 0;
        }

        .newsletter-content code {
          background: rgba(255,255,255,0.06);
          padding: 0.2rem 0.4rem;
          font-size: 0.9em;
          color: #00ffcc;
        }

        .newsletter-content pre {
          background: rgba(255,255,255,0.04);
          padding: 1rem;
          overflow-x: auto;
          margin: 1rem 0;
          border: 1px solid rgba(255,255,255,0.06);
        }

        .newsletter-content pre code {
          background: none;
          padding: 0;
        }
      `}</style>
    </div>
  );
}
