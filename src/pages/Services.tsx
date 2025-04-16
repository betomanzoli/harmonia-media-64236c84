
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Music, Clock, FilePlus, Users, Calendar, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import NavLink from '@/components/NavLink';

const ServicesPage: React.FC = () => {
  const navigate = useNavigate();

  const packages = [
    {
      id: 'essencial',
      name: 'Essencial',
      price: 'R$ 997',
      description: 'Ideal para quem busca uma música personalizada com um arranjo simples e eficaz.',
      features: [
        'Uma composição personalizada',
        'Até 3 minutos de duração',
        'Até 3 versões diferentes para escolha',
        'Entrega em até 10 dias úteis',
        'Arranjo simples (até 5 instrumentos)',
        'Arquivos em alta qualidade (WAV e MP3)'
      ],
      recommended: false
    },
    {
      id: 'profissional',
      name: 'Profissional',
      price: 'R$ 1.997',
      description: 'Perfeito para ocasiões especiais com arranjos mais elaborados e detalhados.',
      features: [
        'Uma composição personalizada',
        'Até 4 minutos de duração',
        'Até 5 versões diferentes para escolha',
        'Entrega em até 7 dias úteis',
        'Arranjo completo (até 12 instrumentos)',
        'Arquivos em alta qualidade (WAV e MP3)',
        'Uma revisão após feedback'
      ],
      recommended: true
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 'R$ 2.997',
      description: 'Nossa experiência mais exclusiva com atendimento prioritário e máxima qualidade.',
      features: [
        'Uma composição personalizada',
        'Até 5 minutos de duração',
        'Até 7 versões diferentes para escolha',
        'Entrega em até 5 dias úteis',
        'Arranjo premium (instrumentos ilimitados)',
        'Arquivos em alta qualidade (WAV, MP3, STEMS)',
        'Até duas revisões após feedback',
        'Atendimento prioritário'
      ],
      recommended: false
    }
  ];

  return (
    <div className="pt-24 pb-20 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="flex items-center gap-1 text-gray-400 hover:text-white"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para a página inicial
          </Button>
        </div>
        
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Nossos Pacotes</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Escolha o pacote que melhor se adapta às suas necessidades e transforme sua história em uma 
            composição musical personalizada.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {packages.map((pkg) => (
            <Card key={pkg.id} className={`relative overflow-hidden ${pkg.recommended ? 'border-harmonia-green ring-1 ring-harmonia-green' : ''}`}>
              {pkg.recommended && (
                <div className="absolute top-0 right-0 bg-harmonia-green text-white text-xs px-3 py-1">
                  Mais popular
                </div>
              )}
              <CardHeader>
                <CardTitle>{pkg.name}</CardTitle>
                <CardDescription>{pkg.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">{pkg.price}</div>
                <ul className="space-y-2">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-harmonia-green mt-1"><Check className="h-4 w-4" /></span>
                      <span className="text-sm text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <NavLink href={`/pagamento/${pkg.id}`} className="w-full">
                  <Button className="w-full bg-harmonia-green hover:bg-harmonia-green/90">
                    Contratar Agora
                  </Button>
                </NavLink>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="bg-gradient-to-r from-background to-gray-900 p-8 rounded-lg border border-gray-800 mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Perguntas Frequentes</h2>
          <div className="space-y-4">
            <div className="p-4 border border-gray-800 rounded-lg">
              <h3 className="font-bold mb-2">Como funciona o processo de criação?</h3>
              <p className="text-gray-400">
                Após a compra, você preencherá um briefing detalhado sobre sua história e preferências musicais. 
                Nossa equipe criará versões iniciais para você avaliar e, após seu feedback, finalizaremos a 
                composição perfeita para você.
              </p>
            </div>
            <div className="p-4 border border-gray-800 rounded-lg">
              <h3 className="font-bold mb-2">Posso solicitar ajustes na música?</h3>
              <p className="text-gray-400">
                Sim! Dependendo do pacote escolhido, você tem direito a um número específico de revisões. 
                Estamos comprometidos em entregar uma música que você realmente ame.
              </p>
            </div>
            <div className="p-4 border border-gray-800 rounded-lg">
              <h3 className="font-bold mb-2">Quais são os direitos sobre a música?</h3>
              <p className="text-gray-400">
                Você recebe os direitos de uso da música para fins pessoais. Para uso comercial, 
                oferecemos opções adicionais que podem ser discutidas durante o processo.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button
            onClick={() => navigate('/calculadora')}
            className="bg-harmonia-green hover:bg-harmonia-green/90 flex items-center gap-2"
          >
            Calcular Preço Personalizado
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
