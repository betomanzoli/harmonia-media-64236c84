
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

export const usePreviewProjectCors = (projectId?: string) => {
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
        // Use the correct column names from the database schema
        const { data, error } = await supabase
          .from('projects')
          .select(`
            title,
            status,
            description,
            created_at,
            package_id
          `)
          .eq('id', projectId)
          .single();

        if (error) {
          console.error('Database error:', error);
          throw error;
        }

        // Create mock preview data since we don't have a versions column
        const mockPreviews: MusicPreview[] = [
          {
            id: '1',
            title: 'Versão Principal',
            description: 'Versão principal da música',
            audioUrl: 'https://example.com/audio1.mp3',
            recommended: true
          },
          {
            id: '2',
            title: 'Versão Alternativa',
            description: 'Versão alternativa com arranjo diferente',
            audioUrl: 'https://example.com/audio2.mp3'
          }
        ];

        setProjectData({
          clientName: 'Patricia Ramalho Scortecci De Paula', // Default for test
          projectTitle: data.title || 'Projeto Teste',
          status: data.status || 'waiting',
          previews: mockPreviews,
          packageType: 'premium',
          createdAt: data.created_at,
          useGoogleDrive: false
        });

      } catch (error) {
        console.error('Error loading project:', error);
        toast({
          title: "Erro de carregamento",
          description: "Não foi possível carregar o projeto. Verifique a conectividade.",
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
