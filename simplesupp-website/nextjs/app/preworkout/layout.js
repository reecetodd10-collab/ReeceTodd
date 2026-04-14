export const metadata = {
  title: 'Clean Pre-Workout Without Jitters',
  description: 'Train with focus and performance support using Aviera pre-workout. Shop a cleaner formula built for serious sessions.',
  alternates: { canonical: '/preworkout' },
  openGraph: {
    title: 'Clean Pre-Workout Without Jitters',
    description: 'Train with focus and performance support using Aviera pre-workout. Shop a cleaner formula built for serious sessions.',
    url: '/preworkout',
  },
  twitter: { card: 'summary_large_image' },
};

const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Aviera Nitric Shock Pre-Workout",
  "brand": { "@type": "Brand", "name": "Aviera Fit" },
  "category": "Pre-Workout Supplement",
  "description": "Train with focus and performance support using Aviera pre-workout. Shop a cleaner formula built for serious sessions.",
  "image": ["https://www.avierafit.com/icon.png"],
  "offers": {
    "@type": "Offer",
    "url": "https://www.avierafit.com/preworkout",
    "priceCurrency": "USD",
    "price": "29.99",
    "availability": "https://schema.org/InStock",
  },
};

export default function PreworkoutLayout({ children }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      {children}
    </>
  );
}
