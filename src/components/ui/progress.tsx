import React from 'react';

interface ProgressProps {
  value?: number;
  className?: string;
}

export function Progress({ value = 0, className = '' }: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, value));
  
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div 
        className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
