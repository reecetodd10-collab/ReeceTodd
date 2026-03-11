'use client';

import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

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
              { label: 'O.S.', href: '/supplement-optimization-score' },
              { label: 'About', href: '/about' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  color: '#666',
                  textDecoration: 'none',
                  letterSpacing: '0.05em',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => (e.target.style.color = '#00ffcc')}
                onMouseLeave={(e) => (e.target.style.color = '#666')}
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
              { label: 'O.S.', href: '/supplement-optimization-score' },
              { label: 'About', href: '/about' },
              { label: 'Latest', href: '/news' },
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

// ─── Section card ───
function LegalSection({ number, title, children, accent = false }) {
  return (
    <div
      className="mb-6 p-5 rounded-lg"
      style={{
        background: accent ? 'rgba(0,255,204,0.03)' : 'rgba(255,255,255,0.02)',
        border: accent
          ? '1px solid rgba(0,255,204,0.12)'
          : '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-oswald), Oswald, sans-serif',
          fontSize: '16px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#00ffcc',
          marginBottom: '12px',
        }}
      >
        {number}. {title}
      </h2>
      <div
        style={{
          fontFamily: 'var(--font-space-mono), Space Mono, monospace',
          fontSize: '11px',
          color: '#aaa',
          lineHeight: 1.8,
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ─── Data list card ───
function DataCard({ title, items }) {
  return (
    <div
      className="mt-3 p-3 rounded"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <p
        style={{
          color: '#ffffff',
          fontSize: '11px',
          fontWeight: 700,
          marginBottom: '8px',
        }}
      >
        {title}
      </p>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i}>
            <span style={{ color: '#00ffcc' }}>&#x2022;</span> {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PrivacyPolicy() {
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
            'repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(255,255,255,0.03) 59px, rgba(255,255,255,0.03) 60px)',
        }}
      />

      <StickyNav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* Hero */}
      <section
        className="relative z-10 px-4"
        style={{ paddingTop: '80px', paddingBottom: '32px' }}
      >
        <div className="max-w-[430px] mx-auto text-center">
          <FadeInSection>
            <p
              style={{
                fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.3em',
                color: '#00ffcc',
                marginBottom: '12px',
              }}
            >
              Legal
            </p>
            <h1
              style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontSize: '36px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: '#ffffff',
                lineHeight: 1.1,
                marginBottom: '16px',
              }}
            >
              Privacy Policy
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                fontSize: '11px',
                color: '#666',
                lineHeight: 1.6,
              }}
            >
              Last updated: March 9, 2026
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* Content */}
      <section className="relative z-10 px-4 pb-16">
        <div className="max-w-[430px] mx-auto">
          {/* Introduction */}
          <FadeInSection>
            <div
              className="mb-8 p-5 rounded-lg"
              style={{
                background: 'rgba(0,255,204,0.04)',
                border: '1px solid rgba(0,255,204,0.15)',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                  fontSize: '11px',
                  color: '#aaa',
                  lineHeight: 1.8,
                }}
              >
                Aviera Fit operates this website and related services to provide
                fitness education, supplement recommendations, ecommerce
                products, and personalized performance tools. This Privacy Policy
                explains how we collect, use, disclose, and protect your
                information when you access our website, create an account,
                complete our Supplement Optimization Score quiz, purchase
                products, or otherwise interact with our services. By accessing
                or using our services, you acknowledge that you have read and
                understand this Privacy Policy.
              </p>
            </div>
          </FadeInSection>

          {/* 1. Data Collection */}
          <FadeInSection delay={0.05}>
            <LegalSection number={1} title="Information We Collect">
              <p>
                We collect information directly from you, automatically through
                your use of our services, and from certain third-party providers.
              </p>

              <DataCard
                title="A. Contact Information"
                items={[
                  'Name',
                  'Email address',
                  'Shipping and billing address',
                  'Phone number',
                ]}
              />

              <DataCard
                title="B. Account Information"
                items={[
                  'Username and authentication credentials (managed through Supabase)',
                  'User preferences and settings',
                  'Dashboard activity history',
                ]}
              />

              <DataCard
                title="C. Performance & Wellness Data"
                items={[
                  'Fitness goals and training frequency',
                  'Sleep habits and energy levels',
                  'Recovery habits',
                  'Supplement usage',
                  'General wellness preferences',
                ]}
              />

              <p className="mt-3" style={{ fontSize: '10px', color: '#666' }}>
                Performance and wellness data is self-reported through our
                Supplement Optimization Score quiz and AI tools, and is used
                solely to generate personalized insights and product
                recommendations.
              </p>

              <DataCard
                title="D. Transaction Information"
                items={[
                  'Products viewed and cart activity',
                  'Purchases and returns',
                  'Payment confirmations (processed through Shopify)',
                ]}
              />

              <p className="mt-2" style={{ color: '#ffffff' }}>
                Aviera Fit does not store full credit card numbers.
              </p>

              <DataCard
                title="E. Device & Usage Information"
                items={[
                  'IP address and browser type',
                  'Device type',
                  'Pages visited and time spent',
                  'Interaction events and click patterns',
                ]}
              />

              <DataCard
                title="F. Analytics & Event Data"
                items={[
                  'Quiz completion rates and timestamps',
                  'Selected categories and bottleneck scores',
                  'Product interaction data',
                  'Dashboard engagement metrics',
                ]}
              />
            </LegalSection>
          </FadeInSection>

          {/* 2. Use of Information */}
          <FadeInSection delay={0.05}>
            <LegalSection number={2} title="How We Use Your Information">
              <p className="mb-3">
                We use your information to operate and improve our services:
              </p>

              <DataCard
                title="A. To Provide Services"
                items={[
                  'Create and manage your account via Supabase authentication',
                  'Store quiz responses and optimization results in Supabase',
                  'Display historical performance insights in your dashboard',
                  'Process purchases and fulfill orders through Shopify',
                ]}
              />

              <DataCard
                title="B. To Personalize Recommendations"
                items={[
                  'Generate AI-powered summaries based on quiz responses',
                  'Suggest supplements for sleep, energy, focus, performance, and recovery',
                  'Display rotating featured recommendations in the dashboard',
                ]}
              />

              <DataCard
                title="C. To Improve Our Platform"
                items={[
                  'Analyze quiz completion rates and user engagement',
                  'Improve product offerings and optimize dashboard features',
                  'Enhance AI recommendation accuracy',
                ]}
              />

              <DataCard
                title="D. To Communicate With You"
                items={[
                  'Respond to customer support requests',
                  'Send account-related emails',
                  'Send promotional emails (only if you opt in)',
                ]}
              />

              <DataCard
                title="E. For Legal & Security Purposes"
                items={[
                  'Prevent fraud and enforce our policies',
                  'Comply with legal obligations',
                ]}
              />
            </LegalSection>
          </FadeInSection>

          {/* 3. Cookies */}
          <FadeInSection delay={0.05}>
            <LegalSection number={3} title="Cookies & Tracking Technologies">
              <p>
                We use cookies and similar technologies to operate the website,
                remember your preferences, and analyze traffic. Our third-party
                providers (including Shopify, Supabase, and analytics tools) may
                also use cookies to support ecommerce functionality, authentication,
                and usage analytics.
              </p>
              <p className="mt-3">
                You may manage cookie preferences through your browser settings.
                Disabling cookies may affect the functionality of certain features
                on our website.
              </p>
              <div
                className="mt-3 p-3 rounded"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <p style={{ color: '#666', fontSize: '10px' }}>
                  Types of cookies we use: essential (authentication, cart),
                  functional (preferences), and analytics (usage patterns).
                </p>
              </div>
            </LegalSection>
          </FadeInSection>

          {/* 4. Third-Party Services */}
          <FadeInSection delay={0.05}>
            <LegalSection number={4} title="Third-Party Services">
              <p className="mb-3">
                We share information only as necessary to operate our services
                with the following providers:
              </p>

              <div
                className="mt-3 p-3 rounded"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <p>
                  <span style={{ color: '#00ffcc' }}>Shopify</span> &mdash;
                  ecommerce platform, payment processing, and order fulfillment
                </p>
              </div>
              <div
                className="mt-2 p-3 rounded"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <p>
                  <span style={{ color: '#00ffcc' }}>Supabase</span> &mdash;
                  authentication and secure account management
                </p>
              </div>
              <div
                className="mt-2 p-3 rounded"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <p>
                  <span style={{ color: '#00ffcc' }}>Supabase</span> &mdash;
                  secure database storage for quiz data, scores, and account info
                </p>
              </div>
              <div
                className="mt-2 p-3 rounded"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <p>
                  <span style={{ color: '#00ffcc' }}>Vercel</span> &mdash;
                  website hosting and deployment
                </p>
              </div>
              <div
                className="mt-2 p-3 rounded"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <p>
                  <span style={{ color: '#00ffcc' }}>Analytics providers</span>{' '}
                  &mdash; usage tracking and engagement metrics
                </p>
              </div>
              <div
                className="mt-2 p-3 rounded"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <p>
                  <span style={{ color: '#00ffcc' }}>
                    Fulfillment partners
                  </span>{' '}
                  &mdash; supplement manufacturers and logistics providers
                </p>
              </div>

              <p className="mt-4" style={{ color: '#ffffff' }}>
                We do not sell personal information in the traditional sense of
                selling customer data lists.
              </p>
            </LegalSection>
          </FadeInSection>

          {/* 5. AI-Generated Content */}
          <FadeInSection delay={0.05}>
            <LegalSection number={5} title="AI-Generated Content">
              <p>
                Aviera Fit uses artificial intelligence to analyze your quiz
                responses and generate personalized supplement recommendations
                and performance insights. Your quiz data is processed through our
                AI systems to provide tailored suggestions.
              </p>
              <p className="mt-3">
                This data is used solely for the purpose of generating your
                personalized recommendations and improving our AI models. We do
                not share your individual quiz responses with third parties for
                their own marketing purposes.
              </p>
              <div
                className="mt-3 p-3 rounded"
                style={{
                  background: 'rgba(255,45,85,0.08)',
                  border: '1px solid rgba(255,45,85,0.2)',
                }}
              >
                <p style={{ color: '#ff2d55', fontSize: '10px' }}>
                  AI-generated outputs are for informational purposes only and
                  are not medical advice.
                </p>
              </div>
            </LegalSection>
          </FadeInSection>

          {/* 6. Data Retention */}
          <FadeInSection delay={0.05}>
            <LegalSection number={6} title="Data Retention">
              <p>
                We retain account and quiz data for as long as your account
                remains active or as needed to provide services. You may request
                deletion of your account and associated data by contacting us at{' '}
                <a
                  href="mailto:support@avierafit.com"
                  style={{ color: '#00ffcc', textDecoration: 'none' }}
                >
                  support@avierafit.com
                </a>
                .
              </p>
              <p className="mt-3">
                Transaction records may be retained as required by applicable law
                for tax, accounting, and legal compliance purposes.
              </p>
            </LegalSection>
          </FadeInSection>

          {/* 7. Data Security */}
          <FadeInSection delay={0.05}>
            <LegalSection number={7} title="Data Storage & Security">
              <p>
                Quiz responses, optimization results, and account data are stored
                securely in Supabase. Authentication credentials are managed by
                Supabase. Ecommerce data is managed by Shopify.
              </p>
              <p className="mt-3">
                We implement reasonable technical and organizational safeguards
                to protect your information. However, no online system can
                guarantee absolute security. We encourage you to use strong,
                unique passwords and to keep your login credentials confidential.
              </p>
            </LegalSection>
          </FadeInSection>

          {/* 8. Your Rights */}
          <FadeInSection delay={0.05}>
            <LegalSection number={8} title="Your Rights">
              <p className="mb-3">
                Depending on your location, you may have the right to:
              </p>
              <ul className="space-y-1 pl-3">
                <li>
                  <span style={{ color: '#00ffcc' }}>&#x2022;</span> Request
                  access to your personal information
                </li>
                <li>
                  <span style={{ color: '#00ffcc' }}>&#x2022;</span> Request
                  correction of inaccurate information
                </li>
                <li>
                  <span style={{ color: '#00ffcc' }}>&#x2022;</span> Request
                  deletion of your information
                </li>
                <li>
                  <span style={{ color: '#00ffcc' }}>&#x2022;</span> Request a
                  portable copy of your information
                </li>
                <li>
                  <span style={{ color: '#00ffcc' }}>&#x2022;</span> Opt out of
                  marketing communications
                </li>
              </ul>
              <p className="mt-3">
                You may exercise these rights by contacting us at{' '}
                <a
                  href="mailto:support@avierafit.com"
                  style={{ color: '#00ffcc', textDecoration: 'none' }}
                >
                  support@avierafit.com
                </a>
                . We will respond to your request within 30 days.
              </p>
            </LegalSection>
          </FadeInSection>

          {/* 9. Children's Privacy */}
          <FadeInSection delay={0.05}>
            <LegalSection number={9} title="Children's Privacy">
              <p>
                Our services are not intended for individuals under the age of
                18. We do not knowingly collect personal information from
                children. If we become aware that we have inadvertently collected
                personal information from a child under 18, we will take steps to
                delete that information promptly.
              </p>
            </LegalSection>
          </FadeInSection>

          {/* 10. International Transfer */}
          <FadeInSection delay={0.05}>
            <LegalSection number={10} title="International Data Transfer">
              <p>
                Your information may be processed in the United States or other
                jurisdictions where our service providers operate. By using our
                services, you consent to the transfer of your information to the
                United States and other jurisdictions that may have different data
                protection laws than your home country.
              </p>
            </LegalSection>
          </FadeInSection>

          {/* 11. Changes to Policy */}
          <FadeInSection delay={0.05}>
            <LegalSection number={11} title="Changes to This Policy">
              <p>
                We may update this Privacy Policy periodically. Updates will be
                posted on this page with a revised &quot;Last Updated&quot; date.
                We encourage you to review this page regularly. Continued use of
                our services after changes constitutes acceptance of the updated
                policy.
              </p>
            </LegalSection>
          </FadeInSection>

          {/* 12. Contact */}
          <FadeInSection delay={0.05}>
            <LegalSection number={12} title="Contact Us" accent>
              <p>
                If you have any questions about this Privacy Policy, please
                contact us:
              </p>
              <div className="mt-4" style={{ color: '#ccc' }}>
                <p>
                  <span style={{ color: '#00ffcc' }}>Email:</span>{' '}
                  <a
                    href="mailto:support@avierafit.com"
                    style={{ color: '#ffffff', textDecoration: 'none' }}
                  >
                    support@avierafit.com
                  </a>
                </p>
                <p className="mt-1">
                  <span style={{ color: '#00ffcc' }}>Company:</span> Aviera Fit
                </p>
                <p className="mt-1">
                  <span style={{ color: '#00ffcc' }}>Address:</span> 4437 Lister
                  St, San Diego, CA 92110 USA
                </p>
                <div className="flex gap-4 mt-2">
                  <a
                    href="https://instagram.com/avierafit"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#00ffcc', textDecoration: 'none', fontSize: '10px' }}
                  >
                    Instagram
                  </a>
                  <a
                    href="https://tiktok.com/@avierafit"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#00ffcc', textDecoration: 'none', fontSize: '10px' }}
                  >
                    TikTok
                  </a>
                </div>
              </div>
            </LegalSection>
          </FadeInSection>
        </div>
      </section>

      {/* Footer */}
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
            <Link href="/shop" style={{ color: '#00ffcc', textDecoration: 'none' }}>
              Shop
            </Link>
            {' · '}
            <Link href="/about" style={{ color: '#00ffcc', textDecoration: 'none' }}>
              About
            </Link>
            {' · '}
            <Link href="/news" style={{ color: '#00ffcc', textDecoration: 'none' }}>
              News
            </Link>
            {' · '}
            <Link href="/privacy" style={{ color: '#00ffcc', textDecoration: 'none' }}>
              Privacy
            </Link>
            {' · '}
            <Link href="/terms" style={{ color: '#00ffcc', textDecoration: 'none' }}>
              Terms
            </Link>
          </div>
          <p>
            Manufactured for and Distributed by: AvieraFit
            <br />
            4437 Lister St, San Diego, CA 92110 USA
            <br />
            Questions?{' '}
            <a
              href="mailto:support@avierafit.com"
              style={{ color: '#00ffcc', textDecoration: 'none' }}
            >
              support@avierafit.com
            </a>
          </p>
          <div className="flex justify-center gap-5 mt-3">
            <a href="https://instagram.com/avierafit" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ color: '#444', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#00ffcc'} onMouseLeave={e => e.currentTarget.style.color = '#444'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="https://tiktok.com/@avierafit" target="_blank" rel="noopener noreferrer" aria-label="TikTok" style={{ color: '#444', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#00ffcc'} onMouseLeave={e => e.currentTarget.style.color = '#444'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.98a8.21 8.21 0 0 0 4.76 1.52V7.05a4.84 4.84 0 0 1-1-.36z"/></svg>
            </a>
          </div>
          <p className="mt-3">
            © 2026 Aviera Fit. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
