// Placeholder data for Stack Builder
export const sampleSupplements = [
  {
    id: 1,
    name: 'Creatine Monohydrate',
    time: 'Morning',
    timeIcon: '🌅',
    dosage: '5g',
    daysRemaining: 15,
    isLowStock: false,
    notificationTime: '08:00',
    notificationEnabled: true,
  },
  {
    id: 2,
    name: 'Omega-3 Fish Oil',
    time: 'Evening',
    timeIcon: '🌙',
    dosage: '2 capsules',
    daysRemaining: 22,
    isLowStock: false,
    notificationTime: '20:00',
    notificationEnabled: true,
  },
  {
    id: 3,
    name: 'Vitamin D3',
    time: 'Morning',
    timeIcon: '🌅',
    dosage: '5000 IU',
    daysRemaining: 8,
    isLowStock: true,
    notificationTime: '08:00',
    notificationEnabled: true,
  },
  {
    id: 4,
    name: 'Whey Protein',
    time: 'Pre-Workout',
    timeIcon: '⚡',
    dosage: '1 scoop (30g)',
    daysRemaining: 12,
    isLowStock: false,
    notificationTime: '17:00',
    notificationEnabled: true,
  },
  {
    id: 5,
    name: 'Magnesium Glycinate',
    time: 'Evening',
    timeIcon: '🌙',
    dosage: '400mg',
    daysRemaining: 5,
    isLowStock: true,
    notificationTime: '21:00',
    notificationEnabled: false,
  },
];

// Placeholder data for Workout Planner
export const sampleWorkoutWeek = {
  weekOf: 'Nov 4-10, 2025',
  goal: 'Muscle Building',
  days: [
    {
      day: 'Monday',
      type: 'Upper Push',
      exercises: [
        { name: 'Bench Press', sets: 4, reps: '8-10', weight: 185, muscleGroup: 'Chest' },
        { name: 'Overhead Press', sets: 3, reps: '10-12', weight: 135, muscleGroup: 'Shoulders' },
        { name: 'Tricep Dips', sets: 3, reps: '12-15', weight: 'Bodyweight', muscleGroup: 'Triceps' },
      ],
      completed: false,
    },
    {
      day: 'Tuesday',
      type: 'Lower Body',
      exercises: [
        { name: 'Squats', sets: 4, reps: '6-8', weight: 225, muscleGroup: 'Legs' },
        { name: 'Romanian Deadlifts', sets: 3, reps: '10', weight: 185, muscleGroup: 'Hamstrings' },
        { name: 'Leg Press', sets: 3, reps: '12-15', weight: 315, muscleGroup: 'Legs' },
      ],
      completed: false,
    },
    {
      day: 'Wednesday',
      type: 'Rest / Active Recovery',
      exercises: [],
      completed: true,
    },
    {
      day: 'Thursday',
      type: 'Upper Pull',
      exercises: [
        { name: 'Pull-ups', sets: 4, reps: '8-10', weight: 'Bodyweight', muscleGroup: 'Back' },
        { name: 'Barbell Rows', sets: 3, reps: '10-12', weight: 155, muscleGroup: 'Back' },
        { name: 'Bicep Curls', sets: 3, reps: '12-15', weight: 30, muscleGroup: 'Biceps' },
      ],
      completed: false,
    },
    {
      day: 'Friday',
      type: 'Lower Body',
      exercises: [
        { name: 'Deadlifts', sets: 4, reps: '5', weight: 275, muscleGroup: 'Back/Legs' },
        { name: 'Leg Curls', sets: 3, reps: '12', weight: 120, muscleGroup: 'Hamstrings' },
        { name: 'Calf Raises', sets: 3, reps: '15-20', weight: 180, muscleGroup: 'Calves' },
      ],
      completed: false,
    },
    {
      day: 'Saturday',
      type: 'Rest',
      exercises: [],
      completed: true,
    },
    {
      day: 'Sunday',
      type: 'Rest',
      exercises: [],
      completed: true,
    },
  ],
};

// User streak data
export const userStreak = {
  current: 7,
  longest: 14,
  weeklyCompletion: 85,
};
