
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { siteConfig } from '@/config/site';

interface NavLinksProps {
  mobile?: boolean;
  closeMobileMenu?: () => void;
}

const NavLinks: React.FC<NavLinksProps> = ({ mobile = false, closeMobileMenu }) => {
  const handleClick = () => {
    if (mobile && closeMobileMenu) {
      closeMobileMenu();
    }
  };

  return (
    <div className={`flex ${mobile ? 'flex-col space-y-4' : 'space-x-1 md:space-x-2'}`}>
      <Button
        variant="ghost"
        size={mobile ? "default" : "sm"}
        className="text-gray-700 hover:text-gray-900 hover:bg-gray-100"
        asChild
      >
        <Link to="/" onClick={handleClick}>
          Home
        </Link>
      </Button>
      
      <Button
        variant="ghost"
        size={mobile ? "default" : "sm"}
        className="text-gray-700 hover:text-gray-900 hover:bg-gray-100"
        asChild
      >
        <Link to={siteConfig.urls.services} onClick={handleClick}>
          Serviços
        </Link>
      </Button>
      
      <Button
        variant="ghost"
        size={mobile ? "default" : "sm"}
        className="text-gray-700 hover:text-gray-900 hover:bg-gray-100"
        asChild
      >
        <Link to={siteConfig.urls.howitworks} onClick={handleClick}>
          Como Funciona
        </Link>
      </Button>
      
      <Button
        variant="ghost"
        size={mobile ? "default" : "sm"}
        className="text-gray-700 hover:text-gray-900 hover:bg-gray-100"
        asChild
      >
        <Link to={siteConfig.urls.packages} onClick={handleClick}>
          Pacotes
        </Link>
      </Button>
      
      <Button
        variant="ghost"
        size={mobile ? "default" : "sm"}
        className="text-gray-700 hover:text-gray-900 hover:bg-gray-100"
        asChild
      >
        <Link to={siteConfig.urls.portfolio} onClick={handleClick}>
          Portfólio
        </Link>
      </Button>
      
      <Button
        variant="ghost"
        size={mobile ? "default" : "sm"}
        className="text-gray-700 hover:text-gray-900 hover:bg-gray-100"
        asChild
      >
        <Link to={siteConfig.urls.contact} onClick={handleClick}>
          Contato
        </Link>
      </Button>
      
      <Button
        variant="default"
        size={mobile ? "default" : "sm"}
        className="bg-harmonia-green hover:bg-harmonia-green/90"
        asChild
      >
        <Link to="/pagamento" onClick={handleClick}>
          Pagamento Direto
        </Link>
      </Button>
    </div>
  );
};

export default NavLinks;
