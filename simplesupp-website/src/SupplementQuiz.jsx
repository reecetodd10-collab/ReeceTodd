import React, { useState } from 'react';
import { Activity, Heart, Target, Pill, Info, Dumbbell, Sparkles, ShoppingCart, ExternalLink, Flame, Brain, Moon, Zap, X, Plus, Minus, Check } from 'lucide-react';
import { products, PRODUCT_CATEGORIES } from './data/products';

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

  // SHOPPING CART STATE
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const goalCategories = [
    { id: 'muscle', title: 'Build Muscle & Strength', icon: Dumbbell, description: 'Pack on size, max strength, get powerful', color: 'from-purple-500 to-pink-600', emoji: '💪' },
    { id: 'fatloss', title: 'Lose Fat & Get Lean', icon: Flame, description: 'Shed pounds, reveal definition, beach ready', color: 'from-orange-500 to-red-600', emoji: '🔥' },
    { id: 'tone', title: 'Tone & Sculpt', icon: Activity, description: 'Lean, toned, fit physique without bulk', color: 'from-pink-400 to-rose-500', emoji: '✨' },
    { id: 'athletic', title: 'Athletic Performance', icon: Zap, description: 'Speed, endurance, explosiveness, sports', color: 'from-blue-500 to-cyan-600', emoji: '⚡' },
    { id: 'beauty', title: 'Beauty & Anti-Aging', icon: Sparkles, description: 'Glowing skin, strong hair nails, youthful', color: 'from-rose-400 to-pink-500', emoji: '💅' },
    { id: 'sleep', title: 'Sleep & Recovery', icon: Moon, description: 'Deep rest, repair, recharge, destress', color: 'from-indigo-500 to-purple-600', emoji: '😴' },
    { id: 'focus', title: 'Focus & Productivity', icon: Brain, description: 'Mental clarity, energy, crush work', color: 'from-cyan-500 to-blue-600', emoji: '🧠' },
    { id: 'longevity', title: 'Longevity & Wellness', icon: Heart, description: 'Disease prevention, anti-aging, feel great', color: 'from-green-500 to-emerald-600', emoji: '❤️' }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* HEADER WITH CART */}
        {!showLanding && (
          <div className="text-center mb-8 relative">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl blur-xl opacity-60"></div>
                <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black p-3 rounded-2xl shadow-2xl border border-gray-700">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-md opacity-50"></div>
                    <Pill className="relative text-white fill-current" size={44} style={{ filter: 'drop-shadow(0 0 8px rgba(96, 165, 250, 0.8))' }} />
                  </div>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold font-display gradient-text">SmartStack</h1>
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setShowCart(!showCart)}
              className="fixed top-6 right-6 z-50 bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-full shadow-lg hover:shadow-blue-500/50 transition-all flex items-center gap-2"
            >
              <ShoppingCart size={24} />
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </button>
          </div>
        )}

        {/* SHOPPING CART MODAL */}
        {showCart && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowCart(false)}>
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-500 to-cyan-500">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
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
                    <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">Your cart is empty</p>
                    <p className="text-gray-400 text-sm mt-2">Add supplements from your recommendations!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.name} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.name, -1)}
                            className="p-1 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="font-bold text-gray-900 w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.name, 1)}
                            className="p-1 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
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
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-gray-900">Total:</span>
                    <span className="text-3xl font-bold text-blue-600">${getCartTotal()}</span>
                  </div>
                  <button className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white text-lg font-bold hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-green-500/50 transition-all flex items-center justify-center gap-2">
                    <Check size={24} />
                    Checkout with Supliful
                  </button>
                  <p className="text-xs text-gray-500 text-center mt-3">
                    Secure checkout • Free shipping over $50
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-blue-100">
          {/* LANDING PAGE */}
          {showLanding && (
            <div className="space-y-8">
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 rounded-3xl blur-2xl opacity-50"></div>
                    <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 rounded-3xl shadow-2xl border-2 border-gray-700">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-lg opacity-60 animate-pulse"></div>
                        <Pill className="relative text-white fill-current" size={64} style={{ filter: 'drop-shadow(0 0 12px rgba(96, 165, 250, 1))' }} />
                      </div>
                    </div>
                  </div>
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold font-display gradient-text mb-4">SmartStack AI</h1>
                <p className="text-2xl text-gray-700 font-semibold">Your Personal Supplement Intelligence</p>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">Get a personalized supplement stack from our database of 42+ premium supplements</p>
              </div>
              <div className="text-center space-y-4 max-w-xl mx-auto">
                <button onClick={() => setShowLanding(false)} className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xl font-semibold hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-blue-500/50 transition-all">Get Your Stack →</button>
                <p className="text-gray-500 text-sm">Free • 2 minutes • Science-backed • 42+ Supplements</p>
              </div>
            </div>
          )}

          {/* STEP 0: GOAL SELECTION */}
          {!showLanding && step === 0 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-3">What is Your Main Goal?</h2>
                <p className="text-gray-600">Choose the one that resonates most</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goalCategories.map(goal => {
                  const Icon = goal.icon;
                  return (
                    <button key={goal.id} onClick={() => { setPrimaryGoal(goal.id); setStep(1); }} className="group p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/10 transition-all">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${goal.color} shadow-lg flex-shrink-0`}><Icon size={28} className="text-white" /></div>
                        <div className="flex-1 text-left">
                          <h3 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2"><span>{goal.emoji}</span>{goal.title}</h3>
                          <p className="text-gray-600 text-sm">{goal.description}</p>
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
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Tell Us About You</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  <input type="number" value={formData.age} onChange={(e) => handleInputChange('age', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors" placeholder="30" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select value={formData.gender} onChange={(e) => handleInputChange('gender', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-200 text-gray-800 focus:border-blue-500 focus:outline-none transition-colors">
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Activity Level</label>
                  <select value={formData.activityLevel} onChange={(e) => handleInputChange('activityLevel', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-200 text-gray-800 focus:border-blue-500 focus:outline-none transition-colors">
                    <option value="">Select</option>
                    <option value="sedentary">Sedentary</option>
                    <option value="light">Lightly Active</option>
                    <option value="moderate">Moderately Active</option>
                    <option value="very">Very Active</option>
                    <option value="athlete">Athlete</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Workout Frequency</label>
                  <select value={formData.workoutFrequency} onChange={(e) => handleInputChange('workoutFrequency', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-200 text-gray-800 focus:border-blue-500 focus:outline-none transition-colors">
                    <option value="">Select</option>
                    <option value="0">0 days/week</option>
                    <option value="1-2">1-2 days/week</option>
                    <option value="3-4">3-4 days/week</option>
                    <option value="5-6">5-6 days/week</option>
                    <option value="7+">7+ days/week</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sleep (hours)</label>
                  <input type="number" value={formData.sleepHours} onChange={(e) => handleInputChange('sleepHours', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors" placeholder="7" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stress Level</label>
                  <select value={formData.stressLevel} onChange={(e) => handleInputChange('stressLevel', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-200 text-gray-800 focus:border-blue-500 focus:outline-none transition-colors">
                    <option value="">Select</option>
                    <option value="low">Low</option>
                    <option value="moderate">Moderate</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Biggest Challenge</label>
                <select value={formData.biggestChallenge} onChange={(e) => handleInputChange('biggestChallenge', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-200 text-gray-800 focus:border-blue-500 focus:outline-none transition-colors">
                  <option value="">Select</option>
                  <option value="energy">Low energy</option>
                  <option value="motivation">Lack of motivation</option>
                  <option value="recovery">Slow recovery</option>
                  <option value="appetite">Cannot control appetite</option>
                  <option value="sleep">Poor sleep</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setStep(0)} className="flex-1 px-6 py-3 rounded-xl bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors">Back</button>
                <button onClick={() => setStep(2)} disabled={!formData.age || !formData.gender || !formData.activityLevel} className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-500/30">Continue</button>
              </div>
            </div>
          )}

          {/* STEP 2: PERSONALIZATION */}
          {!showLanding && step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Personalize Your Stack</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Diet Type</label>
                <select value={formData.dietType} onChange={(e) => handleInputChange('dietType', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-200 text-gray-800 focus:border-blue-500 focus:outline-none transition-colors">
                  <option value="">Select</option>
                  <option value="omnivore">Omnivore</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="keto">Keto</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Specific Goals (select all that apply)</label>
                <div className="grid grid-cols-2 gap-3">
                  {healthGoalsByCategory[primaryGoal].map(goal => (
                    <button key={goal} onClick={() => toggleArrayField('healthGoals', goal)} className={`p-3 rounded-xl border-2 text-sm transition-all font-medium ${formData.healthGoals.includes(goal) ? 'border-blue-500 bg-blue-500/10 text-blue-700' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}>{goal}</button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setStep(1)} className="flex-1 px-6 py-3 rounded-xl bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors">Back</button>
                <button onClick={generateRecommendations} disabled={!formData.healthGoals.length || !formData.dietType} className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-500/30">
                  Generate Stack <Sparkles size={20} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: RECOMMENDATIONS */}
          {!showLanding && step === 4 && recommendations && (
            <div className="space-y-6">
              <div className="bg-amber-50 p-6 rounded-2xl border-2 border-amber-200">
                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Info size={24} className="text-amber-600" />
                  Disclaimer
                </h3>
                <p className="text-gray-700 text-sm">Educational purposes only. Consult healthcare provider before starting supplements.</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">Your Personalized Stack</h3>
                    <p className="text-gray-600">Optimized for: <span className="text-blue-600 font-semibold">{goalCategories.find(g => g.id === primaryGoal)?.title}</span></p>
                  </div>
                  <button onClick={addAllToCart} className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-green-500/50 transition-all flex items-center gap-2">
                    <ShoppingCart size={20} />
                    Add All to Cart
                  </button>
                </div>

                <div className="space-y-4">
                  {recommendations.stack.map((supp, idx) => {
                    const isExpanded = expandedSupplement === idx;
                    const supplement = SUPPLEMENT_DATABASE[supp.name];
                    const inCart = cart.some(item => item.name === supp.name);

                    return (
                      <div key={idx} className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden hover:border-gray-300 transition-colors">
                        <div className="flex gap-4 p-5">
                          <img src={getSupplementImage(supp.name)} alt={supp.name} className="w-24 h-24 object-cover rounded-xl flex-shrink-0 shadow-md" />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="text-lg font-bold text-gray-900">{supp.name}</h4>
                                <p className="text-blue-600 font-semibold text-sm">${supplement?.price.toFixed(2)}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${supp.priority === 'Essential' ? 'bg-orange-100 text-orange-700 border border-orange-200' : supp.priority === 'High' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                                {supp.priority}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mb-2"><strong className="text-gray-900">Dosage:</strong> {supp.dosage}</p>
                            <p className="text-sm text-gray-700 mb-2"><strong className="text-gray-900">Timing:</strong> {supp.timing}</p>
                            <p className="text-sm text-gray-600 mb-3">{supp.reason}</p>

                            <button onClick={() => setExpandedSupplement(isExpanded ? null : idx)} className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 mb-3">
                              <Info size={14} />
                              {isExpanded ? 'Hide details' : 'Learn more'}
                            </button>

                            {isExpanded && (
                              <div className="bg-blue-50 p-4 rounded-xl mb-3 border border-blue-100">
                                <p className="text-sm text-gray-700">{supplement?.info}</p>
                              </div>
                            )}

                            <div className="flex gap-3">
                              <button
                                onClick={() => addToCart(supp.name)}
                                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                                  inCart
                                    ? 'bg-green-100 text-green-700 border-2 border-green-200'
                                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-500/30'
                                }`}
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
              </div>

              <div className="bg-green-50 p-5 rounded-2xl border-2 border-green-200">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Target size={20} className="text-green-600" />
                  Key Insights for Your Goal
                </h4>
                <ul className="space-y-2">
                  {recommendations.insights.map((insight, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex gap-2">
                      <span className="text-green-600 font-bold">•</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button onClick={() => { setStep(0); setPrimaryGoal(''); setRecommendations(null); setShowLanding(false); }} className="w-full bg-gray-100 border-2 border-gray-200 text-gray-900 py-3 rounded-xl font-medium hover:bg-gray-200 hover:border-gray-300 transition-all">
                Start New Assessment
              </button>

              <div className="text-center pt-6 border-t border-gray-200">
                <p className="text-gray-500 text-xs mb-2">
                  Powered by Supliful • 42 Premium Supplements
                </p>
                <p className="text-gray-400 text-xs">
                  © 2025 SmartStack • For educational purposes only
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
