
import React from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { usePreviewProjects } from '@/hooks/admin/usePreviewProjects';
import PreviewsHeader from '@/components/admin/previews/PreviewsHeader';
import ProjectsListCard from '@/components/admin/previews/ProjectsListCard';
import NewProjectForm from '@/components/admin/previews/NewProjectForm';

const AdminPreviews: React.FC = () => {
  const { projects } = usePreviewProjects();
  
  const scrollToNewForm = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };
  
  return (
    <AdminLayout>
      <div className="flex-1 p-8 overflow-auto">
        <PreviewsHeader scrollToNewForm={scrollToNewForm} />
        <ProjectsListCard projects={projects} />
        <NewProjectForm />
      </div>
    </AdminLayout>
  );
};

export default AdminPreviews;
