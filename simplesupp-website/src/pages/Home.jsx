import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Dumbbell, Brain, Heart, Zap, Star, Sparkles, Target, ShoppingCart, Award, Crown } from 'lucide-react';
import PillLogo from '../components/PillLogo';
import ParallaxLayer from '../components/ParallaxLayer';
import PromoBanner from '../components/PromoBanner';
import SectionIndicators from '../components/SectionIndicators';
import StackedBlocks from '../components/StackedBlocks';
import GoalCards from '../components/GoalCards';
import FAQAccordion from '../components/FAQAccordion';
import ContactForm from '../components/ContactForm';
import GlassCard from '../components/shared/GlassCard';
import { useActiveSection } from '../hooks/useScrollAnimation';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function Home() {
  // Define all sections for navigation
  const sections = [
    { id: 'hero', label: 'Home' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'aviera-stack', label: 'Aviera Stack' },
    { id: 'aviera-fit', label: 'Aviera Fit' },
    { id: 'aviera-shop', label: 'Aviera Shop' },
    { id: 'goals', label: 'Your Goals' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'faq', label: 'FAQ' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  // Track active section for indicators
  const activeSection = useActiveSection(sections.map(s => s.id));

  // Scroll animation hooks
  const heroAnimation = useScrollAnimation({ threshold: 0.2, once: true });
  const howItWorksAnimation = useScrollAnimation({ threshold: 0.2, once: true });
  const smartstackAnimation = useScrollAnimation({ threshold: 0.2, once: true });
  const smartfittAnimation = useScrollAnimation({ threshold: 0.2, once: true });
  const shopAnimation = useScrollAnimation({ threshold: 0.2, once: true });
  const goalsAnimation = useScrollAnimation({ threshold: 0.2, once: true });
  const reviewsAnimation = useScrollAnimation({ threshold: 0.2, once: true });
  const faqAnimation = useScrollAnimation({ threshold: 0.2, once: true });
  const ctaAnimation = useScrollAnimation({ threshold: 0.2, once: true });
  const contactAnimation = useScrollAnimation({ threshold: 0.2, once: true });

  return (
    <>
      {/* Promotional Banner */}
      <PromoBanner />

      {/* Section Indicators */}
      <SectionIndicators sections={sections} activeSection={activeSection} />

      <div className="scroll-snap-container">
        {/* ========================================
            HERO SECTION
            ======================================== */}
        <section
          id="hero"
          className="scroll-snap-section relative min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--txt)] overflow-hidden parallax-container"
        >
          <ParallaxLayer depth={10} speed={0.2} className="absolute inset-0">
            <div className="w-full h-full bg-[var(--bg)]"></div>
          </ParallaxLayer>

          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-10"></div>

          <div
            ref={heroAnimation.ref}
            className={`relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center slide-up ${heroAnimation.isVisible ? 'visible' : ''}`}
          >
            {/* Hero Scrim - ensures text readability */}
            <div className="absolute inset-0 hero-scrim rounded-2xl pointer-events-none" />
            
            <div className="relative z-10">
              <ParallaxLayer depth={30} speed={0.8} className="flex justify-center mb-12">
                <PillLogo size="large" shimmer={true} />
              </ParallaxLayer>

              {/* 
                Contrast Ratio Calculation:
                H1: #F0F6FF on scrim (avg rgba(0,0,0,0.4)) = ~9.5:1 (exceeds 7:1 requirement)
                Body: #B8C2D9 on scrim = ~6.2:1 (exceeds 4.5:1 requirement)
              */}
                              <h1 className="text-6xl md:text-7xl lg:text-[96px] font-extrabold leading-tight mb-6 text-[#F0F6FF] text-shadow">
                Aviera
              </h1>

              <p className="text-xl md:text-2xl text-[24px] text-[var(--txt-muted)] max-w-3xl mx-auto mb-4 font-medium">
                Your AI-Powered Supplement & Fitness Advisor
              </p>

              <p className="text-lg md:text-xl text-[var(--txt-muted)] max-w-2xl mx-auto mb-12 leading-relaxed">
                Get personalized supplement recommendations and workout plans tailored to your goals — 
                built in minutes by AI. Science-backed, personalized, results-driven.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                <button
                  onClick={() => document.getElementById('aviera-stack').scrollIntoView({ behavior: 'smooth' })}
                  className="btn-primary group"
                >
                  Get Your Stack
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </button>
                <button
                  onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
                  className="btn-secondary"
                >
                  Learn More
                </button>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-sm md:text-base text-[var(--txt-muted)]">
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-[var(--acc)]" />
                <span>Science-backed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-[var(--acc)]" />
                <span>Takes 2 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-[var(--acc)]" />
                <span>42+ supplements analyzed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-[var(--acc)]" />
                <span>AI-powered recommendations</span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
              <div className="w-1 h-3 bg-white/30 rounded-full"></div>
            </div>
          </div>
        </section>

        {/* ========================================
            HOW IT WORKS SECTION
            ======================================== */}
        <section
          id="how-it-works"
          className="scroll-snap-section relative min-h-screen flex items-center bg-white py-32 px-4"
        >
          <div
            ref={howItWorksAnimation.ref}
            className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full slide-up ${howItWorksAnimation.isVisible ? 'visible' : ''}`}
          >
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold text-[var(--txt)] mb-6">
                How It Works
              </h2>
              <p className="text-xl text-[var(--txt-muted)] max-w-2xl mx-auto">
                Simple. Smart. Personalized. Get your perfect stack in three easy steps.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              {[
                {
                  step: '1',
                  title: 'Share Your Goals',
                  description: 'Tell us about your fitness goals, lifestyle, diet, and what you want to achieve.',
                  icon: Target,
                },
                {
                  step: '2',
                  title: 'AI Builds Your Stack',
                  description: 'Our AI analyzes 42+ supplements and creates your personalized recommendation.',
                  icon: Brain,
                },
                {
                  step: '3',
                  title: 'Shop & Optimize',
                  description: 'Order premium supplements with fast shipping. Track progress and refine your stack.',
                  icon: ShoppingCart,
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  {/* Icon - Charcoal rounded square with accent glow */}
                  <div className="flex justify-center mb-8">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[var(--acc)]/20 rounded-2xl blur-xl"></div>
                      <div className="relative w-20 h-20 bg-[var(--charcoal-light)] rounded-2xl flex items-center justify-center shadow-premium border border-[var(--border)] icon-aivra">
                        <item.icon className="text-white" size={40} />
                      </div>
                    </div>
                  </div>

                  <div className="inline-block px-4 py-2 bg-[var(--acc)] text-[#001018] rounded-full font-semibold text-sm mb-6">
                    Step {item.step}
                  </div>
                  <h3 className="text-2xl font-bold text-[var(--txt)] mb-4">{item.title}</h3>
                  <p className="text-[var(--txt-muted)] leading-relaxed text-lg">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================
            AVIERA STACK SECTION
            ======================================== */}
        <section
          id="aviera-stack"
          className="scroll-snap-section relative min-h-screen flex items-center bg-[var(--bg)] py-32 px-4"
        >
          <div
            ref={smartstackAnimation.ref}
            className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full slide-up ${smartstackAnimation.isVisible ? 'visible' : ''}`}
          >
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Icon and Content */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                {/* Icon - Charcoal rounded square with Sparkles icon */}
                <div className="flex lg:justify-start justify-center mb-8">
                  <div className="relative">
                      <div className="absolute inset-0 bg-[var(--acc)]/20 rounded-3xl blur-2xl"></div>
                      <div className="relative w-32 h-32 bg-[var(--charcoal-light)] rounded-3xl flex items-center justify-center shadow-premium-lg border border-[var(--border)] icon-aivra">
                      <Sparkles className="text-white" size={56} />
                    </div>
                  </div>
                </div>

                <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                  Aviera Stack
                </h2>
                <p className="text-xl text-[var(--txt-muted)] mb-8 leading-relaxed">
                  Answer a quick 2-minute quiz and get an AI-generated supplement stack tailored to your exact
                  goals, lifestyle, and experience level. Our intelligence engine analyzes 42+ premium supplements
                  to build your perfect combination.
                </p>

                <div className="space-y-4 mb-8">
                  {[
                    'Personalized to your fitness goals',
                    'Science-backed supplement combinations',
                    'Dosage and timing recommendations',
                    'Beginner to advanced stacks'
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-[var(--acc)] rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle size={16} className="text-[#001018]" />
                      </div>
                      <span className="text-[var(--txt-muted)] text-lg">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to="/smartstack-ai"
                  className="btn-primary"
                >
                  Build Your Stack
                  <ArrowRight size={20} />
                </Link>
              </motion.div>

              {/* 3D Stacked Blocks Visualization */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative flex items-center justify-center"
              >
                <StackedBlocks />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ========================================
            AVIERA FIT SECTION
            ======================================== */}
        <section
          id="aviera-fit"
          className="scroll-snap-section relative min-h-screen flex items-center bg-white py-32 px-4"
        >
          <div
            ref={smartfittAnimation.ref}
            className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full slide-up ${smartfittAnimation.isVisible ? 'visible' : ''}`}
          >
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Visual/Image - Left side */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative order-2 lg:order-1"
              >
                <div className="relative p-8 bg-gray-50 rounded-3xl shadow-premium-lg border border-gray-100">
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="inline-block px-6 py-3 bg-[var(--acc)] text-[#001018] rounded-full font-semibold mb-4">
                        Your Workout Plan
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white rounded-xl shadow-sm">
                          <div className="text-3xl font-bold text-[var(--acc)] mb-1">4</div>
                          <div className="text-sm text-[var(--txt-muted)]">Days/Week</div>
                        </div>
                        <div className="p-4 bg-white rounded-xl shadow-sm">
                          <div className="text-3xl font-bold text-[var(--acc)] mb-1">60</div>
                          <div className="text-sm text-[var(--txt-muted)]">Min/Session</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Icon and Content - Right side */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="order-1 lg:order-2"
              >
                {/* Icon - Charcoal rounded square with Dumbbell icon */}
                <div className="flex lg:justify-start justify-center mb-8">
                  <div className="relative">
                      <div className="absolute inset-0 bg-[var(--acc)]/20 rounded-3xl blur-2xl"></div>
                      <div className="relative w-32 h-32 bg-[var(--charcoal-light)] rounded-3xl flex items-center justify-center shadow-premium-lg border border-[var(--border)] icon-aivra">
                      <Dumbbell className="text-white" size={56} />
                    </div>
                  </div>
                </div>

                <h2 className="text-5xl md:text-6xl font-bold text-[var(--txt)] mb-6">
                  Aviera Fit
                </h2>
                <p className="text-xl text-[var(--txt-muted)] mb-8 leading-relaxed">
                  Get AI-powered workout recommendations tailored to your goals and experience level.
                  Match your training plan with the perfect supplement stack for maximum results.
                </p>

                <div className="space-y-4 mb-8">
                  {[
                    'Personalized training programs',
                    'Exercise form guides and videos',
                    'Progressive overload tracking',
                    'Supplement-workout synchronization'
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-[var(--acc)] rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle size={16} className="text-[#001018]" />
                      </div>
                      <span className="text-[var(--txt-muted)] text-lg">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to="/smartfitt"
                  className="btn-primary"
                >
                  Get Workout Plan
                  <ArrowRight size={20} />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ========================================
            AVIERA SHOP SECTION
            ======================================== */}
        <section
          id="aviera-shop"
          className="scroll-snap-section relative min-h-screen flex items-center bg-[var(--bg)] py-32 px-4"
        >
          <div
            ref={shopAnimation.ref}
            className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full slide-up ${shopAnimation.isVisible ? 'visible' : ''}`}
          >
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Icon and Content */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                {/* Icon - Charcoal rounded square with ShoppingCart icon */}
                <div className="flex lg:justify-start justify-center mb-8">
                  <div className="relative">
                      <div className="absolute inset-0 bg-[var(--acc)]/20 rounded-3xl blur-2xl"></div>
                      <div className="relative w-32 h-32 bg-[var(--charcoal-light)] rounded-3xl flex items-center justify-center shadow-premium-lg border border-[var(--border)] icon-aivra">
                      <ShoppingCart className="text-white" size={56} />
                    </div>
                  </div>
                </div>

                <h2 className="text-5xl md:text-6xl font-bold text-[var(--txt)] mb-6">
                  Aviera Shop
                </h2>
                <p className="text-xl text-[var(--txt-muted)] mb-8 leading-relaxed">
                  Order premium supplements directly through our Supliful integration.
                  Quality guaranteed, fast shipping, hassle-free returns. Your perfect stack,
                  delivered to your door.
                </p>

                <div className="space-y-4 mb-8">
                  {[
                    'Premium quality supplements',
                    'Fast, reliable shipping',
                    'Secure checkout process',
                    'Money-back guarantee'
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-[var(--acc)] rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle size={16} className="text-[#001018]" />
                      </div>
                      <span className="text-[var(--txt-muted)] text-lg">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to="/shop"
                  className="btn-primary"
                >
                  Browse Products
                  <ArrowRight size={20} />
                </Link>
              </motion.div>

              {/* Visual */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: 'Creatine', price: '$33.90' },
                    { name: 'Protein', price: '$44.49' },
                    { name: 'Magnesium', price: '$24.90' },
                    { name: 'Omega-3', price: '$23.90' }
                  ].map((product, i) => (
                    <div key={i} className="glass-card p-6 hover:shadow-premium-lg transition-all duration-300">
                      <div className="w-full h-24 bg-[var(--acc)]/20 rounded-xl mb-4 flex items-center justify-center">
                        <div className="w-12 h-12 bg-[var(--acc)] rounded-lg opacity-60"></div>
                      </div>
                      <h4 className="font-bold text-[var(--txt)] mb-2">{product.name}</h4>
                      <p className="text-2xl font-bold text-[var(--acc)]">{product.price}</p>
                    </div>
                  ))}
                </div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[var(--acc)]/20 rounded-3xl -z-10 blur-2xl"></div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ========================================
            GOALS SECTION (4 Goal Cards)
            ======================================== */}
        <section
          id="goals"
          className="scroll-snap-section relative min-h-screen flex items-center bg-white py-32 px-4"
        >
          <div
            ref={goalsAnimation.ref}
            className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full slide-up ${goalsAnimation.isVisible ? 'visible' : ''}`}
          >
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold text-[var(--txt)] mb-6">
                Whatever Your Goal
              </h2>
              <p className="text-xl text-[var(--txt-muted)] max-w-2xl mx-auto">
                Personalized supplement stacks for every fitness journey.
              </p>
            </div>

            <GoalCards />
          </div>
        </section>

        {/* ========================================
            REVIEWS / TESTIMONIALS SECTION
            ======================================== */}
        <section
          id="reviews"
          className="scroll-snap-section relative min-h-screen flex items-center bg-gray-50 py-32 px-4"
        >
          <div
            ref={reviewsAnimation.ref}
            className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full slide-up ${reviewsAnimation.isVisible ? 'visible' : ''}`}
          >
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold text-[var(--txt)] mb-6">
                What Our Users Say
              </h2>
              <p className="text-xl text-[var(--txt-muted)] max-w-2xl mx-auto">
                Real results from real people transforming their fitness journey with Aivra.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Sarah M.',
                  role: 'Fitness Enthusiast',
                  quote: 'Finally understand what supplements I actually need. The AI recommendations were spot-on!',
                  rating: 5
                },
                {
                  name: 'Mike T.',
                  role: 'Competitive Lifter',
                  quote: 'The quiz made it so easy. My strength is up 20% in 8 weeks.',
                  rating: 5
                },
                {
                  name: 'Jessica L.',
                  role: 'Busy Professional',
                  quote: 'No more confusion. Simple stack, clear results. Perfect for my hectic lifestyle.',
                  rating: 5
                }
              ].map((review, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="glass rounded-3xl p-8 shadow-premium hover:shadow-premium-lg transition-all duration-300"
                >
                  <div className="flex mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="text-yellow-400 fill-current" size={20} />
                    ))}
                  </div>
                  <p className="text-[var(--txt)] leading-relaxed text-lg italic mb-6">"{review.quote}"</p>
                  <div className="font-semibold text-[var(--txt)] text-lg">{review.name}</div>
                  <div className="text-sm text-[var(--txt-muted)]">{review.role}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================
            FAQ SECTION
            ======================================== */}
        <section
          id="faq"
          className="scroll-snap-section relative min-h-screen flex items-center bg-white py-32 px-4"
        >
          <div
            ref={faqAnimation.ref}
            className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full slide-up ${faqAnimation.isVisible ? 'visible' : ''}`}
          >
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold text-[var(--txt)] mb-6">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-[var(--txt-muted)] max-w-2xl mx-auto">
                Everything you need to know about Aivra and our AI-powered recommendations.
              </p>
            </div>

            <FAQAccordion />
          </div>
        </section>

        {/* ========================================
            PREMIUM FEATURES SECTION
            ======================================== */}
        <section
          className="scroll-snap-section relative min-h-[60vh] flex items-center bg-gradient-to-b from-[var(--bg)] to-[var(--bg-elev-1)] text-[var(--txt)] py-32"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--acc)]/20 border border-[var(--acc)]/30 rounded-full mb-6">
                <Crown className="text-[var(--acc)]" size={20} />
                <span className="text-sm font-semibold text-[var(--acc)]">Premium Features</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-[var(--txt)] mb-4">
                Take Your Fitness to the Next Level
              </h2>
              <p className="text-lg text-[var(--txt-muted)] max-w-2xl mx-auto">
                Unlock AI-powered personalization, advanced tracking, and custom workout plans
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                { icon: Sparkles, title: 'AI Stack Builder', desc: 'Personalized supplement tracking with notifications' },
                { icon: Zap, title: 'Custom Workouts', desc: 'AI-generated plans with progressive overload' },
                { icon: Crown, title: '10% Shop Discount', desc: 'Save on all supplement purchases' },
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <GlassCard key={index} className="p-6 text-center">
                    <div className="w-16 h-16 bg-[var(--acc)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="text-[var(--acc)]" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--txt)] mb-2">{feature.title}</h3>
                    <p className="text-sm text-[var(--txt-muted)]">{feature.desc}</p>
                  </GlassCard>
                );
              })}
            </div>

            <div className="text-center">
              <Link to="/pricing">
                <button className="btn-primary group text-lg">
                  <Crown size={24} />
                  Get Premium
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={24} />
                </button>
              </Link>
              <p className="text-sm text-[var(--txt-muted)] mt-4">
                7-day free trial • Cancel anytime • $9.99/month
              </p>
            </div>
          </div>
        </section>

        {/* ========================================
            FINAL CTA SECTION
            ======================================== */}
        <section
          className="scroll-snap-section relative min-h-[80vh] flex items-center bg-[var(--bg)] text-[var(--txt)] py-32"
        >
          <div
            ref={ctaAnimation.ref}
            className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center slide-up ${ctaAnimation.isVisible ? 'visible' : ''}`}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="mb-8">
                <Sparkles className="mx-auto mb-6" size={64} />
              </div>

              <h2 className="text-5xl md:text-7xl font-bold text-[var(--txt)] mb-8">
                Ready to Get Started?
              </h2>

              <p className="text-xl md:text-2xl text-[var(--txt-muted)] mb-12 leading-relaxed max-w-3xl mx-auto">
                Simplify your supplement routine with Aviera. Get AI-powered recommendations
                in 2 minutes. Free to use, no credit card required.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
                <Link
                  to="/smartstack-ai"
                  className="btn-primary group text-lg"
                >
                  <Sparkles size={24} />
                  Build Your Stack
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={24} />
                </Link>

                <Link
                  to="/smartfitt"
                  className="btn-secondary text-lg"
                >
                  <Dumbbell size={24} />
                  Get Workout Plan
                </Link>
              </div>

              <div className="flex flex-wrap justify-center gap-8 text-sm md:text-base opacity-90">
                <div className="flex items-center gap-2">
                  <CheckCircle size={20} />
                  <span>100% Free to Use</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={20} />
                  <span>No Credit Card Required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={20} />
                  <span>Instant Results</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ========================================
            ABOUT SECTION
            ======================================== */}
        <section
          id="about"
          className="scroll-snap-section relative min-h-screen flex items-center bg-[var(--bg)] py-32 px-4"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            {/* Section Title */}
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold text-[var(--txt)] mb-6">
                About Aviera
              </h2>
              <p className="text-lg md:text-xl text-[var(--txt-muted)] max-w-3xl mx-auto">
                Built by fitness enthusiasts, for everyone on a fitness journey.
              </p>
            </div>

            <div className="grid lg:grid-cols-5 gap-12 items-center">
              {/* Photo Column (40%) */}
              <div className="lg:col-span-2">
                <div className="relative">
                    <div className="absolute inset-0 bg-[var(--acc)]/20 rounded-2xl blur-xl"></div>
                  <div className="relative rounded-2xl overflow-hidden shadow-premium-lg">
                    {/* Placeholder for founder photo - user will upload separately */}
                    <div className="aspect-[3/4] bg-gradient-to-br from-[var(--charcoal-light)] to-[var(--bg)] flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-24 h-24 mx-auto mb-4 bg-[var(--acc)] rounded-full flex items-center justify-center text-[#001018] text-3xl font-bold shadow-accent">
                          RT
                        </div>
                        <p className="text-[var(--txt)] text-sm">Founder Photo</p>
                        <p className="text-[var(--txt-muted)] text-xs mt-1">Upload Coming Soon</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio Column (60%) */}
              <div className="lg:col-span-3">
                <div className="glass-card p-8 md:p-12">
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                    Why I Built Aviera
                  </h3>
                  <div className="space-y-6">
                    <p className="text-lg md:text-xl text-[#e5e5e5] leading-relaxed">
                      I am <strong className="text-white">Reece Todd</strong>, a passionate fitness enthusiast who learned firsthand how powerful the right supplements can be when they're simple, consistent, and matched to your goals.
                    </p>
                    <p className="text-lg md:text-xl text-[#e5e5e5] leading-relaxed">
                      I built <strong className="text-white">Aviera</strong> to help you stop guessing which supplements actually help you reach your goals. Whether you are building muscle, cutting fat, or optimizing health — Aviera's AI creates your perfect starting stack instantly.
                    </p>
                    <p className="text-lg md:text-xl text-[#e5e5e5] leading-relaxed">
                      The supplement industry is overwhelming. Hundreds of products, conflicting advice, and aggressive marketing make it nearly impossible to know where to start. <strong className="text-white">That confusion ends here.</strong>
                    </p>
                    <p className="text-lg md:text-xl text-[#e5e5e5] leading-relaxed">
                      What I love most: if you are brand-new and do not know where to begin, Aviera gets you on the right track fast. No confusion, no overwhelm—just a clear, science-backed plan you can actually follow.
                    </p>
                  </div>
                  <div className="mt-8 pt-8 border-t border-white/10">
                    <p className="text-white font-semibold text-lg">Reece Todd</p>
                    <p className="text-sm text-[#a0a0a0] mt-1">Founder, Aivra</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================
            CONTACT SECTION
            ======================================== */}
        <section
          id="contact"
          className="scroll-snap-section relative min-h-screen flex items-center bg-white py-32 px-4"
        >
          <div
            ref={contactAnimation.ref}
            className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full slide-up ${contactAnimation.isVisible ? 'visible' : ''}`}
          >
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold text-[var(--txt)] mb-6">
                Get In Touch
              </h2>
              <p className="text-xl text-[var(--txt-muted)] max-w-2xl mx-auto">
                Have questions? We're here to help. Send us a message and we'll get back to you as soon as possible.
              </p>
            </div>

            <ContactForm />
          </div>
        </section>
      </div>
    </>
  );
}
