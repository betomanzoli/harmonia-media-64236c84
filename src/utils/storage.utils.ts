
import { ProjectItem } from '@/types/preview.types';

export const loadProjectsFromStorage = (): ProjectItem[] | null => {
  try {
    // Check if localStorage is available
    const isLocalStorageAvailable = typeof localStorage !== 'undefined';
    console.log("Is localStorage available:", isLocalStorageAvailable);
    
    if (isLocalStorageAvailable) {
      const stored = localStorage.getItem('harmonIA_projects');
      console.log("Retrieved from localStorage:", stored ? 'Data found' : 'No data');
      
      if (stored) {
        try {
          const parsedProjects = JSON.parse(stored);
          console.log("Successfully parsed projects:", parsedProjects);
          console.log("Projects count:", parsedProjects.length);
          return parsedProjects;
        } catch (parseError) {
          console.error('Error parsing stored projects:', parseError);
        }
      }
    }
    return null;
  } catch (error) {
    console.error('Error loading from storage:', error);
    return null;
  }
};

export const saveProjectsToStorage = (projects: ProjectItem[]): void => {
  try {
    if (typeof localStorage !== 'undefined' && projects.length > 0) {
      localStorage.setItem('harmonIA_projects', JSON.stringify(projects));
      console.log("Projects saved to localStorage:", projects.length);
    }
  } catch (error) {
    console.error('Error saving to storage:', error);
  }
};
