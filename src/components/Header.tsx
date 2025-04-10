
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Logo from './Logo';
import { DollarSign, Mail, Phone, Menu, Clock, ChevronUp } from 'lucide-react';
import NavLink from './NavLink';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { siteConfig } from '@/config/site';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isHome, setIsHome] = useState(true);
  
  useEffect(() => {
    setIsHome(location.pathname === '/' || location.pathname === '');
    
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  const handleWhatsAppContact = () => {
    window.open(`https://wa.me/${siteConfig.contact.whatsapp}`, '_blank');
  };
  
  const handleEmailContact = () => {
    window.open(`mailto:${siteConfig.contact.email}`, '_blank');
  };
  
  const handlePriceCalculation = () => {
    navigate('/calculadora');
    window.scrollTo(0, 0);
  };
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white z-50 shadow-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-10">
            <Link to="/" className="cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
              <Logo />
            </Link>
            <nav className="hidden md:flex space-x-8">
              {isHome ? (
                <>
                  <NavLink href="#servicos">Serviços</NavLink>
                  <NavLink href="#processo">Processo</NavLink>
                  <NavLink href="#portfolio">Portfólio</NavLink>
                </>
              ) : (
                <>
                  <NavLink href="/pacotes">Serviços</NavLink>
                  <NavLink href="/#processo">Processo</NavLink>
                  <NavLink href="/portfolio">Portfólio</NavLink>
                </>
              )}
              <NavLink href="/qualificacao">Qualificação</NavLink>
              <NavLink href="/acompanhar-pedido">Acompanhar Pedido</NavLink>
              <NavLink to="/preview-library">Biblioteca de Prévias</NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="hidden md:flex"
                >
                  <Phone className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background border border-border p-2">
                <DropdownMenuItem onClick={handleWhatsAppContact} className="cursor-pointer">
                  <Phone className="mr-2 h-4 w-4" />
                  <span>WhatsApp</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleEmailContact} className="cursor-pointer">
                  <Mail className="mr-2 h-4 w-4" />
                  <span>Email</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col h-full p-6 pt-10">
                  <nav className="flex flex-col space-y-4">
                    {isHome ? (
                      <>
                        <NavLink href="#servicos">Serviços</NavLink>
                        <NavLink href="#processo">Processo</NavLink>
                        <NavLink href="#portfolio">Portfólio</NavLink>
                      </>
                    ) : (
                      <>
                        <NavLink href="/pacotes">Serviços</NavLink>
                        <NavLink href="/#processo">Processo</NavLink>
                        <NavLink href="/portfolio">Portfólio</NavLink>
                      </>
                    )}
                    <NavLink href="/qualificacao">Qualificação</NavLink>
                    <NavLink href="/calculadora">Calculadora</NavLink>
                    <NavLink href="/acompanhar-pedido" className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> Acompanhar Pedido
                    </NavLink>
                  </nav>
                  
                  <div className="mt-8 pt-8 border-t border-border">
                    <h3 className="font-semibold mb-4">Contato</h3>
                    <div className="space-y-4">
                      <Button onClick={handleWhatsAppContact} className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        WhatsApp
                      </Button>
                      <Button onClick={handleEmailContact} variant="outline" className="w-full flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            <Button onClick={handlePriceCalculation} className="bg-harmonia-green hover:bg-harmonia-green/90 text-white flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              Calcular Preço
            </Button>
          </div>
        </div>
      </header>

      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          className="fixed right-6 bottom-24 p-2 rounded-full bg-harmonia-green hover:bg-harmonia-green/90 z-40"
          size="icon"
        >
          <ChevronUp className="w-5 h-5" />
        </Button>
      )}
    </>
  );
};

export default Header;
