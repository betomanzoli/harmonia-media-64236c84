
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Check, AlertCircle, Clipboard, Send, Save } from "lucide-react";
import webhookService, { NotificationType } from '@/services/webhookService';

const WebhookConfigCard: React.FC = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function loadWebhookUrl() {
      const url = await webhookService.getWebhookUrl();
      if (url) {
        setWebhookUrl(url);
        setIsConfigured(true);
      }
    }
    
    loadWebhookUrl();
  }, []);

  const saveWebhookUrl = async () => {
    if (!webhookUrl.trim()) {
      toast({
        title: "URL não informada",
        description: "Por favor, informe uma URL de webhook válida.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      const result = await webhookService.saveWebhookUrl(webhookUrl);
      
      if (result) {
        setIsConfigured(true);
        toast({
          title: "Webhook configurado",
          description: "A URL do webhook foi salva com sucesso.",
        });
      } else {
        toast({
          title: "Erro ao salvar",
          description: "Não foi possível salvar a URL do webhook.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao salvar webhook:", error);
      toast({
        title: "Erro na configuração",
        description: "Ocorreu um erro ao configurar o webhook.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const testWebhook = async () => {
    if (!webhookUrl.trim()) {
      toast({
        title: "URL não configurada",
        description: "Configure uma URL de webhook antes de testar.",
        variant: "destructive",
      });
      return;
    }
    
    setIsTesting(true);
    
    try {
      const testPayload = {
        type: 'test_message' as NotificationType,
        data: { 
          testMessage: "Este é um teste de configuração do webhook da harmonIA",
          timestamp: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      };
      
      const result = await webhookService.sendToWebhook(webhookUrl, testPayload);
      
      if (result) {
        toast({
          title: "Teste enviado",
          description: "O teste foi enviado com sucesso para o webhook.",
        });
      } else {
        toast({
          title: "Erro no teste",
          description: "Não foi possível enviar o teste para o webhook.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao testar webhook:", error);
      toast({
        title: "Erro no teste",
        description: "Ocorreu um erro ao testar o webhook.",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const copyPayloadExample = () => {
    const example = JSON.stringify({
      type: 'new_order',
      data: {
        id: 'order-123',
        client: 'Nome do Cliente',
        package: 'Premium',
        timestamp: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    }, null, 2);
    
    navigator.clipboard.writeText(example);
    
    toast({
      title: "Exemplo copiado",
      description: "O exemplo de payload foi copiado para a área de transferência.",
    });
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-gradient-to-r from-harmonia-light-green/20 to-harmonia-green/5">
        <div className="flex justify-between items-center">
          <CardTitle className="text-harmonia-green">Configuração de Notificações</CardTitle>
          {isConfigured && (
            <Badge variant="default" className="bg-green-500">
              <Check className="w-3 h-3 mr-1" /> Configurado
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">URL do Webhook</Label>
            <Input
              id="webhook-url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://seu-webhook.com/endpoint"
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Esta URL receberá notificações sempre que houver um novo pedido, briefing ou ação importante no sistema.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={saveWebhookUrl}
              disabled={isSaving}
              className="text-harmonia-green border-harmonia-green hover:bg-harmonia-light-green/20"
              variant="outline"
            >
              {isSaving ? (
                <>Salvando...</>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar URL
                </>
              )}
            </Button>
            
            <Button 
              onClick={testWebhook}
              disabled={isTesting || !isConfigured}
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
              variant="outline"
            >
              {isTesting ? (
                <>Enviando teste...</>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar teste
                </>
              )}
            </Button>
            
            <Button
              onClick={copyPayloadExample}
              variant="ghost"
              className="text-gray-600"
            >
              <Clipboard className="w-4 h-4 mr-2" />
              Copiar exemplo
            </Button>
          </div>
          
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-amber-500 mr-2 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-amber-800">Importante</h4>
                <p className="text-xs text-amber-700">
                  Configure um serviço que possa receber webhooks para integrar com a harmonIA.
                  Plataformas como Zapier, Integromat, ou seu próprio backend podem ser usadas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebhookConfigCard;
