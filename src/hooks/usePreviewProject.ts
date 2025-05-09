
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
  projectName?: string;
  createdAt?: string;
  expiresAt?: string;
  versions?: MusicPreview[];
}

export const usePreviewProject = (projectId: string | undefined) => {
  const { toast } = useToast();
  const [projectData, setProjectData] = useState<PreviewProject | null>(null);
  const { audioFiles, isLoading: audioLoading } = useGoogleDriveAudio();
  const { getProjectById, updateProject } = usePreviewProjects();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!projectId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    // Get project from admin projects
    const adminProject = getProjectById(projectId);
    
    if (adminProject) {
      console.log('Project found in admin system:', adminProject);
      
      // Create previews from project versions list
      const previews: MusicPreview[] = adminProject.versionsList?.map(v => ({
        id: v.id,
        title: v.name || `Versão ${v.id}`,
        description: v.description || '',
        audioUrl: `https://drive.google.com/uc?export=download&id=${v.fileId || audioFiles[0]?.id || '1H62ylCwQYJ23BLpygtvNmCgwTDcHX6Cl'}`,
        fileId: v.fileId,
        recommended: v.recommended
      })) || [];
      
      // If no previews but versions exist, create a fallback
      if (previews.length === 0 && adminProject.versions > 0) {
        for (let i = 0; i < adminProject.versions; i++) {
          const fallbackFileId = audioFiles[i % audioFiles.length]?.id || '1H62ylCwQYJ23BLpygtvNmCgwTDcHX6Cl';
          previews.push({
            id: `v${i+1}`,
            title: `Versão ${i+1}`,
            description: 'Versão para aprovação',
            audioUrl: `https://drive.google.com/uc?export=download&id=${fallbackFileId}`,
            fileId: fallbackFileId,
            recommended: i === 0 // Mark first version as recommended
          });
        }
      }

      // Create project data
      setProjectData({
        clientName: adminProject.clientName,
        projectTitle: adminProject.packageType || 'Música Personalizada',
        projectName: adminProject.projectTitle || 'Música Personalizada',
        packageType: adminProject.packageType || 'Música Personalizada',
        status: adminProject.status as 'waiting' | 'feedback' | 'approved',
        expiresAt: adminProject.expirationDate,
        createdAt: adminProject.createdAt,
        previews: previews.length > 0 ? previews : [
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
        ],
        versions: previews.length > 0 ? previews : [
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
      
      // Log preview access
      console.log(`Cliente acessando prévia: ${projectId}, data: ${new Date().toISOString()}`);
    } else {
      console.error(`Project with ID ${projectId} not found in admin system`);
      
      // Fallback to mock data if project not found
      setProjectData({
        clientName: 'Cliente Exemplo',
        projectTitle: 'Projeto de Música Personalizada',
        projectName: 'Projeto de Música Personalizada',
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
        ],
        versions: [
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
    }
    
    setIsLoading(false);
  }, [projectId, getProjectById, audioFiles]);
  
  // Update project status function
  const updateProjectStatus = (newStatus: 'approved' | 'feedback', comments: string) => {
    if (!projectId || !projectData) return false;

    console.log(`Atualizando status do projeto ${projectId} para ${newStatus}`);
    console.log(`Feedback do cliente: ${comments}`);
    
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
  
  return { projectData, setProjectData, isLoading, updateProjectStatus };
};
