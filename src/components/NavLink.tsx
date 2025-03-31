
import React from 'react';
import { cn } from '@/lib/utils';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, className }) => {
  return (
    <a 
      href={href} 
      className={cn(
        "text-foreground hover:text-harmonia-green transition-colors duration-200 font-medium",
        className
      )}
    >
      {children}
    </a>
  );
};

export default NavLink;
