
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useGoogleDriveAudio } from '@/hooks/audio/useGoogleDriveAudio';

interface MusicPreview {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
}

interface PreviewProject {
  clientName: string;
  projectTitle: string;
  status: 'waiting' | 'feedback' | 'approved';
  previews: MusicPreview[];
}

// Mock data - in a real implementation, this would come from the database
const getMockPreviewData = (projectId: string): PreviewProject => {
  const mockData = {
    clientName: 'Cliente Exemplo',
    projectTitle: 'Projeto de Música Personalizada',
    status: 'waiting' as const,
    previews: [
      {
        id: 'v1',
        title: 'Versão Acústica',
        description: 'Versão suave com violão e piano',
        audioUrl: 'https://drive.google.com/uc?export=download&id=1H62ylCwQYJ23BLpygtvNmCgwTDcHX6Cl',
      },
      {
        id: 'v2',
        title: 'Versão Orquestral',
        description: 'Arranjo completo com cordas e metais',
        audioUrl: 'https://drive.google.com/uc?export=download&id=11c6JahRd5Lx0iKCL_gHZ0zrZ3LFBJ47a',
      },
      {
        id: 'v3',
        title: 'Versão Minimalista',
        description: 'Abordagem simplificada com foco na melodia',
        audioUrl: 'https://drive.google.com/uc?export=download&id=1fCsWubN8pXwM-mRlDtnQFTCkBbIkuUyW',
      }
    ]
  };
  
  return mockData;
};

export const usePreviewProject = (projectId: string | undefined) => {
  const { toast } = useToast();
  const [projectData, setProjectData] = useState<PreviewProject | null>(null);
  const { audioFiles, isLoading } = useGoogleDriveAudio();
  
  useEffect(() => {
    if (projectId) {
      // In a real implementation, this would fetch from an API or database
      setProjectData(getMockPreviewData(projectId));
      
      // Log preview access in real implementation
      console.log(`Cliente acessando prévia: ${projectId}, data: ${new Date().toISOString()}`);
    }
  }, [projectId]);

  return { projectData, setProjectData, isLoading };
};
