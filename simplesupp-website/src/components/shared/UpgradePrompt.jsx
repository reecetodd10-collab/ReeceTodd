import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Zap, Sparkles, Download, MessageCircle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import { TESTING_MODE } from '../../lib/config';

export default function UpgradePrompt({ isOpen, onClose }) {
  // Don't render upgrade prompt in testing mode
  if (TESTING_MODE) {
    return null;
  }
  const features = [
    { icon: Sparkles, text: 'AI-Powered Supplement Stack' },
    { icon: Zap, text: 'Custom Workout Plans' },
    { icon: MessageCircle, text: 'AI Chat Coach' },
    { icon: Download, text: 'PDF Downloads' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Unlock Premium Features">
      <div className="text-center">
        <div className="mb-6">
          <Crown className="mx-auto mb-4 text-[var(--acc)]" size={48} />
          <h3 className="text-2xl font-bold mb-2 text-[var(--txt)]">Upgrade to Aviera Premium</h3>
          <p className="text-[var(--txt-muted)]">
            Get full access to AI-powered features and personalized plans.
          </p>
        </div>

        <div className="mb-6 space-y-3">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={i} className="flex items-center gap-3 text-left">
                <Icon size={20} className="text-[var(--acc)]" />
                <span className="text-[var(--txt-muted)]">{feature.text}</span>
              </div>
            );
          })}
        </div>

        <div className="mb-6 p-4 glass rounded-lg">
          <div className="text-3xl font-bold mb-1 text-[var(--txt)]">$9.99<span className="text-lg text-[var(--txt-muted)]">/month</span></div>
          <p className="text-[var(--txt-muted)] text-sm">Cancel anytime</p>
        </div>

        <div className="flex gap-3">
          <Link to="/pricing" className="flex-1">
            <Button variant="primary" className="w-full">
              Upgrade Now
            </Button>
          </Link>
          <Link to="/pricing" className="flex-1">
            <Button variant="secondary" className="w-full">
              Learn More
            </Button>
          </Link>
        </div>
        <p className="text-xs text-center text-[var(--txt-muted)] mt-4">
          Already premium? <Link to="/dashboard" className="text-[var(--acc)] hover:underline">Sign in</Link>
        </p>
      </div>
    </Modal>
  );
}
