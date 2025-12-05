'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Target, Users, ArrowRight } from 'lucide-react';
import OptimizedImage from '../components/OptimizedImage';

export default function About() {
  return (
    <div className="min-h-screen bg-[var(--bg)] py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--txt)] mb-6">
            Why I Built Aviera
          </h1>
        </div>

        {/* Story */}
        <div className="glass-card rounded-2xl p-8 md:p-12 shadow-premium mb-12">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-[var(--txt-secondary)] leading-relaxed mb-6">
              I am <strong className="text-[var(--txt)]">Reece Todd</strong>, a passionate fitness enthusiast who learned firsthand how powerful the right supplements can be when they're simple, consistent, and matched to your goals.
            </p>

            <p className="text-lg text-[var(--txt-secondary)] leading-relaxed mb-6">
              I built <strong className="text-[var(--txt)]">Aviera</strong> to help you stop guessing which supplements actually help you reach your goals. Whether you are building muscle, cutting fat, or optimizing health — Aviera's AI creates your perfect starting stack instantly.
            </p>

            <p className="text-lg text-[var(--txt-secondary)] leading-relaxed mb-6">
              The supplement industry is overwhelming. Hundreds of products, conflicting advice, and aggressive marketing make it nearly impossible to know where to start. <strong className="text-[var(--txt)]">That confusion ends here.</strong>
            </p>

            <p className="text-lg text-[var(--txt-secondary)] leading-relaxed">
              What I love most: if you are brand-new and do not know where to begin, Aviera gets you on the right track fast. No confusion, no overwhelm—just a clear, science-backed plan you can actually follow.
            </p>
          </div>

          {/* Founder Photo */}
          <div className="mt-8 rounded-xl overflow-hidden border border-[var(--acc)]/20 shadow-premium">
            <div className="relative w-full aspect-[3/4] max-w-xs mx-auto">
              <OptimizedImage
                src="/images/about/founder-photo.jpg"
                alt="Reece Todd, Founder of Aviera"
                width={600}
                height={800}
                className="w-full h-full"
                objectFit="cover"
                objectPosition="center center"
                fallbackText="Founder Photo"
              />
            </div>
            <div className="p-6 text-center bg-[var(--bg-elev-1)]">
              <p className="text-[var(--txt)] font-semibold text-lg">Reece Todd</p>
              <p className="text-sm text-[var(--txt-muted)]">Founder, Aviera</p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card p-6 text-center shadow-premium">
            <Heart className="mx-auto mb-4 text-[var(--acc)]" size={40} />
            <h3 className="font-bold text-[var(--txt)] mb-2">Simplicity First</h3>
            <p className="text-sm text-[var(--txt-muted)]">No confusion. Just clear, actionable recommendations.</p>
          </div>

          <div className="glass-card p-6 text-center shadow-premium">
            <Target className="mx-auto mb-4 text-[var(--acc)]" size={40} />
            <h3 className="font-bold text-[var(--txt)] mb-2">Science-Backed</h3>
            <p className="text-sm text-[var(--txt-muted)]">Every recommendation based on research and evidence.</p>
          </div>

          <div className="glass-card p-6 text-center shadow-premium">
            <Users className="mx-auto mb-4 text-[var(--acc)]" size={40} />
            <h3 className="font-bold text-[var(--txt)] mb-2">You First</h3>
            <p className="text-sm text-[var(--txt-muted)]">Personalized to your goals, lifestyle, and needs.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center glass-card p-8 shadow-premium">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--txt)] mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg mb-6 text-[var(--txt-secondary)]">
            Get your personalized supplement stack in 2 minutes.
          </p>
          <Link
            href="/smartstack-ai"
            className="btn-primary inline-flex items-center"
          >
            Try Aviera Stack <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}

