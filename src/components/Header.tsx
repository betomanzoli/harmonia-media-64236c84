import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Logo from './Logo';
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
  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
  }, [location.pathname]);
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
  return <header className="fixed w-full top-0 z-50 bg-slate-900 border-b border-slate-800">
      <div className="container mx-auto flex justify-between items-center py-3 px-4">
        {/* Logo on the left */}
        <Link to="/" className="text-white">
          <Logo />
        </Link>

        {/* Desktop Navigation moved to the right */}
        <div className="flex items-center">
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className={`text-sm ${isActive('/') ? 'text-harmonia-green' : 'text-gray-300 hover:text-white'}`}>
              Início
            </Link>
            <Link to="/portfolio" className={`text-sm ${isActive('/portfolio') ? 'text-harmonia-green' : 'text-gray-300 hover:text-white'}`}>
              Portfólio
            </Link>
            <Link to="/servicos" className={`text-sm ${isActive('/servicos') ? 'text-harmonia-green' : 'text-gray-300 hover:text-white'}`}>
              Serviços
            </Link>
            
            <Link to="/contato" className={`text-sm ${isActive('/contato') ? 'text-harmonia-green' : 'text-gray-300 hover:text-white'}`}>
              Contato
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="sm" className="text-gray-200 hover:text-white" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && <div className="md:hidden bg-background border border-border rounded-lg shadow-lg mt-2 p-4">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className={`text-sm ${isActive('/') ? 'text-harmonia-green' : 'text-gray-300 hover:text-white'}`} onClick={() => setIsMenuOpen(false)}>
                Início
              </Link>
              <Link to="/portfolio" className={`text-sm ${isActive('/portfolio') ? 'text-harmonia-green' : 'text-gray-300 hover:text-white'}`} onClick={() => setIsMenuOpen(false)}>
                Portfólio
              </Link>
              <Link to="/servicos" className={`text-sm ${isActive('/servicos') ? 'text-harmonia-green' : 'text-gray-300 hover:text-white'}`} onClick={() => setIsMenuOpen(false)}>
                Serviços
              </Link>
              <Link to="/briefing" className={`text-sm ${isActive('/briefing') ? 'text-harmonia-green' : 'text-gray-300 hover:text-white'}`} onClick={() => setIsMenuOpen(false)}>
                Briefing
              </Link>
              <Link to="/contato" className={`text-sm ${isActive('/contato') ? 'text-harmonia-green' : 'text-gray-300 hover:text-white'}`} onClick={() => setIsMenuOpen(false)}>
                Contato
              </Link>
            </nav>
          </div>}
      </div>
    </header>;
};
export default Header;