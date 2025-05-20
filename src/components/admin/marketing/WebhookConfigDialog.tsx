
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
        .single();
      
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
        title: 'Webhook configurado',
        description: 'A URL do webhook foi salva com sucesso'
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving webhook config:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar a configuração do webhook',
        variant: 'destructive'
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
            Insira a URL do webhook do n8n para envio dos leads capturados.
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
              conversacionais para automação no n8n.
            </p>
          </div>
        </div>
        
        <DialogFooter>
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WebhookConfigDialog;
