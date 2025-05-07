
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getProjectIdFromPreviewLink, isValidEncodedPreviewLink } from '@/utils/previewLinkUtils';
import { supabase } from '@/lib/supabase';

interface MusicPreview {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  recommended?: boolean;
}

interface ProjectData {
  clientName: string;
  projectTitle: string;
  status: 'waiting' | 'feedback' | 'approved';
  createdAt: string;
  expirationDate?: string;
  packageType?: string;
  versions: MusicPreview[];
}

export const usePreviewProject = (projectId: string | undefined) => {
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actualProjectId, setActualProjectId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadProjectData = async () => {
      if (!projectId) {
        console.log('[usePreviewProject] No projectId provided, skipping data load');
        setIsLoading(false);
        setProjectData(null);
        return;
      }
      
      console.log(`[usePreviewProject] 🔎 Loading data for projectId=${projectId}`);
      setIsLoading(true);

      try {
        // Check if this is an encoded link or direct ID
        const isEncodedLink = isValidEncodedPreviewLink(projectId);
        console.log("[usePreviewProject] Is encoded preview link:", isEncodedLink);
        console.log("[usePreviewProject] Token recebido:", projectId);
        
        // Only allow encoded links or admin access for direct links
        const isAdmin = localStorage.getItem('admin_preview_access') === 'true';
        let decodedId: string | null = null;
        
        if (isEncodedLink) {
          // Process encoded link
          decodedId = getProjectIdFromPreviewLink(projectId);
          console.log(`[usePreviewProject] 🔑 Decoded ID=${decodedId}`);
        } else if (isAdmin) {
          // Allow direct access for admins
          decodedId = projectId;
          console.log(`[usePreviewProject] 👨‍💼 Admin direct access for ID=${projectId}`);
        } else {
          // Invalid link for non-admin users
          console.log("[usePreviewProject] ❌ Invalid direct link access for non-admin user");
          decodedId = null;
        }
        
        if (!decodedId) {
          console.log("[usePreviewProject] ❌ No valid project ID, skipping data load");
          setProjectData(null);
          setIsLoading(false);
          return;
        }
        
        setActualProjectId(decodedId);

        // First try to load from Supabase
        try {
          // Check by preview_code first (if the decoded ID looks like a preview code)
          if (/^P\d{4,}$/i.test(decodedId) || /^PREV-\d{4,}$/i.test(decodedId)) {
            console.log("[usePreviewProject] 🔍 Trying to fetch by preview_code:", decodedId);
            const { data: previewData, error: previewError } = await supabase
              .from('projects')
              .select('*, project_files(*), clients(*)')
              .eq('preview_code', decodedId)
              .maybeSingle();
              
            console.log('[usePreviewProject] 📊 Preview code query result:', { 
              previewData, 
              previewError,
              hasFiles: previewData?.project_files?.length > 0
            });
              
            if (!previewError && previewData) {
              console.log('[usePreviewProject] ✅ Project found by preview_code:', previewData);
              
              // Process project data...
              // This could be expanded based on your actual data structure
              setProjectData({
                clientName: previewData.client_name || previewData.clients?.name || 'Cliente',
                projectTitle: previewData.title || previewData.package_type || 'Música Personalizada',
                status: previewData.status || 'waiting',
                createdAt: previewData.created_at || new Date().toISOString(),
                expirationDate: previewData.deadline,
                packageType: previewData.package_type,
                versions: previewData.project_files?.map((file: any) => ({
                  id: file.id,
                  title: file.file_name || 'Prévia',
                  description: file.notes || 'Versão para aprovação',
                  audioUrl: file.file_url || ''
                })) || []
              });
              
              setIsLoading(false);
              return;
            }
          }
          
          // If not found by preview_code or not a preview code format, try by ID
          console.log("[usePreviewProject] 🔍 Trying to fetch by ID:", decodedId);
          const { data, error } = await supabase
            .from('projects')
            .select('*, project_files(*), clients(*)')
            .eq('id', decodedId)
            .maybeSingle();
            
          console.log('[usePreviewProject] 📊 ID query result:', { 
            data, 
            error,
            hasFiles: data?.project_files?.length > 0
          });
            
          if (!error && data) {
            console.log('[usePreviewProject] ✅ Project found by ID:', data);
            
            // Process project data...
            setProjectData({
              clientName: data.client_name || data.clients?.name || 'Cliente',
              projectTitle: data.title || data.package_type || 'Música Personalizada',
              status: data.status || 'waiting',
              createdAt: data.created_at || new Date().toISOString(),
              expirationDate: data.deadline,
              packageType: data.package_type,
              versions: data.project_files?.map((file: any) => ({
                id: file.id,
                title: file.file_name || 'Prévia',
                description: file.notes || 'Versão para aprovação',
                audioUrl: file.file_url || ''
              })) || []
            });
            
            setIsLoading(false);
            return;
          }
        } catch (supabaseError) {
          console.error("[usePreviewProject] 🔥 Supabase error:", supabaseError);
          // Continue to localStorage fallback
        }

        // If not found in Supabase, try localStorage
        console.log("[usePreviewProject] 📁 Trying localStorage fallback");
        const storedProjects = localStorage.getItem('harmonIA_preview_projects');
        if (!storedProjects) {
          console.log('[usePreviewProject] 📁 No projects found in localStorage');
          setProjectData(null);
          setIsLoading(false);
          return;
        }

        const projects = JSON.parse(storedProjects);
        const project = projects.find((p: any) => 
          p.id === decodedId || 
          p.preview_code === decodedId ||
          p.preview_code === projectId  // Also check against original token
        );
        
        if (project) {
          console.log('[usePreviewProject] 📁 Project found in localStorage:', project);
          
          const versions = project.versionsList?.map((v: any) => ({
            id: v.id,
            title: v.name || `Versão ${v.id}`,
            description: v.description || '',
            audioUrl: v.audioUrl || '',
            recommended: v.recommended
          })) || [];
          
          if (versions.length === 0 && project.versions > 0) {
            // Fallback if no versionsList but versions count > 0
            console.log('[usePreviewProject] ⚠️ No versionsList but versions count > 0, creating fallback versions');
            for (let i = 0; i < project.versions; i++) {
              versions.push({
                id: `v${i+1}`,
                title: `Versão ${i+1}`,
                description: 'Versão para aprovação',
                audioUrl: 'https://drive.google.com/file/d/1H62ylCwQYJ23BLpygtvNmCgwTDcHX6Cl/preview',
                recommended: i === 0
              });
            }
          }
          
          setProjectData({
            clientName: project.clientName || 'Cliente',
            projectTitle: project.projectTitle || project.packageType || 'Música Personalizada',
            status: project.status || 'waiting',
            createdAt: project.createdAt || new Date().toISOString(),
            expirationDate: project.expirationDate,
            packageType: project.packageType,
            versions: versions.length > 0 ? versions : [
              {
                id: 'v1',
                title: 'Versão Acústica',
                description: 'Versão suave com violão e piano',
                audioUrl: 'https://drive.google.com/file/d/1H62ylCwQYJ23BLpygtvNmCgwTDcHX6Cl/preview',
                recommended: true
              },
              {
                id: 'v2',
                title: 'Versão Orquestral',
                description: 'Arranjo completo com cordas e metais',
                audioUrl: 'https://drive.google.com/file/d/11c6JahRd5Lx0iKCL_gHZ0zrZ3LFBJ47a/preview'
              }
            ]
          });
        } else {
          console.log(`[usePreviewProject] ❌ Project not found for id=${decodedId}`);
          setProjectData(null);
        }
      } catch (error) {
        console.error('[usePreviewProject] 🔥 Error loading project data:', error);
        setProjectData(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjectData();
  }, [projectId]);

  const updateProjectStatus = (newStatus: 'waiting' | 'feedback' | 'approved', comments: string = '') => {
    if (!actualProjectId) {
      console.error('[usePreviewProject] Cannot update status without a valid project ID');
      return false;
    }

    try {
      console.log(`[usePreviewProject] Updating status to ${newStatus}`);
      
      const storedProjects = localStorage.getItem('harmonIA_preview_projects');
      if (!storedProjects) {
        console.error('[usePreviewProject] No projects found in localStorage');
        return false;
      }

      const projects = JSON.parse(storedProjects);
      const projectIndex = projects.findIndex((p: any) => p.id === actualProjectId);
      
      if (projectIndex === -1) {
        console.error(`[usePreviewProject] Project not found for id=${actualProjectId}`);
        return false;
      }
      
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
      
      // Add to general history
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
      
      // Update last activity date
      projects[projectIndex].lastActivityDate = new Date().toISOString();
      
      // Save back to localStorage
      localStorage.setItem('harmonIA_preview_projects', JSON.stringify(projects));
      
      // Update local state
      if (projectData) {
        setProjectData({
          ...projectData,
          status: newStatus
        });
      }
      
      console.log('[usePreviewProject] Status successfully updated');
      return true;
    } catch (error) {
      console.error('[usePreviewProject] Error updating status:', error);
      return false;
    }
  };

  return { projectData, isLoading, actualProjectId, updateProjectStatus };
};
