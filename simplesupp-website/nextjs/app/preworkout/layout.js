export const metadata = {
  title: 'Clean Pre-Workout Without Jitters | Aviera',
  description: 'Train with focus and performance support using Aviera pre-workout. Shop a cleaner formula built for serious sessions.',
  alternates: { canonical: '/preworkout' },
  openGraph: {
    title: 'Clean Pre-Workout Without Jitters | Aviera',
    description: 'Train with focus and performance support using Aviera pre-workout. Shop a cleaner formula built for serious sessions.',
    url: '/preworkout',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Clean Pre-Workout Without Jitters | Aviera',
    description: 'Train with focus and performance support using Aviera pre-workout. Shop a cleaner formula built for serious sessions.',
  },
};

const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Aviera Pre-Workout (Fruit Punch)",
  "brand": { "@type": "Brand", "name": "Aviera Fit" },
  "category": "Pre-Workout Supplement",
  "description": "Train with focus and performance support using Aviera pre-workout. Shop a cleaner formula built for serious sessions.",
  "image": ["https://www.avierafit.com/icon.png"],
  "offers": {
    "@type": "Offer",
    "url": "https://www.avierafit.com/preworkout",
    "priceCurrency": "USD",
    "price": "22.99",
    "availability": "https://schema.org/InStock",
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.7",
    "reviewCount": "35",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What makes a clean pre-workout?",
      "acceptedAnswer": { "@type": "Answer", "text": "A clean pre-workout usually refers to a formula that supports energy and focus without feeling overloaded, overly sweet, or crash-prone. Aviera Pre-Workout is built for athletes who want performance support without the heavy-jitter experience." },
    },
    {
      "@type": "Question",
      "name": "Will this pre-workout make me jittery?",
      "acceptedAnswer": { "@type": "Answer", "text": "Aviera Pre-Workout is designed to provide energy and focus without the crash or overstimulated feeling common with high-stimulant pre-workouts." },
    },
    {
      "@type": "Question",
      "name": "When should I take pre-workout?",
      "acceptedAnswer": { "@type": "Answer", "text": "Take it 20-30 minutes before training for best results. Start with one scoop to assess tolerance." },
    },
    {
      "@type": "Question",
      "name": "Can I stack pre-workout with Pump (Nitric Oxide)?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes. Pump (Nitric Oxide) provides stimulant-free pump support that complements the energy and focus from Aviera Pre-Workout." },
    },
    {
      "@type": "Question",
      "name": "Is this pre-workout good for cardio?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes. The energy and endurance support makes it suitable for both strength training and high-intensity cardio sessions." },
    },
  ],
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.avierafit.com/" },
    { "@type": "ListItem", "position": 2, "name": "Shop", "item": "https://www.avierafit.com/shop" },
    { "@type": "ListItem", "position": 3, "name": "Pre-Workout", "item": "https://www.avierafit.com/preworkout" },
  ],
};

export default function PreworkoutLayout({ children }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  );
}
