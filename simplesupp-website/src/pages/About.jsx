import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Target, Users, ArrowRight } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why I Built Aivra
          </h1>
        </div>

        {/* Story */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-200 mb-12">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              I am <strong>Reece Todd</strong>, a passionate fitness enthusiast who learned firsthand how powerful the right supplements can be when they're simple, consistent, and matched to your goals.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              I built <strong>Aivra</strong> to help you stop guessing which supplements actually help you reach your goals. Whether you are building muscle, cutting fat, or optimizing health — Aivra's AI creates your perfect starting stack instantly.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              The supplement industry is overwhelming. Hundreds of products, conflicting advice, and aggressive marketing make it nearly impossible to know where to start. <strong>That confusion ends here.</strong>
            </p>

            <p className="text-lg text-gray-700 leading-relaxed">
              What I love most: if you are brand-new and do not know where to begin, Aivra gets you on the right track fast. No confusion, no overwhelm—just a clear, science-backed plan you can actually follow.
            </p>
          </div>

          {/* Photo Placeholder */}
          <div className="mt-8 p-8 bg-accent/10 rounded-xl text-center border border-accent/20">
            <div className="w-32 h-32 mx-auto mb-4 bg-accent rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-accent">
              RT
            </div>
            <p className="text-gray-600 font-semibold">Reece Todd</p>
            <p className="text-sm text-gray-500">Founder, Aivra</p>
          </div>
        </div>

        {/* Values */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-200 text-center">
            <Heart className="mx-auto mb-4 text-primary" size={40} />
            <h3 className="font-bold text-gray-900 mb-2">Simplicity First</h3>
            <p className="text-sm text-gray-600">No confusion. Just clear, actionable recommendations.</p>
          </div>

          <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-200 text-center">
            <Target className="mx-auto mb-4 text-primary" size={40} />
            <h3 className="font-bold text-gray-900 mb-2">Science-Backed</h3>
            <p className="text-sm text-gray-600">Every recommendation based on research and evidence.</p>
          </div>

          <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-200 text-center">
            <Users className="mx-auto mb-4 text-primary" size={40} />
            <h3 className="font-bold text-gray-900 mb-2">You First</h3>
            <p className="text-sm text-gray-600">Personalized to your goals, lifestyle, and needs.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-charcoal text-white rounded-2xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg mb-6 text-gray-200">
            Get your personalized supplement stack in 2 minutes.
          </p>
          <Link
            to="/smartstack-ai"
            className="inline-flex items-center px-8 py-3 bg-accent text-white rounded-lg font-semibold hover:shadow-accent hover:bg-blue-600 transition-all hover:-translate-y-0.5"
          >
            Try Aivra Stack <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}
