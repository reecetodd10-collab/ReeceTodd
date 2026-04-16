'use client';

import ProductLandingTemplate from '../components/ProductLandingTemplate';

const config = {
  displayName: 'Creatine Monohydrate',
  productMatchers: ['creatine'],
  fallbackEmoji: '⚡',
  hero: {
    eyebrow: 'STRENGTH & POWER',
    titleLines: ['CREA', 'TINE', 'PURE'],
    titleAccentLine: 2,
    subtitle:
      'The most researched supplement on Earth. Pure micronized creatine monohydrate. Strength, size, and explosive power — backed by 500+ studies.',
    badge: 'NO FILLER',
  },
  price: { display: '$24.99', value: 24.99 },
  servingsText: '60 SERVINGS',
  colors: {
    primary: '#00e5ff',      // electric cyan
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
      title: '5G CLINICAL DOSE',
      desc:
        'Exactly the dose every study uses. Not 3g, not 4g — 5g per scoop. The amount that actually saturates your muscles.',
    },
    {
      num: '02',
      title: 'STRENGTH IN 14 DAYS',
      desc:
        'Saturate fast, no loading phase needed. Most users see 5–10% PR jumps within two weeks of consistent use.',
    },
    {
      num: '03',
      title: 'MICRONIZED, ZERO GRIT',
      desc:
        'Particle size 20x smaller than standard creatine. Mixes clean in water, no chalky aftertaste, no settling at the bottom.',
    },
    {
      num: '04',
      title: 'COGNITIVE BOOST',
      desc:
        'Newer research shows creatine improves mental fatigue, memory under stress, and reaction time. Fuel for the brain too.',
    },
  ],
  ingredients: [
    { name: 'Creatine Monohydrate (Micronized)', dose: '5,000 mg', desc: 'The only form with decades of clinical evidence' },
    { name: 'Particle Size', dose: '<200 µm', desc: 'Micronized for instant solubility and zero grit' },
    { name: 'Other Ingredients', dose: '—', desc: 'Nothing. Pure creatine. No flavoring, no fillers, no maltodextrin.' },
  ],
  reviews: [
    {
      name: 'TYLER A.',
      rating: 5,
      text:
        '"Bench went up 15 lbs in 3 weeks. Mixes way cleaner than the bulk stuff I used to buy. Worth every penny."',
      tag: 'VERIFIED BUYER',
    },
    {
      name: 'SARA L.',
      rating: 5,
      text:
        '"I was scared of creatine making me bloat — zero issues. Strength in the gym is up across every lift. Game changer."',
      tag: 'VERIFIED BUYER',
    },
    {
      name: 'RYAN H.',
      rating: 5,
      text:
        '"Took it for a powerlifting meet. Hit lifetime PRs on all three lifts. The difference is noticeable, not subtle."',
      tag: 'VERIFIED BUYER',
    },
  ],
  bottomCTA: {
    titleLines: ['MORE', 'REPS.', 'MORE WEIGHT.'],
    accentLineIdx: 2,
    body:
      'Creatine is non-negotiable. If you\'re lifting and not taking it, you\'re leaving 10% of your potential on the table.',
  },
  transparencyTagline: 'Pure micronized creatine monohydrate. Nothing added. Nothing hidden.',
  faqs: [
    {
      q: 'Is creatine worth taking every day?',
      a: 'Creatine is one of the most researched sports supplements and is widely used to support strength, power, and training performance. For most goal-driven lifters, a simple daily creatine routine is more evidence-aligned than chasing exotic performance ingredients.',
    },
    {
      q: 'Do I need to load creatine?',
      a: 'Loading is optional. A daily serving of 5g of creatine monohydrate will saturate muscles over 3-4 weeks without the need for a loading phase.',
    },
    {
      q: 'Does creatine cause bloating?',
      a: 'Some people experience minor water retention initially, but this typically subsides. Creatine monohydrate at standard doses is well-tolerated by most athletes.',
    },
    {
      q: 'When should I take creatine?',
      a: 'Timing is flexible. Take creatine at whatever time fits your routine — consistency matters more than timing. Post-workout with carbs or protein may slightly enhance uptake.',
    },
    {
      q: 'Can I mix creatine with other supplements?',
      a: 'Yes. Creatine stacks well with pre-workout, hydration, and recovery products. It is one of the most versatile supplements available and does not interfere with other formulas.',
    },
  ],
  learnLinks: [
    { label: 'Complete Creatine Guide', href: '/learn/creatine-guide' },
    { label: 'Muscle-Building Stack', href: '/learn/best-supplement-stack-for-muscle-building' },
    { label: 'Take the Optimization Quiz', href: '/supplement-optimization-score' },
  ],
};

export default function CreatinePage() {
  return <ProductLandingTemplate config={config} />;
}
