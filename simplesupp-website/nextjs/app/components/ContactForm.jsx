'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle } from 'lucide-react';

/**
 * ContactForm Component
 *
 * Premium contact form with glass-morphism styling.
 * Smooth animations and form validation.
 */
export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length === 0) {
      // TODO: Integrate with backend
      console.log('Form submitted:', formData);
      setIsSubmitted(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({ name: '', email: '', message: '' });
        setIsSubmitted(false);
      }, 3000);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="rounded-2xl p-8 md:p-12 transition-all duration-300"
        style={{
          background: '#ffffff',
          border: '1px solid #e0e0e0',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
        }}
      >
        {isSubmitted ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-8"
          >
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'rgba(0, 217, 255, 0.1)' }}>
                <CheckCircle style={{ color: '#00d9ff' }} size={40} />
              </div>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-3" style={{ fontFamily: 'Montserrat, sans-serif', color: '#1a1a1a' }}>
              Message Sent!
            </h3>
            <p className="text-lg font-light" style={{ color: '#4a4a4a' }}>
              We'll get back to you as soon as possible.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold mb-2" style={{ color: '#1a1a1a' }}>
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl transition-all duration-200 focus:outline-none"
                style={{
                  background: '#f9fafb',
                  border: `1px solid ${errors.name ? '#ef4444' : '#e0e0e0'}`,
                  color: '#1a1a1a',
                  fontSize: '16px',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = errors.name ? '#ef4444' : '#00d9ff';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 217, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.name ? '#ef4444' : '#e0e0e0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                placeholder="Your name"
              />
              {errors.name && (
                <p className="mt-2 text-sm" style={{ color: '#ef4444' }}>{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2" style={{ color: '#1a1a1a' }}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl transition-all duration-200 focus:outline-none"
                style={{
                  background: '#f9fafb',
                  border: `1px solid ${errors.email ? '#ef4444' : '#e0e0e0'}`,
                  color: '#1a1a1a',
                  fontSize: '16px',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = errors.email ? '#ef4444' : '#00d9ff';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 217, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.email ? '#ef4444' : '#e0e0e0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="mt-2 text-sm" style={{ color: '#ef4444' }}>{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-semibold mb-2" style={{ color: '#1a1a1a' }}>
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                className="w-full px-4 py-3 rounded-xl transition-all duration-200 focus:outline-none resize-none"
                style={{
                  background: '#f9fafb',
                  border: `1px solid ${errors.message ? '#ef4444' : '#e0e0e0'}`,
                  color: '#1a1a1a',
                  fontSize: '16px',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = errors.message ? '#ef4444' : '#00d9ff';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 217, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.message ? '#ef4444' : '#e0e0e0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                placeholder="How can we help you?"
              />
              {errors.message && (
                <p className="mt-2 text-sm" style={{ color: '#ef4444' }}>{errors.message}</p>
              )}
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all duration-300"
              style={{
                background: '#00d9ff',
                color: '#ffffff',
                boxShadow: '0 0 20px rgba(0, 217, 255, 0.3)',
              }}
            >
              <span>Send Message</span>
              <Send size={20} />
            </motion.button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

