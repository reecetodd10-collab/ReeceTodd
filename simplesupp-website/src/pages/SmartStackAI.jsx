import React from 'react';
import SupplementQuiz from '../SupplementQuiz';
import { Pill, Brain, Target, Sparkles } from 'lucide-react';

export default function SmartStackAI() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Hero Header */}
      <div className="relative bg-[var(--bg)] text-[var(--txt)] py-24 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjIpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Icon - Charcoal rounded square with Sparkles */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-[var(--acc)]/20 rounded-2xl blur-xl"></div>
              <div className="relative w-20 h-20 bg-[var(--charcoal-light)] rounded-2xl flex items-center justify-center shadow-premium-lg border border-[var(--border)] icon-aivra">
                <Sparkles className="text-white" size={40} />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-[var(--txt)] mb-4">
            Aivra Stack
          </h1>

          <p className="text-xl md:text-2xl text-[var(--txt-muted)] mb-3 font-medium">
            Your AI-Powered Supplement Advisor
          </p>

          <p className="text-lg text-[var(--txt-muted)] mb-8 max-w-2xl mx-auto">
            Answer a few questions and get your personalized supplement stack in 2 minutes — built from our premium catalog.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <div className="flex items-center gap-2 px-4 py-2 glass rounded-full border border-[var(--border)]">
              <Brain size={16} />
              <span className="text-[var(--txt)]">AI-Powered</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 glass rounded-full border border-[var(--border)]">
              <Target size={16} />
              <span className="text-[var(--txt)]">Goal-Specific</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 glass rounded-full border border-[var(--border)]">
              <Sparkles size={16} />
              <span className="text-[var(--txt)]">Beginner-Friendly</span>
            </div>
          </div>

          <p className="mt-6 text-sm text-[var(--txt-muted)] italic">
            Powered by Aivra's curated catalog of 42 premium supplements
          </p>
        </div>
      </div>

      {/* Quiz Section */}
      <SupplementQuiz />
    </div>
  );
}
