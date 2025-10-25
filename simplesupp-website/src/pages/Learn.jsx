import React from 'react';
import { BookOpen, Clock } from 'lucide-react';

export default function Learn() {
  const articles = [
    { title: 'Creatine 101: The Most Researched Supplement', author: 'Reece Todd', read: '5 min', category: 'Performance' },
    { title: 'Whey vs. Plant Protein: Which is Right for You?', author: 'Reece Todd', read: '7 min', category: 'Nutrition' },
    { title: 'Magnesium Glycinate for Sleep & Calm', author: 'Reece Todd', read: '4 min', category: 'Recovery' },
    { title: 'Beginner Stack—Your First 30 Days', author: 'Reece Todd', read: '8 min', category: 'Getting Started' },
    { title: 'Omega-3 Benefits: Beyond Heart Health', author: 'Reece Todd', read: '6 min', category: 'Health' },
    { title: 'Pre-Workout Guide: What Actually Works', author: 'Reece Todd', read: '5 min', category: 'Performance' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <BookOpen className="mx-auto mb-6 text-primary" size={64} />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Learn
          </h1>
          <p className="text-xl text-gray-600">
            Science-backed guides to help you understand supplements.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="mb-3">
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                  {article.category}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition">
                {article.title}
              </h3>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>By {article.author}</span>
                <span className="flex items-center">
                  <Clock size={14} className="mr-1" />
                  {article.read}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
