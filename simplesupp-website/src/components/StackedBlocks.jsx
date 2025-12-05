import React from 'react';
import { motion } from 'framer-motion';

/**
 * StackedBlocks Component
 *
 * 3D visualization of stacked supplement blocks/bottles.
 * Creates depth with CSS 3D transforms and brand gradient colors.
 * Used in SmartStack AI section for visual appeal.
 */
export default function StackedBlocks() {
  const blocks = [
    {
      label: 'Creatine',
      gradient: 'from-primary to-accent',
      delay: 0,
      rotation: '-3deg',
      zIndex: 30,
      translateZ: '40px'
    },
    {
      label: 'Protein',
      gradient: 'from-accent to-violet',
      delay: 0.1,
      rotation: '2deg',
      zIndex: 20,
      translateZ: '20px'
    },
    {
      label: 'Omega-3',
      gradient: 'from-violet to-purple-500',
      delay: 0.2,
      rotation: '-2deg',
      zIndex: 10,
      translateZ: '0px'
    }
  ];

  return (
    <div className="relative w-full max-w-md mx-auto h-[400px] md:h-[500px]">
      {/* 3D perspective container */}
      <div className="relative w-full h-full" style={{ perspective: '1000px' }}>
        {blocks.map((block, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50, rotateX: -15 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{
              duration: 0.8,
              delay: block.delay,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            viewport={{ once: true }}
            className="absolute inset-0 flex items-center justify-center"
            style={{
              zIndex: block.zIndex,
              transform: `translateZ(${block.translateZ}) rotate(${block.rotation})`
            }}
          >
            {/* Block/Bottle */}
            <div className="relative w-[280px] md:w-[320px] h-[360px] md:h-[420px]">
              {/* Glow effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${block.gradient} opacity-30 blur-3xl rounded-[3rem]`}
              />

              {/* Main block */}
              <div
                className={`relative w-full h-full bg-gradient-to-br ${block.gradient} rounded-[3rem] shadow-2xl overflow-hidden`}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: 'rotateY(0deg)'
                }}
              >
                {/* Shine/highlight effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-50" />

                {/* Label */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <div className="glass-dark rounded-2xl p-4 md:p-6">
                    <h4 className="text-white font-normal text-xl md:text-2xl text-center">
                      {block.label}
                    </h4>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-8 right-8 w-16 h-16 bg-white/20 rounded-full blur-2xl" />
                <div className="absolute bottom-1/3 left-8 w-24 h-24 bg-white/10 rounded-full blur-3xl" />
              </div>

              {/* Side shadow for depth */}
              <div
                className="absolute inset-0 bg-black/20 rounded-[3rem] blur-sm"
                style={{
                  transform: 'translateZ(-10px) translateX(5px) translateY(5px)',
                  transformStyle: 'preserve-3d'
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full"
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3
            }}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`
            }}
          />
        ))}
      </div>
    </div>
  );
}
