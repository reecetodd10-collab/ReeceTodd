'use client';

import React from 'react';
import Link from 'next/link';
import {
    ArrowLeft, FileText, Users, ShoppingCart, CreditCard,
    Truck, RefreshCw, Database, Lock, AlertTriangle,
    Scale, Shield, Globe, Mail, Sparkles, Package
} from 'lucide-react';

export default function TermsOfServicePage() {
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
                            <FileText size={28} className="text-[var(--acc)]" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold">Terms of Service</h1>
                    </div>
                    <p className="text-[var(--txt-muted)]">Last Updated: February 23, 2026</p>
                </div>

                {/* Overview */}
                <div
                    className="p-6 rounded-2xl mb-12"
                    style={{
                        background: 'rgba(0, 217, 255, 0.05)',
                        border: '1px solid rgba(0, 217, 255, 0.15)',
                    }}
                >
                    <h2 className="text-xl font-semibold text-[var(--txt)] mb-4">Overview</h2>
                    <p className="text-[var(--txt-muted)] leading-relaxed mb-4">
                        Welcome to AvieraFit. The terms &quot;we,&quot; &quot;us,&quot; and &quot;our&quot; refer to AvieraFit. We operate this website
                        and related services to provide supplement products, educational content, personalized performance tools,
                        and subscription based supplement programs, including the Supplement Optimization Score and AI generated insights.
                    </p>
                    <p className="text-[var(--txt-muted)] leading-relaxed">
                        These Terms govern your access to and use of our website, products, dashboard features, and related services.
                        By accessing or using our Services, you agree to be bound by these Terms and our{' '}
                        <Link href="/privacy" className="text-[var(--acc)] hover:underline">Privacy Policy</Link>.
                        If you do not agree, you must not use our Services.
                    </p>
                </div>

                <div className="space-y-10 text-[var(--txt-muted)] leading-relaxed">

                    {/* Section 1 */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--acc)]/20 text-[var(--acc)] font-bold text-sm">1</div>
                            <Users size={20} className="text-[var(--acc)]" />
                            <h2 className="text-xl font-semibold text-[var(--txt)]">Access and Eligibility</h2>
                        </div>
                        <div className="pl-11 space-y-4">
                            <p>
                                You must be at least <strong className="text-[var(--txt)]">18 years of age</strong> to use our Services
                                or purchase products. By using the Services, you represent that you meet this requirement.
                            </p>
                            <p>
                                If you create an account, you agree to provide accurate and complete information and to keep your
                                login credentials secure. We use third party authentication providers, including Clerk, to manage
                                secure account access.
                            </p>
                            <p className="font-medium text-[var(--txt)]">
                                You are responsible for all activity that occurs under your account.
                            </p>
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--acc)]/20 text-[var(--acc)] font-bold text-sm">2</div>
                            <Sparkles size={20} className="text-[var(--acc)]" />
                            <h2 className="text-xl font-semibold text-[var(--txt)]">Supplement Optimization Score and AI Tools</h2>
                        </div>
                        <div className="pl-11 space-y-4">
                            <p>
                                AvieraFit provides an interactive quiz known as the <strong className="text-[var(--txt)]">Supplement Optimization Score</strong>.
                                This tool collects information you voluntarily provide regarding fitness goals, sleep, energy, recovery,
                                and related wellness factors. Artificial intelligence systems generate summaries and product suggestions
                                based on your responses.
                            </p>
                            <div
                                className="p-4 rounded-xl"
                                style={{
                                    background: 'rgba(255, 200, 50, 0.1)',
                                    border: '1px solid rgba(255, 200, 50, 0.3)',
                                }}
                            >
                                <div className="flex items-start gap-3">
                                    <AlertTriangle size={20} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-yellow-400 mb-1">Important Notice</p>
                                        <p className="text-sm">
                                            AI generated outputs are for informational purposes only and should not be considered medical advice.
                                            These outputs may contain inaccuracies. Your reliance on such outputs is at your own risk.
                                            Always consult with a healthcare professional before starting any supplement regimen.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--acc)]/20 text-[var(--acc)] font-bold text-sm">3</div>
                            <Package size={20} className="text-[var(--acc)]" />
                            <h2 className="text-xl font-semibold text-[var(--txt)]">Products and Supplements</h2>
                        </div>
                        <div className="pl-11 space-y-4">
                            <p>
                                We sell dietary supplements and related products through our ecommerce platform powered by Shopify.
                            </p>
                            <div
                                className="p-4 rounded-xl bg-white/5 border border-white/10"
                            >
                                <p className="text-sm italic">
                                    <strong className="text-[var(--txt)]">FDA Disclaimer:</strong> Statements regarding supplements have not been
                                    evaluated by the Food and Drug Administration unless explicitly stated. Products are not intended to diagnose,
                                    treat, cure, or prevent any disease.
                                </p>
                            </div>
                            <p>
                                Individual results vary. We do not guarantee specific performance, body composition, energy, sleep,
                                or recovery outcomes.
                            </p>
                        </div>
                    </section>

                    {/* Section 4 */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--acc)]/20 text-[var(--acc)] font-bold text-sm">4</div>
                            <RefreshCw size={20} className="text-[var(--acc)]" />
                            <h2 className="text-xl font-semibold text-[var(--txt)]">Subscriptions</h2>
                        </div>
                        <div className="pl-11 space-y-4">
                            <p>
                                We may offer subscription based products or services, including recurring supplement shipments
                                or premium dashboard features.
                            </p>
                            <p>
                                By enrolling in a subscription, you authorize us to charge your designated payment method on a
                                recurring basis at the interval disclosed at the time of purchase.
                            </p>
                            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                                <h4 className="font-semibold text-[var(--txt)] mb-2">Cancellation Policy</h4>
                                <p className="text-sm">
                                    You may cancel your subscription at any time through your account dashboard or by contacting
                                    customer support. Cancellation will apply to future billing cycles and does not retroactively
                                    refund previously processed payments unless required by law or stated in a specific refund policy.
                                </p>
                            </div>
                            <p>
                                We reserve the right to modify subscription pricing with reasonable notice as required by applicable law.
                            </p>
                        </div>
                    </section>

                    {/* Section 5 */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--acc)]/20 text-[var(--acc)] font-bold text-sm">5</div>
                            <CreditCard size={20} className="text-[var(--acc)]" />
                            <h2 className="text-xl font-semibold text-[var(--txt)]">Orders and Payment</h2>
                        </div>
                        <div className="pl-11 space-y-4">
                            <p>
                                When you place an order, you make an offer to purchase. We reserve the right to accept or decline any order.
                            </p>
                            <p>
                                Payments are processed securely through Shopify and its payment providers.
                                <strong className="text-[var(--txt)]"> We do not store full payment card details.</strong>
                            </p>
                            <p>
                                You agree to provide accurate billing and shipping information and authorize charges to your
                                selected payment method.
                            </p>
                        </div>
                    </section>

                    {/* Section 6 */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--acc)]/20 text-[var(--acc)] font-bold text-sm">6</div>
                            <Truck size={20} className="text-[var(--acc)]" />
                            <h2 className="text-xl font-semibold text-[var(--txt)]">Shipping and Risk of Loss</h2>
                        </div>
                        <div className="pl-11 space-y-4">
                            <p>
                                Delivery timeframes are estimates only. Once products are transferred to the shipping carrier,
                                risk of loss passes to you.
                            </p>
                            <p>
                                We are not responsible for shipping delays caused by carriers or events outside our control.
                            </p>
                        </div>
                    </section>

                    {/* Section 7 */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--acc)]/20 text-[var(--acc)] font-bold text-sm">7</div>
                            <RefreshCw size={20} className="text-[var(--acc)]" />
                            <h2 className="text-xl font-semibold text-[var(--txt)]">Returns and Refunds</h2>
                        </div>
                        <div className="pl-11">
                            <p>
                                All returns and refunds are governed by our Refund Policy, which is incorporated into these Terms.
                                For questions about returns, please contact us at{' '}
                                <a href="mailto:info@avierafit.com" className="text-[var(--acc)] hover:underline">info@avierafit.com</a>.
                            </p>
                        </div>
                    </section>

                    {/* Section 8 */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--acc)]/20 text-[var(--acc)] font-bold text-sm">8</div>
                            <Database size={20} className="text-[var(--acc)]" />
                            <h2 className="text-xl font-semibold text-[var(--txt)]">Dashboard and Account Data</h2>
                        </div>
                        <div className="pl-11 space-y-4">
                            <p>
                                If you create an account, your quiz responses, optimization scores, AI summaries, subscription data,
                                and interaction history may be stored in secure database systems including Supabase.
                            </p>
                            <p>
                                We may analyze aggregated and anonymized data to improve our Services. We do not sell personal
                                account data in the traditional sense of selling customer lists.
                            </p>
                        </div>
                    </section>

                    {/* Section 9 */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--acc)]/20 text-[var(--acc)] font-bold text-sm">9</div>
                            <Lock size={20} className="text-[var(--acc)]" />
                            <h2 className="text-xl font-semibold text-[var(--txt)]">Intellectual Property</h2>
                        </div>
                        <div className="pl-11 space-y-4">
                            <p>
                                All content on the Services, including text, branding, quiz structure, scoring methodology,
                                and AI system prompts, are the property of AvieraFit or its licensors and are protected by
                                intellectual property laws.
                            </p>
                            <p className="font-medium text-[var(--txt)]">
                                You may not reproduce, distribute, or exploit any content without prior written consent.
                            </p>
                        </div>
                    </section>

                    {/* Section 10 */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--acc)]/20 text-[var(--acc)] font-bold text-sm">10</div>
                            <AlertTriangle size={20} className="text-[var(--acc)]" />
                            <h2 className="text-xl font-semibold text-[var(--txt)]">Prohibited Uses</h2>
                        </div>
                        <div className="pl-11">
                            <p className="mb-3">You agree not to:</p>
                            <ul className="space-y-2">
                                <li>• Misuse the Services</li>
                                <li>• Attempt to reverse engineer our systems</li>
                                <li>• Scrape data from the platform</li>
                                <li>• Interfere with security features</li>
                                <li>• Use the platform for unlawful purposes</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 11 */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--acc)]/20 text-[var(--acc)] font-bold text-sm">11</div>
                            <Shield size={20} className="text-[var(--acc)]" />
                            <h2 className="text-xl font-semibold text-[var(--txt)]">Disclaimer of Warranties</h2>
                        </div>
                        <div className="pl-11">
                            <div
                                className="p-4 rounded-xl bg-white/5 border border-white/10"
                            >
                                <p className="uppercase text-xs font-bold text-[var(--txt)] mb-2 tracking-wider">Legal Notice</p>
                                <p className="text-sm">
                                    The Services and all products are provided <strong className="text-[var(--txt)]">&quot;as is&quot;</strong> and{' '}
                                    <strong className="text-[var(--txt)]">&quot;as available&quot;</strong> without warranties of any kind.
                                    To the fullest extent permitted by law, we disclaim all implied warranties including merchantability
                                    and fitness for a particular purpose.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 12 */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--acc)]/20 text-[var(--acc)] font-bold text-sm">12</div>
                            <Scale size={20} className="text-[var(--acc)]" />
                            <h2 className="text-xl font-semibold text-[var(--txt)]">Limitation of Liability</h2>
                        </div>
                        <div className="pl-11 space-y-4">
                            <p>
                                To the fullest extent permitted by law, AvieraFit and its affiliates shall not be liable for any
                                indirect, incidental, special, or consequential damages arising from your use of the Services or products.
                            </p>
                            <p>
                                In no event shall our total liability exceed the amount you paid for the product or subscription
                                giving rise to the claim.
                            </p>
                        </div>
                    </section>

                    {/* Section 13 */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--acc)]/20 text-[var(--acc)] font-bold text-sm">13</div>
                            <AlertTriangle size={20} className="text-[var(--acc)]" />
                            <h2 className="text-xl font-semibold text-[var(--txt)]">Assumption of Risk</h2>
                        </div>
                        <div className="pl-11">
                            <p>
                                You acknowledge that participation in fitness activities and the use of dietary supplements involve
                                inherent risks. You voluntarily assume all risks associated with your use of our products and Services.
                            </p>
                        </div>
                    </section>

                    {/* Section 14 */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--acc)]/20 text-[var(--acc)] font-bold text-sm">14</div>
                            <Shield size={20} className="text-[var(--acc)]" />
                            <h2 className="text-xl font-semibold text-[var(--txt)]">Indemnification</h2>
                        </div>
                        <div className="pl-11">
                            <p>
                                You agree to indemnify and hold harmless AvieraFit and its affiliates from claims arising out of
                                your misuse of the Services or violation of these Terms.
                            </p>
                        </div>
                    </section>

                    {/* Section 15 */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--acc)]/20 text-[var(--acc)] font-bold text-sm">15</div>
                            <Globe size={20} className="text-[var(--acc)]" />
                            <h2 className="text-xl font-semibold text-[var(--txt)]">Governing Law</h2>
                        </div>
                        <div className="pl-11">
                            <p>
                                These Terms shall be governed by the laws of the <strong className="text-[var(--txt)]">State of California</strong>.
                                Any disputes arising under these Terms shall be resolved in the courts of California.
                            </p>
                        </div>
                    </section>

                    {/* Section 16 */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--acc)]/20 text-[var(--acc)] font-bold text-sm">16</div>
                            <FileText size={20} className="text-[var(--acc)]" />
                            <h2 className="text-xl font-semibold text-[var(--txt)]">Changes to Terms</h2>
                        </div>
                        <div className="pl-11">
                            <p>
                                We may update these Terms at any time. Updates will be posted on this page with a revised
                                &quot;Last Updated&quot; date. Continued use of the Services constitutes acceptance of revised Terms.
                            </p>
                        </div>
                    </section>

                    {/* Contact */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <Mail size={24} className="text-[var(--acc)]" />
                            <h2 className="text-2xl font-semibold text-[var(--txt)]">Contact Us</h2>
                        </div>
                        <p className="mb-6">If you have any questions about these Terms of Service, please contact us:</p>
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
