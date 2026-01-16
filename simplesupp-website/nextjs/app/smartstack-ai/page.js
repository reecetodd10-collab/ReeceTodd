'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import SupplementQuiz from '../components/SupplementQuiz';
import OptimizedImage from '../components/OptimizedImage';
import { Brain, Target, Sparkles, Crown, Check } from 'lucide-react';

export default function SmartStackAI() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGetStack = () => {
    // Scroll to quiz section
    const quizSection = document.getElementById('supplement-quiz');
    if (quizSection) {
      quizSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Cyan circle checkmark component
  const CyanCheckmark = () => (
    <div 
      className="inline-flex items-center justify-center rounded-full mr-2"
      style={{
        width: '18px',
        height: '18px',
        background: '#00D9FF',
        boxShadow: '0 0 8px rgba(0, 217, 255, 0.5)',
      }}
    >
      <Check size={12} className="text-[#001018]" strokeWidth={3} />
    </div>
  );

  return (
    <div className="min-h-screen relative">
      {/* Full-page Background Image */}
      <div className="fixed inset-0 z-0">
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
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/60"></div>
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70"></div>
      </div>

      {/* Hero Header */}
      <div className="relative text-[var(--txt)] py-20 md:py-32 overflow-hidden min-h-[60vh] z-10">
        {/* Floating Particles Background */}
        <div className="absolute inset-0 z-[5] overflow-hidden pointer-events-none">
          {[
            { left: '10%', top: '20%', size: 3, delay: 0, duration: 18 },
            { left: '25%', top: '60%', size: 2, delay: 2, duration: 20 },
            { left: '45%', top: '15%', size: 4, delay: 1, duration: 22 },
            { left: '60%', top: '75%', size: 2.5, delay: 3, duration: 19 },
            { left: '75%', top: '30%', size: 3.5, delay: 1.5, duration: 21 },
            { left: '85%', top: '55%', size: 2, delay: 2.5, duration: 17 },
            { left: '15%', top: '80%', size: 3, delay: 0.5, duration: 23 },
            { left: '35%', top: '40%', size: 2.5, delay: 1.8, duration: 20 },
            { left: '55%', top: '65%', size: 4, delay: 2.2, duration: 18 },
            { left: '70%', top: '10%', size: 2, delay: 0.8, duration: 24 },
            { left: '90%', top: '45%', size: 3.5, delay: 1.2, duration: 19 },
            { left: '5%', top: '50%', size: 2.5, delay: 3.5, duration: 21 },
          ].map((particle, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                background: 'rgba(0, 217, 255, 0.3)',
                left: particle.left,
                top: particle.top,
                animation: `float-particle ${particle.duration}s ease-in-out infinite`,
                animationDelay: `${particle.delay}s`,
                boxShadow: '0 0 6px rgba(0, 217, 255, 0.4)',
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Icon - Charcoal rounded square with Sparkles */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div 
                className="absolute inset-0 bg-[#00D9FF]/20 rounded-2xl blur-xl"
                style={{
                  animation: 'pulse 2.5s ease-in-out infinite',
                }}
              ></div>
              <div 
                className="relative w-20 h-20 bg-[var(--charcoal-light)] rounded-2xl flex items-center justify-center shadow-premium-lg border border-[var(--border)] icon-aivra"
                style={{
                  animation: 'pulse-glow 2.5s ease-in-out infinite',
                }}
              >
                <Sparkles className="text-white" size={40} />
              </div>
            </div>
          </div>
          
          <style jsx>{`
            @keyframes pulse {
              0%, 100% {
                opacity: 0.2;
              }
              50% {
                opacity: 0.4;
              }
            }
            @keyframes pulse-glow {
              0%, 100% {
                box-shadow: 0 0 15px rgba(0, 217, 255, 0.3);
              }
              50% {
                box-shadow: 0 0 25px rgba(0, 217, 255, 0.6);
              }
            }
            @keyframes shimmer {
              0% {
                transform: translateX(-100%);
                opacity: 0;
              }
              50% {
                opacity: 1;
              }
              100% {
                transform: translateX(100%);
                opacity: 0;
              }
            }
            @keyframes fade-slide-up {
              0% {
                opacity: 0;
                transform: translateY(10px);
              }
              100% {
                opacity: 1;
                transform: translateY(0);
              }
            }
            @keyframes bounce-in-1 {
              0% {
                opacity: 0;
                transform: translateY(20px) scale(0.8);
              }
              50% {
                transform: translateY(-5px) scale(1.05);
              }
              100% {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
            @keyframes bounce-in-2 {
              0% {
                opacity: 0;
                transform: translateY(20px) scale(0.8);
              }
              50% {
                transform: translateY(-5px) scale(1.05);
              }
              100% {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
            @keyframes bounce-in-3 {
              0% {
                opacity: 0;
                transform: translateY(20px) scale(0.8);
              }
              50% {
                transform: translateY(-5px) scale(1.05);
              }
              100% {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
            .animate-bounce-in-1 {
              animation: bounce-in-1 0.6s ease-out forwards;
              animation-delay: 0.1s;
            }
            .animate-bounce-in-2 {
              animation: bounce-in-2 0.6s ease-out forwards;
              animation-delay: 0.2s;
            }
            .animate-bounce-in-3 {
              animation: bounce-in-3 0.6s ease-out forwards;
              animation-delay: 0.3s;
            }
            .animate-fade-slide-up {
              animation: fade-slide-up 0.8s ease-out forwards;
            }
            @keyframes float-particle {
              0%, 100% {
                transform: translate(0, 0) rotate(0deg);
                opacity: 0.2;
              }
              25% {
                transform: translate(20px, -15px) rotate(90deg);
                opacity: 0.4;
              }
              50% {
                transform: translate(-15px, -25px) rotate(180deg);
                opacity: 0.3;
              }
              75% {
                transform: translate(-20px, 15px) rotate(270deg);
                opacity: 0.4;
              }
            }
          `}</style>

          {/* Title */}
          <h1 
            className="text-4xl md:text-6xl font-bold text-white mb-4 text-shadow-lg drop-shadow-2xl"
            style={{
              textShadow: '0 0 30px rgba(0, 217, 255, 0.2), 0 2px 4px rgba(0, 0, 0, 0.5)'
            }}
          >
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
              <div 
                className="p-4 rounded-xl cursor-pointer transition-all duration-300"
                style={{
                  background: 'rgba(30, 30, 30, 0.9)',
                  border: '1px solid rgba(0, 217, 255, 0.2)',
                  boxShadow: '0 0 15px rgba(0, 217, 255, 0.15)',
                  backdropFilter: 'blur(12px) saturate(180%)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 217, 255, 0.4)';
                  e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.5)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 217, 255, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div className="flex items-center gap-3">
                  <Crown className="text-[#00D9FF]" size={24} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">Upgrade to Aviera Pro</p>
                    <p className="text-xs text-white/70">Get AI-powered stack builder with tracking</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Sparkles className="text-[#00D9FF]" size={20} />
                    <span className="text-[#00D9FF] text-xs">→</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 text-sm mb-6">
            <div 
              className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm transition-all duration-300 cursor-pointer ${mounted ? 'animate-bounce-in-1' : 'opacity-0'}`}
              style={{
                background: 'rgba(30, 30, 30, 0.7)',
                border: '1px solid rgba(0, 217, 255, 0.2)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 217, 255, 0.4)';
                e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.2)';
              }}
            >
              <Brain size={16} className="text-[#00D9FF]" />
              <span className="text-white">AI-Powered</span>
            </div>
            <div 
              className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm transition-all duration-300 cursor-pointer ${mounted ? 'animate-bounce-in-2' : 'opacity-0'}`}
              style={{
                background: 'rgba(30, 30, 30, 0.7)',
                border: '1px solid rgba(0, 217, 255, 0.2)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 217, 255, 0.4)';
                e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.2)';
              }}
            >
              <Target size={16} className="text-[#00D9FF]" />
              <span className="text-white">Goal-Specific</span>
            </div>
            <div 
              className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm transition-all duration-300 cursor-pointer ${mounted ? 'animate-bounce-in-3' : 'opacity-0'}`}
              style={{
                background: 'rgba(30, 30, 30, 0.7)',
                border: '1px solid rgba(0, 217, 255, 0.2)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 217, 255, 0.4)';
                e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.2)';
              }}
            >
              <Sparkles size={16} className="text-[#00D9FF]" />
              <span className="text-white">Beginner-Friendly</span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mb-4">
            <button
              onClick={handleGetStack}
              className="px-8 py-4 text-base font-semibold rounded-xl transition-all duration-300"
              style={{
                background: '#00D9FF',
                color: '#001018',
                boxShadow: '0 0 20px rgba(0, 217, 255, 0.4)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 217, 255, 0.7)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.4)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Get Your Stack →
            </button>
          </div>

          {/* Excitement Social Proof */}
          <p 
            className={`text-sm text-gray-200 mb-3 ${mounted ? 'animate-fade-slide-up' : 'opacity-0'}`}
            style={{
              animationDelay: '0.3s',
            }}
          >
            Join 500+ who found their perfect stack
          </p>

          {/* Social Proof */}
          <div className="text-sm text-gray-300 mb-6 flex items-center justify-center flex-wrap gap-2">
            <CyanCheckmark />
            <span>Free</span>
            <CyanCheckmark />
            <span>2 minutes</span>
            <CyanCheckmark />
            <span>Science-backed</span>
            <CyanCheckmark />
            <span>42+ Supplements</span>
          </div>
        </div>
      </div>

      {/* Quiz Section */}
      <div id="supplement-quiz" className="relative z-10">
        <SupplementQuiz />
      </div>
    </div>
  );
}

