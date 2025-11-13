// ============================================
// GAMIFICATION SYSTEM - XP, Levels, Achievements
// ============================================

// XP Values for different actions
export const XP_VALUES = {
  SUPPLEMENT_TAKEN: 5,
  WORKOUT_COMPLETE: 50,
  PERSONAL_RECORD: 100,
  STREAK_7_DAYS: 200,
  STREAK_30_DAYS: 500,
  WEEKLY_GOALS_COMPLETE: 150,
  WATER_GOAL: 10,
  GOOD_SLEEP: 5,
  ALL_MACROS_HIT: 20,
  ALL_MEALS_COMPLETE: 15,
  MACRO_STREAK_7_DAYS: 100,
};

// Level thresholds
export const LEVEL_THRESHOLDS = [
  { level: 1, xp: 0, tier: 'Beginner', badge: '🥉' },
  { level: 2, xp: 100, tier: 'Beginner', badge: '🥉' },
  { level: 3, xp: 250, tier: 'Beginner', badge: '🥉' },
  { level: 4, xp: 400, tier: 'Beginner', badge: '🥉' },
  { level: 5, xp: 500, tier: 'Beginner', badge: '🥉' },
  { level: 6, xp: 750, tier: 'Novice', badge: '🥈' },
  { level: 7, xp: 1000, tier: 'Novice', badge: '🥈' },
  { level: 8, xp: 1250, tier: 'Novice', badge: '🥈' },
  { level: 9, xp: 1500, tier: 'Novice', badge: '🥈' },
  { level: 10, xp: 1750, tier: 'Novice', badge: '🥈' },
  { level: 11, xp: 2000, tier: 'Intermediate', badge: '🥇' },
  { level: 12, xp: 2400, tier: 'Intermediate', badge: '🥇' },
  { level: 13, xp: 2800, tier: 'Intermediate', badge: '🥇' },
  { level: 14, xp: 3200, tier: 'Intermediate', badge: '🥇' },
  { level: 15, xp: 3600, tier: 'Intermediate', badge: '🥇' },
  { level: 16, xp: 4000, tier: 'Intermediate', badge: '🥇' },
  { level: 17, xp: 4500, tier: 'Advanced', badge: '💎' },
  { level: 18, xp: 5000, tier: 'Advanced', badge: '💎' },
  { level: 19, xp: 5500, tier: 'Advanced', badge: '💎' },
  { level: 20, xp: 6000, tier: 'Advanced', badge: '💎' },
  { level: 21, xp: 6500, tier: 'Advanced', badge: '💎' },
  { level: 22, xp: 7000, tier: 'Advanced', badge: '💎' },
  { level: 23, xp: 7500, tier: 'Advanced', badge: '💎' },
  { level: 24, xp: 8000, tier: 'Advanced', badge: '💎' },
  { level: 25, xp: 9000, tier: 'Elite', badge: '👑' },
  { level: 26, xp: 10000, tier: 'Elite', badge: '👑' },
  { level: 27, xp: 11500, tier: 'Elite', badge: '👑' },
  { level: 28, xp: 13000, tier: 'Elite', badge: '👑' },
  { level: 29, xp: 15000, tier: 'Elite', badge: '👑' },
  { level: 30, xp: 17500, tier: 'Elite', badge: '👑' },
];

