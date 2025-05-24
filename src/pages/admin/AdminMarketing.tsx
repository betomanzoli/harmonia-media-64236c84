import React, { useState } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { 
  ArrowRight, 
  Plus, 
  MessageCircle, 
  Settings as SettingsIcon,
  UserPlus, 
  BarChart,
  ExternalLink
} from 'lucide-react';
import MarketingLeadsList from '@/components/admin/marketing/MarketingLeadsList';
import WebhookConfigDialog from '@/components/admin/marketing/WebhookConfigDialog';

const AdminMarketing: React.FC = () => {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [isWebhookDialogOpen, setIsWebhookDialogOpen] = useState(false);
  
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-2">Marketing</h1>
        <p className="text-gray-500 mb-6">
          Gerenciamento de campanhas, landing pages e captura de leads
        </p>
        
        <Tabs 
          defaultValue={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-8">
            <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
            <TabsTrigger value="landing-pages">Landing Pages</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="chatbot">Chatbot</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="campaigns" className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Campanhas Ativas</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Campanha
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <CampaignCard 
                title="Lançamento Verão"
                leads={42}
                conversions={12}
                dates="01/12/2023 - 15/01/2024"
              />
              
              <CampaignCard 
                title="Promoção Relâmpago"
                leads={28}
                conversions={8}
                dates="05/02/2024 - 10/02/2024"
              />
              
              <div className="border border-dashed rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                  <Plus className="h-6 w-6 text-gray-500" />
                </div>
                <p className="font-medium">Criar nova campanha</p>
                <p className="text-sm text-gray-500">Defina metas e canais de aquisição</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="landing-pages">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Landing Pages</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Landing Page
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="border rounded-lg overflow-hidden">
                <div className="aspect-video bg-gray-100 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-400">Preview indisponível</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Pacote Premium</h3>
                    <div className="flex items-center">
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">Ativo</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">/pacote-premium-otimizado</p>
                  <div className="flex justify-between mt-4 text-sm">
                    <span className="text-gray-500">Visualizações: 245</span>
                    <span className="text-gray-500">Conversão: 8.2%</span>
                  </div>
                  <div className="mt-4 flex">
                    <Button variant="outline" size="sm" className="mr-2">
                      Editar
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <div className="aspect-video bg-gray-100 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-400">Preview indisponível</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Música Personalizada</h3>
                    <div className="flex items-center">
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">Ativo</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">/musica-personalizada</p>
                  <div className="flex justify-between mt-4 text-sm">
                    <span className="text-gray-500">Visualizações: 312</span>
                    <span className="text-gray-500">Conversão: 12.5%</span>
                  </div>
                  <div className="mt-4 flex">
                    <Button variant="outline" size="sm" className="mr-2">
                      Editar
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="border border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Plus className="h-6 w-6 text-gray-400" />
                </div>
                <p className="font-medium">Nova Landing Page</p>
                <p className="text-sm text-gray-500 text-center mt-1">Crie uma landing page otimizada para conversões</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="leads">
            <div>
              <MarketingLeadsList />
            </div>
          </TabsContent>
          
          <TabsContent value="chatbot">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="border rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Configuração do Chatbot</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="chatbot-name">Nome do Chatbot</Label>
                      <Input
                        id="chatbot-name"
                        defaultValue="Assistente HarmonIA"
                        className="max-w-md"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="welcome-message">Mensagem de boas-vindas</Label>
                      <Input
                        id="welcome-message"
                        defaultValue="Olá! Como posso ajudá-lo hoje com sua música personalizada?"
                        className="max-w-md"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="enable-chatbot" defaultChecked />
                      <Label htmlFor="enable-chatbot">Ativar Chatbot no site</Label>
                    </div>
                    
                    <div className="pt-2">
                      <Button>
                        Salvar Configurações
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Webhooks</h2>
                    <Button onClick={() => setIsWebhookDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Webhook
                    </Button>
                  </div>
                  
                  <p className="text-gray-500 mb-4">
                    Configure webhooks para enviar dados do chatbot para sistemas externos.
                  </p>
                  
                  <div className="border rounded p-3 bg-gray-50 flex justify-between items-center mb-3">
                    <div>
                      <p className="font-medium">Webhook Dialogflow</p>
                      <p className="text-sm text-gray-500">https://dialogflow.googleapis.com/v1/integrations/...</p>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">
                        Configurar
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border rounded p-3 bg-gray-50 flex justify-between items-center">
                    <div>
                      <p className="font-medium">Webhook CRM</p>
                      <p className="text-sm text-gray-500">https://api.example.com/crm/webhook</p>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">
                        Configurar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="border rounded-lg">
                  <div className="p-4 border-b">
                    <h3 className="font-medium">Preview do Chatbot</h3>
                  </div>
                  <div className="p-4 h-[400px] flex flex-col">
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                      <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                          <p className="text-sm">Olá! Como posso ajudá-lo hoje com sua música personalizada?</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <div className="bg-blue-500 text-white rounded-lg p-3 max-w-[80%]">
                          <p className="text-sm">Quero saber mais sobre os pacotes disponíveis</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                          <p className="text-sm">Temos 3 pacotes: Essencial, Profissional e Premium. Cada um com diferentes características. Posso detalhar qual você tem interesse?</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-full flex">
                      <input 
                        type="text" 
                        className="flex-1 py-2 px-4 rounded-full outline-none"
                        placeholder="Digite uma mensagem de teste..."
                      />
                      <button className="p-2 text-blue-500">
                        <ArrowRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 border rounded-lg p-4">
                  <h3 className="font-medium mb-3">Estatísticas do Chatbot</h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-500">Conversas</p>
                      <p className="text-xl font-semibold">247</p>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-500">Taxa de Conversão</p>
                      <p className="text-xl font-semibold">14.2%</p>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-500">Tempo Médio</p>
                      <p className="text-xl font-semibold">2:45</p>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-500">Satisfação</p>
                      <p className="text-xl font-semibold">4.7/5</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="max-w-4xl">
              <div className="border rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Configurações de Marketing</h2>
                
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="analytics-id">ID do Google Analytics</Label>
                    <Input
                      id="analytics-id"
                      placeholder="UA-XXXXXXXXX-X ou G-XXXXXXXXXX"
                      className="max-w-md"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Insira seu ID do Google Analytics para rastrear atividades de marketing.
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="facebook-pixel">ID do Facebook Pixel</Label>
                    <Input
                      id="facebook-pixel"
                      placeholder="XXXXXXXXXXXXXXXXXX"
                      className="max-w-md"
                    />
                  </div>
                  
                  <div className="pt-2">
                    <Label className="mb-2 block">Integrações</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="mailchimp-integration" />
                        <Label htmlFor="mailchimp-integration">
                          Mailchimp
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch id="hubspot-integration" />
                        <Label htmlFor="hubspot-integration">
                          HubSpot
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch id="zapier-integration" />
                        <Label htmlFor="zapier-integration">
                          Zapier
                        </Label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Button>Salvar Configurações</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <WebhookConfigDialog
        open={isWebhookDialogOpen}
        onClose={() => setIsWebhookDialogOpen(false)}
      />
    </AdminLayout>
  );
};

interface CampaignCardProps {
  title: string;
  leads: number;
  conversions: number;
  dates: string;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ 
  title, 
  leads, 
  conversions, 
  dates 
}) => {
  return (
    <div className="border rounded-lg p-6 bg-white">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-lg">{title}</h3>
        <div className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">Ativa</div>
      </div>
      
      <p className="text-sm text-gray-500 mt-1">{dates}</p>
      
      <div className="flex items-center mt-4">
        <div className="mr-6">
          <div className="flex items-center">
            <UserPlus className="h-4 w-4 mr-2 text-blue-500" />
            <span className="font-semibold">{leads}</span>
          </div>
          <p className="text-xs text-gray-500">Leads</p>
        </div>
        
        <div>
          <div className="flex items-center">
            <BarChart className="h-4 w-4 mr-2 text-green-500" />
            <span className="font-semibold">{conversions}</span>
          </div>
          <p className="text-xs text-gray-500">Conversões</p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between">
          <div className="text-sm">
            <span className="text-gray-500">Taxa de conversão:</span>
            <span className="ml-2 font-medium">{Math.round((conversions / leads) * 100)}%</span>
          </div>
          <Button variant="ghost" size="sm">Detalhes</Button>
        </div>
      </div>
    </div>
  );
};

export default AdminMarketing;
