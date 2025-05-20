
import React from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import ProjectDetails from '@/components/admin/previews/ProjectDetails';

const PreviewProjectPage: React.FC = () => {
  return (
    <AdminLayout>
      <ProjectDetails />
    </AdminLayout>
  );
};

export default PreviewProjectPage;
