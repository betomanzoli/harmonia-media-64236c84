
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProjectItem, usePreviewProjects } from '@/hooks/admin/usePreviewProjects';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import ProjectsListCard from '@/components/admin/previews/ProjectsListCard';
import ProjectsTable from '@/components/admin/previews/ProjectsTable';
import PreviewsHeader from '@/components/admin/previews/PreviewsHeader';
import NewProjectForm from '@/components/admin/previews/NewProjectForm';
import { initializeMockPreviewData } from '@/utils/mockPreviewsData';
import ProjectDetails from '@/components/admin/previews/ProjectDetails';

const AdminPreviews = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { projects, isLoading, loadProjects, updateProject, addProject, deleteProject } = usePreviewProjects();
  const isProjectDetails = location.pathname.includes('/previews/') && location.pathname.split('/').length > 3;
  const projectId = isProjectDetails ? location.pathname.split('/').pop() : null;
  
  React.useEffect(() => {
    // Initialize with mock data if needed
    if (projects.length === 0) {
      try {
        initializeMockPreviewData();
        loadProjects();
      } catch (error) {
        console.error("Error initializing mock data:", error);
      }
    }
  }, [projects.length, loadProjects]);

  return (
    <AdminLayout>
      {isProjectDetails && projectId ? (
        <ProjectDetails />
      ) : (
        <>
          <PreviewsHeader />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <ProjectsTable projects={projects} />
            </div>
            <div>
              <NewProjectForm onAddProject={addProject} />
              <div className="mt-6">
                <ProjectsListCard projects={projects} isLoading={isLoading} />
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminPreviews;
