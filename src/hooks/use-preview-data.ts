
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

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

export const usePreviewData = (projectId: string | undefined) => {
  const { toast } = useToast();
  const [projectData, setProjectData] = useState<PreviewProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!projectId) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    
    // Primeiro, buscamos nos projetos salvos no localStorage
    try {
      const allProjects = JSON.parse(localStorage.getItem('preview-projects') || '[]');
      const foundProject = allProjects.find((p: any) => p.id === projectId);
      
      if (foundProject) {
        console.log('Projeto encontrado no localStorage:', foundProject);
        
        // Transformar o projeto no formato esperado
        const formattedProject: PreviewProject = {
          clientName: foundProject.clientName,
          projectTitle: `Projeto ${foundProject.id}`,
          status: foundProject.status as 'waiting' | 'feedback' | 'approved',
          previews: foundProject.versionsList?.map((v: any) => ({
            id: v.id,
            title: v.name,
            description: `Versão musical para ${foundProject.clientName}`,
            audioUrl: v.url || 'https://drive.google.com/uc?export=download&id=1H62ylCwQYJ23BLpygtvNmCgwTDcHX6Cl'
          })) || []
        };
        
        setProjectData(formattedProject);
        setIsLoading(false);
        console.log('Dados do projeto formatados:', formattedProject);
        return;
      }
    } catch (error) {
      console.error('Erro ao buscar projeto no localStorage:', error);
    }
    
    // Se não encontrou no localStorage, usamos os dados de mock
    const mockData: PreviewProject = {
      clientName: 'Cliente Exemplo',
      projectTitle: 'Projeto de Música Personalizada',
      status: 'waiting',
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
    
    console.log('Usando dados de mock para o projeto:', projectId);
    setProjectData(mockData);
    setIsLoading(false);
  }, [projectId]);

  return { projectData, setProjectData, isLoading };
};
