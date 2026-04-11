'use client';

import React from 'react';
import Link from 'next/link';
import PageLayout, { FadeInSection, TOKENS, FONTS } from '../components/PageLayout';

function LegalSection({ number, title, children, accent = false }) {
  return (
    <div
      className="mb-5 p-5 rounded-lg"
      style={{
        background: accent ? 'rgba(0,229,255,0.06)' : '#ffffff',
        border: accent ? '1.5px solid rgba(0,229,255,0.2)' : '1.5px solid rgba(0,0,0,0.06)',
        boxShadow: '0 1px 6px rgba(0,0,0,0.03)',
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-oswald), Oswald, sans-serif',
          fontSize: '16px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: TOKENS.CYAN,
          marginBottom: '12px',
        }}
      >
        {number}. {title}
      </h2>
      <div
        style={{
          ...FONTS.mono,
          fontSize: '11px',
          color: 'rgba(0,0,0,0.6)',
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
          color: TOKENS.INK,
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
            <span style={{ color: TOKENS.CYAN }}>&#x2022;</span> {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PrivacyPolicy() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative" style={{ background: '#000', paddingTop: '110px', paddingBottom: '40px', zIndex: 10 }}>
        <div className="max-w-[430px] md:max-w-3xl mx-auto px-5 md:px-8 text-center">
          <p style={{ ...FONTS.mono, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em', color: TOKENS.CYAN, marginBottom: '12px' }}>Legal</p>
          <h1 className="text-[32px] md:text-[48px]" style={{ ...FONTS.oswald, fontWeight: 700, textTransform: 'uppercase', color: '#fff', lineHeight: 1.1, marginBottom: '12px' }}>Privacy Policy</h1>
          <p style={{ ...FONTS.mono, fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Last updated: March 9, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section style={{ background: '#F5F0EB', color: '#28282A' }}>
        <div className="max-w-[430px] md:max-w-3xl mx-auto px-5 md:px-8 py-12 md:py-16">
          {/* Introduction */}
          <FadeInSection>
            <div
              className="mb-8 p-5 rounded-lg"
              style={{
                background: 'rgba(0,229,255,0.06)',
                border: '1.5px solid rgba(0,229,255,0.2)',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                  fontSize: '11px',
                  color: 'rgba(0,0,0,0.6)',
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

              <p className="mt-2" style={{ color: TOKENS.INK }}>
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
                  <span style={{ color: TOKENS.CYAN }}>Shopify</span> &mdash;
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
                  <span style={{ color: TOKENS.CYAN }}>Supabase</span> &mdash;
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
                  <span style={{ color: TOKENS.CYAN }}>Supabase</span> &mdash;
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
                  <span style={{ color: TOKENS.CYAN }}>Vercel</span> &mdash;
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
                  <span style={{ color: TOKENS.CYAN }}>Analytics providers</span>{' '}
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
                  <span style={{ color: TOKENS.CYAN }}>
                    Fulfillment partners
                  </span>{' '}
                  &mdash; supplement manufacturers and logistics providers
                </p>
              </div>

              <p className="mt-4" style={{ color: TOKENS.INK }}>
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
                  style={{ color: TOKENS.CYAN, textDecoration: 'none' }}
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
                  <span style={{ color: TOKENS.CYAN }}>&#x2022;</span> Request
                  access to your personal information
                </li>
                <li>
                  <span style={{ color: TOKENS.CYAN }}>&#x2022;</span> Request
                  correction of inaccurate information
                </li>
                <li>
                  <span style={{ color: TOKENS.CYAN }}>&#x2022;</span> Request
                  deletion of your information
                </li>
                <li>
                  <span style={{ color: TOKENS.CYAN }}>&#x2022;</span> Request a
                  portable copy of your information
                </li>
                <li>
                  <span style={{ color: TOKENS.CYAN }}>&#x2022;</span> Opt out of
                  marketing communications
                </li>
              </ul>
              <p className="mt-3">
                You may exercise these rights by contacting us at{' '}
                <a
                  href="mailto:support@avierafit.com"
                  style={{ color: TOKENS.CYAN, textDecoration: 'none' }}
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
                  <span style={{ color: TOKENS.CYAN }}>Email:</span>{' '}
                  <a
                    href="mailto:support@avierafit.com"
                    style={{ color: TOKENS.INK, textDecoration: 'none' }}
                  >
                    support@avierafit.com
                  </a>
                </p>
                <p className="mt-1">
                  <span style={{ color: TOKENS.CYAN }}>Company:</span> Aviera Fit
                </p>
                <p className="mt-1">
                  <span style={{ color: TOKENS.CYAN }}>Address:</span> 4437 Lister
                  St, San Diego, CA 92110 USA
                </p>
                <div className="flex gap-4 mt-2">
                  <a
                    href="https://instagram.com/avierafit"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: TOKENS.CYAN, textDecoration: 'none', fontSize: '10px' }}
                  >
                    Instagram
                  </a>
                  <a
                    href="https://tiktok.com/@avierafit"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: TOKENS.CYAN, textDecoration: 'none', fontSize: '10px' }}
                  >
                    TikTok
                  </a>
                </div>
              </div>
            </LegalSection>
          </FadeInSection>
        </div>
      </section>

    </PageLayout>
  );
}
