import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Check, Target, Trophy } from 'lucide-react';
import GlassCard from '../shared/GlassCard';
import { loadGamificationData, saveGamificationData, awardXP, XP_VALUES, checkAchievements } from '../../lib/gamification';
import { allMacrosHit } from '../../lib/nutrition';

export default function EnhancedGoalsChecklist() {
  const [data, setData] = useState(loadGamificationData());
  const [expanded, setExpanded] = useState(true);
  const [showXPAnimation, setShowXPAnimation] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(loadGamificationData());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Calculate today's goals completion
  const calculateGoals = () => {
    // Supplements
    const checkedToday = JSON.parse(localStorage.getItem('aviera_checked_today') || '{}');
    const userStack = JSON.parse(localStorage.getItem('aviera_user_stack') || '{}');
    const supplementsTaken = Object.values(checkedToday).filter(Boolean).length;
    const supplementsTotal = userStack.supplements?.length || 0;
    const supplementsProgress = supplementsTotal > 0 
      ? Math.round((supplementsTaken / supplementsTotal) * 100)
      : 0;
    const supplementsComplete = supplementsProgress >= 80;

    // Workout
    const workoutData = JSON.parse(localStorage.getItem('aviera_workout_plan') || '{}');
    const today = new Date().getDay();
    const dayMapping = { 0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday' };
    const currentDayName = dayMapping[today];
    const currentWeek = workoutData.weeks?.[workoutData.currentWeekIndex];
    const todayWorkout = currentWeek?.days?.find(d => d.day === currentDayName);
    const workoutComplete = todayWorkout?.completed || false;

    // Water
    const waterData = data.water || { today: 0, dailyGoal: 8 };
    const waterComplete = waterData.today >= waterData.dailyGoal;
    const waterProgress = waterData.dailyGoal > 0 
      ? Math.round((waterData.today / waterData.dailyGoal) * 100)
      : 0;

    // Meals
    const nutritionData = data.nutrition || { today: { meals: {} } };
    const meals = nutritionData.today.meals || {};
    const requiredMeals = ['breakfast', 'lunch', 'dinner'];
    const optionalMeals = ['preWorkout', 'postWorkout'];
    const allMeals = [...requiredMeals, ...optionalMeals];
    const mealsComplete = requiredMeals.every(meal => meals[meal] === true);
    const mealsCount = allMeals.filter(meal => meals[meal] === true).length;

    // Sleep
    const sleepData = data.sleep || { lastNight: null };
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const sleepComplete = sleepData.lastNight?.date === yesterdayStr && sleepData.lastNight?.quality === true;

    // Macros
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

    // Core goals
    const coreGoals = [
      { id: 'supplements', name: 'Supplements', icon: '💊', complete: supplementsComplete, progress: `${supplementsTaken}/${supplementsTotal}`, xp: 0, required: true },
      { id: 'workout', name: 'Workout', icon: '💪', complete: workoutComplete, progress: workoutComplete ? 'Complete' : 'Not started', xp: 50, required: true },
    ];

    // Bonus goals
    const bonusGoals = [
      { id: 'water', name: 'Water', icon: '💧', complete: waterComplete, progress: `${waterData.today}/${waterData.dailyGoal}`, xp: 10, required: false },
      { id: 'meals', name: 'Meals', icon: '🍽️', complete: mealsComplete, progress: `${mealsCount}/${allMeals.length}`, xp: 15, required: false },
      { id: 'sleep', name: 'Sleep', icon: '😴', complete: sleepComplete, progress: sleepComplete ? 'Good rest' : 'Not logged', xp: 5, required: false },
      { id: 'macros', name: 'Macros', icon: '📊', complete: macrosComplete, progress: macrosComplete ? 'All hit' : 'In progress', xp: 20, required: false },
    ];

    // Calculate completion
    const allGoals = [...coreGoals, ...bonusGoals];
    const completedCount = allGoals.filter(g => g.complete).length;
    const totalCount = allGoals.length;
    const completionPercentage = Math.round((completedCount / totalCount) * 100);
    const coreCompleted = coreGoals.filter(g => g.complete).length;
    const bonusCompleted = bonusGoals.filter(g => g.complete).length;

    return {
      coreGoals,
      bonusGoals,
      allGoals,
      completedCount,
      totalCount,
      completionPercentage,
      coreCompleted,
      bonusCompleted,
      supplementsProgress,
      waterProgress,
    };
  };

  const goals = calculateGoals();
  const remainingGoals = goals.totalCount - goals.completedCount;

  // Calculate consistency score for habit rings
  const coreComplete = goals.coreGoals.filter(g => g.complete).length / goals.coreGoals.length;
  const bonusComplete = goals.bonusGoals.filter(g => g.complete).length / goals.bonusGoals.length;
  const consistencyScore = (coreComplete * 0.7) + (bonusComplete * 0.3);

  // Save daily goals data and check for 100% completion bonus XP
  useEffect(() => {
    const gamificationData = loadGamificationData();
    const today = new Date().toISOString().split('T')[0];
    
    // Update daily goals today
    if (!gamificationData.dailyGoals) {
      gamificationData.dailyGoals = {
        today: {
          date: today,
          core: {},
          bonus: {},
          completionPercentage: 0,
          xpEarned: 0,
        },
        history: [],
      };
    }

    // Update today's goals
    gamificationData.dailyGoals.today = {
      date: today,
      core: {
        supplements: { complete: goals.coreGoals[0]?.complete || false, progress: goals.coreGoals[0]?.progress || '0/0' },
        workout: { complete: goals.coreGoals[1]?.complete || false },
      },
      bonus: {
        water: { complete: goals.bonusGoals[0]?.complete || false, progress: goals.bonusGoals[0]?.progress || '0/8' },
        meals: { complete: goals.bonusGoals[1]?.complete || false, progress: goals.bonusGoals[1]?.progress || '0/5' },
        sleep: { complete: goals.bonusGoals[2]?.complete || false },
        macros: { complete: goals.bonusGoals[3]?.complete || false, progress: goals.bonusGoals[3]?.progress || '0/3' },
      },
      completionPercentage: goals.completionPercentage,
      xpEarned: gamificationData.dailyGoals.today.xpEarned || 0,
    };

    // Award bonus XP for 100% completion (only once per day)
    if (goals.completionPercentage === 100 && gamificationData.dailyGoals.today.xpEarned === 0) {
      const result = awardXP(gamificationData, 50, 'perfect_day_completion');
      gamificationData.dailyGoals.today.xpEarned = 50;
      
      // Check achievements
      checkAchievements(result.data);
      saveGamificationData(result.data);
      setData(result.data);
    } else {
      saveGamificationData(gamificationData);
    }
  }, [goals.completionPercentage]);

  return (
    <GlassCard className="p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[var(--acc)]/20 to-blue-500/20 rounded-full flex items-center justify-center">
            <Target className="text-[var(--acc)]" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-normal text-[var(--txt)]">Today's Goals</h3>
            <p className="text-xs text-[var(--txt-muted)]">
              {goals.completedCount}/{goals.totalCount} complete - {goals.completionPercentage}%
            </p>
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-2 hover:bg-[var(--bg-elev-2)] rounded-lg transition"
        >
          {expanded ? <ChevronUp size={20} className="text-[var(--txt-muted)]" /> : <ChevronDown size={20} className="text-[var(--txt-muted)]" />}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-[var(--bg-elev-2)] rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${goals.completionPercentage}%` }}
            transition={{ duration: 0.5 }}
            className={`h-full rounded-full ${
              goals.completionPercentage === 100
                ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                : goals.completionPercentage >= 75
                  ? 'bg-gradient-to-r from-[var(--acc)] to-blue-500'
                  : goals.completionPercentage >= 50
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                    : 'bg-gradient-to-r from-red-400 to-red-500'
            }`}
          />
        </div>
      </div>

      {/* Motivational Text */}
      {goals.completionPercentage < 100 && (
        <div className="mb-4 p-3 bg-[var(--bg-elev-1)] rounded-lg">
          <p className="text-sm text-[var(--txt-muted)] text-center">
            Complete {remainingGoals} more {remainingGoals === 1 ? 'goal' : 'goals'} for 100%! 🎯
          </p>
        </div>
      )}

      {goals.completionPercentage === 100 && (
        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
          <p className="text-sm font-normal text-green-400 text-center flex items-center justify-center gap-2">
            <Trophy size={16} />
            Perfect day! All goals completed! 🎉
          </p>
        </div>
      )}

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Core Goals */}
            <div className="mb-4">
              <h4 className="text-sm font-normal text-[var(--txt)] mb-3 flex items-center gap-2">
                <Target size={16} />
                Core Goals (Required for Streak)
              </h4>
              <div className="space-y-2">
                {goals.coreGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className={`flex items-center justify-between p-3 rounded-lg border transition ${
                      goal.complete
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-[var(--bg-elev-1)] border-[var(--border)]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xl ${
                        goal.complete ? 'bg-green-500/20' : 'bg-[var(--bg-elev-2)]'
                      }`}>
                        {goal.icon}
                      </div>
                      <div>
                        <div className="font-normal text-[var(--txt)]">{goal.name}</div>
                        <div className="text-xs text-[var(--txt-muted)]">{goal.progress}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {goal.xp > 0 && !goal.complete && (
                        <span className="text-xs text-[var(--txt-muted)]">+{goal.xp} XP</span>
                      )}
                      {goal.complete && (
                        <Check size={20} className="text-green-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bonus Goals */}
            <div>
              <h4 className="text-sm font-normal text-[var(--txt)] mb-3 flex items-center gap-2">
                <Trophy size={16} />
                Bonus Goals (Extra XP)
              </h4>
              <div className="space-y-2">
                {goals.bonusGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className={`flex items-center justify-between p-3 rounded-lg border transition ${
                      goal.complete
                        ? 'bg-blue-500/10 border-blue-500/30'
                        : 'bg-[var(--bg-elev-1)] border-[var(--border)]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xl ${
                        goal.complete ? 'bg-blue-500/20' : 'bg-[var(--bg-elev-2)]'
                      }`}>
                        {goal.icon}
                      </div>
                      <div>
                        <div className="font-normal text-[var(--txt)]">{goal.name}</div>
                        <div className="text-xs text-[var(--txt-muted)]">{goal.progress}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-blue-400">+{goal.xp} XP</span>
                      {goal.complete && (
                        <Check size={20} className="text-blue-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Consistency Score Info */}
            <div className="mt-4 pt-4 border-t border-[var(--border)]">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--txt-muted)]">Consistency Score</span>
                <span className="font-normal text-[var(--txt)]">
                  Core: {Math.round(coreComplete * 100)}% | Bonus: {Math.round(bonusComplete * 100)}%
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}

