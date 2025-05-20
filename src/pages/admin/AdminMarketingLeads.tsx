
import React from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import MarketingLeadsList from '@/components/admin/marketing/MarketingLeadsList';

const AdminMarketingLeads: React.FC = () => {
  return (
    <AdminLayout>
      <MarketingLeadsList />
    </AdminLayout>
  );
};

export default AdminMarketingLeads;
