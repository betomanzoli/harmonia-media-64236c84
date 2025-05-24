import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* ✅ LOGO E CTA */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              {/* Logo harmonIA */}
              <div className="w-8 h-8">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <rect x="10" y="60" width="6" height="30" fill="#00c853" rx="3"/>
                  <rect x="20" y="40" width="6" height="50" fill="#00c853" rx="3"/>
                  <rect x="30" y="20" width="6" height="70" fill="#00c853" rx="3"/>
                  <rect x="40" y="10" width="6" height="80" fill="#00c853" rx="3"/>
                  <rect x="50" y="25" width="6" height="65" fill="#00c853" rx="3"/>
                  <rect x="60" y="45" width="6" height="45" fill="#00c853" rx="3"/>
                  <rect x="70" y="35" width="6" height="55" fill="#00c853" rx="3"/>
                  <rect x="80" y="50" width="6" height="40" fill="#00c853" rx="3"/>
                  <circle cx="35" cy="55" r="8" fill="#00c853"/>
                  <rect x="43" y="25" width="2" height="30" fill="#00c853"/>
                </svg>
              </div>
              <div className="text-xl font-bold">
                <span className="text-white">harmon</span>
                <span className="text-green-400">IA</span>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 text-sm">
              Criamos composições personalizadas usando os melhores 
              da IA e o talento de músicos profissionais.
            </p>
            
            <Button 
              onClick={() => navigate('/briefing')}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Contratar Agora
            </Button>
          </div>

          {/* ✅ LINKS RÁPIDOS */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/acompanhar-pedido" 
                  className="text-green-400 hover:text-green-300 transition-colors text-sm flex items-center gap-2"
                >
                  📋 Acompanhar Pedido
                </Link>
              </li>
              <li>
                <Link 
                  to="/briefing" 
                  className="text-green-400 hover:text-green-300 transition-colors text-sm flex items-center gap-2"
                >
                  📝 Briefing
                </Link>
              </li>
              <li>
                <Link 
                  to="/pacotes" 
                  className="text-green-400 hover:text-green-300 transition-colors text-sm flex items-center gap-2"
                >
                  💳 Pacotes e Preços
                </Link>
              </li>
              <li>
                <Link 
                  to="/portfolio" 
                  className="text-green-400 hover:text-green-300 transition-colors text-sm flex items-center gap-2"
                >
                  🎵 Portfólio
                </Link>
              </li>
            </ul>
          </div>

          {/* ✅ CONTATO */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <div className="space-y-2 text-sm">
              <a 
                href="tel:+5511526550722"
                className="text-gray-300 hover:text-green-400 transition-colors flex items-center gap-2"
              >
                📞 +55 11 5265-5072
              </a>
              <a 
                href="mailto:contato@harmonia.media"
                className="text-gray-300 hover:text-green-400 transition-colors flex items-center gap-2"
              >
                ✉️ contato@harmonia.media
              </a>
              <Link 
                to="/contato"
                className="text-green-400 hover:text-green-300 transition-colors flex items-center gap-2"
              >
                💬 Formulário de Contato
              </Link>
            </div>
          </div>

          {/* ✅ INFORMAÇÕES LEGAIS */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Informações Legais</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/privacidade" 
                  className="text-green-400 hover:text-green-300 transition-colors text-sm flex items-center gap-2"
                >
                  🔒 Política de Privacidade
                </Link>
              </li>
              <li>
                <Link 
                  to="/termos" 
                  className="text-green-400 hover:text-green-300 transition-colors text-sm flex items-center gap-2"
                >
                  📋 Termos de Serviço
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin-j28s7d1k/login" 
                  className="text-gray-500 hover:text-gray-400 transition-colors text-xs"
                >
                  Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ✅ COPYRIGHT */}
        <div className="border-t border-slate-700 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 harmonIA. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
