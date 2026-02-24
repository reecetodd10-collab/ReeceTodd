'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import PillLogo from '../../components/PillLogo';

export default function NewsletterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [newsletter, setNewsletter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch for animated elements
  useEffect(() => {
    setIsMounted(true);
  }, []);

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
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #ffffff, #f5f5f5)',
      }}
    >
      {/* Animated lines removed for performance */}
      {/* Header */}
      <header
        className="relative z-20 px-4 sm:px-6 lg:px-8 py-6"
        style={{
          background: '#ffffff',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <Link href="/home" className="inline-flex items-center gap-3">
            <div className="[&_h1]:hidden">
              <PillLogo size="small" />
            </div>
            <span
              className="text-2xl font-bold"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                color: '#1a1a1a'
              }}
            >
              AVIERA
            </span>
          </Link>
        </div>
      </header>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            href="/news"
            className="inline-flex items-center gap-2 mb-8 transition-colors"
            style={{ color: '#00d9ff' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#0099cc'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#00d9ff'}
          >
            <ArrowLeft size={20} />
            Back to Newsletter List
          </Link>

          {isLoading ? (
            <div className="text-center py-20">
              <Loader className="animate-spin mx-auto mb-4" size={40} style={{ color: '#00d9ff' }} />
              <p className="text-lg" style={{ color: '#6b7280' }}>Loading newsletter...</p>
            </div>
          ) : error ? (
            <div
              className="rounded-2xl p-8 md:p-12 text-center"
              style={{
                background: '#ffffff',
                border: '1px solid #e0e0e0',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
              }}
            >
              <h2
                className="text-2xl font-bold mb-4"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  color: '#1a1a1a'
                }}
              >
                {error}
              </h2>
              <Link
                href="/news"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300"
                style={{
                  background: '#00d9ff',
                  boxShadow: '0 0 20px rgba(0, 217, 255, 0.3)',
                }}
              >
                <ArrowLeft size={20} />
                Back to Newsletters
              </Link>
            </div>
          ) : newsletter ? (
            <article>
              {/* Newsletter Header */}
              <header className="mb-8">
                <div className="flex items-center gap-2 mb-4 text-sm" style={{ color: '#6b7280' }}>
                  <Calendar size={16} />
                  <time dateTime={newsletter.published_date}>
                    {formatDate(newsletter.published_date)}
                  </time>
                </div>
                <h1
                  className="text-4xl md:text-5xl font-bold mb-4"
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    color: '#1a1a1a'
                  }}
                >
                  {newsletter.title}
                </h1>
                {newsletter.excerpt && (
                  <p
                    className="text-xl font-light leading-relaxed"
                    style={{ color: '#4a4a4a' }}
                  >
                    {newsletter.excerpt}
                  </p>
                )}
              </header>

              {/* Newsletter Content */}
              <div
                className="rounded-2xl p-8 md:p-12"
                style={{
                  background: '#ffffff',
                  border: '1px solid #e0e0e0',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                }}
              >
                <div
                  className="newsletter-content prose prose-lg max-w-none"
                  style={{
                    color: '#1a1a1a',
                    lineHeight: '1.8'
                  }}
                  dangerouslySetInnerHTML={{ __html: newsletter.content }}
                />
              </div>

              {/* Footer Navigation */}
              <div className="mt-12 text-center">
                <Link
                  href="/news"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300"
                  style={{
                    background: '#00d9ff',
                    boxShadow: '0 0 20px rgba(0, 217, 255, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 217, 255, 0.5)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.3)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <ArrowLeft size={20} />
                  View All Newsletters
                </Link>
              </div>
            </article>
          ) : null}
        </div>
      </div>

      {/* Newsletter Content Styling */}
      <style jsx global>{`
        .newsletter-content h1,
        .newsletter-content h2,
        .newsletter-content h3 {
          font-family: 'Montserrat', sans-serif;
          font-weight: 700;
          color: #1a1a1a;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }

        .newsletter-content h1 {
          font-size: 2rem;
        }

        .newsletter-content h2 {
          font-size: 1.5rem;
          color: #00d9ff;
        }

        .newsletter-content h3 {
          font-size: 1.25rem;
        }

        .newsletter-content p {
          margin-bottom: 1rem;
          color: #4a4a4a;
        }

        .newsletter-content a {
          color: #00d9ff;
          text-decoration: underline;
          transition: color 0.2s;
        }

        .newsletter-content a:hover {
          color: #0099cc;
        }

        .newsletter-content ul,
        .newsletter-content ol {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }

        .newsletter-content li {
          margin-bottom: 0.5rem;
          color: #4a4a4a;
        }

        .newsletter-content strong {
          color: #1a1a1a;
          font-weight: 600;
        }

        .newsletter-content blockquote {
          border-left: 4px solid #00d9ff;
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #6b7280;
        }

        .newsletter-content img {
          max-width: 100%;
          height: auto;
          border-radius: 12px;
          margin: 1.5rem 0;
        }

        .newsletter-content code {
          background: #f3f4f6;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-size: 0.9em;
          color: #1a1a1a;
        }

        .newsletter-content pre {
          background: #f3f4f6;
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1rem 0;
        }

        .newsletter-content pre code {
          background: none;
          padding: 0;
        }
      `}</style>
    </div>
  );
}
