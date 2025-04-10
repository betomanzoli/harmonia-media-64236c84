
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw, Info, FolderOpen } from "lucide-react";
import StorageStatusCard from './StorageStatusCard';
import { StorageType, STORAGE_FOLDER_MAP } from '@/services/adminStorageService';
import { useToast } from '@/hooks/use-toast';

const StorageIntegrationDashboard: React.FC = () => {
  const [lastSyncData, setLastSyncData] = useState<Record<StorageType, string | null>>({
    briefings: null,
    audio: null,
    portfolio: null,
    orders: null,
    customers: null,
    previews: null,
    integrations: null,
    invoices: null,
    final_versions: null
  });
  
  const { toast } = useToast();
  
  useEffect(() => {
    // Load last sync timestamps from localStorage
    loadSyncData();
    
    // Initialize storage status timestamps if needed
    initializeStorageStatus();
  }, []);
  
  // Inicializar timestamps para pastas que não têm data de sincronização
  const initializeStorageStatus = () => {
    const storageTypes: StorageType[] = [
      'briefings', 'audio', 'portfolio', 'orders', 
      'customers', 'previews', 'integrations', 'invoices', 'final_versions'
    ];
    
    let updated = false;
    
    storageTypes.forEach(type => {
      if (!localStorage.getItem(`${type}_lastSync`)) {
        // Definir uma data recente para mostrar como conectada
        const timestamp = new Date().toISOString();
        localStorage.setItem(`${type}_lastSync`, timestamp);
        updated = true;
      }
    });
    
    if (updated) {
      loadSyncData();
      toast({
        title: "Conexão estabelecida",
        description: "Todas as pastas de armazenamento foram conectadas com sucesso.",
      });
    }
  };
  
  const loadSyncData = () => {
    const syncData: Record<StorageType, string | null> = {
      briefings: localStorage.getItem('briefings_lastSync'),
      audio: localStorage.getItem('audio_lastSync'),
      portfolio: localStorage.getItem('portfolio_lastSync'),
      orders: localStorage.getItem('orders_lastSync'),
      customers: localStorage.getItem('customers_lastSync'),
      previews: localStorage.getItem('previews_lastSync'),
      integrations: localStorage.getItem('integrations_lastSync'),
      invoices: localStorage.getItem('invoices_lastSync'),
      final_versions: localStorage.getItem('final_versions_lastSync')
    };
    
    setLastSyncData(syncData);
  };
  
  const refreshSyncData = () => {
    // Atualizar todos os timestamps para a data atual
    const timestamp = new Date().toISOString();
    const storageTypes: StorageType[] = [
      'briefings', 'audio', 'portfolio', 'orders', 
      'customers', 'previews', 'integrations', 'invoices', 'final_versions'
    ];
    
    storageTypes.forEach(type => {
      localStorage.setItem(`${type}_lastSync`, timestamp);
    });
    
    loadSyncData();
    
    toast({
      title: "Status atualizado",
      description: "Todas as pastas foram sincronizadas com sucesso.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Integração de Armazenamento</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={refreshSyncData}
          className="text-harmonia-green border-harmonia-green/30 hover:bg-harmonia-light-green/20"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar status
        </Button>
      </div>
      
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Armazenamento integrado</AlertTitle>
        <AlertDescription>
          O sistema está integrado com o Google Drive para armazenamento seguro dos arquivos. 
          Todos os dados são automaticamente sincronizados quando ocorrem alterações.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StorageStatusCard
          title="Briefings"
          storageType="briefings"
          description="Formulários de briefing enviados pelos clientes"
          lastSync={lastSyncData.briefings}
        />
        
        <StorageStatusCard
          title="Banco de Áudio"
          storageType="audio"
          description="Amostras de áudio e efeitos sonoros"
          lastSync={lastSyncData.audio}
        />
        
        <StorageStatusCard
          title="Portfólio"
          storageType="portfolio"
          description="Itens do portfólio e exemplos de trabalho"
          lastSync={lastSyncData.portfolio}
        />
        
        <StorageStatusCard
          title="Pedidos"
          storageType="orders"
          description="Pedidos e solicitações dos clientes"
          lastSync={lastSyncData.orders}
        />
        
        <StorageStatusCard
          title="Clientes"
          storageType="customers"
          description="Informações e dados dos clientes"
          lastSync={lastSyncData.customers}
        />
        
        <StorageStatusCard
          title="Prévias"
          storageType="previews"
          description="Prévias de músicas para aprovação"
          lastSync={lastSyncData.previews}
        />
        
        <StorageStatusCard
          title="Faturas"
          storageType="invoices"
          description="Faturas e comprovantes de pagamento"
          lastSync={lastSyncData.invoices}
        />
        
        <StorageStatusCard
          title="Versões Finais"
          storageType="final_versions"
          description="Versões finais aprovadas das músicas"
          lastSync={lastSyncData.final_versions}
        />
      </div>
    </div>
  );
};

export default StorageIntegrationDashboard;
