
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

export const usePreviewProject = (projectId: string | undefined) => {
  const { toast } = useToast();
  const [projectData, setProjectData] = useState<PreviewProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!projectId) {
      setIsLoading(false);
      return;
    }

    const fetchProjectData = async () => {
      setIsLoading(true);
      console.log("[usePreviewProject] Fetching project from Supabase:", projectId);
      
      try {
        // First fetch the project
        const { data: project, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();

        if (projectError) {
          console.error('Error fetching project:', projectError);
          toast({
            title: "Erro ao carregar projeto",
            description: "Não foi possível carregar os dados do projeto.",
            variant: "destructive"
          });
          setProjectData(null);
          return;
        }

        if (!project) {
          console.error('Project not found:', projectId);
          toast({
            title: "Projeto não encontrado",
            description: "O projeto solicitado não foi encontrado.",
            variant: "destructive"
          });
          setProjectData(null);
          return;
        }

        // Then fetch the project versions separately
        const { data: versions, error: versionsError } = await supabase
          .from('project_versions')
          .select('*')
          .eq('project_id', projectId);

        if (versionsError) {
          console.error('Error fetching project versions:', versionsError);
          // Continue without versions if there's an error
        }

        // Transform project versions to previews format
        const previews: MusicPreview[] = (versions || []).map(version => ({
          id: version.version_id,
          title: version.name,
          description: version.description || '',
          audioUrl: version.audio_url || `https://drive.google.com/uc?export=download&id=${version.file_id}`,
          fileId: version.file_id,
          recommended: version.recommended
        }));

        // Create project data from Supabase response
        setProjectData({
          clientName: project.client_name || 'Cliente',
          projectTitle: project.title,
          packageType: project.package_type,
          status: project.status as 'waiting' | 'feedback' | 'approved',
          expiresAt: project.expires_at,
          createdAt: project.created_at,
          previews
        });

        console.log('Project loaded from Supabase:', {
          id: project.id,
          client_name: project.client_name,
          title: project.title,
          status: project.status
        });
        
      } catch (error) {
        console.error("Error loading preview project:", error);
        toast({
          title: "Erro ao carregar prévia",
          description: "Houve um erro ao carregar os dados da prévia.",
          variant: "destructive"
        });
        setProjectData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId, toast]);
  
  // Update project status function
  const updateProjectStatus = async (newStatus: 'approved' | 'feedback', comments: string) => {
    if (!projectId || !projectData) return false;

    console.log(`Updating project ${projectId} status to ${newStatus}`);
    
    try {
      const { error } = await supabase
        .from('projects')
        .update({ 
          status: newStatus,
          feedback: comments,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);

      if (error) {
        console.error('Error updating project status:', error);
        return false;
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
    } catch (error) {
      console.error('Error updating project status:', error);
      return false;
    }
  };
  
  return { 
    projectData, 
    setProjectData, 
    isLoading, 
    updateProjectStatus
  };
};

export type { PreviewProject, MusicPreview };
