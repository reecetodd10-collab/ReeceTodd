// Exercise tooltip data
export const exerciseTooltips = {
  'Bench Press': {
    muscles: '🎯 Chest, Triceps, Shoulders',
    type: '🏋️ Compound - High value',
    difficulty: '📊 Difficulty: Intermediate',
    formTip: '💡 Keep shoulder blades retracted and pressed into bench',
    alternatives: '🔄 Alternatives: Dumbbell Press, Push-ups, Incline Press'
  },
  'Squats': {
    muscles: '🎯 Quadriceps, Glutes, Core',
    type: '🏋️ Compound - High value',
    difficulty: '📊 Difficulty: Intermediate',
    formTip: '💡 Keep chest up, core tight, knees tracking over toes',
    alternatives: '🔄 Alternatives: Front Squats, Goblet Squats, Leg Press'
  },
  'Deadlifts': {
    muscles: '🎯 Back, Glutes, Hamstrings, Core',
    type: '🏋️ Compound - High value',
    difficulty: '📊 Difficulty: Advanced',
    formTip: '💡 Keep back straight, bar close to body, drive through heels',
    alternatives: '🔄 Alternatives: Romanian Deadlifts, Rack Pulls, Good Mornings'
  },
  'Overhead Press': {
    muscles: '🎯 Shoulders, Triceps, Core',
    type: '🏋️ Compound - High value',
    difficulty: '📊 Difficulty: Intermediate',
    formTip: '💡 Engage core, press straight up, slight lean back',
    alternatives: '🔄 Alternatives: Dumbbell Press, Arnold Press, Pike Push-ups'
  },
  'Pull-ups': {
    muscles: '🎯 Back, Biceps, Shoulders',
    type: '🏋️ Compound - High value',
    difficulty: '📊 Difficulty: Intermediate',
    formTip: '💡 Pull with back muscles, not just arms, full range of motion',
    alternatives: '🔄 Alternatives: Lat Pulldowns, Assisted Pull-ups, Inverted Rows'
  },
  'Barbell Rows': {
    muscles: '🎯 Back, Biceps, Rear Delts',
    type: '🏋️ Compound - High value',
    difficulty: '📊 Difficulty: Intermediate',
    formTip: '💡 Keep torso parallel to floor, pull to lower chest/upper abs',
    alternatives: '🔄 Alternatives: Dumbbell Rows, Cable Rows, T-Bar Rows'
  },
  'Lunges': {
    muscles: '🎯 Quadriceps, Glutes, Core',
    type: '🏋️ Compound - Moderate value',
    difficulty: '📊 Difficulty: Beginner',
    formTip: '💡 Step forward, keep front knee over ankle, back knee nearly touches ground',
    alternatives: '🔄 Alternatives: Reverse Lunges, Walking Lunges, Bulgarian Split Squats'
  },
  'Bicep Curls': {
    muscles: '🎯 Biceps',
    type: '🏋️ Isolation - Accessory',
    difficulty: '📊 Difficulty: Beginner',
    formTip: '💡 Keep elbows stationary, control the weight, full range of motion',
    alternatives: '🔄 Alternatives: Hammer Curls, Cable Curls, Concentration Curls'
  },
  'Tricep Dips': {
    muscles: '🎯 Triceps, Shoulders, Chest',
    type: '🏋️ Compound - Accessory',
    difficulty: '📊 Difficulty: Intermediate',
    formTip: '💡 Keep body close to bench, lower until elbows at 90 degrees',
    alternatives: '🔄 Alternatives: Close-Grip Push-ups, Overhead Extensions, Cable Pushdowns'
  },
  'Leg Press': {
    muscles: '🎯 Quadriceps, Glutes, Hamstrings',
    type: '🏋️ Compound - Moderate value',
    difficulty: '📊 Difficulty: Beginner',
    formTip: '💡 Keep feet shoulder-width, lower until knees at 90 degrees',
    alternatives: '🔄 Alternatives: Squats, Hack Squats, Bulgarian Split Squats'
  }
};

export function getExerciseTooltip(exerciseName) {
  // Try exact match first
  if (exerciseTooltips[exerciseName]) {
    return exerciseTooltips[exerciseName];
  }
  
  // Try case-insensitive match
  const lowerName = exerciseName.toLowerCase();
  for (const key in exerciseTooltips) {
    if (key.toLowerCase() === lowerName) {
      return exerciseTooltips[key];
    }
  }
  
  // Try partial match
  for (const key in exerciseTooltips) {
    if (lowerName.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerName)) {
      return exerciseTooltips[key];
    }
  }
  
  // Default tooltip
  return {
    muscles: '🎯 Multiple muscle groups',
    type: '🏋️ Compound exercise',
    difficulty: '📊 Difficulty: Varies',
    formTip: '💡 Focus on proper form and controlled movement',
    alternatives: '🔄 Various alternatives available'
  };
}

