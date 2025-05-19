
import { useState, useEffect } from 'react';
import { usePreviewProjects, ProjectItem } from '@/hooks/admin/usePreviewProjects';

export interface PreviewProjectData {
  clientName: string;
  projectTitle: string;
  status: 'waiting' | 'feedback' | 'approved';
  previews: {
    id: string;
    title: string;
    description: string;
    audioUrl: string;
    recommended?: boolean;
  }[];
  packageType?: string;
  creationDate?: string;
}

export const usePreviewData = (projectId: string | undefined) => {
  const [projectData, setProjectData] = useState<PreviewProjectData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actualProjectId, setActualProjectId] = useState<string | null>(null);
  const { getProjectById, fetchProjectById } = usePreviewProjects();

  useEffect(() => {
    setIsLoading(true);
    
    if (!projectId) {
      setIsLoading(false);
      setProjectData(null);
      return;
    }

    setActualProjectId(projectId);
    
    const loadProject = async () => {
      // First try to get project from local cache
      let adminProject = getProjectById(projectId);
      
      // If not in local cache, try to fetch from Supabase
      if (!adminProject) {
        try {
          adminProject = await fetchProjectById(projectId);
        } catch (error) {
          console.error("Error fetching project:", error);
          adminProject = null;
        }
      }
      
      if (adminProject) {
        console.log('Project found:', adminProject);
        
        const previews = adminProject.versionsList?.map(v => ({
          id: v.id,
          title: v.name || `Versão ${v.id}`,
          description: v.description || '',
          audioUrl: v.audioUrl || '',
          recommended: v.recommended
        })) || [];
        
        if (previews.length === 0 && adminProject.versions > 0) {
          for (let i = 0; i < adminProject.versions; i++) {
            previews.push({
              id: `v${i+1}`,
              title: `Versão ${i+1}`,
              description: 'Versão para aprovação',
              audioUrl: 'https://drive.google.com/file/d/1H62ylCwQYJ23BLpygtvNmCgwTDcHX6Cl/preview',
              recommended: i === 0
            });
          }
        }

        setProjectData({
          clientName: adminProject.clientName,
          projectTitle: adminProject.packageType || 'Música Personalizada',
          status: adminProject.status as 'waiting' | 'feedback' | 'approved',
          previews: previews.length > 0 ? previews : [
            {
              id: 'v1',
              title: 'Versão Acústica',
              description: 'Versão suave com violão e piano',
              audioUrl: 'https://drive.google.com/file/d/1H62ylCwQYJ23BLpygtvNmCgwTDcHX6Cl/preview',
            },
            {
              id: 'v2',
              title: 'Versão Orquestral',
              description: 'Arranjo completo com cordas e metais',
              audioUrl: 'https://drive.google.com/file/d/11c6JahRd5Lx0iKCL_gHZ0zrZ3LFBJ47a/preview',
            },
            {
              id: 'v3',
              title: 'Versão Minimalista',
              description: 'Abordagem simplificada com foco na melodia',
              audioUrl: 'https://drive.google.com/file/d/1fCsWubN8pXwM-mRlDtnQFTCkBbIkuUyW/preview',
            }
          ]
        });
      } else {
        console.log('Project not found, using fallback data');
        setProjectData({
          clientName: 'Cliente Exemplo',
          projectTitle: 'Projeto de Música Personalizada',
          status: 'waiting',
          previews: [
            {
              id: 'v1',
              title: 'Versão Acústica',
              description: 'Versão suave com violão e piano',
              audioUrl: 'https://drive.google.com/file/d/1H62ylCwQYJ23BLpygtvNmCgwTDcHX6Cl/preview',
            },
            {
              id: 'v2',
              title: 'Versão Orquestral',
              description: 'Arranjo completo com cordas e metais',
              audioUrl: 'https://drive.google.com/file/d/11c6JahRd5Lx0iKCL_gHZ0zrZ3LFBJ47a/preview',
            },
            {
              id: 'v3',
              title: 'Versão Minimalista',
              description: 'Abordagem simplificada com foco na melodia',
              audioUrl: 'https://drive.google.com/file/d/1fCsWubN8pXwM-mRlDtnQFTCkBbIkuUyW/preview',
            }
          ]
        });
      }
      
      setIsLoading(false);
    };
    
    loadProject();
  }, [projectId, getProjectById, fetchProjectById]);

  const updateProjectStatus = (newStatus: 'waiting' | 'feedback' | 'approved', feedback?: string) => {
    if (!actualProjectId) return false;

    const updates: Partial<ProjectItem> = { status: newStatus };
    
    if (feedback) {
      updates.feedback = feedback;
    }
    
    const { updateProject } = usePreviewProjects();
    const updatedProject = updateProject(actualProjectId, updates);
    
    if (updatedProject && projectData) {
      setProjectData({
        ...projectData,
        status: newStatus
      });
      return true;
    }
    
    return false;
  };
  
  return { projectData, isLoading, actualProjectId, updateProjectStatus };
};
