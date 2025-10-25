import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';

export default function Reviews() {
  const [formData, setFormData] = useState({ name: '', goal: '', results: '', consent: false });
  const [submitted, setSubmitted] = useState(false);

  const reviews = [
    { name: 'Sarah M.', goal: 'Fat Loss', rating: 5, review: 'Lost 15lbs in 8 weeks! The stack recommendation was perfect for my goals.', stack: 'Caffeine, Green Tea Extract, Whey Protein' },
    { name: 'Mike T.', goal: 'Muscle Gain', rating: 5, review: 'Strength up 20% and gained 8lbs of lean mass. Could not be happier!', stack: 'Creatine, Whey Protein, Pre-Workout' },
    { name: 'Jessica L.', goal: 'Overall Health', rating: 5, review: 'Finally feel energized and my sleep is so much better. Life-changing!', stack: 'Omega-3, Vitamin D, Magnesium' },
    { name: 'David R.', goal: 'Athletic Performance', rating: 5, review: 'My endurance and recovery improved dramatically. Highly recommend!', stack: 'Creatine, Beta-Alanine, Electrolytes' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Review submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', goal: '', results: '', consent: false });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Success Stories
          </h1>
          <p className="text-xl text-gray-600">
            Real results from real people.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {reviews.map((review, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-900">{review.name}</h3>
                  <p className="text-sm text-gray-500">Goal: {review.goal}</p>
                </div>
                <div className="flex">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-current" size={18} />
                  ))}
                </div>
              </div>

              <p className="text-gray-700 mb-4 italic">"{review.review}"</p>

              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 font-medium">STACK USED:</p>
                <p className="text-sm text-gray-600">{review.stack}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Review Form */}
        <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit Your Review</h2>

          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <Send className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
              <p className="text-gray-600">Your review has been submitted.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Goal</label>
                <input
                  type="text"
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                  placeholder="e.g., Muscle Gain, Fat Loss, etc."
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Results</label>
                <textarea
                  value={formData.results}
                  onChange={(e) => setFormData({ ...formData, results: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none"
                  required
                />
              </div>

              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={formData.consent}
                  onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                  className="mt-1 mr-2"
                  required
                />
                <span className="text-sm text-gray-600">
                  I consent to SimpleSupp using my review on the website.
                </span>
              </label>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-primary to-purple text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Submit Review
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
