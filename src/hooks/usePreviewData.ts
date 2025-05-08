
import { useState, useEffect } from 'react';
import { ProjectItem } from '@/types/project.types';
import { getProjectIdFromPreviewLink, isValidEncodedPreviewLink } from '@/utils/previewLinkUtils';

interface UsePreviewDataReturn {
  projectData: ProjectItem | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  actualProjectId: string | null;
  updateProjectStatus: (status: 'feedback' | 'approved', feedback: string) => boolean;
}

export const usePreviewData = (previewId: string | undefined): UsePreviewDataReturn => {
  const [projectData, setProjectData] = useState<ProjectItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [actualProjectId, setActualProjectId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!previewId) {
        setIsError(true);
        setErrorMessage("ID de prévia não fornecido");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setIsError(false);

      try {
        // Check if this is an encoded preview link
        let projectId = previewId;
        if (isValidEncodedPreviewLink(previewId)) {
          const decodedId = getProjectIdFromPreviewLink(previewId);
          if (decodedId) {
            projectId = decodedId;
          }
        }

        setActualProjectId(projectId);

        // Fetch project data would go here in a real implementation

        // For now, we'll return a placeholder project
        setTimeout(() => {
          const mockProjectData: ProjectItem = {
            id: projectId,
            client_name: 'Cliente de Demonstração',
            project_title: 'Projeto de Música',
            package_type: 'Premium',
            status: 'waiting',
            created_at: new Date().toISOString(),
            last_activity_date: new Date().toISOString(),
            expiration_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            versions: 2,
            versionsList: [
              {
                id: 'v1',
                title: 'Versão Acústica',
                name: 'Versão Acústica',
                description: 'Versão suave com violão e piano',
                audio_url: 'https://example.com/audio.mp3',
                created_at: new Date().toISOString()
              },
              {
                id: 'v2',
                title: 'Versão Orquestral',
                name: 'Versão Orquestral',
                description: 'Arranjo completo com cordas e metais',
                audio_url: 'https://example.com/audio2.mp3',
                recommended: true,
                created_at: new Date().toISOString()
              }
            ]
          };

          setProjectData(mockProjectData);
          setIsLoading(false);
        }, 500);

      } catch (error) {
        console.error("Error fetching preview data:", error);
        setIsError(true);
        setErrorMessage("Erro ao carregar dados da prévia");
        setIsLoading(false);
      }
    };

    fetchData();
  }, [previewId]);

  const updateProjectStatus = (status: 'feedback' | 'approved', feedback: string): boolean => {
    try {
      console.log(`Updating project status to ${status} with feedback: ${feedback}`);
      
      if (projectData) {
        // Update local state
        setProjectData({
          ...projectData,
          status
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error updating project status:", error);
      return false;
    }
  };

  return {
    projectData,
    isLoading,
    isError,
    errorMessage,
    actualProjectId,
    updateProjectStatus
  };
};
