
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-harmonia-green rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">hA</span>
              </div>
              <span className="text-xl font-bold text-gray-800">harmonIA</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-harmonia-green transition-colors"
            >
              Início
            </Link>
            <Link 
              to="/servicos" 
              className="text-gray-700 hover:text-harmonia-green transition-colors"
            >
              Serviços
            </Link>
            <Link 
              to="/portfolio" 
              className="text-gray-700 hover:text-harmonia-green transition-colors"
            >
              Portfólio
            </Link>
            <Link 
              to="/contato" 
              className="text-gray-700 hover:text-harmonia-green transition-colors"
            >
              Contato
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link 
              to="/briefing" 
              className="bg-harmonia-green hover:bg-harmonia-green/90 text-white px-6 py-2 rounded-md transition-colors"
            >
              Começar Projeto
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-harmonia-green transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Início
              </Link>
              <Link 
                to="/servicos" 
                className="text-gray-700 hover:text-harmonia-green transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Serviços
              </Link>
              <Link 
                to="/portfolio" 
                className="text-gray-700 hover:text-harmonia-green transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Portfólio
              </Link>
              <Link 
                to="/contato" 
                className="text-gray-700 hover:text-harmonia-green transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Contato
              </Link>
              <Link 
                to="/briefing" 
                className="bg-harmonia-green hover:bg-harmonia-green/90 text-white px-6 py-2 rounded-md transition-colors inline-block text-center mt-4"
                onClick={() => setIsMenuOpen(false)}
              >
                Começar Projeto
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
