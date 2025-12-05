'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Heart, Target, Pill, Info, Dumbbell, Sparkles, ShoppingCart, ExternalLink, Flame, Brain, Moon, Zap, X, Plus, Minus, Check, Clock, TrendingUp, CheckCircle } from 'lucide-react';
import { products, PRODUCT_CATEGORIES } from '../data/products';

// Convert products.js catalog to quiz format
const createSupplementDatabase = () => {
  try {
    const database = {};

    // Map categories from products.js to quiz categories
    const categoryMap = {
      [PRODUCT_CATEGORIES.PERFORMANCE]: 'muscle',
      [PRODUCT_CATEGORIES.WEIGHT_LOSS]: 'fatloss',
      [PRODUCT_CATEGORIES.HEALTH]: 'longevity',
      [PRODUCT_CATEGORIES.RECOVERY]: 'sleep',
      [PRODUCT_CATEGORIES.FOCUS]: 'focus',
      [PRODUCT_CATEGORIES.BEAUTY]: 'beauty'
    };

    if (!products || !Array.isArray(products)) {
      console.error('[SupplementQuiz] Products not loaded correctly');
      return {};
    }

    products.filter(p => p && p.active).forEach(product => {
      if (product && product.name) {
        database[product.name] = {
          category: categoryMap[product.category] || 'longevity',
          info: product.description || 'Premium supplement',
          dosage: product.dosage || 'As directed',
          timing: product.timing || 'As directed',
          priority: product.priority === 'essential' ? 'Essential' : product.priority === 'high' ? 'High' : 'Medium',
          suplifulId: product.id,
          price: product.price || 0,
          image: 'supplement'
        };
      }
    });

    console.log('[SupplementQuiz] Database initialized with', Object.keys(database).length, 'products');
    return database;
  } catch (error) {
    console.error('[SupplementQuiz] Error creating database:', error);
    return {};
  }
};

const SUPPLEMENT_DATABASE = createSupplementDatabase();


