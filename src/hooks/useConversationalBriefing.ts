
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from './use-toast';

interface InitialBriefingResponse {
  inspiration: string;
  specialConnection: string;
  emotion: string;
}

export function useConversationalBriefing() {
  const [briefingId, setBriefingId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialResponses, setInitialResponses] = useState<InitialBriefingResponse>({
    inspiration: '',
    specialConnection: '',
    emotion: '',
  });
  const { toast } = useToast();

  // Initial questions for pre-payment briefing
  const initialQuestions = [
    "O que inspirou você a criar esta música?",
    "Existe alguma pessoa ou momento especial relacionado a esta música?",
    "Que emoção principal você gostaria que a música transmitisse?"
  ];

  // Update response for a specific step
  const updateResponse = (step: number, response: string) => {
    setInitialResponses(prev => {
      if (step === 0) return { ...prev, inspiration: response };
      if (step === 1) return { ...prev, specialConnection: response };
      if (step === 2) return { ...prev, emotion: response };
      return prev;
    });
  };

  // Move to next question
  const nextStep = () => {
    if (currentStep < initialQuestions.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Go back to previous question
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Check if we're at the final initial step (showing packages)
  const isInitialBriefingComplete = currentStep === initialQuestions.length;

  // Save initial responses to Supabase
  const saveInitialBriefing = async (packageType: 'essencial' | 'profissional' | 'premium') => {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('briefings')
        .insert([{
          initial_responses: initialResponses,
          payment_status: 'pending',
          completion_status: 'initial',
          package_type: packageType,
          data: {
            initialBriefing: true,
            responses: initialResponses,
            createdAt: new Date().toISOString(),
          }
        }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setBriefingId(data.id);
        return data.id;
      }

      return null;
    } catch (error: any) {
      console.error("Error saving initial briefing:", error);
      toast({
        title: "Erro ao salvar briefing",
        description: error.message || "Não foi possível salvar suas respostas iniciais",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    briefingId,
    currentStep,
    initialQuestions,
    initialResponses,
    isSubmitting,
    isInitialBriefingComplete,
    updateResponse,
    nextStep,
    prevStep,
    saveInitialBriefing,
  };
}
