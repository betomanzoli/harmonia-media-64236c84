
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import webhookService, { NotificationType } from '@/services/webhookService';

export function useWebhookManager(serviceType: string) {
  const [webhookUrl, setWebhookUrl] = useState<string>('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load the webhook URL when the component mounts
    const loadUrl = async () => {
      const url = await webhookService.getWebhookUrl() || '';
      setWebhookUrl(url);
    };
    
    loadUrl();
  }, [serviceType]);

  // Save the webhook URL
  const saveWebhookUrl = async () => {
    if (!webhookUrl) {
      toast({
        title: "URL não informada",
        description: "Por favor, informe uma URL de webhook válida.",
        variant: "destructive",
      });
      return false;
    }
    
    const success = await webhookService.saveWebhookUrl(webhookUrl);
    
    if (success) {
      toast({
        title: "URL do webhook salva",
        description: "A URL do webhook foi configurada com sucesso.",
      });
    }
    
    return success;
  };

  // Send data to the webhook
  const sendToWebhook = async (data: any): Promise<boolean> => {
    try {
      if (!webhookUrl) {
        console.error("URL do webhook não configurada");
        return false;
      }
      
      setIsSending(true);
      
      // Create the payload
      const payload = {
        type: 'test_message' as NotificationType,
        data: {
          ...data,
          serviceType,
          timestamp: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      };
      
      console.log(`Enviando dados para webhook ${serviceType}:`, webhookUrl);
      
      // Send data to the webhook
      const result = await webhookService.sendToWebhook(webhookUrl, payload);
      
      if (result) {
        toast({
          title: "Dados enviados",
          description: "Os dados foram enviados para o serviço externo.",
        });
      }
      
      return result;
    } catch (error) {
      console.error("Erro ao enviar para webhook:", error);
      
      toast({
        title: "Erro no envio",
        description: "Não foi possível enviar os dados para o serviço externo.",
        variant: "destructive",
      });
      
      return false;
    } finally {
      setIsSending(false);
    }
  };

  return {
    webhookUrl,
    setWebhookUrl,
    isSending,
    saveWebhookUrl,
    sendToWebhook
  };
}
