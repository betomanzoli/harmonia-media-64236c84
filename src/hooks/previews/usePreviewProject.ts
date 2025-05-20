
import { useState, useEffect } from 'react';
import { usePreviewProject as useBasePreviewProject, MusicPreview, PreviewProject } from '@/hooks/usePreviewProject';
import { useToast } from '@/hooks/use-toast';

// Re-export the hook functionality but with a better directory structure
export const usePreviewProject = (projectId: string | undefined) => {
  const { toast } = useToast();
  const baseHook = useBasePreviewProject(projectId);
  
  // You can extend the hook with additional functionality specific to previews if needed
  
  return baseHook;
};

// Re-export the types
export type { PreviewProject, MusicPreview };
