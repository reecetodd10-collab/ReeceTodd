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
              { label: 'Optimize Quiz', href: '/supplement-optimization-score' },
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
              { label: 'Optimize Quiz', href: '/supplement-optimization-score' },
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

export default function TermsOfService() {
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
              Terms of Service
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
          {/* Overview */}
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
                Welcome to Aviera Fit. The terms &quot;we,&quot; &quot;us,&quot;
                and &quot;our&quot; refer to Aviera Fit. We operate this website
                and related services to provide supplement products, educational
                content, personalized performance tools, and subscription-based
                supplement programs, including the Supplement Optimization Score
                and AI-generated insights. These Terms govern your access to and
                use of our website, products, dashboard features, and related
                services. By accessing or using our Services, you agree to be
                bound by these Terms and our{' '}
                <Link
                  href="/privacy"
                  style={{ color: '#00ffcc', textDecoration: 'none' }}
                >
                  Privacy Policy
                </Link>
                . If you do not agree, you must not use our Services.
              </p>
            </div>
          </FadeInSection>

          {/* 1. Acceptance */}
          <FadeInSection delay={0.05}>
            <LegalSection number={1} title="Acceptance of Terms">
              <p>
                By accessing or using the Aviera website (avierafit.com), mobile
                application, or any products and services offered by Aviera Fit,
                you agree to be bound by these Terms of Service. If you do not
                agree to all of these terms, do not use our services.
              </p>
              <p className="mt-3">
                We reserve the right to update or modify these Terms at any
                time. Changes become effective immediately upon posting.
                Continued use of our services after changes constitutes
                acceptance of the updated Terms.
              </p>
            </LegalSection>
          </FadeInSection>

          {/* 2. Eligibility */}
          <FadeInSection delay={0.05}>
            <LegalSection number={2} title="Eligibility">
              <p>
                You must be at least{' '}
                <span style={{ color: '#ffffff', fontWeight: 700 }}>
                  18 years of age
                </span>{' '}
                to use our services or purchase products. By using our services,
                you represent and warrant that you are at least 18 years old and
                have the legal capacity to enter into a binding agreement.
              </p>
              <p className="mt-3">
                If you are using our services on behalf of an organization, you
                represent that you have the authority to bind that organization
                to these Terms.
              </p>
            </LegalSection>
          </FadeInSection>

          {/* 3. Accounts */}
          <FadeInSection delay={0.05}>
            <LegalSection number={3} title="User Accounts">
              <p>
                When you create an account with Aviera, you are responsible for
                maintaining the confidentiality of your account credentials and
                for all activities that occur under your account. We use
                third-party authentication providers, including Supabase, to manage
                secure account access. You agree to provide accurate, current,
                and complete information during registration and to update such
                information as needed.
              </p>
              <p className="mt-3">
                You must notify us immediately of any unauthorized access to or
                use of your account. We are not liable for any loss or damage
                arising from your failure to protect your account credentials.
              </p>
              <p className="mt-3" style={{ color: '#ffffff' }}>
                You are responsible for all activity that occurs under your
                account.
              </p>
            </LegalSection>
          </FadeInSection>

          {/* 4. AI Tools & Quiz */}
          <FadeInSection delay={0.05}>
            <LegalSection number={4} title="Supplement Optimization Score & AI Tools">
              <p>
                Aviera Fit provides an interactive quiz known as the Supplement
                Optimization Score. This tool collects information you
                voluntarily provide regarding fitness goals, sleep, energy,
                recovery, and related wellness factors. Artificial intelligence
                systems generate summaries and product suggestions based on your
                responses.
              </p>
              <div
                className="mt-3 p-3 rounded"
                style={{
                  background: 'rgba(255,45,85,0.08)',
                  border: '1px solid rgba(255,45,85,0.2)',
                }}
              >
                <p style={{ color: '#ff2d55', fontSize: '10px' }}>
                  <span style={{ fontWeight: 700 }}>IMPORTANT:</span>{' '}
                  AI-generated outputs are for informational purposes only and
                  should not be considered medical advice. These outputs may
                  contain inaccuracies. Your reliance on such outputs is at your
                  own risk. Always consult with a healthcare professional before
                  starting any supplement regimen.
                </p>
              </div>
            </LegalSection>
          </FadeInSection>

          {/* 5. Products & Orders */}
          <FadeInSection delay={0.05}>
            <LegalSection number={5} title="Products & Orders">
              <p>
                We sell dietary supplements and related products through our
                ecommerce platform powered by Shopify. All products are
                manufactured and distributed in the United States. Product
                descriptions, images, and pricing are provided as accurately as
                possible, but we do not warrant that they are error-free.
              </p>
              <p className="mt-3">
                We reserve the right to limit quantities, refuse orders, and
                cancel orders at our discretion. Payments are processed securely
                through Shopify and its payment providers.{' '}
                <span style={{ color: '#ffffff' }}>
                  We do not store full payment card details.
                </span>
              </p>
              <p className="mt-3" style={{ color: '#ff2d55', fontSize: '10px' }}>
                *These statements have not been evaluated by the Food and Drug
                Administration. Our products are not intended to diagnose, treat,
                cure, or prevent any disease.
              </p>
            </LegalSection>
          </FadeInSection>

          {/* 6. Shipping & Returns */}
          <FadeInSection delay={0.05}>
            <LegalSection number={6} title="Shipping & Returns">
              <p>
                We ship to addresses within the United States. Shipping times and
                costs vary depending on the delivery method selected at checkout.
                Estimated delivery times are not guaranteed and may be affected
                by carrier delays, weather, or other factors beyond our control.
              </p>
              <p className="mt-3">
                Risk of loss and title for items pass to you upon delivery to the
                carrier. You are responsible for providing an accurate shipping
                address.
              </p>
              <p className="mt-3">
                We accept returns of unopened, unused products within 30 days of
                delivery. To initiate a return, contact us at{' '}
                <a
                  href="mailto:support@avierafit.com"
                  style={{ color: '#00ffcc', textDecoration: 'none' }}
                >
                  support@avierafit.com
                </a>
                . Return shipping costs are the responsibility of the customer
                unless the return is due to our error. Refunds are issued to the
                original payment method within 5&ndash;10 business days of
                receiving the returned product.
              </p>
            </LegalSection>
          </FadeInSection>

          {/* 7. Subscriptions */}
          <FadeInSection delay={0.05}>
            <LegalSection number={7} title="Subscriptions & Pro Membership">
              <p>
                Aviera Pro is a recurring subscription service billed monthly or
                annually. By subscribing, you authorize us to charge your payment
                method on a recurring basis until you cancel.
              </p>
              <p className="mt-3">
                You may cancel your subscription at any time from your account
                settings or by contacting customer support. Cancellation takes
                effect at the end of the current billing period. No partial
                refunds are provided for unused portions of a billing period
                unless required by law.
              </p>
              <p className="mt-3">
                We reserve the right to modify subscription pricing with
                reasonable notice as required by applicable law.
              </p>
            </LegalSection>
          </FadeInSection>

          {/* 8. Intellectual Property */}
          <FadeInSection delay={0.05}>
            <LegalSection number={8} title="Intellectual Property">
              <p>
                All content on the Aviera website and application &mdash;
                including but not limited to text, graphics, logos, icons, images,
                audio clips, software, quiz structure, scoring methodology, AI
                system prompts, and the compilation thereof &mdash; is the
                property of Aviera Fit or its licensors and is protected by
                United States and international copyright, trademark, and other
                intellectual property laws.
              </p>
              <p className="mt-3">
                The Aviera name, logo, and all related names, logos, product and
                service names, designs, and slogans are trademarks of Aviera Fit.
                You may not use these marks without our prior written permission.
              </p>
              <p className="mt-3" style={{ color: '#ffffff' }}>
                You may not reproduce, distribute, or exploit any content without
                prior written consent.
              </p>
            </LegalSection>
          </FadeInSection>

          {/* 9. Prohibited Uses */}
          <FadeInSection delay={0.05}>
            <LegalSection number={9} title="Prohibited Uses">
              <p className="mb-3">You agree not to:</p>
              <ul className="space-y-1 pl-3">
                <li>
                  <span style={{ color: '#00ffcc' }}>&#x2022;</span> Misuse the
                  Services or use them for unlawful purposes
                </li>
                <li>
                  <span style={{ color: '#00ffcc' }}>&#x2022;</span> Attempt to
                  reverse engineer our systems or AI models
                </li>
                <li>
                  <span style={{ color: '#00ffcc' }}>&#x2022;</span> Scrape data
                  from the platform
                </li>
                <li>
                  <span style={{ color: '#00ffcc' }}>&#x2022;</span> Interfere
                  with security features or authentication systems
                </li>
                <li>
                  <span style={{ color: '#00ffcc' }}>&#x2022;</span> Resell or
                  redistribute products without authorization
                </li>
              </ul>
            </LegalSection>
          </FadeInSection>

          {/* 10. Disclaimer of Warranties */}
          <FadeInSection delay={0.05}>
            <LegalSection number={10} title="Disclaimer of Warranties">
              <div
                className="p-3 rounded"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <p
                  style={{
                    fontSize: '9px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: '#666',
                    marginBottom: '8px',
                  }}
                >
                  Legal Notice
                </p>
                <p>
                  The Services and all products are provided{' '}
                  <span style={{ color: '#ffffff' }}>&quot;AS IS&quot;</span> and{' '}
                  <span style={{ color: '#ffffff' }}>
                    &quot;AS AVAILABLE&quot;
                  </span>{' '}
                  without warranties of any kind. To the fullest extent permitted
                  by law, we disclaim all implied warranties including
                  merchantability and fitness for a particular purpose.
                </p>
              </div>
            </LegalSection>
          </FadeInSection>

          {/* 11. Limitation of Liability */}
          <FadeInSection delay={0.05}>
            <LegalSection number={11} title="Limitation of Liability">
              <p>
                TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, AVIERA FIT
                AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE
                LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
                PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS,
                DATA, USE, OR GOODWILL, ARISING OUT OF OR RELATED TO YOUR USE OF
                OUR SERVICES.
              </p>
              <p className="mt-3">
                In no event shall our total liability exceed the amount you paid
                for the product or subscription giving rise to the claim.
              </p>
              <p className="mt-3">
                Aviera Fit does not provide medical advice. Our AI-generated
                recommendations, supplement suggestions, and fitness content are
                for informational purposes only and should not replace
                professional medical advice, diagnosis, or treatment.
              </p>
            </LegalSection>
          </FadeInSection>

          {/* 12. Assumption of Risk */}
          <FadeInSection delay={0.05}>
            <LegalSection number={12} title="Assumption of Risk">
              <p>
                You acknowledge that participation in fitness activities and the
                use of dietary supplements involve inherent risks. You
                voluntarily assume all risks associated with your use of our
                products and Services.
              </p>
            </LegalSection>
          </FadeInSection>

          {/* 13. Indemnification */}
          <FadeInSection delay={0.05}>
            <LegalSection number={13} title="Indemnification">
              <p>
                You agree to indemnify and hold harmless Aviera Fit and its
                affiliates, officers, directors, employees, and agents from any
                claims, damages, losses, or expenses arising out of your misuse
                of the Services or violation of these Terms.
              </p>
            </LegalSection>
          </FadeInSection>

          {/* 14. Governing Law */}
          <FadeInSection delay={0.05}>
            <LegalSection number={14} title="Governing Law">
              <p>
                These Terms shall be governed by and construed in accordance with
                the laws of the{' '}
                <span style={{ color: '#ffffff' }}>State of California</span>,
                without regard to its conflict of law provisions. Any disputes
                arising under these Terms shall be resolved exclusively in the
                state or federal courts located in San Diego County, California.
              </p>
              <p className="mt-3">
                If any provision of these Terms is found to be unenforceable, the
                remaining provisions shall remain in full force and effect.
              </p>
            </LegalSection>
          </FadeInSection>

          {/* 15. Changes */}
          <FadeInSection delay={0.05}>
            <LegalSection number={15} title="Changes to Terms">
              <p>
                We may update these Terms at any time. Updates will be posted on
                this page with a revised &quot;Last Updated&quot; date. Continued
                use of the Services constitutes acceptance of revised Terms.
              </p>
            </LegalSection>
          </FadeInSection>

          {/* 16. Contact */}
          <FadeInSection delay={0.05}>
            <LegalSection number={16} title="Contact Information" accent>
              <p>
                If you have any questions about these Terms of Service, please
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
            <br />
            *These statements have not been evaluated by the FDA. This product is
            not intended to diagnose, treat, cure, or prevent any disease.
          </p>
        </div>
      </footer>
    </div>
  );
}
