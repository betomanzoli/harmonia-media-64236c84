
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Music, ArrowLeft } from 'lucide-react';
import HelpDialog from './HelpDialog';

interface HeaderProps {
  getApiUrl: () => string;
}

const Header: React.FC<HeaderProps> = ({ getApiUrl }) => {
  return (
    <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold mb-2">Banco de Dados de Áudio</h1>
        <p className="text-muted-foreground">
          Gerencie e obtenha links para exemplos de áudio para integração com chatbots
        </p>
      </div>
      
      <div className="mt-4 md:mt-0 flex gap-2">
        <Link to="/admin-j28s7d1k/portfolio">
          <Button variant="outline" className="flex items-center gap-1">
            <Music className="w-4 h-4 mr-1" />
            Portfólio
          </Button>
        </Link>
        
        <HelpDialog getApiUrl={getApiUrl} />
        
        <Link to="/">
          <Button variant="outline" className="flex items-center gap-1">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Página Inicial
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Header;
