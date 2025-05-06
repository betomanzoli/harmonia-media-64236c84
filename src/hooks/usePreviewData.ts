
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { getProjectIdFromPreviewLink, isValidEncodedPreviewLink } from '@/utils/previewLinkUtils';

interface ProjectVersion {
  id: string;
  name: string;
  description?: string;
  audioUrl: string;
  recommended?: boolean;
  final?: boolean;
  createdAt?: string;
}

interface ProjectData {
  id: string;
  clientName: string;
  clientEmail?: string;
  projectTitle: string;
  packageType: string;
  status: 'waiting' | 'feedback' | 'approved';
  createdAt: string;
  lastActivityDate: string;
  expirationDate?: string;
  versionsList: ProjectVersion[];
  previews?: ProjectVersion[]; // Add this line to fix the type error
  versions: number;
  feedback?: string;
  feedbackHistory: any[];
  history: any[];
}

export const usePreviewData = (previewId: string | undefined) => {
  const [actualProjectId, setActualProjectId] = useState<string | null>(null);
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState<'supabase' | 'localStorage' | 'none'>('none');
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchData = async () => {
      if (!previewId) {
        setIsLoading(false);
        return;
      }

      console.log(`🔍 usePreviewData: Buscando dados para previewId: ${previewId}`);
      
      // Check if this is an encoded link or direct ID
      const isEncodedLink = isValidEncodedPreviewLink(previewId);
      console.log("🔑 É um link codificado?", isEncodedLink ? "Sim" : "Não");
      
      // For admin users, support direct IDs
      const isAdmin = localStorage.getItem('admin_preview_access') === 'true';
      let projectId: string | null = null;
      
      if (isEncodedLink) {
        // Valid for both anonymous and admin users
        const decodedId = getProjectIdFromPreviewLink(previewId);
        console.log(`🔓 ID do projeto decodificado: ${decodedId}`);
        projectId = decodedId;
      } else if (isAdmin) {
        // Direct access for admins only
        console.log(`👑 Acesso direto de admin para o ID: ${previewId}`);
        projectId = previewId;
      } else {
        // Invalid link for non-admin users
        console.log("⛔ Acesso direto inválido para usuário não-admin");
        projectId = null;
      }
      
      setActualProjectId(projectId);
      
      if (!projectId) {
        console.log("❌ Nenhum ID válido de projeto, pulando carregamento de dados");
        setIsLoading(false);
        return;
      }
      
      // Load project data
      setIsLoading(true);
      
      try {
        // FIRST: Try Supabase (primary data source)
        console.log('🔍 Buscando projeto no Supabase...');
        let supabaseProjectData: ProjectData | null = null;
        
        try {
          // Fetch the project from Supabase
          const { data: projectFromSupabase, error } = await supabase
            .from('projects')
            .select(`
              id,
              title,
              description,
              client_id,
              status,
              package_id,
              created_at,
              updated_at,
              deadline,
              preview_code
            `)
            .eq('id', projectId)
            .maybeSingle();
          
          if (error) {
            console.error('❌ Erro ao buscar do Supabase:', error);
            console.log('⚠️ Tentando fallback para localStorage...');
          } else if (projectFromSupabase) {
            console.log('✅ Projeto encontrado no Supabase:', projectFromSupabase);
            
            // Fetch project files (versions)
            const { data: projectFiles, error: filesError } = await supabase
              .from('project_files')
              .select('*')
              .eq('project_id', projectId)
              .eq('file_type', 'preview');
              
            if (filesError) {
              console.error('❌ Erro ao buscar arquivos do projeto:', filesError);
            }
            
            // Get client info if available
            let clientName = 'Cliente';
            let clientEmail = '';
            
            if (projectFromSupabase.client_id) {
              try {
                // Try clients table first
                const { data: clientData } = await supabase
                  .from('clients')
                  .select('name, email')
                  .eq('id', projectFromSupabase.client_id)
                  .maybeSingle();
                  
                if (clientData) {
                  clientName = clientData.name || 'Cliente';
                  clientEmail = clientData.email || '';
                } else {
                  // Fallback to admin_users if client wasn't found
                  const { data: userData } = await supabase
                    .from('admin_users')
                    .select('name, email')
                    .eq('user_id', projectFromSupabase.client_id)
                    .maybeSingle();
                    
                  if (userData) {
                    clientName = userData.name || 'Cliente';
                    clientEmail = userData.email || '';
                  }
                }
              } catch (clientError) {
                console.error('❌ Erro ao buscar dados do cliente:', clientError);
              }
            }
            
            // Get package name safely
            let packageName = 'Música Personalizada';
            
            if (projectFromSupabase.package_id) {
              try {
                const { data: packageData } = await supabase
                  .from('packages')
                  .select('name')
                  .eq('id', projectFromSupabase.package_id)
                  .maybeSingle();
                  
                if (packageData && packageData.name) {
                  packageName = packageData.name;
                }
              } catch (packageError) {
                console.error('❌ Erro ao buscar dados do pacote:', packageError);
              }
            }
            
            // Fetch feedback history from project_history
            const { data: feedbackHistory, error: feedbackError } = await supabase
              .from('project_history')
              .select('*')
              .eq('project_id', projectId)
              .eq('event_type', 'feedback');
              
            if (feedbackError) {
              console.error('❌ Erro ao buscar histórico de feedback:', feedbackError);
            }
            
            // Fetch status history
            const { data: statusHistory, error: historyError } = await supabase
              .from('project_history')
              .select('*')
              .eq('project_id', projectId)
              .eq('event_type', 'status_change');
              
            if (historyError) {
              console.error('❌ Erro ao buscar histórico de status:', historyError);
            }
            
            // Convert Supabase data to format needed by the app
            const convertedProject: ProjectData = {
              id: projectFromSupabase.id,
              clientName: clientName,
              clientEmail: clientEmail,
              projectTitle: projectFromSupabase.title || 'Projeto de Música',
              packageType: packageName,
              status: (projectFromSupabase.status as 'waiting' | 'feedback' | 'approved') || 'waiting',
              createdAt: projectFromSupabase.created_at ? new Date(projectFromSupabase.created_at).toISOString() : new Date().toISOString(),
              lastActivityDate: projectFromSupabase.updated_at ? new Date(projectFromSupabase.updated_at).toISOString() : new Date().toISOString(),
              expirationDate: projectFromSupabase.deadline ? new Date(projectFromSupabase.deadline).toISOString() : undefined,
              versionsList: projectFiles ? projectFiles.map((file) => ({
                id: file.id,
                name: file.file_name || `Versão ${file.version || 1}`,
                description: file.notes || '',
                audioUrl: file.file_url || '',
                recommended: file.version === 1, // first version is recommended by default
                final: false,
                createdAt: file.created_at ? new Date(file.created_at).toISOString() : undefined
              })) : [],
              versions: projectFiles ? projectFiles.length : 0,
              feedback: '',
              feedbackHistory: feedbackHistory ? feedbackHistory.map(feedback => ({
                id: feedback.id,
                content: feedback.description,
                createdAt: feedback.created_at ? new Date(feedback.created_at).toISOString() : new Date().toISOString(),
                status: 'pending',
                versionId: projectId
              })) : [],
              history: statusHistory ? statusHistory.map(history => ({
                action: history.description,
                timestamp: history.created_at ? new Date(history.created_at).toLocaleString('pt-BR') : new Date().toLocaleString('pt-BR'),
                data: history.previous_value || {}
              })) : []
            };
            
            // Save the converted project
            supabaseProjectData = convertedProject;
            console.log('📊 Dados do projeto convertidos do Supabase:', convertedProject);
            setProjectData(convertedProject);
            setDataSource('supabase');
            setIsLoading(false);
            return;
          }
        } catch (supabaseError) {
          console.error('❌ Erro ao buscar do Supabase:', supabaseError);
        }
        
        // SECOND: Try localStorage (fallback data source)
        if (!supabaseProjectData) {
          console.log('🔍 Tentando buscar projeto no localStorage...');
          const storedProjects = localStorage.getItem('harmonIA_preview_projects');
          
          if (storedProjects) {
            const projects = JSON.parse(storedProjects);
            const project = projects.find((p: any) => p.id === projectId);
            
            if (project) {
              console.log('✅ Projeto encontrado no localStorage:', project);
              setProjectData(project);
              setDataSource('localStorage');
              setIsLoading(false);
              return;
            }
          }
          
          console.log('⚠️ Projeto não encontrado em nenhuma fonte de dados');
          setProjectData(null);
          setDataSource('none');
        }
      } catch (error) {
        console.error('❌ Erro ao carregar dados do projeto:', error);
        setProjectData(null);
        setDataSource('none');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [previewId]);

  // Update project status function with improved Supabase persistence
  const updateProjectStatus = async (newStatus: 'waiting' | 'feedback' | 'approved', comments: string = '') => {
    try {
      if (!actualProjectId || !projectData) return false;

      console.log(`🔄 Atualizando status do projeto ${actualProjectId} para ${newStatus}`);
      console.log(`📝 Comentários: ${comments || '(nenhum)'}`);
      
      // Capture the current timestamp for all updates
      const updateTimestamp = new Date().toISOString();
      const localizedTimestamp = new Date().toLocaleString('pt-BR');
      
      // First attempt to update in Supabase
      let supabaseUpdateSuccessful = false;
      
      try {
        console.log('🔄 Atualizando status no Supabase...');
        
        // 1. Update the project status
        const { error: projectError } = await supabase
          .from('projects')
          .update({ 
            status: newStatus,
            updated_at: updateTimestamp
          })
          .eq('id', actualProjectId);
        
        if (projectError) {
          console.error('❌ Erro ao atualizar projeto no Supabase:', projectError);
        } else {
          // 2. Add status change to history
          const historyEntry = {
            project_id: actualProjectId,
            event_type: 'status_change',
            description: `Status alterado para ${newStatus}`,
            previous_value: JSON.stringify({ status: projectData.status }),
            new_value: JSON.stringify({ status: newStatus }),
            created_at: updateTimestamp
          };
          
          const { error: historyError } = await supabase
            .from('project_history')
            .insert(historyEntry);
            
          if (historyError) {
            console.error('❌ Erro ao adicionar histórico:', historyError);
          }
          
          // 3. Add feedback if provided
          if (comments && comments.trim()) {
            const feedbackEntry = {
              project_id: actualProjectId,
              event_type: 'feedback',
              description: comments,
              previous_value: '{}',
              new_value: JSON.stringify({ status: 'pending' }),
              created_at: updateTimestamp
            };
            
            const { error: feedbackError } = await supabase
              .from('project_history')
              .insert(feedbackEntry);
              
            if (feedbackError) {
              console.error('❌ Erro ao salvar feedback:', feedbackError);
            }
          }
          
          console.log('✅ Projeto atualizado com sucesso no Supabase');
          supabaseUpdateSuccessful = true;
        }
      } catch (supabaseError) {
        console.error('❌ Erro ao atualizar no Supabase:', supabaseError);
      }
      
      // Fallback to localStorage for backward compatibility
      try {
        console.log('🔄 Atualizando status no localStorage...');
        const storedProjects = localStorage.getItem('harmonIA_preview_projects');
        let localUpdateSuccessful = false;
        
        if (storedProjects) {
          const projects = JSON.parse(storedProjects);
          const projectIndex = projects.findIndex((p: any) => p.id === actualProjectId);
          
          if (projectIndex !== -1) {
            // Update project in localStorage
            projects[projectIndex].status = newStatus;
            
            // Add feedback if provided
            if (comments.trim()) {
              if (!projects[projectIndex].feedbackHistory) {
                projects[projectIndex].feedbackHistory = [];
              }
              
              projects[projectIndex].feedbackHistory.push({
                id: `feedback_${Date.now()}`,
                content: comments,
                createdAt: updateTimestamp,
                status: 'pending',
                versionId: actualProjectId
              });
              
              projects[projectIndex].feedback = comments;
            }
            
            // Update lastActivityDate
            projects[projectIndex].lastActivityDate = updateTimestamp;
            
            // Add history entry
            if (!projects[projectIndex].history) {
              projects[projectIndex].history = [];
            }
            
            projects[projectIndex].history.push({
              action: `Status alterado para ${newStatus}`,
              timestamp: localizedTimestamp,
              data: {
                message: comments || `Cliente alterou o status do projeto para ${newStatus}`
              }
            });
            
            // Save back to localStorage
            localStorage.setItem('harmonIA_preview_projects', JSON.stringify(projects));
            
            // Update local state with the localStorage data
            setProjectData({
              ...projectData,
              status: newStatus,
              lastActivityDate: updateTimestamp,
              feedback: comments || projectData.feedback,
              feedbackHistory: [
                ...projectData.feedbackHistory,
                ...(comments.trim() ? [{
                  id: `feedback_${Date.now()}`,
                  content: comments,
                  createdAt: updateTimestamp,
                  status: 'pending',
                  versionId: actualProjectId
                }] : [])
              ],
              history: [
                ...projectData.history,
                {
                  action: `Status alterado para ${newStatus}`,
                  timestamp: localizedTimestamp,
                  data: {
                    message: comments || `Cliente alterou o status do projeto para ${newStatus}`
                  }
                }
              ]
            });
            
            localUpdateSuccessful = true;
          }
        }
        
        if (supabaseUpdateSuccessful || localUpdateSuccessful) {
          console.log('✅ Status do projeto atualizado com sucesso');
          return true;
        }
      } catch (localStorageError) {
        console.error('❌ Erro ao atualizar no localStorage:', localStorageError);
      }
      
      // If we get to this point, neither update was successful
      return false;
    } catch (error) {
      console.error('❌ Erro ao atualizar status:', error);
      return false;
    }
  };
  
  // Function to get data source for debugging
  const getDataSourceInfo = () => {
    return {
      source: dataSource,
      projectId: actualProjectId,
      isLoading,
      hasData: !!projectData
    };
  };

  return { 
    projectData, 
    setProjectData, 
    isLoading, 
    actualProjectId, 
    updateProjectStatus,
    getDataSourceInfo
  };
};
