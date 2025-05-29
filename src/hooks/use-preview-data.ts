
import { useState, useEffect } from 'react';
import { ProjectItem, usePreviewProjects } from '@/hooks/admin/usePreviewProjects';

export const usePreviewData = () => {
  const { projects } = usePreviewProjects();
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0]);
    }
  }, [projects, selectedProject]);

  return {
    projects,
    selectedProject,
    setSelectedProject
  };
};
