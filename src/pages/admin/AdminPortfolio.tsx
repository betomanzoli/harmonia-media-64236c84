
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import PortfolioHeader from '@/components/admin/portfolio/PortfolioHeader';
import PortfolioTable from '@/components/admin/portfolio/PortfolioTable';
import IntegrationConfig from '@/components/admin/portfolio/IntegrationConfig';
import GoogleDriveGuide from '@/components/admin/portfolio/GoogleDriveGuide';
import AddPortfolioItemForm from '@/components/admin/portfolio/AddPortfolioItemForm';

const AdminPortfolio: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  
  return (
    <AdminLayout>
      <div className="bg-slate-100 p-6 min-h-screen">
        <PortfolioHeader onAdd={() => setShowAddForm(true)} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow">
              <PortfolioTable />
            </div>
            
            {showAddForm && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Adicionar Item ao Portfólio</h2>
                <AddPortfolioItemForm onClose={() => setShowAddForm(false)} />
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Configuração de Integração</h2>
              <IntegrationConfig />
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Guia do Google Drive</h2>
              <GoogleDriveGuide />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPortfolio;
