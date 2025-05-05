import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getProjectIdFromPreviewLink, isValidEncodedPreviewLink } from '@/utils/previewLinkUtils';

export const usePreviewData = (previewId: string | undefined) => {
  const [actualProjectId, setActualProjectId] = useState<string | null>(null);
  const [projectData, setProjectData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchData = async () => {
      if (!previewId) {
        setIsLoading(false);
        return;
      }

      console.log(`usePreviewData called with previewId: ${previewId}`);
      
      // Check if this is an encoded link or direct ID
      const isEncodedLink = isValidEncodedPreviewLink(previewId);
      console.log("Is encoded preview link:", isEncodedLink);
      
      // For admin users, support direct IDs
      const isAdmin = localStorage.getItem('admin_preview_access') === 'true';
      let projectId: string | null = null;
      
      if (isEncodedLink) {
        // Valid for both anonymous and admin users
        const decodedId = getProjectIdFromPreviewLink(previewId);
        console.log(`Decoded project ID: ${decodedId}`);
        projectId = decodedId;
      } else if (isAdmin) {
        // Direct access for admins only
        console.log(`Admin direct access for ID: ${previewId}`);
        projectId = previewId;
      } else {
        // Invalid link for non-admin users
        console.log("Invalid direct link access for non-admin user");
        projectId = null;
      }
      
      setActualProjectId(projectId);
      
      if (!projectId) {
        console.log("No valid project ID, skipping data load");
        setIsLoading(false);
        return;
      }
      
      // Load project data
      setIsLoading(true);
      
      try {
        // First try localStorage for backward compatibility
        const storedProjects = localStorage.getItem('harmonIA_preview_projects');
        console.log('Projects in localStorage:', storedProjects ? 'Found' : 'Not found');
        
        if (storedProjects) {
          const projects = JSON.parse(storedProjects);
          const project = projects.find((p: any) => p.id === projectId);
          
          if (project) {
            console.log('Project found in localStorage:', project);
            setProjectData(project);
            setIsLoading(false);
            return;
          }
        }
        
        // If not found in localStorage, try Supabase
        console.log('Project not found in localStorage, trying Supabase...');
        
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
          .single();
        
        if (error) {
          console.error('Error fetching from Supabase:', error);
          setProjectData(null);
          setIsLoading(false);
          return;
        } 
        
        if (projectFromSupabase) {
          console.log('Project found in Supabase:', projectFromSupabase);
          
          // Fetch versions (project files)
          const { data: projectFiles, error: filesError } = await supabase
            .from('project_files')
            .select('*')
            .eq('project_id', projectId)
            .eq('file_type', 'preview');
            
          if (filesError) {
            console.error('Error fetching project files:', filesError);
          }
          
          // Get client info if available
          let clientName = 'Cliente';
          let clientEmail = '';
          
          if (projectFromSupabase.client_id) {
            try {
              // Since we're not joining with clients table, fetch separately
              const { data: clientData } = await supabase
                .from('admin_users')
                .select('name, email')
                .eq('user_id', projectFromSupabase.client_id)
                .maybeSingle();
                
              if (clientData) {
                clientName = clientData.name || 'Cliente';
                clientEmail = clientData.email || '';
              }
            } catch (clientError) {
              console.error('Error fetching client data:', clientError);
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
              console.error('Error fetching package data:', packageError);
            }
          }
          
          // Convert Supabase data to format needed by the app
          const convertedProject = {
            id: projectFromSupabase.id,
            clientName: clientName,
            clientEmail: clientEmail,
            projectTitle: projectFromSupabase.title || 'Projeto de Música',
            packageType: packageName,
            status: projectFromSupabase.status || 'waiting',
            createdAt: new Date(projectFromSupabase.created_at).toISOString(),
            lastActivityDate: new Date(projectFromSupabase.updated_at).toISOString(),
            expirationDate: projectFromSupabase.deadline ? new Date(projectFromSupabase.deadline).toISOString() : undefined,
            versionsList: projectFiles ? projectFiles.map((file, index) => ({
              id: file.id,
              name: file.file_name || `Versão ${index + 1}`,
              description: file.notes || '',
              audioUrl: file.file_url || '',
              recommended: index === 0,
              final: false,
              createdAt: new Date(file.created_at).toISOString()
            })) : [],
            versions: projectFiles ? projectFiles.length : 0,
            feedback: '',
            feedbackHistory: [],
            history: []
          };
          
          console.log('Converted project data:', convertedProject);
          setProjectData(convertedProject);
        } else {
          console.log('Project not found in Supabase');
          setProjectData(null);
        }
      } catch (error) {
        console.error('Error loading project data:', error);
        setProjectData(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [previewId]);

  // Update project status function (modify to use Supabase)
  const updateProjectStatus = async (newStatus: 'waiting' | 'feedback' | 'approved', comments: string = '') => {
    try {
      if (!actualProjectId || !projectData) return false;

      console.log(`Updating project ${actualProjectId} status to ${newStatus}`);
      
      // Update in localStorage for backward compatibility
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
              createdAt: new Date().toISOString(),
              status: 'pending',
              versionId: actualProjectId
            });
            
            projects[projectIndex].feedback = comments;
          }
          
          // Update lastActivityDate
          projects[projectIndex].lastActivityDate = new Date().toISOString();
          
          // Add history entry
          if (!projects[projectIndex].history) {
            projects[projectIndex].history = [];
          }
          
          projects[projectIndex].history.push({
            action: `Status alterado para ${newStatus}`,
            timestamp: new Date().toLocaleString('pt-BR'),
            data: {
              message: comments || `Cliente alterou o status do projeto para ${newStatus}`
            }
          });
          
          // Save back to localStorage
          localStorage.setItem('harmonIA_preview_projects', JSON.stringify(projects));
          
          // Update local state
          setProjectData(projects[projectIndex]);
          localUpdateSuccessful = true;
        }
      }
      
      // Also update in Supabase
      try {
        const { error } = await supabase
          .from('projects')
          .update({ 
            status: newStatus,
            updated_at: new Date().toISOString()
          })
          .eq('id', actualProjectId);
        
        if (error) {
          console.error('Error updating project in Supabase:', error);
          return localUpdateSuccessful; // If local update worked, still return true
        }
        
        // Add to project history
        const { error: historyError } = await supabase
          .from('project_history')
          .insert({
            project_id: actualProjectId,
            event_type: 'status_change',
            description: `Status alterado para ${newStatus}`,
            previous_value: JSON.stringify({ status: projectData.status }),
            new_value: JSON.stringify({ status: newStatus }),
            created_at: new Date().toISOString()
          });
          
        if (historyError) {
          console.error('Error adding project history:', historyError);
        }
        
        console.log('Project successfully updated in Supabase');
      } catch (supabaseError) {
        console.error('Error updating in Supabase:', supabaseError);
        return localUpdateSuccessful; // If local update worked, still return true
      }
      
      return true;
    } catch (error) {
      console.error('Error updating status:', error);
      return false;
    }
  };

  return { projectData, setProjectData, isLoading, actualProjectId, updateProjectStatus };
};
