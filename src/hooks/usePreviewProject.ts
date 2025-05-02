import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// Define the basic project types for the preview system
interface ProjectVersion {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  recommended?: boolean;
  createdAt: string;
}

interface FeedbackRecord {
  id: string;
  content: string;
  createdAt: string;
  status: 'pending' | 'processed';
  userId?: string;
  versionId?: string;
}

export interface PreviewProject {
  id: string;
  projectTitle: string;
  clientName: string;
  packageType?: string;
  status: 'waiting' | 'feedback' | 'approved';
  createdAt: string;
  expirationDate?: string;
  versions: ProjectVersion[];
  feedbackHistory?: FeedbackRecord[];
  previews?: Array<{
    id: string;
    title: string;
    description?: string;
    audioUrl: string;
    recommended?: boolean;
  }>;
}

export const usePreviewProject = (projectId?: string) => {
  const [projectData, setProjectData] = useState<PreviewProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!projectId) {
      setIsLoading(false);
      return;
    }

    // In a real app, this would be an API call to fetch the project data
    // For now, we'll just simulate it
    const fetchProjectData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // This is mock data - in a real app, you would fetch this from your API
        const mockProject: PreviewProject = {
          id: projectId,
          projectTitle: "Música para Maria e João",
          clientName: "Carlos Silva",
          packageType: "Pacote Profissional",
          status: "waiting",
          createdAt: new Date().toISOString(),
          expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          versions: [
            {
              id: "v1",
              title: "Versão Romântica",
              description: "Uma versão mais suave e romântica, ideal para momentos íntimos.",
              audioUrl: "https://example.com/song1.mp3",
              recommended: true,
              createdAt: new Date().toISOString()
            },
            {
              id: "v2",
              title: "Versão Animada",
              description: "Uma versão mais alegre e animada, perfeita para celebrações.",
              audioUrl: "https://example.com/song2.mp3",
              createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            }
          ],
          previews: [  // Add previews property to mock data
            {
              id: "v1",
              title: "Versão Romântica",
              description: "Uma versão mais suave e romântica, ideal para momentos íntimos.",
              audioUrl: "https://example.com/song1.mp3",
              recommended: true,
            },
            {
              id: "v2",
              title: "Versão Animada",
              description: "Uma versão mais alegre e animada, perfeita para celebrações.",
              audioUrl: "https://example.com/song2.mp3"
            }
          ],
          feedbackHistory: []
        };
        
        // Get data from localStorage if it exists (to preserve state between page refreshes)
        const savedProjectData = localStorage.getItem(`previewProject_${projectId}`);
        if (savedProjectData) {
          setProjectData(JSON.parse(savedProjectData));
        } else {
          setProjectData(mockProject);
          localStorage.setItem(`previewProject_${projectId}`, JSON.stringify(mockProject));
        }
      } catch (error) {
        console.error('Error fetching preview project:', error);
        toast({
          title: "Erro ao carregar prévia",
          description: "Não foi possível carregar os dados da prévia. Por favor, tente novamente.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId, toast]);

  // Update project status
  const updateProjectStatus = (status: 'waiting' | 'feedback' | 'approved', feedback?: string) => {
    console.log(`Updating project ${projectId} status to ${status}`);
    if (feedback) {
      console.log(`Feedback: ${feedback}`);
    }
    
    setProjectData(prevData => {
      if (!prevData) return null;
      
      return {
        ...prevData,
        status
      };
    });
    
    // In a real app, this would be an API call to update the project status
    return true;
  };

  return {
    projectData,
    setProjectData,
    isLoading,
    updateProjectStatus
  };
};
