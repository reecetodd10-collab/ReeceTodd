'use client';

import React from 'react';
import Link from 'next/link';
import EmailCapture from './EmailCapture';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[var(--bg-elev-1)] text-[var(--txt-muted)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Product */}
          <div>
            <h3 className="text-[var(--txt)] font-bold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link href="/supplement-optimization-score" className="hover:text-[var(--acc)] transition">Aviera Stack</Link></li>
              <li><Link href="/learn" className="hover:text-[var(--acc)] transition">Learn</Link></li>
              <li><Link href="/reviews" className="hover:text-[var(--acc)] transition">Reviews</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-[var(--txt)] font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-[var(--acc)] transition">About</Link></li>
              <li><Link href="/contact" className="hover:text-[var(--acc)] transition">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-[var(--txt)] font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-[var(--acc)] transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[var(--acc)] transition">Terms of Service</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-[var(--txt)] font-bold mb-4">Stay Updated</h3>
            <EmailCapture compact />
          </div>
        </div>

        <div className="border-t border-[var(--glass-border)] pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left">
            <p className="text-sm">&copy; 2025 Aviera. All rights reserved.</p>
            <p className="text-xs text-[var(--txt-muted)] mt-1">Your AI-Powered Supplement & Fitness Advisor.</p>
          </div>

          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-[var(--acc)] transition"><Facebook size={20} /></a>
            <a href="#" className="hover:text-[var(--acc)] transition"><Twitter size={20} /></a>
            <a href="#" className="hover:text-[var(--acc)] transition"><Instagram size={20} /></a>
            <a href="#" className="hover:text-[var(--acc)] transition"><Youtube size={20} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

