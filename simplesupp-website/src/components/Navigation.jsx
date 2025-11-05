import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LayoutDashboard } from 'lucide-react';
import PillLogo from './PillLogo';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

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
    if (!isHomePage) return;

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
    if (isHomePage) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setIsOpen(false);
      }
    } else {
      // Navigate to homepage then scroll
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      setIsOpen(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-dark shadow-premium transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center">
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
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive(link.path)
                    ? 'bg-accent text-white shadow-accent'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-accent'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Dashboard link - always visible */}
            <Link
              to="/dashboard"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                isActive('/dashboard') || location.pathname.startsWith('/dashboard')
                  ? 'bg-[var(--acc)] text-[#001018] shadow-accent'
                  : 'text-[var(--txt-muted)] hover:bg-[var(--bg-elev-1)] hover:text-[var(--acc-2)]'
              }`}
            >
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
          </div>

          <Link
            to="/smartstack-ai"
            className="hidden lg:block btn-primary"
          >
            Get Your Stack
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="lg:hidden py-4 space-y-2 border-t border-gray-200">
            {/* Homepage sections */}
            {isHomePage && homeSections.map((section) => (
              <button
                key={section.sectionId}
                onClick={() => scrollToSection(section.sectionId)}
                className={`block w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeSection === section.sectionId
                    ? 'bg-accent text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {section.name}
              </button>
            ))}

            {/* Other page links */}
            {!isHomePage && pageLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive(link.path)
                    ? 'bg-accent text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Dashboard link - always visible in mobile */}
            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                isActive('/dashboard') || location.pathname.startsWith('/dashboard')
                  ? 'bg-accent text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>

            <Link
              to="/smartstack-ai"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 bg-accent text-white rounded-lg font-semibold text-center"
            >
              Get Your Stack
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
