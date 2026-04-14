export const metadata = {
  title: 'Magnesium Glycinate for Sleep',
  description: 'Support sleep, recovery, and relaxation with Aviera magnesium glycinate. Shop a clean formula for active lifestyles.',
  alternates: { canonical: '/magnesium' },
  openGraph: {
    title: 'Magnesium Glycinate for Sleep',
    description: 'Support sleep, recovery, and relaxation with Aviera magnesium glycinate. Shop a clean formula for active lifestyles.',
    url: '/magnesium',
  },
  twitter: { card: 'summary_large_image' },
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
    "price": "23.15",
    "availability": "https://schema.org/InStock",
  },
};

export default function MagnesiumLayout({ children }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      {children}
    </>
  );
}
