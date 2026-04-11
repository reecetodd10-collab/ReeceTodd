'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowser } from '../lib/supabase-browser';
import PageLayout, { TOKENS, FONTS, FadeInSection } from '../components/PageLayout';

const supabase = getSupabaseBrowser();

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const AppleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={TOKENS.INK}>
    <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.18 0-.36-.02-.53-.06-.01-.12-.04-.3-.04-.49 0-1.13.535-2.22 1.207-3.01C13.514 1.77 14.802 1.08 15.93 1c.015.14.036.28.036.43zM20.61 17.21c-.27.64-.58 1.23-.96 1.78-.53.76-1.22 1.7-2.09 1.7-.76 0-1.27-.5-2.5-.51-1.26 0-1.81.52-2.63.53-.84.01-1.48-.88-2.01-1.64-1.46-2.11-2.57-5.96-1.07-8.56.74-1.28 2.07-2.1 3.51-2.12 1.03-.02 1.63.55 2.47.55.82 0 1.32-.55 2.5-.55.61 0 2.12.23 3.13 1.76-.08.05-1.87 1.09-1.85 3.26.03 2.59 2.27 3.45 2.3 3.46-.03.09-.36 1.24-.8 2.34z"/>
  </svg>
);

function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: 'transparent' };
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score: 1, label: 'Weak', color: '#FF3B3B' };
  if (score === 2) return { score: 2, label: 'Fair', color: '#F97316' };
  if (score === 3) return { score: 3, label: 'Good', color: '#FFD700' };
  if (score === 4) return { score: 4, label: 'Strong', color: TOKENS.CYAN };
  return { score: 5, label: 'Locked in', color: TOKENS.CYAN };
}

const inputCls = 'w-full outline-none transition-all duration-200';

