'use client';

import React, { useState, useEffect } from 'react';
import { Flame, Calendar, TrendingUp } from 'lucide-react';
import GlassCard from '../shared/GlassCard';
import { loadGamificationData } from '../../lib/gamification';

export default function StreakCounter({ compact = false }) {
  const [data, setData] = useState(() => {
    if (typeof window === 'undefined') return null;
    return loadGamificationData();
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const interval = setInterval(() => {
      setData(loadGamificationData());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return compact ? <div className="w-24 h-8 bg-[var(--bg-elev-1)] rounded-lg animate-pulse" /> : <div className="text-center py-12 text-[var(--txt-muted)]">Loading...</div>;
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/20 border border-orange-500/30 rounded-lg">
        <Flame className="text-orange-400" size={16} />
        <span className="text-sm font-semibold text-[var(--txt)]">{data.currentStreak} days</span>
      </div>
    );
  }

  // Generate last 30 days calendar
  const generateCalendar = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const historyEntry = data.history?.find(h => h.date === dateStr);
      const isCompleted = historyEntry?.complete || false;
      const isToday = i === 0;
      const isFuture = i < 0;
      
      days.push({
        date: dateStr,
        day: date.getDate(),
        completed: isCompleted,
        isToday,
        isFuture,
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendar();

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-[var(--txt)]">Streak</h3>
        <Flame className="text-orange-400" size={24} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-[var(--bg-elev-1)] rounded-lg">
          <div className="text-3xl font-bold text-[var(--txt)] mb-1">
            🔥 {data.currentStreak}
          </div>
          <div className="text-sm text-[var(--txt-muted)]">Current Streak</div>
        </div>
        <div className="text-center p-4 bg-[var(--bg-elev-1)] rounded-lg">
          <div className="text-3xl font-bold text-[var(--txt)] mb-1">
            <TrendingUp className="inline text-[var(--acc)]" size={28} /> {data.longestStreak}
          </div>
          <div className="text-sm text-[var(--txt-muted)]">Longest Streak</div>
        </div>
      </div>

      {/* Calendar View */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-[var(--txt)] mb-3 flex items-center gap-2">
          <Calendar size={16} />
          Last 30 Days
        </h4>
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`
                aspect-square rounded flex items-center justify-center text-xs font-medium
                ${day.isToday 
                  ? 'ring-2 ring-[var(--acc)] bg-[var(--acc)]/20' 
                  : day.completed
                    ? 'bg-green-500/30 text-green-400'
                    : day.isFuture
                      ? 'bg-transparent text-[var(--txt-muted)]/30'
                      : 'bg-[var(--bg-elev-1)] text-[var(--txt-muted)]'
                }
              `}
              title={day.date}
            >
              {day.completed ? '✓' : day.isFuture ? '' : day.day}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-4 mt-3 text-xs text-[var(--txt-muted)]">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-green-500/30"></div>
            <span>Complete</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-[var(--bg-elev-1)]"></div>
            <span>Missed</span>
          </div>
        </div>
      </div>

      {data.currentStreak > 0 && (
        <div className="mt-4 pt-4 border-t border-[var(--border)]">
          <p className="text-sm text-[var(--txt-muted)] text-center">
            Keep it going! Your longest streak was {data.longestStreak} days.
          </p>
        </div>
      )}
    </GlassCard>
  );
}

