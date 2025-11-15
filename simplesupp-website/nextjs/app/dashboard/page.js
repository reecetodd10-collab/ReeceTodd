'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Pill, 
  Dumbbell, 
  TrendingUp,
  Trophy,
  ChevronDown,
  ChevronUp
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
  const [gamificationData, setGamificationData] = useState(null);
  const [supplementsTaken, setSupplementsTaken] = useState(0);
  const [supplementsTotal, setSupplementsTotal] = useState(0);
  const [workoutComplete, setWorkoutComplete] = useState(false);
  const [showTracking, setShowTracking] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [showStats, setShowStats] = useState(false);
  
  // TODO: Replace with actual user subscription check from Clerk/backend
  const userIsPremium = false;
  const isPremium = hasPremiumAccess(userIsPremium);

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
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-[var(--txt)]">Welcome back!</h1>
        <p className="text-lg text-[var(--txt-muted)]">Here's your fitness overview.</p>
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

