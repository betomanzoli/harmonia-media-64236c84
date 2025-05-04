
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getProjectIdFromPreviewLink } from '@/utils/previewLinkUtils';

interface MusicPreview {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  recommended?: boolean;
}

interface ProjectData {
  clientName: string;
  projectTitle: string;
  status: 'waiting' | 'feedback' | 'approved';
  createdAt: string;
  expirationDate?: string;
  packageType?: string;
  versions: MusicPreview[];
}

export const usePreviewProject = (projectId: string | undefined) => {
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actualProjectId, setActualProjectId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadProjectData = async () => {
      if (!projectId) {
        setIsLoading(false);
        setProjectData(null);
        return;
      }
      
      console.log(`usePreviewProject: Carregando dados para projectId=${projectId}`);
      setIsLoading(true);

      try {
        // Primeiro tenta decodificar o ID em caso de ser um link codificado
        const decodedId = getProjectIdFromPreviewLink(projectId);
        const actualId = decodedId || projectId;
        console.log(`usePreviewProject: ID decodificado=${decodedId}, ID final=${actualId}`);
        setActualProjectId(actualId);

        // Busca o projeto no localStorage
        const storedProjects = localStorage.getItem('harmonIA_preview_projects');
        if (!storedProjects) {
          console.log('usePreviewProject: Nenhum projeto encontrado no localStorage');
          setProjectData(null);
          setIsLoading(false);
          return;
        }

        const projects = JSON.parse(storedProjects);
        const project = projects.find((p: any) => p.id === actualId);
        
        if (project) {
          console.log('usePreviewProject: Projeto encontrado:', project);
          
          const versions = project.versionsList?.map((v: any) => ({
            id: v.id,
            title: v.name || `Versão ${v.id}`,
            description: v.description || '',
            audioUrl: v.audioUrl || '',
            recommended: v.recommended
          })) || [];
          
          if (versions.length === 0 && project.versions > 0) {
            // Fallback se não houver versionsList mas o contador de versões > 0
            for (let i = 0; i < project.versions; i++) {
              versions.push({
                id: `v${i+1}`,
                title: `Versão ${i+1}`,
                description: 'Versão para aprovação',
                audioUrl: 'https://drive.google.com/file/d/1H62ylCwQYJ23BLpygtvNmCgwTDcHX6Cl/preview',
                recommended: i === 0
              });
            }
          }
          
          setProjectData({
            clientName: project.clientName || 'Cliente',
            projectTitle: project.projectTitle || project.packageType || 'Música Personalizada',
            status: project.status || 'waiting',
            createdAt: project.createdAt || new Date().toISOString(),
            expirationDate: project.expirationDate,
            packageType: project.packageType,
            versions: versions.length > 0 ? versions : [
              {
                id: 'v1',
                title: 'Versão Acústica',
                description: 'Versão suave com violão e piano',
                audioUrl: 'https://drive.google.com/file/d/1H62ylCwQYJ23BLpygtvNmCgwTDcHX6Cl/preview',
                recommended: true
              },
              {
                id: 'v2',
                title: 'Versão Orquestral',
                description: 'Arranjo completo com cordas e metais',
                audioUrl: 'https://drive.google.com/file/d/11c6JahRd5Lx0iKCL_gHZ0zrZ3LFBJ47a/preview'
              }
            ]
          });
        } else {
          console.log(`usePreviewProject: Projeto não encontrado para id=${actualId}`);
          setProjectData(null);
        }
      } catch (error) {
        console.error('usePreviewProject: Erro ao carregar dados do projeto:', error);
        setProjectData(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjectData();
  }, [projectId]);

  const updateProjectStatus = (newStatus: 'waiting' | 'feedback' | 'approved', comments: string = '') => {
    if (!actualProjectId) {
      console.error('usePreviewProject: Não é possível atualizar o status sem um ID de projeto válido');
      return false;
    }

    try {
      console.log(`usePreviewProject: Atualizando status para ${newStatus}`);
      
      const storedProjects = localStorage.getItem('harmonIA_preview_projects');
      if (!storedProjects) {
        console.error('usePreviewProject: Nenhum projeto encontrado no localStorage');
        return false;
      }

      const projects = JSON.parse(storedProjects);
      const projectIndex = projects.findIndex((p: any) => p.id === actualProjectId);
      
      if (projectIndex === -1) {
        console.error(`usePreviewProject: Projeto não encontrado para id=${actualProjectId}`);
        return false;
      }
      
      // Atualiza o status
      projects[projectIndex].status = newStatus;
      
      // Adiciona feedback se fornecido
      if (comments) {
        projects[projectIndex].feedback = comments;
        
        // Adiciona ao histórico de feedback
        if (!projects[projectIndex].feedbackHistory) {
          projects[projectIndex].feedbackHistory = [];
        }
        
        projects[projectIndex].feedbackHistory.push({
          id: `feedback_${Date.now()}`,
          content: comments,
          createdAt: new Date().toISOString(),
          status: 'pending'
        });
      }
      
      // Adiciona ao histórico geral
      if (!projects[projectIndex].history) {
        projects[projectIndex].history = [];
      }
      
      projects[projectIndex].history.push({
        action: `Status alterado para ${newStatus}`,
        timestamp: new Date().toLocaleString('pt-BR'),
        data: {
          message: comments || `Cliente alterou o status do projeto para ${newStatus}`
        }
      });
      
      // Atualiza data da última atividade
      projects[projectIndex].lastActivityDate = new Date().toISOString();
      
      // Salva de volta ao localStorage
      localStorage.setItem('harmonIA_preview_projects', JSON.stringify(projects));
      
      // Atualiza dados locais
      if (projectData) {
        setProjectData({
          ...projectData,
          status: newStatus
        });
      }
      
      console.log('usePreviewProject: Status atualizado com sucesso');
      return true;
    } catch (error) {
      console.error('usePreviewProject: Erro ao atualizar o status:', error);
      return false;
    }
  };

  return { projectData, isLoading, actualProjectId, updateProjectStatus };
};
