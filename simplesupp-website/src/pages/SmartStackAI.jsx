import React from 'react';
import SupplementQuiz from '../SupplementQuiz';
import { Sparkles, Brain, Target } from 'lucide-react';

export default function SmartStackAI() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-primary via-accent to-violet text-white py-20 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjIpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
                <Sparkles className="text-white" size={40} />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 font-display">
            SmartStack AI
          </h1>

          <p className="text-xl md:text-2xl text-slate-100 mb-3 font-medium">
            Your AI-Powered Supplement Advisor
          </p>

          <p className="text-lg text-slate-200 mb-6 max-w-2xl mx-auto">
            Answer a few questions and get your personalized supplement stack in 2 minutes — built from our premium catalog.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <Brain size={16} />
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <Target size={16} />
              <span>Goal-Specific</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <Sparkles size={16} />
              <span>Beginner-Friendly</span>
            </div>
          </div>

          <p className="mt-6 text-sm text-slate-300 italic">
            Powered by SmartSupp's curated catalog of 42 premium supplements
          </p>
        </div>
      </div>

      {/* Quiz Section */}
      <SupplementQuiz />
    </div>
  );
}
