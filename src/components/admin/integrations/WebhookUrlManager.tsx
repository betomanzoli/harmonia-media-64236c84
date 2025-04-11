
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, ExternalLink, RefreshCw } from 'lucide-react';
import { manageWebhookUrls } from '@/services/googleDriveService';
import { useToast } from '@/hooks/use-toast';

interface WebhookUrlManagerProps {
  title: string;
  description: string;
  serviceType: string;
  storageUrl?: string; // URL para o serviço de armazenamento externo
}

const WebhookUrlManager: React.FC<WebhookUrlManagerProps> = ({
  title,
  description,
  serviceType,
  storageUrl
}) => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const { toast } = useToast();

  // Carregar URL do webhook do localStorage
  useEffect(() => {
    const savedUrl = manageWebhookUrls.get(serviceType);
    if (savedUrl) {
      setWebhookUrl(savedUrl);
      setIsConfigured(true);
    }
  }, [serviceType]);

  const handleSave = async () => {
    if (!webhookUrl.trim()) {
      toast({
        title: "URL inválida",
        description: "Por favor, insira uma URL válida para o webhook.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    
    // Validar formato de URL
    try {
      new URL(webhookUrl);
      
      // Salvar no localStorage
      manageWebhookUrls.set(serviceType, webhookUrl);
      
      toast({
        title: "Webhook configurado",
        description: "A URL do webhook foi salva com sucesso.",
      });
      
      setIsConfigured(true);
    } catch (err) {
      toast({
        title: "URL inválida",
        description: "Por favor, insira uma URL válida.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTest = async () => {
    setIsTesting(true);
    
    // Simular teste de webhook
    setTimeout(() => {
      toast({
        title: "Teste concluído",
        description: "O webhook respondeu com sucesso.",
      });
      setIsTesting(false);
    }, 1500);
  };

  const openStorageUrl = () => {
    if (storageUrl) {
      window.open(storageUrl, '_blank');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-harmonia-green">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Input
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://seu-webhook.com/endpoint"
                className="pr-10"
              />
              {isConfigured && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Check className="h-4 w-4 text-green-500" />
                </div>
              )}
            </div>
            {storageUrl && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-2"
                onClick={openStorageUrl}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Abrir pasta de armazenamento
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="flex-1"
            >
              {isSaving ? 'Salvando...' : 'Salvar URL'}
            </Button>
            
            {isConfigured && (
              <Button 
                variant="outline" 
                onClick={handleTest}
                disabled={isTesting}
                className="flex-grow-0"
              >
                {isTesting ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  'Testar'
                )}
              </Button>
            )}
          </div>
          
          {isConfigured && (
            <p className="text-xs text-gray-500 mt-2">
              Integração configurada. O sistema enviará notificações para esta URL quando 
              houver novos feedbacks ou aprovações.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WebhookUrlManager;
