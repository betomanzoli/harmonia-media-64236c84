
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabase';

interface WebhookConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WebhookConfigDialog: React.FC<WebhookConfigDialogProps> = ({
  open,
  onOpenChange
}) => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    if (open) {
      loadWebhookConfig();
    }
  }, [open]);

  const loadWebhookConfig = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', 'marketing_webhook_url')
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data?.value?.url) {
        setWebhookUrl(data.value.url);
      }
    } catch (error) {
      console.error('Error loading webhook config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveWebhookConfig = async () => {
    if (!webhookUrl.trim()) {
      toast({
        title: "URL inválida",
        description: "Por favor, insira uma URL válida para o webhook.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Check if setting exists
      const { data: existingData, error: fetchError } = await supabase
        .from('system_settings')
        .select('id')
        .eq('key', 'marketing_webhook_url')
        .maybeSingle();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }
      
      if (existingData?.id) {
        // Update existing setting
        const { error } = await supabase
          .from('system_settings')
          .update({ 
            value: { url: webhookUrl },
            updated_at: new Date().toISOString()
          })
          .eq('id', existingData.id);
        
        if (error) throw error;
      } else {
        // Create new setting
        const { error } = await supabase
          .from('system_settings')
          .insert([{ 
            key: 'marketing_webhook_url',
            value: { url: webhookUrl }
          }]);
        
        if (error) throw error;
      }
      
      toast({
        title: "Webhook configurado",
        description: "A URL do webhook foi salva com sucesso"
      });
      
      // Also save to localStorage as fallback
      localStorage.setItem('marketing_webhook_url', webhookUrl);
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving webhook config:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a configuração do webhook",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testWebhook = async () => {
    if (!webhookUrl.trim()) {
      toast({
        title: "URL não configurada",
        description: "Configure uma URL de webhook antes de testar.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    setTestResponse(null);
    
    try {
      const testPayload = {
        type: 'test_message',
        data: { 
          message: "Teste de conexão do harmonIA",
          timestamp: new Date().toISOString()
        }
      };
      
      // Use no-cors to handle CORS issues
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testPayload),
        mode: 'no-cors'
      });
      
      setTestResponse('Solicitação enviada. Verifique os logs do n8n para confirmar recebimento.');
      
      toast({
        title: "Teste enviado",
        description: "Teste enviado para o webhook configurado"
      });
    } catch (error) {
      console.error('Error testing webhook:', error);
      setTestResponse(`Erro ao testar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      
      toast({
        title: "Erro no teste",
        description: "Não foi possível testar o webhook",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configurar Webhook</DialogTitle>
          <DialogDescription>
            Configure a URL do webhook do n8n para integração com leads e notificações.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">URL do Webhook</Label>
            <Input
              id="webhook-url"
              placeholder="https://n8n.example.com/webhook/..."
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
            />
          </div>
          
          <div className="text-sm text-gray-500">
            <p>
              Esta URL será usada para enviar os dados de leads capturados nas landing pages
              conversacionais e outras notificações para automação no n8n.
            </p>
          </div>
          
          {testResponse && (
            <div className="text-sm p-3 bg-slate-100 rounded-md">
              <p className="font-medium">Resultado do teste:</p>
              <p className="mt-1">{testResponse}</p>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={testWebhook}
            disabled={isLoading || !webhookUrl.trim()}
            type="button"
          >
            {isLoading ? 'Testando...' : 'Testar Webhook'}
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              onClick={saveWebhookConfig}
              disabled={isLoading || !webhookUrl.trim()}
            >
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WebhookConfigDialog;
