export const metadata = {
  title: 'Creatine for Strength and Recovery | Aviera',
  description: 'Improve strength, power, and training output with Aviera creatine. Shop a simple daily formula for athletes.',
  alternates: { canonical: '/creatine' },
  openGraph: {
    title: 'Creatine for Strength and Recovery | Aviera',
    description: 'Improve strength, power, and training output with Aviera creatine. Shop a simple daily formula for athletes.',
    url: '/creatine',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Creatine for Strength and Recovery | Aviera',
    description: 'Improve strength, power, and training output with Aviera creatine. Shop a simple daily formula for athletes.',
  },
};

const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Aviera Creatine Monohydrate",
  "brand": { "@type": "Brand", "name": "Aviera Fit" },
  "category": "Creatine Supplement",
  "description": "Improve strength, power, and training output with Aviera creatine. Shop a simple daily formula for athletes.",
  "image": ["https://www.avierafit.com/icon.png"],
  "offers": {
    "@type": "Offer",
    "url": "https://www.avierafit.com/creatine",
    "priceCurrency": "USD",
    "price": "19.99",
    "availability": "https://schema.org/InStock",
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "56",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is creatine worth taking every day?",
      "acceptedAnswer": { "@type": "Answer", "text": "Creatine is one of the most researched sports supplements and is widely used to support strength, power, and training performance. For most goal-driven lifters, a simple daily creatine routine is more evidence-aligned than chasing exotic performance ingredients." },
    },
    {
      "@type": "Question",
      "name": "Do I need to load creatine?",
      "acceptedAnswer": { "@type": "Answer", "text": "Loading is optional. A daily serving of 5g of creatine monohydrate will saturate muscles over 3-4 weeks without the need for a loading phase." },
    },
    {
      "@type": "Question",
      "name": "Does creatine cause bloating?",
      "acceptedAnswer": { "@type": "Answer", "text": "Some people experience minor water retention initially, but this typically subsides. Creatine monohydrate at standard doses is well-tolerated by most athletes." },
    },
    {
      "@type": "Question",
      "name": "When should I take creatine?",
      "acceptedAnswer": { "@type": "Answer", "text": "Timing is flexible. Take creatine at whatever time fits your routine — consistency matters more than timing." },
    },
    {
      "@type": "Question",
      "name": "Can I mix creatine with other supplements?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes. Creatine stacks well with pre-workout, hydration, and recovery products. It is one of the most versatile supplements available." },
    },
  ],
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.avierafit.com/" },
    { "@type": "ListItem", "position": 2, "name": "Shop", "item": "https://www.avierafit.com/shop" },
    { "@type": "ListItem", "position": 3, "name": "Creatine Monohydrate", "item": "https://www.avierafit.com/creatine" },
  ],
};

export default function CreatineLayout({ children }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  );
}
