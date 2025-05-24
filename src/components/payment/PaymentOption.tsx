
import React from 'react';
import { Button } from "@/components/ui/button";
import { ExternalLink, Percent, CreditCard } from 'lucide-react';

interface PaymentOptionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonText: string;
  onClick: () => void;
  isLoading: boolean;
  variant?: 'standard' | 'discount';
  children?: React.ReactNode;
}

const PaymentOption: React.FC<PaymentOptionProps> = ({
  title,
  description,
  icon,
  buttonText,
  onClick,
  isLoading,
  variant = 'standard',
  children
}) => {
  const bgGradient = variant === 'standard' 
    ? 'from-blue-50/10 to-blue-100/10' 
    : 'from-green-50/10 to-green-100/10';
  
  const borderHover = variant === 'standard'
    ? 'hover:border-blue-500/50'
    : 'hover:border-green-500/50';
    
  const buttonColor = variant === 'standard'
    ? 'bg-blue-500 hover:bg-blue-600'
    : 'bg-green-500 hover:bg-green-600';

  return (
    <div className={`border border-border rounded-lg p-3 ${borderHover} transition cursor-pointer bg-gradient-to-r ${bgGradient}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-opacity-20 flex items-center justify-center mr-3">
            {icon}
          </div>
          <div>
            <h3 className="font-medium text-sm">{title}</h3>
            <p className="text-xs text-gray-400">{description}</p>
            {children}
          </div>
        </div>
        <Button 
          disabled={isLoading} 
          onClick={onClick}
          className={`${buttonColor} text-sm px-3 py-1 h-auto`}
          size="sm"
        >
          {isLoading ? 'Processando...' : buttonText}
          {variant === 'standard' ? (
            <ExternalLink className="ml-1 h-3 w-3" />
          ) : (
            <Percent className="ml-1 h-3 w-3" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default PaymentOption;
