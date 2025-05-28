
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, ThumbsUp, Send } from 'lucide-react';

interface ClientFeedbackFormProps {
  projectId: string;
  selectedVersion?: string;
  onFeedbackSubmit: (feedback: string) => Promise<boolean>;
  onApprove: (versionId: string) => Promise<boolean>;
  status: 'waiting' | 'feedback' | 'approved';
}

const ClientFeedbackForm: React.FC<ClientFeedbackFormProps> = ({
  projectId,
  selectedVersion,
  onFeedbackSubmit,
  onApprove,
  status
}) => {
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) {
      toast({
        title: "Feedback necessário",
        description: "Por favor, escreva seu feedback antes de enviar.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await onFeedbackSubmit(feedback);
      if (success) {
        toast({
          title: "Feedback enviado!",
          description: "Obrigado pelo seu feedback. Nossa equipe já está trabalhando nas modificações."
        });
        setFeedback('');
      } else {
        toast({
          title: "Erro ao enviar feedback",
          description: "Tente novamente em alguns instantes.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Houve um erro ao enviar o feedback.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedVersion) {
      toast({
        title: "Selecione uma versão",
        description: "Por favor, selecione uma versão antes de aprovar.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await onApprove(selectedVersion);
      if (success) {
        toast({
          title: "Música aprovada!",
          description: "Estamos felizes que você gostou! Vamos finalizar sua música e entregar em breve."
        });
      } else {
        toast({
          title: "Erro ao aprovar",
          description: "Tente novamente em alguns instantes.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Houve um erro ao aprovar a música.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isApproved = status === 'approved';

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="w-5 h-5 mr-2" />
          Avalie sua música
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedVersion && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Versão selecionada:</strong> {selectedVersion}
            </p>
          </div>
        )}

        <div>
          <label htmlFor="feedback" className="block text-sm font-medium mb-2">
            Comentários ou ajustes desejados:
          </label>
          <Textarea
            id="feedback"
            placeholder="Escreva aqui suas observações, sugestões ou pedidos de ajustes..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
            disabled={isApproved || isSubmitting}
            className="w-full"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleSubmitFeedback}
            disabled={isApproved || isSubmitting || !feedback.trim()}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4 mr-2" />
            {isSubmitting ? "Enviando..." : "Enviar Feedback"}
          </Button>

          <Button
            onClick={handleApprove}
            disabled={isApproved || isSubmitting || !selectedVersion}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <ThumbsUp className="w-4 h-4 mr-2" />
            {isSubmitting ? "Aprovando..." : "Aprovar esta versão"}
          </Button>
        </div>

        {isApproved && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-800">
              ✅ Esta música foi aprovada. Obrigado pelo seu feedback!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientFeedbackForm;
