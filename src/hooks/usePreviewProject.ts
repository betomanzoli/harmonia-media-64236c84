
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useGoogleDriveAudio } from '@/hooks/audio/useGoogleDriveAudio';
import { usePreviewProjects } from '@/hooks/admin/usePreviewProjects';
import { supabase } from '@/lib/supabase';

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
  
  useEffect(() => {
    if (!projectId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    console.log('Loading project with ID:', projectId);
    
    const loadProject = async () => {
      try {
        // First attempt: Get project from admin system usePreviewProjects
        // This will check both localStorage and Supabase
        const adminProject = await getProjectById(projectId) as ExtendedProjectItem;
        
        if (adminProject) {
          console.log('Project found in admin system:', adminProject);
          
          // Create previews from project versions list
          const previews: MusicPreview[] = [];
          
          if (adminProject.versionsList && Array.isArray(adminProject.versionsList) && adminProject.versionsList.length > 0) {
            // First attempt: use versionsList if available
            adminProject.versionsList.forEach((v, i) => {
              const fileId = v.fileId || (audioFiles[i % audioFiles.length]?.id || '1H62ylCwQYJ23BLpygtvNmCgwTDcHX6Cl');
              
              previews.push({
                id: v.id || `v${i+1}`,
                title: v.name || `Versão ${i+1}`,
                description: v.description || 'Versão para aprovação',
                audioUrl: `https://drive.google.com/uc?export=download&id=${fileId}`,
                fileId: fileId,
                recommended: v.recommended || (i === 0) // Mark first version as recommended
              });
            });
          } 
          // Second attempt: use versions array if exists
          else if (adminProject.versions && Array.isArray(adminProject.versions) && adminProject.versions.length > 0) {
            adminProject.versions.forEach((version, i) => {
              const fileId = version.fileId || (audioFiles[i % audioFiles.length]?.id || '1H62ylCwQYJ23BLpygtvNmCgwTDcHX6Cl');
              
              previews.push({
                id: version.id || `v${i+1}`,
                title: version.name || `Versão ${i+1}`,
                description: version.description || 'Versão para aprovação',
                audioUrl: `https://drive.google.com/uc?export=download&id=${fileId}`,
                fileId: fileId,
                recommended: version.recommended || (i === 0)
              });
            });
          }
          
          console.log('Created previews:', previews);

          // Create project data
          setProjectData({
            clientName: adminProject.clientName || 'Cliente',
            projectTitle: adminProject.title || adminProject.packageType || 'Música Personalizada',
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
                fileId: '1H62ylCwQYJ23BLpygtvNmCgwTDcHX6Cl',
                recommended: true
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
          
          try {
            await supabase.from('access_logs').insert({
              preview_id: projectId,
              user_email: 'anonymous@user.com',
              access_method: 'direct_access',
              ip_address: 'not-tracked'
            });
          } catch (logError) {
            console.error("Error logging access:", logError);
            // Non-blocking error, continue with access
          }
          
          setIsLoading(false);
          return;
        }
        
        // If project not found in admin system, try to fetch directly from Supabase
        console.log("Project not found in admin system, trying to fetch directly from Supabase");
        const { data: projectData, error: projectError } = await supabase
          .from('preview_projects')
          .select('*')
          .eq('id', projectId)
          .maybeSingle();
          
        if (projectError) {
          console.error(`Error fetching project ${projectId} from Supabase:`, projectError);
          throw new Error("Projeto não encontrado");
        }
        
        if (!projectData) {
          console.error(`Project ${projectId} not found in Supabase`);
          throw new Error("Projeto não encontrado");
        }
        
        // Fetch versions for this project
        const { data: versionData, error: versionError } = await supabase
          .from('project_versions')
          .select('*')
          .eq('project_id', projectId);
          
        if (versionError) {
          console.error(`Error loading versions for project ${projectId}:`, versionError);
        }
        
        const versions: MusicPreview[] = versionData && versionData.length > 0
          ? versionData.map(v => ({
              id: v.version_id,
              title: v.name,
              description: v.description || 'Versão para aprovação',
              audioUrl: v.audio_url || `https://drive.google.com/uc?export=download&id=${v.file_id}`,
              fileId: v.file_id,
              recommended: v.recommended
            }))
          : [
              {
                id: 'v1',
                title: 'Versão Acústica',
                description: 'Versão suave com violão e piano',
                audioUrl: 'https://drive.google.com/uc?export=download&id=1H62ylCwQYJ23BLpygtvNmCgwTDcHX6Cl',
                fileId: '1H62ylCwQYJ23BLpygtvNmCgwTDcHX6Cl',
                recommended: true
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
            
        setProjectData({
          clientName: projectData.client_name,
          projectTitle: projectData.project_title,
          packageType: projectData.package_type,
          status: projectData.status as 'waiting' | 'feedback' | 'approved',
          expiresAt: projectData.expiration_date,
          createdAt: projectData.created_at,
          previews: versions
        });
        
        // Log preview access
        try {
          await supabase.from('access_logs').insert({
            preview_id: projectId,
            user_email: 'anonymous@user.com',
            access_method: 'direct_access',
            ip_address: 'not-tracked'
          });
        } catch (logError) {
          console.error("Error logging access:", logError);
          // Non-blocking error, continue with access
        }
      } catch (error) {
        console.error(`Error loading project ${projectId}:`, error);
        
        // Fallback to mock data if project not found anywhere
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
              fileId: '1H62ylCwQYJ23BLpygtvNmCgwTDcHX6Cl',
              recommended: true
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
    };
    
    loadProject();
  }, [projectId, getProjectById, audioFiles]);
  
  // Update project status function
  const updateProjectStatus = async (newStatus: 'approved' | 'feedback', comments: string) => {
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
      
      const updated = await updateProject(projectId, updates);
      
      if (updated) {
        // Also update directly in Supabase
        try {
          const { error } = await supabase
            .from('preview_projects')
            .update({
              status: newStatus,
              feedback: comments,
              last_activity_date: new Date()
            })
            .eq('id', projectId);
            
          if (error) {
            console.error(`Error updating project ${projectId} in Supabase:`, error);
          }
          
          // Add to project history
          await supabase.from('project_history').insert({
            project_id: projectId,
            action: historyAction,
            details: {
              message: comments || 'Sem comentários adicionais',
              status: newStatus
            }
          });
        } catch (err) {
          console.error(`Error updating project ${projectId} in Supabase:`, err);
        }
        
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

export type { PreviewProject, MusicPreview };
