'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, Package, AlertCircle, CheckCircle, XCircle, CreditCard, Mail, Globe } from 'lucide-react';

export default function ReturnPolicyPage() {
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
                            <RefreshCw size={28} className="text-[var(--acc)]" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold">Refund & Return Policy</h1>
                    </div>
                    <p className="text-[var(--txt-muted)]">Last Updated: February 23, 2026</p>
                </div>

                <div className="space-y-10 text-[var(--txt-muted)] leading-relaxed">

                    {/* Return Window */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <Package size={24} className="text-[var(--acc)]" />
                            <h2 className="text-2xl font-semibold text-[var(--txt)]">Return Window</h2>
                        </div>
                        <div
                            className="p-5 rounded-xl"
                            style={{
                                background: 'rgba(0, 217, 255, 0.05)',
                                border: '1px solid rgba(0, 217, 255, 0.2)',
                            }}
                        >
                            <p className="text-lg">
                                We offer a <strong className="text-[var(--acc)]">30 day return window</strong> from the date your order is delivered.
                            </p>
                        </div>
                    </section>

                    {/* Eligibility */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <CheckCircle size={24} className="text-[var(--acc)]" />
                            <h2 className="text-2xl font-semibold text-[var(--txt)]">Eligibility for Returns</h2>
                        </div>
                        <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                            <p className="mb-4">To be eligible for a return, items must be:</p>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2">
                                    <CheckCircle size={16} className="text-green-400" />
                                    Unopened and unused
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle size={16} className="text-green-400" />
                                    In their original packaging
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle size={16} className="text-green-400" />
                                    Accompanied by proof of purchase
                                </li>
                            </ul>
                        </div>
                        <div
                            className="mt-4 p-4 rounded-xl"
                            style={{
                                background: 'rgba(255, 200, 50, 0.1)',
                                border: '1px solid rgba(255, 200, 50, 0.3)',
                            }}
                        >
                            <div className="flex items-start gap-3">
                                <AlertCircle size={20} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                                <p className="text-sm">
                                    <strong className="text-yellow-400">Important:</strong> Because we sell ingestible supplement products,
                                    we do not accept returns of opened products for safety and quality control reasons.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* How to Start */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <RefreshCw size={24} className="text-[var(--acc)]" />
                            <h2 className="text-2xl font-semibold text-[var(--txt)]">How to Start a Return</h2>
                        </div>
                        <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-4">
                            <p>
                                To initiate a return, contact us at{' '}
                                <a href="mailto:info@avierafit.com" className="text-[var(--acc)] hover:underline">
                                    info@avierafit.com
                                </a>{' '}
                                with your order number and reason for return.
                            </p>
                            <p className="font-medium text-[var(--txt)]">
                                Items sent back without prior approval will not be accepted.
                            </p>
                            <p>
                                Return shipping costs are the responsibility of the customer unless the item was defective or incorrect.
                            </p>
                        </div>
                    </section>

                    {/* Damaged or Incorrect */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <AlertCircle size={24} className="text-[var(--acc)]" />
                            <h2 className="text-2xl font-semibold text-[var(--txt)]">Damaged or Incorrect Items</h2>
                        </div>
                        <p>
                            Please inspect your order upon arrival. If your item is damaged, defective, or incorrect,
                            contact us within <strong className="text-[var(--txt)]">7 days of delivery</strong>. We may request
                            photo documentation to evaluate the issue and determine an appropriate resolution.
                        </p>
                    </section>

                    {/* Non-Returnable */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <XCircle size={24} className="text-red-400" />
                            <h2 className="text-2xl font-semibold text-[var(--txt)]">Non-Returnable Items</h2>
                        </div>
                        <div className="p-5 rounded-xl bg-red-500/10 border border-red-500/20">
                            <p className="mb-3 text-red-400 font-medium">The following items cannot be returned:</p>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2">
                                    <XCircle size={16} className="text-red-400" />
                                    Opened supplement products
                                </li>
                                <li className="flex items-center gap-2">
                                    <XCircle size={16} className="text-red-400" />
                                    Gift cards
                                </li>
                                <li className="flex items-center gap-2">
                                    <XCircle size={16} className="text-red-400" />
                                    Items marked as final sale
                                </li>
                                <li className="flex items-center gap-2">
                                    <XCircle size={16} className="text-red-400" />
                                    Custom or personalized items
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Exchanges */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <RefreshCw size={24} className="text-[var(--acc)]" />
                            <h2 className="text-2xl font-semibold text-[var(--txt)]">Exchanges</h2>
                        </div>
                        <p>
                            We do not process direct exchanges. If you would like a different product, please return the eligible
                            item and place a new order.
                        </p>
                    </section>

                    {/* European Union */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <Globe size={24} className="text-[var(--acc)]" />
                            <h2 className="text-2xl font-semibold text-[var(--txt)]">European Union Customers</h2>
                        </div>
                        <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                            <p>
                                If your order is shipped to the European Union, you may have the right to cancel your order within
                                <strong className="text-[var(--txt)]"> 14 days of receipt</strong>. Products must remain unopened
                                and unused to qualify.
                            </p>
                        </div>
                    </section>

                    {/* Refunds */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <CreditCard size={24} className="text-[var(--acc)]" />
                            <h2 className="text-2xl font-semibold text-[var(--txt)]">Refunds</h2>
                        </div>
                        <div className="space-y-4">
                            <p>
                                Once we receive and inspect your return, we will notify you whether the refund is approved.
                            </p>
                            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                                <p>
                                    Approved refunds will be issued to your original payment method within
                                    <strong className="text-[var(--txt)]"> 10 business days</strong>. Processing time may vary
                                    depending on your bank or payment provider.
                                </p>
                            </div>
                            <p>
                                If more than 15 business days have passed since your refund was approved, contact us at{' '}
                                <a href="mailto:info@avierafit.com" className="text-[var(--acc)] hover:underline">
                                    info@avierafit.com
                                </a>.
                            </p>
                        </div>
                    </section>

                    {/* Contact */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <Mail size={24} className="text-[var(--acc)]" />
                            <h2 className="text-2xl font-semibold text-[var(--txt)]">Contact</h2>
                        </div>
                        <div
                            className="p-6 rounded-2xl"
                            style={{
                                background: 'rgba(0, 217, 255, 0.05)',
                                border: '1px solid rgba(0, 217, 255, 0.2)',
                            }}
                        >
                            <p className="mb-2">For return or refund questions, contact us at:</p>
                            <a href="mailto:info@avierafit.com" className="text-[var(--acc)] hover:underline text-lg font-semibold">
                                info@avierafit.com
                            </a>
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
