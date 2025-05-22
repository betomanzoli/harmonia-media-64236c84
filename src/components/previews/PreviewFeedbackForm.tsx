
import React from 'react';
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ThumbsUp, SendHorizonal } from 'lucide-react';
interface PreviewFeedbackFormProps {
  feedback: string;
  onFeedbackChange: (value: string) => void;
  onSubmit: (comments?: string) => void;
  onApprove: (comments?: string) => void;
  status?: 'waiting' | 'feedback' | 'approved';
  selectedVersion?: string | null;
  versionTitle?: string;
}
const PreviewFeedbackForm: React.FC<PreviewFeedbackFormProps> = ({
  feedback,
  onFeedbackChange,
  onSubmit,
  onApprove,
  status = 'waiting',
  selectedVersion,
  versionTitle
}) => {
  const isApproved = status === 'approved';
  return <Card className="p-6 bg-white">
      <h2 className="text-xl font-bold text-black mb-4">Envie seu feedback</h2>
      
      {selectedVersion && versionTitle && <div className="mb-4 p-3 rounded-md bg-gray-100">
          <p className="text-sm">
            <span className="font-medium">Versão selecionada:</span> {versionTitle}
          </p>
        </div>}
      
      <div className="mb-6">
        <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
          Comentários ou ajustes desejados:
        </label>
        <Textarea id="feedback" placeholder="Escreva aqui suas observações, sugestões ou pedidos de ajustes..." value={feedback} onChange={e => onFeedbackChange(e.target.value)} rows={5} className="w-full resize-none" disabled={isApproved} />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={() => onSubmit(feedback)} disabled={isApproved} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
          <SendHorizonal className="w-4 h-4 mr-2" />
          Enviar Feedback
        </Button>
        
        <Button onClick={() => onApprove(feedback)} disabled={isApproved} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
          <ThumbsUp className="w-4 h-4 mr-2" />
          Aprovar esta versão
        </Button>
      </div>
      
      {isApproved && <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-md">
          <p className="text-sm text-green-800">
            Esta prévia já foi aprovada. Obrigado pelo seu feedback!
          </p>
        </div>}
    </Card>;
};
export default PreviewFeedbackForm;
