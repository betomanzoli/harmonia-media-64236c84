
import React from 'react';
import Logo from './Logo';
import { Phone, Mail, MapPin, Shield, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleWhatsAppContact = () => {
    window.open('https://wa.me/5511999999999', '_blank');
  };

  const handleEmailContact = () => {
    window.open('mailto:contato@harmonia.media', '_blank');
  };

  return (
    <footer className="bg-black pt-16 pb-8 px-6 md:px-10 relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div>
            <Logo />
            <p className="text-gray-400 mt-4">
              Criamos composições personalizadas usando o melhor da IA e o talento de músicos profissionais.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li><a href="#servicos" className="text-gray-400 hover:text-harmonia-green transition-colors">Serviços</a></li>
              <li><a href="#processo" className="text-gray-400 hover:text-harmonia-green transition-colors">Processo</a></li>
              <li><a href="#portfolio" className="text-gray-400 hover:text-harmonia-green transition-colors">Portfólio</a></li>
              <li><a href="#depoimentos" className="text-gray-400 hover:text-harmonia-green transition-colors">Depoimentos</a></li>
              <li><a href="#parceiro" className="text-gray-400 hover:text-harmonia-green transition-colors">Seja Nosso Parceiro</a></li>
              <li><a href="#briefing" className="text-gray-400 hover:text-harmonia-green transition-colors">Criar Música</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex gap-2 text-gray-400 cursor-pointer hover:text-harmonia-green transition-colors" onClick={handleWhatsAppContact}>
                <Phone className="w-5 h-5 text-harmonia-green shrink-0" />
                <span>+55 11 99999-9999</span>
              </li>
              <li className="flex gap-2 text-gray-400 cursor-pointer hover:text-harmonia-green transition-colors" onClick={handleEmailContact}>
                <Mail className="w-5 h-5 text-harmonia-green shrink-0" />
                <span>contato@harmonia.media</span>
              </li>
              <li className="flex gap-2 text-gray-400">
                <MapPin className="w-5 h-5 text-harmonia-green shrink-0" />
                <span>São Paulo, SP, Brasil</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Informações Legais</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-harmonia-green transition-colors flex items-center gap-1">
                <Shield className="w-4 h-4" /> Política de Privacidade
              </a></li>
              <li><a href="#" className="text-gray-400 hover:text-harmonia-green transition-colors flex items-center gap-1">
                <Shield className="w-4 h-4" /> Termos de Serviço
              </a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} HarmonIA. Todos os direitos reservados.</p>
        </div>

        <Button 
          onClick={scrollToTop}
          variant="ghost" 
          size="icon"
          className="absolute bottom-24 right-10 text-harmonia-green hover:text-white hover:bg-harmonia-green/20"
          aria-label="Voltar ao topo"
        >
          <ChevronUp className="h-6 w-6" />
        </Button>
      </div>
    </footer>
  );
};

export default Footer;
