
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
      // Simulate saving
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsUrlSaved(true);
      toast({
        title: "URL salva",
        description: "URL do webhook foi salva com sucesso."
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao salvar URL do webhook.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendTestPing = async () => {
    setIsTesting(true);
    try {
      // Simulate test
      await new Promise(resolve => setTimeout(resolve, 1500));
      setTestResult('Teste enviado com sucesso! Webhook respondeu corretamente.');
    } catch (error) {
      setTestResult('Erro no teste: Webhook não respondeu ou URL inválida.');
    } finally {
      setIsTesting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado",
      description: "URL copiada para área de transferência."
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
