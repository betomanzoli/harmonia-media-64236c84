
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface InitialBriefingResponse {
  name: string;
  email: string;
  phone?: string;
  projectType: string;
  budget: string;
  timeline: string;
  description: string;
}

export interface ConversationalQuestion {
  id: string;
  question: string;
  type: 'text' | 'select' | 'multiselect';
  options?: string[];
  followUp?: string;
}

export const useConversationalBriefing = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const questions: ConversationalQuestion[] = [
    {
      id: 'style',
      question: 'Que estilo musical você tem em mente?',
      type: 'select',
      options: ['Pop', 'Rock', 'Jazz', 'Clássico', 'Eletrônico', 'Folk', 'Outro'],
      followUp: 'Pode descrever mais sobre o estilo que imagina?'
    },
    {
      id: 'mood',
      question: 'Qual o sentimento que a música deve transmitir?',
      type: 'select',
      options: ['Alegre', 'Melancólico', 'Energético', 'Romântico', 'Épico', 'Relaxante'],
    },
    {
      id: 'instruments',
      question: 'Há instrumentos específicos que gostaria de incluir?',
      type: 'multiselect',
      options: ['Piano', 'Violão', 'Violino', 'Bateria', 'Baixo', 'Saxofone', 'Flauta', 'Cordas'],
    },
    {
      id: 'reference',
      question: 'Tem alguma música de referência que gostaria de compartilhar?',
      type: 'text',
      followUp: 'Pode incluir links do YouTube ou Spotify, ou apenas o nome da música e artista'
    },
    {
      id: 'usage',
      question: 'Para que será usada esta música?',
      type: 'select',
      options: ['Vídeo comercial', 'Vídeo pessoal', 'Evento', 'Podcast', 'Jogo', 'Filme', 'Outro'],
    },
    {
      id: 'duration',
      question: 'Qual a duração desejada?',
      type: 'select',
      options: ['30 segundos', '1 minuto', '2-3 minutos', '3-5 minutos', 'Mais de 5 minutos'],
    }
  ];

  const handleResponse = useCallback((questionId: string, answer: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: answer
    }));
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, questions.length]);

  const previousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const submitBriefing = useCallback(async (initialData: InitialBriefingResponse, packageType: 'essencial' | 'profissional' | 'premium') => {
    setIsLoading(true);
    try {
      const briefingData = {
        initial_responses: initialData as any,
        payment_status: 'pending',
        completion_status: 'conversational',
        package_type: packageType,
        data: {
          conversational_responses: responses,
          completed_questions: currentStep + 1,
          total_questions: questions.length
        } as any
      };

      const { data, error } = await supabase
        .from('briefings')
        .insert([briefingData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Briefing salvo!",
        description: "Suas respostas foram salvas com sucesso."
      });

      return data;
    } catch (error) {
      console.error('Error submitting briefing:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o briefing. Tente novamente.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [responses, currentStep, questions.length, toast]);

  const getCurrentQuestion = useCallback(() => {
    return questions[currentStep] || null;
  }, [currentStep, questions]);

  const getProgress = useCallback(() => {
    return Math.round(((currentStep + 1) / questions.length) * 100);
  }, [currentStep, questions.length]);

  const isLastQuestion = currentStep === questions.length - 1;
  const isFirstQuestion = currentStep === 0;

  return {
    currentStep,
    responses,
    isLoading,
    questions,
    getCurrentQuestion,
    handleResponse,
    nextStep,
    previousStep,
    submitBriefing,
    getProgress,
    isLastQuestion,
    isFirstQuestion,
    totalQuestions: questions.length
  };
};
