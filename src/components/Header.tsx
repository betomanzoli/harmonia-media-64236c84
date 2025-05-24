import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ FUNÇÃO PARA NAVEGAÇÃO DOS BOTÕES
  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-slate-900 shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* ✅ LOGO ORIGINAL harmonIA */}
          <Link to="/" className="flex items-center gap-3">
            {/* SVG Logo Original harmonIA */}
            <div className="w-10 h-10">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Ondas/barras do equalização musical */}
                <rect x="10" y="60" width="6" height="30" fill="#00c853" rx="3"/>
                <rect x="20" y="40" width="6" height="50" fill="#00c853" rx="3"/>
                <rect x="30" y="20" width="6" height="70" fill="#00c853" rx="3"/>
                <rect x="40" y="10" width="6" height="80" fill="#00c853" rx="3"/>
                <rect x="50" y="25" width="6" height="65" fill="#00c853" rx="3"/>
                <rect x="60" y="45" width="6" height="45" fill="#00c853" rx="3"/>
                <rect x="70" y="35" width="6" height="55" fill="#00c853" rx="3"/>
                <rect x="80" y="50" width="6" height="40" fill="#00c853" rx="3"/>
                {/* Nota musical sobreposta */}
                <circle cx="35" cy="55" r="8" fill="#00c853"/>
                <rect x="43" y="25" width="2" height="30" fill="#00c853"/>
              </svg>
            </div>
            <div className="text-2xl font-bold">
              <span className="text-white">harmon</span>
              <span className="text-green-400">IA</span>
            </div>
          </Link>
          
          {/* ✅ NAVEGAÇÃO DESKTOP */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-green-400 transition-colors">
              Início
            </Link>
            <Link to="/portfolio" className="text-white hover:text-green-400 transition-colors">
              Portfólio
            </Link>
            <Link to="/servicos" className="text-white hover:text-green-400 transition-colors">
              Serviços
            </Link>
            <Link to="/briefing" className="text-white hover:text-green-400 transition-colors">
              Briefing
            </Link>
            <Link to="/contato" className="text-white hover:text-green-400 transition-colors">
              Contato
            </Link>
          </nav>

          {/* ✅ BOTÃO CTA DESKTOP */}
          <div className="hidden md:block">
            <Button 
              onClick={() => navigate('/briefing')}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Contratar Agora
            </Button>
          </div>

          {/* ✅ BOTÃO MENU MOBILE */}
          <Button
            variant="ghost"
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* ✅ MENU MOBILE */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-700">
            <nav className="flex flex-col space-y-4">
              <button 
                onClick={() => handleNavigation('/')}
                className="text-white hover:text-green-400 transition-colors text-left"
              >
                Início
              </button>
              <button 
                onClick={() => handleNavigation('/portfolio')}
                className="text-white hover:text-green-400 transition-colors text-left"
              >
                Portfólio
              </button>
              <button 
                onClick={() => handleNavigation('/servicos')}
                className="text-white hover:text-green-400 transition-colors text-left"
              >
                Serviços
              </button>
              <button 
                onClick={() => handleNavigation('/briefing')}
                className="text-white hover:text-green-400 transition-colors text-left"
              >
                Briefing
              </button>
              <button 
                onClick={() => handleNavigation('/contato')}
                className="text-white hover:text-green-400 transition-colors text-left"
              >
                Contato
              </button>
              
              {/* CTA Mobile */}
              <div className="pt-4 border-t border-slate-700">
                <Button 
                  onClick={() => handleNavigation('/briefing')}
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                >
                  Contratar Agora
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
