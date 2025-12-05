import { Montserrat } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import MarketingLayout from "./components/MarketingLayout";
import ErrorBoundary from "./components/ErrorBoundary";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400"],
  display: "swap",
});

export const metadata = {
  title: "Aviera | Stop Guessing. Start Progressing.",
  description: "Stop Guessing. Start Progressing. Aviera is your AI-powered supplement and fitness advisor — get personalized supplement stacks and workout plans based on your goals. Science-backed, personalized, results-driven.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className={montserrat.className}>
        <body className="bg-[var(--bg)] text-[var(--txt)] antialiased">
          <ErrorBoundary>
            <MarketingLayout>{children}</MarketingLayout>
          </ErrorBoundary>
        </body>
      </html>
    </ClerkProvider>
  );
}
