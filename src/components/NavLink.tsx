
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  external?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, className, onClick, external = false }) => {
  const location = useLocation();
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  const handleClick = () => {
    // If it's a link to an anchor on the same page
    if (href.startsWith('#')) {
      const element = document.getElementById(href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (onClick) {
      onClick();
    }
    
    // If it's a regular link (not anchor or external), scroll to top
    if (!href.startsWith('#') && !external && !href.startsWith('http')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Se o link começar com # ou for para a página atual com uma âncora
  if (href.startsWith('#')) {
    return (
      <a 
        href={href} 
        className={cn(
          "text-foreground hover:text-harmonia-green transition-colors duration-200 font-medium",
          className
        )}
        onClick={handleClick}
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
      onClick={handleClick}
    >
      {children}
    </Link>
  );
};

export default NavLink;
