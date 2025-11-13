'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Moon, Check, X, Clock } from 'lucide-react';
import GlassCard from '../shared/GlassCard';
import { loadGamificationData, saveGamificationData, awardXP, XP_VALUES, checkAchievements } from '../../lib/gamification';

export default function SleepTracker() {
  const [data, setData] = useState(() => {
    if (typeof window === 'undefined') return null;
    return loadGamificationData();
  });
  const [sleepData, setSleepData] = useState(() => {
    if (typeof window === 'undefined') return { lastNight: null, history: [] };
    const gamificationData = loadGamificationData();
    return gamificationData.sleep || { lastNight: null, history: [] };
  });
  const [showHoursInput, setShowHoursInput] = useState(false);
  const [hours, setHours] = useState(8);
  const [showXPAnimation, setShowXPAnimation] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Check if we need to prompt for last night's sleep
    const today = new Date().toISOString().split('T')[0];
    const lastEntry = sleepData.lastNight;
    const lastEntryDate = lastEntry ? new Date(lastEntry.date).toISOString().split('T')[0] : null;
    
    // If no entry for today and it's morning (before 2 PM), we might want to prompt
    // But for simplicity, just show the tracker
  }, []);

  const updateGamificationData = (newSleepData) => {
    if (typeof window === 'undefined') return;
    const gamificationData = loadGamificationData();
    gamificationData.sleep = newSleepData;
    saveGamificationData(gamificationData);
    setData(gamificationData);
  };

  const logSleep = (quality, hoursLogged = null) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const sleepEntry = {
      date: yesterdayStr,
      quality: quality,
      hours: hoursLogged || (quality ? 8 : 6), // Default hours if not specified
    };

    const newSleepData = {
      lastNight: sleepEntry,
      history: [
        ...sleepData.history.filter(h => h.date !== yesterdayStr),
        sleepEntry,
      ],
    };

    setSleepData(newSleepData);
    updateGamificationData(newSleepData);

    // Award XP for good sleep
    if (quality) {
      const gamificationData = loadGamificationData();
      const result = awardXP(gamificationData, XP_VALUES.GOOD_SLEEP || 5, 'good_sleep', {
        hours: sleepEntry.hours,
      });
      
      setShowXPAnimation(true);
      setTimeout(() => {
        setShowXPAnimation(false);
      }, 3000);
      
      // Check achievements
      checkAchievements(result.data);
    }
  };

  if (!data || !sleepData) {
    return <div className="text-center py-12 text-[var(--txt-muted)]">Loading...</div>;
  }

  const lastNightEntry = sleepData.lastNight;
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  const hasLoggedToday = lastNightEntry?.date === yesterdayStr;

  return (
    <GlassCard className="p-6 relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
            <Moon className="text-indigo-400" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--txt)]">Sleep Tracker</h3>
            <p className="text-xs text-[var(--txt-muted)]">Did you sleep well last night?</p>
          </div>
        </div>
      </div>

      {/* Status Display */}
      {hasLoggedToday && (
        <div className={`mb-4 p-4 rounded-lg border ${
          lastNightEntry.quality
            ? 'bg-green-500/10 border-green-500/30'
            : 'bg-gray-500/10 border-gray-500/30'
        }`}>
          <div className="flex items-center gap-3">
            {lastNightEntry.quality ? (
              <Check className="text-green-400" size={24} />
            ) : (
              <X className="text-gray-400" size={24} />
            )}
            <div>
              <div className={`font-semibold ${
                lastNightEntry.quality ? 'text-green-400' : 'text-gray-400'
              }`}>
                {lastNightEntry.quality ? '✓ Slept well last night' : '✗ Need better rest'}
              </div>
              {lastNightEntry.hours && (
                <div className="text-xs text-[var(--txt-muted)] mt-1">
                  {lastNightEntry.hours} hours
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hours Input (Optional) */}
      {showHoursInput && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4 p-4 bg-[var(--bg-elev-1)] rounded-lg"
        >
          <label className="block text-sm font-medium text-[var(--txt)] mb-2 flex items-center gap-2">
            <Clock size={16} />
            How many hours?
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="4"
              max="12"
              value={hours}
              onChange={(e) => setHours(parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-lg font-bold text-[var(--txt)] w-12 text-center">
              {hours}h
            </span>
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      {!hasLoggedToday && (
        <div className="space-y-3">
          <div className="flex gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (showHoursInput) {
                  logSleep(true, hours);
                  setShowHoursInput(false);
                } else {
                  logSleep(true);
                }
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-4 bg-green-500/20 hover:bg-green-500/30 border-2 border-green-500/30 rounded-lg text-green-400 font-semibold transition"
            >
              <Check size={20} />
              Yes ✓
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (showHoursInput) {
                  logSleep(false, hours);
                  setShowHoursInput(false);
                } else {
                  logSleep(false);
                }
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-4 bg-gray-500/20 hover:bg-gray-500/30 border-2 border-gray-500/30 rounded-lg text-gray-400 font-semibold transition"
            >
              <X size={20} />
              No ✗
            </motion.button>
          </div>
          
          <button
            onClick={() => setShowHoursInput(!showHoursInput)}
            className="w-full text-xs text-[var(--txt-muted)] hover:text-[var(--txt)] transition"
          >
            {showHoursInput ? 'Hide hours' : 'Add hours (optional)'}
          </button>
        </div>
      )}

      {/* Stats */}
      {sleepData.history.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[var(--border)]">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-[var(--txt)]">
                {sleepData.history.filter(h => h.quality).length}
              </div>
              <div className="text-xs text-[var(--txt-muted)]">Good nights</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--txt)]">
                {Math.round(
                  sleepData.history
                    .filter(h => h.hours)
                    .reduce((sum, h) => sum + h.hours, 0) / 
                  sleepData.history.filter(h => h.hours).length
                ) || 0}h
              </div>
              <div className="text-xs text-[var(--txt-muted)]">Avg hours</div>
            </div>
          </div>
        </div>
      )}

      {/* XP Animation */}
      {showXPAnimation && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          className="absolute top-4 right-4 px-3 py-2 bg-green-500/90 backdrop-blur-sm rounded-lg shadow-lg border border-green-400/50"
        >
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <Moon size={16} />
            <span>+5 XP</span>
          </div>
        </motion.div>
      )}
    </GlassCard>
  );
}

