
import { supabase } from '@/integrations/supabase/client';

export interface ProjectPreview {
  id: string;
  client_name: string;
  title: string;
  status: string;
  created_at: string;
  expires_at?: string;
}

export const getProjectIdFromPreviewLink = async (previewId: string): Promise<string | null> => {
  try {
    // First try to use the ID directly
    const { data: directData, error: directError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', previewId)
      .maybeSingle();

    if (!directError && directData) {
      return previewId;
    }

    // Try to find by preview_code
    const { data: codeData, error: codeError } = await supabase
      .from('projects')
      .select('id')
      .eq('preview_code', previewId)
      .maybeSingle();

    if (!codeError && codeData) {
      return String(codeData.id);
    }

    return null;
  } catch (error) {
    console.error('Error getting project ID from preview link:', error);
    return null;
  }
};

export const previewLinkUtils = {
  generatePreviewLink: (projectId: string): string => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/preview/${projectId}`;
  },

  validateProjectAccess: async (projectId: string): Promise<{ valid: boolean; project?: ProjectPreview; error?: string }> => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id, client_name, title, status, created_at, expires_at')
        .eq('id', projectId)
        .single();

      if (error) {
        console.error('Error validating project access:', error);
        return { valid: false, error: 'Project not found' };
      }

      if (!data) {
        return { valid: false, error: 'Project not found' };
      }

      const project: ProjectPreview = {
        id: String(data.id || ''),
        client_name: String(data.client_name || ''),
        title: String(data.title || ''),
        status: String(data.status || ''),
        created_at: String(data.created_at || ''),
        expires_at: data.expires_at ? String(data.expires_at) : undefined
      };

      // Check if project has expired
      if (project.expires_at) {
        const expirationDate = new Date(project.expires_at);
        const now = new Date();
        
        if (now > expirationDate) {
          return { valid: false, error: 'Project has expired' };
        }
      }

      return { valid: true, project };
    } catch (error) {
      console.error('Error in validateProjectAccess:', error);
      return { valid: false, error: 'Internal error' };
    }
  },
};

export default previewLinkUtils;
