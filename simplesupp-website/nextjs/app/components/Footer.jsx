'use client';

import React from 'react';
import Link from 'next/link';
import EmailCapture from './EmailCapture';
import { Instagram } from 'lucide-react';

// Custom TikTok icon (not available in lucide-react)
function TikTokIcon({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.17a8.16 8.16 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.6z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[var(--bg-elev-1)] text-[var(--txt-muted)]">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 pb-20 md:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Product */}
          <div>
            <h3 className="text-[var(--txt)] font-bold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link href="/supplement-optimization-score" className="hover:text-[var(--acc)] transition">Optimization Score</Link></li>
              <li><Link href="/shop" className="hover:text-[var(--acc)] transition">Shop</Link></li>
              <li><Link href="/about" className="hover:text-[var(--acc)] transition">About</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[var(--txt)] font-bold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:info@avierafit.com" className="hover:text-[var(--acc)] transition">
                  info@avierafit.com
                </a>
              </li>
              <li className="text-sm leading-relaxed">
                4437 Lister St<br />
                San Diego, CA 92110
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-[var(--txt)] font-bold mb-4">Policies</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="hover:text-[var(--acc)] transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[var(--acc)] transition">Terms of Service</Link></li>
              <li><Link href="/shipping" className="hover:text-[var(--acc)] transition">Shipping Policy</Link></li>
              <li><Link href="/returns" className="hover:text-[var(--acc)] transition">Returns & Refunds</Link></li>
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
            <p className="text-sm">&copy; 2026 Aviera. All rights reserved.</p>
            <p className="text-xs text-[var(--txt-muted)] mt-1">Your AI-Powered Supplement & Fitness Advisor.</p>
          </div>

          <div className="flex space-x-4 mt-4 md:mt-0">
            <a
              href="https://instagram.com/avierafit"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-all duration-300 hover:text-[#00d9ff]"
              style={{ filter: 'drop-shadow(0 0 0px transparent)' }}
              onMouseEnter={(e) => { e.currentTarget.style.filter = 'drop-shadow(0 0 8px rgba(0, 217, 255, 0.6))'; }}
              onMouseLeave={(e) => { e.currentTarget.style.filter = 'drop-shadow(0 0 0px transparent)'; }}
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
            <a
              href="https://tiktok.com/@avierafit"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-all duration-300 hover:text-[#00d9ff]"
              style={{ filter: 'drop-shadow(0 0 0px transparent)' }}
              onMouseEnter={(e) => { e.currentTarget.style.filter = 'drop-shadow(0 0 8px rgba(0, 217, 255, 0.6))'; }}
              onMouseLeave={(e) => { e.currentTarget.style.filter = 'drop-shadow(0 0 0px transparent)'; }}
              aria-label="TikTok"
            >
              <TikTokIcon size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
