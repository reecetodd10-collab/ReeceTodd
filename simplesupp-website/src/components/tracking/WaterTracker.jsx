import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplet, Droplets, Plus } from 'lucide-react';
import GlassCard from '../shared/GlassCard';
import { loadGamificationData, saveGamificationData, awardXP, XP_VALUES, checkAchievements } from '../../lib/gamification';

export default function WaterTracker() {
  const [data, setData] = useState(loadGamificationData());
  const [waterData, setWaterData] = useState(data.water || { dailyGoal: 8, today: 0, lastUpdated: null, history: [] });
  const [showXPAnimation, setShowXPAnimation] = useState(false);
  const [goalReached, setGoalReached] = useState(false);

  useEffect(() => {
    // Check if it's a new day and reset
    const today = new Date().toISOString().split('T')[0];
    const lastUpdated = waterData.lastUpdated ? new Date(waterData.lastUpdated).toISOString().split('T')[0] : null;
    
    if (lastUpdated !== today) {
      // New day - reset water count but keep history
      const newWaterData = {
        ...waterData,
        today: 0,
        lastUpdated: new Date().toISOString(),
      };
      setWaterData(newWaterData);
      updateGamificationData(newWaterData);
    }
  }, []);

  const updateGamificationData = (newWaterData) => {
    const gamificationData = loadGamificationData();
    gamificationData.water = newWaterData;
    saveGamificationData(gamificationData);
    setData(gamificationData);
  };

  const addWater = (glasses) => {
    const newCount = Math.min(waterData.today + glasses, waterData.dailyGoal * 2); // Cap at 2x goal
    const today = new Date().toISOString().split('T')[0];
    const wasAtGoal = waterData.today >= waterData.dailyGoal;
    const nowAtGoal = newCount >= waterData.dailyGoal;
    
    const newWaterData = {
      ...waterData,
      today: newCount,
      lastUpdated: new Date().toISOString(),
    };

    // Update history
    const historyEntry = newWaterData.history.find(h => h.date === today);
    if (historyEntry) {
      historyEntry.glasses = newCount;
    } else {
      newWaterData.history.push({ date: today, glasses: newCount });
    }

    setWaterData(newWaterData);
    updateGamificationData(newWaterData);

    // Award XP if goal reached for the first time today
    if (!wasAtGoal && nowAtGoal) {
      const gamificationData = loadGamificationData();
      gamificationData.water = newWaterData; // Ensure water data is updated
      const result = awardXP(gamificationData, XP_VALUES.WATER_GOAL || 10, 'water_goal');
      setShowXPAnimation(true);
      setGoalReached(true);
      setTimeout(() => {
        setShowXPAnimation(false);
      }, 3000);
      
      // Check achievements with updated data
      const achievementResult = checkAchievements(result.data);
      if (achievementResult.newlyUnlocked.length > 0) {
        // Achievement unlock notifications could be shown here
        console.log('New achievements unlocked:', achievementResult.newlyUnlocked.map(a => a.name));
      }
    }
  };

  const progressPercentage = Math.min(100, Math.round((waterData.today / waterData.dailyGoal) * 100));
  const fillHeight = Math.min(100, (waterData.today / waterData.dailyGoal) * 100);

  return (
    <GlassCard className="p-6 relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center">
            <Droplets className="text-blue-400" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-normal text-[var(--txt)]">Water Tracker</h3>
            <p className="text-xs text-[var(--txt-muted)]">Daily Goal: {waterData.dailyGoal} glasses</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-normal text-[var(--txt)]">
            {waterData.today}/{waterData.dailyGoal}
          </div>
          <div className="text-xs text-[var(--txt-muted)]">glasses</div>
        </div>
      </div>

      {/* Water Bottle Visualization */}
      <div className="relative mb-6 h-32 flex items-center justify-center">
        <div className="relative w-24 h-32">
          {/* Bottle outline */}
          <svg width="96" height="128" viewBox="0 0 96 128" className="absolute inset-0">
            {/* Bottle shape */}
            <path
              d="M 32 16 Q 32 8 40 8 L 56 8 Q 64 8 64 16 L 64 112 Q 64 120 56 120 L 40 120 Q 32 120 32 112 Z"
              fill="none"
              stroke="var(--border)"
              strokeWidth="3"
            />
            {/* Water fill - using rect for simpler animation */}
            <motion.rect
              x="34"
              y={128 - (fillHeight * 96 / 100)}
              width="28"
              height={fillHeight * 96 / 100}
              fill="url(#waterGradient)"
              initial={{ y: 128, height: 0 }}
              animate={{
                y: 128 - (fillHeight * 96 / 100),
                height: fillHeight * 96 / 100,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              rx="2"
            />
            <defs>
              <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.6" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Ripple effect when adding */}
          <AnimatePresence>
            {showXPAnimation && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 rounded-full bg-blue-400/30 pointer-events-none"
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center text-sm mb-2">
          <span className="text-[var(--txt-muted)]">Progress</span>
          <span className={`font-normal ${goalReached ? 'text-green-400' : 'text-[var(--txt)]'}`}>
            {progressPercentage}% hydrated
          </span>
        </div>
        <div className="w-full bg-[var(--bg-elev-2)] rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`h-full rounded-full ${
              goalReached 
                ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                : 'bg-gradient-to-r from-blue-500 to-cyan-500'
            }`}
          />
        </div>
      </div>

      {/* Quick Add Buttons */}
      <div className="flex gap-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => addWater(1)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[var(--acc)]/20 hover:bg-[var(--acc)]/30 border border-[var(--acc)]/30 rounded-lg text-[var(--acc)] font-normal transition"
        >
          <Plus size={20} />
          +1 Glass
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => addWater(2)}
          className="px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 font-normal transition"
        >
          +2
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => addWater(4)}
          className="px-4 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-lg text-cyan-400 font-normal transition"
        >
          +4
        </motion.button>
      </div>

      {/* XP Animation */}
      <AnimatePresence>
        {showXPAnimation && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="absolute top-4 right-4 px-3 py-2 bg-green-500/90 backdrop-blur-sm rounded-lg shadow-lg border border-green-400/50"
          >
            <div className="flex items-center gap-2 text-white font-normal">
              <Droplet size={16} />
              <span>+10 XP - Goal Reached!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Goal Reached Message */}
      {goalReached && waterData.today >= waterData.dailyGoal && (
        <div className="mt-4 pt-4 border-t border-[var(--border)] text-center">
          <p className="text-sm font-normal text-green-400">
            🎉 You've reached your daily water goal!
          </p>
        </div>
      )}
    </GlassCard>
  );
}

