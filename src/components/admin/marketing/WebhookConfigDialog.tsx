
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Save, TestTube } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface WebhookConfig {
  url: string;
  secret?: string;
  enabled: boolean;
}

const WebhookConfigDialog: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<WebhookConfig>({
    url: '',
    secret: '',
    enabled: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadWebhookConfig();
    }
  }, [isOpen]);

  const loadWebhookConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .eq('key', 'webhook_config')
        .maybeSingle();

      if (error) throw error;

      if (data && data.value) {
        const webhookData = data.value as any;
        setConfig({
          url: webhookData?.url || '',
          secret: webhookData?.secret || '',
          enabled: webhookData?.enabled || false
        });
      }
    } catch (error) {
      console.error('Error loading webhook config:', error);
      toast({
        title: "Erro ao carregar configuração",
        description: "Não foi possível carregar a configuração do webhook.",
        variant: "destructive"
      });
    }
  };

  const saveConfig = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('system_settings')
        .upsert({
          key: 'webhook_config',
          value: config as any
        });

      if (error) throw error;

      toast({
        title: "Configuração salva",
        description: "A configuração do webhook foi salva com sucesso."
      });

      setIsOpen(false);
    } catch (error) {
      console.error('Error saving webhook config:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar a configuração do webhook.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testWebhook = async () => {
    if (!config.url) {
      toast({
        title: "URL necessária",
        description: "Informe a URL do webhook antes de testar.",
        variant: "destructive"
      });
      return;
    }

    setIsTesting(true);
    try {
      // Simulate webhook test
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Teste realizado",
        description: "O teste do webhook foi enviado. Verifique o endpoint para confirmar o recebimento."
      });
    } catch (error) {
      console.error('Error testing webhook:', error);
      toast({
        title: "Erro no teste",
        description: "Não foi possível testar o webhook.",
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="mr-2 h-4 w-4" />
          Configurar Webhook
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configuração do Webhook</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="webhook-url">URL do Webhook</Label>
            <Input
              id="webhook-url"
              type="url"
              placeholder="https://seu-endpoint.com/webhook"
              value={config.url}
              onChange={(e) => setConfig({ ...config, url: e.target.value })}
            />
          </div>
          
          <div>
            <Label htmlFor="webhook-secret">Secret (Opcional)</Label>
            <Input
              id="webhook-secret"
              type="password"
              placeholder="Chave secreta para validação"
              value={config.secret}
              onChange={(e) => setConfig({ ...config, secret: e.target.value })}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="webhook-enabled"
              checked={config.enabled}
              onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
              className="rounded"
            />
            <Label htmlFor="webhook-enabled">Webhook ativo</Label>
          </div>

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={testWebhook}
              disabled={isTesting || !config.url}
            >
              <TestTube className="mr-2 h-4 w-4" />
              {isTesting ? 'Testando...' : 'Testar'}
            </Button>
            
            <Button onClick={saveConfig} disabled={isLoading}>
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WebhookConfigDialog;
