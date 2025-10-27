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

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/smartstack-ai" element={<SmartStackAI />} />
          <Route path="/smartfitt" element={<SmartFitt />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          {/* Redirect old route */}
          <Route path="/suppstack-ai" element={<Navigate to="/smartstack-ai" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
