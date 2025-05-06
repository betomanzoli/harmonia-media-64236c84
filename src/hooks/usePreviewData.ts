import { useState, useEffect } from 'react';
import { usePreviewProjects } from '@/hooks/admin/usePreviewProjects';
import { ProjectData, MusicPreview, ProjectVersion } from '@/types/project.types';
import { supabase } from '@/lib/supabase'; // Import supabase client

export const usePreviewData = (projectId: string | undefined) => {
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [actualProjectId, setActualProjectId] = useState<string | null>(null);
  const { getProjectById, updateProject } = usePreviewProjects();

  useEffect(() => {
    const fetchProjectData = async () => {
      console.log('🔍 Fetching project data, projectId:', projectId);
      setIsLoading(true);
      setIsError(false);
      setErrorMessage(null);
      
      if (!projectId) {
        console.log('❌ No projectId provided');
        setIsLoading(false);
        setProjectData(null);
        return;
      }

      try {
        setActualProjectId(projectId);
        
        // Step 1: Try to fetch from Supabase first
        console.log('🔍 Attempting to fetch project from Supabase, id:', projectId);
        let supabaseProject = null;
        
        try {
          const { data, error } = await supabase
            .from('projects')
            .select('*, versionsList:project_files(*)')
            .eq('id', projectId)
            .maybeSingle();
          
          if (error) {
            console.error('❌ Supabase query error:', error);
          } else if (data) {
            console.log('✅ Project found in Supabase:', data);
            supabaseProject = data;
            
            // Check for duplicate project IDs (for more complex projects)
            if (data.id === projectId) {
              const { data: duplicates, error: dupError } = await supabase
                .from('projects')
                .select('count')
                .eq('preview_code', data.preview_code)
                .neq('id', projectId);
                
              if (duplicates && duplicates.length > 0) {
                console.warn(`⚠️ Warning: Found other projects with the same preview code`);
                // We'll continue with this project since the ID matches exactly
              }
            }
          } else {
            console.log('❌ Project not found in Supabase');
          }
        } catch (supabaseError) {
          console.error('❌ Error fetching from Supabase:', supabaseError);
        }
        
        // Step 2: If not found in Supabase, try localStorage
        let localProject = null;
        if (!supabaseProject) {
          console.log('🔍 Looking for project in localStorage');
          const adminProject = getProjectById(projectId);
          
          if (adminProject) {
            console.log('✅ Project found in localStorage:', adminProject);
            localProject = adminProject;
          } else {
            console.log('🔍 Checking individual project in localStorage');
            const storedProject = localStorage.getItem(`previewProject_${projectId}`);
            if (storedProject) {
              localProject = JSON.parse(storedProject);
              console.log('✅ Individual project found in localStorage:', localProject);
            } else {
              console.log('❌ Project not found in localStorage');
            }
          }
        }
        
        // Step 3: Process found project (from either source)
        const foundProject = supabaseProject || localProject;
        
        if (foundProject) {
          console.log('🔍 Processing project data:', foundProject);
          
          // Ensure all versions have createdAt date and description
          let previews: MusicPreview[] = [];
          
          if (Array.isArray(foundProject.versionsList) && foundProject.versionsList.length > 0) {
            console.log('🔍 Processing versions list:', foundProject.versionsList);
            previews = foundProject.versionsList.map(v => ({
              id: v.id || `v${Math.random().toString(36).substring(2, 9)}`,
              title: v.name || `Versão ${v.id}`,
              description: v.description || 'Sem descrição', // Ensure description is never empty
              audioUrl: v.audioUrl || v.file_url || '',
              recommended: v.recommended || false,
              name: v.name || `Versão ${v.id}`,
              createdAt: v.createdAt || v.created_at || new Date().toISOString()
            }));
            console.log('✅ Processed versions:', previews);
          } else if (foundProject.versions > 0) {
            console.log('🔍 No versionsList found, but versions count > 0, creating fallback versions');
            for (let i = 0; i < foundProject.versions; i++) {
              previews.push({
                id: `v${i+1}`,
                title: `Versão ${i+1}`,
                description: 'Versão para aprovação',
                audioUrl: 'https://drive.google.com/file/d/1H62ylCwQYJ23BLpygtvNmCgwTDcHX6Cl/preview',
                recommended: i === 0,
                name: `Versão ${i+1}`,
                createdAt: new Date().toISOString()
              });
            }
            console.log('✅ Created fallback versions:', previews);
          }

          // Make sure versionsList items have description and createdAt
          const versionsList = foundProject.versionsList?.map(v => ({
            ...v,
            description: v.description || 'Sem descrição', // Ensure description is never empty
            createdAt: v.createdAt || v.created_at || new Date().toISOString()
          })) as ProjectVersion[];

          const processedProjectData: ProjectData = {
            id: foundProject.id || projectId, // Ensure ID is always set
            clientName: foundProject.clientName || foundProject.client_name || 'Cliente',
            projectTitle: foundProject.packageType || foundProject.package_type || 'Música Personalizada',
            status: (foundProject.status as 'waiting' | 'feedback' | 'approved') || 'waiting',
            previews: previews.length > 0 ? previews : [
              {
                id: 'v1',
                title: 'Versão Acústica',
                description: 'Versão suave com violão e piano',
                audioUrl: 'https://drive.google.com/file/d/1H62ylCwQYJ23BLpygtvNmCgwTDcHX6Cl/preview',
                name: 'Versão Acústica',
                createdAt: new Date().toISOString()
              },
              {
                id: 'v2',
                title: 'Versão Orquestral',
                description: 'Arranjo completo com cordas e metais',
                audioUrl: 'https://drive.google.com/file/d/11c6JahRd5Lx0iKCL_gHZ0zrZ3LFBJ47a/preview',
                name: 'Versão Orquestral',
                createdAt: new Date().toISOString()
              },
              {
                id: 'v3',
                title: 'Versão Minimalista',
                description: 'Abordagem simplificada com foco na melodia',
                audioUrl: 'https://drive.google.com/file/d/1fCsWubN8pXwM-mRlDtnQFTCkBbIkuUyW/preview',
                name: 'Versão Minimalista',
                createdAt: new Date().toISOString()
              }
            ],
            packageType: foundProject.packageType || foundProject.package_type,
            createdAt: foundProject.createdAt || foundProject.created_at || new Date().toISOString(),
            lastActivityDate: foundProject.lastActivityDate || foundProject.last_activity_date || new Date().toISOString(),
            expirationDate: foundProject.expirationDate || foundProject.expiration_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            versions: foundProject.versions || previews.length,
            versionsList: versionsList,
            feedbackHistory: foundProject.feedbackHistory || foundProject.feedback_history || [],
            history: foundProject.history || [],
            clientEmail: foundProject.clientEmail || foundProject.client_email
          };

          console.log('✅ Final processed project data:', processedProjectData);
          setProjectData(processedProjectData);
        } else {
          console.log('❌ Project not found anywhere, using fallback data');
          setProjectData({
            id: 'fallback-project', // Add ID to fallback data
            clientName: 'Cliente Exemplo',
            projectTitle: 'Projeto de Música Personalizada',
            status: 'waiting',
            previews: [
              {
                id: 'v1',
                title: 'Versão Acústica',
                description: 'Versão suave com violão e piano',
                audioUrl: 'https://drive.google.com/file/d/1H62ylCwQYJ23BLpygtvNmCgwTDcHX6Cl/preview',
                name: 'Versão Acústica',
                createdAt: new Date().toISOString()
              },
              {
                id: 'v2',
                title: 'Versão Orquestral',
                description: 'Arranjo completo com cordas e metais',
                audioUrl: 'https://drive.google.com/file/d/11c6JahRd5Lx0iKCL_gHZ0zrZ3LFBJ47a/preview',
                name: 'Versão Orquestral',
                createdAt: new Date().toISOString()
              },
              {
                id: 'v3',
                title: 'Versão Minimalista',
                description: 'Abordagem simplificada com foco na melodia',
                audioUrl: 'https://drive.google.com/file/d/1fCsWubN8pXwM-mRlDtnQFTCkBbIkuUyW/preview',
                name: 'Versão Minimalista',
                createdAt: new Date().toISOString()
              }
            ],
            createdAt: new Date().toISOString(),
            lastActivityDate: new Date().toISOString(),
            packageType: 'Música Personalizada',
            versions: 3,
            expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          });
        }
      } catch (error) {
        console.error('❌ Error in usePreviewData:', error);
        setIsError(true);
        setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
        // Still use fallback data
        setProjectData({
          id: 'error-fallback',
          clientName: 'Erro de Carregamento',
          projectTitle: 'Houve um erro ao carregar os dados',
          status: 'waiting',
          previews: [],
          createdAt: new Date().toISOString(),
          lastActivityDate: new Date().toISOString(),
          packageType: 'Erro',
          versions: 0,
          expirationDate: new Date().toISOString(),
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId, getProjectById]);

  const updateProjectStatus = (newStatus: 'waiting' | 'feedback' | 'approved', feedback?: string) => {
    if (!actualProjectId) return false;
    console.log('🔄 Updating project status:', { projectId: actualProjectId, newStatus, feedback });

    // Create compatible updates object
    const updates: Record<string, any> = { 
      status: newStatus 
    };
    
    if (feedback) {
      updates.feedback = feedback;
    }
    
    // Try to update in Supabase first
    let supabaseUpdated = false;
    try {
      supabase
        .from('projects')
        .update({ status: newStatus, feedback: feedback || null })
        .eq('id', actualProjectId)
        .then(({ error }) => {
          if (error) {
            console.error('❌ Supabase update error:', error);
          } else {
            console.log('✅ Project status updated in Supabase');
            supabaseUpdated = true;
          }
        });
    } catch (error) {
      console.error('❌ Error updating Supabase:', error);
    }
    
    // Also update local storage as backup
    const updatedProject = updateProject(actualProjectId, updates);
    
    if ((updatedProject || supabaseUpdated) && projectData) {
      setProjectData({
        ...projectData,
        status: newStatus
      });
      console.log('✅ Project status updated locally');
      return true;
    }
    
    console.log('❌ Failed to update project status');
    return false;
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
