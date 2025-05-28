
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import N8nWorkflowGuide from '@/components/admin/guides/N8nWorkflowGuide';
import N8nIntegrationGuide from '@/components/admin/guides/N8nIntegrationGuide';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminIntegrations: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('webhooks');

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Integrações</h1>
            <p className="text-muted-foreground">
              Gerencie webhooks e integrações com serviços externos
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            asChild
          >
            <Link to="/admin-j28s7d1k/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Dashboard
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="webhooks" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="n8n">n8n Workflows</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="api">APIs</TabsTrigger>
          </TabsList>

          <TabsContent value="webhooks" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Webhook de Leads</CardTitle>
                  <CardDescription>
                    Configure o endpoint para receber leads capturados em landing pages
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Configuração de webhook em desenvolvimento.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Webhook de Notificações</CardTitle>
                  <CardDescription>
                    Configure o endpoint para notificações de sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Configuração de webhook em desenvolvimento.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="n8n" className="space-y-6">
            <N8nIntegrationGuide />
          </TabsContent>

          <TabsContent value="email" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuração de Email</CardTitle>
                <CardDescription>
                  Configure os serviços de email para envio de notificações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Configuração de email em desenvolvimento. Em breve estará disponível.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>APIs Externas</CardTitle>
                <CardDescription>
                  Configure integrações com APIs externas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Configuração de APIs em desenvolvimento. Em breve estará disponível.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminIntegrations;
