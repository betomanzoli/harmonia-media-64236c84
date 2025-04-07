
import React from 'react';
import Logo from './Logo';
import { Phone, Mail, Shield, ChevronUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import { siteConfig } from '@/config/site';

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
  
  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0);
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
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/acompanhar-pedido" 
                  className="text-gray-400 hover:text-harmonia-green transition-colors cursor-pointer flex items-center gap-1"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <Clock className="w-4 h-4" /> Acompanhar Pedido
                </Link>
              </li>
              <li>
                <Link 
                  to="/qualificacao" 
                  className="text-gray-400 hover:text-harmonia-green transition-colors"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Qualificação
                </Link>
              </li>
              <li>
                <Link 
                  to="/pacotes" 
                  className="text-gray-400 hover:text-harmonia-green transition-colors"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Pacotes
                </Link>
              </li>
              <li>
                <Link 
                  to="/portfolio" 
                  className="text-gray-400 hover:text-harmonia-green transition-colors"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Portfólio
                </Link>
              </li>
              <li>
                <a 
                  href="/#processo" 
                  className="text-gray-400 hover:text-harmonia-green transition-colors"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Processo
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex gap-2 text-gray-400 cursor-pointer hover:text-harmonia-green transition-colors" onClick={handleWhatsAppContact}>
                <Phone className="w-5 h-5 text-harmonia-green shrink-0" />
                <span>{siteConfig.contact.phone}</span>
              </li>
              <li className="flex gap-2 text-gray-400 cursor-pointer hover:text-harmonia-green transition-colors" onClick={handleEmailContact}>
                <Mail className="w-5 h-5 text-harmonia-green shrink-0" />
                <span>{siteConfig.contact.email}</span>
              </li>
            </ul>
            <div className="mt-6">
              <h3 className="font-semibold mb-4">Informações Legais</h3>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/privacidade" 
                    className="text-gray-400 hover:text-harmonia-green transition-colors flex items-center gap-1"
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    <Shield className="w-4 h-4" /> Política de Privacidade
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/termos" 
                    className="text-gray-400 hover:text-harmonia-green transition-colors flex items-center gap-1"
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    <Shield className="w-4 h-4" /> Termos de Serviço
                  </Link>
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
