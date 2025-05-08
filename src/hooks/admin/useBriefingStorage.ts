
// Fix the issue at line 84 where 'id' doesn't exist in NotificationOptions
// We'll modify this to use a valid option in NotificationOptions

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { logger } from '@/utils/logger';

// Define the structure of a briefing question
interface BriefingQuestion {
  id: string;
  question: string;
  required: boolean;
  order_num: number;
  package_id?: string;
}

// Define the structure of a briefing response
interface BriefingResponse {
  id: string;
  question_id: string;
  project_id: string;
  response: string;
  created_at: string;
}

// Define the structure of briefing data for a project
export interface ProjectBriefingData {
  projectId: string;
  responses: Record<string, string>;  // Map of question IDs to responses
}

export const useBriefingStorage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [questions, setQuestions] = useState<BriefingQuestion[]>([]);
  const { toast } = useToast();
  
  // Load questions from Supabase
  useEffect(() => {
    const loadQuestions = async () => {
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('briefing_questions')
          .select('*')
          .order('order_num', { ascending: true });
          
        if (error) {
          logger.error('Error loading briefing questions', error);
          toast({
            title: "Erro ao carregar perguntas",
            description: "Não foi possível carregar as perguntas do briefing.",
            variant: "destructive"
          });
          return;
        }
        
        setQuestions(data || []);
      } catch (error) {
        logger.error('Unexpected error loading briefing questions', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadQuestions();
  }, [toast]);
  
  // Save responses to Supabase
  const saveResponses = async (projectId: string, responses: Record<string, string>) => {
    try {
      // Convert responses object to array of response objects
      const responseArray = Object.entries(responses).map(([questionId, response]) => ({
        question_id: questionId,
        project_id: projectId,
        response
      }));
      
      // Save responses
      const { error } = await supabase
        .from('briefing_responses')
        .upsert(responseArray, { 
          onConflict: 'question_id,project_id',
          ignoreDuplicates: false
        });
        
      if (error) {
        logger.error('Error saving briefing responses', error);
        toast({
          title: "Erro ao salvar respostas",
          description: "Não foi possível salvar as respostas do briefing.",
          variant: "destructive"
        });
        return false;
      }
      
      // Show notification - fixed by removing the invalid 'id' property
      // and using a valid tag property instead
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Briefing Salvo", {
          body: `As respostas do projeto ${projectId} foram salvas com sucesso.`,
          tag: `briefing-${projectId}`  // Using tag instead of id
        });
      }
      
      toast({
        title: "Briefing salvo",
        description: "As respostas do briefing foram salvas com sucesso."
      });
      
      return true;
    } catch (error) {
      logger.error('Unexpected error saving briefing responses', error);
      return false;
    }
  };
  
  // Load responses for a project
  const loadResponses = async (projectId: string) => {
    try {
      const { data, error } = await supabase
        .from('briefing_responses')
        .select('*')
        .eq('project_id', projectId);
        
      if (error) {
        logger.error('Error loading briefing responses', error);
        return {};
      }
      
      // Convert array of responses to a Record object
      const responses = data?.reduce((acc, item) => {
        acc[item.question_id] = item.response;
        return acc;
      }, {} as Record<string, string>) || {};
      
      return responses;
    } catch (error) {
      logger.error('Unexpected error loading briefing responses', error);
      return {};
    }
  };
  
  return {
    questions,
    isLoading,
    saveResponses,
    loadResponses
  };
};
