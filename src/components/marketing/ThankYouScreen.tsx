
import React from 'react';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { LeadData } from './MarketingLandingPage';

interface ThankYouScreenProps {
  leadData: LeadData;
}

const ThankYouScreen: React.FC<ThankYouScreenProps> = ({ leadData }) => {
  // Personalize message based on responses
  const getPersonalizedMessage = () => {
    const projectType = leadData.responses.projectType;
    const musicStyle = leadData.responses.musicStyle;
    
    if (projectType === 'evento_pessoal') {
      return `Estamos criando a música perfeita para o seu evento especial!`;
    } else if (projectType === 'negocio') {
      return `Estamos preparando opções profissionais para o seu negócio!`;
    } else if (projectType === 'presente') {
      return `Sua ideia de presente musical é incrível! Estamos selecionando as melhores opções.`;
    } else {
      return `Estamos preparando recomendações personalizadas para você!`;
    }
  };

  return (
    <Card className="p-8 bg-[#1D1D1D] border-gray-800 shadow-xl text-center max-w-lg w-full">
      <h2 className="text-3xl font-bold mb-4">Perfeito, {leadData.name}!</h2>
      <p className="text-xl mb-8">{getPersonalizedMessage()}</p>
      
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-20 h-20 flex items-center justify-center">
          <Loader2 className="w-20 h-20 animate-spin text-blue-500 opacity-20" />
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 absolute" />
        </div>
        <p className="text-gray-400">
          Preparando sua experiência personalizada...
        </p>
        <p className="text-sm text-gray-500 mt-4">
          Você será redirecionado em instantes.
        </p>
      </div>
    </Card>
  );
};

export default ThankYouScreen;
