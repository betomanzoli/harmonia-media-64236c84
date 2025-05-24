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
  const [accessTokenValid, setAccessTokenValid] = useState(true);
  const [originalProjectId] = useState(projectId);

  // Novo: Carregar projeto do Supabase se não encontrar localmente
  const loadFromSupabase = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Erro ao buscar projeto no Supabase:', error);
      return null;
    }
  };

  // Novo: Sincronizar dados entre localStorage e Supabase
  const syncProjectData = async (id: string) => {
    try {
      // 1. Tentar localStorage primeiro
      const localData = localStorage.getItem(`project_${id}`);
      if (localData) return JSON.parse(localData);

      // 2. Buscar do Supabase se não encontrar
      const supabaseData = await loadFromSupabase(id);
      if (supabaseData) {
        // 3. Salvar no localStorage para próximas visitas
        localStorage.setItem(`project_${id}`, JSON.stringify(supabaseData));
        return supabaseData;
      }

      return null;
    } catch (error) {
      console.error('Erro na sincronização de dados:', error);
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
        // Etapa 1: Buscar dados sincronizados
        const syncedData = await syncProjectData(projectId);
        
        // Etapa 2: Processar dados
        if (syncedData) {
          const previews: MusicPreview[] = syncedData.versionsList?.map((v: any) => ({
            id: v.id,
            title: v.name || `Versão ${v.id}`,
            description: v.description || '',
            audioUrl: v.audio_url || `https://drive.google.com/uc?export=download&id=${v.fileId}`,
            fileId: v.fileId,
            recommended: v.recommended
          })) || [];

          setProjectData({
            clientName: syncedData.client_name,
            projectTitle: syncedData.title,
            status: syncedData.status,
            previews,
            packageType: syncedData.package_type,
            createdAt: syncedData.created_at,
            expiresAt: syncedData.expires_at
          });
          
          console.log(`Projeto carregado: ${projectId}`);
        } else {
          // Fallback para dados mockados
          setProjectData({
            clientName: 'Cliente Exemplo',
            projectTitle: 'Projeto Demo',
            status: 'waiting',
            previews: [...], // Manter array de fallback
            expiresAt: new Date(Date.now() + 12096e5).toISOString()
          });
          
          setAccessTokenValid(false);
          console.warn(`Projeto ${projectId} não encontrado, usando dados demo`);
        }
      } catch (error) {
        console.error("Erro crítico ao carregar projeto:", error);
        setAccessTokenValid(false);
        toast({
          title: "Erro de conexão",
          description: "Não foi possível carregar os dados do projeto",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [projectId, toast]);

  // Função para atualizar status (agora persiste no Supabase)
  const updateProjectStatus = async (newStatus: 'approved' | 'feedback', comments: string) => {
    if (!projectId || !projectData) return false;

    try {
      // Atualizar no Supabase
      const { error } = await supabase
        .from('projects')
        .update({ 
          status: newStatus,
          feedback: comments,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);

      if (error) throw error;

      // Atualizar localStorage
      const updatedData = { ...projectData, status: newStatus };
      localStorage.setItem(`project_${projectId}`, JSON.stringify(updatedData));
      setProjectData(updatedData);

      return true;
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast({
        title: "Erro de atualização",
        description: "Não foi possível salvar as alterações",
        variant: "destructive"
      });
      return false;
    }
  };

  return { 
    projectData, 
    setProjectData, 
    isLoading, 
    updateProjectStatus,
    accessTokenValid,
    originalProjectId
  };
};
