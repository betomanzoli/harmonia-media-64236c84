
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { usePreviewProject } from '@/hooks/usePreviewProject';
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
  
  return { projectData, setProjectData, isLoading, actualProjectId };
};
