
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PreviewVersion {
  id: string;
  title: string;
  description?: string;
  audioUrl: string;
}

interface ProjectPreviewData {
  projectTitle: string;
  clientName: string;
  status: 'waiting' | 'feedback' | 'approved';
  packageType?: string;
  previews: PreviewVersion[];
}

export const usePreviewData = (previewId?: string) => {
  const [projectData, setProjectData] = useState<ProjectPreviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actualProjectId, setActualProjectId] = useState<string | null>(null);

  useEffect(() => {
    const loadPreviewData = async () => {
      if (!previewId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // First, try to find project by preview_code
        const { data: project, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('preview_code', previewId)
          .single();

        if (projectError) {
          console.error('Project not found by preview code:', projectError);
          setProjectData(null);
          return;
        }

        setActualProjectId(project.id);

        // Load project versions
        const { data: versions, error: versionsError } = await supabase
          .from('project_versions')
          .select('*')
          .eq('project_id', project.id)
          .order('created_at', { ascending: false });

        if (versionsError) throw versionsError;

        // Transform versions to preview format
        const previews: PreviewVersion[] = (versions || []).map(version => ({
          id: version.id,
          title: version.name,
          description: version.description,
          audioUrl: version.audio_url || ''
        }));

        setProjectData({
          projectTitle: project.title || 'Projeto Musical',
          clientName: project.client_name || 'Cliente',
          status: (project.status as 'waiting' | 'feedback' | 'approved') || 'waiting',
          packageType: project.package_type,
          previews
        });

      } catch (error) {
        console.error('Error loading preview data:', error);
        setProjectData(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreviewData();
  }, [previewId]);

  return {
    projectData,
    setProjectData,
    isLoading,
    actualProjectId
  };
};
