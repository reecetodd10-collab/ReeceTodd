'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import PageLayout, { FadeInSection as DSFadeIn, TOKENS } from '../components/PageLayout';
import { getSupabaseBrowser } from '../lib/supabase-browser';
import { trackEvent } from '@/lib/analytics';
import { trackStartQuiz, trackCompleteQuiz, trackAddToCart, trackSubmitForm } from '../lib/tracking';
import ProductDetailModal from '../components/ProductDetailModal';
import confetti from 'canvas-confetti';

// ─── Design system constants (updated to match site-wide design system) ───
const ACCENT = '#00e5ff';
const ACCENT_RGB = '0, 229, 255';
const CARD_BG = '#ffffff';
const CARD_BORDER = 'rgba(0,0,0,0.08)';
const URGENCY = '#FF3B3B';
const PURPLE = '#a855f7';
const PURPLE_RGB = '168, 85, 247';
const OSWALD = 'var(--font-oswald), Oswald, sans-serif';
const SPACE_MONO = 'var(--font-space-mono), Space Mono, monospace';
const INK = '#28282A';
const CREAM = '#F5F0EB';
const CYAN_TINT = '#f4fdff';

// FadeInSection — kept local for animation consistency within quiz
function FadeInSection({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// StickyNav removed — PageLayout provides shared nav
const StickyNav_REMOVED = true; // marker for deleted code

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
  const [resultId, setResultId] = useState(null);
  const { user: authUser, session: authSession } = useSupabaseUser();
  const isSignedIn = !!authUser;

  // Email capture
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  // Product detail modal
  const [detailProduct, setDetailProduct] = useState(null);

  // Signup modal state
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [signupForm, setSignupForm] = useState({ email: '', password: '' });
  const [signupError, setSignupError] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupMode, setSignupMode] = useState('signup'); // 'signup' or 'signin'
  const router = useRouter();

  // Signup modal disabled — uncomment to re-enable
  // useEffect(() => {
  //   if (!showResults || isSignedIn) return;
  //   const dismissed = typeof window !== 'undefined' && sessionStorage.getItem('aviera_signup_dismissed');
  //   if (dismissed) return;
  //   const timer = setTimeout(() => setShowSignupModal(true), 5000);
  //   return () => clearTimeout(timer);
  // }, [showResults, isSignedIn]);

  // Save quiz results to sessionStorage when results are ready (persists through signup flow)
  useEffect(() => {
    if (!showResults || !scores) return;
    try {
      sessionStorage.setItem('aviera_quiz_results', JSON.stringify({
        scores,
        responses,
        recommendations: recommendations.map(r => ({ title: r.title, price: r.price, reasoning: r.reasoning })),
        specialAIPick: specialAIPick ? { title: specialAIPick.title, price: specialAIPick.price, reasoning: specialAIPick.reasoning } : null,
        resultId,
      }));
    } catch (_) {}
  }, [showResults, scores, recommendations, specialAIPick, resultId, responses]);

  // Handle signup/signin
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setSignupError('');
    setSignupLoading(true);
    try {
      const supabase = getSupabaseBrowser();
      if (signupMode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: signupForm.email,
          password: signupForm.password,
        });
        if (error) throw error;
        if (data.session) {
          // Signed in immediately — re-save results with auth
          if (resultId) {
            try {
              await fetch('/api/optimization-results', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${data.session.access_token}` },
                body: JSON.stringify({ id: resultId, auth_user_id: data.user.id }),
              });
            } catch (_) {}
          }
          setShowSignupModal(false);
          router.push('/dashboard');
        } else {
          setSignupError('Check your email for a confirmation link, then sign in.');
          setSignupMode('signin');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: signupForm.email,
          password: signupForm.password,
        });
        if (error) throw error;
        setShowSignupModal(false);
        router.push('/dashboard');
      }
    } catch (err) {
      setSignupError(err.message || 'Something went wrong');
    } finally {
      setSignupLoading(false);
    }
  };

  const dismissSignupModal = () => {
    setShowSignupModal(false);
    if (typeof window !== 'undefined') sessionStorage.setItem('aviera_signup_dismissed', 'true');
  };

  // Fetch Shopify products on mount
  useEffect(() => {
    fetchShopifyProducts()
      .then(products => setShopifyProducts(products))
      .catch(err => console.error('Error fetching products:', err));

    // Track quiz started
    trackEvent('optimization_quiz_started');
    trackStartQuiz('Personalized Supplements Quiz');
  }, []);

  // Load saved results from URL param ?results=ID
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const savedResultId = params.get('results');
    if (!savedResultId) return;

    async function loadSavedResult() {
      try {
        // Fetch the specific result
        const headers = { 'Content-Type': 'application/json' };
        try {
          const { createClient } = await import('@supabase/supabase-js');
          const sb = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
          );
          const { data: { session: s } } = await sb.auth.getSession();
          if (s?.access_token) headers['Authorization'] = `Bearer ${s.access_token}`;
        } catch (_) {}

        const res = await fetch('/api/optimization-results?history=true', { headers });
        if (!res.ok) return;
        const { results } = await res.json();
        const saved = results?.find(r => String(r.id) === savedResultId) || results?.[0];
        if (!saved) return;

        // Restore state from saved result
        setResultId(saved.id);
        if (saved.scores) setScores(saved.scores);
        if (saved.inputs) setResponses(prev => ({ ...prev, ...saved.inputs }));
        if (saved.recommended_products) {
          // Convert saved product format to recommendations format
          const recs = saved.recommended_products.map((p, i) => ({
            title: p.title,
            price: p.price,
            tier: i < 2 ? 'MUST HAVE' : 'RECOMMENDED',
            reason: '',
          }));
          setRecommendations(recs);
        }
        setShowResults(true);
      } catch (err) {
        console.error('Failed to load saved result:', err);
      }
    }
    loadSavedResult();
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
      const saveHeaders = { 'Content-Type': 'application/json' };
      // Include auth token if signed in so results are tied to user
      if (typeof window !== 'undefined') {
        try {
          const { createClient } = await import('@supabase/supabase-js');
          const sb = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
          );
          const { data: { session: currentSession } } = await sb.auth.getSession();
          if (currentSession?.access_token) {
            saveHeaders['Authorization'] = `Bearer ${currentSession.access_token}`;
          }
        } catch (_) { /* proceed without auth */ }
      }
      const saveResponse = await fetch('/api/optimization-results', {
        method: 'POST',
        headers: saveHeaders,
        body: JSON.stringify({
          email: email || authUser?.email,
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

    // Track quiz completion across all pixels
    trackCompleteQuiz('Personalized Supplements Quiz', responses.primaryGoal);

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
        // Track stack add-to-cart across all pixels
        const totalValue = [...recommendations, specialAIPick].filter(Boolean).reduce((sum, r) => sum + (r.price || 0), 0);
        trackAddToCart('O.S. Recommended Stack', 'os-quiz-stack', totalValue, itemsToAdd.length);
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
      // Track individual add-to-cart across all pixels
      trackAddToCart(product.title, product.variantId, product.price || 0);
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
    // Track email capture across all pixels
    trackSubmitForm('O.S. Email Capture');
  };

  // Render quiz or results
  if (showResults && scores) {
    return (
      <PageLayout>
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
        detailProduct={detailProduct}
        setDetailProduct={setDetailProduct}
        showSignupModal={showSignupModal}
        signupForm={signupForm}
        setSignupForm={setSignupForm}
        signupError={signupError}
        signupLoading={signupLoading}
        signupMode={signupMode}
        setSignupMode={setSignupMode}
        handleSignupSubmit={handleSignupSubmit}
        dismissSignupModal={dismissSignupModal}
        isSignedIn={isSignedIn}
      />
      </PageLayout>
    );
  }

  if (isCalculating) {
    return <PageLayout><LoadingScreen /></PageLayout>;
  }

  const isLastQuestion = currentSection === sections.length - 1 && currentQuestion === currentSectionData.questions.length - 1;

  return (
    <PageLayout hideFooter>
      {/* Hero with background image */}
      <section className="relative overflow-hidden" style={{ minHeight: '45vh', zIndex: 10 }}>
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/quiz-background.jpg"
            alt=""
            className="w-full h-full object-cover"
            style={{ filter: 'grayscale(20%) contrast(1.06)' }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,1) 100%)',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 30% 70%, rgba(0,229,255,0.08) 0%, transparent 50%)',
            }}
          />
        </div>

        <div className="relative max-w-[430px] md:max-w-3xl mx-auto px-5 md:px-8 text-center flex flex-col justify-end" style={{ paddingTop: '120px', paddingBottom: '40px', minHeight: '45vh' }}>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs uppercase mb-4" style={{ color: ACCENT, fontFamily: SPACE_MONO, letterSpacing: '0.4em', textShadow: '0 0 20px rgba(0,229,255,0.6), 0 2px 8px rgba(0,0,0,0.8)' }}>
              Stop Guessing
            </p>
            <h1
              className="text-[36px] sm:text-[48px] md:text-[64px] font-bold uppercase mb-3 leading-tight"
              style={{ fontFamily: OSWALD, color: '#fff', textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}
            >
              Personalized <span style={{ color: ACCENT }}>Supplements</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontFamily: SPACE_MONO, fontSize: '12px', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
              Answer a few questions. Get your custom stack — 60 seconds.
            </p>
          </motion.div>
        </div>
      </section>

      {/* SEO / GEO — crawlable supporting copy for quiz (hidden visually when quiz is active, but always in DOM for crawlers) */}
      {currentSection === 0 && currentQuestion === 0 && (
        <section style={{ background: '#000', color: 'rgba(255,255,255,0.75)', paddingBottom: '32px' }}>
          <div className="max-w-[430px] md:max-w-3xl mx-auto px-5 md:px-8">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '28px' }}>
              {[
                { title: 'How It Works', text: 'The Aviera quiz asks a short series of questions about your goals, training, recovery, and routine, then uses those inputs to recommend a more relevant supplement stack.' },
                { title: 'Who It\'s For', text: 'Designed for athletes and active adults who want help choosing supplements for performance, hydration, recovery, sleep, or day-to-day support.' },
                { title: 'What You\'ll Get', text: 'A suggested stack tied to your goals, along with a short explanation of why each product fits. Takes about 60 seconds.' },
              ].map((item, i) => (
                <div key={i} style={{ padding: '16px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }}>
                  <h3 style={{ fontFamily: OSWALD, fontSize: '14px', fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>{item.title}</h3>
                  <p style={{ fontSize: '12px', lineHeight: 1.6, color: 'rgba(255,255,255,0.6)' }}>{item.text}</p>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', textAlign: 'center' }}>
              Aviera Fit is a San Diego-based supplement brand focused on personalized performance nutrition. The quiz is educational and goal-based — not medical advice or diagnosis.
            </p>
          </div>
        </section>
      )}

      {/* Quiz body */}
      <section style={{ background: CREAM, color: INK }}>
      <div className="relative pt-10 pb-16 px-4">
        <div className="max-w-[430px] md:max-w-3xl mx-auto">

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-xs mb-2" style={{ color: 'rgba(0,0,0,0.5)', fontFamily: SPACE_MONO, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              <span>Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full" style={{ background: 'rgba(0,0,0,0.08)' }}>
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
              style={{ color: ACCENT, fontFamily: SPACE_MONO, letterSpacing: '0.4em', fontSize: '11px' }}
            >
              SECTION {currentSection + 1} OF {sections.length}
            </p>
            <h2
              className="text-2xl font-bold uppercase mb-1"
              style={{ fontFamily: OSWALD, color: '#1a1a1a' }}
            >
              {currentSectionData.title}
            </h2>
            <p style={{ color: '#4a4a4a', fontFamily: SPACE_MONO, fontSize: '12px' }}>
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
                background: '#ffffff',
                border: `1.5px solid ${CARD_BORDER}`,
                borderRadius: '12px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
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
              className="flex items-center gap-2 px-8 py-4 font-bold uppercase tracking-widest transition disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5"
              style={{
                fontFamily: OSWALD,
                fontSize: '14px',
                background: isCurrentAnswered() ? ACCENT : 'rgba(0,0,0,0.06)',
                color: isCurrentAnswered() ? '#000000' : 'rgba(0,0,0,0.3)',
                borderRadius: '10px',
                border: 'none',
                cursor: isCurrentAnswered() ? 'pointer' : 'not-allowed',
                letterSpacing: '0.18em',
                boxShadow: isCurrentAnswered() ? `0 4px 24px rgba(${ACCENT_RGB}, 0.35)` : 'none',
              }}
            >
              {isLastQuestion ? <><span style={{ color: isCurrentAnswered() ? '#000' : undefined }}>GET MY STACK</span></> : 'CONTINUE'}
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
      </section>
    </PageLayout>
  );
}

// ─── Question Renderer Component ───
function QuestionRenderer({ question, value, onChange }) {
  if (!question) return null;

  // Shared button style helpers — dark text for light bg quiz cards
  const selectedStyle = {
    background: ACCENT,
    color: '#000000',
    border: `1px solid ${ACCENT}`,
    boxShadow: `0 2px 12px rgba(${ACCENT_RGB}, 0.3)`,
  };
  const unselectedStyle = {
    background: '#ffffff',
    color: '#1a1a1a',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: '10px',
  };

  switch (question.type) {
    case 'dropdown':
      return (
        <div>
          <label
            className="block text-lg font-bold uppercase mb-4"
            style={{ fontFamily: OSWALD, color: ACCENT }}
          >
            {question.label}
          </label>
          {question.microcopy && (
            <p className="mb-4" style={{ color: '#4a4a4a', fontFamily: SPACE_MONO, fontSize: '12px' }}>{question.microcopy}</p>
          )}
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-3 appearance-none cursor-pointer focus:outline-none"
            style={{
              background: '#ffffff',
              border: `1.5px solid ${value ? ACCENT : CARD_BORDER}`,
              borderRadius: '10px',
              color: '#1a1a1a',
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
          <label className="block text-lg font-bold uppercase mb-4" style={{ fontFamily: OSWALD, color: ACCENT }}>
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
          <label className="block text-lg font-bold uppercase mb-4" style={{ fontFamily: OSWALD, color: ACCENT }}>
            {question.label}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {question.options.map((opt, idx) => {
              const Icon = GOAL_ICONS[opt] || Target;
              const isSelected = value === opt;
              const iconColor = isSelected ? '#000000' : ACCENT;
              return (
                <button
                  key={opt}
                  onClick={() => onChange(opt)}
                  className="flex items-center gap-3 px-4 py-4 font-medium transition-all text-left"
                  style={{
                    ...(isSelected ? selectedStyle : {
                      ...unselectedStyle,
                      borderColor: CARD_BORDER,
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
          <label className="block text-lg font-bold uppercase mb-4" style={{ fontFamily: OSWALD, color: ACCENT }}>
            {question.label}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {question.options.map((opt, idx) => {
              const Icon = TRAINING_ICONS[opt] || Activity;
              const isSelected = value === opt;
              const iconColor = isSelected ? '#000000' : ACCENT;
              return (
                <button
                  key={opt}
                  onClick={() => onChange(opt)}
                  className="flex items-center gap-3 px-4 py-4 font-medium transition-all text-left"
                  style={{
                    ...(isSelected ? selectedStyle : {
                      ...unselectedStyle,
                      borderColor: CARD_BORDER,
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
          <label className="block text-lg font-bold uppercase mb-2" style={{ fontFamily: OSWALD, color: ACCENT }}>
            {question.label}
          </label>
          {question.microcopy && (
            <p className="mb-4" style={{ color: '#4a4a4a', fontFamily: SPACE_MONO, fontSize: '12px' }}>{question.microcopy}</p>
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
          <label className="block text-lg font-bold uppercase mb-4" style={{ fontFamily: OSWALD, color: ACCENT }}>
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
          <label className="block text-lg font-bold uppercase mb-2" style={{ fontFamily: OSWALD, color: ACCENT }}>
            {question.label}
          </label>
          {question.microcopy && (
            <p className="mb-4" style={{ color: '#4a4a4a', fontFamily: SPACE_MONO, fontSize: '12px' }}>{question.microcopy}</p>
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
                    background: isSelected ? `rgba(${ACCENT_RGB}, 0.12)` : '#ffffff',
                    color: '#1a1a1a',
                    border: isSelected ? `1.5px solid ${ACCENT}` : `1.5px solid ${CARD_BORDER}`,
                    borderRadius: '10px',
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
    <div className="flex items-center justify-center" style={{ minHeight: '70vh', background: CREAM, color: INK }}>
      <div className="text-center px-4">
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(from 0deg, transparent, ${ACCENT}80, ${ACCENT}, transparent)`,
              animation: 'spin 1.5s linear infinite',
            }}
          />
          <div
            className="absolute inset-2 rounded-full flex items-center justify-center"
            style={{ background: CREAM }}
          >
            <Sparkles style={{ color: ACCENT }} size={32} />
          </div>
        </div>
        <p className="text-lg animate-pulse" style={{ color: 'rgba(0,0,0,0.5)', fontFamily: SPACE_MONO, fontSize: '13px' }}>
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
  detailProduct,
  setDetailProduct,
  showSignupModal,
  signupForm,
  setSignupForm,
  signupError,
  signupLoading,
  signupMode,
  setSignupMode,
  handleSignupSubmit,
  dismissSignupModal,
}) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showScoreExplanation, setShowScoreExplanation] = useState(false);
  const scoreRef = useRef(null);

  // Convert score to 0-10 scale
  const displayScore = (scores.total / 10).toFixed(1);
  const avgDisplayScore = (POPULATION_AVERAGES.total / 10).toFixed(1);

  // Score-based ring color: red for low, purple for mid, cyan for good
  const scoreRingColor = scores.total < 40 ? URGENCY : ACCENT;
  const scoreRingRGB = scores.total < 40 ? '255, 59, 59' : ACCENT_RGB;

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
      } else {
        // Fire confetti when score reveal completes
        const colors = scores.total >= 60
          ? ['#00ffcc', '#00d9ff', '#a855f7']
          : scores.total >= 40
            ? ['#a855f7', '#00d9ff', '#ffffff']
            : ['#ff2d55', '#a855f7', '#00d9ff'];

        // Center burst
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.35 },
          colors,
          disableForReducedMotion: true,
        });
        // Left side
        setTimeout(() => confetti({
          particleCount: 40,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.4 },
          colors,
          disableForReducedMotion: true,
        }), 200);
        // Right side
        setTimeout(() => confetti({
          particleCount: 40,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.4 },
          colors,
          disableForReducedMotion: true,
        }), 200);
      }
    };

    requestAnimationFrame(animate);
  }, [displayScore, scores.total]);

  // Get score label
  const getScoreLabel = (score) => {
    if (score < 5.0) return { text: 'HUGE UPSIDE AHEAD', color: URGENCY };
    if (score < 6.0) return { text: 'SOLID START — LET\'S BUILD', color: ACCENT };
    if (score < 7.5) return { text: 'STRONG FOUNDATION', color: ACCENT };
    if (score < 8.5) return { text: 'YOU\'RE CRUSHING IT', color: ACCENT };
    return { text: 'ELITE — TOP 10%', color: ACCENT };
  };

  // Get comparison status
  const getComparisonStatus = (userScore, avgScore, threshold = 3) => {
    if (userScore > avgScore + threshold) return { text: 'Above Avg', color: '#10b981', icon: TrendingUp };
    if (userScore < avgScore - threshold) return { text: 'Below Avg', color: URGENCY, icon: TrendingDown };
    return { text: 'Average', color: ACCENT, icon: Minus };
  };

  // Overall assessment
  const overallAssessment = aiInsights?.overallAssessment || (scores.total >= 75 ? 'above' : scores.total >= 50 ? 'average' : 'below');

  const assessmentConfig = {
    above: { text: 'Outstanding', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
    average: { text: 'Great Start', color: ACCENT, bg: `rgba(${ACCENT_RGB}, 0.12)` },
    below: { text: 'Room to Grow', color: URGENCY, bg: 'rgba(255, 45, 85, 0.15)' },
  };

  const assessment = assessmentConfig[overallAssessment];

  // Calculate percentile (simplified)
  const percentile = Math.min(99, Math.max(1, Math.round(scores.total * 0.9 + 10)));

  return (
    <div className="min-h-screen relative" style={{ background: CREAM, color: INK, overflowX: 'hidden' }}>
      <div className="relative pt-16 pb-16 px-4" style={{ background: CREAM, color: INK }}>
        <div className="max-w-[430px] md:max-w-3xl lg:max-w-5xl mx-auto">

          {/* Score Hero */}
          <FadeInSection>
            <div className="text-center mb-10">
              <p
                className="text-xs uppercase mb-4"
                style={{ color: ACCENT, fontFamily: SPACE_MONO, letterSpacing: '0.4em' }}
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
                    stroke="rgba(0,0,0,0.08)"
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
                  <span style={{ color: 'rgba(0,0,0,0.55)', fontFamily: SPACE_MONO, fontSize: '18px' }}>/10</span>
                </div>
              </div>

              <h2
                className="text-2xl font-bold uppercase mb-2"
                style={{ fontFamily: OSWALD, color: getScoreLabel(parseFloat(displayScore)).color }}
              >
                {getScoreLabel(parseFloat(displayScore)).text}
              </h2>
              <p style={{ color: 'rgba(0,0,0,0.5)', fontFamily: SPACE_MONO, fontSize: '12px' }}>
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
                        <p>Total Score: <span style={{ color: INK, fontWeight: 700 }}>{displayScore}/10</span></p>
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
                style={{ color: ACCENT, fontFamily: SPACE_MONO, letterSpacing: '0.4em', fontSize: '11px' }}
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
                  <p style={{ color: 'rgba(0,0,0,0.55)', fontFamily: SPACE_MONO, fontSize: '12px', lineHeight: 1.6 }}>
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
                  <p style={{ color: 'rgba(0,0,0,0.55)', fontFamily: SPACE_MONO, fontSize: '12px', lineHeight: 1.6 }}>
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
                      onViewDetails={() => setDetailProduct(product)}
                    />
                  </FadeInSection>
                ))}

                {specialAIPick && (
                  <FadeInSection delay={recommendations.length * 0.1}>
                    <SpecialAIPickCard
                      product={specialAIPick}
                      onAddToCart={() => onAddIndividual(specialAIPick)}
                      isAdded={addedIndividual[specialAIPick.title]}
                      onViewDetails={() => setDetailProduct(specialAIPick)}
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
                  borderRadius: '10px',
                  boxShadow: `0 4px 24px rgba(${ACCENT_RGB}, 0.35)`,
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
              <p className="text-center mt-4" style={{ color: 'rgba(0,0,0,0.45)', fontFamily: SPACE_MONO, fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Pharmaceutical grade &bull; 3rd party tested &bull; Free US shipping
              </p>

              {/* Secondary CTAs */}
              <div className="flex flex-col gap-3 mt-6">
                <button
                  onClick={async () => {
                    const { getCheckoutUrl } = await import('../lib/shopify');
                    const url = await getCheckoutUrl();
                    window.open(url, '_blank');
                  }}
                  className="w-full py-4 px-6 font-bold uppercase flex items-center justify-center gap-2 transition-all"
                  style={{
                    fontFamily: OSWALD,
                    fontSize: '16px',
                    letterSpacing: '0.15em',
                    background: ACCENT,
                    color: '#000000',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  VIEW CART &amp; CHECKOUT →
                </button>
                <Link
                  href="/dashboard"
                  className="w-full py-4 px-6 font-bold uppercase flex items-center justify-center gap-2 no-underline transition-all"
                  style={{
                    fontFamily: OSWALD,
                    fontSize: '16px',
                    letterSpacing: '0.15em',
                    background: 'transparent',
                    color: ACCENT,
                    border: `2px solid ${ACCENT}`,
                    borderRadius: '10px',
                    textDecoration: 'none',
                  }}
                >
                  BUILD YOUR STACK →
                </Link>
              </div>
            </section>
          </FadeInSection>

          {/* Performance Breakdown with Population Comparisons */}
          <FadeInSection delay={0.2}>
            <section className="mb-10 p-6" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
              <p
                className="text-xs uppercase mb-3"
                style={{ color: ACCENT, fontFamily: SPACE_MONO, letterSpacing: '0.4em', fontSize: '11px' }}
              >
                BREAKDOWN
              </p>
              <h3 className="text-2xl font-bold uppercase mb-6" style={{ fontFamily: OSWALD }}>
                PERFORMANCE <span style={{ color: ACCENT }}>METRICS</span>
              </h3>

              <div className="space-y-5">
                {[
                  { icon: BedDouble, label: 'Sleep & Recovery', score: scores.sleep, max: 25, avg: POPULATION_AVERAGES.sleep, iconColor: ACCENT },
                  { icon: Battery, label: 'Energy Output', score: scores.energy, max: 20, avg: POPULATION_AVERAGES.energy, iconColor: ACCENT },
                  { icon: Heart, label: 'Stress Management', score: scores.stress, max: 20, avg: POPULATION_AVERAGES.stress, iconColor: ACCENT },
                  { icon: Target, label: 'Goal Alignment', score: scores.goalAlignment, max: 20, avg: POPULATION_AVERAGES.goalAlignment, iconColor: ACCENT },
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
                          <span style={{ color: 'rgba(0,0,0,0.5)', fontFamily: SPACE_MONO, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span style={{ color: INK, fontFamily: OSWALD, fontSize: '14px', fontWeight: 700 }}>{score}/{max}</span>
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
                      <div className="relative h-2 overflow-hidden" style={{ background: 'rgba(0,0,0,0.08)' }}>
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
                        <span style={{ fontSize: '9px', color: 'rgba(0,0,0,0.55)', fontFamily: SPACE_MONO, textTransform: 'uppercase' }}>Your score</span>
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
                    style={{ color: ACCENT, fontFamily: SPACE_MONO, letterSpacing: '0.4em', fontSize: '11px' }}
                  >
                    TRACK PROGRESS
                  </p>
                  <h3 className="text-2xl font-bold uppercase mb-3" style={{ fontFamily: OSWALD }}>
                    SAVE YOUR <span style={{ color: ACCENT }}>RESULTS</span>
                  </h3>
                  <p className="mb-6 max-w-lg mx-auto" style={{ color: 'rgba(0,0,0,0.55)', fontFamily: SPACE_MONO, fontSize: '12px', lineHeight: 1.6 }}>
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
                      <div key={idx} className="flex items-center gap-2" style={{ color: 'rgba(0,0,0,0.5)', fontFamily: SPACE_MONO, fontSize: '11px' }}>
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

      {/* Product Detail Modal */}
      {detailProduct && (
        <ProductDetailModal
          product={detailProduct}
          onClose={() => setDetailProduct(null)}
          onAddToCart={() => {
            onAddIndividual(detailProduct);
            setDetailProduct(null);
          }}
          added={addedIndividual[detailProduct.title]}
        />
      )}

      {/* Signup Modal */}
      <AnimatePresence>
        {showSignupModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center px-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={dismissSignupModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              className="w-full max-w-[380px] rounded-2xl relative overflow-hidden"
              style={{ background: '#0a0a0a', border: '1px solid rgba(0,255,204,0.15)' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={dismissSignupModal}
                className="absolute top-3 right-3 z-10 bg-transparent border-none cursor-pointer"
                style={{ color: '#666', fontSize: '18px' }}
              >
                ✕
              </button>

              <div className="p-6 pt-8 text-center">
                {/* Logo */}
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,255,204,0.1)', border: '1px solid rgba(0,255,204,0.2)' }}>
                    <span style={{ fontFamily: OSWALD, fontSize: '18px', fontWeight: 700, color: ACCENT, letterSpacing: '0.1em' }}>A</span>
                  </div>
                </div>

                {/* Headline */}
                <h2 style={{ fontFamily: OSWALD, fontSize: '24px', fontWeight: 700, color: '#fff', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Save Your Results
                </h2>
                <p style={{ fontFamily: SPACE_MONO, fontSize: '11px', color: '#888', lineHeight: 1.6, marginBottom: '20px' }}>
                  Create a free account to save your personalized stack, track your optimization score, and get recommendations tailored to you.
                </p>

                {/* Form */}
                <form onSubmit={handleSignupSubmit} className="space-y-3">
                  <input
                    type="email"
                    placeholder="Email"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: '#111',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontFamily: SPACE_MONO,
                      fontSize: '12px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'rgba(0,255,204,0.4)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm(prev => ({ ...prev, password: e.target.value }))}
                    required
                    minLength={6}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: '#111',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontFamily: SPACE_MONO,
                      fontSize: '12px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'rgba(0,255,204,0.4)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />

                  {signupError && (
                    <p style={{ fontFamily: SPACE_MONO, fontSize: '10px', color: '#ff2d55', textAlign: 'left' }}>
                      {signupError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={signupLoading}
                    className="w-full cursor-pointer transition-all"
                    style={{
                      padding: '14px',
                      background: signupLoading ? '#333' : ACCENT,
                      color: '#000',
                      border: 'none',
                      borderRadius: '8px',
                      fontFamily: OSWALD,
                      fontSize: '16px',
                      fontWeight: 700,
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      opacity: signupLoading ? 0.6 : 1,
                    }}
                  >
                    {signupLoading ? 'Loading...' : signupMode === 'signup' ? 'Create Account' : 'Sign In'}
                  </button>
                </form>

                <p className="mt-4" style={{ fontFamily: SPACE_MONO, fontSize: '10px', color: '#666' }}>
                  {signupMode === 'signup' ? (
                    <>Already have an account?{' '}
                      <button onClick={() => { setSignupMode('signin'); setSignupError(''); }} className="bg-transparent border-none cursor-pointer" style={{ color: ACCENT, fontFamily: SPACE_MONO, fontSize: '10px', textDecoration: 'underline' }}>
                        Sign in
                      </button>
                    </>
                  ) : (
                    <>Need an account?{' '}
                      <button onClick={() => { setSignupMode('signup'); setSignupError(''); }} className="bg-transparent border-none cursor-pointer" style={{ color: ACCENT, fontFamily: SPACE_MONO, fontSize: '10px', textDecoration: 'underline' }}>
                        Create one
                      </button>
                    </>
                  )}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Product Card Component ───
function ProductCard({ product, onAddToCart, isAdded, onViewDetails }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="p-5" style={{ background: '#ffffff', border: `1.5px solid ${CARD_BORDER}`, borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
      <div className="flex items-start gap-4">
        {product.image ? (
          <div className="w-20 h-20 overflow-hidden flex-shrink-0 rounded-lg" style={{ background: CREAM }}>
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

          <div className="mb-3 p-3" style={{ background: CREAM, borderRadius: '8px', borderLeft: `3px solid ${ACCENT}` }}>
            <p className="mb-1" style={{ color: ACCENT, fontFamily: SPACE_MONO, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              Perfect For You Because:
            </p>
            <p className={expanded ? '' : 'line-clamp-2'} style={{ color: INK, fontFamily: SPACE_MONO, fontSize: '11px', lineHeight: 1.6 }}>
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
                color: expanded ? ACCENT : 'rgba(0,0,0,0.5)',
                background: expanded ? `rgba(${ACCENT_RGB}, 0.1)` : 'rgba(0,0,0,0.03)',
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
                  <p style={{ color: 'rgba(0,0,0,0.55)', fontFamily: SPACE_MONO, fontSize: '11px', lineHeight: 1.6 }}>{product.description}</p>
                </div>
              )}
              {product.ingredients && (
                <div className="mb-3">
                  <p style={{ color: ACCENT, fontFamily: SPACE_MONO, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '4px' }}>Key Ingredients</p>
                  <p style={{ color: 'rgba(0,0,0,0.55)', fontFamily: SPACE_MONO, fontSize: '11px', lineHeight: 1.6 }}>{product.ingredients}</p>
                </div>
              )}
              {product.dosage && (
                <div className="mb-3">
                  <p style={{ color: ACCENT, fontFamily: SPACE_MONO, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '4px' }}>Recommended Dosage</p>
                  <p style={{ color: 'rgba(0,0,0,0.55)', fontFamily: SPACE_MONO, fontSize: '11px', lineHeight: 1.6 }}>{product.dosage}</p>
                </div>
              )}
              {product.benefits && (
                <div className="mb-3">
                  <p style={{ color: ACCENT, fontFamily: SPACE_MONO, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '4px' }}>Benefits</p>
                  <p style={{ color: 'rgba(0,0,0,0.55)', fontFamily: SPACE_MONO, fontSize: '11px', lineHeight: 1.6 }}>{product.benefits}</p>
                </div>
              )}
              {!product.description && !product.ingredients && !product.dosage && !product.benefits && (
                <div className="mb-3">
                  <p style={{ color: ACCENT, fontFamily: SPACE_MONO, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '4px' }}>Product Details</p>
                  <p style={{ color: 'rgba(0,0,0,0.55)', fontFamily: SPACE_MONO, fontSize: '11px', lineHeight: 1.6 }}>
                    {product.reasoning || 'Premium supplement formulated to support your fitness goals.'}
                  </p>
                </div>
              )}
              {onViewDetails && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails();
                  }}
                  className="w-full mb-3 py-2.5 flex items-center justify-center gap-2 font-bold uppercase transition-all"
                  style={{
                    fontFamily: OSWALD,
                    fontSize: '12px',
                    letterSpacing: '0.1em',
                    background: 'transparent',
                    color: ACCENT,
                    border: `1px solid rgba(${ACCENT_RGB}, 0.3)`,
                    cursor: 'pointer',
                  }}
                >
                  View Ingredients & Full Details
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded(false);
                }}
                className="flex items-center gap-1 bg-transparent border-none cursor-pointer"
                style={{ color: 'rgba(0,0,0,0.55)', fontFamily: SPACE_MONO, fontSize: '10px', textTransform: 'uppercase' }}
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
function SpecialAIPickCard({ product, onAddToCart, isAdded, onViewDetails }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="relative overflow-hidden p-[2px]"
      style={{
        background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT}88, ${ACCENT}, ${ACCENT}88)`,
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

      <div className="p-5" style={{ background: '#ffffff' }}>
        {/* Special Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span
            className="flex items-center gap-1.5 px-3 py-1"
            style={{
              background: `rgba(${ACCENT_RGB}, 0.12)`,
              color: ACCENT,
              border: `1px solid rgba(${ACCENT_RGB}, 0.3)`,
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

            <div className="mb-4 p-3" style={{ background: CREAM, borderRadius: '8px', borderLeft: `3px solid ${ACCENT}` }}>
              <p className="mb-1" style={{ color: ACCENT, fontFamily: SPACE_MONO, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                AI Selected Because:
              </p>
              <p style={{ color: INK, fontFamily: SPACE_MONO, fontSize: '11px', lineHeight: 1.6 }}>
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
                    <p style={{ color: 'rgba(0,0,0,0.55)', fontFamily: SPACE_MONO, fontSize: '11px', lineHeight: 1.6 }}>{product.description}</p>
                  </div>
                )}
                {product.ingredients && (
                  <div className="mb-3">
                    <p style={{ color: ACCENT, fontFamily: SPACE_MONO, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '4px' }}>Key Ingredients</p>
                    <p style={{ color: 'rgba(0,0,0,0.55)', fontFamily: SPACE_MONO, fontSize: '11px', lineHeight: 1.6 }}>{product.ingredients}</p>
                  </div>
                )}
                {product.dosage && (
                  <div className="mb-3">
                    <p style={{ color: ACCENT, fontFamily: SPACE_MONO, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '4px' }}>Recommended Dosage</p>
                    <p style={{ color: 'rgba(0,0,0,0.55)', fontFamily: SPACE_MONO, fontSize: '11px', lineHeight: 1.6 }}>{product.dosage}</p>
                  </div>
                )}
                {product.benefits && (
                  <div className="mb-3">
                    <p style={{ color: ACCENT, fontFamily: SPACE_MONO, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '4px' }}>Benefits</p>
                    <p style={{ color: 'rgba(0,0,0,0.55)', fontFamily: SPACE_MONO, fontSize: '11px', lineHeight: 1.6 }}>{product.benefits}</p>
                  </div>
                )}
                {!product.description && !product.ingredients && !product.dosage && !product.benefits && (
                  <div className="mb-3">
                    <p style={{ color: ACCENT, fontFamily: SPACE_MONO, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '4px' }}>Product Details</p>
                    <p style={{ color: 'rgba(0,0,0,0.55)', fontFamily: SPACE_MONO, fontSize: '11px', lineHeight: 1.6 }}>
                      {product.reasoning || 'Premium supplement formulated to support your fitness goals.'}
                    </p>
                  </div>
                )}
                {onViewDetails && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetails();
                    }}
                    className="w-full mb-3 py-2.5 flex items-center justify-center gap-2 font-bold uppercase transition-all"
                    style={{
                      fontFamily: OSWALD,
                      fontSize: '12px',
                      letterSpacing: '0.1em',
                      background: 'transparent',
                      color: ACCENT,
                      border: `1px solid rgba(${ACCENT_RGB}, 0.3)`,
                      cursor: 'pointer',
                    }}
                  >
                    View Ingredients & Full Details
                  </button>
                )}
                <button
                  onClick={() => setExpanded(false)}
                  className="flex items-center gap-1 bg-transparent border-none cursor-pointer"
                  style={{ color: 'rgba(0,0,0,0.55)', fontFamily: SPACE_MONO, fontSize: '10px', textTransform: 'uppercase' }}
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
