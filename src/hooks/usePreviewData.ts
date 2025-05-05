
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { usePreviewProjects, ProjectItem } from '@/hooks/admin/usePreviewProjects';
import { getProjectIdFromPreviewLink, isValidEncodedPreviewLink } from '@/utils/previewLinkUtils';
import { supabase } from '@/integrations/supabase/client';

export const usePreviewData = (previewId: string | undefined) => {
  const [actualProjectId, setActualProjectId] = useState<string | null>(null);
  const [projectData, setProjectData] = useState<ProjectItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    if (previewId) {
      // Log for debugging
      console.log(`usePreviewData called with previewId: ${previewId}`);
      
      // Check if this is an encoded link or direct ID
      const isEncodedLink = isValidEncodedPreviewLink(previewId);
      console.log("Is encoded preview link:", isEncodedLink);
      
      // For backwards compatibility, we still support direct project IDs
      // but only when accessed by admin users
      const isAdmin = localStorage.getItem('admin_preview_access') === 'true';
      let projectId: string | null = null;
      
      if (isEncodedLink) {
        // Process encoded link - valid for both anonymous and admin users
        const decodedId = getProjectIdFromPreviewLink(previewId);
        console.log(`Decoded project ID: ${decodedId}`);
        projectId = decodedId;
      } else if (isAdmin) {
        // Allow direct access for admins only
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
      loadProjectData(projectId);
    } else {
      setIsLoading(false);
    }
  }, [previewId]);

  // Function to load project data from localStorage or Supabase
  const loadProjectData = async (projectId: string) => {
    setIsLoading(true);
    let projectFromStorage = null;
    
    try {
      // First try to get from localStorage
      const storedProjects = localStorage.getItem('harmonIA_preview_projects');
      console.log('Projects in localStorage:', storedProjects ? 'Found' : 'Not found');
      
      if (storedProjects) {
        const projects = JSON.parse(storedProjects);
        projectFromStorage = projects.find((p: ProjectItem) => p.id === projectId);
        
        if (projectFromStorage) {
          console.log('Project found in localStorage:', projectFromStorage);
          setProjectData(projectFromStorage);
          setIsLoading(false);
          return;
        }
      }
      
      // If not found in localStorage, try to fetch from Supabase
      console.log('Project not found in localStorage, fetching from Supabase:', projectId);
      
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
          preview_code,
          packages(name)
        `)
        .eq('id', projectId)
        .single();
        
      if (error) {
        console.error('Error fetching project from Supabase:', error);
        throw error;
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
            // Since 'clients' table doesn't exist in the schema,
            // we need to work with what's available
            // Check if client information is stored elsewhere, like in admin_users
            const { data: userData } = await supabase
              .from('admin_users')
              .select('name, email')
              .eq('id', projectFromSupabase.client_id)
              .maybeSingle();
              
            if (userData && userData.name) {
              clientName = userData.name;
              clientEmail = userData.email || '';
            }
          } catch (clientError) {
            console.error('Error fetching client data:', clientError);
          }
        }
        
        // Get package name safely
        let packageName = 'Música Personalizada';
        if (projectFromSupabase.packages && typeof projectFromSupabase.packages === 'object') {
          packageName = (projectFromSupabase.packages as any).name || packageName;
        }
        
        // Convert Supabase data to ProjectItem format
        const convertedProject: ProjectItem = {
          id: projectFromSupabase.id,
          clientName: clientName,
          clientEmail: clientEmail,
          packageType: packageName,
          status: (projectFromSupabase.status as 'waiting' | 'feedback' | 'approved') || 'waiting',
          createdAt: new Date(projectFromSupabase.created_at).toLocaleDateString('pt-BR'),
          lastActivityDate: new Date(projectFromSupabase.updated_at).toLocaleDateString('pt-BR'),
          expirationDate: projectFromSupabase.deadline ? new Date(projectFromSupabase.deadline).toLocaleDateString('pt-BR') : undefined,
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
  
  // Function to update project status and add information to history
  const updateProjectStatus = async (newStatus: 'waiting' | 'feedback' | 'approved', comments: string = '') => {
    try {
      if (!actualProjectId || !projectData) return false;

      console.log(`Updating project ${actualProjectId} status to ${newStatus}`);
      console.log(`Client feedback: ${comments}`);
      
      // First try to update in localStorage for admin users
      let localUpdateSuccessful = false;
      const storedProjects = localStorage.getItem('harmonIA_preview_projects');
      
      if (storedProjects) {
        const projects = JSON.parse(storedProjects);
        const projectIndex = projects.findIndex((p: ProjectItem) => p.id === actualProjectId);
        
        if (projectIndex !== -1) {
          // Update project status
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
          
          console.log('Project successfully updated in localStorage:', projects[projectIndex]);
          localUpdateSuccessful = true;
        }
      }
      
      // Also try to update in Supabase
      try {
        // Update project status
        const { error: projectUpdateError } = await supabase
          .from('projects')
          .update({ 
            status: newStatus,
            updated_at: new Date().toISOString()
          })
          .eq('id', actualProjectId);
          
        if (projectUpdateError) {
          console.error('Error updating project status in Supabase:', projectUpdateError);
        } else {
          console.log('Project status successfully updated in Supabase');
        }
        
        // Add feedback to project_history
        if (comments.trim()) {
          const { error: historyError } = await supabase
            .from('project_history')
            .insert({
              project_id: actualProjectId,
              event_type: 'feedback',
              description: comments,
              new_value: { status: newStatus }
            });
            
          if (historyError) {
            console.error('Error adding feedback to project history in Supabase:', historyError);
          } else {
            console.log('Feedback successfully added to project history in Supabase');
          }
        }
      } catch (supabaseError) {
        console.error('Error updating project in Supabase:', supabaseError);
        // If Supabase update failed but localStorage update succeeded, still return true
        if (localUpdateSuccessful) {
          return true;
        }
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating status:', error);
      return false;
    }
  };
  
  return { projectData, setProjectData, isLoading, actualProjectId, updateProjectStatus };
};
