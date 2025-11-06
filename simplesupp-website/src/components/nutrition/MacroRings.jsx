import React from 'react';
import { motion } from 'framer-motion';
import { getMacroProgress, calculateCalories } from '../../lib/nutrition';

export default function MacroRings({ protein = 0, carbs = 0, fats = 0, goals = {} }) {
  const proteinGoal = goals.protein || 150;
  const carbsGoal = goals.carbs || 250;
  const fatsGoal = goals.fats || 70;
  const caloriesGoal = goals.calories || 2100;
  
  const proteinProgress = getMacroProgress(protein, proteinGoal);
  const carbsProgress = getMacroProgress(carbs, carbsGoal);
  const fatsProgress = getMacroProgress(fats, fatsGoal);
  const totalCalories = calculateCalories(protein, carbs, fats);
  const caloriesProgress = getMacroProgress(totalCalories, caloriesGoal);

  // SVG circle parameters
  const centerX = 120;
  const centerY = 120;
  const radius1 = 90;  // Inner (Fats)
  const radius2 = 100; // Middle (Carbs)
  const radius3 = 110; // Outer (Protein)

  const circumference = (radius) => 2 * Math.PI * radius;
  const getDashOffset = (radius, percentage) => {
    const circ = circumference(radius);
    return circ - (circ * percentage) / 100;
  };

  return (
    <div className="flex justify-center mb-6">
      <div className="relative w-[240px] h-[240px]">
        <svg width="240" height="240" className="transform -rotate-90">
          {/* Outer Ring - Protein (Red) */}
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
            stroke="url(#proteinGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference(radius3)}
            initial={{ strokeDashoffset: circumference(radius3) }}
            animate={{ strokeDashoffset: getDashOffset(radius3, proteinProgress) }}
            transition={{ duration: 1, ease: "easeOut" }}
          />

          {/* Middle Ring - Carbs (Yellow) */}
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
            stroke="url(#carbsGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference(radius2)}
            initial={{ strokeDashoffset: circumference(radius2) }}
            animate={{ strokeDashoffset: getDashOffset(radius2, carbsProgress) }}
            transition={{ duration: 1, ease: "easeOut" }}
          />

          {/* Inner Ring - Fats (Blue) */}
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
            stroke="url(#fatsGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference(radius1)}
            initial={{ strokeDashoffset: circumference(radius1) }}
            animate={{ strokeDashoffset: getDashOffset(radius1, fatsProgress) }}
            transition={{ duration: 1, ease: "easeOut" }}
          />

          {/* Gradients */}
          <defs>
            <linearGradient id="proteinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
            <linearGradient id="carbsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
            <linearGradient id="fatsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>

          {/* Center Calories Display */}
          <foreignObject x={centerX - 70} y={centerY - 40} width="140" height="80">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-2xl font-bold text-[var(--txt)] mb-1"
              >
                {totalCalories}
              </motion.div>
              <div className="text-xs text-[var(--txt-muted)]">
                / {caloriesGoal} cal
              </div>
              <div className="text-xs text-[var(--txt-muted)] mt-1">
                {caloriesProgress}%
              </div>
            </div>
          </foreignObject>
        </svg>
      </div>
    </div>
  );
}

