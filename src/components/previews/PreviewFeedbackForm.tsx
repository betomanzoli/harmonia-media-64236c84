import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MessageSquare, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PreviewFeedbackFormProps {
  selectedPreview: string | null;
  feedback: string;
  setFeedback: (feedback: string) => void;
  handleSubmit: (feedback?: string) => void;
  handleApprove: (feedback?: string) => void;
  status: string;
  versionTitle?: string;
}

const PreviewFeedbackForm: React.FC<PreviewFeedbackFormProps> = ({
  selectedPreview,
  feedback,
  setFeedback,
  handleSubmit,
  handleApprove,
  status,
  versionTitle
}) => {
  const [localFeedback, setLocalFeedback] = useState(feedback || '');

  React.useEffect(() => {
    setLocalFeedback(feedback);
  }, [feedback]);

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalFeedback(newValue);
    if (setFeedback) {
      setFeedback(newValue);
    }
  };

  if (status === 'approved' || status === 'feedback') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Seu feedback já foi enviado</CardTitle>
          <CardDescription>
            {status === 'approved' 
              ? 'Você já aprovou a música. Obrigado pelo seu feedback!'
              : 'Você já enviou seu feedback. Nossa equipe está trabalhando nos ajustes solicitados.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className={status === 'approved' ? 'bg-green-50' : 'bg-blue-50'}>
            <AlertDescription>
              {status === 'approved' 
                ? 'Em breve entraremos em contato com a versão final da sua música.'
                : 'Em breve você receberá uma notificação com as novas versões para avaliação.'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Envie seu Feedback</CardTitle>
        <CardDescription>
          {selectedPreview 
            ? `Envie seu feedback sobre a versão "${versionTitle || 'selecionada'}" ou aprove-a.`
            : 'Selecione uma versão primeiro para enviar feedback.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!selectedPreview ? (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-md">
            <p>Por favor, selecione uma versão na aba "Versões Propostas" antes de enviar feedback.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Textarea
                placeholder="Escreva aqui seu feedback sobre a música... O que você gostou? O que gostaria de mudar?"
                className="min-h-[150px]"
                value={localFeedback}
                onChange={handleFeedbackChange}
                disabled={!selectedPreview}
              />
            </div>
            <div className="text-sm text-gray-500">
              <p>Seu feedback é importante para que possamos entregar a música perfeita para você.</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between">
        <Button
          onClick={() => handleApprove(localFeedback)}
          disabled={!selectedPreview}
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Aprovar esta Versão
        </Button>
        <Button
          onClick={() => handleSubmit(localFeedback)}
          disabled={!selectedPreview || !localFeedback}
          className="w-full sm:w-auto"
          variant="outline"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Enviar Feedback
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PreviewFeedbackForm;
