
import { useState, useEffect } from 'react';
import { usePreviewProject as useBasePreviewProject, MusicPreview, PreviewProject as BasePreviewProject } from '@/hooks/usePreviewProject';
import { useToast } from '@/hooks/use-toast';

// Extend the PreviewProject interface to include additional fields
export interface PreviewProject extends BasePreviewProject {
  useGoogleDrive?: boolean;
}

// Re-export the hook functionality but with a better directory structure
export const usePreviewProject = (projectId: string | undefined) => {
  const { toast } = useToast();
  const baseHook = useBasePreviewProject(projectId);
  
  // Wrap the updateProjectStatus to match the expected return type
  const updateProjectStatus = async (newStatus: 'approved' | 'feedback', comments: string) => {
    const result = await baseHook.updateProjectStatus(newStatus, comments);
    return result;
  };
  
  // Return the baseHook with the proper type and wrapped function
  return {
    ...baseHook,
    updateProjectStatus
  } as {
    projectData: PreviewProject | null;
    setProjectData: React.Dispatch<React.SetStateAction<PreviewProject | null>>;
    isLoading: boolean;
    updateProjectStatus: (newStatus: 'approved' | 'feedback', comments: string) => Promise<boolean>;
    accessTokenValid: boolean;
    originalProjectId: string | undefined;
  };
};

// Re-export the MusicPreview type
export type { MusicPreview };
