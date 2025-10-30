import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import PillLogo from './PillLogo';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  // Homepage section navigation (smooth scroll)
  const homeSections = [
    { name: 'SmartStack AI', sectionId: 'smartstack-ai' },
    { name: 'SmartFitt', sectionId: 'smartfitt' },
    { name: 'Shop', sectionId: 'shop' },
  ];

  // Other page links
  const pageLinks = [
    { name: 'About', path: '/about' },
  ];

  // Scroll spy for active section highlighting
  useEffect(() => {
    if (!isHomePage) return;

    const handleScroll = () => {
      const sections = ['hero', 'how-it-works', 'smartstack-ai', 'smartfitt', 'shop', 'benefits'];
      const scrollPosition = window.scrollY + 100; // Offset for fixed nav

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
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
    <nav className="sticky top-0 z-50 glass shadow-premium transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center">
            <PillLogo size="small" />
          </Link>

          <div className="hidden lg:flex items-center space-x-1">
            {/* Homepage: Show section navigation with scroll spy */}
            {isHomePage && homeSections.map((section) => (
              <button
                key={section.sectionId}
                onClick={() => scrollToSection(section.sectionId)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeSection === section.sectionId
                    ? 'bg-gradient-to-r from-primary via-accent to-violet text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
                }`}
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
