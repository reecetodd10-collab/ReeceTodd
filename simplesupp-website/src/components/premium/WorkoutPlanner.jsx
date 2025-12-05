import React, { useState, useEffect, useRef } from 'react';
import { 
  Dumbbell, 
  Download, 
  MessageCircle, 
  RefreshCw,
  Check,
  ChevronDown,
  ChevronUp,
  Edit3,
  Target,
  Plus,
  X,
  GripVertical,
  Copy,
  Trash2,
  Sparkles,
  Trophy,
  Clock,
  ArrowLeft,
  ArrowRight,
  Save,
  CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sampleWorkoutWeek } from '../../lib/placeholder-data';
import { EXERCISES, MUSCLE_GROUPS } from '../../data/exercises';
import GlassCard from '../shared/GlassCard';
import Button from '../shared/Button';
import Modal from '../shared/Modal';
import { TESTING_MODE, hasPremiumAccess } from '../../lib/config';
import { awardXP, updateTodayProgress, XP_VALUES, checkAchievements } from '../../lib/gamification';
import { XPToast } from '../gamification/XPDisplay';

export default function WorkoutPlanner() {
  const [weeks, setWeeks] = useState([]);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [expandedDays, setExpandedDays] = useState({});
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(null);
  const [showEditExerciseModal, setShowEditExerciseModal] = useState(null);
  const [showRemoveExerciseModal, setShowRemoveExerciseModal] = useState(null);
  const [showSwapExerciseModal, setShowSwapExerciseModal] = useState(null);
  const [showDuplicateDayModal, setShowDuplicateDayModal] = useState(null);
  const [showClearDayModal, setShowClearDayModal] = useState(null);
  const [showEditDayTypeModal, setShowEditDayTypeModal] = useState(null);
  const [showCompleteWorkoutModal, setShowCompleteWorkoutModal] = useState(null);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);
  const [showOptimizeModal, setShowOptimizeModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [activeRestTimer, setActiveRestTimer] = useState(null);
  const [restTimerSeconds, setRestTimerSeconds] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [draggedExercise, setDraggedExercise] = useState(null);
  const [draggedOverExercise, setDraggedOverExercise] = useState(null);
  const [xpToast, setXpToast] = useState({ visible: false, xp: 0, action: '' });

  const userIsPremium = false;
  const isPremium = hasPremiumAccess(userIsPremium);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('aviera_workout_planner');
    const savedExpanded = localStorage.getItem('aviera_workout_expanded_days');
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setWeeks(parsed.weeks || []);
        setCurrentWeekIndex(parsed.currentWeekIndex || 0);
      } catch (e) {
        console.error('Failed to load workouts:', e);
        initializeWeek();
      }
    } else {
      initializeWeek();
    }

    if (savedExpanded) {
      try {
        setExpandedDays(JSON.parse(savedExpanded));
      } catch (e) {
        console.error('Failed to load expanded days:', e);
      }
    }
  }, []);

  const initializeWeek = () => {
    const week = {
      weekNumber: 1,
      startDate: new Date().toISOString().split('T')[0],
      days: sampleWorkoutWeek.days.map((day, dayIndex) => ({
        dayName: day.day,
        date: day.date,
        workoutType: day.type,
        completed: day.completed || false,
        exercises: day.exercises.map((ex, exIndex) => ({
          id: Date.now() + exIndex,
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          weight: typeof ex.weight === 'string' ? null : ex.weight,
          weightUnit: 'lbs',
          restTime: '90s',
          notes: '',
          lastWeekWeight: null,
          muscleGroup: ex.muscleGroup,
          order: exIndex,
          completedSets: Array(ex.sets).fill(false),
        })),
      })),
    };
    setWeeks([week]);
    setCurrentWeekIndex(0);
  };

  // Save to localStorage
  useEffect(() => {
    if (weeks.length > 0) {
      setSaving(true);
      const data = {
        weeks,
        currentWeekIndex,
        lastSaved: new Date().toISOString(),
      };
      localStorage.setItem('aviera_workout_planner', JSON.stringify(data));
      setTimeout(() => {
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }, 500);
    }
  }, [weeks, currentWeekIndex]);

  // Save expanded days
  useEffect(() => {
    localStorage.setItem('aviera_workout_expanded_days', JSON.stringify(expandedDays));
  }, [expandedDays]);

  // Rest timer countdown
  useEffect(() => {
    if (activeRestTimer && restTimerSeconds > 0) {
      const timer = setTimeout(() => {
        setRestTimerSeconds(restTimerSeconds - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (restTimerSeconds === 0 && activeRestTimer) {
      setActiveRestTimer(null);
      // Play notification sound (optional)
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Rest period complete!');
      }
    }
  }, [restTimerSeconds, activeRestTimer]);

  const currentWeek = weeks[currentWeekIndex] || null;
  const today = new Date().getDay();
  const dayMapping = { 0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday' };
  const currentDayName = dayMapping[today];

  const toggleDay = (dayIndex) => {
    const key = `${currentWeekIndex}-${dayIndex}`;
    setExpandedDays(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isDayExpanded = (dayIndex) => {
    const key = `${currentWeekIndex}-${dayIndex}`;
    return expandedDays[key] !== false; // Default to expanded
  };

  const handleAddExercise = (dayIndex, exerciseData) => {
    setWeeks(prev => {
      const newWeeks = [...prev];
      const day = newWeeks[currentWeekIndex].days[dayIndex];
      const newExercise = {
        id: Date.now(),
        name: exerciseData.name,
        sets: exerciseData.sets || 3,
        reps: exerciseData.reps || '8-10',
        weight: null,
        weightUnit: 'lbs',
        restTime: '90s',
        notes: exerciseData.notes || '',
        lastWeekWeight: null,
        muscleGroup: exerciseData.muscleGroup || 'General',
        order: day.exercises.length,
        completedSets: Array(exerciseData.sets || 3).fill(false),
      };
      day.exercises.push(newExercise);
      return newWeeks;
    });
    setShowAddExerciseModal(null);
  };

  const handleRemoveExercise = (dayIndex, exerciseId) => {
    setWeeks(prev => {
      const newWeeks = [...prev];
      const day = newWeeks[currentWeekIndex].days[dayIndex];
      day.exercises = day.exercises.filter(ex => ex.id !== exerciseId);
      // Reorder
      day.exercises.forEach((ex, i) => { ex.order = i; });
      return newWeeks;
    });
    setShowRemoveExerciseModal(null);
  };

  const handleUpdateExercise = (dayIndex, exerciseId, updates) => {
    setWeeks(prev => {
      const newWeeks = [...prev];
      const day = newWeeks[currentWeekIndex].days[dayIndex];
      const exercise = day.exercises.find(ex => ex.id === exerciseId);
      if (exercise) {
        Object.assign(exercise, updates);
        if (updates.sets !== undefined) {
          exercise.completedSets = Array(updates.sets).fill(false);
        }
      }
      return newWeeks;
    });
    setShowEditExerciseModal(null);
  };

  const handleSwapExercise = (dayIndex, exerciseId, newExercise) => {
    setWeeks(prev => {
      const newWeeks = [...prev];
      const day = newWeeks[currentWeekIndex].days[dayIndex];
      const exercise = day.exercises.find(ex => ex.id === exerciseId);
      if (exercise) {
        exercise.name = newExercise.name;
        exercise.muscleGroup = newExercise.muscleGroup || exercise.muscleGroup;
        // Keep sets/reps by default
      }
      return newWeeks;
    });
    setShowSwapExerciseModal(null);
  };

  const handleDuplicateDay = (sourceDayIndex, targetDayIndex) => {
    setWeeks(prev => {
      const newWeeks = [...prev];
      const sourceDay = newWeeks[currentWeekIndex].days[sourceDayIndex];
      const targetDay = newWeeks[currentWeekIndex].days[targetDayIndex];
      
      targetDay.exercises = sourceDay.exercises.map((ex, i) => ({
        ...ex,
        id: Date.now() + i,
        order: i,
        completedSets: Array(ex.sets).fill(false),
      }));
      targetDay.workoutType = sourceDay.workoutType;
      
      return newWeeks;
    });
    setShowDuplicateDayModal(null);
  };

  const handleClearDay = (dayIndex) => {
    setWeeks(prev => {
      const newWeeks = [...prev];
      newWeeks[currentWeekIndex].days[dayIndex].exercises = [];
      return newWeeks;
    });
    setShowClearDayModal(null);
  };

  const handleUpdateDayType = (dayIndex, workoutType) => {
    setWeeks(prev => {
      const newWeeks = [...prev];
      newWeeks[currentWeekIndex].days[dayIndex].workoutType = workoutType;
      return newWeeks;
    });
    setShowEditDayTypeModal(null);
  };

  const handleReorderExercise = (dayIndex, fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    
    setWeeks(prev => {
      const newWeeks = [...prev];
      const day = newWeeks[currentWeekIndex].days[dayIndex];
      const exercises = [...day.exercises];
      const [removed] = exercises.splice(fromIndex, 1);
      exercises.splice(toIndex, 0, removed);
      exercises.forEach((ex, i) => { ex.order = i; });
      day.exercises = exercises;
      return newWeeks;
    });
  };

  const handleCompleteWorkout = (dayIndex, feedback) => {
    setWeeks(prev => {
      const newWeeks = [...prev];
      const day = newWeeks[currentWeekIndex].days[dayIndex];
      day.completed = true;
      day.completionFeedback = feedback;
      day.completedAt = new Date().toISOString();
      return newWeeks;
    });
    setShowCompleteWorkoutModal(null);
    
    // Award XP for completing workout
    const data = require('../../lib/gamification').loadGamificationData();
    const result = awardXP(data, XP_VALUES.WORKOUT_COMPLETE, 'workout_complete');
    
    // Show XP toast
    setXpToast({ visible: true, xp: XP_VALUES.WORKOUT_COMPLETE, action: 'Workout Complete!' });
    setTimeout(() => setXpToast({ visible: false, xp: 0, action: '' }), 3000);
    
    // Update progress
    const checkedToday = JSON.parse(localStorage.getItem('aviera_checked_today') || '{}');
    const userStack = JSON.parse(localStorage.getItem('aviera_user_stack') || '{}');
    const supplementsTaken = Object.values(checkedToday).filter(Boolean).length;
    const supplementsTotal = userStack.supplements?.length || 0;
    updateTodayProgress(supplementsTaken, supplementsTotal, true);
    
    // Check achievements
    checkAchievements(result.data);
  };

  const handleGenerateNextWeek = () => {
    const currentWeek = weeks[currentWeekIndex];
    const newWeek = {
      weekNumber: currentWeek.weekNumber + 1,
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      days: currentWeek.days.map(day => ({
        ...day,
        completed: false,
        exercises: day.exercises.map(ex => ({
          ...ex,
          id: Date.now() + Math.random(),
          lastWeekWeight: ex.weight,
          weight: ex.weight ? Math.round(ex.weight * 1.05) : null, // 5% increase
          completedSets: Array(ex.sets).fill(false),
          notes: ex.notes,
        })),
      })),
    };
    setWeeks([...weeks, newWeek]);
    setCurrentWeekIndex(weeks.length);
    setShowRegenerateModal(false);
  };

  const startRestTimer = (seconds) => {
    setRestTimerSeconds(seconds);
    setActiveRestTimer(Date.now());
  };

  const parseRestTime = (restTime) => {
    if (restTime.includes('min')) {
      return parseInt(restTime) * 60;
    } else if (restTime.includes('s')) {
      return parseInt(restTime);
    }
    return 90; // default
  };

  const formatRestTime = (seconds) => {
    if (seconds >= 60) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return secs > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${mins}min`;
    }
    return `${seconds}s`;
  };

  const completedWorkouts = currentWeek?.days.filter(day => day.completed).length || 0;
  const totalWorkouts = currentWeek?.days.filter(day => day.exercises.length > 0).length || 0;
  const weeklyCompletion = totalWorkouts > 0 ? Math.round((completedWorkouts / totalWorkouts) * 100) : 0;

  if (!currentWeek) {
    return <div className="text-center py-12 text-[var(--txt-muted)]">Loading...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="text-3xl md:text-4xl font-normal mb-2 text-[var(--txt)]" style={{ letterSpacing: '2px' }}>Your Workout Plan</h1>
            <p className="text-lg text-[var(--txt-muted)]">
              Week of {currentWeek.startDate}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {saving && (
              <div className="flex items-center gap-2 text-sm text-[var(--txt-muted)]">
                <Save size={16} className="animate-spin" />
                Saving...
              </div>
            )}
            {saved && (
              <div className="flex items-center gap-2 text-sm text-green-500">
                <CheckCircle size={16} />
                Saved
              </div>
            )}
          </div>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center gap-4 mt-4">
          <button
            onClick={() => setCurrentWeekIndex(Math.max(0, currentWeekIndex - 1))}
            disabled={currentWeekIndex === 0}
            className="p-2 rounded-lg bg-[var(--bg-elev-1)] hover:bg-[var(--bg-elev-2)] disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ArrowLeft size={20} className="text-[var(--txt)]" />
          </button>
          <span className="text-sm font-normal text-[var(--txt)]">
            Week {currentWeek.weekNumber}
          </span>
          <button
            onClick={() => setCurrentWeekIndex(Math.min(weeks.length - 1, currentWeekIndex + 1))}
            disabled={currentWeekIndex === weeks.length - 1}
            className="p-2 rounded-lg bg-[var(--bg-elev-1)] hover:bg-[var(--bg-elev-2)] disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ArrowRight size={20} className="text-[var(--txt)]" />
          </button>
        </div>
      </div>

      {/* Goal & Weekly Completion */}
      <div className="glass-card p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[var(--acc)]/20 rounded-full flex items-center justify-center">
              <Target className="text-[var(--acc)]" size={24} />
            </div>
            <div>
              <div className="text-xl font-normal text-[var(--txt)]">
                🎯 Current Goal: Muscle Building
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-normal text-[var(--txt)]">
                {completedWorkouts}/{totalWorkouts}
              </div>
              <p className="text-sm text-[var(--txt-muted)]">Workouts Complete</p>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="text-[var(--txt-muted)]">This week: {completedWorkouts}/{totalWorkouts} workouts complete</span>
            <span className="font-normal text-[var(--txt)]">{weeklyCompletion}%</span>
          </div>
          <div className="w-full bg-[var(--bg-elev-2)] rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${weeklyCompletion}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-[var(--acc)] to-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setShowOptimizeModal(true)}
          className="px-3 py-1.5 text-xs font-normal bg-[var(--bg-elev-1)] hover:bg-[var(--bg-elev-2)] border border-[var(--border)] rounded-lg text-[var(--txt-muted)] hover:text-[var(--txt)] transition flex items-center gap-1"
        >
          <Sparkles size={12} />
          Optimize This Week
        </button>
      </div>

      {/* Weekly Calendar View */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        {currentWeek.days.map((day, dayIndex) => {
          const isToday = day.dayName === currentDayName;
          const isCompleted = day.completed;
          const isExpanded = isDayExpanded(dayIndex);
          const isRestDay = day.exercises.length === 0 && day.workoutType.toLowerCase().includes('rest');

          return (
            <motion.div
              key={dayIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: dayIndex * 0.05 }}
            >
              <GlassCard 
                className={`
                  p-6 hover:shadow-premium-lg transition-all duration-300
                  ${isToday ? 'ring-2 ring-[var(--acc)] ring-opacity-50' : ''}
                  ${isCompleted ? 'bg-[var(--acc)]/5 border-[var(--acc)]/20' : ''}
                `}
              >
                {/* Day Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <button
                        onClick={() => setShowEditDayTypeModal({ dayIndex, currentType: day.workoutType })}
                        className="text-left"
                      >
                        <h3 className="text-lg font-normal text-[var(--txt)] hover:text-[var(--acc)] transition" style={{ letterSpacing: '2px' }}>
                          {day.dayName}
                        </h3>
                      </button>
                      {isToday && (
                        <span className="px-2 py-0.5 bg-[var(--acc)]/20 text-[var(--acc)] rounded text-xs font-normal">
                          Today
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[var(--txt-muted)] mb-2">{day.date}</p>
                    <div className="px-3 py-1 bg-[var(--acc)]/10 border border-[var(--acc)]/20 rounded-full inline-block">
                      <span className="text-sm font-normal text-[var(--acc)]">{day.workoutType}</span>
                    </div>
                  </div>
                  
                  {/* Day Actions */}
                  <div className="flex items-center gap-1">
                    {!isRestDay && (
                      <button
                        onClick={() => setShowDuplicateDayModal({ dayIndex })}
                        className="p-1.5 hover:bg-[var(--bg-elev-2)] rounded-lg transition text-[var(--txt-muted)] hover:text-[var(--txt)]"
                        title="Duplicate day"
                      >
                        <Copy size={16} />
                      </button>
                    )}
                    {day.exercises.length > 0 && (
                      <button
                        onClick={() => setShowClearDayModal({ dayIndex, dayName: day.dayName })}
                        className="p-1.5 hover:bg-red-500/20 rounded-lg transition text-[var(--txt-muted)] hover:text-red-400"
                        title="Clear day"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Rest Day Content */}
                {isRestDay && (
                  <div className="py-4 text-center">
                    <div className="text-4xl mb-2">😴</div>
                    <p className="text-[var(--txt-muted)] mb-4">Rest Day</p>
                    {day.workoutType.toLowerCase().includes('active') && (
                      <p className="text-sm text-[var(--acc)] font-light">20min walk or Yoga</p>
                    )}
                  </div>
                )}

                {/* Workout Day Content */}
                {!isRestDay && (
                  <>
                    <div className="mb-4">
                      <p className="text-sm text-[var(--txt-muted)] mb-2">
                        {day.exercises.length} exercises
                      </p>
                      {day.exercises.length > 0 && (
                        <div className="space-y-2">
                          {day.exercises.slice(0, 2).map((exercise) => (
                            <div key={exercise.id} className="text-sm text-[var(--txt)]">
                              <span className="font-normal">{exercise.name}</span>
                              <span className="text-[var(--txt-muted)]"> • {exercise.sets} x {exercise.reps}</span>
                            </div>
                          ))}
                          {day.exercises.length > 2 && (
                            <p className="text-xs text-[var(--txt-muted)]">
                              +{day.exercises.length - 2} more exercises
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Expand/Collapse Button */}
                    <button
                      onClick={() => toggleDay(dayIndex)}
                      className="w-full flex items-center justify-between px-3 py-2 bg-[var(--bg-elev-1)] hover:bg-[var(--bg-elev-2)] rounded-lg transition text-sm text-[var(--txt-muted)] hover:text-[var(--txt)] mb-2"
                    >
                      <span>{isExpanded ? 'Show Less' : 'View Exercises'}</span>
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {/* Add Exercise Button */}
                    <button
                      onClick={() => setShowAddExerciseModal({ dayIndex })}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[var(--bg-elev-1)] hover:bg-[var(--bg-elev-2)] border border-[var(--border)] rounded-lg transition text-sm font-normal text-[var(--txt-muted)] hover:text-[var(--txt)] mb-2"
                    >
                      <Plus size={16} />
                      Add Exercise
                    </button>

                    {/* Complete Workout Button */}
                    {!isCompleted && day.exercises.length > 0 && (
                      <button
                        onClick={() => setShowCompleteWorkoutModal({ dayIndex, dayName: day.dayName })}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg transition text-sm font-normal text-green-400 hover:text-green-300"
                      >
                        <Check size={16} />
                        Mark Complete
                      </button>
                    )}

                    {/* Expanded Exercise List */}
                    <AnimatePresence>
                      {isExpanded && day.exercises.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-4 pt-4 border-t border-[var(--border)] space-y-3"
                        >
                          {day.exercises.map((exercise, exIndex) => (
                            <ExerciseCard
                              key={exercise.id}
                              exercise={exercise}
                              dayIndex={dayIndex}
                              exerciseIndex={exIndex}
                              onEdit={() => setShowEditExerciseModal({ dayIndex, exercise })}
                              onRemove={() => setShowRemoveExerciseModal({ dayIndex, exercise })}
                              onSwap={() => setShowSwapExerciseModal({ dayIndex, exercise })}
                              onUpdate={(updates) => handleUpdateExercise(dayIndex, exercise.id, updates)}
                              onDragStart={() => setDraggedExercise({ dayIndex, exerciseIndex: exIndex })}
                              onDragOver={() => setDraggedOverExercise({ dayIndex, exerciseIndex: exIndex })}
                              onDragEnd={() => {
                                if (draggedExercise && draggedOverExercise && draggedExercise.dayIndex === draggedOverExercise.dayIndex) {
                                  handleReorderExercise(draggedExercise.dayIndex, draggedExercise.exerciseIndex, draggedOverExercise.exerciseIndex);
                                }
                                setDraggedExercise(null);
                                setDraggedOverExercise(null);
                              }}
                              onStartRestTimer={(seconds) => startRestTimer(seconds)}
                            />
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Button
          variant="secondary"
          className="flex-1"
          onClick={() => setShowPDFModal(true)}
        >
          <Download size={20} />
          Download PDF
        </Button>
        <Button
          variant="secondary"
          className="flex-1"
          onClick={() => setShowRegenerateModal(true)}
        >
          <RefreshCw size={20} />
          Generate Next Week
        </Button>
      </div>

      {/* Rest Timer Overlay */}
      {activeRestTimer && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-8 text-center"
          >
            <div className="text-6xl font-normal text-[var(--acc)] mb-4">
              {formatRestTime(restTimerSeconds)}
            </div>
            <p className="text-[var(--txt-muted)] mb-4">Rest Period</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setActiveRestTimer(null);
                  setRestTimerSeconds(0);
                }}
                className="px-4 py-2 bg-[var(--bg-elev-1)] hover:bg-[var(--bg-elev-2)] rounded-lg text-sm font-normal text-[var(--txt)] transition"
              >
                Skip
              </button>
              <button
                onClick={() => setRestTimerSeconds(restTimerSeconds + 30)}
                className="px-4 py-2 bg-[var(--acc)] text-white rounded-lg hover:bg-blue-600 text-sm font-normal transition"
              >
                +30s
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modals */}
      <AddExerciseModal
        isOpen={showAddExerciseModal !== null}
        dayIndex={showAddExerciseModal?.dayIndex}
        onClose={() => setShowAddExerciseModal(null)}
        onAdd={(exerciseData) => showAddExerciseModal && handleAddExercise(showAddExerciseModal.dayIndex, exerciseData)}
      />

      <EditExerciseModal
        isOpen={showEditExerciseModal !== null}
        exercise={showEditExerciseModal?.exercise}
        dayIndex={showEditExerciseModal?.dayIndex}
        onClose={() => setShowEditExerciseModal(null)}
        onUpdate={(updates) => showEditExerciseModal && handleUpdateExercise(showEditExerciseModal.dayIndex, showEditExerciseModal.exercise.id, updates)}
      />

      <RemoveExerciseModal
        isOpen={showRemoveExerciseModal !== null}
        exercise={showRemoveExerciseModal?.exercise}
        onClose={() => setShowRemoveExerciseModal(null)}
        onConfirm={() => showRemoveExerciseModal && handleRemoveExercise(showRemoveExerciseModal.dayIndex, showRemoveExerciseModal.exercise.id)}
      />

      <SwapExerciseModal
        isOpen={showSwapExerciseModal !== null}
        exercise={showSwapExerciseModal?.exercise}
        dayIndex={showSwapExerciseModal?.dayIndex}
        onClose={() => setShowSwapExerciseModal(null)}
        onSwap={(newExercise) => showSwapExerciseModal && handleSwapExercise(showSwapExerciseModal.dayIndex, showSwapExerciseModal.exercise.id, newExercise)}
      />

      <DuplicateDayModal
        isOpen={showDuplicateDayModal !== null}
        sourceDayIndex={showDuplicateDayModal?.dayIndex}
        days={currentWeek?.days || []}
        onClose={() => setShowDuplicateDayModal(null)}
        onConfirm={(targetDayIndex) => showDuplicateDayModal && handleDuplicateDay(showDuplicateDayModal.dayIndex, targetDayIndex)}
      />

      <ClearDayModal
        isOpen={showClearDayModal !== null}
        dayName={showClearDayModal?.dayName}
        onClose={() => setShowClearDayModal(null)}
        onConfirm={() => showClearDayModal && handleClearDay(showClearDayModal.dayIndex)}
      />

      <EditDayTypeModal
        isOpen={showEditDayTypeModal !== null}
        currentType={showEditDayTypeModal?.currentType}
        dayIndex={showEditDayTypeModal?.dayIndex}
        onClose={() => setShowEditDayTypeModal(null)}
        onSave={(workoutType) => showEditDayTypeModal && handleUpdateDayType(showEditDayTypeModal.dayIndex, workoutType)}
      />

      <CompleteWorkoutModal
        isOpen={showCompleteWorkoutModal !== null}
        dayName={showCompleteWorkoutModal?.dayName}
        onClose={() => setShowCompleteWorkoutModal(null)}
        onComplete={(feedback) => showCompleteWorkoutModal && handleCompleteWorkout(showCompleteWorkoutModal.dayIndex, feedback)}
      />

      <PDFModal
        isOpen={showPDFModal}
        onClose={() => setShowPDFModal(false)}
        week={currentWeek}
      />

      <RegenerateWeekModal
        isOpen={showRegenerateModal}
        onClose={() => setShowRegenerateModal(false)}
        onConfirm={handleGenerateNextWeek}
        currentWeek={currentWeek}
      />

      {/* XP Toast */}
      <XPToast 
        xp={xpToast.xp} 
        action={xpToast.action} 
        isVisible={xpToast.visible}
        onClose={() => setXpToast({ visible: false, xp: 0, action: '' })}
      />

      <OptimizeWeekModal
        isOpen={showOptimizeModal}
        onClose={() => setShowOptimizeModal(false)}
      />
    </div>
  );
}

// Exercise Card Component
function ExerciseCard({ exercise, dayIndex, exerciseIndex, onEdit, onRemove, onSwap, onUpdate, onDragStart, onDragOver, onDragEnd, onStartRestTimer }) {
  const [showProgressiveOverload, setShowProgressiveOverload] = useState(false);

  const suggestedIncrease = exercise.lastWeekWeight && exercise.weight 
    ? exercise.weight > exercise.lastWeekWeight 
      ? `+${exercise.weight - exercise.lastWeekWeight} lbs` 
      : null
    : null;

  const isNewPR = exercise.lastWeekWeight && exercise.weight && exercise.weight > exercise.lastWeekWeight;

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver();
      }}
      onDragEnd={onDragEnd}
      className="p-3 bg-[var(--bg-elev-1)] rounded-lg border border-[var(--border)] hover:border-[var(--acc)]/30 transition"
    >
      <div className="flex items-start gap-2">
        <button className="p-1 text-[var(--txt-muted)] cursor-move" title="Drag to reorder">
          <GripVertical size={14} />
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-normal text-[var(--txt)]" style={{ letterSpacing: '2px' }}>{exercise.name}</h4>
                {isNewPR && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-yellow-500/20 border border-yellow-500/30 rounded text-xs font-normal text-yellow-400">
                    <Trophy size={12} />
                    New PR!
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm text-[var(--txt-muted)] mt-1">
                <span>{exercise.sets} sets x {exercise.reps}</span>
                {exercise.weight && (
                  <>
                    <span>•</span>
                    <span className="font-normal">{exercise.weight} {exercise.weightUnit}</span>
                  </>
                )}
                {exercise.lastWeekWeight && (
                  <>
                    <span>•</span>
                    <span className="text-xs">Last week: {exercise.lastWeekWeight} {exercise.weightUnit}</span>
                  </>
                )}
                {suggestedIncrease && (
                  <button
                    onClick={() => setShowProgressiveOverload(!showProgressiveOverload)}
                    className="px-2 py-0.5 bg-green-500/20 border border-green-500/30 rounded text-xs font-normal text-green-400"
                  >
                    {suggestedIncrease}
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => onStartRestTimer(parseRestTime(exercise.restTime))}
                  className="flex items-center gap-1 px-2 py-1 bg-[var(--bg-elev-2)] hover:bg-[var(--acc)]/20 rounded text-xs text-[var(--txt-muted)] hover:text-[var(--acc)] transition"
                >
                  <Clock size={12} />
                  {exercise.restTime}
                </button>
                {exercise.notes && (
                  <span className="text-xs text-[var(--txt-muted)]">📝 Notes</span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={onEdit}
                className="p-1.5 hover:bg-[var(--bg-elev-2)] rounded transition text-[var(--txt-muted)] hover:text-[var(--txt)]"
                title="Edit exercise"
              >
                <Edit3 size={14} />
              </button>
              <button
                onClick={onSwap}
                className="p-1.5 hover:bg-[var(--bg-elev-2)] rounded transition text-[var(--txt-muted)] hover:text-[var(--txt)]"
                title="Swap exercise"
              >
                <RefreshCw size={14} />
              </button>
              <button
                onClick={onRemove}
                className="p-1.5 hover:bg-red-500/20 rounded transition text-[var(--txt-muted)] hover:text-red-400"
                title="Remove exercise"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add Exercise Modal
function AddExerciseModal({ isOpen, dayIndex, onClose, onAdd }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Flatten all exercises from EXERCISES object (organized by muscle groups)
  const allExercises = Object.keys(EXERCISES).flatMap(muscleGroup => 
    (EXERCISES[muscleGroup] || []).map(ex => ({
      ...ex,
      muscleGroup: muscleGroup,
    }))
  );
  
  const filteredExercises = allExercises.filter(ex => 
    ex.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedCategory === 'all' || ex.muscleGroup === selectedCategory)
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Exercise">
      <div>
        <div className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exercises..."
            className="w-full px-4 py-2 bg-[var(--bg-elev-1)] border border-[var(--border)] rounded-lg text-[var(--txt)] focus:outline-none focus:ring-2 focus:ring-[var(--acc)]"
          />
        </div>
        <div className="mb-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 bg-[var(--bg-elev-1)] border border-[var(--border)] rounded-lg text-[var(--txt)] focus:outline-none"
          >
            <option value="all">All Muscle Groups</option>
            {Object.keys(EXERCISES).map(key => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
        </div>
        <div className="max-h-96 overflow-y-auto space-y-2">
          {filteredExercises.slice(0, 30).map((exercise, index) => (
            <button
              key={`${exercise.name}-${index}`}
              onClick={() => onAdd({
                name: exercise.name,
                sets: 3,
                reps: exercise.setsReps?.hypertrophy || '8-10',
                muscleGroup: exercise.muscleGroup || 'General',
                notes: exercise.cues?.[0] || '',
              })}
              className="w-full text-left p-3 bg-[var(--bg-elev-1)] hover:bg-[var(--bg-elev-2)] rounded-lg border border-[var(--border)] transition"
            >
              <div className="font-normal text-[var(--txt)]" style={{ letterSpacing: '2px' }}>{exercise.name}</div>
              <div className="text-xs text-[var(--txt-muted)] mt-1">
                {exercise.muscleGroup} • Equipment: {Array.isArray(exercise.equipment) ? exercise.equipment.join(', ') : 'Various'}
              </div>
            </button>
          ))}
          {filteredExercises.length === 0 && (
            <div className="text-center py-8 text-[var(--txt-muted)]">
              No exercises found. Try a different search.
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

// Other modals - simplified for now, full implementations would follow similar patterns
function EditExerciseModal({ isOpen, exercise, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    sets: exercise?.sets || 3,
    reps: exercise?.reps || '8-10',
    weight: exercise?.weight || '',
    weightUnit: exercise?.weightUnit || 'lbs',
    restTime: exercise?.restTime || '90s',
    notes: exercise?.notes || '',
  });

  useEffect(() => {
    if (exercise) {
      setFormData({
        sets: exercise.sets || 3,
        reps: exercise.reps || '8-10',
        weight: exercise.weight || '',
        weightUnit: exercise.weightUnit || 'lbs',
        restTime: exercise.restTime || '90s',
        notes: exercise.notes || '',
      });
    }
  }, [exercise]);

  if (!exercise) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit ${exercise.name}`}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-normal text-[var(--txt)] mb-2">Sets</label>
            <input
              type="number"
              value={formData.sets}
              onChange={(e) => setFormData({ ...formData, sets: parseInt(e.target.value) || 0 })}
              min="1"
              className="w-full px-4 py-2 bg-[var(--bg-elev-1)] border border-[var(--border)] rounded-lg text-[var(--txt)] focus:outline-none focus:ring-2 focus:ring-[var(--acc)]"
            />
          </div>
          <div>
            <label className="block text-sm font-normal text-[var(--txt)] mb-2">Reps</label>
            <input
              type="text"
              value={formData.reps}
              onChange={(e) => setFormData({ ...formData, reps: e.target.value })}
              placeholder="8-10"
              className="w-full px-4 py-2 bg-[var(--bg-elev-1)] border border-[var(--border)] rounded-lg text-[var(--txt)] focus:outline-none focus:ring-2 focus:ring-[var(--acc)]"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-normal text-[var(--txt)] mb-2">Weight</label>
            <input
              type="number"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value ? parseFloat(e.target.value) : null })}
              className="w-full px-4 py-2 bg-[var(--bg-elev-1)] border border-[var(--border)] rounded-lg text-[var(--txt)] focus:outline-none focus:ring-2 focus:ring-[var(--acc)]"
            />
          </div>
          <div>
            <label className="block text-sm font-normal text-[var(--txt)] mb-2">Unit</label>
            <select
              value={formData.weightUnit}
              onChange={(e) => setFormData({ ...formData, weightUnit: e.target.value })}
              className="w-full px-4 py-2 bg-[var(--bg-elev-1)] border border-[var(--border)] rounded-lg text-[var(--txt)]"
            >
              <option value="lbs">lbs</option>
              <option value="kg">kg</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-normal text-[var(--txt)] mb-2">Rest Time</label>
          <select
            value={formData.restTime}
            onChange={(e) => setFormData({ ...formData, restTime: e.target.value })}
            className="w-full px-4 py-2 bg-[var(--bg-elev-1)] border border-[var(--border)] rounded-lg text-[var(--txt)]"
          >
            <option value="30s">30s</option>
            <option value="60s">60s</option>
            <option value="90s">90s</option>
            <option value="2min">2min</option>
            <option value="3min">3min</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-normal text-[var(--txt)] mb-2">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Form cues, injuries, modifications..."
            rows={3}
            className="w-full px-4 py-2 bg-[var(--bg-elev-1)] border border-[var(--border)] rounded-lg text-[var(--txt)] focus:outline-none focus:ring-2 focus:ring-[var(--acc)] resize-none"
          />
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={() => onUpdate(formData)} className="flex-1">Save Changes</Button>
        </div>
      </div>
    </Modal>
  );
}

// Simplified other modals - full implementations would be similar
function RemoveExerciseModal({ isOpen, exercise, onClose, onConfirm }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Remove Exercise">
      <div className="text-center py-4">
        <p className="text-lg text-[var(--txt)] mb-6">Remove <strong>{exercise?.name}</strong>?</p>
        <div className="flex gap-3 justify-center">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={onConfirm} className="bg-red-500 hover:bg-red-600">Remove</Button>
        </div>
      </div>
    </Modal>
  );
}

