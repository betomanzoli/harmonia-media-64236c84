
import React from 'react';
import { Button } from "@/components/ui/button";

interface IntegrationConfigProps {
  webhookUrl: string;
  setWebhookUrl: (url: string) => void;
  saveWebhookUrl: () => void;
  copyToClipboard: (text: string) => void;
  portfolioItems: any[];
}

const IntegrationConfig: React.FC<IntegrationConfigProps> = ({
  webhookUrl,
  setWebhookUrl,
  saveWebhookUrl,
  copyToClipboard,
  portfolioItems
}) => {
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
              <input
                id="webhook"
                type="text"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://hooks.zapier.com/hooks/catch/..."
                className="flex-1 p-2 border border-input rounded"
              />
              <Button onClick={saveWebhookUrl}>Salvar</Button>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Configure um webhook no Zapier/Make para integração com atualizações de portfólio
            </p>
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
      </div>
    </div>
  );
};

export default IntegrationConfig;
