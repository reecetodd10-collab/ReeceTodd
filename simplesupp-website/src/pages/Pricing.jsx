import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Check, 
  Sparkles, 
  Zap, 
  Download, 
  MessageCircle,
  Bell,
  ShoppingCart,
  RefreshCw
} from 'lucide-react';
import Button from '../components/shared/Button';
import GlassCard from '../components/shared/GlassCard';

export default function Pricing() {
  const features = [
    { icon: Sparkles, text: 'AI-Powered Supplement Stack', desc: 'Personalized recommendations' },
    { icon: Zap, text: 'Custom Workout Plans', desc: 'Progressive overload tracking' },
    { icon: MessageCircle, text: 'AI Chat Coach', desc: '24/7 fitness guidance' },
    { icon: Download, text: 'PDF Downloads', desc: 'Take your plans offline' },
    { icon: Bell, text: 'Push Notifications', desc: 'Never miss a dose' },
    { icon: ShoppingCart, text: '10% Off Supplements', desc: 'Discount on all orders' },
    { icon: RefreshCw, text: 'Weekly Plan Regeneration', desc: 'Fresh workouts every week' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Aviera Premium</h1>
          <p className="text-xl text-secondary">
            Unlock the full power of AI-powered fitness and supplements.
          </p>
        </div>

        {/* Pricing Card */}
        <GlassCard className="p-8 mb-12">
          <div className="text-center mb-8">
            <div className="text-5xl font-bold mb-2">
              $9.99<span className="text-2xl text-muted">/month</span>
            </div>
            <p className="text-secondary">Cancel anytime. No hidden fees.</p>
          </div>

          <div className="space-y-4 mb-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="flex items-start gap-4">
                  <div className="mt-1">
                    <Icon className="text-[var(--accent-blue)]" size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold mb-1">{feature.text}</div>
                    <div className="text-sm text-secondary">{feature.desc}</div>
                  </div>
                  <Check className="text-[var(--accent-blue)]" size={20} />
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/upgrade" className="flex-1">
              <Button variant="primary" className="w-full">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/upgrade" className="flex-1">
              <Button variant="secondary" className="w-full">
                Subscribe Now
              </Button>
            </Link>
          </div>
        </GlassCard>

        {/* Free vs Premium */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold mb-4">Free Tier</h3>
            <ul className="space-y-2 text-secondary">
              <li>• Basic supplement recommendations</li>
              <li>• Basic workout plans</li>
              <li>• One-time quiz access</li>
              <li>• View results</li>
              <li>• Shop supplements</li>
            </ul>
          </GlassCard>

          <GlassCard className="p-6 border-2 border-[var(--accent-blue)]">
            <h3 className="text-xl font-bold mb-4 text-[var(--accent-blue)]">Premium</h3>
            <ul className="space-y-2 text-secondary">
              <li>• AI-powered personalization</li>
              <li>• Custom workout plans</li>
              <li>• Stack builder with tracking</li>
              <li>• AI chat assistant</li>
              <li>• PDF downloads</li>
              <li>• 10% discount on all orders</li>
              <li>• Weekly plan regeneration</li>
            </ul>
          </GlassCard>
        </div>

        {/* FAQ */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">Questions?</h3>
          <Link to="/faq" className="text-[var(--accent-blue)] hover:underline">
            Visit our FAQ page →
          </Link>
        </div>
      </div>
    </div>
  );
}
