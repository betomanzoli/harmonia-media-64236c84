import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Music, FileText, Headphones, Star, ExternalLink } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();

  // ✅ LINKS MERCADOPAGO PARA SERVIÇOS EXTRAS (PAGAMENTO DIRETO)
  const mercadoPagoLinks = {
    partitura: 'https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=1308986966-8b9c6f7d-4a5e-4d3c-9b2f-3e1a8c7d9f0b',
    composicaoLetra: 'https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=1308986966-2c5f8e9a-1b3d-4f6h-8j2k-5l7m9n0p3q4r',
    composicaoLetraMelodia: 'https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=1308986966-7h3j5k8l-9m1n-2p4q-6r8s-0t2u4v6w8x0y',
    composicaoCompleta: null // Consultar valor - não tem link direto
  };

  const services = [
    {
      id: 'partitura',
      title: 'Partitura MusicXML/PDF',
      price: 'R$149,00',
      originalPrice: null,
      isPromotional: true,
      description: 'Receba a partitura completa da sua música em formato MusicXML ou PDF, ideal para músicos e bandas.',
      features: [
        'Prazo: Até 7 dias úteis após a entrega do áudio',
        'Compatível com todos os softwares de notação musical'
      ],
      buttonText: 'Adicionar Partitura MusicXML/PDF',
      icon: FileText,
      type: 'service_extra', // ✅ SERVIÇO EXTRA
      mercadoPagoLink: mercadoPagoLinks.partitura
    },
    {
      id: 'composicao-letra',
      title: 'Composição sem IA (letra)',
      price: 'R$499,00',
      originalPrice: null,
      isPromotional: true,
      description: 'Composição 100% humana da letra da sua música, criada por um de nossos letristas profissionais.',
      features: [
        'Processo 100% criativo humano',
        'Na letra e melodia gravadas',
        'Prazo: Até 10 dias úteis'
      ],
      buttonText: 'Adicionar Composição sem IA (letra)',
      icon: Music,
      type: 'service_extra', // ✅ SERVIÇO EXTRA
      mercadoPagoLink: mercadoPagoLinks.composicaoLetra
    },
    {
      id: 'composicao-letra-melodia',
      title: 'Composição sem IA (letra + melodia)',
      price: 'R$1499,00',
      originalPrice: null,
      isPromotional: true,
      description: 'Composição 100% humana da letra e melodia da sua música, incluindo partitura completa com gravação.',
      features: [
        'Processo 100% criativo humano',
        'Na letra partitura em formato MusicXML/PDF',
        '+ melody gravadas',
        'Prazo: Até 15 dias úteis'
      ],
      buttonText: 'Comprar Agora',
      icon: Headphones,
      type: 'service_extra', // ✅ SERVIÇO EXTRA
      mercadoPagoLink: mercadoPagoLinks.composicaoLetraMelodia
    },
    {
      id: 'composicao-completa',
      title: 'Composição sem IA (completa)',
      price: 'Consultar valor',
      originalPrice: null,
      isPromotional: true,
      description: 'Composição 100% humana com letra, melodia e gravação profissional da sua música.',
      features: [
        'Processo 100% criativo e gravação humana',
        'Letra e composições e múltiplos vocais/instrumentos',
        'Gravação em estúdio profissional',
        'Masterização do áudio incluída',
        'Prazo: A combinar conforme complexidade'
      ],
      buttonText: 'Entre em contato',
      icon: Star,
      type: 'contact', // ✅ CONTATO (SEM VALOR FIXO)
      mercadoPagoLink: null
    }
  ];

  // ✅ FUNÇÃO PARA LIDAR COM CLIQUES DOS BOTÕES
  const handleServiceClick = (service: typeof services[0]) => {
    switch (service.type) {
      case 'service_extra':
        if (service.mercadoPagoLink) {
          // ✅ PAGAMENTO DIRETO MERCADOPAGO
          window.open(service.mercadoPagoLink, '_blank');
        }
        break;
      
      case 'contact':
        // ✅ REDIRECIONAR PARA CONTATO
        navigate('/contato');
        break;
      
      default:
        console.log('Tipo de serviço não reconhecido:', service.type);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* ✅ HERO SECTION ORIGINAL */}
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

      {/* ✅ SEÇÃO "COMO FUNCIONA" */}
      <section className="py-16 px-6 bg-slate-800">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Como Funciona
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Briefing', desc: 'Conte sua história' },
              { step: '2', title: 'Criação', desc: 'IA + músicos criam' },
              { step: '3', title: 'Revisão', desc: 'Você aprova' },
              { step: '4', title: 'Entrega', desc: 'Música pronta' },
              { step: '5', title: 'Mixagem', desc: 'Áudio profissional' },
              { step: '6', title: 'Master', desc: 'Finalização' },
              { step: '7', title: 'Entrega', desc: 'Arquivos finais' },
              { step: '8', title: 'Suporte', desc: 'Pós-entrega' }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">{item.step}</span>
                </div>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
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
                <div className="text-3xl font-bold text-green-400 mb-4">R$ 219</div>
                <ul className="text-left space-y-2 mb-6">
                  <li className="text-gray-300">• Música personalizada</li>
                  <li className="text-gray-300">• Letra customizada</li>
                  <li className="text-gray-300">• Gravação básica</li>
                  <li className="text-gray-300">• Formato MP3</li>
                </ul>
                <Button 
                  onClick={() => navigate('/contract/essencial')}
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
                <div className="text-3xl font-bold text-white mb-4">R$ 479</div>
                <ul className="text-left space-y-2 mb-6">
                  <li className="text-white">• Música personalizada</li>
                  <li className="text-white">• Letra customizada</li>
                  <li className="text-white">• Gravação profissional</li>
                  <li className="text-white">• Mixagem incluída</li>
                  <li className="text-white">• Formatos MP3 + WAV</li>
                </ul>
                <Button 
                  onClick={() => navigate('/contract/profissional')}
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
                <div className="text-3xl font-bold text-green-400 mb-4">R$ 969</div>
                <ul className="text-left space-y-2 mb-6">
                  <li className="text-gray-300">• Música personalizada</li>
                  <li className="text-gray-300">• Letra customizada</li>
                  <li className="text-gray-300">• Gravação premium</li>
                  <li className="text-gray-300">• Mixagem + Masterização</li>
                  <li className="text-gray-300">• Todos os formatos</li>
                  <li className="text-gray-300">• Revisões ilimitadas</li>
                </ul>
                <Button 
                  onClick={() => navigate('/contract/premium')}
                  className="w-full bg-green-500 hover:bg-green-600"
                >
                  Escolher Premium
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ✅ SEÇÃO "SERVIÇOS EXTRAS" - PAGAMENTO DIRETO */}
      <section className="py-16 px-6 bg-slate-800">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Serviços Extras
          </h2>
          <p className="text-gray-300 text-center mb-12 max-w-2xl mx-auto">
            Complemente sua música com nossos serviços adicionais. 
            Pagamento direto, sem necessidade de contrato.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => {
              const IconComponent = service.icon;
              return (
                <Car
