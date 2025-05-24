import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Music, FileText, Headphones, Star, ExternalLink, Clock, Shield } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();

  // ✅ SERVIÇOS EXTRAS COM DADOS REAIS
  const servicosExtras = [
    {
      id: 'revisao-extra',
      title: 'Revisão Extra',
      price: 'R$ 79,00',
      originalPrice: null,
      isPromotional: true,
      description: 'Peça uma revisão adicional para ajustar a letra ou melodia da sua música.',
      features: [
        'Prazo: Até 3 dias úteis após a solicitação',
        'Disponível para todos os pacotes'
      ],
      buttonText: 'Adicionar Revisão Extra',
      icon: FileText,
      type: 'service_extra',
      mercadoPagoLink: import.meta.env.VITE_MERCADOPAGO_REVISAO_EXTRA
    },
    {
      id: 'registro-bn-letra',
      title: 'Registro na BN (Letra)',
      price: 'R$ 99,00',
      originalPrice: null,
      isPromotional: true,
      description: 'Proteja legalmente a letra da sua música com registro na Biblioteca Nacional.',
      features: [
        'Não protege melodia, arranjos ou gravações',
        'Não gera royalties',
        'Ideal para proteção sem intenção comercial imediata',
        'Prazo: Até 30 dias úteis'
      ],
      buttonText: 'Registrar Letra na BN',
      icon: Shield,
      type: 'service_extra',
      mercadoPagoLink: import.meta.env.VITE_MERCADOPAGO_REGISTRO_BN_LETRA
    },
    {
      id: 'registro-ubc',
      title: 'Registro UBC',
      price: 'R$ 249,00',
      originalPrice: null,
      isPromotional: true,
      description: 'Registro completo na UBC (letra, melodia, arranjo) com código ISWC para direitos de execução pública.',
      features: [
        'Proteção integral (letra + melodia + arranjo)',
        'Direitos autorais em execuções públicas',
        'Essencial para receber royalties',
        'Ideal para uso comercial da música',
        'Disponível para todos os pacotes'
      ],
      buttonText: 'Registrar na UBC',
      icon: Star,
      type: 'service_extra',
      mercadoPagoLink: import.meta.env.VITE_MERCADOPAGO_REGISTRO_UBC
    },
    {
      id: 'masterizacao-premium',
      title: 'Masterização Premium',
      price: 'R$ 149,00',
      originalPrice: null,
      isPromotional: true,
      description: 'Melhore a qualidade sonora com masterização avançada em formato WAV 24-bit.',
      features: [
        'Ideal para apresentações públicas ou uso comercial',
        'Adicionado ao prazo original do pacote'
      ],
      buttonText: 'Adicionar Masterização Premium',
      icon: Headphones,
      type: 'service_extra',
      mercadoPagoLink: import.meta.env.VITE_MERCADOPAGO_MASTERIZACAO_PREMIUM
    },
    {
      id: 'stems-separados',
      title: 'Stems Separados',
      price: 'R$ 129,00',
      originalPrice: null,
      isPromotional: true,
      description: 'Receba faixas separadas (vocais, instrumentos, etc.) para maior flexibilidade em edições futuras.',
      features: [
        'Disponível apenas para pacotes Essencial e Profissional',
        'Adicionado ao prazo original do pacote'
      ],
      buttonText: 'Adicionar Stems Separados',
      icon: Music,
      type: 'service_extra',
      mercadoPagoLink: import.meta.env.VITE_MERCADOPAGO_STEMS_SEPARADOS
    },
    {
      id: 'entrega-expressa',
      title: 'Entrega Expressa (48h)',
      price: 'R$ 149,00',
      originalPrice: null,
      isPromotional: true,
      description: 'Priorize seu projeto e receba sua música finalizada em até 48 horas.',
      features: [
        'Sujeito à disponibilidade da equipe',
        'Depende da complexidade do briefing'
      ],
      buttonText: 'Adicionar Entrega Expressa',
      icon: Clock,
      type: 'service_extra',
      mercadoPagoLink: import.meta.env.VITE_MERCADOPAGO_ENTREGA_EXPRESSA
    },
    {
      id: 'partitura',
      title: 'Partituras MusicXML/PDF',
      price: 'R$ 149,00',
      originalPrice: null,
      isPromotional: true,
      description: 'Receba a partitura completa da sua música em formato MusicXML ou PDF, ideal para músicos e bandas.',
      features: [
        'Prazo: Até 7 dias úteis após a entrega do áudio',
        'Compatível com todos os softwares de notação musical'
      ],
      buttonText: 'Adicionar Partitura',
      icon: FileText,
      type: 'service_extra',
      mercadoPagoLink: import.meta.env.VITE_MERCADOPAGO_PARTITURA
    },
    {
      id: 'composicao-letra',
      title: 'Composição sem IA (letra)',
      price: 'R$ 499,00',
      originalPrice: null,
      isPromotional: true,
      description: 'Composição 100% humana da letra da sua música, criada por um de nossos letristas profissionais.',
      features: [
        'Processo 100% criativo humano',
        'Inclui 2 revisões gratuitas',
        'Prazo: Até 10 dias úteis'
      ],
      buttonText: 'Adicionar Composição (Letra)',
      icon: FileText,
      type: 'service_extra',
      mercadoPagoLink: import.meta.env.VITE_MERCADOPAGO_COMPOSICAO_LETRA
    },
    {
      id: 'composicao-letra-melodia',
      title: 'Composição sem IA (letra + melodia)',
      price: 'R$ 1.499,00',
      originalPrice: null,
      isPromotional: true,
      description: 'Composição 100% humana da letra e melodia da sua música, incluindo partitura completa (sem gravação).',
      features: [
        'Processo 100% criativo humano',
        'Inclui partitura em formato MusicXML/PDF',
        '3 revisões gratuitas',
        'Prazo: Até 15 dias úteis'
      ],
      buttonText: 'Adicionar Composição (Letra + Melodia)',
      icon: Music,
      type: 'service_extra',
      mercadoPagoLink: import.meta.env.VITE_MERCADOPAGO_COMPOSICAO_LETRA_MELODIA
    },
    {
      id: 'composicao-completa',
      title: 'Composição sem IA (completa)',
      price: 'Consultar valor',
      originalPrice: null,
      isPromotional: true,
      description: 'Composição 100% humana com letra, melodia e gravação profissional da sua música.',
      features: [
        'Processo 100% criativo e produção humana',
        'Inclui compositores e músicos profissionais',
        'Gravação em estúdio profissional',
        'Masterização de áudio incluída',
        'Prazo: A combinar conforme complexidade'
      ],
      buttonText: 'Entre em contato',
      icon: Star,
      type: 'contact',
      mercadoPagoLink: null
    }
  ];

  // ✅ FUNÇÃO PARA LIDAR COM CLIQUES DOS BOTÕES
  const handleServiceClick = (service: typeof servicosExtras[0]) => {
    switch (service.type) {
      case 'service_extra':
        if (service.mercadoPagoLink) {
          window.open(service.mercadoPagoLink, '_blank');
        }
        break;
      
      case 'contact':
        const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
        const message = encodeURIComponent(`Olá! Gostaria de mais informações sobre ${service.title}.`);
        window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
        break;
      
      default:
        console.log('Tipo de serviço não reconhecido:', service.type);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* ✅ HERO SECTION */}
      <section className="py-20 px-6 text-center">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Música feita por{' '}
            <span className="text-green-400">humanos + IA</span>
            <br />
            perfeita para você
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Criamos composições personalizadas combinando o melhor da inteligência artificial 
            com o talento de músicos profissionais.
          </p>
          <Button 
            onClick={() => navigate('/briefing')}
            className="bg-green-500 hover:bg-green-600 text-white text-lg px-8 py-3"
          >
            Contratar Agora
          </Button>
        </div>
      </section>

      {/* ✅ SEÇÃO "NOSSOS SERVIÇOS" - PACOTES PRINCIPAIS */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Nossos Serviços
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* ✅ PACOTE ESSENCIAL */}
            <Card className="bg-slate-800 border-slate-700 text-white">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold text-white mb-2">Essencial</h3>
                <div className="text-3xl font-bold text-green-400 mb-4">R$ {import.meta.env.VITE_PRICE_ESSENCIAL}</div>
                <ul className="text-left space-y-2 mb-6">
                  <li className="text-gray-300">• Música personalizada</li>
                  <li className="text-gray-300">• Letra customizada</li>
                  <li className="text-gray-300">• Gravação básica</li>
                  <li className="text-gray-300">• Formato MP3</li>
                </ul>
                <Button 
                  onClick={() => navigate('/briefing')}
                  className="w-full bg-green-500 hover:bg-green-600"
                >
                  Escolher Essencial
                </Button>
              </CardContent>
            </Card>

            {/* ✅ PACOTE PROFISSIONAL */}
            <Card className="bg-green-500 border-green-400 text-white transform scale-105">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold text-white mb-2">Profissional</h3>
                <div className="text-3xl font-bold text-white mb-4">R$ {import.meta.env.VITE_PRICE_PROFISSIONAL}</div>
                <ul className="text-left space-y-2 mb-6">
                  <li className="text-white">• Música personalizada</li>
                  <li className="text-white">• Letra customizada</li>
                  <li className="text-white">• Gravação profissional</li>
                  <li className="text-white">• Mixagem incluída</li>
                  <li className="text-white">• Formatos MP3 + WAV</li>
                </ul>
                <Button 
                  onClick={() => navigate('/briefing')}
                  className="w-full bg-white text-green-500 hover:bg-gray-100"
                >
                  Escolher Profissional
                </Button>
              </CardContent>
            </Card>

            {/* ✅ PACOTE PREMIUM */}
            <Card className="bg-slate-800 border-slate-700 text-white">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold text-white mb-2">Premium</h3>
                <div className="text-3xl font-bold text-green-400 mb-4">R$ {import.meta.env.VITE_PRICE_PREMIUM}</div>
                <ul className="text-left space-y-2 mb-6">
                  <li className="text-gray-300">• Música personalizada</li>
                  <li className="text-gray-300">• Letra customizada</li>
                  <li className="text-gray-300">• Gravação premium</li>
                  <li className="text-gray-300">• Mixagem + Masterização</li>
                  <li className="text-gray-300">• Todos os formatos</li>
                  <li className="text-gray-300">• Revisões ilimitadas</li>
                </ul>
                <Button 
                  onClick={() => navigate('/briefing')}
                  className="w-full bg-green-500 hover:bg-green-600"
                >
                  Escolher Premium
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ✅ SEÇÃO "SERVIÇOS EXTRAS" */}
      <section className="py-16 px-6 bg-slate-800">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Serviços Extras
          </h2>
          <p className="text-gray-300 text-center mb-12 max-w-2xl mx-auto">
            Complemente sua música com nossos serviços adicionais. 
            Pagamento direto, sem necessidade de contrato.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicosExtras.map((service) => {
              const IconComponent = service.icon;
              return (
                <Card key={service.id} className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600 transition-colors">
                  <CardContent className="p-6">
                    {/* Header do Card */}
                    <div className="flex items-center gap-3 mb-4">
                      <IconComponent className="w-6 h-6 text-green-400" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">
                          {service.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-2xl font-bold text-yellow-400">
                            {service.price}
                          </span>
                          {service.isPromotional && (
                            <span className="text-xs bg-yellow-400 text-black px-2 py-1 rounded">
                              Promocional
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Descrição */}
                    <p className="text-gray-300 text-sm mb-4">
                      {service.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, index) => (
                        <li key={index} className="text-xs text-gray-400 flex items-start gap-2">
                          <span className="text-green-400">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {/* ✅ BOTÃO FUNCIONAL */}
                    <Button 
                      onClick={() => handleServiceClick(service)}
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-medium"
                      disabled={service.type === 'service_extra' && !service.mercadoPagoLink}
                    >
                      {service.type === 'service_extra' && (
                        <ExternalLink className="w-4 w-4 mr-2" />
                      )}
                      {service.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
