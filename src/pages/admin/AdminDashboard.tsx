
import React from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import DashboardContent from '@/components/admin/dashboard/DashboardContent';

const AdminDashboard: React.FC = () => {
  return (
    <AdminLayout>
      <DashboardContent />
    </AdminLayout>
  );
};

export default AdminDashboard;
