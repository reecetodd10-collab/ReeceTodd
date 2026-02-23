'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--txt)]">
            <div className="max-w-3xl mx-auto px-4 py-16">
                {/* Back link */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-[var(--txt-muted)] hover:text-[var(--acc)] transition mb-8"
                >
                    <ArrowLeft size={16} />
                    Back to Home
                </Link>

                <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
                <p className="text-[var(--txt-muted)] text-sm mb-12">Last updated: February 2026</p>

                <div className="space-y-10 text-[var(--txt-muted)] leading-relaxed">
                    {/* Introduction */}
                    <section>
                        <h2 className="text-xl font-semibold text-[var(--txt)] mb-3">1. Introduction</h2>
                        <p>
                            Aviera (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is committed to protecting your personal data.
                            This privacy policy explains how we collect, use, disclose, and safeguard your information when you visit
                            our website and use our services, including the Optimization Score quiz and supplement recommendations.
                        </p>
                    </section>

                    {/* Information We Collect */}
                    <section>
                        <h2 className="text-xl font-semibold text-[var(--txt)] mb-3">2. Information We Collect</h2>
                        <p className="mb-3">We may collect the following types of information:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong className="text-[var(--txt)]">Account Information:</strong> Name, email address, and authentication data when you create an account.</li>
                            <li><strong className="text-[var(--txt)]">Quiz Responses:</strong> Health and fitness data you provide through our Optimization Score quiz (age, goals, training frequency, sleep quality, etc.).</li>
                            <li><strong className="text-[var(--txt)]">Usage Data:</strong> Pages visited, features used, interaction patterns, and device information.</li>
                            <li><strong className="text-[var(--txt)]">Purchase Data:</strong> Transaction information processed through our Shopify integration.</li>
                        </ul>
                    </section>

                    {/* How We Use Your Information */}
                    <section>
                        <h2 className="text-xl font-semibold text-[var(--txt)] mb-3">3. How We Use Your Information</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Generate personalized supplement recommendations based on your quiz responses.</li>
                            <li>Track your optimization score over time (if you create an account).</li>
                            <li>Process orders and manage your account.</li>
                            <li>Send newsletters and updates (only with your consent).</li>
                            <li>Improve our services and user experience.</li>
                            <li>Comply with legal obligations.</li>
                        </ul>
                    </section>

                    {/* Data Storage & Security */}
                    <section>
                        <h2 className="text-xl font-semibold text-[var(--txt)] mb-3">4. Data Storage & Security</h2>
                        <p>
                            Your data is stored securely using industry-standard encryption and security practices.
                            We use Supabase for data storage and Clerk for authentication, both of which maintain
                            SOC 2 compliance. Quiz results may be stored anonymously even without account creation
                            to provide your recommendations.
                        </p>
                    </section>

                    {/* Cookies & Analytics */}
                    <section>
                        <h2 className="text-xl font-semibold text-[var(--txt)] mb-3">5. Cookies & Analytics</h2>
                        <p>
                            We use cookies and similar technologies to enhance your experience, remember preferences,
                            and analyze site usage. We use Google Analytics to understand how visitors interact with
                            our website. You can manage cookie preferences through your browser settings.
                        </p>
                    </section>

                    {/* Third-Party Services */}
                    <section>
                        <h2 className="text-xl font-semibold text-[var(--txt)] mb-3">6. Third-Party Services</h2>
                        <p className="mb-3">We integrate with the following third-party services:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong className="text-[var(--txt)]">Shopify:</strong> E-commerce and payment processing.</li>
                            <li><strong className="text-[var(--txt)]">Clerk:</strong> User authentication and account management.</li>
                            <li><strong className="text-[var(--txt)]">Supabase:</strong> Secure data storage.</li>
                            <li><strong className="text-[var(--txt)]">OpenAI:</strong> AI-powered personalization (quiz data is anonymized).</li>
                            <li><strong className="text-[var(--txt)]">Vercel:</strong> Website hosting.</li>
                        </ul>
                    </section>

                    {/* Your Rights */}
                    <section>
                        <h2 className="text-xl font-semibold text-[var(--txt)] mb-3">7. Your Rights</h2>
                        <p className="mb-3">You have the right to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Access, correct, or delete your personal data.</li>
                            <li>Opt out of marketing communications at any time.</li>
                            <li>Request a copy of data we hold about you.</li>
                            <li>Withdraw consent for data processing.</li>
                        </ul>
                        <p className="mt-3">
                            To exercise these rights, contact us at{' '}
                            <a href="mailto:info@avierafit.com" className="text-[var(--acc)] hover:underline">info@avierafit.com</a>.
                        </p>
                    </section>

                    {/* Children's Privacy */}
                    <section>
                        <h2 className="text-xl font-semibold text-[var(--txt)] mb-3">8. Children&apos;s Privacy</h2>
                        <p>
                            Our services are not intended for individuals under the age of 18. We do not knowingly
                            collect personal data from children.
                        </p>
                    </section>

                    {/* Changes to This Policy */}
                    <section>
                        <h2 className="text-xl font-semibold text-[var(--txt)] mb-3">9. Changes to This Policy</h2>
                        <p>
                            We may update this privacy policy from time to time. We will notify you of any changes
                            by posting the new privacy policy on this page and updating the &quot;Last updated&quot; date.
                        </p>
                    </section>

                    {/* Contact */}
                    <section>
                        <h2 className="text-xl font-semibold text-[var(--txt)] mb-3">10. Contact Us</h2>
                        <p className="mb-4">If you have any questions about this privacy policy, contact us at:</p>
                        <div
                            className="p-6 rounded-xl"
                            style={{
                                background: 'rgba(0, 217, 255, 0.05)',
                                border: '1px solid rgba(0, 217, 255, 0.15)',
                            }}
                        >
                            <div className="space-y-2">
                                <p>
                                    <strong className="text-[var(--txt)]">Email:</strong>{' '}
                                    <a href="mailto:info@avierafit.com" className="text-[var(--acc)] hover:underline">info@avierafit.com</a>
                                </p>
                                <p>
                                    <strong className="text-[var(--txt)]">Address:</strong>{' '}
                                    4437 Lister St, San Diego, CA 92110
                                </p>
                                <p>
                                    <strong className="text-[var(--txt)]">Instagram:</strong>{' '}
                                    <a href="https://instagram.com/avierafit" target="_blank" rel="noopener noreferrer" className="text-[var(--acc)] hover:underline">@avierafit</a>
                                </p>
                                <p>
                                    <strong className="text-[var(--txt)]">TikTok:</strong>{' '}
                                    <a href="https://tiktok.com/@avierafit" target="_blank" rel="noopener noreferrer" className="text-[var(--acc)] hover:underline">@avierafit</a>
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
