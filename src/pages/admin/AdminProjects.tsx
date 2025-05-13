import React from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import ProjectsList from '@/components/admin/projects/ProjectsList';
const AdminProjects: React.FC = () => {
  return <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Gerenciamento de Projetos</h1>
        <ProjectsList />
      </div>
    </AdminLayout>;
};
export default AdminProjects;