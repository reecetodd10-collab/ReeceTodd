'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

/**
 * FAQAccordion Component
 *
 * Premium accordion with smooth expand/collapse animations.
 * Glass-morphism styling for modern SaaS aesthetic.
 */
export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How does Aviera Stack work?",
      answer: "Aviera Stack uses advanced algorithms to analyze your fitness goals, lifestyle, diet, and experience level. It cross-references this information with our database of 42+ premium supplements to build a personalized stack tailored specifically to you. The entire process takes about 2 minutes and provides dosage recommendations, timing, and scientific reasoning for each supplement."
    },
    {
      question: "Is Aviera free to use?",
      answer: "Yes! Our AI-powered recommendation tools (Aviera Stack and Aviera Fit) are completely free to use. There's no credit card required, no subscription, and no hidden fees. You only pay if you decide to purchase supplements through our Supliful integration."
    },
    {
      question: "What makes your supplements different?",
      answer: "We partner with premium supplement brands through Supliful to ensure you receive high-quality, third-party tested products. Every supplement in our catalog is science-backed and selected based on research efficacy. We focus on essential supplements with proven benefits rather than trendy, unproven ingredients."
    },
    {
      question: "Can I use Aviera if I'm a beginner?",
      answer: "Absolutely! Aviera Stack is designed for all experience levels, from complete beginners to advanced athletes. Our AI adjusts recommendations based on your experience level, ensuring you start with foundational supplements and can progress as you advance in your fitness journey."
    },
    {
      question: "How long does shipping take?",
      answer: "Shipping times vary based on your location and the products ordered. Most orders through our Supliful integration arrive within 5-7 business days for domestic shipping. You'll receive tracking information once your order ships."
    },
    {
      question: "Can I adjust my supplement stack over time?",
      answer: "Yes! We recommend retaking the Aviera Stack quiz every 8-12 weeks or whenever your goals change significantly. As you progress in your fitness journey, your supplement needs may evolve. Our AI will adjust recommendations based on your updated information."
    },
    {
      question: "Are the supplements safe?",
      answer: "All supplements in our catalog are from reputable brands and undergo third-party testing for quality and purity. However, we always recommend consulting with your healthcare provider before starting any new supplement regimen, especially if you have pre-existing health conditions or take medications."
    },
    {
      question: "What if I don't like a recommended supplement?",
      answer: "You have complete control over your stack. You can remove any supplement from your recommendations and only purchase what you're comfortable with. Our AI provides the reasoning behind each recommendation, so you can make informed decisions."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {faqs.map((faq, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.05 }}
          viewport={{ once: true }}
          className="rounded-2xl overflow-hidden transition-all duration-300"
          style={{
            background: 'rgba(30, 30, 30, 0.9)',
            border: '1px solid rgba(0, 217, 255, 0.3)',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 217, 255, 0.4), 0 8px 20px rgba(0, 0, 0, 0.3)';
            e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
            e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
          }}
        >
          <button
            onClick={() => toggleFAQ(index)}
            className="w-full px-6 md:px-8 py-5 md:py-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors duration-200"
          >
            <span className="text-lg md:text-xl font-bold text-white pr-4">
              {faq.question}
            </span>
            <motion.div
              animate={{ rotate: openIndex === index ? 180 : 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="flex-shrink-0"
            >
              <ChevronDown
                className={`w-6 h-6 transition-colors duration-300 ${
                  openIndex === index ? 'text-[var(--acc)]' : 'text-[var(--txt-muted)]'
                }`}
              />
            </motion.div>
          </button>

          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="px-6 md:px-8 pb-5 md:pb-6 pt-2">
                  <p className="text-[var(--txt-muted)] leading-relaxed text-base md:text-lg font-light">
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}

