import React from 'react';

export default function Card({ children, className = "", onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`
        backdrop-blur-md bg-sanctuary-card/70 
        border border-sanctuary-border/60 
        rounded-2xl p-6 shadow-xl 
        transition-all duration-300
        ${onClick ? 'cursor-pointer hover:border-sanctuary-sage/40 hover:bg-sanctuary-card/90' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
