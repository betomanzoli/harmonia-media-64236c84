
import React, { forwardRef } from 'react';
import { cn } from "@/lib/utils";
import { Slot } from '@/components/ui/slot';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
  children: React.ReactNode;
}

const buttonVariants = {
  variant: {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
    ghost: 'text-gray-700 hover:bg-gray-100',
    link: 'text-blue-600 underline-offset-4 hover:underline',
    destructive: 'bg-red-500 text-white hover:bg-red-600',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200'
  },
  size: {
    default: 'h-9 px-4 py-2',
    sm: 'h-8 px-3 text-xs',
    lg: 'h-10 px-8',
    icon: 'h-9 w-9'
  }
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'default',
  size = 'default',
  className = '',
  children,
  disabled = false,
  type = 'button',
  asChild = false,
  ...props
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50';
  
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      ref={ref}
      type={asChild ? undefined : type}
      disabled={disabled}
      className={cn(
        baseClasses, 
        buttonVariants.variant[variant],
        buttonVariants.size[size],
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
});

Button.displayName = "Button";

export { Button as default, buttonVariants };
