
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
  createdAt?: string;
  expiresAt?: string;
  previews: PreviewVersion[];
  feedbackHistory?: Array<{
    id: string;
    content: string;
    created_at: string;
  }>;
}

export const usePreviewProject = (projectId?: string) => {
  const [projectData, setProjectData] = useState<ProjectPreviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProjectData = async () => {
      if (!projectId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Load project data
        const { data: project, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();

        if (projectError) throw projectError;

        // Load project versions
        const { data: versions, error: versionsError } = await supabase
          .from('project_versions')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false });

        if (versionsError) throw versionsError;

        // Transform versions to preview format
        const previews: PreviewVersion[] = (versions || []).map(version => ({
          id: version.id,
          title: version.name,
          description: version.description,
          audioUrl: version.audio_url || ''
        }));

        // Load feedback history
        const { data: feedback, error: feedbackError } = await supabase
          .from('feedback')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false });

        if (feedbackError) throw feedbackError;

        setProjectData({
          projectTitle: project.title || 'Projeto Musical',
          clientName: project.client_name || 'Cliente',
          status: (project.status as 'waiting' | 'feedback' | 'approved') || 'waiting',
          packageType: project.package_type,
          createdAt: project.created_at,
          expiresAt: project.expires_at,
          previews,
          feedbackHistory: feedback || []
        });

      } catch (error) {
        console.error('Error loading project preview data:', error);
        setProjectData(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjectData();
  }, [projectId]);

  return {
    projectData,
    isLoading
  };
};
