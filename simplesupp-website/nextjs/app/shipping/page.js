'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Truck, Package, Globe, MapPin, Clock, Mail } from 'lucide-react';

export default function ShippingPolicyPage() {
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
                            <Truck size={28} className="text-[var(--acc)]" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold">Shipping Policy</h1>
                    </div>
                    <p className="text-[var(--txt-muted)]">Last Updated: February 23, 2026</p>
                </div>

                <div className="space-y-10 text-[var(--txt-muted)] leading-relaxed">

                    {/* Order Processing */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <Package size={24} className="text-[var(--acc)]" />
                            <h2 className="text-2xl font-semibold text-[var(--txt)]">Order Processing</h2>
                        </div>
                        <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                            <p className="mb-4">
                                All orders are processed by our fulfillment partner. Orders are typically processed within
                                <strong className="text-[var(--txt)]"> 2 to 5 business days</strong>. Processing times may vary
                                during periods of high demand, holidays, or product launches.
                            </p>
                            <p>
                                Once your order has shipped, you will receive a confirmation email with tracking information.
                            </p>
                        </div>
                    </section>

                    {/* Domestic Shipping */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <MapPin size={24} className="text-[var(--acc)]" />
                            <h2 className="text-2xl font-semibold text-[var(--txt)]">Domestic Shipping (United States)</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                                <p className="mb-3">
                                    We ship within the United States using major carriers selected by our fulfillment partner.
                                </p>
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--acc)]/10 border border-[var(--acc)]/20">
                                    <Clock size={20} className="text-[var(--acc)]" />
                                    <span>
                                        <strong className="text-[var(--txt)]">Estimated delivery:</strong> 3 to 7 business days after processing
                                    </span>
                                </div>
                            </div>
                            <p>
                                Shipping rates are calculated at checkout based on order weight, dimensions, and delivery location.
                            </p>
                        </div>
                    </section>

                    {/* International Shipping */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <Globe size={24} className="text-[var(--acc)]" />
                            <h2 className="text-2xl font-semibold text-[var(--txt)]">International Shipping</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                                <p className="mb-3">
                                    We offer international shipping to select countries. Availability and rates are determined at checkout.
                                </p>
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--acc)]/10 border border-[var(--acc)]/20">
                                    <Clock size={20} className="text-[var(--acc)]" />
                                    <span>
                                        <strong className="text-[var(--txt)]">Estimated delivery:</strong> 7 to 14 business days after processing
                                    </span>
                                </div>
                            </div>

                            <div
                                className="p-4 rounded-xl"
                                style={{
                                    background: 'rgba(255, 200, 50, 0.1)',
                                    border: '1px solid rgba(255, 200, 50, 0.3)',
                                }}
                            >
                                <p className="text-sm">
                                    <strong className="text-yellow-400">Important:</strong> Customers are responsible for any customs duties,
                                    taxes, import fees, or additional charges imposed by their country. We ship under Delivery Duties Unpaid
                                    (DDU) terms unless otherwise specified at checkout.
                                </p>
                            </div>

                            <p>
                                Shipping to certain regions such as Alaska, Hawaii, or remote international areas may have limitations
                                or extended delivery times.
                            </p>
                        </div>
                    </section>

                    {/* Tracking */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <Package size={24} className="text-[var(--acc)]" />
                            <h2 className="text-2xl font-semibold text-[var(--txt)]">Tracking</h2>
                        </div>
                        <p>
                            All orders include tracking information sent via email once the order ships. You can use this tracking
                            number to monitor your package&apos;s progress through the carrier&apos;s website.
                        </p>
                    </section>

                    {/* Lost or Delayed */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <Clock size={24} className="text-[var(--acc)]" />
                            <h2 className="text-2xl font-semibold text-[var(--txt)]">Lost or Delayed Shipments</h2>
                        </div>
                        <p className="mb-4">
                            AvieraFit is not responsible for delays caused by shipping carriers, customs processing, or events
                            outside our control.
                        </p>
                        <p>
                            If your package appears lost, please contact us at{' '}
                            <a href="mailto:info@avierafit.com" className="text-[var(--acc)] hover:underline">
                                info@avierafit.com
                            </a>{' '}
                            and we will work with the carrier to locate your shipment.
                        </p>
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
                            <p className="mb-2">For any shipping questions, contact us at:</p>
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
