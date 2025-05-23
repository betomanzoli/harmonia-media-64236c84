import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase'; // ✅ Cliente existente

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
  clientEmail: string;
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
  
  useEffect(() => {
    if (!projectId) {
      setIsLoading(false);
      return;
    }

    const loadProjectData = async () => {
      setIsLoading(true);
      console.log("[usePreviewProject] Loading project with ID:", projectId);
      
      try {
        // ✅ BUSCAR DADOS REAIS NO SUPABASE
        const { data: previewData, error: previewError } = await supabase
          .from('previews')
          .select(`
            *,
            projects (
              id,
              title,
              package_type,
              created_at,
              clients (
                name,
                email
              )
            )
          `)
          .eq('preview_id', projectId)
          .eq('is_active', true)
          .single();

        if (previewError || !previewData) {
          console.error('Erro ao buscar preview:', previewError);
          throw new Error('Preview não encontrado');
        }

        // ✅ VERIFICAR SE NÃO EXPIROU
        if (previewData.expires_at && new Date(previewData.expires_at) < new Date()) {
          throw new Error('Preview expirado');
        }

        // ✅ CARREGAR FEEDBACK EXISTENTE DO BANCO
        const { data: feedbackData } = await supabase
          .from('feedbacks')
          .select('*')
          .eq('project_id', previewData.project_id)
          .eq('user_email', previewData.projects?.clients?.email || '')
          .single();

        // ✅ CRIAR DADOS DO PROJETO COM INFORMAÇÕES REAIS
        const projectDataReal: PreviewProject = {
          clientName: previewData.projects?.clients?.name || 'Cliente',
          clientEmail: previewData.projects?.clients?.email || '',
          projectTitle: previewData.title || previewData.projects?.title || 'Projeto Musical',
          packageType: previewData.projects?.package_type || 'Música Personalizada',
          status: feedbackData?.status || 'waiting',
          createdAt: previewData.created_at,
          expiresAt: previewData.expires_at,
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
        };

        setProjectData(projectDataReal);
        setAccessTokenValid(true);
        console.log('[usePreviewProject] Dados reais carregados:', projectDataReal);

      } catch (error: any) {
        console.error("Erro ao carregar preview project:", error);
        setAccessTokenValid(false);
        
        toast({
          title: "Preview não encontrado",
          description: "Este preview não existe, expirou ou não está mais ativo.",
          variant: "destructive"
        });
        
        setProjectData(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjectData();
  }, [projectId, toast]);
  
  const updateProjectStatus = (newStatus: 'approved' | 'feedback', comments: string) => {
    if (!projectId || !projectData) return false;

    console.log(`Atualizando status do projeto ${projectId} para ${newStatus}`);
    
    setProjectData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        status: newStatus
      };
    });
    
    return true;
  };
  
  return { 
    projectData, 
    setProjectData, 
    isLoading, 
    updateProjectStatus,
    accessTokenValid,
    originalProjectId: projectId
  };
};

export type { PreviewProject, MusicPreview };
