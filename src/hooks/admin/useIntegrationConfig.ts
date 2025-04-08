
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import webhookService, { NotificationType } from '@/services/webhookService';

export function useIntegrationConfig() {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isUrlSaved, setIsUrlSaved] = useState(false);
  const { toast } = useToast();

  // Load webhook URL on initialization
  useEffect(() => {
    async function loadWebhookUrl() {
      setIsLoading(true);
      const url = await webhookService.getWebhookUrl();
      if (url) {
        setWebhookUrl(url);
        setIsUrlSaved(true);
      }
      setIsLoading(false);
    }

    loadWebhookUrl();
  }, []);

  // Save webhook URL
  const saveWebhookUrl = async () => {
    setIsLoading(true);
    
    try {
      const success = await webhookService.saveWebhookUrl(webhookUrl);
      
      if (success) {
        setIsUrlSaved(true);
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
      console.error('Erro ao salvar webhook:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to send a test ping to the webhook
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
        type: 'test_message' as NotificationType,
        data: { 
          testMessage: "Este é um teste de configuração do webhook da harmonIA",
          timestamp: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      };
      
      console.log('Enviando ping de teste para:', webhookUrl);
      console.log('Payload:', testPayload);
      
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
      console.error('Erro ao testar webhook:', error);
    } finally {
      setIsTesting(false);
    }
  };

  // Function to copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: 'Copiado!',
        description: 'Texto copiado para a área de transferência.',
      });
    });
  };

  return {
    webhookUrl,
    setWebhookUrl,
    saveWebhookUrl,
    sendTestPing,
    isLoading,
    isTesting,
    isUrlSaved,
    copyToClipboard
  };
}
