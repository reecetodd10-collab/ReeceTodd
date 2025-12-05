import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import GlassCard from '../shared/GlassCard';
import Button from '../shared/Button';
import { loadGamificationData } from '../../lib/gamification';
import { allMacrosHit } from '../../lib/nutrition';

export default function WeeklyInsightsExpanded() {
  const [data, setData] = useState(loadGamificationData());
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(loadGamificationData());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Calculate weekly stats
  const getWeeklyStats = () => {
    const today = new Date();
    const weekDays = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      weekDays.push(dateStr);
    }

    // Workouts
    const workoutData = JSON.parse(localStorage.getItem('aviera_workout_plan') || '{}');
    const currentWeek = workoutData.weeks?.[workoutData.currentWeekIndex];
    const workoutsCompleted = currentWeek?.days?.filter(d => d.completed).length || 0;
    const totalWorkouts = currentWeek?.days?.filter(d => d.exercises.length > 0).length || 0;

    // Supplements
    const userStack = JSON.parse(localStorage.getItem('aviera_user_stack') || '{}');
    const supplementsTotal = userStack.supplements?.length || 0;
    const supplementAdherence = 95; // Simplified - would calculate from history

    // Water
    const waterData = data.water || { history: [] };
    const waterDays = weekDays.filter(dateStr => {
      const entry = waterData.history?.find(h => h.date === dateStr);
      return entry && entry.glasses >= (waterData.dailyGoal || 8);
    }).length;

    // Sleep
    const sleepData = data.sleep || { history: [] };
    const sleepDays = weekDays.filter(dateStr => {
      const entry = sleepData.history?.find(h => h.date === dateStr);
      return entry && entry.quality === true;
    }).length;

    // Nutrition
    const nutritionData = data.nutrition || { history: [] };
    const nutritionDays = weekDays.filter(dateStr => {
      const entry = nutritionData.history?.find(h => h.date === dateStr);
      if (!entry || !nutritionData.goals) return false;
      return allMacrosHit(
        entry.protein || 0,
        entry.carbs || 0,
        entry.fats || 0,
        nutritionData.goals
      );
    }).length;

    // Meals
    const mealsConsistency = nutritionData.history
      ?.filter(h => weekDays.includes(h.date))
      .reduce((sum, h) => sum + (h.mealsComplete || 0), 0) / 7 || 0;

    // XP
    const weeklyXP = data.xpHistory
      ?.filter(h => weekDays.includes(h.date))
      .reduce((sum, h) => sum + h.xp, 0) || 0;

    // Calculate week score (A-F grade)
    const scores = [
      (workoutsCompleted / Math.max(totalWorkouts, 1)) * 100,
      supplementAdherence,
      (waterDays / 7) * 100,
      (sleepDays / 7) * 100,
      (nutritionDays / 7) * 100,
      mealsConsistency * 10,
    ];
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const weekGrade = avgScore >= 90 ? 'A' : avgScore >= 80 ? 'B' : avgScore >= 70 ? 'C' : avgScore >= 60 ? 'D' : 'F';

    // Compare to last week (simplified)
    const lastWeekXP = data.xpHistory
      ?.filter(h => {
        const date = new Date(h.date);
        const lastWeekStart = new Date(today);
        lastWeekStart.setDate(lastWeekStart.getDate() - 14);
        const lastWeekEnd = new Date(today);
        lastWeekEnd.setDate(lastWeekEnd.getDate() - 7);
        return date >= lastWeekStart && date < lastWeekEnd;
      })
      .reduce((sum, h) => sum + h.xp, 0) || 0;
    
    const xpChange = lastWeekXP > 0 
      ? Math.round(((weeklyXP - lastWeekXP) / lastWeekXP) * 100)
      : 0;

    return {
      workoutsCompleted,
      totalWorkouts,
      supplementAdherence,
      waterDays,
      sleepDays,
      nutritionDays,
      mealsConsistency: Math.round(mealsConsistency),
      weeklyXP,
      weekGrade,
      xpChange,
      currentStreak: data.currentStreak || 0,
    };
  };

  const stats = getWeeklyStats();

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = (percentage) => {
    if (percentage >= 80) return 'bg-green-500/20 border-green-500/30';
    if (percentage >= 60) return 'bg-yellow-500/20 border-yellow-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-normal text-[var(--txt)] mb-1">Weekly Insights</h3>
          <p className="text-sm text-[var(--txt-muted)]">Your performance this week</p>
        </div>
        <div className="text-right">
          <div className={`text-3xl font-normal ${getScoreColor(90)}`}>
            {stats.weekGrade}
          </div>
          <div className="text-xs text-[var(--txt-muted)]">Week Score</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className={`p-3 rounded-lg border ${getScoreBg((stats.workoutsCompleted / Math.max(stats.totalWorkouts, 1)) * 100)}`}>
          <div className="text-xs text-[var(--txt-muted)] mb-1">Workouts</div>
          <div className={`text-lg font-normal ${getScoreColor((stats.workoutsCompleted / Math.max(stats.totalWorkouts, 1)) * 100)}`}>
            {stats.workoutsCompleted}/{stats.totalWorkouts}
          </div>
          <div className="text-xs text-[var(--txt-muted)]">
            {Math.round((stats.workoutsCompleted / Math.max(stats.totalWorkouts, 1)) * 100)}%
          </div>
        </div>

        <div className={`p-3 rounded-lg border ${getScoreBg(stats.supplementAdherence)}`}>
          <div className="text-xs text-[var(--txt-muted)] mb-1">Supplements</div>
          <div className={`text-lg font-normal ${getScoreColor(stats.supplementAdherence)}`}>
            {stats.supplementAdherence}%
          </div>
          <div className="text-xs text-[var(--txt-muted)]">Adherence</div>
        </div>

        <div className={`p-3 rounded-lg border ${getScoreBg((stats.waterDays / 7) * 100)}`}>
          <div className="text-xs text-[var(--txt-muted)] mb-1">Water</div>
          <div className={`text-lg font-normal ${getScoreColor((stats.waterDays / 7) * 100)}`}>
            {stats.waterDays}/7
          </div>
          <div className="text-xs text-[var(--txt-muted)]">
            {Math.round((stats.waterDays / 7) * 100)}%
          </div>
        </div>

        <div className={`p-3 rounded-lg border ${getScoreBg((stats.sleepDays / 7) * 100)}`}>
          <div className="text-xs text-[var(--txt-muted)] mb-1">Sleep</div>
          <div className={`text-lg font-normal ${getScoreColor((stats.sleepDays / 7) * 100)}`}>
            {stats.sleepDays}/7
          </div>
          <div className="text-xs text-[var(--txt-muted)]">
            {Math.round((stats.sleepDays / 7) * 100)}%
          </div>
        </div>

        <div className={`p-3 rounded-lg border ${getScoreBg((stats.nutritionDays / 7) * 100)}`}>
          <div className="text-xs text-[var(--txt-muted)] mb-1">Nutrition</div>
          <div className={`text-lg font-normal ${getScoreColor((stats.nutritionDays / 7) * 100)}`}>
            {stats.nutritionDays}/7
          </div>
          <div className="text-xs text-[var(--txt-muted)]">
            {Math.round((stats.nutritionDays / 7) * 100)}%
          </div>
        </div>

        <div className={`p-3 rounded-lg border ${getScoreBg(stats.mealsConsistency)}`}>
          <div className="text-xs text-[var(--txt-muted)] mb-1">Meals</div>
          <div className={`text-lg font-normal ${getScoreColor(stats.mealsConsistency)}`}>
            {stats.mealsConsistency}%
          </div>
          <div className="text-xs text-[var(--txt-muted)]">Consistency</div>
        </div>

        <div className="p-3 rounded-lg border bg-[var(--bg-elev-1)] border-[var(--border)]">
          <div className="text-xs text-[var(--txt-muted)] mb-1">Total XP</div>
          <div className="text-lg font-normal text-[var(--txt)]">
            {stats.weeklyXP}
          </div>
          <div className="text-xs text-[var(--txt-muted)]">This week</div>
        </div>

        <div className="p-3 rounded-lg border bg-[var(--bg-elev-1)] border-[var(--border)]">
          <div className="text-xs text-[var(--txt-muted)] mb-1">Streak</div>
          <div className="text-lg font-normal text-[var(--txt)] flex items-center gap-1">
            🔥 {stats.currentStreak}
          </div>
          <div className="text-xs text-[var(--txt-muted)]">Days</div>
        </div>
      </div>

      {/* XP Change */}
      {stats.xpChange !== 0 && (
        <div className="mb-4 p-3 bg-[var(--bg-elev-1)] rounded-lg flex items-center justify-center gap-2">
          {stats.xpChange > 0 ? (
            <TrendingUp className="text-green-400" size={20} />
          ) : (
            <TrendingDown className="text-red-400" size={20} />
          )}
          <span className={`text-sm font-normal ${stats.xpChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {stats.xpChange > 0 ? '↑' : '↓'} {Math.abs(stats.xpChange)}% {stats.xpChange > 0 ? 'improvement' : 'decrease'} from last week
          </span>
        </div>
      )}

      {/* View Details Button */}
      <Link to="/dashboard/progress">
        <Button variant="secondary" className="w-full">
          View Detailed Progress
          <ExternalLink size={16} />
        </Button>
      </Link>
    </GlassCard>
  );
}

