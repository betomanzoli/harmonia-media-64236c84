import React from 'react';
import { cn } from "@/lib/utils";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function Textarea({ 
  className = '', 
  error = false,
  disabled = false,
  ...props 
}: TextareaProps) {
  return (
    <textarea
      disabled={disabled}
      className={cn(
        'flex min-h-[60px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm',
        'placeholder:text-gray-500',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'resize-vertical',
        error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
        className
      )}
      {...props}
    />
  );
}
