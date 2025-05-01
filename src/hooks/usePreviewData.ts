
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
  const updateProjectStatus = (newStatus: 'approved' | 'feedback', comments: string) => {
    try {
      if (!actualProjectId || !projectData) return false;

      console.log(`Atualizando status do projeto ${actualProjectId} para ${newStatus}`);
      console.log(`Feedback do cliente: ${comments}`);
      
      // TODO: Esta função deveria enviar uma requisição à API para atualizar o status
      // Mas para este MVP, apenas atualizamos o estado local
      
      setProjectData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          status: newStatus
        };
      });

      // Informações do histórico são salvas no AdminProjects
      // através do hook usePreviewProjects -> updateProject

      return true;
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      return false;
    }
  };
  
  return { projectData, setProjectData, isLoading, actualProjectId, updateProjectStatus };
};
