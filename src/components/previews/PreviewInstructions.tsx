
import React from 'react';
import { Check } from 'lucide-react';

interface PreviewInstructionsProps {
  status: 'waiting' | 'feedback' | 'approved';
}

const PreviewInstructions: React.FC<PreviewInstructionsProps> = ({ status }) => {
  if (status === 'approved') {
    return (
      <div className="bg-harmonia-green/20 border border-harmonia-green rounded-lg p-6 mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Check className="text-harmonia-green w-6 h-6" />
          <h2 className="text-xl font-semibold text-harmonia-green">Música Aprovada!</h2>
        </div>
        <p className="text-gray-300">
          Obrigado por aprovar a música! Nossa equipe está finalizando os detalhes 
          e você receberá a versão completa em breve no formato especificado no seu pacote.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-10">
      <h2 className="text-xl font-semibold mb-4">Como funciona:</h2>
      <ol className="space-y-2 text-gray-300">
        <li className="flex items-start gap-2">
          <span className="bg-harmonia-green/20 text-harmonia-green rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">1</span>
          <span>Ouça cada uma das versões propostas para sua música</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="bg-harmonia-green/20 text-harmonia-green rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">2</span>
          <span>Selecione a versão que você mais gostou clicando em "Selecionar esta versão"</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="bg-harmonia-green/20 text-harmonia-green rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">3</span>
          <span>Forneça feedback específico ou solicite alterações</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="bg-harmonia-green/20 text-harmonia-green rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">4</span>
          <span>
            Clique em "Enviar feedback" se deseja ajustes ou "Aprovar música" se está satisfeito com a versão escolhida
          </span>
        </li>
      </ol>
    </div>
  );
};

export default PreviewInstructions;
