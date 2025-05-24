import React, { createContext, useContext, useState } from 'react';
import { cn } from '@/lib/utils';

interface RadioContextType {
  value: string;
  onValueChange: (value: string) => void;
  name: string;
}

const RadioContext = createContext<RadioContextType | null>(null);

interface RadioGroupProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export function RadioGroup({ 
  value, 
  defaultValue = '', 
  onValueChange, 
  name = 'radio-group', 
  children, 
  className,
  disabled = false
}: RadioGroupProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  
  const currentValue = value !== undefined ? value : internalValue;
  
  const handleValueChange = (newValue: string) => {
    if (disabled) return;
    
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <RadioContext.Provider value={{ 
      value: currentValue, 
      onValueChange: handleValueChange, 
      name 
    }}>
      <div className={cn("grid gap-2", className)}>
        {children}
      </div>
    </RadioContext.Provider>
  );
}

interface RadioGroupItemProps {
  value: string;
  id?: string;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export function RadioGroupItem({ 
  value, 
  id, 
  className, 
  children,
  disabled = false 
}: RadioGroupItemProps) {
  const context = useContext(RadioContext);
  
  if (!context) {
    throw new Error('RadioGroupItem must be used within a RadioGroup');
  }
  
  const { value: groupValue, onValueChange, name } = context;
  const isChecked = groupValue === value;
  const itemId = id || `${name}-${value}`;
  
  return (
    <div className="flex items-center space-x-2">
      <input
        type="radio"
        id={itemId}
        name={name}
        value={value}
        checked={isChecked}
        disabled={disabled}
        onChange={() => onValueChange(value)}
        className={cn(
          'h-4 w-4 rounded-full border border-gray-300 text-blue-600',
          'focus:ring-2 focus:ring-blue-500',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
      />
      {children && (
        <label 
          htmlFor={itemId} 
          className={cn(
            'text-sm font-medium cursor-pointer',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          {children}
        </label>
      )}
    </div>
  );
}
