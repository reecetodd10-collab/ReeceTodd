'use client';

import React from 'react';
import Link from 'next/link';
import PageLayout, { FadeInSection, SectionBlock, TOKENS, FONTS } from '../components/PageLayout';

function LegalSection({ number, title, children, accent = false }) {
  return (
    <div
      className="mb-5 p-5 rounded-lg"
      style={{
        background: accent ? 'rgba(0,229,255,0.06)' : '#ffffff',
        border: accent ? `1.5px solid rgba(0,229,255,0.2)` : '1.5px solid rgba(0,0,0,0.06)',
        boxShadow: '0 1px 6px rgba(0,0,0,0.03)',
      }}
    >
      <h2 style={{ ...FONTS.oswald, fontSize: '16px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: TOKENS.CYAN, marginBottom: '12px' }}>
        {number}. {title}
      </h2>
      <div style={{ ...FONTS.mono, fontSize: '11px', color: 'rgba(0,0,0,0.6)', lineHeight: 1.8 }}>
        {children}
      </div>
    </div>
  );
}

export default function TermsOfService() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative" style={{ background: '#000', paddingTop: '110px', paddingBottom: '40px', zIndex: 10 }}>
        <div className="max-w-[430px] md:max-w-3xl mx-auto px-5 md:px-8 text-center">
          <p style={{ ...FONTS.mono, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em', color: TOKENS.CYAN, marginBottom: '12px' }}>Legal</p>
          <h1 className="text-[32px] md:text-[48px]" style={{ ...FONTS.oswald, fontWeight: 700, textTransform: 'uppercase', color: '#fff', lineHeight: 1.1, marginBottom: '12px' }}>Terms of Service</h1>
          <p style={{ ...FONTS.mono, fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Last updated: March 9, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section style={{ background: '#F5F0EB', color: '#28282A' }}>
        <div className="max-w-[430px] md:max-w-3xl mx-auto px-5 md:px-8 py-12 md:py-16">
          {/* Overview */}
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
                  style={{ color: TOKENS.CYAN, textDecoration: 'none' }}
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
                <span style={{ color: TOKENS.INK, fontWeight: 700 }}>
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
              <p className="mt-3" style={{ color: TOKENS.INK }}>
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
                <span style={{ color: TOKENS.INK }}>
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
                  style={{ color: TOKENS.CYAN, textDecoration: 'none' }}
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
              <p className="mt-3" style={{ color: TOKENS.INK }}>
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
                  <span style={{ color: TOKENS.CYAN }}>&#x2022;</span> Misuse the
                  Services or use them for unlawful purposes
                </li>
                <li>
                  <span style={{ color: TOKENS.CYAN }}>&#x2022;</span> Attempt to
                  reverse engineer our systems or AI models
                </li>
                <li>
                  <span style={{ color: TOKENS.CYAN }}>&#x2022;</span> Scrape data
                  from the platform
                </li>
                <li>
                  <span style={{ color: TOKENS.CYAN }}>&#x2022;</span> Interfere
                  with security features or authentication systems
                </li>
                <li>
                  <span style={{ color: TOKENS.CYAN }}>&#x2022;</span> Resell or
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
                  <span style={{ color: TOKENS.INK }}>&quot;AS IS&quot;</span> and{' '}
                  <span style={{ color: TOKENS.INK }}>
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
                <span style={{ color: TOKENS.INK }}>State of California</span>,
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
