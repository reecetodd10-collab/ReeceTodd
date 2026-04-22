'use client';

import ProductLandingTemplate from '../components/ProductLandingTemplate';

const config = {
  displayName: 'Creatine + Electrolyte',
  productMatchers: ['creatine', 'electrolyte'],
  fallbackEmoji: '💧',
  hero: {
    eyebrow: 'STRENGTH + HYDRATION',
    titleLines: ['CREATINE', '+', 'ELECTROLYTE'],
    titleAccentLine: 1,
    subtitle:
      '5g clinical-dose creatine monohydrate fused with a full electrolyte profile. Strength, hydration, and recovery in one scoop — no stacking required.',
    badge: 'NEW DROP',
  },
  price: { display: '$22.99', value: 22.99 },
  servingsText: '30 SCOOPS',
  colors: {
    primary: '#00e5ff',      // electric cyan (performance)
    dark: '#003a4a',         // deep teal
    bg: '#f4fdff',           // pale cyan tint
    accent: '#FFD700',       // gold (hydration)
    bodyText: '#2a4a55',
    mutedText: '#6a8a95',
    borderTint: '#d4eef2',
  },
  benefits: [
    {
      num: '01',
      title: '5G CREATINE + FULL ELECTROLYTES',
      desc:
        'Clinical-dose creatine monohydrate paired with 1,000mg sodium, 200mg potassium, and 60mg magnesium. Two supplements in one scoop.',
    },
    {
      num: '02',
      title: 'TRAIN HARDER, RECOVER FASTER',
      desc:
        'Creatine regenerates ATP for explosive reps. Electrolytes prevent cramping and maintain output. Together they eliminate two bottlenecks at once.',
    },
    {
      num: '03',
      title: 'NO BLOAT, ZERO STIMS',
      desc:
        'Caffeine-free, sugar-free, no artificial colors. Stevia-sweetened with clean flavoring. Take it any time of day without affecting sleep.',
    },
    {
      num: '04',
      title: 'ONE SCOOP SIMPLICITY',
      desc:
        'Stop juggling a creatine tub and a hydration powder. One product, one scoop, two performance systems covered.',
    },
  ],
  ingredients: [
    { name: 'Creatine (as Creatine Monohydrate)', dose: '5,000 mg', desc: 'The gold standard for strength, power, and muscle support' },
    { name: 'Sodium (as Sea Salt)', dose: '1,000 mg', desc: 'Primary electrolyte lost in sweat — critical for fluid balance' },
    { name: 'Potassium (as Potassium Chloride)', dose: '200 mg', desc: 'Supports muscle contraction and nerve signaling' },
    { name: 'Magnesium (as Magnesium Malate)', dose: '60 mg', desc: 'Bioavailable form supporting 300+ enzymatic reactions' },
    { name: 'Other Ingredients', dose: '—', desc: 'Natural Flavors, Stevia Extract (Leaf), Silicon Dioxide' },
  ],
  reviews: [
    {
      name: 'JAKE M.',
      rating: 5,
      text:
        '"Finally don\'t have to carry two tubs to the gym. Mixes clean, no grit, and I can feel the difference in my sets. Cramps are gone too."',
      tag: 'VERIFIED BUYER',
    },
    {
      name: 'MARIA T.',
      rating: 5,
      text:
        '"I sweat a ton during training and was always juggling creatine + electrolytes separately. This is exactly what I needed. One scoop and done."',
      tag: 'VERIFIED BUYER',
    },
    {
      name: 'CHRIS B.',
      rating: 5,
      text:
        '"Tastes way better than I expected for something with 1g of sodium. Strength is up, no more mid-session fade. Smart product."',
      tag: 'VERIFIED BUYER',
    },
  ],
  bottomCTA: {
    titleLines: ['STRENGTH', 'MEETS', 'HYDRATION.'],
    accentLineIdx: 2,
    body:
      'Two performance systems. One scoop. Stop stacking separately — this is how it should have been built from the start.',
  },
  transparencyTagline: 'Full transparent label. Clinical doses. No proprietary blends.',
  faqs: [
    {
      q: 'Why combine creatine and electrolytes?',
      a: 'Creatine pulls water into muscle cells, increasing intracellular hydration demand. Electrolytes support the extracellular side — fluid balance, nerve signaling, and muscle contraction. Combining both in one scoop ensures you are supporting hydration from both angles during training.',
    },
    {
      q: 'How much creatine is in each serving?',
      a: 'Each scoop delivers 5,000 mg (5g) of creatine monohydrate — the exact clinical dose used in research. No loading phase required. Take it daily for saturation within 3-4 weeks.',
    },
    {
      q: 'When should I take Creatine + Electrolyte?',
      a: 'Mix one scoop with 6-8 oz of water before, during, or after training. Consistency matters more than timing. On rest days, take it with any meal.',
    },
    {
      q: 'Can I stack this with a pre-workout?',
      a: 'Yes. Since this formula is stimulant-free, it pairs well with any pre-workout or pump formula. Check if your pre-workout already contains creatine to avoid doubling up.',
    },
    {
      q: 'Is this just creatine mixed with salt?',
      a: 'No. It contains a full electrolyte profile — 1,000mg sodium, 200mg potassium, and 60mg magnesium as bioavailable Magnesium Malate — alongside 5g creatine monohydrate. The ratios are formulated for athletes who sweat heavily during training.',
    },
  ],
  learnLinks: [
    { label: 'Complete Creatine Guide', href: '/learn/creatine-guide' },
    { label: 'Electrolytes for Athletes', href: '/learn/electrolytes-for-athletes' },
    { label: 'Take the Optimization Quiz', href: '/supplement-optimization-score' },
  ],
};

export default function CreatineElectrolytePage() {
  return <ProductLandingTemplate config={config} />;
}
