import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Music, Sparkles, Play } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Detectar scroll para efeito no header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/sobre', label: 'Sobre', icon: Music },
    { path: '/servicos', label: 'Serviços', icon: Sparkles },
    { path: '/portfolio', label: 'Portfolio', icon: Play },
    { path: '/contato', label: 'Contato', icon: Music }
  ];

  return (
    <header 
      className={`header-harmonia fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-2 shadow-harmonia' : 'py-4'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* ✅ LOGO harmonIA */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <div className="w-10 h-10 bg-harmonia-gradient rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <Music className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-harmonia-secondary rounded-full flex items-center justify-center">
                <Sparkles className="w-2 h-2 text-white" />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold heading-harmonia">harmonIA</h1>
              <p className="text-xs text-gray-500 -mt-1">Música com IA</p>
            </div>
          </Link>
          
          {/* ✅ NAVEGAÇÃO DESKTOP */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 group ${
                    isActive(item.path)
                      ? 'text-harmonia-primary bg-purple-50'
                      : 'text-gray-700 hover:text-harmonia-primary hover:bg-gray-50'
                  }`}
                >
                  <IconComponent className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* ✅ BOTÕES DE AÇÃO */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate('/briefing')}
              className="border-harmonia-primary text-harmonia-primary hover:bg-harmonia-primary hover:text-white transition-all duration-300"
            >
              <Music className="w-4 h-4 mr-2" />
              Criar Música
            </Button>
            <Button
              onClick={() => navigate('/briefing')}
              className="btn-harmonia px-6"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Começar Agora
            </Button>
          </div>

          {/* ✅ BOTÃO MENU MOBILE */}
          <Button
            variant="ghost"
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-harmonia-primary" />
            ) : (
              <Menu className="h-6 w-6 text-harmonia-primary" />
            )}
          </Button>
        </div>

        {/* ✅ MENU MOBILE */}
        {isMenuOpen && (
          <div className="lg:hidden animate-fade-in">
            <div className="py-4 border-t border-gray-100 mt-4">
              <nav className="flex flex-col space-y-2">
                {navItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive(item.path)
                          ? 'text-harmonia-primary bg-purple-50'
                          : 'text-gray-700 hover:text-harmonia-primary hover:bg-gray-50'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
                
                {/* Botões mobile */}
                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigate('/briefing');
                      setIsMenuOpen(false);
                    }}
                    className="w-full border-harmonia-primary text-harmonia-primary hover:bg-harmonia-primary hover:text-white"
                  >
                    <Music className="w-4 h-4 mr-2" />
                    Criar Música
                  </Button>
                  <Button
                    onClick={() => {
                      navigate('/briefing');
                      setIsMenuOpen(false);
                    }}
                    className="w-full btn-harmonia"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Começar Agora
                  </Button>
                </div>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
