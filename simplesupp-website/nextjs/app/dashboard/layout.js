'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Pill, 
  Dumbbell, 
  Settings, 
  LogOut,
  Menu,
  X,
  Crown,
  User,
  FlaskConical,
  Target,
  CreditCard,
  Trophy,
  TrendingUp,
  UtensilsCrossed
} from 'lucide-react';
import UpgradePrompt from '../components/shared/UpgradePrompt';
import AIChat from '../components/premium/AIChat';
import Reassessment from '../components/premium/Reassessment';
import PillLogo from '../components/PillLogo';
import Button from '../components/shared/Button';
import { hasPremiumAccess, TESTING_MODE } from '../lib/config';

// TODO: Add Clerk authentication here
// - Use Clerk's auth() to check if user is signed in
// - If not signed in, redirect to sign-in page
// - Get user information from Clerk

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showReassessment, setShowReassessment] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  // TODO: Replace with actual user subscription check from Clerk/backend
  const userIsPremium = false; // User's actual premium status from backend
  const isPremium = hasPremiumAccess(userIsPremium); // Respects testing mode

  const navItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
    { icon: Pill, label: 'Stack Builder', path: '/dashboard/stack' },
    { icon: Dumbbell, label: 'Workout Planner', path: '/dashboard/fit' },
    { icon: UtensilsCrossed, label: 'Nutrition', path: '/dashboard/nutrition' },
    { icon: TrendingUp, label: 'Progress', path: '/dashboard/progress' },
    { icon: Trophy, label: 'Achievements', path: '/dashboard/achievements' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
    { icon: CreditCard, label: 'Billing', path: '/dashboard/billing' },
  ];

  const handleNavClick = (path) => {
    // Only show upgrade modal if not in testing mode and user doesn't have premium
    if (!TESTING_MODE && !isPremium && (path === '/dashboard/stack' || path === '/dashboard/fit')) {
      setShowUpgradeModal(true);
      return;
    }
    router.push(path);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex">
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-[var(--bg-elev-1)] backdrop-blur-[var(--glass-blur)] border-r border-[var(--border)]
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-6 border-b border-[var(--border)]">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
              <PillLogo size="small" />
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-[var(--bg-elev-2)] rounded-lg transition"
            >
              <X size={20} className="text-[var(--txt)]" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[var(--txt)]">Aviera Premium</h1>
            {isPremium && !TESTING_MODE && (
              <Crown size={18} className="text-[var(--acc)]" />
            )}
          </div>
          {!isPremium && !TESTING_MODE && (
            <div className="mt-3 space-y-2">
              <div className="px-3 py-1.5 bg-[var(--acc)]/20 border border-[var(--acc)]/30 rounded-lg text-center">
                <span className="text-xs font-semibold text-[var(--acc)]">Free Tier</span>
              </div>
              <Link href="/pricing" className="block">
                <Button variant="primary" className="w-full text-xs py-2">
                  Upgrade to Premium
                </Button>
              </Link>
            </div>
          )}
          {isPremium && !TESTING_MODE && (
            <div className="mt-3 space-y-2">
              <div className="px-3 py-1.5 bg-[var(--acc)]/20 border border-[var(--acc)]/30 rounded-lg text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <Crown size={12} className="text-[var(--acc)]" />
                  <span className="text-xs font-semibold text-[var(--acc)]">Premium Member</span>
                </div>
              </div>
              <Link href="/dashboard/billing" className="block">
                <button className="w-full px-3 py-2 text-xs font-medium bg-[var(--bg-elev-1)] hover:bg-[var(--bg-elev-2)] border border-[var(--border)] rounded-lg text-[var(--txt-muted)] hover:text-[var(--txt)] transition">
                  Manage Subscription
                </button>
              </Link>
            </div>
          )}
          {TESTING_MODE && (
            <div className="mt-3 px-3 py-1.5 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-center">
              <span className="text-xs font-semibold text-yellow-400 flex items-center justify-center gap-1">
                <FlaskConical size={12} />
                Testing Mode
              </span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            const isPremiumFeature = item.path === '/dashboard/stack' || item.path === '/dashboard/fit';
            
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg transition
                  ${isActive 
                    ? 'bg-[var(--acc)]/20 text-[var(--acc)] border border-[var(--acc)]/30' 
                    : 'text-[var(--txt-muted)] hover:bg-[var(--bg-elev-2)] hover:text-[var(--txt)]'
                  }
                `}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
                {isPremiumFeature && !isPremium && !TESTING_MODE && (
                  <Crown size={14} className="ml-auto text-[var(--acc)] opacity-60" />
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="absolute bottom-0 w-full p-4 border-t border-[var(--border)] bg-[var(--bg-elev-1)]">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-[var(--acc)]/20 flex items-center justify-center">
              <User size={16} className="text-[var(--acc)]" />
            </div>
            <div className="flex-1 min-w-0">
              {/* TODO: Replace with actual user data from Clerk */}
              <p className="text-sm font-medium text-[var(--txt)] truncate">User Name</p>
              <p className="text-xs text-[var(--txt-muted)] truncate">user@example.com</p>
            </div>
          </div>
          {/* TODO: Replace with Clerk's signOut function */}
          <button className="w-full flex items-center gap-3 px-4 py-2 text-[var(--txt-muted)] hover:bg-[var(--bg-elev-2)] rounded-lg transition">
            <LogOut size={18} />
            <span className="text-sm">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Testing Mode Indicator - Top Right */}
        {TESTING_MODE && (
          <div className="fixed top-4 right-4 z-50 px-3 py-1.5 bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-lg text-xs font-semibold text-yellow-400 flex items-center gap-1.5 shadow-lg">
            <FlaskConical size={14} />
            Testing Mode
          </div>
        )}
        
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-30 bg-[var(--bg-elev-1)] backdrop-blur-[var(--glass-blur)] border-b border-[var(--border)] p-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-[var(--bg-elev-2)] rounded-lg transition"
          >
            <Menu size={24} className="text-[var(--txt)]" />
          </button>
        </div>

        {/* Top Navigation Bar - Desktop */}
        <div className="hidden lg:flex sticky top-0 z-30 bg-[var(--bg-elev-1)]/80 backdrop-blur-[var(--glass-blur)] border-b border-[var(--border)] px-8 py-4 items-center justify-end gap-4">
          <button
            onClick={() => setShowReassessment(true)}
            className="flex items-center gap-2 px-4 py-2 glass-card rounded-lg text-sm font-medium text-[var(--txt)] hover:bg-[var(--bg-elev-2)] transition border border-[var(--border)]"
          >
            <Target size={16} />
            🎯 Update Goals
          </button>
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-[var(--acc)]/20 flex items-center justify-center">
              <User size={16} className="text-[var(--acc)]" />
            </div>
            <div className="text-sm">
              {/* TODO: Replace with actual user data from Clerk */}
              <p className="font-medium text-[var(--txt)]">User Name</p>
              <p className="text-xs text-[var(--txt-muted)]">user@example.com</p>
            </div>
          </div>
        </div>

        {/* Mobile Top Bar with Update Goals */}
        <div className="lg:hidden sticky top-[73px] z-30 bg-[var(--bg-elev-1)]/80 backdrop-blur-[var(--glass-blur)] border-b border-[var(--border)] px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setShowReassessment(true)}
            className="flex items-center gap-2 px-3 py-2 glass-card rounded-lg text-xs font-medium text-[var(--txt)] hover:bg-[var(--bg-elev-2)] transition border border-[var(--border)]"
          >
            <Target size={14} />
            🎯 Update Goals
          </button>
        </div>

        {/* Content */}
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Premium Upgrade Modal - Only show if not in testing mode */}
      {!TESTING_MODE && (
        <UpgradePrompt isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
      )}

      {/* AI Chat Widget - Available on all dashboard pages */}
      <AIChat userIsPremium={userIsPremium} />

      {/* Reassessment Modal */}
      <Reassessment isOpen={showReassessment} onClose={() => setShowReassessment(false)} />
    </div>
  );
}

