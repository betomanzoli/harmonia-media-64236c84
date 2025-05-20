
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, ExternalLink, MessageSquare } from 'lucide-react';
import webhookService from '@/services/webhookService';

const WebhookSettings: React.FC = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadWebhookUrl = async () => {
      const url = await webhookService.getWebhookUrl();
      setWebhookUrl(url || '');
    };
    
    loadWebhookUrl();
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      await webhookService.saveWebhookUrl(webhookUrl);
      
      toast({
        title: "Configurações salvas",
        description: "URL do webhook foi salva com sucesso."
      });
    } catch (error) {
      console.error('Error saving webhook URL:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar a URL do webhook.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTest = async () => {
    if (!webhookUrl) {
      toast({
        title: "URL não definida",
        description: "Por favor, insira uma URL de webhook válida.",
        variant: "destructive"
      });
      return;
    }
    
    setIsTesting(true);
    
    try {
      const payload = {
        type: "test_message",
        message: "Este é um teste do webhook",
        timestamp: new Date().toISOString()
      };
      
      const result = await webhookService.sendToWebhook(webhookUrl, payload);
      
      if (result) {
        toast({
          title: "Teste enviado",
          description: "O teste do webhook foi enviado com sucesso."
        });
      } else {
        throw new Error("Falha ao enviar o teste");
      }
    } catch (error) {
      console.error('Error testing webhook:', error);
      toast({
        title: "Erro no teste",
        description: "Não foi possível testar o webhook. Verifique a URL e tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Configurações de Webhook</CardTitle>
        <CardDescription>
          Configure o webhook para receber notificações de eventos no sistema (prévias, feedback, etc.)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="webhook-url">URL do Webhook</Label>
          <div className="flex gap-2">
            <Input
              id="webhook-url"
              placeholder="https://seu-n8n-ou-servico.com/webhook/endpoint"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="flex-1"
            />
            
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="shrink-0 min-w-[100px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar
                </>
              )}
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Insira a URL completa do seu endpoint de webhook do n8n, Zapier, Make.com ou outro serviço.
          </p>
        </div>
        
        <div className="pt-4 border-t">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleTest}
              disabled={!webhookUrl || isTesting}
            >
              {isTesting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testando...
                </>
              ) : (
                <>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Testar Webhook
                </>
              )}
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => window.open('https://n8n.io/integrations/webhook/', '_blank')}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Documentação
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebhookSettings;
