
import React from 'react';
import PortfolioHeader from '@/components/admin/portfolio/PortfolioHeader';
import IntegrationConfig from '@/components/admin/portfolio/IntegrationConfig';
import PortfolioTable from '@/components/admin/portfolio/PortfolioTable';
import AddPortfolioItemForm from '@/components/admin/portfolio/AddPortfolioItemForm';
import { usePortfolioItems } from '@/hooks/usePortfolioItems';

const AdminPortfolio: React.FC = () => {
  const {
    portfolioItems,
    isLoading,
    webhookUrl,
    setWebhookUrl,
    saveWebhookUrl,
    handleAddItem,
    copyToClipboard
  } = usePortfolioItems();

  return (
    <div className="container mx-auto py-20 px-4">
      <PortfolioHeader />
      
      <IntegrationConfig
        webhookUrl={webhookUrl}
        setWebhookUrl={setWebhookUrl}
        saveWebhookUrl={saveWebhookUrl}
        copyToClipboard={copyToClipboard}
        portfolioItems={portfolioItems}
      />
      
      <PortfolioTable
        portfolioItems={portfolioItems}
        isLoading={isLoading}
      />
      
      <AddPortfolioItemForm onAddItem={handleAddItem} />
    </div>
  );
};

export default AdminPortfolio;
