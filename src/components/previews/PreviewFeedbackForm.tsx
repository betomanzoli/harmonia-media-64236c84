
import React from 'react';
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface PreviewFeedbackFormProps {
  selectedVersion: string | null;
  feedback: string;
  setFeedback: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleApprove: () => void;
  status: 'waiting' | 'feedback' | 'approved';
  versionTitle?: string;
}

const PreviewFeedbackForm: React.FC<PreviewFeedbackFormProps> = ({
  selectedVersion,
  feedback,
  setFeedback,
  handleSubmit,
  handleApprove,
  status,
  versionTitle
}) => {
  if (status === 'approved') {
    return null;
  }

  return (
    <Card className="p-6 mb-10">
      <h2 className="text-xl font-bold mb-4">Seus Comentários</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">
            Versão selecionada: {selectedVersion ? versionTitle : "Nenhuma versão selecionada"}
          </p>
          
          <Textarea 
            placeholder="Conte-nos o que você gostou e quais ajustes você gostaria na versão selecionada..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="min-h-[120px]"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button 
            type="button" 
            variant="outline"
            className="order-2 sm:order-1"
            onClick={handleApprove}
            disabled={!selectedVersion}
          >
            Aprovar Música
          </Button>
          <Button 
            type="submit" 
            className="bg-harmonia-green hover:bg-harmonia-green/90 order-1 sm:order-2"
            disabled={!selectedVersion}
          >
            Enviar Feedback
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default PreviewFeedbackForm;
