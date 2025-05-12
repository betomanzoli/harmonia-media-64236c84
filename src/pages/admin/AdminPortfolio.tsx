
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
import WebhookUrlManager from '@/components/admin/integrations/WebhookUrlManager';
import GoogleDriveGuide from '@/components/admin/portfolio/GoogleDriveGuide';

const AdminPortfolio: React.FC = () => {
  const {
    portfolioItems,
    isLoading,
    handleAddItem
  } = usePortfolioItems();

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-harmonia-green">Portfólio</h1>
            <p className="text-muted-foreground">
              Gerencie os itens do portfólio e suas integrações
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            asChild
            className="border-harmonia-green text-harmonia-green hover:bg-harmonia-green/10"
          >
            <Link to="/admin-j28s7d1k/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Dashboard
            </Link>
          </Button>
        </div>
        
        <GoogleDriveGuide />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <IntegrationConfig portfolioItems={portfolioItems} />
          </div>
          <div>
            <WebhookUrlManager 
              title="Integração do Portfólio" 
              description="Configure o webhook para notificações de novos itens do portfólio"
              serviceType="portfolio"
              storageUrl="https://drive.google.com/drive/folders/1MJk2diD6Bmb9Q6lNVDPnLePAznerOU29"
            />
          </div>
        </div>
        
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
