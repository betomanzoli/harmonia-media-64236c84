import React from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import ClientsList from '@/components/admin/clients/ClientsList';
const AdminClients: React.FC = () => {
  return <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Gerenciamento de Clientes</h1>
        <ClientsList />
      </div>
    </AdminLayout>;
};
export default AdminClients;