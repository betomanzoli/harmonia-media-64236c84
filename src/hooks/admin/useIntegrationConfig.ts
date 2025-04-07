
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import webhookService from '@/services/webhookService';

export function useIntegrationConfig() {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Carregar a URL do webhook ao inicializar
  useEffect(() => {
    async function loadWebhookUrl() {
      setIsLoading(true);
      const url = await webhookService.getWebhookUrl();
      if (url) {
        setWebhookUrl(url);
      }
      setIsLoading(false);
    }

    loadWebhookUrl();
  }, []);

  // Salvar a URL do webhook
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
      console.error('Erro ao salvar webhook:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para copiar texto para a área de transferência
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
    isLoading,
    copyToClipboard
  };
}
