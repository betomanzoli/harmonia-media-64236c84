import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface PreviewVersion {
  id: string;
  title: string;
  audio_url: string;
  description?: string;
  is_selected?: boolean;
  created_at: string;
}

interface PreviewProject {
  id: string;
  title: string;
  description: string;
  status: string;
  client_name: string;
  package_type: string;
  created_at: string;
  expires_at: string;
  is_active: boolean;
  versions: PreviewVersion[];
}

export const usePreviewProject = (projectId: string) => {
  const [projectData, setProjectData] = useState<PreviewProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('[DEBUG] Carregando projeto:', projectId);

        // Buscar dados do preview
        const { data: previewData, error: previewError } = await supabase
          .from('previews')
          .select(`
            preview_id,
            title,
            description,
            is_active,
            expires_at,
            created_at,
            project_id
          `)
          .eq('preview_id', projectId)
          .single();

        if (previewError) {
          console.error('[ERROR] Erro ao buscar preview:', previewError);
          throw new Error('Preview não encontrado');
        }

        // Buscar dados do projeto relacionado
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select(`
            id,
            title,
            status,
            package_type,
            client_id,
            clients (
              name
            )
          `)
          .eq('id', previewData.project_id)
          .single();

        if (projectError) {
          console.error('[ERROR] Erro ao buscar projeto:', projectError);
          throw new Error('Projeto não encontrado');
        }

        // Buscar versões de áudio (mockadas por enquanto)
        const mockVersions: PreviewVersion[] = [
          {
            id: '1',
            title: 'Versão 1 - Acústica',
            audio_url: '/api/placeholder-audio/version1.mp3',
            description: 'Versão mais suave com instrumentos acústicos',
            is_selected: false,
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            title: 'Versão 2 - Completa',
            audio_url: '/api/placeholder-audio/version2.mp3',
            description: 'Versão com arranjo completo e todos os instrumentos',
            is_selected: true,
            created_at: new Date().toISOString()
          }
        ];

        // Se for pacote profissional ou premium, adicionar mais versões
        if (projectData.package_type === 'profissional') {
          mockVersions.push(
            {
              id: '3',
              title: 'Versão 3 - Instrumental',
              audio_url: '/api/placeholder-audio/version3.mp3',
              description: 'Versão instrumental sem vocal',
              is_selected: false,
              created_at: new Date().toISOString()
            },
            {
              id: '4',
              title: 'Versão 4 - Eletrônica',
              audio_url: '/api/placeholder-audio/version4.mp3',
              description: 'Versão com elementos eletrônicos',
              is_selected: false,
              created_at: new Date().toISOString()
            },
            {
              id: '5',
              title: 'Versão 5 - Clássica',
              audio_url: '/api/placeholder-audio/version5.mp3',
              description: 'Versão com arranjo clássico',
              is_selected: false,
              created_at: new Date().toISOString()
            }
          );
        }

        if (projectData.package_type === 'premium') {
          mockVersions.push(
            {
              id: '3',
              title: 'Versão 3 - Instrumental',
              audio_url: '/api/placeholder-audio/version3.mp3',
              description: 'Versão instrumental sem vocal',
              is_selected: false,
              created_at: new Date().toISOString()
            },
            {
              id: '4',
              title: 'Versão 4 - Eletrônica',
              audio_url: '/api/placeholder-audio/version4.mp3',
              description: 'Versão com elementos eletrônicos',
              is_selected: false,
              created_at: new Date().toISOString()
            },
            {
              id: '5',
              title: 'Versão 5 - Orquestral',
              audio_url: '/api/placeholder-audio/version5.mp3',
              description: 'Versão com arranjo orquestral',
              is_selected: false,
              created_at: new Date().toISOString()
            },
            {
              id: '6',
              title: 'Versão 6 - Acústica Minimalista',
              audio_url: '/api/placeholder-audio/version6.mp3',
              description: 'Versão minimalista com poucos instrumentos',
              is_selected: false,
              created_at: new Date().toISOString()
            },
            {
              id: '7',
              title: 'Versão 7 - Jazz Fusion',
              audio_url: '/api/placeholder-audio/version7.mp3',
              description: 'Versão com elementos de jazz',
              is_selected: false,
              created_at: new Date().toISOString()
            },
            {
              id: '8',
              title: 'Versão 8 - Rock Moderno',
              audio_url: '/api/placeholder-audio/version8.mp3',
              description: 'Versão com elementos de rock moderno',
              is_selected: false,
              created_at: new Date().toISOString()
            }
          );
        }

        // Montar objeto final
        const finalProject: PreviewProject = {
          id: previewData.preview_id,
          title: previewData.title,
          description: previewData.description || '',
          status: projectData.status,
          client_name: projectData.clients?.name || 'Cliente',
          package_type: projectData.package_type,
          created_at: previewData.created_at,
          expires_at: previewData.expires_at,
          is_active: previewData.is_active,
          versions: mockVersions
        };

        console.log('[SUCCESS] Projeto carregado:', finalProject);
        setProjectData(finalProject);

      } catch (error) {
        console.error('[ERROR] Erro ao carregar projeto:', error);
        setError(error instanceof Error ? error.message : 'Erro desconhecido');
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  const selectVersion = async (versionId: string) => {
    if (!projectData) return;

    try {
      // Atualizar localmente primeiro
      const updatedVersions = projectData.versions.map(version => ({
        ...version,
        is_selected: version.id === versionId
      }));

      setProjectData({
        ...projectData,
        versions: updatedVersions
      });

      // Aqui você salvaria no backend qual versão foi selecionada
      console.log('[DEBUG] Versão selecionada:', versionId);

    } catch (error) {
      console.error('[ERROR] Erro ao selecionar versão:', error);
    }
  };

  const submitFeedback = async (versionId: string, feedback: string, rating: number) => {
    try {
      console.log('[DEBUG] Enviando feedback:', { versionId, feedback, rating });

      // Salvar feedback no Supabase
      const { error } = await supabase
        .from('project_feedback')
        .insert({
          project_id: projectData?.id,
          version_id: versionId,
          feedback_text: feedback,
          rating: rating,
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      console.log('[SUCCESS] Feedback enviado com sucesso');
      return true;

    } catch (error) {
      console.error('[ERROR] Erro ao enviar feedback:', error);
      return false;
    }
  };

  return {
    projectData,
    isLoading,
    error,
    selectVersion,
    submitFeedback
  };
};

export default usePreviewProject;
