export const metadata = {
  title: 'Nitric Oxide Supplement for Pumps | Aviera',
  description: 'Shop Aviera Pump (Nitric Oxide), a stimulant-free nitric oxide supplement for pumps, blood flow, and performance support.',
  alternates: { canonical: '/nitric' },
  openGraph: {
    title: 'Nitric Oxide Supplement for Pumps | Aviera',
    description: 'Shop Aviera Pump (Nitric Oxide), a stimulant-free nitric oxide supplement for pumps, blood flow, and performance support.',
    url: '/nitric',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nitric Oxide Supplement for Pumps | Aviera',
    description: 'Shop Aviera Pump (Nitric Oxide), a stimulant-free nitric oxide supplement for pumps, blood flow, and performance support.',
  },
};

const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Aviera Pump (Nitric Oxide)",
  "alternateName": "Flow State X",
  "brand": { "@type": "Brand", "name": "Aviera Fit" },
  "category": "Nitric Oxide Supplement",
  "description": "Shop Aviera Pump (Nitric Oxide), a stimulant-free nitric oxide supplement for pumps, blood flow, and performance support.",
  "image": ["https://www.avierafit.com/icon.png"],
  "sku": "AVIERA-FSX",
  "offers": {
    "@type": "Offer",
    "url": "https://www.avierafit.com/nitric",
    "priceCurrency": "USD",
    "price": "19.99",
    "availability": "https://schema.org/InStock",
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "47",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What does a nitric oxide supplement do?",
      "acceptedAnswer": { "@type": "Answer", "text": "A nitric oxide supplement supports vasodilation, which increases blood flow to muscles during training. This can improve pumps, nutrient delivery, and endurance." },
    },
    {
      "@type": "Question",
      "name": "Is Pump (Nitric Oxide) stimulant-free?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes. Pump (Nitric Oxide) contains no caffeine or stimulants. It is designed for pumps and blood flow without affecting sleep or causing jitters." },
    },
    {
      "@type": "Question",
      "name": "When should I take a nitric oxide supplement?",
      "acceptedAnswer": { "@type": "Answer", "text": "Take it 20 to 30 minutes before training for best results. It can also be stacked with a pre-workout for enhanced performance." },
    },
    {
      "@type": "Question",
      "name": "Can I stack Pump (Nitric Oxide) with pre-workout?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes. Because it is stimulant-free, Pump (Nitric Oxide) pairs well with a caffeinated pre-workout for combined energy and pump support." },
    },
    {
      "@type": "Question",
      "name": "How long does it take to feel the effects?",
      "acceptedAnswer": { "@type": "Answer", "text": "Most users notice improved pumps and blood flow within 20 to 40 minutes of taking it before a workout." },
    },
  ],
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.avierafit.com/" },
    { "@type": "ListItem", "position": 2, "name": "Shop", "item": "https://www.avierafit.com/shop" },
    { "@type": "ListItem", "position": 3, "name": "Pump (Nitric Oxide)", "item": "https://www.avierafit.com/nitric" },
  ],
};

export default function NitricLayout({ children }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  );
}
