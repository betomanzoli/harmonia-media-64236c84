import React from 'react';

interface AlertProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'destructive' | 'warning';
}

export function Alert({ children, className = '', variant = 'default' }: AlertProps) {
  const variantClasses = {
    default: 'bg-blue-50 border-blue-200 text-blue-800',
    destructive: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800'
  };

  return (
    <div className={`border rounded-lg p-4 ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
}

export function AlertTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <h4 className={`font-medium mb-2 ${className}`}>
      {children}
    </h4>
  );
}

export function AlertDescription({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`text-sm ${className}`}>
      {children}
    </div>
  );
}
