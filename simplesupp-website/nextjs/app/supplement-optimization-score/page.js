'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ChevronRight, ChevronLeft, Check, ShoppingCart, Mail,
  Dumbbell, Flame, Moon, Brain, Zap, Activity,
  BedDouble, Battery, Heart, Target, Calendar, Info,
  TrendingUp, TrendingDown, Minus, Sparkles, Plus,
  ChevronDown, ChevronUp, ExternalLink
} from 'lucide-react';
import Image from 'next/image';
import { fetchShopifyProducts, addMultipleToCart, addToCart } from '../lib/shopify';

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

// Population averages (hardcoded benchmarks)
const POPULATION_AVERAGES = {
  sleep: 15,      // /25
  energy: 12,     // /20
  stress: 12,     // /20
  goalAlignment: 12, // /20
  trainingLoad: 8,   // /15
  total: 60,      // /100 (6.0/10)
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
  const [specialAIPick, setSpecialAIPick] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [shopifyProducts, setShopifyProducts] = useState([]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [addedIndividual, setAddedIndividual] = useState({});

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

    // Get AI insights (enhanced)
    try {
      const insightsResponse = await fetch('/api/ai/optimization-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          responses,
          scores: calculatedScores,
          recommendations: recs.map(r => r.title),
          shopifyProducts: shopifyProducts.map(p => ({ title: p.title, price: p.price })),
        }),
      });

      if (insightsResponse.ok) {
        const data = await insightsResponse.json();
        if (data.insights) {
          setAiInsights(data.insights);
        }
        if (data.specialPick) {
          // Find the product from shopify
          const specialProduct = findProduct(shopifyProducts, [data.specialPick.productKeyword]);
          if (specialProduct) {
            setSpecialAIPick({
              ...specialProduct,
              reasoning: data.specialPick.reasoning,
            });
          }
        }
        // Update recommendations with personalized reasons
        if (data.productReasons && recs.length > 0) {
          const updatedRecs = recs.map((rec, idx) => ({
            ...rec,
            reasoning: data.productReasons[idx] || rec.reasoning,
          }));
          setRecommendations(updatedRecs);
        }
      }
    } catch (error) {
      console.error('Error getting AI insights:', error);
      // Fallback insights
      setAiInsights({
        overallAssessment: totalScore >= 75 ? 'above' : totalScore >= 50 ? 'average' : 'below',
        biggestStrength: {
          category: 'Training Consistency',
          text: `Your training frequency shows strong commitment to your fitness goals.`,
        },
        primaryGap: {
          category: 'Sleep Recovery',
          text: `Your sleep quality score of ${responses.sleepQuality}/5 indicates room for optimization.`,
        },
        keyOpportunity: `Improving sleep could boost your score by an estimated ${Math.min(2.5, (5 - responses.sleepQuality) * 0.5).toFixed(1)} points.`,
        insights: [
          `Your sleep quality score of ${responses.sleepQuality}/5 indicates room for recovery optimization.`,
          `With ${responses.trainingFrequency} training, your supplement timing should align with recovery windows.`,
          `Focus on addressing your primary gap to unlock ${100 - totalScore}% more potential.`,
        ],
      });
    }

    // Simulate loading for premium feel
    setTimeout(() => {
      setIsCalculating(false);
      setShowResults(true);
    }, 2500);
  };

  // Add recommended products to cart
  const handleAddToCart = async () => {
    if (recommendations.length === 0 && !specialAIPick) return;

    setIsAddingToCart(true);

    try {
      const itemsToAdd = [
        ...recommendations.filter(rec => rec.variantId).map(rec => ({
          variantId: rec.variantId,
          quantity: 1,
        })),
      ];

      if (specialAIPick?.variantId) {
        itemsToAdd.push({ variantId: specialAIPick.variantId, quantity: 1 });
      }

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

  // Add individual product to cart
  const handleAddIndividual = async (product) => {
    if (!product.variantId || addedIndividual[product.title]) return;

    try {
      await addToCart(product.variantId, 1);
      setAddedIndividual(prev => ({ ...prev, [product.title]: true }));
    } catch (error) {
      console.error('Error adding to cart:', error);
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
        specialAIPick={specialAIPick}
        aiInsights={aiInsights}
        onAddToCart={handleAddToCart}
        onAddIndividual={handleAddIndividual}
        isAddingToCart={isAddingToCart}
        addedToCart={addedToCart}
        addedIndividual={addedIndividual}
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
    <div className="min-h-screen relative py-8 px-4">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/images/stack/stack-background.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
            style={{
              background: 'rgba(0, 217, 255, 0.1)',
              border: '1px solid rgba(0, 217, 255, 0.2)',
            }}
          >
            <Sparkles size={16} className="text-accent" />
            <span className="text-accent text-sm font-medium">AI-Powered Analysis</span>
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold text-txt mb-2">
            Supplement Optimization Score
          </h1>
          <p className="text-txt-muted text-sm">
            Discover your personalized supplement stack in 60 seconds
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
              className="h-full bg-gradient-to-r from-accent to-cyan-400"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
              style={{ boxShadow: '0 0 10px rgba(0, 217, 255, 0.5)' }}
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
              background: 'rgba(20, 20, 25, 0.9)',
              border: '1px solid rgba(0, 217, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 217, 255, 0.1) inset',
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
              background: isCurrentAnswered() ? 'linear-gradient(135deg, #00d9ff, #00b8d4)' : 'rgba(0, 217, 255, 0.3)',
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
                  background: value === opt ? 'linear-gradient(135deg, #00d9ff, #00b8d4)' : 'rgba(30, 30, 30, 0.8)',
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
                    background: isSelected ? 'linear-gradient(135deg, #00d9ff, #00b8d4)' : 'rgba(30, 30, 30, 0.8)',
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
                    background: isSelected ? 'linear-gradient(135deg, #00d9ff, #00b8d4)' : 'rgba(30, 30, 30, 0.8)',
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
                  background: value === num ? 'linear-gradient(135deg, #00d9ff, #00b8d4)' : 'rgba(30, 30, 30, 0.8)',
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
                  background: value === val ? 'linear-gradient(135deg, #00d9ff, #00b8d4)' : 'rgba(30, 30, 30, 0.8)',
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
      'Comparing to population data...',
      'Generating personalized recommendations...',
    ];
    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % texts.length;
      setLoadingText(texts[index]);
    }, 600);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/images/stack/stack-background.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="text-center relative z-10">
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'conic-gradient(from 0deg, transparent, #00d9ff, transparent)',
              animation: 'spin 1.5s linear infinite',
            }}
          />
          <div className="absolute inset-2 rounded-full bg-bg flex items-center justify-center">
            <Sparkles className="text-accent" size={32} />
          </div>
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
  specialAIPick,
  aiInsights,
  onAddToCart,
  onAddIndividual,
  isAddingToCart,
  addedToCart,
  addedIndividual,
  email,
  setEmail,
  emailSubmitted,
  onEmailSubmit,
}) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showScoreExplanation, setShowScoreExplanation] = useState(false);
  const scoreRef = useRef(null);

  // Convert score to 0-10 scale
  const displayScore = (scores.total / 10).toFixed(1);
  const avgDisplayScore = (POPULATION_AVERAGES.total / 10).toFixed(1);

  // Animate score count-up
  useEffect(() => {
    const duration = 1500;
    const startTime = Date.now();
    const targetScore = parseFloat(displayScore);

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedScore((targetScore * easeOut).toFixed(1));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [displayScore]);

  // Get score label
  const getScoreLabel = (score) => {
    if (score < 5.0) return 'High Optimization Potential';
    if (score < 6.0) return 'Moderate Optimization Needed';
    if (score < 7.5) return 'Good Foundation';
    if (score < 8.5) return 'Strong Profile';
    return 'Elite Optimization';
  };

  // Get comparison status
  const getComparisonStatus = (userScore, avgScore, threshold = 3) => {
    if (userScore > avgScore + threshold) return { text: 'Above Average', color: '#10b981', icon: TrendingUp };
    if (userScore < avgScore - threshold) return { text: 'Below Average', color: '#f59e0b', icon: TrendingDown };
    return { text: 'Average', color: '#6b7280', icon: Minus };
  };

  // Overall assessment
  const overallAssessment = aiInsights?.overallAssessment || (scores.total >= 75 ? 'above' : scores.total >= 50 ? 'average' : 'below');

  const assessmentConfig = {
    above: { text: 'Above Average', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
    average: { text: 'Average', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)' },
    below: { text: 'Below Average', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
  };

  const assessment = assessmentConfig[overallAssessment];

  // Calculate percentile (simplified)
  const percentile = Math.min(99, Math.max(1, Math.round(scores.total * 0.9 + 10)));

  return (
    <div className="min-h-screen relative py-8 px-4">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/images/stack/stack-background.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Score Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <p className="text-accent text-sm font-medium uppercase tracking-wider mb-2">
            Your Supplement Optimization Score
          </p>

          {/* Circular Score Display */}
          <div className="relative w-52 h-52 mx-auto mb-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="104"
                cy="104"
                r="94"
                fill="none"
                stroke="rgba(0, 217, 255, 0.1)"
                strokeWidth="10"
              />
              <circle
                cx="104"
                cy="104"
                r="94"
                fill="none"
                stroke="url(#scoreGradient)"
                strokeWidth="10"
                strokeDasharray={`${(scores.total / 100) * 590} 590`}
                strokeLinecap="round"
                style={{
                  filter: 'drop-shadow(0 0 10px rgba(0, 217, 255, 0.5))',
                }}
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00d9ff" />
                  <stop offset="100%" stopColor="#00b8d4" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                ref={scoreRef}
                className="text-6xl font-bold text-txt"
                style={{ textShadow: '0 0 20px rgba(0, 217, 255, 0.3)' }}
              >
                {animatedScore}
              </span>
              <span className="text-txt-muted text-xl">/10</span>
            </div>
          </div>

          <p className="text-xl font-semibold text-txt mb-2">
            {getScoreLabel(parseFloat(displayScore))}
          </p>
          <p className="text-txt-secondary text-sm mb-3">
            Population average: <span className="text-accent font-medium">{avgDisplayScore}/10</span>
          </p>

          {/* How is this calculated? */}
          <button
            onClick={() => setShowScoreExplanation(!showScoreExplanation)}
            className="inline-flex items-center gap-1 text-accent text-sm hover:underline"
          >
            <Info size={14} />
            How is this calculated?
            {showScoreExplanation ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {/* Score Explanation Dropdown */}
          <AnimatePresence>
            {showScoreExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 text-left"
              >
                <div
                  className="p-4 rounded-xl text-sm"
                  style={{
                    background: 'rgba(30, 30, 30, 0.9)',
                    border: '1px solid rgba(0, 217, 255, 0.2)',
                  }}
                >
                  <h4 className="font-semibold text-txt mb-3">Your Score Breakdown</h4>
                  <div className="space-y-2 text-txt-muted">
                    <p>Total Score: <span className="text-txt font-medium">{displayScore}/10</span></p>
                    <div className="pl-2 border-l-2 border-accent/30 space-y-1">
                      <p>Sleep & Recovery: {scores.sleep}/25 pts ({responses.sleepQuality}/5 input)</p>
                      <p>Energy Output: {scores.energy}/20 pts ({responses.energyLevel}/5 input)</p>
                      <p>Stress Management: {scores.stress}/20 pts ({responses.stressLevel}/5 stress, inverted)</p>
                      <p>Goal Alignment: {scores.goalAlignment}/20 pts (goal + training match)</p>
                      <p>Training Load: {scores.trainingLoad}/15 pts ({responses.trainingFrequency})</p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-glass-border">
                      <p>You're in the <span className="text-accent font-medium">{percentile}th percentile</span></p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Quick Analysis Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 mb-8"
          style={{
            background: 'rgba(20, 20, 25, 0.9)',
            border: '1px solid rgba(0, 217, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          }}
        >
          <h3 className="text-lg font-semibold text-txt mb-4 flex items-center gap-2">
            <Zap size={20} className="text-accent" />
            Your Quick Analysis
          </h3>

          <div className="space-y-4">
            {/* Overall Assessment Badge */}
            <div className="flex items-center justify-between">
              <span className="text-txt-muted">Overall Assessment</span>
              <span
                className="px-4 py-1.5 rounded-full font-semibold text-sm"
                style={{ background: assessment.bg, color: assessment.color }}
              >
                {assessment.text}
              </span>
            </div>

            {/* Biggest Strength */}
            <div className="p-3 rounded-lg" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={16} className="text-green-400" />
                <span className="text-green-400 font-medium text-sm">Biggest Strength</span>
              </div>
              <p className="text-txt text-sm">
                {aiInsights?.biggestStrength?.text || `Your ${findBiggestStrength(scores)} is your biggest asset, keeping you ahead of the curve.`}
              </p>
            </div>

            {/* Primary Gap */}
            <div className="p-3 rounded-lg" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown size={16} className="text-orange-400" />
                <span className="text-orange-400 font-medium text-sm">Primary Gap</span>
              </div>
              <p className="text-txt text-sm">
                {aiInsights?.primaryGap?.text || `${findPrimaryGap(scores, responses)} is limiting your recovery potential and adaptation.`}
              </p>
            </div>

            {/* Key Opportunity */}
            <div className="p-3 rounded-lg" style={{ background: 'rgba(0, 217, 255, 0.1)' }}>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={16} className="text-accent" />
                <span className="text-accent font-medium text-sm">Key Opportunity</span>
              </div>
              <p className="text-txt text-sm">
                {aiInsights?.keyOpportunity || `Addressing your primary gap could boost your score by an estimated ${calculatePotentialGain(scores, responses)} points.`}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Performance Breakdown with Population Comparisons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 mb-8"
          style={{
            background: 'rgba(20, 20, 25, 0.9)',
            border: '1px solid rgba(0, 217, 255, 0.2)',
          }}
        >
          <h3 className="text-lg font-semibold text-txt mb-4">Performance Breakdown</h3>

          <div className="space-y-5">
            {[
              { icon: BedDouble, label: 'Sleep & Recovery', score: scores.sleep, max: 25, avg: POPULATION_AVERAGES.sleep },
              { icon: Battery, label: 'Energy Output', score: scores.energy, max: 20, avg: POPULATION_AVERAGES.energy },
              { icon: Heart, label: 'Stress Management', score: scores.stress, max: 20, avg: POPULATION_AVERAGES.stress },
              { icon: Target, label: 'Goal Alignment', score: scores.goalAlignment, max: 20, avg: POPULATION_AVERAGES.goalAlignment },
              { icon: Calendar, label: 'Training Load', score: scores.trainingLoad, max: 15, avg: POPULATION_AVERAGES.trainingLoad },
            ].map(({ icon: Icon, label, score, max, avg }) => {
              const userPercent = (score / max) * 100;
              const avgPercent = (avg / max) * 100;
              const status = getComparisonStatus(score, avg, max * 0.15);
              const StatusIcon = status.icon;

              return (
                <div key={label}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon size={18} className="text-accent" />
                      <span className="text-txt-muted text-sm">{label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-txt font-medium text-sm">{score}/{max}</span>
                      <span
                        className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded"
                        style={{ color: status.color, background: `${status.color}20` }}
                      >
                        <StatusIcon size={12} />
                        {status.text}
                      </span>
                    </div>
                  </div>
                  <div className="relative h-3 bg-bg-elevated rounded-full overflow-hidden">
                    {/* User score bar */}
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${userPercent}%` }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="absolute h-full rounded-full"
                      style={{
                        background: 'linear-gradient(90deg, #00d9ff, #00b8d4)',
                        boxShadow: '0 0 10px rgba(0, 217, 255, 0.5)',
                      }}
                    />
                    {/* Population average marker */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5"
                      style={{
                        left: `${avgPercent}%`,
                        background: '#10b981',
                        boxShadow: '0 0 4px #10b981',
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-txt-muted">Your score</span>
                    <span className="text-[10px] text-green-400">Avg: {avg}/{max}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Recommended Products */}
        {(recommendations.length > 0 || specialAIPick) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <h3 className="text-xl font-semibold text-txt mb-4 text-center">
              Your Personalized Stack
            </h3>

            <div className="space-y-4 mb-6">
              {recommendations.map((product, idx) => (
                <ProductCard
                  key={idx}
                  product={product}
                  onAddToCart={() => onAddIndividual(product)}
                  isAdded={addedIndividual[product.title]}
                />
              ))}

              {/* Special AI Pick */}
              {specialAIPick && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <SpecialAIPickCard
                    product={specialAIPick}
                    onAddToCart={() => onAddIndividual(specialAIPick)}
                    isAdded={addedIndividual[specialAIPick.title]}
                  />
                </motion.div>
              )}
            </div>

            {/* Add All to Cart Button */}
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
                  Full Stack Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingCart size={24} />
                  Add Complete Stack to Cart ({recommendations.length + (specialAIPick ? 1 : 0)} items)
                </>
              )}
            </button>

            <p className="text-center text-txt-muted text-sm mt-3">
              Free shipping on orders over $50
            </p>
          </motion.div>
        )}

        {/* Enhanced Email Capture */}
        {!emailSubmitted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="glass-card p-6"
            style={{
              background: 'rgba(20, 20, 25, 0.9)',
              border: '1px solid rgba(0, 217, 255, 0.2)',
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Mail size={20} className="text-accent" />
              <h3 className="font-semibold text-txt">Want your complete performance report?</h3>
            </div>

            {/* Value Preview */}
            <div className="mb-4 p-4 rounded-lg" style={{ background: 'rgba(0, 217, 255, 0.05)' }}>
              <p className="text-accent text-sm font-medium mb-3">Your Complete Report Includes:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  'Detailed score breakdown with explanations',
                  'Personalized supplement timing guide',
                  'Progressive 30-day optimization roadmap',
                  'Comparison to your demographic benchmarks',
                  'AI-generated training recommendations',
                  'Exclusive member pricing alerts',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-txt-muted text-sm">
                    <Check size={14} className="text-accent flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

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
                  background: 'linear-gradient(135deg, #00d9ff, #00b8d4)',
                  color: '#001018',
                }}
              >
                Send
              </button>
            </form>
          </motion.div>
        ) : (
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

// Product Card Component
function ProductCard({ product, onAddToCart, isAdded }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="glass-card p-4 transition-all"
      style={{
        background: 'rgba(20, 20, 25, 0.9)',
        border: '1px solid rgba(0, 217, 255, 0.2)',
      }}
    >
      <div className="flex items-start gap-4">
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
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-semibold text-txt truncate">{product.title}</h4>
            <span className="text-accent font-bold text-lg whitespace-nowrap">${product.price?.toFixed(2)}</span>
          </div>

          <div className="mb-3">
            <p className="text-accent text-xs font-medium mb-1">Perfect For You Because:</p>
            <p className="text-txt-muted text-sm line-clamp-2">
              {product.reasoning}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart();
              }}
              disabled={isAdded}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: isAdded ? 'rgba(16, 185, 129, 0.2)' : 'rgba(0, 217, 255, 0.2)',
                color: isAdded ? '#10b981' : '#00d9ff',
                border: `1px solid ${isAdded ? 'rgba(16, 185, 129, 0.4)' : 'rgba(0, 217, 255, 0.4)'}`,
              }}
            >
              {isAdded ? (
                <>
                  <Check size={16} />
                  Added
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Add to Cart
                </>
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-txt-muted hover:text-txt transition-all"
              style={{
                background: expanded ? 'rgba(0, 217, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                border: expanded ? '1px solid rgba(0, 217, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {expanded ? 'Show Less' : 'Learn More'}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div
              className="mt-4 pt-4"
              style={{ borderTop: '1px solid rgba(0, 217, 255, 0.15)' }}
            >
              {product.description && (
                <div className="mb-3">
                  <p className="text-accent text-xs font-semibold uppercase tracking-wider mb-1">Description</p>
                  <p className="text-txt-muted text-sm leading-relaxed">{product.description}</p>
                </div>
              )}
              {product.ingredients && (
                <div className="mb-3">
                  <p className="text-accent text-xs font-semibold uppercase tracking-wider mb-1">Key Ingredients</p>
                  <p className="text-txt-muted text-sm leading-relaxed">{product.ingredients}</p>
                </div>
              )}
              {product.dosage && (
                <div className="mb-3">
                  <p className="text-accent text-xs font-semibold uppercase tracking-wider mb-1">Recommended Dosage</p>
                  <p className="text-txt-muted text-sm leading-relaxed">{product.dosage}</p>
                </div>
              )}
              {product.benefits && (
                <div className="mb-3">
                  <p className="text-accent text-xs font-semibold uppercase tracking-wider mb-1">Benefits</p>
                  <p className="text-txt-muted text-sm leading-relaxed">{product.benefits}</p>
                </div>
              )}
              {!product.description && !product.ingredients && !product.dosage && !product.benefits && (
                <div className="mb-3">
                  <p className="text-accent text-xs font-semibold uppercase tracking-wider mb-1">Product Details</p>
                  <p className="text-txt-muted text-sm leading-relaxed">
                    {product.reasoning || 'Premium supplement formulated to support your fitness goals.'}
                  </p>
                </div>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded(false);
                }}
                className="flex items-center gap-1 text-xs text-txt-muted hover:text-accent transition-colors mt-1"
              >
                <ChevronUp size={12} />
                Collapse
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Special AI Pick Card Component
function SpecialAIPickCard({ product, onAddToCart, isAdded }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-[2px]"
      style={{
        background: 'linear-gradient(135deg, #00d9ff, #00b8d4, #00d9ff, #00b8d4)',
        backgroundSize: '300% 300%',
        animation: 'shimmer 3s linear infinite',
      }}
    >
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <div
        className="rounded-2xl p-4"
        style={{
          background: 'rgba(10, 10, 15, 0.95)',
        }}
      >
        {/* Special Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.2), rgba(0, 184, 212, 0.2))',
              color: '#00d9ff',
              border: '1px solid rgba(0, 217, 255, 0.3)',
            }}
          >
            <Sparkles size={12} />
            Special AI Recommendation
          </span>
        </div>

        <div className="flex items-start gap-4">
          {product.image ? (
            <div className="w-24 h-24 rounded-lg overflow-hidden bg-white flex-shrink-0">
              <Image
                src={product.image}
                alt={product.title}
                width={96}
                height={96}
                className="w-full h-full object-contain"
                unoptimized
              />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-lg bg-bg-elevated flex items-center justify-center flex-shrink-0">
              <span className="text-5xl opacity-30">💊</span>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="font-bold text-txt text-lg">{product.title}</h4>
              <span className="text-accent font-bold text-xl whitespace-nowrap">${product.price?.toFixed(2)}</span>
            </div>

            <div className="mb-4">
              <p className="text-accent text-xs font-medium mb-1">AI Selected Because:</p>
              <p className="text-txt-secondary text-sm">
                {product.reasoning}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onAddToCart}
                disabled={isAdded}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all"
                style={{
                  background: isAdded ? 'rgba(16, 185, 129, 0.9)' : 'linear-gradient(135deg, #00d9ff, #00b8d4)',
                  color: '#001018',
                  boxShadow: isAdded ? 'none' : '0 0 20px rgba(0, 217, 255, 0.4)',
                }}
              >
                {isAdded ? (
                  <>
                    <Check size={18} />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Add to Cart
                  </>
                )}
              </button>
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center justify-center gap-1 px-4 py-2.5 rounded-lg font-medium text-txt-muted hover:text-txt transition-all"
                style={{
                  background: expanded ? 'rgba(0, 217, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                  border: expanded ? '1px solid rgba(0, 217, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                {expanded ? <ChevronUp size={16} /> : <Info size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div
                className="mt-4 pt-4"
                style={{ borderTop: '1px solid rgba(0, 217, 255, 0.15)' }}
              >
                {product.description && (
                  <div className="mb-3">
                    <p className="text-accent text-xs font-semibold uppercase tracking-wider mb-1">Description</p>
                    <p className="text-txt-muted text-sm leading-relaxed">{product.description}</p>
                  </div>
                )}
                {product.ingredients && (
                  <div className="mb-3">
                    <p className="text-accent text-xs font-semibold uppercase tracking-wider mb-1">Key Ingredients</p>
                    <p className="text-txt-muted text-sm leading-relaxed">{product.ingredients}</p>
                  </div>
                )}
                {product.dosage && (
                  <div className="mb-3">
                    <p className="text-accent text-xs font-semibold uppercase tracking-wider mb-1">Recommended Dosage</p>
                    <p className="text-txt-muted text-sm leading-relaxed">{product.dosage}</p>
                  </div>
                )}
                {product.benefits && (
                  <div className="mb-3">
                    <p className="text-accent text-xs font-semibold uppercase tracking-wider mb-1">Benefits</p>
                    <p className="text-txt-muted text-sm leading-relaxed">{product.benefits}</p>
                  </div>
                )}
                {!product.description && !product.ingredients && !product.dosage && !product.benefits && (
                  <div className="mb-3">
                    <p className="text-accent text-xs font-semibold uppercase tracking-wider mb-1">Product Details</p>
                    <p className="text-txt-muted text-sm leading-relaxed">
                      {product.reasoning || 'Premium supplement formulated to support your fitness goals.'}
                    </p>
                  </div>
                )}
                <button
                  onClick={() => setExpanded(false)}
                  className="flex items-center gap-1 text-xs text-txt-muted hover:text-accent transition-colors mt-1"
                >
                  <ChevronUp size={12} />
                  Collapse
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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

function findBiggestStrength(scores) {
  const categories = [
    { name: 'training consistency', score: scores.trainingLoad, max: 15 },
    { name: 'goal alignment', score: scores.goalAlignment, max: 20 },
    { name: 'stress management', score: scores.stress, max: 20 },
    { name: 'energy levels', score: scores.energy, max: 20 },
    { name: 'sleep quality', score: scores.sleep, max: 25 },
  ];

  const best = categories.reduce((max, cat) =>
    (cat.score / cat.max) > (max.score / max.max) ? cat : max
  );

  return best.name;
}

function findPrimaryGap(scores, responses) {
  const categories = [
    { name: 'Sleep quality', score: scores.sleep, max: 25, input: responses.sleepQuality },
    { name: 'Energy levels', score: scores.energy, max: 20, input: responses.energyLevel },
    { name: 'Stress management', score: scores.stress, max: 20, input: 6 - responses.stressLevel },
  ];

  const worst = categories.reduce((min, cat) =>
    (cat.score / cat.max) < (min.score / min.max) ? cat : min
  );

  return worst.name;
}

function calculatePotentialGain(scores, responses) {
  const sleepGap = 5 - responses.sleepQuality;
  const energyGap = 5 - responses.energyLevel;
  const stressGap = responses.stressLevel - 1;

  const maxGap = Math.max(sleepGap * 0.5, energyGap * 0.4, stressGap * 0.4);
  return Math.min(2.5, maxGap).toFixed(1);
}

// Product recommendation logic
function generateRecommendations(responses, shopifyProducts) {
  const recommendations = [];

  // Priority-based product selection (1-2 max)
  // Priority 1: Poor Sleep
  if (responses.sleepQuality <= 2) {
    const sleepProduct = findProduct(shopifyProducts, ['sleep', 'melatonin', 'magnesium']);
    if (sleepProduct) {
      recommendations.push({
        ...sleepProduct,
        reasoning: `Based on your sleep score of ${responses.sleepQuality}/5, this will help optimize your overnight recovery and REM cycles, which are currently limiting your adaptation.`,
      });
    }
  }
  // Priority 2: High Stress
  else if (responses.stressLevel >= 4) {
    const stressProduct = findProduct(shopifyProducts, ['ashwagandha', 'magnesium']);
    if (stressProduct) {
      recommendations.push({
        ...stressProduct,
        reasoning: `With your stress level at ${responses.stressLevel}/5, cortisol management is critical. This will help regulate your stress response and improve recovery.`,
      });
    }
  }
  // Priority 3: Low Energy
  else if (responses.energyLevel <= 2) {
    const creatine = findProduct(shopifyProducts, ['creatine']);
    if (creatine) {
      recommendations.push({
        ...creatine,
        reasoning: `Your energy score of ${responses.energyLevel}/5 indicates metabolic inefficiency. Creatine supports ATP production for sustained energy output throughout the day.`,
      });
    }
  }
  // Priority 4: Muscle Building
  else if (responses.primaryGoal === 'Build Muscle & Strength' && responses.sleepQuality >= 3) {
    const creatine = findProduct(shopifyProducts, ['creatine']);
    if (creatine) {
      recommendations.push({
        ...creatine,
        reasoning: `For your muscle-building goal with ${responses.trainingFrequency} training, creatine is the most researched supplement for strength gains.`,
      });
    }
  }
  // Priority 5: Fat Loss
  else if (responses.primaryGoal === 'Burn Fat & Lean Out') {
    const omega = findProduct(shopifyProducts, ['omega', 'fish oil']);
    if (omega) {
      recommendations.push({
        ...omega,
        reasoning: `Omega-3s support metabolic function and help maintain muscle mass during your fat loss phase.`,
      });
    }
  }
  // Priority 6: Focus & Clarity
  else if (responses.primaryGoal === 'Boost Focus & Clarity') {
    const multi = findProduct(shopifyProducts, ['multivitamin', 'multi']);
    if (multi) {
      recommendations.push({
        ...multi,
        reasoning: `Essential nutrients support neurotransmitter production and cognitive function for your focus goals.`,
      });
    }
  }
  // Priority 7: Endurance
  else if (responses.primaryGoal === 'Increase Endurance') {
    const creatine = findProduct(shopifyProducts, ['creatine']);
    if (creatine) {
      recommendations.push({
        ...creatine,
        reasoning: `For endurance athletes training ${responses.trainingFrequency}, creatine supports ATP production and cellular energy during sustained activity.`,
      });
    }
  }
  // Default
  else {
    const multi = findProduct(shopifyProducts, ['multivitamin', 'multi']);
    if (multi) {
      recommendations.push({
        ...multi,
        reasoning: `A comprehensive multivitamin covers nutritional gaps for baseline health optimization.`,
      });
    }
  }

  // Add second recommendation if we only have one
  if (recommendations.length === 1) {
    const existingTitles = recommendations.map(r => r.title.toLowerCase());

    // Try to add complementary product
    const complementary = [
      { keywords: ['protein', 'whey'], reasoning: `High-quality protein supports muscle protein synthesis for optimal recovery with your ${responses.trainingFrequency} training schedule.` },
      { keywords: ['omega', 'fish oil'], reasoning: `Omega-3 fatty acids reduce inflammation and support joint health for your active lifestyle.` },
      { keywords: ['vitamin d', 'd3'], reasoning: `Vitamin D supports immune function and bone health, especially important for athletes.` },
    ];

    for (const comp of complementary) {
      const product = findProduct(shopifyProducts, comp.keywords);
      if (product && !existingTitles.includes(product.title.toLowerCase())) {
        recommendations.push({
          ...product,
          reasoning: comp.reasoning,
        });
        break;
      }
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
