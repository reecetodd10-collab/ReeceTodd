import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Dumbbell, Users, Zap, ChevronRight } from 'lucide-react';
import { MUSCLE_GROUPS, getExercisesForMuscle } from '../data/exercises';

export default function SmartFitt() {
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [bodyType, setBodyType] = useState('male');
  const [goal, setGoal] = useState('hypertrophy');

  const exercises = selectedMuscle
    ? getExercisesForMuscle(selectedMuscle, ['barbell', 'dumbbells', 'bodyweight', 'bench', 'pull-up bar', 'cable machine'], goal)
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-primary via-accent to-violet text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
                <Dumbbell className="text-white" size={40} />
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 font-display text-white">
            SmartFitt
          </h1>

          <p className="text-xl md:text-2xl text-slate-100 mb-3 font-medium">
            Your AI-Powered Workout Advisor
          </p>

          <p className="text-lg text-slate-200 mb-6 max-w-3xl mx-auto">
            Click any muscle group to get 3 coach-approved exercises with sets, reps, and form cues tailored to your goal.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <Zap size={16} />
              <span>Instant Recommendations</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <Users size={16} />
              <span>Coach-Approved</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <Star size={16} />
              <span>Goal-Specific</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-center">
          {/* Body Type Toggle */}
          <div className="flex gap-2 bg-white rounded-lg p-2 shadow-sm border border-gray-200">
            <button
              onClick={() => setBodyType('male')}
              className={`px-4 py-2 rounded-md font-medium transition-all ${
                bodyType === 'male'
                  ? 'bg-gradient-to-r from-primary to-accent text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Male
            </button>
            <button
              onClick={() => setBodyType('female')}
              className={`px-4 py-2 rounded-md font-medium transition-all ${
                bodyType === 'female'
                  ? 'bg-gradient-to-r from-primary to-accent text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Female
            </button>
          </div>

          {/* Goal Selector */}
          <div className="flex gap-2 bg-white rounded-lg p-2 shadow-sm border border-gray-200">
            <button
              onClick={() => setGoal('strength')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                goal === 'strength'
                  ? 'bg-gradient-to-r from-primary to-accent text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Strength (4-6 reps)
            </button>
            <button
              onClick={() => setGoal('hypertrophy')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                goal === 'hypertrophy'
                  ? 'bg-gradient-to-r from-primary to-accent text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Muscle Growth (8-12 reps)
            </button>
            <button
              onClick={() => setGoal('endurance')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                goal === 'endurance'
                  ? 'bg-gradient-to-r from-primary to-accent text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Endurance (15+ reps)
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Body Diagram - Simplified Grid Version */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
              Select a Muscle Group
            </h3>
            <p className="text-sm text-gray-600 mb-6 text-center">
              Click any muscle to get 3 targeted exercises
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(MUSCLE_GROUPS).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setSelectedMuscle(value)}
                  className={`p-4 rounded-xl font-semibold text-sm transition-all ${
                    selectedMuscle === value
                      ? 'bg-gradient-to-r from-primary via-accent to-violet text-white shadow-lg transform scale-105'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>

            {selectedMuscle && (
              <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 via-accent/10 to-violet/10 rounded-lg border border-primary/20">
                <p className="text-sm text-gray-700 text-center">
                  <strong>Selected:</strong> {selectedMuscle} — Showing {exercises.length} exercises
                </p>
              </div>
            )}
          </div>

          {/* Exercise Display */}
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {exercises.length > 0 ? (
                <motion.div
                  key={selectedMuscle}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  {exercises.map((exercise, idx) => (
                    <ExerciseCard key={idx} exercise={exercise} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-2xl p-12 shadow-sm border border-gray-200 text-center"
                >
                  <Dumbbell className="mx-auto mb-4 text-gray-400" size={64} />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Select a Muscle Group
                  </h3>
                  <p className="text-gray-600">
                    Click any muscle on the left to get instant exercise recommendations with sets, reps, and coaching cues.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Cross-sell to SmartStack */}
        {exercises.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-primary/10 via-accent/10 to-violet/10 rounded-2xl p-8 border border-primary/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Pair with SmartStack AI
                </h3>
                <p className="text-gray-700">
                  Get personalized supplement recommendations to support your training. Recovery, performance, and muscle growth supplements tailored to your goals.
                </p>
              </div>
              <a
                href="/smartstack-ai"
                className="px-6 py-3 bg-gradient-to-r from-primary via-accent to-violet text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2 whitespace-nowrap"
              >
                Build Your Stack <ChevronRight size={20} />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Exercise Card Component
function ExerciseCard({ exercise }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      layout
      className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
    >
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="text-lg font-bold text-gray-900 mb-1">
              {exercise.name}
            </h4>
            <div className="flex flex-wrap gap-2">
              {exercise.isTopPick && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-primary to-accent text-white text-xs font-semibold rounded-full">
                  <Star size={12} fill="currentColor" /> Top Pick
                </span>
              )}
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                {exercise.setsReps}
              </span>
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                Effectiveness: {exercise.effectiveness}/10
              </span>
            </div>
          </div>
        </div>

        {/* Equipment Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {exercise.equipment.map((eq, i) => (
            <span key={i} className="px-2 py-1 bg-blue-50 text-primary text-xs rounded-full">
              {eq}
            </span>
          ))}
        </div>

        {/* Quick Cue Preview */}
        <p className="text-sm text-gray-600 mb-3">
          <strong>Key Cue:</strong> {exercise.cues[0]}
        </p>

        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-accent hover:text-primary font-medium text-sm flex items-center gap-1"
        >
          {isExpanded ? 'Hide' : 'Show'} Full Details
          <ChevronRight size={16} className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
        </button>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-100 bg-gray-50 px-6 py-4"
          >
            <div className="space-y-4">
              {/* All Form Cues */}
              <div>
                <h5 className="text-sm font-bold text-gray-900 mb-2">Coaching Cues:</h5>
                <ul className="space-y-1">
                  {exercise.cues.map((cue, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start">
                      <span className="text-accent mr-2">•</span>
                      {cue}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Progression */}
              <div>
                <h5 className="text-sm font-bold text-gray-900 mb-2">Progression Tips:</h5>
                <p className="text-sm text-gray-700">{exercise.progression}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
