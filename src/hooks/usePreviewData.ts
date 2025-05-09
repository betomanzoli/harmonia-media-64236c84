
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ProjectItem, FeedbackItem } from '@/types/project.types';
import { initializeMockPreviewData } from '@/utils/mockPreviewsData';
import { getProjectIdFromPreviewLink, isValidEncodedPreviewLink } from '@/utils/previewLinkUtils';
import { getCookie, getJsonCookie, setJsonCookie } from '@/utils/cookieUtils';

/**
 * Custom hook to fetch and manage preview project data
 */
export const usePreviewData = (previewId: string | undefined) => {
  const [projectData, setProjectData] = useState<ProjectItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [actualProjectId, setActualProjectId] = useState<string | null>(null);

  // Check if admin access is granted
  const hasAdminAccess = localStorage.getItem('admin_preview_access') === 'true';
  
  // Check if user has access to this preview
  const hasAccess = () => {
    // Admin always has access
    if (hasAdminAccess) return true;
    
    // Check for project-specific access cookie
    if (previewId) {
      const accessCookie = getCookie(`preview_auth_${previewId}`);
      if (accessCookie === 'authorized') return true;
    }
    
    // Check for general preview access
    const accessData = getJsonCookie<{project_id: string, access_time: number, expires_at: number}>('preview_access');
    if (accessData && accessData.project_id === previewId && accessData.expires_at > Date.now()) {
      return true;
    }
    
    return false;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!previewId) {
          setIsError(true);
          setErrorMessage('ID do projeto não fornecido');
          setIsLoading(false);
          return;
        }

        console.log('🔍 Preview ID received:', previewId);
        
        // Determine if this is an encoded link or direct ID
        const isEncodedLink = isValidEncodedPreviewLink(previewId);
        console.log('🔍 Is encoded preview link:', isEncodedLink);
        
        let projectId = previewId;
        
        // Try to decode if it's an encoded link
        if (isEncodedLink) {
          projectId = getProjectIdFromPreviewLink(previewId) || previewId;
          console.log('🔍 Decoded project ID:', projectId);
        }
        
        setActualProjectId(projectId);
        
        // Allow direct access for admins only
        if (!isEncodedLink && !hasAdminAccess) {
          setIsError(true);
          setErrorMessage('Acesso direto não permitido. Use um link codificado.');
          setIsLoading(false);
          return;
        }
        
        // Try Supabase first
        try {
          // Check if user has access to this preview before attempting database lookup
          if (hasAccess() || isEncodedLink) {
            // First try by preview_code (for encoded links)
            const { data: previewCodeData, error: previewCodeError } = await supabase
              .from('projects')
              .select(`
                id, title, status, description, preview_code, created_at, updated_at, deadline,
                clients (id, name, email, phone)
              `)
              .eq(isEncodedLink ? 'preview_code' : 'id', projectId)
              .single();
            
            if (!previewCodeError && previewCodeData) {
              console.log('🔍 Project found in Supabase by preview_code:', previewCodeData);
              
              // Extract client data safely handling different potential types
              // The clients property could be an object or array, so we need to handle both
              let clientName = 'Cliente';
              let clientEmail = null;
              let clientPhone = null;
              
              // Ensure clients exists and properly handle its structure
              const clients = previewCodeData.clients;
              if (clients) {
                // Check if clients is an array
                if (Array.isArray(clients)) {
                  // If it's a non-empty array, use the first item
                  if (clients.length > 0) {
                    const firstClient = clients[0] as { name?: string; email?: string; phone?: string };
                    clientName = firstClient.name || 'Cliente';
                    clientEmail = firstClient.email || null;
                    clientPhone = firstClient.phone || null;
                  }
                } 
                // If it's a direct object (not an array)
                else if (typeof clients === 'object') {
                  const clientObj = clients as { name?: string; email?: string; phone?: string };
                  clientName = clientObj.name || 'Cliente';
                  clientEmail = clientObj.email || null;
                  clientPhone = clientObj.phone || null;
                }
              }
              
              // Format project data in the expected format
              const formattedProject: ProjectItem = {
                id: previewCodeData.id,
                client_name: clientName,
                client_email: clientEmail,
                client_phone: clientPhone,
                project_title: previewCodeData.title,
                package_type: 'standard', // Default if not available
                status: previewCodeData.status,
                created_at: previewCodeData.created_at,
                last_activity_date: previewCodeData.updated_at,
                expiration_date: previewCodeData.deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                versions: 0,
                preview_code: previewCodeData.preview_code,
                
                // Camel case aliases for front-end components
                clientName: clientName,
                projectTitle: previewCodeData.title,
                packageType: 'standard',
                createdAt: previewCodeData.created_at,
                lastActivityDate: previewCodeData.updated_at,
                expirationDate: previewCodeData.deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                clientEmail: clientEmail,
                clientPhone: clientPhone
              };
              
              // Get versions list from project_files
              const { data: versionsData, error: versionsError } = await supabase
                .from('project_files')
                .select('*')
                .eq('project_id', previewCodeData.id)
                .order('created_at', { ascending: false });
                
              if (!versionsError && versionsData) {
                const versionsList = versionsData.map(file => ({
                  id: file.id,
                  title: file.title || 'Versão',
                  name: file.title || 'Versão',
                  description: file.title,
                  audio_url: file.drive_url,
                  file_url: file.drive_url,
                  file_id: file.id,
                  recommended: false,
                  final: file.file_type === 'final',
                  created_at: file.created_at,
                  date_added: file.created_at,
                  
                  // Camel case aliases
                  audioUrl: file.drive_url
                }));
                
                formattedProject.versionsList = versionsList;
                formattedProject.versions = versionsList.length;
                formattedProject.previews = versionsList;
              }
              
              setProjectData(formattedProject);
              setIsLoading(false);
              return;
            }
          }
        } catch (error) {
          console.error('Error fetching from Supabase:', error);
          // Continue to localStorage fallback
        }
          
        // Fallback to localStorage
        console.log('🔍 Falling back to localStorage');
        const localProjects = JSON.parse(localStorage.getItem('harmonIA_preview_projects') || '[]') as ProjectItem[];
        
        // Find by ID or preview_code
        const project = localProjects.find(p => 
          p.id === projectId || p.preview_code === projectId
        );
        
        if (project) {
          console.log('🔍 Project found in localStorage:', project);
          setProjectData(project);
        } else {
          console.log('🔍 Project not found in localStorage');
          
          // Last resort: initialize mock data and try again
          const mockData = initializeMockPreviewData();
          const mockProject = mockData.find(p => p.id === projectId || p.preview_code === projectId);
          
          if (mockProject) {
            console.log('🔍 Project found in mock data:', mockProject);
            setProjectData(mockProject);
          } else {
            // If the user has admin access, create a fallback project
            if (hasAdminAccess) {
              const fallbackProject: ProjectItem = {
                id: 'fallback-project',
                client_name: 'Cliente Demo',
                project_title: 'Projeto de Demonstração',
                package_type: 'demo',
                status: 'waiting',
                created_at: new Date().toISOString(),
                last_activity_date: new Date().toISOString(),
                expiration_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                versions: 1,
                versionsList: [{
                  id: 'demo-v1',
                  title: 'Versão Demo',
                  name: 'Versão Demo',
                  description: 'Esta é uma versão de demonstração',
                  audio_url: 'https://samplelib.com/lib/preview/mp3/sample-15s.mp3',
                  created_at: new Date().toISOString(),
                  
                  // Camel case aliases
                  audioUrl: 'https://samplelib.com/lib/preview/mp3/sample-15s.mp3'
                }],
                
                // Aliases
                clientName: 'Cliente Demo',
                projectTitle: 'Projeto de Demonstração',
                packageType: 'demo',
                createdAt: new Date().toISOString(),
                lastActivityDate: new Date().toISOString(),
                expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
              };
              
              console.log('🔍 Created fallback project for admin');
              setProjectData(fallbackProject);
            } else {
              console.log('🔍 No project found and not an admin');
              setIsError(true);
              setErrorMessage('Projeto não encontrado');
            }
          }
        }
      } catch (error) {
        console.error('Error in usePreviewData:', error);
        setIsError(true);
        setErrorMessage('Erro ao carregar dados do projeto');
      } finally {
        setIsLoading(false);
      }
    };

    if (previewId) {
      loadData();
    } else {
      setIsLoading(false);
    }
  }, [previewId, hasAdminAccess]);

  // Function to update project status (feedback/approval)
  const updateProjectStatus = (newStatus: string, feedbackComment?: string): boolean => {
    try {
      if (!projectData || !actualProjectId) return false;
      
      // If using Supabase
      const updateSupabaseProject = async () => {
        try {
          // Create a feedback entry if comment provided
          if (feedbackComment) {
            await supabase.from('project_history').insert({
              project_id: projectData.id,
              action: newStatus === 'feedback' ? 'feedback_submitted' : 'project_approved',
              description: feedbackComment
            });
          }
          
          // Update project status
          const { error } = await supabase
            .from('projects')
            .update({ status: newStatus })
            .eq('id', projectData.id);
            
          if (error) {
            console.error('Error updating project status in Supabase:', error);
            return false;
          }
          
          return true;
        } catch (error) {
          console.error('Error in updateSupabaseProject:', error);
          return false;
        }
      };

      // Try Supabase first, then fall back to localStorage
      if (projectData.id.includes('-')) { // Supabase UUIDs contain dashes
        // For simplicity in this update, we'll just use localStorage
        // The full implementation would try Supabase first
        updateSupabaseProject()
          .then(success => {
            if (!success) {
              // Fall back to localStorage if Supabase update fails
              updateLocalStorage();
            }
          })
          .catch(() => {
            // Also fall back on exception
            updateLocalStorage();
          });
      } else {
        updateLocalStorage();
      }
      
      function updateLocalStorage() {
        // Update in localStorage
        const localProjects = JSON.parse(localStorage.getItem('harmonIA_preview_projects') || '[]') as ProjectItem[];
        const projectIndex = localProjects.findIndex(p => p.id === projectData.id || p.preview_code === projectData.id);
      
        if (projectIndex !== -1) {
          // Update status
          localProjects[projectIndex].status = newStatus;
          
          // Add feedback if provided
          if (feedbackComment) {
            const newFeedback: FeedbackItem = {
              id: `fb-${Date.now()}`,
              project_id: projectData.id,
              comment: feedbackComment,
              content: feedbackComment, // Alias
              created_at: new Date().toISOString(),
              status: 'pending'
            };
            
            if (!localProjects[projectIndex].feedback_history) {
              localProjects[projectIndex].feedback_history = [];
            }
            
            localProjects[projectIndex].feedback_history.push(newFeedback);
            
            // Also update the camelCase alias
            localProjects[projectIndex].feedbackHistory = localProjects[projectIndex].feedback_history;
          }
          
          // Update activity date
          localProjects[projectIndex].last_activity_date = new Date().toLocaleDateString('pt-BR');
          localProjects[projectIndex].lastActivityDate = new Date().toLocaleDateString('pt-BR');
          
          localStorage.setItem('harmonIA_preview_projects', JSON.stringify(localProjects));
          
          // Also update the current project data
          setProjectData({ ...localProjects[projectIndex] });
          
          return true;
        }
        
        return false;
      }
      
      return true;
      
    } catch (error) {
      console.error('Error updating project status:', error);
      return false;
    }
  };

  return {
    projectData,
    isLoading,
    isError,
    errorMessage,
    actualProjectId,
    updateProjectStatus
  };
};
