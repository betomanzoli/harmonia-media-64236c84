
import React from 'react';

interface PreviewInstructionsProps {
  status: string;
}

const PreviewInstructions: React.FC<PreviewInstructionsProps> = ({ status }) => {
  let message = '';
  
  switch (status) {
    case 'pending':
      message = 'Ouça as versões abaixo e selecione sua favorita. Você pode enviar feedback específico ou aprovar a versão que preferir.';
      break;
    case 'feedback':
      message = 'Obrigado pelo seu feedback! Nossa equipe está trabalhando nas alterações solicitadas. Em breve novas versões serão disponibilizadas.';
      break;
    case 'approved':
      message = 'Você aprovou uma das versões! Nossa equipe está finalizando sua música e você receberá a versão final em breve.';
      break;
    case 'completed':
      message = 'Seu projeto foi finalizado! Você pode baixar a versão final abaixo.';
      break;
    default:
      message = 'Bem-vindo ao sistema de prévia. Ouça as versões abaixo e nos envie seu feedback.';
  }

  return (
    <div className="bg-gray-50 border-l-4 border-blue-500 p-4 mb-6">
      <p className="text-gray-700">{message}</p>
    </div>
  );
};

export default PreviewInstructions;
