
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import Logo from './Logo';
import { MessageCircle, ChevronUp, DollarSign, Mail, Phone } from 'lucide-react';
import NavLink from './NavLink';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [chatType, setChatType] = useState<'email' | 'whatsapp' | null>(null);

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
    <header className="py-4 px-6 md:px-10 border-b border-border fixed w-full top-0 left-0 backdrop-blur-md bg-background/95 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-10">
          <div onClick={() => navigate('/')} className="cursor-pointer">
            <Logo />
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink href="#servicos">Serviços</NavLink>
            <NavLink href="#processo">Processo</NavLink>
            <NavLink href="#portfolio">Portfólio</NavLink>
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
                  <Button 
                    onClick={handleWhatsAppChat} 
                    className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    WhatsApp (Resposta em até 2h)
                  </Button>
                  
                  <Button 
                    onClick={handleEmailChat}
                    variant="outline" 
                    className="flex items-center gap-2"
                  >
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
          
          <Button 
            onClick={handlePriceCalculation}
            className="bg-harmonia-green hover:bg-harmonia-green/90 text-white flex items-center gap-1"
          >
            <DollarSign className="w-4 h-4" />
            Calcular Preço
          </Button>

          <Button 
            onClick={scrollToTop}
            variant="outline" 
            size="icon"
            className="fixed bottom-6 right-6 z-50 rounded-full h-12 w-12 shadow-lg bg-harmonia-green/90 hover:bg-harmonia-green text-white border-none"
          >
            <ChevronUp className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
