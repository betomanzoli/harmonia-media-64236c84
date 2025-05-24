
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ApprovedFeedbackProps {
  projectId?: string;
}

export const ApprovedFeedback: React.FC<ApprovedFeedbackProps> = ({ projectId }) => {
  const navigate = useNavigate();
  
  return (
    <Card className="p-6 border-green-500 bg-green-50 text-center">
      <Check className="w-8 h-8 text-green-500 mx-auto mb-4" />
      <h3 className="text-xl font-bold mb-2">Música Aprovada!</h3>
      <p className="mb-4">Você já aprovou esta música. Nossa equipe está trabalhando na finalização.</p>
      {projectId && (
        <Button 
          onClick={() => navigate(`/acompanhar-pedido/${projectId}`)} 
          className="bg-harmonia-green hover:bg-harmonia-green/90"
        >
          Acompanhar Pedido
        </Button>
      )}
    </Card>
  );
};
