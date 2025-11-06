import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, TrendingUp } from 'lucide-react';
import { loadGamificationData, getLevelInfo, getLevelProgress, getXPToNextLevel } from '../../lib/gamification';

export default function XPDisplay({ compact = false, showLevelUp = false }) {
  const [data, setData] = useState(loadGamificationData());
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const newData = loadGamificationData();
      setData(newData);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (showLevelUp && data.currentLevel > 1) {
      setShowLevelUpModal(true);
      setTimeout(() => setShowLevelUpModal(false), 3000);
    }
  }, [showLevelUp, data.currentLevel]);

  const levelInfo = getLevelInfo(data.currentLevel);
  const progress = getLevelProgress(data.totalXP, data.currentLevel);
  const xpToNext = getXPToNextLevel(data.totalXP, data.currentLevel);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bg-elev-1)] border border-[var(--border)] rounded-lg">
          <span className="text-lg">{levelInfo.badge}</span>
          <div>
            <div className="text-xs font-semibold text-[var(--txt)]">
              Level {data.currentLevel}
            </div>
            <div className="text-xs text-[var(--txt-muted)]">{levelInfo.tier}</div>
          </div>
        </div>
        <div className="text-sm text-[var(--txt-muted)]">
          {data.totalXP} XP
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Level Badge */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-[var(--acc)]/20 to-blue-500/20 rounded-2xl flex items-center justify-center border border-[var(--acc)]/30">
            <span className="text-3xl">{levelInfo.badge}</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-[var(--txt)]">
              Level {data.currentLevel}
            </div>
            <div className="text-sm text-[var(--txt-muted)]">{levelInfo.tier}</div>
            <div className="text-sm font-semibold text-[var(--acc)] mt-1">
              {data.totalXP} Total XP
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="text-[var(--txt-muted)]">Progress to Level {data.currentLevel + 1}</span>
            <span className="font-semibold text-[var(--txt)]">{progress}%</span>
          </div>
          <div className="w-full bg-[var(--bg-elev-2)] rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-[var(--acc)] to-blue-500 rounded-full"
            />
          </div>
          {xpToNext > 0 && (
            <p className="text-xs text-[var(--txt-muted)] mt-2 text-center">
              {xpToNext} XP to next level
            </p>
          )}
        </div>

        {/* Recent XP */}
        {data.xpHistory && data.xpHistory.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-[var(--txt)] mb-2 flex items-center gap-2">
              <TrendingUp size={16} />
              Recent Activity
            </h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {data.xpHistory.slice(-5).reverse().map((entry, index) => (
                <div key={index} className="flex items-center justify-between text-xs p-2 bg-[var(--bg-elev-1)] rounded">
                  <span className="text-[var(--txt-muted)]">
                    {entry.action.replace(/_/g, ' ')}
                  </span>
                  <span className="font-semibold text-green-400">+{entry.xp} XP</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Level Up Modal */}
      <AnimatePresence>
        {showLevelUpModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="glass-card p-8 text-center max-w-md"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 0.5 }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              <h2 className="text-3xl font-bold text-[var(--txt)] mb-2">
                Level Up!
              </h2>
              <p className="text-xl text-[var(--txt-muted)] mb-4">
                You're now Level {data.currentLevel} - {levelInfo.tier}
              </p>
              <div className="text-4xl mb-4">{levelInfo.badge}</div>
              <button
                onClick={() => setShowLevelUpModal(false)}
                className="px-6 py-2 bg-[var(--acc)] text-white rounded-lg hover:bg-blue-600 transition"
              >
                Awesome!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// XP Toast Notification Component
export function XPToast({ xp, action, isVisible, onClose }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -40, x: '-50%' }}
          className="fixed top-20 left-1/2 z-[90] pointer-events-none"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-green-500/90 backdrop-blur-sm rounded-lg shadow-lg border border-green-400/50">
            <Star className="text-white" size={20} />
            <span className="text-white font-semibold">
              +{xp} XP
            </span>
            <span className="text-white/80 text-sm">
              - {action}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

