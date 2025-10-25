import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import PillLogo from './PillLogo';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { name: 'Home', path: '/' },
    { name: 'SuppStack AI', path: '/suppstack-ai' },
    { name: 'Shop', path: '/shop' },
    { name: 'Learn', path: '/learn' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'About', path: '/about' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <PillLogo size="small" />
          </Link>

          <div className="hidden lg:flex items-center space-x-1">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'bg-gradient-to-r from-primary to-purple text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <Link
            to="/suppstack-ai"
            className="hidden lg:block px-6 py-2.5 bg-gradient-to-r from-primary to-purple text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all"
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
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive(link.path)
                    ? 'bg-gradient-to-r from-primary to-purple text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/suppstack-ai"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 bg-gradient-to-r from-primary to-purple text-white rounded-lg font-semibold text-center"
            >
              Get Your Stack
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
