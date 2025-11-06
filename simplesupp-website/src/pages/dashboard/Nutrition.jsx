import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UtensilsCrossed } from 'lucide-react';
import MacroRings from '../../components/nutrition/MacroRings';
import MacroInput from '../../components/nutrition/MacroInput';
import MealChecklist from '../../components/nutrition/MealChecklist';
import WeeklyNutritionInsights from '../../components/nutrition/WeeklyNutritionInsights';
import { loadGamificationData, saveGamificationData, awardXP, XP_VALUES, checkAchievements, allMacrosHit } from '../../lib/gamification';
import { calculateCalories, allMacrosHit as checkAllMacros, allMealsComplete, getMealCompletionCount } from '../../lib/nutrition';

export default function Nutrition() {
  const [data, setData] = useState(loadGamificationData());
  const [nutritionData, setNutritionData] = useState(data.nutrition || {
    goals: {
      protein: 150,
      carbs: 250,
      fats: 70,
      calories: 2100,
      goalType: 'maintenance',
    },
    today: {
      date: new Date().toISOString().split('T')[0],
      protein: 0,
      carbs: 0,
      fats: 0,
      calories: 0,
      meals: {
        breakfast: false,
        lunch: false,
        dinner: false,
        preWorkout: false,
        postWorkout: false,
      },
    },
    history: [],
  });

  useEffect(() => {
    // Check if it's a new day and reset
    const today = new Date().toISOString().split('T')[0];
    if (nutritionData.today.date !== today) {
      const newNutritionData = {
        ...nutritionData,
        today: {
          date: today,
          protein: 0,
          carbs: 0,
          fats: 0,
          calories: 0,
          meals: {
            breakfast: false,
            lunch: false,
            dinner: false,
            preWorkout: false,
            postWorkout: false,
          },
        },
      };
      setNutritionData(newNutritionData);
      updateNutritionData(newNutritionData);
    }
  }, []);

  const updateNutritionData = (newNutritionData) => {
    const gamificationData = loadGamificationData();
    gamificationData.nutrition = newNutritionData;
    saveGamificationData(gamificationData);
    setData(gamificationData);
    setNutritionData(newNutritionData);
  };

  const handleUpdateMacros = (macros) => {
    const today = new Date().toISOString().split('T')[0];
    const newNutritionData = {
      ...nutritionData,
      today: {
        ...nutritionData.today,
        ...macros,
        date: today,
      },
    };

    // Check if all macros are hit
    const allHit = checkAllMacros(
      macros.protein,
      macros.carbs,
      macros.fats,
      nutritionData.goals
    );

    // Check if we should award XP for hitting all macros
    const wasAllHit = checkAllMacros(
      nutritionData.today.protein,
      nutritionData.today.carbs,
      nutritionData.today.fats,
      nutritionData.goals
    );

    if (!wasAllHit && allHit) {
      // Award XP for hitting all macros
      const gamificationData = loadGamificationData();
      gamificationData.nutrition = newNutritionData;
      const result = awardXP(gamificationData, XP_VALUES.ALL_MACROS_HIT || 20, 'all_macros_hit');
      
      // Check achievements
      const achievementResult = checkAchievements(result.data);
      if (achievementResult.newlyUnlocked.length > 0) {
        console.log('New achievements unlocked:', achievementResult.newlyUnlocked.map(a => a.name));
      }
    }

    // Update history
    let historyEntry = newNutritionData.history.find(h => h.date === today);
    if (historyEntry) {
      historyEntry.protein = macros.protein;
      historyEntry.carbs = macros.carbs;
      historyEntry.fats = macros.fats;
      historyEntry.calories = macros.calories;
      historyEntry.allMacrosHit = allHit;
    } else {
      newNutritionData.history.push({
        date: today,
        ...macros,
        mealsComplete: getMealCompletionCount(nutritionData.today.meals),
        allMacrosHit: allHit,
      });
    }

    updateNutritionData(newNutritionData);
  };

  const handleUpdateMeals = (meals) => {
    const today = new Date().toISOString().split('T')[0];
    const newMeals = meals;
    
    // Check if all meals are now complete
    const allMealsNowComplete = allMealsComplete(newMeals);
    const wasAllMealsComplete = allMealsComplete(nutritionData.today.meals);

    const newNutritionData = {
      ...nutritionData,
      today: {
        ...nutritionData.today,
        meals: newMeals,
        date: today,
      },
    };

    // Award XP if all meals are complete for the first time today
    if (!wasAllMealsComplete && allMealsNowComplete) {
      const gamificationData = loadGamificationData();
      gamificationData.nutrition = newNutritionData;
      const result = awardXP(gamificationData, XP_VALUES.ALL_MEALS_COMPLETE || 15, 'all_meals_complete');
      
      // Check achievements
      checkAchievements(result.data);
    }

    // Update history
    let historyEntry = newNutritionData.history.find(h => h.date === today);
    if (historyEntry) {
      historyEntry.mealsComplete = getMealCompletionCount(newMeals);
    } else {
      const allMacros = checkAllMacros(
        nutritionData.today.protein,
        nutritionData.today.carbs,
        nutritionData.today.fats,
        nutritionData.goals
      );
      newNutritionData.history.push({
        date: today,
        protein: nutritionData.today.protein,
        carbs: nutritionData.today.carbs,
        fats: nutritionData.today.fats,
        calories: nutritionData.today.calories,
        mealsComplete: getMealCompletionCount(newMeals),
        allMacrosHit: allMacros,
      });
    }

    updateNutritionData(newNutritionData);
  };

  const handleUpdateGoals = (newGoals) => {
    const newNutritionData = {
      ...nutritionData,
      goals: newGoals,
    };
    updateNutritionData(newNutritionData);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-[var(--txt)] flex items-center gap-3">
          <UtensilsCrossed className="text-[var(--acc)]" size={40} />
          Nutrition Tracking
        </h1>
        <p className="text-lg text-[var(--txt-muted)]">
          Track your daily macros and meal consistency
        </p>
      </div>

      {/* Macro Rings */}
      <div className="mb-8">
        <MacroRings
          protein={nutritionData.today.protein}
          carbs={nutritionData.today.carbs}
          fats={nutritionData.today.fats}
          goals={nutritionData.goals}
        />
      </div>

      {/* Macro Input & Meal Checklist */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <MacroInput
          goals={nutritionData.goals}
          today={nutritionData.today}
          onUpdate={handleUpdateMacros}
          onUpdateGoals={handleUpdateGoals}
        />
        <MealChecklist
          todayMeals={nutritionData.today.meals}
          onUpdate={handleUpdateMeals}
        />
      </div>

      {/* Weekly Insights */}
      <WeeklyNutritionInsights nutritionData={nutritionData} />
    </div>
  );
}

