
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightCircle, MessageSquare, CheckCircle, Clock } from 'lucide-react';

interface PreviewNextStepsProps {
  status: string;
}

const PreviewNextSteps: React.FC<PreviewNextStepsProps> = ({ status }) => {
  let steps: { title: string; description: string; icon: React.ReactNode; active: boolean }[] = [];
  
  switch (status) {
    case 'waiting':
      steps = [
        {
          title: "Avalie as versões",
          description: "Ouça cada versão disponível e escolha a que mais lhe agrada.",
          icon: <Clock className="h-5 w-5 text-harmonia-green" />,
          active: true
        },
        {
          title: "Envie seu feedback",
          description: "Compartilhe suas impressões ou solicite ajustes, se necessário.",
          icon: <MessageSquare className="h-5 w-5 text-gray-400" />,
          active: false
        },
        {
          title: "Aprove sua música",
          description: "Após os ajustes, aprove a versão final para finalização.",
          icon: <CheckCircle className="h-5 w-5 text-gray-400" />,
          active: false
        }
      ];
      break;
    case 'feedback':
      steps = [
        {
          title: "Avaliação realizada",
          description: "Você já avaliou as versões disponíveis.",
          icon: <Clock className="h-5 w-5 text-harmonia-green" />,
          active: false
        },
        {
          title: "Feedback enviado",
          description: "Seu feedback foi enviado. Estamos trabalhando nos ajustes.",
          icon: <MessageSquare className="h-5 w-5 text-harmonia-green" />,
          active: true
        },
        {
          title: "Aguardando aprovação",
          description: "Após os ajustes, você poderá avaliar as novas versões.",
          icon: <CheckCircle className="h-5 w-5 text-gray-400" />,
          active: false
        }
      ];
      break;
    case 'approved':
      steps = [
        {
          title: "Avaliação realizada",
          description: "Você avaliou as versões disponíveis.",
          icon: <Clock className="h-5 w-5 text-harmonia-green" />,
          active: false
        },
        {
          title: "Feedback enviado",
          description: "Você compartilhou suas impressões sobre a música.",
          icon: <MessageSquare className="h-5 w-5 text-harmonia-green" />,
          active: false
        },
        {
          title: "Música aprovada",
          description: "Você aprovou a música final. Parabéns!",
          icon: <CheckCircle className="h-5 w-5 text-harmonia-green" />,
          active: true
        }
      ];
      break;
    default:
      return null;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximos Passos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={index} className="flex">
              <div className={`mr-4 flex-shrink-0 mt-1 ${step.active ? 'text-harmonia-green' : 'text-gray-300'}`}>
                {step.icon}
              </div>
              <div className={`${!step.active && 'text-gray-400'}`}>
                <h3 className={`font-medium ${step.active ? 'text-harmonia-green' : ''}`}>{step.title}</h3>
                <p className="text-sm mt-1">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="mx-auto flex justify-center">
                  <ArrowRightCircle className="h-5 w-5 text-gray-300 hidden" />
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PreviewNextSteps;
