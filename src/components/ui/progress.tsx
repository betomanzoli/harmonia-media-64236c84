import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps {
  value?: number;
  className?: string;
  max?: number;
}

export function Progress({ 
  value = 0, 
  className = '',
  max = 100 
}: ProgressProps) {
  const percentage = Math.min(max, Math.max(0, value));
  const progressPercentage = (percentage / max) * 100;
  
  return (
    <div 
      className={cn(
        'relative h-2 w-full overflow-hidden rounded-full bg-gray-200',
        className
      )}
    >
      <div 
        className="h-full w-full flex-1 bg-blue-600 transition-all duration-300 ease-in-out"
        style={{ 
          transform: `translateX(-${100 - progressPercentage}%)` 
        }}
      />
    </div>
  );
}
