
import React from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import PortfolioHeader from '@/components/admin/portfolio/PortfolioHeader';
import IntegrationConfig from '@/components/admin/portfolio/IntegrationConfig';
import PortfolioTable from '@/components/admin/portfolio/PortfolioTable';
import AddPortfolioItemForm from '@/components/admin/portfolio/AddPortfolioItemForm';
import { usePortfolioItems } from '@/hooks/usePortfolioItems';

const AdminPortfolio: React.FC = () => {
  const {
    portfolioItems,
    isLoading,
    handleAddItem
  } = usePortfolioItems();

  return (
    <AdminLayout>
      <div className="p-6">
        <PortfolioHeader />
        
        <IntegrationConfig portfolioItems={portfolioItems} />
        
        <PortfolioTable
          portfolioItems={portfolioItems}
          isLoading={isLoading}
        />
        
        <AddPortfolioItemForm onAddItem={handleAddItem} />
      </div>
    </AdminLayout>
  );
};

export default AdminPortfolio;
