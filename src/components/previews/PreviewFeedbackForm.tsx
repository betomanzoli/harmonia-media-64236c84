
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Check, Send, ThumbsUp, ThumbsDown } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface PreviewFeedbackFormProps {
  selectedPreview: string | null;
  feedback: string;
  setFeedback: (value: string) => void;
  onSubmitFeedback: () => void;
  onApprove: () => void;
  isApproved: boolean;
  previews: Array<{
    id: string;
    title: string;
  }>;
}

export const PreviewFeedbackForm: React.FC<PreviewFeedbackFormProps> = ({
  selectedPreview,
  feedback,
  setFeedback,
  onSubmitFeedback,
  onApprove,
  isApproved,
  previews
}) => {
  if (isApproved) {
    return (
      <div className="bg-harmonia-green/20 border border-harmonia-green rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Check className="text-harmonia-green w-6 h-6" />
          <h2 className="text-xl font-semibold text-harmonia-green">Música Aprovada!</h2>
        </div>
        <p className="text-gray-300">
          Parabéns! Você já aprovou a música e nossa equipe está finalizando os últimos detalhes.
          Se precisar de qualquer ajuste adicional, entre em contato com nosso suporte.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Versão selecionada</h3>
        {selectedPreview ? (
          <div className="bg-harmonia-green/10 border border-harmonia-green/30 rounded-lg p-4">
            <p className="font-medium text-harmonia-green">
              {previews.find(p => p.id === selectedPreview)?.title || 'Versão selecionada'}
            </p>
          </div>
        ) : (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
            <p className="text-amber-500">
              Nenhuma versão selecionada. Por favor, selecione uma versão na aba "Versões Propostas".
            </p>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">O que você achou da música?</h3>
        <RadioGroup defaultValue="like" className="flex space-x-4 mb-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="like" id="like" />
            <Label htmlFor="like" className="flex items-center gap-1">
              <ThumbsUp className="w-4 h-4" /> Gostei
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="dislike" id="dislike" />
            <Label htmlFor="dislike" className="flex items-center gap-1">
              <ThumbsDown className="w-4 h-4" /> Precisa de ajustes
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label htmlFor="feedback" className="text-lg font-semibold block mb-3">
          Comentários ou solicitações de alteração
        </Label>
        <Textarea
          id="feedback"
          placeholder="Digite aqui suas observações, sugestões ou pedidos de alteração..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="h-32"
        />
        <p className="text-xs text-gray-400 mt-2">
          Seja específico em seus comentários para que possamos atender melhor suas expectativas.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={onSubmitFeedback}
          disabled={!selectedPreview}
          className="flex-1"
        >
          <Send className="w-4 h-4 mr-2" />
          Enviar feedback para ajustes
        </Button>
        
        <Button 
          onClick={onApprove} 
          disabled={!selectedPreview}
          className="flex-1 bg-harmonia-green hover:bg-harmonia-green/90"
        >
          <Check className="w-4 h-4 mr-2" />
          Aprovar música
        </Button>
      </div>
    </div>
  );
};
