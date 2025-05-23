import React from 'react';

interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

export function Checkbox({ checked, onCheckedChange, className = '' }: CheckboxProps) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      className={`w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 ${className}`}
    />
  );
}
