import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import GlassCard from '../shared/GlassCard';
import { allMealsComplete, getMealCompletionCount } from '../../lib/nutrition';

const meals = [
  { id: 'breakfast', label: 'Breakfast', icon: '🍳', required: true },
  { id: 'lunch', label: 'Lunch', icon: '🥗', required: true },
  { id: 'dinner', label: 'Dinner', icon: '🍗', required: true },
  { id: 'preWorkout', label: 'Pre-Workout', icon: '⚡', required: false },
  { id: 'postWorkout', label: 'Post-Workout', icon: '🥤', required: false },
];

export default function MealChecklist({ todayMeals, onUpdate }) {
  const [showXPAnimation, setShowXPAnimation] = useState(false);

  const handleToggleMeal = (mealId) => {
    const newMeals = {
      ...todayMeals,
      [mealId]: !todayMeals[mealId],
    };
    
    onUpdate(newMeals);

    // Check if all meals are now complete
    if (allMealsComplete(newMeals)) {
      setShowXPAnimation(true);
      setTimeout(() => {
        setShowXPAnimation(false);
      }, 3000);
    }
  };

  const completedCount = getMealCompletionCount(todayMeals);
  const allComplete = allMealsComplete(todayMeals);

  return (
    <GlassCard className="p-6 relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-normal text-[var(--txt)]">Meal Check-ins</h3>
        <span className="text-sm text-[var(--txt-muted)]">
          {completedCount}/{meals.length} meals
        </span>
      </div>

      <div className="space-y-3">
        {meals.map((meal) => {
          const isChecked = todayMeals[meal.id] === true;
          return (
            <motion.button
              key={meal.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleToggleMeal(meal.id)}
              className={`
                w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all
                ${isChecked
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'bg-[var(--bg-elev-1)] border-[var(--border)] hover:border-[var(--acc)]/30'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center text-2xl
                  ${isChecked ? 'bg-green-500/20' : 'bg-[var(--bg-elev-2)]'}
                `}>
                  {meal.icon}
                </div>
                <div className="text-left">
                  <div className="font-normal text-[var(--txt)]">{meal.label}</div>
                  {!meal.required && (
                    <div className="text-xs text-[var(--txt-muted)]">Optional</div>
                  )}
                </div>
              </div>
              <div className={`
                w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all
                ${isChecked
                  ? 'bg-green-500 border-green-500'
                  : 'border-[var(--border)]'
                }
              `}>
                <AnimatePresence>
                  {isChecked && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <Check size={20} className="text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.button>
          );
        })}
      </div>

      {allComplete && (
        <div className="mt-4 pt-4 border-t border-[var(--border)] text-center">
          <p className="text-sm font-normal text-green-400">
            🎉 All meals completed!
          </p>
        </div>
      )}

      {/* XP Animation */}
      <AnimatePresence>
        {showXPAnimation && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="absolute top-4 right-4 px-3 py-2 bg-green-500/90 backdrop-blur-sm rounded-lg shadow-lg border border-green-400/50"
          >
            <div className="flex items-center gap-2 text-white font-normal text-sm">
              <Check size={16} />
              <span>+15 XP</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}

