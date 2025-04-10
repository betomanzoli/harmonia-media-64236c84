
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, Music } from 'lucide-react';

interface PreviewNextStepsProps {
  status: 'waiting' | 'feedback' | 'approved';
}

const PreviewNextSteps: React.FC<PreviewNextStepsProps> = ({ status }) => {
  const getContent = () => {
    switch (status) {
      case 'waiting':
        return {
          title: "Próximos passos",
          icon: <Clock className="h-5 w-5 text-harmonia-green" />,
          content: (
            <div className="space-y-4">
              <p>
                Ouça, avalie e forneça seu feedback para cada versão apresentada. 
                Sua avaliação é fundamental para garantirmos que a música final corresponda às suas expectativas.
              </p>
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h4 className="text-sm font-medium mb-2">O que acontece após enviar seu feedback?</h4>
                <ol className="list-decimal pl-5 text-sm space-y-1 text-gray-600">
                  <li>Nossa equipe analisará seus comentários</li>
                  <li>Implementaremos os ajustes necessários</li>
                  <li>Você receberá novas versões para avaliação (se aplicável)</li>
                  <li>Após aprovação, finalizaremos a produção</li>
                </ol>
              </div>
            </div>
          )
        };
      case 'feedback':
        return {
          title: "Implementando seus ajustes",
          icon: <Music className="h-5 w-5 text-harmonia-green" />,
          content: (
            <div className="space-y-4">
              <p>
                Agradecemos por seu feedback detalhado! Nossa equipe criativa está trabalhando 
                para implementar as alterações solicitadas na sua música personalizada.
              </p>
              <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                <h4 className="text-sm font-medium mb-2 text-blue-800">Próximas etapas:</h4>
                <ol className="list-decimal pl-5 text-sm space-y-1 text-blue-700">
                  <li>Revisão das suas sugestões pela equipe de produção</li>
                  <li>Implementação dos ajustes solicitados</li>
                  <li>Novas versões serão enviadas em até 3-5 dias úteis</li>
                  <li>Você receberá uma notificação por email quando estiverem disponíveis</li>
                </ol>
              </div>
            </div>
          )
        };
      case 'approved':
        return {
          title: "Música aprovada - Próximos passos",
          icon: <CheckCircle2 className="h-5 w-5 text-harmonia-green" />,
          content: (
            <div className="space-y-4">
              <p>
                Parabéns! Sua música personalizada foi aprovada e nossa equipe está finalizando 
                os últimos detalhes para entregar a versão completa e definitiva.
              </p>
              <div className="bg-green-50 p-4 rounded-md border border-green-200">
                <h4 className="text-sm font-medium mb-2 text-green-800">O que acontece agora:</h4>
                <ol className="list-decimal pl-5 text-sm space-y-1 text-green-700">
                  <li>Finalização da produção (mixagem e masterização completas)</li>
                  <li>Preparação dos arquivos finais conforme seu pacote contratado</li>
                  <li>Envio da música final e arquivos complementares em até 5 dias úteis</li>
                  <li>Suporte pós-entrega para eventuais dúvidas ou ajustes</li>
                </ol>
              </div>
            </div>
          )
        };
      default:
        return {
          title: "Próximos passos",
          icon: <Clock className="h-5 w-5 text-harmonia-green" />,
          content: (
            <p>
              Ouça, avalie e forneça seu feedback para cada versão apresentada. 
              Sua avaliação é fundamental para garantirmos que a música final corresponda às suas expectativas.
            </p>
          )
        };
    }
  };
  
  const { title, icon, content } = getContent();
  
  return (
    <Card className="mt-8">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
};

export default PreviewNextSteps;
