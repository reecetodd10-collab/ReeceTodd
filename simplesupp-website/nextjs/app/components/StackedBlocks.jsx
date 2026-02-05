'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Dumbbell, Flame, Brain, Zap, ArrowRight, Check, Pill } from 'lucide-react';

/**
 * StackedBlocks Component - Stack Preview CTA
 * 
 * An interactive preview showcasing what users get from the quiz.
 * Features goal cards, pulse animation, and clear CTA.
 */
export default function StackedBlocks() {
  const previewGoals = [
    { icon: Dumbbell, label: 'Build Muscle' },
    { icon: Flame, label: 'Burn Fat' },
    { icon: Brain, label: 'Focus' },
    { icon: Zap, label: 'Energy' },
  ];

  const sampleSupplements = [
    'Creatine Monohydrate',
    'Whey Protein Isolate',
    'Pre-Workout Formula',
  ];

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Main CTA Card */}
      <Link href="/smartstack-ai">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative group cursor-pointer"
        >
          {/* Pulsing glow background */}
          <div 
            className="absolute -inset-1 rounded-3xl opacity-60 blur-xl transition-all duration-500 group-hover:opacity-80"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.4) 0%, rgba(0, 150, 255, 0.3) 100%)',
              animation: 'pulse-glow 3s ease-in-out infinite',
            }}
          />
          
          {/* Card container */}
          <div
            className="relative rounded-2xl p-6 transition-all duration-300"
            style={{
              background: '#ffffff',
              border: '1px solid rgba(0, 217, 255, 0.3)',
              boxShadow: '0 0 20px rgba(0, 217, 255, 0.25)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 217, 255, 0.5)';
              e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.25)';
              e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div
                    className="absolute inset-0 rounded-xl blur-xl transition-all duration-300"
                    style={{
                      background: 'rgba(0, 217, 255, 0.3)',
                      animation: 'pulse-glow 3s ease-in-out infinite',
                    }}
                  ></div>
                  <div
                    className="relative rounded-xl flex items-center justify-center"
                    style={{
                      background: '#1a1a1a',
                      padding: '10px',
                      border: '1px solid rgba(0, 217, 255, 0.3)',
                      boxShadow: '0 0 15px rgba(0, 217, 255, 0.25)',
                    }}
                  >
                    <Pill
                      className="text-white fill-current"
                      size={28}
                      style={{ filter: 'drop-shadow(0 0 8px rgba(0, 217, 255, 0.8))' }}
                    />
                  </div>
                </div>
                <h3
                  className="font-bold text-xl"
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    color: '#1a1a1a',
                  }}
                >
                  Aviera Stack
                </h3>
              </div>
              <div
                className="px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-semibold"
                style={{
                  background: 'rgba(0, 217, 255, 0.1)',
                  color: '#00d9ff',
                  border: '1px solid rgba(0, 217, 255, 0.3)',
                }}
              >
                <ArrowRight size={14} />
                Find Your Stack
              </div>
            </div>

            {/* Goal Icons Row */}
            <div className="grid grid-cols-4 gap-2 mb-5">
              {previewGoals.map((goal, idx) => {
                const Icon = goal.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1, duration: 0.3 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-200"
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{
                        background: 'rgba(0, 217, 255, 0.1)',
                        border: '1px solid rgba(0, 217, 255, 0.2)',
                      }}
                    >
                      <Icon size={16} style={{ color: '#00d9ff' }} />
                    </div>
                    <span className="text-[10px] text-center leading-tight" style={{ color: '#6b7280' }}>{goal.label}</span>
                  </motion.div>
                );
              })}
            </div>

            {/* Sample Stack Preview */}
            <div
              className="rounded-xl p-4 mb-5"
              style={{
                background: '#f9fafb',
                border: '1px solid #e0e0e0',
              }}
            >
              <p className="text-[10px] uppercase tracking-wider mb-3" style={{ color: '#6b7280' }}>Sample Stack Includes</p>
              <div className="space-y-2">
                {sampleSupplements.map((supp, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#00d9ff' }}>
                      <Check size={10} className="text-[#001018]" strokeWidth={3} />
                    </div>
                    <span className="text-xs" style={{ color: '#4a4a4a' }}>{supp}</span>
                  </motion.div>
                ))}
                <div className="text-xs mt-2" style={{ color: '#6b7280' }}>
                  <span>+ personalized recommendations...</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div
              className="w-full flex items-center justify-center gap-2 transition-all duration-300 ease-in-out group-hover:translate-y-[-3px]"
              style={{
                background: '#00d9ff',
                color: '#ffffff',
                borderRadius: '12px',
                padding: '14px 28px',
                fontSize: '16px',
                fontWeight: 600,
                boxShadow: '0 0 20px rgba(0, 217, 255, 0.3)',
              }}
            >
              <ArrowRight size={18} />
              <span>Build My Stack</span>
            </div>

            <p className="text-center text-[10px] mt-3" style={{ color: '#6b7280' }}>
              Free • 2 minutes • No account required
            </p>
          </div>
        </motion.div>
      </Link>

      {/* Floating accent elements */}
      <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#00d9ff]/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-[#00d9ff]/15 rounded-full blur-xl pointer-events-none" />

      {/* CSS for pulse animation */}
      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.02);
          }
        }
      `}</style>
    </div>
  );
}
