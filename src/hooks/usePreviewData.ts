import { useState, useEffect } from 'react';
import { usePreviewProjects } from '@/hooks/admin/usePreviewProjects';
import { ProjectData, ProjectItem as ComponentProjectItem } from '@/components/previews/types';

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
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actualProjectId, setActualProjectId] = useState<string | null>(null);
  const { getProjectById, updateProject } = usePreviewProjects();

  useEffect(() => {
    setIsLoading(true);
    
    if (!projectId) {
      setIsLoading(false);
      setProjectData(null);
      return;
    }

    setActualProjectId(projectId);
    
    const adminProject = getProjectById(projectId);
    
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
        ],
        id: adminProject.id,
        packageType: adminProject.packageType,
        createdAt: adminProject.createdAt,
        lastActivityDate: adminProject.lastActivityDate,
        expirationDate: adminProject.expirationDate,
        versions: adminProject.versions,
        versionsList: adminProject.versionsList,
        feedbackHistory: adminProject.feedbackHistory,
        history: adminProject.history,
        clientEmail: adminProject.clientEmail
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
        ],
        createdAt: new Date().toISOString(),
        lastActivityDate: new Date().toISOString(),
        packageType: 'Música Personalizada'
      });
    }
    
    setIsLoading(false);
  }, [projectId, getProjectById]);

  const updateProjectStatus = (newStatus: 'waiting' | 'feedback' | 'approved', feedback?: string) => {
    if (!actualProjectId) return false;

    const updates: Partial<ComponentProjectItem> = { status: newStatus };
    
    if (feedback) {
      updates.feedback = feedback;
    }
    
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
