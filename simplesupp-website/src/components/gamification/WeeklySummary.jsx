import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Target } from 'lucide-react';
import GlassCard from '../shared/GlassCard';
import { loadGamificationData } from '../../lib/gamification';

export default function WeeklySummary() {
  const [data, setData] = useState(loadGamificationData());

  useEffect(() => {
    const interval = setInterval(() => {
      setData(loadGamificationData());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate weekly stats (last 7 days)
  const getWeeklyStats = () => {
    const today = new Date();
    const weekDays = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const historyEntry = data.history?.find(h => h.date === dateStr);
      weekDays.push({
        date: dateStr,
        completed: historyEntry?.complete || false,
        xp: historyEntry?.xp || 0,
      });
    }

    const completed = weekDays.filter(d => d.completed).length;
    const totalXP = weekDays.reduce((sum, d) => sum + d.xp, 0);
    const supplementDays = weekDays.filter(d => {
      // Check if supplements were taken (simplified)
      return d.completed;
    }).length;

    // Calculate supplement percentage (simplified - would need actual supplement data)
    const supplementPercentage = data.today.supplementsTotal > 0
      ? Math.round((data.today.supplementsTaken / data.today.supplementsTotal) * 100)
      : 0;

    return {
      workoutsCompleted: completed,
      totalWorkouts: 6, // Assuming 6 workout days per week
      supplementPercentage,
      xpEarned: totalXP,
      currentStreak: data.currentStreak,
    };
  };

  const stats = getWeeklyStats();
  const workoutCompletionPercentage = Math.round((stats.workoutsCompleted / stats.totalWorkouts) * 100);

  // Color coding
  const getStatusColor = (percentage) => {
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatusBg = (percentage) => {
    if (percentage >= 80) return 'bg-green-500/20 border-green-500/30';
    if (percentage >= 50) return 'bg-yellow-500/20 border-yellow-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-[var(--txt)] flex items-center gap-2">
          <Calendar size={20} />
          This Week
        </h3>
        <span className="text-sm text-[var(--txt-muted)]">
          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Workouts */}
        <div className={`p-4 rounded-lg border ${getStatusBg(workoutCompletionPercentage)}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[var(--txt)]">Workouts</span>
            <Target size={16} className={getStatusColor(workoutCompletionPercentage)} />
          </div>
          <div className={`text-2xl font-bold mb-1 ${getStatusColor(workoutCompletionPercentage)}`}>
            {stats.workoutsCompleted}/{stats.totalWorkouts}
          </div>
          <div className="text-xs text-[var(--txt-muted)]">
            {workoutCompletionPercentage}% complete
          </div>
        </div>

        {/* Supplements */}
        <div className={`p-4 rounded-lg border ${getStatusBg(stats.supplementPercentage)}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[var(--txt)]">Supplements</span>
            <TrendingUp size={16} className={getStatusColor(stats.supplementPercentage)} />
          </div>
          <div className={`text-2xl font-bold mb-1 ${getStatusColor(stats.supplementPercentage)}`}>
            {stats.supplementPercentage}%
          </div>
          <div className="text-xs text-[var(--txt-muted)]">
            Average this week
          </div>
        </div>
      </div>

      {/* XP and Streak */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-[var(--bg-elev-1)] rounded-lg">
          <div className="text-sm font-medium text-[var(--txt-muted)] mb-1">XP Earned</div>
          <div className="text-xl font-bold text-[var(--txt)]">{stats.xpEarned}</div>
        </div>
        <div className="p-4 bg-[var(--bg-elev-1)] rounded-lg">
          <div className="text-sm font-medium text-[var(--txt-muted)] mb-1">Current Streak</div>
          <div className="text-xl font-bold text-[var(--txt)] flex items-center gap-1">
            🔥 {stats.currentStreak}
          </div>
        </div>
      </div>

      {/* Mini Progress Chart */}
      <div className="mt-6 pt-6 border-t border-[var(--border)]">
        <div className="flex items-end justify-between gap-1 h-12">
          {Array.from({ length: 7 }).map((_, i) => {
            const day = new Date();
            day.setDate(day.getDate() - (6 - i));
            const dateStr = day.toISOString().split('T')[0];
            const historyEntry = data.history?.find(h => h.date === dateStr);
            const isCompleted = historyEntry?.complete || false;
            const height = isCompleted ? 100 : 30;

            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t transition-all ${
                    isCompleted 
                      ? 'bg-green-500' 
                      : 'bg-[var(--bg-elev-2)]'
                  }`}
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-[var(--txt-muted)]">
                  {day.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </GlassCard>
  );
}

