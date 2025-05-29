
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useIntegrationConfig = (serviceType: string) => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isUrlSaved, setIsUrlSaved] = useState(false);
  const [testResult, setTestResult] = useState('');
  const { toast } = useToast();

  const saveWebhookUrl = async () => {
    setIsLoading(true);
    try {
      // Simulate saving to storage
      localStorage.setItem(`webhook_${serviceType}`, webhookUrl);
      setIsUrlSaved(true);
      toast({
        title: "Webhook salvo",
        description: "URL do webhook foi salva com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o webhook.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendTestPing = async () => {
    setIsTesting(true);
    try {
      // Simulate test ping
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTestResult("Teste enviado com sucesso!");
    } catch (error) {
      setTestResult("Falha no teste - verifique a URL");
    } finally {
      setIsTesting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado",
      description: "URL copiada para a área de transferência.",
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
    testResult,
    copyToClipboard
  };
};
