import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* ✅ LOGO SIMPLES */}
          <Link to="/" className="text-2xl font-bold text-green-600">
            harmonIA
          </Link>
          
          {/* ✅ NAVEGAÇÃO DESKTOP */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/sobre" className="text-gray-700 hover:text-green-600 transition-colors">
              Sobre
            </Link>
            <Link to="/servicos" className="text-gray-700 hover:text-green-600 transition-colors">
              Serviços
            </Link>
            <Link to="/portfolio" className="text-gray-700 hover:text-green-600 transition-colors">
              Portfolio
            </Link>
            <Link to="/contato" className="text-gray-700 hover:text-green-600 transition-colors">
              Contato
            </Link>
          </nav>

          {/* ✅ BOTÕES DE AÇÃO */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate('/briefing')}
            >
              Criar Música
            </Button>
            <Button
              onClick={() => navigate('/briefing')}
              className="bg-green-600 hover:bg-green-700"
            >
              Começar Agora
            </Button>
          </div>

          {/* ✅ BOTÃO MENU MOBILE (SEM PROP SIZE) */}
          <Button
            variant="ghost"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* ✅ MENU MOBILE */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/sobre" 
                className="text-gray-700 hover:text-green-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre
              </Link>
              <Link 
                to="/servicos" 
                className="text-gray-700 hover:text-green-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Serviços
              </Link>
              <Link 
                to="/portfolio" 
                className="text-gray-700 hover:text-green-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Portfolio
              </Link>
              <Link 
                to="/contato" 
                className="text-gray-700 hover:text-green-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contato
              </Link>
              <div className="pt-4 border-t border-gray-200">
                <Button
                  onClick={() => {
                    navigate('/briefing');
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Criar Música
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
