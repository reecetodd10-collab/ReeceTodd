import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Pill, Dumbbell, Target } from 'lucide-react';
import GlassCard from '../shared/GlassCard';
import { loadGamificationData } from '../../lib/gamification';
import { allMacrosHit } from '../../lib/nutrition';

export default function HabitRings({ supplementsTaken = 0, supplementsTotal = 0, workoutComplete = false }) {
  const [data, setData] = useState(loadGamificationData());
  
  useEffect(() => {
    // Reload data periodically to sync with other components
    const interval = setInterval(() => {
      setData(loadGamificationData());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate percentages
  const supplementPercentage = supplementsTotal > 0 
    ? Math.min(100, Math.round((supplementsTaken / supplementsTotal) * 100))
    : 0;
  const workoutPercentage = workoutComplete ? 100 : 0;
  
  // Core goals (70% weight)
  const supplementsComplete = supplementPercentage >= 80;
  const coreComplete = (supplementsComplete + (workoutComplete ? 1 : 0)) / 2;

  // Bonus goals (30% weight)
  const waterData = data.water || { today: 0, dailyGoal: 8 };
  const waterComplete = waterData.today >= waterData.dailyGoal;

  const nutritionData = data.nutrition || { today: { meals: {} } };
  const meals = nutritionData.today.meals || {};
  const requiredMeals = ['breakfast', 'lunch', 'dinner'];
  const mealsComplete = requiredMeals.every(meal => meals[meal] === true);

  const sleepData = data.sleep || { lastNight: null };
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  const sleepComplete = sleepData.lastNight?.date === yesterdayStr && sleepData.lastNight?.quality === true;

  const nutritionToday = nutritionData.today || {};
  const nutritionGoals = nutritionData.goals || {};
  const macrosComplete = nutritionGoals.protein && nutritionGoals.carbs && nutritionGoals.fats
    ? allMacrosHit(
        nutritionToday.protein || 0,
        nutritionToday.carbs || 0,
        nutritionToday.fats || 0,
        nutritionGoals
      )
    : false;

  const bonusGoals = [waterComplete, mealsComplete, sleepComplete, macrosComplete];
  const bonusComplete = bonusGoals.filter(x => x).length / bonusGoals.length;

  // Weighted consistency score: Core (70%) + Bonus (30%)
  const consistencyPercentage = Math.round((coreComplete * 0.7 + bonusComplete * 0.3) * 100);

  const overallCompletion = Math.round((supplementPercentage + workoutPercentage + consistencyPercentage) / 3);
  
  // Bonus goal indicators
  const bonusGoalStatus = {
    water: waterComplete,
    meals: mealsComplete,
    sleep: sleepComplete,
    macros: macrosComplete,
  };

  // SVG circle parameters
  const centerX = 120;
  const centerY = 120;
  const radius1 = 100; // Inner (Consistency)
  const radius2 = 110; // Middle (Workout)
  const radius3 = 120; // Outer (Supplements)

  // Convert percentage to stroke-dasharray
  const circumference = (radius) => 2 * Math.PI * radius;
  const getDashArray = (radius, percentage) => {
    const circ = circumference(radius);
    const offset = circ - (circ * percentage) / 100;
    return `${circ} ${circ}`;
  };
  const getDashOffset = (radius, percentage) => {
    const circ = circumference(radius);
    return circ - (circ * percentage) / 100;
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <GlassCard className="p-6 mb-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-normal text-[var(--txt)] mb-2" style={{ letterSpacing: '2px' }}>Today's Progress</h2>
        <p className="text-sm text-[var(--txt-muted)]">{today}</p>
      </div>

      {/* Rings */}
      <div className="flex justify-center mb-6">
        <div className="relative w-[240px] h-[240px]">
          <svg width="240" height="240" className="transform -rotate-90">
            {/* Outer Ring - Supplements (Red/Orange) */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius3}
              fill="none"
              stroke="var(--bg-elev-2)"
              strokeWidth="8"
            />
            <motion.circle
              cx={centerX}
              cy={centerY}
              r={radius3}
              fill="none"
              stroke="url(#supplementGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={getDashArray(radius3, 100)}
              initial={{ strokeDashoffset: circumference(radius3) }}
              animate={{ strokeDashoffset: getDashOffset(radius3, supplementPercentage) }}
              transition={{ duration: 1, ease: "easeOut" }}
            />

            {/* Middle Ring - Workout (Green) */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius2}
              fill="none"
              stroke="var(--bg-elev-2)"
              strokeWidth="8"
            />
            <motion.circle
              cx={centerX}
              cy={centerY}
              r={radius2}
              fill="none"
              stroke="url(#workoutGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={getDashArray(radius2, 100)}
              initial={{ strokeDashoffset: circumference(radius2) }}
              animate={{ strokeDashoffset: getDashOffset(radius2, workoutPercentage) }}
              transition={{ duration: 1, ease: "easeOut" }}
            />

            {/* Inner Ring - Consistency (Blue) */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius1}
              fill="none"
              stroke="var(--bg-elev-2)"
              strokeWidth="8"
            />
            <motion.circle
              cx={centerX}
              cy={centerY}
              r={radius1}
              fill="none"
              stroke="url(#consistencyGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={getDashArray(radius1, 100)}
              initial={{ strokeDashoffset: circumference(radius1) }}
              animate={{ strokeDashoffset: getDashOffset(radius1, consistencyPercentage) }}
              transition={{ duration: 1, ease: "easeOut" }}
            />

            {/* Gradients */}
            <defs>
              <linearGradient id="supplementGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
              <linearGradient id="workoutGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="consistencyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
            </defs>

            {/* Center Percentage */}
            <foreignObject x={centerX - 60} y={centerY - 30} width="120" height="60">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-3xl font-normal text-[var(--txt)]"
                >
                  {overallCompletion}%
                </motion.div>
                <div className="text-xs text-[var(--txt-muted)]">Complete</div>
              </div>
            </foreignObject>
          </svg>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-[var(--bg-elev-1)] rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
              <Pill className="text-orange-400" size={16} />
            </div>
            <span className="text-sm font-normal text-[var(--txt)]">Supplements</span>
          </div>
          <span className="text-sm font-normal text-[var(--txt)]">
            {supplementsTaken}/{supplementsTotal}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-[var(--bg-elev-1)] rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
              <Dumbbell className="text-green-400" size={16} />
            </div>
            <span className="text-sm font-normal text-[var(--txt)]">Workout</span>
          </div>
          <span className={`text-sm font-normal ${workoutComplete ? 'text-green-400' : 'text-[var(--txt-muted)]'}`}>
            {workoutComplete ? 'Complete ✓' : 'Not started'}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-[var(--bg-elev-1)] rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center">
              <Target className="text-blue-400" size={16} />
            </div>
            <span className="text-sm font-normal text-[var(--txt)]">Consistency</span>
          </div>
          <span className="text-sm font-normal text-[var(--txt)]">
            {consistencyPercentage}%
          </span>
        </div>

        {/* Bonus Goals Indicators */}
        <div className="mt-3 pt-3 border-t border-[var(--border)]">
          <div className="flex items-center justify-center gap-2">
            {[
              { icon: '💧', complete: bonusGoalStatus.water, label: 'Water' },
              { icon: '🍽️', complete: bonusGoalStatus.meals, label: 'Meals' },
              { icon: '😴', complete: bonusGoalStatus.sleep, label: 'Sleep' },
              { icon: '📊', complete: bonusGoalStatus.macros, label: 'Macros' },
            ].map((goal, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-lg transition ${
                  goal.complete
                    ? 'bg-blue-500/20 border border-blue-500/30'
                    : 'bg-[var(--bg-elev-2)] border border-[var(--border)] opacity-50'
                }`}
                title={goal.label}
              >
                {goal.icon}
              </div>
            ))}
          </div>
          <p className="text-xs text-center text-[var(--txt-muted)] mt-2">
            Bonus goals: {Object.values(bonusGoalStatus).filter(Boolean).length}/4
          </p>
        </div>

        {/* Streak */}
        {data.currentStreak > 0 && (
          <div className="mt-4 pt-4 border-t border-[var(--border)] text-center">
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">🔥</span>
              <span className="text-lg font-normal text-[var(--txt)]">
                {data.currentStreak} day streak!
              </span>
            </div>
            {data.currentStreak >= 7 && overallCompletion < 100 && (
              <p className="text-xs text-yellow-400 mt-2">
                ⚠️ Complete today's goals to keep your streak!
              </p>
            )}
          </div>
        )}

        {/* CTA if incomplete */}
        {overallCompletion < 100 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-[var(--txt-muted)]">Complete your goals!</p>
          </div>
        )}
      </div>
    </GlassCard>
  );
}

