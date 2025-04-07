
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Check, Send } from 'lucide-react';

interface PreviewFeedbackFormProps {
  projectId: string;
  selectedPreview: string | null;
  onSubmit: (feedback: string, email: string) => void;
  status: 'waiting' | 'feedback' | 'approved';
  isSubmitting?: boolean;
}

const PreviewFeedbackForm: React.FC<PreviewFeedbackFormProps> = ({ 
  projectId, 
  selectedPreview, 
  onSubmit,
  status,
  isSubmitting = false
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPreview) {
      toast({
        title: 'Selecione uma versão',
        description: 'Por favor, selecione uma versão musical antes de enviar seu feedback.',
        variant: 'destructive'
      });
      return;
    }
    
    if (!email) {
      toast({
        title: 'Email necessário',
        description: 'Por favor, informe seu email para confirmarmos sua identidade.',
        variant: 'destructive'
      });
      return;
    }
    
    onSubmit(feedback, email);
  };
  
  if (status === 'approved') {
    return (
      <Card className="p-6 border-green-500 bg-green-50 text-center">
        <Check className="w-8 h-8 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Música Aprovada!</h3>
        <p className="mb-4">Você já aprovou esta música. Nossa equipe está trabalhando na finalização.</p>
        <Button 
          onClick={() => navigate(`/acompanhar-pedido/${projectId}`)} 
          className="bg-harmonia-green hover:bg-harmonia-green/90"
        >
          Acompanhar Pedido
        </Button>
      </Card>
    );
  }
  
  return (
    <Card className="p-6 border-l-4 border-l-harmonia-green">
      <h3 className="text-xl font-bold mb-4">Envie seu feedback</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Seu Email</label>
            <Input
              type="email"
              placeholder="Informe seu email para confirmarmos sua identidade"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Comentários e Feedback</label>
            <Textarea
              placeholder="Descreva o que você gostou e o que poderia ser ajustado na versão selecionada..."
              className="min-h-[120px]"
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4 items-center">
          <p className="text-sm text-gray-500">
            {selectedPreview 
              ? "✓ Versão selecionada. Você pode adicionar comentários específicos se desejar." 
              : "Por favor, selecione uma versão para continuar."}
          </p>
          
          <Button 
            type="submit" 
            className="bg-harmonia-green hover:bg-harmonia-green/90 w-full sm:w-auto"
            disabled={!selectedPreview || isSubmitting}
          >
            {isSubmitting ? (
              <>Enviando...</>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Enviar Feedback
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default PreviewFeedbackForm;
