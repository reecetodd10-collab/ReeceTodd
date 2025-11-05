import React, { useState } from 'react';
import { 
  Dumbbell, 
  Download, 
  MessageCircle, 
  RefreshCw,
  Check,
  ChevronDown,
  ChevronUp,
  Edit,
  Plus,
  X
} from 'lucide-react';
import { sampleWorkoutWeek } from '../../lib/placeholder-data';
import GlassCard from '../shared/GlassCard';
import Button from '../shared/Button';
import AIChat from './AIChat';

export default function WorkoutPlanner() {
  const [workoutWeek, setWorkoutWeek] = useState(sampleWorkoutWeek);
  const [expandedDay, setExpandedDay] = useState(null);
  const [showAIChat, setShowAIChat] = useState(false);

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

  const handleDownloadPDF = () => {
    // TODO: Generate and download PDF
    alert('PDF download functionality coming soon!');
  };

  const handleRegenerate = () => {
    // TODO: AI regeneration
    alert('Workout regeneration coming soon!');
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Workout Planner</h1>
            <p className="text-secondary">Your personalized weekly workout routine.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleDownloadPDF}>
              <Download size={20} />
              Download PDF
            </Button>
            <Button variant="primary" onClick={() => setShowAIChat(true)}>
              <MessageCircle size={20} />
              Ask AI
            </Button>
          </div>
        </div>

        {/* Week Header */}
        <GlassCard className="p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">Week of {workoutWeek.weekOf}</h2>
              <div className="flex items-center gap-2 text-secondary">
                <Dumbbell size={18} />
                <span>Goal: {workoutWeek.goal}</span>
              </div>
            </div>
            <Button variant="secondary" onClick={handleRegenerate}>
              <RefreshCw size={20} />
              Generate Next Week
            </Button>
          </div>
        </GlassCard>

        {/* Weekly Workouts */}
        <div className="space-y-4">
          {workoutWeek.days.map((day, dayIndex) => (
            <GlassCard key={dayIndex} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">{day.day}</h3>
                    {day.type && (
                      <span className="px-3 py-1 bg-[var(--accent-blue)]/20 text-[var(--accent-blue)] rounded-full text-sm">
                        {day.type}
                      </span>
                    )}
                  </div>
                  {day.exercises.length === 0 && (
                    <p className="text-secondary">Rest day - recovery is important!</p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {day.exercises.length > 0 && (
                    <button
                      onClick={() => toggleWorkoutComplete(dayIndex)}
                      className={`
                        w-8 h-8 rounded border-2 flex items-center justify-center transition
                        ${day.completed
                          ? 'bg-[var(--accent-blue)] border-[var(--accent-blue)]'
                          : 'border-[var(--glass-border)] hover:border-[var(--accent-blue)]'
                        }
                      `}
                    >
                      {day.completed && <Check size={18} className="text-white" />}
                    </button>
                  )}
                  {day.exercises.length > 0 && (
                    <button
                      onClick={() => toggleDay(dayIndex)}
                      className="p-2 hover:bg-[var(--bg-elev-1)] rounded-lg"
                    >
                      {expandedDay === dayIndex ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  )}
                </div>
              </div>

              {/* Exercises */}
              {expandedDay === dayIndex && day.exercises.length > 0 && (
                <div className="space-y-4 mt-4 pt-4 border-t border-[var(--glass-border)]">
                  {day.exercises.map((exercise, exIndex) => (
                    <ExerciseCard key={exIndex} exercise={exercise} />
                  ))}
                  <button className="flex items-center gap-2 text-[var(--accent-blue)] hover:underline text-sm">
                    <Plus size={16} />
                    Add Exercise
                  </button>
                </div>
              )}

              {/* Notes */}
              {expandedDay === dayIndex && (
                <div className="mt-4 pt-4 border-t border-[var(--glass-border)]">
                  <textarea
                    placeholder="Add notes for this workout..."
                    className="w-full px-4 py-2 bg-[var(--bg-elev-1)] border border-[var(--glass-border)] rounded-lg text-sm resize-none"
                    rows={3}
                  />
                </div>
              )}
            </GlassCard>
          ))}
        </div>

        {/* Progressive Overload */}
        <GlassCard className="p-6 mt-6">
          <h3 className="text-xl font-bold mb-4">Progressive Overload Tracking</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[var(--bg-elev-1)] rounded-lg">
              <span className="text-secondary">Last Week Avg Weight</span>
              <span className="font-bold">180 lbs</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[var(--bg-elev-1)] rounded-lg">
              <span className="text-secondary">Suggested Increase</span>
              <span className="font-bold text-[var(--accent-blue)]">+5 lbs</span>
            </div>
            <div className="p-3 bg-[var(--bg-elev-1)] rounded-lg">
              <p className="text-sm text-secondary mb-2">Progress Graph (Coming Soon)</p>
              <div className="h-24 bg-[var(--bg-primary)] rounded flex items-center justify-center text-muted">
                Chart visualization
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* AI Chat */}
      <AIChat isOpen={showAIChat} onClose={() => setShowAIChat(false)} />
    </div>
  );
}

function ExerciseCard({ exercise }) {
  return (
    <div className="p-4 bg-[var(--bg-elev-1)] rounded-lg">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-bold mb-1">{exercise.name}</h4>
          <span className="text-xs text-muted bg-[var(--bg-primary)] px-2 py-1 rounded">
            {exercise.muscleGroup}
          </span>
        </div>
        <button className="p-1 hover:bg-[var(--bg-primary)] rounded">
          <Edit size={16} className="text-secondary" />
        </button>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
        <div>
          <span className="text-muted">Sets</span>
          <div className="font-bold">{exercise.sets}</div>
        </div>
        <div>
          <span className="text-muted">Reps</span>
          <div className="font-bold">{exercise.reps}</div>
        </div>
        <div>
          <span className="text-muted">Weight</span>
          <div className="font-bold">{exercise.weight}</div>
        </div>
      </div>
      <button className="mt-3 text-xs text-[var(--accent-blue)] hover:underline">
        Swap Exercise
      </button>
    </div>
  );
}
