import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success';
}

export function Badge({ 
  children, 
  className = '', 
  variant = 'default' 
}: BadgeProps) {
  const baseClasses = 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium';
  
  const variantClasses = {
    default: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    destructive: 'bg-red-100 text-red-800',
    success: 'bg-green-100 text-green-800',
    outline: 'border border-gray-300 text-gray-700 bg-white'
  };

  return (
    <span className={cn(baseClasses, variantClasses[variant], className)}>
      {children}
    </span>
  );
}
