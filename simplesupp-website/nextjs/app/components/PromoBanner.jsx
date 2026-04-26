'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CODE_KEY = 'aviera_promo_code';
const DISMISSED_KEY = 'aviera_promo_dismissed';

export default function PromoBanner() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [phase, setPhase] = useState('capture'); // capture | success
  const [discountCode, setDiscountCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedCode = localStorage.getItem(CODE_KEY);
    const dismissed = localStorage.getItem(DISMISSED_KEY);

    // If they already have a code, show it in success state
    if (savedCode) {
      setDiscountCode(savedCode);
      setPhase('success');
      // But if they dismissed the success bar, keep it hidden
      if (dismissed) return;
    }

    const t = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    setVisible(false);
    // Only remember dismissal if they already got their code
    if (phase === 'success') {
      localStorage.setItem(DISMISSED_KEY, Date.now().toString());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || loading) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/promo/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'promo_banner' }),
      });
      const data = await res.json();
      if (data.success) {
        setDiscountCode(data.discountCode);
        setPhase('success');
        localStorage.setItem(CODE_KEY, data.discountCode);
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch {
      setError('Failed to subscribe. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(discountCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const el = document.createElement('textarea');
      el.value = discountCode;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'fixed',
            top: '56px',
            left: 0,
            right: 0,
            zIndex: 45,
            overflow: 'hidden',
            background: '#F5F0EB',
            borderBottom: '2px solid #00b8d4',
          }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
            {phase === 'capture' ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', padding: '10px 0' }}>
                {/* Headline */}
                <span style={{
                  fontFamily: "'Orbitron', var(--font-oswald), sans-serif",
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  color: '#28282A',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}>
                  10% OFF YOUR FIRST ORDER
                </span>

                {/* Divider */}
                <span style={{ width: '1px', height: '16px', background: 'rgba(0,0,0,0.12)', flexShrink: 0 }} className="hidden sm:block" />

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    style={{
                      padding: '7px 14px',
                      borderRadius: '4px',
                      border: '1px solid rgba(0,0,0,0.12)',
                      background: '#ffffff',
                      color: '#28282A',
                      fontFamily: 'Montserrat, sans-serif',
                      fontSize: '13px',
                      outline: 'none',
                      width: '220px',
                      maxWidth: '50vw',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: '7px 18px',
                      borderRadius: '4px',
                      border: 'none',
                      background: '#00b8d4',
                      color: '#ffffff',
                      fontFamily: "'Orbitron', var(--font-oswald), sans-serif",
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      cursor: loading ? 'wait' : 'pointer',
                      opacity: loading ? 0.6 : 1,
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                      transition: 'opacity 0.2s',
                    }}
                  >
                    {loading ? '...' : 'GET CODE'}
                  </button>
                </form>

                {error && (
                  <span style={{ fontSize: '11px', color: '#d42020', fontFamily: 'Montserrat, sans-serif' }}>{error}</span>
                )}

                {/* Close */}
                <button
                  onClick={dismiss}
                  aria-label="Dismiss"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    color: 'rgba(0,0,0,0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    flexShrink: 0,
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              /* Success state */
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', padding: '10px 0' }}>
                <span style={{
                  fontFamily: "'Orbitron', var(--font-oswald), sans-serif",
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  color: '#28282A',
                  textTransform: 'uppercase',
                }}>
                  YOUR CODE
                </span>

                <button
                  onClick={handleCopy}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 16px',
                    borderRadius: '4px',
                    border: '2px solid #00b8d4',
                    background: 'rgba(0,184,212,0.06)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <span style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '14px',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    color: '#00b8d4',
                  }}>
                    {discountCode}
                  </span>
                  <span style={{
                    fontSize: '10px',
                    color: copied ? '#1a9a48' : 'rgba(0,0,0,0.35)',
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    {copied ? 'COPIED!' : 'COPY'}
                  </span>
                </button>

                <span style={{
                  fontSize: '11px',
                  color: 'rgba(0,0,0,0.4)',
                  fontFamily: 'Montserrat, sans-serif',
                }}>
                  Apply at checkout
                </span>

                <button
                  onClick={dismiss}
                  aria-label="Dismiss"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    color: 'rgba(0,0,0,0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    flexShrink: 0,
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
