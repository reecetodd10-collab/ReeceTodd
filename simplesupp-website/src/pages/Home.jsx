import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Dumbbell, Brain, Heart, Zap, Star, Sparkles, Target, Pill, Activity, ShoppingCart, Award, TrendingUp, Users } from 'lucide-react';
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
    { id: 'features', label: 'Features' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'benefits', label: 'Benefits' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'pricing', label: 'Pricing' },
  ];

  // Track active section for indicators
  const activeSection = useActiveSection(sections.map(s => s.id));

  // Scroll animation hook for fade-in effects
  const heroAnimation = useScrollAnimation({ threshold: 0.2, once: true });
  const featuresAnimation = useScrollAnimation({ threshold: 0.2, once: true });
  const howItWorksAnimation = useScrollAnimation({ threshold: 0.2, once: true });
  const benefitsAnimation = useScrollAnimation({ threshold: 0.2, once: true });
  const testimonialsAnimation = useScrollAnimation({ threshold: 0.2, once: true });
  const pricingAnimation = useScrollAnimation({ threshold: 0.2, once: true });

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
          {/* Parallax Background Layer */}
          <ParallaxLayer depth={10} speed={0.2} className="absolute inset-0">
            <div className="w-full h-full bg-gradient-to-br from-slate-900 via-primary to-slate-900"></div>
          </ParallaxLayer>

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>

          <div
            ref={heroAnimation.ref}
            className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center slide-up ${heroAnimation.isVisible ? 'visible' : ''}`}
          >
            {/* Parallax Floating Logo */}
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
              <Link
                to="/smartstack-ai"
                className="group px-10 py-5 bg-gradient-to-r from-primary via-accent to-violet text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-accent/50 transition-all hover:scale-105 flex items-center gap-2"
              >
                Get Your Stack
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={24} />
              </Link>
              <button
                onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
                className="px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
              >
                See How It Works
              </button>
            </div>

            {/* Trust Indicators */}
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
                <span>10,000+ stacks built</span>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
              <div className="w-1 h-3 bg-white/50 rounded-full"></div>
            </div>
          </div>
        </section>

        {/* ========================================
            FEATURES SECTION
            ======================================== */}
        <section
          id="features"
          className="scroll-snap-section relative min-h-screen flex items-center bg-white py-20"
        >
          <div
            ref={featuresAnimation.ref}
            className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full slide-up ${featuresAnimation.isVisible ? 'visible' : ''}`}
          >
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Three Smart Tools.<br />
                One Perfect Stack.
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our AI-powered platform combines cutting-edge technology with scientific research
                to deliver personalized supplement recommendations.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* SmartStack AI Feature */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="group relative p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary"
              >
                <div className="w-16 h-16 mb-6 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                  <Sparkles className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">SmartStack AI</h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Answer a quick quiz and get an AI-generated supplement stack tailored to your goals,
                  lifestyle, and experience level. Science meets simplicity.
                </p>
                <Link
                  to="/smartstack-ai"
                  className="inline-flex items-center text-primary font-semibold hover:gap-2 transition-all"
                >
                  Build Your Stack <ArrowRight size={18} className="ml-1" />
                </Link>
              </motion.div>

              {/* SmartFitt Feature */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="group relative p-8 bg-gradient-to-br from-violet-50 to-purple-50 rounded-3xl hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-violet"
              >
                <div className="w-16 h-16 mb-6 bg-gradient-to-br from-violet to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet/30 group-hover:scale-110 transition-transform">
                  <Dumbbell className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">SmartFitt</h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Get personalized workout recommendations powered by AI. Match your training plan
                  with the perfect supplement stack for maximum results.
                </p>
                <Link
                  to="/smartfitt"
                  className="inline-flex items-center text-violet font-semibold hover:gap-2 transition-all"
                >
                  Get Workout Plan <ArrowRight size={18} className="ml-1" />
                </Link>
              </motion.div>

              {/* Shop Feature */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="group relative p-8 bg-gradient-to-br from-cyan-50 to-teal-50 rounded-3xl hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-accent"
              >
                <div className="w-16 h-16 mb-6 bg-gradient-to-br from-accent to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg shadow-accent/30 group-hover:scale-110 transition-transform">
                  <ShoppingCart className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Shop Seamlessly</h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Order premium supplements directly through our Supliful integration.
                  Fast shipping, quality guaranteed, hassle-free.
                </p>
                <Link
                  to="/shop"
                  className="inline-flex items-center text-accent font-semibold hover:gap-2 transition-all"
                >
                  Browse Products <ArrowRight size={18} className="ml-1" />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ========================================
            HOW IT WORKS SECTION
            ======================================== */}
        <section
          id="how-it-works"
          className="scroll-snap-section relative min-h-screen flex items-center bg-gray-50 py-20"
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
                Simple. Smart. Personalized. Get your perfect stack in minutes.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  step: '1',
                  title: 'Share Goals & Basics',
                  description: 'Tell us about your fitness goals, lifestyle, and what you want to achieve.',
                  gradient: 'from-primary to-accent',
                  bg: 'from-blue-50 to-cyan-50',
                  icon: Target
                },
                {
                  step: '2',
                  title: 'AI Builds Your Stack',
                  description: 'SmartSupp Intelligence analyzes 42+ supplements and builds your optimal plan.',
                  gradient: 'from-accent to-violet',
                  bg: 'from-cyan-50 to-violet-50',
                  icon: Brain
                },
                {
                  step: '3',
                  title: 'Follow & Optimize',
                  description: 'Get your personalized stack, track progress, and refine as you learn what works.',
                  gradient: 'from-violet to-purple-600',
                  bg: 'from-violet-50 to-purple-50',
                  icon: TrendingUp
                },
                {
                  step: '4',
                  title: 'Shop Seamlessly',
                  description: 'Order premium supplements directly through our Supliful integration with fast shipping.',
                  gradient: 'from-purple-600 to-pink-600',
                  bg: 'from-purple-50 to-pink-50',
                  icon: ShoppingCart
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className={`text-center p-8 rounded-3xl bg-gradient-to-br ${item.bg} border border-gray-200 hover:shadow-xl transition-all`}
                >
                  <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-r ${item.gradient} rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg`}>
                    {item.step}
                  </div>
                  <div className="mb-4">
                    <item.icon className="mx-auto text-gray-700" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-16">
              <Link
                to="/smartstack-ai"
                className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-primary via-accent to-violet text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-accent/50 transition-all hover:scale-105"
              >
                Start Now — It's Free <ArrowRight className="ml-2" size={24} />
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================
            BENEFITS / VALUE PROPS SECTION
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
                We've got you covered with personalized stacks for every fitness journey.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  icon: Dumbbell,
                  title: 'Build Muscle & Strength',
                  desc: 'Optimized stacks for size, power, and performance. Fuel your gains with science-backed supplements.',
                  gradient: 'from-primary via-accent to-violet',
                  bgGradient: 'from-blue-500/10 via-cyan-500/10 to-blue-500/5'
                },
                {
                  icon: Brain,
                  title: 'Improve Focus & Energy',
                  desc: 'Mental clarity and sustained energy throughout the day. Stay sharp, focused, and productive.',
                  gradient: 'from-accent via-violet to-primary',
                  bgGradient: 'from-cyan-500/10 via-violet-500/10 to-cyan-500/5'
                },
                {
                  icon: Heart,
                  title: 'Overall Health & Longevity',
                  desc: 'Foundation for disease prevention and vitality. Invest in your long-term health and wellness.',
                  gradient: 'from-violet via-primary to-accent',
                  bgGradient: 'from-violet-500/10 via-primary/10 to-violet-500/5'
                },
                {
                  icon: Zap,
                  title: 'Slim & Recomp',
                  desc: 'Lean definition while maintaining muscle mass. Achieve your dream physique with smart supplementation.',
                  gradient: 'from-primary via-violet to-accent',
                  bgGradient: 'from-primary/10 via-violet-500/10 to-accent/5'
                }
              ].map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className={`group p-10 bg-gradient-to-br ${benefit.bgGradient} rounded-3xl shadow-sm hover:shadow-2xl transition-all border-2 border-white backdrop-blur-sm hover:scale-105`}
                >
                  <div className={`w-20 h-20 mb-6 bg-gradient-to-br ${benefit.gradient} rounded-2xl flex items-center justify-center shadow-xl`}>
                    <benefit.icon className="text-white" size={36} />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">{benefit.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              {[
                { icon: Users, stat: '10,000+', label: 'Happy Users' },
                { icon: Award, stat: '42+', label: 'Supplements' },
                { icon: Star, stat: '4.9/5', label: 'Rating' },
                { icon: TrendingUp, stat: '95%', label: 'See Results' }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center p-6 bg-gray-50 rounded-2xl"
                >
                  <item.icon className="mx-auto mb-3 text-primary" size={32} />
                  <div className="text-4xl font-bold text-gray-900 mb-2">{item.stat}</div>
                  <div className="text-sm text-gray-600 font-medium">{item.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================
            TESTIMONIALS SECTION
            ======================================== */}
        <section
          id="testimonials"
          className="scroll-snap-section relative min-h-screen flex items-center bg-gradient-to-br from-gray-50 to-blue-50 py-20"
        >
          <div
            ref={testimonialsAnimation.ref}
            className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full slide-up ${testimonialsAnimation.isVisible ? 'visible' : ''}`}
          >
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                What People Are Saying
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Join thousands who have transformed their fitness journey with SmartSupp.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Sarah M.',
                  role: 'Fitness Enthusiast',
                  quote: 'Finally understand what supplements I actually need. Lost 15lbs and feeling amazing! The AI recommendations were spot-on.',
                  rating: 5,
                  image: '👩‍🦰'
                },
                {
                  name: 'Mike T.',
                  role: 'Competitive Lifter',
                  quote: 'The quiz made it so easy. My strength is up 20% in 8 weeks. SmartSupp nailed my stack perfectly.',
                  rating: 5,
                  image: '👨‍🦲'
                },
                {
                  name: 'Jessica L.',
                  role: 'Busy Professional',
                  quote: 'No more confusion. Simple stack, clear results. Love it! Perfect for my hectic lifestyle.',
                  rating: 5,
                  image: '👩‍💼'
                }
              ].map((review, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all border border-gray-200"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-5xl">{review.image}</div>
                    <div>
                      <div className="font-bold text-gray-900 text-lg">{review.name}</div>
                      <div className="text-sm text-gray-600">{review.role}</div>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="text-yellow-400 fill-current" size={20} />
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed italic">"{review.quote}"</p>
                </motion.div>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center items-center gap-8 mt-16">
              <div className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-md">
                <CheckCircle className="text-green-500" size={24} />
                <span className="font-semibold text-gray-700">Science-Backed</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-md">
                <CheckCircle className="text-green-500" size={24} />
                <span className="font-semibold text-gray-700">3rd Party Tested</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-md">
                <CheckCircle className="text-green-500" size={24} />
                <span className="font-semibold text-gray-700">Money-Back Guarantee</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================
            PRICING / FINAL CTA SECTION
            ======================================== */}
        <section
          id="pricing"
          className="scroll-snap-section relative min-h-screen flex items-center bg-gradient-to-r from-primary via-accent to-violet text-white py-20"
        >
          <div
            ref={pricingAnimation.ref}
            className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center slide-up ${pricingAnimation.isVisible ? 'visible' : ''}`}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="mb-8">
                <Sparkles className="mx-auto mb-6" size={64} />
              </div>

              <h2 className="text-5xl md:text-7xl font-bold mb-8">
                Ready for Your<br />
                Personalized Stack?
              </h2>

              <p className="text-xl md:text-2xl text-slate-100 mb-4 leading-relaxed max-w-3xl mx-auto">
                Join thousands who have simplified their supplement routine with SmartSupp.
              </p>

              <p className="text-lg text-slate-200 mb-12 max-w-2xl mx-auto">
                Get your AI-powered recommendations in 2 minutes. Free to use, no credit card required.
                Start your transformation today.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
                <Link
                  to="/smartstack-ai"
                  className="group px-12 py-6 bg-white text-primary rounded-xl font-bold text-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-3"
                >
                  <Pill size={24} />
                  Get Your Stack Now
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={24} />
                </Link>

                <Link
                  to="/smartfitt"
                  className="px-12 py-6 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-xl font-bold text-xl hover:bg-white/20 transition-all flex items-center gap-3"
                >
                  <Dumbbell size={24} />
                  Try SmartFitt
                </Link>
              </div>

              {/* Final Trust Row */}
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
                <div className="flex items-center gap-2">
                  <CheckCircle size={20} />
                  <span>10,000+ Happy Users</span>
                </div>
              </div>

              <p className="mt-12 text-slate-300 text-sm">
                Get 10% off your first purchase when you sign up for our newsletter
              </p>
            </motion.div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
        </section>
      </div>
    </>
  );
}
