
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { notificationService } from '@/services/notificationService';
import emailService from '@/services/emailService';
import { FeedbackSentimentSelector } from './feedback/FeedbackSentimentSelector';
import { FeedbackForm } from './feedback/FeedbackForm';
import { ApprovedFeedback } from './feedback/ApprovedFeedback';
import type { FeedbackData } from './types/feedback';

interface PreviewFeedbackFormProps {
  projectId?: string;
  selectedPreview?: string | null;
  onSubmit?: (feedback: FeedbackData) => void;
  status: 'waiting' | 'feedback' | 'approved';
  isSubmitting?: boolean;
  feedback?: string;
  setFeedback?: (feedback: string) => void;
  handleSubmit?: (e: React.FormEvent) => void;
  handleApprove?: () => void;
  versionTitle?: string;
}

const PreviewFeedbackForm: React.FC<PreviewFeedbackFormProps> = ({ 
  projectId, 
  selectedPreview, 
  status,
  handleApprove,
  versionTitle
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showContactFields, setShowContactFields] = useState(false);
  const [feedbackSentiment, setFeedbackSentiment] = useState<'positive' | 'negative' | null>(null);
  
  const form = useForm<FeedbackData>({
    defaultValues: {
      clientEmail: '',
      clientName: '',
      projectId: projectId || '',
      selectedVersion: selectedPreview || '',
      generalFeedback: '',
      rating: 0,
      preferredContactMethod: 'email',
      timestamp: new Date().toISOString()
    }
  });
  
  const onFormSubmit = async (data: FeedbackData) => {
    if (!selectedPreview) {
      toast({
        title: 'Selecione uma versão',
        description: 'Por favor, selecione uma versão musical antes de enviar seu feedback.',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      notificationService.notify('feedback_received', {
        projectId,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        selectedVersion: selectedPreview,
        feedback: data.generalFeedback,
        rating: data.rating,
        timestamp: data.timestamp
      });
      
      await emailService.sendPreviewNotification(
        data.clientEmail,
        data.clientName,
        `Feedback recebido para o projeto ${projectId}`
      );
      
      toast({
        title: "Feedback enviado com sucesso!",
        description: "Agradecemos sua avaliação. Nossa equipe iniciará os ajustes em breve.",
      });
      
      navigate('/feedback-confirmacao');
    } catch (error) {
      console.error('Erro ao enviar feedback:', error);
      toast({
        title: "Erro ao enviar feedback",
        description: "Ocorreu um erro ao enviar seu feedback. Por favor, tente novamente.",
        variant: "destructive"
      });
    }
  };

  if (status === 'approved') {
    return <ApprovedFeedback projectId={projectId} />;
  }
  
  return (
    <Card className="p-6 border-l-4 border-l-harmonia-green mb-8">
      <h3 className="text-xl font-bold mb-4">Envie seu feedback</h3>
      
      {!selectedPreview ? (
        <div className="text-center py-6 bg-gray-50 rounded-md mb-4">
          <p className="text-gray-500 mb-2">Por favor, selecione uma das versões acima para enviar seu feedback</p>
          <p className="text-sm text-gray-400">Ouça cada versão e escolha a que mais se adequa às suas necessidades</p>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="bg-harmonia-green/10 text-harmonia-green px-3 py-1 rounded-full text-sm font-medium flex items-center">
                <span className="mr-1">✓</span> Versão selecionada: {versionTitle}
              </div>
            </div>
            
            {!feedbackSentiment && (
              <FeedbackSentimentSelector 
                onSelect={setFeedbackSentiment}
                versionTitle={versionTitle}
              />
            )}
          </div>
          
          {feedbackSentiment && (
            <FeedbackForm 
              form={form}
              showContactFields={showContactFields}
              onToggleContactFields={() => setShowContactFields(!showContactFields)}
              onSubmit={onFormSubmit}
              onApprove={handleApprove}
              selectedVersion={selectedPreview}
              feedbackSentiment={feedbackSentiment}
            />
          )}
        </>
      )}
    </Card>
  );
};

export default PreviewFeedbackForm;
