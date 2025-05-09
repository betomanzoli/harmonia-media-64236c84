
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, ThumbsUp } from 'lucide-react';

interface PreviewFeedbackFormProps {
  selectedPreview?: string | null;
  feedback: string;
  onFeedbackChange: (feedback: string) => void;
  handleSubmit?: () => void;
  handleApprove?: () => void;
  status?: 'waiting' | 'feedback' | 'approved';
  versionTitle?: string;
  onSubmit?: (comments?: string) => void;
  onApprove?: (comments?: string) => void;
}

const PreviewFeedbackForm: React.FC<PreviewFeedbackFormProps> = ({ 
  selectedPreview, 
  feedback, 
  onFeedbackChange,
  handleSubmit,
  handleApprove,
  status = 'waiting',
  versionTitle,
  onSubmit,
  onApprove
}) => {
  // Determine which submit and approve handlers to use
  const submitHandler = onSubmit || handleSubmit;
  const approveHandler = onApprove || handleApprove;

  const isDisabled = status === 'approved' || status === 'feedback';
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Envie seu feedback</span>
          {selectedPreview && <span className="text-sm font-normal text-gray-500">Versão selecionada: {versionTitle || selectedPreview}</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!selectedPreview && (
            <div className="bg-orange-50 border border-orange-200 text-orange-800 p-4 rounded-md">
              <p className="text-sm">Por favor, selecione uma versão antes de enviar seu feedback.</p>
            </div>
          )}
          
          <Textarea 
            placeholder="Compartilhe suas impressões sobre a música. O que você gostou? O que poderia ser melhorado?"
            className="min-h-[120px]"
            value={feedback}
            onChange={(e) => onFeedbackChange(e.target.value)}
            disabled={isDisabled || !selectedPreview}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between flex-wrap gap-2">
        <div className="text-sm text-gray-500">
          {status === 'approved' && "Você já aprovou esta prévia. Obrigado!"}
          {status === 'feedback' && "Seu feedback foi enviado. Obrigado!"}
          {status === 'waiting' && !selectedPreview && "Selecione uma versão para prosseguir."}
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => submitHandler && submitHandler(feedback)}
            disabled={isDisabled || !selectedPreview}
            variant="outline"
          >
            <Send className="mr-2 h-4 w-4" />
            Enviar Feedback
          </Button>
          <Button 
            onClick={() => approveHandler && approveHandler(feedback)}
            disabled={isDisabled || !selectedPreview}
            variant="default"
            className="bg-green-600 hover:bg-green-700"
          >
            <ThumbsUp className="mr-2 h-4 w-4" />
            Aprovar Versão
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PreviewFeedbackForm;
