
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface MusicPreview {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  fileId?: string;
  recommended?: boolean;
}

export interface PreviewProject {
  client_name: string;
  project_title: string;
  status: 'waiting' | 'feedback' | 'approved';
  previews: MusicPreview[];
  package_type?: string;
  created_at?: string;
  expires_at?: string;
  use_google_drive?: boolean;
}

export const usePreviewProject = (projectId?: string) => {
  const { toast } = useToast();
  const [projectData, setProjectData] = useState<PreviewProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accessTokenValid, setAccessTokenValid] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('projects')
          .select(`
            client_name,
            title,
            status,
            versions,
            package_type,
            created_at,
            expires_at,
            use_google_drive
          `)
          .eq('id', projectId)
          .single();

        if (error) throw error;

        setProjectData({
          client_name: data.client_name as string,
          project_title: data.title as string,
          status: data.status as 'waiting' | 'feedback' | 'approved',
          previews: Array.isArray(data.versions) ? data.versions : [],
          package_type: data.package_type as string,
          created_at: data.created_at as string,
          expires_at: data.expires_at as string,
          use_google_drive: data.use_google_drive as boolean
        });

      } catch (error) {
        console.error('Erro ao carregar projeto:', error);
        toast({
          title: "Erro de carregamento",
          description: "Não foi possível carregar o projeto",
          variant: "destructive"
        });
        setAccessTokenValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [projectId, toast]);

  const updateProjectStatus = async (
    newStatus: 'approved' | 'feedback', 
    comments: string
  ): Promise<boolean> => {
    if (!projectId) return false;

    try {
      await supabase
        .from('projects')
        .update({ 
          status: newStatus,
          feedback: comments,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);

      setProjectData(prev => prev ? {...prev, status: newStatus} : null);
      return true;
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      return false;
    }
  };

  return { 
    projectData, 
    setProjectData, 
    isLoading,
    updateProjectStatus,
    accessTokenValid,
    originalProjectId: projectId || ''
  };
};
