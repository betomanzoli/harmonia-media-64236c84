
import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProjectItem } from '@/types/preview.types';
import { usePreviewProjects } from '@/hooks/admin/usePreviewProjects';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import ProjectsListCard from '@/components/admin/previews/ProjectsListCard';
import ProjectsTable from '@/components/admin/previews/ProjectsTable';
import PreviewsHeader from '@/components/admin/previews/PreviewsHeader';
import NewProjectForm from '@/components/admin/previews/NewProjectForm';
import { initializeMockPreviewData } from '@/utils/mockPreviewsData';
import ProjectDetails from '@/components/admin/previews/ProjectDetails';
import { useToast } from '@/hooks/use-toast';

const AdminPreviews = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { projects, isLoading, loadProjects, updateProject, addProject, deleteProject } = usePreviewProjects();
  const isProjectDetails = location.pathname.includes('/previews/') && location.pathname.split('/').length > 3;
  const projectId = isProjectDetails ? location.pathname.split('/').pop() : null;
  const newProjectFormRef = useRef<HTMLDivElement>(null);
  
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

  const scrollToNewForm = () => {
    if (newProjectFormRef.current) {
      newProjectFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDeleteProject = (id: string) => {
    try {
      deleteProject(id);
      toast({
        title: "Projeto excluído",
        description: `O projeto foi excluído com sucesso.`
      });
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir o projeto.",
        variant: "destructive"
      });
    }
  };

  const handleSendReminder = (id: string) => {
    // Implementation for sending reminder would go here
    toast({
      title: "Lembrete enviado",
      description: `Um lembrete foi enviado ao cliente.`
    });
  };

  return (
    <AdminLayout>
      {isProjectDetails && projectId ? (
        <ProjectDetails />
      ) : (
        <>
          <PreviewsHeader scrollToNewForm={scrollToNewForm} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <ProjectsTable 
                projects={projects} 
                isLoading={isLoading} 
                onDelete={handleDeleteProject}
                onSendReminder={handleSendReminder}
              />
            </div>
            <div>
              <div ref={newProjectFormRef}>
                <NewProjectForm onAddProject={addProject} />
              </div>
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
