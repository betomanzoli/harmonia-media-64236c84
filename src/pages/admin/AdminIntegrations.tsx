
import React from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmailSettingsCard from '@/components/admin/email/EmailSettingsCard';
import EmailTestCard from '@/components/admin/email/EmailTestCard';
import IntegrationConfig from '@/components/admin/portfolio/IntegrationConfig';

const AdminIntegrations: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Integrações</h1>
          <p className="text-muted-foreground">
            Gerencie as integrações e configurações de serviços externos
          </p>
        </div>
        
        <Tabs defaultValue="email" className="space-y-6">
          <TabsList>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="chatbot">Chatbot</TabsTrigger>
          </TabsList>
          
          <TabsContent value="email" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <EmailSettingsCard />
              <EmailTestCard />
            </div>
          </TabsContent>
          
          <TabsContent value="webhooks">
            <IntegrationConfig portfolioItems={[]} />
          </TabsContent>
          
          <TabsContent value="chatbot">
            <div className="p-8 text-center border rounded-lg bg-card">
              <h3 className="text-xl font-medium mb-4">Configuração do Chatbot</h3>
              <p className="text-muted-foreground mb-4">
                A configuração avançada do chatbot é feita através do Dialogflow.
                Consulte a documentação para mais detalhes.
              </p>
              <div className="flex justify-center gap-4">
                <a 
                  href="/docs/chatbot/dialogflow-setup.md" 
                  target="_blank"
                  className="inline-flex items-center px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md"
                >
                  Ver Documentação
                </a>
                <a 
                  href="https://dialogflow.cloud.google.com"
                  target="_blank"
                  className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md"
                >
                  Acessar Dialogflow
                </a>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminIntegrations;
