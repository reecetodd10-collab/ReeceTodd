'use client';

import ProductLandingTemplate from '../components/ProductLandingTemplate';

const config = {
  displayName: 'Pump (Nitric Oxide)',
  productMatchers: ['pump', 'nitric oxide'],
  fallbackEmoji: '💊',
  hero: {
    eyebrow: 'NITRIC OXIDE FORMULA',
    titleLines: ['PUMP'],
    titleAccentLine: 0,
    subtitle:
      'Engineered for athletes who refuse to plateau. Premium nitric oxide for blood flow, pumps, and sustained performance.',
    badge: '50% OFF',
  },
  price: { display: '$19.99', value: 19.99 },
  servingsText: '30 SERVINGS',
  colors: {
    primary: '#00e5ff',      // electric cyan (matches /creatine)
    dark: '#003a4a',         // deep teal
    bg: '#f4fdff',           // pale cyan tint
    accent: '#22d3ee',       // brighter cyan
    bodyText: '#2a4a55',
    mutedText: '#6a8a95',
    borderTint: '#d4eef2',
  },
  benefits: [
    {
      num: '01',
      title: 'VASODILATION ON DEMAND',
      desc:
        'L-Citrulline and L-Arginine open your blood vessels wider. More blood. More oxygen. More performance.',
    },
    {
      num: '02',
      title: 'NO CRASH FORMULA',
      desc:
        'Zero caffeine, zero stimulants. Just clean, sustained flow that doesn\'t leave you wrecked.',
    },
    {
      num: '03',
      title: 'ABSORPTION FIRST',
      desc:
        'Beetroot extract delivers natural nitrates that your body actually uses — not expensive urine.',
    },
    {
      num: '04',
      title: 'STACK FRIENDLY',
      desc:
        'Designed to pair with pre-workout, creatine, or protein. No conflicting ingredients.',
    },
  ],
  ingredients: [
    { name: 'L-Citrulline DL-Malate', dose: '400 mg', desc: 'Vasodilation & blood flow' },
    { name: 'L-Arginine Hydrochloride', dose: '350 mg', desc: 'Nitric oxide precursor' },
    { name: 'L-Arginine Alpha-Ketoglutarate', dose: '50 mg', desc: 'Enhanced NO production' },
    { name: 'Vegetable Capsule', dose: '—', desc: 'Cellulose. Brown rice flour. Nothing else.' },
  ],
  reviews: [
    {
      name: 'JAKE M.',
      rating: 5,
      text:
        '"Pumps are insane. I feel it within 30 minutes of taking it. This is my new staple."',
      tag: 'VERIFIED BUYER',
    },
    {
      name: 'SARAH K.',
      rating: 5,
      text:
        '"I bought this for my husband and now I take it too. Energy without the crash. Love it."',
      tag: 'VERIFIED BUYER',
    },
    {
      name: 'MARCUS T.',
      rating: 5,
      text:
        '"Been through every NO supplement on the market. This one actually delivers. Period."',
      tag: 'VERIFIED BUYER',
    },
  ],
  bottomCTA: {
    titleLines: ['DON\'T', 'TRAIN', 'FLAT.'],
    accentLineIdx: 2,
    body:
      'Limited batch. Once it\'s gone, it\'s gone. Get yours before we restock at full price.',
  },
  transparencyTagline: 'Full transparent label. No proprietary blends. Clinical doses only.',
  faqs: [
    {
      q: 'What does a nitric oxide supplement do?',
      a: 'A nitric oxide supplement supports vasodilation, which increases blood flow to working muscles during training. This can improve pumps, nutrient delivery, endurance, and the mind-muscle connection.',
    },
    {
      q: 'Is Pump (Nitric Oxide) stimulant-free?',
      a: 'Yes. Pump (Nitric Oxide) contains no caffeine or stimulants. It is designed for pumps and blood flow without affecting sleep or causing jitters — ideal for evening training or stacking with a pre-workout.',
    },
    {
      q: 'When should I take a nitric oxide supplement?',
      a: 'Take it 20 to 30 minutes before training for best results. L-citrulline reaches peak plasma levels around the 60-minute mark, so a slightly earlier window also works well.',
    },
    {
      q: 'Can I stack Pump (Nitric Oxide) with pre-workout?',
      a: 'Yes. Because it is stimulant-free, Pump (Nitric Oxide) pairs well with a caffeinated pre-workout for combined energy, focus, and pump support without doubling up on stimulants.',
    },
    {
      q: 'How long does it take to feel the effects?',
      a: 'Most users notice improved pumps and blood flow within 20 to 40 minutes of taking it before a workout. Effects compound over weeks of consistent daily use.',
    },
  ],
  learnLinks: [
    { label: 'Best Nitric Oxide Supplements Guide', href: '/learn/best-nitric-oxide-supplements' },
    { label: 'Pre-Workout Without Jitters', href: '/learn/pre-workout-without-jitters' },
    { label: 'Take the Optimization Quiz', href: '/supplement-optimization-score' },
  ],
};

export default function FlowStateXPage() {
  return <ProductLandingTemplate config={config} />;
}
