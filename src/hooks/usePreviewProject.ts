
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
        toast({
          title: "Erro ao carregar projeto",
          description: "Não foi possível carregar os dados do projeto.",
          variant: "destructive"
        });
        console.error("Error fetching project data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId, toast]);

  // Function to update the project status and add feedback to history
  const updateProjectStatus = (newStatus: 'feedback' | 'approved', comments: string) => {
    if (!projectData) return;
    
    // Create a feedback record
    const feedbackRecord: FeedbackRecord = {
      id: `feedback_${Date.now()}`,
      content: comments,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    
    // Update the project data with new status and feedback
    const updatedProject = {
      ...projectData,
      status: newStatus,
      feedbackHistory: [
        ...(projectData.feedbackHistory || []),
        feedbackRecord
      ]
    };
    
    // If the status is "feedback", simulate creating a new version based on feedback
    if (newStatus === 'feedback') {
      // In a real app, this would trigger a notification to your team
      // that a new round of feedback has been received
      console.log(`Feedback received for project ${projectData.id}:`, comments);
      
      // For demo purposes, we'll add a "New version" flag to show the feedback cycle
      // In a real app, your team would create a new version based on the feedback
      localStorage.setItem(`feedback_pending_${projectData.id}`, 'true');
      
      // Simulate the flow where your team would get notified and later add a new version
      setTimeout(() => {
        // Check if the component is still mounted before updating
        const storedProject = localStorage.getItem(`previewProject_${projectData.id}`);
        if (storedProject) {
          const project = JSON.parse(storedProject);
          
          // Add a new version based on feedback (in a real app, your team would do this)
          const newVersion: ProjectVersion = {
            id: `v${(project.versions?.length || 0) + 1}`,
            title: `Versão Revisada (após feedback)`,
            description: "Esta versão foi criada com base no seu feedback anterior.",
            audioUrl: "https://example.com/song_revised.mp3",
            recommended: true,
            createdAt: new Date().toISOString()
          };
          
          const updatedVersions = [
            newVersion,
            ...(project.versions || [])
          ];
          
          // Update the stored project with the new version
          const updatedWithNewVersion = {
            ...project,
            versions: updatedVersions,
            status: 'waiting' // Reset to waiting for feedback on the new version
          };
          
          localStorage.setItem(`previewProject_${projectData.id}`, JSON.stringify(updatedWithNewVersion));
          localStorage.removeItem(`feedback_pending_${projectData.id}`);
        }
      }, 30000); // Simulate a delay before new version is created (30 seconds)
    }
    
    // Save to state and localStorage
    setProjectData(updatedProject);
    localStorage.setItem(`previewProject_${projectData.id}`, JSON.stringify(updatedProject));
    
    return true;
  };

  return {
    projectData,
    isLoading,
    updateProjectStatus,
    setProjectData
  };
};
