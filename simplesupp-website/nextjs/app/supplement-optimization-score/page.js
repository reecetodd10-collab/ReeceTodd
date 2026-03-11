'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
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
import { useSupabaseUser } from '../components/SupabaseAuthProvider';
import { trackEvent } from '@/lib/analytics';

// ─── Design system constants ───
const ACCENT = '#00ffcc';
const ACCENT_RGB = '0, 255, 204';
const CARD_BG = '#0a0a0a';
const CARD_BORDER = 'rgba(255,255,255,0.06)';
const URGENCY = '#ff2d55';
const PURPLE = '#a855f7';
const PURPLE_RGB = '168, 85, 247';
const OSWALD = 'var(--font-oswald), Oswald, sans-serif';
const SPACE_MONO = 'var(--font-space-mono), Space Mono, monospace';

// ─── Scroll-triggered fade-up wrapper ───
function FadeInSection({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Sticky Navigation ───
function StickyNav({ menuOpen, setMenuOpen }) {
  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: '#000000',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="max-w-[430px] mx-auto flex items-center justify-between px-4 py-3">
          <Link
            href="/home"
            className="no-underline"
            style={{
              fontFamily: OSWALD,
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.4em',
              color: ACCENT,
              textTransform: 'uppercase',
              textDecoration: 'none',
            }}
          >
            &#9673; Aviera
          </Link>

          {/* Desktop links - hidden */}
          <div className="hidden">
            {/* Nav links removed - use hamburger menu */}
          </div>

          {/* User icon + hamburger */}
          <div className="flex items-center gap-3">
            <Link
              href="/auth"
              className="flex items-center justify-center no-underline"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'transparent',
                color: '#ffffff',
                textDecoration: 'none',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </Link>
            <button
              className="flex flex-col gap-[5px] bg-transparent border-none cursor-pointer p-1"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <span className="block w-5 h-[2px] bg-white" />
              <span className="block w-5 h-[2px] bg-white" />
              <span className="block w-5 h-[2px] bg-white" />
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center"
          style={{ background: '#000000' }}
        >
          <button
            className="absolute top-4 right-4 bg-transparent border-none cursor-pointer"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            style={{ fontFamily: OSWALD, fontSize: '28px', color: '#fff' }}
          >
            &#10005;
          </button>

          <div className="flex flex-col items-center gap-8">
            {[
              { label: 'Shop', href: '/shop' },
              { label: 'Flow State X', href: '/nitric' },
              { label: 'Trybe', href: '/trybe' },
              { label: 'O.S.', href: '/supplement-optimization-score' },
              { label: 'About', href: '/about' },
              { label: 'Latest', href: '/news' },
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Sign In', href: '/auth' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily: OSWALD,
                  fontSize: '24px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#ffffff',
                  textDecoration: 'none',
                  letterSpacing: '0.1em',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

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
  const [menuOpen, setMenuOpen] = useState(false);

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
  const [resultId, setResultId] = useState(null);
  const { user: clerkUser } = useSupabaseUser();
  const isSignedIn = !!clerkUser;

  // Email capture
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  // Fetch Shopify products on mount
  useEffect(() => {
    fetchShopifyProducts()
      .then(products => setShopifyProducts(products))
      .catch(err => console.error('Error fetching products:', err));

    // Track quiz started
    trackEvent('optimization_quiz_started');
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
    trackEvent('optimization_quiz_completed', { goal: responses.primaryGoal });

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

    // Track final recs for Supabase save
    let finalRecs = [];

    // Get AI-powered recommendations + insights
    try {
      const insightsResponse = await fetch('/api/ai/optimization-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          responses,
          scores: calculatedScores,
          shopifyProducts: shopifyProducts.map(p => ({ title: p.title, price: p.price })),
        }),
      });

      if (insightsResponse.ok) {
        const data = await insightsResponse.json();
        if (data.insights) {
          setAiInsights(data.insights);
        }

        // Use AI-chosen product recommendations
        if (data.recommendedProducts && data.recommendedProducts.length > 0) {
          const aiRecs = [];
          for (const aiProd of data.recommendedProducts) {
            const matched = findProduct(shopifyProducts, [aiProd.productKeyword]);
            if (matched) {
              aiRecs.push({ ...matched, reasoning: aiProd.reasoning });
            }
          }
          if (aiRecs.length > 0) {
            finalRecs = aiRecs.slice(0, 2);
            setRecommendations(finalRecs);
          } else {
            finalRecs = generateRecommendations(responses, shopifyProducts);
            setRecommendations(finalRecs);
          }
        } else {
          finalRecs = generateRecommendations(responses, shopifyProducts);
          setRecommendations(finalRecs);
        }

        if (data.specialPick) {
          const specialProduct = findProduct(shopifyProducts, [data.specialPick.productKeyword]);
          if (specialProduct) {
            setSpecialAIPick({
              ...specialProduct,
              reasoning: data.specialPick.reasoning,
            });
          }
        }
      } else {
        // API call failed — fall back to rules
        finalRecs = generateRecommendations(responses, shopifyProducts);
        setRecommendations(finalRecs);
      }
    } catch (error) {
      console.error('Error getting AI insights:', error);
      // Fallback to rule-based recommendations
      finalRecs = generateRecommendations(responses, shopifyProducts);
      setRecommendations(finalRecs);
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

    // Save results to Supabase via API
    try {
      const saveResponse = await fetch('/api/optimization-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email || clerkUser?.primaryEmailAddress?.emailAddress,
          primary_goal: responses.primaryGoal,
          optimization_score: totalScore,
          primary_bottleneck: aiInsights?.primaryGap?.category || findPrimaryGap(calculatedScores, responses),
          inputs: responses,
          scores: calculatedScores,
          recommended_products: finalRecs.map(r => ({ title: r.title, price: r.price })),
        }),
      });

      if (saveResponse.ok) {
        const { id } = await saveResponse.json();
        setResultId(id);
        // Track score viewed
        trackEvent('score_viewed', { score: totalScore, result_id: id });
      }
    } catch (saveError) {
      console.error('Error saving results to database:', saveError);
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

    // PATCH added_to_cart
    if (resultId) {
      try {
        await fetch('/api/optimization-results', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: resultId, added_to_cart: true }),
        });
        trackEvent('add_to_cart_clicked', { type: 'full_stack', result_id: resultId });
      } catch (patchError) {
        console.error('Error updating added_to_cart:', patchError);
      }
    }
  };

  // Add individual product to cart
  const handleAddIndividual = async (product) => {
    if (!product.variantId || addedIndividual[product.title]) return;

    try {
      await addToCart(product.variantId, 1);
      setAddedIndividual(prev => ({ ...prev, [product.title]: true }));
      trackEvent('add_to_cart_clicked', { type: 'individual', product: product.title, result_id: resultId });
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
    trackEvent('email_submitted', { email });
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
        isSignedIn={isSignedIn}
        resultId={resultId}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />
    );
  }

  if (isCalculating) {
    return <LoadingScreen menuOpen={menuOpen} setMenuOpen={setMenuOpen} />;
  }

  const isLastQuestion = currentSection === sections.length - 1 && currentQuestion === currentSectionData.questions.length - 1;

  return (
    <div className="min-h-screen relative" style={{ background: '#000000', color: '#ffffff', overflowX: 'hidden' }}>
      {/* Scan line background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 204, 0.015) 2px, rgba(0, 255, 204, 0.015) 4px)',
        }}
      />

      <StickyNav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* Main content */}
      <div className="relative z-10 pt-20 pb-16 px-4">
        <div className="max-w-[430px] mx-auto">

          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p
                className="text-xs uppercase mb-4"
                style={{
                  color: ACCENT,
                  fontFamily: SPACE_MONO,
                  letterSpacing: '0.4em',
                }}
              >
                AI-POWERED ANALYSIS
              </p>
              <h1
                className="text-4xl sm:text-5xl font-bold uppercase mb-3 leading-tight"
                style={{ fontFamily: OSWALD }}
              >
                OPTIMIZATION <span style={{ color: URGENCY }}>SCORE</span>
              </h1>
              <p
                className="text-sm"
                style={{ color: '#666', fontFamily: SPACE_MONO, fontSize: '12px' }}
              >
                Find out how optimized you really are — 60 seconds
              </p>
            </motion.div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-xs mb-2" style={{ color: '#666', fontFamily: SPACE_MONO, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              <span>Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-1.5 overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <motion.div
                className="h-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.3 }}
                style={{ background: ACCENT, boxShadow: `0 0 10px rgba(${ACCENT_RGB}, 0.5)` }}
              />
            </div>
          </div>

          {/* Section Header */}
          <div className="mb-6">
            <p
              className="text-xs uppercase mb-2"
              style={{ color: PURPLE, fontFamily: SPACE_MONO, letterSpacing: '0.4em', fontSize: '11px' }}
            >
              SECTION {currentSection + 1} OF {sections.length}
            </p>
            <h2
              className="text-2xl font-bold uppercase mb-1"
              style={{ fontFamily: OSWALD }}
            >
              {currentSectionData.title}
            </h2>
            <p style={{ color: `rgba(${PURPLE_RGB}, 0.6)`, fontFamily: SPACE_MONO, fontSize: '12px' }}>
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
              className="p-6 mb-6"
              style={{
                background: CARD_BG,
                border: `1px solid ${CARD_BORDER}`,
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
              className="flex items-center gap-2 px-6 py-3 transition disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                fontFamily: SPACE_MONO,
                fontSize: '12px',
                color: '#666',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              <ChevronLeft size={18} />
              Back
            </button>

            <button
              onClick={goNext}
              disabled={!isCurrentAnswered()}
              className="flex items-center gap-2 px-8 py-4 font-bold uppercase tracking-widest transition disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                fontFamily: OSWALD,
                fontSize: '16px',
                background: isCurrentAnswered() ? ACCENT : 'rgba(255,255,255,0.06)',
                color: isCurrentAnswered() ? '#000000' : 'rgba(255,255,255,0.3)',
                clipPath: 'polygon(0 0, 100% 0, 96% 100%, 4% 100%)',
                border: 'none',
                cursor: isCurrentAnswered() ? 'pointer' : 'not-allowed',
                letterSpacing: '0.15em',
              }}
            >
              {isLastQuestion ? <><span style={{ color: isCurrentAnswered() ? '#000' : undefined }}>CALCULATE MY SCORE</span></> : 'CONTINUE'}
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
        <div className="max-w-[430px] mx-auto text-center">
          <p style={{ fontFamily: OSWALD, fontSize: '12px', fontWeight: 700, letterSpacing: '0.4em', color: ACCENT, marginBottom: '16px' }}>
            &#9673; AVIERA
          </p>
          <p style={{ fontFamily: SPACE_MONO, fontSize: '9px', color: '#444', marginBottom: '8px' }}>
            Manufactured in the USA in a GMP-certified facility.
          </p>
          <p style={{ fontFamily: SPACE_MONO, fontSize: '9px', color: '#333', marginBottom: '8px', fontStyle: 'italic' }}>
            *These statements have not been evaluated by the FDA. These products are not intended to diagnose, treat, cure, or prevent any disease.
          </p>
          <p style={{ fontFamily: SPACE_MONO, fontSize: '9px', color: '#333' }}>
            &copy; {new Date().getFullYear()} Aviera. All rights reserved.
          </p>
          <div className="flex justify-center gap-4 mt-3">
            <Link href="/terms" style={{ fontFamily: SPACE_MONO, fontSize: '9px', color: '#444', textTransform: 'uppercase', textDecoration: 'none' }}>Terms</Link>
            <Link href="/privacy" style={{ fontFamily: SPACE_MONO, fontSize: '9px', color: '#444', textTransform: 'uppercase', textDecoration: 'none' }}>Privacy</Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '12px' }}>
            <a href="https://instagram.com/avierafit" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ color: '#444', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#00ffcc'} onMouseLeave={e => e.currentTarget.style.color = '#444'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="https://tiktok.com/@avierafit" target="_blank" rel="noopener noreferrer" aria-label="TikTok" style={{ color: '#444', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#00ffcc'} onMouseLeave={e => e.currentTarget.style.color = '#444'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.98a8.21 8.21 0 0 0 4.76 1.52V7.05a4.84 4.84 0 0 1-1-.36z"/></svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Question Renderer Component ───
