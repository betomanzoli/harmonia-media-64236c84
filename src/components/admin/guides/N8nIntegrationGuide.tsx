
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "@/components/ui/code-block";
import { Button } from "@/components/ui/button";
import { Info, Copy, ExternalLink, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const N8nIntegrationGuide: React.FC = () => {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Código copiado para a área de transferência.",
    });
  };

  const openExternalLink = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Guia de Integração com n8n</CardTitle>
        <CardDescription>
          Aprenda a conectar o harmonIA com o n8n para automações de marketing e notificações
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="previews">Prévias</TabsTrigger>
            <TabsTrigger value="troubleshooting">Solução de Problemas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                O n8n é uma plataforma de automação de workflows que permite conectar o harmonIA com outros serviços 
                como email, CRMs, planilhas e muito mais. Esta integração possibilita automações como envio de notificações, 
                processamento de leads e envio de emails de prévias.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Benefícios da Integração</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                    <li>Automação do fluxo de trabalho de marketing</li>
                    <li>Notificações automáticas para clientes</li>
                    <li>Processamento de leads sem código adicional</li>
                    <li>Integração com serviços de email como Gmail</li>
                    <li>Sincronização com CRMs e planilhas</li>
                  </ul>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Requisitos</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                    <li>Conta no n8n (cloud ou self-hosted)</li>
                    <li>URLs de webhook configuradas no harmonIA</li>
                    <li>Permissões de API no Supabase</li>
                    <li>Conhecimento básico de JSON e APIs</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex justify-center mt-4">
                <Button
                  variant="outline"
                  onClick={() => openExternalLink('https://n8n.io/')}
                  className="mr-2"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visitar n8n.io
                </Button>
                <Button
                  variant="outline"
                  onClick={() => openExternalLink('https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.webhook/')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Documentação Webhooks
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="webhooks">
            <div className="space-y-4">
              <div className="border rounded p-4 bg-amber-50 border-amber-200 mb-4 flex">
                <AlertTriangle className="h-5 w-5 mr-2 text-amber-700 flex-shrink-0 mt-0.5" />
                <div className="text-amber-700 text-sm">
                  <p className="font-semibold">Importante: Evite nós PostgreSQL</p>
                  <p>O Supabase não permite conexões PostgreSQL diretas. Use a API REST do Supabase com nós HTTP Request em vez disso.</p>
                </div>
              </div>

              <h3 className="font-medium text-lg mb-2">Configurando um Webhook no n8n</h3>
              <p className="text-sm text-gray-600 mb-4">
                Os webhooks permitem que o harmonIA envie dados para o n8n quando eventos ocorrem, como um novo lead ou feedback de prévia.
              </p>
              
              <div className="border rounded-md p-4 mb-4">
                <h4 className="font-medium mb-2">1. Criar um novo workflow no n8n</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Acesse seu dashboard do n8n e crie um novo workflow clicando em "Create Workflow".
                </p>
                <div className="my-2">
                  <img 
                    src="https://cdn.gpteng.co/util/b9d08be08047503e5ce69f7c0d81cd06/n8n-create-workflow.png" 
                    alt="Criar workflow" 
                    className="border rounded-md max-w-full h-auto" 
                  />
                </div>
              </div>
              
              <div className="border rounded-md p-4 mb-4">
                <h4 className="font-medium mb-2">2. Adicionar um nó de Webhook</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Adicione um nó "Webhook" ao seu workflow clicando em "Add first step" e pesquisando por "webhook".
                </p>
                <CodeBlock
                  language="json"
                  code={`{
  "type": "test_message",
  "data": {
    "message": "Teste de conexão do harmonIA",
    "timestamp": "2025-05-21T10:30:00.000Z"
  },
  "timestamp": "2025-05-21T10:30:00.000Z"
}`}
                />
                <p className="text-sm text-gray-600 mt-2">
                  Configure o webhook para receber dados no formato acima, que é o padrão enviado pelo harmonIA.
                </p>
              </div>
              
              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-2">3. Processar os dados recebidos</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Adicione nós para processar os dados recebidos, como Function ou Set para transformar os dados.
                </p>
                <CodeBlock
                  language="javascript"
                  code={`// Exemplo de código para o nó Function
const inputData = $input.all();
const webhookData = inputData[0].json;

// Extrair informações relevantes
const eventType = webhookData.type;
const data = webhookData.data;
const timestamp = webhookData.timestamp;

// Processar com base no tipo de evento
let processedData = {};

if (eventType === 'new_customer') {
  processedData = {
    name: data.name,
    email: data.email,
    source: data.lead_source,
    date: new Date(timestamp).toLocaleDateString(),
    responses: JSON.stringify(data.responses)
  };
}

return [{ json: processedData }];`}
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => copyToClipboard(`// Exemplo de código para o nó Function
const inputData = $input.all();
const webhookData = inputData[0].json;

// Extrair informações relevantes
const eventType = webhookData.type;
const data = webhookData.data;
const timestamp = webhookData.timestamp;

// Processar com base no tipo de evento
let processedData = {};

if (eventType === 'new_customer') {
  processedData = {
    name: data.name,
    email: data.email,
    source: data.lead_source,
    date: new Date(timestamp).toLocaleDateString(),
    responses: JSON.stringify(data.responses)
  };
}

return [{ json: processedData }];`)}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copiar código
                </Button>
              </div>
              
              <div className="border rounded-md p-4 mt-4">
                <h4 className="font-medium mb-2">4. Conectar com o Supabase (Método Recomendado)</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Use o nó HTTP Request para interagir com o Supabase em vez do nó PostgreSQL direto:
                </p>
                <CodeBlock
                  language="javascript"
                  code={`// Configuração do nó HTTP Request para inserir dados no Supabase
{
  "url": "https://seu-projeto.supabase.co/rest/v1/tabela",
  "method": "POST",
  "authentication": "predefinedCredentialType",
  "credential": "Supabase API",
  "headers": {
    "apikey": "{{$credentials.apiKey}}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
  },
  "body": {
    "column1": "{{$json.field1}}",
    "column2": "{{$json.field2}}",
    "created_at": "{{$now.iso8601}}"
  }
}`}
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => copyToClipboard(`// Configuração do nó HTTP Request para inserir dados no Supabase
{
  "url": "https://seu-projeto.supabase.co/rest/v1/tabela",
  "method": "POST",
  "authentication": "predefinedCredentialType",
  "credential": "Supabase API",
  "headers": {
    "apikey": "{{$credentials.apiKey}}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
  },
  "body": {
    "column1": "{{$json.field1}}",
    "column2": "{{$json.field2}}",
    "created_at": "{{$now.iso8601}}"
  }
}`)}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copiar configuração
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="leads">
            <div className="space-y-4">
              <h3 className="font-medium text-lg mb-2">Workflow para Processamento de Leads</h3>
              <p className="text-sm text-gray-600 mb-4">
                Este workflow demonstra como processar leads do harmonIA e enviá-los para diferentes destinos.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-2">Estrutura do Workflow</h4>
                  <ul className="list-decimal pl-5 space-y-1 text-sm text-gray-600">
                    <li>Webhook: Recebe dados de leads</li>
                    <li>Function: Processa e formata os dados</li>
                    <li>Switch: Roteia com base no tipo de lead</li>
                    <li>HTTP Request: Salva no CRM ou outra ferramenta</li>
                    <li>Send Email: Notifica sobre o novo lead</li>
                    <li>Google Sheets: Adiciona o lead a uma planilha</li>
                  </ul>
                </div>
                
                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-2">Dados de Lead Esperados</h4>
                  <CodeBlock
                    language="json"
                    code={`{
  "type": "new_customer",
  "data": {
    "name": "Nome do Cliente",
    "email": "cliente@exemplo.com",
    "lead_source": "landing_page",
    "lead_medium": "organic",
    "responses": {
      "q1": "business",
      "q2": "pop",
      "q3": "melody"
    }
  },
  "timestamp": "2025-05-21T10:30:00.000Z"
}`}
                  />
                </div>
              </div>
              
              <div className="border rounded-md p-4 mb-4">
                <h4 className="font-medium mb-2">Código de Processamento de Leads</h4>
                <CodeBlock
                  language="javascript"
                  code={`// Código para o nó Function de processamento de leads
const data = $input.item.json;

// Verificar se temos um lead válido
if (data.type !== 'new_customer' || !data.data || !data.data.name || !data.data.email) {
  return [{ 
    json: { 
      error: true, 
      message: 'Dados de lead inválidos ou incompletos' 
    } 
  }];
}

// Extrair informações do lead
const leadInfo = data.data;

// Verificar respostas para classificar o lead
let leadScore = 0;
let leadInterest = 'indefinido';

if (leadInfo.responses) {
  // Analisar tipo de projeto
  if (leadInfo.responses.q1 === 'business') {
    leadScore += 10;
    leadInterest = 'Empresarial';
  } else if (leadInfo.responses.q1 === 'personal_event') {
    leadScore += 5;
    leadInterest = 'Evento Pessoal';
  } else if (leadInfo.responses.q1 === 'gift') {
    leadScore += 3;
    leadInterest = 'Presente';
  }
  
  // Analisar preferência musical
  if (leadInfo.responses.q2) {
    leadInfo.music_style = leadInfo.responses.q2;
  }
}

// Criar objeto formatado para uso nos próximos nós
const processedLead = {
  name: leadInfo.name,
  email: leadInfo.email,
  source: leadInfo.lead_source || 'website',
  medium: leadInfo.lead_medium || 'direct',
  interest: leadInterest,
  score: leadScore,
  music_preference: leadInfo.music_style || 'não informado',
  registration_date: new Date().toISOString(),
  raw_responses: JSON.stringify(leadInfo.responses || {})
};

return [{ json: processedLead }];`}
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => copyToClipboard(`// Código para o nó Function de processamento de leads
const data = $input.item.json;

// Verificar se temos um lead válido
if (data.type !== 'new_customer' || !data.data || !data.data.name || !data.data.email) {
  return [{ 
    json: { 
      error: true, 
      message: 'Dados de lead inválidos ou incompletos' 
    } 
  }];
}

// Extrair informações do lead
const leadInfo = data.data;

// Verificar respostas para classificar o lead
let leadScore = 0;
let leadInterest = 'indefinido';

if (leadInfo.responses) {
  // Analisar tipo de projeto
  if (leadInfo.responses.q1 === 'business') {
    leadScore += 10;
    leadInterest = 'Empresarial';
  } else if (leadInfo.responses.q1 === 'personal_event') {
    leadScore += 5;
    leadInterest = 'Evento Pessoal';
  } else if (leadInfo.responses.q1 === 'gift') {
    leadScore += 3;
    leadInterest = 'Presente';
  }
  
  // Analisar preferência musical
  if (leadInfo.responses.q2) {
    leadInfo.music_style = leadInfo.responses.q2;
  }
}

// Criar objeto formatado para uso nos próximos nós
const processedLead = {
  name: leadInfo.name,
  email: leadInfo.email,
  source: leadInfo.lead_source || 'website',
  medium: leadInfo.lead_medium || 'direct',
  interest: leadInterest,
  score: leadScore,
  music_preference: leadInfo.music_style || 'não informado',
  registration_date: new Date().toISOString(),
  raw_responses: JSON.stringify(leadInfo.responses || {})
};

return [{ json: processedLead }];`)}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copiar código
                </Button>
              </div>
              
              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-2">Enviando E-mail de Confirmação</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Configure o nó "Send Email" com um template HTML para notificar o cliente:
                </p>
                <CodeBlock
                  language="html"
                  code={`<h1>Olá {{$json.name}}!</h1>
<p>Obrigado por entrar em contato com a harmonIA.</p>
<p>Recebemos suas informações e entraremos em contato em breve para discutir seu projeto 
de música personalizada no estilo {{$json.music_preference}}.</p>
<p>Enquanto isso, você pode conferir alguns exemplos do nosso trabalho em nosso portfólio:</p>
<p><a href="https://harmonia.com/portfolio" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Ver Portfolio</a></p>
<p>Atenciosamente,<br>Equipe harmonIA</p>`}
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => copyToClipboard(`<h1>Olá {{$json.name}}!</h1>
<p>Obrigado por entrar em contato com a harmonIA.</p>
<p>Recebemos suas informações e entraremos em contato em breve para discutir seu projeto 
de música personalizada no estilo {{$json.music_preference}}.</p>
<p>Enquanto isso, você pode conferir alguns exemplos do nosso trabalho em nosso portfólio:</p>
<p><a href="https://harmonia.com/portfolio" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Ver Portfolio</a></p>
<p>Atenciosamente,<br>Equipe harmonIA</p>`)}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copiar HTML
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="previews">
            <div className="space-y-4">
              <h3 className="font-medium text-lg mb-2">Workflow para Notificações de Prévias</h3>
              <p className="text-sm text-gray-600 mb-4">
                Este workflow demonstra como processar notificações de prévias e enviar emails aos clientes.
              </p>
              
              <div className="border rounded-md p-4 mb-4">
                <h4 className="font-medium mb-2">Dados de Notificação de Prévia</h4>
                <CodeBlock
                  language="json"
                  code={`{
  "type": "preview_approved",
  "data": {
    "projectId": "123456",
    "clientName": "Nome do Cliente",
    "clientEmail": "cliente@exemplo.com",
    "projectTitle": "Música para Casamento",
    "versionId": "v1"
  },
  "timestamp": "2025-05-21T10:30:00.000Z"
}`}
                />
              </div>
              
              <div className="border rounded-md p-4 mb-4">
                <h4 className="font-medium mb-2">Processamento de Notificação de Prévia</h4>
                <CodeBlock
                  language="javascript"
                  code={`// Código para o nó Function de processamento de notificação de prévia
const data = $input.item.json;
const baseUrl = 'https://harmonia.com';

// Verificar se temos dados válidos
if (!data.type || !data.data || !data.data.projectId) {
  return [{ json: { error: true, message: 'Dados inválidos' } }];
}

// Processar com base no tipo de notificação
let processedData = {};
let emailTemplate = '';

switch(data.type) {
  case 'preview_approved':
    // Cliente aprovou a prévia
    processedData = {
      clientName: data.data.clientName,
      clientEmail: data.data.clientEmail,
      projectId: data.data.projectId,
      projectTitle: data.data.projectTitle || 'Seu projeto musical',
      approvalDate: new Date().toLocaleDateString(),
      subject: 'Sua prévia foi aprovada - Próximos passos',
      nextStep: 'finalização',
      projectLink: \`\${baseUrl}/admin-j28s7d1k/projects/\${data.data.projectId}\`
    };
    break;
    
  case 'feedback_received':
    // Cliente enviou feedback
    processedData = {
      clientName: data.data.clientName,
      projectId: data.data.projectId,
      projectTitle: data.data.projectTitle || 'Projeto musical',
      feedback: data.data.message || 'Sem detalhes',
      feedbackDate: new Date().toLocaleDateString(),
      subject: 'Novo feedback recebido para projeto',
      projectLink: \`\${baseUrl}/admin-j28s7d1k/projects/\${data.data.projectId}\`
    };
    break;
    
  default:
    return [{ json: { error: true, message: 'Tipo de notificação desconhecido' } }];
}

return [{ json: processedData }];`}
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => copyToClipboard(`// Código para o nó Function de processamento de notificação de prévia
const data = $input.item.json;
const baseUrl = 'https://harmonia.com';

// Verificar se temos dados válidos
if (!data.type || !data.data || !data.data.projectId) {
  return [{ json: { error: true, message: 'Dados inválidos' } }];
}

// Processar com base no tipo de notificação
let processedData = {};
let emailTemplate = '';

switch(data.type) {
  case 'preview_approved':
    // Cliente aprovou a prévia
    processedData = {
      clientName: data.data.clientName,
      clientEmail: data.data.clientEmail,
      projectId: data.data.projectId,
      projectTitle: data.data.projectTitle || 'Seu projeto musical',
      approvalDate: new Date().toLocaleDateString(),
      subject: 'Sua prévia foi aprovada - Próximos passos',
      nextStep: 'finalização',
      projectLink: \`\${baseUrl}/admin-j28s7d1k/projects/\${data.data.projectId}\`
    };
    break;
    
  case 'feedback_received':
    // Cliente enviou feedback
    processedData = {
      clientName: data.data.clientName,
      projectId: data.data.projectId,
      projectTitle: data.data.projectTitle || 'Projeto musical',
      feedback: data.data.message || 'Sem detalhes',
      feedbackDate: new Date().toLocaleDateString(),
      subject: 'Novo feedback recebido para projeto',
      projectLink: \`\${baseUrl}/admin-j28s7d1k/projects/\${data.data.projectId}\`
    };
    break;
    
  default:
    return [{ json: { error: true, message: 'Tipo de notificação desconhecido' } }];
}

return [{ json: processedData }];`)}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copiar código
                </Button>
              </div>
              
              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-2">Template de Email para Notificação de Prévia Disponível</h4>
                <CodeBlock
                  language="html"
                  code={`<h1>Olá {{$json.clientName}}!</h1>
<p>Estamos felizes em informar que uma prévia do seu projeto "{{$json.projectTitle}}" está disponível para sua avaliação.</p>
<p>Clique no link abaixo para acessar sua prévia:</p>
<p><a href="https://harmonia.com/preview/{{$json.projectId}}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Ver Prévia</a></p>
<p>Este link estará disponível por 7 dias. Aguardamos seu feedback!</p>
<p>Atenciosamente,<br>Equipe harmonIA</p>`}
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => copyToClipboard(`<h1>Olá {{$json.clientName}}!</h1>
<p>Estamos felizes em informar que uma prévia do seu projeto "{{$json.projectTitle}}" está disponível para sua avaliação.</p>
<p>Clique no link abaixo para acessar sua prévia:</p>
<p><a href="https://harmonia.com/preview/{{$json.projectId}}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Ver Prévia</a></p>
<p>Este link estará disponível por 7 dias. Aguardamos seu feedback!</p>
<p>Atenciosamente,<br>Equipe harmonIA</p>`)}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copiar HTML
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="troubleshooting">
            <div className="space-y-4">
              <h3 className="font-medium text-lg mb-2">Solução de Problemas Comuns</h3>
              
              <div className="border rounded-md p-4 mb-4 bg-red-50 border-red-200">
                <h4 className="font-medium mb-2 text-red-700">Erro: "propertyValues[itemName] is not iterable"</h4>
                <p className="text-sm text-red-700 mb-2">
                  Este erro ocorre quando há incompatibilidade entre os formatos de dados esperados pelos nós do n8n.
                </p>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Soluções:</p>
                  <ol className="list-decimal pl-5 space-y-1 text-sm text-red-700">
                    <li>Use um nó Function para garantir que os dados de saída estão no formato correto</li>
                    <li>Verifique se o objeto JSON está em um formato compatível com o n8n</li>
                    <li>Certifique-se de que os dados de saída estão no formato esperado pelo próximo nó</li>
                    <li>Use o nó Set para definir corretamente o formato dos dados</li>
                  </ol>
                </div>
                <div className="mt-3">
                  <CodeBlock
                    language="javascript"
                    code={`// Código de correção para o problema "is not iterable"
// Adicione este código em um nó Function antes do nó problemático
const inputData = $input.all();
let fixedData = {};

// Garantir que temos um objeto JSON válido
if (Array.isArray(inputData) && inputData.length > 0) {
  // Se for um array, pegue o primeiro item
  fixedData = inputData[0].json || {};
} else if (typeof inputData === 'object') {
  // Se for um objeto, use-o diretamente
  fixedData = inputData.json || inputData;
}

// Certifique-se de que retornamos um objeto em um formato que o n8n espera
return [{ json: fixedData }];`}
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => copyToClipboard(`// Código de correção para o problema "is not iterable"
// Adicione este código em um nó Function antes do nó problemático
const inputData = $input.all();
let fixedData = {};

// Garantir que temos um objeto JSON válido
if (Array.isArray(inputData) && inputData.length > 0) {
  // Se for um array, pegue o primeiro item
  fixedData = inputData[0].json || {};
} else if (typeof inputData === 'object') {
  // Se for um objeto, use-o diretamente
  fixedData = inputData.json || inputData;
}

// Certifique-se de que retornamos um objeto em um formato que o n8n espera
return [{ json: fixedData }];`)}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copiar solução
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md p-4 mb-4">
                <h4 className="font-medium mb-2">Problema: Erro de conexão com o Supabase</h4>
                <p className="text-sm text-gray-600 mb-2">
                  O n8n não consegue conectar diretamente ao banco de dados do Supabase via PostgreSQL.
                </p>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Solução:</p>
                  <ol className="list-decimal pl-5 space-y-1 text-sm text-gray-600">
                    <li>Substitua nós PostgreSQL por nós HTTP Request</li>
                    <li>Configure o HTTP Request para usar a API REST do Supabase</li>
                    <li>Adicione os cabeçalhos de autenticação necessários</li>
                  </ol>
                </div>
                <div className="mt-3">
                  <CodeBlock
                    language="javascript"
                    code={`// Exemplo de configuração para o nó HTTP Request
// Para consultar dados do Supabase (substitui o PostgreSQL)
{
  "url": "https://seu-projeto.supabase.co/rest/v1/tabela?select=*",
  "method": "GET",
  "headers": {
    "apikey": "sua-chave-anon-aqui",
    "Authorization": "Bearer sua-chave-anon-aqui"
  }
}`}
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => copyToClipboard(`// Exemplo de configuração para o nó HTTP Request
// Para consultar dados do Supabase (substitui o PostgreSQL)
{
  "url": "https://seu-projeto.supabase.co/rest/v1/tabela?select=*",
  "method": "GET",
  "headers": {
    "apikey": "sua-chave-anon-aqui",
    "Authorization": "Bearer sua-chave-anon-aqui"
  }
}`)}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copiar configuração
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-2">Problema: Logs de Erro no Webhook</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Para depuração de problemas, adicione um nó "Error Workflow" que enviará detalhes dos erros:
                </p>
                <div className="mt-3">
                  <CodeBlock
                    language="javascript"
                    code={`// Código para logging de erros do workflow
// Adicione este código em um nó Function conectado à saída de erro
const error = $input.all()[0];

const errorDetails = {
  workflow_id: $workflow.id,
  workflow_name: $workflow.name,
  error_message: error.error.message,
  error_timestamp: new Date().toISOString(),
  node_name: error.node.name,
  execution_id: $execution.id
};

// Registrar erro no console
console.log('Erro no workflow:', errorDetails);

// Você pode enviar o erro para um serviço de logging ou webhook
// de notificação para ser alertado sobre problemas
return [{ json: errorDetails }];`}
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => copyToClipboard(`// Código para logging de erros do workflow
// Adicione este código em um nó Function conectado à saída de erro
const error = $input.all()[0];

const errorDetails = {
  workflow_id: $workflow.id,
  workflow_name: $workflow.name,
  error_message: error.error.message,
  error_timestamp: new Date().toISOString(),
  node_name: error.node.name,
  execution_id: $execution.id
};

// Registrar erro no console
console.log('Erro no workflow:', errorDetails);

// Você pode enviar o erro para um serviço de logging ou webhook
// de notificação para ser alertado sobre problemas
return [{ json: errorDetails }];`)}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copiar código de log
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-200">
          <div className="flex">
            <Info className="h-5 w-5 mr-2 text-blue-700 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-medium text-blue-800 mb-2">Recursos Adicionais</h3>
              <ul className="list-disc pl-6 space-y-1 text-sm text-blue-700">
                <li>
                  <a href="https://docs.n8n.io/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">
                    Documentação Oficial do n8n
                  </a>
                </li>
                <li>
                  <a href="https://docs.n8n.io/courses/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">
                    Cursos e Tutoriais do n8n
                  </a>
                </li>
                <li>
                  <a href="https://supabase.com/docs/guides/api" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">
                    Documentação da API REST do Supabase
                  </a>
                </li>
                <li>
                  <a href="https://n8n.io/blog/category/tutorials/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">
                    Tutoriais de Integração do n8n
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default N8nIntegrationGuide;
