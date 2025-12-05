import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Target, Users, ArrowRight } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-normal text-gray-900 mb-4" style={{ letterSpacing: '2px' }}>
            Why I Built Aviera
          </h1>
          <p className="text-lg md:text-xl text-gray-600 font-light mb-6" style={{ letterSpacing: '7px' }}>
            Stop Guessing. Start Progressing.
          </p>
        </div>

        {/* Story */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-200 mb-12">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed mb-6 font-light" style={{ letterSpacing: '5px' }}>
              I am <strong className="font-normal">Reece Todd</strong>, a passionate fitness enthusiast who learned firsthand how powerful the right supplements can be when they're simple, consistent, and matched to your goals.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed mb-6 font-light" style={{ letterSpacing: '5px' }}>
              I built <strong className="font-normal">Aviera</strong> to help you stop guessing which supplements actually help you reach your goals. Whether you are building muscle, cutting fat, or optimizing health — Aviera's AI creates your perfect starting stack instantly.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed mb-6 font-light" style={{ letterSpacing: '5px' }}>
              The supplement industry is overwhelming. Hundreds of products, conflicting advice, and aggressive marketing make it nearly impossible to know where to start. <strong className="font-normal">That confusion ends here.</strong>
            </p>

            <p className="text-lg text-gray-700 leading-relaxed font-light" style={{ letterSpacing: '5px' }}>
              What I love most: if you are brand-new and do not know where to begin, Aviera gets you on the right track fast. No confusion, no overwhelm—just a clear, science-backed plan you can actually follow.
            </p>
          </div>

          {/* Photo Placeholder */}
          <div className="mt-8 p-8 bg-accent/10 rounded-xl text-center border border-accent/20">
            <div className="w-32 h-32 mx-auto mb-4 bg-accent rounded-full flex items-center justify-center text-white text-4xl font-normal shadow-accent">
              RT
            </div>
            <p className="text-gray-600 font-normal">Reece Todd</p>
            <p className="text-sm text-gray-500">Founder, Aivra</p>
          </div>
        </div>

        {/* Values */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-200 text-center">
            <Heart className="mx-auto mb-4 text-primary" size={40} />
            <h3 className="font-normal text-gray-900 mb-2" style={{ letterSpacing: '2px' }}>Simplicity First</h3>
            <p className="text-sm text-gray-600 font-light" style={{ letterSpacing: '5px' }}>No confusion. Just clear, actionable recommendations.</p>
          </div>

          <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-200 text-center">
            <Target className="mx-auto mb-4 text-primary" size={40} />
            <h3 className="font-normal text-gray-900 mb-2" style={{ letterSpacing: '2px' }}>Science-Backed</h3>
            <p className="text-sm text-gray-600 font-light" style={{ letterSpacing: '5px' }}>Every recommendation based on research and evidence.</p>
          </div>

          <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-200 text-center">
            <Users className="mx-auto mb-4 text-primary" size={40} />
            <h3 className="font-normal text-gray-900 mb-2" style={{ letterSpacing: '2px' }}>You First</h3>
            <p className="text-sm text-gray-600 font-light" style={{ letterSpacing: '5px' }}>Personalized to your goals, lifestyle, and needs.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-charcoal text-white rounded-2xl p-8">
          <h2 className="text-2xl md:text-3xl font-normal mb-4" style={{ letterSpacing: '2px' }}>
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg mb-6 text-gray-200 font-light" style={{ letterSpacing: '5px' }}>
            Get your personalized supplement stack in 2 minutes.
          </p>
          <Link
            to="/smartstack-ai"
            className="inline-flex items-center px-8 py-3 bg-accent text-white rounded-lg font-normal hover:shadow-accent hover:bg-blue-600 transition-all hover:-translate-y-0.5"
          >
            Try Aivra Stack <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}
