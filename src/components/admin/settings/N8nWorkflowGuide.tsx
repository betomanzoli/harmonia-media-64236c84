
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Info, ArrowRight, Copy, AlertCircle, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const N8nWorkflowGuide: React.FC = () => {
  const { toast } = useToast();
  
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast({
          title: "Copiado!",
          description: `${label} foi copiado para a área de transferência.`
        });
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        toast({
          title: "Erro ao copiar",
          description: "Não foi possível copiar o texto. Por favor, tente novamente.",
          variant: "destructive"
        });
      });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Configuração do Workflow n8n</CardTitle>
        <CardDescription>
          Guia passo a passo para configurar notificações de prévia utilizando n8n
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Importante</AlertTitle>
          <AlertDescription>
            Este guia assume que você já tem uma instalação do n8n funcionando. 
            Se ainda não tem, <a href="https://docs.n8n.io/hosting/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">visite a documentação oficial</a> para instruções de instalação.
          </AlertDescription>
        </Alert>
        
        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="email-setup">Configuração de Email</TabsTrigger>
            <TabsTrigger value="webhook-setup">Configuração do Webhook</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">O que você vai criar</h3>
              <p className="text-gray-600 mb-4">
                Um workflow automatizado no n8n que recebe notificações do sistema de prévia e envia emails personalizados para os clientes com links de acesso.
              </p>
              
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
                <h4 className="font-medium mb-2">Componentes do fluxo:</h4>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Webhook para receber notificações do sistema</li>
                  <li>Nó de decisão para diferentes tipos de notificações</li>
                  <li>Geração de link mágico de acesso</li>
                  <li>Envio de email com template HTML personalizado</li>
                  <li>Registro de atividade no sistema</li>
                </ol>
              </div>
              
              <div className="flex items-center justify-between bg-blue-50 p-4 rounded-md border border-blue-100">
                <div>
                  <h4 className="font-medium text-blue-700">Pré-requisitos:</h4>
                  <ul className="list-disc list-inside text-blue-600 text-sm mt-1">
                    <li>n8n instalado e funcionando</li>
                    <li>Um provedor de email configurado (SendGrid, Gmail, etc.)</li>
                    <li>URL pública do seu servidor n8n para o webhook</li>
                  </ul>
                </div>
                
                <Button 
                  onClick={() => window.open('https://n8n.io/integrations/email/', '_blank')}
                  variant="outline" 
                  className="text-blue-600 border-blue-300"
                >
                  <Info className="h-4 w-4 mr-1" />
                  Documentação n8n
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="email-setup" className="space-y-4">
            <h3 className="text-lg font-medium mb-2">Configurando o Nó de Email no n8n</h3>
            
            <div className="space-y-4">
              <div className="border rounded-md overflow-hidden">
                <div className="bg-gray-50 p-3 border-b font-medium">Passo 1: Adicionar credencial de email</div>
                <div className="p-4 space-y-3">
                  <p className="text-gray-600">No n8n, vá para <span className="font-semibold">Credentials</span> e adicione uma nova credencial para seu provedor de email.</p>
                  
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm">Provedores recomendados:</p>
                    <ul className="list-disc list-inside text-sm mt-1">
                      <li>SendGrid</li>
                      <li>SMTP (para maioria dos provedores)</li>
                      <li>Gmail</li>
                      <li>Mailgun</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <div className="bg-gray-50 p-3 border-b font-medium">Passo 2: Criar um template HTML</div>
                <div className="p-4 space-y-3">
                  <p className="text-gray-600">Crie um template HTML para o email de convite. Aqui está um exemplo que você pode usar:</p>
                  
                  <div className="relative bg-gray-800 text-gray-100 p-3 rounded-md text-xs font-mono overflow-auto max-h-[300px]">
                    <pre className="whitespace-pre-wrap">{`<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; padding: 20px 0; }
    .content { background: #f9f9f9; padding: 20px; border-radius: 5px; }
    .button { display: inline-block; background: #4CAF50; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; }
    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #777; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Sua Prévia Musical está Disponível!</h2>
    </div>
    <div class="content">
      <p>Olá {{clientName}},</p>
      <p>Temos o prazer de informar que sua prévia musical personalizada está pronta para sua avaliação.</p>
      <p>Criamos algumas versões diferentes para você escolher a que mais combina com sua visão.</p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="{{previewLink}}" class="button">Acessar Minha Prévia</a>
      </p>
      <p>Este link é exclusivo e expira em 14 dias. Não hesite em nos contatar se tiver qualquer dúvida.</p>
      <p>Atenciosamente,<br>Equipe harmonIA</p>
    </div>
    <div class="footer">
      &copy; 2025 harmonIA. Todos os direitos reservados.
    </div>
  </div>
</body>
</html>`}</pre>
                    <Button 
                      className="absolute top-2 right-2 h-8 w-8 p-0 bg-gray-700" 
                      onClick={() => handleCopy(
                        document.querySelector('.whitespace-pre-wrap')?.textContent || '', 
                        'Template HTML'
                      )}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="webhook-setup" className="space-y-4">
            <h3 className="text-lg font-medium mb-2">Configurando o Workflow Completo</h3>
            
            <div className="space-y-4">
              <div className="border rounded-md overflow-hidden">
                <div className="bg-gray-50 p-3 border-b font-medium">Passo 1: Criar um novo workflow</div>
                <div className="p-4">
                  <p className="text-gray-600">No n8n, crie um novo workflow e adicione um nó "Webhook".</p>
                  <div className="bg-gray-50 p-3 rounded-md mt-2">
                    <p className="text-sm font-medium">Configuração do Webhook:</p>
                    <ul className="list-disc list-inside text-sm mt-1">
                      <li>Método: <span className="font-mono">POST</span></li>
                      <li>Caminho: <span className="font-mono">/preview-notification</span></li>
                      <li>Responder: <span className="font-mono">Immediately</span></li>
                      <li>Resposta: JSON com status success</li>
                    </ul>
                  </div>
                  <p className="text-sm mt-3 italic">Após configurar, clique em "Execute Workflow" para obter a URL do webhook.</p>
                </div>
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <div className="bg-gray-50 p-3 border-b font-medium">Passo 2: Adicionar nó Switch</div>
                <div className="p-4">
                  <p className="text-gray-600">Adicione um nó "Switch" após o webhook para lidar com diferentes tipos de notificações.</p>
                  <div className="bg-gray-50 p-3 rounded-md mt-2 text-sm">
                    <p className="font-medium">Configuração do Switch:</p>
                    <p>Valor a ser comparado: <span className="font-mono">data.type</span></p>
                    <p className="mt-2">Regras:</p>
                    <ul className="list-disc list-inside mt-1">
                      <li>Saída 1: = <span className="font-mono">new_portfolio_item</span></li>
                      <li>Saída 2: = <span className="font-mono">preview_approved</span></li>
                      <li>Saída 3: = <span className="font-mono">feedback_received</span></li>
                      <li>Saída 4: = <span className="font-mono">new_preview</span></li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <div className="bg-gray-50 p-3 border-b font-medium">Passo 3: Adicionar nó Function para gerar link mágico</div>
                <div className="p-4">
                  <p className="text-gray-600">Adicione um nó "Function" após a saída relevante do switch para gerar o link de prévia.</p>
                  <div className="relative bg-gray-50 p-3 rounded-md mt-2 text-sm font-mono overflow-auto max-h-[200px]">
                    <pre className="whitespace-pre-wrap">{`// Código para nó Function
const projectId = $input.json.data.projectId;
const clientName = $input.json.data.clientName;
const clientEmail = $input.json.data.clientEmail;

// Gera o link de prévia
const previewLink = 'https://harmonia.media/preview/' + projectId;

// Retorna os dados para o próximo nó
return {
  json: {
    projectId,
    clientName,
    clientEmail,
    previewLink,
    timestamp: new Date().toISOString()
  }
};`}</pre>
                    <Button 
                      className="absolute top-2 right-2 h-8 w-8 p-0" 
                      variant="ghost"
                      onClick={() => handleCopy(
                        document.querySelector('.whitespace-pre-wrap:nth-of-type(2)')?.textContent || '', 
                        'Código de função'
                      )}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <div className="bg-gray-50 p-3 border-b font-medium">Passo 4: Adicionar nó de Email</div>
                <div className="p-4">
                  <p className="text-gray-600">Adicione um nó "Send Email" após o nó Function.</p>
                  <div className="bg-gray-50 p-3 rounded-md mt-2 text-sm">
                    <p className="font-medium">Configuração do Email:</p>
                    <ul className="list-disc list-inside mt-1">
                      <li>De: <span className="font-mono">seu@email.com</span></li>
                      <li>Para: <span className="font-mono">{"{{$json.clientEmail}}"}</span></li>
                      <li>Assunto: <span className="font-mono">Sua prévia musical está disponível!</span></li>
                      <li>Formato: <span className="font-mono">HTML</span></li>
                      <li>Cole o template HTML modificado com estas variáveis:</li>
                      <ul className="list-disc list-inside ml-4 mt-1">
                        <li><span className="font-mono">{"{{clientName}}"}</span> substituído por <span className="font-mono">{"{{$json.clientName}}"}</span></li>
                        <li><span className="font-mono">{"{{previewLink}}"}</span> substituído por <span className="font-mono">{"{{$json.previewLink}}"}</span></li>
                      </ul>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between bg-green-50 p-4 rounded-md border border-green-100">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-green-700">Finalize e Ative</p>
                    <p className="text-green-600 text-sm">Salve o workflow e ative-o. Copie a URL do webhook gerada e configure-a no sistema de prévia em Configurações {">"} Webhooks.</p>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="whitespace-nowrap ml-4 text-green-600 border-green-300"
                  onClick={() => window.location.href = '/admin-j28s7d1k/settings'}
                >
                  Ir para Configurações
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default N8nWorkflowGuide;
