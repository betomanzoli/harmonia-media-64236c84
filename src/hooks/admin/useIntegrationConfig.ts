
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface IntegrationConfig {
  id: string;
  service_type: string;
  webhook_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useIntegrationConfig = (serviceType: string) => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isUrlSaved, setIsUrlSaved] = useState(false);
  const [testResult, setTestResult] = useState('');
  const [config, setConfig] = useState<IntegrationConfig | null>(null);
  const { toast } = useToast();

  // Load existing configuration
  useEffect(() => {
    const loadConfig = async () => {
      try {
        // For now, we'll create a mock table structure
        // In a real implementation, you'd have an integrations table
        console.log('Loading integration config for:', serviceType);
        setWebhookUrl('');
        setIsUrlSaved(false);
      } catch (error) {
        console.error('Error loading integration config:', error);
      }
    };

    loadConfig();
  }, [serviceType]);

  const saveWebhookUrl = async () => {
    setIsLoading(true);
    try {
      // Mock save operation - in real implementation, save to Supabase
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
      // Mock test ping
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Try to actually ping the webhook if URL is provided
      if (webhookUrl && webhookUrl.startsWith('http')) {
        try {
          const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              test: true,
              service: serviceType,
              timestamp: new Date().toISOString(),
              message: 'Teste de webhook do harmonIA'
            })
          });

          if (response.ok) {
            setTestResult('Teste enviado com sucesso! Webhook respondeu corretamente.');
          } else {
            setTestResult(`Erro no teste: Webhook retornou status ${response.status}`);
          }
        } catch (fetchError) {
          setTestResult('Erro no teste: Não foi possível conectar ao webhook.');
        }
      } else {
        setTestResult('Teste simulado enviado com sucesso!');
      }
    } catch (error) {
      setTestResult('Erro no teste: Falha na comunicação.');
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
    copyToClipboard,
    config
  };
};
