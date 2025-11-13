import { Inter } from "next/font/google";
import "./globals.css";
import MarketingLayout from "./components/MarketingLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Aviera | Your AI-Powered Supplement & Fitness Advisor",
  description: "Aviera is your AI-powered supplement and fitness advisor — get personalized supplement stacks and workout plans based on your goals. Science-backed, personalized, results-driven.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[var(--bg)] text-[var(--txt)] font-sans antialiased">
        <MarketingLayout>{children}</MarketingLayout>
      </body>
    </html>
  );
}
