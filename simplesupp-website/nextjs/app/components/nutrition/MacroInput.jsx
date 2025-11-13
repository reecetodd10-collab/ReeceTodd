'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save } from 'lucide-react';
import GlassCard from '../shared/GlassCard';
import Button from '../shared/Button';
import Modal from '../shared/Modal';
import { calculateCalories, getDefaultMacroGoals } from '../../lib/nutrition';

export default function MacroInput({ goals, today, onUpdate, onUpdateGoals }) {
  const [protein, setProtein] = useState(today?.protein || 0);
  const [carbs, setCarbs] = useState(today?.carbs || 0);
  const [fats, setFats] = useState(today?.fats || 0);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [goalType, setGoalType] = useState(goals?.goalType || 'maintenance');
  const [customCalories, setCustomCalories] = useState(goals?.calories || 2100);

  // Sync state when today prop changes
  useEffect(() => {
    setProtein(today?.protein || 0);
    setCarbs(today?.carbs || 0);
    setFats(today?.fats || 0);
  }, [today]);

  const handleSave = () => {
    const calories = calculateCalories(protein, carbs, fats);
    onUpdate({ protein, carbs, fats, calories });
  };

  const handleUpdateGoals = () => {
    const newGoals = getDefaultMacroGoals(goalType, customCalories);
    onUpdateGoals(newGoals);
    setShowGoalsModal(false);
  };

  const calories = calculateCalories(protein, carbs, fats);

  return (
    <>
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-[var(--txt)]">Daily Macros</h3>
          <button
            onClick={() => setShowGoalsModal(true)}
            className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-elev-1)] hover:bg-[var(--bg-elev-2)] border border-[var(--border)] rounded-lg text-sm text-[var(--txt-muted)] hover:text-[var(--txt)] transition"
          >
            <Settings size={16} />
            Adjust Goals
          </button>
        </div>

        <div className="space-y-4">
          {/* Protein */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-[var(--txt)] flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                Protein
              </label>
              <span className="text-sm text-[var(--txt-muted)]">
                {protein}g / {goals?.protein || 150}g
              </span>
            </div>
            <input
              type="number"
              value={protein}
              onChange={(e) => setProtein(parseInt(e.target.value) || 0)}
              min="0"
              className="w-full px-4 py-2 bg-[var(--bg-elev-1)] border border-[var(--border)] rounded-lg text-[var(--txt)] focus:outline-none focus:ring-2 focus:ring-red-500/50"
              placeholder="0"
            />
          </div>

          {/* Carbs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-[var(--txt)] flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                Carbs
              </label>
              <span className="text-sm text-[var(--txt-muted)]">
                {carbs}g / {goals?.carbs || 250}g
              </span>
            </div>
            <input
              type="number"
              value={carbs}
              onChange={(e) => setCarbs(parseInt(e.target.value) || 0)}
              min="0"
              className="w-full px-4 py-2 bg-[var(--bg-elev-1)] border border-[var(--border)] rounded-lg text-[var(--txt)] focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
              placeholder="0"
            />
          </div>

          {/* Fats */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-[var(--txt)] flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                Fats
              </label>
              <span className="text-sm text-[var(--txt-muted)]">
                {fats}g / {goals?.fats || 70}g
              </span>
            </div>
            <input
              type="number"
              value={fats}
              onChange={(e) => setFats(parseInt(e.target.value) || 0)}
              min="0"
              className="w-full px-4 py-2 bg-[var(--bg-elev-1)] border border-[var(--border)] rounded-lg text-[var(--txt)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="0"
            />
          </div>

          {/* Calories Display */}
          <div className="pt-4 border-t border-[var(--border)]">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--txt)]">Total Calories</span>
              <span className="text-lg font-bold text-[var(--txt)]">
                {calories} / {goals?.calories || 2100} cal
              </span>
            </div>
          </div>

          {/* Update Button */}
          <Button onClick={handleSave} className="w-full" variant="primary">
            <Save size={16} />
            Update Macros
          </Button>
        </div>
      </GlassCard>

      {/* Goals Modal */}
      <Modal isOpen={showGoalsModal} onClose={() => setShowGoalsModal(false)} title="Adjust Macro Goals">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--txt)] mb-2">
              Goal Type
            </label>
            <select
              value={goalType}
              onChange={(e) => {
                setGoalType(e.target.value);
                const newGoals = getDefaultMacroGoals(e.target.value, customCalories);
                setCustomCalories(newGoals.calories);
              }}
              className="w-full px-4 py-2 bg-[var(--bg-elev-1)] border border-[var(--border)] rounded-lg text-[var(--txt)] focus:outline-none focus:ring-2 focus:ring-[var(--acc)]"
            >
              <option value="muscle_building">Muscle Building</option>
              <option value="fat_loss">Fat Loss</option>
              <option value="maintenance">Maintenance</option>
              <option value="recomp">Body Recomposition</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--txt)] mb-2">
              Daily Calories
            </label>
            <input
              type="number"
              value={customCalories}
              onChange={(e) => setCustomCalories(parseInt(e.target.value) || 2100)}
              min="1200"
              max="4000"
              className="w-full px-4 py-2 bg-[var(--bg-elev-1)] border border-[var(--border)] rounded-lg text-[var(--txt)] focus:outline-none focus:ring-2 focus:ring-[var(--acc)]"
            />
          </div>

          {/* Preview */}
          <div className="p-4 bg-[var(--bg-elev-1)] rounded-lg">
            <p className="text-sm font-semibold text-[var(--txt)] mb-2">New Goals:</p>
            {(() => {
              const preview = getDefaultMacroGoals(goalType, customCalories);
              return (
                <div className="space-y-1 text-sm text-[var(--txt-muted)]">
                  <div>Protein: {preview.protein}g</div>
                  <div>Carbs: {preview.carbs}g</div>
                  <div>Fats: {preview.fats}g</div>
                  <div>Calories: {preview.calories} cal</div>
                </div>
              );
            })()}
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowGoalsModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleUpdateGoals} className="flex-1">
              Save Goals
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

