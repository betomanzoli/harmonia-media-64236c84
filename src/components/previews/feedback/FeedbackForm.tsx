
import React from 'react';
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Check, Send } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { FeedbackData } from '../types/feedback';

interface FeedbackFormProps {
  form: UseFormReturn<FeedbackData>;
  showContactFields: boolean;
  onToggleContactFields: () => void;
  onSubmit: (data: FeedbackData) => void;
  onApprove?: () => void;
  isSubmitting?: boolean;
  selectedVersion?: string | null;
  feedbackSentiment?: 'positive' | 'negative';
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
  form,
  showContactFields,
  onToggleContactFields,
  onSubmit,
  onApprove,
  isSubmitting,
  selectedVersion,
  feedbackSentiment
}) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="generalFeedback"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seu feedback</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Compartilhe sua opinião detalhada sobre a versão selecionada..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <div>
          <Button 
            type="button" 
            variant="ghost" 
            onClick={onToggleContactFields}
            className="px-0 text-harmonia-green hover:text-harmonia-green/80 hover:bg-transparent"
          >
            + Adicionar informações de contato
          </Button>
        </div>
        
        {showContactFields && (
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
        )}
        
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4 items-center mt-6">
          <div className="flex gap-3 w-full sm:w-auto">
            {onApprove && feedbackSentiment === 'positive' && (
              <Button 
                type="button" 
                className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                disabled={!selectedVersion || isSubmitting}
                onClick={onApprove}
              >
                <Check className="w-4 h-4 mr-2" />
                Aprovar Versão
              </Button>
            )}
            
            <Button 
              type="submit" 
              className="bg-harmonia-green hover:bg-harmonia-green/90 w-full sm:w-auto"
              disabled={!selectedVersion || isSubmitting || !form.getValues('generalFeedback')}
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
  );
};
