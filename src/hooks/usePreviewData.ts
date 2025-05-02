
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { usePreviewProject, PreviewProject } from '@/hooks/usePreviewProject';
import { getProjectIdFromPreviewLink } from '@/utils/previewLinkUtils';

export const usePreviewData = (previewId: string | undefined) => {
  const [actualProjectId, setActualProjectId] = useState<string | null>(null);
  const { projectData, setProjectData, isLoading } = usePreviewProject(actualProjectId || undefined);
  const { toast } = useToast();
  
  useEffect(() => {
    if (previewId) {
      // Verificar se o ID é direto ou precisa ser decodificado
      const decodedId = getProjectIdFromPreviewLink(previewId) || previewId;
      setActualProjectId(decodedId);
      
      console.log(`Carregando dados da prévia: ${decodedId}`);
    }
  }, [previewId]);
  
  useEffect(() => {
    if (!isLoading && !projectData && actualProjectId) {
      toast({
        title: "Prévia não encontrada",
        description: "O código de prévia fornecido não é válido ou expirou.",
        variant: "destructive"
      });
    }
  }, [actualProjectId, projectData, isLoading, toast]);

  // Função para atualizar o status do projeto e adicionar informação ao histórico
  const updateProjectStatus = (newStatus: 'waiting' | 'feedback' | 'approved', comments: string = '') => {
    try {
      if (!actualProjectId || !projectData) return false;

      console.log(`Atualizando status do projeto ${actualProjectId} para ${newStatus}`);
      console.log(`Feedback do cliente: ${comments}`);
      
      // Atualizar o estado local
      setProjectData((prev) => {
        if (!prev) return null;
        
        // Adicionar o feedback ao histórico se fornecido
        const updatedFeedbackHistory = prev.feedbackHistory || [];
        
        if (comments.trim()) {
          updatedFeedbackHistory.push({
            id: `feedback_${Date.now()}`,
            content: comments,
            createdAt: new Date().toISOString(),
            status: 'pending',
            versionId: actualProjectId
          });
        }
        
        return {
          ...prev,
          status: newStatus,
          feedbackHistory: updatedFeedbackHistory
        };
      });

      // Persistir nos dados locais
      if (projectData) {
        localStorage.setItem(
          `previewProject_${actualProjectId}`, 
          JSON.stringify({
            ...projectData,
            status: newStatus
          })
        );
      }

      return true;
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      return false;
    }
  };
  
  return { projectData, setProjectData, isLoading, actualProjectId, updateProjectStatus };
};
