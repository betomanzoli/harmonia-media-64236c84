
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, Send, Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { n8nIntegrationService } from '@/services/webhookIntegrationService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type WorkflowType = 'preview' | 'payment' | 'briefing' | 'chatbot' | 'feedback';

interface N8nWebhookManagerProps {
  defaultTab?: WorkflowType;
}

const N8nWebhookManager: React.FC<N8nWebhookManagerProps> = ({ defaultTab = 'preview' }) => {
  const [activeTab, setActiveTab] = useState<WorkflowType>(defaultTab);
  const [webhookUrls, setWebhookUrls] = useState<Record<WorkflowType, string>>({
    preview: '',
    payment: '',
    briefing: '',
    chatbot: '',
    feedback: ''
  });
  const [isSaving, setIsSaving] = useState<Record<WorkflowType, boolean>>({
    preview: false,
    payment: false,
    briefing: false,
    chatbot: false,
    feedback: false
  });
  const [isTesting, setIsTesting] = useState<Record<WorkflowType, boolean>>({
    preview: false,
    payment: false,
    briefing: false,
    chatbot: false,
    feedback: false
  });
  const { toast } = useToast();
  
  useEffect(() => {
    const loadWebhookUrls = async () => {
      const types: WorkflowType[] = ['preview', 'payment', 'briefing', 'chatbot', 'feedback'];
      const urls: Record<WorkflowType, string> = {} as Record<WorkflowType, string>;
      
      for (const type of types) {
        urls[type] = await n8nIntegrationService.getWebhookUrl(type);
      }
      
      setWebhookUrls(urls);
    };
    
    loadWebhookUrls();
  }, []);
  
  const saveWebhookUrl = async (type: WorkflowType) => {
    setIsSaving((prev) => ({ ...prev, [type]: true }));
    
    try {
      const success = await n8nIntegrationService.saveWebhookUrl(type, webhookUrls[type]);
      
      if (success) {
        toast({
          title: "URL salva com sucesso",
          description: `A URL do webhook ${type} foi salva.`
        });
      } else {
        toast({
          title: "Erro ao salvar URL",
          description: `Não foi possível salvar a URL do webhook ${type}.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error(`Error saving webhook URL for ${type}:`, error);
      toast({
        title: "Erro",
        description: `Ocorreu um erro ao salvar a URL do webhook ${type}.`,
        variant: "destructive"
      });
    } finally {
      setIsSaving((prev) => ({ ...prev, [type]: false }));
    }
  };
  
  const testWebhook = async (type: WorkflowType) => {
    setIsTesting((prev) => ({ ...prev, [type]: true }));
    
    try {
      let success = false;
      
      switch (type) {
        case 'preview':
          success = await n8nIntegrationService.sendPreviewNotification(
            'test-project-id',
            'Cliente Teste',
            'teste@cliente.com',
            'Projeto Teste',
            [{ id: 'test-version', name: 'Versão de Teste', audioUrl: 'https://example.com/audio.mp3' }]
          );
          break;
        case 'payment':
          success = await n8nIntegrationService.processPaymentNotification(
            'test-payment-id',
            'test-briefing-id',
            'teste@cliente.com',
            'premium',
            299.90
          );
          break;
        case 'briefing':
          success = await n8nIntegrationService.processBriefingSubmission(
            'test-briefing-id',
            'Cliente Teste',
            'teste@cliente.com',
            'premium',
            { testData: true }
          );
          break;
        case 'chatbot':
          success = await n8nIntegrationService.sendChatbotMessage(
            'Mensagem de teste do webhook',
            { userId: 'test-user' }
          );
          break;
        case 'feedback':
          success = await n8nIntegrationService.processFeedbackSubmission(
            'test-project-id',
            'Cliente Teste',
            'teste@cliente.com',
            'Este é um feedback de teste para verificar a integração com n8n',
            'feedback'
          );
          break;
      }
      
      if (success) {
        toast({
          title: "Teste enviado com sucesso",
          description: `O teste do webhook ${type} foi enviado.`
        });
      } else {
        toast({
          title: "Erro ao testar webhook",
          description: `Não foi possível testar o webhook ${type}.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error(`Error testing webhook for ${type}:`, error);
      toast({
        title: "Erro",
        description: `Ocorreu um erro ao testar o webhook ${type}.`,
        variant: "destructive"
      });
    } finally {
      setIsTesting((prev) => ({ ...prev, [type]: false }));
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado",
      description: "URL copiada para a área de transferência."
    });
  };
  
  const handleInputChange = (type: WorkflowType, value: string) => {
    setWebhookUrls((prev) => ({ ...prev, [type]: value }));
  };
  
  const renderWebhookSettings = (type: WorkflowType) => {
    const titles: Record<WorkflowType, string> = {
      preview: 'Notificações de Prévia',
      payment: 'Processamento de Pagamento',
      briefing: 'Submissão de Briefing',
      chatbot: 'Integração com Chatbot',
      feedback: 'Feedback de Cliente'
    };
    
    const descriptions: Record<WorkflowType, string> = {
      preview: 'Webhook para envio de notificações quando novas prévias são disponibilizadas',
      payment: 'Webhook para processamento de pagamentos e notificações',
      briefing: 'Webhook para processamento de novos briefings submetidos',
      chatbot: 'Webhook para integração com chatbot e processamento de mensagens',
      feedback: 'Webhook para processamento de feedback sobre prévias'
    };
    
    const defaultUrls: Record<WorkflowType, string> = {
      preview: 'https://humbrock.app.n8n.cloud/webhook/16ae1112-2469-420d-8fcc-c9569152bd8f/preview',
      payment: 'https://humbrock.app.n8n.cloud/webhook/2469-420d-8fcc-c9569152bd8f/payment',
      briefing: 'https://humbrock.app.n8n.cloud/webhook/3698-5247-931a-dc5478af2c1b/briefing',
      chatbot: 'https://humbrock.app.n8n.cloud/webhook/16ae1112-2469-420d-8fcc-c9569152bd8f/chat',
      feedback: 'https://humbrock.app.n8n.cloud/webhook/7241-f932-8e41-bd674a239c6f/feedback'
    };
    
    return (
      <div className="space-y-4">
        <div className="flex gap-2 items-center">
          <Input
            placeholder={`URL do webhook para ${titles[type]}...`}
            value={webhookUrls[type]}
            onChange={(e) => handleInputChange(type, e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={() => saveWebhookUrl(type)}
            disabled={isSaving[type]}
            className="bg-harmonia-green hover:bg-harmonia-green/90"
          >
            {isSaving[type] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span className="ml-1 hidden md:inline">Salvar</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => copyToClipboard(webhookUrls[type])} 
            className="border-harmonia-green/30 text-harmonia-green hover:bg-harmonia-green/10"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => testWebhook(type)}
            disabled={isTesting[type] || !webhookUrls[type]}
            className="border-harmonia-green/30 text-harmonia-green hover:bg-harmonia-green/10"
          >
            {isTesting[type] ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
            Testar Webhook
          </Button>
          
          <Button
            variant="outline"
            className="border-harmonia-green/30 text-harmonia-green hover:bg-harmonia-green/10"
            asChild
          >
            <a href="https://humbrock.app.n8n.cloud/" target="_blank" rel="noopener noreferrer">
              Abrir n8n
              <ExternalLink className="h-4 w-4 ml-2" />
            </a>
          </Button>
        </div>
        
        <div className="text-xs text-gray-500 mt-2">
          <p>URL padrão: {defaultUrls[type]}</p>
          <p className="mt-1">Descrição: {descriptions[type]}</p>
        </div>
        
        <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm">
          <h4 className="font-medium text-amber-800">Dados enviados para este webhook:</h4>
          <pre className="mt-1 text-xs overflow-x-auto bg-amber-100/50 p-2 rounded">
            {JSON.stringify({
              type: type === 'preview' ? 'preview_approved' : 
                    type === 'payment' ? 'new_customer' :
                    type === 'briefing' ? 'new_portfolio_item' :
                    type === 'chatbot' ? 'client_message' : 'feedback_received',
              data: {
                timestamp: new Date().toISOString(),
                // Specific data examples would be here
              }
            }, null, 2)}
          </pre>
        </div>
      </div>
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuração de Webhooks n8n</CardTitle>
        <CardDescription>
          Configure os endpoints para cada tipo de workflow no n8n
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as WorkflowType)}>
          <TabsList className="mb-4">
            <TabsTrigger value="preview">Prévias</TabsTrigger>
            <TabsTrigger value="payment">Pagamentos</TabsTrigger>
            <TabsTrigger value="briefing">Briefing</TabsTrigger>
            <TabsTrigger value="chatbot">Chatbot</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview">
            {renderWebhookSettings('preview')}
          </TabsContent>
          
          <TabsContent value="payment">
            {renderWebhookSettings('payment')}
          </TabsContent>
          
          <TabsContent value="briefing">
            {renderWebhookSettings('briefing')}
          </TabsContent>
          
          <TabsContent value="chatbot">
            {renderWebhookSettings('chatbot')}
          </TabsContent>
          
          <TabsContent value="feedback">
            {renderWebhookSettings('feedback')}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default N8nWebhookManager;
