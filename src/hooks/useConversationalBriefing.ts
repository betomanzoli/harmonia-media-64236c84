import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface BriefingStep {
  question: string;
  key: string;
  type: 'text' | 'textarea' | 'email' | 'phone';
  required: boolean;
}

const steps: BriefingStep[] = [
  {
    question: 'Qual é o seu nome?',
    key: 'client_name',
    type: 'text',
    required: true
  },
  {
    question: 'Qual é o seu email?',
    key: 'client_email',
    type: 'email',
    required: true
  },
  {
    question: 'Qual é o seu telefone?',
    key: 'client_phone',
    type: 'phone',
    required: false
  },
  {
    question: 'Descreva o seu projeto musical ideal:',
    key: 'project_description',
    type: 'textarea',
    required: true
  },
  {
    question: 'Compartilhe suas inspirações e referências musicais:',
    key: 'musical_inspirations',
    type: 'textarea',
    required: false
  }
];

export const useConversationalBriefing = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<'essencial' | 'profissional' | 'premium'>('essencial');

  const handleAnswer = useCallback((questionKey: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionKey]: answer
    }));
  }, []);

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, steps.length]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const submitBriefing = async () => {
    setIsSubmitting(true);
    try {
      const briefingData = {
        package_type: selectedPackage,
        client_name: String(answers.client_name || ''),
        client_email: String(answers.client_email || ''),
        client_phone: String(answers.client_phone || ''),
        answers: answers,
        status: 'completed',
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('briefings')
        .insert([briefingData])
        .select();

      if (error) throw error;

      toast({
        title: "Briefing enviado!",
        description: "Seu briefing foi enviado com sucesso. Entraremos em contato em breve."
      });

      return data?.[0];
    } catch (error) {
      console.error('Error submitting briefing:', error);
      toast({
        title: "Erro ao enviar briefing",
        description: "Ocorreu um erro ao enviar seu briefing. Tente novamente.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentStepData = () => {
    if (currentStep >= 0 && currentStep < steps.length) {
      return steps[currentStep];
    }
    return null;
  };

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  return {
    currentStep,
    answers,
    isSubmitting,
    selectedPackage,
    setSelectedPackage,
    handleAnswer,
    handleNext,
    handlePrevious,
    submitBriefing,
    getCurrentStepData,
    isLastStep,
    isFirstStep,
    totalSteps: steps.length
  };
};
