import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import SmartStackAI from './pages/SmartStackAI';
import SmartFitt from './pages/SmartFitt';
import Shop from './pages/Shop';
import Learn from './pages/Learn';
import Reviews from './pages/Reviews';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Pricing from './pages/Pricing';
import Dashboard from './pages/Dashboard';

function MarketingLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Dashboard routes - no nav/footer */}
      <Route path="/dashboard/*" element={<Dashboard />} />

      {/* Marketing routes - with nav/footer */}
      <Route path="/" element={<MarketingLayout><Home /></MarketingLayout>} />
      <Route path="/smartstack-ai" element={<MarketingLayout><SmartStackAI /></MarketingLayout>} />
      <Route path="/smartfitt" element={<MarketingLayout><SmartFitt /></MarketingLayout>} />
      <Route path="/shop" element={<MarketingLayout><Shop /></MarketingLayout>} />
      <Route path="/learn" element={<MarketingLayout><Learn /></MarketingLayout>} />
      <Route path="/reviews" element={<MarketingLayout><Reviews /></MarketingLayout>} />
      <Route path="/about" element={<MarketingLayout><About /></MarketingLayout>} />
      <Route path="/faq" element={<MarketingLayout><FAQ /></MarketingLayout>} />
      <Route path="/contact" element={<MarketingLayout><Contact /></MarketingLayout>} />
      <Route path="/pricing" element={<MarketingLayout><Pricing /></MarketingLayout>} />
      {/* Redirect old route */}
      <Route path="/suppstack-ai" element={<Navigate to="/smartstack-ai" replace />} />
    </Routes>
  );
}
