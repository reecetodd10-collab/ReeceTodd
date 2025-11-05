import React, { useState } from 'react';
import { 
  Dumbbell, 
  Download, 
  MessageCircle, 
  RefreshCw,
  Check,
  ChevronDown,
  ChevronUp,
  Edit3,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sampleWorkoutWeek } from '../../lib/placeholder-data';
import GlassCard from '../shared/GlassCard';
import Button from '../shared/Button';
import Modal from '../shared/Modal';
import { TESTING_MODE, hasPremiumAccess } from '../../lib/config';

export default function WorkoutPlanner() {
  const [workoutWeek, setWorkoutWeek] = useState(sampleWorkoutWeek);
  const [expandedDay, setExpandedDay] = useState(null);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [showAIChatModal, setShowAIChatModal] = useState(false);
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Mock user premium status - would come from backend
  const userIsPremium = false;
  const isPremium = hasPremiumAccess(userIsPremium);

  // Calculate weekly completion
  const completedWorkouts = workoutWeek.days.filter(day => day.completed).length;
  const totalWorkouts = workoutWeek.days.filter(day => day.exercises.length > 0).length;
  const weeklyCompletion = totalWorkouts > 0 ? Math.round((completedWorkouts / totalWorkouts) * 100) : 0;

  // Get current day of week (0 = Sunday, 1 = Monday, etc.)
  const today = new Date().getDay();
  const dayMapping = { 0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday' };
  const currentDayName = dayMapping[today];

  const toggleDay = (index) => {
    setExpandedDay(expandedDay === index ? null : index);
  };

  const toggleWorkoutComplete = (dayIndex) => {
    setWorkoutWeek(prev => ({
      ...prev,
      days: prev.days.map((day, i) => 
        i === dayIndex ? { ...day, completed: !day.completed } : day
      )
    }));
  };

  const handleWeightChange = (dayIndex, exerciseIndex, newWeight) => {
    setWorkoutWeek(prev => ({
      ...prev,
      days: prev.days.map((day, i) => 
        i === dayIndex 
          ? {
              ...day,
              exercises: day.exercises.map((exercise, exI) => 
                exI === exerciseIndex ? { ...exercise, weight: newWeight } : exercise
              )
            }
          : day
      )
    }));
  };

  const handleDownloadPDF = () => {
    setShowPDFModal(true);
  };

  const handleAIChat = () => {
    if (!isPremium && !TESTING_MODE) {
      // Would show upgrade modal in production
      setShowAIChatModal(true);
    } else {
      setShowAIChatModal(true);
    }
  };

  const handleRegenerate = () => {
    setShowRegenerateModal(true);
  };

  const handleEditDay = () => {
    setShowEditModal(true);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-[var(--txt)]">Your Workout Plan</h1>
        <p className="text-lg text-[var(--txt-muted)]">
          Week of {workoutWeek.weekOf}
        </p>
      </div>

      {/* Goal & Weekly Completion */}
      <div className="glass-card p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[var(--acc)]/20 rounded-full flex items-center justify-center">
              <Target className="text-[var(--acc)]" size={24} />
            </div>
            <div>
              <div className="text-xl font-bold text-[var(--txt)]">
                🎯 Current Goal: {workoutWeek.goal}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--txt)]">
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
            <span className="font-semibold text-[var(--txt)]">{weeklyCompletion}%</span>
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

      {/* Weekly Calendar View */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        {workoutWeek.days.map((day, dayIndex) => {
          const isToday = day.day === currentDayName;
          const isCompleted = day.completed;
          const isExpanded = expandedDay === dayIndex;
          const isRestDay = day.exercises.length === 0;

          return (
            <motion.div
              key={dayIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: dayIndex * 0.05 }}
            >
              <GlassCard 
                className={`
                  p-6 hover:shadow-premium-lg transition-all duration-300 cursor-pointer
                  ${isToday ? 'ring-2 ring-[var(--acc)] ring-opacity-50' : ''}
                  ${isCompleted ? 'bg-[var(--acc)]/5 border-[var(--acc)]/20' : ''}
                `}
              >
                {/* Day Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-[var(--txt)]">
                        {day.day}
                      </h3>
                      {isToday && (
                        <span className="px-2 py-0.5 bg-[var(--acc)]/20 text-[var(--acc)] rounded text-xs font-semibold">
                          Today
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[var(--txt-muted)] mb-2">{day.date}</p>
                    <div className="px-3 py-1 bg-[var(--acc)]/10 border border-[var(--acc)]/20 rounded-full inline-block">
                      <span className="text-sm font-medium text-[var(--acc)]">{day.type}</span>
                    </div>
                  </div>
                  
                  {/* Completion Checkbox */}
                  {!isRestDay && (
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWorkoutComplete(dayIndex);
                      }}
                      className={`
                        w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0
                        ${isCompleted
                          ? 'bg-green-500 border-green-500 shadow-accent'
                          : 'border-[var(--border)] hover:border-green-500 hover:bg-green-500/10'
                        }
                      `}
                      whileTap={{ scale: 0.95 }}
                    >
                      <AnimatePresence>
                        {isCompleted && (
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
                    </motion.button>
                  )}
                </div>

                {/* Rest Day Content */}
                {isRestDay && (
                  <div className="py-4 text-center">
                    <div className="text-4xl mb-2">😴</div>
                    <p className="text-[var(--txt-muted)] mb-2">Rest Day</p>
                    {day.suggestion && (
                      <p className="text-sm text-[var(--acc)] font-medium">{day.suggestion}</p>
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
                      <div className="space-y-2">
                        {day.exercises.slice(0, 2).map((exercise, exIndex) => (
                          <div key={exIndex} className="text-sm text-[var(--txt)]">
                            <span className="font-medium">{exercise.name}</span>
                            <span className="text-[var(--txt-muted)]"> • {exercise.sets} x {exercise.reps}</span>
                          </div>
                        ))}
                        {day.exercises.length > 2 && (
                          <p className="text-xs text-[var(--txt-muted)]">
                            +{day.exercises.length - 2} more exercises
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Expand/Collapse Button */}
                    <button
                      onClick={() => toggleDay(dayIndex)}
                      className="w-full flex items-center justify-between px-3 py-2 bg-[var(--bg-elev-1)] hover:bg-[var(--bg-elev-2)] rounded-lg transition text-sm text-[var(--txt-muted)] hover:text-[var(--txt)]"
                    >
                      <span>{isExpanded ? 'Show Less' : 'View Exercises'}</span>
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {/* Expanded Exercise List */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-4 pt-4 border-t border-[var(--border)] space-y-4"
                        >
                          {day.exercises.map((exercise, exIndex) => (
                            <div key={exIndex} className="p-3 bg-[var(--bg-elev-1)] rounded-lg">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-[var(--txt)] mb-1">{exercise.name}</h4>
                                  <div className="flex items-center gap-3 text-sm text-[var(--txt-muted)]">
                                    <span>{exercise.sets} sets x {exercise.reps}</span>
                                    <span>•</span>
                                    <span className="text-xs px-2 py-0.5 bg-[var(--bg-elev-2)] rounded">
                                      {exercise.muscleGroup}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-2">
                                <label className="text-xs text-[var(--txt-muted)] mb-1 block">Weight:</label>
                                <input
                                  type="text"
                                  value={exercise.weight}
                                  onChange={(e) => handleWeightChange(dayIndex, exIndex, e.target.value)}
                                  placeholder="135 lbs"
                                  className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-sm text-[var(--txt)] focus:outline-none focus:ring-2 focus:ring-[var(--acc)] focus:border-transparent"
                                />
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Edit Day Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditDay();
                      }}
                      className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-[var(--bg-elev-1)] hover:bg-[var(--bg-elev-2)] border border-[var(--border)] rounded-lg transition text-sm font-medium text-[var(--txt-muted)] hover:text-[var(--txt)]"
                    >
                      <Edit3 size={16} />
                      Edit Day
                    </button>
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
          onClick={handleDownloadPDF}
        >
          <Download size={20} />
          Download PDF
        </Button>
        <Button
          variant="secondary"
          className="flex-1"
          onClick={handleAIChat}
        >
          <MessageCircle size={20} />
          Ask AI Coach
        </Button>
        <Button
          variant="secondary"
          className="flex-1"
          onClick={handleRegenerate}
        >
          <RefreshCw size={20} />
          Generate Next Week
        </Button>
      </div>

      {/* Coming Soon Modals */}
      <Modal
        isOpen={showPDFModal}
        onClose={() => setShowPDFModal(false)}
        title="Download PDF"
      >
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-[var(--acc)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Download className="text-[var(--acc)]" size={32} />
          </div>
          <h3 className="text-xl font-bold text-[var(--txt)] mb-2">Coming Soon</h3>
          <p className="text-[var(--txt-muted)] mb-6">
            PDF download functionality is in development. You'll soon be able to download your workout plan as a printable PDF.
          </p>
          <Button onClick={() => setShowPDFModal(false)}>Got it</Button>
        </div>
      </Modal>

      <Modal
        isOpen={showAIChatModal}
        onClose={() => setShowAIChatModal(false)}
        title="AI Coach"
      >
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-[var(--acc)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="text-[var(--acc)]" size={32} />
          </div>
          <h3 className="text-xl font-bold text-[var(--txt)] mb-2">Coming Soon</h3>
          <p className="text-[var(--txt-muted)] mb-6">
            The AI Coach feature is in development. You'll soon be able to ask questions about your workouts, get exercise swaps, and receive personalized coaching advice.
          </p>
          <Button onClick={() => setShowAIChatModal(false)}>Got it</Button>
        </div>
      </Modal>

      <Modal
        isOpen={showRegenerateModal}
        onClose={() => setShowRegenerateModal(false)}
        title="Generate Next Week"
      >
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-[var(--acc)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="text-[var(--acc)]" size={32} />
          </div>
          <h3 className="text-xl font-bold text-[var(--txt)] mb-2">Week 2 Preview</h3>
          <p className="text-[var(--txt-muted)] mb-4">
            Week 2 will include progressive overload adjustments:
          </p>
          <div className="text-left max-w-md mx-auto mb-6 space-y-2">
            <div className="flex items-center gap-2 text-sm text-[var(--txt)]">
              <Check size={16} className="text-green-500" />
              <span>5-10% weight increases on main lifts</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--txt)]">
              <Check size={16} className="text-green-500" />
              <span>Exercise variations to prevent plateaus</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--txt)]">
              <Check size={16} className="text-green-500" />
              <span>Volume adjustments based on your progress</span>
            </div>
          </div>
          <p className="text-sm text-[var(--txt-muted)] mb-6">
            This feature is coming soon! Your next week's plan will be automatically generated with progressive overload built in.
          </p>
          <Button onClick={() => setShowRegenerateModal(false)}>Got it</Button>
        </div>
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Workout Day"
      >
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-[var(--acc)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Edit3 className="text-[var(--acc)]" size={32} />
          </div>
          <h3 className="text-xl font-bold text-[var(--txt)] mb-2">Coming Soon</h3>
          <p className="text-[var(--txt-muted)] mb-6">
            Workout editing features are in development. You'll soon be able to swap exercises, adjust sets/reps, and customize your workout days.
          </p>
          <Button onClick={() => setShowEditModal(false)}>Got it</Button>
        </div>
      </Modal>
    </div>
  );
}
