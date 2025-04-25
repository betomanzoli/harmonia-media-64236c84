
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useGoogleDriveAudio } from '@/hooks/audio/useGoogleDriveAudio';
import { usePreviewProjects } from '@/hooks/admin/usePreviewProjects';
import { notificationService } from '@/services/notificationService';

interface MusicPreview {
  id: string;
  title: string;
  description: string;
  audioUrl?: string;
  url?: string;
}

interface PreviewProject {
  clientName: string;
  projectTitle: string;
  status: 'waiting' | 'feedback' | 'approved';
  previews: MusicPreview[];
}

export const usePreviewData = (projectId: string | undefined) => {
  const { toast } = useToast();
  const [projectData, setProjectData] = useState<PreviewProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { audioFiles } = useGoogleDriveAudio(projectId);
  const { projects, getProjectById, updateProject } = usePreviewProjects();
  
  useEffect(() => {
    if (!projectId) {
      setIsLoading(false);
      return;
    }

    const fetchProjectData = async () => {
      setIsLoading(true);
      
      try {
        // Get project from admin projects
        const adminProject = getProjectById(projectId);
        
        if (adminProject) {
          console.log('Project found:', adminProject);
          
          // Map versions from the admin project
          const previews: MusicPreview[] = [];
          
          // First check for versionsList array
          if (adminProject.versionsList && adminProject.versionsList.length > 0) {
            adminProject.versionsList.forEach(v => {
              previews.push({
                id: v.id,
                title: v.name || `Versão ${v.id}`,
                description: v.description || '',
                audioUrl: v.audioUrl || undefined,
                url: v.url || undefined
              });
            });
          } 
          // If versionsList doesn't exist or is empty but versions count exists
          else if (adminProject.versions > 0) {
            for (let i = 0; i < adminProject.versions; i++) {
              const fallbackFileId = audioFiles[i % audioFiles.length]?.id || '1H62ylCwQYJ23BLpygtvNmCgwTDcHX6Cl';
              previews.push({
                id: `v${i+1}`,
                title: `Versão ${i+1}`,
                description: 'Versão para aprovação',
                audioUrl: `https://drive.google.com/uc?export=view&id=${fallbackFileId}`
              });
            }
          }

          // If no previews were found, add demo content only in dev environments
          if (previews.length === 0) {
            previews.push({
              id: 'v1',
              title: 'Versão Demonstrativa',
              description: 'Esta é uma versão de exemplo',
              audioUrl: '/samples/preview1.mp3'
            });
          }
          
          // Log preview access after confirming project exists
          console.log(`Cliente acessando prévia: ${projectId}, data: ${new Date().toISOString()}`);

          setProjectData({
            clientName: adminProject.clientName,
            projectTitle: adminProject.packageType || 'Música Personalizada',
            status: adminProject.status as 'waiting' | 'feedback' | 'approved',
            previews
          });
          
        } else {
          console.error(`Project with ID ${projectId} not found`);
          setProjectData(null);
          
          // Notify admin that a user attempted to access a non-existent preview
          notificationService.notify('preview_access_attempt', {
            projectId,
            timestamp: new Date().toISOString(),
            message: 'Tentativa de acesso a uma prévia inexistente'
          });
        }
      } catch (error) {
        console.error('Error fetching project data:', error);
        setProjectData(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjectData();
  }, [projectId, audioFiles, getProjectById]);
  
  // Function to update project status when feedback is submitted or version is approved
  const updateProjectStatus = (status: 'waiting' | 'feedback' | 'approved', selectedVersion?: string) => {
    if (projectId && projectData) {
      // Update local state
      setProjectData({
        ...projectData,
        status
      });
      
      // Update in admin system
      if (updateProject) {
        const updates: Record<string, any> = { status };
        
        if (selectedVersion) {
          updates.selectedVersion = selectedVersion;
        }
        
        updateProject(projectId, updates);
      }
    }
  };
  
  return { 
    projectData, 
    setProjectData, 
    isLoading,
    updateProjectStatus
  };
};
