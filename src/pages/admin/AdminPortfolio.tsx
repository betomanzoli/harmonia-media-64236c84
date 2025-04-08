
import React from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import PortfolioHeader from '@/components/admin/portfolio/PortfolioHeader';
import IntegrationConfig from '@/components/admin/portfolio/IntegrationConfig';
import PortfolioTable from '@/components/admin/portfolio/PortfolioTable';
import AddPortfolioItemForm from '@/components/admin/portfolio/AddPortfolioItemForm';
import { usePortfolioItems } from '@/hooks/usePortfolioItems';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminPortfolio: React.FC = () => {
  const {
    portfolioItems,
    isLoading,
    handleAddItem
  } = usePortfolioItems();

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <PortfolioHeader />
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin-j28s7d1k/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Dashboard
            </Link>
          </Button>
        </div>
        
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