export default function AuthPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setError('');
  };

  const isSignIn = activeTab === 'signin';
  const strength = getPasswordStrength(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignIn) {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (authError) throw authError;
        router.push('/dashboard');
      } else {
        if (form.password !== form.confirmPassword) throw new Error('Passwords do not match');
        if (!agreedToTerms) throw new Error('You must agree to the Terms of Service');
        const { data, error: authError } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: { full_name: form.name },
            emailRedirectTo: window.location.origin + '/auth/callback?next=/dashboard',
          },
        });
        if (authError) throw authError;
        if (data.session) {
          router.push('/dashboard');
        } else {
          setSuccessMessage('Check your email for a confirmation link, then come back and sign in.');
        }
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin + '/auth/callback?next=/dashboard' },
      });
      if (authError) throw authError;
    } catch (err) {
      setError(err.message || 'Google sign-in failed');
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: { redirectTo: window.location.origin + '/auth/callback?next=/dashboard' },
      });
      if (authError) throw authError;
    } catch (err) {
      setError(err.message || 'Apple sign-in failed');
      setLoading(false);
    }
  };

  const inputStyle = {
    ...FONTS.mono,
    fontSize: '13px',
    padding: '14px 16px',
    background: '#ffffff',
    border: '1.5px solid rgba(0,0,0,0.12)',
    borderRadius: '10px',
    color: TOKENS.INK,
  };

  const focusBorder = `1.5px solid ${TOKENS.CYAN}`;

  return (
    <PageLayout>
      {/* Hero strip */}
      <section style={{ background: '#000', paddingTop: '100px', paddingBottom: '40px', zIndex: 10 }} className="relative">
        <div className="max-w-[430px] md:max-w-xl mx-auto px-5 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ ...FONTS.mono, fontSize: '10px', letterSpacing: '0.3em', color: TOKENS.CYAN, textTransform: 'uppercase', marginBottom: '12px' }}
          >
            Welcome to Aviera
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-[36px] md:text-[52px]"
            style={{ ...FONTS.oswald, fontWeight: 700, textTransform: 'uppercase', color: '#fff', lineHeight: 0.95, marginBottom: '10px' }}
          >
            {isSignIn ? 'Sign In' : 'Create Account'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            style={{ ...FONTS.mono, fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}
          >
            {isSignIn ? 'Welcome back. Pick up where you left off.' : 'Join Aviera. Your stack starts here.'}
          </motion.p>
        </div>
      </section>

      {/* Auth form */}
      <section style={{ background: TOKENS.CREAM, color: TOKENS.INK }}>
        <div className="max-w-[430px] md:max-w-md mx-auto px-5 md:px-8 py-12 md:py-16">
          {/* Tabs */}
          <div className="flex mb-8" style={{ borderBottom: '1.5px solid rgba(0,0,0,0.08)' }}>
            {['signin', 'signup'].map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setError(''); setSuccessMessage(''); }}
                className="flex-1 py-3 border-none cursor-pointer transition-all duration-200"
                style={{
                  ...FONTS.oswald,
                  fontSize: '13px',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  background: 'transparent',
                  color: activeTab === tab ? TOKENS.CYAN : 'rgba(0,0,0,0.4)',
                  borderBottom: activeTab === tab ? `2px solid ${TOKENS.CYAN}` : '2px solid transparent',
                }}
              >
                {tab === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* Success message */}
          {successMessage && (
            <div className="mb-6 p-4" style={{ background: `${TOKENS.CYAN}18`, border: `1.5px solid ${TOKENS.CYAN}40`, borderRadius: '10px' }}>
              <p style={{ ...FONTS.mono, fontSize: '11px', color: TOKENS.CYAN }}>{successMessage}</p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4" style={{ background: 'rgba(255,59,59,0.08)', border: '1.5px solid rgba(255,59,59,0.25)', borderRadius: '10px' }}>
              <p style={{ ...FONTS.mono, fontSize: '11px', color: '#FF3B3B' }}>{error}</p>
            </div>
          )}

          {/* OAuth buttons */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-3 cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
              style={{
                ...FONTS.mono,
                fontSize: '11px',
                background: '#fff',
                border: '1.5px solid rgba(0,0,0,0.12)',
                borderRadius: '10px',
                color: TOKENS.INK,
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <GoogleIcon /> Google
            </button>
            <button
              onClick={handleAppleSignIn}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-3 cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
              style={{
                ...FONTS.mono,
                fontSize: '11px',
                background: '#fff',
                border: '1.5px solid rgba(0,0,0,0.12)',
                borderRadius: '10px',
                color: TOKENS.INK,
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <AppleIcon /> Apple
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px" style={{ background: 'rgba(0,0,0,0.1)' }} />
            <span style={{ ...FONTS.mono, fontSize: '9px', color: 'rgba(0,0,0,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              or with email
            </span>
            <div className="flex-1 h-px" style={{ background: 'rgba(0,0,0,0.1)' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {!isSignIn && (
              <div className="mb-4">
                <label style={{ ...FONTS.oswald, fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(0,0,0,0.5)', display: 'block', marginBottom: '6px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={handleChange('name')}
                  placeholder="Your name"
                  className={inputCls}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.border = focusBorder)}
                  onBlur={(e) => (e.target.style.border = inputStyle.border)}
                />
              </div>
            )}

            <div className="mb-4">
              <label style={{ ...FONTS.oswald, fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(0,0,0,0.5)', display: 'block', marginBottom: '6px' }}>
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                placeholder="you@email.com"
                required
                className={inputCls}
                style={inputStyle}
                onFocus={(e) => (e.target.style.border = focusBorder)}
                onBlur={(e) => (e.target.style.border = inputStyle.border)}
              />
            </div>

            <div className="mb-4">
              <label style={{ ...FONTS.oswald, fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(0,0,0,0.5)', display: 'block', marginBottom: '6px' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange('password')}
                  placeholder="••••••••"
                  required
                  className={inputCls}
                  style={{ ...inputStyle, paddingRight: '48px' }}
                  onFocus={(e) => (e.target.style.border = focusBorder)}
                  onBlur={(e) => (e.target.style.border = inputStyle.border)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer"
                  style={{ ...FONTS.mono, fontSize: '9px', color: TOKENS.CYAN, textTransform: 'uppercase', letterSpacing: '0.1em' }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {/* Password strength */}
              {!isSignIn && form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((seg) => (
                      <div
                        key={seg}
                        className="flex-1 h-1 rounded-full"
                        style={{ background: seg <= strength.score ? strength.color : 'rgba(0,0,0,0.08)' }}
                      />
                    ))}
                  </div>
                  <p style={{ ...FONTS.mono, fontSize: '9px', color: strength.color }}>{strength.label}</p>
                </div>
              )}
            </div>

            {!isSignIn && (
              <>
                <div className="mb-4">
                  <label style={{ ...FONTS.oswald, fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(0,0,0,0.5)', display: 'block', marginBottom: '6px' }}>
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={form.confirmPassword}
                      onChange={handleChange('confirmPassword')}
                      placeholder="••••••••"
                      required
                      className={inputCls}
                      style={{ ...inputStyle, paddingRight: '48px' }}
                      onFocus={(e) => (e.target.style.border = focusBorder)}
                      onBlur={(e) => (e.target.style.border = inputStyle.border)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer"
                      style={{ ...FONTS.mono, fontSize: '9px', color: TOKENS.CYAN, textTransform: 'uppercase', letterSpacing: '0.1em' }}
                    >
                      {showConfirmPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <label className="flex items-start gap-3 mb-6 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={() => setAgreedToTerms(!agreedToTerms)}
                    className="mt-0.5"
                    style={{ accentColor: TOKENS.CYAN, width: '16px', height: '16px' }}
                  />
                  <span style={{ ...FONTS.mono, fontSize: '10px', color: 'rgba(0,0,0,0.6)', lineHeight: 1.5 }}>
                    I agree to the{' '}
                    <Link href="/terms" style={{ color: TOKENS.CYAN, textDecoration: 'underline' }}>Terms of Service</Link>{' '}
                    and{' '}
                    <Link href="/privacy" style={{ color: TOKENS.CYAN, textDecoration: 'underline' }}>Privacy Policy</Link>
                  </span>
                </label>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full border-none cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
              style={{
                ...FONTS.oswald,
                padding: '16px',
                background: TOKENS.CYAN,
                color: TOKENS.INK,
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                borderRadius: '10px',
                boxShadow: TOKENS.CYAN_GLOW,
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? 'Loading...' : isSignIn ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Bottom link */}
          <p className="text-center mt-6" style={{ ...FONTS.mono, fontSize: '11px', color: 'rgba(0,0,0,0.5)' }}>
            {isSignIn ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setActiveTab(isSignIn ? 'signup' : 'signin'); setError(''); setSuccessMessage(''); }}
              className="border-none bg-transparent cursor-pointer"
              style={{ ...FONTS.mono, fontSize: '11px', color: TOKENS.CYAN, fontWeight: 700 }}
            >
              {isSignIn ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </div>
      </section>
    </PageLayout>
  );
}
