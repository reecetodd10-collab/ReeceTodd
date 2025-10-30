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
        className="glass rounded-3xl p-8 md:p-12 shadow-premium"
      >
        {isSubmitted ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-8"
          >
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-xl">
                <CheckCircle className="text-white" size={40} />
              </div>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Message Sent!
            </h3>
            <p className="text-gray-600 text-lg">
              We'll get back to you as soon as possible.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white/50 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:bg-white focus:shadow-lg ${
                  errors.name
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-gray-200 focus:border-primary'
                }`}
                placeholder="Your name"
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white/50 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:bg-white focus:shadow-lg ${
                  errors.email
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-gray-200 focus:border-primary'
                }`}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Message Field */}
            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                className={`w-full px-4 py-3 bg-white/50 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:bg-white focus:shadow-lg resize-none ${
                  errors.message
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-gray-200 focus:border-primary'
                }`}
                placeholder="How can we help you?"
              />
              {errors.message && (
                <p className="mt-2 text-sm text-red-600">{errors.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-8 py-4 bg-gradient-to-r from-primary via-accent to-violet text-white rounded-xl font-semibold text-lg shadow-premium hover:shadow-premium-lg transition-all duration-300 flex items-center justify-center gap-2"
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
