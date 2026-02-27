'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Target, ArrowRight, TrendingUp, DoorOpen, Flag } from 'lucide-react';
import OptimizedImage from '../components/OptimizedImage';

export default function About() {
  return (
    <div className="relative min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Cyan glow backdrop */}
      <div className="absolute top-0 left-0 right-0 h-[400px] pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(0,217,255,0.06), transparent 60%)' }} />

      <div className="relative z-10 px-5 pt-8 pb-24 max-w-3xl mx-auto">

        {/* Our Mission */}
        <section className="mb-10">
          <h1 className="text-[22px] font-bold mb-1" style={{ color: 'var(--txt)' }}>
            Our Mission
          </h1>
          <p className="text-[13px] mb-4" style={{ color: 'var(--txt-muted)' }}>
            Why Aviera exists.
          </p>

          <div
            className="rounded-[14px] p-5"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <p className="text-[13px] leading-relaxed italic border-l-2 border-[#00d9ff] pl-4" style={{ color: 'var(--txt-muted)' }}>
              &ldquo;We believe everyone deserves access to a healthy lifestyle. Health is wealth. The foundation upon which every aspect of life is built. A happy life is always built on top of a healthy, confident body. Aviera exists to help you build that foundation and discover your best self.&rdquo;
            </p>
          </div>
        </section>

        {/* Why I Built Aviera */}
        <section className="mb-10">
          <h2 className="text-[18px] font-bold mb-4" style={{ color: 'var(--txt)' }}>
            Why I Built Aviera
          </h2>

          <div className="grid sm:grid-cols-5 gap-4 items-start">
            {/* Photo */}
            <div className="sm:col-span-2">
              <div
                className="rounded-[14px] overflow-hidden"
                style={{ border: '1px solid var(--border)' }}
              >
                <div className="relative w-full aspect-[3/4] overflow-hidden">
                  <OptimizedImage
                    src="/images/about/founder-photo.jpeg"
                    alt="Reece Todd, Founder of Aviera"
                    width={600}
                    height={800}
                    className="w-full h-full"
                    objectFit="cover"
                    objectPosition="center center"
                    fallbackText="Founder Photo"
                    priority
                  />
                </div>
                <div className="p-3 text-center" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}>
                  <p className="text-[13px] font-semibold" style={{ color: 'var(--txt)' }}>Reece Todd</p>
                  <p className="text-[11px]" style={{ color: 'var(--txt-muted)' }}>Founder, Aviera</p>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="sm:col-span-3">
              <div
                className="rounded-[14px] p-5"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
              >
                <div className="space-y-4">
                  <p className="text-[13px] leading-relaxed" style={{ color: 'var(--txt-muted)' }}>
                    I am <strong style={{ color: 'var(--txt)' }}>Reece Todd</strong>, a passionate fitness enthusiast who learned firsthand how powerful the right supplements can be when they are simple, consistent, and matched to your goals.
                  </p>

                  <p className="text-[13px] leading-relaxed" style={{ color: 'var(--txt-muted)' }}>
                    I built <strong style={{ color: 'var(--txt)' }}>Aviera</strong> to help you stop guessing which supplements actually help you reach your goals. Whether you are building muscle, cutting fat, or optimizing health — Aviera&apos;s AI creates your perfect starting stack instantly.
                  </p>

                  <p className="text-[13px] leading-relaxed italic border-l-2 border-[#00d9ff] pl-3" style={{ color: 'var(--txt-muted)' }}>
                    The supplement industry is overwhelming. Hundreds of products, conflicting advice, and aggressive marketing make it nearly impossible to know where to start. <strong style={{ color: 'var(--txt)' }}>That confusion ends here.</strong>
                  </p>

                  <p className="text-[13px] leading-relaxed" style={{ color: 'var(--txt-muted)' }}>
                    What I love most: if you are brand new and do not know where to begin, Aviera gets you on the right track fast. No confusion, no overwhelm. Just a clear, science-backed plan you can actually follow.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What We Stand For — 2x2 grid on mobile */}
        <section className="mb-10">
          <h2 className="text-[18px] font-bold mb-4" style={{ color: 'var(--txt)' }}>
            What We Stand For
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {/* Health is Wealth */}
            <div
              className="rounded-[14px] p-4 flex flex-col"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <div
                className="w-10 h-10 rounded-[10px] flex items-center justify-center mb-3"
                style={{ background: 'rgba(0,217,255,0.1)', border: '1px solid rgba(0,217,255,0.2)' }}
              >
                <Heart size={18} style={{ color: '#00d9ff' }} />
              </div>
              <h3 className="text-[13px] font-semibold mb-1" style={{ color: 'var(--txt)' }}>
                Health is Wealth
              </h3>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--txt-muted)' }}>
                A healthy body is the foundation for a happy, successful life.
              </p>
            </div>

            {/* Accessibility */}
            <div
              className="rounded-[14px] p-4 flex flex-col"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <div
                className="w-10 h-10 rounded-[10px] flex items-center justify-center mb-3"
                style={{ background: 'rgba(0,217,255,0.1)', border: '1px solid rgba(0,217,255,0.2)' }}
              >
                <DoorOpen size={18} style={{ color: '#00d9ff' }} />
              </div>
              <h3 className="text-[13px] font-semibold mb-1" style={{ color: 'var(--txt)' }}>
                Accessibility
              </h3>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--txt-muted)' }}>
                Everyone deserves access to a healthy lifestyle, regardless of where they start.
              </p>
            </div>

            {/* Progress Over Perfection */}
            <div
              className="rounded-[14px] p-4 flex flex-col"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <div
                className="w-10 h-10 rounded-[10px] flex items-center justify-center mb-3"
                style={{ background: 'rgba(0,217,255,0.1)', border: '1px solid rgba(0,217,255,0.2)' }}
              >
                <TrendingUp size={18} style={{ color: '#00d9ff' }} />
              </div>
              <h3 className="text-[13px] font-semibold mb-1" style={{ color: 'var(--txt)' }}>
                Progress Over Perfection
              </h3>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--txt-muted)' }}>
                Go at your own pace. Your journey, your style.
              </p>
            </div>

            {/* Personalization */}
            <div
              className="rounded-[14px] p-4 flex flex-col"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <div
                className="w-10 h-10 rounded-[10px] flex items-center justify-center mb-3"
                style={{ background: 'rgba(0,217,255,0.1)', border: '1px solid rgba(0,217,255,0.2)' }}
              >
                <Target size={18} style={{ color: '#00d9ff' }} />
              </div>
              <h3 className="text-[13px] font-semibold mb-1" style={{ color: 'var(--txt)' }}>
                Personalization
              </h3>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--txt-muted)' }}>
                One size fits all does not work. Your plan should be as unique as you.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section>
          <div
            className="rounded-[14px] p-6 text-center"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <h2 className="text-[18px] font-bold mb-2" style={{ color: 'var(--txt)' }}>
              Ready to Start Your Journey?
            </h2>
            <p className="text-[13px] mb-5" style={{ color: 'var(--txt-muted)' }}>
              Get your personalized supplement stack in 2 minutes.
            </p>
            <Link
              href="/supplement-optimization-score"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[10px] text-[14px] font-semibold"
              style={{ background: '#00d9ff', color: '#09090b', minHeight: '44px' }}
            >
              Get My Score
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
