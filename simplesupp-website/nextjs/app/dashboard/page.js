'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Pill, 
  Dumbbell, 
  TrendingUp,
  Trophy
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
  const [gamificationData, setGamificationData] = useState(loadGamificationData());
  const [supplementsTaken, setSupplementsTaken] = useState(0);
  const [supplementsTotal, setSupplementsTotal] = useState(0);
  const [workoutComplete, setWorkoutComplete] = useState(false);
  
  // TODO: Replace with actual user subscription check from Clerk/backend
  const userIsPremium = false;
  const isPremium = hasPremiumAccess(userIsPremium);

  useEffect(() => {
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
      setGamificationData(loadGamificationData());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-[var(--txt)]">Welcome back!</h1>
        <p className="text-[var(--txt-muted)]">Here's your fitness overview.</p>
      </div>

      {/* Habit Rings - Prominent Display */}
      <HabitRings 
        supplementsTaken={supplementsTaken}
        supplementsTotal={supplementsTotal}
        workoutComplete={workoutComplete}
      />

      {/* Enhanced Daily Goals Checklist */}
      <EnhancedGoalsChecklist />

      {/* Water & Sleep Tracking */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <WaterTracker />
        <SleepTracker />
      </div>

      {/* Enhanced Weekly Insights */}
      <div className="mb-8">
        <WeeklyInsightsExpanded />
      </div>

      {/* Notes Widget */}
      <NotesWidget />

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Pill className="text-[var(--acc)]" size={24} />
            <h2 className="text-xl font-bold text-[var(--txt)]">Your Stack</h2>
          </div>
          {isPremium ? (
            <>
              <p className="text-[var(--txt-muted)] mb-4">{supplementsTotal} supplements in your daily routine</p>
              <Link href="/dashboard/stack" className="text-[var(--acc)] hover:underline inline-flex items-center gap-1">
                Manage Stack →
              </Link>
            </>
          ) : (
            <>
              <p className="text-[var(--txt-muted)] mb-4">Upgrade to unlock stack tracking</p>
              <Link href="/smartstack-ai" className="text-[var(--acc)] hover:underline inline-flex items-center gap-1">
                Get Started →
              </Link>
            </>
          )}
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Dumbbell className="text-[var(--acc)]" size={24} />
            <h2 className="text-xl font-bold text-[var(--txt)]">This Week's Workouts</h2>
          </div>
          {isPremium ? (
            <>
              <p className="text-[var(--txt-muted)] mb-4">4 of 7 workouts completed</p>
              <Link href="/dashboard/fit" className="text-[var(--acc)] hover:underline inline-flex items-center gap-1">
                View Plan →
              </Link>
            </>
          ) : (
            <>
              <p className="text-[var(--txt-muted)] mb-4">Upgrade to unlock workout planner</p>
              <Link href="/smartfitt" className="text-[var(--acc)] hover:underline inline-flex items-center gap-1">
                Get Started →
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Gamification Stats */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="glass-card p-6">
          <XPDisplay compact={false} />
        </div>
        <div className="glass-card p-6">
          <StreakCounter compact={false} />
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-3 gap-4">
        <Link href="/dashboard/progress" className="glass-card p-4 hover:shadow-premium-lg transition cursor-pointer">
          <TrendingUp className="text-[var(--acc)] mb-2" size={24} />
          <h3 className="font-semibold text-[var(--txt)] mb-1">View Progress</h3>
          <p className="text-sm text-[var(--txt-muted)]">See detailed stats</p>
        </Link>
        <Link href="/dashboard/achievements" className="glass-card p-4 hover:shadow-premium-lg transition cursor-pointer">
          <Trophy className="text-[var(--acc)] mb-2" size={24} />
          <h3 className="font-semibold text-[var(--txt)] mb-1">Achievements</h3>
          <p className="text-sm text-[var(--txt-muted)]">Unlock badges</p>
        </Link>
        {isPremium && (
          <Link href="/dashboard/stack" className="glass-card p-4 hover:shadow-premium-lg transition cursor-pointer">
            <Pill className="text-[var(--acc)] mb-2" size={24} />
            <h3 className="font-semibold text-[var(--txt)] mb-1">Manage Stack</h3>
            <p className="text-sm text-[var(--txt-muted)]">Track supplements</p>
          </Link>
        )}
      </div>
    </div>
  );
}

