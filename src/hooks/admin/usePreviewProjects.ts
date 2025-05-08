
// Import types from the central types file
import { ProjectItem, VersionItem, FeedbackItem } from '@/types/project.types';

// Re-export interfaces so they can be imported from this module
export type { ProjectItem, VersionItem, FeedbackItem };

export const usePreviewProject = (projectId: string | undefined) => {
  // Minimal implementation to satisfy imports
  return {
    project: null,
    isLoading: true,
    addVersion: (projectId: string, version: VersionItem) => {},
    deleteVersion: (projectId: string, versionId: string) => {},
    updateProject: (projectId: string, updates: Partial<ProjectItem>) => {},
    extendDeadline: (projectId: string) => {}
  };
};

export const usePreviewProjects = () => {
  return {
    projects: [] as ProjectItem[],
    isLoading: true,
    error: null,
    reload: () => {},
    getProjectById: (id: string) => null as ProjectItem | null,
    updateProject: (id: string, updates: Partial<ProjectItem>) => {}
  };
};
