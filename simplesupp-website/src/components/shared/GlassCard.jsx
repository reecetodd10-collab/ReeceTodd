import React from 'react';
import { motion } from 'framer-motion';

export default function GlassCard({ 
  children, 
  className = '', 
  onClick,
  premium = false,
  hover = true,
  padding = true
}) {
  const classes = [
    'glass-card',
    premium && 'glass-card-premium',
    hover && 'cursor-pointer',
    !padding && 'p-0',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <motion.div 
      className={classes}
      onClick={onClick}
      whileHover={hover && onClick ? { y: -4 } : {}}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
