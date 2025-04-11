
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Clipboard, ExternalLink, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import webhookService from '@/services/webhookService';

interface WebhookUrlManagerProps {
  title: string;
  description?: string;
  serviceType: string;
  storageUrl?: string;
}

const WebhookUrlManager: React.FC<WebhookUrlManagerProps> = ({
  title,
  description,
  serviceType,
  storageUrl
}) => {
  const [webhookUrl, setWebhookUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Load saved webhook URL on component mount
  useEffect(() => {
    const loadSavedUrl = async () => {
      setIsLoading(true);
      const savedUrl = await webhookService.getWebhookUrl();
      if (savedUrl) {
        setWebhookUrl(savedUrl);
        setIsConfigured(true);
      }
      setIsLoading(false);
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
      const success = await webhookService.saveWebhookUrl(webhookUrl);
      
      if (success) {
        setIsConfigured(true);
        toast({
          title: "Configuração salva",
          description: "URL do webhook foi salva com sucesso.",
        });
      } else {
        toast({
          title: "Erro ao salvar",
          description: "Não foi possível salvar a URL do webhook.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro ao salvar webhook:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a configuração.",
        variant: "destructive"
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
        type: 'test_message',
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
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Texto copiado para a área de transferência.",
    });
  };
  
  const openExternalUrl = (url: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-md font-medium flex items-center justify-between">
          {title}
          {isConfigured && <Badge className="bg-harmonia-green text-white">Configurado</Badge>}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex">
              <Input
                placeholder="URL do webhook para integrações"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="flex-1"
              />
              <Button 
                variant="outline"
                className="ml-2"
                disabled={isLoading}
                onClick={saveWebhookUrl}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar"}
              </Button>
            </div>
            
            <div className="flex gap-2 mt-3">
              <Button 
                variant="outline" 
                size="sm"
                disabled={!webhookUrl || isTesting} 
                onClick={sendTestWebhook}
                className="text-xs"
              >
                {isTesting ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Send className="h-3 w-3 mr-1" />}
                Enviar teste
              </Button>
              
              {storageUrl && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => openExternalUrl(storageUrl)}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Abrir pasta
                </Button>
              )}
              
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={() => copyToClipboard("Integração de webhook configurada com sucesso!")}
              >
                <Clipboard className="h-3 w-3 mr-1" />
                Copiar status
              </Button>
            </div>
          </div>
          
          {isConfigured && (
            <div className="text-xs text-gray-500">
              Última atualização: {new Date().toLocaleDateString('pt-BR', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WebhookUrlManager;
