
import React from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import ProjectsList from '@/components/admin/projects/ProjectsList';
import { useNavigate } from 'react-router-dom';

const AdminProjects: React.FC = () => {
  const navigate = useNavigate();
  
  const handleEditProject = (projectId: string) => {
    // Ensure consistent ID format by trimming and checking for case issues
    if (!projectId) {
      console.error('Invalid project ID provided to handleEditProject');
      return;
    }
    
    const formattedId = projectId.trim();
    console.log(`Navigating to project details: ${formattedId}`);
    navigate(`/admin-j28s7d1k/previews/${formattedId}`);
  };
  
  return <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Gerenciamento de Projetos</h1>
        <ProjectsList onEditProject={handleEditProject} />
      </div>
    </AdminLayout>;
};

export default AdminProjects;
