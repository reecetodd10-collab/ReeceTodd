export const metadata = {
  title: 'Electrolyte Powder for Athletes | Aviera',
  description: 'Rehydrate faster with Aviera electrolyte powder for training, sweat loss, endurance, and daily performance.',
  alternates: { canonical: '/hydration' },
  openGraph: {
    title: 'Electrolyte Powder for Athletes | Aviera',
    description: 'Rehydrate faster with Aviera electrolyte powder for training, sweat loss, endurance, and daily performance.',
    url: '/hydration',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Electrolyte Powder for Athletes | Aviera',
    description: 'Rehydrate faster with Aviera electrolyte powder for training, sweat loss, endurance, and daily performance.',
  },
};

const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Aviera Electrolytes Lemonade",
  "brand": { "@type": "Brand", "name": "Aviera Fit" },
  "category": "Electrolyte Powder",
  "description": "Rehydrate faster with Aviera electrolyte powder for training, sweat loss, endurance, and daily performance.",
  "image": ["https://www.avierafit.com/icon.png"],
  "offers": {
    "@type": "Offer",
    "url": "https://www.avierafit.com/hydration",
    "priceCurrency": "USD",
    "price": "19.99",
    "availability": "https://schema.org/InStock",
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "38",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Why do athletes need electrolyte powder?",
      "acceptedAnswer": { "@type": "Answer", "text": "Athletes who sweat heavily or train in heat often benefit from replacing fluids and electrolytes lost during training. An electrolyte powder is especially useful for long sessions, hot environments, or two-a-day training schedules." },
    },
    {
      "@type": "Question",
      "name": "When should I use Aviera Hydration?",
      "acceptedAnswer": { "@type": "Answer", "text": "Use it during or after training, especially on high-sweat days. It also works well as daily hydration support for active lifestyles." },
    },
    {
      "@type": "Question",
      "name": "What electrolytes are in Aviera Hydration?",
      "acceptedAnswer": { "@type": "Answer", "text": "Aviera Hydration includes sodium, potassium, magnesium, and calcium along with B-vitamins to support energy metabolism and recovery." },
    },
    {
      "@type": "Question",
      "name": "Is electrolyte powder better than sports drinks?",
      "acceptedAnswer": { "@type": "Answer", "text": "Electrolyte powders typically offer more targeted electrolyte replenishment with less sugar than traditional sports drinks, making them a cleaner option for athletes." },
    },
    {
      "@type": "Question",
      "name": "Can I stack Hydration with other Aviera products?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes. Hydration pairs well with creatine, pre-workout, and recovery products as part of a training-day stack." },
    },
  ],
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.avierafit.com/" },
    { "@type": "ListItem", "position": 2, "name": "Shop", "item": "https://www.avierafit.com/shop" },
    { "@type": "ListItem", "position": 3, "name": "Electrolytes Lemonade", "item": "https://www.avierafit.com/hydration" },
  ],
};

export default function HydrationLayout({ children }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  );
}
