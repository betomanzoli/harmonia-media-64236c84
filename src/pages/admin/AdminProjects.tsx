
import React from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import ProjectsList from '@/components/admin/projects/ProjectsList';
import { useNavigate } from 'react-router-dom';

const AdminProjects: React.FC = () => {
  const navigate = useNavigate();
  
  const handleEditProject = (projectId: string) => {
    navigate(`/admin-j28s7d1k/previews/${projectId}`);
  };
  
  return <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Gerenciamento de Projetos</h1>
        <ProjectsList onEditProject={handleEditProject} />
      </div>
    </AdminLayout>;
};

export default AdminProjects;
