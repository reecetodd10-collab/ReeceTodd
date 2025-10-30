import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Dumbbell, Brain, Heart, Zap, Star, Sparkles, Target, Pill, ShoppingCart, Award } from 'lucide-react';
import PillLogo from '../components/PillLogo';
import ParallaxLayer from '../components/ParallaxLayer';
import PromoBanner from '../components/PromoBanner';
import SectionIndicators from '../components/SectionIndicators';
import { useActiveSection } from '../hooks/useScrollAnimation';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function Home() {
  // Define all sections for navigation
  const sections = [
    { id: 'hero', label: 'Home' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'smartstack-ai', label: 'SmartStack AI' },
    { id: 'smartfitt', label: 'SmartFitt' },
    { id: 'shop', label: 'Shop' },
    { id: 'benefits', label: 'Benefits' },
  ];

  // Track active section for indicators
  const activeSection = useActiveSection(sections.map(s => s.id));

  // Scroll animation hooks
  const heroAnimation = useScrollAnimation({ threshold: 0.2, once: true });
  const howItWorksAnimation = useScrollAnimation({ threshold: 0.2, once: true });
  const smartstackAnimation = useScrollAnimation({ threshold: 0.2, once: true });
  const smartfittAnimation = useScrollAnimation({ threshold: 0.2, once: true });
  const shopAnimation = useScrollAnimation({ threshold: 0.2, once: true });
  const benefitsAnimation = useScrollAnimation({ threshold: 0.2, once: true });
  const ctaAnimation = useScrollAnimation({ threshold: 0.2, once: true });

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
          className="scroll-snap-section relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-primary to-slate-900 text-white overflow-hidden parallax-container"
        >
          <ParallaxLayer depth={10} speed={0.2} className="absolute inset-0">
            <div className="w-full h-full bg-gradient-to-br from-slate-900 via-primary to-slate-900"></div>
          </ParallaxLayer>

          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>

          <div
            ref={heroAnimation.ref}
            className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center slide-up ${heroAnimation.isVisible ? 'visible' : ''}`}
          >
            <ParallaxLayer depth={30} speed={0.8} className="flex justify-center mb-8">
              <PillLogo size="large" shimmer={true} />
            </ParallaxLayer>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6">
              Meet SmartSupp<br />
              <span className="text-accent">Your AI-Powered</span><br />
              <span className="text-accent">Supplement Advisor</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto mb-10">
              Smart supplements for smart goals. Get the perfect stack for your fitness journey —
              built in minutes by AI. Science-backed, personalized, simple.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={() => document.getElementById('smartstack-ai').scrollIntoView({ behavior: 'smooth' })}
                className="group px-10 py-5 bg-gradient-to-r from-primary via-accent to-violet text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-accent/50 transition-all hover:scale-105 flex items-center gap-2"
              >
                Get Your Stack
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={24} />
              </button>
              <button
                onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
                className="px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
              >
                See How It Works
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-sm md:text-base">
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-accent" />
                <span>Science-backed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-accent" />
                <span>Takes 2 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-accent" />
                <span>42+ supplements analyzed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-accent" />
                <span>AI-powered recommendations</span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
              <div className="w-1 h-3 bg-white/50 rounded-full"></div>
            </div>
          </div>
        </section>

        {/* ========================================
            HOW IT WORKS SECTION
            ======================================== */}
        <section
          id="how-it-works"
          className="scroll-snap-section relative min-h-screen flex items-center bg-white py-20"
        >
          <div
            ref={howItWorksAnimation.ref}
            className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full slide-up ${howItWorksAnimation.isVisible ? 'visible' : ''}`}
          >
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                How It Works
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
                  gradient: 'from-primary to-accent',
                  bg: 'from-blue-50 to-cyan-50'
                },
                {
                  step: '2',
                  title: 'AI Builds Your Stack',
                  description: 'Our AI analyzes 42+ supplements and creates your personalized recommendation.',
                  icon: Brain,
                  gradient: 'from-accent to-violet',
                  bg: 'from-cyan-50 to-violet-50'
                },
                {
                  step: '3',
                  title: 'Shop & Optimize',
                  description: 'Order premium supplements with fast shipping. Track progress and refine your stack.',
                  icon: ShoppingCart,
                  gradient: 'from-violet to-purple-600',
                  bg: 'from-violet-50 to-purple-50'
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
                  {/* Matching icon style - Rounded square with gradient */}
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-20 rounded-2xl blur-xl`}></div>
                      <div className={`relative w-24 h-24 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center shadow-xl`}>
                        <item.icon className="text-white" size={40} />
                      </div>
                    </div>
                  </div>

                  <div className={`inline-block px-4 py-2 bg-gradient-to-r ${item.gradient} rounded-full text-white font-bold text-sm mb-4`}>
                    Step {item.step}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================
            SMARTSTACK AI SECTION
            ======================================== */}
        <section
          id="smartstack-ai"
          className="scroll-snap-section relative min-h-screen flex items-center bg-gradient-to-br from-gray-50 to-blue-50 py-20"
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
                {/* Matching icon style - Rounded square with gradient */}
                <div className="flex lg:justify-start justify-center mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-20 rounded-3xl blur-2xl"></div>
                    <div className="relative w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center shadow-2xl">
                      <Sparkles className="text-white" size={56} />
                    </div>
                  </div>
                </div>

                <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                  SmartStack AI
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
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
                      <div className="w-6 h-6 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle size={16} className="text-white" />
                      </div>
                      <span className="text-gray-700 text-lg">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to="/smartstack-ai"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary via-accent to-violet text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-accent/50 transition-all hover:scale-105 gap-2"
                >
                  Build Your Stack
                  <ArrowRight size={20} />
                </Link>
              </motion.div>

              {/* Visual/Image */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="relative p-8 bg-white rounded-3xl shadow-2xl border border-gray-200">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                        <Target className="text-white" size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-2 bg-gray-100 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl">
                      <div className="w-12 h-12 bg-gradient-to-br from-violet to-purple-600 rounded-xl flex items-center justify-center">
                        <Pill className="text-white" size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                        <div className="h-2 bg-gray-100 rounded w-1/3"></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-xl">
                      <div className="w-12 h-12 bg-gradient-to-br from-accent to-cyan-600 rounded-xl flex items-center justify-center">
                        <Award className="text-white" size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="h-3 bg-gray-200 rounded w-4/5 mb-2"></div>
                        <div className="h-2 bg-gray-100 rounded w-2/5"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-primary/20 to-violet/20 rounded-3xl -z-10 blur-2xl"></div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ========================================
            SMARTFITT SECTION
            ======================================== */}
        <section
          id="smartfitt"
          className="scroll-snap-section relative min-h-screen flex items-center bg-white py-20"
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
                <div className="relative p-8 bg-gradient-to-br from-violet-50 to-purple-50 rounded-3xl shadow-2xl border border-violet-200">
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="inline-block px-6 py-3 bg-gradient-to-r from-violet to-purple-600 rounded-full text-white font-bold mb-4">
                        Your Workout Plan
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white rounded-xl">
                          <div className="text-3xl font-bold text-violet mb-1">4</div>
                          <div className="text-sm text-gray-600">Days/Week</div>
                        </div>
                        <div className="p-4 bg-white rounded-xl">
                          <div className="text-3xl font-bold text-violet mb-1">60</div>
                          <div className="text-sm text-gray-600">Min/Session</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-violet/20 to-purple/20 rounded-3xl -z-10 blur-2xl"></div>
              </motion.div>

              {/* Icon and Content - Right side */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="order-1 lg:order-2"
              >
                {/* Matching icon style - Rounded square with gradient */}
                <div className="flex lg:justify-start justify-center mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet to-purple-600 opacity-20 rounded-3xl blur-2xl"></div>
                    <div className="relative w-32 h-32 bg-gradient-to-br from-violet to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
                      <Dumbbell className="text-white" size={56} />
                    </div>
                  </div>
                </div>

                <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                  SmartFitt
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
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
                      <div className="w-6 h-6 bg-gradient-to-r from-violet to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle size={16} className="text-white" />
                      </div>
                      <span className="text-gray-700 text-lg">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to="/smartfitt"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-violet via-purple-600 to-violet text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-violet/50 transition-all hover:scale-105 gap-2"
                >
                  Get Workout Plan
                  <ArrowRight size={20} />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ========================================
            SHOP SECTION
            ======================================== */}
        <section
          id="shop"
          className="scroll-snap-section relative min-h-screen flex items-center bg-gradient-to-br from-gray-50 to-cyan-50 py-20"
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
                {/* Matching icon style - Rounded square with gradient */}
                <div className="flex lg:justify-start justify-center mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent to-cyan-600 opacity-20 rounded-3xl blur-2xl"></div>
                    <div className="relative w-32 h-32 bg-gradient-to-br from-accent to-cyan-600 rounded-3xl flex items-center justify-center shadow-2xl">
                      <ShoppingCart className="text-white" size={56} />
                    </div>
                  </div>
                </div>

                <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                  Shop Seamlessly
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
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
                      <div className="w-6 h-6 bg-gradient-to-r from-accent to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle size={16} className="text-white" />
                      </div>
                      <span className="text-gray-700 text-lg">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to="/shop"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-accent via-cyan-600 to-accent text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-accent/50 transition-all hover:scale-105 gap-2"
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
                    { name: 'Creatine', price: '$33.90', gradient: 'from-blue-500 to-cyan-500' },
                    { name: 'Protein', price: '$44.49', gradient: 'from-cyan-500 to-teal-500' },
                    { name: 'Magnesium', price: '$24.90', gradient: 'from-violet-500 to-purple-500' },
                    { name: 'Omega-3', price: '$23.90', gradient: 'from-emerald-500 to-green-500' }
                  ].map((product, i) => (
                    <div key={i} className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all">
                      <div className={`w-full h-24 bg-gradient-to-br ${product.gradient} rounded-xl mb-4`}></div>
                      <h4 className="font-bold text-gray-900 mb-2">{product.name}</h4>
                      <p className="text-2xl font-bold text-primary">{product.price}</p>
                    </div>
                  ))}
                </div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-accent/20 to-cyan/20 rounded-3xl -z-10 blur-2xl"></div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ========================================
            BENEFITS SECTION
            ======================================== */}
        <section
          id="benefits"
          className="scroll-snap-section relative min-h-screen flex items-center bg-white py-20"
        >
          <div
            ref={benefitsAnimation.ref}
            className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full slide-up ${benefitsAnimation.isVisible ? 'visible' : ''}`}
          >
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Whatever Your Goal
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Personalized supplement stacks for every fitness journey.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {[
                {
                  icon: Dumbbell,
                  title: 'Build Muscle & Strength',
                  desc: 'Optimized stacks for size, power, and performance.',
                  gradient: 'from-primary via-accent to-violet'
                },
                {
                  icon: Brain,
                  title: 'Improve Focus & Energy',
                  desc: 'Mental clarity and sustained energy throughout the day.',
                  gradient: 'from-accent via-violet to-primary'
                },
                {
                  icon: Heart,
                  title: 'Overall Health & Longevity',
                  desc: 'Foundation for disease prevention and vitality.',
                  gradient: 'from-violet via-primary to-accent'
                },
                {
                  icon: Zap,
                  title: 'Slim & Recomp',
                  desc: 'Lean definition while maintaining muscle mass.',
                  gradient: 'from-primary via-violet to-accent'
                }
              ].map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="group p-8 bg-gray-50 rounded-2xl hover:shadow-xl transition-all"
                >
                  <div className={`w-16 h-16 mb-6 bg-gradient-to-br ${benefit.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <benefit.icon className="text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">{benefit.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Testimonials */}
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
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border border-gray-200"
                >
                  <div className="flex mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="text-yellow-400 fill-current" size={18} />
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed italic mb-4">"{review.quote}"</p>
                  <div className="font-semibold text-gray-900">{review.name}</div>
                  <div className="text-sm text-gray-600">{review.role}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================
            FINAL CTA SECTION
            ======================================== */}
        <section
          className="scroll-snap-section relative min-h-[80vh] flex items-center bg-gradient-to-r from-primary via-accent to-violet text-white py-20"
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

              <h2 className="text-5xl md:text-7xl font-bold mb-8">
                Ready to Get Started?
              </h2>

              <p className="text-xl md:text-2xl text-slate-100 mb-12 leading-relaxed max-w-3xl mx-auto">
                Simplify your supplement routine with SmartSupp. Get AI-powered recommendations
                in 2 minutes. Free to use, no credit card required.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
                <Link
                  to="/smartstack-ai"
                  className="group px-12 py-6 bg-white text-primary rounded-xl font-bold text-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-3"
                >
                  <Sparkles size={24} />
                  Build Your Stack
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={24} />
                </Link>

                <Link
                  to="/smartfitt"
                  className="px-12 py-6 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-xl font-bold text-xl hover:bg-white/20 transition-all flex items-center gap-3"
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
      </div>
    </>
  );
}
