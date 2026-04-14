import { Montserrat, Oswald, Space_Mono } from "next/font/google";
import "./globals.css";
import MarketingLayout from "./components/MarketingLayout";
import ErrorBoundary from "./components/ErrorBoundary";
import { SupabaseAuthProvider } from "./components/SupabaseAuthProvider";
import TikTokPixel from "./components/TikTokPixel";
import MetaPixel from "./components/MetaPixel";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400"],
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-oswald",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-space-mono",
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#09090b',
};

export const metadata = {
  metadataBase: new URL('https://www.avierafit.com'),
  title: {
    default: 'Personalized Supplements for Athletes | Aviera',
    template: '%s | Aviera',
  },
  description: 'Get personalized supplement stacks for performance, recovery, sleep, and hydration. Take the Aviera quiz and shop goal-based formulas.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Aviera',
  },
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: 'https://www.avierafit.com/',
    siteName: 'Aviera Fit',
    title: 'Personalized Supplements for Athletes | Aviera',
    description: 'Get personalized supplement stacks for performance, recovery, sleep, and hydration with Aviera.',
    images: [{ url: '/icon.png', width: 512, height: 512, alt: 'Aviera Fit personalized performance supplements' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Personalized Supplements for Athletes | Aviera',
    description: 'Get personalized supplement stacks for performance, recovery, sleep, and hydration with Aviera.',
    images: ['/icon.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${montserrat.className} ${oswald.variable} ${spaceMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Aviera Fit",
              "url": "https://www.avierafit.com/",
              "logo": "https://www.avierafit.com/icon.png",
              "description": "Aviera Fit is a San Diego-based supplement brand focused on personalized performance nutrition for athletes and active adults.",
              "address": { "@type": "PostalAddress", "streetAddress": "4437 Lister St", "addressLocality": "San Diego", "addressRegion": "CA", "postalCode": "92110", "addressCountry": "US" },
              "contactPoint": { "@type": "ContactPoint", "email": "info@avierafit.com", "contactType": "customer service" },
              "sameAs": ["https://instagram.com/avierafit", "https://tiktok.com/@avierafit"]
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Aviera Fit",
              "url": "https://www.avierafit.com/",
              "potentialAction": { "@type": "SearchAction", "target": "https://www.avierafit.com/shop?q={search_term_string}", "query-input": "required name=search_term_string" }
            }),
          }}
        />
      </head>
      <body className="text-[var(--txt)] antialiased">
        <TikTokPixel />
        <MetaPixel />
        <SupabaseAuthProvider>
          <ErrorBoundary>
            <MarketingLayout>{children}</MarketingLayout>
          </ErrorBoundary>
        </SupabaseAuthProvider>
      </body>
    </html>
  );
}
