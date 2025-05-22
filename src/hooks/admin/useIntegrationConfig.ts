
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import webhookService, { NotificationType } from '@/services/webhookService';

export function useIntegrationConfig(serviceType: string = 'marketing') {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isUrlSaved, setIsUrlSaved] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const { toast } = useToast();
  const { getSetting, saveSetting } = useSystemSettings();

  // Determinar a chave de configuração com base no tipo de serviço
  const getSettingKey = () => {
    switch (serviceType) {
      case 'marketing':
      case 'leads':
        return 'marketing_webhook_url';
      case 'notifications':
        return 'notifications_webhook_url';
      case 'chatbot':
        return 'chatbot_webhook_url';
      default:
        return `${serviceType}_webhook_url`;
    }
  };

  // Load webhook URL on initialization
  useEffect(() => {
    async function loadWebhookUrl() {
      setIsLoading(true);
      try {
        // Tentar carregar do Supabase
        const settingKey = getSettingKey();
        const setting = await getSetting(settingKey);
        
        if (setting?.url) {
          setWebhookUrl(setting.url);
          setIsUrlSaved(true);
          return;
        }
        
        // Fallback para o webhookService
        const url = await webhookService.getWebhookUrl();
        if (url) {
          setWebhookUrl(url);
          setIsUrlSaved(true);
        }
      } catch (error) {
        console.error('Erro ao carregar URL do webhook:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadWebhookUrl();
  }, [serviceType]);

  // Save webhook URL
  const saveWebhookUrl = async () => {
    if (!webhookUrl.trim()) {
      toast({
        title: 'URL não informada',
        description: 'Por favor, insira uma URL de webhook válida.',
        variant: 'destructive',
      });
      return false;
    }
    
    setIsLoading(true);
    
    try {
      // Salvar usando o hook de configurações do sistema
      const settingKey = getSettingKey();
      const result = await saveSetting(settingKey, { url: webhookUrl });
      
      // Também salvar no webhookService como fallback
      await webhookService.saveWebhookUrl(webhookUrl);
      
      if (result.success) {
        setIsUrlSaved(true);
        toast({
          title: 'Configuração salva',
          description: 'URL do webhook foi atualizada com sucesso.',
        });
        return true;
      } else {
        toast({
          title: 'Erro ao salvar',
          description: result.error || 'Não foi possível salvar a URL do webhook.',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao salvar a configuração.',
        variant: 'destructive',
      });
      console.error('Erro ao salvar webhook:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to send a test ping to the webhook
  const sendTestPing = async () => {
    if (!webhookUrl.trim()) {
      toast({
        title: 'URL não configurada',
        description: 'Configure uma URL de webhook antes de enviar um teste.',
        variant: 'destructive',
      });
      setTestResult('URL não configurada. Configure uma URL de webhook antes de testar.');
      return false;
    }
    
    setIsTesting(true);
    setTestResult(null);
    
    try {
      // Send test ping
      const testPayload = {
        type: 'test_message' as NotificationType,
        data: { 
          testMessage: `Teste de configuração do webhook da harmonIA (${serviceType})`,
          serviceType,
          timestamp: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      };
      
      console.log('Enviando ping de teste para:', webhookUrl);
      console.log('Payload:', testPayload);
      
      const success = await webhookService.sendToWebhook(webhookUrl, testPayload);
      
      if (success) {
        setTestResult('Teste enviado com sucesso. Verifique os logs do n8n para confirmar recebimento.');
        toast({
          title: 'Teste enviado',
          description: 'Ping de teste enviado com sucesso para o webhook.',
        });
        return true;
      } else {
        setTestResult('Falha ao enviar teste. Verifique a URL e tente novamente.');
        toast({
          title: 'Erro ao testar',
          description: 'Não foi possível enviar o teste para o webhook.',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      console.error('Erro ao testar webhook:', error);
      setTestResult(`Erro: ${error instanceof Error ? error.message : 'Falha desconhecida'}`);
      
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao testar o webhook.',
        variant: 'destructive',
      });
      return false;
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
    testResult,
    copyToClipboard
  };
}
