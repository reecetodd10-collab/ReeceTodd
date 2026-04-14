export const metadata = {
  title: 'Creatine for Strength and Recovery',
  description: 'Improve strength, power, and training output with Aviera creatine. Shop a simple daily formula for athletes.',
  alternates: { canonical: '/creatine' },
  openGraph: {
    title: 'Creatine for Strength and Recovery',
    description: 'Improve strength, power, and training output with Aviera creatine. Shop a simple daily formula for athletes.',
    url: '/creatine',
  },
  twitter: { card: 'summary_large_image' },
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
    "price": "24.99",
    "availability": "https://schema.org/InStock",
  },
};

export default function CreatineLayout({ children }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      {children}
    </>
  );
}
