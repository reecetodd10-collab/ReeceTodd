// ============================================
// NUTRITION UTILITIES - Macro Calculations
// ============================================

// Calculate calories from macros
export function calculateCalories(protein, carbs, fats) {
  return (protein * 4) + (carbs * 4) + (fats * 9);
}

// Get default macro goals based on goal type
export function getDefaultMacroGoals(goalType, calories = 2100) {
  const goals = {
    muscle_building: {
      protein: Math.round(calories * 0.30 / 4), // 30% protein
      carbs: Math.round(calories * 0.40 / 4),   // 40% carbs
      fats: Math.round(calories * 0.30 / 9),    // 30% fat
      calories,
      goalType: 'muscle_building',
    },
    fat_loss: {
      protein: Math.round(calories * 0.40 / 4), // 40% protein
      carbs: Math.round(calories * 0.30 / 4),   // 30% carbs
      fats: Math.round(calories * 0.30 / 9),    // 30% fat
      calories,
      goalType: 'fat_loss',
    },
    maintenance: {
      protein: Math.round(calories * 0.30 / 4), // 30% protein
      carbs: Math.round(calories * 0.40 / 4),   // 40% carbs
      fats: Math.round(calories * 0.30 / 9),    // 30% fat
      calories,
      goalType: 'maintenance',
    },
    recomp: {
      protein: Math.round(calories * 0.35 / 4), // 35% protein
      carbs: Math.round(calories * 0.35 / 4),   // 35% carbs
      fats: Math.round(calories * 0.30 / 9),    // 30% fat
      calories,
      goalType: 'recomp',
    },
  };

  return goals[goalType] || goals.maintenance;
}

// Check if all macros are hit
export function allMacrosHit(protein, carbs, fats, goals) {
  return protein >= goals.protein && carbs >= goals.carbs && fats >= goals.fats;
}

// Get macro progress percentage
export function getMacroProgress(current, goal) {
  if (!goal || goal === 0) return 0;
  return Math.min(100, Math.round((current / goal) * 100));
}

// Check if all meals are completed
export function allMealsComplete(meals) {
  const requiredMeals = ['breakfast', 'lunch', 'dinner'];
  return requiredMeals.every(meal => meals[meal] === true);
}

// Get meal completion count
export function getMealCompletionCount(meals) {
  const allMeals = ['breakfast', 'lunch', 'dinner', 'preWorkout', 'postWorkout'];
  return allMeals.filter(meal => meals[meal] === true).length;
}

