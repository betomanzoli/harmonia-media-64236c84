import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Music, 
  Sparkles, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  Heart,
  ExternalLink
} from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { to: '/sobre', label: 'Sobre Nós' },
    { to: '/servicos', label: 'Serviços' },
    { to: '/portfolio', label: 'Portfolio' },
    { to: '/contato', label: 'Contato' },
    { to: '/briefing', label: 'Criar Música' }
  ];

  const services = [
    { to: '/briefing', label: 'Música Essencial' },
    { to: '/briefing', label: 'Música Profissional' },
    { to: '/briefing', label: 'Música Premium' },
    { to: '/portfolio', label: 'Exemplos' }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' }
  ];

  return (
    <footer className="footer-harmonia">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* ✅ COLUNA 1: LOGO E DESCRIÇÃO */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-orange-400 rounded-xl flex items-center justify-center">
                  <Music className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">harmonIA</h3>
                <p className="text-gray-300 text-sm">Música com Inteligência Artificial</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed max-w-md">
              Criamos músicas personalizadas usando inteligência artificial com supervisão humana. 
              Transforme suas histórias e emoções em melodias únicas e emocionantes.
            </p>
            
            <div className="flex items-center gap-2 text-gray-300 mb-4">
              <Heart className="w-4 h-4 text-red-400" />
              <span className="text-sm">Feito com amor para eternizar momentos especiais</span>
            </div>

            {/* Redes Sociais */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <Button
                    key={social.label}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
                    asChild
                  >
                    <a 
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                    >
                      <IconComponent className="h-5 w-5" />
                    </a>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* ✅ COLUNA 2: LINKS RÁPIDOS */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Links Rápidos</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-orange-400 rounded-full group-hover:scale-150 transition-transform"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ✅ COLUNA 3: SERVIÇOS */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Nossos Serviços</h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <Link 
                    to={service.to} 
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <Sparkles className="w-3 h-3 text-purple-400 group-hover:scale-110 transition-transform" />
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* CTA Footer */}
            <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
              <h5 className="text-white font-medium mb-2">Pronto para começar?</h5>
              <p className="text-gray-300 text-sm mb-3">Crie sua música personalizada agora!</p>
              <Button asChild className="btn-harmonia-secondary w-full text-sm">
                <Link to="/briefing">
                  <Music className="w-4 h-4 mr-2" />
                  Começar Agora
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* ✅ SEÇÃO DE CONTATO */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center gap-3 text-gray-300">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <Mail className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-white font-medium">Email</p>
                <p className="text-sm">contato@harmonia.media</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-gray-300">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <Phone className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-white font-medium">Telefone</p>
                <p className="text-sm">(11) 99999-9999</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-gray-300">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <MapPin className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-white font-medium">Localização</p>
                <p className="text-sm">São Paulo, SP</p>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ LINHA INFERIOR */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Music className="w-4 h-4" />
              <span>© {currentYear} harmonIA. Todos os direitos reservados.</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <Link 
                to="/privacidade" 
                className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
              >
                Política de Privacidade
                <ExternalLink className="w-3 h-3" />
              </Link>
              <Link 
                to="/termos" 
                className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
              >
                Termos de Uso
                <ExternalLink className="w-3 h-3" />
              </Link>
              <div className="text-gray-500 text-xs">
                Feito com <Heart className="w-3 h-3 inline text-red-400" /> pela equipe harmonIA
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
