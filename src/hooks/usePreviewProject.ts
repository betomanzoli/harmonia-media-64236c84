import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useGoogleDriveAudio } from '@/hooks/audio/useGoogleDriveAudio';
import { usePreviewProjects } from '@/hooks/admin/usePreviewProjects';

interface MusicPreview {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  fileId?: string;
  recommended?: boolean;
}

interface PreviewProject {
  clientName: string;
  projectTitle: string;
  status: 'waiting' | 'feedback' | 'approved';
  previews: MusicPreview[];
  packageType?: string;
  createdAt?: string;
  expiresAt?: string;
}

// Extend ProjectItem interface with the title property that we need
interface ExtendedProjectItem {
  title?: string;
  [key: string]: any;
}

export const usePreviewProject = (projectId: string | undefined) => {
  const { toast } = useToast();
  const [projectData, setProjectData] = useState<PreviewProject | null>(null);
  const { audioFiles, isLoading: audioLoading } = useGoogleDriveAudio();
  const { getProjectById, updateProject } = usePreviewProjects();
  const [isLoading, setIsLoading] = useState(true);
  const [accessTokenValid, setAccessTokenValid] = useState(true);
  const [originalProjectId] = useState(projectId);
  
  useEffect(() => {
    if (!projectId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    console.log("[usePreviewProject] Loading project with ID:", projectId);
    
    try {
      // Get project from admin projects
      const adminProject = getProjectById(projectId) as ExtendedProjectItem;
      
      if (adminProject) {
        console.log('[usePreviewProject] Project found in admin system:', adminProject);
        
        // Check localStorage for saved status
        let projectStatus = adminProject.status as 'waiting' | 'feedback' | 'approved';
        try {
          const savedStatus = localStorage.getItem(`preview_status_${projectId}`);
          if (savedStatus && (savedStatus === 'approved' || savedStatus === 'feedback')) {
            projectStatus = savedStatus as 'waiting' | 'feedback' | 'approved';
            console.log(`[usePreviewProject] Loaded saved status from localStorage: ${savedStatus}`);
          }
        } catch (err) {
          console.error("Error loading status from localStorage:", err);
        }
        
        // Create previews from project versions list
        const previews: MusicPreview[] = adminProject.versionsList?.map(v => ({
          id: v.id,
          title: v.name || `Versão ${v.id}`,
          description: v.description || '',
          audioUrl: `https://drive.google.com/uc?export=download&id=${v.fileId || audioFiles[0]?.id || '1H62ylCwQYJ23BLpygtvNmCgwTDcHX6Cl'}`,
          fileId: v.fileId,
          recommended: v.recommended
        })) || [];
        
        // If no previews but versionsList exists, create from versionsList
        if (previews.length === 0 && adminProject.versionsList && adminProject.versionsList.length > 0) {
          for (let i = 0; i < adminProject.versionsList.length; i++) {
            const version = adminProject.versionsList[i];
            const fileId = version.fileId || audioFiles[i % audioFiles.length]?.id || '1H62ylCwQYJ23BLpygtvNmCgwTDcHX6Cl';
            
            previews.push({
              id: version.id || `v${i+1}`,
              title: version.name || `Versão ${i+1}`,
              description: version.description || 'Versão para aprovação',
              audioUrl: `https://drive.google.com/uc?export=download&id=${fileId}`,
              fileId: fileId,
              recommended: version.recommended || i === 0 // Mark first version as recommended
            });
          }
        }
        
        // If there are no versions yet, create fallback previews only for demo purposes
        const fallbackPreviews = [
          {
            id: 'v1',
            title: 'Versão Acústica',
            description: 'Versão suave com violão e piano',
            audioUrl: 'https://drive.google.com/uc?export=download&id=1H62ylCwQYJ23BLpygtvNmCgwTDcHX6Cl',
            fileId: '1H62ylCwQYJ23BLpygtvNmCgwTDcHX6Cl'
          },
          {
            id: 'v2',
            title: 'Versão Orquestral',
            description: 'Arranjo completo com cordas e metais',
            audioUrl: 'https://drive.google.com/uc?export=download&id=11c6JahRd5Lx0iKCL_gHZ0zrZ3LFBJ47a',
            fileId: '11c6JahRd5Lx0iKCL_gHZ0zrZ3LFBJ47a'
          },
          {
            id: 'v3',
            title: 'Versão Minimalista',
            description: 'Abordagem simplificada com foco na melodia',
            audioUrl: 'https://drive.google.com/uc?export=download&id=1fCsWubN8pXwM-mRlDtnQFTCkBbIkuUyW',
            fileId: '1fCsWubN8pXwM-mRlDtnQFTCkBbIkuUyW'
          }
        ];

        // Create project data
        setProjectData({
          clientName: adminProject.clientName || 'Cliente',
          projectTitle: adminProject.title || adminProject.packageType || 'Música Personalizada',
          packageType: adminProject.packageType || 'Música Personalizada',
          status: projectStatus,
          expiresAt: adminProject.expirationDate,
          createdAt: adminProject.createdAt,
          previews: previews.length > 0 ? previews : (adminProject.id === 'P0001' ? [] : fallbackPreviews)
        });
        
        // Record access in logs
        console.log(`Cliente acessando prévia: ${projectId}, data: ${new Date().toISOString()}`);
      } else {
        console.error(`Project with ID ${projectId} not found in admin system`);
        
        // Fallback to mock data if project not found
        setProjectData({
          clientName: 'Cliente Exemplo',
          projectTitle: 'Projeto de Música Personalizada',
          packageType: 'Música Personalizada',
          status: 'waiting',
          expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          previews: [
            {
              id: 'v1',
              title: 'Versão Acústica',
              description: 'Versão suave com violão e piano',
              audioUrl: 'https://drive.google.com/uc?export=download&id=1H62ylCwQYJ23BLpygtvNmCgwTDcHX6Cl',
              fileId: '1H62ylCwQYJ23BLpygtvNmCgwTDcHX6Cl'
            },
            {
              id: 'v2',
              title: 'Versão Orquestral',
              description: 'Arranjo completo com cordas e metais',
              audioUrl: 'https://drive.google.com/uc?export=download&id=11c6JahRd5Lx0iKCL_gHZ0zrZ3LFBJ47a',
              fileId: '11c6JahRd5Lx0iKCL_gHZ0zrZ3LFBJ47a'
            },
            {
              id: 'v3',
              title: 'Versão Minimalista',
              description: 'Abordagem simplificada com foco na melodia',
              audioUrl: 'https://drive.google.com/uc?export=download&id=1fCsWubN8pXwM-mRlDtnQFTCkBbIkuUyW',
              fileId: '1fCsWubN8pXwM-mRlDtnQFTCkBbIkuUyW'
            }
          ]
        });
        
        setAccessTokenValid(false);
        
        // Show a toast if the project wasn't found, but only if we're not in a testing mode or iframe
        if (!window.location.href.includes('localhost') && !window.location.href.includes('127.0.0.1')) {
          toast({
            title: "Aviso de prévia",
            description: "Você está acessando uma versão de demonstração. Contate o administrador.",
            variant: "default"
          });
        }
      }
    } catch (error) {
      console.error("Error loading preview project:", error);
      setAccessTokenValid(false);
      toast({
        title: "Erro ao carregar prévia",
        description: "Houve um erro ao carregar os dados da prévia.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [projectId, getProjectById, audioFiles, toast]);
  
  // Update project status function with persistent storage
  const updateProjectStatus = (newStatus: 'approved' | 'feedback', comments: string) => {
    if (!projectId || !projectData) return false;

    console.log(`Atualizando status do projeto ${projectId} para ${newStatus}`);
    console.log(`Feedback do cliente: ${comments}`);
    
    // Save to localStorage for persistence between page refreshes
    try {
      localStorage.setItem(`preview_status_${projectId}`, newStatus);
      localStorage.setItem(`preview_feedback_${projectId}`, comments || '');
      console.log(`Saved status ${newStatus} to localStorage for project ${projectId}`);
    } catch (err) {
      console.error("Error saving to localStorage:", err);
    }
    
    // Update the project in the admin system
    if (projectId) {
      // Add history entry
      const historyAction = newStatus === 'approved' 
        ? 'Prévia aprovada pelo cliente' 
        : 'Feedback recebido do cliente';
      
      const historyEntry = {
        action: historyAction,
        timestamp: new Date().toLocaleString('pt-BR'),
        data: {
          message: comments || 'Sem comentários adicionais'
        }
      };
      
      const updates = {
        status: newStatus,
        feedback: comments,
        lastActivityDate: new Date().toLocaleDateString('pt-BR'),
        history: [historyEntry]
      };
      
      const updated = updateProject(projectId, updates);
      
      if (updated) {
        // Update local state
        setProjectData(prev => {
          if (!prev) return null;
          return {
            ...prev,
            status: newStatus
          };
        });
        
        return true;
      }
    }
    
    return false;
  };
  
  return { 
    projectData, 
    setProjectData, 
    isLoading, 
    updateProjectStatus,
    accessTokenValid,
    originalProjectId
  };
};

export type { PreviewProject, MusicPreview };
