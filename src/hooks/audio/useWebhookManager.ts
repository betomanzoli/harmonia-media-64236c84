
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import webhookService from '@/services/webhookService';

export function useWebhookManager() {
  const [webhookUrl, setWebhookUrl] = useState<string>('');
  const { toast } = useToast();

  // Load webhook URL from storage
  const loadWebhookUrl = async () => {
    const url = await webhookService.getWebhookUrl();
    setWebhookUrl(url || '');
    return url;
  };

  // Save webhook URL
  const saveWebhookUrl = async () => {
    const result = await webhookService.saveWebhookUrl(webhookUrl);
    
    if (result) {
      toast({
        title: "URL do webhook salva",
        description: "A URL do webhook foi configurada com sucesso.",
      });
    } else {
      toast({
        title: "Erro ao salvar URL",
        description: "Não foi possível salvar a URL do webhook.",
        variant: "destructive",
      });
    }
    
    return result;
  };

  return {
    webhookUrl,
    setWebhookUrl,
    loadWebhookUrl,
    saveWebhookUrl
  };
}
