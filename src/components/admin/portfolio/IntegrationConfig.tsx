
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface IntegrationConfigProps {
  portfolioItems?: any[];
}

const IntegrationConfig: React.FC<IntegrationConfigProps> = ({ portfolioItems = [] }) => {
  return (
    <div className="space-y-4">
      <p className="text-gray-300 text-sm">
        Configure a integração para sincronizar o portfólio com outros serviços.
      </p>
      
      <div className="space-y-2">
        <Label htmlFor="api-key" className="text-gray-300">API Key</Label>
        <Input
          id="api-key"
          placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          className="bg-slate-700 border-slate-600 text-white"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="webhook-url" className="text-gray-300">URL do Webhook</Label>
        <Input
          id="webhook-url"
          placeholder="https://exemplo.com/webhook"
          className="bg-slate-700 border-slate-600 text-white"
        />
      </div>
      
      <div className="pt-2">
        <Button>
          Salvar Configurações
        </Button>
      </div>
      
      <div className="mt-4 p-3 border border-slate-600 rounded-md bg-slate-800">
        <h3 className="text-sm font-semibold text-gray-300 mb-2">Estatísticas</h3>
        <div className="flex justify-between text-xs text-gray-400">
          <span>Total de itens:</span>
          <span>{portfolioItems?.length || 0} itens</span>
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>Última sincronização:</span>
          <span>Nunca</span>
        </div>
      </div>
    </div>
  );
};

export default IntegrationConfig;
