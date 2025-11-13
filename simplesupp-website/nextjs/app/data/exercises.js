// SmartFitt Exercise Database
// Deterministic exercise recommendations based on muscle groups

export const MUSCLE_GROUPS = {
  // Upper Body
  CHEST: 'Chest',
  SHOULDERS: 'Shoulders',
  BICEPS: 'Biceps',
  TRICEPS: 'Triceps',
  BACK: 'Back',
  TRAPS: 'Traps',
  FOREARMS: 'Forearms',

  // Core
  ABS: 'Abs',
  OBLIQUES: 'Obliques',

  // Lower Body
  QUADS: 'Quads',
  HAMSTRINGS: 'Hamstrings',
  GLUTES: 'Glutes',
  CALVES: 'Calves'
};

// Exercise database with equipment requirements and effectiveness ratings
export const EXERCISES = {
  [MUSCLE_GROUPS.CHEST]: [
    {
      name: 'Barbell Bench Press',
      equipment: ['barbell', 'bench'],
      effectiveness: 10,
      setsReps: { strength: '5x5', hypertrophy: '4x8', endurance: '3x12' },
      cues: [
        'Retract shoulder blades and keep them pinned to the bench',
        'Lower bar to mid-chest with elbows at 45° angle',
        'Drive feet into ground and press bar in slight arc toward face'
      ],
      progression: 'Add 5lbs per week. Try pause reps (2-3 sec) at chest for more difficulty.'
    },
    {
      name: 'Dumbbell Bench Press',
      equipment: ['dumbbells', 'bench'],
      effectiveness: 9,
      setsReps: { strength: '4x6', hypertrophy: '4x10', endurance: '3x15' },
      cues: [
        'Start with dumbbells touching at top, palms forward',
        'Lower with controlled tempo until stretch in chest',
        'Press up and slightly inward, squeezing pecs at top'
      ],
      progression: 'Increase weight by 5lbs each hand when you can complete all reps with good form.'
    },
    {
      name: 'Push-Ups',
      equipment: ['bodyweight'],
      effectiveness: 8,
      setsReps: { strength: '5x10', hypertrophy: '4x15', endurance: '3x20+' },
      cues: [
        'Body forms straight line from head to heels',
        'Lower until chest nearly touches ground, elbows tucked',
        'Push through palms, squeeze chest and glutes at top'
      ],
      progression: 'Add weight vest or elevate feet. Try tempo variations (3 sec down, 1 sec pause).'
    }
  ],

  [MUSCLE_GROUPS.BACK]: [
    {
      name: 'Pull-Ups',
      equipment: ['pull-up bar'],
      effectiveness: 10,
      setsReps: { strength: '5x5', hypertrophy: '4x8', endurance: '3x12' },
      cues: [
        'Dead hang start, shoulder blades down and back',
        'Pull elbows down and back, lead with chest',
        'Chin over bar, squeeze lats, controlled descent'
      ],
      progression: 'Add weight with belt/vest. Try weighted negatives for strength gains.'
    },
    {
      name: 'Barbell Rows',
      equipment: ['barbell'],
      effectiveness: 9,
      setsReps: { strength: '5x5', hypertrophy: '4x10', endurance: '3x15' },
      cues: [
        'Hinge at hips, back flat, knees slightly bent',
        'Pull bar to lower chest/upper stomach',
        'Squeeze shoulder blades together, control the negative'
      ],
      progression: 'Add 5-10lbs per week. Try Pendlay rows (dead stop each rep) for explosiveness.'
    },
    {
      name: 'Dumbbell Rows',
      equipment: ['dumbbells', 'bench'],
      effectiveness: 9,
      setsReps: { strength: '4x6', hypertrophy: '4x12', endurance: '3x15' },
      cues: [
        'One knee and hand on bench, back flat',
        'Pull dumbbell to hip, elbow stays close to body',
        'Squeeze lat at top, do not rotate torso'
      ],
      progression: 'Increase weight gradually. Try 1-arm cable rows for constant tension.'
    }
  ],

  [MUSCLE_GROUPS.SHOULDERS]: [
    {
      name: 'Overhead Press',
      equipment: ['barbell'],
      effectiveness: 10,
      setsReps: { strength: '5x5', hypertrophy: '4x8', endurance: '3x12' },
      cues: [
        'Bar rests on front delts, grip slightly wider than shoulders',
        'Press straight up, tuck chin back as bar passes face',
        'Lock out overhead, shrug shoulders up at top'
      ],
      progression: 'Add 2.5-5lbs per week. Microload if needed for consistent progress.'
    },
    {
      name: 'Dumbbell Shoulder Press',
      equipment: ['dumbbells'],
      effectiveness: 9,
      setsReps: { strength: '4x6', hypertrophy: '4x10', endurance: '3x15' },
      cues: [
        'Start at shoulder height, palms forward',
        'Press up and slightly inward',
        'Do not bang dumbbells together at top'
      ],
      progression: 'Increase weight by 5lbs per hand. Try Arnold press variation for extra front delt work.'
    },
    {
      name: 'Lateral Raises',
      equipment: ['dumbbells'],
      effectiveness: 8,
      setsReps: { strength: '4x8', hypertrophy: '3x12', endurance: '3x20' },
      cues: [
        'Slight forward lean, arms slightly bent',
        'Raise to shoulder height, lead with elbows',
        'Control the descent, constant tension'
      ],
      progression: 'Use lighter weight and focus on form. Add drop sets for hypertrophy.'
    }
  ],

  [MUSCLE_GROUPS.BICEPS]: [
    {
      name: 'Barbell Curls',
      equipment: ['barbell'],
      effectiveness: 9,
      setsReps: { strength: '4x6', hypertrophy: '3x10', endurance: '3x15' },
      cues: [
        'Elbows tucked at sides, slight forward lean',
        'Curl with control, squeeze at top',
        'Do not swing or use momentum'
      ],
      progression: 'Add 2.5-5lbs per session. Try 21s (7 bottom, 7 top, 7 full) for a killer pump.'
    },
    {
      name: 'Dumbbell Hammer Curls',
      equipment: ['dumbbells'],
      effectiveness: 9,
      setsReps: { strength: '4x8', hypertrophy: '3x12', endurance: '3x20' },
      cues: [
        'Palms face each other (neutral grip) throughout',
        'Curl up keeping elbows locked at sides',
        'Squeeze at top, slow eccentric'
      ],
      progression: 'Increase weight gradually. Hammer curls also hit forearms hard.'
    },
    {
      name: 'Chin-Ups',
      equipment: ['pull-up bar'],
      effectiveness: 10,
      setsReps: { strength: '5x5', hypertrophy: '4x8', endurance: '3x12' },
      cues: [
        'Underhand grip, hands shoulder-width',
        'Pull with biceps, think "elbows to ribs"',
        'Chin over bar, squeeze, controlled down'
      ],
      progression: 'Add weight with belt. Best compound movement for biceps.'
    }
  ],

  [MUSCLE_GROUPS.TRICEPS]: [
    {
      name: 'Close-Grip Bench Press',
      equipment: ['barbell', 'bench'],
      effectiveness: 10,
      setsReps: { strength: '5x5', hypertrophy: '4x8', endurance: '3x12' },
      cues: [
        'Hands shoulder-width or slightly narrower',
        'Elbows tucked close to sides throughout',
        'Lower to lower chest, press explosively'
      ],
      progression: 'Add 5lbs per week. Best mass builder for triceps.'
    },
    {
      name: 'Dips',
      equipment: ['dip bars'],
      effectiveness: 10,
      setsReps: { strength: '5x6', hypertrophy: '4x10', endurance: '3x15' },
      cues: [
        'Lean forward slightly for chest, upright for triceps',
        'Lower until upper arms parallel to ground',
        'Press up, lock out fully, squeeze triceps'
      ],
      progression: 'Add weight with belt. One of the best tricep builders.'
    },
    {
      name: 'Overhead Tricep Extension',
      equipment: ['dumbbells'],
      effectiveness: 8,
      setsReps: { strength: '4x8', hypertrophy: '3x12', endurance: '3x20' },
      cues: [
        'Hold dumbbell overhead with both hands',
        'Lower behind head keeping elbows tight',
        'Extend fully, squeeze triceps at top'
      ],
      progression: 'Increase weight slowly. Great long-head tricep developer.'
    }
  ],

  [MUSCLE_GROUPS.QUADS]: [
    {
      name: 'Barbell Back Squat',
      equipment: ['barbell', 'squat rack'],
      effectiveness: 10,
      setsReps: { strength: '5x5', hypertrophy: '4x8', endurance: '3x12' },
      cues: [
        'Bar on upper traps, chest up, core braced',
        'Sit back and down, knees track over toes',
        'Hit depth (hip crease below knee), drive up through heels'
      ],
      progression: 'Add 5-10lbs per week. King of all exercises for lower body mass.'
    },
    {
      name: 'Bulgarian Split Squats',
      equipment: ['dumbbells', 'bench'],
      effectiveness: 9,
      setsReps: { strength: '4x6', hypertrophy: '3x10', endurance: '3x15' },
      cues: [
        'Rear foot elevated on bench, front foot forward',
        'Drop straight down, front knee at 90°',
        'Push through front heel, keep torso upright'
      ],
      progression: 'Increase dumbbell weight. Best single-leg quad builder.'
    },
    {
      name: 'Goblet Squats',
      equipment: ['dumbbell'],
      effectiveness: 8,
      setsReps: { strength: '4x8', hypertrophy: '3x12', endurance: '3x20' },
      cues: [
        'Hold dumbbell at chest, elbows pointed down',
        'Sit back into squat, knees out',
        'Drive up, squeeze glutes at top'
      ],
      progression: 'Perfect for beginners. Great for learning squat pattern.'
    }
  ],

  [MUSCLE_GROUPS.HAMSTRINGS]: [
    {
      name: 'Romanian Deadlift',
      equipment: ['barbell'],
      effectiveness: 10,
      setsReps: { strength: '4x6', hypertrophy: '4x10', endurance: '3x15' },
      cues: [
        'Bar starts at hip level, slight knee bend',
        'Push hips back, bar stays close to legs',
        'Feel stretch in hamstrings, drive hips forward to stand'
      ],
      progression: 'Add 5-10lbs per week. Best hamstring mass builder.'
    },
    {
      name: 'Lying Leg Curls',
      equipment: ['leg curl machine'],
      effectiveness: 9,
      setsReps: { strength: '4x8', hypertrophy: '3x12', endurance: '3x20' },
      cues: [
        'Lie face down, pad on lower calves',
        'Curl heels to glutes, squeeze hamstrings',
        'Control the descent, do not let weight slam'
      ],
      progression: 'Increase weight gradually. Try single-leg for imbalances.'
    },
    {
      name: 'Glute-Ham Raises',
      equipment: ['GHD machine'],
      effectiveness: 10,
      setsReps: { strength: '5x5', hypertrophy: '4x8', endurance: '3x12' },
      cues: [
        'Ankles secured, knees on pad',
        'Lower torso with control, hamstrings stretched',
        'Pull yourself up using hamstrings and glutes'
      ],
      progression: 'One of the hardest hamstring exercises. Master bodyweight first.'
    }
  ],

  [MUSCLE_GROUPS.GLUTES]: [
    {
      name: 'Hip Thrusts',
      equipment: ['barbell', 'bench'],
      effectiveness: 10,
      setsReps: { strength: '5x6', hypertrophy: '4x10', endurance: '3x15' },
      cues: [
        'Upper back on bench, bar on hips (use pad)',
        'Drive hips up, squeeze glutes hard at top',
        'Hold peak contraction for 1-2 seconds'
      ],
      progression: 'Add weight aggressively. Best glute builder.'
    },
    {
      name: 'Bulgarian Split Squats',
      equipment: ['dumbbells', 'bench'],
      effectiveness: 9,
      setsReps: { strength: '4x6', hypertrophy: '3x10', endurance: '3x15' },
      cues: [
        'Same as quad version but lean forward slightly',
        'Focus on driving through front heel',
        'Squeeze glute at top of each rep'
      ],
      progression: 'Hits glutes hard when done with forward lean.'
    },
    {
      name: 'Glute Kickbacks',
      equipment: ['cable machine'],
      effectiveness: 8,
      setsReps: { strength: '4x10', hypertrophy: '3x15', endurance: '3x25' },
      cues: [
        'Ankle strap on, lean forward on machine',
        'Kick leg back, squeeze glute at top',
        'Control the return, constant tension'
      ],
      progression: 'Great isolation move. Add to finish glute workouts.'
    }
  ],

  [MUSCLE_GROUPS.CALVES]: [
    {
      name: 'Standing Calf Raises',
      equipment: ['calf raise machine'],
      effectiveness: 9,
      setsReps: { strength: '4x8', hypertrophy: '3x12', endurance: '3x20' },
      cues: [
        'Balls of feet on platform, heels dropped',
        'Push up onto toes, full contraction',
        'Lower slowly to full stretch'
      ],
      progression: 'High reps work best. Try 2 sec holds at top.'
    },
    {
      name: 'Seated Calf Raises',
      equipment: ['seated calf machine'],
      effectiveness: 8,
      setsReps: { strength: '4x10', hypertrophy: '3x15', endurance: '3x25' },
      cues: [
        'Knees under pads, toes on platform',
        'Push up through balls of feet',
        'Full range of motion, slow reps'
      ],
      progression: 'Hits soleus muscle. Combine with standing for complete calf development.'
    },
    {
      name: 'Jump Rope',
      equipment: ['jump rope'],
      effectiveness: 7,
      setsReps: { strength: 'N/A', hypertrophy: '4x2min', endurance: '5x3min' },
      cues: [
        'Stay on balls of feet, bounce lightly',
        'Keep jumps low and quick',
        'Maintain steady rhythm'
      ],
      progression: 'Great for conditioning and calf endurance.'
    }
  ],

  [MUSCLE_GROUPS.ABS]: [
    {
      name: 'Cable Crunches',
      equipment: ['cable machine'],
      effectiveness: 10,
      setsReps: { strength: '4x10', hypertrophy: '3x15', endurance: '3x25' },
      cues: [
        'Kneel facing cable, rope behind head',
        'Crunch down, bring elbows to thighs',
        'Squeeze abs hard, slow return'
      ],
      progression: 'Add weight progressively. Best weighted ab movement.'
    },
    {
      name: 'Hanging Leg Raises',
      equipment: ['pull-up bar'],
      effectiveness: 9,
      setsReps: { strength: '4x8', hypertrophy: '3x12', endurance: '3x20' },
      cues: [
        'Dead hang, engage core first',
        'Lift legs to 90° (or higher for advanced)',
        'Control descent, no swinging'
      ],
      progression: 'Work up to toes-to-bar for advanced ab strength.'
    },
    {
      name: 'Planks',
      equipment: ['bodyweight'],
      effectiveness: 8,
      setsReps: { strength: '4x45s', hypertrophy: '3x60s', endurance: '3x90s' },
      cues: [
        'Forearms on ground, body straight line',
        'Squeeze glutes, brace core hard',
        'Do not let hips sag or pike up'
      ],
      progression: 'Add weight on back or try weighted RKC planks (max tension for 10-20s).'
    }
  ],

  [MUSCLE_GROUPS.OBLIQUES]: [
    {
      name: 'Russian Twists',
      equipment: ['medicine ball'],
      effectiveness: 8,
      setsReps: { strength: '4x20', hypertrophy: '3x30', endurance: '3x50' },
      cues: [
        'Sit on floor, knees bent, feet up',
        'Rotate torso side to side, touch ball to ground',
        'Keep core engaged throughout'
      ],
      progression: 'Increase weight or reps. Great for rotational strength.'
    },
    {
      name: 'Side Planks',
      equipment: ['bodyweight'],
      effectiveness: 9,
      setsReps: { strength: '4x30s', hypertrophy: '3x45s', endurance: '3x60s' },
      cues: [
        'On forearm, body straight, hips stacked',
        'Lift hips up, squeeze obliques',
        'Hold position without sagging'
      ],
      progression: 'Add weight or try Copenhagen planks for adductor work too.'
    },
    {
      name: 'Woodchoppers',
      equipment: ['cable machine'],
      effectiveness: 9,
      setsReps: { strength: '4x10', hypertrophy: '3x15', endurance: '3x20' },
      cues: [
        'Stand sideways to cable, high pulley',
        'Pull cable down across body in chopping motion',
        'Rotate through hips and core, not just arms'
      ],
      progression: 'Functional rotational strength. Essential for athletes.'
    }
  ],

  [MUSCLE_GROUPS.TRAPS]: [
    {
      name: 'Barbell Shrugs',
      equipment: ['barbell'],
      effectiveness: 9,
      setsReps: { strength: '4x8', hypertrophy: '3x12', endurance: '3x20' },
      cues: [
        'Hold bar at arms length in front',
        'Shrug shoulders straight up to ears',
        'Squeeze traps at top, lower slowly'
      ],
      progression: 'Can use heavy weight. Try holds at top for 2-3 seconds.'
    },
    {
      name: 'Dumbbell Shrugs',
      equipment: ['dumbbells'],
      effectiveness: 9,
      setsReps: { strength: '4x10', hypertrophy: '3x15', endurance: '3x25' },
      cues: [
        'Dumbbells at sides, palms facing body',
        'Shrug up, squeeze traps hard',
        'Do not roll shoulders, straight up and down'
      ],
      progression: 'Better range of motion than barbell. Go heavy.'
    },
    {
      name: 'Face Pulls',
      equipment: ['cable machine'],
      effectiveness: 8,
      setsReps: { strength: '4x12', hypertrophy: '3x15', endurance: '3x25' },
      cues: [
        'Rope attachment at face height',
        'Pull rope apart toward ears, elbows high',
        'Squeeze upper back and rear delts'
      ],
      progression: 'Hits upper traps and rear delts. Essential for shoulder health.'
    }
  ],

  [MUSCLE_GROUPS.FOREARMS]: [
    {
      name: 'Wrist Curls',
      equipment: ['dumbbells', 'bench'],
      effectiveness: 8,
      setsReps: { strength: '4x10', hypertrophy: '3x15', endurance: '3x25' },
      cues: [
        'Forearms on bench, wrists hanging off',
        'Curl weight up with wrists only',
        'Full range of motion, slow reps'
      ],
      progression: 'Build grip strength. Do reverse curls too for extensors.'
    },
    {
      name: 'Farmers Walks',
      equipment: ['dumbbells'],
      effectiveness: 10,
      setsReps: { strength: '4x40m', hypertrophy: '3x60m', endurance: '3x100m' },
      cues: [
        'Heavy dumbbells in each hand',
        'Walk with good posture, shoulders back',
        'Squeeze handles hard entire time'
      ],
      progression: 'Best functional forearm/grip work. Go heavy.'
    },
    {
      name: 'Dead Hangs',
      equipment: ['pull-up bar'],
      effectiveness: 9,
      setsReps: { strength: '4x30s', hypertrophy: '3x45s', endurance: '3x60s' },
      cues: [
        'Hang from bar with straight arms',
        'Engage shoulders, do not just hang limp',
        'Build up time under tension'
      ],
      progression: 'Simple but effective. Essential for grip strength.'
    }
  ]
};

