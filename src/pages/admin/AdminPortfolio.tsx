
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import PortfolioHeader from '@/components/admin/portfolio/PortfolioHeader';
import PortfolioTable from '@/components/admin/portfolio/PortfolioTable';
import IntegrationConfig from '@/components/admin/portfolio/IntegrationConfig';
import GoogleDriveGuide from '@/components/admin/portfolio/GoogleDriveGuide';
import AddPortfolioItemForm from '@/components/admin/portfolio/AddPortfolioItemForm';
import { usePortfolioItems } from '@/hooks/usePortfolioItems';
import { useToast } from '@/hooks/use-toast';

const AdminPortfolio: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const { portfolioItems, handleAddItem, isLoading } = usePortfolioItems();
  const { toast } = useToast();
  
  const handleAddPortfolioItem = (item: any) => {
    const id = handleAddItem({...item, persistData: true});
    setShowAddForm(false);
    
    toast({
      title: "Item adicionado",
      description: `O item "${item.title}" foi adicionado ao portfólio`,
    });
    
    return id;
  };
  
  const handleCancel = () => {
    setShowAddForm(false);
  };
  
  return (
    <AdminLayout>
      <div className="bg-slate-900 p-6 min-h-screen text-white">
        <PortfolioHeader onAdd={() => setShowAddForm(true)} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800 rounded-lg shadow">
              <PortfolioTable portfolioItems={portfolioItems} isLoading={isLoading} />
            </div>
            
            {showAddForm && (
              <div className="bg-slate-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Adicionar Item ao Portfólio</h2>
                <AddPortfolioItemForm onAdd={handleAddPortfolioItem} onCancel={handleCancel} />
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Configuração de Integração</h2>
              <IntegrationConfig portfolioItems={portfolioItems} />
            </div>
            
            <div className="bg-slate-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Guia do Google Drive</h2>
              <GoogleDriveGuide />
            </div>
            
            <div className="bg-slate-800 rounded-lg shadow p-6 mt-4">
              <button 
                onClick={() => setShowAddForm(true)}
                className="w-full bg-green-600 text-white rounded-md px-4 py-2 hover:bg-green-700"
              >
                Adicionar Novo Item
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPortfolio;
