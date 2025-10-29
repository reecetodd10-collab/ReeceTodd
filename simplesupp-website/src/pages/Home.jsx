import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Dumbbell, Brain, Heart, Zap, Star } from 'lucide-react';
import PillLogo from '../components/PillLogo';
import EmailCapture from '../components/EmailCapture';

export default function Home() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-primary to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <motion.div className="text-center space-y-8" {...fadeInUp}>
            <div className="flex justify-center">
              <PillLogo size="large" shimmer={true} />
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Meet SmartSupp<br />
              <span className="text-accent">Your AI-powered supplement advisor</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto">
              Smart supplements for smart goals. Get the perfect stack for your goals — built in minutes by AI.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/smartstack-ai"
                className="px-8 py-4 bg-gradient-to-r from-primary via-accent to-violet text-white rounded-lg font-bold text-lg hover:shadow-2xl hover:shadow-accent/50 transition-all hover:scale-105 flex items-center"
              >
                Get Your Stack <ArrowRight className="ml-2" size={20} />
              </Link>
              <a
                href="#how-it-works"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg font-semibold hover:bg-white/20 transition-all"
              >
                Learn How It Works
              </a>
            </div>

            {/* Trust Row */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-sm md:text-base opacity-90">
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
                <span>40+ supplements analyzed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-accent" />
                <span>No spam, ever</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">Simple. Smart. Personalized.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-primary/10"
              whileHover={{ y: -5 }}
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-primary/30">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Share Goals & Basics</h3>
              <p className="text-gray-600">
                Tell us about your fitness goals, lifestyle, and what you want to achieve.
              </p>
            </motion.div>

            <motion.div
              className="text-center p-8 rounded-2xl bg-gradient-to-br from-cyan-50 to-violet-50 border border-accent/10"
              whileHover={{ y: -5 }}
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-accent to-violet rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-accent/30">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">AI Builds Your Stack</h3>
              <p className="text-gray-600">
                SmartSupp Intelligence analyzes 42+ supplements and builds your optimal plan.
              </p>
            </motion.div>

            <motion.div
              className="text-center p-8 rounded-2xl bg-gradient-to-br from-violet-50 to-pink-50 border border-violet/10"
              whileHover={{ y: -5 }}
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-violet to-pink-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-violet/30">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Follow & Optimize</h3>
              <p className="text-gray-600">
                Get your personalized stack, track progress, and refine as you learn what works.
              </p>
            </motion.div>

            <motion.div
              className="text-center p-8 rounded-2xl bg-gradient-to-br from-pink-50 to-blue-50 border border-pink-500/10"
              whileHover={{ y: -5 }}
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-pink-500 to-primary rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-pink-500/30">
                4
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Shop Seamlessly</h3>
              <p className="text-gray-600">
                Order premium supplements directly through our Supliful integration with fast shipping.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Whatever Your Goal
            </h2>
            <p className="text-xl text-gray-600">We've got you covered.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: Dumbbell,
                title: 'Build Muscle & Strength',
                desc: 'Optimized stacks for size, power, and performance',
                color: 'from-primary to-accent',
                bgGradient: 'from-blue-500/10 via-cyan-500/10 to-blue-500/5'
              },
              {
                icon: Brain,
                title: 'Improve Focus & Energy',
                desc: 'Mental clarity and sustained energy throughout the day',
                color: 'from-accent to-violet',
                bgGradient: 'from-cyan-500/10 via-violet-500/10 to-cyan-500/5'
              },
              {
                icon: Heart,
                title: 'Overall Health & Longevity',
                desc: 'Foundation for disease prevention and vitality',
                color: 'from-green-500 to-emerald-600',
                bgGradient: 'from-green-500/10 via-emerald-500/10 to-green-500/5'
              },
              {
                icon: Zap,
                title: 'Slim & Recomp',
                desc: 'Lean definition while maintaining muscle mass',
                color: 'from-violet to-primary',
                bgGradient: 'from-violet-500/10 via-primary/10 to-violet-500/5'
              }
            ].map((benefit, i) => (
              <motion.div
                key={i}
                className={`p-8 bg-gradient-to-br ${benefit.bgGradient} rounded-2xl shadow-sm hover:shadow-xl transition-all border-2 border-white backdrop-blur-sm`}
                whileHover={{ scale: 1.03, y: -5 }}
              >
                <div className={`w-16 h-16 mb-6 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center shadow-lg shadow-${benefit.color}/30`}>
                  <benefit.icon className="text-white" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Email Capture */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <EmailCapture />
        </div>
      </section>

      {/* Featured Stacks */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Featured Supplements
            </h2>
            <p className="text-xl text-gray-600">Science-backed essentials in every stack</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Creatine Monohydrate',
                desc: 'Most researched supplement for strength & power',
                price: '$33.90',
                gradient: 'from-blue-500 via-cyan-500 to-blue-600',
                icon: '💪'
              },
              {
                name: 'Whey Protein Isolate',
                desc: 'Fast protein for muscle recovery & growth',
                price: '$44.49',
                gradient: 'from-cyan-500 via-violet-500 to-cyan-600',
                icon: '🥤'
              },
              {
                name: 'Magnesium Glycinate',
                desc: 'Better sleep, recovery, and calm',
                price: '$24.90',
                gradient: 'from-violet-500 via-purple-500 to-violet-600',
                icon: '😴'
              },
              {
                name: 'Omega-3 Fish Oil',
                desc: 'Heart health, brain function, inflammation',
                price: '$23.90',
                gradient: 'from-emerald-500 via-green-500 to-emerald-600',
                icon: '❤️'
              }
            ].map((supp, i) => (
              <motion.div
                key={i}
                className="group p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all border-2 border-gray-100 hover:border-transparent overflow-hidden relative"
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${supp.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                <div className="relative z-10">
                  <div className="text-4xl mb-4">{supp.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">{supp.name}</h3>
                  <p className="text-sm text-gray-600 mb-4 min-h-[40px]">{supp.desc}</p>
                  <p className={`text-2xl font-bold mb-4 bg-gradient-to-r ${supp.gradient} bg-clip-text text-transparent`}>
                    {supp.price}
                  </p>
                  <Link
                    to="/shop"
                    className={`block text-center py-3 px-4 bg-gradient-to-r ${supp.gradient} text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-${supp.gradient}/30 transition-all transform hover:scale-105`}
                  >
                    Add to Cart
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What People Are Saying
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah M.', quote: 'Finally understand what supplements I actually need. Lost 15lbs and feeling amazing!', rating: 5 },
              { name: 'Mike T.', quote: 'The quiz made it so easy. My strength is up 20% in 8 weeks.', rating: 5 },
              { name: 'Jessica L.', quote: 'No more confusion. Simple stack, clear results. Love it!', rating: 5 }
            ].map((review, i) => (
              <div key={i} className="p-6 bg-gray-50 rounded-2xl">
                <div className="flex mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-current" size={20} />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{review.quote}"</p>
                <p className="font-semibold text-gray-900">— {review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-primary via-accent to-violet text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready for Your Personalized Stack?
          </h2>
          <p className="text-xl mb-8 text-slate-100">
            Join thousands who have simplified their supplement routine with SmartSupp.
          </p>
          <Link
            to="/smartstack-ai"
            className="inline-flex items-center px-8 py-4 bg-white text-primary rounded-lg font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all"
          >
            Get Your Stack Now <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
