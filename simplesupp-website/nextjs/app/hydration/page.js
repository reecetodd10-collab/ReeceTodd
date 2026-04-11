'use client';

import ProductLandingTemplate from '../components/ProductLandingTemplate';

const config = {
  displayName: 'Hydration Powder (Lemonade)',
  productMatchers: ['hydration', 'lemonade'],
  fallbackEmoji: '💧',
  hero: {
    eyebrow: 'ELECTROLYTE FORMULA',
    titleLines: ['HYDRA', 'TION', 'LEMONADE'],
    titleAccentLine: 2,
    subtitle:
      'Full-spectrum electrolyte replenishment for athletes who sweat like they mean it. Zero sugar. Real lemonade flavor.',
    badge: 'NEW FLAVOR',
  },
  price: { display: '$24.99', value: 24.99 },
  servingsText: '30 SERVINGS',
  colors: {
    primary: '#ffd200',
    dark: '#4a3d00',
    bg: '#fffef5',
    accent: '#ff8a3d',
    bodyText: '#5a5a4a',
    mutedText: '#8a8a7a',
    borderTint: '#e8e4c8',
  },
  benefits: [
    {
      num: '01',
      title: 'OUTPERFORMS WATER',
      desc:
        'Scientifically balanced electrolyte ratio — sodium, potassium, magnesium, calcium — for faster absorption than water alone.',
    },
    {
      num: '02',
      title: 'ZERO SUGAR, REAL FLAVOR',
      desc:
        'Actual lemonade taste without the 12g of sugar other brands hide. Clean hydration that doesn\'t spike your insulin.',
    },
    {
      num: '03',
      title: 'CRAMP PREVENTION',
      desc:
        'Magnesium citrate + potassium chloride target the two minerals your muscles lose first. No more 3am charley horses.',
    },
    {
      num: '04',
      title: 'IMMUNE SHIELD',
      desc:
        '100mg Vitamin C per serving. Hard training tanks your immune system — this keeps you in the game.',
    },
  ],
  ingredients: [
    { name: 'Sodium (as Sodium Citrate)', dose: '500 mg', desc: 'Primary electrolyte for fluid retention' },
    { name: 'Potassium (as Potassium Chloride)', dose: '200 mg', desc: 'Muscle function & nerve signaling' },
    { name: 'Magnesium (as Magnesium Citrate)', dose: '60 mg', desc: 'Prevents cramping & supports recovery' },
    { name: 'Calcium (as Calcium Carbonate)', dose: '40 mg', desc: 'Bone strength & muscle contractions' },
    { name: 'Vitamin C (as Ascorbic Acid)', dose: '100 mg', desc: 'Immune support & antioxidant defense' },
  ],
  reviews: [
    {
      name: 'TYLER R.',
      rating: 5,
      text:
        '"I drink this during every workout now. Way better than Liquid IV and half the sugar. Lemonade flavor is actually good."',
      tag: 'VERIFIED BUYER',
    },
    {
      name: 'ALYSSA M.',
      rating: 5,
      text:
        '"Finally a hydration powder that doesn\'t taste like medicine. I keep a packet in my gym bag at all times."',
      tag: 'VERIFIED BUYER',
    },
    {
      name: 'DEVON P.',
      rating: 5,
      text:
        '"Used this for my marathon training. Zero cramps, zero bloating. The electrolyte ratio is dialed in."',
      tag: 'VERIFIED BUYER',
    },
  ],
  bottomCTA: {
    titleLines: ['DON\'T', 'TRAIN', 'DRY.'],
    accentLineIdx: 2,
    body:
      'Water isn\'t enough. Your muscles lose electrolytes every rep, every mile, every set. Replace what you lose.',
  },
  transparencyTagline: 'Full transparent label. No proprietary blends. Zero sugar.',
};

export default function HydrationPage() {
  return <ProductLandingTemplate config={config} />;
}
