
import { useState, useEffect } from 'react';
import { usePreviewProjects } from '@/hooks/admin/usePreviewProjects';
import { ProjectData, MusicPreview, PreviewProjectData } from '@/types/project.types';

export const usePreviewData = (projectId: string | undefined) => {
  const [projectData, setProjectData] = useState<PreviewProjectData | null>(null);
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
        recommended: v.recommended,
        name: v.name || `Versão ${v.id}`,
        createdAt: v.createdAt || new Date().toISOString()
      } as MusicPreview)) || [];
      
      if (previews.length === 0 && adminProject.versions > 0) {
        for (let i = 0; i < adminProject.versions; i++) {
          previews.push({
            id: `v${i+1}`,
            title: `Versão ${i+1}`,
            description: 'Versão para aprovação',
            audioUrl: 'https://drive.google.com/file/d/1H62ylCwQYJ23BLpygtvNmCgwTDcHX6Cl/preview',
            recommended: i === 0,
            name: `Versão ${i+1}`,
            createdAt: new Date().toISOString()
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
            name: 'Versão Acústica',
            createdAt: new Date().toISOString()
          },
          {
            id: 'v2',
            title: 'Versão Orquestral',
            description: 'Arranjo completo com cordas e metais',
            audioUrl: 'https://drive.google.com/file/d/11c6JahRd5Lx0iKCL_gHZ0zrZ3LFBJ47a/preview',
            name: 'Versão Orquestral',
            createdAt: new Date().toISOString()
          },
          {
            id: 'v3',
            title: 'Versão Minimalista',
            description: 'Abordagem simplificada com foco na melodia',
            audioUrl: 'https://drive.google.com/file/d/1fCsWubN8pXwM-mRlDtnQFTCkBbIkuUyW/preview',
            name: 'Versão Minimalista',
            createdAt: new Date().toISOString()
          }
        ],
        packageType: adminProject.packageType,
        creationDate: adminProject.createdAt
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
            name: 'Versão Acústica',
            createdAt: new Date().toISOString()
          },
          {
            id: 'v2',
            title: 'Versão Orquestral',
            description: 'Arranjo completo com cordas e metais',
            audioUrl: 'https://drive.google.com/file/d/11c6JahRd5Lx0iKCL_gHZ0zrZ3LFBJ47a/preview',
            name: 'Versão Orquestral',
            createdAt: new Date().toISOString() 
          },
          {
            id: 'v3',
            title: 'Versão Minimalista',
            description: 'Abordagem simplificada com foco na melodia',
            audioUrl: 'https://drive.google.com/file/d/1fCsWubN8pXwM-mRlDtnQFTCkBbIkuUyW/preview',
            name: 'Versão Minimalista',
            createdAt: new Date().toISOString()
          }
        ]
      });
    }
    
    setIsLoading(false);
  }, [projectId, getProjectById]);

  const updateProjectStatus = (newStatus: 'waiting' | 'feedback' | 'approved', feedback?: string) => {
    if (!actualProjectId) return false;

    // Create compatible updates object that won't cause type errors
    const updates: Record<string, any> = { 
      status: newStatus 
    };
    
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
