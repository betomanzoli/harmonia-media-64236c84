import React from 'react';
import { cn } from '@/lib/utils';

interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  id?: string;
  disabled?: boolean;
  name?: string;
}

export function Checkbox({ 
  checked = false, 
  onCheckedChange, 
  className = '', 
  id,
  disabled = false,
  name,
  ...props 
}: CheckboxProps) {
  return (
    <input
      type="checkbox"
      id={id}
      name={name}
      checked={checked}
      disabled={disabled}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      className={cn(
        'h-4 w-4 rounded border border-gray-300 text-blue-600',
        'focus:ring-2 focus:ring-blue-500',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}
