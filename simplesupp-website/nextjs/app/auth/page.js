'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' },
  }),
};

const oswald = 'var(--font-oswald), Oswald, sans-serif';
const spaceMono = 'var(--font-space-mono), Space Mono, monospace';

const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  background: '#0a0a0a',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 4,
  color: '#ffffff',
  fontFamily: spaceMono,
  fontSize: 12,
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box',
};

const labelStyle = {
  display: 'block',
  fontFamily: oswald,
  fontSize: 9,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.2em',
  color: '#666',
  marginBottom: 6,
};

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const AppleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
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

  if (score <= 1) return { score: 1, label: 'Weak', color: '#ff2d55' };
  if (score === 2) return { score: 2, label: 'Fair', color: '#ff8c00' };
  if (score === 3) return { score: 3, label: 'Good', color: '#ffcc00' };
  if (score === 4) return { score: 4, label: 'Strong', color: '#ffffff' };
  return { score: 5, label: 'Locked in', color: '#ffffff' };
}

export default function AuthPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

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
        if (form.password !== form.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (!agreedToTerms) {
          throw new Error('You must agree to the Terms of Service');
        }
        const { error: authError } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: { full_name: form.name },
          },
        });
        if (authError) throw authError;
        router.push('/dashboard');
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
        options: {
          redirectTo: window.location.origin + '/dashboard',
        },
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
        options: {
          redirectTo: window.location.origin + '/dashboard',
        },
      });
      if (authError) throw authError;
    } catch (err) {
      setError(err.message || 'Apple sign-in failed');
      setLoading(false);
    }
  };

  let stepIndex = 0;
  const step = () => ++stepIndex;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#000000',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 430,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '0 24px 24px',
        }}
      >
        {/* Top strip */}
        <motion.div
          custom={step()}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            marginBottom: 40,
            padding: '8px 0',
          }}
        >
          <span
            style={{
              fontFamily: oswald,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: '#ffffff',
            }}
          >
            Aviera
          </span>
          <Link
            href="/home"
            style={{
              fontFamily: spaceMono,
              fontSize: 9,
              color: '#666',
              textTransform: 'uppercase',
              textDecoration: 'none',
            }}
          >
            &larr; Back to site
          </Link>
        </motion.div>

        {/* Auth tabs */}
        <motion.div
          custom={step()}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          style={{
            display: 'flex',
            marginBottom: 24,
          }}
        >
          <button
            onClick={() => { setActiveTab('signin'); setError(''); }}
            style={{
              flex: 1,
              fontFamily: oswald,
              fontSize: 12,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              textAlign: 'center',
              padding: '12px 0',
              color: isSignIn ? '#fff' : '#666',
              cursor: 'pointer',
              border: 'none',
              borderBottom: isSignIn ? '2px solid #fff' : '2px solid transparent',
              background: 'none',
              transition: 'all 0.2s',
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => { setActiveTab('signup'); setError(''); }}
            style={{
              flex: 1,
              fontFamily: oswald,
              fontSize: 12,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              textAlign: 'center',
              padding: '12px 0',
              color: !isSignIn ? '#fff' : '#666',
              cursor: 'pointer',
              border: 'none',
              borderBottom: !isSignIn ? '2px solid #fff' : '2px solid transparent',
              background: 'none',
              transition: 'all 0.2s',
            }}
          >
            Create Account
          </button>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Full Name (signup only) */}
          {!isSignIn && (
            <motion.div
              custom={step()}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              style={{ marginBottom: 16 }}
            >
              <label style={labelStyle}>Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={handleChange('name')}
                placeholder="Your full name"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#fff')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
              />
            </motion.div>
          )}

          {/* Email */}
          <motion.div
            custom={step()}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            style={{ marginBottom: 16 }}
          >
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              placeholder="you@email.com"
              style={{ ...inputStyle, '::placeholder': { color: '#333' } }}
              onFocus={(e) => (e.target.style.borderColor = '#fff')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
            />
          </motion.div>

          {/* Password */}
          <motion.div
            custom={step()}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            style={{ marginBottom: isSignIn ? 0 : 16 }}
          >
            <label style={labelStyle}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange('password')}
                placeholder="••••••••"
                style={{ ...inputStyle, padding: '14px 60px 14px 16px' }}
                onFocus={(e) => (e.target.style.borderColor = '#fff')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: 9,
                  color: '#666',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  fontFamily: spaceMono,
                  padding: 0,
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {isSignIn && (
              <div style={{ textAlign: 'right', marginTop: 6 }}>
                <Link
                  href="#"
                  style={{
                    fontSize: 9,
                    color: '#fff',
                    textDecoration: 'none',
                    fontFamily: spaceMono,
                  }}
                >
                  Forgot password?
                </Link>
              </div>
            )}
          </motion.div>

          {/* Confirm Password (signup only) */}
          {!isSignIn && (
            <motion.div
              custom={step()}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              style={{ marginBottom: 16 }}
            >
              <label style={labelStyle}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                  placeholder="••••••••"
                  style={{ ...inputStyle, padding: '14px 60px 14px 16px' }}
                  onFocus={(e) => (e.target.style.borderColor = '#fff')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: 9,
                    color: '#666',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                    fontFamily: spaceMono,
                    padding: 0,
                  }}
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </motion.div>
          )}

          {/* Password strength bar (signup only) */}
          {!isSignIn && form.password && (
            <motion.div
              custom={step()}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              style={{ marginBottom: 16 }}
            >
              <div
                style={{
                  width: '100%',
                  height: 2,
                  background: 'rgba(255,255,255,0.08)',
                  borderRadius: 1,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${(strength.score / 5) * 100}%`,
                    height: '100%',
                    background: strength.color,
                    transition: 'all 0.3s ease',
                  }}
                />
              </div>
              <span
                style={{
                  fontFamily: spaceMono,
                  fontSize: 9,
                  color: strength.color,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginTop: 4,
                  display: 'block',
                }}
              >
                {strength.label}
              </span>
            </motion.div>
          )}

          {/* Terms checkbox (signup only) */}
          {!isSignIn && (
            <motion.div
              custom={step()}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              style={{
                marginBottom: 8,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
              }}
            >
              <button
                type="button"
                onClick={() => setAgreedToTerms(!agreedToTerms)}
                style={{
                  width: 16,
                  height: 16,
                  minWidth: 16,
                  borderRadius: 2,
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: agreedToTerms ? '#fff' : 'transparent',
                  cursor: 'pointer',
                  padding: 0,
                  marginTop: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
              >
                {agreedToTerms && (
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
              <span
                style={{
                  fontFamily: spaceMono,
                  fontSize: 9,
                  color: '#666',
                  lineHeight: 1.5,
                }}
              >
                I agree to the{' '}
                <Link href="#" style={{ color: '#fff', textDecoration: 'none' }}>
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="#" style={{ color: '#fff', textDecoration: 'none' }}>
                  Privacy Policy
                </Link>
              </span>
            </motion.div>
          )}

          {/* Error message */}
          {error && (
            <div
              style={{
                fontFamily: spaceMono,
                fontSize: 10,
                color: '#ff2d55',
                textAlign: 'center',
                padding: '8px 0',
              }}
            >
              {error}
            </div>
          )}

          {/* Submit button */}
          <motion.div
            custom={step()}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            style={{ marginTop: 16 }}
          >
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: 16,
                fontFamily: oswald,
                fontSize: 14,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                background: loading ? '#666' : '#fff',
                color: '#000',
                border: 'none',
                borderRadius: 4,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.boxShadow = '0 0 30px rgba(255,255,255,0.15)';
                  e.target.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = 'none';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              {loading
                ? 'Loading...'
                : isSignIn
                  ? 'Sign In \u2192'
                  : 'Create Account \u2192'}
            </button>
          </motion.div>
        </form>

        {/* Divider */}
        <motion.div
          custom={step()}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          style={{
            display: 'flex',
            alignItems: 'center',
            margin: '20px 0',
            gap: 12,
          }}
        >
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
          <span
            style={{
              fontSize: 8,
              color: '#444',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              fontFamily: spaceMono,
            }}
          >
            or continue with
          </span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
        </motion.div>

        {/* Social buttons */}
        <motion.div
          custom={step()}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
        >
          <button
            type="button"
            disabled={loading}
            onClick={handleGoogleSignIn}
            style={{
              width: '100%',
              padding: '14px 16px',
              fontFamily: spaceMono,
              fontSize: 11,
              background: '#0a0a0a',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 4,
              color: '#ffffff',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.background = '#0a0a0a';
            }}
          >
            <GoogleIcon />
            Google
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleAppleSignIn}
            style={{
              width: '100%',
              padding: '14px 16px',
              fontFamily: spaceMono,
              fontSize: 11,
              background: '#0a0a0a',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 4,
              color: '#ffffff',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.background = '#0a0a0a';
            }}
          >
            <AppleIcon />
            Apple
          </button>
        </motion.div>

        {/* Terms text */}
        <motion.div
          custom={step()}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          style={{
            fontSize: 8,
            color: '#444',
            lineHeight: 1.6,
            textAlign: 'center',
            marginTop: 16,
            fontFamily: spaceMono,
          }}
        >
          By continuing, you agree to Aviera Fit&apos;s{' '}
          <Link href="#" style={{ color: '#fff', textDecoration: 'none', fontSize: 8 }}>
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="#" style={{ color: '#fff', textDecoration: 'none', fontSize: 8 }}>
            Privacy Policy
          </Link>
        </motion.div>

        {/* Footer */}
        <motion.div
          custom={step()}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          style={{
            marginTop: 'auto',
            paddingTop: 24,
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontFamily: oswald,
              fontSize: 9,
              letterSpacing: '0.3em',
              color: '#333',
              textTransform: 'uppercase',
            }}
          >
            Aviera Fit /// San Diego, CA
          </span>
        </motion.div>
      </div>
    </div>
  );
}
