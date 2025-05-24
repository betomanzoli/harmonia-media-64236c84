
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ConversationalBriefingProps {
  onComplete: (briefingId: string, packageType: 'essencial' | 'profissional' | 'premium') => void;
}

const ConversationalBriefing: React.FC<ConversationalBriefingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  
  const handleStartBriefing = () => {
    // In a real implementation, this would collect information from the user
    // and then generate a briefing ID upon completion
    
    // For now, we'll just simulate creating a briefing
    setTimeout(() => {
      const mockBriefingId = `brief-${Date.now()}`;
      onComplete(mockBriefingId, 'profissional');
    }, 1000);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Nos conte sobre seu projeto</h2>
      <p className="text-gray-600">
        Vamos criar uma música personalizada baseada nas suas ideias e preferências.
      </p>
      
      <div className="p-6 bg-gray-100 rounded-lg">
        <p className="mb-4">
          Clique abaixo para iniciar o processo de briefing conversacional.
          Vamos guiá-lo através de algumas perguntas para entender melhor o que você está procurando.
        </p>
        
        <Button 
          className="w-full bg-harmonia-green hover:bg-harmonia-green/90 text-white"
          onClick={handleStartBriefing}
        >
          Iniciar Briefing
        </Button>
      </div>
    </div>
  );
};

export default ConversationalBriefing;
