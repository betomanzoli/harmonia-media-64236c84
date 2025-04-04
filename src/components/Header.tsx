
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Logo from './Logo';
import { MessageCircle, ChevronUp, DollarSign, Mail, Phone, Menu } from 'lucide-react';
import NavLink from './NavLink';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate, Link } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isHome, setIsHome] = useState(true);
  
  useEffect(() => {
    // Verificar se estamos na página inicial
    setIsHome(window.location.pathname === '/' || window.location.pathname === '');
    
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleWhatsAppChat = () => {
    window.open('https://wa.me/5511999999999', '_blank');
  };
  
  const handleEmailChat = () => {
    window.open('mailto:contato@harmonia.media', '_blank');
  };
  
  const handlePriceCalculation = () => {
    navigate('/calculadora');
  };
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <>
      <header className="py-4 px-6 md:px-10 border-b border-border fixed w-full top-0 left-0 backdrop-blur-md bg-background/95 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-10">
            <Link to="/" className="cursor-pointer">
              <Logo />
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
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
              <NavLink href="/briefing">Briefing</NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  Chat
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col h-full p-6">
                  <h2 className="text-xl font-bold mb-6">Fale Conosco</h2>
                  <p className="text-gray-400 mb-8">Escolha como prefere falar com nossa equipe:</p>
                  
                  <div className="grid gap-4">
                    <Button onClick={handleWhatsAppChat} className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      WhatsApp (Resposta em até 2h)
                    </Button>
                    
                    <Button onClick={handleEmailChat} variant="outline" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email (Resposta em até 24h)
                    </Button>
                  </div>
                  
                  <div className="mt-auto text-sm text-gray-400">
                    <p>Horário de atendimento:</p>
                    <p>Segunda a sexta, das 9h às 18h</p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            {/* Menu mobile */}
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
                    <NavLink href="/briefing">Briefing</NavLink>
                    <NavLink href="/calculadora">Calculadora</NavLink>
                  </nav>
                  
                  <div className="mt-8 pt-8 border-t border-border">
                    <h3 className="font-semibold mb-4">Contato</h3>
                    <div className="space-y-4">
                      <Button onClick={handleWhatsAppChat} className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        WhatsApp
                      </Button>
                      <Button onClick={handleEmailChat} variant="outline" className="w-full flex items-center gap-2">
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

      {/* Botão de voltar ao topo */}
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
