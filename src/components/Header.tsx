
import React from 'react';
import { Button } from "@/components/ui/button";
import Logo from './Logo';
import { MessageCircle, Calendar, DollarSign } from 'lucide-react';
import NavLink from './NavLink';

const Header: React.FC = () => {
  return (
    <header className="py-4 px-6 md:px-10 border-b border-border fixed w-full top-0 left-0 backdrop-blur-md bg-background/95 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-10">
          <Logo />
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink href="#servicos">Serviços</NavLink>
            <NavLink href="#processo">Processo</NavLink>
            <NavLink href="#portfolio">Portfólio</NavLink>
            <NavLink href="#depoimentos">Depoimentos</NavLink>
            <NavLink href="#parceiro" className="text-harmonia-green">Seja Nosso Parceiro</NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            Chat
          </Button>
          <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Agendar Consulta
          </Button>
          <Button className="bg-harmonia-green hover:bg-harmonia-green/90 text-white flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            Calcular Preço
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