// Achievement definitions
export const ACHIEVEMENTS = {
  first_steps: {
    id: 'first_steps',
    name: 'First Steps',
    emoji: '🎯',
    description: 'Complete your first workout',
    xpReward: 50,
    check: (data) => (data.totalWorkoutsCompleted || 0) >= 1,
  },
  supplement_scholar: {
    id: 'supplement_scholar',
    name: 'Supplement Scholar',
    emoji: '💊',
    description: 'Take supplements 7 days straight',
    xpReward: 100,
    check: (data) => (data.currentStreak || 0) >= 7 && (data.supplementStreak || 0) >= 7,
  },
  week_warrior: {
    id: 'week_warrior',
    name: 'Week Warrior',
    emoji: '🔥',
    description: 'Maintain a 7-day streak',
    xpReward: 200,
    check: (data) => (data.currentStreak || 0) >= 7,
  },
  month_master: {
    id: 'month_master',
    name: 'Month Master',
    emoji: '💪',
    description: 'Achieve a 30-day streak',
    xpReward: 500,
    check: (data) => (data.currentStreak || 0) >= 30,
  },
  progress_tracker: {
    id: 'progress_tracker',
    name: 'Progress Tracker',
    emoji: '📈',
    description: 'Log weight 10 times',
    xpReward: 75,
    check: (data) => (data.weightLogs || 0) >= 10,
  },
  iron_will: {
    id: 'iron_will',
    name: 'Iron Will',
    emoji: '🏋️',
    description: 'Complete 50 workouts',
    xpReward: 250,
    check: (data) => (data.totalWorkoutsCompleted || 0) >= 50,
  },
  century_club: {
    id: 'century_club',
    name: 'Century Club',
    emoji: '💯',
    description: 'Complete 100 workouts',
    xpReward: 500,
    check: (data) => (data.totalWorkoutsCompleted || 0) >= 100,
  },
  pr_breaker: {
    id: 'pr_breaker',
    name: 'PR Breaker',
    emoji: '🎖️',
    description: 'Hit 10 personal records',
    xpReward: 300,
    check: (data) => (data.personalRecords || 0) >= 10,
  },
  strength_seeker: {
    id: 'strength_seeker',
    name: 'Strength Seeker',
    emoji: '🦾',
    description: 'Increase weight 25 times',
    xpReward: 400,
    check: (data) => (data.weightIncreases || 0) >= 25,
  },
  stack_master: {
    id: 'stack_master',
    name: 'Stack Master',
    emoji: '🧪',
    description: 'Take all supplements 30 days',
    xpReward: 300,
    check: (data) => (data.perfectSupplementDays || 0) >= 30,
  },
  consistency_king: {
    id: 'consistency_king',
    name: 'Consistency King',
    emoji: '🌟',
    description: '100-day supplement streak',
    xpReward: 1000,
    check: (data) => (data.supplementStreak || 0) >= 100,
  },
  hydration_hero: {
    id: 'hydration_hero',
    name: 'Hydration Hero',
    emoji: '💧',
    description: 'Hit water goal 7 days straight',
    xpReward: 50,
    check: (data) => {
      if (!data.water?.history) return false;
      const last7Days = data.water.history.slice(-7);
      return last7Days.length === 7 && last7Days.every(day => day.glasses >= (data.water.dailyGoal || 8));
    },
  },
  water_warrior: {
    id: 'water_warrior',
    name: 'Water Warrior',
    emoji: '🌊',
    description: 'Hit water goal 30 days straight',
    xpReward: 200,
    check: (data) => {
      if (!data.water?.history) return false;
      const last30Days = data.water.history.slice(-30);
      return last30Days.length === 30 && last30Days.every(day => day.glasses >= (data.water.dailyGoal || 8));
    },
  },
  rest_master: {
    id: 'rest_master',
    name: 'Rest Master',
    emoji: '😴',
    description: 'Good sleep 30 days straight',
    xpReward: 75,
    check: (data) => {
      if (!data.sleep?.history) return false;
      const last30Days = data.sleep.history.slice(-30);
      return last30Days.length === 30 && last30Days.every(day => day.quality === true);
    },
  },
  dream_keeper: {
    id: 'dream_keeper',
    name: 'Dream Keeper',
    emoji: '🌙',
    description: 'Good sleep 100 days',
    xpReward: 300,
    check: (data) => {
      if (!data.sleep?.history) return false;
      const goodSleepDays = data.sleep.history.filter(day => day.quality === true);
      return goodSleepDays.length >= 100;
    },
  },
  macro_master: {
    id: 'macro_master',
    name: 'Macro Master',
    emoji: '🍗',
    description: 'Hit all macros 7 days straight',
    xpReward: 100,
    check: (data) => {
      if (!data.nutrition?.history || !data.nutrition?.goals) return false;
      const last7Days = data.nutrition.history.slice(-7);
      if (last7Days.length !== 7) return false;
      return last7Days.every(day => {
        const goals = data.nutrition.goals;
        return (day.protein || 0) >= goals.protein && 
               (day.carbs || 0) >= goals.carbs && 
               (day.fats || 0) >= goals.fats;
      });
    },
  },
  nutrition_ninja: {
    id: 'nutrition_ninja',
    name: 'Nutrition Ninja',
    emoji: '🎯',
    description: 'Hit macros 30 days straight',
    xpReward: 300,
    check: (data) => {
      if (!data.nutrition?.history || !data.nutrition?.goals) return false;
      const last30Days = data.nutrition.history.slice(-30);
      if (last30Days.length !== 30) return false;
      return last30Days.every(day => {
        const goals = data.nutrition.goals;
        return (day.protein || 0) >= goals.protein && 
               (day.carbs || 0) >= goals.carbs && 
               (day.fats || 0) >= goals.fats;
      });
    },
  },
  perfect_day: {
    id: 'perfect_day',
    name: 'Perfect Day',
    emoji: '⭐',
    description: '100% all goals in one day',
    xpReward: 50,
    check: (data) => {
      return data.dailyGoals?.today?.completionPercentage === 100 || false;
    },
  },
  perfect_week: {
    id: 'perfect_week',
    name: 'Perfect Week',
    emoji: '🌟',
    description: '100% all goals 7 days straight',
    xpReward: 200,
    check: (data) => {
      if (!data.dailyGoals?.history) return false;
      const last7Days = data.dailyGoals.history.slice(-7);
      return last7Days.length === 7 && last7Days.every(day => day.completionPercentage === 100);
    },
  },
  consistency_king_lifestyle: {
    id: 'consistency_king_lifestyle',
    name: 'Consistency King',
    emoji: '🏆',
    description: '30-day perfect streak',
    xpReward: 500,
    check: (data) => {
      if (!data.dailyGoals?.history) return false;
      const last30Days = data.dailyGoals.history.slice(-30);
      return last30Days.length === 30 && last30Days.every(day => day.completionPercentage === 100);
    },
  },
  lifestyle_legend: {
    id: 'lifestyle_legend',
    name: 'Lifestyle Legend',
    emoji: '👑',
    description: '100-day perfect streak',
    xpReward: 1000,
    check: (data) => {
      if (!data.dailyGoals?.history) return false;
      const last100Days = data.dailyGoals.history.slice(-100);
      return last100Days.length === 100 && last100Days.every(day => day.completionPercentage === 100);
    },
  },
};

