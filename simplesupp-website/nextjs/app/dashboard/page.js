'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
// import { getOrCreateUser } from '@/lib/supabase-client'; // TODO: Re-enable when deployed or network issue resolved
import { 
  Pill, 
  Dumbbell, 
  TrendingUp,
  Trophy,
  ChevronDown,
  ChevronUp,
  Crown,
  CheckCircle,
  X
} from 'lucide-react';
import { hasPremiumAccess, TESTING_MODE } from '../lib/config';
import { loadGamificationData } from '../lib/gamification';

import HabitRings from '../components/gamification/HabitRings';
import EnhancedGoalsChecklist from '../components/gamification/EnhancedGoalsChecklist';
import WeeklyInsightsExpanded from '../components/gamification/WeeklyInsightsExpanded';
import XPDisplay from '../components/gamification/XPDisplay';
import StreakCounter from '../components/gamification/StreakCounter';
import WaterTracker from '../components/tracking/WaterTracker';
import SleepTracker from '../components/tracking/SleepTracker';
import NotesWidget from '../components/dashboard/NotesWidget';

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [gamificationData, setGamificationData] = useState(null);
  const [supplementsTaken, setSupplementsTaken] = useState(0);
  const [supplementsTotal, setSupplementsTotal] = useState(0);
  const [workoutComplete, setWorkoutComplete] = useState(false);
  const [showTracking, setShowTracking] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showCancelMessage, setShowCancelMessage] = useState(false);
  // const [userSynced, setUserSynced] = useState(false); // TODO: Re-enable when Supabase sync is re-enabled
  
  // TODO: Replace with actual user subscription check from Clerk/backend/Supabase
  const userIsPremium = false;
  const isPremium = hasPremiumAccess(userIsPremium);

  // Handle success/cancel messages from Stripe redirect
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        router.replace('/dashboard');
      }, 5000);
    }
    if (searchParams.get('canceled') === 'true') {
      setShowCancelMessage(true);
      setTimeout(() => {
        setShowCancelMessage(false);
        router.replace('/dashboard');
      }, 5000);
    }
  }, [searchParams, router]);

  // Handle upgrade to premium
  const handleUpgrade = async () => {
    if (!user) {
      router.push('/sign-in');
      return;
    }

    setIsLoadingCheckout(true);
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
      setIsLoadingCheckout(false);
    }
  };

  // TODO: Re-enable when deployed or network issue resolved
  // Check and sync user with Supabase on mount (client-side)
  // useEffect(() => {
  //   if (!isLoaded || !user || userSynced) return;

  //   const syncUser = async () => {
  //     try {
  //       console.log('Starting client-side user sync...');
        
  //       const clerkUserId = user.id;
  //       const email = user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress;
        
  //       if (!email) {
  //         console.error('No email found for user');
  //         return;
  //       }

  //       console.log('Syncing user to Supabase:', { clerkUserId, email });
        
  //       // Use client-side Supabase to get or create user
  //       const supabaseUser = await getOrCreateUser(clerkUserId, email);
        
  //       if (supabaseUser) {
  //         console.log('User synced with Supabase successfully:', supabaseUser.id);
  //         setUserSynced(true);
  //       } else {
  //         console.error('Failed to sync user - no user returned');
  //       }
  //     } catch (error) {
  //       console.error('Error syncing user:', error);
  //       console.error('Error details:', {
  //         message: error.message,
  //         stack: error.stack,
  //         name: error.name,
  //         code: error.code,
  //         details: error.details,
  //         hint: error.hint,
  //       });
  //       // Don't set userSynced to true on error - allow retry
  //     }
  //   };

  //   syncUser();
  // }, [isLoaded, user, userSynced]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Load gamification data
    setGamificationData(loadGamificationData());
    
    // Load supplement data from stack
    const userStack = localStorage.getItem('aviera_user_stack');
    if (userStack) {
      try {
        const stack = JSON.parse(userStack);
        const checkedToday = JSON.parse(localStorage.getItem('aviera_checked_today') || '{}');
        const taken = Object.values(checkedToday).filter(Boolean).length;
        setSupplementsTotal(stack.supplements?.length || 0);
        setSupplementsTaken(taken);
      } catch (e) {
        console.error('Failed to load stack data:', e);
      }
    }

    // Load workout completion
    const workoutData = localStorage.getItem('aviera_workout_plan');
    if (workoutData) {
      try {
        const plan = JSON.parse(workoutData);
        const today = new Date().getDay();
        const dayMapping = { 0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday' };
        const currentDayName = dayMapping[today];
        const currentWeek = plan.weeks?.[plan.currentWeekIndex];
        const todayWorkout = currentWeek?.days?.find(d => d.day === currentDayName);
        setWorkoutComplete(todayWorkout?.completed || false);
      } catch (e) {
        console.error('Failed to load workout data:', e);
      }
    }

    // Reload gamification data
    const interval = setInterval(() => {
      if (typeof window !== 'undefined') {
        setGamificationData(loadGamificationData());
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success/Cancel Messages */}
      {showSuccessMessage && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3">
          <CheckCircle className="text-green-500" size={20} />
          <p className="text-green-500 font-medium">Payment successful! Welcome to Aviera Premium.</p>
        </div>
      )}
      {showCancelMessage && (
        <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center gap-3">
          <X className="text-yellow-500" size={20} />
          <p className="text-yellow-500 font-medium">Checkout was canceled. No charges were made.</p>
        </div>
      )}

      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-[var(--txt)]">Welcome back!</h1>
            <p className="text-lg text-[var(--txt-muted)]">Here's your fitness overview.</p>
          </div>
          {!isPremium && (
            <button
              onClick={handleUpgrade}
              disabled={isLoadingCheckout}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--acc)] to-blue-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition shadow-accent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Crown size={18} />
              {isLoadingCheckout ? 'Loading...' : 'Upgrade to Premium'}
            </button>
          )}
          {isPremium && (
            <div className="flex items-center gap-2 px-4 py-2 bg-[var(--acc)]/10 border border-[var(--acc)]/20 rounded-lg">
              <Crown className="text-[var(--acc)]" size={18} />
              <span className="text-[var(--acc)] font-semibold">Premium Member</span>
            </div>
          )}
        </div>
      </div>

      {/* Primary Actions - Always Visible */}
      <div className="mb-12">
        <HabitRings 
          supplementsTaken={supplementsTaken}
          supplementsTotal={supplementsTotal}
          workoutComplete={workoutComplete}
        />
      </div>

      {/* Daily Goals - Always Visible */}
      <div className="mb-12">
        <EnhancedGoalsChecklist />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        <Link href={isPremium ? "/dashboard/stack" : "/smartstack-ai"} className="glass-card p-6 hover:shadow-premium-lg transition-all">
          <div className="flex items-center gap-3 mb-3">
            <Pill className="text-[var(--acc)]" size={24} />
            <h2 className="text-xl font-bold text-[var(--txt)]">Your Stack</h2>
          </div>
          <p className="text-[var(--txt-muted)] mb-4">
            {isPremium ? `${supplementsTotal} supplements in your daily routine` : 'Upgrade to unlock stack tracking'}
          </p>
          <span className="text-[var(--acc)] font-medium inline-flex items-center gap-1">
            {isPremium ? 'Manage Stack' : 'Get Started'} →
          </span>
        </Link>

        <Link href={isPremium ? "/dashboard/fit" : "/smartfitt"} className="glass-card p-6 hover:shadow-premium-lg transition-all">
          <div className="flex items-center gap-3 mb-3">
            <Dumbbell className="text-[var(--acc)]" size={24} />
            <h2 className="text-xl font-bold text-[var(--txt)]">Workouts</h2>
          </div>
          <p className="text-[var(--txt-muted)] mb-4">
            {isPremium ? '4 of 7 workouts completed this week' : 'Upgrade to unlock workout planner'}
          </p>
          <span className="text-[var(--acc)] font-medium inline-flex items-center gap-1">
            {isPremium ? 'View Plan' : 'Get Started'} →
          </span>
        </Link>
      </div>

      {/* Collapsible Sections */}
      <div className="space-y-6">
        {/* Tracking Section */}
        <div className="glass-card">
          <button
            onClick={() => setShowTracking(!showTracking)}
            className="w-full flex items-center justify-between p-6 text-left"
          >
            <h2 className="text-xl font-bold text-[var(--txt)]">Water & Sleep Tracking</h2>
            {showTracking ? <ChevronUp size={24} className="text-[var(--txt-muted)]" /> : <ChevronDown size={24} className="text-[var(--txt-muted)]" />}
          </button>
          {showTracking && (
            <div className="px-6 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <WaterTracker />
                <SleepTracker />
              </div>
            </div>
          )}
        </div>

        {/* Weekly Insights */}
        <div className="glass-card">
          <button
            onClick={() => setShowInsights(!showInsights)}
            className="w-full flex items-center justify-between p-6 text-left"
          >
            <h2 className="text-xl font-bold text-[var(--txt)]">Weekly Insights</h2>
            {showInsights ? <ChevronUp size={24} className="text-[var(--txt-muted)]" /> : <ChevronDown size={24} className="text-[var(--txt-muted)]" />}
          </button>
          {showInsights && (
            <div className="px-6 pb-6">
              <WeeklyInsightsExpanded />
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="glass-card">
          <button
            onClick={() => setShowStats(!showStats)}
            className="w-full flex items-center justify-between p-6 text-left"
          >
            <h2 className="text-xl font-bold text-[var(--txt)]">Stats & Progress</h2>
            {showStats ? <ChevronUp size={24} className="text-[var(--txt-muted)]" /> : <ChevronDown size={24} className="text-[var(--txt-muted)]" />}
          </button>
          {showStats && (
            <div className="px-6 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <XPDisplay compact={false} />
                <StreakCounter compact={false} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Link href="/dashboard/progress" className="glass-card p-4 hover:shadow-premium-lg transition text-center">
                  <TrendingUp className="text-[var(--acc)] mb-2 mx-auto" size={24} />
                  <h3 className="font-semibold text-[var(--txt)] mb-1">View Progress</h3>
                  <p className="text-sm text-[var(--txt-muted)]">See detailed stats</p>
                </Link>
                <Link href="/dashboard/achievements" className="glass-card p-4 hover:shadow-premium-lg transition text-center">
                  <Trophy className="text-[var(--acc)] mb-2 mx-auto" size={24} />
                  <h3 className="font-semibold text-[var(--txt)] mb-1">Achievements</h3>
                  <p className="text-sm text-[var(--txt-muted)]">Unlock badges</p>
                </Link>
                {isPremium && (
                  <Link href="/dashboard/stack" className="glass-card p-4 hover:shadow-premium-lg transition text-center">
                    <Pill className="text-[var(--acc)] mb-2 mx-auto" size={24} />
                    <h3 className="font-semibold text-[var(--txt)] mb-1">Manage Stack</h3>
                    <p className="text-sm text-[var(--txt-muted)]">Track supplements</p>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Notes - Always visible but compact */}
        <div className="mb-8">
          <NotesWidget />
        </div>
      </div>
    </div>
  );
}

