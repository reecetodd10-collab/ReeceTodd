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
      date: 'Nov 4',
      type: 'Upper Push',
      exercises: [
        { name: 'Bench Press', sets: 4, reps: '8-10', weight: 185, muscleGroup: 'Chest' },
        { name: 'Overhead Press', sets: 3, reps: '10-12', weight: 135, muscleGroup: 'Shoulders' },
        { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', weight: 70, muscleGroup: 'Chest' },
        { name: 'Tricep Dips', sets: 3, reps: '12-15', weight: 'Bodyweight', muscleGroup: 'Triceps' },
        { name: 'Lateral Raises', sets: 3, reps: '12-15', weight: 20, muscleGroup: 'Shoulders' },
      ],
      completed: false,
    },
    {
      day: 'Tuesday',
      date: 'Nov 5',
      type: 'Lower Body',
      exercises: [
        { name: 'Squats', sets: 4, reps: '6-8', weight: 225, muscleGroup: 'Legs' },
        { name: 'Romanian Deadlifts', sets: 3, reps: '10', weight: 185, muscleGroup: 'Hamstrings' },
        { name: 'Leg Press', sets: 3, reps: '12-15', weight: 315, muscleGroup: 'Legs' },
        { name: 'Leg Curls', sets: 3, reps: '12', weight: 120, muscleGroup: 'Hamstrings' },
        { name: 'Calf Raises', sets: 4, reps: '15-20', weight: 180, muscleGroup: 'Calves' },
      ],
      completed: false,
    },
    {
      day: 'Wednesday',
      date: 'Nov 6',
      type: 'Rest / Active Recovery',
      exercises: [],
      completed: true,
      suggestion: '20min walk or Yoga',
    },
    {
      day: 'Thursday',
      date: 'Nov 7',
      type: 'Upper Pull',
      exercises: [
        { name: 'Pull-ups', sets: 4, reps: '8-10', weight: 'Bodyweight', muscleGroup: 'Back' },
        { name: 'Barbell Rows', sets: 3, reps: '10-12', weight: 155, muscleGroup: 'Back' },
        { name: 'Lat Pulldowns', sets: 3, reps: '10-12', weight: 140, muscleGroup: 'Back' },
        { name: 'Bicep Curls', sets: 3, reps: '12-15', weight: 30, muscleGroup: 'Biceps' },
        { name: 'Hammer Curls', sets: 3, reps: '12', weight: 25, muscleGroup: 'Biceps' },
      ],
      completed: false,
    },
    {
      day: 'Friday',
      date: 'Nov 8',
      type: 'Lower Body',
      exercises: [
        { name: 'Front Squats', sets: 4, reps: '8-10', weight: 185, muscleGroup: 'Legs' },
        { name: 'Lunges', sets: 3, reps: '12 each leg', weight: 135, muscleGroup: 'Legs' },
        { name: 'Romanian Deadlifts', sets: 3, reps: '10', weight: 185, muscleGroup: 'Hamstrings' },
        { name: 'Leg Extensions', sets: 3, reps: '12-15', weight: 100, muscleGroup: 'Quads' },
        { name: 'Calf Raises', sets: 4, reps: '15-20', weight: 180, muscleGroup: 'Calves' },
      ],
      completed: false,
    },
    {
      day: 'Saturday',
      date: 'Nov 9',
      type: 'Full Body / Accessories',
      exercises: [
        { name: 'Deadlifts', sets: 4, reps: '5', weight: 275, muscleGroup: 'Back/Legs' },
        { name: 'Overhead Press', sets: 3, reps: '8-10', weight: 135, muscleGroup: 'Shoulders' },
        { name: 'Barbell Rows', sets: 3, reps: '8-10', weight: 155, muscleGroup: 'Back' },
        { name: 'Planks', sets: 3, reps: '45-60 sec', weight: 'Bodyweight', muscleGroup: 'Core' },
      ],
      completed: false,
    },
    {
      day: 'Sunday',
      date: 'Nov 10',
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

