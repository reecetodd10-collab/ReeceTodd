'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Heart, Target, Pill, Info, Dumbbell, Sparkles, ShoppingCart, ExternalLink, Flame, Brain, Moon, Zap, X, Plus, Minus, Check, Clock, TrendingUp, CheckCircle, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { products, PRODUCT_CATEGORIES } from '../data/products';
import { fetchShopifyProducts } from '../lib/shopify';
import Image from 'next/image';

// Fuzzy matching function to map AI names to actual product names
const fuzzyMatchProduct = (aiName) => {
  if (!aiName) return null;
  
  const normalizedName = aiName.toLowerCase().trim();
  
  // Direct match mappings for common AI responses
  const directMappings = {
    // Protein
    'protein powder': 'Whey Protein Isolate (Chocolate)',
    'whey protein': 'Whey Protein Isolate (Chocolate)',
    'protein': 'Whey Protein Isolate (Chocolate)',
    'whey protein isolate': 'Whey Protein Isolate (Chocolate)',
    'plant protein': 'Plant Protein (Chocolate)',
    'vegan protein': 'Plant Protein (Chocolate)',
    'plant-based protein': 'Plant Protein (Chocolate)',
    
    // Performance
    'creatine': 'Creatine Monohydrate',
    'creatine monohydrate': 'Creatine Monohydrate',
    'pre-workout': 'Pre-Workout Formula',
    'pre workout': 'Pre-Workout Formula',
    'preworkout': 'Pre-Workout Formula',
    'nitric oxide': 'Pre-Workout Formula',
    'bcaa': 'BCAAs',
    'bcaas': 'BCAAs',
    'branch chain amino acids': 'BCAAs',
    'amino acids': 'BCAAs',
    'glutamine': 'L-Glutamine',
    'l-glutamine': 'L-Glutamine',
    'alpha energy': 'Alpha Energy',
    
    // Health & Wellness
    'omega-3': 'Omega-3 Fish Oil',
    'omega 3': 'Omega-3 Fish Oil',
    'fish oil': 'Omega-3 Fish Oil',
    'omega-3 fish oil': 'Omega-3 Fish Oil',
    'multivitamin': 'Complete MultiVitamin',
    'multi-vitamin': 'Complete MultiVitamin',
    'vitamin d': 'Complete MultiVitamin',
    'vitamins': 'Complete MultiVitamin',
    'coq10': 'CoQ10',
    'co-q10': 'CoQ10',
    'ubiquinone': 'CoQ10',
    'turmeric': 'Platinum Turmeric',
    'curcumin': 'Platinum Turmeric',
    'probiotics': 'Probiotics 40 Billion',
    'probiotic': 'Probiotics 40 Billion',
    'gut bacteria': 'Probiotics 40 Billion',
    'fiber': 'Fiber Supplement (Gut Health)',
    'gut health': 'Fiber Supplement (Gut Health)',
    'digestive health': 'Fiber Supplement (Gut Health)',
    'apple cider vinegar': 'Apple Cider Vinegar',
    'acv': 'Apple Cider Vinegar',
    
    // Hydration
    'electrolytes': 'Electrolyte Formula (Lemonade)',
    'electrolyte': 'Electrolyte Formula (Lemonade)',
    'hydration': 'Electrolyte Formula (Lemonade)',
    'beetroot': 'Beetroot',
    'beet root': 'Beetroot',
    'beetroot powder': 'Beetroot Powder',
    'green tea': 'Green Tea Extract',
    'green tea extract': 'Green Tea Extract',
    'matcha': 'Green Tea Extract',
    
    // Weight Loss
    'fat burner': 'Fat Burner with MCT',
    'thermogenic': 'Fat Burner with MCT',
    'mct': 'Fat Burner with MCT',
    'keto': 'Keto BHB',
    'keto bhb': 'Keto BHB',
    'ketones': 'Keto BHB',
    'keto-5': 'Keto-5',
    'keto 5': 'Keto-5',
    
    // Sleep & Recovery
    'magnesium': 'Magnesium Glycinate',
    'magnesium glycinate': 'Magnesium Glycinate',
    'melatonin': 'Sleep Support (Melatonin)',
    'sleep support': 'Sleep Support (Melatonin)',
    'sleep aid': 'Sleep Support (Melatonin)',
    'ashwagandha': 'Ashwagandha',
    'adaptogen': 'Ashwagandha',
    'stress relief': 'Ashwagandha',
    
    // Focus & Cognition
    'lion\'s mane': "Lion's Mane Mushroom",
    'lions mane': "Lion's Mane Mushroom",
    'lion mane': "Lion's Mane Mushroom",
    'nootropic': "Lion's Mane Mushroom",
    'flow state': 'Flow State Nootropic (Sour Candy)',
    'energy powder': 'Energy Powder (Fruit Punch)',
    'energy drink': 'Energy Powder (Fruit Punch)',
    'methylene blue': 'Methylene Blue Drops',
    
    // Beauty
    'collagen': 'Collagen Peptides',
    'collagen peptides': 'Collagen Peptides',
    'collagen powder': 'Collagen Peptides',
    'hyaluronic acid': 'Hyaluronic Acid Serum',
    'vitamin serum': 'Vitamin Glow Serum',
  };
  
  // Check direct mappings first
  if (directMappings[normalizedName]) {
    return directMappings[normalizedName];
  }
  
  // Try partial matching
  for (const [key, value] of Object.entries(directMappings)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return value;
    }
  }
  
  // Try to find in products array
  const exactMatch = products.find(p => p.name.toLowerCase() === normalizedName);
  if (exactMatch) return exactMatch.name;
  
  // Partial match in product names
  const partialMatch = products.find(p => 
    p.name.toLowerCase().includes(normalizedName) || 
    normalizedName.includes(p.name.toLowerCase().split(' ')[0])
  );
  if (partialMatch) return partialMatch.name;
  
  // Return original name if no match found
  return aiName;
};

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
          suplifulName: product.suplifulName || product.name,
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
  
  // SHOPIFY PRODUCTS STATE (for real images)
  const [shopifyProducts, setShopifyProducts] = useState([]);
  const [currentImageIndices, setCurrentImageIndices] = useState({});
  
  // Fetch Shopify products for real images
  useEffect(() => {
    fetchShopifyProducts()
      .then((products) => {
        setShopifyProducts(products);
        console.log('[SupplementQuiz] Loaded', products.length, 'Shopify products with images');
      })
      .catch((error) => {
        console.error('[SupplementQuiz] Error fetching Shopify products:', error);
      });
  }, []);
  
  // Get Shopify product by matching name
  const getShopifyProduct = (supplementName) => {
    if (!shopifyProducts.length) return null;
    
    const dbProduct = SUPPLEMENT_DATABASE[supplementName];
    const suplifulName = dbProduct?.suplifulName || supplementName;
    
    // Try to match by title
    return shopifyProducts.find(p => 
      p.title.toLowerCase().includes(supplementName.toLowerCase()) ||
      supplementName.toLowerCase().includes(p.title.toLowerCase().split(' ')[0]) ||
      p.title.toLowerCase().includes(suplifulName.toLowerCase()) ||
      suplifulName.toLowerCase().includes(p.title.toLowerCase().split(' ')[0])
    );
  };
  
  // Get product images
  const getProductImages = (supplementName) => {
    const shopifyProduct = getShopifyProduct(supplementName);
    if (shopifyProduct?.images?.length > 0) {
      return shopifyProduct.images;
    }
    if (shopifyProduct?.image) {
      return [shopifyProduct.image];
    }
    return [];
  };

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


  const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const toggleArrayField = (field, value) => setFormData(prev => ({
    ...prev,
    [field]: prev[field].includes(value) ? prev[field].filter(item => item !== value) : [...prev[field], value]
  }));

  // AI-powered recommendation generation
  const generateAIRecommendations = async () => {
    setIsGeneratingAI(true);
    console.log('[SupplementQuiz] Starting AI recommendation generation...');
    
    try {
      console.log('[SupplementQuiz] Sending request to /api/ai/supplement-recommendation');
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

      console.log('[SupplementQuiz] Response status:', response.status);
      
      const data = await response.json();
      console.log('[SupplementQuiz] Response data:', data);

      if (!response.ok) {
        // Show the actual error from the API
        const errorMsg = data.details || data.error || 'Failed to generate AI recommendations';
        console.error('[SupplementQuiz] API Error:', errorMsg);
        throw new Error(errorMsg);
      }
      
      if (data.success && data.recommendations) {
        console.log('[SupplementQuiz] AI recommendations received successfully');
        // Map AI recommendations to our format with fuzzy matching
        const aiStack = data.recommendations.supplements || [];
        const mappedStack = aiStack.map(supp => {
          // Use fuzzy matching to find the actual product name
          const matchedName = fuzzyMatchProduct(supp.name);
          const dbSupp = SUPPLEMENT_DATABASE[matchedName];
          
          console.log('[SupplementQuiz] Mapping AI name:', supp.name, '→', matchedName, dbSupp ? '✓' : '✗');
          
          return {
            name: matchedName, // Use the matched product name
            originalAIName: supp.name, // Keep original for reference
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
      console.error('[SupplementQuiz] Error generating AI recommendations:', error);
      
      // Show a more helpful error message
      const errorMessage = error.message || 'Unknown error';
      if (errorMessage.includes('OPENAI_API_KEY') || errorMessage.includes('API key')) {
        alert('OpenAI API key not configured. Please check server configuration. Using standard recommendations instead.');
      } else if (errorMessage.includes('OpenAI')) {
        alert(`OpenAI API error: ${errorMessage}. Using standard recommendations instead.`);
      } else {
        alert(`AI generation failed: ${errorMessage}. Using standard recommendations instead.`);
      }
      
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
    <div className="min-h-screen p-4 md:p-8 py-12">
      <div 
        className="max-w-6xl mx-auto rounded-3xl p-6 md:p-8 transition-all duration-300"
        style={{
          background: 'rgba(10, 10, 10, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 217, 255, 0.2)',
          boxShadow: '0 0 40px rgba(0, 0, 0, 0.5), 0 0 60px rgba(0, 217, 255, 0.08)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 0 40px rgba(0, 0, 0, 0.5), 0 0 80px rgba(0, 217, 255, 0.15)';
          e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 0 40px rgba(0, 0, 0, 0.5), 0 0 60px rgba(0, 217, 255, 0.08)';
          e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.2)';
        }}
      >
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
              className="fixed top-6 right-6 z-50 text-white p-4 rounded-full transition-all duration-300 flex items-center gap-2"
              style={{
                background: '#00d9ff',
                boxShadow: '0 0 20px rgba(0, 217, 255, 0.5)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 217, 255, 0.7)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.5)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
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
              <div className="p-6 border-b border-[var(--border)] flex items-center justify-between" style={{ background: '#00d9ff' }}>
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
                  <button 
                    className="w-full py-4 px-6 rounded-lg text-white text-lg font-normal transition-all duration-300 flex items-center justify-center gap-2"
                    style={{
                      background: '#00d9ff',
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
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(20, 20, 20, 0.8)' }}>
                <div
                  className="h-full transition-all duration-300 ease-out rounded-full"
                  style={{
                    width: `${((step + 1) / 4) * 100}%`,
                    background: '#00d9ff',
                    boxShadow: '0 0 15px rgba(0, 217, 255, 0.6)'
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
                <button 
                  onClick={() => setShowLanding(false)} 
                  className="w-full py-4 px-8 rounded-lg text-white text-xl font-normal transition-all duration-300"
                  style={{
                    background: '#00d9ff',
                    boxShadow: '0 0 25px rgba(0, 217, 255, 0.5)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 40px rgba(0, 217, 255, 0.7)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 217, 255, 0.5)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Get Your Stack →
                </button>
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
                    <button 
                      key={goal.id} 
                      onClick={() => { setPrimaryGoal(goal.id); setStep(1); }} 
                      className="group p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                      style={{
                        background: 'rgba(20, 20, 20, 0.8)',
                        border: '1px solid rgba(0, 217, 255, 0.2)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#00d9ff';
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.2)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
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
                  <input 
                    type="number" 
                    value={formData.age} 
                    onChange={(e) => handleInputChange('age', e.target.value)} 
                    className="w-full px-4 py-3 rounded-lg text-[var(--txt)] placeholder-[var(--txt-muted)] focus:outline-none transition-all duration-300" 
                    placeholder="30"
                    style={{
                      background: 'rgba(20, 20, 20, 0.8)',
                      border: '1px solid rgba(0, 217, 255, 0.2)',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#00d9ff';
                      e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 217, 255, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.2)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-normal text-[var(--txt)] mb-2">Gender</label>
                  <select 
                    value={formData.gender} 
                    onChange={(e) => handleInputChange('gender', e.target.value)} 
                    className="w-full px-4 py-3 rounded-lg text-[var(--txt)] focus:outline-none transition-all duration-300"
                    style={{
                      background: 'rgba(20, 20, 20, 0.8)',
                      border: '1px solid rgba(0, 217, 255, 0.2)',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#00d9ff';
                      e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 217, 255, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.2)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-normal text-[var(--txt)] mb-2">Activity Level</label>
                  <select 
                    value={formData.activityLevel} 
                    onChange={(e) => handleInputChange('activityLevel', e.target.value)} 
                    className="w-full px-4 py-3 rounded-lg text-[var(--txt)] focus:outline-none transition-all duration-300"
                    style={{
                      background: 'rgba(20, 20, 20, 0.8)',
                      border: '1px solid rgba(0, 217, 255, 0.2)',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#00d9ff';
                      e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 217, 255, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.2)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
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
                  <select 
                    value={formData.workoutFrequency} 
                    onChange={(e) => handleInputChange('workoutFrequency', e.target.value)} 
                    className="w-full px-4 py-3 rounded-lg text-[var(--txt)] focus:outline-none transition-all duration-300"
                    style={{
                      background: 'rgba(20, 20, 20, 0.8)',
                      border: '1px solid rgba(0, 217, 255, 0.2)',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#00d9ff';
                      e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 217, 255, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.2)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
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
                  <input 
                    type="number" 
                    value={formData.sleepHours} 
                    onChange={(e) => handleInputChange('sleepHours', e.target.value)} 
                    className="w-full px-4 py-3 rounded-lg text-[var(--txt)] placeholder-[var(--txt-muted)] focus:outline-none transition-all duration-300" 
                    placeholder="7"
                    style={{
                      background: 'rgba(20, 20, 20, 0.8)',
                      border: '1px solid rgba(0, 217, 255, 0.2)',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#00d9ff';
                      e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 217, 255, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.2)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-normal text-[var(--txt)] mb-2">Stress Level</label>
                  <select 
                    value={formData.stressLevel} 
                    onChange={(e) => handleInputChange('stressLevel', e.target.value)} 
                    className="w-full px-4 py-3 rounded-lg text-[var(--txt)] focus:outline-none transition-all duration-300"
                    style={{
                      background: 'rgba(20, 20, 20, 0.8)',
                      border: '1px solid rgba(0, 217, 255, 0.2)',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#00d9ff';
                      e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 217, 255, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.2)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <option value="">Select</option>
                    <option value="low">Low</option>
                    <option value="moderate">Moderate</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--txt)] mb-2">Biggest Challenge</label>
                <select 
                  value={formData.biggestChallenge} 
                  onChange={(e) => handleInputChange('biggestChallenge', e.target.value)} 
                  className="w-full px-4 py-3 rounded-lg text-[var(--txt)] focus:outline-none transition-all duration-300"
                  style={{
                    background: 'rgba(20, 20, 20, 0.8)',
                    border: '1px solid rgba(0, 217, 255, 0.2)',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#00d9ff';
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 217, 255, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.2)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <option value="">Select</option>
                  <option value="energy">Low energy</option>
                  <option value="motivation">Lack of motivation</option>
                  <option value="recovery">Slow recovery</option>
                  <option value="appetite">Cannot control appetite</option>
                  <option value="sleep">Poor sleep</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setStep(0)} 
                  className="flex-1 px-6 py-3 rounded-lg text-[var(--txt)] font-normal transition-all duration-300"
                  style={{
                    background: 'rgba(20, 20, 20, 0.8)',
                    border: '1px solid rgba(0, 217, 255, 0.2)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.5)';
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 217, 255, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.2)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Back
                </button>
                <button 
                  onClick={() => setStep(2)} 
                  disabled={!formData.age || !formData.gender || !formData.activityLevel} 
                  className="flex-1 px-6 py-3 rounded-lg text-white font-normal disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  style={{
                    background: '#00d9ff',
                    boxShadow: '0 0 20px rgba(0, 217, 255, 0.4)',
                  }}
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.disabled) {
                      e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 217, 255, 0.6)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.4)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PERSONALIZATION */}
          {!showLanding && step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-normal text-[var(--txt)] mb-6">Personalize Your Stack</h2>
              <div>
                <label className="block text-sm font-medium text-[var(--txt)] mb-2">Diet Type</label>
                <select 
                  value={formData.dietType} 
                  onChange={(e) => handleInputChange('dietType', e.target.value)} 
                  className="w-full px-4 py-3 rounded-lg text-[var(--txt)] focus:outline-none transition-all duration-300"
                  style={{
                    background: 'rgba(20, 20, 20, 0.8)',
                    border: '1px solid rgba(0, 217, 255, 0.2)',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#00d9ff';
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 217, 255, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.2)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
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
                    <button 
                      key={goal} 
                      onClick={() => toggleArrayField('healthGoals', goal)} 
                      className="p-3 rounded-lg text-sm transition-all duration-300 font-normal text-[var(--txt)]"
                      style={{
                        background: formData.healthGoals.includes(goal) ? 'rgba(0, 217, 255, 0.1)' : 'rgba(20, 20, 20, 0.8)',
                        border: formData.healthGoals.includes(goal) ? '1px solid #00d9ff' : '1px solid rgba(0, 217, 255, 0.2)',
                        boxShadow: formData.healthGoals.includes(goal) ? '0 0 15px rgba(0, 217, 255, 0.3)' : 'none',
                      }}
                      onMouseEnter={(e) => {
                        if (!formData.healthGoals.includes(goal)) {
                          e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.5)';
                          e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 217, 255, 0.2)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!formData.healthGoals.includes(goal)) {
                          e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.2)';
                          e.currentTarget.style.boxShadow = 'none';
                        }
                      }}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3 pt-4">
                {/* AI vs Standard toggle */}
                <div 
                  className="flex items-center gap-3 p-3 rounded-lg transition-all duration-300"
                  style={{
                    background: 'rgba(20, 20, 20, 0.8)',
                    border: '1px solid rgba(0, 217, 255, 0.2)',
                  }}
                >
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
                  <button 
                    onClick={() => setStep(1)} 
                    className="flex-1 px-6 py-3 rounded-lg text-[var(--txt)] font-normal transition-all duration-300"
                    style={{
                      background: 'rgba(20, 20, 20, 0.8)',
                      border: '1px solid rgba(0, 217, 255, 0.2)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.5)';
                      e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 217, 255, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.2)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Back
                  </button>
                  <button 
                    onClick={useAIRecommendations ? generateAIRecommendations : generateRecommendations} 
                    disabled={!formData.healthGoals.length || !formData.dietType || isGeneratingAI} 
                    className="flex-1 px-6 py-3 rounded-lg text-white font-normal disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-300"
                    style={{
                      background: '#00d9ff',
                      boxShadow: '0 0 20px rgba(0, 217, 255, 0.4)',
                    }}
                    onMouseEnter={(e) => {
                      if (!e.currentTarget.disabled) {
                        e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 217, 255, 0.6)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.4)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
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
            const goalEmoji = goalCategories.find(g => g.id === primaryGoal)?.emoji || '🎯';
            
            return (
            <div className="space-y-8">
                {/* Personalized Stack Bundle Section - Matching Aviera Stacks Style */}
                {(() => {
                  const totalPrice = recommendations.stack.reduce((sum, supp) => {
                    const supplement = SUPPLEMENT_DATABASE[supp.name];
                    return sum + (supplement?.price || 0);
                  }, 0);
                  const discountedPrice = (totalPrice * 0.9).toFixed(2);
                  const savings = (totalPrice * 0.1).toFixed(2);

                  return (
                    <div 
                      className="rounded-2xl overflow-hidden transition-all duration-300"
                      style={{
                        background: 'rgba(30, 30, 30, 0.9)',
                        border: '1px solid rgba(0, 217, 255, 0.3)',
                        boxShadow: '0 0 20px rgba(0, 217, 255, 0.15), 0 4px 12px rgba(0, 0, 0, 0.2)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 217, 255, 0.5), 0 8px 20px rgba(0, 0, 0, 0.3)';
                        e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.7)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.15), 0 4px 12px rgba(0, 0, 0, 0.2)';
                        e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
                      }}
                    >
                      {/* Header with Icon */}
                      <div className="p-6 pb-0">
                        <div className="flex items-start gap-4 mb-4">
                          {/* Icon Box */}
                          <div 
                            className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{
                              background: 'rgba(0, 217, 255, 0.1)',
                              border: '1px solid rgba(0, 217, 255, 0.3)',
                            }}
                          >
                            <Sparkles size={28} className="text-[#00d9ff]" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-xl font-semibold text-white">Your Personalized Stack</h3>
                              {recommendations.isAI && (
                                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-[#00d9ff]/20 text-[#00d9ff] border border-[#00d9ff]/30">
                                  AI-Powered
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-400">
                              Optimized for: <span className="text-[#00d9ff]">{goalEmoji} {goalTitle}</span>
                            </p>
                          </div>
                        </div>

                        {/* Includes Header */}
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
                          Includes ({recommendations.stack.length} Supplements)
                        </p>

                        {/* Supplement List with Checkmarks */}
                        <div className="space-y-2 mb-4">
                          {recommendations.stack.map((supp, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <Check size={16} className="text-[#00d9ff] flex-shrink-0" />
                              <span className="text-sm text-white">{supp.name}</span>
                            </div>
                          ))}
                        </div>

                        {/* AI Summary */}
                        {recommendations.summary ? (
                          <p className="text-sm text-gray-400 leading-relaxed mb-4">
                            {recommendations.summary.length > 200 
                              ? recommendations.summary.substring(0, 200) + '...' 
                              : recommendations.summary}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-400 leading-relaxed mb-4">
                            This carefully selected combination is specifically designed to support your {goalTitle.toLowerCase()} goals with synergistic supplements.
                          </p>
                        )}
                      </div>

                      {/* Pricing Section */}
                      <div className="px-6 pb-4 pt-4 border-t border-[rgba(255,255,255,0.1)]">
                        <div className="flex items-baseline gap-3 mb-1">
                          <span className="text-3xl font-bold text-[#00d9ff]">${discountedPrice}</span>
                          <span className="text-lg text-gray-500 line-through">${totalPrice.toFixed(2)}</span>
                          <span className="text-sm text-gray-400">USD</span>
                        </div>
                        <p className="text-sm text-[#00d9ff] mb-4">
                          Save ${savings} (10% bundle discount)
                        </p>

                        {/* Add Stack Button */}
                        <button 
                          onClick={addAllToCart} 
                          className="w-full py-3 rounded-xl text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                          style={{
                            background: '#00d9ff',
                            boxShadow: '0 0 20px rgba(0, 217, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 217, 255, 0.6), 0 4px 12px rgba(0, 0, 0, 0.3)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          <ShoppingCart size={18} />
                          Add Stack to Cart
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {/* Individual Supplements Section - Grid Layout Like Shop */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Individual Supplements</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendations.stack.map((supp, idx) => {
                      const isExpanded = expandedSupplement === idx;
                      const supplement = SUPPLEMENT_DATABASE[supp.name];
                      const inCart = cart.some(item => item.name === supp.name);
                      const productImages = getProductImages(supp.name);
                      const currentImageIndex = currentImageIndices[idx] || 0;
                      const hasMultipleImages = productImages.length > 1;

                      return (
                        <motion.div 
                          key={idx} 
                          className="rounded-2xl overflow-hidden transition-all duration-300 group"
                          style={{
                            background: 'rgba(30, 30, 30, 0.9)',
                            border: '1px solid rgba(0, 217, 255, 0.3)',
                            boxShadow: '0 0 20px rgba(0, 217, 255, 0.15), 0 4px 12px rgba(0, 0, 0, 0.2)'
                          }}
                          whileHover={{ y: -4 }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 217, 255, 0.5), 0 8px 20px rgba(0, 0, 0, 0.3)';
                            e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.7)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.15), 0 4px 12px rgba(0, 0, 0, 0.2)';
                            e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
                          }}
                        >
                          {/* Product Image Carousel - Matching Shop Page */}
                          <div 
                            className="relative w-full h-64 flex items-center justify-center overflow-hidden"
                            style={{
                              background: 'linear-gradient(to bottom, var(--bg-elev-1), var(--bg))'
                            }}
                          >
                            {productImages.length > 0 ? (
                              <div className="relative w-full h-full">
                                <AnimatePresence mode="wait">
                                  <motion.div
                                    key={currentImageIndex}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute inset-0 w-full h-full"
                                  >
                                    <Image
                                      src={productImages[currentImageIndex]}
                                      alt={supp.name}
                                      width={400}
                                      height={400}
                                      className="w-full h-full object-contain p-4"
                                      unoptimized
                                    />
                                  </motion.div>
                                </AnimatePresence>
                                
                                {/* Navigation Arrows */}
                                {hasMultipleImages && (
                                  <>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentImageIndices(prev => ({
                                          ...prev,
                                          [idx]: currentImageIndex === 0 ? productImages.length - 1 : currentImageIndex - 1
                                        }));
                                      }}
                                      className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
                                      style={{
                                        background: 'rgba(0, 217, 255, 0.8)',
                                      }}
                                    >
                                      <ChevronLeft size={16} className="text-[#001018]" strokeWidth={2.5} />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentImageIndices(prev => ({
                                          ...prev,
                                          [idx]: currentImageIndex === productImages.length - 1 ? 0 : currentImageIndex + 1
                                        }));
                                      }}
                                      className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
                                      style={{
                                        background: 'rgba(0, 217, 255, 0.8)',
                                      }}
                                    >
                                      <ChevronRight size={16} className="text-[#001018]" strokeWidth={2.5} />
                                    </button>
                                  </>
                                )}

                                {/* Image Indicator Dots */}
                                {hasMultipleImages && (
                                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                                    {productImages.map((_, imgIdx) => (
                                      <button
                                        key={imgIdx}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setCurrentImageIndices(prev => ({ ...prev, [idx]: imgIdx }));
                                        }}
                                        className="transition-all duration-300"
                                        style={{
                                          width: currentImageIndex === imgIdx ? '24px' : '8px',
                                          height: '8px',
                                          borderRadius: '4px',
                                          background: currentImageIndex === imgIdx 
                                            ? 'rgba(0, 217, 255, 1)' 
                                            : 'rgba(255, 255, 255, 0.4)',
                                          border: 'none',
                                          cursor: 'pointer',
                                        }}
                                      />
                                    ))}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="text-6xl opacity-20">💊</div>
                            )}
                            
                            {/* Priority Badge */}
                            <span 
                              className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium z-20"
                              style={{
                                background: supp.priority === 'Essential' ? 'rgba(0, 217, 255, 0.2)' : 'rgba(255,255,255,0.1)',
                                color: supp.priority === 'Essential' ? '#00d9ff' : '#9ca3af',
                                border: supp.priority === 'Essential' ? '1px solid rgba(0, 217, 255, 0.4)' : '1px solid rgba(255,255,255,0.2)',
                              }}
                            >
                              {supp.priority}
                            </span>
                          </div>

                          {/* Product Content */}
                          <div className="p-6">
                            {/* Product Title */}
                            <h3 className="text-lg font-normal text-white mb-3 line-clamp-2 min-h-[3.5rem]">
                              {supp.name}
                            </h3>

                            {/* Description - Expandable */}
                            <div className="mb-4">
                              <p 
                                className={`text-sm text-[var(--txt-muted)] font-light leading-relaxed transition-all duration-300 ${isExpanded ? '' : 'line-clamp-2'}`}
                              >
                                {supp.reason}
                              </p>
                              <button 
                                onClick={() => setExpandedSupplement(isExpanded ? null : idx)} 
                                className="text-sm text-[#00d9ff] hover:text-[#00f0ff] font-normal mt-2 transition-colors duration-300 flex items-center gap-1"
                              >
                                {isExpanded ? 'View Less' : 'View More'}
                                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                              </button>
                            </div>

                            {/* Expanded Details */}
                            {isExpanded && (
                              <div className="mb-4 p-3 rounded-lg" style={{ background: 'rgba(0, 217, 255, 0.05)', border: '1px solid rgba(0, 217, 255, 0.2)' }}>
                                <p className="text-xs text-gray-300 mb-1"><strong className="text-white">Dosage:</strong> {supp.dosage}</p>
                                <p className="text-xs text-gray-300 mb-1"><strong className="text-white">Timing:</strong> {supp.timing}</p>
                                {supplement?.info && (
                                  <p className="text-xs text-gray-400 mt-2">{supplement.info}</p>
                                )}
                              </div>
                            )}

                            {/* Price */}
                            <div className="mb-6 pt-4 border-t border-[var(--border)]">
                              <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-[#00d9ff]">
                                  ${supplement?.price?.toFixed(2) || '0.00'}
                                </span>
                                <span className="text-sm text-[var(--txt-muted)] font-light">USD</span>
                              </div>
                            </div>

                            {/* Add to Cart Button - Matching Shop Style */}
                            <button
                              onClick={() => addToCart(supp.name)}
                              className="w-full flex items-center justify-center gap-2 text-white transition-all duration-300"
                              style={{
                                background: inCart ? 'rgba(16, 185, 129, 0.9)' : 'rgba(30, 30, 30, 0.9)',
                                border: inCart ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(0, 217, 255, 0.4)',
                                borderRadius: '12px',
                                padding: '14px 28px',
                                fontSize: '16px',
                                fontWeight: 600,
                                boxShadow: inCart 
                                  ? '0 0 20px rgba(16, 185, 129, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)'
                                  : '0 0 20px rgba(0, 217, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)',
                              }}
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
                                <><Check size={18} /> Added to Cart</>
                              ) : (
                                <><ShoppingCart size={18} /> Add to Cart</>
                              )}
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

              {/* Why This Stack Works - AI Insights Section */}
              <div 
                className="rounded-2xl overflow-hidden transition-all duration-300"
                style={{
                  background: 'rgba(30, 30, 30, 0.9)',
                  border: '1px solid rgba(0, 217, 255, 0.3)',
                  boxShadow: '0 0 20px rgba(0, 217, 255, 0.15), 0 4px 12px rgba(0, 0, 0, 0.2)'
                }}
              >
                <div className="p-6">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Sparkles size={20} className="text-[#00d9ff]" />
                    Why This Stack Works For You
                  </h4>
                  
                  {/* Goal Context */}
                  <p className="text-sm text-gray-400 mb-6">
                    Based on your goal to <span className="text-[#00d9ff] font-medium">{goalTitle.toLowerCase()}</span>, here's how each supplement helps:
                  </p>

                  {/* Supplement Explanations */}
                  <div className="space-y-4 mb-6">
                    {recommendations.stack.map((supp, idx) => (
                      <div 
                        key={idx} 
                        className="p-4 rounded-xl"
                        style={{
                          background: 'rgba(0, 217, 255, 0.05)',
                          border: '1px solid rgba(0, 217, 255, 0.15)',
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{
                              background: 'rgba(0, 217, 255, 0.15)',
                              border: '1px solid rgba(0, 217, 255, 0.3)',
                            }}
                          >
                            <Check size={16} className="text-[#00d9ff]" />
                          </div>
                          <div>
                            <h5 className="text-sm font-semibold text-[#00d9ff] mb-1">{supp.name}</h5>
                            <p className="text-sm text-gray-300 leading-relaxed">{supp.reason}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              <Clock size={12} className="inline mr-1" />
                              Take: {supp.timing} • {supp.dosage}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Additional Insights */}
                  {recommendations.insights && recommendations.insights.length > 0 && (
                    <div className="pt-4 border-t border-[rgba(255,255,255,0.1)]">
                      <h5 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <TrendingUp size={16} className="text-[#00d9ff]" />
                        Tips for Best Results
                      </h5>
                      <ul className="space-y-2">
                        {recommendations.insights.map((insight, idx) => (
                          <li key={idx} className="text-sm text-gray-400 flex items-start gap-2">
                            <CheckCircle size={14} className="text-[#00d9ff] mt-0.5 flex-shrink-0" />
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

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

