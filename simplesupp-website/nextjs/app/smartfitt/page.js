'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Dumbbell, Users, Zap, ChevronRight, Crown, Sparkles } from 'lucide-react';
import OptimizedImage from '../components/OptimizedImage';
import { MUSCLE_GROUPS, getExercisesForMuscle } from '../data/exercises';

export default function SmartFitt() {
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [bodyType, setBodyType] = useState('male');
  const [goal, setGoal] = useState('hypertrophy');

  const exercises = selectedMuscle
    ? getExercisesForMuscle(selectedMuscle, ['barbell', 'dumbbells', 'bodyweight', 'bench', 'pull-up bar', 'cable machine'], goal)
    : [];

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Hero Header */}
      <div className="relative text-[var(--txt)] py-20 md:py-32 overflow-hidden min-h-[60vh]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <OptimizedImage
            src="/images/fit/fit-background.jpg"
            alt="Workout and gym background"
            width={1920}
            height={1080}
            className="w-full h-full"
            priority
            objectFit="cover"
            objectPosition="center 80%"
            fallbackText="Background"
          />
          {/* Dark overlay for text readability - rgba(0,0,0,0.5) equivalent */}
          <div className="absolute inset-0 bg-black/50"></div>
          {/* Additional gradient overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-[var(--acc)]/20 rounded-2xl blur-xl"></div>
              <div className="relative w-20 h-20 bg-[var(--charcoal-light)] rounded-2xl flex items-center justify-center shadow-premium-lg border border-[var(--border)] icon-aivra">
                <Dumbbell className="text-white" size={40} />
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 text-shadow-lg drop-shadow-2xl">
            Aviera Fit
          </h1>

          <p className="text-xl md:text-2xl text-white/95 mb-3 font-medium text-shadow drop-shadow-lg">
            Your AI-Powered Workout Advisor
          </p>

          <p className="text-lg text-white/90 mb-6 max-w-3xl mx-auto text-shadow drop-shadow-md">
            Click any muscle group to get 3 coach-approved exercises with sets, reps, and form cues tailored to your goal.
          </p>

          {/* Premium Upgrade Banner */}
          <div className="max-w-md mx-auto mb-8">
            <Link href="/pricing">
              <div className="glass-card p-4 border border-[var(--acc)]/30 hover:border-[var(--acc)]/50 transition cursor-pointer">
                <div className="flex items-center gap-3">
                  <Crown className="text-[var(--acc)]" size={24} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[var(--txt)]">Upgrade to Aviera Pro</p>
                    <p className="text-xs text-[var(--txt-muted)]">Get custom AI workout plans with progressive overload</p>
                  </div>
                  <Sparkles className="text-[var(--acc)]" size={20} />
                </div>
              </div>
            </Link>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <div className="flex items-center gap-2 px-4 py-2 glass rounded-full border border-white/20 backdrop-blur-sm">
              <Zap size={16} className="text-white" />
              <span className="text-white">Instant Recommendations</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 glass rounded-full border border-white/20 backdrop-blur-sm">
              <Users size={16} className="text-white" />
              <span className="text-white">Coach-Approved</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 glass rounded-full border border-white/20 backdrop-blur-sm">
              <Star size={16} className="text-white" />
              <span className="text-white">Goal-Specific</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-center">
          {/* Body Type Toggle */}
          <div className="flex gap-2 bg-[var(--bg-elev-1)] rounded-lg p-2 shadow-sm border border-[var(--border)]">
            <button
              onClick={() => setBodyType('male')}
              className={`px-4 py-2 rounded-md font-medium transition-all ${
                bodyType === 'male'
                  ? 'bg-[var(--acc)] text-white'
                  : 'text-[var(--txt-muted)] hover:bg-[var(--bg-elev-2)]'
              }`}
            >
              Male
            </button>
            <button
              onClick={() => setBodyType('female')}
              className={`px-4 py-2 rounded-md font-medium transition-all ${
                bodyType === 'female'
                  ? 'bg-[var(--acc)] text-white'
                  : 'text-[var(--txt-muted)] hover:bg-[var(--bg-elev-2)]'
              }`}
            >
              Female
            </button>
          </div>

          {/* Goal Selector */}
          <div className="flex gap-2 bg-[var(--bg-elev-1)] rounded-lg p-2 shadow-sm border border-[var(--border)]">
            <button
              onClick={() => setGoal('strength')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                goal === 'strength'
                  ? 'bg-[var(--acc)] text-white'
                  : 'text-[var(--txt-muted)] hover:bg-[var(--bg-elev-2)]'
              }`}
            >
              Strength (4-6 reps)
            </button>
            <button
              onClick={() => setGoal('hypertrophy')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                goal === 'hypertrophy'
                  ? 'bg-[var(--acc)] text-white'
                  : 'text-[var(--txt-muted)] hover:bg-[var(--bg-elev-2)]'
              }`}
            >
              Muscle Growth (8-12 reps)
            </button>
            <button
              onClick={() => setGoal('endurance')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                goal === 'endurance'
                  ? 'bg-[var(--acc)] text-white'
                  : 'text-[var(--txt-muted)] hover:bg-[var(--bg-elev-2)]'
              }`}
            >
              Endurance (15+ reps)
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Body Diagram - Simplified Grid Version */}
          <div className="glass-card p-8">
            <h3 className="text-xl font-bold text-[var(--txt)] mb-4 text-center">
              Select a Muscle Group
            </h3>
            <p className="text-sm text-[var(--txt-muted)] mb-6 text-center">
              Click any muscle to get 3 targeted exercises
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(MUSCLE_GROUPS).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setSelectedMuscle(value)}
                  className={`p-4 rounded-xl font-semibold text-sm transition-all ${
                    selectedMuscle === value
                      ? 'bg-[var(--acc)] text-white shadow-accent transform scale-105'
                      : 'bg-[var(--bg-elev-1)] text-[var(--txt)] hover:bg-[var(--bg-elev-2)] border border-[var(--border)]'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>

            {selectedMuscle && (
              <div className="mt-6 p-4 bg-[var(--acc)]/10 rounded-lg border border-[var(--acc)]/20">
                <p className="text-sm text-[var(--txt)] text-center">
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
                  className="glass-card p-12 text-center"
                >
                  <Dumbbell className="mx-auto mb-4 text-[var(--txt-muted)]" size={64} />
                  <h3 className="text-xl font-bold text-[var(--txt)] mb-2">
                    Select a Muscle Group
                  </h3>
                  <p className="text-[var(--txt-muted)]">
                    Click any muscle on the left to get instant exercise recommendations with sets, reps, and coaching cues.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Cross-sell to SmartStack */}
        {exercises.length > 0 && (
              <div className="mt-12 bg-[var(--acc)]/10 rounded-2xl p-8 border border-[var(--acc)]/20">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-[var(--txt)] mb-2">
                      Pair with Aviera Stack
                    </h3>
                    <p className="text-[var(--txt-muted)]">
                      Get personalized supplement recommendations to support your training. Recovery, performance, and muscle growth supplements tailored to your goals.
                    </p>
                  </div>
                  <Link
                    href="/smartstack-ai"
                    className="px-6 py-3 bg-[var(--acc)] text-white rounded-lg font-semibold hover:shadow-accent hover:bg-blue-600 transition-all hover:-translate-y-0.5 flex items-center gap-2 whitespace-nowrap"
                  >
                    Build Your Stack <ChevronRight size={20} />
                  </Link>
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
      className="glass-card overflow-hidden hover:shadow-premium-lg transition-all"
    >
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="text-lg font-bold text-[var(--txt)] mb-1">
              {exercise.name}
            </h4>
            <div className="flex flex-wrap gap-2">
              {exercise.isTopPick && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--acc)] text-white text-xs font-semibold rounded-full">
                  <Star size={12} fill="currentColor" /> Top Pick
                </span>
              )}
              <span className="px-2 py-1 bg-[var(--bg-elev-1)] text-[var(--txt-muted)] text-xs font-medium rounded-full">
                {exercise.setsReps}
              </span>
              <span className="px-2 py-1 bg-[var(--bg-elev-1)] text-[var(--txt-muted)] text-xs font-medium rounded-full">
                Effectiveness: {exercise.effectiveness}/10
              </span>
            </div>
          </div>
        </div>

        {/* Equipment Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {exercise.equipment.map((eq, i) => (
            <span key={i} className="px-2 py-1 bg-[var(--acc)]/20 text-[var(--acc)] text-xs rounded-full">
              {eq}
            </span>
          ))}
        </div>

        {/* Quick Cue Preview */}
        <p className="text-sm text-[var(--txt-muted)] mb-3">
          <strong>Key Cue:</strong> {exercise.cues[0]}
        </p>

        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[var(--acc)] hover:text-blue-400 font-medium text-sm flex items-center gap-1"
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
            className="border-t border-[var(--border)] bg-[var(--bg-elev-1)] px-6 py-4"
          >
            <div className="space-y-4">
              {/* All Form Cues */}
              <div>
                <h5 className="text-sm font-bold text-[var(--txt)] mb-2">Coaching Cues:</h5>
                <ul className="space-y-1">
                  {exercise.cues.map((cue, i) => (
                    <li key={i} className="text-sm text-[var(--txt-muted)] flex items-start">
                      <span className="text-[var(--acc)] mr-2">•</span>
                      {cue}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Progression */}
              <div>
                <h5 className="text-sm font-bold text-[var(--txt)] mb-2">Progression Tips:</h5>
                <p className="text-sm text-[var(--txt-muted)]">{exercise.progression}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

