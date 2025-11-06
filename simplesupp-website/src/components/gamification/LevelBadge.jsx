import React from 'react';
import { getLevelInfo } from '../../lib/gamification';

export default function LevelBadge({ level, size = 'md' }) {
  const levelInfo = getLevelInfo(level);
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-16 h-16 text-2xl',
  };

  return (
    <div className={`
      ${sizeClasses[size]} rounded-full bg-gradient-to-br from-[var(--acc)]/20 to-blue-500/20 
      border border-[var(--acc)]/30 flex items-center justify-center
    `}>
      <span>{levelInfo.badge}</span>
    </div>
  );
}

