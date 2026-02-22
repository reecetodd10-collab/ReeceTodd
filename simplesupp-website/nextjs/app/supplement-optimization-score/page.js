'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, ChevronLeft, Check, ShoppingCart, Mail,
  Dumbbell, Flame, Moon, Brain, Zap, Activity,
  BedDouble, Battery, Heart, Target, Calendar
} from 'lucide-react';
import Image from 'next/image';
import { fetchShopifyProducts, addMultipleToCart } from '../lib/shopify';

// Goal icons mapping
const GOAL_ICONS = {
  'Build Muscle & Strength': Dumbbell,
  'Burn Fat & Lean Out': Flame,
  'Improve Sleep Quality': Moon,
  'Boost Focus & Clarity': Brain,
  'Increase Endurance': Zap,
  'Hormone Optimization': Activity,
};

// Training style icons
const TRAINING_ICONS = {
  'Weightlifting/Strength': Dumbbell,
  'CrossFit/Functional': Zap,
  'Endurance (Run/Bike)': Activity,
  'Sports Performance': Target,
  'General Fitness': Heart,
  'Sedentary': BedDouble,
};

export default function SupplementOptimizationScore() {
  // Quiz state
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // User responses
  const [responses, setResponses] = useState({
    // Section 1: Performance Baseline
    age: '',
    gender: '',
    height: '',
    weight: '',
    primaryGoal: '',

    // Section 2: Recovery & Stress
    sleepQuality: 0,
    energyLevel: 0,
    stressLevel: 0,
    digestiveIssues: null,
    currentSupplements: [],

    // Section 3: Athletic Profile
    trainingFrequency: '',
    trainingStyle: '',
    yearsTraining: '',
    injuryHistory: null,
  });

  // Results state
  const [scores, setScores] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);
  const [shopifyProducts, setShopifyProducts] = useState([]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // Email capture
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  // Fetch Shopify products on mount
  useEffect(() => {
    fetchShopifyProducts()
      .then(products => setShopifyProducts(products))
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  // Section definitions
  const sections = [
    {
      title: 'Performance Baseline',
      subtitle: "Let's establish your current physical metrics",
      questions: [
        {
          id: 'age',
          label: 'What is your age?',
          type: 'dropdown',
          options: ['18-24', '25-34', '35-44', '45-54', '55+'],
        },
        {
          id: 'gender',
          label: 'What is your gender?',
          type: 'buttons',
          options: ['Male', 'Female', 'Other'],
        },
        {
          id: 'height',
          label: 'What is your height?',
          type: 'dropdown',
          options: generateHeightOptions(),
        },
        {
          id: 'weight',
          label: 'What is your weight?',
          type: 'dropdown',
          options: generateWeightOptions(),
        },
        {
          id: 'primaryGoal',
          label: 'What is your primary goal?',
          type: 'goal-buttons',
          options: [
            'Build Muscle & Strength',
            'Burn Fat & Lean Out',
            'Improve Sleep Quality',
            'Boost Focus & Clarity',
            'Increase Endurance',
            'Hormone Optimization',
          ],
        },
      ],
    },
    {
      title: 'Recovery & Stress Analysis',
      subtitle: 'Your recovery quality directly impacts performance output',
      questions: [
        {
          id: 'sleepQuality',
          label: 'How would you rate your sleep quality?',
          microcopy: 'Sleep impacts hormone output and muscle recovery',
          type: 'scale',
          min: 1,
          max: 5,
          labels: ['Poor', 'Fair', 'Average', 'Good', 'Excellent'],
        },
        {
          id: 'energyLevel',
          label: 'How are your energy levels throughout the day?',
          microcopy: 'Energy patterns indicate metabolic efficiency',
          type: 'scale',
          min: 1,
          max: 5,
          labels: ['Constantly Tired', 'Low', 'Moderate', 'Good', 'High Energy'],
        },
        {
          id: 'stressLevel',
          label: "What's your average stress level?",
          microcopy: 'Chronic stress elevates cortisol and impairs recovery',
          type: 'scale',
          min: 1,
          max: 5,
          labels: ['Very Low', 'Low', 'Moderate', 'High', 'Very High'],
        },
        {
          id: 'digestiveIssues',
          label: 'Do you experience regular digestive issues?',
          type: 'yesno',
        },
        {
          id: 'currentSupplements',
          label: 'What supplements are you currently taking?',
          microcopy: 'Select all that apply (optional)',
          type: 'multiselect',
          options: ['Protein', 'Creatine', 'Pre-Workout', 'Vitamins', 'Sleep Aids', 'None'],
        },
      ],
    },
    {
      title: 'Athletic Profile',
      subtitle: 'Training volume helps optimize supplement timing',
      questions: [
        {
          id: 'trainingFrequency',
          label: 'How often do you train?',
          type: 'dropdown',
          options: [
            '6-7 days/week',
            '4-5 days/week',
            '2-3 days/week',
            '1 day/week',
            'Not currently training',
          ],
        },
        {
          id: 'trainingStyle',
          label: 'What is your primary training style?',
          type: 'training-buttons',
          options: [
            'Weightlifting/Strength',
            'CrossFit/Functional',
            'Endurance (Run/Bike)',
            'Sports Performance',
            'General Fitness',
            'Sedentary',
          ],
        },
        {
          id: 'yearsTraining',
          label: 'How many years have you been training?',
          type: 'dropdown',
          options: ['<1 year', '1-2 years', '3-5 years', '6-10 years', '10+ years'],
        },
        {
          id: 'injuryHistory',
          label: 'Do you have any chronic injuries or mobility limitations?',
          type: 'yesno',
        },
      ],
    },
  ];

  // Calculate total questions and progress
  const totalQuestions = sections.reduce((sum, section) => sum + section.questions.length, 0);
  const questionsCompleted = sections.slice(0, currentSection).reduce((sum, section) => sum + section.questions.length, 0) + currentQuestion;
  const progressPercent = Math.round((questionsCompleted / totalQuestions) * 100);

  // Current question data
  const currentSectionData = sections[currentSection];
  const currentQuestionData = currentSectionData?.questions[currentQuestion];

  // Check if current question is answered
  const isCurrentAnswered = () => {
    if (!currentQuestionData) return false;
    const value = responses[currentQuestionData.id];

    if (currentQuestionData.type === 'scale') {
      return value > 0;
    }
    if (currentQuestionData.type === 'yesno') {
      return value !== null;
    }
    if (currentQuestionData.type === 'multiselect') {
      return true; // Optional
    }
    return value !== '';
  };

  // Handle response update
  const updateResponse = (questionId, value) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  // Navigation
  const goNext = () => {
    if (currentQuestion < currentSectionData.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else if (currentSection < sections.length - 1) {
      setCurrentSection(prev => prev + 1);
      setCurrentQuestion(0);
    } else {
      // Quiz complete - calculate results
      calculateResults();
    }
  };

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    } else if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
      setCurrentQuestion(sections[currentSection - 1].questions.length - 1);
    }
  };

  // Calculate optimization score
  const calculateResults = async () => {
    setQuizComplete(true);
    setIsCalculating(true);

    // Deterministic scoring
    const sleepScore = (responses.sleepQuality / 5) * 25;
    const energyScore = (responses.energyLevel / 5) * 20;
    const stressScore = ((6 - responses.stressLevel) / 5) * 20;

    // Goal alignment scoring
    let goalAlignmentScore = 10;
    const goal = responses.primaryGoal;
    const freq = responses.trainingFrequency;
    const isHighFreq = freq === '6-7 days/week' || freq === '4-5 days/week';

    if (goal === 'Build Muscle & Strength') {
      if (isHighFreq) goalAlignmentScore += 5;
      if (responses.energyLevel >= 4) goalAlignmentScore += 5;
    } else if (goal === 'Burn Fat & Lean Out') {
      if (isHighFreq) goalAlignmentScore += 5;
      if (responses.stressLevel <= 2) goalAlignmentScore += 5;
    } else if (goal === 'Improve Sleep Quality') {
      if (responses.sleepQuality <= 2) goalAlignmentScore += 10;
    } else if (goal === 'Boost Focus & Clarity') {
      if (responses.stressLevel >= 4) goalAlignmentScore += 5;
      if (responses.energyLevel <= 2) goalAlignmentScore += 5;
    } else if (goal === 'Increase Endurance') {
      if (isHighFreq) goalAlignmentScore += 5;
      if (responses.trainingStyle === 'Endurance (Run/Bike)') goalAlignmentScore += 5;
    } else if (goal === 'Hormone Optimization') {
      if (responses.sleepQuality >= 4) goalAlignmentScore += 5;
      if (responses.stressLevel <= 2) goalAlignmentScore += 5;
    }

    // Training load scoring
    let trainingLoadScore = 0;
    switch (responses.trainingFrequency) {
      case '6-7 days/week': trainingLoadScore = 15; break;
      case '4-5 days/week': trainingLoadScore = 12; break;
      case '2-3 days/week': trainingLoadScore = 8; break;
      case '1 day/week': trainingLoadScore = 4; break;
      default: trainingLoadScore = 0;
    }

    const totalScore = Math.min(100, Math.max(0, Math.round(
      sleepScore + energyScore + stressScore + goalAlignmentScore + trainingLoadScore
    )));

    const calculatedScores = {
      total: totalScore,
      sleep: Math.round(sleepScore),
      energy: Math.round(energyScore),
      stress: Math.round(stressScore),
      goalAlignment: Math.round(goalAlignmentScore),
      trainingLoad: Math.round(trainingLoadScore),
    };

    setScores(calculatedScores);

    // Generate recommendations based on priority rules
    const recs = generateRecommendations(responses, shopifyProducts);
    setRecommendations(recs);

    // Get AI insights
    try {
      const insightsResponse = await fetch('/api/ai/optimization-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          responses,
          scores: calculatedScores,
          recommendations: recs.map(r => r.title),
        }),
      });

      if (insightsResponse.ok) {
        const data = await insightsResponse.json();
        if (data.insights) {
          setAiInsights(data.insights);
        }
      }
    } catch (error) {
      console.error('Error getting AI insights:', error);
      // Fallback insights
      setAiInsights([
        `Your sleep quality score of ${responses.sleepQuality}/5 indicates room for recovery optimization.`,
        `With ${responses.trainingFrequency} training, your supplement timing should align with recovery windows.`,
        `Focus on addressing your primary gap to unlock ${100 - totalScore}% more potential.`,
      ]);
    }

    // Simulate loading for premium feel
    setTimeout(() => {
      setIsCalculating(false);
      setShowResults(true);
    }, 2500);
  };

  // Add recommended products to cart
  const handleAddToCart = async () => {
    if (recommendations.length === 0) return;

    setIsAddingToCart(true);

    try {
      const itemsToAdd = recommendations
        .filter(rec => rec.variantId)
        .map(rec => ({
          variantId: rec.variantId,
          quantity: 1,
        }));

      if (itemsToAdd.length > 0) {
        await addMultipleToCart(itemsToAdd);
        setAddedToCart(true);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add products to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Email submission
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    // TODO: Save to database and send email via Resend
    setEmailSubmitted(true);
  };

  // Render quiz or results
  if (showResults && scores) {
    return (
      <ResultsPage
        scores={scores}
        responses={responses}
        recommendations={recommendations}
        aiInsights={aiInsights}
        onAddToCart={handleAddToCart}
        isAddingToCart={isAddingToCart}
        addedToCart={addedToCart}
        email={email}
        setEmail={setEmail}
        emailSubmitted={emailSubmitted}
        onEmailSubmit={handleEmailSubmit}
      />
    );
  }

  if (isCalculating) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-bg py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-txt mb-2">
            Supplement Optimization Score
          </h1>
          <p className="text-txt-muted text-sm">
            AI-Powered Performance Diagnostics for Your Supplement Stack
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-txt-muted mb-2">
            <span>Progress</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-accent"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Section Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-accent text-sm font-medium">
              Section {currentSection + 1} of {sections.length}
            </span>
          </div>
          <h2 className="text-xl font-semibold text-txt">
            {currentSectionData.title}
          </h2>
          <p className="text-txt-muted text-sm mt-1">
            {currentSectionData.subtitle}
          </p>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentSection}-${currentQuestion}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="glass-card p-6 mb-6"
            style={{
              background: 'rgba(30, 30, 30, 0.9)',
              border: '1px solid rgba(0, 217, 255, 0.3)',
            }}
          >
            <QuestionRenderer
              question={currentQuestionData}
              value={responses[currentQuestionData.id]}
              onChange={(value) => updateResponse(currentQuestionData.id, value)}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between gap-4">
          <button
            onClick={goBack}
            disabled={currentSection === 0 && currentQuestion === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-txt-muted hover:text-txt transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} />
            Back
          </button>

          <button
            onClick={goNext}
            disabled={!isCurrentAnswered()}
            className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: isCurrentAnswered() ? '#00d9ff' : 'rgba(0, 217, 255, 0.3)',
              color: isCurrentAnswered() ? '#001018' : 'rgba(255, 255, 255, 0.5)',
              boxShadow: isCurrentAnswered() ? '0 0 20px rgba(0, 217, 255, 0.4)' : 'none',
            }}
          >
            {currentSection === sections.length - 1 && currentQuestion === currentSectionData.questions.length - 1
              ? 'Calculate My Score'
              : 'Continue'}
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Question Renderer Component
function QuestionRenderer({ question, value, onChange }) {
  if (!question) return null;

  switch (question.type) {
    case 'dropdown':
      return (
        <div>
          <label className="block text-lg font-medium text-txt mb-4">
            {question.label}
          </label>
          {question.microcopy && (
            <p className="text-txt-muted text-sm mb-4">{question.microcopy}</p>
          )}
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-bg-elevated border border-glass-border text-txt focus:border-accent focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
          >
            <option value="">Select an option</option>
            {question.options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      );

    case 'buttons':
      return (
        <div>
          <label className="block text-lg font-medium text-txt mb-4">
            {question.label}
          </label>
          <div className="grid grid-cols-3 gap-3">
            {question.options.map((opt) => (
              <button
                key={opt}
                onClick={() => onChange(opt)}
                className="px-4 py-3 rounded-xl font-medium transition-all"
                style={{
                  background: value === opt ? '#00d9ff' : 'rgba(30, 30, 30, 0.8)',
                  color: value === opt ? '#001018' : '#ffffff',
                  border: value === opt ? '1px solid #00d9ff' : '1px solid rgba(0, 217, 255, 0.3)',
                  boxShadow: value === opt ? '0 0 15px rgba(0, 217, 255, 0.4)' : 'none',
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      );

    case 'goal-buttons':
      return (
        <div>
          <label className="block text-lg font-medium text-txt mb-4">
            {question.label}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {question.options.map((opt) => {
              const Icon = GOAL_ICONS[opt] || Target;
              const isSelected = value === opt;
              return (
                <button
                  key={opt}
                  onClick={() => onChange(opt)}
                  className="flex items-center gap-3 px-4 py-4 rounded-xl font-medium transition-all text-left"
                  style={{
                    background: isSelected ? '#00d9ff' : 'rgba(30, 30, 30, 0.8)',
                    color: isSelected ? '#001018' : '#ffffff',
                    border: isSelected ? '1px solid #00d9ff' : '1px solid rgba(0, 217, 255, 0.3)',
                    boxShadow: isSelected ? '0 0 15px rgba(0, 217, 255, 0.4)' : 'none',
                  }}
                >
                  <Icon size={24} />
                  <span className="text-sm">{opt}</span>
                </button>
              );
            })}
          </div>
        </div>
      );

    case 'training-buttons':
      return (
        <div>
          <label className="block text-lg font-medium text-txt mb-4">
            {question.label}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {question.options.map((opt) => {
              const Icon = TRAINING_ICONS[opt] || Activity;
              const isSelected = value === opt;
              return (
                <button
                  key={opt}
                  onClick={() => onChange(opt)}
                  className="flex items-center gap-3 px-4 py-4 rounded-xl font-medium transition-all text-left"
                  style={{
                    background: isSelected ? '#00d9ff' : 'rgba(30, 30, 30, 0.8)',
                    color: isSelected ? '#001018' : '#ffffff',
                    border: isSelected ? '1px solid #00d9ff' : '1px solid rgba(0, 217, 255, 0.3)',
                    boxShadow: isSelected ? '0 0 15px rgba(0, 217, 255, 0.4)' : 'none',
                  }}
                >
                  <Icon size={24} />
                  <span className="text-sm">{opt}</span>
                </button>
              );
            })}
          </div>
        </div>
      );

    case 'scale':
      return (
        <div>
          <label className="block text-lg font-medium text-txt mb-2">
            {question.label}
          </label>
          {question.microcopy && (
            <p className="text-txt-muted text-sm mb-4">{question.microcopy}</p>
          )}
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                onClick={() => onChange(num)}
                className="flex-1 py-4 rounded-xl font-bold transition-all flex flex-col items-center gap-1"
                style={{
                  background: value === num ? '#00d9ff' : 'rgba(30, 30, 30, 0.8)',
                  color: value === num ? '#001018' : '#ffffff',
                  border: value === num ? '1px solid #00d9ff' : '1px solid rgba(0, 217, 255, 0.3)',
                  boxShadow: value === num ? '0 0 15px rgba(0, 217, 255, 0.4)' : 'none',
                }}
              >
                <span className="text-xl">{num}</span>
                <span className="text-[10px] font-normal opacity-70">
                  {question.labels?.[num - 1]}
                </span>
              </button>
            ))}
          </div>
        </div>
      );

    case 'yesno':
      return (
        <div>
          <label className="block text-lg font-medium text-txt mb-4">
            {question.label}
          </label>
          <div className="grid grid-cols-2 gap-4">
            {[
              { val: true, label: 'Yes' },
              { val: false, label: 'No' },
            ].map(({ val, label }) => (
              <button
                key={label}
                onClick={() => onChange(val)}
                className="px-6 py-4 rounded-xl font-semibold transition-all"
                style={{
                  background: value === val ? '#00d9ff' : 'rgba(30, 30, 30, 0.8)',
                  color: value === val ? '#001018' : '#ffffff',
                  border: value === val ? '1px solid #00d9ff' : '1px solid rgba(0, 217, 255, 0.3)',
                  boxShadow: value === val ? '0 0 15px rgba(0, 217, 255, 0.4)' : 'none',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      );

    case 'multiselect':
      const selected = value || [];
      return (
        <div>
          <label className="block text-lg font-medium text-txt mb-2">
            {question.label}
          </label>
          {question.microcopy && (
            <p className="text-txt-muted text-sm mb-4">{question.microcopy}</p>
          )}
          <div className="grid grid-cols-2 gap-3">
            {question.options.map((opt) => {
              const isSelected = selected.includes(opt);
              const isNone = opt === 'None';

              return (
                <button
                  key={opt}
                  onClick={() => {
                    if (isNone) {
                      onChange(['None']);
                    } else {
                      if (isSelected) {
                        onChange(selected.filter(s => s !== opt));
                      } else {
                        onChange([...selected.filter(s => s !== 'None'), opt]);
                      }
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all text-left"
                  style={{
                    background: isSelected ? 'rgba(0, 217, 255, 0.2)' : 'rgba(30, 30, 30, 0.8)',
                    color: '#ffffff',
                    border: isSelected ? '1px solid #00d9ff' : '1px solid rgba(0, 217, 255, 0.3)',
                  }}
                >
                  <div
                    className="w-5 h-5 rounded flex items-center justify-center"
                    style={{
                      background: isSelected ? '#00d9ff' : 'transparent',
                      border: isSelected ? 'none' : '2px solid rgba(0, 217, 255, 0.5)',
                    }}
                  >
                    {isSelected && <Check size={14} className="text-[#001018]" />}
                  </div>
                  <span className="text-sm">{opt}</span>
                </button>
              );
            })}
          </div>
        </div>
      );

    default:
      return null;
  }
}

// Loading Screen Component
function LoadingScreen() {
  const [loadingText, setLoadingText] = useState('Analyzing performance baseline...');

  useEffect(() => {
    const texts = [
      'Analyzing performance baseline...',
      'Calculating recovery metrics...',
      'Generating personalized recommendations...',
    ];
    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % texts.length;
      setLoadingText(texts[index]);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="text-center">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div
            className="absolute inset-0 rounded-full border-4 border-accent/20"
          />
          <div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-accent animate-spin"
          />
        </div>
        <p className="text-txt-muted text-lg animate-pulse">
          {loadingText}
        </p>
      </div>
    </div>
  );
}

// Results Page Component
function ResultsPage({
  scores,
  responses,
  recommendations,
  aiInsights,
  onAddToCart,
  isAddingToCart,
  addedToCart,
  email,
  setEmail,
  emailSubmitted,
  onEmailSubmit,
}) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const scoreRef = useRef(null);

  // Animate score count-up
  useEffect(() => {
    const duration = 1500;
    const startTime = Date.now();
    const targetScore = scores.total;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedScore(Math.round(targetScore * easeOut));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [scores.total]);

  // Get score label
  const getScoreLabel = (score) => {
    if (score <= 40) return 'High Optimization Potential';
    if (score <= 60) return 'Moderate Optimization Needed';
    if (score <= 75) return 'Good Foundation';
    if (score <= 85) return 'Strong Profile';
    return 'Elite Optimization';
  };

  // Calculate untapped potential
  const untappedPotential = 100 - scores.total;

  return (
    <div className="min-h-screen bg-bg py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Score Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <p className="text-accent text-sm font-medium uppercase tracking-wider mb-2">
            Your Supplement Optimization Score
          </p>

          {/* Circular Score Display */}
          <div className="relative w-48 h-48 mx-auto mb-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="rgba(0, 217, 255, 0.1)"
                strokeWidth="8"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="#00d9ff"
                strokeWidth="8"
                strokeDasharray={`${(animatedScore / 100) * 553} 553`}
                strokeLinecap="round"
                style={{
                  filter: 'drop-shadow(0 0 10px rgba(0, 217, 255, 0.5))',
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                ref={scoreRef}
                className="text-6xl font-bold text-txt"
                style={{ textShadow: '0 0 20px rgba(0, 217, 255, 0.3)' }}
              >
                {animatedScore}
              </span>
              <span className="text-txt-muted text-lg">/100</span>
            </div>
          </div>

          <p className="text-xl font-semibold text-txt mb-2">
            {getScoreLabel(scores.total)}
          </p>
          <p className="text-accent">
            You're leaving <span className="font-bold">{untappedPotential}%</span> of your recovery potential untapped.
          </p>
        </motion.div>

        {/* Performance Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 mb-8"
          style={{
            background: 'rgba(30, 30, 30, 0.9)',
            border: '1px solid rgba(0, 217, 255, 0.3)',
          }}
        >
          <h3 className="text-lg font-semibold text-txt mb-4">Performance Breakdown</h3>

          <div className="space-y-4">
            {[
              { icon: BedDouble, label: 'Sleep & Recovery', score: scores.sleep, max: 25 },
              { icon: Battery, label: 'Energy Output', score: scores.energy, max: 20 },
              { icon: Heart, label: 'Stress Management', score: scores.stress, max: 20 },
              { icon: Target, label: 'Goal Alignment', score: scores.goalAlignment, max: 20 },
              { icon: Calendar, label: 'Training Load', score: scores.trainingLoad, max: 15 },
            ].map(({ icon: Icon, label, score, max }) => (
              <div key={label} className="flex items-center gap-4">
                <Icon size={20} className="text-accent flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-txt-muted">{label}</span>
                    <span className="text-txt font-medium">{score}/{max}</span>
                  </div>
                  <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(score / max) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                      className="h-full bg-accent rounded-full"
                      style={{ boxShadow: '0 0 10px rgba(0, 217, 255, 0.5)' }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* AI Insights */}
        {aiInsights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6 mb-8"
            style={{
              background: 'rgba(30, 30, 30, 0.9)',
              border: '1px solid rgba(0, 217, 255, 0.3)',
            }}
          >
            <h3 className="text-lg font-semibold text-txt mb-4 flex items-center gap-2">
              <Brain size={20} className="text-accent" />
              AI-Powered Insights
            </h3>

            <div className="space-y-3">
              {aiInsights.map((insight, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-bg-elevated border border-glass-border"
                >
                  <p className="text-txt-secondary text-sm leading-relaxed">
                    {insight}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recommended Products */}
        {recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <h3 className="text-xl font-semibold text-txt mb-4 text-center">
              Your Personalized Stack
            </h3>

            <div className="space-y-4 mb-6">
              {recommendations.map((product, idx) => (
                <div
                  key={idx}
                  className="glass-card p-4 flex items-center gap-4"
                  style={{
                    background: 'rgba(30, 30, 30, 0.9)',
                    border: '1px solid rgba(0, 217, 255, 0.3)',
                  }}
                >
                  {product.image ? (
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-white flex-shrink-0">
                      <Image
                        src={product.image}
                        alt={product.title}
                        width={80}
                        height={80}
                        className="w-full h-full object-contain"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-lg bg-bg-elevated flex items-center justify-center flex-shrink-0">
                      <span className="text-4xl opacity-30">💊</span>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-txt truncate">{product.title}</h4>
                    <p className="text-accent font-bold text-lg">${product.price?.toFixed(2)}</p>
                    <p className="text-txt-muted text-sm mt-1 line-clamp-2">
                      {product.reasoning}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={onAddToCart}
              disabled={isAddingToCart || addedToCart}
              className="w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all"
              style={{
                background: addedToCart
                  ? 'rgba(16, 185, 129, 0.9)'
                  : 'linear-gradient(135deg, #00d9ff, #00b8d4)',
                color: '#001018',
                boxShadow: '0 0 30px rgba(0, 217, 255, 0.5)',
              }}
            >
              {isAddingToCart ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#001018] border-t-transparent rounded-full animate-spin" />
                  Adding to Cart...
                </>
              ) : addedToCart ? (
                <>
                  <Check size={24} />
                  Stack Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingCart size={24} />
                  Add My Stack to Cart
                </>
              )}
            </button>

            <p className="text-center text-txt-muted text-sm mt-3">
              Free shipping on all orders
            </p>
          </motion.div>
        )}

        {/* Optional Email Capture */}
        {!emailSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="glass-card p-6"
            style={{
              background: 'rgba(30, 30, 30, 0.9)',
              border: '1px solid rgba(0, 217, 255, 0.2)',
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Mail size={20} className="text-accent" />
              <h3 className="font-semibold text-txt">Want your complete performance report?</h3>
            </div>
            <p className="text-txt-muted text-sm mb-4">
              Get your detailed breakdown + supplement timing guide sent to your inbox
            </p>
            <form onSubmit={onEmailSubmit} className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl bg-bg-elevated border border-glass-border text-txt placeholder-txt-muted focus:border-accent focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl font-semibold transition-all"
                style={{
                  background: '#00d9ff',
                  color: '#001018',
                }}
              >
                Send
              </button>
            </form>
          </motion.div>
        )}

        {emailSubmitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 text-center"
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
            }}
          >
            <Check size={32} className="text-success mx-auto mb-2" />
            <p className="text-txt font-semibold">Report sent to your inbox!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Helper functions
function generateHeightOptions() {
  const options = [];
  for (let feet = 4; feet <= 7; feet++) {
    for (let inches = 0; inches < 12; inches++) {
      if (feet === 7 && inches > 0) break;
      options.push(`${feet}'${inches}"`);
    }
  }
  return options;
}

function generateWeightOptions() {
  const options = [];
  for (let weight = 90; weight <= 400; weight += 5) {
    options.push(`${weight} lbs`);
  }
  return options;
}

// Product recommendation logic
function generateRecommendations(responses, shopifyProducts) {
  const recommendations = [];

  // Priority-based product selection (1-2 max)
  // Priority 1: Poor Sleep
  if (responses.sleepQuality <= 2) {
    const sleepProduct = findProduct(shopifyProducts, ['sleep', 'melatonin']);
    if (sleepProduct) {
      recommendations.push({
        ...sleepProduct,
        reasoning: 'Your low sleep score indicates suboptimal recovery and hormone production. Quality sleep is the foundation of all physical adaptation.',
      });
    }
  }
  // Priority 2: High Stress
  else if (responses.stressLevel >= 4) {
    const stressProduct = findProduct(shopifyProducts, ['ashwagandha', 'magnesium']);
    if (stressProduct) {
      recommendations.push({
        ...stressProduct,
        reasoning: 'High stress elevates cortisol which impairs muscle recovery and adaptation. Stress management is critical for your goals.',
      });
    }
  }
  // Priority 3: Low Energy
  else if (responses.energyLevel <= 2) {
    const creatine = findProduct(shopifyProducts, ['creatine']);
    if (creatine) {
      recommendations.push({
        ...creatine,
        reasoning: 'Low energy indicates metabolic inefficiency. Creatine supports ATP production for sustained energy output.',
      });
    }

    const multi = findProduct(shopifyProducts, ['multivitamin', 'multi']);
    if (multi && recommendations.length < 2) {
      recommendations.push({
        ...multi,
        reasoning: 'A comprehensive multivitamin covers potential nutrient gaps that may be contributing to low energy.',
      });
    }
  }
  // Priority 4: Muscle Building
  else if (responses.primaryGoal === 'Build Muscle & Strength' && responses.sleepQuality >= 3) {
    const creatine = findProduct(shopifyProducts, ['creatine']);
    if (creatine) {
      recommendations.push({
        ...creatine,
        reasoning: 'Creatine is the most researched supplement for strength and muscle gains. Essential for your muscle-building goals.',
      });
    }

    const protein = findProduct(shopifyProducts, ['whey', 'protein']);
    if (protein && recommendations.length < 2) {
      recommendations.push({
        ...protein,
        reasoning: 'High-quality protein supports muscle protein synthesis for optimal recovery and growth.',
      });
    }
  }
  // Priority 5: Fat Loss
  else if (responses.primaryGoal === 'Burn Fat & Lean Out') {
    const omega = findProduct(shopifyProducts, ['omega', 'fish oil']);
    if (omega) {
      recommendations.push({
        ...omega,
        reasoning: 'Omega-3s support metabolic function and help maintain muscle mass during caloric deficit.',
      });
    }

    const multi = findProduct(shopifyProducts, ['multivitamin', 'multi']);
    if (multi && recommendations.length < 2) {
      recommendations.push({
        ...multi,
        reasoning: 'Cover nutritional gaps that may occur during reduced calorie intake.',
      });
    }
  }
  // Priority 6: Focus & Clarity
  else if (responses.primaryGoal === 'Boost Focus & Clarity') {
    const multi = findProduct(shopifyProducts, ['multivitamin', 'multi']);
    if (multi) {
      recommendations.push({
        ...multi,
        reasoning: 'Essential nutrients support neurotransmitter production and cognitive function.',
      });
    }

    const omega = findProduct(shopifyProducts, ['omega', 'fish oil']);
    if (omega && recommendations.length < 2) {
      recommendations.push({
        ...omega,
        reasoning: 'Omega-3 fatty acids are crucial for brain health and mental clarity.',
      });
    }
  }
  // Priority 7: Endurance
  else if (responses.primaryGoal === 'Increase Endurance') {
    const creatine = findProduct(shopifyProducts, ['creatine']);
    if (creatine) {
      recommendations.push({
        ...creatine,
        reasoning: 'Creatine supports ATP production and cellular energy during sustained activity.',
      });
    }
  }
  // Default
  else {
    const multi = findProduct(shopifyProducts, ['multivitamin', 'multi']);
    if (multi) {
      recommendations.push({
        ...multi,
        reasoning: 'A comprehensive multivitamin covers nutritional gaps for baseline health optimization.',
      });
    }
  }

  return recommendations.slice(0, 2); // Max 2 products
}

// Find product by keywords
function findProduct(products, keywords) {
  if (!products || products.length === 0) return null;

  for (const product of products) {
    const titleLower = product.title.toLowerCase();
    const descLower = (product.description || '').toLowerCase();

    for (const keyword of keywords) {
      if (titleLower.includes(keyword.toLowerCase()) || descLower.includes(keyword.toLowerCase())) {
        return {
          title: product.title,
          price: product.price,
          image: product.image,
          variantId: product.variantId,
          available: product.available,
        };
      }
    }
  }

  return null;
}
