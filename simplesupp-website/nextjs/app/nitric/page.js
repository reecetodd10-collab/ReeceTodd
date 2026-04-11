'use client';

import ProductLandingTemplate from '../components/ProductLandingTemplate';

const config = {
  displayName: 'Flow State X',
  productMatchers: ['flow state'],
  fallbackEmoji: '💊',
  hero: {
    eyebrow: 'NITRIC OXIDE FORMULA',
    titleLines: ['FLOW', 'STATE', 'X'],
    titleAccentLine: 2,
    subtitle:
      'Engineered for athletes who refuse to plateau. Premium nitric oxide for blood flow, pumps, and sustained performance.',
    badge: '50% OFF',
  },
  price: { display: '$19.99', value: 19.99 },
  servingsText: '30 SERVINGS',
  colors: {
    primary: '#00e6b0',     // Aviera green-cyan
    dark: '#0a4a3a',        // deep forest
    bg: '#fffef5',          // pale cream
    accent: '#ff6b4a',      // coral urgency
    bodyText: '#5a5a5a',
    mutedText: '#8a8a8a',
    borderTint: '#e0ebe5',
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
};

export default function FlowStateXPage() {
  return <ProductLandingTemplate config={config} />;
}
