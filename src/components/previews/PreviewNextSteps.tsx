
import React from 'react';
import { ArrowRight } from 'lucide-react';

interface PreviewNextStepsProps {
  status: string;
}

const PreviewNextSteps: React.FC<PreviewNextStepsProps> = ({ status }) => {
  const getNextSteps = () => {
    switch (status) {
      case 'pending':
        return [
          'Ouça todas as versões disponibilizadas',
          'Selecione sua favorita',
          'Envie feedback ou aprove a versão escolhida',
          'Nossa equipe irá trabalhar em sua solicitação'
        ];
      case 'feedback':
        return [
          'Sua solicitação foi enviada',
          'Nossa equipe está trabalhando nas alterações',
          'Novas versões serão disponibilizadas em breve',
          'Você receberá uma notificação por email'
        ];
      case 'approved':
        return [
          'Sua música está sendo finalizada',
          'A masterização será realizada',
          'Você receberá a versão final em breve',
          'Você será notificado por email quando estiver pronto'
        ];
      case 'completed':
        return [
          'Seu projeto foi concluído com sucesso',
          'Você pode baixar a versão final abaixo',
          'Considere adquirir serviços complementares',
          'Obrigado por escolher nossa plataforma!'
        ];
      default:
        return [
          'Ouça as versões disponíveis',
          'Selecione sua favorita',
          'Envie feedback ou aprove',
          'Aguarde a finalização do seu projeto'
        ];
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Próximos passos</h3>
      <div className="space-y-3">
        {getNextSteps().map((step, index) => (
          <div key={index} className="flex items-start">
            <ArrowRight className="h-5 w-5 text-harmonia-green mr-3 mt-0.5" />
            <p>{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreviewNextSteps;
