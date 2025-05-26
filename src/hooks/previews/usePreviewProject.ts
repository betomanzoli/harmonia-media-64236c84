
import { usePreviewProject as useBasePreviewProject, MusicPreview, PreviewProject as BasePreviewProject } from '@/hooks/usePreviewProject';

// Extend the PreviewProject interface to include additional fields
export interface PreviewProject extends BasePreviewProject {
  useGoogleDrive?: boolean;
}

// Re-export the hook functionality with proper Supabase integration
export const usePreviewProject = (projectId: string | undefined) => {
  const baseHook = useBasePreviewProject(projectId);
  
  // Return the baseHook with the proper type
  return baseHook as {
    projectData: PreviewProject | null;
    setProjectData: React.Dispatch<React.SetStateAction<PreviewProject | null>>;
    isLoading: boolean;
    updateProjectStatus: (newStatus: 'approved' | 'feedback', comments: string) => Promise<boolean>;
  };
};

// Re-export the MusicPreview type
export type { MusicPreview };
