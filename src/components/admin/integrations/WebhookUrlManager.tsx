
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Clipboard, ExternalLink, Send, AlertTriangle } from 'lucide-react';
import { useIntegrationConfig } from '@/hooks/admin/useIntegrationConfig';

interface WebhookUrlManagerProps {
  title: string;
  description?: string;
  serviceType: string;
  storageUrl?: string;
}

const WebhookUrlManager: React.FC<WebhookUrlManagerProps> = ({
  title,
  description,
  serviceType,
  storageUrl
}) => {
  const {
    webhookUrl,
    setWebhookUrl,
    saveWebhookUrl,
    sendTestPing,
    isLoading,
    isTesting,
    isUrlSaved,
    testResult,
    copyToClipboard
  } = useIntegrationConfig(serviceType);
  
  const openExternalUrl = (url: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-md font-medium flex items-center justify-between">
          {title}
          {isUrlSaved && <Badge className="bg-harmonia-green text-white">Configurado</Badge>}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex">
              <Input
                placeholder="URL do webhook para integrações"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="flex-1"
              />
              <Button 
                variant="outline"
                className="ml-2"
                disabled={isLoading}
                onClick={saveWebhookUrl}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar"}
              </Button>
            </div>
            
            <div className="flex gap-2 mt-3">
              <Button 
                variant="outline" 
                size="sm"
                disabled={!webhookUrl || isTesting} 
                onClick={sendTestPing}
                className="text-xs"
              >
                {isTesting ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Send className="h-3 w-3 mr-1" />}
                Enviar teste
              </Button>
              
              {storageUrl && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => openExternalUrl(storageUrl)}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Abrir no n8n
                </Button>
              )}
              
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={() => copyToClipboard(webhookUrl)}
              >
                <Clipboard className="h-3 w-3 mr-1" />
                Copiar URL
              </Button>
            </div>
          </div>
          
          {testResult && (
            <div className={`p-2 rounded-md text-xs ${
              testResult.includes('sucesso') 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              <div className="flex items-start">
                {testResult.includes('sucesso') ? (
                  <Send className="h-3 w-3 mr-1 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-3 w-3 mr-1 mt-0.5" />
                )}
                <span>{testResult}</span>
              </div>
            </div>
          )}
          
          {isUrlSaved && (
            <div className="text-xs text-gray-500">
              Última atualização: {new Date().toLocaleDateString('pt-BR', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          )}
          
          <div className="mt-2 p-3 bg-blue-50 border border-blue-100 rounded text-xs text-blue-700">
            <p className="font-semibold mb-1">Formato esperado pelo n8n:</p>
            <pre className="overflow-auto text-[10px] bg-blue-100/50 p-1 rounded">
              {`{
  "type": "event_type",
  "data": {
    "key1": "value1",
    "key2": "value2"
  },
  "timestamp": "2025-05-21T12:34:56.789Z"
}`}
            </pre>
            <p className="mt-1">Configure o nó HTTP Request no n8n para receber este formato JSON.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebhookUrlManager;
