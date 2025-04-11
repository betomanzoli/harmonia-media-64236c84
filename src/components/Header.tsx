
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Calculator, FileCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isAdminRoute = location.pathname.includes('admin-j28s7d1k');

  if (isAdminRoute) {
    return null;
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-black/80 backdrop-blur-sm shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-white font-bold text-xl">
            harmonIA
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`text-sm ${isActive('/') ? 'text-harmonia-green' : 'text-gray-300 hover:text-white'}`}
            >
              Início
            </Link>
            <Link 
              to="/portfolio" 
              className={`text-sm ${isActive('/portfolio') ? 'text-harmonia-green' : 'text-gray-300 hover:text-white'}`}
            >
              Portfólio
            </Link>
            <Link 
              to="/services" 
              className={`text-sm ${isActive('/services') ? 'text-harmonia-green' : 'text-gray-300 hover:text-white'}`}
            >
              Serviços
            </Link>
            <Link 
              to="/briefing" 
              className={`text-sm ${isActive('/briefing') ? 'text-harmonia-green' : 'text-gray-300 hover:text-white'}`}
            >
              Briefing
            </Link>
            <Link 
              to="/contact" 
              className={`text-sm ${isActive('/contact') ? 'text-harmonia-green' : 'text-gray-300 hover:text-white'}`}
            >
              Contato
            </Link>
            
            <div className="flex items-center gap-2 ml-2">
              <Button asChild size="sm" className="bg-harmonia-green hover:bg-harmonia-green/90 text-white">
                <Link to="/calculadora" className="flex items-center gap-1">
                  <Calculator className="w-4 h-4" />
                  Calcular Preço
                </Link>
              </Button>
              
              <Button asChild size="sm" variant="outline" className="border-harmonia-green/70 text-harmonia-green hover:bg-harmonia-green/10">
                <Link to="/qualificacao" className="flex items-center gap-1">
                  <FileCheck className="w-4 h-4" />
                  Qualificação
                </Link>
              </Button>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-200 hover:text-white"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-background border border-border rounded-lg shadow-lg mt-2 p-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className={`text-sm ${isActive('/') ? 'text-harmonia-green' : 'text-gray-300 hover:text-white'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Início
              </Link>
              <Link 
                to="/portfolio" 
                className={`text-sm ${isActive('/portfolio') ? 'text-harmonia-green' : 'text-gray-300 hover:text-white'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Portfólio
              </Link>
              <Link 
                to="/services" 
                className={`text-sm ${isActive('/services') ? 'text-harmonia-green' : 'text-gray-300 hover:text-white'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Serviços
              </Link>
              <Link 
                to="/briefing" 
                className={`text-sm ${isActive('/briefing') ? 'text-harmonia-green' : 'text-gray-300 hover:text-white'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Briefing
              </Link>
              <Link 
                to="/contact" 
                className={`text-sm ${isActive('/contact') ? 'text-harmonia-green' : 'text-gray-300 hover:text-white'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contato
              </Link>
              
              <div className="flex flex-col gap-2 pt-2 border-t border-gray-700">
                <Button asChild size="sm" className="bg-harmonia-green hover:bg-harmonia-green/90 text-white">
                  <Link to="/calculadora" className="flex items-center gap-1" onClick={() => setIsMenuOpen(false)}>
                    <Calculator className="w-4 h-4" />
                    Calcular Preço
                  </Link>
                </Button>
                
                <Button asChild size="sm" variant="outline" className="border-harmonia-green/70 text-harmonia-green hover:bg-harmonia-green/10">
                  <Link to="/qualificacao" className="flex items-center gap-1" onClick={() => setIsMenuOpen(false)}>
                    <FileCheck className="w-4 h-4" />
                    Qualificação
                  </Link>
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
