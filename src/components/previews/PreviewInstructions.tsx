
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Info, CheckCircle } from 'lucide-react';

interface PreviewInstructionsProps {
  status: 'waiting' | 'feedback' | 'approved';
}

const PreviewInstructions: React.FC<PreviewInstructionsProps> = ({ status = 'waiting' }) => {
  switch (status) {
    case 'waiting':
      return (
        <Alert className="mb-8 bg-yellow-50 border-yellow-200 text-yellow-800">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Bem-vindo à página de avaliação</AlertTitle>
          <AlertDescription>
            Ouça as versões disponíveis abaixo e escolha a que mais gostou. Você pode enviar feedback 
            específico sobre cada uma delas ou aprovar diretamente a sua preferida.
          </AlertDescription>
        </Alert>
      );
    case 'feedback':
      return (
        <Alert className="mb-8 bg-blue-50 border-blue-200 text-blue-800">
          <Info className="h-4 w-4" />
          <AlertTitle>Em processo de ajustes</AlertTitle>
          <AlertDescription>
            Obrigado pelo seu feedback! Nossa equipe está trabalhando nos ajustes solicitados. 
            Logo você receberá uma notificação com as novas versões.
          </AlertDescription>
        </Alert>
      );
    case 'approved':
      return (
        <Alert className="mb-8 bg-green-50 border-green-200 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Música aprovada!</AlertTitle>
          <AlertDescription>
            Estamos felizes que você aprovou a música! Nossa equipe está trabalhando na 
            finalização e você receberá o arquivo em breve.
          </AlertDescription>
        </Alert>
      );
    default:
      return (
        <Alert className="mb-8 bg-yellow-50 border-yellow-200 text-yellow-800">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Bem-vindo à página de avaliação</AlertTitle>
          <AlertDescription>
            Ouça as versões disponíveis abaixo e escolha a que mais gostou. Você pode enviar feedback 
            específico sobre cada uma delas ou aprovar diretamente a sua preferida.
          </AlertDescription>
        </Alert>
      );
  }
};

export default PreviewInstructions;