export default function SupplementAdvisor() {
  const [showLanding, setShowLanding] = useState(true);
  const [step, setStep] = useState(0);
  const [primaryGoal, setPrimaryGoal] = useState('');
  const [formData, setFormData] = useState({
    age: '', gender: '', weight: '', height: '', sleepHours: '', stressLevel: '',
    dietType: '', healthGoals: [], conditions: [], energyLevel: '', trainingExperience: '',
    activityLevel: '', workoutFrequency: '', biggestChallenge: ''
  });
  const [recommendations, setRecommendations] = useState(null);
  const [expandedSupplement, setExpandedSupplement] = useState(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [useAIRecommendations, setUseAIRecommendations] = useState(false);
  const [aiEnhancementData, setAiEnhancementData] = useState({
    mainGoal: '',
    biggestObstacle: '',
    desiredResults: '',
    additionalInfo: ''
  });

  // SHOPPING CART STATE
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const goalCategories = [
    { id: 'muscle', title: 'Build Muscle & Strength', icon: Dumbbell, description: 'Pack on size, max strength, get powerful', color: 'from-primary via-accent to-violet', emoji: '💪' },
    { id: 'fatloss', title: 'Lose Fat & Get Lean', icon: Flame, description: 'Shed pounds, reveal definition, beach ready', color: 'from-accent via-violet to-primary', emoji: '🔥' },
    { id: 'tone', title: 'Tone & Sculpt', icon: Activity, description: 'Lean, toned, fit physique without bulk', color: 'from-violet via-primary to-accent', emoji: '✨' },
    { id: 'athletic', title: 'Athletic Performance', icon: Zap, description: 'Speed, endurance, explosiveness, sports', color: 'from-primary via-accent to-violet', emoji: '⚡' },
    { id: 'beauty', title: 'Beauty & Anti-Aging', icon: Sparkles, description: 'Glowing skin, strong hair nails, youthful', color: 'from-accent via-violet to-primary', emoji: '💅' },
    { id: 'sleep', title: 'Sleep & Recovery', icon: Moon, description: 'Deep rest, repair, recharge, destress', color: 'from-violet via-primary to-accent', emoji: '😴' },
    { id: 'focus', title: 'Focus & Productivity', icon: Brain, description: 'Mental clarity, energy, crush work', color: 'from-primary via-accent to-violet', emoji: '🧠' },
    { id: 'longevity', title: 'Longevity & Wellness', icon: Heart, description: 'Disease prevention, anti-aging, feel great', color: 'from-accent via-violet to-primary', emoji: '❤️' }
  ];

  const healthGoalsByCategory = {
    muscle: ['Maximum Strength', 'Muscle Mass', 'Power Output', 'Faster Recovery', 'Better Pumps', 'Workout Intensity'],
    fatloss: ['Burn Fat Fast', 'Boost Metabolism', 'Control Appetite', 'Maintain Muscle', 'More Energy', 'Faster Results'],
    tone: ['Lean Definition', 'Toned Arms', 'Flat Stomach', 'Sculpted Legs', 'Maintain Curves', 'Light Cardio Energy'],
    athletic: ['Endurance', 'Speed', 'Explosiveness', 'Faster Recovery', 'Competition Ready', 'Hydration'],
    beauty: ['Clear Skin', 'Hair Growth', 'Strong Nails', 'Reduce Wrinkles', 'Youthful Glow', 'Less Inflammation'],
    sleep: ['Fall Asleep Fast', 'Deep Sleep', 'Wake Refreshed', 'Reduce Stress', 'Muscle Recovery', 'Calm Mind'],
    focus: ['Mental Clarity', 'Sustained Energy', 'No Crashes', 'Productivity', 'Memory', 'Reduce Brain Fog'],
    longevity: ['Heart Health', 'Immune System', 'Joint Health', 'Inflammation', 'Energy Levels', 'Disease Prevention']
  };

  // SHOPPING CART FUNCTIONS
  const addToCart = (supplementName) => {
    const supplement = SUPPLEMENT_DATABASE[supplementName];
    const existingItem = cart.find(item => item.name === supplementName);

    if (existingItem) {
      setCart(cart.map(item =>
        item.name === supplementName
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        name: supplementName,
        price: supplement.price,
        suplifulId: supplement.suplifulId,
        quantity: 1
      }]);
    }
  };

  const removeFromCart = (supplementName) => {
    setCart(cart.filter(item => item.name !== supplementName));
  };

  const updateQuantity = (supplementName, change) => {
    setCart(cart.map(item => {
      if (item.name === supplementName) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const addAllToCart = () => {
    if (recommendations && recommendations.stack) {
      recommendations.stack.forEach(supp => addToCart(supp.name));
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const getSupplementImage = (name) => {
    const baseUrl = 'data:image/svg+xml,';
    const svg = (color, text) => `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1F2937"/><stop offset="100%" stop-color="#111827"/></linearGradient><linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${color}" stop-opacity="0.8"/><stop offset="100%" stop-color="${color}" stop-opacity="0.4"/></linearGradient></defs><rect width="400" height="300" fill="url(#bg)" rx="16"/><rect x="20" y="20" width="360" height="260" fill="none" stroke="url(#accent)" stroke-width="2" rx="12" opacity="0.3"/><text x="50%" y="45%" font-family="system-ui" font-size="32" font-weight="700" text-anchor="middle" fill="white" opacity="0.95">${text}</text><rect x="50%" y="55%" width="120" height="2" transform="translate(-60,0)" fill="url(#accent)" opacity="0.6"/><text x="50%" y="68%" font-family="system-ui" font-size="14" letter-spacing="2" text-anchor="middle" fill="white" opacity="0.5">SUPPLEMENT</text></svg>`;

    const imageMap = {
      'creatine': ['#3B82F6', 'CREATINE'],
      'protein': ['#60A5FA', 'WHEY PROTEIN'],
      'preworkout': ['#3B82F6', 'PRE-WORKOUT'],
      'bcaa': ['#06B6D4', 'BCAAs'],
      'citrulline': ['#2DD4BF', 'CITRULLINE'],
      'betaalanine': ['#2DD4BF', 'BETA-ALANINE'],
      'caffeine': ['#3B82F6', 'CAFFEINE'],
      'greentea': ['#06B6D4', 'GREEN TEA'],
      'collagen': ['#60A5FA', 'COLLAGEN'],
      'biotin': ['#3B82F6', 'BIOTIN'],
      'omega3': ['#06B6D4', 'OMEGA-3'],
      'magnesium': ['#3B82F6', 'MAGNESIUM'],
      'theanine': ['#60A5FA', 'L-THEANINE'],
      'melatonin': ['#3B82F6', 'MELATONIN'],
      'vitamind': ['#60A5FA', 'VITAMIN D'],
      'multivitamin': ['#06B6D4', 'MULTIVITAMIN'],
      'electrolyte': ['#2DD4BF', 'ELECTROLYTES'],
      'fiber': ['#06B6D4', 'FIBER'],
      'b12': ['#3B82F6', 'B12'],
      'alphagpc': ['#60A5FA', 'ALPHA-GPC'],
      'lionsmane': ['#2DD4BF', 'LIONS MANE'],
      'coq10': ['#2DD4BF', 'CoQ10'],
      'vitaminc': ['#3B82F6', 'VITAMIN C']
    };

    const supplement = SUPPLEMENT_DATABASE[name];
    if (supplement && supplement.image && imageMap[supplement.image]) {
      const [color, text] = imageMap[supplement.image];
      return baseUrl + encodeURIComponent(svg(color, text));
    }
    return baseUrl + encodeURIComponent(svg('#6B7280', 'SUPPLEMENT'));
  };

  const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const toggleArrayField = (field, value) => setFormData(prev => ({
    ...prev,
    [field]: prev[field].includes(value) ? prev[field].filter(item => item !== value) : [...prev[field], value]
  }));

  // AI-powered recommendation generation
  const generateAIRecommendations = async () => {
    setIsGeneratingAI(true);
    try {
      const response = await fetch('/api/ai/supplement-recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          primaryGoal,
          formData,
          quizResults: {
            goal: primaryGoal,
            ...formData
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate AI recommendations');
      }

      const data = await response.json();
      
      if (data.success && data.recommendations) {
        // Map AI recommendations to our format
        const aiStack = data.recommendations.supplements || [];
        const mappedStack = aiStack.map(supp => {
          // Try to find in database, otherwise use AI data
          const dbSupp = SUPPLEMENT_DATABASE[supp.name];
          return {
            name: supp.name,
            dosage: supp.dosage || dbSupp?.dosage || 'As directed',
            timing: supp.timing || dbSupp?.timing || 'As directed',
            reason: supp.reason || 'AI recommended based on your profile',
            priority: supp.priority || dbSupp?.priority || 'Medium',
            isAIRecommended: true
          };
        });

        setRecommendations({
          stack: mappedStack,
          insights: data.recommendations.insights || [],
          summary: data.recommendations.summary || '',
          isAI: true
        });
        setStep(4);
      } else {
        throw new Error('Invalid response from AI');
      }
    } catch (error) {
      console.error('Error generating AI recommendations:', error);
      alert('Failed to generate AI recommendations. Using standard recommendations instead.');
      generateRecommendations();
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Standard rule-based recommendation generation
  const generateRecommendations = () => {
    const stack = [];
    const insights = [];
    const trainsFrequently = formData.workoutFrequency === '5-6' || formData.workoutFrequency === '7+';
    const needsRecovery = trainsFrequently || formData.biggestChallenge === 'recovery';
    const isVeganVeg = formData.dietType === 'vegan' || formData.dietType === 'vegetarian';

    // Helper function to add supplement
    const addSupplement = (name, reason) => {
      const supp = SUPPLEMENT_DATABASE[name];
      if (supp) {
        stack.push({
          name,
          dosage: supp.dosage,
          timing: supp.timing,
          reason,
          priority: supp.priority
        });
      } else {
        console.warn('[SupplementQuiz] Product not found in database:', name);
      }
    };

    // GOAL-BASED RECOMMENDATIONS (using actual products from catalog)
    if (primaryGoal === 'muscle') {
      addSupplement('Creatine Monohydrate', 'Gold standard for strength and power gains');
      addSupplement('Whey Protein Isolate (Chocolate)', 'Fast protein for muscle protein synthesis');
      addSupplement('Pre-Workout Formula', 'Intense workouts and better pumps');
      addSupplement('BCAAs', 'Enhanced recovery and muscle preservation');
      if (needsRecovery) addSupplement('L-Glutamine', 'Extra recovery for frequent training');
      if (formData.healthGoals.includes('Better Pumps')) addSupplement('Beetroot', 'Enhanced blood flow and pumps');
      insights.push('Progressive overload - increase weight weekly', 'Eat 200-500 calories above maintenance', 'Prioritize 7-9 hours sleep for recovery');
    }

    else if (primaryGoal === 'fatloss') {
      addSupplement('Fat Burner with MCT', 'Boosts metabolism and fat burning');
      addSupplement('Green Tea Extract', 'Increases fat oxidation');
      addSupplement('Whey Protein Isolate (Vanilla)', 'Preserves muscle, increases satiety');
      addSupplement('Keto BHB', 'Supports fat burning and clean energy');
      if (formData.biggestChallenge === 'appetite') addSupplement('Fiber Supplement (Gut Health)', 'Helps you feel full longer');
      insights.push('Deficit of 300-500 calories for sustainable fat loss', 'Keep protein high (1g per lb bodyweight)', 'Combine resistance training with cardio');
    }

    else if (primaryGoal === 'tone') {
      addSupplement('Whey Protein Isolate (Chocolate)', 'Builds lean muscle for toned look');
      addSupplement('Collagen Peptides', 'Supports skin and lean tone');
      addSupplement('Green Tea Extract', 'Gentle metabolism boost');
      insights.push('Moderate deficit: 200-300 calories', 'Mix resistance with cardio 4-5x weekly', 'Stay consistent for 8-12 weeks');
    }

    else if (primaryGoal === 'athletic') {
      addSupplement('Creatine Monohydrate', 'Explosive power and speed');
      addSupplement('Pre-Workout Formula', 'Delays fatigue, improves performance');
      addSupplement('Electrolyte Formula (Lemonade)', 'Prevents dehydration and cramping');
      addSupplement('Beetroot Powder', 'Boosts endurance and oxygen use');
      if (needsRecovery) addSupplement('Platinum Turmeric', 'Reduces muscle soreness and inflammation');
      insights.push('Recovery is crucial - 7-9 hours sleep', 'Periodize training for peak performance', 'Stay hydrated: 0.5-1 oz per lb bodyweight');
    }

    else if (primaryGoal === 'beauty') {
      addSupplement('Collagen Peptides', 'Improves skin elasticity and hydration');
      addSupplement('Hyaluronic Acid Serum', 'Intense skin hydration from within');
      addSupplement('Omega-3 Fish Oil', 'Reduces inflammation, adds glow');
      addSupplement('Vitamin Glow Serum', 'Brightens and evens skin tone');
      insights.push('Beauty supplements need 8-12 weeks consistency', 'Hydrate: 8+ glasses water daily', 'Protect skin with SPF daily');
    }

    else if (primaryGoal === 'sleep') {
      addSupplement('Magnesium Glycinate', 'Relaxes muscles, deepens sleep');
      addSupplement('Sleep Support (Melatonin)', 'Regulates sleep-wake cycle');
      addSupplement('Ashwagandha', 'Reduces stress and cortisol');
      insights.push('No screens 1 hour before bed', 'Keep bedroom cool (65-68°F)', 'Consistent sleep schedule, even weekends');
    }

    else if (primaryGoal === 'focus') {
      addSupplement("Lion's Mane Mushroom", 'Supports brain health and cognitive function');
      addSupplement('Green Tea Extract', 'Smooth energy and mental clarity');
      addSupplement('Omega-3 Fish Oil', 'Supports brain function and focus');
      insights.push('Time deep work during peak focus hours', 'Take breaks every 90 minutes', 'Stay hydrated for mental performance');
    }

    else if (primaryGoal === 'longevity') {
      addSupplement('Omega-3 Fish Oil', 'Heart health and brain function');
      addSupplement('Complete MultiVitamin', 'Micronutrient insurance');
      addSupplement('CoQ10', 'Cellular energy and heart support');
      addSupplement('Probiotics 40 Billion', 'Gut health and immunity');
      addSupplement('Platinum Turmeric', 'Anti-inflammatory powerhouse');
      insights.push('Longevity is 80% lifestyle habits', 'Exercise 150+ min per week', 'Prioritize sleep, stress management, nutrition');
    }

    // UNIVERSAL ADDITIONS
    if (!stack.find(s => s.name === 'Magnesium Glycinate')) {
      addSupplement('Magnesium Glycinate', 'Critical for 300+ bodily functions');
    }

    if (isVeganVeg) {
      // Note: No B12 in current catalog, but we can add Multivitamin
      if (!stack.find(s => s.name.includes('MultiVitamin'))) {
        addSupplement('Complete MultiVitamin', 'Essential micronutrients for vegans/vegetarians');
      }
    }

    insights.push('Consistency beats perfection', 'Give supplements 8-12 weeks to work', '⚠️ ALWAYS consult healthcare provider first');

    setRecommendations({ stack, insights });
    setStep(4);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] p-4 md:p-8 py-12">
      <div className="max-w-6xl mx-auto">
        {/* HEADER WITH CART */}
        {!showLanding && (
          <div className="text-center mb-8 relative">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-[var(--acc)]/20 rounded-2xl blur-xl"></div>
                <div className="relative bg-[var(--charcoal-light)] p-3 rounded-2xl shadow-premium-lg border border-[var(--border)] icon-aivra">
                  <div className="relative">
                    <Pill className="relative text-white fill-current" size={44} style={{ filter: 'drop-shadow(0 0 8px rgba(96, 165, 250, 0.8))' }} />
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif', textShadow: '0 0 20px rgba(0, 217, 255, 0.5)' }}>
                  Aviera Stack
                </h1>
                <div className="w-[60px] h-[2px] bg-[#00d9ff] mt-2"></div>
              </div>
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setShowCart(!showCart)}
              className="fixed top-6 right-6 z-50 bg-[var(--acc)] text-white p-4 rounded-full shadow-accent hover:bg-blue-600 transition-all duration-300 flex items-center gap-2"
            >
              <ShoppingCart size={24} />
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-normal rounded-full w-6 h-6 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </button>
          </div>
        )}

        {/* SHOPPING CART MODAL */}
        {showCart && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowCart(false)}>
            <div className="bg-[var(--bg-elev-1)] rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-[var(--border)]" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-[var(--border)] flex items-center justify-between bg-[var(--acc)]">
                <h2 className="text-2xl font-normal text-white flex items-center gap-2">
                  <ShoppingCart size={28} />
                  Your Stack ({getCartCount()} items)
                </h2>
                <button onClick={() => setShowCart(false)} className="text-white hover:bg-white/20 rounded-full p-2 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart size={64} className="mx-auto text-[var(--txt-muted)] mb-4" />
                    <p className="text-[var(--txt-muted)] text-lg">Your cart is empty</p>
                    <p className="text-[var(--txt-muted)]/60 text-sm mt-2">Add supplements from your recommendations!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.name} className="flex items-center gap-4 p-4 bg-[var(--bg-elev-2)] rounded-xl border border-[var(--border)]">
                        <div className="flex-1">
                          <h3 className="font-normal text-[var(--txt)]">{item.name}</h3>
                          <p className="text-sm text-[var(--txt-muted)]">${item.price.toFixed(2)} each</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.name, -1)}
                            className="p-1 rounded-lg bg-[var(--bg-elev-1)] hover:bg-[var(--bg-elev-2)] transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="font-normal text-[var(--txt)] w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.name, 1)}
                            className="p-1 rounded-lg bg-[var(--bg-elev-1)] hover:bg-[var(--bg-elev-2)] transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="font-normal text-[var(--txt)]">${(item.price * item.quantity).toFixed(2)}</p>
                          <button
                            onClick={() => removeFromCart(item.name)}
                            className="text-xs text-red-600 hover:text-red-700 mt-1"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-[var(--border)] bg-[var(--bg-elev-1)]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-normal text-[var(--txt)]">Total:</span>
                    <span className="text-3xl font-normal text-[var(--acc)]">${getCartTotal()}</span>
                  </div>
                  <button className="w-full py-4 px-6 rounded-lg bg-[var(--acc)] text-white text-lg font-normal hover:bg-blue-600 hover:shadow-accent transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5">
                    <Check size={24} />
                    Checkout with Supliful
                  </button>
                  <p className="text-xs text-[var(--txt-muted)] text-center mt-3">
                    Secure checkout • Free shipping over $50
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="glass-card max-w-4xl mx-auto p-8 md:p-12">
          {/* Progress Bar */}
          {!showLanding && step < 4 && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-light text-[var(--txt-muted)]">
                  Step {step + 1} of 4
                </span>
                <span className="text-sm font-light text-[var(--txt-muted)]">
                  {Math.round(((step + 1) / 4) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 bg-[var(--bg-elev-2)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--acc)] transition-all duration-300 ease-out rounded-full"
                  style={{
                    width: `${((step + 1) / 4) * 100}%`,
                    boxShadow: '0 0 12px rgba(96, 165, 250, 0.5)'
                  }}
                />
              </div>
            </div>
          )}

          {/* LANDING PAGE */}
          {showLanding && (
            <div className="space-y-8">
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[var(--acc)]/20 rounded-3xl blur-2xl"></div>
                    <div className="relative bg-[var(--charcoal-light)] p-6 rounded-3xl shadow-premium-lg border border-[var(--border)] icon-aivra">
                      <div className="relative">
                        <Pill className="relative text-white fill-current" size={64} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center mb-4">
                  <h1 className="text-5xl md:text-7xl font-bold text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif', textShadow: '0 0 20px rgba(0, 217, 255, 0.5)' }}>
                    Aviera Stack
                  </h1>
                  <div className="w-[60px] h-[2px] bg-[#00d9ff] mt-2"></div>
                </div>
                <p className="text-2xl text-[var(--txt)] font-normal">Your Personal Supplement Intelligence</p>
                <p className="text-lg text-[var(--txt-muted)] max-w-2xl mx-auto">Get a personalized supplement stack from our database of 42+ premium supplements</p>
              </div>
              <div className="text-center space-y-4 max-w-xl mx-auto">
                <button onClick={() => setShowLanding(false)} className="w-full py-4 px-8 rounded-lg bg-[var(--acc)] text-white text-xl font-normal hover:bg-blue-600 hover:shadow-accent transition-all duration-300">Get Your Stack →</button>
                <p className="text-[var(--txt-muted)] text-sm">Free • 2 minutes • Science-backed • 42+ Supplements</p>
              </div>
            </div>
          )}

          {/* STEP 0: GOAL SELECTION */}
          {!showLanding && step === 0 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-normal text-[var(--txt)] mb-3">What is Your Main Goal?</h2>
                <p className="text-[var(--txt-muted)]">Choose the one that resonates most</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goalCategories.map(goal => {
                  const Icon = goal.icon;
                  return (
                    <button key={goal.id} onClick={() => { setPrimaryGoal(goal.id); setStep(1); }} className="group p-6 bg-[var(--bg-elev-1)] rounded-2xl border-2 border-[var(--border)] hover:border-[var(--acc)] hover:shadow-accent transition-all duration-300 hover:-translate-y-1">
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <div className="absolute inset-0 bg-[var(--acc)]/20 rounded-xl blur-xl"></div>
                          <div className={`relative p-3 rounded-xl bg-[var(--charcoal-light)] shadow-premium flex-shrink-0 icon-aivra`}>
                            <Icon size={28} className="text-white" />
                          </div>
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="text-lg font-normal text-[var(--txt)] mb-1 flex items-center gap-2"><span>{goal.emoji}</span>{goal.title}</h3>
                          <p className="text-[var(--txt-muted)] text-sm">{goal.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 1: USER INFO */}
          {!showLanding && step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-normal text-[var(--txt)] mb-6">Tell Us About You</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-normal text-[var(--txt)] mb-2">Age</label>
                  <input type="number" value={formData.age} onChange={(e) => handleInputChange('age', e.target.value)} className="w-full px-4 py-3 rounded-lg bg-[var(--bg-elev-1)] border-2 border-[var(--border)] text-[var(--txt)] placeholder-[var(--txt-muted)] focus:border-[var(--acc)] focus:outline-none transition-all duration-300" placeholder="30" />
                </div>
                <div>
                  <label className="block text-sm font-normal text-[var(--txt)] mb-2">Gender</label>
                  <select value={formData.gender} onChange={(e) => handleInputChange('gender', e.target.value)} className="w-full px-4 py-3 rounded-lg bg-[var(--bg-elev-1)] border-2 border-[var(--border)] text-[var(--txt)] focus:border-[var(--acc)] focus:outline-none transition-all duration-300">
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-normal text-[var(--txt)] mb-2">Activity Level</label>
                  <select value={formData.activityLevel} onChange={(e) => handleInputChange('activityLevel', e.target.value)} className="w-full px-4 py-3 rounded-lg bg-[var(--bg-elev-1)] border-2 border-[var(--border)] text-[var(--txt)] focus:border-[var(--acc)] focus:outline-none transition-all duration-300">
                    <option value="">Select</option>
                    <option value="sedentary">Sedentary</option>
                    <option value="light">Lightly Active</option>
                    <option value="moderate">Moderately Active</option>
                    <option value="very">Very Active</option>
                    <option value="athlete">Athlete</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-normal text-[var(--txt)] mb-2">Workout Frequency</label>
                  <select value={formData.workoutFrequency} onChange={(e) => handleInputChange('workoutFrequency', e.target.value)} className="w-full px-4 py-3 rounded-lg bg-[var(--bg-elev-1)] border-2 border-[var(--border)] text-[var(--txt)] focus:border-[var(--acc)] focus:outline-none transition-all duration-300">
                    <option value="">Select</option>
                    <option value="0">0 days/week</option>
                    <option value="1-2">1-2 days/week</option>
                    <option value="3-4">3-4 days/week</option>
                    <option value="5-6">5-6 days/week</option>
                    <option value="7+">7+ days/week</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-normal text-[var(--txt)] mb-2">Sleep (hours)</label>
                  <input type="number" value={formData.sleepHours} onChange={(e) => handleInputChange('sleepHours', e.target.value)} className="w-full px-4 py-3 rounded-lg bg-[var(--bg-elev-1)] border-2 border-[var(--border)] text-[var(--txt)] placeholder-[var(--txt-muted)] focus:border-[var(--acc)] focus:outline-none transition-all duration-300" placeholder="7" />
                </div>
                <div>
                  <label className="block text-sm font-normal text-[var(--txt)] mb-2">Stress Level</label>
                  <select value={formData.stressLevel} onChange={(e) => handleInputChange('stressLevel', e.target.value)} className="w-full px-4 py-3 rounded-lg bg-[var(--bg-elev-1)] border-2 border-[var(--border)] text-[var(--txt)] focus:border-[var(--acc)] focus:outline-none transition-all duration-300">
                    <option value="">Select</option>
                    <option value="low">Low</option>
                    <option value="moderate">Moderate</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--txt)] mb-2">Biggest Challenge</label>
                <select value={formData.biggestChallenge} onChange={(e) => handleInputChange('biggestChallenge', e.target.value)} className="w-full px-4 py-3 rounded-lg bg-[var(--bg-elev-1)] border-2 border-[var(--border)] text-[var(--txt)] focus:border-[var(--acc)] focus:outline-none transition-all duration-300">
                  <option value="">Select</option>
                  <option value="energy">Low energy</option>
                  <option value="motivation">Lack of motivation</option>
                  <option value="recovery">Slow recovery</option>
                  <option value="appetite">Cannot control appetite</option>
                  <option value="sleep">Poor sleep</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setStep(0)} className="flex-1 px-6 py-3 rounded-lg bg-[var(--bg-elev-1)] text-[var(--txt)] font-normal hover:bg-[var(--bg-elev-2)] transition-all duration-300">Back</button>
                <button onClick={() => setStep(2)} disabled={!formData.age || !formData.gender || !formData.activityLevel} className="flex-1 px-6 py-3 rounded-lg bg-[var(--acc)] text-white font-normal hover:bg-blue-600 hover:shadow-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300">Continue</button>
              </div>
            </div>
          )}

          {/* STEP 2: PERSONALIZATION */}
          {!showLanding && step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-normal text-[var(--txt)] mb-6">Personalize Your Stack</h2>
              <div>
                <label className="block text-sm font-medium text-[var(--txt)] mb-2">Diet Type</label>
                <select value={formData.dietType} onChange={(e) => handleInputChange('dietType', e.target.value)} className="w-full px-4 py-3 rounded-lg bg-[var(--bg-elev-1)] border-2 border-[var(--border)] text-[var(--txt)] focus:border-[var(--acc)] focus:outline-none transition-all duration-300">
                  <option value="">Select</option>
                  <option value="omnivore">Omnivore</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="keto">Keto</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--txt)] mb-3">Specific Goals (select all that apply)</label>
                <div className="grid grid-cols-2 gap-3">
                  {healthGoalsByCategory[primaryGoal]?.map(goal => (
                    <button key={goal} onClick={() => toggleArrayField('healthGoals', goal)} className={`p-3 rounded-lg border-2 text-sm transition-all duration-300 font-normal ${formData.healthGoals.includes(goal) ? 'border-[var(--acc)] bg-[var(--acc)]/10 text-[var(--txt)]' : 'border-[var(--border)] bg-[var(--bg-elev-1)] text-[var(--txt)] hover:border-[var(--acc)]/50'}`}>{goal}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-3 pt-4">
                {/* AI vs Standard toggle */}
                <div className="flex items-center gap-3 p-3 bg-[var(--bg-elev-1)] rounded-lg border border-[var(--border)]">
                  <input
                    type="checkbox"
                    id="useAI"
                    checked={useAIRecommendations}
                    onChange={(e) => setUseAIRecommendations(e.target.checked)}
                    className="w-5 h-5 rounded border-[var(--border)] text-[var(--acc)] focus:ring-[var(--acc)]"
                  />
                  <label htmlFor="useAI" className="flex-1 text-sm text-[var(--txt)] cursor-pointer">
                    <span className="font-normal">Use AI-Powered Recommendations</span>
                    <span className="block text-xs text-[var(--txt-muted)] mt-0.5">
                      Get personalized stack with Aviera AI
                    </span>
                  </label>
                </div>

                {/* Expanded AI Enhancement Section */}
                {useAIRecommendations && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden mt-4"
                  >
                    <div className="p-6 rounded-xl"
                      style={{
                        background: 'rgba(30, 30, 30, 0.5)',
                        border: '1px solid rgba(0, 217, 255, 0.3)'
                      }}
                    >
                      <h3 className="text-lg font-normal text-white mb-4">
                        Help Aviera AI Build Your Perfect Stack
                      </h3>
                      
                      <div className="space-y-4">
                        {/* Main Goal */}
                        <div>
                          <label className="block text-sm text-[var(--txt-muted)] mb-2 font-light">
                            What's your main fitness goal?
                          </label>
                          <textarea
                            value={aiEnhancementData?.mainGoal || ''}
                            onChange={(e) => setAiEnhancementData({ ...aiEnhancementData, mainGoal: e.target.value })}
                            placeholder="E.g., Build muscle, lose fat, improve endurance..."
                            rows={2}
                            className="w-full px-4 py-3 rounded-lg text-white font-light transition-all duration-300 resize-none"
                            style={{
                              background: 'rgba(30, 30, 30, 0.9)',
                              border: '1px solid rgba(0, 217, 255, 0.3)',
                              fontSize: '14px',
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

                        {/* Biggest Obstacle */}
                        <div>
                          <label className="block text-sm text-[var(--txt-muted)] mb-2 font-light">
                            What's your biggest obstacle?
                          </label>
                          <textarea
                            value={aiEnhancementData?.biggestObstacle || ''}
                            onChange={(e) => setAiEnhancementData({ ...aiEnhancementData, biggestObstacle: e.target.value })}
                            placeholder="E.g., Time constraints, motivation, plateaus..."
                            rows={2}
                            className="w-full px-4 py-3 rounded-lg text-white font-light transition-all duration-300 resize-none"
                            style={{
                              background: 'rgba(30, 30, 30, 0.9)',
                              border: '1px solid rgba(0, 217, 255, 0.3)',
                              fontSize: '14px',
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

                        {/* Desired Results */}
                        <div>
                          <label className="block text-sm text-[var(--txt-muted)] mb-2 font-light">
                            What results are you hoping for?
                          </label>
                          <textarea
                            value={aiEnhancementData?.desiredResults || ''}
                            onChange={(e) => setAiEnhancementData({ ...aiEnhancementData, desiredResults: e.target.value })}
                            placeholder="E.g., Gain 10 lbs muscle, run a 5k, feel more energetic..."
                            rows={2}
                            className="w-full px-4 py-3 rounded-lg text-white font-light transition-all duration-300 resize-none"
                            style={{
                              background: 'rgba(30, 30, 30, 0.9)',
                              border: '1px solid rgba(0, 217, 255, 0.3)',
                              fontSize: '14px',
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

                        {/* Additional Info */}
                        <div>
                          <label className="block text-sm text-[var(--txt-muted)] mb-2 font-light">
                            Anything else we should know?
                          </label>
                          <textarea
                            value={aiEnhancementData?.additionalInfo || ''}
                            onChange={(e) => setAiEnhancementData({ ...aiEnhancementData, additionalInfo: e.target.value })}
                            placeholder="E.g., Dietary restrictions, experience level, schedule..."
                            rows={2}
                            className="w-full px-4 py-3 rounded-lg text-white font-light transition-all duration-300 resize-none"
                            style={{
                              background: 'rgba(30, 30, 30, 0.9)',
                              border: '1px solid rgba(0, 217, 255, 0.3)',
                              fontSize: '14px',
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
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="flex-1 px-6 py-3 rounded-lg bg-[var(--bg-elev-1)] text-[var(--txt)] font-normal hover:bg-[var(--bg-elev-2)] transition-all duration-300">Back</button>
                  <button 
                    onClick={useAIRecommendations ? generateAIRecommendations : generateRecommendations} 
                    disabled={!formData.healthGoals.length || !formData.dietType || isGeneratingAI} 
                    className="flex-1 px-6 py-3 rounded-lg bg-[var(--acc)] text-white font-normal hover:bg-blue-600 hover:shadow-accent disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-300"
                  >
                    {isGeneratingAI ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Generating AI Stack...
                      </>
                    ) : (
                      <>
                        {useAIRecommendations ? 'Generate AI Stack' : 'Generate Stack'} 
                        <Sparkles size={20} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: RECOMMENDATIONS */}
          {!showLanding && step === 4 && recommendations && (() => {
            const goalTitle = goalCategories.find(g => g.id === primaryGoal)?.title || 'Your Goal';
            
            return (
            <div className="space-y-6">
              <div className="bg-amber-50 p-6 rounded-2xl border-2 border-amber-200">
                <h3 className="text-xl font-normal text-[#1a1a1a] mb-2 flex items-center gap-2">
                  <Info size={24} className="text-amber-600" />
                  Disclaimer
                </h3>
                <p className="text-[#1a1a1a] text-sm">Educational purposes only. Consult healthcare provider before starting supplements.</p>
              </div>

                {/* Personalized Stack Bundle Section */}
                {(() => {
                  const totalPrice = recommendations.stack.reduce((sum, supp) => {
                    const supplement = SUPPLEMENT_DATABASE[supp.name];
                    return sum + (supplement?.price || 0);
                  }, 0);
                  const discountedPrice = (totalPrice * 0.9).toFixed(2);
                  const savings = (totalPrice * 0.1).toFixed(2);

                  return (
                    <div 
                      className="rounded-2xl p-8 mb-8 transition-all duration-300"
                      style={{
                        background: 'rgba(30, 30, 30, 0.85)',
                        border: '2px solid rgba(0, 229, 255, 0.4)',
                        boxShadow: '0 0 25px rgba(0, 229, 255, 0.3), 0 4px 12px rgba(0, 0, 0, 0.3)'
                      }}
                    >
                      {/* Header */}
                      <div className="text-center mb-6">
                        <h3 className="text-3xl md:text-4xl font-normal text-[var(--txt)] mb-2">
                          Your Personalized 3-Supplement Stack
                        </h3>
                        <p className="text-lg text-[var(--txt-muted)]">
                          Optimized for: <span className="text-[var(--acc)] font-normal">{goalTitle}</span>
                        </p>
                        {recommendations.isAI && (
                          <span className="inline-block px-3 py-1 bg-[var(--acc)]/20 text-[var(--acc)] text-xs font-normal rounded-full border border-[var(--acc)]/30 mt-3">
                            AI-Powered
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <div className="mb-6 p-6 bg-[var(--bg-elev-1)] rounded-xl border border-[var(--border)]">
                        <p className="text-base text-[var(--txt)] leading-relaxed font-light">
                          This carefully selected combination of 3 supplements is specifically designed to fast-track your {goalTitle.toLowerCase()} goals. Each supplement works synergistically to maximize results and support your body's natural processes, creating a powerful foundation for achieving your desired outcomes.
                        </p>
                      </div>

                      {/* Pricing Display */}
                      <div className="mb-6 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-sm text-[var(--txt-muted)] mb-2 font-light">Bundle Price</p>
                          <div className="flex items-baseline justify-center gap-4 mb-2">
                            <span className="text-5xl font-normal text-[var(--acc)]">${discountedPrice}</span>
                            <span className="text-xl text-[var(--txt-muted)]/60 line-through font-light">${totalPrice.toFixed(2)}</span>
                          </div>
                          <p className="text-sm text-[var(--acc)] font-light">
                            Save ${savings} with 10% bundle discount
                          </p>
                        </div>
                      </div>

                      {/* Add Complete Stack Button */}
                      <button 
                        onClick={addAllToCart} 
                        className="w-full px-8 py-4 rounded-xl bg-[var(--acc)] text-white font-normal hover:bg-blue-600 hover:shadow-lg hover:shadow-[var(--acc)]/40 transition-all duration-300 flex items-center justify-center gap-3 text-lg hover:-translate-y-0.5"
                      >
                        <ShoppingCart size={24} />
                        Add Complete Stack to Cart
                      </button>
                    </div>
                  );
                })()}

                {/* Individual Supplements Section */}
                <div className="mb-6">
                  <h4 className="text-xl font-normal text-[var(--txt)] mb-4">Individual Supplements</h4>
                </div>

                <div className="space-y-4">
                  {recommendations.stack.map((supp, idx) => {
                    const isExpanded = expandedSupplement === idx;
                    const supplement = SUPPLEMENT_DATABASE[supp.name];
                    const inCart = cart.some(item => item.name === supp.name);

                    return (
                      <div 
                        key={idx} 
                        className="rounded-2xl overflow-hidden transition-all duration-300"
                        style={{
                          background: 'rgba(30, 30, 30, 0.9)',
                          border: '1px solid rgba(0, 217, 255, 0.3)',
                          borderRadius: '16px',
                          boxShadow: '0 0 20px rgba(0, 217, 255, 0.15), 0 4px 12px rgba(0, 0, 0, 0.2)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 217, 255, 0.5), 0 8px 20px rgba(0, 0, 0, 0.3)';
                          e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.7)';
                          e.currentTarget.style.transform = 'translateY(-5px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.15), 0 4px 12px rgba(0, 0, 0, 0.2)';
                          e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <div className="flex gap-4 p-5">
                          <img src={getSupplementImage(supp.name)} alt={supp.name} className="w-24 h-24 object-cover rounded-xl flex-shrink-0 shadow-md" />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="text-lg font-normal text-white">{supp.name}</h4>
                                <p className="text-[var(--acc)] font-bold text-lg">${supplement?.price.toFixed(2)}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-normal ${supp.priority === 'Essential' ? 'bg-[var(--acc)]/10 text-[var(--acc)] border border-[var(--acc)]/30' : supp.priority === 'High' ? 'bg-[var(--acc)]/10 text-[var(--acc)] border border-[var(--acc)]/30' : 'bg-[var(--bg-elev-2)] text-white border border-[var(--border)]'}`}>
                                {supp.priority}
                              </span>
                            </div>
                                <p className="text-sm text-white mb-2 font-light"><strong className="text-white">Dosage:</strong> {supp.dosage}</p>
                            <p className="text-sm text-white mb-2 font-light"><strong className="text-white">Timing:</strong> {supp.timing}</p>
                            <p className="text-sm text-[var(--txt-muted)] mb-3 font-light">{supp.reason}</p>

                            <button onClick={() => setExpandedSupplement(isExpanded ? null : idx)} className="text-sm text-[var(--acc)] hover:text-[var(--acc-hover)] font-normal flex items-center gap-1 mb-3 transition-colors duration-300">
                              <Info size={14} />
                              {isExpanded ? 'Hide details' : 'Learn more'}
                            </button>

                            {isExpanded && (
                              <div className="bg-[var(--acc)]/5 p-4 rounded-lg mb-3 border border-[var(--acc)]/20">
                                <p className="text-sm text-white font-light">{supplement?.info}</p>
                              </div>
                            )}

                            <div className="flex gap-3">
                              <button
                                onClick={() => addToCart(supp.name)}
                                className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                                  inCart
                                    ? 'bg-green-500 text-white border-2 border-green-400'
                                    : 'bg-[var(--acc)] text-white hover:bg-[var(--acc-hover)] hover:shadow-lg hover:shadow-[var(--acc)]/40'
                                }`}
                                style={!inCart ? {
                                  boxShadow: '0 0 20px rgba(0, 217, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)'
                                } : {}}
                                onMouseEnter={(e) => {
                                  if (!inCart) {
                                    e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 217, 255, 0.6), 0 4px 12px rgba(0, 0, 0, 0.3)';
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!inCart) {
                                    e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                  }
                                }}
                              >
                                {inCart ? (
                                  <><Check size={18} /> In Cart</>
                                ) : (
                                  <><ShoppingCart size={18} /> Add to Cart</>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

              {/* Aviera AI Insights Section */}
              {(() => {
                const goalTitle = goalCategories.find(g => g.id === primaryGoal)?.title || 'Your Goal';
                
                return recommendations.isAI && recommendations.summary ? (
                  <div 
                    className="p-6 mb-6 rounded-xl transition-all duration-300"
                    style={{
                      background: 'rgba(30, 30, 30, 0.95)',
                      border: '2px solid rgba(0, 217, 255, 0.5)',
                      borderRadius: '12px',
                      padding: '24px',
                    }}
                  >
                    <h4 className="text-xl font-normal text-white mb-4 flex items-center gap-2">
                      <Sparkles size={20} className="text-[#00d9ff]" />
                      🎯 Aviera AI Insights for Your Goal
                    </h4>
                    
                    {/* Goal Summary */}
                    <div className="mb-6">
                      <p className="text-base text-white font-light leading-relaxed">
                        Based on your goal to <span className="text-[#00d9ff] font-normal">{goalTitle.toLowerCase()}</span>, here's how your personalized stack works:
                      </p>
                    </div>

                    {/* Why Each Supplement */}
                    <div className="space-y-6 mb-6">
                      {recommendations.stack.slice(0, 3).map((supp, idx) => (
                        <div key={idx} className="border-l-2 border-[#00d9ff]/50 pl-4">
                          <h5 className="text-lg font-normal text-[#00d9ff] mb-2">{supp.name}</h5>
                          <div className="space-y-2">
                            <div className="flex items-start gap-2">
                              <CheckCircle size={16} className="text-[#00d9ff] mt-1 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-normal text-white mb-1">How it helps:</p>
                                <p className="text-sm text-gray-300 font-light">{supp.reason}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <Clock size={16} className="text-[#00d9ff] mt-1 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-normal text-white mb-1">When to take:</p>
                                <p className="text-sm text-gray-300 font-light">{supp.timing}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Synergy Explanation */}
                    {recommendations.summary && (
                      <div className="mb-6 p-4 rounded-lg" style={{ background: 'rgba(0, 217, 255, 0.05)', border: '1px solid rgba(0, 217, 255, 0.2)' }}>
                        <h5 className="text-base font-normal text-[#00d9ff] mb-2 flex items-center gap-2">
                          <Sparkles size={16} />
                          How They Work Together
                        </h5>
                        <p className="text-sm text-white font-light leading-relaxed">{recommendations.summary}</p>
                      </div>
                    )}

                    {/* Additional Tips */}
                    {recommendations.insights && recommendations.insights.length > 0 && (
                      <div>
                        <h5 className="text-base font-normal text-[#00d9ff] mb-3 flex items-center gap-2">
                          <TrendingUp size={16} />
                          Additional Tips for Success
                        </h5>
                        <ul className="space-y-2">
                          {recommendations.insights.map((insight, idx) => (
                            <li key={idx} className="text-sm text-gray-300 font-light flex items-start gap-2">
                              <CheckCircle size={14} className="text-[#00d9ff] mt-0.5 flex-shrink-0" />
                              <span>{insight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Standard Key Insights Box */
                  <div 
                    className="p-6 mb-6 rounded-xl transition-all duration-300"
                    style={{
                      background: 'rgba(30, 30, 30, 0.95)',
                      border: '2px solid rgba(0, 217, 255, 0.5)',
                      borderRadius: '12px',
                      padding: '24px',
                    }}
                  >
                    <h4 className="text-xl font-normal text-white mb-4 flex items-center gap-2">
                      <Sparkles size={20} className="text-[#00d9ff]" />
                      Aviera AI Insights for Your Goal
                    </h4>
                    <ul className="space-y-2">
                      {recommendations.insights && recommendations.insights.map((insight, idx) => (
                        <li key={idx} className="text-sm text-gray-300 font-light flex items-start gap-2">
                          <CheckCircle size={14} className="text-[#00d9ff] mt-0.5 flex-shrink-0" />
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })()}

              <button 
                onClick={() => { setStep(0); setPrimaryGoal(''); setRecommendations(null); setShowLanding(false); }} 
                className="w-full py-4 rounded-lg font-medium text-white transition-all duration-300"
                style={{
                  background: 'rgba(30, 30, 30, 0.9)',
                  border: '2px solid rgba(0, 217, 255, 0.4)',
                  height: '56px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 217, 255, 0.5)';
                  e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.7)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.4)';
                }}
              >
                Start New Assessment
              </button>

              {/* Upgrade to Aviera Pro Card */}
              <div 
                className="mt-6 p-6 rounded-2xl transition-all duration-300"
                style={{
                  background: 'rgba(30, 30, 30, 0.9)',
                  border: '2px solid rgba(0, 217, 255, 0.4)',
                  borderRadius: '16px',
                  padding: '24px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 217, 255, 0.5)';
                  e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.7)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.4)';
                }}
              >
                <h3 className="text-xl font-normal text-[#00d9ff] mb-3">
                  Upgrade to Aviera Pro
                </h3>
                <p className="text-sm text-white mb-4 font-light">
                  Get AI-powered stack builder with tracking
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {['AI-Powered', 'Goal-Specific', 'Beginner-Friendly'].map((badge, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 text-xs text-white font-light rounded-lg transition-all duration-300"
                      style={{
                        background: 'rgba(30, 30, 30, 0.9)',
                        border: '1px solid rgba(0, 217, 255, 0.4)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 217, 255, 0.5)';
                        e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.7)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.4)';
                      }}
                    >
                      {badge}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      const event = new CustomEvent('openWaitlistModal');
                      window.dispatchEvent(event);
                    }
                  }}
                  className="w-full px-6 py-3 bg-gradient-to-r from-[var(--acc)] to-[#00b8d4] text-[#001018] rounded-lg font-semibold hover:from-[#00f0ff] hover:to-[var(--acc)] transition-all duration-300"
                  style={{
                    boxShadow: '0 0 20px rgba(0, 217, 255, 0.4)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 217, 255, 0.6)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.4)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Get Aviera Pro
                </button>
              </div>

              <div className="text-center pt-6 border-t border-[var(--border)]">
                <p className="text-[var(--txt-muted)] text-xs mb-2">
                  Powered by Supliful • 42 Premium Supplements
                </p>
                <p className="text-[var(--txt-muted)] text-xs">
                  © 2025 Aviera • For educational purposes only
                </p>
              </div>
            </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

