// Supplement tooltip data
export const supplementTooltips = {
  'Creatine Monohydrate': {
    benefits: [
      '💪 Increases strength & power output',
      '🧠 Supports cognitive function',
      '⚡ Improves high-intensity performance',
      '💧 Enhances muscle hydration'
    ],
    dosage: '5g daily',
    research: '★★★★★',
    cost: '~$0.10/day',
    note: 'Gold standard supplement'
  },
  'Whey Protein': {
    benefits: [
      '💪 Supports muscle building & repair',
      '🍽️ Promotes satiety & weight management',
      '⚡ Fast-digesting post-workout fuel',
      '🏋️ Complete amino acid profile'
    ],
    dosage: '20-30g per serving',
    research: '★★★★★',
    cost: '~$0.50/day',
    note: 'Most researched protein source'
  },
  'Omega-3 Fish Oil': {
    benefits: [
      '❤️ Supports heart health',
      '🧠 Enhances brain function',
      '🔥 Reduces inflammation',
      '👁️ Supports eye health'
    ],
    dosage: '2-3g EPA+DHA daily',
    research: '★★★★★',
    cost: '~$0.25/day',
    note: 'Essential fatty acids'
  },
  'Vitamin D3': {
    benefits: [
      '🦴 Supports bone health',
      '🛡️ Boosts immune function',
      '😊 Improves mood & energy',
      '💪 Supports muscle function'
    ],
    dosage: '2000-5000 IU daily',
    research: '★★★★☆',
    cost: '~$0.05/day',
    note: 'Especially important in winter'
  },
  'Magnesium Glycinate': {
    benefits: [
      '😴 Improves sleep quality',
      '💪 Supports muscle recovery',
      '🧠 Reduces stress & anxiety',
      '⚡ Enhances energy production'
    ],
    dosage: '400-600mg daily',
    research: '★★★★☆',
    cost: '~$0.15/day',
    note: 'Best taken before bed'
  },
  'Pre-Workout': {
    benefits: [
      '⚡ Increases energy & alertness',
      '🎯 Enhances focus & concentration',
      '💪 Improves workout performance',
      '🔥 Increases blood flow & pumps'
    ],
    dosage: '1 serving 30min pre-workout',
    research: '★★★★☆',
    cost: '~$0.75/day',
    note: 'Best on training days only'
  }
};

export function getSupplementTooltip(supplementName) {
  // Try exact match first
  if (supplementTooltips[supplementName]) {
    return supplementTooltips[supplementName];
  }
  
  // Try case-insensitive match
  const lowerName = supplementName.toLowerCase();
  for (const key in supplementTooltips) {
    if (key.toLowerCase() === lowerName) {
      return supplementTooltips[key];
    }
  }
  
  // Try partial match
  for (const key in supplementTooltips) {
    if (lowerName.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerName)) {
      return supplementTooltips[key];
    }
  }
  
  // Default tooltip
  return {
    benefits: [
      '✅ Science-backed benefits',
      '💊 Dosage recommendations',
      '🔬 Research-supported',
      '💰 Cost-effective'
    ],
    dosage: 'As directed on label',
    research: '★★★★☆',
    cost: '~$0.25/day',
    note: 'Quality supplement'
  };
}

