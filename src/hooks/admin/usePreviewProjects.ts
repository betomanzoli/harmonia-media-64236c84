
import { useState, useEffect } from 'react';

interface Project {
  id: string;
  title: string;
  clientName: string;
  status: string;
  createdAt: string;
  previewCode: string;
}

export const usePreviewProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data for demonstration
        const mockData: Project[] = [
          {
            id: "proj1",
            title: "Composição para Aniversário",
            clientName: "João Silva",
            status: "pending",
            createdAt: "2023-10-15",
            previewCode: "preview-123"
          },
          {
            id: "proj2",
            title: "Música para Casamento",
            clientName: "Maria Souza",
            status: "approved",
            createdAt: "2023-10-10",
            previewCode: "preview-456"
          }
        ];
        
        setProjects(mockData);
        setError(null);
      } catch (err) {
        setError("Erro ao carregar projetos");
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjects();
  }, []);

  return {
    projects,
    setProjects,
    isLoading,
    error
  };
};
