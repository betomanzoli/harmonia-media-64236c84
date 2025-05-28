
import React from 'react';

interface HarmoniaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
}

const HarmoniaLogo: React.FC<HarmoniaLogoProps> = ({ 
  size = 'md', 
  className = '',
  showText = true 
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  return (
    <div className={`flex items-center ${className}`}>
      {/* Logo icon - onda sonora estilizada */}
      <div className={`${sizeClasses[size]} relative mr-3`}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Gradiente para o logo */}
          <defs>
            <linearGradient id="harmoniaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#059669" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
          </defs>
          
          {/* Ondas sonoras */}
          <path
            d="M8 24C8 24 12 16 16 24C16 24 20 32 24 24C24 24 28 16 32 24C32 24 36 32 40 24"
            stroke="url(#harmoniaGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          
          {/* Círculo central representando harmonia */}
          <circle
            cx="24"
            cy="24"
            r="3"
            fill="url(#harmoniaGradient)"
          />
          
          {/* Aura ao redor */}
          <circle
            cx="24"
            cy="24"
            r="8"
            stroke="url(#harmoniaGradient)"
            strokeWidth="1"
            strokeOpacity="0.3"
            fill="none"
          />
        </svg>
      </div>
      
      {/* Texto da marca */}
      {showText && (
        <h1 className={`font-bold text-green-600 ${textSizeClasses[size]}`}>
          harmon<span className="text-green-800">IA</span>
        </h1>
      )}
    </div>
  );
};

export default HarmoniaLogo;
