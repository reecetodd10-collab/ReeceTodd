import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Smile, Meh, Frown } from 'lucide-react';
import Modal from '../shared/Modal';
import Button from '../shared/Button';

export default function WorkoutFeedbackModal({ isOpen, onClose, workoutId, workoutName, onFeedbackSubmitted }) {
  const [difficulty, setDifficulty] = useState(null);
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!difficulty) return;

    try {
      const existing = JSON.parse(localStorage.getItem('aviera_gamification') || '{}');
      
      if (!existing.workoutFeedback) {
        existing.workoutFeedback = [];
      }

      const feedback = {
        workoutId: workoutId,
        workoutName: workoutName,
        date: new Date().toISOString(),
        difficulty: difficulty,
        notes: notes.trim() || null,
        nextWeekAdjustment: null
      };

      existing.workoutFeedback.push(feedback);
      localStorage.setItem('aviera_gamification', JSON.stringify(existing));

      // Reset form
      setDifficulty(null);
      setNotes('');
      
      onFeedbackSubmitted?.(feedback);
      onClose();
    } catch (e) {
      console.error('Failed to save feedback:', e);
      alert('Failed to save feedback. Please try again.');
    }
  };

  const difficultyOptions = [
    { value: 'too_hard', label: 'Too Hard', emoji: '😫', color: 'bg-red-500/20 border-red-500/30 text-red-400' },
    { value: 'just_right', label: 'Just Right', emoji: '😐', color: 'bg-green-500/20 border-green-500/30 text-green-400' },
    { value: 'too_easy', label: 'Too Easy', emoji: '😊', color: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400' }
  ];

  const getFeedbackMessage = () => {
    if (difficulty === 'too_hard') {
      return "We'll adjust next week to make it more manageable 💪";
    } else if (difficulty === 'just_right') {
      return "Perfect! Keep it up 💪";
    } else if (difficulty === 'too_easy') {
      return "Ready for more? We'll increase the challenge 🚀";
    }
    return null;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="How was today's workout?"
      size="md"
    >
      <div className="space-y-6">
        {/* Difficulty Selection */}
        <div>
          <p className="text-sm text-[var(--txt-muted)] mb-4 text-center">
            {workoutName}
          </p>
          <div className="grid grid-cols-3 gap-4">
            {difficultyOptions.map((option) => (
              <motion.button
                key={option.value}
                onClick={() => setDifficulty(option.value)}
                className={`p-6 rounded-lg border-2 transition-all ${
                  difficulty === option.value
                    ? `${option.color} border-current scale-105`
                    : 'bg-[var(--bg-elev-1)] border-[var(--glass-border)] text-[var(--txt)] hover:border-[var(--acc)]/30'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-4xl mb-2">{option.emoji}</div>
                <div className="text-sm font-normal">{option.label}</div>
              </motion.button>
            ))}
          </div>

          {difficulty && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-[var(--bg-elev-1)] rounded-lg text-center"
            >
              <p className="text-sm font-normal text-[var(--txt)]">
                {getFeedbackMessage()}
              </p>
            </motion.div>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-normal text-[var(--txt)] mb-2">
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How did you feel? Any concerns or achievements?"
            className="w-full min-h-[80px] p-3 bg-[var(--bg-elev-1)] border border-[var(--glass-border)] rounded-lg text-[var(--txt)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--acc)] focus:border-[var(--acc)]"
            maxLength={150}
          />
          <p className="text-xs text-[var(--txt-muted)] mt-1">
            {notes.length}/150 characters
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Skip
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            className="flex-1"
            disabled={!difficulty}
          >
            Submit Feedback
          </Button>
        </div>
      </div>
    </Modal>
  );
}

