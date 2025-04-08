
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Globe, Save, FolderOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { manageWebhookUrls } from '@/services/googleDriveService';

interface WebhookUrlManagerProps {
  title: string;
  description: string;
  serviceType: string;
  storageUrl: string;
}

const WebhookUrlManager: React.FC<WebhookUrlManagerProps> = ({
  title,
  description,
  serviceType,
  storageUrl
}) => {
  const { toast } = useToast();
  const [webhookUrl, setWebhookUrl] = useState('');
  
  useEffect(() => {
    // Get the stored webhook URL for this service
    const storedUrl = manageWebhookUrls.get(serviceType);
    if (storedUrl) {
      setWebhookUrl(storedUrl);
    }
  }, [serviceType]);
  
  const saveWebhookUrl = () => {
    manageWebhookUrls.save(serviceType, webhookUrl);
    
    toast({
      title: "Configuração salva",
      description: "URL do webhook salva com sucesso.",
    });
    
    // Trigger a storage event for other components to detect the change
    window.dispatchEvent(new StorageEvent('storage', {
      key: `${serviceType}_webhookUrl`,
      newValue: webhookUrl
    }));
  };
  
  const openStorageFolder = () => {
    window.open(storageUrl, '_blank');
  };
  
  return (
    <Card className="shadow-md border-harmonia-green/20">
      <CardHeader className="bg-gradient-to-r from-harmonia-light-green to-harmonia-green/10">
        <CardTitle className="text-harmonia-green flex items-center gap-2">
          <Globe className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <p className="text-sm text-gray-500 mb-4">{description}</p>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="webhook-url" className="text-sm font-medium">
              URL do Webhook
            </label>
            <Input
              id="webhook-url"
              placeholder="https://hooks.zapier.com/..."
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="border-harmonia-green/20 focus-visible:ring-harmonia-green"
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={saveWebhookUrl}
              className="bg-harmonia-green hover:bg-harmonia-green/90 text-white"
            >
              <Save className="mr-2 h-4 w-4" /> Salvar
            </Button>
            <Button 
              variant="outline" 
              onClick={openStorageFolder}
              className="border-harmonia-green/30 text-harmonia-green hover:bg-harmonia-light-green/20"
            >
              <FolderOpen className="mr-2 h-4 w-4" /> Pasta de Arquivos
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebhookUrlManager;
