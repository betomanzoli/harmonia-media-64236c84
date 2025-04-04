
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  external?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, className, onClick, external = false }) => {
  // Se o link começar com # ou for para a página atual com uma âncora
  if (href.startsWith('#') || (href.includes('#') && href.startsWith('/'))) {
    return (
      <a 
        href={href} 
        className={cn(
          "text-foreground hover:text-harmonia-green transition-colors duration-200 font-medium",
          className
        )}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }
  
  // Se for um link externo
  if (external || href.startsWith('http')) {
    return (
      <a 
        href={href} 
        className={cn(
          "text-foreground hover:text-harmonia-green transition-colors duration-200 font-medium",
          className
        )}
        target="_blank" 
        rel="noopener noreferrer"
        onClick={onClick}
      >
        {children}
      </a>
    );
  }
  
  // Para navegação interna
  return (
    <Link 
      to={href} 
      className={cn(
        "text-foreground hover:text-harmonia-green transition-colors duration-200 font-medium",
        className
      )}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default NavLink;
