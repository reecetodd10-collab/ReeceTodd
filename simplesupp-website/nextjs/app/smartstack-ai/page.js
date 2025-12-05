'use client';

import React from 'react';
import Link from 'next/link';
import SupplementQuiz from '../components/SupplementQuiz';
import OptimizedImage from '../components/OptimizedImage';
import { Pill, Brain, Target, Sparkles, Crown } from 'lucide-react';

export default function SmartStackAI() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Hero Header */}
      <div className="relative text-[var(--txt)] py-20 md:py-32 overflow-hidden min-h-[60vh]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <OptimizedImage
            src="/images/stack/stack-background.jpg"
            alt="Fitness and supplements background"
            width={1920}
            height={1080}
            className="w-full h-full"
            priority
            objectFit="cover"
            objectPosition="center center"
            fallbackText="Background"
          />
          {/* Dark overlay for text readability - rgba(0,0,0,0.5) equivalent */}
          <div className="absolute inset-0 bg-black/50"></div>
          {/* Additional gradient overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 text-shadow-lg drop-shadow-2xl">
            Aviera Stack
          </h1>

          <p className="text-xl md:text-2xl text-white/95 mb-3 font-medium text-shadow drop-shadow-lg">
            Your AI-Powered Supplement Advisor
          </p>

          <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto text-shadow drop-shadow-md">
            Answer a few questions and get your personalized supplement stack in 2 minutes — built from our premium catalog.
          </p>

          {/* Premium Upgrade Banner */}
          <div className="max-w-md mx-auto mb-8">
            <Link href="/pricing">
              <div className="glass-card p-4 border border-[var(--acc)]/30 hover:border-[var(--acc)]/50 transition cursor-pointer">
                <div className="flex items-center gap-3">
                  <Crown className="text-[var(--acc)]" size={24} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[var(--txt)]">Upgrade to Aviera Pro</p>
                    <p className="text-xs text-[var(--txt-muted)]">Get AI-powered stack builder with tracking</p>
                  </div>
                  <Sparkles className="text-[var(--acc)]" size={20} />
                </div>
              </div>
            </Link>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <div className="flex items-center gap-2 px-4 py-2 glass rounded-full border border-white/20 backdrop-blur-sm">
              <Brain size={16} className="text-white" />
              <span className="text-white">AI-Powered</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 glass rounded-full border border-white/20 backdrop-blur-sm">
              <Target size={16} className="text-white" />
              <span className="text-white">Goal-Specific</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 glass rounded-full border border-white/20 backdrop-blur-sm">
              <Sparkles size={16} className="text-white" />
              <span className="text-white">Beginner-Friendly</span>
            </div>
          </div>

          <p className="mt-6 text-sm text-white/80 italic text-shadow drop-shadow-md">
            Powered by Aviera's curated catalog of 42 premium supplements
          </p>
        </div>
      </div>

      {/* Quiz Section */}
      <SupplementQuiz />
    </div>
  );
}

