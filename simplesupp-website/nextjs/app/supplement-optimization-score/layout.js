export const metadata = {
  title: 'Personalized Supplement Quiz',
  description: 'Answer a few questions to get a custom supplement stack based on your goals, training, recovery, and routine.',
  alternates: { canonical: '/supplement-optimization-score' },
  openGraph: {
    title: 'Personalized Supplement Quiz',
    description: 'Answer a few questions to get a custom supplement stack based on your goals, training, recovery, and routine.',
    url: '/supplement-optimization-score',
  },
  twitter: { card: 'summary_large_image' },
};

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Get Your Personalized Supplement Stack",
  "description": "Take the Aviera supplement quiz to receive a custom stack recommendation based on your goals and routine.",
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Start the quiz",
      "text": "Open the Aviera supplement optimization quiz and begin by selecting your primary training goal.",
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "Answer questions",
      "text": "Respond to questions about your training frequency, sleep quality, hydration habits, and recovery needs.",
    },
    {
      "@type": "HowToStep",
      "position": 3,
      "name": "Review your stack",
      "text": "View your personalized supplement score and recommended product stack based on your answers.",
    },
    {
      "@type": "HowToStep",
      "position": 4,
      "name": "Shop your routine",
      "text": "Add your recommended supplements to cart and start your personalized routine.",
    },
  ],
};

export default function SupplementOptimizationScoreLayout({ children }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      {children}
    </>
  );
}
