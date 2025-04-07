
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useIntegrationConfig } from '@/hooks/admin/useIntegrationConfig';
import webhookService from '@/services/webhookService';

// Definir os tipos aceitáveis de notificação
type NotificationType = 'new_portfolio_item' | 'test_message' | 'feedback_received';

interface IntegrationConfigProps {
  portfolioItems: any[];
}

const IntegrationConfig: React.FC<IntegrationConfigProps> = ({
  portfolioItems
}) => {
  const {
    webhookUrl,
    setWebhookUrl,
    saveWebhookUrl,
    isLoading,
    copyToClipboard
  } = useIntegrationConfig();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <div className="col-span-1 md:col-span-2 space-y-4">
        <h2 className="text-xl font-semibold">Configuração de Integração</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="webhook" className="block text-sm font-medium mb-2">
              URL do Webhook (Zapier/Make)
            </label>
            <div className="flex gap-2">
              <Input
                id="webhook"
                type="text"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://hooks.zapier.com/hooks/catch/..."
                className="flex-1"
              />
              <Button 
                onClick={saveWebhookUrl} 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar'
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Configure um webhook no Zapier/Make para integração com atualizações de portfólio
            </p>
          </div>
          
          <div className="mt-6 p-4 border rounded bg-card">
            <h3 className="font-medium mb-2">Como usar</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Crie um Zap no Zapier ou um Cenário no Make</li>
              <li>Use um webhook como gatilho</li>
              <li>Cole a URL do webhook gerada no campo acima</li>
              <li>Configure as ações desejadas (envio de email, notificações, etc.)</li>
              <li>Salve a configuração e ative seu fluxo</li>
            </ol>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Exportar Dados</h2>
        <div className="p-4 border rounded bg-muted">
          <h3 className="font-medium mb-2">JSON (exportação)</h3>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => copyToClipboard(JSON.stringify(portfolioItems, null, 2))}
          >
            Copiar JSON Completo
          </Button>
        </div>
        
        <div className="p-4 border rounded bg-muted mt-4">
          <h3 className="font-medium mb-2">Teste de Webhook</h3>
          <Button 
            variant="default" 
            className="w-full"
            onClick={async () => {
              const url = await webhookService.getWebhookUrl();
              if (url) {
                webhookService.sendToWebhook(url, {
                  type: 'test_message' as NotificationType,
                  data: { testMessage: "Este é um teste de webhook" },
                  timestamp: new Date().toISOString()
                });
                copyToClipboard("Webhook de teste enviado!");
              } else {
                copyToClipboard("Configure uma URL de webhook primeiro!");
              }
            }}
          >
            Enviar Ping de Teste
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IntegrationConfig;
