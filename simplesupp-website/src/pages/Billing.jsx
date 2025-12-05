import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Calendar, Download, Settings, Crown } from 'lucide-react';
import GlassCard from '../components/shared/GlassCard';
import Button from '../components/shared/Button';

export default function Billing() {
  // Mock data - would come from backend
  const subscription = {
    plan: 'Premium',
    price: '$9.99',
    billingCycle: 'month',
    nextBillingDate: 'Dec 15, 2024',
    paymentMethod: '•••• 4242',
    status: 'active',
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-normal mb-2 text-[var(--txt)]">Billing & Subscription</h1>
        <p className="text-lg text-[var(--txt-muted)]">Manage your premium subscription</p>
      </div>

      {/* Current Plan */}
      <GlassCard className="p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[var(--acc)]/20 rounded-full flex items-center justify-center">
              <Crown className="text-[var(--acc)]" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-normal text-[var(--txt)]">
                {subscription.plan} - {subscription.price}/{subscription.billingCycle}
              </h2>
              <p className="text-sm text-[var(--txt-muted)]">Status: <span className="text-green-500 font-normal">{subscription.status}</span></p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-center gap-3 p-4 bg-[var(--bg-elev-1)] rounded-lg">
            <Calendar className="text-[var(--acc)]" size={20} />
            <div>
              <p className="text-sm text-[var(--txt-muted)]">Next Billing Date</p>
              <p className="font-normal text-[var(--txt)]">{subscription.nextBillingDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-[var(--bg-elev-1)] rounded-lg">
            <CreditCard className="text-[var(--acc)]" size={20} />
            <div>
              <p className="text-sm text-[var(--txt-muted)]">Payment Method</p>
              <p className="font-normal text-[var(--txt)]">{subscription.paymentMethod}</p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Actions */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="text-[var(--acc)]" size={24} />
            <h3 className="text-lg font-normal text-[var(--txt)]">Payment Method</h3>
          </div>
          <p className="text-sm text-[var(--txt-muted)] mb-4">
            Update your payment information
          </p>
          <Button variant="secondary" className="w-full" disabled>
            <Settings size={16} />
            Update Payment Method
          </Button>
          <p className="text-xs text-[var(--txt-muted)] mt-2 text-center">Coming soon</p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Download className="text-[var(--acc)]" size={24} />
            <h3 className="text-lg font-normal text-[var(--txt)]">Invoices</h3>
          </div>
          <p className="text-sm text-[var(--txt-muted)] mb-4">
            Download your billing history
          </p>
          <Button variant="secondary" className="w-full" disabled>
            <Download size={16} />
            Download Invoices
          </Button>
          <p className="text-xs text-[var(--txt-muted)] mt-2 text-center">Coming soon</p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="text-[var(--acc)]" size={24} />
            <h3 className="text-lg font-normal text-[var(--txt)]">Cancel Subscription</h3>
          </div>
          <p className="text-sm text-[var(--txt-muted)] mb-4">
            Cancel your premium subscription
          </p>
          <Button variant="secondary" className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30" disabled>
            Cancel Subscription
          </Button>
          <p className="text-xs text-[var(--txt-muted)] mt-2 text-center">Coming soon</p>
        </GlassCard>
      </div>

      {/* Note */}
      <GlassCard className="p-6">
        <p className="text-sm text-[var(--txt-muted)] text-center">
          Billing management features are coming soon. For now, premium features are available in testing mode.
        </p>
      </GlassCard>
    </div>
  );
}

