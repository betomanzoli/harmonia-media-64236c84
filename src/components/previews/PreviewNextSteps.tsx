
import React from 'react';

interface PreviewNextStepsProps {
  status: 'waiting' | 'feedback' | 'approved';
}

const PreviewNextSteps: React.FC<PreviewNextStepsProps> = ({ status }) => {
  if (status === 'approved') {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="font-semibold mb-4">Próximos passos:</h3>
      <ul className="space-y-2 text-gray-400">
        <li>• Após sua escolha e feedback, nossa equipe fará os ajustes necessários.</li>
        <li>• Você receberá uma notificação por e-mail quando novas versões estiverem disponíveis.</li>
        <li>• Uma vez aprovada a versão final, a música será masterizada e entregue conforme seu pacote.</li>
        <li>• Você terá acesso a este link de preview por 30 dias após a aprovação final.</li>
      </ul>
    </div>
  );
};

export default PreviewNextSteps;
