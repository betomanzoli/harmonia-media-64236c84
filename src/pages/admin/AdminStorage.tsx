
import React from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import StorageIntegrationDashboard from '@/components/admin/storage/StorageIntegrationDashboard';
import StorageLinks from '@/components/admin/storage/StorageLinks';
import WebhookConfigCard from '@/components/admin/storage/WebhookConfigCard';

const AdminStorage: React.FC = () => {
  // Links para pastas de armazenamento
  const storageLinks = [
    {
      title: "Banco de Áudio",
      description: "Acesse os arquivos de áudio armazenados no Google Drive",
      url: "https://drive.google.com/drive/folders/1zOKfHNA7rAihCmEVKZtL191k8XgUsXMg"
    },
    {
      title: "Portfólio",
      description: "Gerenciar exemplos e trabalhos realizados",
      url: "https://drive.google.com/drive/folders/1MJk2diD6Bmb9Q6lNVDPnLePAznerOU29"
    },
    {
      title: "Pedidos",
      description: "Visualizar pedidos e solicitações dos clientes",
      url: "https://drive.google.com/drive/folders/1brm0ombzUSBzGOdPuj4e0phlU9nKbvbs"
    },
    {
      title: "Clientes",
      description: "Dados e informações dos clientes",
      url: "https://drive.google.com/drive/folders/1fQWdtNPx7pHvMwJfhamtdHBJsdpLkIZZ"
    },
    {
      title: "Prévias",
      description: "Versões de teste para aprovação dos clientes",
      url: "https://drive.google.com/drive/folders/1lLw3oBgNhlpUiYbo3wevgUvjA0RTV7tN"
    },
    {
      title: "Versões Finais",
      description: "Músicas finalizadas e aprovadas",
      url: "https://drive.google.com/drive/folders/1uuhCHv0c5eePU9_m-0BdYiuo0-3vUwVJ"
    }
  ];

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
          <WebhookConfigCard />
          <StorageLinks links={storageLinks} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminStorage;
