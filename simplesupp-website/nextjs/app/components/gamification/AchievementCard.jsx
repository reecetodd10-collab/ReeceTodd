'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Check } from 'lucide-react';
import { ACHIEVEMENTS } from '../../lib/gamification';

export default function AchievementCard({ achievementId, unlocked = false, unlockedDate = null, progress = 0, onUnlock }) {
  const achievement = ACHIEVEMENTS[achievementId];
  
  if (!achievement) return null;

  const isLocked = !unlocked;
  const progressPercentage = Math.min(100, Math.round(progress));

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`
        relative p-4 rounded-lg border-2 transition-all cursor-pointer
        ${isLocked 
          ? 'bg-[var(--bg-elev-1)] border-[var(--border)] opacity-60' 
          : 'bg-gradient-to-br from-[var(--acc)]/10 to-blue-500/10 border-[var(--acc)]/30 shadow-premium'
        }
      `}
    >
      {/* Unlock Badge */}
      {unlocked && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <Check size={14} className="text-white" />
        </div>
      )}

      {/* Achievement Icon */}
      <div className={`
        text-5xl mb-3 text-center filter
        ${isLocked ? 'grayscale' : ''}
      `}>
        {achievement.emoji}
      </div>

      {/* Achievement Info */}
      <h3 className="text-lg font-bold text-[var(--txt)] mb-1 text-center">
        {achievement.name}
      </h3>
      <p className="text-sm text-[var(--txt-muted)] mb-3 text-center">
        {achievement.description}
      </p>

      {/* XP Reward */}
      <div className="text-center mb-3">
        <span className="text-xs font-semibold text-green-400">
          +{achievement.xpReward} XP
        </span>
      </div>

      {/* Progress Bar (if locked) */}
      {isLocked && progressPercentage > 0 && (
        <div className="mt-3">
          <div className="w-full bg-[var(--bg-elev-2)] rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-[var(--acc)] to-blue-500 rounded-full"
            />
          </div>
          <p className="text-xs text-[var(--txt-muted)] mt-1 text-center">
            {progressPercentage}% complete
          </p>
        </div>
      )}

      {/* Unlocked Date */}
      {unlocked && unlockedDate && (
        <div className="mt-3 pt-3 border-t border-[var(--border)]">
          <p className="text-xs text-[var(--txt-muted)] text-center">
            Unlocked {new Date(unlockedDate).toLocaleDateString()}
          </p>
        </div>
      )}

      {/* Lock Icon */}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
          <Lock className="text-white/50" size={32} />
        </div>
      )}
    </motion.div>
  );
}

