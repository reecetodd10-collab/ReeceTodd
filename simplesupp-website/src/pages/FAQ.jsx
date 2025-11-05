import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: "Is this medical advice?",
      a: "No. Aviera provides educational information only. Always consult your healthcare provider before starting any supplement regimen, especially if you have medical conditions or take medications."
    },
    {
      q: "How accurate is the Aviera AI?",
      a: "Our recommendations are based on peer-reviewed research and evidence-based guidelines. However, individual responses vary. We provide a strong starting point—adjust based on your results and healthcare provider input."
    },
    {
      q: "How long before I see results?",
      a: "It depends on your goals and the supplements. Some effects (like caffeine) are immediate. Others (like creatine for strength or collagen for skin) take 4-12 weeks of consistent use. We recommend giving your stack at least 8 weeks."
    },
    {
      q: "Can I customize my stack?",
      a: "Absolutely! Our quiz generates a starting stack based on your goals. You can add or remove supplements, adjust dosages, and refine as you learn what works for you."
    },
    {
      q: "What if I have budget constraints?",
      a: 'We mark supplements by priority: Essential, High, or Medium. Start with the Essential supplements for your goal, then add others as budget allows. You do not need everything at once!'
    },
    {
      q: "Are you sensitive to caffeine?",
      a: "Yes! Our quiz asks about caffeine sensitivity. If you indicate sensitivity, we will avoid or adjust caffeine-containing supplements in your stack."
    },
    {
      q: "Are supplements safe?",
      a: "When used appropriately, most supplements are safe for healthy adults. However, quality matters—choose reputable brands. Always consult your doctor, especially if pregnant, nursing, or taking medications."
    },
    {
      q: "Do I need to take supplements forever?",
      a: "Not necessarily. Some people use supplements short-term (e.g., during a cut or bulk). Others take foundational supplements (like Vitamin D, Omega-3) long-term for overall health. It is personal and flexible."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600">
            Everything you need to know about Aivra.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition"
              >
                <h3 className="text-lg font-bold text-gray-900">{faq.q}</h3>
                {openIndex === i ? (
                  <ChevronUp className="text-primary flex-shrink-0" size={24} />
                ) : (
                  <ChevronDown className="text-gray-400 flex-shrink-0" size={24} />
                )}
              </button>

              {openIndex === i && (
                <div className="px-6 pb-5">
                  <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-br from-primary/10 via-accent/10 to-violet/10 rounded-2xl p-8 border border-primary/20 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Still Have Questions?
          </h3>
          <p className="text-gray-600 mb-4">
            We are here to help. Reach out anytime.
          </p>
          <a
            href="/contact"
            className="inline-block px-6 py-3 bg-gradient-to-r from-primary via-accent to-violet text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
