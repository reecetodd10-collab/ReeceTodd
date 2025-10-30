import React from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Brain, Heart, Zap } from 'lucide-react';

/**
 * GoalCards Component
 *
 * Premium goal cards with custom gradient icons.
 * Each goal has a specific icon and gradient color scheme.
 */
export default function GoalCards() {
  const goals = [
    {
      title: 'Build Muscle & Strength',
      description: 'Maximize muscle growth and strength gains with science-backed supplements tailored to your training style.',
      icon: Dumbbell,
      gradient: 'from-primary via-accent to-violet', // blue-purple
      iconSize: 40,
      features: ['Creatine optimization', 'Protein timing', 'Recovery support']
    },
    {
      title: 'Focus & Energy',
      description: 'Enhance mental clarity and sustained energy throughout your day with targeted nootropics and stimulants.',
      icon: Brain,
      gradient: 'from-primary via-accent to-violet', // blue-purple
      iconSize: 40,
      features: ['Cognitive enhancement', 'Clean energy', 'No crashes']
    },
    {
      title: 'Health & Longevity',
      description: 'Support overall wellness and long-term health with essential vitamins, minerals, and antioxidants.',
      icon: Heart,
      gradient: 'from-green-400 via-green-500 to-emerald-600', // green
      iconSize: 40,
      features: ['Immune support', 'Heart health', 'Anti-aging']
    },
    {
      title: 'Slim & Recomp',
      description: 'Achieve body recomposition goals with supplements that support fat loss while preserving lean muscle.',
      icon: Zap,
      gradient: 'from-violet via-purple-500 to-purple-600', // purple
      iconSize: 40,
      features: ['Metabolic boost', 'Appetite control', 'Lean gains']
    }
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
      {goals.map((goal, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: index * 0.1,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          viewport={{ once: true }}
          whileHover={{ y: -8, transition: { duration: 0.3 } }}
          className="card-premium"
        >
          <div className="glass rounded-3xl p-6 md:p-8 h-full flex flex-col shadow-premium hover:shadow-premium-lg transition-all duration-300">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                {/* Glow effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${goal.gradient} opacity-30 rounded-2xl blur-2xl`}
                />
                {/* Icon container */}
                <div
                  className={`relative w-20 h-20 bg-gradient-to-br ${goal.gradient} rounded-2xl flex items-center justify-center shadow-xl icon-premium`}
                >
                  <goal.icon className="text-white" size={goal.iconSize} strokeWidth={2} />
                </div>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 text-center">
              {goal.title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6 text-center flex-grow">
              {goal.description}
            </p>

            {/* Features */}
            <ul className="space-y-2">
              {goal.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                  <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${goal.gradient} mr-2`} />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
