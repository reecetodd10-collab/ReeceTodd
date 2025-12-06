'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react';

const STEPS = [
  {
    id: 1,
    title: 'Profile Type',
    question: 'What best describes you?',
    type: 'radio',
    options: [
      'Student',
      'Working Professional',
      'Parent',
      'Already Active in Fitness',
      'New to Fitness Journey',
      'Competitive Athlete'
    ],
    required: true
  },
  {
    id: 2,
    title: 'Goals',
    question: 'What results are you trying to achieve?',
    type: 'radio',
    options: [
      'Lose weight',
      'Gain muscle',
      'Tone up & get defined',
      'Improve athletic performance',
      'Stay healthy & active',
      'Recover from injury',
      'Other'
    ],
    required: true,
    hasOther: true
  },
  {
    id: 3,
    title: 'Challenges',
    question: "What's your biggest challenge?",
    type: 'radio',
    options: [
      'Not enough time',
      'Lack of motivation',
      "Don't know where to start",
      'Inconsistent progress',
      'Nutrition confusion',
      'Poor sleep quality',
      'Hit a plateau',
      'Need accountability',
      'Other'
    ],
    required: true,
    hasOther: true
  },
  {
    id: 4,
    title: 'Past Attempts',
    question: 'What have you tried before?',
    type: 'textarea',
    placeholder: 'E.g., gym memberships, workout apps, personal trainers...',
    required: false
  },
  {
    id: 5,
    title: 'Budget',
    question: "What's your monthly budget for fitness?",
    type: 'radio',
    options: [
      'Under $20/month',
      '$20-$50/month',
      '$50-$100/month',
      '$100+/month',
      'Prefer not to say'
    ],
    required: true
  },
  {
    id: 6,
    title: 'Email',
    question: 'Where should we send your early access invite?',
    type: 'email',
    placeholder: 'your@email.com',
    required: true
  }
];

