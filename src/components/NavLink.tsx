
import React from 'react';
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
  
  // Handle click for different link types
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
  
  // If the link starts with # or is for the current page with an anchor
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
  
  // If it's an external link
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
  
  // For internal navigation, use Link from react-router-dom
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
