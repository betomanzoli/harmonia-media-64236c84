
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, MessageCircle } from 'lucide-react';

interface PreviewFeedbackFormProps {
  feedback: string;
  setFeedback: (feedback: string) => void;
  handleSubmit: (comments?: string) => void;
  handleApprove: (comments?: string) => void;
  selectedPreview: string | null;
  status: string;
  versionTitle?: string;
}

const PreviewFeedbackForm: React.FC<PreviewFeedbackFormProps> = ({
  feedback,
  setFeedback,
  handleSubmit,
  handleApprove,
  selectedPreview,
  status,
  versionTitle
}) => {
  const isApproved = status === 'approved';
  
  if (isApproved) {
    return (
      <Card className="p-6 text-center">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-green-100 p-3">
            <Check className="h-6 w-6 text-green-600" />
          </div>
        </div>
        <h3 className="text-xl font-medium text-black mb-2">Prévia Aprovada</h3>
        <p className="text-gray-500">
          Agradecemos pela sua aprovação! Já estamos finalizando o seu projeto.
        </p>
      </Card>
    );
  }
  
  return (
    <Card className="p-6">
      <div className="flex items-center mb-4">
        <MessageCircle className="h-5 w-5 text-harmonia-green mr-2" />
        <h3 className="text-lg font-medium text-black">Envie seu feedback</h3>
      </div>
      
      {!selectedPreview ? (
        <div className="text-amber-600 bg-amber-50 p-4 rounded-md mb-4">
          <p className="text-sm">
            Por favor, selecione uma versão acima antes de enviar seu feedback.
          </p>
        </div>
      ) : (
        <p className="text-sm text-gray-500 mb-4">
          {versionTitle ? 
            `Enviando feedback para: ${versionTitle}` : 
            'Compartilhe sua opinião sobre a versão selecionada:'}
        </p>
      )}
      
      <Textarea
        placeholder="Digite seu feedback aqui... Sinta-se à vontade para comentar o que gostou, o que poderia ser ajustado ou qualquer outra sugestão."
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        className="mb-4"
        rows={5}
      />
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={() => handleSubmit(feedback)}
          className="flex-1 bg-harmonia-green hover:bg-harmonia-green/90"
          disabled={!selectedPreview}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Solicitar ajustes
        </Button>
        
        <Button 
          onClick={() => handleApprove(feedback)}
          variant="outline"
          className="flex-1 border-green-500 text-green-500 hover:bg-green-50"
          disabled={!selectedPreview}
        >
          <Check className="w-4 h-4 mr-2" />
          Aprovar essa versão
        </Button>
      </div>
    </Card>
  );
};

export default PreviewFeedbackForm;
