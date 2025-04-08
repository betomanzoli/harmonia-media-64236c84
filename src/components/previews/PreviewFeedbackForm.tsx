
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Check, Send, Star, Phone } from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import emailService from '@/services/emailService';

export interface PreviewFeedbackFormProps {
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

interface FeedbackData {
  clientEmail: string;
  clientName: string;
  projectId: string;
  selectedVersion: string;
  generalFeedback: string;
  specificFeedback: {
    melody?: string;
    instruments?: string;
    tempo?: string;
    other?: string;
  };
  rating: number;
  preferredContactMethod: 'email' | 'whatsapp';
  timestamp: string;
}

const PreviewFeedbackForm: React.FC<PreviewFeedbackFormProps> = ({ 
  projectId = "", 
  selectedPreview, 
  onSubmit,
  status,
  isSubmitting = false,
  feedback = '',
  setFeedback,
  handleSubmit: propHandleSubmit,
  handleApprove,
  versionTitle
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  
  const form = useForm<FeedbackData>({
    defaultValues: {
      clientEmail: '',
      clientName: '',
      projectId: projectId,
      selectedVersion: selectedPreview || '',
      generalFeedback: feedback,
      specificFeedback: {
        melody: '',
        instruments: '',
        tempo: '',
        other: ''
      },
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
    
    // Atualizar timestamp e version ID
    data.timestamp = new Date().toISOString();
    data.selectedVersion = selectedPreview;
    data.projectId = projectId;
    
    try {
      // Enviar notificação por email
      await emailService.sendPreviewNotification(
        data.clientEmail,
        data.clientName,
        `Feedback recebido para o projeto ${projectId}`
      );
      
      toast({
        title: "Feedback enviado com sucesso!",
        description: "Agradecemos sua avaliação. Nossa equipe iniciará os ajustes em breve.",
      });
      
      if (onSubmit) {
        onSubmit(data);
      } else if (propHandleSubmit) {
        propHandleSubmit(new Event('submit') as any);
      }
      
      // Navegar para a página de confirmação após envio bem-sucedido
      setTimeout(() => {
        navigate('/feedback-confirmacao');
      }, 1500);
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
    return (
      <Card className="p-6 border-green-500 bg-green-50 text-center">
        <Check className="w-8 h-8 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Música Aprovada!</h3>
        <p className="mb-4">Você já aprovou esta música. Nossa equipe está trabalhando na finalização.</p>
        {projectId && (
          <Button 
            onClick={() => navigate(`/acompanhar-pedido/${projectId}`)} 
            className="bg-harmonia-green hover:bg-harmonia-green/90"
          >
            Acompanhar Pedido
          </Button>
        )}
      </Card>
    );
  }
  
  return (
    <Card className="p-6 border-l-4 border-l-harmonia-green">
      <h3 className="text-xl font-bold mb-4">Envie seu feedback</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seu Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome completo" {...field} required />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="clientEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seu Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      {...field}
                      required
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="generalFeedback"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Feedback Geral</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Compartilhe sua opinião geral sobre a versão selecionada..."
                    className="min-h-[100px]"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      if (setFeedback) setFeedback(e.target.value);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="font-medium mb-3">Feedback Específico</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="specificFeedback.melody"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Melodia</FormLabel>
                    <FormControl>
                      <Input placeholder="Comentários sobre a melodia" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="specificFeedback.instruments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instrumentação</FormLabel>
                    <FormControl>
                      <Input placeholder="Comentários sobre os instrumentos" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="specificFeedback.tempo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ritmo/Tempo</FormLabel>
                    <FormControl>
                      <Input placeholder="Comentários sobre o ritmo/tempo" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="specificFeedback.other"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Outros Aspectos</FormLabel>
                    <FormControl>
                      <Input placeholder="Outros aspectos importantes" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <div>
            <FormLabel>Avaliação da Versão</FormLabel>
            <div className="flex items-center gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`text-2xl ${rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                  onClick={() => {
                    setRating(star);
                    form.setValue('rating', star);
                  }}
                >
                  <Star className="w-6 h-6" />
                </button>
              ))}
            </div>
          </div>
          
          <FormField
            control={form.control}
            name="preferredContactMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Método de Contato Preferido</FormLabel>
                <div className="flex gap-4 mt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="email"
                      checked={field.value === 'email'}
                      onChange={() => field.onChange('email')}
                      className="w-4 h-4"
                    />
                    <span>Email</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="whatsapp"
                      checked={field.value === 'whatsapp'}
                      onChange={() => field.onChange('whatsapp')}
                      className="w-4 h-4"
                    />
                    <span>WhatsApp</span>
                  </label>
                </div>
              </FormItem>
            )}
          />
          
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4 items-center mt-6">
            <p className="text-sm text-gray-500">
              {selectedPreview 
                ? `✓ Versão "${versionTitle}" selecionada` 
                : "Por favor, selecione uma versão para continuar."}
            </p>
            
            <div className="flex gap-3 w-full sm:w-auto">
              {handleApprove && (
                <Button 
                  type="button" 
                  className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                  disabled={!selectedPreview || isSubmitting}
                  onClick={handleApprove}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Aprovar Versão
                </Button>
              )}
              
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
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default PreviewFeedbackForm;