// Calculate level from total XP
export function calculateLevel(totalXP) {
  if (typeof window === 'undefined') return 1;
  
  let level = 1;
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVEL_THRESHOLDS[i].xp) {
      level = LEVEL_THRESHOLDS[i].level;
      break;
    }
  }
  return level;
}

// Get level info
export function getLevelInfo(level) {
  const levelData = LEVEL_THRESHOLDS.find(l => l.level === level);
  return levelData || LEVEL_THRESHOLDS[0];
}

// Calculate XP needed for next level
export function getXPToNextLevel(totalXP, currentLevel) {
  const nextLevel = LEVEL_THRESHOLDS.find(l => l.level > currentLevel);
  if (!nextLevel) return 0; // Max level
  return nextLevel.xp - totalXP;
}

// Calculate XP progress percentage for current level
export function getLevelProgress(totalXP, currentLevel) {
  const currentLevelData = LEVEL_THRESHOLDS.find(l => l.level === currentLevel);
  const nextLevelData = LEVEL_THRESHOLDS.find(l => l.level > currentLevel);
  
  if (!nextLevelData) return 100; // Max level
  
  const xpInCurrentLevel = totalXP - currentLevelData.xp;
  const xpNeededForNext = nextLevelData.xp - currentLevelData.xp;
  
  return Math.min(100, Math.round((xpInCurrentLevel / xpNeededForNext) * 100));
}

// Check if day is complete (80%+ supplements + workout or rest day)
export function isDayComplete(supplementsTaken, supplementsTotal, workoutComplete) {
  const supplementPercentage = supplementsTotal > 0 
    ? (supplementsTaken / supplementsTotal) * 100 
    : 100;
  return supplementPercentage >= 80 && workoutComplete;
}

// Load gamification data from localStorage
export function loadGamificationData() {
  if (typeof window === 'undefined') {
    return getDefaultGamificationData();
  }
  
  try {
    const saved = localStorage.getItem('aviera_gamification');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load gamification data:', e);
  }
  
  return getDefaultGamificationData();
}

// Get default gamification data structure
function getDefaultGamificationData() {
  return {
    totalXP: 0,
    currentLevel: 1,
    currentStreak: 0,
    longestStreak: 0,
    lastCompletionDate: null,
    supplementStreak: 0,
    today: {
      date: new Date().toISOString().split('T')[0],
      supplementsTaken: 0,
      supplementsTotal: 0,
      workoutComplete: false,
      xpEarned: 0,
    },
    history: [],
    unlockedBadges: [],
    personalRecords: 0,
    totalWorkoutsCompleted: 0,
    weightLogs: 0,
    weightIncreases: 0,
    perfectSupplementDays: 0,
    xpHistory: [],
    water: {
      dailyGoal: 8,
      today: 0,
      lastUpdated: null,
      history: [],
    },
    sleep: {
      lastNight: null,
      history: [],
    },
    nutrition: {
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
    },
    dailyGoals: {
      today: {
        date: new Date().toISOString().split('T')[0],
        core: {
          supplements: { complete: false, progress: '0/0' },
          workout: { complete: false },
        },
        bonus: {
          water: { complete: false, progress: '0/8' },
          meals: { complete: false, progress: '0/5' },
          sleep: { complete: false },
          macros: { complete: false, progress: '0/3' },
        },
        completionPercentage: 0,
        xpEarned: 0,
      },
      history: [],
    },
    dailyGoalsSettings: {
      trackWater: true,
      trackSleep: true,
      trackMeals: true,
      trackMacros: true,
      waterGoal: 8,
      sleepTarget: 8,
    },
    workoutFeedback: [],
  };
}

// Helper function to check if all macros are hit (exported for achievements)
export function allMacrosHit(protein, carbs, fats, goals) {
  if (!goals) return false;
  return protein >= goals.protein && carbs >= goals.carbs && fats >= goals.fats;
}

