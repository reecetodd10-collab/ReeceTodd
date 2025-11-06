import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Target, Award } from 'lucide-react';
import GlassCard from '../../components/shared/GlassCard';
import StreakCounter from '../../components/gamification/StreakCounter';
import XPDisplay from '../../components/gamification/XPDisplay';
import WeeklySummary from '../../components/gamification/WeeklySummary';
import { loadGamificationData } from '../../lib/gamification';

export default function Progress() {
  const [data, setData] = useState(loadGamificationData());

  useEffect(() => {
    const interval = setInterval(() => {
      setData(loadGamificationData());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Generate calendar heatmap (last 365 days)
  const generateHeatmap = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const historyEntry = data.history?.find(h => h.date === dateStr);
      days.push({
        date: dateStr,
        completed: historyEntry?.complete || false,
        xp: historyEntry?.xp || 0,
      });
    }
    
    return days;
  };

  const heatmapDays = generateHeatmap();

  // Get intensity color for heatmap
  const getIntensityColor = (xp) => {
    if (xp === 0) return 'bg-[var(--bg-elev-1)]';
    if (xp < 50) return 'bg-green-500/30';
    if (xp < 100) return 'bg-green-500/50';
    if (xp < 200) return 'bg-green-500/70';
    return 'bg-green-500';
  };

  // Calculate monthly stats
  const getMonthlyStats = () => {
    const today = new Date();
    const thisMonth = today.getMonth();
    const thisYear = today.getFullYear();
    
    const monthDays = heatmapDays.filter(day => {
      const date = new Date(day.date);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    });
    
    const completed = monthDays.filter(d => d.completed).length;
    const totalXP = monthDays.reduce((sum, d) => sum + d.xp, 0);
    const averageXP = monthDays.length > 0 ? Math.round(totalXP / monthDays.length) : 0;
    
    return {
      completed,
      totalXP,
      averageXP,
      totalDays: monthDays.length,
    };
  };

  const monthlyStats = getMonthlyStats();

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-[var(--txt)] flex items-center gap-3">
          <TrendingUp className="text-[var(--acc)]" size={40} />
          Progress & Stats
        </h1>
        <p className="text-lg text-[var(--txt-muted)]">
          Track your fitness journey and see your improvements over time
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <XPDisplay />
        <StreakCounter />
        <WeeklySummary />
      </div>

      {/* Monthly Stats */}
      <GlassCard className="p-6 mb-6">
        <h2 className="text-xl font-bold text-[var(--txt)] mb-4 flex items-center gap-2">
          <Calendar size={20} />
          This Month
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-[var(--bg-elev-1)] rounded-lg">
            <div className="text-2xl font-bold text-[var(--txt)] mb-1">{monthlyStats.completed}</div>
            <div className="text-sm text-[var(--txt-muted)]">Days Completed</div>
          </div>
          <div className="text-center p-4 bg-[var(--bg-elev-1)] rounded-lg">
            <div className="text-2xl font-bold text-[var(--txt)] mb-1">{monthlyStats.totalXP}</div>
            <div className="text-sm text-[var(--txt-muted)]">XP Earned</div>
          </div>
          <div className="text-center p-4 bg-[var(--bg-elev-1)] rounded-lg">
            <div className="text-2xl font-bold text-[var(--txt)] mb-1">{monthlyStats.averageXP}</div>
            <div className="text-sm text-[var(--txt-muted)]">Avg XP/Day</div>
          </div>
        </div>
      </GlassCard>

      {/* Calendar Heatmap */}
      <GlassCard className="p-6 mb-6">
        <h2 className="text-xl font-bold text-[var(--txt)] mb-4 flex items-center gap-2">
          <Target size={20} />
          Activity Heatmap (Last 365 Days)
        </h2>
        <div className="overflow-x-auto">
          <div className="grid grid-cols-[repeat(53,minmax(0,1fr))] gap-1 min-w-max">
            {heatmapDays.map((day, index) => (
              <div
                key={index}
                className={`
                  w-3 h-3 rounded-sm transition-all hover:scale-125
                  ${getIntensityColor(day.xp)}
                  ${day.completed ? 'border border-green-400/50' : ''}
                `}
                title={`${day.date}: ${day.xp} XP`}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 text-xs text-[var(--txt-muted)]">
          <div className="flex items-center gap-4">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-[var(--bg-elev-1)] rounded-sm"></div>
              <div className="w-3 h-3 bg-green-500/30 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-500/50 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-500/70 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
            </div>
            <span>More</span>
          </div>
          <span>{new Date(heatmapDays[0].date).toLocaleDateString()} - {new Date(heatmapDays[heatmapDays.length - 1].date).toLocaleDateString()}</span>
        </div>
      </GlassCard>

      {/* XP Progression */}
      <GlassCard className="p-6 mb-6">
        <h2 className="text-xl font-bold text-[var(--txt)] mb-4">XP Progression</h2>
        <div className="h-32 flex items-end justify-between gap-1">
          {Array.from({ length: 30 }).map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (29 - i));
            const dateStr = date.toISOString().split('T')[0];
            const historyEntry = data.xpHistory?.filter(h => h.date === dateStr);
            const xp = historyEntry?.reduce((sum, e) => sum + e.xp, 0) || 0;
            const maxXP = 200; // Max XP for scaling
            const height = Math.max(5, (xp / maxXP) * 100);

            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-gradient-to-t from-[var(--acc)] to-blue-500 rounded-t transition-all hover:opacity-80"
                  style={{ height: `${height}%` }}
                  title={`${dateStr}: ${xp} XP`}
                />
              </div>
            );
          })}
        </div>
        <div className="text-xs text-[var(--txt-muted)] text-center mt-2">
          Last 30 days
        </div>
      </GlassCard>

      {/* Achievements This Month */}
      {data.unlockedBadges && data.unlockedBadges.length > 0 && (
        <GlassCard className="p-6">
          <h2 className="text-xl font-bold text-[var(--txt)] mb-4 flex items-center gap-2">
            <Award size={20} />
            Recent Achievements
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.unlockedBadges.slice(-8).reverse().map((badge, index) => {
              const achievement = require('../../lib/gamification').ACHIEVEMENTS[badge.id];
              if (!achievement) return null;
              return (
                <div key={index} className="text-center p-4 bg-[var(--bg-elev-1)] rounded-lg">
                  <div className="text-4xl mb-2">{achievement.emoji}</div>
                  <div className="text-sm font-semibold text-[var(--txt)]">{achievement.name}</div>
                  <div className="text-xs text-[var(--txt-muted)] mt-1">
                    {new Date(badge.unlockedDate).toLocaleDateString()}
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      )}
    </div>
  );
}

