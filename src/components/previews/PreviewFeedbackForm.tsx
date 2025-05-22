import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ThumbsUp, SendHorizonal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'react-router-dom';

interface PreviewFeedbackFormProps {
  feedback: string;
  onFeedbackChange: (value: string) => void;
  onSubmit: (comments?: string) => void;
  onApprove: (comments?: string) => void;
  status?: 'waiting' | 'feedback' | 'approved';
  selectedVersion?: string | null;
  versionTitle?: string;
  projectId?: string;
}

const PreviewFeedbackForm: React.FC<PreviewFeedbackFormProps> = ({
  feedback,
  onFeedbackChange,
  onSubmit,
  onApprove,
  status = 'waiting',
  selectedVersion,
  versionTitle,
  projectId
}) => {
  const isApproved = status === 'approved';
  const [localFeedback, setLocalFeedback] = useState(feedback);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Store feedback in localStorage when it changes to persist between reloads
  useEffect(() => {
    if (selectedVersion) {
      try {
        // Store feedback by version
        const storageKey = `preview_feedback_${selectedVersion}`;
        if (localFeedback) {
          localStorage.setItem(storageKey, localFeedback);
        }
      } catch (error) {
        console.error("Error saving feedback to localStorage:", error);
      }
    }
  }, [localFeedback, selectedVersion]);

  // Load saved feedback from localStorage on mount or when version changes
  useEffect(() => {
    if (selectedVersion) {
      try {
        const storageKey = `preview_feedback_${selectedVersion}`;
        const savedFeedback = localStorage.getItem(storageKey);
        if (savedFeedback) {
          setLocalFeedback(savedFeedback);
          onFeedbackChange(savedFeedback);
        } else {
          setLocalFeedback('');
          onFeedbackChange('');
        }
      } catch (error) {
        console.error("Error loading feedback from localStorage:", error);
      }
    }
  }, [selectedVersion, onFeedbackChange]);

  const handleLocalFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalFeedback(newValue);
    onFeedbackChange(newValue);
  };

  // Enhanced submit handler that works with both token and cookie authentication
  const handleSubmit = async () => {
    if (!projectId) {
      toast({
        title: "Erro",
        description: "ID do projeto não encontrado.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedVersion) {
      toast({
        title: "Selecione uma versão",
        description: "Por favor, selecione uma das versões antes de enviar seu feedback.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // If we have a token, use the edge function for submission
      if (token) {
        console.log("Enviando feedback via token para o projeto:", projectId);
        const response = await fetch(`https://ivueqxyuflxsiecqvmgt.supabase.co/functions/v1/submit-preview-feedback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            preview_id: projectId,
            feedback: localFeedback,
            status: 'feedback',
            token: token,
            selected_version: selectedVersion
          })
        });

        console.log("Resposta da API (status):", response.status);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Erro na resposta da API:", errorData);
          throw new Error(errorData.error || "Falha ao enviar feedback");
        }

        const result = await response.json();
        console.log("Resultado da API:", result);
        
        if (!result.success) {
          throw new Error(result.error || "Falha ao enviar feedback");
        }
      } else {
        // Otherwise use the regular method
        console.log("Enviando feedback via método padrão");
        onSubmit(localFeedback);
      }

      toast({
        title: "Feedback enviado",
        description: "Seu feedback foi registrado com sucesso.",
      });

      // Update local status to keep UI in sync
      if (status !== 'feedback' && status !== 'approved') {
        window.location.reload(); // Reload to reflect new status
      }
    } catch (error: any) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Erro ao enviar feedback",
        description: error.message || "Ocorreu um erro ao enviar seu feedback.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Enhanced approve handler that works with both token and cookie authentication
  const handleApprove = async () => {
    if (!projectId) {
      toast({
        title: "Erro",
        description: "ID do projeto não encontrado.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedVersion) {
      toast({
        title: "Selecione uma versão",
        description: "Por favor, selecione uma das versões antes de aprovar.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // If we have a token, use the edge function for submission
      if (token) {
        console.log("Enviando aprovação via token para o projeto:", projectId);
        const response = await fetch(`https://ivueqxyuflxsiecqvmgt.supabase.co/functions/v1/submit-preview-feedback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            preview_id: projectId,
            feedback: localFeedback,
            status: 'approved',
            token: token,
            selected_version: selectedVersion
          })
        });

        console.log("Resposta da API (status):", response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Erro na resposta da API:", errorData);
          throw new Error(errorData.error || "Falha ao aprovar versão");
        }

        const result = await response.json();
        console.log("Resultado da API:", result);
        
        if (!result.success) {
          throw new Error(result.error || "Falha ao aprovar versão");
        }
      } else {
        // Otherwise use the regular method
        console.log("Enviando aprovação via método padrão");
        onApprove(localFeedback);
      }

      toast({
        title: "Versão aprovada",
        description: "A aprovação foi registrada com sucesso.",
      });
      
      // Update local status to keep UI in sync
      if (status !== 'approved') {
        window.location.reload(); // Reload to reflect new status
      }
    } catch (error: any) {
      console.error("Error approving version:", error);
      toast({
        title: "Erro ao aprovar versão",
        description: error.message || "Ocorreu um erro ao aprovar a versão.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 bg-white">
      <h2 className="text-xl font-bold text-black mb-4">Envie seu feedback</h2>
      
      {selectedVersion && versionTitle && (
        <div className="mb-4 p-3 rounded-md bg-green-50 border border-green-200">
          <p className="text-sm">
            <span className="font-medium">Versão selecionada:</span> {versionTitle}
          </p>
        </div>
      )}
      
      <div className="mb-6">
        <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
          Comentários ou ajustes desejados:
        </label>
        <Textarea 
          id="feedback" 
          placeholder="Escreva aqui suas observações, sugestões ou pedidos de ajustes..." 
          value={localFeedback} 
          onChange={handleLocalFeedbackChange} 
          rows={5} 
          className="w-full resize-none" 
          disabled={isApproved || isSubmitting} 
        />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={handleSubmit} 
          disabled={isApproved || isSubmitting || !selectedVersion} 
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <SendHorizonal className="w-4 h-4 mr-2" />
          {isSubmitting ? 'Enviando...' : 'Enviar Feedback'}
        </Button>
        
        <Button 
          onClick={handleApprove} 
          disabled={isApproved || isSubmitting || !selectedVersion} 
          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
        >
          <ThumbsUp className="w-4 h-4 mr-2" />
          {isSubmitting ? 'Aprovando...' : 'Aprovar esta versão'}
        </Button>
      </div>
      
      {isApproved && (
        <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-md">
          <p className="text-sm text-green-800">
            Esta prévia já foi aprovada. Obrigado pelo seu feedback!
          </p>
        </div>
      )}
    </Card>
  );
};

export default PreviewFeedbackForm;
