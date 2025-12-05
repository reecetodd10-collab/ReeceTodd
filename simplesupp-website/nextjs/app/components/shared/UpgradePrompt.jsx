'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Crown, Zap, Sparkles, Download, MessageCircle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import { TESTING_MODE } from '../../lib/config';

export default function UpgradePrompt({ isOpen, onClose }) {
  const router = useRouter();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const features = [
    { icon: Sparkles, text: 'AI-Powered Supplement Stack' },
    { icon: Zap, text: 'Custom Workout Plans' },
    { icon: MessageCircle, text: 'AI Chat Coach' },
    { icon: Download, text: 'PDF Downloads' },
  ];

  const handleUpgrade = async () => {
    if (!user) {
      router.push('/sign-in');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to start checkout. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Unlock Pro Features">
      <div className="text-center">
        <div className="mb-6">
          <Crown className="mx-auto mb-4 text-[var(--acc)]" size={48} />
          <h3 className="text-2xl font-bold mb-2 text-[var(--txt)]">Upgrade to Aviera Pro</h3>
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
          <Button 
            variant="primary" 
            className="flex-1 w-full"
            onClick={handleUpgrade}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Upgrade Now'}
          </Button>
          <Button 
            variant="secondary" 
            className="flex-1 w-full"
            onClick={onClose}
          >
            Learn More
          </Button>
        </div>
        <p className="text-xs text-center text-[var(--txt-muted)] mt-4">
          Already a Pro member? <button onClick={onClose} className="text-[var(--acc)] hover:underline">Close</button>
        </p>
      </div>
    </Modal>
  );
}

