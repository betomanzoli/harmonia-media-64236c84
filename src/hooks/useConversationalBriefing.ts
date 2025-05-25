
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
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

  // Initial questions for pre-payment briefing - more targeted for music composition
  const initialQuestions = [
    "O que inspirou você a criar esta música? Conte um pouco sobre a história ou sentimento por trás dela.",
    "Existe alguma pessoa ou momento especial relacionado a esta música? Quem ou o que você gostaria de homenagear?",
    "Que emoção principal você gostaria que a música transmitisse ao ouvinte?"
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
      // Prepare a structured format for the briefing data that will be used by n8n later
      const formattedData = {
        initialBriefing: true,
        responses: initialResponses,
        createdAt: new Date().toISOString(),
        packageType,
        questions: {
          inspiration: initialQuestions[0],
          specialConnection: initialQuestions[1],
          emotion: initialQuestions[2]
        },
        briefingSummary: {
          inspiration: initialResponses.inspiration?.substring(0, 100) || 'Não especificado',
          connection: initialResponses.specialConnection?.substring(0, 100) || 'Nenhuma',
          emotion: initialResponses.emotion || 'Não especificado'
        },
        status: {
          conversationComplete: false,
          needsRevision: false
        },
        workflow: {
          currentStage: 'initial',
          nextStage: 'payment',
          completedSteps: ['initial_briefing']
        }
      };

      const { data, error } = await supabase
        .from('briefings')
        .insert([{
          initial_responses: initialResponses,
          payment_status: 'pending',
          completion_status: 'initial',
          package_type: packageType,
          data: formattedData
        }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        console.log("Briefing created successfully:", data.id);
        setBriefingId(data.id as string);
        
        // Log for debugging n8n integration
        console.log("Data prepared for n8n workflow:", formattedData);
        
        return data.id as string;
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
