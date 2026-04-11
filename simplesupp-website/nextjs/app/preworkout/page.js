'use client';

import ProductLandingTemplate from '../components/ProductLandingTemplate';

const config = {
  displayName: 'Nitric Shock Pre-Workout (Fruit Punch)',
  productMatchers: ['nitric shock', 'fruit punch'],
  fallbackEmoji: '🔥',
  hero: {
    eyebrow: 'PRE-WORKOUT FORMULA',
    titleLines: ['NITRIC', 'SHOCK', 'FRUIT PUNCH'],
    titleAccentLine: 2,
    subtitle:
      'Full-send pre-workout. Pumps, energy, and tunnel-vision focus in one scoop. Fruit Punch flavor that actually tastes good — no chemical aftertaste.',
    badge: 'NEW FLAVOR',
  },
  price: { display: '$29.99', value: 29.99 },
  servingsText: '30 SCOOPS',
  colors: {
    primary: '#FF3B3B',      // hot red
    dark: '#5a0000',         // deep blood
    bg: '#fff7f7',           // pale rose
    accent: '#ff6b35',       // coral orange
    bodyText: '#5a2a2a',
    mutedText: '#8a6a6a',
    borderTint: '#f5d8d8',
  },
  benefits: [
    {
      num: '01',
      title: 'TUNNEL-VISION FOCUS',
      desc:
        'L-Tyrosine + Alpha-GPC stack. The kind of focus where the gym disappears and it\'s just you and the bar.',
    },
    {
      num: '02',
      title: 'INSANE PUMPS',
      desc:
        'Citrulline Malate at 6g + Beta-Alanine for the tingles. Skin-splitting blood flow within 20 minutes.',
    },
    {
      num: '03',
      title: 'CLEAN ENERGY, NO CRASH',
      desc:
        '200mg caffeine paired with L-Theanine. Smooth lift, sustained for 90 minutes, no jitters, no afternoon collapse.',
    },
    {
      num: '04',
      title: 'FLAVOR THAT ACTUALLY HITS',
      desc:
        'Fruit Punch made with real flavoring, not chemical sludge. You\'ll actually look forward to your pre-workout drink.',
    },
  ],
  ingredients: [
    { name: 'L-Citrulline Malate (2:1)', dose: '6,000 mg', desc: 'Clinical pump dose for nitric oxide and blood flow' },
    { name: 'Beta-Alanine', dose: '3,200 mg', desc: 'The tingles. Buffers muscle fatigue, more reps per set' },
    { name: 'Caffeine Anhydrous', dose: '200 mg', desc: 'Clean stim, fast onset, no crash with L-Theanine pairing' },
    { name: 'L-Tyrosine', dose: '1,500 mg', desc: 'Dopamine precursor for tunnel-vision focus' },
    { name: 'Alpha-GPC (50%)', dose: '300 mg', desc: 'Choline source for mind-muscle connection' },
  ],
  reviews: [
    {
      name: 'JAKE R.',
      rating: 5,
      text:
        '"Best pre-workout I\'ve ever taken. Fruit Punch actually tastes like fruit punch — not battery acid. Pumps are unreal."',
      tag: 'VERIFIED BUYER',
    },
    {
      name: 'ALYSSA M.',
      rating: 5,
      text:
        '"I take half a scoop and I\'m locked in. Full scoop and I\'m running through walls. No crash after either."',
      tag: 'VERIFIED BUYER',
    },
    {
      name: 'DEVON P.',
      rating: 5,
      text:
        '"Switched from C4 to this. Way better focus, way better taste, and the pumps last my entire session. Not going back."',
      tag: 'VERIFIED BUYER',
    },
  ],
  bottomCTA: {
    titleLines: ['DON\'T', 'TRAIN', 'FLAT.'],
    accentLineIdx: 2,
    body:
      'Walking into the gym without a pre-workout is like driving without gas. Show up loaded.',
  },
  transparencyTagline: 'Clinical doses. Real flavor. No proprietary blends, no hidden fillers.',
};

export default function PreWorkoutPage() {
  return <ProductLandingTemplate config={config} />;
}
