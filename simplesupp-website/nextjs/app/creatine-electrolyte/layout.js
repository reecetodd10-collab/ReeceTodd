export const metadata = {
  title: 'Creatine + Electrolyte Powder | Aviera',
  description: 'Strength meets hydration. 5g creatine monohydrate plus a full electrolyte profile in one scoop for performance and recovery.',
  alternates: { canonical: '/creatine-electrolyte' },
  openGraph: {
    title: 'Creatine + Electrolyte Powder | Aviera',
    description: 'Strength meets hydration. 5g creatine monohydrate plus a full electrolyte profile in one scoop for performance and recovery.',
    url: '/creatine-electrolyte',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Creatine + Electrolyte Powder | Aviera',
    description: 'Strength meets hydration. 5g creatine monohydrate plus a full electrolyte profile in one scoop for performance and recovery.',
  },
};

const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Aviera Creatine + Electrolyte Powder",
  "brand": { "@type": "Brand", "name": "Aviera Fit" },
  "category": "Performance Supplement",
  "description": "Strength meets hydration. 5g creatine monohydrate plus a full electrolyte profile in one scoop for performance and recovery.",
  "image": ["https://www.avierafit.com/icon.png"],
  "offers": {
    "@type": "Offer",
    "url": "https://www.avierafit.com/creatine-electrolyte",
    "priceCurrency": "USD",
    "price": "22.99",
    "availability": "https://schema.org/InStock",
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "28",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Why combine creatine and electrolytes?",
      "acceptedAnswer": { "@type": "Answer", "text": "Creatine pulls water into muscle cells, increasing intracellular hydration demand. Electrolytes support the extracellular side — fluid balance, nerve signaling, and muscle contraction. Combining both in one scoop ensures you are supporting hydration from both angles during training." },
    },
    {
      "@type": "Question",
      "name": "How much creatine is in each serving?",
      "acceptedAnswer": { "@type": "Answer", "text": "Each scoop delivers 5,000 mg (5g) of creatine monohydrate — the exact clinical dose used in research. No loading phase required." },
    },
    {
      "@type": "Question",
      "name": "When should I take Creatine + Electrolyte?",
      "acceptedAnswer": { "@type": "Answer", "text": "Mix one scoop with 6-8 oz of water before, during, or after training. Consistency matters more than timing — take it daily." },
    },
    {
      "@type": "Question",
      "name": "Can I stack this with a pre-workout?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes. Since this formula is stimulant-free, it pairs well with any pre-workout. Check if your pre-workout already contains creatine to avoid doubling up." },
    },
    {
      "@type": "Question",
      "name": "Is this just creatine mixed with salt?",
      "acceptedAnswer": { "@type": "Answer", "text": "No. It contains a full electrolyte profile — 1,000mg sodium, 200mg potassium, and 60mg magnesium — alongside 5g creatine monohydrate. The electrolyte ratios are formulated for athletes who sweat heavily during training." },
    },
  ],
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.avierafit.com/" },
    { "@type": "ListItem", "position": 2, "name": "Shop", "item": "https://www.avierafit.com/shop" },
    { "@type": "ListItem", "position": 3, "name": "Creatine + Electrolyte", "item": "https://www.avierafit.com/creatine-electrolyte" },
  ],
};

export default function CreatineElectrolyteLayout({ children }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  );
}
