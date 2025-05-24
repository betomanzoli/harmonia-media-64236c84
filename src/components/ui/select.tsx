import React from 'react';
import { cn } from '@/lib/utils';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
  onValueChange?: (value: string) => void;
  placeholder?: string;
}

interface OptionProps extends React.OptionHTMLAttributes<HTMLOptionElement> {
  children: React.ReactNode;
}

export function Select({ 
  className = '', 
  children, 
  onValueChange, 
  onChange, 
  placeholder,
  disabled = false,
  ...props 
}: SelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onValueChange?.(e.target.value);
    onChange?.(e);
  };

  return (
    <select
      disabled={disabled}
      className={cn(
        'flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      onChange={handleChange}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {children}
    </select>
  );
}

// Helper components for compatibility
export function SelectTrigger({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function SelectValue({ placeholder }: { placeholder: string }) {
  return <option value="" disabled>{placeholder}</option>;
}

export function SelectContent({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function SelectItem({ value, children, ...props }: OptionProps) {
  return (
    <option value={value} {...props}>
      {children}
    </option>
  );
}
