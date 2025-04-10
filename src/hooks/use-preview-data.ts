
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface MusicPreview {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
}

export interface PreviewProjectData {
  clientName: string;
  projectTitle: string;
  projectId: string;
  packageType: string;
  creationDate: string;
  expirationDate?: string;
  status: 'waiting' | 'feedback' | 'approved';
  previews: MusicPreview[];
}

// Mock data - em uma implementação real, isso viria do banco de dados
const getMockPreviewData = (projectId: string): PreviewProjectData => {
  const mockData = {
    clientName: 'Cliente Exemplo',
    projectTitle: 'Projeto de Música Personalizada',
    projectId: projectId,
    packageType: 'Premium',
    creationDate: '10/04/2025',
    expirationDate: '10/05/2025',
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

export const usePreviewData = (projectId: string | undefined) => {
  const { toast } = useToast();
  const [projectData, setProjectData] = useState<PreviewProjectData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (projectId) {
      // Em uma implementação real, isso buscaria de uma API ou banco de dados
      setTimeout(() => {
        setProjectData(getMockPreviewData(projectId));
        setIsLoading(false);
        
        // Log de acesso à prévia para análises e monitoramento
        console.log(`Cliente acessando prévia: ${projectId}, data: ${new Date().toISOString()}`);
      }, 1000);
    }
  }, [projectId]);

  return { projectData, setProjectData, isLoading };
};
