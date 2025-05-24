
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface PreviewFeedbackFormProps {
  feedback: string;
  onFeedbackChange: (feedback: string) => void;
  onSubmit: () => void;
  onApprove: () => void;
  status: string;
  selectedVersion: string | null;
  versionTitle?: string;
}

const PreviewFeedbackForm: React.FC<PreviewFeedbackFormProps> = ({
  feedback,
  onFeedbackChange,
  onSubmit,
  onApprove,
  status,
  selectedVersion,
  versionTitle
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Envie seu feedback</h3>
      
      {selectedVersion ? (
        <p className="text-green-600">
          Versão selecionada: {versionTitle || selectedVersion}
        </p>
      ) : (
        <p className="text-amber-600">
          Selecione uma versão antes de enviar feedback
        </p>
      )}
      
      <Textarea
        value={feedback}
        onChange={(e) => onFeedbackChange(e.target.value)}
        placeholder="Descreva o que você gostou e o que poderia ser melhorado..."
        rows={5}
        className="w-full"
      />
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={onSubmit} 
          disabled={!selectedVersion || status === 'approved'}
          className="flex-1"
        >
          Enviar feedback
        </Button>
        
        <Button 
          onClick={onApprove}
          disabled={!selectedVersion || status === 'approved'}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          Aprovar versão
        </Button>
      </div>
      
      {status === 'approved' && (
        <p className="text-green-600 bg-green-50 p-3 rounded-md">
          Versão aprovada! Estamos finalizando sua música.
        </p>
      )}
    </div>
  );
};

export default PreviewFeedbackForm;
