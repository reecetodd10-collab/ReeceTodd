export const metadata = {
  title: 'Electrolyte Powder for Athletes',
  description: 'Rehydrate faster with Aviera electrolyte powder for training, sweat loss, endurance, and daily performance.',
  alternates: { canonical: '/hydration' },
  openGraph: {
    title: 'Electrolyte Powder for Athletes',
    description: 'Rehydrate faster with Aviera electrolyte powder for training, sweat loss, endurance, and daily performance.',
    url: '/hydration',
  },
  twitter: { card: 'summary_large_image' },
};

const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Aviera Hydration Powder Lemonade",
  "brand": { "@type": "Brand", "name": "Aviera Fit" },
  "category": "Electrolyte Powder",
  "description": "Rehydrate faster with Aviera electrolyte powder for training, sweat loss, endurance, and daily performance.",
  "image": ["https://www.avierafit.com/icon.png"],
  "offers": {
    "@type": "Offer",
    "url": "https://www.avierafit.com/hydration",
    "priceCurrency": "USD",
    "price": "24.99",
    "availability": "https://schema.org/InStock",
  },
};

export default function HydrationLayout({ children }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      {children}
    </>
  );
}
