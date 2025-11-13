'use client';

import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Modal from '../shared/Modal';
import Button from '../shared/Button';

export default function ReassessmentForm({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    energy: 7,
    sleep: 7,
    stress: 5,
    goal: 'Muscle Building',
    weight: '',
    trainingDays: 4,
    equipment: ['Dumbbells', 'Bench'],
    dietType: 'Standard',
  });

  const totalSteps = 5;

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    // TODO: Submit to backend
    alert('Reassessment submitted! Your plan will be updated.');
    onClose();
    setStep(1);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Goals & Progress">
      <div>
        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-[var(--txt-muted)] mb-2">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-[var(--bg-elev-1)] rounded-full h-2">
            <div
              className="bg-[var(--acc)] h-2 rounded-full transition-all"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {step === 1 && (
            <Step1Progress data={formData} updateField={updateField} />
          )}
          {step === 2 && (
            <Step2Goal data={formData} updateField={updateField} />
          )}
          {step === 3 && (
            <Step3Biometrics data={formData} updateField={updateField} />
          )}
          {step === 4 && (
            <Step4Lifestyle data={formData} updateField={updateField} />
          )}
          {step === 5 && (
            <Step5Nutrition data={formData} updateField={updateField} />
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6 pt-6 border-t border-[var(--border)]">
          <Button variant="secondary" onClick={handleBack} disabled={step === 1}>
            <ChevronLeft size={20} />
            Back
          </Button>
          <Button variant="primary" onClick={handleNext}>
            {step === totalSteps ? 'Complete' : 'Next'}
            {step < totalSteps && <ChevronRight size={20} />}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function Step1Progress({ data, updateField }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 text-[var(--txt)]">Progress Check-in</h2>
      <p className="text-[var(--txt-muted)] mb-6">How's it going?</p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-[var(--txt)]">Energy Levels (1-10)</label>
          <input
            type="range"
            min="1"
            max="10"
            value={data.energy}
            onChange={(e) => updateField('energy', parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-[var(--txt-muted)] mt-1">
            <span>Low</span>
            <span className="font-bold text-[var(--acc)]">{data.energy}</span>
            <span>High</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-[var(--txt)]">Sleep Quality (1-10)</label>
          <input
            type="range"
            min="1"
            max="10"
            value={data.sleep}
            onChange={(e) => updateField('sleep', parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-[var(--txt-muted)] mt-1">
            <span>Poor</span>
            <span className="font-bold text-[var(--acc)]">{data.sleep}</span>
            <span>Excellent</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-[var(--txt)]">Stress Levels (1-10)</label>
          <input
            type="range"
            min="1"
            max="10"
            value={data.stress}
            onChange={(e) => updateField('stress', parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-[var(--txt-muted)] mt-1">
            <span>Low</span>
            <span className="font-bold text-[var(--acc)]">{data.stress}</span>
            <span>High</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step2Goal({ data, updateField }) {
  const goals = ['Muscle Building', 'Fat Loss', 'Recomposition', 'Endurance', 'Maintenance'];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 text-[var(--txt)]">Goal Review</h2>
      <p className="text-[var(--txt-muted)] mb-6">Still working toward the same goal?</p>

      <div className="space-y-3">
        {goals.map(goal => (
          <button
            key={goal}
            onClick={() => updateField('goal', goal)}
            className={`
              w-full p-4 rounded-lg border-2 text-left transition
              ${data.goal === goal
                ? 'border-[var(--acc)] bg-[var(--acc)]/20'
                : 'border-[var(--border)] hover:border-[var(--acc)]/50'
              }
            `}
          >
            {goal}
          </button>
        ))}
      </div>
    </div>
  );
}

function Step3Biometrics({ data, updateField }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 text-[var(--txt)]">Biometrics Update</h2>
      <p className="text-[var(--txt-muted)] mb-6">Update your current stats (optional)</p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-[var(--txt)]">Current Weight (lbs)</label>
          <input
            type="number"
            value={data.weight}
            onChange={(e) => updateField('weight', e.target.value)}
            placeholder="Enter weight"
            className="w-full px-4 py-2 bg-[var(--bg-elev-1)] border border-[var(--border)] rounded-lg text-[var(--txt)] focus:outline-none focus:ring-2 focus:ring-[var(--acc)]"
          />
        </div>
      </div>
    </div>
  );
}

function Step4Lifestyle({ data, updateField }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 text-[var(--txt)]">Lifestyle Changes</h2>
      <p className="text-[var(--txt-muted)] mb-6">Any updates to your routine?</p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-[var(--txt)]">Training Days Per Week</label>
          <input
            type="range"
            min="1"
            max="7"
            value={data.trainingDays}
            onChange={(e) => updateField('trainingDays', parseInt(e.target.value))}
            className="w-full"
          />
          <div className="text-center text-sm font-bold mt-1 text-[var(--txt)]">{data.trainingDays} days</div>
        </div>
      </div>
    </div>
  );
}

function Step5Nutrition({ data, updateField }) {
  const dietTypes = ['Standard', 'Keto', 'Vegan', 'Vegetarian', 'Paleo'];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 text-[var(--txt)]">Nutrition Preferences</h2>
      <p className="text-[var(--txt-muted)] mb-6">Update your dietary preferences</p>

      <div className="space-y-3">
        {dietTypes.map(type => (
          <button
            key={type}
            onClick={() => updateField('dietType', type)}
            className={`
              w-full p-4 rounded-lg border-2 text-left transition
              ${data.dietType === type
                ? 'border-[var(--acc)] bg-[var(--acc)]/20'
                : 'border-[var(--border)] hover:border-[var(--acc)]/50'
              }
            `}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
}