// Get recommended sets/reps based on goal
export const getSetsReps = (goal) => {
  const goalMap = {
    'muscle_gain': 'hypertrophy',
    'strength': 'strength',
    'fat_loss': 'endurance',
    'general_fitness': 'hypertrophy'
  };
  return goalMap[goal] || 'hypertrophy';
};

// Get exercises for a muscle group
export const getExercisesForMuscle = (muscleGroup, equipment = [], goal = 'hypertrophy') => {
  const exercises = EXERCISES[muscleGroup] || [];

  // Filter by available equipment
  let filtered = exercises;
  if (equipment.length > 0) {
    filtered = exercises.filter(ex =>
      ex.equipment.every(eq => equipment.includes(eq) || eq === 'bodyweight')
    );
  }

  // If no exercises match equipment, return bodyweight/dumbbell alternatives
  if (filtered.length === 0) {
    filtered = exercises.filter(ex =>
      ex.equipment.includes('bodyweight') || ex.equipment.includes('dumbbells')
    );
  }

  // Sort by effectiveness
  filtered.sort((a, b) => b.effectiveness - a.effectiveness);

  // Return top 3
  return filtered.slice(0, 3).map((ex, idx) => ({
    ...ex,
    isTopPick: idx === 0,
    setsReps: ex.setsReps[goal] || ex.setsReps.hypertrophy
  }));
};

export default EXERCISES;

