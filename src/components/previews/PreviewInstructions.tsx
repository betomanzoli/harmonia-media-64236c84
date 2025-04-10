
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Play, SendHorizonal, CheckCircle } from 'lucide-react';

interface PreviewInstructionsProps {
  status: 'waiting' | 'feedback' | 'approved';
}

const PreviewInstructions: React.FC<PreviewInstructionsProps> = ({ status }) => {
  const getInstructions = () => {
    switch (status) {
      case 'waiting':
        return {
          icon: <Play className="h-5 w-5 text-yellow-600" />,
          title: "Como avaliar suas prévias",
          description: (
            <ol className="list-decimal pl-5 mt-2 space-y-1 text-yellow-700">
              <li>Ouça cada versão musical abaixo</li>
              <li>Selecione a versão que mais lhe agrada</li>
              <li>Envie seu feedback detalhado sobre a versão selecionada</li>
              <li>Ou, se já estiver satisfeito, aprove diretamente a versão escolhida</li>
            </ol>
          ),
          variant: "yellow"
        };
      case 'feedback':
        return {
          icon: <SendHorizonal className="h-5 w-5 text-blue-600" />,
          title: "Seu feedback foi recebido",
          description: (
            <div className="mt-2 text-blue-700">
              <p>Agradecemos seu feedback! Nossa equipe está trabalhando nos ajustes solicitados.</p>
              <p className="mt-1">Você receberá uma notificação quando novas versões estiverem disponíveis para avaliação.</p>
            </div>
          ),
          variant: "blue"
        };
      case 'approved':
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-600" />,
          title: "Música aprovada!",
          description: (
            <div className="mt-2 text-green-700">
              <p>Obrigado pela sua aprovação! Estamos finalizando a produção da sua música personalizada.</p>
              <p className="mt-1">Você receberá a versão final em breve, junto com todos os arquivos correspondentes ao seu pacote.</p>
            </div>
          ),
          variant: "green"
        };
      default:
        return {
          icon: <Play className="h-5 w-5 text-yellow-600" />,
          title: "Como avaliar suas prévias",
          description: (
            <ol className="list-decimal pl-5 mt-2 space-y-1 text-yellow-700">
              <li>Ouça cada versão musical abaixo</li>
              <li>Selecione a versão que mais lhe agrada</li>
              <li>Envie seu feedback detalhado sobre a versão selecionada</li>
              <li>Ou, se já estiver satisfeito, aprove diretamente a versão escolhida</li>
            </ol>
          ),
          variant: "yellow"
        };
    }
  };
  
  const instructions = getInstructions();
  const bgColor = instructions.variant === "yellow" ? "bg-yellow-50" : 
                 instructions.variant === "blue" ? "bg-blue-50" : 
                 "bg-green-50";
  
  const borderColor = instructions.variant === "yellow" ? "border-yellow-200" : 
                     instructions.variant === "blue" ? "border-blue-200" : 
                     "border-green-200";
  
  return (
    <Alert className={`${bgColor} ${borderColor} border mb-6`}>
      <div className="flex items-start">
        <div className="mr-2 mt-0.5">
          {instructions.icon}
        </div>
        <div>
          <AlertTitle className="font-semibold mb-1">{instructions.title}</AlertTitle>
          <AlertDescription>
            {instructions.description}
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
};

export default PreviewInstructions;
