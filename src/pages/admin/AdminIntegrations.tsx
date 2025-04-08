
import React from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmailSettingsCard from '@/components/admin/email/EmailSettingsCard';
import EmailTestCard from '@/components/admin/email/EmailTestCard';
import IntegrationConfig from '@/components/admin/portfolio/IntegrationConfig';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import WebhookUrlManager from '@/components/admin/integrations/WebhookUrlManager';

const AdminIntegrations: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-harmonia-green">Integrações</h1>
            <p className="text-muted-foreground">
              Gerencie as integrações e configurações de serviços externos
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
        
        <Tabs defaultValue="email" className="space-y-6">
          <TabsList className="bg-harmonia-light-green/20 text-harmonia-green">
            <TabsTrigger 
              value="email" 
              className="data-[state=active]:bg-harmonia-green data-[state=active]:text-white"
            >
              Email
            </TabsTrigger>
            <TabsTrigger 
              value="webhooks" 
              className="data-[state=active]:bg-harmonia-green data-[state=active]:text-white"
            >
              Webhooks
            </TabsTrigger>
            <TabsTrigger 
              value="chatbot" 
              className="data-[state=active]:bg-harmonia-green data-[state=active]:text-white"
            >
              Chatbot
            </TabsTrigger>
            <TabsTrigger 
              value="storage" 
              className="data-[state=active]:bg-harmonia-green data-[state=active]:text-white"
            >
              Armazenamento
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="email" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <EmailSettingsCard />
              <EmailTestCard />
            </div>
          </TabsContent>
          
          <TabsContent value="webhooks" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <WebhookUrlManager 
                title="Webhook do Portfólio" 
                description="Configure o webhook para notificações de novos itens do portfólio"
                serviceType="portfolio"
                storageUrl="https://drive.google.com/drive/folders/1MJk2diD6Bmb9Q6lNVDPnLePAznerOU29"
              />
              <WebhookUrlManager 
                title="Webhook de Áudios" 
                description="Configure o webhook para notificações de novos áudios"
                serviceType="audio"
                storageUrl="https://drive.google.com/drive/folders/1zOKfHNA7rAihCmEVKZtL191k8XgUsXMg"
              />
              <WebhookUrlManager 
                title="Webhook de Prévias" 
                description="Configure o webhook para notificações de novas prévias"
                serviceType="previews"
                storageUrl="https://drive.google.com/drive/folders/1lLw3oBgNhlpUiYbo3wevgUvjA0RTV7tN"
              />
              <WebhookUrlManager 
                title="Webhook de Pedidos" 
                description="Configure o webhook para notificações de novos pedidos"
                serviceType="orders"
                storageUrl="https://drive.google.com/drive/folders/1brm0ombzUSBzGOdPuj4e0phlU9nKbvbs"
              />
              <WebhookUrlManager 
                title="Webhook de Clientes" 
                description="Configure o webhook para notificações de novos clientes"
                serviceType="customers"
                storageUrl="https://drive.google.com/drive/folders/1fQWdtNPx7pHvMwJfhamtdHBJsdpLkIZZ"
              />
              <WebhookUrlManager 
                title="Webhook de Faturas" 
                description="Configure o webhook para notificações de novas faturas"
                serviceType="invoices"
                storageUrl="https://drive.google.com/drive/folders/1uuhCHv0c5eePU9_m-0BdYiuo0-3vUwVJ"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="chatbot">
            <div className="p-8 text-center border rounded-lg bg-card shadow-md">
              <h3 className="text-xl font-medium mb-4 text-harmonia-green">Configuração do Chatbot</h3>
              <p className="text-muted-foreground mb-4">
                A configuração avançada do chatbot é feita através do Dialogflow.
                Consulte a documentação para mais detalhes.
              </p>
              <div className="flex justify-center gap-4">
                <a 
                  href="/docs/chatbot/dialogflow-setup.md" 
                  target="_blank"
                  className="inline-flex items-center px-4 py-2 border border-harmonia-green bg-white text-harmonia-green hover:bg-harmonia-green/10 rounded-md"
                >
                  Ver Documentação
                </a>
                <a 
                  href="https://dialogflow.cloud.google.com"
                  target="_blank"
                  className="inline-flex items-center px-4 py-2 bg-harmonia-green text-white hover:bg-harmonia-green/90 rounded-md"
                >
                  Acessar Dialogflow
                </a>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="storage" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 border rounded-lg shadow-md bg-white col-span-full">
                <h3 className="text-xl font-medium mb-4 text-harmonia-green">Armazenamento de Arquivos</h3>
                <p className="text-muted-foreground mb-6">
                  Aqui você encontra os links para as pastas compartilhadas no Google Drive onde são armazenados os arquivos do sistema.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <a href="https://drive.google.com/drive/folders/1zOKfHNA7rAihCmEVKZtL191k8XgUsXMg" 
                     target="_blank"
                     className="p-4 border rounded-md hover:bg-harmonia-light-green/10 transition-colors flex flex-col space-y-2">
                    <h4 className="font-medium text-harmonia-green">Banco de Dados de Áudio</h4>
                    <p className="text-sm text-gray-500">Amostras de áudio, músicas e efeitos sonoros</p>
                  </a>
                  
                  <a href="https://drive.google.com/drive/folders/1MJk2diD6Bmb9Q6lNVDPnLePAznerOU29" 
                     target="_blank"
                     className="p-4 border rounded-md hover:bg-harmonia-light-green/10 transition-colors flex flex-col space-y-2">
                    <h4 className="font-medium text-harmonia-green">Portfólio</h4>
                    <p className="text-sm text-gray-500">Trabalhos finalizados e exemplos de projetos</p>
                  </a>
                  
                  <a href="https://drive.google.com/drive/folders/1brm0ombzUSBzGOdPuj4e0phlU9nKbvbs" 
                     target="_blank"
                     className="p-4 border rounded-md hover:bg-harmonia-light-green/10 transition-colors flex flex-col space-y-2">
                    <h4 className="font-medium text-harmonia-green">Lista de Pedidos</h4>
                    <p className="text-sm text-gray-500">Arquivos relacionados a pedidos dos clientes</p>
                  </a>
                  
                  <a href="https://drive.google.com/drive/folders/1fQWdtNPx7pHvMwJfhamtdHBJsdpLkIZZ" 
                     target="_blank"
                     className="p-4 border rounded-md hover:bg-harmonia-light-green/10 transition-colors flex flex-col space-y-2">
                    <h4 className="font-medium text-harmonia-green">Lista de Clientes</h4>
                    <p className="text-sm text-gray-500">Documentos e informações de clientes</p>
                  </a>
                  
                  <a href="https://drive.google.com/drive/folders/1lLw3oBgNhlpUiYbo3wevgUvjA0RTV7tN" 
                     target="_blank"
                     className="p-4 border rounded-md hover:bg-harmonia-light-green/10 transition-colors flex flex-col space-y-2">
                    <h4 className="font-medium text-harmonia-green">Projetos de Prévias</h4>
                    <p className="text-sm text-gray-500">Prévias de projetos em andamento</p>
                  </a>
                  
                  <a href="https://drive.google.com/drive/folders/1uuhCHv0c5eePU9_m-0BdYiuo0-3vUwVJ" 
                     target="_blank"
                     className="p-4 border rounded-md hover:bg-harmonia-light-green/10 transition-colors flex flex-col space-y-2">
                    <h4 className="font-medium text-harmonia-green">Integrações e Faturas</h4>
                    <p className="text-sm text-gray-500">Documentos de integração e faturas</p>
                  </a>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminIntegrations;
