
import { useState, useEffect } from 'react';
import { usePreviewProject } from '@/hooks/previews/usePreviewProject';
import { getProjectIdFromPreviewLink } from '@/utils/previewLinkUtils';
import { useToast } from '@/hooks/use-toast';

export const usePreviewData = (previewId: string | undefined) => {
  const [actualProjectId, setActualProjectId] = useState<string | null>(null);
  const { projectData, setProjectData, isLoading, updateProjectStatus } = usePreviewProject(actualProjectId || undefined);
  const { toast } = useToast();
  
  useEffect(() => {
    if (previewId) {
      // Verificar se o ID é direto ou precisa ser decodificado
      try {
        const fetchProjectId = async () => {
          try {
            const decodedId = await getProjectIdFromPreviewLink(previewId);
            setActualProjectId(decodedId || previewId);
            
            console.log(`Carregando dados da prévia: ${decodedId || previewId}`);
          } catch (error) {
            console.error("Error decoding preview ID:", error);
            setActualProjectId(previewId);
          }
        };
        
        fetchProjectId();
      } catch (error) {
        console.error("Error in preview ID handling:", error);
        setActualProjectId(previewId);
      }
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
  
  return { projectData, setProjectData, isLoading, actualProjectId, updateProjectStatus };
};
