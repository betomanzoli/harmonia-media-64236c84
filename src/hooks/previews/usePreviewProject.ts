
import { usePreviewProject as useBasePreviewProject } from '@/hooks/usePreviewProject';

// Re-export types from the base hook
export type { PreviewVersion, MusicPreview } from '@/hooks/usePreviewProject';

// Extended interface for preview-specific functionality
export interface PreviewProject {
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
  useGoogleDrive?: boolean;
}

// Re-export the hook with proper typing
export const usePreviewProject = (projectId: string | undefined) => {
  const baseHook = useBasePreviewProject(projectId);
  
  // Transform the data to match PreviewProject interface
  const projectData: PreviewProject | null = baseHook.projectData ? {
    ...baseHook.projectData,
    useGoogleDrive: false
  } : null;
  
  return {
    ...baseHook,
    projectData
  };
};
