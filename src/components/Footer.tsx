
import React from 'react';
import Logo from './Logo';
import { MessageCircle, Mail, Shield, ChevronUp, Clock, FileCheck, Music, Package, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { siteConfig } from '@/config/site';
import NavLink from './NavLink';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleWhatsAppContact = () => {
    window.open(`https://wa.me/${siteConfig.contact.whatsapp}`, '_blank');
  };

  const handleEmailContact = () => {
    window.open(`mailto:${siteConfig.contact.email}`, '_blank');
  };

  const handlePaymentClick = () => {
    navigate('/pagamento');
  };

  return (
    <footer className="bg-black pt-16 pb-8 px-6 md:px-10 relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <Logo />
            <p className="text-gray-400 mt-4">
              Criamos composições personalizadas usando o melhor da IA e o talento de músicos profissionais.
            </p>
            <div className="mt-6">
              <Button onClick={handlePaymentClick} className="bg-harmonia-green hover:bg-harmonia-green/90 text-white">
                <DollarSign className="w-4 h-4 mr-2" />
                Contratar Agora
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <NavLink 
                  href="/acompanhar-pedido" 
                  className="text-gray-400 hover:text-harmonia-green transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Clock className="w-4 h-4" /> Acompanhar Pedido
                </NavLink>
              </li>
              <li>
                <NavLink 
                  href="/briefing" 
                  className="text-gray-400 hover:text-harmonia-green transition-colors flex items-center gap-1"
                >
                  <FileCheck className="w-4 h-4" /> Briefing
                </NavLink>
              </li>
              <li>
                <NavLink 
                  href="/pagamento" 
                  className="text-gray-400 hover:text-harmonia-green transition-colors flex items-center gap-1"
                >
                  <DollarSign className="w-4 h-4" /> Pagamento Direto
                </NavLink>
              </li>
              <li>
                <NavLink 
                  href="/pacotes" 
                  className="text-gray-400 hover:text-harmonia-green transition-colors flex items-center gap-1"
                >
                  <Package className="w-4 h-4" /> Pacotes
                </NavLink>
              </li>
              <li>
                <NavLink 
                  href="/portfolio" 
                  className="text-gray-400 hover:text-harmonia-green transition-colors flex items-center gap-1"
                >
                  <Music className="w-4 h-4" /> Portfólio
                </NavLink>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Contato</h3>
            <div className="space-y-3">
              <div 
                className="flex gap-2 text-gray-400 cursor-pointer hover:text-harmonia-green transition-colors"
                onClick={handleWhatsAppContact}
              >
                <MessageCircle className="w-5 h-5 text-harmonia-green shrink-0" />
                <span>+55 11 92058-5072</span>
              </div>
              <div 
                className="flex gap-2 text-gray-400 cursor-pointer hover:text-harmonia-green transition-colors"
                onClick={handleEmailContact}
              >
                <Mail className="w-5 h-5 text-harmonia-green shrink-0" />
                <span>{siteConfig.contact.email}</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-semibold mb-4">Informações Legais</h3>
              <ul className="space-y-2">
                <li>
                  <NavLink 
                    href="/privacidade" 
                    className="text-gray-400 hover:text-harmonia-green transition-colors flex items-center gap-1"
                  >
                    <Shield className="w-4 h-4" /> Política de Privacidade
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    href="/termos" 
                    className="text-gray-400 hover:text-harmonia-green transition-colors flex items-center gap-1"
                  >
                    <Shield className="w-4 h-4" /> Termos de Serviço
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} harmonIA. Todos os direitos reservados.</p>
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
