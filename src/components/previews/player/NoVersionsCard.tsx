
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from 'lucide-react';

const NoVersionsCard: React.FC = () => {
  return (
    <Card>
      <CardContent className="py-8">
        <div className="text-center">
          <div className="mx-auto w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mb-4">
            <AlertCircle className="h-5 w-5 text-amber-500" />
          </div>
          <h3 className="text-lg font-medium mb-2">Nenhuma versão disponível</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Ainda não há versões disponíveis para este projeto. 
            Nossa equipe está trabalhando na criação da sua música personalizada
            e em breve você receberá um email com as primeiras prévias.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoVersionsCard;
