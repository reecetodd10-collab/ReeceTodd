import { Montserrat, Oswald, Space_Mono } from "next/font/google";
import "./globals.css";
import MarketingLayout from "./components/MarketingLayout";
import ErrorBoundary from "./components/ErrorBoundary";
import { SupabaseAuthProvider } from "./components/SupabaseAuthProvider";

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
  title: "Aviera | Stop Guessing. Start Progressing.",
  description: "Stop Guessing. Start Progressing. Aviera is your AI-powered supplement and fitness advisor — get personalized supplement stacks and workout plans based on your goals. Science-backed, personalized, results-driven.",
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Aviera',
  },
  icons: {
    apple: '/Aviera_Filled_Center.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${montserrat.className} ${oswald.variable} ${spaceMono.variable}`}>
      <body className="text-[var(--txt)] antialiased">
        <SupabaseAuthProvider>
          <ErrorBoundary>
            <MarketingLayout>{children}</MarketingLayout>
          </ErrorBoundary>
        </SupabaseAuthProvider>
      </body>
    </html>
  );
}