function QuestionRenderer({ question, value, onChange }) {
  if (!question) return null;

  // Shared button style helpers
  const selectedStyle = {
    background: ACCENT,
    color: '#000000',
    border: `1px solid ${ACCENT}`,
  };
  const unselectedStyle = {
    background: 'transparent',
    color: '#ffffff',
    border: `1px solid ${CARD_BORDER}`,
  };

  switch (question.type) {
    case 'dropdown':
      return (
        <div>
          <label
            className="block text-lg font-bold uppercase mb-4"
            style={{ fontFamily: OSWALD }}
          >
            {question.label}
          </label>
          {question.microcopy && (
            <p className="mb-4" style={{ color: `rgba(${PURPLE_RGB}, 0.6)`, fontFamily: SPACE_MONO, fontSize: '12px' }}>{question.microcopy}</p>
          )}
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-3 appearance-none cursor-pointer focus:outline-none"
            style={{
              background: CARD_BG,
              border: `1px solid ${value ? ACCENT : CARD_BORDER}`,
              color: '#ffffff',
              fontFamily: SPACE_MONO,
              fontSize: '13px',
            }}
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
          <label className="block text-lg font-bold uppercase mb-4" style={{ fontFamily: OSWALD }}>
            {question.label}
          </label>
          <div className="grid grid-cols-3 gap-3">
            {question.options.map((opt) => (
              <button
                key={opt}
                onClick={() => onChange(opt)}
                className="px-4 py-3 font-bold uppercase transition-all"
                style={{
                  fontFamily: OSWALD,
                  fontSize: '14px',
                  letterSpacing: '0.05em',
                  ...(value === opt ? selectedStyle : unselectedStyle),
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
          <label className="block text-lg font-bold uppercase mb-4" style={{ fontFamily: OSWALD }}>
            {question.label}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {question.options.map((opt, idx) => {
              const Icon = GOAL_ICONS[opt] || Target;
              const isSelected = value === opt;
              const iconColor = isSelected ? '#000000' : (idx % 2 === 1 ? PURPLE : ACCENT);
              return (
                <button
                  key={opt}
                  onClick={() => onChange(opt)}
                  className="flex items-center gap-3 px-4 py-4 font-medium transition-all text-left"
                  style={{
                    ...(isSelected ? selectedStyle : {
                      ...unselectedStyle,
                      borderColor: idx % 2 === 1 ? `rgba(${PURPLE_RGB}, 0.2)` : CARD_BORDER,
                    }),
                    fontFamily: SPACE_MONO,
                    fontSize: '11px',
                  }}
                >
                  <Icon size={22} style={{ color: iconColor }} />
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
        </div>
      );

    case 'training-buttons':
      return (
        <div>
          <label className="block text-lg font-bold uppercase mb-4" style={{ fontFamily: OSWALD }}>
            {question.label}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {question.options.map((opt, idx) => {
              const Icon = TRAINING_ICONS[opt] || Activity;
              const isSelected = value === opt;
              const iconColor = isSelected ? '#000000' : (idx % 2 === 1 ? PURPLE : ACCENT);
              return (
                <button
                  key={opt}
                  onClick={() => onChange(opt)}
                  className="flex items-center gap-3 px-4 py-4 font-medium transition-all text-left"
                  style={{
                    ...(isSelected ? selectedStyle : {
                      ...unselectedStyle,
                      borderColor: idx % 2 === 1 ? `rgba(${PURPLE_RGB}, 0.2)` : CARD_BORDER,
                    }),
                    fontFamily: SPACE_MONO,
                    fontSize: '11px',
                  }}
                >
                  <Icon size={22} style={{ color: iconColor }} />
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
        </div>
      );

    case 'scale':
      return (
        <div>
          <label className="block text-lg font-bold uppercase mb-2" style={{ fontFamily: OSWALD }}>
            {question.label}
          </label>
          {question.microcopy && (
            <p className="mb-4" style={{ color: `rgba(${PURPLE_RGB}, 0.6)`, fontFamily: SPACE_MONO, fontSize: '12px' }}>{question.microcopy}</p>
          )}
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                onClick={() => onChange(num)}
                className="flex-1 py-4 font-bold transition-all flex flex-col items-center gap-1"
                style={{
                  ...(value === num ? selectedStyle : unselectedStyle),
                  fontFamily: OSWALD,
                }}
              >
                <span className="text-xl">{num}</span>
                <span
                  className="font-normal"
                  style={{
                    fontSize: '9px',
                    opacity: 0.7,
                    fontFamily: SPACE_MONO,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
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
          <label className="block text-lg font-bold uppercase mb-4" style={{ fontFamily: OSWALD }}>
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
                className="px-6 py-4 font-bold uppercase transition-all"
                style={{
                  fontFamily: OSWALD,
                  fontSize: '16px',
                  letterSpacing: '0.1em',
                  ...(value === val ? selectedStyle : unselectedStyle),
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
          <label className="block text-lg font-bold uppercase mb-2" style={{ fontFamily: OSWALD }}>
            {question.label}
          </label>
          {question.microcopy && (
            <p className="mb-4" style={{ color: `rgba(${PURPLE_RGB}, 0.6)`, fontFamily: SPACE_MONO, fontSize: '12px' }}>{question.microcopy}</p>
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
                  className="flex items-center gap-2 px-4 py-3 font-medium transition-all text-left"
                  style={{
                    background: isSelected ? `rgba(${ACCENT_RGB}, 0.15)` : 'transparent',
                    color: '#ffffff',
                    border: isSelected ? `1px solid ${ACCENT}` : `1px solid ${CARD_BORDER}`,
                    fontFamily: SPACE_MONO,
                    fontSize: '11px',
                  }}
                >
                  <div
                    className="w-5 h-5 flex items-center justify-center flex-shrink-0"
                    style={{
                      background: isSelected ? ACCENT : 'transparent',
                      border: isSelected ? 'none' : `2px solid rgba(${ACCENT_RGB}, 0.3)`,
                    }}
                  >
                    {isSelected && <Check size={14} style={{ color: '#000000' }} />}
                  </div>
                  <span>{opt}</span>
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

// ─── Loading Screen Component ───
function LoadingScreen({ menuOpen, setMenuOpen }) {
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
    <div className="min-h-screen relative flex items-center justify-center" style={{ background: '#000000', color: '#ffffff' }}>
      {/* Scan line background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 204, 0.015) 2px, rgba(0, 255, 204, 0.015) 4px)',
        }}
      />

      <StickyNav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="text-center relative z-10 px-4">
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(from 0deg, transparent, ${PURPLE}, ${ACCENT}, transparent)`,
              animation: 'spin 1.5s linear infinite',
            }}
          />
          <div
            className="absolute inset-2 rounded-full flex items-center justify-center"
            style={{ background: '#000000' }}
          >
            <Sparkles style={{ color: ACCENT }} size={32} />
          </div>
        </div>
        <p
          className="text-lg animate-pulse"
          style={{ color: '#666', fontFamily: SPACE_MONO, fontSize: '13px' }}
        >
          {loadingText}
        </p>
      </div>
    </div>
  );
}

// ─── Results Page Component ───
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
  isSignedIn,
  resultId,
  menuOpen,
  setMenuOpen,
}) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showScoreExplanation, setShowScoreExplanation] = useState(false);
  const scoreRef = useRef(null);

  // Convert score to 0-10 scale
  const displayScore = (scores.total / 10).toFixed(1);
  const avgDisplayScore = (POPULATION_AVERAGES.total / 10).toFixed(1);

  // Score-based ring color: red for low, purple for mid, cyan for good
  const scoreRingColor = scores.total < 40 ? URGENCY : scores.total < 60 ? PURPLE : ACCENT;
  const scoreRingRGB = scores.total < 40 ? '255, 45, 85' : scores.total < 60 ? PURPLE_RGB : ACCENT_RGB;

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
    if (score < 5.0) return { text: 'HUGE UPSIDE AHEAD', color: URGENCY };
    if (score < 6.0) return { text: 'SOLID START — LET\'S BUILD', color: PURPLE };
    if (score < 7.5) return { text: 'STRONG FOUNDATION', color: '#ffffff' };
    if (score < 8.5) return { text: 'YOU\'RE CRUSHING IT', color: ACCENT };
    return { text: 'ELITE — TOP 10%', color: ACCENT };
  };

  // Get comparison status
  const getComparisonStatus = (userScore, avgScore, threshold = 3) => {
    if (userScore > avgScore + threshold) return { text: 'Above Avg', color: '#10b981', icon: TrendingUp };
    if (userScore < avgScore - threshold) return { text: 'Below Avg', color: URGENCY, icon: TrendingDown };
    return { text: 'Average', color: PURPLE, icon: Minus };
  };

  // Overall assessment
  const overallAssessment = aiInsights?.overallAssessment || (scores.total >= 75 ? 'above' : scores.total >= 50 ? 'average' : 'below');

  const assessmentConfig = {
    above: { text: 'Outstanding', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
    average: { text: 'Great Start', color: PURPLE, bg: `rgba(${PURPLE_RGB}, 0.15)` },
    below: { text: 'Room to Grow', color: URGENCY, bg: 'rgba(255, 45, 85, 0.15)' },
  };

  const assessment = assessmentConfig[overallAssessment];

  // Calculate percentile (simplified)
  const percentile = Math.min(99, Math.max(1, Math.round(scores.total * 0.9 + 10)));

  return (
    <div className="min-h-screen relative" style={{ background: '#000000', color: '#ffffff', overflowX: 'hidden' }}>
      {/* Scan line background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 204, 0.015) 2px, rgba(0, 255, 204, 0.015) 4px)',
        }}
      />

      <StickyNav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="relative z-10 pt-20 pb-16 px-4">
        <div className="max-w-[430px] mx-auto">

          {/* Score Hero */}
          <FadeInSection>
            <div className="text-center mb-10">
              <p
                className="text-xs uppercase mb-4"
                style={{ color: PURPLE, fontFamily: SPACE_MONO, letterSpacing: '0.4em' }}
              >
                YOUR O.S. IS IN
              </p>

              {/* Circular Score Display */}
              <div className="relative w-52 h-52 mx-auto mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="104"
                    cy="104"
                    r="94"
                    fill="none"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="10"
                  />
                  <circle
                    cx="104"
                    cy="104"
                    r="94"
                    fill="none"
                    stroke={scoreRingColor}
                    strokeWidth="10"
                    strokeDasharray={`${(scores.total / 100) * 590} 590`}
                    strokeLinecap="round"
                    style={{
                      filter: `drop-shadow(0 0 10px rgba(${scoreRingRGB}, 0.5))`,
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span
                    ref={scoreRef}
                    className="text-6xl font-bold"
                    style={{
                      fontFamily: OSWALD,
                      textShadow: `0 0 20px rgba(${scoreRingRGB}, 0.3)`,
                    }}
                  >
                    {animatedScore}
                  </span>
                  <span style={{ color: '#666', fontFamily: SPACE_MONO, fontSize: '18px' }}>/10</span>
                </div>
              </div>

              <h2
                className="text-2xl font-bold uppercase mb-2"
                style={{ fontFamily: OSWALD, color: getScoreLabel(parseFloat(displayScore)).color }}
              >
                {getScoreLabel(parseFloat(displayScore)).text}
              </h2>
              <p style={{ color: '#999', fontFamily: SPACE_MONO, fontSize: '12px' }}>
                You&apos;re in the top <span style={{ color: '#ff2d55', fontWeight: 700 }}>{100 - percentile}%</span> of optimizers
              </p>

              {/* How is this calculated? */}
              <button
                onClick={() => setShowScoreExplanation(!showScoreExplanation)}
                className="inline-flex items-center gap-1 mt-3 border-none bg-transparent cursor-pointer"
                style={{ color: ACCENT, fontFamily: SPACE_MONO, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
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
                    <div className="p-4" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
                      <h4 className="font-bold uppercase mb-3" style={{ fontFamily: OSWALD, fontSize: '16px' }}>
                        Your Score Breakdown
                      </h4>
                      <div className="space-y-2" style={{ fontFamily: SPACE_MONO, fontSize: '11px', color: '#999' }}>
                        <p>Total Score: <span style={{ color: '#fff', fontWeight: 700 }}>{displayScore}/10</span></p>
                        <div className="pl-2 space-y-1" style={{ borderLeft: `2px solid rgba(${ACCENT_RGB}, 0.3)` }}>
                          <p>Sleep & Recovery: {scores.sleep}/25 pts ({responses.sleepQuality}/5 input)</p>
                          <p>Energy Output: {scores.energy}/20 pts ({responses.energyLevel}/5 input)</p>
                          <p>Stress Management: {scores.stress}/20 pts ({responses.stressLevel}/5 stress, inverted)</p>
                          <p>Goal Alignment: {scores.goalAlignment}/20 pts (goal + training match)</p>
                          <p>Training Load: {scores.trainingLoad}/15 pts ({responses.trainingFrequency})</p>
                        </div>
                        <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
                          <p>You&apos;re in the <span style={{ color: ACCENT, fontWeight: 700 }}>{percentile}th percentile</span></p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </FadeInSection>

          {/* Fastest Performance Win Section */}
          <FadeInSection delay={0.1}>
            <section className="mb-10" style={{ borderTop: `1px solid ${CARD_BORDER}`, paddingTop: '32px' }}>
              <p
                className="text-xs uppercase mb-3"
                style={{ color: PURPLE, fontFamily: SPACE_MONO, letterSpacing: '0.4em', fontSize: '11px' }}
              >
                YOUR FASTEST WIN
              </p>
              <h2
                className="text-3xl font-bold uppercase mb-8"
                style={{ fontFamily: OSWALD }}
              >
                PERFORMANCE <span style={{ color: URGENCY }}>UNLOCK</span>
              </h2>

              {/* Diagnosis */}
              <div className="grid grid-cols-1 gap-4 mb-8">
                <div className="p-5" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingDown size={16} style={{ color: URGENCY }} />
                    <span
                      className="font-bold uppercase"
                      style={{ color: URGENCY, fontFamily: SPACE_MONO, fontSize: '10px', letterSpacing: '0.2em' }}
                    >
                      Primary Bottleneck
                    </span>
                  </div>
                  <h4 className="text-xl font-bold uppercase mb-2" style={{ fontFamily: OSWALD }}>
                    {aiInsights?.primaryGap?.category || findPrimaryGap(scores, responses)}
                  </h4>
                  <p style={{ color: '#666', fontFamily: SPACE_MONO, fontSize: '12px', lineHeight: 1.6 }}>
                    {aiInsights?.primaryGap?.text || `This is the single biggest factor currently limiting your ${responses.primaryGoal.toLowerCase()} potential.`}
                  </p>
                </div>

                <div className="p-5" style={{ background: CARD_BG, border: `1px solid rgba(${ACCENT_RGB}, 0.15)` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Target size={16} style={{ color: ACCENT }} />
                    <span
                      className="font-bold uppercase"
                      style={{ color: ACCENT, fontFamily: SPACE_MONO, fontSize: '10px', letterSpacing: '0.2em' }}
                    >
                      Optimization Target
                    </span>
                  </div>
                  <h4 className="text-xl font-bold uppercase mb-2" style={{ fontFamily: OSWALD }}>
                    {responses.primaryGoal}
                  </h4>
                  <p style={{ color: '#666', fontFamily: SPACE_MONO, fontSize: '12px', lineHeight: 1.6 }}>
                    Addressing your primary bottleneck unlocks up to {calculatePotentialGain(scores, responses)} additional points in this category.
                  </p>
                </div>
              </div>

              {/* Recommendations */}
              <div className="space-y-4 mb-8">
                {recommendations.map((product, idx) => (
                  <FadeInSection key={idx} delay={idx * 0.1}>
                    <ProductCard
                      product={product}
                      onAddToCart={() => onAddIndividual(product)}
                      isAdded={addedIndividual[product.title]}
                    />
                  </FadeInSection>
                ))}

                {specialAIPick && (
                  <FadeInSection delay={recommendations.length * 0.1}>
                    <SpecialAIPickCard
                      product={specialAIPick}
                      onAddToCart={() => onAddIndividual(specialAIPick)}
                      isAdded={addedIndividual[specialAIPick.title]}
                    />
                  </FadeInSection>
                )}
              </div>

              {/* Primary CTA */}
              <button
                onClick={onAddToCart}
                disabled={isAddingToCart || addedToCart}
                className="w-full py-5 px-10 font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-all"
                style={{
                  fontFamily: OSWALD,
                  fontSize: '18px',
                  letterSpacing: '0.15em',
                  background: addedToCart ? 'rgba(16, 185, 129, 0.95)' : ACCENT,
                  color: '#000000',
                  clipPath: 'polygon(0 0, 100% 0, 96% 100%, 4% 100%)',
                  border: 'none',
                  cursor: isAddingToCart || addedToCart ? 'default' : 'pointer',
                }}
              >
                {isAddingToCart ? (
                  <div className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin" />
                ) : addedToCart ? (
                  <><Check size={24} /> STACK ADDED</>
                ) : (
                  <><ShoppingCart size={24} /> ADD MY STACK TO CART</>
                )}
              </button>
              <p className="text-center mt-4" style={{ color: '#444', fontFamily: SPACE_MONO, fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Pharmaceutical grade &bull; 3rd party tested &bull; Free US shipping
              </p>
            </section>
          </FadeInSection>

          {/* Performance Breakdown with Population Comparisons */}
          <FadeInSection delay={0.2}>
            <section className="mb-10 p-6" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
              <p
                className="text-xs uppercase mb-3"
                style={{ color: PURPLE, fontFamily: SPACE_MONO, letterSpacing: '0.4em', fontSize: '11px' }}
              >
                BREAKDOWN
              </p>
              <h3 className="text-2xl font-bold uppercase mb-6" style={{ fontFamily: OSWALD }}>
                PERFORMANCE <span style={{ color: PURPLE }}>METRICS</span>
              </h3>

              <div className="space-y-5">
                {[
                  { icon: BedDouble, label: 'Sleep & Recovery', score: scores.sleep, max: 25, avg: POPULATION_AVERAGES.sleep, iconColor: ACCENT },
                  { icon: Battery, label: 'Energy Output', score: scores.energy, max: 20, avg: POPULATION_AVERAGES.energy, iconColor: PURPLE },
                  { icon: Heart, label: 'Stress Management', score: scores.stress, max: 20, avg: POPULATION_AVERAGES.stress, iconColor: ACCENT },
                  { icon: Target, label: 'Goal Alignment', score: scores.goalAlignment, max: 20, avg: POPULATION_AVERAGES.goalAlignment, iconColor: PURPLE },
                  { icon: Calendar, label: 'Training Load', score: scores.trainingLoad, max: 15, avg: POPULATION_AVERAGES.trainingLoad, iconColor: ACCENT },
                ].map(({ icon: Icon, label, score, max, avg, iconColor }) => {
                  const userPercent = (score / max) * 100;
                  const avgPercent = (avg / max) * 100;
                  const status = getComparisonStatus(score, avg, max * 0.15);
                  const StatusIcon = status.icon;

                  return (
                    <div key={label}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon size={16} style={{ color: iconColor }} />
                          <span style={{ color: '#999', fontFamily: SPACE_MONO, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span style={{ color: '#fff', fontFamily: OSWALD, fontSize: '14px', fontWeight: 700 }}>{score}/{max}</span>
                          <span
                            className="flex items-center gap-1 px-2 py-0.5"
                            style={{
                              color: status.color,
                              background: `${status.color}20`,
                              fontFamily: SPACE_MONO,
                              fontSize: '9px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            <StatusIcon size={10} />
                            {status.text}
                          </span>
                        </div>
                      </div>
                      <div className="relative h-2 overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        {/* User score bar */}
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${userPercent}%` }}
                          transition={{ duration: 0.8, delay: 0.4 }}
                          className="absolute h-full"
                          style={{
                            background: ACCENT,
                            boxShadow: `0 0 10px rgba(${ACCENT_RGB}, 0.5)`,
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
                        <span style={{ fontSize: '9px', color: '#666', fontFamily: SPACE_MONO, textTransform: 'uppercase' }}>Your score</span>
                        <span style={{ fontSize: '9px', color: '#10b981', fontFamily: SPACE_MONO, textTransform: 'uppercase' }}>Avg: {avg}/{max}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </FadeInSection>

          {/* Track Your Progress (Signed Out Only) */}
          {!isSignedIn && (
            <FadeInSection delay={0.3}>
              <section className="mb-10 p-8 text-center relative overflow-hidden" style={{ background: CARD_BG, border: `2px solid rgba(${ACCENT_RGB}, 0.2)` }}>
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Activity size={120} style={{ color: ACCENT }} />
                </div>

                <div className="relative z-10">
                  <p
                    className="text-xs uppercase mb-3"
                    style={{ color: PURPLE, fontFamily: SPACE_MONO, letterSpacing: '0.4em', fontSize: '11px' }}
                  >
                    TRACK PROGRESS
                  </p>
                  <h3 className="text-2xl font-bold uppercase mb-3" style={{ fontFamily: OSWALD }}>
                    SAVE YOUR <span style={{ color: PURPLE }}>RESULTS</span>
                  </h3>
                  <p className="mb-6 max-w-lg mx-auto" style={{ color: '#666', fontFamily: SPACE_MONO, fontSize: '12px', lineHeight: 1.6 }}>
                    Create an account to save your score history, unlock your detailed performance roadmap, and track how your optimization improves over time.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href={`/sign-up?redirect_url=/dashboard/optimization-history&metadata=${resultId ? `{"last_result_id":"${resultId}"}` : ''}`}
                      className="px-8 py-4 font-bold uppercase tracking-widest no-underline"
                      style={{
                        fontFamily: OSWALD,
                        fontSize: '14px',
                        letterSpacing: '0.15em',
                        background: ACCENT,
                        color: '#000000',
                        clipPath: 'polygon(0 0, 100% 0, 96% 100%, 4% 100%)',
                        display: 'inline-block',
                        textDecoration: 'none',
                        textAlign: 'center',
                      }}
                    >
                      CREATE FREE ACCOUNT
                    </Link>
                    <Link
                      href="/auth"
                      className="px-8 py-4 font-bold uppercase tracking-widest border-2 no-underline inline-block text-center"
                      style={{
                        fontFamily: OSWALD,
                        fontSize: '14px',
                        letterSpacing: '0.15em',
                        borderColor: ACCENT,
                        color: ACCENT,
                        background: 'transparent',
                        clipPath: 'polygon(0 0, 100% 0, 96% 100%, 4% 100%)',
                        cursor: 'pointer',
                        textDecoration: 'none',
                      }}
                    >
                      SIGN IN
                    </Link>
                  </div>
                </div>
              </section>
            </FadeInSection>
          )}

          {/* Email Capture */}
          <FadeInSection delay={0.4}>
            {!emailSubmitted ? (
              <section className="mb-10 p-6" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
                <div className="flex items-center gap-3 mb-4">
                  <Mail size={18} style={{ color: ACCENT }} />
                  <h3 className="font-bold uppercase" style={{ fontFamily: OSWALD, fontSize: '16px' }}>
                    Complete Performance Report
                  </h3>
                </div>

                {/* Value Preview */}
                <div className="mb-4 p-4" style={{ background: `rgba(${ACCENT_RGB}, 0.05)`, border: `1px solid rgba(${ACCENT_RGB}, 0.1)` }}>
                  <p className="mb-3" style={{ color: ACCENT, fontFamily: SPACE_MONO, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700 }}>
                    Your Complete Report Includes:
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      'Detailed score breakdown with explanations',
                      'Personalized supplement timing guide',
                      'Progressive 30-day optimization roadmap',
                      'Comparison to your demographic benchmarks',
                      'AI-generated training recommendations',
                      'Exclusive member pricing alerts',
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2" style={{ color: '#999', fontFamily: SPACE_MONO, fontSize: '11px' }}>
                        <Check size={12} style={{ color: ACCENT, flexShrink: 0 }} />
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
                    className="flex-1 px-4 py-3 focus:outline-none"
                    style={{
                      background: '#000000',
                      border: `1px solid ${CARD_BORDER}`,
                      color: '#ffffff',
                      fontFamily: SPACE_MONO,
                      fontSize: '12px',
                    }}
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 font-bold uppercase tracking-widest"
                    style={{
                      fontFamily: OSWALD,
                      fontSize: '14px',
                      background: ACCENT,
                      color: '#000000',
                      border: 'none',
                      cursor: 'pointer',
                      letterSpacing: '0.1em',
                    }}
                  >
                    SEND
                  </button>
                </form>
              </section>
            ) : (
              <section className="mb-10 p-6 text-center" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <Check size={32} style={{ color: '#10b981', margin: '0 auto 8px' }} />
                <p className="font-bold uppercase" style={{ fontFamily: OSWALD }}>Report Sent to Your Inbox</p>
              </section>
            )}
          </FadeInSection>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
        <div className="max-w-[430px] mx-auto text-center">
          <p style={{ fontFamily: OSWALD, fontSize: '12px', fontWeight: 700, letterSpacing: '0.4em', color: ACCENT, marginBottom: '16px' }}>
            &#9673; AVIERA
          </p>
          <p style={{ fontFamily: SPACE_MONO, fontSize: '9px', color: '#444', marginBottom: '8px' }}>
            Manufactured in the USA in a GMP-certified facility.
          </p>
          <p style={{ fontFamily: SPACE_MONO, fontSize: '9px', color: '#333', marginBottom: '8px', fontStyle: 'italic' }}>
            *These statements have not been evaluated by the FDA. These products are not intended to diagnose, treat, cure, or prevent any disease.
          </p>
          <p style={{ fontFamily: SPACE_MONO, fontSize: '9px', color: '#333' }}>
            &copy; {new Date().getFullYear()} Aviera. All rights reserved.
          </p>
          <div className="flex justify-center gap-4 mt-3">
            <Link href="/terms" style={{ fontFamily: SPACE_MONO, fontSize: '9px', color: '#444', textTransform: 'uppercase', textDecoration: 'none' }}>Terms</Link>
            <Link href="/privacy" style={{ fontFamily: SPACE_MONO, fontSize: '9px', color: '#444', textTransform: 'uppercase', textDecoration: 'none' }}>Privacy</Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '12px' }}>
            <a href="https://instagram.com/avierafit" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ color: '#444', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#00ffcc'} onMouseLeave={e => e.currentTarget.style.color = '#444'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="https://tiktok.com/@avierafit" target="_blank" rel="noopener noreferrer" aria-label="TikTok" style={{ color: '#444', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#00ffcc'} onMouseLeave={e => e.currentTarget.style.color = '#444'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.98a8.21 8.21 0 0 0 4.76 1.52V7.05a4.84 4.84 0 0 1-1-.36z"/></svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Product Card Component ───
function ProductCard({ product, onAddToCart, isAdded }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="p-5" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
      <div className="flex items-start gap-4">
        {product.image ? (
          <div className="w-20 h-20 overflow-hidden flex-shrink-0" style={{ background: '#ffffff' }}>
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
          <div className="w-20 h-20 flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <span className="text-4xl opacity-30">&#128138;</span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-bold uppercase truncate" style={{ fontFamily: OSWALD, fontSize: '16px' }}>{product.title}</h4>
            <span className="whitespace-nowrap font-bold" style={{ color: ACCENT, fontFamily: OSWALD, fontSize: '20px' }}>${product.price?.toFixed(2)}</span>
          </div>

          <div className="mb-3">
            <p className="mb-1" style={{ color: PURPLE, fontFamily: SPACE_MONO, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              Perfect For You Because:
            </p>
            <p className="line-clamp-2" style={{ color: '#666', fontFamily: SPACE_MONO, fontSize: '11px', lineHeight: 1.6 }}>
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
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 font-bold uppercase transition-all"
              style={{
                fontFamily: OSWALD,
                fontSize: '12px',
                letterSpacing: '0.1em',
                background: isAdded ? 'rgba(16, 185, 129, 0.2)' : `rgba(${ACCENT_RGB}, 0.15)`,
                color: isAdded ? '#10b981' : ACCENT,
                border: `1px solid ${isAdded ? 'rgba(16, 185, 129, 0.4)' : `rgba(${ACCENT_RGB}, 0.3)`}`,
                cursor: isAdded ? 'default' : 'pointer',
              }}
            >
              {isAdded ? (
                <><Check size={14} /> ADDED</>
              ) : (
                <><Plus size={14} /> ADD TO CART</>
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              className="flex items-center justify-center gap-1 px-3 py-2 transition-all"
              style={{
                fontFamily: SPACE_MONO,
                fontSize: '10px',
                textTransform: 'uppercase',
                color: expanded ? ACCENT : '#666',
                background: expanded ? `rgba(${ACCENT_RGB}, 0.1)` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${expanded ? `rgba(${ACCENT_RGB}, 0.3)` : CARD_BORDER}`,
                cursor: 'pointer',
                letterSpacing: '0.05em',
              }}
            >
              {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              {expanded ? 'Less' : 'More'}
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
            <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
              {product.description && (
                <div className="mb-3">
                  <p style={{ color: ACCENT, fontFamily: SPACE_MONO, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '4px' }}>Description</p>
                  <p style={{ color: '#666', fontFamily: SPACE_MONO, fontSize: '11px', lineHeight: 1.6 }}>{product.description}</p>
                </div>
              )}
              {product.ingredients && (
                <div className="mb-3">
                  <p style={{ color: ACCENT, fontFamily: SPACE_MONO, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '4px' }}>Key Ingredients</p>
                  <p style={{ color: '#666', fontFamily: SPACE_MONO, fontSize: '11px', lineHeight: 1.6 }}>{product.ingredients}</p>
                </div>
              )}
              {product.dosage && (
                <div className="mb-3">
                  <p style={{ color: ACCENT, fontFamily: SPACE_MONO, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '4px' }}>Recommended Dosage</p>
                  <p style={{ color: '#666', fontFamily: SPACE_MONO, fontSize: '11px', lineHeight: 1.6 }}>{product.dosage}</p>
                </div>
              )}
              {product.benefits && (
                <div className="mb-3">
                  <p style={{ color: ACCENT, fontFamily: SPACE_MONO, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '4px' }}>Benefits</p>
                  <p style={{ color: '#666', fontFamily: SPACE_MONO, fontSize: '11px', lineHeight: 1.6 }}>{product.benefits}</p>
                </div>
              )}
              {!product.description && !product.ingredients && !product.dosage && !product.benefits && (
                <div className="mb-3">
                  <p style={{ color: ACCENT, fontFamily: SPACE_MONO, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '4px' }}>Product Details</p>
                  <p style={{ color: '#666', fontFamily: SPACE_MONO, fontSize: '11px', lineHeight: 1.6 }}>
                    {product.reasoning || 'Premium supplement formulated to support your fitness goals.'}
                  </p>
                </div>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded(false);
                }}
                className="flex items-center gap-1 bg-transparent border-none cursor-pointer"
                style={{ color: '#666', fontFamily: SPACE_MONO, fontSize: '10px', textTransform: 'uppercase' }}
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

// ─── Special AI Pick Card Component ───
function SpecialAIPickCard({ product, onAddToCart, isAdded }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="relative overflow-hidden p-[2px]"
      style={{
        background: `linear-gradient(135deg, ${ACCENT}, ${PURPLE}, ${ACCENT}, ${PURPLE})`,
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

      <div className="p-5" style={{ background: 'rgba(10, 10, 10, 0.97)' }}>
        {/* Special Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span
            className="flex items-center gap-1.5 px-3 py-1"
            style={{
              background: `rgba(${PURPLE_RGB}, 0.15)`,
              color: PURPLE,
              border: `1px solid rgba(${PURPLE_RGB}, 0.3)`,
              fontFamily: SPACE_MONO,
              fontSize: '10px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
            }}
          >
            <Sparkles size={12} />
            AI RECOMMENDATION
          </span>
        </div>

        <div className="flex items-start gap-4">
          {product.image ? (
            <div className="w-24 h-24 overflow-hidden flex-shrink-0" style={{ background: '#ffffff' }}>
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
            <div className="w-24 h-24 flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <span className="text-5xl opacity-30">&#128138;</span>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="font-bold uppercase text-lg" style={{ fontFamily: OSWALD }}>{product.title}</h4>
              <span className="whitespace-nowrap font-bold" style={{ color: ACCENT, fontFamily: OSWALD, fontSize: '22px' }}>${product.price?.toFixed(2)}</span>
            </div>

            <div className="mb-4">
              <p className="mb-1" style={{ color: PURPLE, fontFamily: SPACE_MONO, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                AI Selected Because:
              </p>
              <p style={{ color: '#999', fontFamily: SPACE_MONO, fontSize: '11px', lineHeight: 1.6 }}>
                {product.reasoning}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onAddToCart}
                disabled={isAdded}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 font-bold uppercase transition-all"
                style={{
                  fontFamily: OSWALD,
                  fontSize: '13px',
                  letterSpacing: '0.1em',
                  background: isAdded ? 'rgba(16, 185, 129, 0.9)' : ACCENT,
                  color: '#000000',
                  border: 'none',
                  cursor: isAdded ? 'default' : 'pointer',
                }}
              >
                {isAdded ? (
                  <><Check size={16} /> ADDED TO CART</>
                ) : (
                  <><Plus size={16} /> ADD TO CART</>
                )}
              </button>
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center justify-center gap-1 px-4 py-2.5 transition-all"
                style={{
                  color: expanded ? ACCENT : '#666',
                  background: expanded ? `rgba(${ACCENT_RGB}, 0.1)` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${expanded ? `rgba(${ACCENT_RGB}, 0.3)` : CARD_BORDER}`,
                  cursor: 'pointer',
                }}
              >
                {expanded ? <ChevronUp size={14} /> : <Info size={14} />}
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
              <div className="mt-4 pt-4" style={{ borderTop: `1px solid rgba(${ACCENT_RGB}, 0.15)` }}>
                {product.description && (
                  <div className="mb-3">
                    <p style={{ color: ACCENT, fontFamily: SPACE_MONO, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '4px' }}>Description</p>
                    <p style={{ color: '#666', fontFamily: SPACE_MONO, fontSize: '11px', lineHeight: 1.6 }}>{product.description}</p>
                  </div>
                )}
                {product.ingredients && (
                  <div className="mb-3">
                    <p style={{ color: ACCENT, fontFamily: SPACE_MONO, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '4px' }}>Key Ingredients</p>
                    <p style={{ color: '#666', fontFamily: SPACE_MONO, fontSize: '11px', lineHeight: 1.6 }}>{product.ingredients}</p>
                  </div>
                )}
                {product.dosage && (
                  <div className="mb-3">
                    <p style={{ color: ACCENT, fontFamily: SPACE_MONO, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '4px' }}>Recommended Dosage</p>
                    <p style={{ color: '#666', fontFamily: SPACE_MONO, fontSize: '11px', lineHeight: 1.6 }}>{product.dosage}</p>
                  </div>
                )}
                {product.benefits && (
                  <div className="mb-3">
                    <p style={{ color: ACCENT, fontFamily: SPACE_MONO, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '4px' }}>Benefits</p>
                    <p style={{ color: '#666', fontFamily: SPACE_MONO, fontSize: '11px', lineHeight: 1.6 }}>{product.benefits}</p>
                  </div>
                )}
                {!product.description && !product.ingredients && !product.dosage && !product.benefits && (
                  <div className="mb-3">
                    <p style={{ color: ACCENT, fontFamily: SPACE_MONO, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '4px' }}>Product Details</p>
                    <p style={{ color: '#666', fontFamily: SPACE_MONO, fontSize: '11px', lineHeight: 1.6 }}>
                      {product.reasoning || 'Premium supplement formulated to support your fitness goals.'}
                    </p>
                  </div>
                )}
                <button
                  onClick={() => setExpanded(false)}
                  className="flex items-center gap-1 bg-transparent border-none cursor-pointer"
                  style={{ color: '#666', fontFamily: SPACE_MONO, fontSize: '10px', textTransform: 'uppercase' }}
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

// ─── Helper functions ───
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
