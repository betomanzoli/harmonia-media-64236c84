
import React from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import InvoicesList from '@/components/admin/invoices/InvoicesList';

const AdminInvoices: React.FC = () => {
  return (
    <AdminLayout>
      <div className="p-6 bg-gray-800 text-white">
        <h1 className="text-3xl font-bold mb-6">Gerenciamento de Faturas</h1>
        <InvoicesList />
      </div>
    </AdminLayout>
  );
};

export default AdminInvoices;
