export const metadata = {
  title: 'Magnesium Glycinate for Sleep | Aviera',
  description: 'Support sleep, recovery, and relaxation with Aviera magnesium glycinate. Shop a clean formula for active lifestyles.',
  alternates: { canonical: '/magnesium' },
  openGraph: {
    title: 'Magnesium Glycinate for Sleep | Aviera',
    description: 'Support sleep, recovery, and relaxation with Aviera magnesium glycinate. Shop a clean formula for active lifestyles.',
    url: '/magnesium',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Magnesium Glycinate for Sleep | Aviera',
    description: 'Support sleep, recovery, and relaxation with Aviera magnesium glycinate. Shop a clean formula for active lifestyles.',
  },
};

const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Aviera Magnesium Glycinate",
  "brand": { "@type": "Brand", "name": "Aviera Fit" },
  "category": "Sleep Supplement",
  "description": "Support sleep, recovery, and relaxation with Aviera magnesium glycinate. Shop a clean formula for active lifestyles.",
  "image": ["https://www.avierafit.com/icon.png"],
  "offers": {
    "@type": "Offer",
    "url": "https://www.avierafit.com/magnesium",
    "priceCurrency": "USD",
    "price": "19.99",
    "availability": "https://schema.org/InStock",
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "42",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Why magnesium glycinate for sleep?",
      "acceptedAnswer": { "@type": "Answer", "text": "Magnesium glycinate is often favored for sleep-focused routines because it is commonly positioned as a gentler form associated with relaxation-oriented use." },
    },
    {
      "@type": "Question",
      "name": "Who should take magnesium glycinate?",
      "acceptedAnswer": { "@type": "Answer", "text": "It is best suited for athletes, lifters, and active adults whose training quality suffers when sleep quality declines." },
    },
    {
      "@type": "Question",
      "name": "When should I take magnesium?",
      "acceptedAnswer": { "@type": "Answer", "text": "Take magnesium glycinate in the evening, typically 30-60 minutes before bed for best results with sleep support." },
    },
    {
      "@type": "Question",
      "name": "Can I take magnesium with other supplements?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes. Magnesium pairs well with sleep support formulas and fits into most supplement stacks without interaction concerns." },
    },
    {
      "@type": "Question",
      "name": "How much magnesium do I need daily?",
      "acceptedAnswer": { "@type": "Answer", "text": "Aviera Magnesium Glycinate provides 275mg of elemental magnesium per serving, which supports the recommended daily intake for active adults." },
    },
  ],
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.avierafit.com/" },
    { "@type": "ListItem", "position": 2, "name": "Shop", "item": "https://www.avierafit.com/shop" },
    { "@type": "ListItem", "position": 3, "name": "Magnesium Glycinate", "item": "https://www.avierafit.com/magnesium" },
  ],
};

export default function MagnesiumLayout({ children }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  );
}
