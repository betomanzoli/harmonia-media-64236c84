
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface QualificationResultsProps {
  formValues: Record<string, any>;
  briefingData: any[];
}

const QualificationResults: React.FC<QualificationResultsProps> = ({
  formValues,
  briefingData
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
          Qualificação Concluída
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600">
          Obrigado por completar nossa qualificação inicial! 
          Analisaremos suas respostas e entraremos em contato em breve.
        </p>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Resumo das suas respostas:</h3>
          <div className="space-y-2 text-sm">
            {Object.entries(formValues).map(([key, value]) => (
              <div key={key}>
                <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
                <span>{Array.isArray(value) ? value.join(', ') : String(value)}</span>
              </div>
            ))}
          </div>
        </div>
        
        <Button onClick={() => window.location.href = '/'} className="w-full">
          Voltar ao Início
        </Button>
      </CardContent>
    </Card>
  );
};

export default QualificationResults;
