import { useState, useEffect } from 'react';
import { getProjectIdFromPreviewLink, isValidEncodedPreviewLink } from '@/utils/previewLinkUtils';
import { supabase } from '@/lib/supabase';
import { getCookieValue } from '@/components/previews/access/useProjectAccess';

// Define the types we'll use
interface VersionItem {
  id: string;
  name: string;
  description: string;
  audioUrl?: string;
  file_url?: string;
  recommended?: boolean;
  final?: boolean;
  createdAt?: string;
  created_at?: string;
  fileId?: string;
  title: string;
  finalVersionUrl?: string;
  stemsUrl?: string;
}

interface ProjectData {
  id: string;
  clientName: string;
  projectTitle?: string;
  status: 'waiting' | 'feedback' | 'approved';
  createdAt: string;
  expirationDate?: string;
  packageType?: string;
  versions?: number;
  versionsList?: VersionItem[];
  previews?: VersionItem[];
  feedbackHistory?: any[];
  history?: any[];
  lastActivityDate?: string;
  preview_code?: string;
}

export const usePreviewData = (previewId: string | undefined) => {
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [actualProjectId, setActualProjectId] = useState<string | null>(null);

  useEffect(() => {
    if (!previewId) {
      console.log('[usePreviewData] No previewId provided');
      setIsLoading(false);
      setIsError(true);
      setErrorMessage('Código de prévia não fornecido');
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);
      setErrorMessage(null);

      console.log(`[usePreviewData] 🔍 Fetching data for previewId=${previewId}`);

      try {
        // Try anonymous authentication for better RLS support
        try {
          const { error: authError } = await supabase.auth.signInAnonymously();
          if (authError) {
            // Log but continue - don't block preview access on auth failure
            console.warn('[usePreviewData] Anonymous auth warning:', authError);
          } else {
            console.log('[usePreviewData] Anonymous auth successful');
          }
        } catch (authErr) {
          console.warn('[usePreviewData] Anonymous auth error:', authErr);
        }

        // Check if this is an encoded preview link or direct ID
        const isEncodedLink = isValidEncodedPreviewLink(previewId);
        let decodedId: string | null = null;
        
        if (isEncodedLink) {
          decodedId = getProjectIdFromPreviewLink(previewId);
          console.log(`[usePreviewData] 🔑 Decoded ID=${decodedId}`);
        } else {
          // For direct IDs, check if the user has admin access
          const isAdmin = getCookieValue('admin_preview_access') === 'true';
          if (isAdmin) {
            decodedId = previewId;
            console.log(`[usePreviewData] 👨‍💼 Admin access with direct ID=${previewId}`);
          } else {
            console.log('[usePreviewData] ⚠️ Direct ID access attempt without admin rights');
            decodedId = previewId; // Still try with the provided ID as a fallback
          }
        }
        
        if (!decodedId) {
          console.log('[usePreviewData] ❌ Failed to decode preview ID');
          setIsError(true);
          setErrorMessage('ID de prévia inválido');
          return;
        }

        setActualProjectId(decodedId);

        // First try to find project by preview_code
        console.log('[usePreviewData] 🔍 Looking up by preview_code:', previewId);
        let { data: previewCodeData, error: previewCodeError } = await supabase
          .from('projects')
          .select('*, project_files(*)')
          .eq('preview_code', previewId);

        console.log('[usePreviewData] Preview code query result:', { 
          data: previewCodeData, 
          error: previewCodeError 
        });

        // If no results by preview_code or error occurred, try by ID
        if (previewCodeError || !previewCodeData || previewCodeData.length === 0) {
          console.log('[usePreviewData] 🔍 Looking up by ID:', decodedId);
          const { data, error } = await supabase
            .from('projects')
            .select('*, project_files(*)')
            .eq('id', decodedId);

          console.log('[usePreviewData] ID query result:', { 
            data, 
            error
          });

          if (error) {
            console.error('[usePreviewData] ❌ Error fetching from Supabase:', error);
            
            // If there's an error with Supabase, try localStorage as fallback
            const localData = tryLoadFromLocalStorage(previewId, decodedId);
            if (localData) {
              setProjectData(localData);
              setIsLoading(false);
              return;
            }

            setIsError(true);
            setErrorMessage(`Erro ao buscar projeto: ${error.message}`);
            return;
          }

          if (data && data.length > 0) {
            // Successfully found by ID
            const projectData = mapSupabaseDataToProjectData(data[0]);
            setProjectData(projectData);
          } else {
            // Try localStorage as a last resort
            const localData = tryLoadFromLocalStorage(previewId, decodedId);
            if (localData) {
              setProjectData(localData);
            } else {
              console.log('[usePreviewData] ❌ Project not found by any method');
              setIsError(true);
              setErrorMessage('Projeto não encontrado');
            }
          }
        } else {
          // Successfully found by preview_code
          const projectData = mapSupabaseDataToProjectData(previewCodeData[0]);
          setProjectData(projectData);
        }
      } catch (error) {
        console.error('[usePreviewData] ❌ Error in data fetch:', error);
        setIsError(true);
        setErrorMessage('Erro ao carregar dados do projeto');
        
        // Try localStorage as a last resort
        const localData = tryLoadFromLocalStorage(previewId, previewId);
        if (localData) {
          setProjectData(localData);
          setIsError(false);
          setErrorMessage(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [previewId]);

  // Function to try loading from localStorage
  const tryLoadFromLocalStorage = (previewId: string, decodedId: string | null): ProjectData | null => {
    console.log('[usePreviewData] 📁 Trying localStorage fallback');
    try {
      const storedProjects = localStorage.getItem('harmonIA_preview_projects');
      if (!storedProjects) return null;

      const projects = JSON.parse(storedProjects);
      // Try to find by preview_code first, then by ID
      const project = projects.find((p: any) => 
        p.preview_code === previewId || 
        p.id === previewId || 
        (decodedId && p.id === decodedId)
      );

      if (project) {
        console.log('[usePreviewData] 📁 Project found in localStorage:', project);
        return project;
      }
      
      return null;
    } catch (error) {
      console.error('[usePreviewData] Error loading from localStorage:', error);
      return null;
    }
  };

  // Helper function to map Supabase data to our ProjectData format
  const mapSupabaseDataToProjectData = (data: any): ProjectData => {
    const versionsList = data.project_files?.map((file: any) => ({
      id: file.id,
      name: file.file_name || 'Versão',
      title: file.file_name || 'Versão',
      description: file.notes || '',
      audioUrl: file.file_url || '',
      file_url: file.file_url || '',
      createdAt: file.created_at,
      created_at: file.created_at,
      recommended: file.is_recommended || false,
      final: file.is_final || false,
      finalVersionUrl: file.final_version_url || '',
      stemsUrl: file.stems_url || ''
    })) || [];

    return {
      id: data.id,
      clientName: data.client_name || 'Cliente',
      projectTitle: data.title || data.package_type || 'Música Personalizada',
      status: data.status || 'waiting',
      createdAt: data.created_at || new Date().toISOString(),
      expirationDate: data.deadline,
      packageType: data.package_type,
      versions: versionsList.length,
      versionsList: versionsList,
      previews: versionsList, // For backwards compatibility
      preview_code: data.preview_code
    };
  };

  const updateProjectStatus = (
    newStatus: 'waiting' | 'feedback' | 'approved',
    comments: string = ''
  ) => {
    if (!actualProjectId) {
      console.error('[usePreviewData] Cannot update status without a valid project ID');
      return false;
    }

    console.log(`[usePreviewData] Updating status to ${newStatus} with comments: ${comments}`);

    try {
      // Try to update in Supabase first
      const updateSupabase = async () => {
        try {
          const { error } = await supabase
            .from('projects')
            .update({ status: newStatus })
            .eq('id', actualProjectId);

          if (error) {
            console.error('[usePreviewData] Error updating status in Supabase:', error);
            return false;
          }
          return true;
        } catch (error) {
          console.error('[usePreviewData] Exception updating Supabase:', error);
          return false;
        }
      };

      // Also update in localStorage for offline support
      const updateLocalStorage = () => {
        try {
          const storedProjects = localStorage.getItem('harmonIA_preview_projects');
          if (!storedProjects) return false;

          const projects = JSON.parse(storedProjects);
          const projectIndex = projects.findIndex((p: any) => 
            p.id === actualProjectId || 
            p.preview_code === actualProjectId
          );

          if (projectIndex === -1) return false;

          // Update status
          projects[projectIndex].status = newStatus;

          // Add feedback if provided
          if (comments) {
            projects[projectIndex].feedback = comments;

            // Add to feedback history
            if (!projects[projectIndex].feedbackHistory) {
              projects[projectIndex].feedbackHistory = [];
            }

            projects[projectIndex].feedbackHistory.push({
              id: `feedback_${Date.now()}`,
              content: comments,
              createdAt: new Date().toISOString(),
              status: 'pending'
            });
          }

          // Update last activity date
          projects[projectIndex].lastActivityDate = new Date().toISOString();

          // Save back to localStorage
          localStorage.setItem('harmonIA_preview_projects', JSON.stringify(projects));

          return true;
        } catch (error) {
          console.error('[usePreviewData] Error updating localStorage:', error);
          return false;
        }
      };

      // Try both update methods - Supabase is primary but localStorage is important backup
      // Fix: Don't check expression of type 'void' for truthiness
      updateSupabase(); // Don't check return value as it's async
      const localUpdateSuccess = updateLocalStorage();

      // Update local state if localStorage update worked
      if (localUpdateSuccess && projectData) {
        setProjectData({
          ...projectData,
          status: newStatus
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('[usePreviewData] Error updating status:', error);
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
