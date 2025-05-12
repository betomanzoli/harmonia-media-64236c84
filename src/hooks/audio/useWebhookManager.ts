
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { manageWebhookUrls } from '@/services/googleDriveService';

export function useWebhookManager() {
  const [webhookUrl, setWebhookUrl] = useState<string>('');
  const { toast } = useToast();

  // Load webhook URL from storage
  const loadWebhookUrl = () => {
    const url = manageWebhookUrls.get('audio_database_storage');
    setWebhookUrl(url || '');
    return url;
  };

  // Save webhook URL
  const saveWebhookUrl = () => {
    manageWebhookUrls.set('audio_database_storage', webhookUrl);
    toast({
      title: "URL do webhook salva",
      description: "A URL do webhook foi configurada com sucesso.",
    });
  };

  return {
    webhookUrl,
    setWebhookUrl,
    loadWebhookUrl,
    saveWebhookUrl
  };
}
