import React from 'react';
import SupplementQuiz from '../SupplementQuiz';

export default function SuppStackAI() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-primary to-purple text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            SuppStack AI
          </h1>
          <p className="text-xl text-gray-100">
            Answer a few questions and get your personalized supplement stack in 2 minutes.
          </p>
          <p className="mt-4 text-sm text-gray-200">
            <strong>Beginner?</strong> No worries—this quiz will guide you to the perfect starting point.
          </p>
        </div>
      </div>

      <SupplementQuiz />
    </div>
  );
}
