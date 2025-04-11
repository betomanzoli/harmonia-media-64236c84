
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowRight, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import webhookService, { NotificationType } from '@/services/webhookService';

const DEFAULT_WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/22316385/2031hl7/';

const WebhookConfigCard: React.FC = () => {
  const [webhookUrl, setWebhookUrl] = useState<string>(DEFAULT_WEBHOOK_URL);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [isConfigured, setIsConfigured] = useState<boolean>(true); // Default to true since we always have a default URL
  const { toast } = useToast();
  
  useEffect(() => {
    const loadSavedUrl = async () => {
      setIsLoading(true);
      try {
        // Iniciar com o URL padrão do localStorage para evitar estado vazio
        const localUrl = localStorage.getItem('harmonia_webhook_url');
        if (localUrl) {
          setWebhookUrl(localUrl);
          setIsConfigured(true);
        } else {
          // Se não tiver no localStorage, usar o padrão e salvar
          setWebhookUrl(DEFAULT_WEBHOOK_URL);
          localStorage.setItem('harmonia_webhook_url', DEFAULT_WEBHOOK_URL);
          setIsConfigured(true);
        }
        
        // Tentar obter do serviço (que tenta banco de dados)
        const savedUrl = await webhookService.getWebhookUrl();
        if (savedUrl) {
          setWebhookUrl(savedUrl);
          setIsConfigured(true);
        }
      } catch (error) {
        console.error("Erro ao carregar URL do webhook:", error);
        // Em caso de erro, garantir que temos a URL padrão
        setWebhookUrl(DEFAULT_WEBHOOK_URL);
        localStorage.setItem('harmonia_webhook_url', DEFAULT_WEBHOOK_URL);
        setIsConfigured(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSavedUrl();
  }, []);
  
  const saveWebhookUrl = async () => {
    if (!webhookUrl.trim()) {
      toast({
        title: "URL não pode ser vazia",
        description: "Por favor, insira uma URL válida para o webhook.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Salvar no localStorage primeiro para garantir persistência
      localStorage.setItem('harmonia_webhook_url', webhookUrl);
      setIsConfigured(true);
      
      // Tentar salvar usando o serviço (que tenta banco de dados)
      const success = await webhookService.saveWebhookUrl(webhookUrl);
      
      if (success) {
        setIsConfigured(true);
        toast({
          title: "Configuração salva",
          description: "URL do webhook foi salva com sucesso.",
        });
      } else {
        // Mesmo com falha no banco, consideramos configurado pois salvamos no localStorage
        toast({
          title: "Aviso",
          description: "URL salva localmente, mas houve um problema ao salvar no banco de dados.",
        });
      }
    } catch (error) {
      console.error('Erro ao salvar webhook:', error);
      // Mesmo com erro, o localStorage deve ter sido atualizado
      toast({
        title: "Configuração parcial",
        description: "A URL foi salva localmente, mas ocorreu um erro no processo completo.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const sendTestWebhook = async () => {
    if (!webhookUrl.trim()) {
      toast({
        title: "URL não configurada",
        description: "Configure uma URL de webhook antes de enviar um teste.",
        variant: "destructive"
      });
      return;
    }
    
    setIsTesting(true);
    
    try {
      const testPayload = {
        type: 'test_message' as NotificationType,
        data: { message: "Teste de configuração do webhook da harmonIA" },
        timestamp: new Date().toISOString()
      };
      
      const success = await webhookService.sendToWebhook(webhookUrl, testPayload);
      
      if (success) {
        toast({
          title: "Teste enviado",
          description: "Ping de teste enviado com sucesso para o webhook.",
        });
      } else {
        toast({
          title: "Erro ao testar",
          description: "Não foi possível enviar o teste para o webhook.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro ao testar webhook:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao testar o webhook.",
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Configuração de Notificações
          {isConfigured && <Badge className="bg-harmonia-green text-white">Configurado</Badge>}
        </CardTitle>
        <CardDescription>
          Configure a URL do webhook para receber notificações de eventos do sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="URL do webhook (ex: https://hooks.zapier.com/...)"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={saveWebhookUrl}
              disabled={isLoading}
              className="bg-harmonia-green hover:bg-harmonia-green/90 text-white"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar"}
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={sendTestWebhook}
              disabled={!isConfigured || isTesting}
              className="text-harmonia-green border-harmonia-green/30 hover:bg-harmonia-light-green/20"
            >
              {isTesting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
              Enviar teste
            </Button>
            
            <Button 
              variant="outline"
              asChild
              className="text-harmonia-green border-harmonia-green/30 hover:bg-harmonia-light-green/20"
            >
              <a href="https://zapier.com/app/zaps" target="_blank" rel="noopener noreferrer">
                Gerenciar no Zapier
                <ArrowRight className="h-4 w-4 ml-2" />
              </a>
            </Button>
          </div>
          
          <div className="text-sm text-gray-500">
            <p>Use o webhook para integrar com:</p>
            <ul className="list-disc pl-5 mt-1">
              <li>Planilhas do Google</li>
              <li>Automatização de emails</li>
              <li>Notificações no Slack</li>
              <li>Outros serviços via Zapier</li>
            </ul>
          </div>
          
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
            <h4 className="text-amber-800 font-medium mb-2">Importante</h4>
            <p className="text-sm text-amber-700">
              A URL padrão (<code>https://hooks.zapier.com/hooks/catch/22316385/2031hl7/</code>) é 
              usada para receber notificações dos clientes. Para enviar notificações para os clientes, 
              você precisa configurar as integrações na página de Integrações.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebhookConfigCard;
