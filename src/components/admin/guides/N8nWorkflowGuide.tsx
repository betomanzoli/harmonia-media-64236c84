
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Steps, Step } from "@/components/ui/steps";
import { CodeBlock } from "@/components/ui/code-block";
import { Button } from "@/components/ui/button";
import { ExternalLink, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const N8nWorkflowGuide: React.FC = () => {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Texto copiado para a área de transferência.",
    });
  };

  const openExternalLink = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Guia de Configuração do Workflow n8n para Notificações de Prévia</CardTitle>
        <CardDescription>
          Siga este guia passo a passo para configurar o fluxo de notificações de prévia usando n8n
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-gray-600">
          Este guia explica como configurar um workflow no n8n para enviar notificações de prévia aos clientes, permitindo que eles acessem as prévias através de um link mágico em qualquer navegador, incluindo navegadores privados ou anônimos.
        </p>

        <Steps>
          <Step title="Acessar o n8n">
            <div className="space-y-2">
              <p>Primeiramente, acesse a sua conta no n8n ou crie uma caso ainda não tenha.</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => openExternalLink('https://app.n8n.cloud/login')}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Acessar n8n
              </Button>
            </div>
          </Step>

          <Step title="Criar um novo workflow">
            <div className="space-y-2">
              <p>No painel do n8n, clique em "Workflows" e depois em "New Workflow".</p>
              <p>Dê um nome para o workflow, como "Notificações de Prévia".</p>
            </div>
          </Step>

          <Step title="Configurar o webhook de entrada">
            <div className="space-y-2">
              <p>1. Adicione um nó "Webhook" clicando no botão "+" e selecionando "Webhook".</p>
              <p>2. Configure o webhook para receber requisições POST.</p>
              <p>3. Defina um caminho como "/preview-notification".</p>
              <p>4. Anote a URL do webhook que será gerada.</p>
              <p>5. Marque a opção "Response Mode" como "Last Node".</p>
              <div className="mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mr-2"
                  onClick={() => copyToClipboard('Webhook URL: ${workflow.webhookUrl}')}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copiar exemplo
                </Button>
              </div>
            </div>
          </Step>

          <Step title="Adicionar o nó de processamento de dados">
            <div className="space-y-2">
              <p>Adicione um nó "Function" para processar os dados recebidos pelo webhook:</p>
              <CodeBlock
                code={`// Processa os dados recebidos e prepara o e-mail
return [
  {
    json: {
      clientName: items[0].json.data.clientName,
      clientEmail: items[0].json.data.clientEmail,
      projectId: items[0].json.data.projectId,
      previewUrl: \`\${$env.BASE_URL}/preview/\${items[0].json.data.projectId}\`,
      projectTitle: items[0].json.data.projectTitle || "Seu projeto musical",
      dateTime: new Date().toLocaleString('pt-BR'),
      magicToken: Buffer.from(\`\${items[0].json.data.projectId}:\${Date.now()}\`).toString('base64')
    }
  }
];`}
                language="javascript"
              />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => copyToClipboard(`// Processa os dados recebidos e prepara o e-mail
return [
  {
    json: {
      clientName: items[0].json.data.clientName,
      clientEmail: items[0].json.data.clientEmail,
      projectId: items[0].json.data.projectId,
      previewUrl: \`\${$env.BASE_URL}/preview/\${items[0].json.data.projectId}\`,
      projectTitle: items[0].json.data.projectTitle || "Seu projeto musical",
      dateTime: new Date().toLocaleString('pt-BR'),
      magicToken: Buffer.from(\`\${items[0].json.data.projectId}:\${Date.now()}\`).toString('base64')
    }
  }
];`)}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copiar código
              </Button>
            </div>
          </Step>

          <Step title="Configurar o nó de envio de e-mail">
            <div className="space-y-2">
              <p>Adicione um nó "Send Email" para enviar o e-mail com o link mágico:</p>
              <p>1. Configure suas credenciais SMTP (como Gmail, SendGrid, etc).</p>
              <p>2. Configure o e-mail com os seguintes campos:</p>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>To: <code>{'{{$json.clientEmail}}'}</code></li>
                <li>Subject: Prévia do seu projeto musical está disponível!</li>
                <li>HTML Content: Template de e-mail com o link mágico</li>
              </ul>
              <p className="mt-2">Modelo de conteúdo HTML para o e-mail:</p>
              <CodeBlock
                code={`<h1>Olá {{$json.clientName}}!</h1>
<p>Estamos felizes em informar que uma prévia do seu projeto "{{$json.projectTitle}}" está disponível para sua avaliação.</p>
<p>Clique no link abaixo para acessar sua prévia:</p>
<p><a href="{{$json.previewUrl}}?token={{$json.magicToken}}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Ver Prévia</a></p>
<p>Ou copie e cole este link no seu navegador:</p>
<p>{{$json.previewUrl}}?token={{$json.magicToken}}</p>
<p>Este link é válido por 7 dias. Aguardamos seu feedback!</p>
<p>Atenciosamente,<br>Equipe HarmoniA</p>`}
                language="html"
              />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => copyToClipboard(`<h1>Olá {{$json.clientName}}!</h1>
<p>Estamos felizes em informar que uma prévia do seu projeto "{{$json.projectTitle}}" está disponível para sua avaliação.</p>
<p>Clique no link abaixo para acessar sua prévia:</p>
<p><a href="{{$json.previewUrl}}?token={{$json.magicToken}}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Ver Prévia</a></p>
<p>Ou copie e cole este link no seu navegador:</p>
<p>{{$json.previewUrl}}?token={{$json.magicToken}}</p>
<p>Este link é válido por 7 dias. Aguardamos seu feedback!</p>
<p>Atenciosamente,<br>Equipe HarmoniA</p>`)}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copiar HTML
              </Button>
            </div>
          </Step>

          <Step title="Adicionar resposta de confirmação">
            <div className="space-y-2">
              <p>Adicione um nó "Respond to Webhook" para fornecer uma resposta ao sistema:</p>
              <CodeBlock
                code={`{
  "success": true,
  "message": "Email de notificação enviado com sucesso",
  "sentTo": "{{$node[\"Send Email\"].json[\"to\"]}}",
  "timestamp": "{{$json.dateTime}}"
}`}
                language="json"
              />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => copyToClipboard(`{
  "success": true,
  "message": "Email de notificação enviado com sucesso",
  "sentTo": "{{$node[\\"Send Email\\"].json[\\"to\\"]}}",
  "timestamp": "{{$json.dateTime}}"
}`)}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copiar JSON
              </Button>
            </div>
          </Step>

          <Step title="Conectar os nós">
            <div className="space-y-2">
              <p>Conecte os nós na seguinte ordem:</p>
              <ol className="list-decimal pl-6 space-y-1">
                <li>Webhook → Function</li>
                <li>Function → Send Email</li>
                <li>Send Email → Respond to Webhook</li>
              </ol>
              <p className="mt-2">Certifique-se de que os nós estejam conectados corretamente para que o fluxo de dados ocorra na ordem esperada.</p>
            </div>
          </Step>

          <Step title="Ativar o workflow">
            <div className="space-y-2">
              <p>Clique no botão "Ativar Workflow" no canto superior direito da interface do n8n.</p>
              <p>Após ativar, o webhook estará pronto para receber requisições.</p>
            </div>
          </Step>

          <Step title="Configurar a URL do webhook no sistema">
            <div className="space-y-2">
              <p>1. Copie a URL do webhook gerada pelo n8n.</p>
              <p>2. No painel administrativo do HarmoniA, vá para "Integrações".</p>
              <p>3. Cole a URL do webhook no campo apropriado e salve.</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => openExternalLink('/admin-j28s7d1k/integrations')}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Ir para Integrações
              </Button>
            </div>
          </Step>
        </Steps>

        <Accordion type="single" collapsible>
          <AccordionItem value="debug">
            <AccordionTrigger>Dicas de Depuração</AccordionTrigger>
            <AccordionContent className="space-y-2">
              <p>Se o fluxo não estiver funcionando como esperado, verifique:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Se o webhook está ativo e recebendo requisições</li>
                <li>Os logs de execução do workflow no n8n</li>
                <li>Se as variáveis de ambiente estão configuradas corretamente</li>
                <li>Se as credenciais de e-mail estão funcionando</li>
                <li>Se a URL base está configurada corretamente</li>
              </ul>
              <p className="mt-2">Você pode usar o recurso "Test execution" no n8n para simular uma requisição e verificar se o workflow está funcionando corretamente.</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="token">
            <AccordionTrigger>Como funciona o token de acesso</AccordionTrigger>
            <AccordionContent className="space-y-2">
              <p>O token mágico gerado é uma string codificada em base64 que contém o ID do projeto e um timestamp. Quando o cliente acessa o link, o sistema verifica se o token é válido e se o projeto existe.</p>
              <p>O token funciona em navegadores privados e anônimos porque não depende de cookies ou localStorage. A autenticação é feita apenas com o token presente na URL.</p>
              <p>Para implementar a verificação do token no sistema:</p>
              <CodeBlock
                code={`// Função para verificar o token mágico
function verifyMagicToken(token, projectId) {
  try {
    // Decodificar o token
    const decoded = Buffer.from(token, 'base64').toString();
    const [tokenProjectId, timestamp] = decoded.split(':');
    
    // Verificar se o projectId do token corresponde ao projectId da URL
    if (tokenProjectId !== projectId) return false;
    
    // Verificar se o token não expirou (7 dias)
    const tokenTime = parseInt(timestamp);
    const expirationTime = 7 * 24 * 60 * 60 * 1000; // 7 dias em milissegundos
    if (Date.now() - tokenTime > expirationTime) return false;
    
    return true;
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return false;
  }
}`}
                language="javascript"
              />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => copyToClipboard(`// Função para verificar o token mágico
function verifyMagicToken(token, projectId) {
  try {
    // Decodificar o token
    const decoded = Buffer.from(token, 'base64').toString();
    const [tokenProjectId, timestamp] = decoded.split(':');
    
    // Verificar se o projectId do token corresponde ao projectId da URL
    if (tokenProjectId !== projectId) return false;
    
    // Verificar se o token não expirou (7 dias)
    const tokenTime = parseInt(timestamp);
    const expirationTime = 7 * 24 * 60 * 60 * 1000; // 7 dias em milissegundos
    if (Date.now() - tokenTime > expirationTime) return false;
    
    return true;
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return false;
  }
}`)}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copiar código
              </Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-200">
          <h3 className="text-lg font-medium text-blue-800 mb-2">Dicas para maximizar o uso do n8n</h3>
          <ul className="list-disc pl-6 space-y-1 text-sm text-blue-700">
            <li>Considere criar workflows adicionais para outras notificações, como feedback recebido ou aprovação da prévia</li>
            <li>Utilize os recursos de agendamento do n8n para enviar lembretes automáticos aos clientes que não visualizaram as prévias</li>
            <li>Explore integrações com outros serviços como WhatsApp ou Telegram para notificações adicionais</li>
            <li>Configure notificações de erro para ser alertado caso algo dê errado no fluxo</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default N8nWorkflowGuide;
