import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, Sparkles, Zap, CheckCircle, ArrowRight } from 'lucide-react';
import GlassCard from '../components/shared/GlassCard';
import Button from '../components/shared/Button';

export default function Welcome() {
  useEffect(() => {
    // Confetti animation (simple version)
    const confetti = document.createElement('div');
    confetti.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
    `;
    document.body.appendChild(confetti);

    // Create confetti particles
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: 10px;
        height: 10px;
        background: ${['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][Math.floor(Math.random() * 5)]};
        left: ${Math.random() * 100}%;
        top: -10px;
        border-radius: 50%;
        animation: confetti-fall ${2 + Math.random() * 2}s linear forwards;
      `;
      confetti.appendChild(particle);
    }

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes confetti-fall {
        to {
          transform: translateY(100vh) rotate(360deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    // Cleanup after animation
    setTimeout(() => {
      confetti.remove();
      style.remove();
    }, 5000);

    return () => {
      confetti.remove();
      style.remove();
    };
  }, []);

  const features = [
    { icon: Sparkles, text: 'AI-Powered Supplement Stack Builder', link: '/dashboard/stack' },
    { icon: Zap, text: 'Custom AI Workout Plans', link: '/dashboard/fit' },
    { icon: Crown, text: '24/7 AI Coach Chat', link: '/dashboard' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Celebration Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-24 h-24 bg-gradient-to-br from-[var(--acc)] to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Crown size={48} className="text-white" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-[var(--txt)] mb-4">
            🎉 Welcome to Premium!
          </h1>
          <p className="text-xl text-[var(--txt-muted)] mb-8">
            Your AI-powered fitness journey starts now
          </p>

          {/* Feature Cards */}
          <div className="space-y-4 mb-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <Link to={feature.link}>
                    <GlassCard className="p-6 hover:shadow-premium-lg transition cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[var(--acc)]/20 rounded-full flex items-center justify-center">
                          <Icon className="text-[var(--acc)]" size={24} />
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="font-semibold text-[var(--txt)] mb-1">{feature.text}</h3>
                          <p className="text-sm text-[var(--txt-muted)]">Explore this feature</p>
                        </div>
                        <ArrowRight className="text-[var(--txt-muted)]" size={20} />
                      </div>
                    </GlassCard>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Quick Stats */}
          <GlassCard className="p-6 mb-8">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-[var(--txt)] mb-1">∞</div>
                <p className="text-xs text-[var(--txt-muted)]">AI Features</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--txt)] mb-1">10%</div>
                <p className="text-xs text-[var(--txt-muted)]">Shop Discount</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--txt)] mb-1">24/7</div>
                <p className="text-xs text-[var(--txt-muted)]">AI Support</p>
              </div>
            </div>
          </GlassCard>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Link to="/dashboard">
              <Button variant="primary" className="w-full sm:w-auto px-8">
                <CheckCircle size={20} />
                Get Started
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

