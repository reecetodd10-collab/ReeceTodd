import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Check, 
  X, 
  Crown, 
  Sparkles, 
  Zap, 
  Download, 
  MessageCircle, 
  ShoppingCart, 
  RefreshCw, 
  BarChart3,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import GlassCard from '../components/shared/GlassCard';
import Button from '../components/shared/Button';
import Modal from '../components/shared/Modal';
import { TESTING_MODE } from '../lib/config';

export default function Pricing() {
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const handleStartTrial = () => {
    if (TESTING_MODE) {
      setShowTrialModal(true);
    } else {
      // TODO: Integrate Stripe Checkout for free trial
      // window.location.href = '/api/stripe/checkout?trial=true';
      setShowTrialModal(true);
    }
  };

  const handleSubscribe = () => {
    if (TESTING_MODE) {
      setShowSubscribeModal(true);
    } else {
      // TODO: Integrate Stripe Checkout
      // window.location.href = '/api/stripe/checkout';
      setShowSubscribeModal(true);
    }
  };

  const faqs = [
    {
      question: "How does the free trial work?",
      answer: "You get 7 days of full Premium access completely free. No credit card required to start the trial. After 7 days, you'll be automatically charged $9.99/month. You can cancel anytime during the trial and won't be charged."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes! You can cancel your subscription at any time from your dashboard settings. Your premium access will continue until the end of your current billing period, and you won't be charged again."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express) and debit cards through our secure Stripe payment processor. Your payment information is never stored on our servers."
    },
    {
      question: "Will my data be saved if I downgrade?",
      answer: "Yes, all your data (workouts, supplement stacks, progress) is saved permanently. If you downgrade to free, you'll lose access to premium features but can upgrade again anytime to restore full access."
    },
    {
      question: "Do premium members really get 10% off?",
      answer: "Absolutely! Premium members automatically get 10% off all supplement purchases in our shop. The discount is applied at checkout - no coupon codes needed."
    },
    {
      question: "What happens if I don't like Premium?",
      answer: "We offer a 7-day free trial so you can try Premium risk-free. If you're not satisfied, simply cancel before the trial ends and you won't be charged. We're confident you'll love it though!"
    }
  ];

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-normal text-[var(--txt)] mb-4" style={{ letterSpacing: '2px' }}>
              Upgrade to Aviera Premium
            </h1>
            <p className="text-xl text-[var(--txt-muted)] mb-12 max-w-2xl mx-auto font-light" style={{ letterSpacing: '5px' }}>
              Unlock AI-powered personalization and advanced features to take your fitness journey to the next level
            </p>
          </motion.div>

          {/* Pricing Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-md mx-auto"
          >
            <GlassCard className="p-8 relative overflow-hidden">
              {/* Premium Badge */}
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-gradient-to-r from-[var(--acc)] to-blue-500 text-white text-xs font-normal rounded-full flex items-center gap-1">
                  <Crown size={12} />
                  Premium
                </span>
              </div>

              <div className="mb-6">
                <div className="text-5xl font-normal text-[var(--txt)] mb-2">
                  $9.99<span className="text-2xl text-[var(--txt-muted)]">/month</span>
                </div>
                <div className="text-sm text-[var(--txt-muted)]">
                  or <span className="font-normal text-[var(--txt)]">$99/year</span> (save 17%)
                </div>
              </div>

              {/* Feature List */}
              <div className="space-y-3 mb-8 text-left">
                {[
                  { icon: Sparkles, text: 'AI-Powered Supplement Stack Builder' },
                  { icon: Zap, text: 'Custom AI Workout Plans with Progressive Overload' },
                  { icon: MessageCircle, text: 'Daily Push Notifications & Tracking' },
                  { icon: BarChart3, text: 'Progress Analytics & Insights' },
                  { icon: Download, text: 'PDF Workout Downloads' },
                  { icon: MessageCircle, text: '24/7 AI Coach Chat Assistant' },
                  { icon: ShoppingCart, text: '10% Off All Supplement Purchases' },
                  { icon: RefreshCw, text: 'Weekly Plan Regeneration' },
                  { icon: Crown, text: 'Priority Support' },
                ].map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                        <Check size={14} className="text-green-500" />
                      </div>
                      <Icon size={16} className="text-[var(--acc)] flex-shrink-0" />
                      <span className="text-sm text-[var(--txt)]">{feature.text}</span>
                    </div>
                  );
                })}
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleStartTrial}
                  variant="primary"
                  className="w-full"
                >
                  Start Free Trial
                </Button>
                <Button
                  onClick={handleSubscribe}
                  variant="secondary"
                  className="w-full"
                >
                  Subscribe Now
                </Button>
                <p className="text-xs text-center text-[var(--txt-muted)] mt-4">
                  Cancel anytime. No commitments.
                </p>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Comparison Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-normal text-center text-[var(--txt)] mb-8" style={{ letterSpacing: '2px' }}>
            Free vs Premium
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Free Tier */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-normal text-[var(--txt)] mb-4" style={{ letterSpacing: '2px' }}>Free Tier</h3>
              <div className="space-y-3">
                {[
                  { feature: 'Basic Supplement Recommendations', free: true, premium: true },
                  { feature: 'One-Time Quiz Access', free: true, premium: true },
                  { feature: 'Basic Workout Preview', free: true, premium: true },
                  { feature: 'Shop Supplements', free: true, premium: true },
                  { feature: 'AI-Powered Stack Builder', free: false, premium: true },
                  { feature: 'Custom AI Workout Plans', free: false, premium: true },
                  { feature: 'Daily Tracking & Notifications', free: false, premium: true },
                  { feature: 'Progress Analytics', free: false, premium: true },
                  { feature: 'PDF Downloads', free: false, premium: true },
                  { feature: 'AI Coach Chat', free: false, premium: true },
                  { feature: '10% Shop Discount', free: false, premium: true },
                  { feature: 'Weekly Plan Regeneration', free: false, premium: true },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
                    <span className="text-sm text-[var(--txt)]">{item.feature}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-[var(--txt-muted)]">
                        {item.free ? (
                          <Check size={18} className="text-green-500" />
                        ) : (
                          <X size={18} className="text-[var(--txt-muted)]" />
                        )}
                      </span>
                      <span className="text-[var(--acc)]">
                        {item.premium && <Check size={18} />}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Premium Tier */}
            <GlassCard className="p-6 border-2 border-[var(--acc)]/30 relative">
              <div className="absolute top-4 right-4">
                <span className="px-2 py-1 bg-[var(--acc)] text-white text-xs font-normal rounded">
                  PREMIUM
                </span>
              </div>
              <h3 className="text-xl font-normal text-[var(--txt)] mb-4" style={{ letterSpacing: '2px' }}>Premium</h3>
              <div className="space-y-3">
                {[
                  { feature: 'Basic Supplement Recommendations', free: true, premium: true },
                  { feature: 'One-Time Quiz Access', free: true, premium: true },
                  { feature: 'Basic Workout Preview', free: true, premium: true },
                  { feature: 'Shop Supplements', free: true, premium: true },
                  { feature: 'AI-Powered Stack Builder', free: false, premium: true },
                  { feature: 'Custom AI Workout Plans', free: false, premium: true },
                  { feature: 'Daily Tracking & Notifications', free: false, premium: true },
                  { feature: 'Progress Analytics', free: false, premium: true },
                  { feature: 'PDF Downloads', free: false, premium: true },
                  { feature: 'AI Coach Chat', free: false, premium: true },
                  { feature: '10% Shop Discount', free: false, premium: true },
                  { feature: 'Weekly Plan Regeneration', free: false, premium: true },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
                    <span className="text-sm text-[var(--txt)]">{item.feature}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-[var(--txt-muted)]">
                        {item.free ? (
                          <Check size={18} className="text-green-500" />
                        ) : (
                          <X size={18} className="text-[var(--txt-muted)]" />
                        )}
                      </span>
                      <span className="text-[var(--acc)]">
                        {item.premium && <Check size={18} />}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-normal text-center text-[var(--txt)] mb-8">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <GlassCard key={index} className="p-6">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <h3 className="text-lg font-normal text-[var(--txt)] pr-4">
                    {faq.question}
                  </h3>
                  {expandedFAQ === index ? (
                    <ChevronUp size={20} className="text-[var(--txt-muted)] flex-shrink-0" />
                  ) : (
                    <ChevronDown size={20} className="text-[var(--txt-muted)] flex-shrink-0" />
                  )}
                </button>
                {expandedFAQ === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-[var(--border)]"
                  >
                    <p className="text-[var(--txt-muted)] leading-relaxed">{faq.answer}</p>
                  </motion.div>
                )}
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="text-center mb-16">
          <GlassCard className="p-8">
            <h2 className="text-2xl font-normal text-[var(--txt)] mb-4">
              Join 1,000+ members optimizing their fitness
            </h2>
            <p className="text-[var(--txt-muted)]">
              Start your premium journey today and unlock the full potential of AI-powered fitness
            </p>
          </GlassCard>
        </div>
      </div>

      {/* Payment Modals */}
      <PaymentModal
        isOpen={showTrialModal}
        onClose={() => setShowTrialModal(false)}
        type="trial"
      />

      <PaymentModal
        isOpen={showSubscribeModal}
        onClose={() => setShowSubscribeModal(false)}
        type="subscribe"
      />
    </div>
  );
}

// Payment Modal Component
function PaymentModal({ isOpen, onClose, type }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={type === 'trial' ? 'Start Free Trial' : 'Subscribe Now'}>
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-[var(--acc)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Crown className="text-[var(--acc)]" size={32} />
        </div>
        <h3 className="text-xl font-normal text-[var(--txt)] mb-2">
          Payment Integration Coming Soon!
        </h3>
        <p className="text-[var(--txt-muted)] mb-6">
          {TESTING_MODE 
            ? "Testing mode is active - premium features are unlocked. In production, this will integrate with Stripe Checkout."
            : "We're setting up secure payment processing. Check back soon to start your premium journey!"}
        </p>
        {TESTING_MODE && (
          <p className="text-sm text-[var(--txt-muted)] mb-6">
            To enable payments: Set TESTING_MODE = false in /src/lib/config.js and integrate Stripe Checkout.
          </p>
        )}
        <Button onClick={onClose}>Got it</Button>
      </div>
    </Modal>
  );
}
