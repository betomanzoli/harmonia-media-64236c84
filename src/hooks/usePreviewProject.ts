
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useGoogleDriveAudio } from '@/hooks/audio/useGoogleDriveAudio';
import { usePreviewProjects } from '@/hooks/admin/usePreviewProjects';
import { supabase } from '@/lib/supabase';
import { useSearchParams } from 'react-router-dom';

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
  const [accessTokenValid, setAccessTokenValid] = useState(true);
  const [originalProjectId] = useState(projectId);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  // Log key information for debugging
  useEffect(() => {
    if (projectId) {
      console.log(`[usePreviewProject] Inicializando com projectId: ${projectId}, token: ${token ? 'presente' : 'ausente'}`);
      
      // Check for existing feedback in localStorage
      try {
        const feedbackKeys = Object.keys(localStorage).filter(key => 
          key.startsWith(`preview_feedback_`)
        );
        
        if (feedbackKeys.length > 0) {
          console.log(`Encontradas ${feedbackKeys.length} entradas de feedback salvas`);
        }
      } catch (e) {
        console.warn('Impossível verificar localStorage para feedback', e);
      }
    }
  }, [projectId, token]);
  
  useEffect(() => {
    if (!projectId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    console.log("[usePreviewProject] Carregando projeto com ID:", projectId);
    
    const loadProjectData = async () => {
      try {
        // If we have a token, try to validate it with the edge function
        if (token) {
          console.log("Validando token via função edge");
          try {
            const response = await fetch('https://ivueqxyuflxsiecqvmgt.supabase.co/functions/v1/validate-preview-token', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                token: token,
                preview_id: projectId
              })
            });
            
            const data = await response.json();
            
            if (data.valid && data.project) {
              console.log("Token válido, projeto carregado:", data.project);
              
              // Get project versions
              const { data: versionsData, error: versionsError } = await supabase
                .from('project_versions')
                .select('*')
                .eq('project_id', projectId)
                .order('created_at', { ascending: false });
                
              if (versionsError) {
                console.error("Erro ao carregar versões:", versionsError);
              }
              
              // Create previews from versions
              const previews: MusicPreview[] = (versionsData || []).map(v => ({
                id: v.version_id,
                title: v.name || `Versão ${v.version_id}`,
                description: v.description || '',
                audioUrl: v.audio_url || `https://drive.google.com/uc?export=download&id=${v.file_id}`,
                fileId: v.file_id,
                recommended: v.recommended
              }));
              
              // If no versions found, use fallbacks
              if (previews.length === 0) {
                console.log("Nenhuma versão encontrada, usando versões de exemplo");
                
                const fallbackPreviews = [
                  {
                    id: 'v1',
                    title: 'Versão Acústica',
                    description: 'Versão suave com violão e piano',
                    audioUrl: 'https://drive.google.com/uc?export=download&id=1H62ylCwQYJ23BLpygtvNmCgwTDcHX6Cl',
                    fileId: '1H62ylCwQYJ23BLpygtvNmCgwTDcHX6Cl'
                  },
                  {
                    id: 'v2',
                    title: 'Versão Orquestral',
                    description: 'Arranjo completo com cordas e metais',
                    audioUrl: 'https://drive.google.com/uc?export=download&id=11c6JahRd5Lx0iKCL_gHZ0zrZ3LFBJ47a',
                    fileId: '11c6JahRd5Lx0iKCL_gHZ0zrZ3LFBJ47a'
                  }
                ];
                
                setProjectData({
                  clientName: data.project.client_name || 'Cliente',
                  projectTitle: data.project.project_title || 'Música Personalizada',
                  packageType: data.project.package_type,
                  status: data.project.status as 'waiting' | 'feedback' | 'approved',
                  expiresAt: data.project.expiration_date,
                  createdAt: data.project.created_at,
                  previews: fallbackPreviews
                });
              } else {
                console.log(`${previews.length} versões encontradas`);
                
                setProjectData({
                  clientName: data.project.client_name || 'Cliente',
                  projectTitle: data.project.project_title || 'Música Personalizada',
                  packageType: data.project.package_type,
                  status: data.project.status as 'waiting' | 'feedback' | 'approved',
                  expiresAt: data.project.expiration_date,
                  createdAt: data.project.created_at,
                  previews: previews
                });
              }
              
              setAccessTokenValid(true);
              setIsLoading(false);
              return;
            } else {
              console.error("Token inválido ou expirado:", data.error);
              throw new Error(data.error || "Token inválido");
            }
          } catch (tokenError) {
            console.error("Erro ao validar token:", tokenError);
            // Continue to try other methods
          }
        }
        
        // Try to get project from admin projects
        const adminProject = getProjectById(projectId) as ExtendedProjectItem;
        
        if (adminProject) {
          console.log('[usePreviewProject] Projeto encontrado no sistema admin:', adminProject);
          
          // Create previews from project versions list
          const previews: MusicPreview[] = adminProject.versionsList?.map(v => ({
            id: v.id,
            title: v.name || `Versão ${v.id}`,
            description: v.description || '',
            audioUrl: `https://drive.google.com/uc?export=download&id=${v.fileId || audioFiles[0]?.id || '1H62ylCwQYJ23BLpygtvNmCgwTDcHX6Cl'}`,
            fileId: v.fileId,
            recommended: v.recommended
          })) || [];
          
          // If no previews but versionsList exists, create from versionsList
          if (previews.length === 0 && adminProject.versionsList && adminProject.versionsList.length > 0) {
            for (let i = 0; i < adminProject.versionsList.length; i++) {
              const version = adminProject.versionsList[i];
              const fileId = version.fileId || audioFiles[i % audioFiles.length]?.id || '1H62ylCwQYJ23BLpygtvNmCgwTDcHX6Cl';
              
              previews.push({
                id: version.id || `v${i+1}`,
                title: version.name || `Versão ${i+1}`,
                description: version.description || 'Versão para aprovação',
                audioUrl: `https://drive.google.com/uc?export=download&id=${fileId}`,
                fileId: fileId,
                recommended: version.recommended || i === 0 // Mark first version as recommended
              });
            }
          }
          
          // If there are no versions yet, create fallback previews only for demo purposes
          const fallbackPreviews = [
            {
              id: 'v1',
              title: 'Versão Acústica',
              description: 'Versão suave com violão e piano',
              audioUrl: 'https://drive.google.com/uc?export=download&id=1H62ylCwQYJ23BLpygtvNmCgwTDcHX6Cl',
              fileId: '1H62ylCwQYJ23BLpygtvNmCgwTDcHX6Cl'
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

          // Create project data
          setProjectData({
            clientName: adminProject.clientName || 'Cliente',
            projectTitle: adminProject.title || adminProject.packageType || 'Música Personalizada',
            packageType: adminProject.packageType || 'Música Personalizada',
            status: adminProject.status as 'waiting' | 'feedback' | 'approved',
            expiresAt: adminProject.expirationDate,
            createdAt: adminProject.createdAt,
            previews: previews.length > 0 ? previews : (adminProject.id === 'P0001' ? [] : fallbackPreviews)
          });
          
          // Record access in logs
          console.log(`Cliente acessando prévia: ${projectId}, data: ${new Date().toISOString()}`);
          setAccessTokenValid(true);
        } else {
          console.log(`Projeto com ID ${projectId} não encontrado no sistema admin`);
          
          // Try to get from Supabase
          const { data: projectData, error: projectError } = await supabase
            .from('preview_projects')
            .select('*')
            .eq('id', projectId)
            .maybeSingle();
            
          if (!projectError && projectData) {
            console.log("Projeto encontrado no Supabase:", projectData);
            
            // Get versions from Supabase
            const { data: versionsData, error: versionsError } = await supabase
              .from('project_versions')
              .select('*')
              .eq('project_id', projectId)
              .order('created_at', { ascending: false });
              
            if (versionsError) {
              console.error("Erro ao carregar versões:", versionsError);
            }
            
            // Create previews from versions
            const previews: MusicPreview[] = (versionsData || []).map(v => ({
              id: v.version_id,
              title: v.name || `Versão ${v.version_id}`,
              description: v.description || '',
              audioUrl: v.audio_url || `https://drive.google.com/uc?export=download&id=${v.file_id}`,
              fileId: v.file_id,
              recommended: v.recommended
            }));
            
            // If no versions found, use fallbacks
            if (previews.length === 0) {
              console.log("Nenhuma versão encontrada, usando versões de exemplo");
              
              const fallbackPreviews = [
                {
                  id: 'v1',
                  title: 'Versão Acústica',
                  description: 'Versão suave com violão e piano',
                  audioUrl: 'https://drive.google.com/uc?export=download&id=1H62ylCwQYJ23BLpygtvNmCgwTDcHX6Cl',
                  fileId: '1H62ylCwQYJ23BLpygtvNmCgwTDcHX6Cl'
                },
                {
                  id: 'v2',
                  title: 'Versão Orquestral',
                  description: 'Arranjo completo com cordas e metais',
                  audioUrl: 'https://drive.google.com/uc?export=download&id=11c6JahRd5Lx0iKCL_gHZ0zrZ3LFBJ47a',
                  fileId: '11c6JahRd5Lx0iKCL_gHZ0zrZ3LFBJ47a'
                }
              ];
              
              setProjectData({
                clientName: projectData.client_name || 'Cliente',
                projectTitle: projectData.project_title || 'Música Personalizada',
                packageType: projectData.package_type,
                status: projectData.status as 'waiting' | 'feedback' | 'approved',
                expiresAt: projectData.expiration_date,
                createdAt: projectData.created_at,
                previews: fallbackPreviews
              });
            } else {
              console.log(`${previews.length} versões encontradas`);
              
              setProjectData({
                clientName: projectData.client_name || 'Cliente',
                projectTitle: projectData.project_title || 'Música Personalizada',
                packageType: projectData.package_type,
                status: projectData.status as 'waiting' | 'feedback' | 'approved',
                expiresAt: projectData.expiration_date,
                createdAt: projectData.created_at,
                previews: previews
              });
            }
            
            setAccessTokenValid(true);
          } else {
            console.error("Erro ao buscar projeto do Supabase:", projectError);
            
            // Fallback to mock data if project not found
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
                  fileId: '1H62ylCwQYJ23BLpygtvNmCgwTDcHX6Cl'
                },
                {
                  id: 'v2',
                  title: 'Versão Orquestral',
                  description: 'Arranjo completo com cordas e metais',
                  audioUrl: 'https://drive.google.com/uc?export=download&id=11c6JahRd5Lx0iKCL_gHZ0zrZ3LFBJ47a',
                  fileId: '11c6JahRd5Lx0iKCL_gHZ0zrZ3LFBJ47a'
                }
              ]
            });
            
            setAccessTokenValid(false);
            
            // Show a toast if the project wasn't found, but only if we're not in a testing mode or iframe
            if (!window.location.href.includes('localhost') && !window.location.href.includes('127.0.0.1')) {
              toast({
                title: "Aviso de prévia",
                description: "Você está acessando uma versão de demonstração. Contate o administrador.",
                variant: "default"
              });
            }
          }
        }
      } catch (error) {
        console.error("Erro ao carregar projeto de prévia:", error);
        setAccessTokenValid(false);
        
        // Use um projeto de fallback mesmo em caso de erro
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
              fileId: '1H62ylCwQYJ23BLpygtvNmCgwTDcHX6Cl'
            },
            {
              id: 'v2',
              title: 'Versão Orquestral',
              description: 'Arranjo completo com cordas e metais',
              audioUrl: 'https://drive.google.com/uc?export=download&id=11c6JahRd5Lx0iKCL_gHZ0zrZ3LFBJ47a',
              fileId: '11c6JahRd5Lx0iKCL_gHZ0zrZ3LFBJ47a'
            }
          ]
        });
        
        toast({
          title: "Erro ao carregar prévia",
          description: "Houve um erro ao carregar os dados da prévia.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProjectData();
  }, [projectId, getProjectById, audioFiles, toast, token]);
  
  // Update project status function - enhanced with better history handling
  const updateProjectStatus = async (newStatus: 'approved' | 'feedback', comments: string) => {
    if (!projectId || !projectData) return false;

    console.log(`Atualizando status do projeto ${projectId} para ${newStatus}`);
    console.log(`Feedback do cliente: ${comments}`);
    
    try {
      // If we have a token, use the edge function
      if (token) {
        console.log("Enviando status via token");
        const response = await fetch(`https://ivueqxyuflxsiecqvmgt.supabase.co/functions/v1/submit-preview-feedback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            preview_id: projectId,
            feedback: comments,
            status: newStatus,
            token: token
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Falha ao atualizar status");
        }

        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || "Falha ao atualizar status");
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
      
      // Save feedback to localStorage for persistence between page reloads
      try {
        // Store global status
        localStorage.setItem(`preview_status_${projectId}`, newStatus);
        // Store last feedback
        localStorage.setItem(`preview_last_feedback_${projectId}`, comments || '');
      } catch (e) {
        console.warn('Erro ao salvar feedback no localStorage', e);
      }
      
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
        
        // Update the project in admin system
        try {
          const updated = await updateProject(projectId, updates);
          console.log(`Resultado da atualização do projeto: ${updated ? 'Sucesso' : 'Falha'}`);
          
          if (!updated) {
            // Try to update directly in Supabase
            const { error } = await supabase
              .from('preview_projects')
              .update({
                status: newStatus,
                feedback: comments,
                last_activity_date: new Date().toISOString()
              })
              .eq('id', projectId);
              
            if (error) {
              console.error("Erro ao atualizar projeto no Supabase:", error);
              throw error;
            }
            
            // Add history entry
            await supabase
              .from('project_history')
              .insert({
                project_id: projectId,
                action: historyEntry.action,
                details: historyEntry.data
              });
          }
        } catch (error) {
          console.error('Erro ao atualizar status do projeto:', error);
          throw error;
        }
        
        // Update local state immediately for responsive UI
        setProjectData(prev => {
          if (!prev) return null;
          return {
            ...prev,
            status: newStatus
          };
        });
        
        return true;
      }
    } catch (error) {
      console.error("Erro ao atualizar status do projeto:", error);
      return false;
    }
    
    return false;
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

export type { PreviewProject, MusicPreview };
