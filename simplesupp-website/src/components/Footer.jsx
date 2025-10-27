import React from 'react';
import { Link } from 'react-router-dom';
import EmailCapture from './EmailCapture';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Product */}
          <div>
            <h3 className="text-white font-bold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/suppstack-ai" className="hover:text-accent transition">SmartSupp AI</Link></li>
              <li><Link to="/learn" className="hover:text-accent transition">Learn</Link></li>
              <li><Link to="/reviews" className="hover:text-accent transition">Reviews</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-accent transition">About</Link></li>
              <li><Link to="/contact" className="hover:text-accent transition">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-accent transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-accent transition">Terms of Service</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-bold mb-4">Stay Updated</h3>
            <EmailCapture compact />
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left">
            <p className="text-sm">&copy; 2025 SmartSupp. All rights reserved.</p>
            <p className="text-xs text-gray-500 mt-1">Smart supplements for smart goals.</p>
          </div>

          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-accent transition"><Facebook size={20} /></a>
            <a href="#" className="hover:text-accent transition"><Twitter size={20} /></a>
            <a href="#" className="hover:text-accent transition"><Instagram size={20} /></a>
            <a href="#" className="hover:text-accent transition"><Youtube size={20} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
