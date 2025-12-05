import React, { useState } from 'react';
import { Mail, Send, MapPin, Phone } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Connect to actual API endpoint
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });

    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Mail className="mx-auto mb-6 text-primary" size={64} />
          <h1 className="text-4xl md:text-5xl font-normal text-gray-900 mb-4" style={{ letterSpacing: '2px' }}>
            Get In Touch
          </h1>
          <p className="text-xl text-gray-600 font-light" style={{ letterSpacing: '5px' }}>
            Have questions? We'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <h2 className="text-2xl font-normal text-gray-900 mb-6" style={{ letterSpacing: '2px' }}>Send Us a Message</h2>

            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <Send className="text-green-600" size={32} />
                </div>
                <h3 className="text-xl font-normal text-gray-900 mb-2" style={{ letterSpacing: '2px' }}>Message Sent!</h3>
                <p className="text-gray-600 font-light" style={{ letterSpacing: '5px' }}>We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-accent focus:outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-accent focus:outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-2">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows="6"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-accent focus:outline-none transition"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-accent text-white rounded-lg font-normal hover:shadow-accent hover:bg-blue-600 transition-all hover:-translate-y-0.5 flex items-center justify-center"
                >
                  <Send size={20} className="mr-2" />
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <h2 className="text-2xl font-normal text-gray-900 mb-6" style={{ letterSpacing: '2px' }}>Contact Information</h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="text-accent mt-1 mr-4 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-normal text-gray-900 mb-1" style={{ letterSpacing: '2px' }}>Email</h3>
                    <a href="mailto:hello@aivra.com" className="text-accent hover:underline">
                      hello@aivra.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="text-accent mt-1 mr-4 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-normal text-gray-900 mb-1" style={{ letterSpacing: '2px' }}>Phone</h3>
                    <p className="text-gray-600">Available via email only</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="text-accent mt-1 mr-4 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-normal text-gray-900 mb-1" style={{ letterSpacing: '2px' }}>Location</h3>
                    <p className="text-gray-600">United States</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-charcoal text-white rounded-2xl p-8">
              <h3 className="text-2xl font-normal mb-3" style={{ letterSpacing: '2px' }}>Response Time</h3>
              <p className="text-slate-100 mb-4 font-light" style={{ letterSpacing: '5px' }}>
                We typically respond within 24 hours during business days.
              </p>
              <p className="text-sm text-slate-200 font-light" style={{ letterSpacing: '5px' }}>
                For urgent supplement questions, please consult your healthcare provider.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
