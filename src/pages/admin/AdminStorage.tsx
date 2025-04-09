
import React from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import StorageIntegrationDashboard from '@/components/admin/storage/StorageIntegrationDashboard';
import StorageLinks from '@/components/admin/storage/StorageLinks';

const AdminStorage: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-harmonia-green">Armazenamento</h1>
            <p className="text-muted-foreground">
              Gerencie o armazenamento de arquivos e a integração com o Google Drive
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
        
        <div className="space-y-8">
          <StorageIntegrationDashboard />
          <StorageLinks />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminStorage;
