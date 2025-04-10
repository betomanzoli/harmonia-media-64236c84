
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { MessageSquare, Check } from 'lucide-react';

interface ClientFeedbackCardProps {
  feedback: string;
  status: string;
}

const ClientFeedbackCard: React.FC<ClientFeedbackCardProps> = ({ feedback, status }) => {
  if (!feedback && status !== 'approved') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Feedback do cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">O cliente ainda não enviou feedback para este projeto.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (status === 'approved') {
    return (
      <Card className="border-green-200">
        <CardHeader className="bg-green-50 border-b border-green-200">
          <CardTitle className="flex items-center">
            <Check className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-700">Música aprovada pelo cliente</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {feedback ? (
            <div className="p-4 bg-green-50 rounded-md border border-green-200">
              <p className="text-green-800">{feedback}</p>
            </div>
          ) : (
            <p className="text-green-700">O cliente aprovou a música sem comentários adicionais.</p>
          )}
        </CardContent>
        <CardFooter className="bg-green-50 border-t border-green-200 text-sm text-green-700">
          A aprovação significa que o cliente está satisfeito com a versão atual e autoriza a finalização do projeto.
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200">
      <CardHeader className="bg-blue-50 border-b border-blue-200">
        <CardTitle>Feedback do cliente</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
          <p className="text-blue-800">{feedback}</p>
        </div>
      </CardContent>
      <CardFooter className="bg-blue-50 border-t border-blue-200 text-sm text-blue-700">
        Este feedback foi recebido e precisa ser processado pela equipe de produção.
      </CardFooter>
    </Card>
  );
};

export default ClientFeedbackCard;