export default function WaitlistModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    profileType: '',
    goal: '',
    goalOther: '',
    challenge: '',
    challengeOther: '',
    pastAttempts: '',
    budget: '',
    email: '',
    marketingConsent: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const currentStepData = STEPS[currentStep - 1];

  const handleNext = () => {
    // Validate current step
    const error = validateStep(currentStep);
    if (error) {
      setErrors({ [currentStep]: error });
      return;
    }

    setErrors({});
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const validateStep = (step) => {
    const stepData = STEPS[step - 1];
    if (!stepData.required) return null;

    switch (step) {
      case 1:
        if (!formData.profileType) return 'Please select a profile type';
        break;
      case 2:
        if (!formData.goal) return 'Please select a goal';
        if (formData.goal === 'Other' && !formData.goalOther.trim()) {
          return 'Please specify your goal';
        }
        break;
      case 3:
        if (!formData.challenge) return 'Please select a challenge';
        if (formData.challenge === 'Other' && !formData.challengeOther.trim()) {
          return 'Please specify your challenge';
        }
        break;
      case 5:
        if (!formData.budget) return 'Please select a budget range';
        break;
      case 6:
        if (!formData.email) return 'Please enter your email';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          return 'Please enter a valid email address';
        }
        break;
    }
    return null;
  };

  const handleSubmit = async () => {
    const error = validateStep(6);
    if (error) {
      setErrors({ 6: error });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const submissionData = {
        timestamp: new Date().toISOString(),
        profile_type: formData.profileType,
        goal: formData.goal === 'Other' ? formData.goalOther : formData.goal,
        challenge: formData.challenge === 'Other' ? formData.challengeOther : formData.challenge,
        past_attempts: formData.pastAttempts || 'Not specified',
        budget: formData.budget,
        email: formData.email,
        marketing_consent: formData.marketingConsent
      };

      // Submit to API endpoint
      const response = await fetch('/api/pro-waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit waitlist form');
      }

      setIsSuccess(true);
    } catch (error) {
      console.error('Error submitting waitlist:', error);
      setErrors({ submit: 'Failed to submit. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setFormData({
      profileType: '',
      goal: '',
      goalOther: '',
      challenge: '',
      challengeOther: '',
      pastAttempts: '',
      budget: '',
      email: '',
      marketingConsent: false
    });
    setErrors({});
    setIsSuccess(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
        }}
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
          style={{
            background: 'rgba(30, 30, 30, 0.95)',
            border: '1px solid rgba(0, 217, 255, 0.4)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0, 217, 255, 0.3)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 text-[var(--txt-muted)] hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>

          {isSuccess ? (
            /* Success State */
            <div className="p-8 md:p-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="text-6xl mb-6"
              >
                🎉
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-normal text-white mb-4">
                You're on the list!
              </h2>
              <p className="text-lg text-[var(--txt-muted)] font-light mb-6 leading-relaxed">
                We'll email you when Aviera Pro launches with your exclusive early access link.
              </p>
              <p className="text-base text-[var(--txt-muted)] font-light mb-8">
                Check your inbox - we just sent you a confirmation.
              </p>
              <button
                onClick={handleClose}
                className="px-8 py-4 bg-gradient-to-r from-[var(--acc)] to-[#00b8d4] text-[#001018] rounded-lg font-semibold hover:from-[#00f0ff] hover:to-[var(--acc)] transition-all duration-300"
                style={{
                  boxShadow: '0 0 30px rgba(0, 217, 255, 0.5)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 40px rgba(0, 217, 255, 0.7)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 217, 255, 0.5)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Close
              </button>
            </div>
          ) : (
            /* Form Steps */
            <div className="p-6 md:p-10">
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-normal text-white mb-2">
                  Aviera Pro - Join the Waitlist
                </h2>
                <p className="text-base text-[var(--txt-muted)] font-light">
                  Be the first to experience AI-powered fitness management
                </p>
              </div>

              {/* Progress Indicator */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-[var(--txt-muted)] font-light">
                    Step {currentStep} of {STEPS.length}
                  </span>
                  <span className="text-sm text-[var(--acc)] font-light">
                    {Math.round((currentStep / STEPS.length) * 100)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-[var(--bg-elev-1)] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStep / STEPS.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                    className="h-full bg-gradient-to-r from-[var(--acc)] to-[#00b8d4]"
                  />
                </div>
              </div>

              {/* Step Content */}
              <div className="mb-8 min-h-[300px]">
                <h3 className="text-xl md:text-2xl font-normal text-white mb-6">
                  {currentStepData.question}
                </h3>

                {currentStepData.type === 'radio' && (
                  <div className="space-y-3">
                    {currentStepData.options.map((option) => {
                      const getFieldName = () => {
                        if (currentStepData.id === 1) return 'profileType';
                        if (currentStepData.id === 2) return 'goal';
                        if (currentStepData.id === 3) return 'challenge';
                        if (currentStepData.id === 5) return 'budget';
                        return '';
                      };
                      const fieldName = getFieldName();
                      const isSelected = formData[fieldName] === option;
                      
                      return (
                        <label
                          key={option}
                          className="flex items-center p-4 rounded-lg cursor-pointer transition-all duration-300 min-h-[48px]"
                          style={{
                            background: isSelected
                              ? 'rgba(0, 217, 255, 0.1)'
                              : 'rgba(30, 30, 30, 0.5)',
                            border: `1px solid ${
                              isSelected
                                ? 'rgba(0, 217, 255, 0.6)'
                                : 'rgba(0, 217, 255, 0.2)'
                            }`,
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.4)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.2)';
                            }
                          }}
                        >
                          <input
                            type="radio"
                            name={`step-${currentStepData.id}`}
                            value={option}
                            checked={isSelected}
                            onChange={(e) => {
                              setFormData({ ...formData, [fieldName]: e.target.value });
                              setErrors({});
                            }}
                          className="w-5 h-5 mr-4 accent-[var(--acc)] cursor-pointer flex-shrink-0"
                          style={{ minWidth: '20px', minHeight: '20px' }}
                        />
                        <span className="text-white font-light flex-1 text-base">{option}</span>
                        </label>
                      );
                    })}

                    {/* Other input for goals and challenges */}
                    {(currentStepData.hasOther && 
                      (currentStepData.id === 2 && formData.goal === 'Other') ||
                      (currentStepData.id === 3 && formData.challenge === 'Other')) && (
                      <div className="mt-4">
                        <input
                          type="text"
                          placeholder="Please specify..."
                          value={currentStepData.id === 2 ? formData.goalOther : formData.challengeOther}
                          onChange={(e) => {
                            const fieldName = currentStepData.id === 2 ? 'goalOther' : 'challengeOther';
                            setFormData({ ...formData, [fieldName]: e.target.value });
                            setErrors({});
                          }}
                          className="w-full px-4 py-3 rounded-lg text-white font-light transition-all duration-300"
                          style={{
                            background: 'rgba(30, 30, 30, 0.9)',
                            border: '1px solid rgba(0, 217, 255, 0.3)',
                            fontSize: '16px',
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.7)';
                            e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.4)';
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {currentStepData.type === 'textarea' && (
                  <textarea
                    placeholder={currentStepData.placeholder}
                    value={formData.pastAttempts}
                    onChange={(e) => {
                      setFormData({ ...formData, pastAttempts: e.target.value });
                      setErrors({});
                    }}
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg text-white font-light transition-all duration-300 resize-none"
                    style={{
                      background: 'rgba(30, 30, 30, 0.9)',
                      border: '1px solid rgba(0, 217, 255, 0.3)',
                      fontSize: '16px',
                      minHeight: '120px',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.7)';
                      e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.4)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                )}

                {currentStepData.type === 'email' && (
                  <div className="space-y-4">
                    <input
                      type="email"
                      placeholder={currentStepData.placeholder}
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        setErrors({});
                      }}
                      className="w-full px-4 py-3 rounded-lg text-white font-light transition-all duration-300"
                      style={{
                        background: 'rgba(30, 30, 30, 0.9)',
                        border: '1px solid rgba(0, 217, 255, 0.3)',
                        fontSize: '16px',
                        height: '56px',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.7)';
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.4)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                    <label className="flex items-center p-4 rounded-lg cursor-pointer transition-all duration-300"
                      style={{
                        background: formData.marketingConsent ? 'rgba(0, 217, 255, 0.1)' : 'rgba(30, 30, 30, 0.5)',
                        border: `1px solid ${formData.marketingConsent ? 'rgba(0, 217, 255, 0.6)' : 'rgba(0, 217, 255, 0.2)'}`,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.marketingConsent}
                        onChange={(e) => {
                          setFormData({ ...formData, marketingConsent: e.target.checked });
                        }}
                        className="w-5 h-5 mr-4 accent-[var(--acc)] cursor-pointer"
                      />
                      <span className="text-white font-light">I want to receive fitness tips and updates</span>
                    </label>
                  </div>
                )}

                {/* Error Message */}
                {errors[currentStep] && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 text-sm text-[var(--acc)] font-light"
                  >
                    {errors[currentStep]}
                  </motion.p>
                )}

                {errors.submit && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 text-sm text-[var(--acc)] font-light"
                  >
                    {errors.submit}
                  </motion.p>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center gap-4">
                {currentStep > 1 ? (
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 px-6 py-3 text-white font-normal rounded-lg transition-all duration-300"
                    style={{
                      background: 'rgba(30, 30, 30, 0.9)',
                      border: '1px solid rgba(0, 217, 255, 0.3)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.6)';
                      e.currentTarget.style.background = 'rgba(0, 217, 255, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
                      e.currentTarget.style.background = 'rgba(30, 30, 30, 0.9)';
                    }}
                  >
                    <ChevronLeft size={20} />
                    Back
                  </button>
                ) : (
                  <div className="hidden sm:block"></div>
                )}

                {currentStep < STEPS.length ? (
                  currentStep === 4 ? (
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:ml-auto">
                      <button
                        onClick={handleNext}
                        className="px-6 py-3 text-white font-normal rounded-lg transition-all duration-300 min-h-[48px] w-full sm:w-auto"
                        style={{
                          background: 'rgba(30, 30, 30, 0.9)',
                          border: '1px solid rgba(0, 217, 255, 0.3)',
                          fontSize: '16px',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.6)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
                        }}
                      >
                        Skip
                      </button>
                      <button
                        onClick={handleNext}
                        disabled={!!errors[currentStep]}
                        className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-[var(--acc)] to-[#00b8d4] text-[#001018] font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] w-full sm:w-auto"
                        style={{
                          boxShadow: '0 0 20px rgba(0, 217, 255, 0.4)',
                          fontSize: '16px',
                        }}
                        onMouseEnter={(e) => {
                          if (!errors[currentStep]) {
                            e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 217, 255, 0.6)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.4)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        Next
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleNext}
                      disabled={!!errors[currentStep]}
                      className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-[var(--acc)] to-[#00b8d4] text-[#001018] font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ml-auto min-h-[48px] w-full sm:w-auto"
                      style={{
                        boxShadow: '0 0 20px rgba(0, 217, 255, 0.4)',
                        fontSize: '16px',
                      }}
                      onMouseEnter={(e) => {
                        if (!errors[currentStep]) {
                          e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 217, 255, 0.6)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.4)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      Next
                      <ChevronRight size={20} />
                    </button>
                  )
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !!errors[6] || !!errors.submit}
                    className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[var(--acc)] to-[#00b8d4] text-[#001018] font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ml-auto min-h-[48px] w-full sm:w-auto"
                    style={{
                      boxShadow: '0 0 20px rgba(0, 217, 255, 0.4)',
                      fontSize: '16px',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubmitting && !errors[6] && !errors.submit) {
                        e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 217, 255, 0.6)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.4)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-[#001018] border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Check size={20} />
                        Join Waitlist
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  );
}

