// src/hooks/previews/usePreviewProject.ts
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

export const usePreviewProject = (projectId: string | undefined) => {
  const { toast } = useToast();
  const [projectData, setProjectData] = useState<PreviewProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accessTokenValid, setAccessTokenValid] = useState(true);

  // Função de sincronização com Supabase
  const syncProject = async (id: string) => {
    try {
      // 1. Tentar localStorage
      const localData = localStorage.getItem(`project_${id}`);
      if (localData) return JSON.parse(localData);

      // 2. Buscar do Supabase
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      // 3. Atualizar localStorage
      localStorage.setItem(`project_${id}`, JSON.stringify(data));
      return data;

    } catch (error) {
      console.error('Erro de sincronização:', error);
      return null;
    }
  };

  useEffect(() => {
    if (!projectId) {
      setIsLoading(false);
      return;
    }

    const loadProject = async () => {
      setIsLoading(true);
      try {
        const data = await syncProject(projectId);
        
        if (data) {
          setProjectData({
            clientName: data.client_name,
            projectTitle: data.title,
            status: data.status,
            previews: data.versions.map((v: any) => ({
              id: v.id,
              title: v.name,
              audioUrl: v.audio_url,
              description: v.description
            }))
          });
        } else {
          setAccessTokenValid(false);
        }
      } catch (error) {
        toast({
          title: "Erro de conexão",
          description: "Falha ao carregar projeto",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [projectId, toast]);

  // Função corrigida com tipo Promise<boolean>
  const updateProjectStatus = async (
    newStatus: 'approved' | 'feedback', 
    comments: string
  ): Promise<boolean> => {
    try {
      await supabase
        .from('projects')
        .update({ status: newStatus })
        .eq('id', projectId);
      
      return true;
    } catch (error) {
      console.error('Erro na atualização:', error);
      return false;
    }
  };

  return { 
    projectData, 
    setProjectData, 
    isLoading,
    updateProjectStatus,
    accessTokenValid 
  };
};
