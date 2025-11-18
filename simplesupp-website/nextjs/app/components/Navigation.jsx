'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { UserButton, useUser } from '@clerk/nextjs';
import { Menu, X, LayoutDashboard, Crown } from 'lucide-react';
import PillLogo from './PillLogo';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === '/';
  const { isSignedIn } = useUser();

  // Homepage section navigation (smooth scroll)
  const homeSections = [
    { name: 'Aviera Stack', sectionId: 'aviera-stack' },
    { name: 'Aviera Fit', sectionId: 'aviera-fit' },
    { name: 'Aviera Shop', sectionId: 'aviera-shop' },
    { name: 'About', sectionId: 'about' },
  ];

  // Other page links (only show if not on homepage)
  const pageLinks = [];

  // Scroll spy for active section highlighting using Intersection Observer
  useEffect(() => {
    if (typeof window === 'undefined' || !isHomePage) return;

    const sections = ['hero', 'how-it-works', 'aviera-stack', 'aviera-fit', 'aviera-shop', 'goals', 'reviews', 'faq', 'contact', 'about'];
    
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observers = sections.map(sectionId => {
      const element = document.getElementById(sectionId);
      if (element) {
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        observer.observe(element);
        return observer;
      }
      return null;
    }).filter(Boolean);

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, [isHomePage]);

  const scrollToSection = (sectionId) => {
    if (typeof window === 'undefined') return;
    
    if (isHomePage) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setIsOpen(false);
      }
    } else {
      // Navigate to homepage then scroll
      router.push('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      setIsOpen(false);
    }
  };

  const isActive = (path) => pathname === path || pathname.startsWith(path);

  return (
    <nav className="sticky top-0 z-50 glass-dark shadow-premium transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center">
            <PillLogo size="small" />
          </Link>

          <div className="hidden lg:flex items-center space-x-2">
            {/* Homepage: Show section navigation with scroll spy */}
            {isHomePage && homeSections.map((section) => (
              <button
                key={section.sectionId}
                onClick={() => scrollToSection(section.sectionId)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeSection === section.sectionId
                    ? 'bg-[var(--acc)] text-[#001018] shadow-accent'
                    : 'text-[var(--txt-muted)] hover:bg-[var(--bg-elev-1)] hover:text-[var(--acc-2)]'
                }`}
              >
                {section.name}
              </button>
            ))}

            {/* Other page links (only if not on homepage) */}
            {!isHomePage && pageLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive(link.path)
                    ? 'bg-[var(--acc)] text-[#001018] shadow-accent'
                    : 'text-[var(--txt-muted)] hover:bg-[var(--bg-elev-1)] hover:text-[var(--acc-2)]'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Dashboard link - always visible */}
            <Link
              href="/dashboard"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                isActive('/dashboard')
                  ? 'bg-[var(--acc)] text-[#001018] shadow-accent'
                  : 'text-[var(--txt-muted)] hover:bg-[var(--bg-elev-1)] hover:text-[var(--acc-2)]'
              }`}
            >
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {isSignedIn ? (
              <>
                <Link
                  href="/pricing"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-[var(--acc)] to-blue-500 text-white hover:from-blue-600 hover:to-blue-700 transition shadow-accent"
                >
                  <Crown size={16} />
                  Get Premium
                </Link>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10",
                    },
                  }}
                />
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--txt-muted)] hover:bg-[var(--bg-elev-1)] hover:text-[var(--acc-2)] transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="btn-primary"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-3 rounded-lg hover:bg-[var(--bg-elev-1)] transition min-w-[48px] min-h-[48px] flex items-center justify-center"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} className="text-[var(--txt)]" /> : <Menu size={24} className="text-[var(--txt)]" />}
          </button>
        </div>

        {isOpen && (
          <div className="lg:hidden py-4 space-y-2 border-t border-[var(--border)]">
            {/* Homepage sections */}
            {isHomePage && homeSections.map((section) => (
              <button
                key={section.sectionId}
                onClick={() => scrollToSection(section.sectionId)}
                className={`block w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeSection === section.sectionId
                    ? 'bg-[var(--acc)] text-[#001018]'
                    : 'text-[var(--txt-muted)] hover:bg-[var(--bg-elev-1)]'
                }`}
              >
                {section.name}
              </button>
            ))}

            {/* Other page links */}
            {!isHomePage && pageLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive(link.path)
                    ? 'bg-[var(--acc)] text-[#001018]'
                    : 'text-[var(--txt-muted)] hover:bg-[var(--bg-elev-1)]'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Dashboard link - always visible in mobile */}
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                isActive('/dashboard')
                  ? 'bg-[var(--acc)] text-[#001018]'
                  : 'text-[var(--txt-muted)] hover:bg-[var(--bg-elev-1)]'
              }`}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>

            {/* Auth links - mobile */}
            {isSignedIn ? (
              <>
                <Link
                  href="/pricing"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg font-medium bg-gradient-to-r from-[var(--acc)] to-blue-500 text-white hover:from-blue-600 hover:to-blue-700 transition"
                >
                  <Crown size={18} />
                  Get Premium
                </Link>
                <div className="px-4 py-3 flex items-center justify-center">
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10",
                      },
                    }}
                  />
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-lg font-medium text-[var(--txt-muted)] hover:bg-[var(--bg-elev-1)] transition text-center"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 bg-[var(--acc)] text-[#001018] rounded-lg font-semibold text-center hover:bg-blue-600 hover:text-white transition"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

