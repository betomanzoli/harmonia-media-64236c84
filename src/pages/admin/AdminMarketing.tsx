
import React from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';

const AdminMarketing: React.FC = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Marketing Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo à seção de marketing. Utilize os submenus para acessar as diferentes funcionalidades.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="border rounded-lg p-6">
            <h2 className="font-semibold text-lg mb-2">Leads</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Gerenciar leads capturados nas campanhas.
            </p>
            <a 
              href="/admin-j28s7d1k/marketing/leads" 
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Ver leads →
            </a>
          </div>
          
          <div className="border rounded-lg p-6">
            <h2 className="font-semibold text-lg mb-2">Campanhas</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Configurar e monitorar campanhas de marketing.
            </p>
            <span className="text-sm text-gray-400">
              Em breve
            </span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminMarketing;
