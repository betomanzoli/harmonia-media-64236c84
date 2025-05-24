import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

export interface MusicPreview {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  fileId?: string;
  recommended?: boolean;
}

export interface PreviewProject {
  clientName: string;
  projectTitle: string;
  status: 'waiting' | 'feedback' | 'approved';
  previews: MusicPreview[];
  packageType?: string;
  createdAt?: string;
  expiresAt?: string;
  useGoogleDrive?: boolean;
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
          clientName: data.client_name,
          projectTitle: data.title,
          status: data.status,
          previews: data.versions,
          packageType: data.package_type,
          createdAt: data.created_at,
          expiresAt: data.expires_at,
          useGoogleDrive: data.use_google_drive
        });

      } catch (error) {
        console.error('Error loading project:', error);
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

  const updateProjectStatus = async (newStatus: 'approved' | 'feedback', comments: string): Promise<boolean> => {
    if (!projectId) return false;

    try {
      await supabase
        .from('projects')
        .update({ status: newStatus })
        .eq('id', projectId);
      return true;
    } catch (error) {
      console.error('Error updating status:', error);
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
