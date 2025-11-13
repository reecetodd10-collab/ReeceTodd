'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Sparkles } from 'lucide-react';
import GlassCard from '../../components/shared/GlassCard';
import AchievementCard from '../../components/gamification/AchievementCard';
import { loadGamificationData, ACHIEVEMENTS } from '../../lib/gamification';

export default function Achievements() {
  const [data, setData] = useState(() => {
    if (typeof window === 'undefined') return null;
    return loadGamificationData();
  });
  const [unlockedAchievement, setUnlockedAchievement] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const interval = setInterval(() => {
      setData(loadGamificationData());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate progress for each achievement
  const getAchievementProgress = (achievementId) => {
    if (!data) return 0;
    const achievement = ACHIEVEMENTS[achievementId];
    if (!achievement) return 0;

    // This is simplified - in real implementation, you'd track specific metrics
    // For now, just return a mock progress based on current data
    switch (achievementId) {
      case 'first_steps':
        return data.totalWorkoutsCompleted >= 1 ? 100 : 0;
      case 'week_warrior':
        return Math.min(100, (data.currentStreak / 7) * 100);
      case 'month_master':
        return Math.min(100, (data.currentStreak / 30) * 100);
      case 'iron_will':
        return Math.min(100, (data.totalWorkoutsCompleted / 50) * 100);
      case 'century_club':
        return Math.min(100, (data.totalWorkoutsCompleted / 100) * 100);
      case 'supplement_scholar':
        return Math.min(100, (data.supplementStreak / 7) * 100);
      case 'hydration_hero':
        if (!data.water?.history) return 0;
        const last7Days = data.water.history.slice(-7);
        const goalDays = last7Days.filter(day => day.glasses >= (data.water.dailyGoal || 8)).length;
        return Math.min(100, (goalDays / 7) * 100);
      case 'water_warrior':
        if (!data.water?.history) return 0;
        const last30Days = data.water.history.slice(-30);
        const goalDays30 = last30Days.filter(day => day.glasses >= (data.water.dailyGoal || 8)).length;
        return Math.min(100, (goalDays30 / 30) * 100);
      case 'rest_master':
        if (!data.sleep?.history) return 0;
        const last30Sleep = data.sleep.history.slice(-30);
        const goodSleepDays = last30Sleep.filter(day => day.quality === true).length;
        return Math.min(100, (goodSleepDays / 30) * 100);
      case 'dream_keeper':
        if (!data.sleep?.history) return 0;
        const goodSleepTotal = data.sleep.history.filter(day => day.quality === true).length;
        return Math.min(100, (goodSleepTotal / 100) * 100);
      case 'macro_master':
        if (!data.nutrition?.history || !data.nutrition?.goals) return 0;
        const last7Nutrition = data.nutrition.history.slice(-7);
        const macroDays = last7Nutrition.filter(day => {
          const goals = data.nutrition.goals;
          return (day.protein || 0) >= goals.protein && 
                 (day.carbs || 0) >= goals.carbs && 
                 (day.fats || 0) >= goals.fats;
        }).length;
        return Math.min(100, (macroDays / 7) * 100);
      case 'nutrition_ninja':
        if (!data.nutrition?.history || !data.nutrition?.goals) return 0;
        const last30Nutrition = data.nutrition.history.slice(-30);
        const macroDays30 = last30Nutrition.filter(day => {
          const goals = data.nutrition.goals;
          return (day.protein || 0) >= goals.protein && 
                 (day.carbs || 0) >= goals.carbs && 
                 (day.fats || 0) >= goals.fats;
        }).length;
        return Math.min(100, (macroDays30 / 30) * 100);
      case 'perfect_day':
        return data.dailyGoals?.today?.completionPercentage || 0;
      case 'perfect_week':
        if (!data.dailyGoals?.history) return 0;
        const last7DaysGoals = data.dailyGoals.history.slice(-7);
        const perfectDays = last7DaysGoals.filter(day => day.completionPercentage === 100).length;
        return Math.min(100, (perfectDays / 7) * 100);
      case 'consistency_king_lifestyle':
        if (!data.dailyGoals?.history) return 0;
        const last30DaysGoals = data.dailyGoals.history.slice(-30);
        const perfectDays30 = last30DaysGoals.filter(day => day.completionPercentage === 100).length;
        return Math.min(100, (perfectDays30 / 30) * 100);
      case 'lifestyle_legend':
        if (!data.dailyGoals?.history) return 0;
        const last100DaysGoals = data.dailyGoals.history.slice(-100);
        const perfectDays100 = last100DaysGoals.filter(day => day.completionPercentage === 100).length;
        return Math.min(100, (perfectDays100 / 100) * 100);
      default:
        return 0;
    }
  };

  if (!data) {
    return <div className="text-center py-12 text-[var(--txt-muted)]">Loading...</div>;
  }

  const unlockedIds = data.unlockedBadges?.map(b => b.id) || [];
  const unlockedCount = unlockedIds.length;
  const totalCount = Object.keys(ACHIEVEMENTS).length;

  // Group achievements by category
  const starterBadges = ['first_steps', 'supplement_scholar', 'week_warrior', 'month_master', 'progress_tracker'];
  const workoutBadges = ['iron_will', 'century_club', 'pr_breaker', 'strength_seeker'];
  const supplementBadges = ['stack_master', 'consistency_king'];
  const healthBadges = ['hydration_hero', 'water_warrior', 'rest_master', 'dream_keeper', 'macro_master', 'nutrition_ninja'];
  const lifestyleBadges = ['perfect_day', 'perfect_week', 'consistency_king_lifestyle', 'lifestyle_legend'];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-[var(--txt)] flex items-center gap-3">
          <Trophy className="text-[var(--acc)]" size={40} />
          Achievements
        </h1>
        <p className="text-lg text-[var(--txt-muted)]">
          Unlock badges by reaching milestones in your fitness journey
        </p>
      </div>

      {/* Progress Overview */}
      <GlassCard className="p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[var(--txt)] mb-1">Collection Progress</h3>
            <p className="text-sm text-[var(--txt-muted)]">
              {unlockedCount} of {totalCount} achievements unlocked
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-[var(--acc)]">
              {Math.round((unlockedCount / totalCount) * 100)}%
            </div>
            <div className="text-xs text-[var(--txt-muted)]">Complete</div>
          </div>
        </div>
        <div className="mt-4 w-full bg-[var(--bg-elev-2)] rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[var(--acc)] to-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
          />
        </div>
      </GlassCard>

      {/* Starter Badges */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-[var(--txt)] mb-4 flex items-center gap-2">
          <Sparkles size={20} />
          Starter Badges
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {starterBadges.map(id => {
            const unlocked = unlockedIds.includes(id);
            const unlockedBadge = data.unlockedBadges?.find(b => b.id === id);
            return (
              <AchievementCard
                key={id}
                achievementId={id}
                unlocked={unlocked}
                unlockedDate={unlockedBadge?.unlockedDate}
                progress={getAchievementProgress(id)}
              />
            );
          })}
        </div>
      </div>

      {/* Workout Badges */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-[var(--txt)] mb-4">Workout Badges</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {workoutBadges.map(id => {
            const unlocked = unlockedIds.includes(id);
            const unlockedBadge = data.unlockedBadges?.find(b => b.id === id);
            return (
              <AchievementCard
                key={id}
                achievementId={id}
                unlocked={unlocked}
                unlockedDate={unlockedBadge?.unlockedDate}
                progress={getAchievementProgress(id)}
              />
            );
          })}
        </div>
      </div>

      {/* Supplement Badges */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-[var(--txt)] mb-4">Supplement Badges</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {supplementBadges.map(id => {
            const unlocked = unlockedIds.includes(id);
            const unlockedBadge = data.unlockedBadges?.find(b => b.id === id);
            return (
              <AchievementCard
                key={id}
                achievementId={id}
                unlocked={unlocked}
                unlockedDate={unlockedBadge?.unlockedDate}
                progress={getAchievementProgress(id)}
              />
            );
          })}
        </div>
      </div>

      {/* Health Badges (Water & Sleep) */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-[var(--txt)] mb-4">Health Badges</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {healthBadges.map(id => {
            const unlocked = unlockedIds.includes(id);
            const unlockedBadge = data.unlockedBadges?.find(b => b.id === id);
            return (
              <AchievementCard
                key={id}
                achievementId={id}
                unlocked={unlocked}
                unlockedDate={unlockedBadge?.unlockedDate}
                progress={getAchievementProgress(id)}
              />
            );
          })}
        </div>
      </div>

      {/* Lifestyle Badges */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-[var(--txt)] mb-4 flex items-center gap-2">
          <Sparkles size={20} />
          Lifestyle Badges
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {lifestyleBadges.map(id => {
            const unlocked = unlockedIds.includes(id);
            const unlockedBadge = data.unlockedBadges?.find(b => b.id === id);
            return (
              <AchievementCard
                key={id}
                achievementId={id}
                unlocked={unlocked}
                unlockedDate={unlockedBadge?.unlockedDate}
                progress={getAchievementProgress(id)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

