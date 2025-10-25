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
      <section className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <motion.div className="text-center space-y-8" {...fadeInUp}>
            <div className="flex justify-center">
              <PillLogo size="large" />
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Personalized Supplement Stacks<br />
              <span className="text-accent">Made Simple.</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Tell us your goals and basics, and our Supplement Stack Intelligence builds a clear starting plan you can actually follow.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/suppstack-ai"
                className="px-8 py-4 bg-gradient-to-r from-primary to-purple text-white rounded-lg font-bold text-lg hover:shadow-2xl hover:shadow-primary/50 transition-all flex items-center"
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
                <span>30+ supplements analyzed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-accent" />
                <span>No spam</span>
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

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 border border-primary/10"
              whileHover={{ y: -5 }}
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary to-purple rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Share Goals & Basics</h3>
              <p className="text-gray-600">
                Tell us about your fitness goals, lifestyle, and what you want to achieve.
              </p>
            </motion.div>

            <motion.div
              className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple/10"
              whileHover={{ y: -5 }}
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple to-pink-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">We Generate Your Stack</h3>
              <p className="text-gray-600">
                Our SuppStack Intelligence analyzes 30+ supplements and builds your optimal plan.
              </p>
            </motion.div>

            <motion.div
              className="text-center p-8 rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 border border-accent/10"
              whileHover={{ y: -5 }}
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-accent to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Track & Refine</h3>
              <p className="text-gray-600">
                Follow your plan, track progress, and adjust as you learn what works for you.
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

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Dumbbell, title: 'Build Muscle & Strength', color: 'from-purple-500 to-pink-600' },
              { icon: Brain, title: 'Improve Focus & Energy', color: 'from-cyan-500 to-blue-600' },
              { icon: Heart, title: 'Overall Health & Longevity', color: 'from-green-500 to-emerald-600' },
              { icon: Zap, title: 'Slim & Recomp', color: 'from-orange-500 to-red-600' }
            ].map((benefit, i) => (
              <motion.div
                key={i}
                className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all border border-gray-100"
                whileHover={{ scale: 1.02 }}
              >
                <div className={`w-12 h-12 mb-4 bg-gradient-to-br ${benefit.color} rounded-xl flex items-center justify-center`}>
                  <benefit.icon className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{benefit.title}</h3>
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
              Popular Supplements
            </h2>
            <p className="text-xl text-gray-600">Science-backed essentials in every stack</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Creatine Monohydrate', desc: 'Most researched supplement for strength & power', price: '$24.99' },
              { name: 'Whey Protein Isolate', desc: 'Fast protein for muscle recovery & growth', price: '$39.99' },
              { name: 'Magnesium Glycinate', desc: 'Better sleep, recovery, and calm', price: '$19.99' },
              { name: 'Omega-3 Fish Oil', desc: 'Heart health, brain function, inflammation', price: '$29.99' }
            ].map((supp, i) => (
              <div key={i} className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-2">{supp.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{supp.desc}</p>
                <p className="text-primary font-bold">{supp.price}</p>
                <Link
                  to="/suppstack-ai"
                  className="mt-4 block text-center py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition"
                >
                  View in SuppStack AI
                </Link>
              </div>
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
      <section className="py-20 bg-gradient-to-br from-primary to-purple text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready for Your Personalized Stack?
          </h2>
          <p className="text-xl mb-8 text-gray-100">
            Join thousands who've simplified their supplement routine.
          </p>
          <Link
            to="/suppstack-ai"
            className="inline-flex items-center px-8 py-4 bg-white text-primary rounded-lg font-bold text-lg hover:shadow-2xl transition-all"
          >
            Get Your Stack Now <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