function SwapExerciseModal({ isOpen, exercise, onClose, onSwap }) {
  const [searchQuery, setSearchQuery] = useState('');
  // Similar to AddExerciseModal but filtered by muscle group
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Swap ${exercise?.name}`}>
      <div className="text-center py-8">
        <p className="text-[var(--txt-muted)] mb-6">Exercise swap feature coming soon. This will show exercises from the same muscle group.</p>
        <Button onClick={onClose}>Got it</Button>
      </div>
    </Modal>
  );
}

function DuplicateDayModal({ isOpen, sourceDayIndex, days, onClose, onConfirm }) {
  const [targetDayIndex, setTargetDayIndex] = useState(null);
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Copy Day">
      <div className="space-y-4">
        <p className="text-[var(--txt-muted)]">Copy to which day?</p>
        <div className="space-y-2">
          {days.map((day, index) => (
            index !== sourceDayIndex && (
              <button
                key={index}
                onClick={() => {
                  setTargetDayIndex(index);
                  onConfirm(index);
                }}
                className="w-full text-left p-3 bg-[var(--bg-elev-1)] hover:bg-[var(--bg-elev-2)] rounded-lg border border-[var(--border)] transition"
              >
                {day.dayName} - {day.workoutType}
              </button>
            )
          ))}
        </div>
        <Button variant="secondary" onClick={onClose} className="w-full">Cancel</Button>
      </div>
    </Modal>
  );
}

function ClearDayModal({ isOpen, dayName, onClose, onConfirm }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Clear Day">
      <div className="text-center py-4">
        <p className="text-lg text-[var(--txt)] mb-6">Clear all exercises from <strong>{dayName}</strong>?</p>
        <div className="flex gap-3 justify-center">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={onConfirm} className="bg-red-500 hover:bg-red-600">Clear</Button>
        </div>
      </div>
    </Modal>
  );
}

function EditDayTypeModal({ isOpen, currentType, dayIndex, onClose, onSave }) {
  const [workoutType, setWorkoutType] = useState(currentType || '');
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Day Type">
      <div className="space-y-4">
        <input
          type="text"
          value={workoutType}
          onChange={(e) => setWorkoutType(e.target.value)}
          placeholder="e.g., Upper Push, Chest & Triceps"
          className="w-full px-4 py-2 bg-[var(--bg-elev-1)] border border-[var(--border)] rounded-lg text-[var(--txt)] focus:outline-none focus:ring-2 focus:ring-[var(--acc)]"
        />
        <div className="flex gap-2">
          <button
            onClick={() => setWorkoutType('Rest Day')}
            className="px-3 py-1.5 bg-[var(--bg-elev-1)] hover:bg-[var(--bg-elev-2)] rounded-lg text-sm text-[var(--txt-muted)] hover:text-[var(--txt)] transition"
          >
            Rest Day
          </button>
          <button
            onClick={() => setWorkoutType('Active Recovery')}
            className="px-3 py-1.5 bg-[var(--bg-elev-1)] hover:bg-[var(--bg-elev-2)] rounded-lg text-sm text-[var(--txt-muted)] hover:text-[var(--txt)] transition"
          >
            Active Recovery
          </button>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={() => onSave(workoutType)} className="flex-1">Save</Button>
        </div>
      </div>
    </Modal>
  );
}

function CompleteWorkoutModal({ isOpen, dayName, onClose, onComplete }) {
  const [difficulty, setDifficulty] = useState('');
  const [notes, setNotes] = useState('');
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Complete ${dayName} Workout`}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-normal text-[var(--txt)] mb-3">
            How was today's workout?
          </label>
          <div className="space-y-2">
            {['Too Easy', 'Just Right', 'Too Hard'].map((option) => (
              <label
                key={option}
                className="flex items-center gap-3 p-3 bg-[var(--bg-elev-1)] rounded-lg cursor-pointer hover:bg-[var(--bg-elev-2)] transition"
              >
                <input
                  type="radio"
                  name="difficulty"
                  value={option.toLowerCase().replace(' ', '_')}
                  checked={difficulty === option.toLowerCase().replace(' ', '_')}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-4 h-4 text-[var(--acc)]"
                />
                <span className="text-[var(--txt)]">{option}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-normal text-[var(--txt)] mb-2">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How did you feel? Any observations?"
            rows={3}
            className="w-full px-4 py-2 bg-[var(--bg-elev-1)] border border-[var(--border)] rounded-lg text-[var(--txt)] focus:outline-none focus:ring-2 focus:ring-[var(--acc)] resize-none"
          />
        </div>
        <Button onClick={() => onComplete({ difficulty, notes })} className="w-full" disabled={!difficulty}>
          Complete Workout
        </Button>
      </div>
    </Modal>
  );
}

function PDFModal({ isOpen, onClose, week }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Download PDF">
      <div className="text-center py-8">
        <p className="text-[var(--txt-muted)] mb-6">PDF download with all customizations coming soon!</p>
        <Button onClick={onClose}>Got it</Button>
      </div>
    </Modal>
  );
}

function RegenerateWeekModal({ isOpen, onClose, onConfirm, currentWeek }) {
  const preview = currentWeek?.days
    .filter(day => day.exercises.length > 0)
    .flatMap(day => day.exercises)
    .filter(ex => ex.lastWeekWeight && ex.weight)
    .slice(0, 5)
    .map(ex => `${ex.name}: ${ex.lastWeekWeight}→${ex.weight} lbs`);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Generate Next Week">
      <div className="space-y-4">
        <p className="text-[var(--txt-muted)]">Week 2 Preview - Progressive Overload:</p>
        <div className="space-y-2">
          {preview?.map((item, i) => (
            <div key={i} className="p-2 bg-[var(--bg-elev-1)] rounded text-sm text-[var(--txt)]">
              {item}
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={onConfirm} className="flex-1">Generate Week 2</Button>
        </div>
      </div>
    </Modal>
  );
}

function OptimizeWeekModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Optimize This Week">
      <div className="text-center py-8">
        <p className="text-[var(--txt-muted)] mb-6">AI optimization suggestions coming soon!</p>
        <Button onClick={onClose}>Got it</Button>
      </div>
    </Modal>
  );
}
