// SmartSupp Product Catalog - Supliful Integration
// All products sourced from Supliful with real pricing and IDs

export const PRODUCT_CATEGORIES = {
  PERFORMANCE: 'Performance',
  WEIGHT_LOSS: 'Weight Management',
  HEALTH: 'Health & Wellness',
  RECOVERY: 'Recovery & Sleep',
  FOCUS: 'Focus & Cognition',
  BEAUTY: 'Beauty & Skin'
};

export const products = [
  // PERFORMANCE
  {
    id: '3054ec5d-6cc4-428b-978d-af5b257738e7',
    name: 'Creatine Monohydrate',
    suplifulName: 'Creatine Monohydrate',
    category: PRODUCT_CATEGORIES.PERFORMANCE,
    price: 33.90,
    costPrice: 14.69,
    description: 'The most researched supplement for strength and power. Increases muscle mass, strength, and exercise performance.',
    benefits: ['Increases strength and power', 'Supports muscle growth', 'Improves high-intensity performance', 'Enhances recovery'],
    dosage: '5g daily',
    goals: ['muscle_gain', 'strength'],
    priority: 'essential',
    active: true
  },
  {
    id: '98df3d8f-54b3-4b0a-a51d-42c77d6d8cf7',
    name: 'Whey Protein Isolate (Chocolate)',
    suplifulName: 'Advanced 100% Whey Protein Isolate (Chocolate)',
    category: PRODUCT_CATEGORIES.PERFORMANCE,
    price: 44.49,
    costPrice: 27.75,
    description: 'Fast-digesting protein for muscle recovery and growth. 100% isolate for maximum purity.',
    benefits: ['Supports muscle recovery', 'Promotes lean muscle growth', 'Fast absorption', 'Low in fat and carbs'],
    dosage: '1-2 scoops post-workout',
    goals: ['muscle_gain', 'fat_loss'],
    priority: 'essential',
    active: true
  },
  {
    id: 'd789c3a3-d10c-4ba8-9b2c-61450c192ad5',
    name: 'Whey Protein Isolate (Vanilla)',
    suplifulName: 'Advanced 100% Whey Protein Isolate (Vanilla)',
    category: PRODUCT_CATEGORIES.PERFORMANCE,
    price: 44.49,
    costPrice: 27.75,
    description: 'Fast-digesting protein for muscle recovery and growth. 100% isolate for maximum purity.',
    benefits: ['Supports muscle recovery', 'Promotes lean muscle growth', 'Fast absorption', 'Low in fat and carbs'],
    dosage: '1-2 scoops post-workout',
    goals: ['muscle_gain', 'fat_loss'],
    priority: 'essential',
    active: true
  },
  {
    id: '2fc14d84-063d-467c-95c0-03b889736539',
    name: 'Pre-Workout Formula',
    suplifulName: 'Nitric Shock Pre-Workout Powder (Fruit Punch)',
    category: PRODUCT_CATEGORIES.PERFORMANCE,
    price: 35.90,
    costPrice: 19.75,
    description: 'Explosive energy, focus, and pumps. Nitric oxide booster for enhanced performance.',
    benefits: ['Increases energy and focus', 'Enhances muscle pumps', 'Improves endurance', 'Delays fatigue'],
    dosage: '1 scoop 20-30 min pre-workout',
    goals: ['muscle_gain', 'energy'],
    priority: 'high',
    active: true
  },
  {
    id: '13557dbf-9a4c-46c4-9fe3-18d27ac2af3d',
    name: 'BCAAs',
    suplifulName: 'BCAA Shock Powder (Fruit Punch)',
    category: PRODUCT_CATEGORIES.PERFORMANCE,
    price: 33.90,
    costPrice: 18.65,
    description: 'Branch Chain Amino Acids to support muscle recovery and reduce soreness.',
    benefits: ['Reduces muscle soreness', 'Supports recovery', 'Prevents muscle breakdown', 'Improves endurance'],
    dosage: '5-10g during or post-workout',
    goals: ['muscle_gain', 'recovery'],
    priority: 'high',
    active: true
  },
  {
    id: 'd173aca5-2bbc-4343-ae80-87e0674aff0a',
    name: 'Electrolyte Formula (Lemonade)',
    suplifulName: 'Hydration Powder (Lemonade)',
    category: PRODUCT_CATEGORIES.PERFORMANCE,
    price: 31.90,
    costPrice: 13.55,
    description: 'Essential electrolytes for hydration, endurance, and recovery.',
    benefits: ['Improves hydration', 'Prevents cramping', 'Supports endurance', 'Replenishes minerals'],
    dosage: '1 scoop during or post-workout',
    goals: ['energy', 'recovery'],
    priority: 'medium',
    active: true
  },
  {
    id: 'db510c6f-433e-4156-a336-8bdb89f019ad',
    name: 'Electrolyte Formula (Peach Mango)',
    suplifulName: 'Hydration Powder (Peach Mango)',
    category: PRODUCT_CATEGORIES.PERFORMANCE,
    price: 32.90,
    costPrice: 13.55,
    description: 'Essential electrolytes for hydration, endurance, and recovery.',
    benefits: ['Improves hydration', 'Prevents cramping', 'Supports endurance', 'Replenishes minerals'],
    dosage: '1 scoop during or post-workout',
    goals: ['energy', 'recovery'],
    priority: 'medium',
    active: true
  },
  {
    id: '4ab25061-625a-400c-8851-4fd14acbf415',
    name: 'Beetroot',
    suplifulName: 'Beetroot',
    category: PRODUCT_CATEGORIES.PERFORMANCE,
    price: 20.90,
    costPrice: 9.95,
    description: 'Natural nitric oxide booster for improved blood flow and endurance.',
    benefits: ['Enhances blood flow', 'Improves endurance', 'Supports cardiovascular health', 'Natural energy boost'],
    dosage: 'As directed on label',
    goals: ['energy', 'health'],
    priority: 'medium',
    active: true
  },
  {
    id: '86461f8d-0983-4549-b50b-91856a4d952c',
    name: 'Beetroot Powder',
    suplifulName: 'Bootroot Powder',
    category: PRODUCT_CATEGORIES.PERFORMANCE,
    price: 32.90,
    costPrice: 10.85,
    description: 'Pure beetroot powder for mixing into smoothies and pre-workouts.',
    benefits: ['Enhances blood flow', 'Improves endurance', 'Supports cardiovascular health', 'Versatile usage'],
    dosage: '1-2 scoops daily',
    goals: ['energy', 'health'],
    priority: 'medium',
    active: true
  },
  {
    id: '04d317ad-99f5-4552-ad5d-15bdd598cef1',
    name: 'L-Glutamine',
    suplifulName: 'L-Glutamine Power',
    category: PRODUCT_CATEGORIES.PERFORMANCE,
    price: 24.90,
    costPrice: 12.55,
    description: 'Supports muscle recovery, gut health, and immune function.',
    benefits: ['Supports muscle recovery', 'Promotes gut health', 'Boosts immune system', 'Reduces muscle soreness'],
    dosage: '5g post-workout or before bed',
    goals: ['muscle_gain', 'recovery', 'health'],
    priority: 'medium',
    active: true
  },

  // WEIGHT MANAGEMENT
  {
    id: '13acd5c2-ce8b-4f52-a38f-035cb1f74309',
    name: 'Keto-5',
    suplifulName: 'Keto-5',
    category: PRODUCT_CATEGORIES.WEIGHT_LOSS,
    price: 29.90,
    costPrice: 10.29,
    description: 'Advanced keto support formula to help your body enter and maintain ketosis.',
    benefits: ['Supports ketosis', 'Increases energy', 'Reduces keto flu symptoms', 'Promotes fat burning'],
    dosage: 'As directed on label',
    goals: ['fat_loss'],
    priority: 'high',
    active: true
  },
  {
    id: 'd92a98f8-97bb-4f01-8f06-3d9300633e36',
    name: 'Keto BHB',
    suplifulName: 'Keto BHB',
    category: PRODUCT_CATEGORIES.WEIGHT_LOSS,
    price: 19.95,
    costPrice: 8.15,
    description: 'Beta-hydroxybutyrate to fuel ketosis and provide clean energy.',
    benefits: ['Supports ketosis', 'Provides clean energy', 'Reduces hunger', 'Enhances mental clarity'],
    dosage: 'As directed on label',
    goals: ['fat_loss', 'energy'],
    priority: 'high',
    active: true
  },
  {
    id: '8d8a7463-7f6f-49de-8ad3-233a3078a5e0',
    name: 'Fat Burner with MCT',
    suplifulName: 'Fat Burner with MCT',
    category: PRODUCT_CATEGORIES.WEIGHT_LOSS,
    price: 32.49,
    costPrice: 10.75,
    description: 'Thermogenic fat burner with MCT oil for enhanced metabolism and energy.',
    benefits: ['Boosts metabolism', 'Increases energy', 'Supports fat oxidation', 'Provides MCT fuel'],
    dosage: 'As directed on label',
    goals: ['fat_loss', 'energy'],
    priority: 'high',
    active: true
  },

  // HEALTH & WELLNESS
  {
    id: 'matcha-green-tea',
    name: 'Green Tea Extract',
    suplifulName: 'Hydration Powder (Matcha Green Tea)',
    category: PRODUCT_CATEGORIES.HEALTH,
    price: 33.90,
    costPrice: 13.55,
    description: 'Powerful antioxidant with metabolism-boosting properties.',
    benefits: ['Rich in antioxidants', 'Supports metabolism', 'Promotes fat oxidation', 'Enhances focus'],
    dosage: '1 scoop daily',
    goals: ['fat_loss', 'health', 'focus'],
    priority: 'medium',
    active: true
  },
  {
    id: '0c8d4a0a-b206-4b66-a0da-b70ce0ecf893',
    name: 'Fiber Supplement (Gut Health)',
    suplifulName: 'Gut Health',
    category: PRODUCT_CATEGORIES.HEALTH,
    price: 28.90,
    costPrice: 8.15,
    description: 'Supports digestive health, regularity, and gut microbiome.',
    benefits: ['Supports digestive health', 'Promotes regularity', 'Feeds healthy gut bacteria', 'Aids nutrient absorption'],
    dosage: 'As directed on label',
    goals: ['health'],
    priority: 'high',
    active: true
  },
  {
    id: '5865f1cf-5fb6-494e-8bda-301dc28b740b',
    name: 'Apple Cider Vinegar',
    suplifulName: 'Apple Cider Vinegar Capsules',
    category: PRODUCT_CATEGORIES.HEALTH,
    price: 24.99,
    costPrice: 8.15,
    description: 'Supports digestion, metabolism, and blood sugar regulation.',
    benefits: ['Supports digestion', 'May aid weight management', 'Supports blood sugar balance', 'Convenient capsule form'],
    dosage: '1-2 capsules daily',
    goals: ['health', 'fat_loss'],
    priority: 'medium',
    active: true
  },
  {
    id: 'a529c726-8b2d-4307-a4cf-e2ad5e1f474f',
    name: 'Complete MultiVitamin',
    suplifulName: 'Complete MultiVitamin',
    category: PRODUCT_CATEGORIES.HEALTH,
    price: 29.90,
    costPrice: 10.19,
    description: 'Comprehensive multivitamin to fill nutritional gaps and support overall health.',
    benefits: ['Fills nutritional gaps', 'Supports immune function', 'Boosts energy', 'Promotes overall wellness'],
    dosage: '1-2 capsules daily with food',
    goals: ['health'],
    priority: 'essential',
    active: true
  },
  {
    id: 'a4f7b4e6-8dee-4429-aa82-ac7a8c8630c0',
    name: 'Multivitamin Gummies',
    suplifulName: 'Multivitamin Bear Gummies (Adult)',
    category: PRODUCT_CATEGORIES.HEALTH,
    price: 19.90,
    costPrice: 9.79,
    description: 'Delicious gummy multivitamin for adults. Easy and enjoyable daily nutrition.',
    benefits: ['Tasty and convenient', 'Supports immune health', 'Fills nutrient gaps', 'Easy to take'],
    dosage: '2 gummies daily',
    goals: ['health'],
    priority: 'medium',
    active: true
  },
  {
    id: '13c3102f-ed0c-4bfd-b42c-202836f25fd8',
    name: 'Omega-3 Fish Oil',
    suplifulName: 'Omega-3 EPA 180mg + DHA 120mg',
    category: PRODUCT_CATEGORIES.HEALTH,
    price: 23.90,
    costPrice: 11.05,
    description: 'Essential fatty acids for heart health, brain function, and inflammation control.',
    benefits: ['Supports heart health', 'Promotes brain function', 'Reduces inflammation', 'Supports joint health'],
    dosage: '1-2 softgels daily with meals',
    goals: ['health'],
    priority: 'essential',
    active: true
  },
  {
    id: 'e9a00570-3c57-43bc-90f7-3c76757e0614',
    name: 'CoQ10',
    suplifulName: 'CoQ10 Ubiquinone',
    category: PRODUCT_CATEGORIES.HEALTH,
    price: 27.50,
    costPrice: 11.85,
    description: 'Powerful antioxidant that supports cellular energy production and heart health.',
    benefits: ['Supports heart health', 'Boosts cellular energy', 'Powerful antioxidant', 'Supports healthy aging'],
    dosage: '1 capsule daily',
    goals: ['health'],
    priority: 'high',
    active: true
  },
  {
    id: '237310d9-98d6-4d56-bd4e-4f339b58cc93',
    name: 'Platinum Turmeric',
    suplifulName: 'Platnum Turmeric',
    category: PRODUCT_CATEGORIES.HEALTH,
    price: 25.90,
    costPrice: 10.09,
    description: 'Premium turmeric with curcumin for powerful anti-inflammatory benefits.',
    benefits: ['Powerful anti-inflammatory', 'Supports joint health', 'Antioxidant protection', 'Supports recovery'],
    dosage: 'As directed on label',
    goals: ['health', 'recovery'],
    priority: 'high',
    active: true
  },
  {
    id: '37a28e0d-7746-4d46-a049-0bed6a3bf9f0',
    name: 'Turmeric Gummies',
    suplifulName: 'Turmeric Gummies',
    category: PRODUCT_CATEGORIES.HEALTH,
    price: 21.90,
    costPrice: 10.65,
    description: 'Delicious turmeric gummies for joint health and inflammation support.',
    benefits: ['Anti-inflammatory support', 'Supports joint health', 'Easy to take', 'Great taste'],
    dosage: '2 gummies daily',
    goals: ['health', 'recovery'],
    priority: 'medium',
    active: true
  },
  {
    id: '8e469f6e-0b5c-41aa-927c-6253082cad50',
    name: 'Probiotics 20 Billion',
    suplifulName: 'Probiotics 20 Billion',
    category: PRODUCT_CATEGORIES.HEALTH,
    price: 19.95,
    costPrice: 8.75,
    description: '20 billion CFU probiotic blend for gut health and immune support.',
    benefits: ['Supports digestive health', 'Boosts immune function', 'Promotes gut balance', 'Enhances nutrient absorption'],
    dosage: '1 capsule daily',
    goals: ['health'],
    priority: 'high',
    active: true
  },
  {
    id: '31f89e1c-3c93-4f08-a5e5-7189489d51a0',
    name: 'Probiotics 40 Billion',
    suplifulName: 'Probiotics 40 Billion with Prebiotics',
    category: PRODUCT_CATEGORIES.HEALTH,
    price: 29.95,
    costPrice: 12.45,
    description: 'Advanced probiotic formula with 40 billion CFU plus prebiotics for maximum gut health.',
    benefits: ['Maximum probiotic potency', 'Includes prebiotics', 'Supports immune health', 'Promotes digestive wellness'],
    dosage: '1 capsule daily',
    goals: ['health'],
    priority: 'high',
    active: true
  },

  // RECOVERY & SLEEP
  {
    id: '25bbee04-d67a-421c-a398-42b523af3088',
    name: 'Magnesium Glycinate',
    suplifulName: 'Magnesium Glycinate',
    category: PRODUCT_CATEGORIES.RECOVERY,
    price: 24.90,
    costPrice: 11.65,
    description: 'Highly absorbable magnesium for better sleep, recovery, and relaxation.',
    benefits: ['Improves sleep quality', 'Supports muscle recovery', 'Promotes relaxation', 'Highly absorbable'],
    dosage: '1-2 capsules before bed',
    goals: ['recovery', 'sleep'],
    priority: 'essential',
    active: true
  },
  {
    id: '464f3339-6249-499a-b284-e82573e3b32b',
    name: 'Sleep Support (Melatonin)',
    suplifulName: 'Sleep Support',
    category: PRODUCT_CATEGORIES.RECOVERY,
    price: 24.49,
    costPrice: 9.19,
    description: 'Natural sleep aid to help you fall asleep faster and improve sleep quality.',
    benefits: ['Helps fall asleep faster', 'Improves sleep quality', 'Supports sleep cycle', 'Non-habit forming'],
    dosage: '1 capsule 30 min before bed',
    goals: ['sleep', 'recovery'],
    priority: 'high',
    active: true
  },
  {
    id: '42e9385f-6d5d-46ac-bb71-8abc54425f7e',
    name: 'Ashwagandha',
    suplifulName: 'Ashwaganda',
    category: PRODUCT_CATEGORIES.RECOVERY,
    price: 23.90,
    costPrice: 7.59,
    description: 'Adaptogen that reduces stress, supports recovery, and improves sleep.',
    benefits: ['Reduces stress and anxiety', 'Supports cortisol balance', 'Improves sleep quality', 'Enhances recovery'],
    dosage: '1-2 capsules daily',
    goals: ['recovery', 'sleep', 'health'],
    priority: 'high',
    active: true
  },

  // FOCUS & COGNITION
  {
    id: '863aba7c-9518-4402-be63-a1f7e77df6c1',
    name: "Lion's Mane Mushroom",
    suplifulName: "Lion's Mane Mushroom",
    category: PRODUCT_CATEGORIES.FOCUS,
    price: 29.90,
    costPrice: 13.79,
    description: 'Nootropic mushroom for cognitive function, focus, and neuroprotection.',
    benefits: ['Supports cognitive function', 'Enhances focus and clarity', 'Promotes brain health', 'Natural neuroprotection'],
    dosage: '1-2 capsules daily',
    goals: ['focus', 'health'],
    priority: 'high',
    active: true
  },

  // BEAUTY & SKIN
  {
    id: '80e1e5e1-7700-4401-b199-df7ab8f221ca',
    name: 'Collagen Peptides',
    suplifulName: 'Grass fed Hydronized Collagen Peptides',
    category: PRODUCT_CATEGORIES.BEAUTY,
    price: 38.90,
    costPrice: 18.99,
    description: 'Grass-fed collagen for skin, hair, nails, and joint health.',
    benefits: ['Supports skin elasticity', 'Strengthens hair and nails', 'Supports joint health', 'Highly absorbable'],
    dosage: '1-2 scoops daily in beverage',
    goals: ['health'],
    priority: 'high',
    active: true
  },
  {
    id: 'c4ba8ca3-b8fa-4a0d-8e91-7abae5a90c82',
    name: 'Hyaluronic Acid Serum',
    suplifulName: 'Hyaluronic Acid Facial Serum',
    category: PRODUCT_CATEGORIES.BEAUTY,
    price: 29.90,
    costPrice: 8.19,
    description: 'Topical serum for intense hydration and anti-aging benefits.',
    benefits: ['Intense skin hydration', 'Reduces fine lines', 'Plumps skin', 'Improves skin texture'],
    dosage: 'Apply 2-3 drops to clean face',
    goals: ['health'],
    priority: 'medium',
    active: true
  },
  {
    id: 'b1a68b0c-528a-4324-b7c8-c19de3d3e4b2',
    name: 'Vitamin Glow Serum',
    suplifulName: 'Vitamin Glow Serum',
    category: PRODUCT_CATEGORIES.BEAUTY,
    price: 28.90,
    costPrice: 14.19,
    description: 'Vitamin-rich facial serum for radiant, glowing skin.',
    benefits: ['Brightens complexion', 'Boosts radiance', 'Antioxidant protection', 'Evens skin tone'],
    dosage: 'Apply 2-3 drops to clean face',
    goals: ['health'],
    priority: 'medium',
    active: true
  }
];

// Helper functions
export const getProductsByCategory = (category) => {
  return products.filter(p => p.category === category && p.active);
};

export const getProductsByGoal = (goal) => {
  return products.filter(p => p.goals.includes(goal) && p.active);
};

export const getProductsByPriority = (priority) => {
  return products.filter(p => p.priority === priority && p.active);
};

export const getProductById = (id) => {
  return products.find(p => p.id === id);
};

export const getAllActiveProducts = () => {
  return products.filter(p => p.active);
};

export default products;

