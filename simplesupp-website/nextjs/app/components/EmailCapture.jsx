'use client';

import React, { useState } from 'react';
import { Mail, Check } from 'lucide-react';

export default function EmailCapture({ compact = false, title, description }) {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !consent) return;

    // TODO: Connect to actual API endpoint
    console.log('Email submitted:', email);
    setSubmitted(true);
    setEmail('');
    setConsent(false);

    setTimeout(() => setSubmitted(false), 3000);
  };

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full px-4 py-2 rounded-lg bg-[var(--bg-elev-1)] border border-[var(--glass-border)] text-[var(--txt)] placeholder-[var(--txt-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--acc)]"
          required
        />
        <button
          type="submit"
          disabled={!consent}
          className="w-full px-4 py-2 bg-[var(--acc)] text-white rounded-lg font-medium hover:shadow-accent hover:bg-[var(--acc-hover)] transition-all disabled:opacity-50"
        >
          {submitted ? <><Check size={16} className="inline mr-1" /> Subscribed!</> : 'Join Now'}
        </button>
        <label className="flex items-start text-xs text-[var(--txt-muted)]">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 mr-2"
          />
          <span>I agree to receive emails. No spam, unsubscribe anytime.</span>
        </label>
      </form>
    );
  }

  return (
    <div className="bg-[var(--acc-light)] rounded-2xl p-8 border border-[var(--acc)]/20">
      <div className="max-w-md mx-auto text-center">
        <Mail className="mx-auto mb-4 text-[var(--acc)]" size={48} />
        <h3 className="text-2xl font-bold text-[var(--txt)] mb-2">
          {title || 'Join the Aviera Community'}
        </h3>
        <p className="text-[var(--txt-secondary)] mb-6">
          {description || 'Get early access, exclusive drops, and AI-backed supplement insights straight to your inbox.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-3 rounded-lg border-2 border-[var(--glass-border)] bg-[var(--bg-elev-1)] text-[var(--txt)] focus:border-[var(--acc)] focus:outline-none transition"
            required
          />

          <label className="flex items-start text-sm text-left">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 mr-2"
              required
            />
            <span className="text-[var(--txt-secondary)]">
              I agree to receive helpful supplement tips and guides. No spam. Unsubscribe anytime.
            </span>
          </label>

          <button
            type="submit"
            disabled={!consent || !email}
            className="w-full px-6 py-3 bg-[var(--acc)] text-white rounded-lg font-semibold hover:shadow-accent hover:bg-[var(--acc-hover)] transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitted ? (
              <span className="flex items-center justify-center">
                <Check size={20} className="mr-2" />
                Success! Check your email
              </span>
            ) : (
              'Join Now'
            )}
          </button>

          <p className="text-xs text-[var(--txt-muted)]">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </form>
      </div>
    </div>
  );
}

