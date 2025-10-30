import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import PillLogo from './PillLogo';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  // Homepage section navigation (smooth scroll)
  const homeSections = [
    { name: 'Features', sectionId: 'features' },
    { name: 'How It Works', sectionId: 'how-it-works' },
    { name: 'Testimonials', sectionId: 'testimonials' },
    { name: 'Pricing', sectionId: 'pricing' },
  ];

  // Other page links
  const pageLinks = [
    { name: 'SmartStack AI', path: '/smartstack-ai' },
    { name: 'SmartFitt', path: '/smartfitt' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
  ];

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
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <PillLogo size="small" />
          </Link>

          <div className="hidden lg:flex items-center space-x-1">
            {/* Homepage: Show section navigation */}
            {isHomePage && homeSections.map((section) => (
              <button
                key={section.sectionId}
                onClick={() => scrollToSection(section.sectionId)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all text-gray-700 hover:bg-gray-100 hover:text-primary"
              >
                {section.name}
              </button>
            ))}

            {/* Always show page links */}
            {pageLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'bg-gradient-to-r from-primary via-accent to-violet text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <Link
            to="/smartstack-ai"
            className="hidden lg:block px-6 py-2.5 bg-gradient-to-r from-primary via-accent to-violet text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-accent/50 transition-all hover:scale-105"
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
                className="block w-full text-left px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-all"
              >
                {section.name}
              </button>
            ))}

            {/* Page links */}
            {pageLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive(link.path)
                    ? 'bg-gradient-to-r from-primary via-accent to-violet text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/smartstack-ai"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 bg-gradient-to-r from-primary via-accent to-violet text-white rounded-lg font-semibold text-center"
            >
              Get Your Stack
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
