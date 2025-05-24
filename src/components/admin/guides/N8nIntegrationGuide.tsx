
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const N8nIntegrationGuide: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Guia de Integração com n8n</CardTitle>
        <CardDescription>
          Como configurar workflows automatizados entre o HarmonIA e outros serviços
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          O n8n é uma ferramenta de automação que permite integrar diferentes serviços e APIs.
          Este guia explica como configurar workflows para automatizar tarefas entre o HarmonIA 
          e outros serviços que você utiliza.
        </p>
        
        <div className="p-4 bg-gray-50 rounded border">
          <h3 className="font-medium mb-2">Acesso à plataforma n8n</h3>
          <p className="text-sm text-gray-600 mb-2">
            Acesse a instância do n8n disponível em:
          </p>
          <p className="text-sm font-mono bg-gray-100 p-2 rounded">
            https://humbrock.app.n8n.cloud/
          </p>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Guia completo em implementação...
        </p>
      </CardContent>
    </Card>
  );
};

export default N8nIntegrationGuide;
