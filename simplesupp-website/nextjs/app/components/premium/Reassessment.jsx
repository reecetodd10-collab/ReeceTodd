'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Target, Check, SkipForward } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '../shared/Modal';
import Button from '../shared/Button';

export default function Reassessment({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Progress Check-in
    mood: '',
    currentWeight: '',
    weightUnit: 'lbs',
    energyLevel: 5,
    sleepQuality: 5,
    stressLevel: 5,
    
    // Step 2: Goal Review
    keepCurrentGoal: '',
    newGoal: '',
    intensity: '',
    
    // Step 3: Biometrics
    height: '',
    heightUnit: 'ft',
    bodyFat: 15,
    measurements: {
      chest: '',
      waist: '',
      hips: '',
      arms: '',
      thighs: '',
    },
    
    // Step 4: Lifestyle
    trainingDays: '',
    equipment: [],
    workoutTime: '',
    injuries: '',
    
    // Step 5: Preferences
    dietType: '',
    supplementPreferences: [],
    allergies: [],
  });

  const [showSuccess, setShowSuccess] = useState(false);

  // Load saved draft on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('aviera_reassessment_draft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(prev => ({ ...parsed, ...prev }));
      } catch (e) {
        console.error('Failed to load draft:', e);
      }
    }
  }, []);

  // Save draft on change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isOpen && currentStep > 1) {
      localStorage.setItem('aviera_reassessment_draft', JSON.stringify(formData));
    }
  }, [formData, currentStep, isOpen]);

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
      } else {
        handleComplete();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    if (typeof window === 'undefined') return;
    // Save final data
    const finalData = {
      ...formData,
      timestamp: new Date().toISOString(),
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    localStorage.setItem('aviera_reassessment', JSON.stringify(finalData));
    localStorage.removeItem('aviera_reassessment_draft');
    setShowSuccess(true);
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.mood !== '';
      case 2:
        if (formData.keepCurrentGoal === 'yes') {
          return formData.intensity !== '';
        }
        return formData.newGoal !== '' && formData.intensity !== '';
      case 3:
        return true; // All optional
      case 4:
        return formData.trainingDays !== '' && formData.workoutTime !== '';
      case 5:
        return formData.dietType !== '';
      default:
        return true;
    }
  };

  const handleClose = () => {
    if (showSuccess) {
      setShowSuccess(false);
      setCurrentStep(1);
      setFormData({
        mood: '',
        currentWeight: '',
        weightUnit: 'lbs',
        energyLevel: 5,
        sleepQuality: 5,
        stressLevel: 5,
        keepCurrentGoal: '',
        newGoal: '',
        intensity: '',
        height: '',
        heightUnit: 'ft',
        bodyFat: 15,
        measurements: { chest: '', waist: '', hips: '', arms: '', thighs: '' },
        trainingDays: '',
        equipment: [],
        workoutTime: '',
        injuries: '',
        dietType: '',
        supplementPreferences: [],
        allergies: [],
      });
    }
    onClose();
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value },
    }));
  };

  const toggleArrayField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value],
    }));
  };

  const goals = [
    'Muscle Building',
    'Fat Loss / Cut',
    'Body Recomposition',
    'Endurance / Athletic Performance',
    'General Health / Maintenance',
  ];

  const equipmentOptions = [
    'Full Gym',
    'Dumbbells',
    'Barbell',
    'Resistance Bands',
    'Bodyweight Only',
    'Home Gym',
  ];

  const supplementCategories = [
    'Performance (creatine, pre-workout)',
    'Recovery (protein, BCAAs)',
    'Health (vitamins, omega-3)',
    'Sleep & Stress (magnesium, ashwagandha)',
    'No preferences / Open to suggestions',
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Progress formData={formData} updateField={updateField} />;
      case 2:
        return <Step2Goal formData={formData} updateField={updateField} goals={goals} />;
      case 3:
        return <Step3Biometrics formData={formData} updateField={updateField} updateNestedField={updateNestedField} />;
      case 4:
        return <Step4Lifestyle formData={formData} updateField={updateField} toggleArrayField={toggleArrayField} equipmentOptions={equipmentOptions} />;
      case 5:
        return <Step5Preferences formData={formData} updateField={updateField} toggleArrayField={toggleArrayField} supplementCategories={supplementCategories} />;
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={null}>
      <div className="w-full max-w-2xl mx-auto">
        {/* Close Button */}
        {!showSuccess && (
          <div className="flex justify-end mb-4">
            <button
              onClick={handleClose}
              className="p-2 hover:bg-[var(--bg-elev-1)] rounded-lg transition"
              aria-label="Close"
            >
              <X size={20} className="text-[var(--txt-muted)]" />
            </button>
          </div>
        )}
        
        {showSuccess ? (
          <SuccessScreen onClose={handleClose} />
        ) : (
          <>
            {/* Progress Indicator */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[var(--txt-muted)]">
                  Step {currentStep} of 5
                </span>
                <span className="text-sm text-[var(--txt-muted)]">
                  {Math.round((currentStep / 5) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-[var(--bg-elev-2)] rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStep / 5) * 100}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-gradient-to-r from-[var(--acc)] to-blue-500 rounded-full"
                />
              </div>
            </div>

            {/* Step Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--border)]">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  currentStep === 1
                    ? 'opacity-50 cursor-not-allowed'
                    : 'text-[var(--txt-muted)] hover:text-[var(--txt)] hover:bg-[var(--bg-elev-1)]'
                }`}
              >
                <ChevronLeft size={18} />
                Back
              </button>

              <button
                onClick={handleNext}
                disabled={!validateStep(currentStep)}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition ${
                  validateStep(currentStep)
                    ? 'bg-[var(--acc)] text-white hover:bg-blue-600'
                    : 'bg-[var(--bg-elev-2)] text-[var(--txt-muted)] cursor-not-allowed'
                }`}
              >
                {currentStep === 5 ? 'Complete' : 'Next'}
                {currentStep < 5 && <ChevronRight size={18} />}
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

// Step 1: Progress Check-in
function Step1Progress({ formData, updateField }) {
  const moods = [
    { emoji: '😫', value: 'struggling' },
    { emoji: '😕', value: 'below_average' },
    { emoji: '😐', value: 'neutral' },
    { emoji: '🙂', value: 'good' },
    { emoji: '😁', value: 'excellent' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[var(--txt)] mb-2">How's it going?</h2>
        <p className="text-[var(--txt-muted)]">Let's check in on your progress</p>
      </div>

      {/* Mood Selector */}
      <div>
        <label className="block text-sm font-medium text-[var(--txt)] mb-4 text-center">
          How are you feeling overall? <span className="text-red-400">*</span>
        </label>
        <div className="flex justify-center gap-4">
          {moods.map((mood) => (
            <button
              key={mood.value}
              onClick={() => updateField('mood', mood.value)}
              className={`text-4xl p-3 rounded-xl transition-all ${
                formData.mood === mood.value
                  ? 'bg-[var(--acc)]/20 scale-110 ring-2 ring-[var(--acc)]'
                  : 'hover:bg-[var(--bg-elev-1)]'
              }`}
            >
              {mood.emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Weight Input */}
      <div>
        <label className="block text-sm font-medium text-[var(--txt)] mb-2">
          Current Weight (optional)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={formData.currentWeight}
            onChange={(e) => updateField('currentWeight', e.target.value)}
            placeholder="Enter weight"
            className="flex-1 px-4 py-2 bg-[var(--bg-elev-1)] border border-[var(--border)] rounded-lg text-[var(--txt)] focus:outline-none focus:ring-2 focus:ring-[var(--acc)]"
          />
          <select
            value={formData.weightUnit}
            onChange={(e) => updateField('weightUnit', e.target.value)}
            className="px-4 py-2 bg-[var(--bg-elev-1)] border border-[var(--border)] rounded-lg text-[var(--txt)] focus:outline-none"
          >
            <option value="lbs">lbs</option>
            <option value="kg">kg</option>
          </select>
        </div>
      </div>

      {/* Sliders */}
      <SliderInput
        label="Energy Levels"
        value={formData.energyLevel}
        onChange={(val) => updateField('energyLevel', val)}
        min={1}
        max={10}
        leftLabel="Low"
        rightLabel="High"
      />

      <SliderInput
        label="Sleep Quality"
        value={formData.sleepQuality}
        onChange={(val) => updateField('sleepQuality', val)}
        min={1}
        max={10}
        leftLabel="Poor"
        rightLabel="Excellent"
      />

      <SliderInput
        label="Stress Levels"
        value={formData.stressLevel}
        onChange={(val) => updateField('stressLevel', val)}
        min={1}
        max={10}
        leftLabel="Low"
        rightLabel="High"
      />
    </div>
  );
}

// Step 2: Goal Review
function Step2Goal({ formData, updateField, goals }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[var(--txt)] mb-2">Goal Review</h2>
        <p className="text-[var(--txt-muted)]">Update your fitness goals</p>
      </div>

      <div className="glass-card p-6 mb-6">
        <p className="text-sm text-[var(--txt-muted)] mb-2">Current Goal</p>
        <p className="text-lg font-semibold text-[var(--txt)]">Muscle Building</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--txt)] mb-4">
          Still on track with this goal? <span className="text-red-400">*</span>
        </label>
        <div className="space-y-3">
          <label className="flex items-center gap-3 p-4 bg-[var(--bg-elev-1)] rounded-lg cursor-pointer hover:bg-[var(--bg-elev-2)] transition">
            <input
              type="radio"
              name="keepGoal"
              value="yes"
              checked={formData.keepCurrentGoal === 'yes'}
              onChange={(e) => updateField('keepCurrentGoal', e.target.value)}
              className="w-4 h-4 text-[var(--acc)]"
            />
            <span className="text-[var(--txt)]">Yes, keep it</span>
          </label>
          <label className="flex items-center gap-3 p-4 bg-[var(--bg-elev-1)] rounded-lg cursor-pointer hover:bg-[var(--bg-elev-2)] transition">
            <input
              type="radio"
              name="keepGoal"
              value="no"
              checked={formData.keepCurrentGoal === 'no'}
              onChange={(e) => updateField('keepCurrentGoal', e.target.value)}
              className="w-4 h-4 text-[var(--acc)]"
            />
            <span className="text-[var(--txt)]">Change to:</span>
          </label>
        </div>

        {formData.keepCurrentGoal === 'no' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4"
          >
            <select
              value={formData.newGoal}
              onChange={(e) => updateField('newGoal', e.target.value)}
              className="w-full px-4 py-3 bg-[var(--bg-elev-1)] border border-[var(--border)] rounded-lg text-[var(--txt)] focus:outline-none focus:ring-2 focus:ring-[var(--acc)]"
            >
              <option value="">Select new goal...</option>
              {goals.map((goal) => (
                <option key={goal} value={goal}>
                  {goal}
                </option>
              ))}
            </select>
          </motion.div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--txt)] mb-4">
          Intensity Preference <span className="text-red-400">*</span>
        </label>
        <div className="space-y-3">
          {[
            { value: 'beginner', label: 'Beginner (3 days/week)' },
            { value: 'intermediate', label: 'Intermediate (4-5 days/week)' },
            { value: 'advanced', label: 'Advanced (6+ days/week)' },
          ].map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-3 p-4 bg-[var(--bg-elev-1)] rounded-lg cursor-pointer hover:bg-[var(--bg-elev-2)] transition"
            >
              <input
                type="radio"
                name="intensity"
                value={option.value}
                checked={formData.intensity === option.value}
                onChange={(e) => updateField('intensity', e.target.value)}
                className="w-4 h-4 text-[var(--acc)]"
              />
              <span className="text-[var(--txt)]">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

// Step 3: Biometrics
function Step3Biometrics({ formData, updateField, updateNestedField }) {
  const [showMeasurements, setShowMeasurements] = useState(false);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[var(--txt)] mb-2">Biometrics Update</h2>
        <p className="text-[var(--txt-muted)]">All fields are optional</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--txt)] mb-2">
          Current Weight
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={formData.currentWeight}
            onChange={(e) => updateField('currentWeight', e.target.value)}
            placeholder="Enter weight"
            className="flex-1 px-4 py-2 bg-[var(--bg-elev-1)] border border-[var(--border)] rounded-lg text-[var(--txt)] focus:outline-none focus:ring-2 focus:ring-[var(--acc)]"
          />
          <select
            value={formData.weightUnit}
            onChange={(e) => updateField('weightUnit', e.target.value)}
            className="px-4 py-2 bg-[var(--bg-elev-1)] border border-[var(--border)] rounded-lg text-[var(--txt)]"
          >
            <option value="lbs">lbs</option>
            <option value="kg">kg</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--txt)] mb-2">
          Height
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={formData.height}
            onChange={(e) => updateField('height', e.target.value)}
            placeholder={formData.heightUnit === 'ft' ? "5'10\"" : "178"}
            className="flex-1 px-4 py-2 bg-[var(--bg-elev-1)] border border-[var(--border)] rounded-lg text-[var(--txt)] focus:outline-none focus:ring-2 focus:ring-[var(--acc)]"
          />
          <select
            value={formData.heightUnit}
            onChange={(e) => updateField('heightUnit', e.target.value)}
            className="px-4 py-2 bg-[var(--bg-elev-1)] border border-[var(--border)] rounded-lg text-[var(--txt)]"
          >
            <option value="ft">ft/in</option>
            <option value="cm">cm</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--txt)] mb-2">
          Body Fat %: {formData.bodyFat}%
        </label>
        <input
          type="range"
          min="5"
          max="50"
          value={formData.bodyFat}
          onChange={(e) => updateField('bodyFat', parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-[var(--txt-muted)] mt-1">
          <span>5%</span>
          <span>50%</span>
        </div>
      </div>

      <button
        onClick={() => setShowMeasurements(!showMeasurements)}
        className="w-full p-4 bg-[var(--bg-elev-1)] hover:bg-[var(--bg-elev-2)] rounded-lg text-left transition"
      >
        <div className="flex items-center justify-between">
          <span className="font-medium text-[var(--txt)]">Body Measurements (optional)</span>
          <span className="text-[var(--txt-muted)]">{showMeasurements ? '−' : '+'}</span>
        </div>
      </button>

      {showMeasurements && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-4 p-4 bg-[var(--bg-elev-1)] rounded-lg"
        >
          {['chest', 'waist', 'hips', 'arms', 'thighs'].map((measurement) => (
            <div key={measurement}>
              <label className="block text-sm font-medium text-[var(--txt)] mb-2 capitalize">
                {measurement}
              </label>
              <input
                type="number"
                value={formData.measurements[measurement]}
                onChange={(e) => updateNestedField('measurements', measurement, e.target.value)}
                placeholder="inches"
                className="w-full px-4 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--txt)] focus:outline-none focus:ring-2 focus:ring-[var(--acc)]"
              />
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

// Step 4: Lifestyle
function Step4Lifestyle({ formData, updateField, toggleArrayField, equipmentOptions }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[var(--txt)] mb-2">Lifestyle Changes</h2>
        <p className="text-[var(--txt-muted)]">Update your training schedule</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--txt)] mb-2">
          Training Days Per Week <span className="text-red-400">*</span>
        </label>
        <select
          value={formData.trainingDays}
          onChange={(e) => updateField('trainingDays', e.target.value)}
          className="w-full px-4 py-3 bg-[var(--bg-elev-1)] border border-[var(--border)] rounded-lg text-[var(--txt)] focus:outline-none focus:ring-2 focus:ring-[var(--acc)]"
        >
          <option value="">Select...</option>
          {[2, 3, 4, 5, 6, 7].map((days) => (
            <option key={days} value={days}>
              {days} {days === 1 ? 'day' : 'days'}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--txt)] mb-3">
          Available Equipment
        </label>
        <div className="flex flex-wrap gap-2">
          {equipmentOptions.map((equipment) => (
            <button
              key={equipment}
              onClick={() => toggleArrayField('equipment', equipment)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                formData.equipment.includes(equipment)
                  ? 'bg-[var(--acc)] text-white'
                  : 'bg-[var(--bg-elev-1)] text-[var(--txt-muted)] hover:bg-[var(--bg-elev-2)]'
              }`}
            >
              {equipment}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--txt)] mb-2">
          Time Per Workout <span className="text-red-400">*</span>
        </label>
        <select
          value={formData.workoutTime}
          onChange={(e) => updateField('workoutTime', e.target.value)}
          className="w-full px-4 py-3 bg-[var(--bg-elev-1)] border border-[var(--border)] rounded-lg text-[var(--txt)] focus:outline-none focus:ring-2 focus:ring-[var(--acc)]"
        >
          <option value="">Select...</option>
          {['30min', '45min', '60min', '75min', '90min+'].map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--txt)] mb-2">
          Injuries or Limitations (optional)
        </label>
        <textarea
          value={formData.injuries}
          onChange={(e) => updateField('injuries', e.target.value)}
          placeholder="Describe any injuries, limitations, or concerns..."
          rows={4}
          className="w-full px-4 py-2 bg-[var(--bg-elev-1)] border border-[var(--border)] rounded-lg text-[var(--txt)] focus:outline-none focus:ring-2 focus:ring-[var(--acc)] resize-none"
        />
      </div>
    </div>
  );
}

// Step 5: Preferences
function Step5Preferences({ formData, updateField, toggleArrayField, supplementCategories }) {
  const [allergyInput, setAllergyInput] = useState('');

  const addAllergy = () => {
    if (allergyInput.trim() && !formData.allergies.includes(allergyInput.trim())) {
      updateField('allergies', [...formData.allergies, allergyInput.trim()]);
      setAllergyInput('');
    }
  };

  const removeAllergy = (allergy) => {
    updateField('allergies', formData.allergies.filter(a => a !== allergy));
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[var(--txt)] mb-2">Preferences</h2>
        <p className="text-[var(--txt-muted)]">Finalize your preferences</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--txt)] mb-4">
          Diet Type <span className="text-red-400">*</span>
        </label>
        <div className="space-y-3">
          {['Standard', 'Vegetarian', 'Vegan', 'Keto', 'Paleo', 'Flexible'].map((diet) => (
            <label
              key={diet}
              className="flex items-center gap-3 p-4 bg-[var(--bg-elev-1)] rounded-lg cursor-pointer hover:bg-[var(--bg-elev-2)] transition"
            >
              <input
                type="radio"
                name="dietType"
                value={diet.toLowerCase()}
                checked={formData.dietType === diet.toLowerCase()}
                onChange={(e) => updateField('dietType', e.target.value)}
                className="w-4 h-4 text-[var(--acc)]"
              />
              <span className="text-[var(--txt)]">{diet}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--txt)] mb-3">
          Supplement Preferences
        </label>
        <div className="space-y-2">
          {supplementCategories.map((category) => (
            <button
              key={category}
              onClick={() => toggleArrayField('supplementPreferences', category)}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition ${
                formData.supplementPreferences.includes(category)
                  ? 'bg-[var(--acc)]/20 border border-[var(--acc)]/30 text-[var(--acc)]'
                  : 'bg-[var(--bg-elev-1)] text-[var(--txt-muted)] hover:bg-[var(--bg-elev-2)] border border-[var(--border)]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--txt)] mb-2">
          Allergies / Restrictions
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={allergyInput}
            onChange={(e) => setAllergyInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addAllergy()}
            placeholder="e.g., shellfish, dairy, soy..."
            className="flex-1 px-4 py-2 bg-[var(--bg-elev-1)] border border-[var(--border)] rounded-lg text-[var(--txt)] focus:outline-none focus:ring-2 focus:ring-[var(--acc)]"
          />
          <button
            onClick={addAllergy}
            className="px-4 py-2 bg-[var(--acc)] text-white rounded-lg hover:bg-blue-600 transition"
          >
            Add
          </button>
        </div>
        {formData.allergies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.allergies.map((allergy) => (
              <span
                key={allergy}
                className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--bg-elev-1)] border border-[var(--border)] rounded-full text-sm text-[var(--txt)]"
              >
                {allergy}
                <button
                  onClick={() => removeAllergy(allergy)}
                  className="hover:text-red-400"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Success Screen
function SuccessScreen({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <Check size={40} className="text-green-500" />
      </motion.div>
      <h2 className="text-3xl font-bold text-[var(--txt)] mb-3">✅ Goals Updated!</h2>
      <p className="text-lg text-[var(--txt-muted)] mb-2">
        Your personalized plan will be updated to reflect these changes.
      </p>
      <p className="text-sm text-[var(--txt-muted)] mb-8">
        Changes will take effect in your next workout/supplement cycle
      </p>
      <Button onClick={onClose} variant="primary" className="px-8">
        Return to Dashboard
      </Button>
    </motion.div>
  );
}

// Slider Component
function SliderInput({ label, value, onChange, min, max, leftLabel, rightLabel }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-[var(--txt)]">{label}</label>
        <span className="text-sm font-semibold text-[var(--acc)]">{value}/10</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full mb-1"
      />
      <div className="flex justify-between text-xs text-[var(--txt-muted)]">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
}
