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
          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
        <button
          type="submit"
          disabled={!consent}
          className="w-full px-4 py-2 bg-gradient-to-r from-primary to-purple text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
        >
          {submitted ? <><Check size={16} className="inline mr-1" /> Subscribed!</> : 'Subscribe'}
        </button>
        <label className="flex items-start text-xs">
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
    <div className="bg-gradient-to-br from-primary/10 to-purple/10 rounded-2xl p-8 border border-primary/20">
      <div className="max-w-md mx-auto text-center">
        <Mail className="mx-auto mb-4 text-primary" size={48} />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {title || 'Start Smarter—Get Our Free Starter Guide'}
        </h3>
        <p className="text-gray-600 mb-6">
          {description || 'Evidence-based supplement tips delivered to your inbox. No spam, unsubscribe anytime.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none transition"
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
            <span className="text-gray-600">
              I agree to receive helpful supplement tips and guides. No spam. Unsubscribe anytime.
            </span>
          </label>

          <button
            type="submit"
            disabled={!consent || !email}
            className="w-full px-6 py-3 bg-gradient-to-r from-primary to-purple text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitted ? (
              <span className="flex items-center justify-center">
                <Check size={20} className="mr-2" />
                Success! Check your email
              </span>
            ) : (
              'Get Free Guide'
            )}
          </button>

          <p className="text-xs text-gray-500">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </form>
      </div>
    </div>
  );
}