// Save gamification data to localStorage
export function saveGamificationData(data) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('aviera_gamification', JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save gamification data:', e);
  }
}

// Award XP and update level
export function awardXP(data, xpAmount, action, details = {}) {
  const newData = {
    ...data,
    totalXP: data.totalXP + xpAmount,
    today: {
      ...data.today,
      xpEarned: (data.today.xpEarned || 0) + xpAmount,
    },
    xpHistory: [
      ...(data.xpHistory || []),
      {
        date: new Date().toISOString().split('T')[0],
        action,
        xp: xpAmount,
        ...details,
      },
    ],
  };
  
  const oldLevel = data.currentLevel;
  newData.currentLevel = calculateLevel(newData.totalXP);
  
  // Check for level up
  const leveledUp = newData.currentLevel > oldLevel;
  
  saveGamificationData(newData);
  
  return {
    data: newData,
    leveledUp,
    newLevel: newData.currentLevel,
  };
}

// Update streak
export function updateStreak(data, supplementsTaken, supplementsTotal, workoutComplete) {
  const today = new Date().toISOString().split('T')[0];
  const dayComplete = isDayComplete(supplementsTaken, supplementsTotal, workoutComplete);
  
  let newStreak = data.currentStreak || 0;
  let supplementStreak = data.supplementStreak || 0;
  
  // Check if we need to update streak
  if (data.lastCompletionDate !== today) {
    if (dayComplete) {
      // Check if yesterday was completed (continuous streak)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (data.lastCompletionDate === yesterdayStr) {
        // Continue streak
        newStreak += 1;
        supplementStreak += 1;
      } else if (!data.lastCompletionDate || data.lastCompletionDate < yesterdayStr) {
        // New streak (break was more than 1 day)
        newStreak = 1;
        supplementStreak = 1;
      }
      
      // Update longest streak
      const longestStreak = Math.max(data.longestStreak || 0, newStreak);
      
      const newData = {
        ...data,
        currentStreak: newStreak,
        supplementStreak,
        longestStreak,
        lastCompletionDate: today,
      };
      
      // Check for streak achievements
      if (newStreak === 7) {
        // Award 7-day streak XP
        return awardXP(newData, XP_VALUES.STREAK_7_DAYS, 'streak_7_days');
      } else if (newStreak === 30) {
        // Award 30-day streak XP
        return awardXP(newData, XP_VALUES.STREAK_30_DAYS, 'streak_30_days');
      }
      
      saveGamificationData(newData);
      return { data: newData, leveledUp: false };
    } else {
      // Day not complete - don't update streak
      return { data, leveledUp: false };
    }
  }
  
  return { data, leveledUp: false };
}

// Check and unlock achievements
export function checkAchievements(data) {
  const newlyUnlocked = [];
  
  Object.values(ACHIEVEMENTS).forEach(achievement => {
    // Skip if already unlocked
    if (data.unlockedBadges?.some(b => b.id === achievement.id)) {
      return;
    }
    
    // Check if achievement is met
    if (achievement.check(data)) {
      newlyUnlocked.push(achievement);
      
      // Award XP for achievement
      const result = awardXP(data, achievement.xpReward, `achievement_${achievement.id}`, {
        achievement: achievement.id,
      });
      data = result.data;
      
      // Add to unlocked badges
      data.unlockedBadges = [
        ...(data.unlockedBadges || []),
        {
          id: achievement.id,
          unlockedDate: new Date().toISOString().split('T')[0],
        },
      ];
    }
  });
  
  if (newlyUnlocked.length > 0) {
    saveGamificationData(data);
  }
  
  return {
    data,
    newlyUnlocked,
  };
}

// Update today's progress
export function updateTodayProgress(supplementsTaken, supplementsTotal, workoutComplete) {
  let data = loadGamificationData();
  const today = new Date().toISOString().split('T')[0];
  
  // Reset today's data if it's a new day
  if (data.today.date !== today) {
    data.today = {
      date: today,
      supplementsTaken: 0,
      supplementsTotal: 0,
      workoutComplete: false,
      xpEarned: 0,
    };
  }
  
  data.today.supplementsTaken = supplementsTaken;
  data.today.supplementsTotal = supplementsTotal;
  data.today.workoutComplete = workoutComplete;
  
  // Update streak
  const streakResult = updateStreak(data, supplementsTaken, supplementsTotal, workoutComplete);
  data = streakResult.data;
  
  // Check achievements
  const achievementResult = checkAchievements(data);
  data = achievementResult.data;
  
  saveGamificationData(data);
  
  return {
    data,
    leveledUp: streakResult.leveledUp,
    newlyUnlockedAchievements: achievementResult.newlyUnlocked,
  };
}
