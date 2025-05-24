import React from 'react';

interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  id?: string;
  disabled?: boolean;
}

export function Switch({ 
  checked = false, 
  onCheckedChange, 
  className = '', 
  id,
  disabled = false 
}: SwitchProps) {
  return (
    <button
      id={id}
      type="button"
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        disabled 
          ? 'opacity-50 cursor-not-allowed bg-gray-200' 
          : checked 
            ? 'bg-blue-600' 
            : 'bg-gray-200'
      } ${className}`}
      onClick={() => !disabled && onCheckedChange?.(!checked)}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}
