
import { useState, useEffect } from 'react';

interface PreviewVersion {
  id: string;
  title: string;
  url: string;
  date: string;
}

interface ProjectData {
  projectTitle: string;
  clientName: string;
  status: 'pending' | 'feedback' | 'approved' | 'completed';
  previews?: PreviewVersion[];
  useGoogleDrive?: boolean;
}

export const usePreviewProject = (projectId: string) => {
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      // Simulate API call
      setIsLoading(true);
      
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data for demonstration
        const mockData: ProjectData = {
          projectTitle: "Composição para Aniversário",
          clientName: "João Silva",
          status: "pending",
          previews: [
            {
              id: "v1",
              title: "Versão Acústica",
              url: "https://example.com/sample.mp3",
              date: "2023-10-15"
            },
            {
              id: "v2",
              title: "Versão Orquestrada",
              url: "https://example.com/sample2.mp3",
              date: "2023-10-16"
            }
          ]
        };
        
        setProjectData(mockData);
        setError(null);
      } catch (err) {
        setError("Erro ao carregar dados do projeto");
        setProjectData(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  return {
    projectData,
    setProjectData,
    isLoading,
    error
  };
};
