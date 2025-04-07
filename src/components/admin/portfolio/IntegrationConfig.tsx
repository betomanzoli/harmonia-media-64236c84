
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useIntegrationConfig } from '@/hooks/admin/useIntegrationConfig';
import webhookService, { NotificationType } from '@/services/webhookService';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="col-span-1 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Configuração de Webhooks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => copyToClipboard(JSON.stringify(portfolioItems, null, 2))}
              >
                Copiar JSON Completo
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Tabs defaultValue="zapier" className="space-y-4">
        <TabsList>
          <TabsTrigger value="zapier">Zapier</TabsTrigger>
          <TabsTrigger value="make">Make (Integromat)</TabsTrigger>
          <TabsTrigger value="webhook">Webhook Personalizado</TabsTrigger>
        </TabsList>
        
        <TabsContent value="zapier" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Guia de Configuração no Zapier</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal list-inside space-y-4">
                <li className="pb-2 border-b border-gray-100">
                  <strong>Crie uma nova Zap no Zapier</strong>
                  <p className="mt-1 ml-6 text-sm text-muted-foreground">
                    Acesse <a href="https://zapier.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">zapier.com</a> e clique em "Create Zap"
                  </p>
                </li>
                
                <li className="pb-2 border-b border-gray-100">
                  <strong>Selecione "Webhooks by Zapier" como trigger (gatilho)</strong>
                  <p className="mt-1 ml-6 text-sm text-muted-foreground">
                    Na seção de gatilho, pesquise e selecione "Webhooks by Zapier"
                  </p>
                </li>
                
                <li className="pb-2 border-b border-gray-100">
                  <strong>Escolha "Catch Hook" como evento</strong>
                  <p className="mt-1 ml-6 text-sm text-muted-foreground">
                    Isso criará um endpoint único para receber dados do harmonIA
                  </p>
                </li>
                
                <li className="pb-2 border-b border-gray-100">
                  <strong>Copie a URL do webhook gerada pelo Zapier</strong>
                  <p className="mt-1 ml-6 text-sm text-muted-foreground">
                    Cole esta URL no campo "URL do Webhook" acima e clique em "Salvar"
                  </p>
                </li>
                
                <li className="pb-2 border-b border-gray-100">
                  <strong>Clique em "Test Trigger" no Zapier</strong>
                  <p className="mt-1 ml-6 text-sm text-muted-foreground">
                    Volte para o Zapier e teste o gatilho. Então clique no botão "Enviar Ping de Teste" acima
                  </p>
                </li>
                
                <li className="pb-2 border-b border-gray-100">
                  <strong>Configure as ações desejadas</strong>
                  <p className="mt-1 ml-6 text-sm text-muted-foreground">
                    Adicione ações como enviar emails, notificações Slack, atualizar planilhas, etc.
                  </p>
                </li>
                
                <li>
                  <strong>Ative seu Zap</strong>
                  <p className="mt-1 ml-6 text-sm text-muted-foreground">
                    Após testar com sucesso, ative seu Zap para começar a receber notificações
                  </p>
                </li>
              </ol>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="make" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Guia de Configuração no Make (Integromat)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal list-inside space-y-4">
                <li className="pb-2 border-b border-gray-100">
                  <strong>Crie um novo cenário no Make</strong>
                  <p className="mt-1 ml-6 text-sm text-muted-foreground">
                    Acesse <a href="https://make.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">make.com</a> e clique em "Create a new scenario"
                  </p>
                </li>
                
                <li className="pb-2 border-b border-gray-100">
                  <strong>Adicione o módulo "Webhooks"</strong>
                  <p className="mt-1 ml-6 text-sm text-muted-foreground">
                    Selecione o app "Webhooks" e escolha "Custom webhook" como gatilho
                  </p>
                </li>
                
                <li className="pb-2 border-b border-gray-100">
                  <strong>Configure o webhook para receber dados JSON</strong>
                  <p className="mt-1 ml-6 text-sm text-muted-foreground">
                    Deixe as configurações padrão para receber dados JSON
                  </p>
                </li>
                
                <li className="pb-2 border-b border-gray-100">
                  <strong>Copie a URL do webhook gerada pelo Make</strong>
                  <p className="mt-1 ml-6 text-sm text-muted-foreground">
                    Cole esta URL no campo "URL do Webhook" acima e clique em "Salvar"
                  </p>
                </li>
                
                <li className="pb-2 border-b border-gray-100">
                  <strong>Clique em "Enviar Ping de Teste" acima</strong>
                  <p className="mt-1 ml-6 text-sm text-muted-foreground">
                    Isso enviará dados de teste para seu webhook no Make
                  </p>
                </li>
                
                <li className="pb-2 border-b border-gray-100">
                  <strong>Adicione módulos para processamento</strong>
                  <p className="mt-1 ml-6 text-sm text-muted-foreground">
                    Conecte outros módulos como Gmail, Slack, Google Sheets, etc.
                  </p>
                </li>
                
                <li>
                  <strong>Ative seu cenário</strong>
                  <p className="mt-1 ml-6 text-sm text-muted-foreground">
                    Após testar com sucesso, ative seu cenário para começar a receber notificações
                  </p>
                </li>
              </ol>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="webhook" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Formato dos Dados JSON</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-md">
                <pre className="text-xs overflow-auto">
{`{
  "type": "test_message",  // Tipo de notificação (test_message, new_portfolio_item, feedback_received)
  "data": {                // Dados específicos do evento
    "testMessage": "Este é um teste de webhook"
  },
  "timestamp": "2025-04-07T20:16:10Z"  // Timestamp ISO
}`}
                </pre>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">Tipos de notificações disponíveis:</h4>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li><code>test_message</code> - Mensagem de teste para verificar a integração</li>
                  <li><code>new_portfolio_item</code> - Quando um novo item de portfólio é adicionado</li>
                  <li><code>feedback_received</code> - Quando feedback é recebido sobre uma prévia</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegrationConfig;
