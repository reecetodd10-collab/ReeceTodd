import React, { useState } from 'react';
import { Store, Bell } from 'lucide-react';

export default function Shop() {
  const [email, setEmail] = useState('');
  const [notified, setNotified] = useState(false);

  const handleNotify = (e) => {
    e.preventDefault();
    console.log('Notify email:', email);
    setNotified(true);
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Store className="mx-auto mb-6 text-primary" size={64} />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Shop Coming Soon
          </h1>
          <p className="text-xl text-gray-600">
            We're integrating our Shopify store so you can check out fast.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What's Coming</h2>
          <p className="text-gray-600 mb-6">
            The catalog and product data are already connected on our source—this page will auto-populate with live products soon!
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50 rounded-xl">
              <h3 className="font-bold text-gray-900 mb-2">⚡ Performance</h3>
              <p className="text-sm text-gray-600">Creatine, Pre-workout, Protein, BCAAs</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <h3 className="font-bold text-gray-900 mb-2">❤️ Health</h3>
              <p className="text-sm text-gray-600">Omega-3, Vitamin D, Multivitamins, Probiotics</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <h3 className="font-bold text-gray-900 mb-2">🧠 Focus</h3>
              <p className="text-sm text-gray-600">Caffeine, L-Theanine, Lion's Mane, Alpha-GPC</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <h3 className="font-bold text-gray-900 mb-2">😴 Recovery</h3>
              <p className="text-sm text-gray-600">Magnesium, Melatonin, ZMA, Ashwagandha</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary/10 to-purple/10 rounded-2xl p-8 border border-primary/20">
          <div className="text-center">
            <Bell className="mx-auto mb-4 text-primary" size={48} />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Notify Me When Live
            </h3>
            <p className="text-gray-600 mb-6">
              Be the first to know when our shop goes live!
            </p>

            <form onSubmit={handleNotify} className="max-w-md mx-auto">
              <div className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-primary to-purple text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Notify Me
                </button>
              </div>
              {notified && (
                <p className="mt-3 text-sm text-green-600 font-medium">
                  ✓ You'll be notified when the shop is live!
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
