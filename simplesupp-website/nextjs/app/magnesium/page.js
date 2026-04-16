'use client';

import ProductLandingTemplate from '../components/ProductLandingTemplate';

const config = {
  displayName: 'Magnesium Glycinate',
  productMatchers: ['magnesium'],
  fallbackEmoji: '🌙',
  hero: {
    eyebrow: 'SLEEP & RECOVERY',
    titleLines: ['MAG', 'NESI', 'UM'],
    titleAccentLine: 2,
    subtitle:
      'The most absorbable form of magnesium. Deeper sleep, fewer cramps, calmer nervous system. The mineral 75% of people are deficient in.',
    badge: 'BESTSELLER',
  },
  price: { display: '$23.15', value: 23.15 },
  servingsText: '60 CAPSULES',
  colors: {
    primary: '#a855f7',      // purple
    dark: '#3a0a5e',         // deep plum
    bg: '#faf7ff',           // soft lavender
    accent: '#c084fc',       // light purple
    bodyText: '#4f3a6a',
    mutedText: '#8a7a9a',
    borderTint: '#ece0f5',
  },
  benefits: [
    {
      num: '01',
      title: 'DEEPER, LONGER SLEEP',
      desc:
        'Glycinate form crosses the blood-brain barrier to calm the nervous system. Fall asleep faster, stay asleep through the night.',
    },
    {
      num: '02',
      title: 'CRAMP & SORENESS RELIEF',
      desc:
        'Hard training depletes muscle magnesium. This restores it — fewer charley horses, faster post-workout recovery.',
    },
    {
      num: '03',
      title: 'STRESS & CORTISOL CONTROL',
      desc:
        'Modulates the HPA axis. Lower baseline stress, calmer mood, better stress response under pressure.',
    },
    {
      num: '04',
      title: 'ZERO LAXATIVE EFFECT',
      desc:
        'Unlike cheap magnesium oxide or citrate, glycinate is gentle on the gut. No bathroom emergencies — just absorption.',
    },
  ],
  ingredients: [
    { name: 'Magnesium (as Glycinate)', dose: '400 mg', desc: 'Highest-bioavailability form for sleep & muscle recovery' },
    { name: 'Glycine (from chelate)', dose: '2,000 mg', desc: 'Calming amino acid that potentiates sleep onset' },
    { name: 'Vitamin B6 (P-5-P)', dose: '5 mg', desc: 'Cofactor that boosts magnesium uptake' },
    { name: 'Zinc (as Bisglycinate)', dose: '5 mg', desc: 'Synergist for sleep architecture and immunity' },
    { name: 'Vegetable Capsule', dose: '—', desc: 'Cellulose. No gelatin, no fillers, no garbage.' },
  ],
  reviews: [
    {
      name: 'JOSH B.',
      rating: 5,
      text:
        '"Sleep score on my Whoop went from 72 to 91 in two weeks. No grogginess in the morning. This is a cheat code."',
      tag: 'VERIFIED BUYER',
    },
    {
      name: 'NATALIE K.',
      rating: 5,
      text:
        '"I used to wake up with calf cramps after leg day. Took this for a week — completely gone. Wish I had it years ago."',
      tag: 'VERIFIED BUYER',
    },
    {
      name: 'MARCO D.',
      rating: 5,
      text:
        '"Tried five different magnesium brands before this. Only one that doesn\'t wreck my stomach. Already ordered three bottles."',
      tag: 'VERIFIED BUYER',
    },
  ],
  bottomCTA: {
    titleLines: ['SLEEP', 'LIKE A', 'CHAMPION.'],
    accentLineIdx: 2,
    body:
      'Recovery happens at night. If your sleep is broken, your gains are too. Fix the foundation.',
  },
  transparencyTagline: 'Glycinate chelate. Full label. No magnesium oxide tricks.',
  faqs: [
    {
      q: 'Why magnesium glycinate for sleep?',
      a: 'Magnesium glycinate is often favored for sleep-focused routines because it combines high bioavailability, excellent GI tolerance, and the added sleep benefits of the glycine chelate itself — glycine independently supports sleep onset and overnight recovery.',
    },
    {
      q: 'Who should take magnesium glycinate?',
      a: 'It is best suited for athletes, lifters, and active adults whose training quality suffers when sleep quality declines. Heavy sweaters and people with high training volume tend to lose more magnesium and benefit most.',
    },
    {
      q: 'When should I take magnesium?',
      a: 'Take magnesium glycinate in the evening, typically 30-60 minutes before bed. Consistency matters more than exact timing — effects build over 1-2 weeks of daily use.',
    },
    {
      q: 'Can I take magnesium with other supplements?',
      a: 'Yes. Magnesium pairs well with sleep support formulas, creatine, and hydration products, and fits into most supplement stacks without interaction concerns.',
    },
    {
      q: 'How much magnesium do I need daily?',
      a: 'Aviera Magnesium Glycinate provides 275mg of elemental magnesium per serving, which supports the recommended daily intake for active adults. Most people do well between 200-400mg of elemental magnesium.',
    },
  ],
  learnLinks: [
    { label: 'Best Magnesium for Sleep', href: '/learn/best-magnesium-for-sleep' },
    { label: 'Muscle-Building Stack', href: '/learn/best-supplement-stack-for-muscle-building' },
    { label: 'Take the Optimization Quiz', href: '/supplement-optimization-score' },
  ],
};

export default function MagnesiumPage() {
  return <ProductLandingTemplate config={config} />;
}
