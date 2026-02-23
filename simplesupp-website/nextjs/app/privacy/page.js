'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Database, Lock, Users, Mail, Globe, Cookie, AlertCircle } from 'lucide-react';

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--txt)]">
            <div className="max-w-4xl mx-auto px-4 py-16">
                {/* Back link */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-[var(--txt-muted)] hover:text-[var(--acc)] transition mb-8"
                >
                    <ArrowLeft size={16} />
                    Back to Home
                </Link>

                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-4">
                        <div
                            className="p-3 rounded-xl"
                            style={{
                                background: 'rgba(0, 217, 255, 0.1)',
                                border: '1px solid rgba(0, 217, 255, 0.2)',
                            }}
                        >
                            <Shield size={28} className="text-[var(--acc)]" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold">Privacy Policy</h1>
                    </div>
                    <p className="text-[var(--txt-muted)]">Last Updated: February 23, 2026</p>
                </div>

                {/* Introduction */}
                <div
                    className="p-6 rounded-2xl mb-12"
                    style={{
                        background: 'rgba(0, 217, 255, 0.05)',
                        border: '1px solid rgba(0, 217, 255, 0.15)',
                    }}
                >
                    <p className="text-[var(--txt-muted)] leading-relaxed">
                        AvieraFit operates this website and related services to provide fitness education, supplement recommendations,
                        ecommerce products, and personalized performance tools. This Privacy Policy explains how we collect, use,
                        disclose, and protect your information when you access our website, create an account, complete our
                        Supplement Optimization Score quiz, purchase products, or otherwise interact with our services.
                    </p>
                    <p className="text-[var(--txt-muted)] leading-relaxed mt-4">
                        By accessing or using our services, you acknowledge that you have read and understand this Privacy Policy.
                    </p>
                </div>

                <div className="space-y-12 text-[var(--txt-muted)] leading-relaxed">

                    {/* Information We Collect */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <Database size={24} className="text-[var(--acc)]" />
                            <h2 className="text-2xl font-semibold text-[var(--txt)]">Information We Collect</h2>
                        </div>
                        <p className="mb-6">
                            We collect information directly from you, automatically through your use of our services,
                            and from certain third party providers.
                        </p>

                        <div className="space-y-6">
                            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                                <h3 className="text-lg font-semibold text-[var(--txt)] mb-3">A. Contact Information</h3>
                                <ul className="grid grid-cols-2 gap-2">
                                    <li>• Name</li>
                                    <li>• Email address</li>
                                    <li>• Shipping address</li>
                                    <li>• Billing address</li>
                                    <li>• Phone number</li>
                                </ul>
                            </div>

                            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                                <h3 className="text-lg font-semibold text-[var(--txt)] mb-3">B. Account Information</h3>
                                <ul className="space-y-1">
                                    <li>• Username</li>
                                    <li>• Authentication credentials managed through Clerk</li>
                                    <li>• User preferences and settings</li>
                                    <li>• Dashboard activity history</li>
                                </ul>
                            </div>

                            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                                <h3 className="text-lg font-semibold text-[var(--txt)] mb-3">C. Performance and Wellness Information</h3>
                                <p className="mb-3">
                                    When you complete the Supplement Optimization Score quiz or interact with our AI powered tools,
                                    we collect information that you voluntarily provide related to:
                                </p>
                                <ul className="grid grid-cols-2 gap-2">
                                    <li>• Fitness goals</li>
                                    <li>• Sleep habits</li>
                                    <li>• Energy levels</li>
                                    <li>• Recovery habits</li>
                                    <li>• Training frequency</li>
                                    <li>• Supplement usage</li>
                                    <li>• General wellness preferences</li>
                                </ul>
                                <p className="mt-4 text-sm italic">
                                    This information is self reported and used solely to generate personalized performance insights
                                    and product recommendations.
                                </p>
                            </div>

                            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                                <h3 className="text-lg font-semibold text-[var(--txt)] mb-3">D. Transaction Information</h3>
                                <ul className="space-y-1">
                                    <li>• Products viewed</li>
                                    <li>• Cart activity</li>
                                    <li>• Purchases</li>
                                    <li>• Returns</li>
                                    <li>• Payment confirmations</li>
                                </ul>
                                <p className="mt-4 text-sm">
                                    Payments are processed through Shopify and its payment providers.
                                    <strong className="text-[var(--txt)]"> AvieraFit does not store full credit card numbers.</strong>
                                </p>
                            </div>

                            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                                <h3 className="text-lg font-semibold text-[var(--txt)] mb-3">E. Device and Usage Information</h3>
                                <ul className="grid grid-cols-2 gap-2">
                                    <li>• IP address</li>
                                    <li>• Browser type</li>
                                    <li>• Device type</li>
                                    <li>• Pages visited</li>
                                    <li>• Time spent on pages</li>
                                    <li>• Interaction events</li>
                                </ul>
                            </div>

                            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                                <h3 className="text-lg font-semibold text-[var(--txt)] mb-3">F. Analytics and Event Data</h3>
                                <p>
                                    We collect usage events to understand how users interact with our quiz, dashboard, and product
                                    recommendations. This may include timestamps, selected categories, bottleneck scores, and product
                                    interaction data. If you are signed in, this data may be associated with your account.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* How We Use Your Information */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <Users size={24} className="text-[var(--acc)]" />
                            <h2 className="text-2xl font-semibold text-[var(--txt)]">How We Use Your Information</h2>
                        </div>
                        <p className="mb-6">We use your information to operate and improve our services.</p>

                        <div className="space-y-6">
                            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                                <h3 className="text-lg font-semibold text-[var(--txt)] mb-3">A. To Provide Services</h3>
                                <ul className="space-y-1">
                                    <li>• Create and manage your account</li>
                                    <li>• Authenticate users through Clerk</li>
                                    <li>• Store quiz responses and optimization results in Supabase</li>
                                    <li>• Display historical performance insights in your dashboard</li>
                                    <li>• Process purchases through Shopify</li>
                                    <li>• Fulfill orders through our fulfillment partners</li>
                                </ul>
                            </div>

                            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                                <h3 className="text-lg font-semibold text-[var(--txt)] mb-3">B. To Personalize Recommendations</h3>
                                <ul className="space-y-1">
                                    <li>• Generate AI powered summaries based on quiz responses</li>
                                    <li>• Suggest supplements related to sleep, energy, focus, workout performance, or recovery</li>
                                    <li>• Display rotating featured recommendations in the dashboard</li>
                                </ul>
                            </div>

                            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                                <h3 className="text-lg font-semibold text-[var(--txt)] mb-3">C. To Improve Our Platform</h3>
                                <ul className="space-y-1">
                                    <li>• Analyze quiz completion rates</li>
                                    <li>• Understand user engagement</li>
                                    <li>• Improve product offerings</li>
                                    <li>• Optimize dashboard features</li>
                                </ul>
                            </div>

                            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                                <h3 className="text-lg font-semibold text-[var(--txt)] mb-3">D. To Communicate With You</h3>
                                <ul className="space-y-1">
                                    <li>• Respond to customer support requests</li>
                                    <li>• Send account related emails</li>
                                    <li>• Send promotional emails if you opt in</li>
                                </ul>
                            </div>

                            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                                <h3 className="text-lg font-semibold text-[var(--txt)] mb-3">E. For Legal and Security Purposes</h3>
                                <ul className="space-y-1">
                                    <li>• Prevent fraud</li>
                                    <li>• Comply with legal obligations</li>
                                    <li>• Enforce our policies</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* AI Generated Content */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <Globe size={24} className="text-[var(--acc)]" />
                            <h2 className="text-2xl font-semibold text-[var(--txt)]">AI Generated Content</h2>
                        </div>
                        <p>
                            AvieraFit uses artificial intelligence to analyze your quiz responses and generate personalized
                            supplement recommendations and performance insights. Your quiz data is processed through our AI
                            systems to provide tailored suggestions. This data is used solely for the purpose of generating
                            your personalized recommendations and improving our AI models.
                        </p>
                    </section>

                    {/* How We Share Information */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <Users size={24} className="text-[var(--acc)]" />
                            <h2 className="text-2xl font-semibold text-[var(--txt)]">How We Share Information</h2>
                        </div>
                        <p className="mb-6">We share information only as necessary to operate our services.</p>

                        <div className="space-y-6">
                            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                                <h3 className="text-lg font-semibold text-[var(--txt)] mb-3">A. Service Providers</h3>
                                <ul className="space-y-1">
                                    <li>• <strong className="text-[var(--txt)]">Shopify</strong> for ecommerce and payments</li>
                                    <li>• <strong className="text-[var(--txt)]">Clerk</strong> for authentication and account management</li>
                                    <li>• <strong className="text-[var(--txt)]">Supabase</strong> for secure database storage</li>
                                    <li>• <strong className="text-[var(--txt)]">Vercel</strong> for website hosting</li>
                                    <li>• Email delivery providers</li>
                                    <li>• Fulfillment partners such as supplement manufacturers and logistics providers</li>
                                </ul>
                            </div>

                            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                                <h3 className="text-lg font-semibold text-[var(--txt)] mb-3">B. Legal Requirements</h3>
                                <p>We may disclose information if required by law or to protect our legal rights.</p>
                            </div>

                            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                                <h3 className="text-lg font-semibold text-[var(--txt)] mb-3">C. Business Transfers</h3>
                                <p>
                                    If AvieraFit undergoes a merger, acquisition, or asset sale, user information may be
                                    transferred as part of that transaction.
                                </p>
                            </div>
                        </div>

                        <p className="mt-6 font-semibold text-[var(--txt)]">
                            We do not sell personal information in the traditional sense of selling customer data lists.
                        </p>
                    </section>

                    {/* Data Storage and Security */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <Lock size={24} className="text-[var(--acc)]" />
                            <h2 className="text-2xl font-semibold text-[var(--txt)]">Data Storage and Security</h2>
                        </div>
                        <p className="mb-4">
                            Quiz responses, optimization results, and account data are stored securely in Supabase.
                            Authentication credentials are managed by Clerk. Ecommerce data is managed by Shopify.
                        </p>
                        <p>
                            We implement reasonable technical and organizational safeguards to protect your information.
                            However, no online system can guarantee absolute security.
                        </p>
                    </section>

                    {/* Data Retention */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <Database size={24} className="text-[var(--acc)]" />
                            <h2 className="text-2xl font-semibold text-[var(--txt)]">Data Retention</h2>
                        </div>
                        <p className="mb-4">
                            We retain account and quiz data for as long as your account remains active or as needed to
                            provide services. You may request deletion of your account and associated data by contacting us.
                        </p>
                        <p>Transaction records may be retained as required by law.</p>
                    </section>

                    {/* Your Rights */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <Shield size={24} className="text-[var(--acc)]" />
                            <h2 className="text-2xl font-semibold text-[var(--txt)]">Your Rights</h2>
                        </div>
                        <p className="mb-4">Depending on your location, you may have the right to:</p>
                        <ul className="space-y-2 mb-6">
                            <li>• Request access to your personal information</li>
                            <li>• Request correction of inaccurate information</li>
                            <li>• Request deletion of your information</li>
                            <li>• Request a copy of your information</li>
                            <li>• Opt out of marketing communications</li>
                        </ul>
                        <p>
                            You may exercise these rights by contacting us at{' '}
                            <a href="mailto:info@avierafit.com" className="text-[var(--acc)] hover:underline">
                                info@avierafit.com
                            </a>.
                        </p>
                    </section>

                    {/* Cookies and Tracking Technologies */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <Cookie size={24} className="text-[var(--acc)]" />
                            <h2 className="text-2xl font-semibold text-[var(--txt)]">Cookies and Tracking Technologies</h2>
                        </div>
                        <p className="mb-4">
                            We use cookies and similar technologies to operate the website, remember preferences, and analyze traffic.
                            Shopify and other providers may also use cookies to support ecommerce functionality and analytics.
                        </p>
                        <p>You may manage cookie preferences through your browser settings.</p>
                    </section>

                    {/* Children */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <AlertCircle size={24} className="text-[var(--acc)]" />
                            <h2 className="text-2xl font-semibold text-[var(--txt)]">Children</h2>
                        </div>
                        <p>
                            Our services are not intended for individuals under the age of 18. We do not knowingly
                            collect personal information from children.
                        </p>
                    </section>

                    {/* International Transfer */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <Globe size={24} className="text-[var(--acc)]" />
                            <h2 className="text-2xl font-semibold text-[var(--txt)]">International Transfer</h2>
                        </div>
                        <p>
                            Your information may be processed in the United States or other jurisdictions where our
                            service providers operate.
                        </p>
                    </section>

                    {/* Changes to This Policy */}
                    <section>
                        <h2 className="text-2xl font-semibold text-[var(--txt)] mb-4">Changes to This Policy</h2>
                        <p>
                            We may update this Privacy Policy periodically. Updates will be posted on this page with
                            a revised Last Updated date.
                        </p>
                    </section>

                    {/* Contact Us */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <Mail size={24} className="text-[var(--acc)]" />
                            <h2 className="text-2xl font-semibold text-[var(--txt)]">Contact Us</h2>
                        </div>
                        <p className="mb-6">If you have any questions about this Privacy Policy, please contact us:</p>
                        <div
                            className="p-6 rounded-2xl"
                            style={{
                                background: 'rgba(0, 217, 255, 0.05)',
                                border: '1px solid rgba(0, 217, 255, 0.2)',
                            }}
                        >
                            <div className="space-y-3">
                                <p className="text-xl font-semibold text-[var(--txt)]">AvieraFit</p>
                                <p>
                                    <strong className="text-[var(--txt)]">Email:</strong>{' '}
                                    <a href="mailto:info@avierafit.com" className="text-[var(--acc)] hover:underline">
                                        info@avierafit.com
                                    </a>
                                </p>
                                <p>
                                    <strong className="text-[var(--txt)]">Address:</strong>{' '}
                                    4437 Lister St, San Diego, CA 92110
                                </p>
                                <div className="flex gap-4 pt-2">
                                    <a
                                        href="https://instagram.com/avierafit"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[var(--acc)] hover:underline"
                                    >
                                        Instagram
                                    </a>
                                    <a
                                        href="https://tiktok.com/@avierafit"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[var(--acc)] hover:underline"
                                    >
                                        TikTok
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Back to top */}
                <div className="mt-16 pt-8 border-t border-white/10 text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-[var(--txt-muted)] hover:text-[var(--acc)] transition"
                    >
                        <ArrowLeft size={16} />
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
