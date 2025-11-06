import React from 'react';
import { motion } from 'framer-motion';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '', 
  onClick,
  disabled = false,
  type = 'button',
  icon,
  iconPosition = 'left'
}) {
  const baseClasses = 
    variant === 'primary' ? 'btn-primary' : 
    variant === 'secondary' ? 'btn-secondary' : 
    variant === 'tertiary' ? 'btn-tertiary' :
    variant === 'icon' ? 'btn-icon' : 'btn-primary';
  
  const sizeClass = 
    size === 'sm' ? 'btn-sm' : 
    size === 'lg' ? 'btn-lg' : '';
  
  const content = icon ? (
    <>
      {iconPosition === 'left' && icon}
      {children}
      {iconPosition === 'right' && icon}
    </>
  ) : children;
  
  return (
    <motion.button
      type={type}
      className={`${baseClasses} ${sizeClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {content}
    </motion.button>
  );
}
