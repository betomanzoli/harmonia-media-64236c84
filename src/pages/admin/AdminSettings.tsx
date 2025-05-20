
import React from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WebhookSettings from '@/components/admin/settings/WebhookSettings';
import N8nWorkflowGuide from '@/components/admin/settings/N8nWorkflowGuide';

const AdminSettings: React.FC = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Configurações</h1>
        
        <Tabs defaultValue="webhooks" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="workflow">Workflow n8n</TabsTrigger>
          </TabsList>
          
          <TabsContent value="webhooks">
            <WebhookSettings />
          </TabsContent>
          
          <TabsContent value="workflow">
            <N8nWorkflowGuide />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
