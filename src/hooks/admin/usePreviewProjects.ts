
// If this file doesn't exist, we'll create it with a minimal interface to satisfy imports
import { ProjectItem, VersionItem } from '@/types/project.types';

// Re-export VersionItem interface so it can be imported from this module
export { VersionItem };

export const usePreviewProject = (projectId: string | undefined) => {
  // Minimal implementation to satisfy imports
  return {
    project: null,
    isLoading: true,
    addVersion: () => {},
    deleteVersion: () => {},
    updateProject: () => {},
    extendDeadline: () => {}
  };
};

export const usePreviewProjects = () => {
  return {
    projects: [],
    isLoading: true,
    error: null,
    reload: () => {}
  };
};
