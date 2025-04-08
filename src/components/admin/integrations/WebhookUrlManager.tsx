
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ExternalLink, Copy, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import webhookService from '@/services/webhookService';

interface WebhookUrlManagerProps {
  title?: string;
  description?: string;
  serviceType: 'portfolio' | 'audio' | 'previews' | 'orders' | 'customers' | 'invoices';
  storageUrl?: string;
}

const WebhookUrlManager: React.FC<WebhookUrlManagerProps> = ({ 
  title = "Configuração de Webhook", 
  description = "Configure a URL do webhook para integrações externas",
  serviceType,
  storageUrl
}) => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadWebhookUrl = async () => {
      setIsLoading(true);
      try {
        const url = await webhookService.getWebhookUrl();
        if (url) {
          setWebhookUrl(url);
        }
      } catch (error) {
        console.error('Erro ao carregar URL do webhook:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWebhookUrl();
  }, []);

  const saveWebhookUrl = async () => {
    setIsLoading(true);
    try {
      const success = await webhookService.saveWebhookUrl(webhookUrl);
      
      if (success) {
        toast({
          title: 'Configuração salva',
          description: 'URL do webhook foi atualizada com sucesso.',
        });
      } else {
        toast({
          title: 'Erro ao salvar',
          description: 'Não foi possível salvar a URL do webhook.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao salvar a configuração.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendTestPing = async () => {
    setIsTesting(true);
    try {
      if (!webhookUrl) {
        toast({
          title: 'URL não configurada',
          description: 'Configure uma URL de webhook antes de enviar um teste.',
          variant: 'destructive',
        });
        return;
      }
      
      // Send test ping
      const testPayload = {
        type: 'test_message' as const,
        data: { 
          testMessage: `Teste de configuração do webhook da harmonIA - ${serviceType}`,
          serviceType,
          timestamp: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      };
      
      const success = await webhookService.sendToWebhook(webhookUrl, testPayload);
      
      if (success) {
        toast({
          title: 'Teste enviado',
          description: 'Ping de teste enviado com sucesso para o webhook.',
        });
      } else {
        toast({
          title: 'Erro ao testar',
          description: 'Não foi possível enviar o teste para o webhook.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao testar o webhook.',
        variant: 'destructive',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: 'Copiado!',
        description: 'Texto copiado para a área de transferência.',
      });
    });
  };

  return (
    <Card className="shadow-md border-harmonia-green/20">
      <CardHeader className="bg-gradient-to-r from-harmonia-light-green to-harmonia-green/10 pb-4">
        <CardTitle className="text-harmonia-green">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`webhook-${serviceType}`} className="font-medium">
            URL do Webhook (Zapier/Make)
          </Label>
          <div className="flex gap-2">
            <Input
              id={`webhook-${serviceType}`}
              type="text"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://hooks.zapier.com/hooks/catch/..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              onClick={saveWebhookUrl} 
              disabled={isLoading}
              variant="default"
              className="bg-harmonia-green hover:bg-harmonia-green/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <Button 
            variant="outline" 
            onClick={sendTestPing}
            disabled={isTesting || !webhookUrl}
            className="border-harmonia-green text-harmonia-green hover:bg-harmonia-green/10"
          >
            {isTesting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando teste...
              </>
            ) : (
              'Enviar Teste'
            )}
          </Button>
          
          {storageUrl && (
            <Button 
              variant="outline"
              className="border-harmonia-green text-harmonia-green hover:bg-harmonia-green/10"
              onClick={() => window.open(storageUrl, '_blank')}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Acessar Armazenamento
            </Button>
          )}
          
          <Button 
            variant="outline"
            className="border-harmonia-green text-harmonia-green hover:bg-harmonia-green/10"
            onClick={() => copyToClipboard(webhookUrl)}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copiar URL
          </Button>
        </div>

        {storageUrl && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200">
            <p className="text-sm font-medium text-gray-700">Armazenamento compartilhado</p>
            <a 
              href={storageUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-harmonia-green hover:underline break-all"
            >
              {storageUrl}
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WebhookUrlManager;
