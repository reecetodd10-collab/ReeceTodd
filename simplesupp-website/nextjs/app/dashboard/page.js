'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import {
  Settings,
  CreditCard,
  Dumbbell,
  UtensilsCrossed,
  ChevronRight,
  Check,
  Sparkles,
  LogIn,
} from 'lucide-react';

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();

  // Today's stack items with toggle state
  const [stackItems, setStackItems] = useState([
    { id: 1, name: 'Creatine Monohydrate', dose: '5g · Morning', emoji: '💊', color: 'blue', done: true },
    { id: 2, name: 'Omega-3 Fish Oil', dose: '1 softgel · With food', emoji: '🐟', color: 'green', done: true },
    { id: 3, name: "Lion's Mane Mushroom", dose: '1 capsule · Afternoon', emoji: '🧠', color: 'purple', done: false },
    { id: 4, name: 'Magnesium Glycinate', dose: 'Before bed', emoji: '🌙', color: 'orange', done: false },
  ]);

  const toggleItem = (id) => {
    setStackItems(prev =>
      prev.map(item => item.id === id ? { ...item, done: !item.done } : item)
    );
  };

  const iconBgMap = {
    blue: 'rgba(0, 217, 255, 0.08)',
    green: 'rgba(34, 197, 94, 0.10)',
    purple: 'rgba(167, 139, 250, 0.10)',
    orange: 'rgba(245, 158, 11, 0.10)',
  };

  const accountLinks = [
    { label: 'SmartStack AI', path: '/smartstack-ai', icon: Sparkles },
    { label: 'Billing & Subscriptions', path: '/dashboard/billing', icon: CreditCard },
    { label: 'Optimization History', path: '/dashboard/progress', icon: null },
    { label: 'Workout Planner', path: '/dashboard/fit', icon: Dumbbell },
    { label: 'Nutrition Tracking', path: '/dashboard/nutrition', icon: UtensilsCrossed },
    { label: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  // Loading state
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#00d9ff] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Sign-in gate
  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-5 text-center">
        {/* Avatar placeholder */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
          style={{
            background: 'var(--bg-elev-1)',
            border: '1px solid var(--border)',
          }}
        >
          <LogIn size={28} style={{ color: 'var(--txt-dim)' }} />
        </div>

        <h2
          className="font-bold mb-2"
          style={{ fontSize: '20px', color: 'var(--txt)' }}
        >
          Sign in to your account
        </h2>
        <p
          className="mb-6 max-w-xs"
          style={{ fontSize: '13px', color: 'var(--txt-muted)' }}
        >
          Track your optimization score, manage your supplement stack, and access personalized insights.
        </p>

        <Link
          href="/sign-in"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-[10px] font-semibold transition-all"
          style={{
            fontSize: '14px',
            background: '#00d9ff',
            color: '#09090b',
          }}
        >
          <LogIn size={16} />
          Sign In
        </Link>

        <Link
          href="/sign-up"
          className="mt-3 inline-flex items-center gap-1"
          style={{ fontSize: '13px', color: 'var(--txt-muted)' }}
        >
          Don&apos;t have an account?{' '}
          <span style={{ color: '#00d9ff', fontWeight: 600 }}>Sign Up</span>
        </Link>
      </div>
    );
  }

  // Get user display info
  const firstName = user?.firstName || 'User';
  const lastName = user?.lastName || '';
  const initials = `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase() || 'U';

  // Optimization score
  const score = 75;
  const circumference = 2 * Math.PI * 32;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div>
      {/* Welcome Header with Avatar */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-base font-bold flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #00d9ff, #0088aa)',
            color: 'var(--bg)',
          }}
        >
          {initials}
        </div>
        <div>
          <p className="text-xs" style={{ color: 'var(--txt-muted)' }}>Welcome back</p>
          <p className="text-base font-bold" style={{ color: 'var(--txt)' }}>{firstName} {lastName}</p>
        </div>
      </div>

      {/* Optimization Score Card */}
      <div
        className="rounded-2xl p-5 flex items-center gap-4 mb-6"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        {/* Score Ring */}
        <div className="relative w-[72px] h-[72px] flex-shrink-0 flex items-center justify-center">
          <svg width="72" height="72" viewBox="0 0 72 72" className="-rotate-90">
            <circle
              cx="36" cy="36" r="32"
              fill="none"
              stroke="var(--bg-elevated, #18181b)"
              strokeWidth="5"
            />
            <circle
              cx="36" cy="36" r="32"
              fill="none"
              stroke="#00d9ff"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-700"
            />
          </svg>
          <span
            className="absolute text-xl font-bold"
            style={{ color: '#00d9ff' }}
          >
            {score}
          </span>
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-semibold tracking-wider mb-0.5" style={{ color: 'var(--txt-dim, #52525b)' }}>
            OPTIMIZATION SCORE
          </p>
          <p className="text-sm font-bold mb-0.5" style={{ color: 'var(--txt)' }}>
            Good — Room to Improve
          </p>
          <p className="text-[11px] leading-snug" style={{ color: 'var(--txt-dim, #52525b)' }}>
            Ahead of 68% of users. Add sleep support to hit 85+.
          </p>
        </div>
      </div>

      {/* Progress Stats */}
      <div className="mb-6">
        <h2 className="text-sm font-bold mb-3" style={{ color: 'var(--txt)' }}>Progress</h2>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg p-3" style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-[10px] font-medium mb-1" style={{ color: 'var(--txt-dim, #52525b)' }}>Daily Streak</p>
            <p className="text-lg font-bold" style={{ color: '#00d9ff' }}>12 days</p>
            <p className="text-[9px] font-semibold mt-0.5" style={{ color: '#22c55e' }}>↑ Best yet</p>
          </div>
          <div className="rounded-lg p-3" style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-[10px] font-medium mb-1" style={{ color: 'var(--txt-dim, #52525b)' }}>Compliance</p>
            <p className="text-lg font-bold" style={{ color: '#22c55e' }}>91%</p>
            <p className="text-[9px] font-semibold mt-0.5" style={{ color: '#22c55e' }}>↑ 4% this week</p>
          </div>
          <div className="rounded-lg p-3" style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-[10px] font-medium mb-1" style={{ color: 'var(--txt-dim, #52525b)' }}>Stack Cost/mo</p>
            <p className="text-lg font-bold" style={{ color: 'var(--txt)' }}>$89</p>
          </div>
          <div className="rounded-lg p-3" style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-[10px] font-medium mb-1" style={{ color: 'var(--txt-dim, #52525b)' }}>Next Order</p>
            <p className="text-lg font-bold" style={{ color: 'var(--txt)' }}>8 days</p>
          </div>
        </div>
      </div>

      {/* Today's Stack */}
      <div className="mb-6">
        <h2 className="text-sm font-bold mb-3" style={{ color: 'var(--txt)' }}>Today&apos;s Stack</h2>
        <div className="flex flex-col gap-2">
          {stackItems.map((item) => (
            <div
              key={item.id}
              className="rounded-lg px-3.5 py-3 flex items-center gap-3"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <div
                className="w-9 h-9 rounded-[9px] flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: iconBgMap[item.color] }}
              >
                {item.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold" style={{ color: 'var(--txt)' }}>{item.name}</p>
                <p className="text-[10px] mt-0.5" style={{ color: 'var(--txt-dim, #52525b)' }}>{item.dose}</p>
              </div>
              <button
                onClick={() => toggleItem(item.id)}
                className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                style={{
                  borderColor: item.done ? '#22c55e' : 'rgba(255, 255, 255, 0.06)',
                  background: item.done ? '#22c55e' : 'transparent',
                }}
              >
                {item.done && <Check size={12} strokeWidth={3} style={{ color: 'var(--bg)' }} />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Account Links */}
      <div>
        <h2 className="text-sm font-bold mb-3" style={{ color: 'var(--txt)' }}>Account</h2>
        <div className="flex flex-col gap-1.5">
          {accountLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.path} href={link.path}>
                <div
                  className="rounded-lg px-3.5 py-3.5 flex items-center justify-between transition-colors"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    {Icon && <Icon size={15} style={{ color: link.label === 'SmartStack AI' ? '#00d9ff' : 'var(--txt-dim)' }} />}
                    <span className="text-[13px] font-medium" style={{ color: 'var(--txt)' }}>{link.label}</span>
                  </div>
                  <ChevronRight size={16} style={{ color: 'var(--txt-dim, #52525b)' }} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
